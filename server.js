#!/usr/bin/env node
/* Matematik sitesi sunucusu: statik dosyalar + öğrenci/öğretmen API'si (SQLite).
   Çalıştırma: node server.js   (Node 22+)   Ortam: PORT, TEACHER_PASSWORD, DATA_DIR */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = +process.env.PORT || 8080;
const ROOT = __dirname;
const DATA = process.env.DATA_DIR || path.join(ROOT, 'data');
fs.mkdirSync(DATA, { recursive: true });
const db = new DatabaseSync(path.join(DATA, 'app.db'));
db.exec(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, grade INTEGER NOT NULL, code TEXT NOT NULL UNIQUE, created INTEGER NOT NULL, last_seen INTEGER);
CREATE TABLE IF NOT EXISTS assignments (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE, kind TEXT NOT NULL, ref TEXT NOT NULL, title TEXT NOT NULL, due TEXT, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE, kind TEXT NOT NULL, ref TEXT NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL, dur INTEGER NOT NULL DEFAULT 0, w TEXT NOT NULL DEFAULT '', c TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS mistakes (student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE, key TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 1, solved INTEGER NOT NULL DEFAULT 0, updated INTEGER NOT NULL, PRIMARY KEY (student_id, key));
CREATE INDEX IF NOT EXISTS ix_res ON results(student_id, created);
`);
db.exec('PRAGMA foreign_keys = ON');
const q = (sql) => db.prepare(sql);
const getSet = (k) => { const r = q('SELECT v FROM settings WHERE k=?').get(k); return r && r.v; };
const putSet = (k, v) => q('INSERT INTO settings(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').run(k, v);

// ---- gizli anahtar ve öğretmen şifresi ----
let SECRET = getSet('secret'); if (!SECRET) { SECRET = crypto.randomBytes(32).toString('hex'); putSet('secret', SECRET); }
function hashPw(pw, salt) { return crypto.scryptSync(pw, salt, 32).toString('hex'); }
(function initTeacher() {
  const env = process.env.TEACHER_PASSWORD;
  if (env) { const salt = crypto.randomBytes(16).toString('hex'); putSet('teacher', salt + ':' + hashPw(env, salt)); return; }
  if (!getSet('teacher')) {
    const pw = crypto.randomBytes(5).toString('hex'), salt = crypto.randomBytes(16).toString('hex');
    putSet('teacher', salt + ':' + hashPw(pw, salt));
    console.log('\n=== ÖĞRETMEN ŞİFRESİ (yalnızca bir kez gösterilir): ' + pw + ' ===\n(Değiştirmek için TEACHER_PASSWORD ortam değişkeni ile başlatın.)\n');
  }
})();
function checkTeacherPw(pw) { const v = getSet('teacher'); if (!v) return false; const [salt, h] = v.split(':'); const a = Buffer.from(hashPw(String(pw), salt), 'hex'), b = Buffer.from(h, 'hex'); return a.length === b.length && crypto.timingSafeEqual(a, b); }

// ---- belirteç (HMAC imzalı) ----
function sign(role, id, ttl) { const exp = Date.now() + ttl, body = role + '.' + id + '.' + exp; return body + '.' + crypto.createHmac('sha256', SECRET).update(body).digest('hex'); }
function verify(tok) {
  if (typeof tok !== 'string') return null; const p = tok.split('.'); if (p.length !== 4) return null;
  const body = p.slice(0, 3).join('.'), mac = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
  const a = Buffer.from(p[3]), b = Buffer.from(mac); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (+p[2] < Date.now()) return null; return { role: p[0], id: +p[1] };
}

// ---- yardımcılar ----
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // karışan harfler (I, O, 0, 1) yok
function newCode() { for (;;) { let c = ''; const b = crypto.randomBytes(6); for (let i = 0; i < 6; i++) c += ALPHA[b[i] % ALPHA.length]; if (!q('SELECT 1 FROM students WHERE code=?').get(c)) return c; } }
const fails = new Map(); // ip -> [zaman damgaları]
function tooMany(ip, max) { const now = Date.now(), a = (fails.get(ip) || []).filter(t => now - t < 60000); fails.set(ip, a); return a.length >= max; }
function fail(ip) { const a = fails.get(ip) || []; a.push(Date.now()); fails.set(ip, a); }
const KINDS = ['test', 'pekistirme', 'sinav', 'tsinav', 'hata', 'oyun'];
const int = (v, lo, hi) => { v = +v; return Number.isInteger(v) && v >= lo && v <= hi ? v : null; };
const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const REFRE = /^[A-Za-z0-9:|._-]{1,24}$/;
function validKey(k) { return typeof k === 'string' && /^[tpexgmh]\|\d{1,3}\|\d{1,2}\|\d{1,3}$/.test(k); }

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS' });
  res.end(body);
}
function readBody(req) { return new Promise((ok, no) => { let n = 0; const ch = []; req.on('data', c => { n += c.length; if (n > 200000) { no(new Error('big')); req.destroy(); } else ch.push(c); }); req.on('end', () => { try { ok(ch.length ? JSON.parse(Buffer.concat(ch).toString()) : {}); } catch (e) { no(e); } }); }); }

function studentRow(s) { return { id: s.id, name: s.name, grade: s.grade }; }
function resultsFor(id, lim) { return q('SELECT id,kind,ref,score,total,dur,w,c,created FROM results WHERE student_id=? ORDER BY created DESC LIMIT ?').all(id, lim || 400).map(r => ({ id: r.id, kind: r.kind, ref: r.ref, score: r.score, total: r.total, dur: r.dur, w: r.w ? r.w.split(',').map(Number) : [], c: r.c, t: r.created })); }
function mistakesFor(id) { return q('SELECT key,n,solved,updated FROM mistakes WHERE student_id=?').all(id).map(m => ({ key: m.key, n: m.n, solved: !!m.solved, t: m.updated })); }
function assignmentsFor(id) {
  return q('SELECT id,kind,ref,title,due,created FROM assignments WHERE student_id=? ORDER BY created DESC').all(id).map(a => {
    const r = q('SELECT score,total,created FROM results WHERE student_id=? AND kind=? AND ref=? AND created>=? ORDER BY created DESC LIMIT 1').get(id, a.kind, a.ref, a.created);
    return { id: a.id, kind: a.kind, ref: a.ref, title: a.title, due: a.due, t: a.created, done: !!r, score: r ? r.score : null, total: r ? r.total : null };
  });
}

// ---- API ----
async function api(req, res, url) {
  const ip = req.socket.remoteAddress || '?', p = url.pathname, m = req.method;
  if (m === 'OPTIONS') return send(res, 204, {});
  if (p === '/api/ping') return send(res, 200, { ok: true, v: 1 });
  let body = {}; if (m === 'POST') { try { body = await readBody(req); } catch (e) { return send(res, 400, { error: 'Geçersiz istek' }); } }
  const auth = verify((req.headers.authorization || '').replace(/^Bearer /, ''));

  if (p === '/api/login' && m === 'POST') {
    if (tooMany(ip, 8)) return send(res, 429, { error: 'Çok fazla deneme. Bir dakika bekleyin.' });
    const code = clean(body.code, 12).toUpperCase().replace(/[^A-Z0-9]/g, ''), s = q('SELECT * FROM students WHERE code=?').get(code);
    if (!s) { fail(ip); return send(res, 401, { error: 'Erişim kodu bulunamadı.' }); }
    q('UPDATE students SET last_seen=? WHERE id=?').run(Date.now(), s.id);
    return send(res, 200, { token: sign('s', s.id, 30 * 864e5), student: studentRow(s) });
  }
  if (p === '/api/t/login' && m === 'POST') {
    if (tooMany(ip, 5)) return send(res, 429, { error: 'Çok fazla deneme. Bir dakika bekleyin.' });
    if (!checkTeacherPw(body.password)) { fail(ip); return send(res, 401, { error: 'Şifre yanlış.' }); }
    return send(res, 200, { token: sign('t', 0, 12 * 36e5) });
  }

  // ---- öğrenci ----
  if (p.startsWith('/api/') && !p.startsWith('/api/t/')) {
    if (!auth || auth.role !== 's') return send(res, 401, { error: 'Giriş gerekli' });
    const s = q('SELECT * FROM students WHERE id=?').get(auth.id); if (!s) return send(res, 401, { error: 'Öğrenci bulunamadı' });
    if (p === '/api/me' && m === 'GET') { q('UPDATE students SET last_seen=? WHERE id=?').run(Date.now(), s.id); return send(res, 200, { student: studentRow(s), assignments: assignmentsFor(s.id), mistakes: mistakesFor(s.id), results: resultsFor(s.id) }); }
    if (p === '/api/result' && m === 'POST') {
      const kind = KINDS.includes(body.kind) ? body.kind : null, ref = REFRE.test(String(body.ref)) ? String(body.ref) : null, total = int(body.total, 1, 100), score = int(body.score, 0, 100), dur = int(body.dur, 0, 86400) || 0;
      if (!kind || !ref || total === null || score === null || score > total) return send(res, 400, { error: 'Geçersiz sonuç' });
      const w = Array.isArray(body.w) ? body.w.slice(0, 100).map(x => int(x, 0, 999)).filter(x => x !== null) : [], c = typeof body.c === 'string' && /^[01-]{0,100}$/.test(body.c) ? body.c : '';
      const now = Date.now();
      q('INSERT INTO results(student_id,kind,ref,score,total,dur,w,c,created) VALUES(?,?,?,?,?,?,?,?,?)').run(s.id, kind, ref, score, total, dur, w.join(','), c, now);
      const wrong = Array.isArray(body.wrong) ? body.wrong.slice(0, 100).filter(validKey) : [];
      const up = q('INSERT INTO mistakes(student_id,key,n,solved,updated) VALUES(?,?,1,0,?) ON CONFLICT(student_id,key) DO UPDATE SET n=n+1, solved=0, updated=excluded.updated');
      wrong.forEach(k => up.run(s.id, k, now));
      const ok = Array.isArray(body.right) ? body.right.slice(0, 100).filter(validKey) : [];
      const sv = q('UPDATE mistakes SET solved=1, updated=? WHERE student_id=? AND key=?'); ok.forEach(k => sv.run(now, s.id, k));
      return send(res, 200, { ok: true });
    }
    return send(res, 404, { error: 'Bulunamadı' });
  }

  // ---- öğretmen ----
  if (!auth || auth.role !== 't') return send(res, 401, { error: 'Öğretmen girişi gerekli' });
  if (p === '/api/t/students' && m === 'GET') {
    const rows = q('SELECT s.*, (SELECT COUNT(*) FROM results r WHERE r.student_id=s.id) AS nres, (SELECT COALESCE(ROUND(AVG(100.0*score/total)),0) FROM results r WHERE r.student_id=s.id) AS avg, (SELECT COUNT(*) FROM mistakes x WHERE x.student_id=s.id AND x.solved=0) AS nmis FROM students s ORDER BY s.grade, s.name').all();
    return send(res, 200, { students: rows.map(r => ({ id: r.id, name: r.name, grade: r.grade, code: r.code, last: r.last_seen, results: r.nres, avg: r.avg, mistakes: r.nmis })) });
  }
  if (p === '/api/t/students' && m === 'POST') {
    const name = clean(body.name, 40), grade = int(body.grade, 6, 7); if (!name || !grade) return send(res, 400, { error: 'Ad ve sınıf (6 veya 7) gerekli' });
    const code = newCode(); const r = q('INSERT INTO students(name,grade,code,created) VALUES(?,?,?,?)').run(name, grade, code, Date.now());
    return send(res, 200, { id: Number(r.lastInsertRowid), name, grade, code });
  }
  let mm;
  if ((mm = p.match(/^\/api\/t\/students\/(\d+)\/code$/)) && m === 'POST') { const code = newCode(); q('UPDATE students SET code=? WHERE id=?').run(code, +mm[1]); return send(res, 200, { code }); }
  if ((mm = p.match(/^\/api\/t\/students\/(\d+)$/)) && m === 'DELETE') { q('DELETE FROM students WHERE id=?').run(+mm[1]); return send(res, 200, { ok: true }); }
  if ((mm = p.match(/^\/api\/t\/student\/(\d+)$/)) && m === 'GET') {
    const s = q('SELECT * FROM students WHERE id=?').get(+mm[1]); if (!s) return send(res, 404, { error: 'Yok' });
    return send(res, 200, { student: { id: s.id, name: s.name, grade: s.grade, code: s.code, last: s.last_seen }, results: resultsFor(s.id, 1000), mistakes: mistakesFor(s.id), assignments: assignmentsFor(s.id) });
  }
  if (p === '/api/t/assign' && m === 'POST') {
    const kind = KINDS.includes(body.kind) ? body.kind : null, ref = REFRE.test(String(body.ref)) ? String(body.ref) : null, title = clean(body.title, 80);
    if (!kind || !ref || !title) return send(res, 400, { error: 'Geçersiz ödev' });
    let ids = Array.isArray(body.student_ids) ? body.student_ids.map(x => int(x, 1, 1e9)).filter(Boolean) : [];
    if (body.grade) { const g = int(body.grade, 6, 7); if (g) ids = ids.concat(q('SELECT id FROM students WHERE grade=?').all(g).map(r => r.id)); }
    ids = [...new Set(ids)]; if (!ids.length) return send(res, 400, { error: 'Öğrenci seçilmedi' });
    const due = clean(body.due, 10) || null, ins = q('INSERT INTO assignments(student_id,kind,ref,title,due,created) VALUES(?,?,?,?,?,?)'), now = Date.now();
    ids.forEach(id => { if (q('SELECT 1 FROM students WHERE id=?').get(id)) ins.run(id, kind, ref, title, due, now); });
    return send(res, 200, { ok: true, count: ids.length });
  }
  if ((mm = p.match(/^\/api\/t\/assignments\/(\d+)$/)) && m === 'DELETE') { q('DELETE FROM assignments WHERE id=?').run(+mm[1]); return send(res, 200, { ok: true }); }
  return send(res, 404, { error: 'Bulunamadı' });
}

// ---- statik dosyalar ----
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };
const ALLOWED = /^\/(index\.html|css\/[\w.-]+\.css|js\/[\w.-]+\.js|config\.js)?$/;
function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname); if (p === '/') p = '/index.html';
  if (!ALLOWED.test(p)) { res.writeHead(404); return res.end('Bulunamadı'); }
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('Bulunamadı'); } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' }); res.end(d); });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) api(req, res, url).catch(e => { console.error(e); send(res, 500, { error: 'Sunucu hatası' }); });
  else serveStatic(req, res, url);
});
server.listen(PORT, () => console.log('Matematik sitesi çalışıyor: http://localhost:' + PORT + '  (veri: ' + DATA + ')'));
