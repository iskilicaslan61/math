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
      html += '<section class="tema" ' + cssVar(t.color) + '><div class="tema-h"><div><span class="pill">' + tn(t) + '. Tema • ' + t.hours + ' ders saati</span><h2>' + esc(t.title) + '</h2><p>' + esc(t.summary) + '</p></div><div class="tbtns"><a class="btn alt sm" href="#/tema/' + t.id + '/pekistirme">🔁 Pekiştirme Testleri</a> <a class="btn alt sm" href="#/tema/' + t.id + '/sinav">📝 Ünite Sınavı</a></div></div><div class="weeks">';
      ws.forEach(function (w) {
        var p = weekProgress(w.no);
        html += '<a class="wk" href="#/hafta/' + w.no + '"><div class="n">Hafta ' + wn(w) + '</div><div class="t">' + (load('done:' + w.no, false) ? '✅ ' : '') + esc(w.title) + '</div><div class="m"><span>' + w.hours + ' ders saati</span><span>' + p + '/' + QZ.TEST_COUNT + ' test</span></div><div class="bar"><i style="width:' + p * 100 / QZ.TEST_COUNT + '%"></i></div></a>';
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
    var html = weekHead(w, 'ders') + '<div ' + cssVar(t.color) + '><div class="outcomes"><b>Öğrenme çıktıları:</b><ul>' + w.outcomes.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></div><div class="lesson"><div class="lesson-tools no-print"><button class="btn sm alt" id="allc">Tümünü kapat</button> <button class="btn sm alt" id="allo">Tümünü aç</button></div>';
    w.lesson.forEach(function (s, k) { html += '<div class="sec reveal"><h3><span class="snum">' + (k + 1) + '</span><span class="sico">' + secIcon(s.h) + '</span>' + esc(s.h) + '</h3>' + s.html + '</div>'; });
    if (window.VIS && VIS[w.no]) {
      html += '<div class="sec reveal vsec"><h3><span class="snum">★</span><span class="sico">🖼️</span>Görsellerle Öğren <small class="note">(başlıklara tıkla: aç / kapat)</small></h3>';
      VIS[w.no].forEach(function (v) { html += '<details class="fold"' + (v.open ? ' open' : '') + '><summary>' + v.t + '</summary><div class="foldbody">' + v.h + '</div></details>'; });
      html += '</div>';
    }
    var ex = window.EXTRA && EXTRA[w.no];
    if (ex) {
      html += '<div class="sec reveal"><h3><span class="snum">✔</span><span class="sico">📝</span>Kısa Özet</h3><ul class="ozet">' + ex.o.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
      html += '<div class="sec reveal"><h3><span class="snum">🌍</span><span class="sico">🏠</span>Günlük Hayatta</h3><p>' + ex.h + '</p></div>';
      html += '<div class="sec reveal"><h3><span class="snum">?</span><span class="sico">🤔</span>Biliyor muydun?</h3><div class="box tip">' + ex.m + '</div></div>';
    }
    html += '<div class="sec reveal"><h3><span class="snum">🧠</span><span class="sico">🎯</span>Kendimi Yokla</h3><p class="note">4 hızlı soru: bir şıkka tıkla, doğru cevap ve çözüm hemen görünsün.</p><div class="miniq" id="miniq"></div></div>';
    html += '</div><div class="donebox no-print"><button class="btn" id="anl">' + (load('done:' + w.no, false) ? '🎉 Tamamlandı!' : '✅ Konuyu anladım!') + '</button><span class="note">Bitirince tıkla, konfeti patlasın!</span></div><p><a class="btn" href="#/hafta/' + w.no + '/testler">Testlere geç →</a> <a class="btn alt" href="#/hafta/' + w.no + '/oyun">🎮 Oyun</a> <a class="btn alt" href="#/hafta/' + w.no + '/sinav">Sınav kâğıdı</a></p>';
    html += '<p class="note no-print">' + (i > 0 ? '<a href="#/hafta/' + GW[i - 1].no + '">← Hafta ' + wn(GW[i - 1]) + ': ' + esc(GW[i - 1].title) + '</a>' : '') + (i < GW.length - 1 ? ' &nbsp;|&nbsp; <a href="#/hafta/' + GW[i + 1].no + '">Hafta ' + wn(GW[i + 1]) + ': ' + esc(GW[i + 1].title) + ' →</a>' : '') + '</p></div>';
    return { html: html, after: function () { lessonFx(w); } };
  }
  function secIcon(h) {
    var m = [[/Açılış|Köprü|Hatırlatma/i, '🚀'], [/Etkinlik|Oyun|Proje/i, '🎯'], [/Örnek|Çözümlü/i, '✏️'], [/Dikkat|Hata/i, '⚠️'], [/Kural|Tanım|Nedir|Bağıntı|Formül/i, '📐'], [/Grafik|Tablo|Şekil|Görünüm/i, '📊'], [/Problem|Strateji/i, '🧩']];
    for (var i = 0; i < m.length; i++) if (m[i][0].test(h)) return m[i][1];
    return '📘';
  }
  function confetti(small) {
    var cols = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#8e44ad', '#ff9f1c'], box = document.createElement('div'); box.className = 'confetti';
    for (var i = 0; i < (small ? 24 : 70); i++) { var p = document.createElement('i'); p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length]; p.style.animationDelay = Math.random() * .6 + 's'; p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's'; p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)'; box.appendChild(p); }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 3500);
  }
  function lessonFx(w) {
    var secs = document.querySelectorAll('.sec.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .08 });
      [].forEach.call(secs, function (s) { io.observe(s); });
    } else [].forEach.call(secs, function (s) { s.classList.add('in'); });
    [].forEach.call(document.querySelectorAll('.sec h3'), function (h) { h.onclick = function () { h.parentNode.classList.toggle('closed'); }; });
    [].forEach.call(document.querySelectorAll('details.fold'), function (d) {
      function pop() { var els = d.querySelectorAll('svg.vis > *:not(defs)'); [].forEach.call(els, function (e, i) { e.classList.remove('pp'); void e.getBoundingClientRect; e.style.animationDelay = Math.min(i * 35, 1400) + 'ms'; e.classList.add('pp'); }); [].forEach.call(d.querySelectorAll('.hop'), function (e, i) { e.style.animationDelay = (i * 0.15) + 's'; }); }
      d.addEventListener('toggle', function () { if (d.open) pop(); }); if (d.open) pop();
    });
    var head = document.querySelector('.wk-head');
    if (head) { var sy = ['∑', 'π', '÷', '×', '+', '−', '√', '%', '=', '∞']; for (var i = 0; i < 8; i++) { var f = document.createElement('span'); f.className = 'fl'; f.textContent = sy[(i * 3 + w.no) % sy.length]; f.style.left = (8 + i * 12) + '%'; f.style.animationDelay = (i * .5) + 's'; f.style.fontSize = (18 + (i % 3) * 8) + 'px'; head.appendChild(f); } }
    var prog = document.getElementById('prog'); if (!prog) { prog = document.createElement('div'); prog.id = 'prog'; document.body.appendChild(prog); }
    window.onscroll = function () { var h = document.documentElement; var pr = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1); var p2 = document.getElementById('prog'); if (p2) p2.style.width = (pr * 100) + '%'; else window.onscroll = null; };
    var ac = document.getElementById('allc'), ao = document.getElementById('allo');
    if (ac) ac.onclick = function () { [].forEach.call(document.querySelectorAll('.sec'), function (s) { s.classList.add('closed'); }); };
    if (ao) ao.onclick = function () { [].forEach.call(document.querySelectorAll('.sec'), function (s) { s.classList.remove('closed'); }); };
    var mq = document.getElementById('miniq');
    if (mq) { var ms = QZ.buildMini(w, 4); mq.innerHTML = ms.map(function (q, i) { return '<div class="mq" data-i="' + i + '"><div class="mq-t"><b>' + (i + 1) + '.</b> ' + q.q + '</div>' + (q.fig || '') + '<div class="mq-o">' + q.opts.map(function (o, j) { return '<button type="button" data-j="' + j + '">' + LET[j] + ') ' + o + '</button>'; }).join('') + '</div><div class="mq-e hidden"></div></div>'; }).join('');
      mq.onclick = function (e) { var b2 = e.target.closest('button'); if (!b2) return; var box = b2.closest('.mq'), q = ms[+box.getAttribute('data-i')], j = +b2.getAttribute('data-j'); if (box.getAttribute('data-done')) return; box.setAttribute('data-done', 1); [].forEach.call(box.querySelectorAll('button'), function (x, k) { x.disabled = true; if (k === q.ans) x.classList.add('right'); else if (k === j) x.classList.add('wrong'); }); var ee = box.querySelector('.mq-e'); ee.classList.remove('hidden'); ee.innerHTML = (j === q.ans ? '✅ Doğru! ' : '❌ Doğru cevap ' + LET[q.ans] + '. ') + (q.exp || ''); if (j === q.ans) confetti(true); }; }
    var b = document.getElementById('anl');
    if (b) b.onclick = function () { confetti(); save('done:' + w.no, true); b.textContent = '🎉 Tamamlandı!'; };
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
    var h = '<div class="q" data-i="' + i + '"><div class="qn">' + (i + 1) + '</div><div class="qb"><div class="qt">' + q.q + '</div>' + (q.fig || '') + '<button type="button" class="solve-btn no-print">✏️ Beyaz sayfada çöz</button><ul class="opts">';
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
    root.addEventListener('click', function (e) {
      var box = e.target.closest('.q'); if (!box || !(e.target.closest('.solve-btn') || e.target.closest('.qt') || e.target.closest('.qn'))) return;
      var i = +box.getAttribute('data-i');
      openPad(qs[i], i + 1, 'q:' + w.no + ':' + k + ':' + i, { get: function () { var c = box.querySelector('input:checked'); return c ? +c.value : -1; }, set: function (j) { var inp = box.querySelectorAll('input')[j]; if (inp && !inp.disabled) { inp.checked = true; inp.dispatchEvent(new Event('change', { bubbles: true })); } }, locked: function () { return done; } });
    });
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


  // ---------------- Beyaz sayfa (soru çözme) ----------------
  var padMem = {}, pad = null;
  function openPad(q, num, key, sync) {
    if (!pad) {
      pad = document.createElement('div'); pad.id = 'pad'; pad.className = 'pad hidden';
      pad.innerHTML = '<div class="pad-top"><b id="padno"></b><span class="pad-hint">Parmağınla, kalemle ya da fareyle yaz</span><button class="btn sm" id="padx">✕ Kapat</button></div><div class="pad-q" id="padq"></div>' +
        '<div class="pad-tools"><button data-t="pen" class="on">✏️ Kalem</button><button data-t="eraser">🧽 Silgi</button>' +
        ['#111111', '#1d4ed8', '#dc2626', '#16a34a', '#d97706'].map(function (c, i) { return '<i class="sw' + (i === 0 ? ' on' : '') + '" data-c="' + c + '" style="background:' + c + '"></i>'; }).join('') +
        '<input type="range" id="padsz" min="1" max="12" value="3" title="Kalınlık"><select id="padbg"><option value="blank">Boş</option><option value="lined">Çizgili</option><option value="grid" selected>Kareli</option></select><button data-t="undo">↶ Geri al</button><button data-t="clear">🗑 Temizle</button></div>' +
        '<div class="pad-wrap grid" id="padwrap"><canvas id="padc"></canvas></div>';
      document.body.appendChild(pad);
      pad.querySelector('#padbg').onchange = function () { pad.querySelector('#padwrap').className = 'pad-wrap ' + this.value; };
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pad && !pad.classList.contains('hidden')) closePad(); });
    }
    var cv = pad.querySelector('#padc'), wrap = pad.querySelector('#padwrap'), ctx, tool = 'pen', color = '#111111', stack = [], drawing = false, last = null;
    pad.querySelector('#padno').textContent = 'Soru ' + num;
    var qh = '<div class="pq-text">' + q.q + '</div>' + (q.fig || '') + '<div class="pad-opts">' + q.opts.map(function (o, j) { return '<label><input type="radio" name="padopt" value="' + j + '"><b>' + LET[j] + ')</b> <span>' + o + '</span></label>'; }).join('') + '</div>';
    pad.querySelector('#padq').innerHTML = qh;
    var cur = sync && sync.get ? sync.get() : -1; [].forEach.call(pad.querySelectorAll('[name=padopt]'), function (r) { r.checked = (+r.value === cur); r.disabled = !!(sync && sync.locked && sync.locked()); r.onchange = function () { if (sync && sync.set) sync.set(+r.value); }; });
    pad.classList.remove('hidden'); document.body.classList.add('pad-open');
    function size() { var r = wrap.getBoundingClientRect(), dpr = window.devicePixelRatio || 1, w = Math.max(300, r.width), h = Math.max(240, r.height); var snap = cv.width ? cv.toDataURL() : padMem[key]; cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (snap) { var im = new Image(); im.onload = function () { ctx.drawImage(im, 0, 0, w, h); }; im.src = snap; } }
    cv.width = 0; size();
    function pos(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    cv.onpointerdown = function (e) { e.preventDefault(); cv.setPointerCapture(e.pointerId); drawing = true; stack.push(cv.toDataURL()); if (stack.length > 20) stack.shift(); last = pos(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(last[0] + .01, last[1] + .01); stroke(); };
    cv.onpointermove = function (e) { if (!drawing) return; var p = pos(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); stroke(); last = p; };
    cv.onpointerup = cv.onpointercancel = function () { drawing = false; padMem[key] = cv.toDataURL(); };
    function stroke() { var sz = +pad.querySelector('#padsz').value; ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'; ctx.strokeStyle = color; ctx.lineWidth = tool === 'eraser' ? sz * 5 : sz; ctx.stroke(); }
    pad.querySelector('.pad-tools').onclick = function (e) {
      var b = e.target.closest('button'), s = e.target.closest('.sw');
      if (s) { color = s.getAttribute('data-c'); tool = 'pen'; [].forEach.call(pad.querySelectorAll('.sw'), function (x) { x.classList.toggle('on', x === s); }); [].forEach.call(pad.querySelectorAll('[data-t=pen],[data-t=eraser]'), function (x) { x.classList.toggle('on', x.getAttribute('data-t') === 'pen'); }); return; }
      if (!b) return; var t = b.getAttribute('data-t');
      if (t === 'pen' || t === 'eraser') { tool = t; [].forEach.call(pad.querySelectorAll('[data-t=pen],[data-t=eraser]'), function (x) { x.classList.toggle('on', x === b); }); }
      else if (t === 'clear') { stack.push(cv.toDataURL()); ctx.clearRect(0, 0, cv.width, cv.height); padMem[key] = ''; }
      else if (t === 'undo' && stack.length) { var im = new Image(), u = stack.pop(); im.onload = function () { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(im, 0, 0); ctx.restore(); padMem[key] = cv.toDataURL(); }; im.src = u; }
    };
    pad.querySelector('#padx').onclick = closePad;
    function closePad() { padMem[key] = cv.toDataURL(); pad.classList.add('hidden'); document.body.classList.remove('pad-open'); }
  }

  // ---------------- Pekiştirme testleri ----------------
  function viewTemaTests(t) {
    var html = '<div class="crumbs"><a href="' + homeHref(t) + '">Yıllık Plan</a> › ' + tn(t) + '. Tema: ' + esc(t.title) + ' › Pekiştirme</div><div class="wk-head" ' + cssVar(t.color) + '><span class="pill">' + tn(t) + '. Tema • Pekiştirme Testleri</span><h1>' + esc(t.title) + '</h1></div><p class="lead">Konuların hepsinden karışık ' + QZ.TEST_COUNT + ' pekiştirme testi. Her testte ' + QZ.TEST_SIZE + ' soru var.</p><div class="testlist" ' + cssVar(t.color) + '>';
    for (var k = 1; k <= QZ.TEST_COUNT; k++) { var b = bestOf('p' + t.id, k); html += '<a class="tcard" href="#/tema/' + t.id + '/pekistirme/' + k + '"><span class="badge' + (b !== null && b >= QZ.TEST_SIZE - 2 ? ' good' : '') + '">' + (b === null ? 'Yeni' : 'En iyi ' + b + '/' + QZ.TEST_SIZE) + '</span><b>Pekiştirme ' + k + '</b><span>' + QZ.TEST_SIZE + ' soru • karışık</span></a>'; }
    return html + '</div>';
  }
  function viewTemaTest(t, k) {
    var qs = QZ.buildTemaTest(t.id, k), pw = { no: 'p' + t.id, tema: t.id };
    var html = '<div class="crumbs"><a href="' + homeHref(t) + '">Yıllık Plan</a> › ' + tn(t) + '. Tema › <a href="#/tema/' + t.id + '/pekistirme">Pekiştirme</a> › Test ' + k + '</div><div class="wk-head" ' + cssVar(t.color) + '><span class="pill">' + tn(t) + '. Tema • Pekiştirme ' + k + '/' + QZ.TEST_COUNT + '</span><h1>' + esc(t.title) + '</h1></div><div class="card" ' + cssVar(t.color) + ' id="quiz">';
    qs.forEach(function (q, i) { html += qHtml(q, i); });
    var nxt = k < QZ.TEST_COUNT ? '<a class="btn alt hidden" id="nxt" href="#/tema/' + t.id + '/pekistirme/' + (k + 1) + '">Sonraki test →</a>' : '<a class="btn alt hidden" id="nxt" href="#/tema/' + t.id + '/sinav">Ünite sınavına geç →</a>';
    html += '</div><div class="scorebar"><div id="sc" class="score">Cevapla: 0/' + qs.length + '</div><div><button class="btn" id="finish">Bitir ve Kontrol Et</button> <button class="btn alt hidden" id="retry">Tekrar dene</button> ' + nxt + '</div></div>';
    return { html: html, after: function () { wireQuiz(pw, k, qs); } };
  }

  // ---------------- Sınav kâğıdı ----------------
  function paperHtml(title, subtitle, qs, color) {
    var cnt = qs.length;
    var per = Math.round(100 / qs.length * 10) / 10;
    var h = '<div class="tools no-print" ' + cssVar(color) + '><button class="btn" id="sub">✅ Teslim Et</button><button class="btn alt" id="rs">↺ Sıfırla</button><button class="btn alt" id="pr">🖨️ Yazdır / PDF</button><button class="btn alt" id="tk">Cevap anahtarını göster</button><span class="note" id="tm">⏱ 00:00</span><span class="note">Online çözmek için şıkları işaretleyip “Teslim Et”e basın. Her soru ' + MC.num(per) + ' puandır.</span></div><div id="result" class="result hidden no-print"></div>';
    h += '<article class="paper"><div class="ph"><h2>' + esc(title) + '</h2><small>' + esc(subtitle) + '</small></div><div class="pinfo"><div>Adı Soyadı: <input id="stname" class="no-print-in" maxlength="40" placeholder="adını yaz"></div><div>Sınıfı / No:</div><div>Tarih:</div></div>';
    qs.forEach(function (q, i) {
      h += '<div class="pq" data-i="' + i + '"><div class="pn">' + (i + 1) + '.</div><div><div>' + q.q + ' <span class="pp">(' + MC.num(per) + ' p)</span></div>' + (q.fig || '') + '<button type="button" class="solve-btn no-print">✏️ Beyaz sayfada çöz</button><div class="popts">';
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
    document.querySelector('.paper').addEventListener('click', function (e) {
      var box = e.target.closest('.pq'); if (!box || !(e.target.closest('.solve-btn') || e.target.closest('.pn') || (e.target.closest('.pq > div:nth-child(2) > div:first-child')))) return;
      var i = +box.getAttribute('data-i');
      openPad(qs[i], i + 1, 'p:' + id + ':' + i, { get: function () { var c = box.querySelector('input:checked'); return c ? +c.value : -1; }, set: function (j) { var inp = box.querySelectorAll('input')[j]; if (inp && !inp.disabled) { inp.checked = true; } }, locked: function () { return done; } });
    });
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
    return '<h1>Hakkında</h1><div class="card"><p>Bu uygulama, <b>6. ve 7. sınıf matematik</b> konularını hafta hafta öğretmek için hazırlanmıştır: <b>6. sınıf 6 tema, 7. sınıf 6 ünite</b>. 6. sınıf: Sayılar ve Nicelikler (1), İşlemlerle Cebirsel Düşünme ve Değişimler, Geometrik Şekiller, Geometrik Nicelikler, İstatistiksel Araştırma Süreci, Veriden Olasılığa.</p><ul><li>Her haftalık konuda: öğrenme çıktıları, ders akışı, çözümlü örnekler ve etkinlik önerileri.</li><li>Her konu için <b>5 test</b> (20’şer soru), her konu için <b>Kahoot tarzı oyun</b> ve bir <b>10 soruluk sınav kâğıdı</b>; her ünite için ayrıca <b>20 soruluk ünite sınavı</b>.</li><li>Sınav kâğıdını “Yazdır / PDF” düğmesiyle çıktı alabilirsiniz; cevap anahtarı ayrı sayfada yer alır.</li></ul><p class="note">Haftalara bölme, dersin ders saatlerine göre öneridir. Sorular programatik olarak üretilir; sayılar her testte farklıdır ve cevaplar otomatik hesaplanır.</p></div>';
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
      if (k === 'coin') coinSim(el); else if (k === 'dice') diceSim(el); else if (k === 'spinner') spinSim(el); else if (window.VISW && VISW[k]) VISW[k](el);
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
    else if (p[0] === 'tema' && p[2] === 'pekistirme' && temaOf(+p[1])) { var kk = +p[3]; out = (kk >= 1 && kk <= QZ.TEST_COUNT) ? viewTemaTest(temaOf(+p[1]), kk) : { html: viewTemaTests(temaOf(+p[1])) }; }
    else if (p[0] === 'hafta' && weekOf(+p[1])) {
      var w = weekOf(+p[1]);
      if (!p[2]) out = viewLesson(w);
      else if (p[2] === 'testler') out = { html: viewTests(w) };
      else if (p[2] === 'test') { var k = +p[3]; out = (k >= 1 && k <= QZ.TEST_COUNT) ? viewTest(w, k) : { html: viewTests(w) }; }
      else if (p[2] === 'oyun') out = viewGame(w);
      else if (p[2] === 'sinav') out = viewExam(w);
      else out = viewLesson(w);
    } else out = { html: '<h1>Sayfa bulunamadı</h1><p><a href="#/">Ana sayfaya dön</a></p>' };
    var pg = document.getElementById('prog'); if (pg) pg.remove(); window.onscroll = null;
    app.innerHTML = out.html;
    hydrate();
    if (out.after) out.after();
    document.title = 'Matematik' + (p[0] === 'hafta' && weekOf(+p[1]) ? ' ' + gr(weekOf(+p[1])) + '. Sınıf – ' + weekOf(+p[1]).title : p[0] === 'sinif7' ? ' 7. Sınıf' : ' 6. Sınıf');
  }
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });
  route();
})();
