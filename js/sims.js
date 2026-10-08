/* Simülasyonlar ve sesli-animasyonlu mini videolar */
(function () {
  'use strict';
  var VH = window.VH, VISW = window.VISW, VIS = window.VIS, N = MC.num, F = MC.frac;
  var sv = VH.sv, R = VH.R, T = VH.T, Ln = VH.Ln, Ar = VH.Ar, P = VH.P, C = VH.C;
  function addv(no, t, h, open) { (VIS[no] = VIS[no] || []).push({ t: t, h: h, open: !!open }); }
  function shell(el, title, controls, extra) { el.innerHTML = '<div class="sim"><h4>' + title + '</h4><div class="row">' + controls + '</div><div class="sout"></div>' + (extra || '') + '</div>'; return el.querySelector('.sout'); }
  function rng(el, id, label, min, max, step, val, unit) { return '<label>' + label + ' <b id="' + id + 'v">' + val + '</b>' + (unit || '') + '</label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" style="width:150px">'; }
  function bind(el, ids, fn) { ids.forEach(function (id) { var e = el.querySelector('#' + id); e.oninput = function () { var o = el.querySelector('#' + id + 'v'); if (o) o.textContent = N(+e.value); fn(); }; }); fn(); }
  function val(el, id) { return +el.querySelector('#' + id).value; }
  function row() { return '<div class="vrow">' + [].slice.call(arguments).join('') + '</div>'; }
  function stat(lines) { return '<div class="vstat">' + lines.join('') + '</div>'; }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  // ---- 1) Açı gezgini ----
  VISW.parallel = function (el) {
    var out = shell(el, '📐 Açı gezgini: paralel doğrular ve kesen', rng(el, 'pa', 'a açısı =', 30, 150, 5, 120, '°'));
    bind(el, ['pa'], function () {
      var A = val(el, 'pa'), labs = {}; 'abcdefgh'.split('').forEach(function (l) { labs[l] = ('adeh'.indexOf(l) >= 0 ? A : 180 - A) + '°'; });
      out.innerHTML = row(MC.parallelFig(A, labs), stat(['<div>a = d = e = h = <b>' + A + '°</b></div>', '<div>b = c = f = g = <b>' + (180 - A) + '°</b></div>', '<div>a + b = ' + A + '° + ' + (180 - A) + '° = <b>180°</b></div>', '<div class="note">Yöndeş, iç ters, dış ters ve ters açılar eşittir.</div>']));
    });
  };
  // ---- 2) Üçgenin açıları ----
  VISW.tri = function (el) {
    var out = shell(el, '🔺 Üçgenin açıları toplamı', rng(el, 'ta', 'A =', 20, 120, 5, 60, '°') + rng(el, 'tb', 'B =', 20, 120, 5, 70, '°'));
    bind(el, ['ta', 'tb'], function () {
      var a = val(el, 'ta'), b = val(el, 'tb'), g = 180 - a - b;
      if (g < 10) { out.innerHTML = '<p class="note">⚠️ A + B çok büyük: üçüncü açı en az 10° olmalı. Birini küçültün.</p>'; return; }
      var ra = a * Math.PI / 180, rb = b * Math.PI / 180, d = Math.sin(rb) / Math.sin(ra + rb), pts = [[0, 0], [1, 0], [d * Math.cos(ra), -d * Math.sin(ra)]];
      var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; }), mnx = Math.min.apply(null, xs), mxx = Math.max.apply(null, xs), mny = Math.min.apply(null, ys), mxy = Math.max.apply(null, ys);
      var s = Math.min(260 / (mxx - mnx), 150 / (mxy - mny)), q = pts.map(function (p) { return [30 + (p[0] - mnx) * s, 170 + (p[1] - mxy) * s]; });
      var fig = sv(320, 190, P(q, 'la') + T(q[0][0] + 22, q[0][1] - 6, a + '°', { w: 1, s: 12 }) + T(q[1][0] - 24, q[1][1] - 6, b + '°', { w: 1, s: 12 }) + T(q[2][0], q[2][1] + 18, g + '°', { w: 1, s: 12 }));
      out.innerHTML = row(fig, stat(['<div>' + a + '° + ' + b + '° + ' + g + '°</div>', '<div class="big">= 180°</div>', '<div class="note">Açıları değiştir: üçüncü açı hep 180°’yi tamamlar.</div>']));
    });
  };
  // ---- 3) Paralelkenar: kaydırınca alan değişmez ----
  VISW.area = function (el) {
    var out = shell(el, '▱ Paralelkenarı kaydır: alan değişir mi?', rng(el, 'ab', 'taban =', 3, 9, 1, 6, ' cm') + rng(el, 'ah', 'yükseklik =', 2, 6, 1, 4, ' cm') + rng(el, 'as', 'kaydırma =', -4, 4, 1, 2, ' cm'));
    bind(el, ['ab', 'ah', 'as'], function () {
      var b = val(el, 'ab'), h = val(el, 'ah'), s = val(el, 'as'), u = 24, x0 = 70, y0 = 20 + h * u, side = Math.sqrt(h * h + s * s);
      var fig = sv(380, 20 + h * u + 36, P([[x0, y0], [x0 + b * u, y0], [x0 + b * u + s * u, y0 - h * u], [x0 + s * u, y0 - h * u]], 'la') + Ln(x0 + s * u, y0 - h * u, x0 + s * u, y0, 'trans', true) + T(x0 + b * u / 2, y0 + 18, b + ' cm', { w: 1 }) + T(x0 + s * u - 6, y0 - h * u / 2, h + ' cm', { a: 'end', w: 1 }));
      out.innerHTML = row(fig, stat(['<div>Alan = taban × yükseklik</div><div class="big">' + b + ' × ' + h + ' = ' + b * h + ' cm²</div>', '<div>Yan kenar: ' + N(Math.round(side * 100) / 100) + ' cm (değişiyor)</div>', '<div class="note">Kaydırınca yan kenar değişir ama <b>alan değişmez</b>.</div>']));
    });
  };
  // ---- 4) Üçgen: tepe noktasını kaydır ----
  VISW.tarea = function (el) {
    var out = shell(el, '△ Tepeyi kaydır: üçgenin alanı değişir mi?', rng(el, 'tb', 'taban =', 4, 10, 1, 8, ' cm') + rng(el, 'th', 'yükseklik =', 2, 6, 1, 4, ' cm') + rng(el, 'tp', 'tepe konumu =', 0, 10, 1, 3));
    bind(el, ['tb', 'th', 'tp'], function () {
      var b = val(el, 'tb'), h = val(el, 'th'), p = Math.min(val(el, 'tp'), b + 2), u = 24, x0 = 30, y0 = 20 + h * u;
      var fig = sv(340, 20 + h * u + 34, P([[x0, y0], [x0 + b * u, y0], [x0 + p * u, y0 - h * u]], 'lb') + Ln(x0 + p * u, y0 - h * u, x0 + p * u, y0, 'trans', true) + T(x0 + b * u / 2, y0 + 18, b + ' cm', { w: 1 }));
      out.innerHTML = row(fig, stat(['<div>Alan = (taban × yükseklik) ÷ 2</div><div class="big">(' + b + ' × ' + h + ') ÷ 2 = ' + N(b * h / 2) + ' cm²</div>', '<div class="note">Tepe aynı yükseklikte kaldıkça alan <b>sabit</b>.</div>']));
    });
  };
  // ---- 5) Çember: çevre / çap sabittir ----
  VISW.circle = function (el) {
    var out = shell(el, '⭕ Çemberin çapını değiştir: Ç ÷ d hep aynı mı?', rng(el, 'cd', 'çap d =', 1, 20, 1, 8, ' cm'));
    bind(el, ['cd'], function () {
      var d = val(el, 'cd'), r = 8 + d * 4, C2 = Math.round(3.14 * d * 100) / 100, fig = sv(260, 2 * r + 30, '<circle cx="130" cy="' + (r + 12) + '" r="' + r + '" class="sk la"/>' + Ln(130 - r, r + 12, 130 + r, r + 12, 'trans') + T(130, r + 6, 'd', { w: 1 }));
      out.innerHTML = row(fig, stat(['<div>Çevre Ç = π · d = 3,14 · ' + d + '</div><div class="big">' + N(C2) + ' cm</div>', '<div>Ç ÷ d = <b>3,14</b></div>', '<div class="note">Çap kaç olursa olsun oran sabit: π.</div>']));
    });
  };
  // ---- 6) Ortalama ve ortanca ----
  VISW.mean = function (el) {
    var ids = ['m1', 'm2', 'm3', 'm4', 'm5'], ctl = ids.map(function (id, i) { return rng(el, id, 'Veri ' + (i + 1), 1, 20, 1, [3, 5, 7, 9, 6][i]); }).join('');
    var out = shell(el, '📊 Verileri değiştir: ortalama, ortanca, açıklık', ctl);
    bind(el, ids, function () {
      var v = ids.map(function (id) { return val(el, id); }), s = v.slice().sort(function (a, b) { return a - b; }), m = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
      var bars = v.map(function (x, i) { return R(20 + i * 56, 150 - x * 6.5, 44, x * 6.5, ['fa', 'fb', 'fc', 'fd', 'fe'][i], x); }).join('') + Ln(10, 150 - m * 6.5, 300, 150 - m * 6.5, 'trans', true) + T(298, 150 - m * 6.5 - 5, 'ort. ' + N(Math.round(m * 100) / 100), { a: 'end', w: 1, s: 11 });
      out.innerHTML = row(sv(310, 165, bars), stat(['<div>Ortalama = ' + v.join(' + ') + ' ÷ 5 = <b>' + N(Math.round(m * 100) / 100) + '</b></div>', '<div>Ortanca (sıralı: ' + s.join(', ') + ') = <b>' + s[2] + '</b></div>', '<div>Açıklık = ' + s[4] + ' − ' + s[0] + ' = <b>' + (s[4] - s[0]) + '</b></div>']));
    });
  };
  // ---- 7) Doğru orantı ----
  VISW.line = function (el) {
    var out = shell(el, '📈 Orantı sabitini değiştir: y = k · x', rng(el, 'lk', 'k =', 1, 6, 1, 3));
    bind(el, ['lk'], function () {
      var k = val(el, 'lk'), fig = VH.coord(0, 6, 34, function (X, Y) { var xe = Math.min(6, 6 / k); return Ln(X(0), Y(0), X(xe), Y(xe * k), 'ln trans') + [1, 2, 3, 4, 5, 6].filter(function (x) { return x * k <= 6; }).map(function (x) { return C(X(x), Y(x * k), 4, 'fd'); }).join(''); });
      out.innerHTML = row(fig, stat(['<div>y = ' + k + ' · x</div>', '<table class="tbl"><tr><th>x</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>y</th><td>' + k + '</td><td>' + 2 * k + '</td><td>' + 3 * k + '</td><td>' + 4 * k + '</td></tr></table>', '<div class="note">y ÷ x = ' + k + ' (sabit). Grafik orijinden geçer.</div>']));
    });
  };
  // ---- 8) Yansıma ----
  VISW.reflect = function (el) {
    var out = shell(el, '🪞 Noktanın simetriği', '<label>Ayna: <select id="rm"><option value="x">x ekseni</option><option value="y">y ekseni</option><option value="k">x = k doğrusu</option></select></label>' + rng(el, 'rx', 'x =', -5, 5, 1, 2) + rng(el, 'ry', 'y =', -5, 5, 1, 3) + rng(el, 'rk', 'k =', -4, 4, 1, 3));
    el.querySelector('#rm').onchange = function () { el.querySelector('#rx').oninput(); };
    bind(el, ['rx', 'ry', 'rk'], function () {
      var m = el.querySelector('#rm').value, x = val(el, 'rx'), y = val(el, 'ry'), k = val(el, 'rk'), x2 = m === 'x' ? x : m === 'y' ? -x : 2 * k - x, y2 = m === 'x' ? -y : y;
      var fig = VH.coord(-6, 6, 26, function (X, Y) { var mir = m === 'x' ? Ln(X(-6), Y(0), X(6), Y(0), 'ln trans') : m === 'y' ? Ln(X(0), Y(-6), X(0), Y(6), 'ln trans') : Ln(X(k), Y(-6), X(k), Y(6), 'ln trans'); var ok = Math.abs(x2) <= 6 && Math.abs(y2) <= 6; return mir + C(X(x), Y(y), 6, 'fa') + T(X(x) + 12, Y(y) - 6, 'P', { w: 1 }) + (ok ? Ln(X(x), Y(y), X(x2), Y(y2), 'ln', true) + C(X(x2), Y(y2), 6, 'fd') + T(X(x2) + 12, Y(y2) - 6, 'P′', { w: 1 }) : ''); });
      out.innerHTML = row(fig, stat(['<div>P(' + x + ', ' + y + ') → P′(<b>' + x2 + ', ' + y2 + '</b>)</div>', '<div class="note">' + (m === 'x' ? '(x, y) → (x, −y)' : m === 'y' ? '(x, y) → (−x, y)' : 'x = ' + k + ' için: (2·' + k + ' − x, y)') + '</div>']));
    });
  };
  // ---- 9) Yüzde ve indirim ----
  VISW.percent = function (el) {
    var out = shell(el, '％ Yüzde ve indirim', rng(el, 'pp', 'yüzde =', 0, 100, 5, 25, '%') + '<label>Fiyat: <select id="pt"><option>200</option><option selected>400</option><option>500</option><option>800</option></select> TL</label>');
    el.querySelector('#pt').onchange = function () { el.querySelector('#pp').oninput(); };
    bind(el, ['pp'], function () {
      var p = val(el, 'pp'), t = +el.querySelector('#pt').value, g = ''; for (var i = 0; i < 100; i++) g += R(6 + (i % 10) * 16, 6 + Math.floor(i / 10) * 16, 14, 14, i < p ? 'fd' : 'lg');
      out.innerHTML = row(sv(180, 176, g), stat(['<div>%' + p + ' = ' + p + '/100</div>', '<div>' + t + ' TL’nin %' + p + '’i = <b>' + N(t * p / 100) + ' TL</b></div>', '<div>%' + p + ' indirimle ödenecek: <b>' + N(t - t * p / 100) + ' TL</b></div>', '<div>%' + p + ' zamla yeni fiyat: <b>' + N(t + t * p / 100) + ' TL</b></div>']));
    });
  };
  // ---- 10) Kesir toplama ----
  VISW.frac = function (el) {
    var out = shell(el, '🍰 Kesir toplama', rng(el, 'fa', 'pay₁', 1, 7, 1, 1) + rng(el, 'fb', 'payda₁', 2, 8, 1, 3) + rng(el, 'fc', 'pay₂', 1, 7, 1, 1) + rng(el, 'fd', 'payda₂', 2, 8, 1, 4));
    bind(el, ['fa', 'fb', 'fc', 'fd'], function () {
      var b1 = val(el, 'fb'), b2 = val(el, 'fd'), a1 = Math.min(val(el, 'fa'), b1), a2 = Math.min(val(el, 'fc'), b2), L = b1 * b2 / gcd(b1, b2), n1 = a1 * L / b1, n2 = a2 * L / b2, n = n1 + n2, g = gcd(n, L);
      function bar(a, b, y, cls) { var s = ''; for (var i = 0; i < b; i++) s += R(10 + i * 300 / b, y, 300 / b, 26, i < a ? cls : 'lg'); return s; }
      var f2 = sv(330, 120, bar(n1, L, 6, 'fa') + (function () { var s = ''; for (var i = 0; i < L; i++) s += R(10 + i * 300 / L, 44, 300 / L, 26, i < n2 ? 'fb' : 'lg'); return s; })() + (function () { var s = ''; for (var i = 0; i < L; i++) s += R(10 + i * 300 / L, 82, 300 / L, 26, i < n ? 'fc' : 'lg'); return s; })());
      out.innerHTML = row(f2, stat(['<div>' + F(a1, b1) + ' + ' + F(a2, b2) + '</div>', '<div>= ' + F(n1, L) + ' + ' + F(n2, L) + ' = ' + F(n, L) + '</div>', '<div class="big">' + (n / g === L / g ? '' : '') + (L / g === 1 ? n / g : F(n / g, L / g)) + '</div>', '<div class="note">Paydalar eşitlenir (ortak payda ' + L + '), paylar toplanır.</div>']));
    });
  };
  // ---- 11) Merkez açı: görsel ek (zaten arc/prism var) ----

  // ============ MİNİ VİDEOLAR ============
  var SC = function (svg, text, dur) { return { svg: svg, text: text, dur: dur }; };
  var wheelSvg = function () { return sv(420, 140, Ln(10, 100, 410, 100) + '<g class="wheel"><circle cx="50" cy="65" r="35" class="sk la"/><line x1="50" y1="65" x2="50" y2="30" class="ln trans"/><circle cx="50" cy="65" r="3" class="pt"/></g>' + [0, 1, 2].map(function (i) { return R(50 + i * 70, 104, 70, 9, ['fa', 'fb', 'fc'][i]); }).join('') + R(260, 104, 10, 9, 'fd') + T(85, 130, 'd', { w: 1 }) + T(155, 130, 'd', { w: 1 }) + T(225, 130, 'd', { w: 1 }) + T(266, 130, '0,14d', { s: 10 })); };
  var VIDEOS = window.VIDEOS = {
    pi: { title: 'Çemberin uzunluğu ve π', sc: [
      SC(sv(300, 160, '<circle cx="150" cy="80" r="62" class="sk la"/>' + Ln(88, 80, 212, 80, 'trans') + T(150, 74, 'd (çap)', { w: 1 }) + T(150, 156, 'Ç (çevre)', { w: 1 })), 'Çemberin çevresine çember uzunluğu, tam ortadan geçen doğru parçasına çap denir.', 4500),
      SC(wheelSvg(), 'Çemberi düz bir çizgide tam bir tur yuvarlayalım. Yerde bıraktığı iz, çemberin uzunluğudur.', 5500),
      SC(sv(380, 120, [0, 1, 2].map(function (i) { return R(20 + i * 100, 30, 98, 30, ['fa', 'fb', 'fc'][i], 'd', 16); }).join('') + R(320, 30, 14, 30, 'fd') + T(327, 80, '0,14d', { s: 12 }) + T(190, 105, 'Çember uzunluğu ≈ 3,14 · d', { w: 1, s: 15 })), 'İz, çapın tam üç katı ve biraz fazlasıdır. Yani yaklaşık 3,14 çap uzunluğundadır. Bu sayıya pi denir.', 6000),
      SC(sv(380, 130, T(190, 50, 'Ç = π · d', { s: 38, w: 1 }) + T(190, 95, 'd = 10 cm → Ç = 3,14 · 10 = 31,4 cm', { s: 15 })), 'Çemberin uzunluğu, pi çarpı çaptır. Çapı 10 santimetre olan çemberin uzunluğu 31 virgül 4 santimetre eder.', 6000)] },
    pk: { title: 'Paralelkenarın alanı', sc: [
      SC(sv(330, 150, P([[60, 120], [210, 120], [270, 20], [120, 20]], 'ld') + T(135, 140, 'taban', { s: 12 })), 'Bu bir paralelkenar. Alanını nasıl buluruz?', 3500),
      SC(sv(330, 150, P([[60, 120], [210, 120], [270, 20], [120, 20]], 'ld') + Ln(120, 20, 120, 120, 'trans', true) + T(135, 140, 'taban', { s: 12 }) + T(105, 75, 'h', { w: 1 })), 'Önce tabana dik olan yüksekliği çizelim.', 3500),
      SC(sv(330, 150, P([[60, 120], [210, 120], [270, 20], [120, 20]], 'ld') + '<polygon class="pk-move sk la" points="60,120 120,120 120,20"/>' + Ln(120, 20, 120, 120, 'trans', true)), 'Oluşan dik üçgeni kesip diğer tarafa taşıyalım. Elimizde bir dikdörtgen oluştu.', 6000),
      SC(sv(380, 110, T(190, 48, 'Alan = taban × yükseklik', { s: 24, w: 1 }) + T(190, 88, 'Taban 12, yükseklik 5 ise alan = 60 cm²', { s: 14 })), 'Dikdörtgenin alanı taban çarpı yükseklik olduğundan, paralelkenarın alanı da taban çarpı yüksekliktir.', 6000)] },
    tri: { title: 'Üçgenin alanı', sc: [
      SC(sv(330, 150, P([[40, 120], [180, 120], [110, 20]], 'la') + T(110, 138, 'taban a', { s: 12 })), 'Bir üçgenin alanını bulmak için onu iki kez kullanacağız.', 3500),
      SC(sv(330, 150, P([[40, 120], [180, 120], [110, 20]], 'la') + '<polygon class="tri-rot sk lb" points="40,120 180,120 110,20"/>'), 'Üçgenin bir kopyasını 180 derece çevirip yanına koyalım.', 6000),
      SC(sv(330, 150, P([[40, 120], [180, 120], [250, 20], [110, 20]], 'ld') + Ln(110, 20, 110, 120, 'trans', true) + T(95, 75, 'h', { w: 1 })), 'İki eş üçgen birleşince bir paralelkenar oluşur. Paralelkenarın alanı taban çarpı yüksekliktir.', 5500),
      SC(sv(380, 110, T(190, 48, 'Alan = (a · h) ÷ 2', { s: 28, w: 1 }) + T(190, 88, 'Taban 10, yükseklik 6 → 30 cm²', { s: 14 })), 'Bir üçgen, paralelkenarın yarısıdır. Bu yüzden alanı taban çarpı yüksekliğin yarısıdır.', 5500)] },
    ang: { title: 'Paralel doğrular ve kesen', sc: [
      SC(MC.parallelFig(120, {}), 'İki paralel doğruyu bir doğru keserse sekiz açı oluşur.', 4000),
      SC(MC.parallelFig(120, { a: '!a', e: '!e' }), 'Aynı konumda duran açılara yöndeş açılar denir. Ölçüleri eşittir.', 5000),
      SC(MC.parallelFig(120, { d: '!d', e: '!e' }), 'Paralellerin arasında, kesenin zıt taraflarındaki açılar iç ters açılardır. Bunlar da eşittir.', 5500),
      SC(MC.parallelFig(120, { a: '!a', h: '!h' }), 'Paralellerin dışında, kesenin zıt taraflarındaki açılar dış ters açılardır. Onlar da eşittir.', 5500),
      SC(MC.parallelFig(120, { a: '120°', b: '60°' }), 'Yan yana duran açıların toplamı yüz seksen derecedir. Yüz yirmi artı altmış, yüz seksen eder.', 5500)] },
    sieve: { title: 'Asal sayılar: Eratosthenes kalburu', sc: (function () {
      var pr = function (n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
      function st(ps, mark) { return VH.gridN(100, 1, function (v) { if (v === 1) return 'lg'; if (ps.indexOf(v) >= 0) return 'fd'; for (var i = 0; i < ps.length; i++) if (v % ps[i] === 0) return 'lg'; return 'la'; }); }
      return [
        SC(VH.gridN(100, 1, function () { return 'la'; }), 'Birden yüze kadar sayıları yazdık. Asal sayıları bulmak için eleme yapacağız.', 4000),
        SC(VH.gridN(100, 1, function (v) { return v === 1 ? 'lg' : 'la'; }), 'Bir sayısı asal değildir, onu çiziyoruz.', 3500),
        SC(st([2]), 'İki asaldır; ama iki’nin diğer katları asal olamaz, hepsini eliyoruz.', 5000),
        SC(st([2, 3]), 'Sonraki sayı üç asaldır; üç’ün katlarını eliyoruz.', 5000),
        SC(st([2, 3, 5, 7]), 'Beş ve yedi için de aynısını yapıyoruz.', 5000),
        SC(VH.gridN(100, 1, function (v) { return pr(v) ? 'fd' : 'lg'; }), 'Geriye kalan pembe sayılar asaldır. Yüze kadar tam yirmi beş asal sayı vardır.', 6000)];
    })() },
    mean: { title: 'Aritmetik ortalama', sc: [
      SC(sv(300, 170, [3, 5, 7, 9].map(function (v, i) { return R(20 + i * 68, 150 - v * 14, 52, v * 14, ['fa', 'fb', 'fc', 'fd'][i], v); }).join('')), 'Dört arkadaşın bilyeleri: üç, beş, yedi ve dokuz.', 4000),
      SC(sv(300, 170, [3, 5, 7, 9].map(function (v, i) { return '<rect class="mb mb' + i + '" x="' + (20 + i * 68) + '" y="' + (150 - v * 14) + '" width="52" height="' + v * 14 + '" rx="3" style="--k:' + (84 / (v * 14)).toFixed(3) + ';transform-origin:' + (46 + i * 68) + 'px 150px"/>'; }).join('') + Ln(10, 66, 290, 66, 'trans', true)), 'Uzun sütunlardan alıp kısa olanlara verelim. Sonunda hepsi eşit olur.', 6500),
      SC(sv(380, 120, T(190, 40, '3 + 5 + 7 + 9 = 24', { s: 20, w: 1 }) + T(190, 80, '24 ÷ 4 = 6', { s: 26, w: 1 })), 'Toplam yirmi dört. Dört kişiye eşit paylaştırınca herkese altı düşer.', 5000),
      SC(sv(380, 100, T(190, 50, 'Ortalama = Toplam ÷ Veri sayısı', { s: 22, w: 1 })), 'İşte bu sayı aritmetik ortalamadır: verilerin toplamını veri sayısına böleriz.', 4500)] },
    frac: { title: 'Kesirlerde toplama', sc: [
      SC(VH.bars(4, 12, 320, 'fa'), 'Bir bütünün üçte biri, on ikide dört parçadır.', 4000),
      SC(VH.bars(4, 12, 320, 'fa') + VH.bars(3, 12, 320, 'fb'), 'Dörtte biri ise on ikide üç parçadır.', 4000),
      SC(VH.bars(4, 12, 320, 'fa') + VH.bars(3, 12, 320, 'fb') + sv(340, 40, T(170, 28, '1/3 = 4/12      1/4 = 3/12', { s: 18, w: 1 })), 'Paydaları eşitledik: üçte bir dört on iki, dörtte bir üç on iki yapar.', 5500),
      SC(VH.bars(7, 12, 320, 'fc') + sv(340, 50, T(170, 32, '4/12 + 3/12 = 7/12', { s: 22, w: 1 })), 'Paylar toplanır, payda aynen yazılır: dört on ikide artı üç on iki eşittir yedi on iki.', 6000)] },
    refl: { title: 'Yansıma dönüşümü', sc: [
      SC(VH.coord(-5, 5, 26, function (X, Y) { return VH.tri(X, Y, [[-4, 1], [-1, 1], [-3, 4]], 'la'); }), 'Koordinat düzleminde bir üçgen çizdik.', 3500),
      SC(VH.coord(-5, 5, 26, function (X, Y) { return VH.tri(X, Y, [[-4, 1], [-1, 1], [-3, 4]], 'la') + Ln(X(0), Y(-5), X(0), Y(5), 'ln trans'); }), 'Yansıma doğrumuz y ekseni. Bir ayna gibi düşünebiliriz.', 4000),
      SC(VH.coord(-5, 5, 26, function (X, Y) { return VH.tri(X, Y, [[-4, 1], [-1, 1], [-3, 4]], 'la') + Ln(X(0), Y(-5), X(0), Y(5), 'ln trans') + [[-4, 1], [-1, 1], [-3, 4]].map(function (q) { return Ln(X(q[0]), Y(q[1]), X(-q[0]), Y(q[1]), 'ln', true); }).join(''); }), 'Her noktadan aynaya dik inip, aynı uzaklıktan karşı tarafa geçiyoruz.', 5000),
      SC(VH.coord(-5, 5, 26, function (X, Y) { return VH.tri(X, Y, [[-4, 1], [-1, 1], [-3, 4]], 'la') + VH.tri(X, Y, [[4, 1], [1, 1], [3, 4]], 'lc') + Ln(X(0), Y(-5), X(0), Y(5), 'ln trans'); }), 'Görüntü oluştu. y eksenine göre yansımada x’in işareti değişir: (x, y) noktası (−x, y) olur.', 6000)] },
    pct: { title: 'Yüzde ve indirim', sc: [
      SC(VH.gridN(100, 1, function (v) { return v <= 25 ? 'fd' : 'lg'; }, 16).replace('<svg', '<svg style="max-width:200px"'), 'Yüz kareden yirmi beşi boyalı. Bu yüzde yirmi beş demektir.', 4500),
      SC(sv(380, 110, T(190, 40, '%25 = 25/100 = 1/4', { s: 22, w: 1 }) + T(190, 80, '400 TL’nin 1/4’ü = 100 TL', { s: 18 })), 'Yüzde yirmi beş, dörtte birdir. Dört yüz liranın dörtte biri yüz liradır.', 5500),
      SC(sv(360, 120, R(10, 15, 300, 34, 'fa', '400 TL (%100)') + R(10, 62, 225, 34, 'fb', '300 TL (%75)') + R(235, 62, 75, 34, 'fd', '100 TL')), 'Yüzde yirmi beş indirimde yüz lira düşülür. Ödenecek tutar üç yüz liradır.', 6000)] },
    prop: { title: 'Doğru orantı', sc: [
      SC(sv(380, 100, '<foreignObject x="20" y="10" width="340" height="80"><div xmlns="http://www.w3.org/1999/xhtml">' + MC.table(['Kalem (x)', '1', '2', '3', '5'], [['Fiyat (y)', '3', '6', '9', '15']]) + '</div></foreignObject>'), 'Bir kalem üç lira. İki kalem altı, üç kalem dokuz lira eder.', 4500),
      SC(sv(380, 100, T(190, 40, 'y ÷ x = 3', { s: 30, w: 1 }) + T(190, 78, '3/1 = 6/2 = 9/3 = 15/5', { s: 16 })), 'Her seferinde fiyatın kalem sayısına oranı üç. Bu sabit orana orantı sabiti denir.', 5500),
      SC(VH.coord(0, 6, 34, function (X, Y) { return Ln(X(0), Y(0), X(2), Y(6), 'ln trans') + [[1, 3], [2, 6]].map(function (q) { return C(X(q[0]), Y(q[1]), 5, 'fd'); }).join(''); }), 'Noktaları grafikte gösterirsek orijinden geçen bir doğru elde ederiz. Doğru orantının grafiği böyledir.', 6000)] },
    prism: { title: 'Prizmanın açınımı ve hacmi', sc: [
      SC(VH.cuboid(4, 3, 2, 24), 'Bu bir dikdörtgenler prizması. Altı yüzü vardır ve karşılıklı yüzler eştir.', 4500),
      SC((function () { var u = 26, a = 4, b = 3, c = 2, x0 = 8, y0 = 8 + b * u; return sv(x0 * 2 + (2 * a + 2 * b) * u, 16 + (2 * b + c) * u, R(x0 + b * u, 8, a * u, b * u, 'la', 'Üst') + R(x0, y0, b * u, c * u, 'lc', 'Sol') + R(x0 + b * u, y0, a * u, c * u, 'lb', 'Ön') + R(x0 + b * u + a * u, y0, b * u, c * u, 'lc', 'Sağ') + R(x0 + 2 * b * u + a * u, y0, a * u, c * u, 'lb', 'Arka') + R(x0 + b * u, y0 + c * u, a * u, b * u, 'la', 'Alt')); })(), 'Kutuyu açtığımızda altı dikdörtgenden oluşan açınımı elde ederiz.', 5500),
      SC(sv(400, 100, T(200, 40, 'Yüzey alanı = 2(ab + ac + bc)', { s: 22, w: 1 }) + T(200, 78, '4 × 3 × 2 → 2(12 + 8 + 6) = 52 cm²', { s: 15 })), 'Yüzey alanı, bütün yüzlerin alanları toplamıdır: iki çarpı, ab artı ac artı bc.', 6000),
      SC(sv(400, 100, T(200, 40, 'Hacim = a · b · c', { s: 26, w: 1 }) + T(200, 78, '4 · 3 · 2 = 24 cm³', { s: 16 })), 'Hacim ise üç ayrıtın çarpımıdır. Dört çarpı üç çarpı iki, yirmi dört birim küp eder.', 5500)] },
    arc: { title: 'Merkez açı ve yay uzunluğu', sc: [
      SC(sv(240, 200, '<circle cx="120" cy="100" r="80" class="sk la"/>' + Ln(120, 100, 200, 100) + Ln(120, 100, 120, 20) + '<path d="M200 100 A80 80 0 0 0 120 20" class="arc" fill="none" stroke="#e84393" stroke-width="4"/>' + T(150, 82, '90°', { w: 1 })), 'Köşesi çemberin merkezinde olan açıya merkez açı denir. Gördüğü çember parçası yaydır.', 5500),
      SC(sv(240, 200, '<circle cx="120" cy="100" r="80" class="sk la"/>' + Ln(120, 100, 200, 100) + Ln(120, 100, 120, 20) + '<path d="M200 100 A80 80 0 0 0 120 20" fill="none" stroke="#e84393" stroke-width="4"/>' + T(120, 190, '90° = 360°’nin 1/4’ü', { w: 1, s: 13 })), 'Doksan derece, tam açının dörtte biridir. Yay da çemberin dörtte biri kadardır.', 5500),
      SC(sv(400, 100, T(200, 40, 'Yay = (açı ÷ 360) · Çevre', { s: 22, w: 1 }) + T(200, 78, 'Çevre 72 cm, açı 50° → 50/360 · 72 = 10 cm', { s: 14 })), 'Yay uzunluğu, açının üç yüz altmışa oranı çarpı çemberin uzunluğudur.', 6000)] }
  };
  var VID_WEEK = { 20: 'pi', 17: 'pk', 18: 'tri', 12: 'ang', 3: 'sieve', 25: 'mean', 103: 'frac', 115: 'refl', 121: 'pct', 122: 'pct', 119: 'prop', 107: 'prism', 22: 'arc', 108: 'prism' };
  Object.keys(VID_WEEK).forEach(function (no) { addv(+no, '🎬 Kısa video: ' + VIDEOS[VID_WEEK[no]].title, '<div data-widget="video" data-id="' + VID_WEEK[no] + '"></div>', true); });

  VISW.video = function (el) {
    var v = VIDEOS[el.getAttribute('data-id')], sc = v.sc, i = 0, timer = null, playing = false, tot = sc.reduce(function (s, x) { return s + x.dur; }, 0), t0 = 0;
    el.innerHTML = '<div class="vid"><div class="vid-screen"><div class="vid-svg"></div><div class="vid-cap"></div><button class="vid-big">▶</button></div><div class="vid-ctl"><button class="btn sm" data-a="prev">⏮</button><button class="btn sm" data-a="play">▶ Oynat</button><button class="btn sm" data-a="next">⏭</button><div class="vid-prog">' + sc.map(function (x) { return '<i style="flex:' + x.dur + '"></i>'; }).join('') + '</div><label class="note"><input type="checkbox" id="snd"> 🔊 Sesli anlatım</label></div></div>';
    var svgBox = el.querySelector('.vid-svg'), cap = el.querySelector('.vid-cap'), segs = el.querySelectorAll('.vid-prog i'), big = el.querySelector('.vid-big'), playBtn = el.querySelector('[data-a=play]');
    function alive() { return document.body.contains(el); }
    function speak(t) { if (!el.querySelector('#snd').checked || !window.speechSynthesis) return; try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = 'tr-TR'; u.rate = .95; speechSynthesis.speak(u); } catch (e) { } }
    function show(k) { i = Math.max(0, Math.min(sc.length - 1, k)); svgBox.innerHTML = sc[i].svg; svgBox.className = 'vid-svg vid-in'; cap.textContent = sc[i].text; [].forEach.call(segs, function (s, j) { s.className = j < i ? 'done' : j === i ? 'cur' : ''; s.style.setProperty('--d', sc[j].dur + 'ms'); }); speak(sc[i].text); }
    function stop() { playing = false; clearTimeout(timer); playBtn.textContent = '▶ Oynat'; big.style.display = ''; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { } }
    function tick() { if (!alive()) { stop(); return; } timer = setTimeout(function () { if (i >= sc.length - 1) { stop(); return; } show(i + 1); tick(); }, sc[i].dur); }
    function play() { if (i >= sc.length - 1 && !playing) show(0); playing = true; playBtn.textContent = '⏸ Duraklat'; big.style.display = 'none'; if (!svgBox.innerHTML) show(0); else show(i); tick(); }
    el.querySelector('.vid-ctl').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; var a = b.getAttribute('data-a'); if (a === 'play') { playing ? stop() : play(); } else if (a === 'next') { clearTimeout(timer); show(i + 1); if (playing) tick(); } else if (a === 'prev') { clearTimeout(timer); show(i - 1); if (playing) tick(); } });
    el.querySelector('.vid-prog').onclick = function (e) { var r = this.getBoundingClientRect(), f = (e.clientX - r.left) / r.width, acc = 0, k = 0; for (; k < sc.length; k++) { acc += sc[k].dur / tot; if (f <= acc) break; } clearTimeout(timer); show(k); if (playing) tick(); };
    big.onclick = play; show(0);
  };

  // ---- Simülasyonları haftalara ekle ----
  addv(12, '🎮 Simülasyon: açı gezgini', '<div data-widget="parallel"></div>', false);
  addv(15, '🎮 Simülasyon: üçgenin açıları', '<div data-widget="tri"></div>', false);
  addv(17, '🎮 Simülasyon: paralelkenarı kaydır', '<div data-widget="area"></div>', false);
  addv(18, '🎮 Simülasyon: üçgenin tepesini kaydır', '<div data-widget="tarea"></div>', false);
  addv(20, '🎮 Simülasyon: çapı değiştir', '<div data-widget="circle"></div>', false);
  addv(25, '🎮 Simülasyon: verileri değiştir', '<div data-widget="mean"></div>', false);
  addv(26, '🎮 Simülasyon: verileri değiştir', '<div data-widget="mean"></div>', false);
  addv(112, '🎮 Simülasyon: verileri değiştir', '<div data-widget="mean"></div>', false);
  addv(103, '🎮 Simülasyon: kesir toplama', '<div data-widget="frac"></div>', false);
  addv(115, '🎮 Simülasyon: noktanın simetriği', '<div data-widget="reflect"></div>', false);
  addv(119, '🎮 Simülasyon: orantı sabiti', '<div data-widget="line"></div>', false);
  addv(121, '🎮 Simülasyon: yüzde', '<div data-widget="percent"></div>', false);
  addv(122, '🎮 Simülasyon: indirim ve zam', '<div data-widget="percent"></div>', false);
})();
