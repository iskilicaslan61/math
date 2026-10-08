/* Oyunlar: menü, Balon Patlat, Doğru–Yanlış Sprinti, Hafıza Kartları (Kahoot tarzı oyun app.js içinde) */
(function () {
  'use strict';
  var X = window.APPX, LET = X.LET, esc = X.esc;
  function $(id) { return document.getElementById(id); }
  function plain(h) { var d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  function rec(w, name, qs, log, extra) { // log[i]: true/false/undefined
    if (!window.DB) return;
    var wrong = [], cs = '', ws = []; qs.forEach(function (q, i) { if (log[i] === undefined) return; ws.push(q.week || 0); cs += log[i] ? '1' : '0'; if (!log[i]) wrong.push('g|' + w.no + '|0|' + i); });
    var ok = cs.split('').filter(function (c) { return c === '1'; }).length;
    DB.record({ kind: 'oyun', ref: w.no + ':' + name, score: ok, total: Math.max(1, cs.length), dur: (extra && extra.dur) || 0, w: ws, c: cs, wrong: wrong, right: [] });
  }
  function shell(w, inner) { var t = X.temaOf(w.tema); return X.weekHead(w, 'oyun') + '<div class="game" ' + X.cssVar(t.color) + '><div id="gm">' + inner + '</div></div>'; }
  function backBtn(w) { return '<a class="btn alt" href="#/hafta/' + w.no + '/oyun">← Oyun menüsü</a>'; }

  // ---------- menü ----------
  X.gameMenu = function (w) {
    var base = '#/hafta/' + w.no + '/oyun/';
    var cards = [['🎮', 'Kahoot tarzı yarışma', 'Süreli sorular, hız puanı, takım modu', 'kahoot', '#8e44ad'], ['🎈', 'Balon Patlat', 'Doğru cevaplı balonu patlat; yanlışta can gider', 'balon', '#e84393'], ['⚡', 'Doğru–Yanlış Sprinti', 'Cevap doğru mu? Hızlı karar ver', 'dy', '#0984e3'], ['🃏', 'Hafıza Kartları', 'Soruyu cevabıyla eşleştir', 'hafiza', '#14a44d']];
    return { html: X.weekHead(w, 'oyun') + '<p class="lead">Bu konuyu oyunla pekiştir! Bir oyun seç:</p><div class="gmenu">' + cards.map(function (c) { return '<a class="gcard" href="' + base + c[3] + '" style="--k:' + c[4] + '"><span class="gi">' + c[0] + '</span><b>' + c[1] + '</b><small>' + c[2] + '</small></a>'; }).join('') + '</div>' };
  };

  // ---------- Balon Patlat ----------
  X.games.balon = function (w) {
    return { html: shell(w, ''), after: function () {
      var qs = QZ.buildGame(w).slice(0, 10), i = 0, lives = 3, score = 0, log = [], t0 = Date.now(), root = $('gm'), COL = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
      root.innerHTML = '<div class="g-panel"><h2>🎈 Balon Patlat</h2><p>Soruya bak, <b>doğru cevabı taşıyan balonu</b> patlat! Balonlar yukarı çıkıyor; doğru balon tavana ulaşırsa ya da yanlış balonu patlatırsan <b>can</b> kaybedersin. 3 canın var.</p><button class="btn g-start" id="bgo">Başla ▶</button> ' + backBtn(w) + '</div>';
      $('bgo').onclick = round;
      function hud() { return '<div class="g-top"><span>Soru ' + (i + 1) + '/' + qs.length + '</span><span>' + '❤️'.repeat(lives) + '🖤'.repeat(3 - lives) + '</span><span>⭐ ' + score + '</span></div>'; }
      function round() {
        if (i >= qs.length || lives <= 0) return end();
        var q = qs[i], dur = Math.max(6, 11 - i * 0.4), answered = false, st = Date.now();
        root.innerHTML = hud() + '<div class="g-q">' + q.q + (q.fig || '') + '</div><div class="sky" id="sky">' + q.opts.map(function (o, j) { return '<button class="balloon" data-j="' + j + '" style="left:' + (4 + j * 24.5) + '%;background:' + COL[j] + ';animation-duration:' + dur + 's"><span>' + o + '</span></button>'; }).join('') + '</div><div id="bfb"></div>';
        var sky = $('sky');
        function finish(good, why) {
          if (answered) return; answered = true; log[i] = good; var bs = sky.querySelectorAll('.balloon');
          [].forEach.call(bs, function (b, k) { b.disabled = true; b.style.animationPlayState = 'paused'; if (k === q.ans) b.classList.add('right'); });
          if (good) { score += 100 + Math.round(100 * Math.max(0, 1 - (Date.now() - st) / (dur * 1000))); } else lives--;
          $('bfb').innerHTML = '<div class="g-fb ' + (good ? 'ok' : 'no') + '"><div><b>' + (good ? '🎉 Patladı! +' : why) + '</b>' + (q.exp ? '<div class="g-exp">' + q.exp + '</div>' : '') + '</div><button class="btn" id="bnx">' + (i === qs.length - 1 || lives <= 0 ? 'Sonuç 🏁' : 'Sonraki ▶') + '</button></div>';
          $('bnx').onclick = function () { i++; round(); }; $('bnx').focus();
        }
        [].forEach.call(sky.querySelectorAll('.balloon'), function (b) { b.onclick = function () { var j = +b.getAttribute('data-j'); if (j === q.ans) { b.classList.add('pop'); finish(true); } else { b.classList.add('wrong'); finish(false, '❌ Yanlış balon. Doğru cevap ' + LET[q.ans] + ') ' + q.opts[q.ans]); } }; });
        sky.querySelector('.balloon[data-j="' + q.ans + '"]').addEventListener('animationend', function () { finish(false, '⏰ Doğru balon uçup gitti. Cevap ' + LET[q.ans] + ') ' + q.opts[q.ans]); });
      }
      function end() {
        rec(w, 'balon', qs, log, { dur: Math.round((Date.now() - t0) / 1000) });
        var ok = log.filter(Boolean).length;
        root.innerHTML = '<div class="g-panel g-end"><h2>🏁 Oyun bitti!</h2><p class="g-big">' + score + ' puan</p><p>' + ok + '/' + log.length + ' balon doğru patladı ' + (lives > 0 ? '— tüm soruları tamamladın! 🌟' : '— canların bitti, tekrar dene! 💪') + '</p><p><button class="btn" id="bag">Tekrar oyna</button> ' + backBtn(w) + '</p></div>';
        $('bag').onclick = function () { X.route(); };
      }
    } };
  };

  // ---------- Doğru–Yanlış Sprinti ----------
  X.games.dy = function (w) {
    return { html: shell(w, ''), after: function () {
      var qs = QZ.buildGame(w).slice(0, 16), rng = MC.makeRng('dy' + w.no + Date.now() % 997), flags = rng.shuffle(qs.map(function (_, i) { return i % 2 === 0; })), i = 0, score = 0, streak = 0, log = [], root = $('gm'), timer = null, t0 = Date.now();
      root.innerHTML = '<div class="g-panel"><h2>⚡ Doğru–Yanlış Sprinti</h2><p>Ekranda bir soru ve <b>önerilen bir cevap</b> görünecek. Cevap doğruysa ✅, yanlışsa ❌ seç. Süre: soru başına 10 saniye. Hızlı ve üst üste doğru bilirsen daha çok puan!</p><button class="btn g-start" id="dgo">Başla ▶</button> ' + backBtn(w) + '</div>';
      $('dgo').onclick = round;
      function round() {
        if (i >= qs.length) return end();
        var q = qs[i], truth = flags[i], shown = truth ? q.ans : (function () { var o = []; q.opts.forEach(function (_, j) { if (j !== q.ans) o.push(j); }); return o[(i * 7) % o.length]; })(), st = Date.now(), answered = false;
        root.innerHTML = '<div class="g-top"><span>Soru ' + (i + 1) + '/' + qs.length + '</span><span>🔥 ' + streak + '</span><span>⭐ ' + score + '</span></div><div class="g-bar"><i id="dbar"></i><b id="dsec">10</b></div><div class="g-q">' + q.q + (q.fig || '') + '<div class="dy-prop">Önerilen cevap: <b>' + q.opts[shown] + '</b></div></div><div class="dy-btns"><button class="dy-t" id="dyt">✅ Doğru</button><button class="dy-f" id="dyf">❌ Yanlış</button></div><div id="dfb"></div>';
        clearInterval(timer); timer = setInterval(function () { var left = Math.max(0, 10 - (Date.now() - st) / 1000), b = $('dbar'); if (!b) { clearInterval(timer); return; } b.style.width = left * 10 + '%'; $('dsec').textContent = Math.ceil(left); if (left <= 0) { clearInterval(timer); pick(null); } }, 100);
        $('dyt').onclick = function () { pick(true); }; $('dyf').onclick = function () { pick(false); };
        function pick(ans) {
          if (answered) return; answered = true; clearInterval(timer); var good = ans === truth; log[i] = good; var t = (Date.now() - st) / 1000, pts = 0;
          if (good) { streak++; pts = Math.round(100 * (1 - Math.min(1, t / 10) / 2)) + 20 * Math.min(streak - 1, 5); score += pts; } else streak = 0;
          $('dyt').disabled = $('dyf').disabled = true;
          $('dfb').innerHTML = '<div class="g-fb ' + (good ? 'ok' : 'no') + '"><div><b>' + (good ? '✅ Doğru bildin! +' + pts : (ans === null ? '⏰ Süre doldu' : '❌ Yanlış')) + '</b><div class="g-exp">Önerilen cevap ' + (truth ? 'doğruydu' : 'yanlıştı') + '. Doğru cevap: <b>' + LET[q.ans] + ') ' + q.opts[q.ans] + '</b>' + (q.exp ? '<br>' + q.exp : '') + '</div></div><button class="btn" id="dnx">' + (i === qs.length - 1 ? 'Sonuç 🏁' : 'Sonraki ▶') + '</button></div>';
          $('dnx').onclick = function () { i++; round(); }; $('dnx').focus();
        }
      }
      function end() { rec(w, 'dy', qs, log, { dur: Math.round((Date.now() - t0) / 1000) }); var ok = log.filter(Boolean).length; root.innerHTML = '<div class="g-panel g-end"><h2>🏁 Sprint bitti!</h2><p class="g-big">' + score + ' puan</p><p>' + ok + '/' + qs.length + ' doğru karar ' + (ok >= 14 ? '— harika! 🌟' : ok >= 10 ? '— iyi! 👏' : '— biraz daha tekrar 💪') + '</p><p><button class="btn" id="dag">Tekrar oyna</button> ' + backBtn(w) + '</p></div>'; $('dag').onclick = function () { X.route(); }; }
    } };
  };

  // ---------- Hafıza Kartları ----------
  X.games.hafiza = function (w) {
    return { html: shell(w, ''), after: function () {
      var all = QZ.buildGame(w), cand = [], seen = {}, root = $('gm');
      function pickBy(limit) { return all.map(function (q) { return { q: q, s: plain(q.q), a: plain(q.opts[q.ans]) }; }).filter(function (x) { return !x.q.fig && x.s.length <= limit && x.a.length <= 18 && !/\d+\s*\)\s*$/.test(x.s); }); }
      [60, 80, 110, 160].some(function (lim) { cand = []; seen = {}; pickBy(lim).forEach(function (x) { if (!seen[x.a] && cand.length < 6) { seen[x.a] = 1; cand.push(x); } }); return cand.length >= 6; });
      cand = cand.slice(0, 6);
      if (cand.length < 3) { root.innerHTML = '<div class="g-panel"><p>Bu konu için eşleştirmeye uygun soru bulunamadı. Başka bir oyunu dene.</p>' + backBtn(w) + '</div>'; return; }
      var rng = MC.makeRng('hf' + w.no + Date.now() % 991), cards = [];
      cand.forEach(function (x, k) { cards.push({ k: k, t: x.s.length > 90 ? x.s.slice(0, 88) + '…' : x.s, side: 'q' }); cards.push({ k: k, t: x.a, side: 'a' }); });
      cards = rng.shuffle(cards);
      var open = [], moves = 0, matched = 0, t0 = Date.now(), lock = false;
      root.innerHTML = '<div class="g-top"><span>🃏 Soruyu cevabıyla eşleştir</span><span id="hm">Hamle: 0</span><span id="hp">0/' + cand.length + '</span></div><div class="mem" id="mem">' + cards.map(function (c, j) { return '<button class="mcard" data-j="' + j + '"><span class="mf">❓</span><span class="mb ' + c.side + '"></span></button>'; }).join('') + '</div><p class="note" style="color:#d6c7f5">Mor kartlar soru, yeşil kartlar cevaptır.</p><div id="mfin"></div>';
      var els = root.querySelectorAll('.mcard'); [].forEach.call(els, function (e, j) { e.querySelector('.mb').textContent = cards[j].t; });
      $('mem').onclick = function (e) {
        var b = e.target.closest('.mcard'); if (!b || lock || b.classList.contains('flip') || b.classList.contains('done')) return;
        b.classList.add('flip'); open.push(b);
        if (open.length === 2) {
          moves++; $('hm').textContent = 'Hamle: ' + moves; var a = cards[+open[0].getAttribute('data-j')], c = cards[+open[1].getAttribute('data-j')];
          if (a.k === c.k && a.side !== c.side) { open.forEach(function (x) { x.classList.add('done'); }); open = []; matched++; $('hp').textContent = matched + '/' + cand.length; if (matched === cand.length) fin(); }
          else { lock = true; setTimeout(function () { open.forEach(function (x) { x.classList.remove('flip'); }); open = []; lock = false; }, 1000); }
        }
      };
      function fin() {
        var stars = moves <= cand.length + 3 ? 3 : moves <= cand.length * 2 + 2 ? 2 : 1, best = X.load('hf:' + w.no, null); if (best === null || moves < best) X.save('hf:' + w.no, moves);
        if (window.DB) DB.record({ kind: 'oyun', ref: w.no + ':hafiza', score: cand.length, total: cand.length, dur: Math.round((Date.now() - t0) / 1000), w: [], c: '', wrong: [], right: [] });
        X.confetti(); $('mfin').innerHTML = '<div class="g-panel g-end"><h2>🎉 Hepsini buldun!</h2><p class="g-big">' + '⭐'.repeat(stars) + '</p><p>' + moves + ' hamlede bitirdin (en iyi: ' + Math.min(best === null ? moves : best, moves) + ').</p><p><button class="btn" id="mag">Tekrar oyna</button> ' + backBtn(w) + '</p></div>'; $('mag').onclick = function () { X.route(); };
      }
    } };
  };
  X.route();
})();
