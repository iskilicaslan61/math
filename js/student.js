/* Öğrenci girişi, ödevler, rapor, hata defteri, çalışma kâğıdı ve öğretmen paneli */
(function () {
  'use strict';
  var X = window.APPX, DB = window.DB, esc = X.esc, LET = X.LET;
  var KIND = { test: 'Hafta testi', pekistirme: 'Pekiştirme testi', sinav: 'Hafta sınavı', tsinav: 'Ünite sınavı', hata: 'Hata defteri', oyun: 'Oyun' };
  function $(id) { return document.getElementById(id); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }
  function dt(t) { if (!t) return '—'; var d = new Date(t); return d.toLocaleDateString('tr-TR') + ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); }
  function weekLabel(no) { var w = X.weekOf(+no); return w ? X.gr(w) + '. sınıf • Hafta ' + X.wn(w) + ' • ' + w.title : 'Hafta ' + no; }
  function temaLabel(id) { var t = X.temaOf(+id); return t ? X.gr(t) + '. sınıf • ' + X.tn(t) + '. ' + t.title : 'Tema ' + id; }
  function refLabel(kind, ref) {
    var p = String(ref).split(':');
    if (kind === 'test') return weekLabel(p[0]) + ' • Test ' + p[1];
    if (kind === 'pekistirme') return temaLabel(p[0]) + ' • Pekiştirme ' + p[1];
    if (kind === 'sinav') return weekLabel(p[0]) + ' • Sınav';
    if (kind === 'tsinav') return temaLabel(p[0]) + ' • Ünite sınavı';
    if (kind === 'hata') return 'Hata defterimdeki sorular';
    if (kind === 'oyun') return weekLabel(p[0]) + ' • Oyun';
    return ref;
  }
  function hrefFor(kind, ref) {
    var p = String(ref).split(':');
    if (kind === 'test') return '#/hafta/' + p[0] + '/test/' + p[1];
    if (kind === 'pekistirme') return '#/tema/' + p[0] + '/pekistirme/' + p[1];
    if (kind === 'sinav') return '#/hafta/' + p[0] + '/sinav';
    if (kind === 'tsinav') return '#/tema/' + p[0] + '/sinav';
    if (kind === 'hata') return '#/hata/coz';
    return '#/';
  }
  function go(h) { location.hash = h; }
  function fmtDur(s) { return s >= 60 ? Math.floor(s / 60) + ' dk ' + (s % 60) + ' sn' : s + ' sn'; }

  // ---------- analiz ----------
  function analyze(results) {
    var perWeek = {}, tests = results.filter(function (r) { return r.kind !== 'oyun'; }), tot = 0, cor = 0, dur = 0, bestPct = 0;
    results.forEach(function (r) {
      dur += r.dur || 0;
      var ws = r.w || [], cs = r.c || '';
      for (var i = 0; i < ws.length; i++) { var wk = ws[i]; if (!wk || !cs[i]) continue; var o = perWeek[wk] || (perWeek[wk] = { n: 0, c: 0 }); o.n++; if (cs[i] === '1') o.c++; }
    });
    tests.forEach(function (r) { tot += r.total; cor += r.score; bestPct = Math.max(bestPct, pct(r.score, r.total)); });
    var recent = tests.slice(0, 5), prev = tests.slice(5, 10);
    function avg(a) { var s = 0, t = 0; a.forEach(function (r) { s += r.score; t += r.total; }); return t ? pct(s, t) : null; }
    var perTema = {};
    Object.keys(perWeek).forEach(function (wk) { var w = X.weekOf(+wk); if (!w) return; var o = perTema[w.tema] || (perTema[w.tema] = { n: 0, c: 0 }); o.n += perWeek[wk].n; o.c += perWeek[wk].c; });
    var weak = [], strong = [];
    Object.keys(perWeek).forEach(function (wk) { var o = perWeek[wk]; if (o.n < 4) return; var r = pct(o.c, o.n); if (r < 60) weak.push({ wk: +wk, r: r, n: o.n }); else if (r >= 85) strong.push({ wk: +wk, r: r, n: o.n }); });
    weak.sort(function (a, b) { return a.r - b.r; }); strong.sort(function (a, b) { return b.r - a.r; });
    return { count: tests.length, games: results.length - tests.length, avg: tot ? pct(cor, tot) : null, best: bestPct, recent: avg(recent), prev: avg(prev), dur: dur, perWeek: perWeek, perTema: perTema, weak: weak, strong: strong };
  }
  function comment(a, mis, name) {
    if (!a.count) return name + ' henüz test çözmedi. İlk adım: bir hafta seçip konu anlatımını okumak ve testi çözmek.';
    var s = '<b>' + esc(name) + '</b> toplam ' + a.count + ' test/sınav çözdü; genel başarı <b>%' + a.avg + '</b>';
    s += a.avg >= 85 ? ' (çok iyi).' : a.avg >= 70 ? ' (iyi).' : a.avg >= 50 ? ' (orta; biraz daha tekrar gerekli).' : ' (konuları tekrar etmesi gerekiyor).';
    if (a.recent !== null && a.prev !== null) s += a.recent > a.prev + 2 ? ' Son testlerde <b>yükselişte</b> (%' + a.prev + ' → %' + a.recent + ').' : a.recent < a.prev - 2 ? ' Son testlerde <b>düşüş</b> var (%' + a.prev + ' → %' + a.recent + '); dikkat edilmeli.' : ' Başarısı <b>istikrarlı</b>.';
    if (a.strong.length) s += ' Güçlü olduğu konular: ' + a.strong.slice(0, 3).map(function (x) { return esc(weekLabel(x.wk)); }).join('; ') + '.';
    if (a.weak.length) s += ' Desteklenmesi gereken konular: ' + a.weak.slice(0, 3).map(function (x) { return esc(weekLabel(x.wk)) + ' (%' + x.r + ')'; }).join('; ') + '. Bu konular için konu anlatımını tekrar etmesi ve hata defterindeki soruları çözmesi önerilir.';
    var open = mis.filter(function (m) { return !m.solved; }).length;
    if (open) s += ' Hata defterinde çözülmeyi bekleyen <b>' + open + '</b> soru var.';
    return s;
  }
  function reportHtml(data, name, opt) {
    opt = opt || {}; var a = analyze(data.results), mis = data.mistakes, html = '';
    html += '<div class="rep-head"><h2>📋 Değerlendirme Raporu</h2><div><b>' + esc(name) + '</b>' + (opt.grade ? ' • ' + opt.grade + '. sınıf' : '') + ' • ' + new Date().toLocaleDateString('tr-TR') + '</div></div>';
    html += '<div class="vcards rep-cards"><div class="vcard" style="--k:#4c4fef"><b>' + a.count + '</b><span>çözülen test/sınav</span></div><div class="vcard" style="--k:#14a44d"><b>' + (a.avg === null ? '—' : '%' + a.avg) + '</b><span>genel başarı</span></div><div class="vcard" style="--k:#f59f00"><b>%' + a.best + '</b><span>en yüksek sonuç</span></div><div class="vcard" style="--k:#e84393"><b>' + mis.filter(function (m) { return !m.solved; }).length + '</b><span>açık hata defteri sorusu</span></div></div>';
    html += '<div class="box def rep-comment"><b>Değerlendirme:</b> ' + comment(a, mis, name) + '</div>';
    html += '<h3>Ünite başarısı</h3><div class="rep-units">';
    var temas = TEMAS.filter(function (t) { return !opt.grade || X.gr(t) === +opt.grade; });
    if (!opt.grade) temas = TEMAS.slice();
    temas.forEach(function (t) { var o = a.perTema[t.id]; var p = o ? pct(o.c, o.n) : 0; html += '<div class="rep-unit"><div class="rep-ut">' + X.gr(t) + '. sınıf • ' + X.tn(t) + '. ' + esc(t.title) + '</div><div class="rep-bar"><i style="width:' + p + '%;background:' + (p >= 85 ? '#14a44d' : p >= 60 ? '#f59f00' : '#d63031') + '"></i></div><div class="rep-n">' + (o ? '%' + p + ' (' + o.n + ' soru)' : 'henüz çözülmedi') + '</div></div>'; });
    html += '</div>';
    if (a.weak.length || a.strong.length) {
      html += '<div class="twocol"><div><h3>💪 Güçlü konular</h3>' + (a.strong.length ? '<ul>' + a.strong.map(function (x) { return '<li>' + esc(weekLabel(x.wk)) + ' <b>%' + x.r + '</b></li>'; }).join('') + '</ul>' : '<p class="note">Henüz yok.</p>') + '</div><div><h3>🎯 Çalışılacak konular</h3>' + (a.weak.length ? '<ul>' + a.weak.map(function (x) { return '<li>' + (opt.links ? '<a href="#/hafta/' + x.wk + '">' + esc(weekLabel(x.wk)) + '</a>' : esc(weekLabel(x.wk))) + ' <b>%' + x.r + '</b></li>'; }).join('') + '</ul>' : '<p class="note">Harika, zayıf konu yok.</p>') + '</div></div>';
    }
    html += '<h3>Son sonuçlar</h3>';
    if (!data.results.length) html += '<p class="note">Henüz sonuç yok.</p>';
    else html += '<div class="tblwrap"><table class="tbl"><thead><tr><th>Tarih</th><th>Tür</th><th>Konu</th><th>Sonuç</th><th>Süre</th></tr></thead><tbody>' + data.results.slice(0, 15).map(function (r) { return '<tr><td>' + dt(r.t) + '</td><td>' + (KIND[r.kind] || r.kind) + '</td><td>' + esc(refLabel(r.kind, r.ref)) + '</td><td><b>' + r.score + '/' + r.total + '</b> (%' + pct(r.score, r.total) + ')</td><td>' + (r.dur ? fmtDur(r.dur) : '—') + '</td></tr>'; }).join('') + '</tbody></table></div>';
    return html;
  }
  function getData() { return DB.ready.then(function () { return DB.data(); }); }

  // ---------- gezinti çubuğu ve ana sayfa bandı ----------
  function nav() {
    var n = $('navx'); if (!n) return;
    var h = '';
    if (DB.user) h += '<a href="#/ogrenci">👤 ' + esc(DB.user.name) + '</a><a href="#/rapor">Raporum</a><a href="#/hata">Hata Defterim</a><a href="#" id="lgo">Çıkış</a>';
    else h += '<a href="#/rapor">Raporum</a><a href="#/hata">Hata Defterim</a>' + (DB.server ? '<a href="#/giris">Öğrenci Girişi</a><a href="#/ogretmen">Öğretmen</a>' : '');
    n.innerHTML = h;
    var l = $('lgo'); if (l) l.onclick = function (e) { e.preventDefault(); DB.logout(); nav(); go('#/'); };
  }
  X.after = function (p) {
    DB.ready.then(function () {
      nav();
      var b = $('homebanner'); if (!b) return;
      if (DB.user) DB.data().then(function (d) { var pend = d.assignments.filter(function (a) { return !a.done; }); b.innerHTML = '<div class="banner"><b>👋 Merhaba ' + esc(DB.user.name) + '!</b> ' + (pend.length ? 'Yapman gereken <b>' + pend.length + '</b> ödevin var. ' : 'Bekleyen ödevin yok. ') + '<a class="btn sm" href="#/ogrenci">Panelime git</a></div>'; });
      else if (DB.server) b.innerHTML = '<div class="banner">Öğretmeninden erişim kodu aldıysan <a class="btn sm" href="#/giris">Öğrenci girişi yap</a></div>';
    });
  };
  DB.ready.then(nav);

  // ---------- giriş ----------
  X.routes.giris = function () {
    return { html: '<h1>🔑 Öğrenci Girişi</h1><div class="card"><div class="sec-pad">' + (DB.server ? '<p>Öğretmeninin verdiği <b>erişim kodunu</b> yaz.</p><div class="login"><input id="code" maxlength="8" placeholder="KOD" autocomplete="off" autocapitalize="characters"><button class="btn" id="go">Giriş yap</button></div><p id="err" class="note" style="color:var(--bad)"></p>' : '<p>Bu sitede öğrenci girişi kapalı (sunucu bağlı değil). Sonuçların <b>bu cihazda</b> saklanır; raporunu yine görebilirsin.</p><p><a class="btn" href="#/rapor">Raporum</a></p>') + '</div></div>', after: function () {
      if (!DB.server) return; var inp = $('code'); function submit() { $('err').textContent = ''; DB.login(inp.value).then(function () { nav(); go('#/ogrenci'); }).catch(function (e) { $('err').textContent = e.message; }); }
      $('go').onclick = submit; inp.onkeydown = function (e) { if (e.key === 'Enter') submit(); }; inp.focus();
    } };
  };
  // ---------- öğrenci paneli ----------
  X.routes.ogrenci = function () {
    return { html: '<h1>👤 Panelim</h1><div id="dash">Yükleniyor…</div>', after: function () {
      getData().then(function (d) {
        if (!DB.user) { $('dash').innerHTML = '<p>Giriş yapılmamış. <a class="btn" href="#/giris">Öğrenci girişi</a></p>'; return; }
        var pend = d.assignments.filter(function (a) { return !a.done; }), done = d.assignments.filter(function (a) { return a.done; });
        var html = '<p class="lead">Merhaba <b>' + esc(DB.user.name) + '</b> (' + DB.user.grade + '. sınıf). Öğretmenin sana ödev verdiyse aşağıda görürsün.</p>';
        html += '<h2>📌 Bekleyen ödevlerim (' + pend.length + ')</h2>' + (pend.length ? '<div class="assign">' + pend.map(function (a) { return '<a class="asg" href="' + hrefFor(a.kind, a.ref) + '"><b>' + esc(a.title) + '</b><span>' + (KIND[a.kind] || '') + (a.due ? ' • son gün ' + esc(a.due) : '') + '</span><em>Başla →</em></a>'; }).join('') + '</div>' : '<p class="note">Bekleyen ödev yok. 🎉</p>');
        html += '<h2>✅ Tamamlananlar (' + done.length + ')</h2>' + (done.length ? '<div class="assign">' + done.slice(0, 8).map(function (a) { return '<div class="asg ok"><b>' + esc(a.title) + '</b><span>Sonuç: ' + a.score + '/' + a.total + ' (%' + pct(a.score, a.total) + ')</span></div>'; }).join('') + '</div>' : '<p class="note">Henüz yok.</p>');
        html += '<p><a class="btn" href="#/rapor">📋 Raporum</a> <a class="btn alt" href="#/hata">📓 Hata Defterim</a> <a class="btn alt" href="#/">Konulara git</a></p>';
        $('dash').innerHTML = html;
      });
    } };
  };
  // ---------- rapor ----------
  X.routes.rapor = function () {
    return { html: '<div class="no-print tools"><button class="btn" id="prr">🖨️ Yazdır / PDF</button></div><article class="paper report" id="rep">Yükleniyor…</article>', after: function () {
      $('prr').onclick = function () { window.print(); };
      getData().then(function (d) { var nm = DB.user ? DB.user.name : 'Öğrenci (bu cihaz)'; $('rep').innerHTML = reportHtml(d, nm, { grade: DB.user ? DB.user.grade : null, links: true }) + (d.local ? '<p class="note">Bu rapor yalnızca bu cihazdaki kayıtlardan hazırlandı.</p>' : ''); });
    } };
  };
  // ---------- hata defteri ----------
  X.routes.hata = function (p) {
    if (p[1] === 'coz') return hataQuiz();
    return { html: '<h1>📓 Hata Defterim</h1><p class="lead">Yanlış yaptığın veya boş bıraktığın sorular burada toplanır. Doğru çözünce defterden çıkar.</p><div id="hd">Yükleniyor…</div>', after: function () {
      getData().then(function (d) {
        var open = d.mistakes.filter(function (m) { return !m.solved; }), solved = d.mistakes.length - open.length, items = [];
        open.forEach(function (m) { var q = X.qFromKey(m.key); if (q) items.push({ m: m, q: q, w: q.week }); });
        var html = '<div class="vcards"><div class="vcard" style="--k:#d63031"><b>' + items.length + '</b><span>çözülmeyi bekliyor</span></div><div class="vcard" style="--k:#14a44d"><b>' + solved + '</b><span>çözüldü</span></div></div>';
        if (!items.length) { $('hd').innerHTML = html + '<p class="note">Hata defterin boş. Testleri çözdükçe yanlışların burada görünür.</p>'; return; }
        html += '<p><a class="btn" href="#/hata/coz">▶ Hata defterinden test çöz (' + Math.min(20, items.length) + ' soru)</a></p>';
        var byW = {}; items.forEach(function (it) { (byW[it.w] = byW[it.w] || []).push(it); });
        Object.keys(byW).forEach(function (wk) { html += '<h3>' + esc(weekLabel(wk)) + ' (' + byW[wk].length + ')</h3>' + byW[wk].map(function (it) { return '<details class="fold"><summary>' + it.q.q.replace(/<[^>]+>/g, ' ').slice(0, 110) + '…  <small class="note">(' + it.m.n + ' kez yanlış)</small></summary><div class="foldbody">' + it.q.q + (it.q.fig || '') + '<p><b>Doğru cevap:</b> ' + LET[it.q.ans] + ') ' + it.q.opts[it.q.ans] + '</p><p class="note">' + (it.q.exp || '') + '</p></div></details>'; }).join(''); });
        $('hd').innerHTML = html;
      });
    } };
  };
  function hataQuiz() {
    return { html: '<div class="crumbs"><a href="#/hata">Hata Defterim</a> › Test</div><h1>📓 Hata Defteri Testi</h1><div id="hq">Yükleniyor…</div>', after: function () {
      getData().then(function (d) {
        var items = []; d.mistakes.filter(function (m) { return !m.solved; }).forEach(function (m) { var q = X.qFromKey(m.key); if (q) items.push({ key: m.key, q: q, n: m.n }); });
        items.sort(function (a, b) { return b.n - a.n; }); items = items.slice(0, 20);
        if (!items.length) { $('hq').innerHTML = '<p>Çözülecek hata kalmadı! 🎉</p><a class="btn" href="#/">Konulara git</a>'; return; }
        var html = '<div class="card" id="quiz">' + items.map(function (it, i) { return X.qHtml(it.q, i); }).join('') + '</div><div class="scorebar"><div id="sc" class="score">Cevapla: 0/' + items.length + '</div><div><button class="btn" id="finish">Bitir ve Kontrol Et</button> <button class="btn alt hidden" id="retry">Tekrar dene</button> <a class="btn alt hidden" id="nxt" href="#/hata">Hata defterine dön →</a></div></div>';
        $('hq').innerHTML = html;
        X.wireQuiz({ no: 'hata' }, 0, items.map(function (it) { return it.q; }), { kind: 'hata', ref: 'hata', src: function (i) { return items[i].key; } });
      });
    } };
  }

  // ---------- çalışma kâğıdı ----------
  X.worksheet = function (w) {
    var t = X.temaOf(w.tema), qs = QZ.buildGame(w).slice(0, 12), ex = window.EXTRA && EXTRA[w.no];
    var h = X.weekHead(w, 'calisma') + '<div class="tools no-print" ' + X.cssVar(t.color) + '><button class="btn" id="pr">🖨️ Yazdır / PDF</button><button class="btn alt" id="tk">Cevap anahtarını göster</button><span class="note">Çıktı alıp elle çözdürmek için hazırlandı: şık yok, çözüm alanı bırakıldı.</span></div>';
    h += '<article class="paper ws"><div class="ph"><h2>' + esc(X.gr(w) + '. Sınıf Matematik – Çalışma Kâğıdı') + '</h2><small>' + esc(w.title) + '</small></div><div class="pinfo"><div>Adı Soyadı:</div><div>Sınıfı / No:</div><div>Tarih:</div></div>';
    if (ex) h += '<div class="ws-box"><b>Hatırla:</b><ul>' + ex.o.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    qs.forEach(function (q, i) { h += '<div class="pq wsq"><div class="pn">' + (i + 1) + '.</div><div><div>' + q.q + '</div>' + (q.fig || '') + '<div class="wsline"></div><div class="wsline"></div><div class="wsans">Cevap: ____________</div></div></div>'; });
    h += '<div class="ws-box">✍️ <b>Kendi sorunu yaz:</b><div class="wsline"></div><div class="wsline"></div><div class="wsline"></div></div>';
    h += '<div class="key hidden" id="key"><h3 style="margin:0">Cevap Anahtarı</h3>' + qs.map(function (q, i) { return '<div class="keyexp"><b>' + (i + 1) + '.</b> ' + q.opts[q.ans] + ' — ' + (q.exp || '') + '</div>'; }).join('') + '</div></article>';
    return { html: h, after: function () { $('pr').onclick = function () { window.print(); }; $('tk').onclick = function () { var hid = $('key').classList.toggle('hidden'); this.textContent = hid ? 'Cevap anahtarını göster' : 'Cevap anahtarını gizle'; }; } };
  };

  // ---------- öğretmen paneli ----------
  X.routes.ogretmen = function (p) {
    if (p[1] === 'ogrenci') return teacherStudent(+p[2]);
    return { html: '<h1>🧑‍🏫 Öğretmen Paneli</h1><div id="tp">Yükleniyor…</div>', after: function () { DB.ready.then(renderTeacher); } };
  };
  function renderTeacher() {
    var root = $('tp'); if (!root) return;
    if (!DB.server) { root.innerHTML = '<p>Öğretmen paneli için sunucu gerekir. Sunucuyu <code>node server.js</code> ile çalıştırın (ayrıntı: README).</p>'; return; }
    if (!DB.tTok()) {
      root.innerHTML = '<div class="card"><div class="sec-pad"><p>Öğretmen şifresini girin.</p><div class="login"><input id="tpw" type="password" placeholder="Şifre"><button class="btn" id="tgo">Giriş</button></div><p id="terr" class="note" style="color:var(--bad)"></p></div></div>';
      function go2() { DB.tLogin($('tpw').value).then(renderTeacher).catch(function (e) { $('terr').textContent = e.message; }); }
      $('tgo').onclick = go2; $('tpw').onkeydown = function (e) { if (e.key === 'Enter') go2(); }; return;
    }
    DB.t('GET', '/students').then(function (d) { drawTeacher(root, d.students); }).catch(function (e) { root.innerHTML = '<p style="color:var(--bad)">' + esc(e.message) + '</p><button class="btn" onclick="location.reload()">Yeniden dene</button>'; });
  }
  function weekOptions() { return WEEKS.map(function (w) { return '<option value="' + w.no + '">' + esc(X.gr(w) + '. sınıf • Hafta ' + X.wn(w) + ' • ' + w.title) + '</option>'; }).join(''); }
  function temaOptions() { return TEMAS.map(function (t) { return '<option value="' + t.id + '">' + esc(X.gr(t) + '. sınıf • ' + X.tn(t) + '. ' + t.title) + '</option>'; }).join(''); }
  function drawTeacher(root, students) {
    var h = '<p><button class="btn sm alt" id="tout">Çıkış</button> <button class="btn sm alt" id="tcards">🖨️ Erişim kartlarını yazdır</button></p>';
    h += '<div class="card"><div class="sec-pad"><h3>➕ Öğrenci ekle</h3><div class="login"><input id="sn" maxlength="40" placeholder="Ad (soyad ilk harfi yeterli)"><select id="sg"><option value="6">6. sınıf</option><option value="7">7. sınıf</option></select><button class="btn" id="sadd">Ekle</button></div><p id="snew" class="note"></p></div></div>';
    h += '<div class="card"><div class="sec-pad"><h3>👥 Öğrenciler (' + students.length + ')</h3>' + (students.length ? '<div class="tblwrap"><table class="tbl"><thead><tr><th><input type="checkbox" id="selall"></th><th>Ad</th><th>Sınıf</th><th>Erişim kodu</th><th>Son giriş</th><th>Çözülen</th><th>Ortalama</th><th>Açık hata</th><th></th></tr></thead><tbody>' + students.map(function (s) { return '<tr><td><input type="checkbox" class="sel" value="' + s.id + '"></td><td>' + esc(s.name) + '</td><td>' + s.grade + '</td><td><code class="codebox">' + esc(s.code) + '</code></td><td>' + dt(s.last) + '</td><td>' + s.results + '</td><td>' + (s.results ? '%' + s.avg : '—') + '</td><td>' + s.mistakes + '</td><td><a class="btn sm" href="#/ogretmen/ogrenci/' + s.id + '">Rapor</a> <button class="btn sm alt" data-nc="' + s.id + '">Yeni kod</button> <button class="btn sm alt" data-del="' + s.id + '">Sil</button></td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="note">Henüz öğrenci yok. Yukarıdan ekleyin; her öğrenciye otomatik bir erişim kodu verilir.</p>') + '</div></div>';
    h += '<div class="card"><div class="sec-pad"><h3>📤 Ödev ata</h3><p class="note">Tablodan öğrencileri işaretleyin (ya da sınıfa toplu atayın).</p><div class="asgform"><label>Tür <select id="ak"><option value="test">Hafta testi</option><option value="pekistirme">Pekiştirme testi</option><option value="sinav">Hafta sınavı</option><option value="tsinav">Ünite sınavı</option><option value="hata">Hata defteri çözümü</option></select></label><label id="aw1">Konu <select id="aw">' + weekOptions() + '</select></label><label id="at1" class="hidden">Ünite <select id="at">' + temaOptions() + '</select></label><label id="an1">Test no <select id="an"></select></label><label>Son gün <input type="date" id="ad"></label></div><p><button class="btn" id="asel">Seçili öğrencilere ata</button> <button class="btn alt" id="a6">Tüm 6. sınıflara</button> <button class="btn alt" id="a7">Tüm 7. sınıflara</button></p><p id="amsg" class="note"></p></div></div>';
    root.innerHTML = h;
    $('tout').onclick = function () { DB.tLogout(); renderTeacher(); };
    $('sadd').onclick = function () { var nm = $('sn').value.trim(); if (!nm) return; DB.t('POST', '/students', { name: nm, grade: +$('sg').value }).then(function (r) { renderTeacher(); setTimeout(function () { var m = $('snew'); if (m) m.innerHTML = '✅ <b>' + esc(r.name) + '</b> eklendi. Erişim kodu: <code class="codebox">' + esc(r.code) + '</code>'; }, 300); }).catch(function (e) { $('snew').textContent = e.message; }); };
    var sa = $('selall'); if (sa) sa.onchange = function () { [].forEach.call(document.querySelectorAll('.sel'), function (c) { c.checked = sa.checked; }); };
    root.onclick = function (e) {
      var nc = e.target.getAttribute('data-nc'), del = e.target.getAttribute('data-del');
      if (nc) DB.t('POST', '/students/' + nc + '/code').then(renderTeacher);
      if (del && confirm('Bu öğrenci ve tüm kayıtları silinsin mi?')) DB.t('DELETE', '/students/' + del).then(renderTeacher);
    };
    function syncForm() { var k = $('ak').value, isW = k === 'test' || k === 'sinav', isT = k === 'pekistirme' || k === 'tsinav', hasN = k === 'test' || k === 'pekistirme'; $('aw1').classList.toggle('hidden', !isW); $('at1').classList.toggle('hidden', !isT); $('an1').classList.toggle('hidden', !hasN); var cnt = k === 'test' ? QZ.TEST_COUNT : QZ.PEK_COUNT; $('an').innerHTML = Array.apply(null, Array(cnt)).map(function (_, i) { return '<option>' + (i + 1) + '</option>'; }).join(''); }
    $('ak').onchange = syncForm; syncForm();
    function assign(body) {
      var k = $('ak').value, ref, title;
      if (k === 'test') { ref = $('aw').value + ':' + $('an').value; title = weekLabel($('aw').value) + ' • Test ' + $('an').value; }
      else if (k === 'pekistirme') { ref = $('at').value + ':' + $('an').value; title = temaLabel($('at').value) + ' • Pekiştirme ' + $('an').value; }
      else if (k === 'sinav') { ref = $('aw').value; title = weekLabel(ref) + ' • Sınav'; }
      else if (k === 'tsinav') { ref = $('at').value; title = temaLabel(ref) + ' • Ünite sınavı'; }
      else { ref = 'hata'; title = 'Hata defterindeki soruları çöz'; }
      body.kind = k; body.ref = ref; body.title = title.replace(/^\d\. sınıf • /, ''); body.due = $('ad').value || '';
      DB.t('POST', '/assign', body).then(function (r) { $('amsg').textContent = '✅ ' + r.count + ' öğrenciye ödev atandı: ' + body.title; }).catch(function (e) { $('amsg').textContent = '⚠️ ' + e.message; });
    }
    $('asel').onclick = function () { var ids = [].map.call(document.querySelectorAll('.sel:checked'), function (c) { return +c.value; }); assign({ student_ids: ids }); };
    $('a6').onclick = function () { assign({ grade: 6 }); }; $('a7').onclick = function () { assign({ grade: 7 }); };
    $('tcards').onclick = function () {
      var w = window.open('', '_blank'); if (!w) return;
      var url = location.origin + location.pathname;
      w.document.write('<!doctype html><meta charset="utf-8"><title>Erişim kartları</title><style>body{font-family:sans-serif}.c{display:inline-block;width:250px;border:2px dashed #666;border-radius:12px;padding:12px;margin:8px;text-align:center}.k{font-size:30px;letter-spacing:4px;font-weight:800;font-family:monospace}</style>' + students.map(function (s) { return '<div class="c"><div>' + esc(s.name) + ' (' + s.grade + '. sınıf)</div><div class="k">' + esc(s.code) + '</div><small>Giriş: ' + esc(url) + '#/giris</small></div>'; }).join('')); w.document.close(); w.print();
    };
  }
  function teacherStudent(id) {
    return { html: '<div class="crumbs"><a href="#/ogretmen">Öğretmen paneli</a> › Öğrenci raporu</div><div class="no-print tools"><button class="btn" id="prr">🖨️ Yazdır / PDF</button></div><article class="paper report" id="rep">Yükleniyor…</article>', after: function () {
      $('prr').onclick = function () { window.print(); };
      DB.ready.then(function () { return DB.t('GET', '/student/' + id); }).then(function (d) {
        var html = reportHtml({ results: d.results, mistakes: d.mistakes }, d.student.name, { grade: d.student.grade });
        html += '<h3>Ödevler</h3>' + (d.assignments.length ? '<div class="tblwrap"><table class="tbl"><thead><tr><th>Ödev</th><th>Son gün</th><th>Durum</th></tr></thead><tbody>' + d.assignments.map(function (a) { return '<tr><td>' + esc(a.title) + '</td><td>' + esc(a.due || '—') + '</td><td>' + (a.done ? '✅ ' + a.score + '/' + a.total : '⏳ bekliyor') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="note">Ödev atanmamış.</p>');
        var open = d.mistakes.filter(function (m) { return !m.solved; });
        html += '<h3>Açık hata defteri (' + open.length + ')</h3>' + (open.length ? '<ul>' + open.slice(0, 15).map(function (m) { var q = X.qFromKey(m.key); return q ? '<li>' + esc(weekLabel(q.week)) + ' — ' + esc(q.q.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 100)) + '… <b>(' + m.n + '×)</b></li>' : ''; }).join('') + '</ul>' : '<p class="note">Yok.</p>');
        $('rep').innerHTML = html;
      }).catch(function (e) { $('rep').innerHTML = '<p style="color:var(--bad)">' + esc(e.message) + '</p>'; });
    } };
  }
  X.route();
})();
