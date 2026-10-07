/* Uygulama: yönlendirme, görünümler, test motoru, sınav kâğıdı, simülatörler */
(function () {
  'use strict';
  var app = document.getElementById('app');
  var LET = ['A', 'B', 'C', 'D'];

  // ---- Yerel kayıt (başarısız olursa sessizce devam) ----
  var mem = {};
  function save(k, v) { try { localStorage.setItem('m6:' + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
  function load(k, d) { try { var s = localStorage.getItem('m6:' + k); return s === null ? (k in mem ? mem[k] : d) : JSON.parse(s); } catch (e) { return k in mem ? mem[k] : d; } }

  function temaOf(id) { return TEMAS.filter(function (t) { return t.id === id; })[0]; }
  function weekOf(no) { return WEEKS.filter(function (w) { return w.no === no; })[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cssVar(color) { return 'style="--c:' + color + '"'; }
  function bestOf(wn, t) { return load('best:' + wn + ':' + t, null); }
  function weekProgress(wn) { var done = 0; for (var t = 1; t <= QZ.TEST_COUNT; t++) { if (bestOf(wn, t) !== null) done++; } return done; }

  // ---------------- Ana sayfa ----------------
  function viewHome() {
    var totalHours = 0; TEMAS.forEach(function (t) { totalHours += t.hours; });
    var html = '<section class="hero"><h1>6. Sınıf Matematik</h1><p>Türkiye Yüzyılı Maarif Modeli’ne göre hafta hafta işleyeceğiniz dersin <b>konu anlatımı</b>, her konu için <b>5 test</b> ve <b>sınav kâğıdı</b>. Birimden birime (temadan temaya) ilerleyin.</p>' +
      '<div class="stats"><div class="stat"><b>' + TEMAS.length + '</b><span>Ünite (Tema)</span></div><div class="stat"><b>' + WEEKS.length + '</b><span>Haftalık konu</span></div><div class="stat"><b>' + WEEKS.length * QZ.TEST_COUNT + '</b><span>Test</span></div><div class="stat"><b>' + (WEEKS.length + TEMAS.length) + '</b><span>Sınav kâğıdı</span></div><div class="stat"><b>' + totalHours + '</b><span>Ders saati</span></div></div></section>';
    html += '<p class="note">Haftalık plan, her hafta yaklaşık 5 ders saati varsayımıyla hazırlanmıştır; kendi yıllık planınıza göre kaydırabilirsiniz. Test soruları sayısal değerleriyle her test için farklı üretilir, aynı test her açılışta aynı sorularla gelir.</p>';
    TEMAS.forEach(function (t) {
      var ws = WEEKS.filter(function (w) { return w.tema === t.id; });
      html += '<section class="tema" ' + cssVar(t.color) + '><div class="tema-h"><div><span class="pill">' + t.id + '. Tema • ' + t.hours + ' ders saati</span><h2>' + esc(t.title) + '</h2><p>' + esc(t.summary) + '</p></div><div><a class="btn alt sm" href="#/tema/' + t.id + '/sinav">📝 Ünite Sınavı</a></div></div><div class="weeks">';
      ws.forEach(function (w) {
        var p = weekProgress(w.no);
        html += '<a class="wk" href="#/hafta/' + w.no + '"><div class="n">Hafta ' + w.no + '</div><div class="t">' + esc(w.title) + '</div><div class="m"><span>' + w.hours + ' ders saati • ' + w.code + '</span><span>' + p + '/' + QZ.TEST_COUNT + ' test</span></div><div class="bar"><i style="width:' + p * 100 / QZ.TEST_COUNT + '%"></i></div></a>';
      });
      html += '</div></section>';
    });
    return html;
  }

  // ---------------- Hafta sayfası ----------------
  function crumbs(w, extra) {
    var t = temaOf(w.tema);
    return '<div class="crumbs"><a href="#/">Yıllık Plan</a> › ' + t.id + '. Tema: ' + esc(t.title) + ' › <a href="#/hafta/' + w.no + '">Hafta ' + w.no + '</a>' + (extra ? ' › ' + extra : '') + '</div>';
  }
  function weekHead(w, tab) {
    var t = temaOf(w.tema);
    return crumbs(w) + '<div class="wk-head" ' + cssVar(t.color) + '><span class="pill">' + t.id + '. Tema • Hafta ' + w.no + ' • ' + w.hours + ' ders saati</span><h1>' + esc(w.title) + '</h1></div>' +
      '<div class="tabs" ' + cssVar(t.color) + '><a class="tab' + (tab === 'ders' ? ' on' : '') + '" href="#/hafta/' + w.no + '">📖 Konu Anlatımı</a><a class="tab' + (tab === 'test' ? ' on' : '') + '" href="#/hafta/' + w.no + '/testler">✅ 5 Test</a><a class="tab' + (tab === 'sinav' ? ' on' : '') + '" href="#/hafta/' + w.no + '/sinav">📝 Sınav Kâğıdı</a></div>';
  }
  function viewLesson(w) {
    var t = temaOf(w.tema), i = WEEKS.indexOf(w);
    var html = weekHead(w, 'ders') + '<div ' + cssVar(t.color) + '><div class="outcomes"><b>Öğrenme çıktıları (' + esc(w.code) + '):</b><ul>' + w.outcomes.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></div><div class="card">';
    w.lesson.forEach(function (s, k) { html += '<div class="sec"><h3>' + (k + 1) + '. ' + esc(s.h) + '</h3>' + s.html + '</div>'; });
    html += '</div><p><a class="btn" href="#/hafta/' + w.no + '/testler">Testlere geç →</a> <a class="btn alt" href="#/hafta/' + w.no + '/sinav">Sınav kâğıdı</a></p>';
    html += '<p class="note no-print">' + (i > 0 ? '<a href="#/hafta/' + WEEKS[i - 1].no + '">← Hafta ' + WEEKS[i - 1].no + ': ' + esc(WEEKS[i - 1].title) + '</a>' : '') + (i < WEEKS.length - 1 ? ' &nbsp;|&nbsp; <a href="#/hafta/' + WEEKS[i + 1].no + '">Hafta ' + WEEKS[i + 1].no + ': ' + esc(WEEKS[i + 1].title) + ' →</a>' : '') + '</p></div>';
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
    var html = crumbs(w, 'Test ' + k) + '<div class="wk-head" ' + cssVar(t.color) + '><span class="pill">Hafta ' + w.no + ' • Test ' + k + '/' + QZ.TEST_COUNT + '</span><h1>' + esc(w.title) + '</h1></div><div class="card" ' + cssVar(t.color) + ' id="quiz">';
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
    var per = Math.round(100 / qs.length * 10) / 10;
    var h = '<div class="tools no-print" ' + cssVar(color) + '><button class="btn" id="pr">🖨️ Yazdır / PDF</button><button class="btn alt" id="tk">Cevap anahtarını göster</button><span class="note">Her soru ' + MC.num(per) + ' puandır. Yazdırırken “Arka plan grafikleri” seçeneği gerekmez.</span></div>';
    h += '<article class="paper"><div class="ph"><h2>' + esc(title) + '</h2><small>' + esc(subtitle) + '</small></div><div class="pinfo"><div>Adı Soyadı:</div><div>Sınıfı / No:</div><div>Tarih:</div></div>';
    qs.forEach(function (q, i) {
      h += '<div class="pq"><div class="pn">' + (i + 1) + '.</div><div><div>' + q.q + ' <span class="pp">(' + MC.num(per) + ' p)</span></div>' + (q.fig || '') + '<div class="popts">';
      q.opts.forEach(function (o, j) { h += '<span><b>' + LET[j] + ')</b>' + o + '</span>'; });
      h += '</div></div></div>';
    });
    h += '<div class="key hidden" id="key"><h3 style="margin:0">Cevap Anahtarı</h3><div class="keygrid">' + qs.map(function (q, i) { return '<span>' + (i + 1) + '-' + LET[q.ans] + '</span>'; }).join('') + '</div>';
    qs.forEach(function (q, i) { h += '<div class="keyexp"><b>' + (i + 1) + '.</b> ' + LET[q.ans] + ') ' + (q.exp || '') + '</div>'; });
    return h + '</div></article>';
  }
  function wirePaper() {
    var pr = document.getElementById('pr'), tk = document.getElementById('tk'), key = document.getElementById('key');
    pr.onclick = function () { window.print(); };
    tk.onclick = function () { var hid = key.classList.toggle('hidden'); tk.textContent = hid ? 'Cevap anahtarını göster' : 'Cevap anahtarını gizle'; };
  }
  function viewExam(w) {
    var t = temaOf(w.tema), qs = QZ.buildExam(w);
    return { html: weekHead(w, 'sinav') + paperHtml('6. Sınıf Matematik – ' + w.title, 'Hafta ' + w.no + ' • ' + w.code + ' • ' + QZ.EXAM_SIZE + ' soru • Süre: 40 dakika', qs, t.color), after: wirePaper };
  }
  function viewTemaExam(id) {
    var t = temaOf(id), qs = QZ.buildTemaExam(id);
    var html = '<div class="crumbs"><a href="#/">Yıllık Plan</a> › ' + t.id + '. Tema Sınavı</div><div class="wk-head" ' + cssVar(t.color) + '><span class="pill">' + t.id + '. Tema • Ünite Sınavı</span><h1>' + esc(t.title) + '</h1></div>';
    return { html: html + paperHtml('6. Sınıf Matematik – ' + t.id + '. Tema: ' + t.title, 'Ünite sınavı • ' + qs.length + ' soru • Süre: 40 dakika', qs, t.color), after: wirePaper };
  }

  function viewAbout() {
    return '<h1>Hakkında</h1><div class="card"><p>Bu uygulama, MEB Talim ve Terbiye Kurulu’nun <b>Türkiye Yüzyılı Maarif Modeli Ortaokul Matematik Dersi (6. Sınıf)</b> öğretim programındaki <b>2–6. temalar</b> için hazırlanmıştır: İşlemlerle Cebirsel Düşünme ve Değişimler, Geometrik Şekiller, Geometrik Nicelikler, İstatistiksel Araştırma Süreci, Veriden Olasılığa.</p><ul><li>Her haftalık konuda: öğrenme çıktıları, ders akışı, çözümlü örnekler ve etkinlik önerileri.</li><li>Her konu için <b>5 test</b> (6’şar soru) ve bir <b>10 soruluk sınav kâğıdı</b>; her ünite için ayrıca <b>20 soruluk ünite sınavı</b>.</li><li>Sınav kâğıdını “Yazdır / PDF” düğmesiyle çıktı alabilirsiniz; cevap anahtarı ayrı sayfada yer alır.</li><li>1. temanın PDF’i yüklenmediği için (Sayılar ve Nicelikler) bu sürümde yer almaz.</li></ul><p class="note">Haftalara bölme, dersin ders saatlerine göre öneridir. Sorular programatik olarak üretilir; sayılar her testte farklıdır ve cevaplar otomatik hesaplanır.</p></div>';
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
    if (p[0] === '' ) out = { html: viewHome() };
    else if (p[0] === 'hakkinda') out = { html: viewAbout() };
    else if (p[0] === 'tema' && p[2] === 'sinav' && temaOf(+p[1])) out = viewTemaExam(+p[1]);
    else if (p[0] === 'hafta' && weekOf(+p[1])) {
      var w = weekOf(+p[1]);
      if (!p[2]) out = { html: viewLesson(w) };
      else if (p[2] === 'testler') out = { html: viewTests(w) };
      else if (p[2] === 'test') { var k = +p[3]; out = (k >= 1 && k <= QZ.TEST_COUNT) ? viewTest(w, k) : { html: viewTests(w) }; }
      else if (p[2] === 'sinav') out = viewExam(w);
      else out = { html: viewLesson(w) };
    } else out = { html: '<h1>Sayfa bulunamadı</h1><p><a href="#/">Ana sayfaya dön</a></p>' };
    app.innerHTML = out.html;
    hydrate();
    if (out.after) out.after();
    document.title = '6. Sınıf Matematik' + (p[0] === 'hafta' && weekOf(+p[1]) ? ' – ' + weekOf(+p[1]).title : '');
  }
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });
  route();
})();
