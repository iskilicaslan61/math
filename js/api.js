/* Veri katmanı: sunucu varsa öğrenci hesabı + veri tabanı, yoksa bu cihazda (localStorage) kayıt */
(function () {
  'use strict';
  var API = (window.APP_API || '').replace(/\/$/, '');
  var D = window.DB = { server: false, user: null, ready: null };

  function ls(k, d) { try { var v = localStorage.getItem('m6:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem('m6:' + k); if (v === null) sessionStorage.removeItem('m6:' + k); else sessionStorage.setItem('m6:' + k, v); } catch (e) { return null; } }
  function lset(k, v) { try { if (v === null) localStorage.removeItem('m6:' + k); else localStorage.setItem('m6:' + k, JSON.stringify(v)); } catch (e) { } }
  function req(method, path, body, tok) {
    var h = { 'Content-Type': 'application/json' }; if (tok) h.Authorization = 'Bearer ' + tok;
    return fetch(API + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d }; }); });
  }
  D.init = function () {
    D.ready = req('GET', '/api/ping').then(function (r) { D.server = !!(r.ok && r.data && r.data.ok); }).catch(function () { D.server = false; }).then(function () {
      var tok = ls('tok', null); if (!D.server || !tok) return;
      return req('GET', '/api/me', null, tok).then(function (r) { if (r.ok) { D.user = r.data.student; D.cache = r.data; } else lset('tok', null); }).catch(function () { });
    });
    return D.ready;
  };
  D.login = function (code) { return req('POST', '/api/login', { code: code }).then(function (r) { if (!r.ok) throw new Error(r.data.error || 'Giriş başarısız'); lset('tok', r.data.token); return req('GET', '/api/me', null, r.data.token).then(function (m) { D.user = m.data.student; D.cache = m.data; return D.user; }); }); };
  D.logout = function () { lset('tok', null); D.user = null; D.cache = null; };
  // Öğrenci verisi: { results, mistakes:[{key,n,solved}], assignments }
  D.data = function () {
    if (D.user) return req('GET', '/api/me', null, ls('tok', null)).then(function (r) { if (r.status === 401) { D.logout(); return D.data(); } D.cache = r.data; return { results: r.data.results || [], mistakes: r.data.mistakes || [], assignments: r.data.assignments || [], local: false }; });
    var ms = ls('mistakes', {}); return Promise.resolve({ results: ls('results', []), mistakes: Object.keys(ms).map(function (k) { return { key: k, n: ms[k].n, solved: !!ms[k].solved, t: ms[k].t }; }), assignments: [], local: true });
  };
  // res: {kind, ref, score, total, dur, w, c, wrong:[keys], right:[keys]}
  D.record = function (res) {
    if (D.user) return req('POST', '/api/result', res, ls('tok', null)).then(function (r) { return r.ok; }).catch(function () { return false; });
    var rs = ls('results', []); rs.unshift({ kind: res.kind, ref: res.ref, score: res.score, total: res.total, dur: res.dur, w: res.w, c: res.c, t: Date.now() }); lset('results', rs.slice(0, 300));
    var ms = ls('mistakes', {}); (res.wrong || []).forEach(function (k) { var m = ms[k] || { n: 0 }; m.n++; m.solved = false; m.t = Date.now(); ms[k] = m; });
    (res.right || []).forEach(function (k) { if (ms[k]) { ms[k].solved = true; ms[k].t = Date.now(); } }); lset('mistakes', ms);
    return Promise.resolve(true);
  };
  // ---- öğretmen ----
  D.tTok = function () { return ss('ttok'); };
  D.tLogin = function (pw) { return req('POST', '/api/t/login', { password: pw }).then(function (r) { if (!r.ok) throw new Error(r.data.error || 'Giriş başarısız'); ss('ttok', r.data.token); }); };
  D.tLogout = function () { ss('ttok', null); };
  D.t = function (method, path, body) { return req(method, '/api/t' + path, body, ss('ttok')).then(function (r) { if (r.status === 401) { ss('ttok', null); throw new Error('Oturum süresi doldu'); } if (!r.ok) throw new Error(r.data.error || 'Hata'); return r.data; }); };
  D.init();
})();
