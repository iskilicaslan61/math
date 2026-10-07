/* Uygulama: yönlendirme, görünümler, test motoru, sınav kâğıdı, simülatörler */
(function () {
  'use strict';
  var app = document.getElementById('app');
  var LET = ['A', 'B', 'C', 'D'];

  // ---- Yerel kayıt (başarısız olursa sessizce devam) ----
  var mem = {};
  function save(k, v) { try { localStorage.setItem('m6:' + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
  function load(k, d) { try { var s = localStorage.getItem('m6:' + k); return s === null ? (k in mem ? mem[k] : d) : JSON.parse(s); } catch (e) { return k in mem ? mem[k] : d; } }

  function gr(x) { return x.grade || 6; }
  function wn(w) { return w.wk || w.no; }
  function tn(t) { return t.n || t.id; }
  function homeHref(x) { return gr(x) === 7 ? '#/sinif7' : '#/'; }
  function temaOf(id) { return TEMAS.filter(function (t) { return t.id === id; })[0]; }
  function weekOf(no) { return WEEKS.filter(function (w) { return w.no === no; })[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cssVar(color) { return 'style="--c:' + color + '"'; }
  function bestOf(wn, t) { return load('best:' + wn + ':' + t, null); }
  function weekProgress(wn) { var done = 0; for (var t = 1; t <= QZ.TEST_COUNT; t++) { if (bestOf(wn, t) !== null) done++; } return done; }

  // ---------------- Ana sayfa ----------------
  function viewHome(g) {
    var TM = TEMAS.filter(function (t) { return gr(t) === g; }), WK = WEEKS.filter(function (w) { return gr(w) === g; });
    var totalHours = 0; TM.forEach(function (t) { totalHours += t.hours; });
    var html = '<div class="gtabs"><a class="gt' + (g === 6 ? ' on' : '') + '" href="#/">6. Sınıf</a><a class="gt' + (g === 7 ? ' on' : '') + '" href="#/sinif7">7. Sınıf</a></div><section class="hero"><h1>' + g + '. Sınıf Matematik</h1><p>' + g + '. sınıf matematik müfredatına göre hafta hafta işleyeceğiniz dersin <b>konu anlatımı</b>, her konu için <b>5 test</b> ve <b>sınav kâğıdı</b>. Birimden birime (temadan temaya) ilerleyin.</p>' +
      '<div class="stats"><div class="stat"><b>' + TM.length + '</b><span>Ünite (Tema)</span></div><div class="stat"><b>' + WK.length + '</b><span>Haftalık konu</span></div><div class="stat"><b>' + WK.length * QZ.TEST_COUNT + '</b><span>Test</span></div><div class="stat"><b>' + (WK.length + TM.length) + '</b><span>Sınav kâğıdı</span></div><div class="stat"><b>' + totalHours + '</b><span>Ders saati</span></div></div></section>';
    html += '<p class="note">Haftalık plan, her hafta yaklaşık 5 ders saati varsayımıyla hazırlanmıştır; kendi yıllık planınıza göre kaydırabilirsiniz. Test soruları sayısal değerleriyle her test için farklı üretilir, aynı test her açılışta aynı sorularla gelir.</p>';
    TM.forEach(function (t) {
      var ws = WEEKS.filter(function (w) { return w.tema === t.id; });
      html += '<section class="tema" ' + cssVar(t.color) + '><div class="tema-h"><div><span class="pill">' + tn(t) + '. Tema • ' + t.hours + ' ders saati</span><h2>' + esc(t.title) + '</h2><p>' + esc(t.summary) + '</p></div><div><a class="btn alt sm" href="#/tema/' + t.id + '/sinav">📝 Ünite Sınavı</a></div></div><div class="weeks">';
      ws.forEach(function (w) {
        var p = weekProgress(w.no);
        html += '<a class="wk" href="#/hafta/' + w.no + '"><div class="n">Hafta ' + wn(w) + '</div><div class="t">' + esc(w.title) + '</div><div class="m"><span>' + w.hours + ' ders saati</span><span>' + p + '/' + QZ.TEST_COUNT + ' test</span></div><div class="bar"><i style="width:' + p * 100 / QZ.TEST_COUNT + '%"></i></div></a>';
      });
      html += '</div></section>';
    });
    return html;
  }

  // ---------------- Hafta sayfası ----------------
  function crumbs(w, extra) {
    var t = temaOf(w.tema);
    return '<div class="crumbs"><a href="' + homeHref(w) + '">Yıllık Plan</a> › ' + tn(t) + '. Tema: ' + esc(t.title) + ' › <a href="#/hafta/' + w.no + '">Hafta ' + wn(w) + '</a>' + (extra ? ' › ' + extra : '') + '</div>';
  }
  function weekHead(w, tab) {
    var t = temaOf(w.tema);
    return crumbs(w) + '<div class="wk-head" ' + cssVar(t.color) + '><span class="pill">' + tn(t) + '. Tema • Hafta ' + wn(w) + ' • ' + w.hours + ' ders saati</span><h1>' + esc(w.title) + '</h1></div>' +
      '<div class="tabs" ' + cssVar(t.color) + '><a class="tab' + (tab === 'ders' ? ' on' : '') + '" href="#/hafta/' + w.no + '">📖 Konu Anlatımı</a><a class="tab' + (tab === 'test' ? ' on' : '') + '" href="#/hafta/' + w.no + '/testler">✅ 5 Test</a><a class="tab' + (tab === 'oyun' ? ' on' : '') + '" href="#/hafta/' + w.no + '/oyun">🎮 Oyun</a><a class="tab' + (tab === 'sinav' ? ' on' : '') + '" href="#/hafta/' + w.no + '/sinav">📝 Sınav Kâğıdı</a></div>';
  }
  function viewLesson(w) {
    var t = temaOf(w.tema), GW = WEEKS.filter(function (x) { return gr(x) === gr(w); }), i = GW.indexOf(w);
    var html = weekHead(w, 'ders') + '<div ' + cssVar(t.color) + '><div class="outcomes"><b>Öğrenme çıktıları:</b><ul>' + w.outcomes.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></div><div class="card">';
    w.lesson.forEach(function (s, k) { html += '<div class="sec"><h3>' + (k + 1) + '. ' + esc(s.h) + '</h3>' + s.html + '</div>'; });
    html += '</div><p><a class="btn" href="#/hafta/' + w.no + '/testler">Testlere geç →</a> <a class="btn alt" href="#/hafta/' + w.no + '/oyun">🎮 Oyun</a> <a class="btn alt" href="#/hafta/' + w.no + '/sinav">Sınav kâğıdı</a></p>';
    html += '<p class="note no-print">' + (i > 0 ? '<a href="#/hafta/' + GW[i - 1].no + '">← Hafta ' + wn(GW[i - 1]) + ': ' + esc(GW[i - 1].title) + '</a>' : '') + (i < GW.length - 1 ? ' &nbsp;|&nbsp; <a href="#/hafta/' + GW[i + 1].no + '">Hafta ' + wn(GW[i + 1]) + ': ' + esc(GW[i + 1].title) + ' →</a>' : '') + '</p></div>';
    return html;
  }
  function viewTests(w) {
    var t = temaOf(w.tema);
    var html = weekHead(w, 'test') + '<p class="lead">Bu konu için ' + QZ.TEST_COUNT + ' farklı test hazırlandı. Her testte ' + QZ.TEST_SIZE + ' soru var; sonunda doğru cevaplar ve çözümler görünür.</p><div class="testlist" ' + cssVar(t.color) + '>';
    for (var k = 1; k <= QZ.TEST_COUNT; k++) {
      var b = bestOf(w.no, k);
      html += '<a class="tcard" href="#/hafta/' + w.no + '/test/' + k + '"><span class="badge' + (b !== null && b >= QZ.TEST_SIZE - 1 ? ' good' : '') + '">' + (b === null ? 'Yeni' : 'En iyi ' + b + '/' + QZ.TEST_SIZE) + '</span><b>Test ' + k + '</b><span>' + QZ.TEST_SIZE + ' soru</span></a>';
    }
    return html + '</div>';
  }

  // ---------------- Test ----------------
  function qHtml(q, i, mode) {
    var h = '<div class="q" data-i="' + i + '"><div class="qn">' + (i + 1) + '</div><div class="qb"><div class="qt">' + q.q + '</div>' + (q.fig || '') + '<ul class="opts">';
    q.opts.forEach(function (o, j) { h += '<li><label><input type="radio" name="q' + i + '" value="' + j + '"><span class="lt">' + LET[j] + ')</span><span>' + o + '</span></label></li>'; });
    return h + '</ul><div class="exp hidden"></div></div></div>';
  }
  function viewTest(w, k) {
    var t = temaOf(w.tema), qs = QZ.buildTest(w, k);
    var html = crumbs(w, 'Test ' + k) + '<div class="wk-head" ' + cssVar(t.color) + '><span class="pill">Hafta ' + wn(w) + ' • Test ' + k + '/' + QZ.TEST_COUNT + '</span><h1>' + esc(w.title) + '</h1></div><div class="card" ' + cssVar(t.color) + ' id="quiz">';
    qs.forEach(function (q, i) { html += qHtml(q, i); });
    html += '</div><div class="scorebar"><div id="sc" class="score">Cevapla: 0/' + qs.length + '</div><div><button class="btn" id="finish">Bitir ve Kontrol Et</button> <button class="btn alt hidden" id="retry">Tekrar dene</button> ' + (k < QZ.TEST_COUNT ? '<a class="btn alt hidden" id="nxt" href="#/hafta/' + w.no + '/test/' + (k + 1) + '">Sonraki test →</a>' : '<a class="btn alt hidden" id="nxt" href="#/hafta/' + w.no + '/sinav">Sınav kâğıdına geç →</a>') + '</div></div>';
    return { html: html, after: function () { wireQuiz(w, k, qs); } };
  }
  function wireQuiz(w, k, qs) {
    var root = document.getElementById('quiz'), done = false;
    function answered() { return root.querySelectorAll('input:checked').length; }
    root.addEventListener('change', function (e) {
      if (done) return;
      var li = e.target.closest('li'), ul = li.parentNode;
      [].forEach.call(ul.children, function (x) { x.classList.remove('sel'); }); li.classList.add('sel');
      document.getElementById('sc').textContent = 'Cevapla: ' + answered() + '/' + qs.length;
    });
    document.getElementById('finish').onclick = function () {
      if (done) return;
      if (answered() < qs.length && !confirm('Boş bıraktığın sorular var. Yine de bitirmek istiyor musun?')) return;
      done = true; var score = 0;
      qs.forEach(function (q, i) {
        var box = root.querySelector('.q[data-i="' + i + '"]'), lis = box.querySelectorAll('li'), chosen = box.querySelector('input:checked');
        var c = chosen ? +chosen.value : -1, ex = box.querySelector('.exp');
        lis[q.ans].classList.add('right');
        if (c === q.ans) score++; else if (c >= 0) lis[c].classList.add('wrong');
        [].forEach.call(box.querySelectorAll('input'), function (x) { x.disabled = true; });
        ex.classList.remove('hidden'); if (c !== q.ans) ex.classList.add('no');
        ex.innerHTML = (c === q.ans ? '✅ Doğru. ' : (c < 0 ? '⚪ Boş. ' : '❌ Yanlış. ') + 'Doğru cevap: <b>' + LET[q.ans] + '</b>. ') + (q.exp ? '<br>' + q.exp : '');
      });
      document.getElementById('sc').innerHTML = 'Sonuç: <span style="color:var(--ok)">' + score + '</span>/' + qs.length + ' doğru';
      var prev = bestOf(w.no, k); if (prev === null || score > prev) save('best:' + w.no + ':' + k, score);
      document.getElementById('finish').classList.add('hidden');
      document.getElementById('retry').classList.remove('hidden'); document.getElementById('nxt').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.getElementById('retry').onclick = function () { route(); window.scrollTo(0, 0); };
  }

  // ---------------- Sınav kâğıdı ----------------
  function paperHtml(title, subtitle, qs, color) {
    var cnt = qs.length;
    var per = Math.round(100 / qs.length * 10) / 10;
    var h = '<div class="tools no-print" ' + cssVar(color) + '><button class="btn" id="sub">✅ Teslim Et</button><button class="btn alt" id="rs">↺ Sıfırla</button><button class="btn alt" id="pr">🖨️ Yazdır / PDF</button><button class="btn alt" id="tk">Cevap anahtarını göster</button><span class="note" id="tm">⏱ 00:00</span><span class="note">Online çözmek için şıkları işaretleyip “Teslim Et”e basın. Her soru ' + MC.num(per) + ' puandır.</span></div><div id="result" class="result hidden no-print"></div>';
    h += '<article class="paper"><div class="ph"><h2>' + esc(title) + '</h2><small>' + esc(subtitle) + '</small></div><div class="pinfo"><div>Adı Soyadı: <input id="stname" class="no-print-in" maxlength="40" placeholder="adını yaz"></div><div>Sınıfı / No:</div><div>Tarih:</div></div>';
    qs.forEach(function (q, i) {
      h += '<div class="pq" data-i="' + i + '"><div class="pn">' + (i + 1) + '.</div><div><div>' + q.q + ' <span class="pp">(' + MC.num(per) + ' p)</span></div>' + (q.fig || '') + '<div class="popts">';
      q.opts.forEach(function (o, j) { h += '<label class="po"><input type="radio" name="p' + i + '" value="' + j + '"><b>' + LET[j] + ')</b>' + o + '</label>'; });
      h += '</div></div></div>';
    });
    h += '<div class="key hidden" id="key"><h3 style="margin:0">Cevap Anahtarı</h3><div class="keygrid">' + qs.map(function (q, i) { return '<span>' + (i + 1) + '-' + LET[q.ans] + '</span>'; }).join('') + '</div>';
    qs.forEach(function (q, i) { h += '<div class="keyexp"><b>' + (i + 1) + '.</b> ' + LET[q.ans] + ') ' + (q.exp || '') + '</div>'; });
    return h + '</div></article>';
  }
  function wirePaper(qs, id) {
    var pr = document.getElementById('pr'), tk = document.getElementById('tk'), key = document.getElementById('key');
    var t0 = Date.now(), done = false, tick;
    function fmt(s) { return (s < 600 ? '0' : '') + Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
    tick = setInterval(function () { var el = document.getElementById('tm'); if (!el) { clearInterval(tick); return; } if (!done) el.textContent = '⏱ ' + fmt(Math.floor((Date.now() - t0) / 1000)); }, 1000);
    pr.onclick = function () { window.print(); };
    tk.onclick = function () { var hid = key.classList.toggle('hidden'); tk.textContent = hid ? 'Cevap anahtarını göster' : 'Cevap anahtarını gizle'; };
    document.getElementById('rs').onclick = function () { clearInterval(tick); route(); window.scrollTo(0, 0); };
    document.getElementById('sub').onclick = function () {
      if (done) return;
      var blank = qs.filter(function (q, i) { return !document.querySelector('input[name="p' + i + '"]:checked'); }).length;
      if (blank && !confirm(blank + ' soruyu boş bıraktın. Yine de teslim edilsin mi?')) return;
      done = true; clearInterval(tick);
      var ok = 0, bad = 0;
      qs.forEach(function (q, i) {
        var box = document.querySelector('.pq[data-i="' + i + '"]'), labs = box.querySelectorAll('label.po'), ch = box.querySelector('input:checked');
        [].forEach.call(box.querySelectorAll('input'), function (x) { x.disabled = true; });
        labs[q.ans].classList.add('right');
        if (ch) { if (+ch.value === q.ans) ok++; else { bad++; labs[+ch.value].classList.add('wrong'); } }
      });
      var n = qs.length, score = Math.round(ok * 100 / n * 10) / 10, name = (document.getElementById('stname').value || '').trim() || 'Öğrenci';
      var res = document.getElementById('result');
      res.innerHTML = '<div class="rs-big">' + MC.num(score) + ' <small>/ 100</small></div><div><b>' + esc(name) + '</b><br>✅ ' + ok + ' doğru • ❌ ' + bad + ' yanlış • ⚪ ' + (n - ok - bad) + ' boş • ⏱ ' + fmt(Math.floor((Date.now() - t0) / 1000)) + '<br>' + (score >= 85 ? '🌟 Pekiyi!' : score >= 70 ? '👏 İyi' : score >= 50 ? '💪 Orta, tekrar çalış' : '📖 Konuyu tekrar et') + '</div>';
      res.classList.remove('hidden'); key.classList.remove('hidden'); tk.textContent = 'Cevap anahtarını gizle';
      var prev = load('exam:' + id, null); if (prev === null || score > prev) save('exam:' + id, score);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    var best = load('exam:' + id, null);
    if (best !== null) document.getElementById('tm').textContent += '  •  En iyi: ' + MC.num(best);
  }
  function viewExam(w) {
    var t = temaOf(w.tema), qs = QZ.buildExam(w);
    return { html: weekHead(w, 'sinav') + paperHtml(gr(w) + '. Sınıf Matematik – ' + w.title, 'Hafta ' + wn(w) + ' • ' + QZ.EXAM_SIZE + ' soru • Süre: 40 dakika', qs, t.color), after: function () { wirePaper(qs, 'w' + w.no); } };
  }
  function viewTemaExam(id) {
    var t = temaOf(id), qs = QZ.buildTemaExam(id);
    var html = '<div class="crumbs"><a href="' + homeHref(t) + '">Yıllık Plan</a> › ' + tn(t) + '. Tema Sınavı</div><div class="wk-head" ' + cssVar(t.color) + '><span class="pill">' + tn(t) + '. Tema • Ünite Sınavı</span><h1>' + esc(t.title) + '</h1></div>';
    return { html: html + paperHtml(gr(t) + '. Sınıf Matematik – ' + tn(t) + '. Tema: ' + t.title, 'Ünite sınavı • ' + qs.length + ' soru • Süre: 40 dakika', qs, t.color), after: function () { wirePaper(qs, 't' + id); } };
  }

  function viewAbout() {
    return '<h1>Hakkında</h1><div class="card"><p>Bu uygulama, MEB Talim ve Terbiye Kurulu’nun <b>Ortaokul Matematik Dersi (6. ve 7. Sınıf)</b> öğretim programındaki <b>6. sınıf 1–6. temalar ve 7. sınıf 6 ünite</b> için hazırlanmıştır. 6. sınıf: Sayılar ve Nicelikler (1), İşlemlerle Cebirsel Düşünme ve Değişimler, Geometrik Şekiller, Geometrik Nicelikler, İstatistiksel Araştırma Süreci, Veriden Olasılığa.</p><ul><li>Her haftalık konuda: öğrenme çıktıları, ders akışı, çözümlü örnekler ve etkinlik önerileri.</li><li>Her konu için <b>5 test</b> (20’şer soru), her konu için <b>Kahoot tarzı oyun</b> ve bir <b>10 soruluk sınav kâğıdı</b>; her ünite için ayrıca <b>20 soruluk ünite sınavı</b>.</li><li>Sınav kâğıdını “Yazdır / PDF” düğmesiyle çıktı alabilirsiniz; cevap anahtarı ayrı sayfada yer alır.</li></ul><p class="note">Haftalara bölme, dersin ders saatlerine göre öneridir. Sorular programatik olarak üretilir; sayılar her testte farklıdır ve cevaplar otomatik hesaplanır.</p></div>';
  }


  // ---------------- Kahoot tarzı oyun ----------------
  var TILES = [{ c: '#e21b3c', s: '▲' }, { c: '#1368ce', s: '◆' }, { c: '#d89e00', s: '●' }, { c: '#26890c', s: '■' }];
  function viewGame(w) {
    var t = temaOf(w.tema);
    var html = weekHead(w, 'oyun') + '<div id="game" class="game"></div>';
    return { html: html, after: function () { gameSetup(w, document.getElementById('game')); } };
  }
  function gameSetup(w, root) {
    var top = load('game:top:' + w.no, []);
    root.innerHTML = '<div class="g-panel"><h2>🎮 ' + esc(w.title) + '</h2><p>Kahoot tarzı oyun: ' + 20 + ' soru, her soruda süre var. Ne kadar hızlı doğru cevaplarsan o kadar çok puan! Üst üste doğrular seri bonusu kazandırır.</p>' +
      '<div class="g-row"><label>Mod</label><select id="gm"><option value="solo">Tek oyuncu</option><option value="team">Takım yarışması (sınıf, tek ekran)</option></select></div>' +
      '<div class="g-row" id="gnameRow"><label>Adın</label><input id="gname" maxlength="20" placeholder="Takma adın" value="' + esc(load('game:name', '')) + '"></div>' +
      '<div class="g-row hidden" id="gteamRow"><label>Takım sayısı</label><select id="gtc"><option>2</option><option selected>3</option><option>4</option></select><span class="note">Takımlar sırayla soru cevaplar.</span></div>' +
      '<div class="g-row"><label>Süre (sn)</label><select id="gt"><option>15</option><option selected>20</option><option>30</option><option>45</option></select></div>' +
      '<button class="btn g-start" id="gstart">Oyunu Başlat ▶</button></div>' +
      (top.length ? '<div class="g-panel"><h3>🏆 En yüksek skorlar (bu cihaz)</h3><ol>' + top.map(function (x) { return '<li><b>' + esc(x.n) + '</b> — ' + x.s + ' puan</li>'; }).join('') + '</ol></div>' : '');
    var gm = root.querySelector('#gm');
    gm.onchange = function () { var team = gm.value === 'team'; root.querySelector('#gnameRow').classList.toggle('hidden', team); root.querySelector('#gteamRow').classList.toggle('hidden', !team); };
    root.querySelector('#gstart').onclick = function () {
      var team = gm.value === 'team', n = team ? +root.querySelector('#gtc').value : 1, players = [];
      for (var i = 0; i < n; i++) players.push({ name: team ? ['Kırmızı', 'Mavi', 'Sarı', 'Yeşil'][i] + ' Takım' : (root.querySelector('#gname').value.trim() || 'Oyuncu'), color: TILES[i].c, score: 0, streak: 0, ok: 0 });
      if (!team) save('game:name', players[0].name);
      gameRun(w, root, players, +root.querySelector('#gt').value, team);
    };
  }
  function gameRun(w, root, players, limit, team) {
    var qs = QZ.buildGame(w), i = 0, cur = 0, timer = null, start = 0, answered = false;
    function show() {
      var q = qs[i], p = players[cur]; answered = false;
      root.innerHTML = '<div class="g-top"><span>Soru ' + (i + 1) + '/' + qs.length + '</span><span class="g-who" style="background:' + p.color + '">' + esc(p.name) + '</span><span>⭐ ' + p.score + (p.streak > 1 ? ' 🔥' + p.streak : '') + '</span></div>' +
        '<div class="g-bar"><i id="gbar"></i><b id="gsec">' + limit + '</b></div><div class="g-q">' + q.q + (q.fig || '') + '</div><div class="g-tiles">' +
        q.opts.map(function (o, j) { return '<button class="g-tile" data-j="' + j + '" style="background:' + TILES[j].c + '"><span class="g-sym">' + TILES[j].s + '</span><span>' + o + '</span></button>'; }).join('') + '</div>';
      start = Date.now(); clearInterval(timer);
      timer = setInterval(function () {
        var el = (Date.now() - start) / 1000, left = Math.max(0, limit - el);
        var bar = document.getElementById('gbar'), sec = document.getElementById('gsec'); if (!bar) { clearInterval(timer); return; }
        bar.style.width = (left / limit * 100) + '%'; sec.textContent = Math.ceil(left);
        if (left <= 0) { clearInterval(timer); pick(-1); }
      }, 100);
      [].forEach.call(root.querySelectorAll('.g-tile'), function (b) { b.onclick = function () { pick(+b.getAttribute('data-j')); }; });
    }
    function pick(j) {
      if (answered) return; answered = true; clearInterval(timer);
      var q = qs[i], p = players[cur], el = (Date.now() - start) / 1000, ok = j === q.ans, pts = 0;
      if (ok) { p.streak++; p.ok++; pts = Math.round(1000 * (1 - Math.min(1, el / limit) / 2)) + 100 * Math.min(p.streak - 1, 5); p.score += pts; } else p.streak = 0;
      var tiles = root.querySelectorAll('.g-tile');
      [].forEach.call(tiles, function (b, k) { b.disabled = true; if (k !== q.ans) b.classList.add('dim'); else b.classList.add('right'); });
      var box = document.createElement('div'); box.className = 'g-fb ' + (ok ? 'ok' : 'no');
      box.innerHTML = '<div><b>' + (ok ? '✅ Doğru! +' + pts : (j < 0 ? '⏰ Süre doldu' : '❌ Yanlış')) + '</b>' + (q.exp ? '<div class="g-exp">' + q.exp + '</div>' : '') + '</div><button class="btn" id="gnext">' + (i === qs.length - 1 ? 'Sonuçlar 🏁' : 'Sonraki ▶') + '</button>';
      root.appendChild(box);
      document.getElementById('gnext').onclick = next; document.getElementById('gnext').focus();
    }
    function next() { i++; if (team) cur = (cur + 1) % players.length; if (i >= qs.length) end(); else show(); }
    function end() {
      var sorted = players.slice().sort(function (a, b) { return b.score - a.score; });
      if (!team) { var top = load('game:top:' + w.no, []); top.push({ n: players[0].name, s: players[0].score }); top.sort(function (a, b) { return b.s - a.s; }); save('game:top:' + w.no, top.slice(0, 5)); }
      var medals = ['🥇', '🥈', '🥉', '4.'];
      root.innerHTML = '<div class="g-panel g-end"><h2>🏁 Oyun bitti!</h2>' + (team ? '' : '<p class="g-big">' + players[0].score + ' puan</p><p>' + players[0].ok + '/' + qs.length + ' doğru ' + (players[0].ok >= 18 ? '— Harika! 🌟' : players[0].ok >= 14 ? '— Çok iyi! 👏' : players[0].ok >= 10 ? '— İyi, biraz daha çalış 💪' : '— Konuyu tekrar edelim 📖') + '</p>') +
        (team ? '<div class="g-podium">' + sorted.map(function (p, k) { return '<div class="g-pl" style="border-color:' + p.color + '"><span>' + medals[k] + '</span><b>' + esc(p.name) + '</b><span>' + p.score + ' puan • ' + p.ok + ' doğru</span></div>'; }).join('') + '</div>' : '') +
        '<p><button class="btn" id="gagain">Tekrar oyna</button> <a class="btn alt" href="#/hafta/' + w.no + '/testler">Testlere git</a></p></div>';
      document.getElementById('gagain').onclick = function () { gameSetup(w, root); };
    }
    document.onkeydown = function (e) { if (!document.getElementById('game')) { document.onkeydown = null; return; } var k = +e.key; if (k >= 1 && k <= 4 && !answered && root.querySelector('.g-tile')) pick(k - 1); else if ((e.key === 'Enter') && answered && document.getElementById('gnext')) document.getElementById('gnext').click(); };
    show();
  }

  // ---------------- Simülatörler ----------------
  function hydrate() {
    [].forEach.call(document.querySelectorAll('[data-widget]'), function (el) {
      var k = el.getAttribute('data-widget');
      if (k === 'coin') coinSim(el); else if (k === 'dice') diceSim(el); else if (k === 'spinner') spinSim(el);
    });
  }
  function simShell(el, title, faces, drawer) {
    var counts = faces.map(function () { return 0; }), total = 0;
    el.innerHTML = '<div class="sim"><h4>' + title + '</h4><div class="row"><span>Tekrar:</span>' + [1, 10, 100, 1000].map(function (n) { return '<button class="btn sm" data-n="' + n + '">' + n + ' kez</button>'; }).join('') + '<button class="btn sm alt" data-n="0">Sıfırla</button></div><div class="res"></div></div>';
    var res = el.querySelector('.res');
    function render() {
      if (!total) { res.innerHTML = 'Henüz deney yapılmadı.'; return; }
      var mx = Math.max.apply(null, counts), h = '<table><tr><th>Çıktı</th>' + faces.map(function (f) { return '<th>' + f + '</th>'; }).join('') + '<th>Toplam</th></tr><tr><td>Sayı</td>' + counts.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '<td>' + total + '</td></tr><tr><td>Göreli sıklık</td>' + counts.map(function (c) { return '<td>' + MC.num(Math.round(c / total * 1000) / 1000) + '</td>'; }).join('') + '<td>1</td></tr></table>';
      h += '<div class="bars">' + counts.map(function (c) { return '<div style="height:' + (mx ? c / mx * 100 : 0) + '%"><span>' + MC.num(Math.round(c / total * 100) / 100) + '</span></div>'; }).join('') + '</div><div class="lb">' + faces.map(function (f) { return '<div>' + f + '</div>'; }).join('') + '</div>';
      res.innerHTML = h; if (drawer) drawer(res, counts, total);
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var n = +b.getAttribute('data-n');
      if (n === 0) { counts = faces.map(function () { return 0; }); total = 0; render(); return; }
      for (var i = 0; i < n; i++) { counts[sim.pick()]++; total++; } render();
    });
    var sim = { pick: null };
    render(); return sim;
  }
  function coinSim(el) { var s = simShell(el, '🪙 Madeni para atışı', ['Yazı', 'Tura']); s.pick = function () { return Math.random() < 0.5 ? 0 : 1; }; }
  function diceSim(el) { var s = simShell(el, '🎲 Zar atışı', ['1', '2', '3', '4', '5', '6']); s.pick = function () { return Math.floor(Math.random() * 6); }; }
  function spinSim(el) {
    var P = [0.4, 0.25, 0.2, 0.15], names = ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı'], col = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];
    var a = -Math.PI / 2, s = '<div class="spinwrap"><svg viewBox="-100 -100 200 200">';
    P.forEach(function (p, i) {
      var a2 = a + p * 2 * Math.PI, large = p > 0.5 ? 1 : 0;
      s += '<path d="M0 0 L' + 90 * Math.cos(a) + ' ' + 90 * Math.sin(a) + ' A90 90 0 ' + large + ' 1 ' + 90 * Math.cos(a2) + ' ' + 90 * Math.sin(a2) + ' Z" fill="' + col[i] + '" stroke="#fff" stroke-width="2"/>'; a = a2;
    });
    s += '<circle r="5" fill="#222"/><path d="M0 0 L0 -70" stroke="#222" stroke-width="3" /></svg></div><p class="note">Çarkın bölgeleri eşit değildir. Deney yaparak her rengin olasılığını tahmin edin.</p>';
    var wrap = document.createElement('div'); el.appendChild(wrap);
    var inner = document.createElement('div'); wrap.appendChild(inner);
    var sim = simShell(inner, '🎡 Çark çevirme', names);
    sim.pick = function () { var r = Math.random(), c = 0; for (var i = 0; i < P.length; i++) { c += P[i]; if (r < c) return i; } return P.length - 1; };
    var fig = document.createElement('div'); fig.innerHTML = s; wrap.insertBefore(fig, inner);
  }

  // ---------------- Yönlendirme ----------------
  function route() {
    var h = location.hash.replace(/^#\/?/, ''), p = h.split('/'), out;
    if (p[0] === '') out = { html: viewHome(6) };
    else if (p[0] === 'sinif7') out = { html: viewHome(7) };
    else if (p[0] === 'hakkinda') out = { html: viewAbout() };
    else if (p[0] === 'tema' && p[2] === 'sinav' && temaOf(+p[1])) out = viewTemaExam(+p[1]);
    else if (p[0] === 'hafta' && weekOf(+p[1])) {
      var w = weekOf(+p[1]);
      if (!p[2]) out = { html: viewLesson(w) };
      else if (p[2] === 'testler') out = { html: viewTests(w) };
      else if (p[2] === 'test') { var k = +p[3]; out = (k >= 1 && k <= QZ.TEST_COUNT) ? viewTest(w, k) : { html: viewTests(w) }; }
      else if (p[2] === 'oyun') out = viewGame(w);
      else if (p[2] === 'sinav') out = viewExam(w);
      else out = { html: viewLesson(w) };
    } else out = { html: '<h1>Sayfa bulunamadı</h1><p><a href="#/">Ana sayfaya dön</a></p>' };
    app.innerHTML = out.html;
    hydrate();
    if (out.after) out.after();
    document.title = 'Matematik' + (p[0] === 'hafta' && weekOf(+p[1]) ? ' ' + gr(weekOf(+p[1])) + '. Sınıf – ' + weekOf(+p[1]).title : p[0] === 'sinif7' ? ' 7. Sınıf' : ' 6. Sınıf');
  }
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });
  route();
})();
