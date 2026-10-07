/* Konu anlatımları için görseller: her hafta için açılır-kapanır SVG çizimler ve etkileşimli araçlar */
(function () {
  'use strict';
  var N = MC.num, F = MC.frac;
  var VIS = window.VIS = {};
  function add(no, title, html, open) { (VIS[no] = VIS[no] || []).push({ t: title, h: html, open: !!open }); }

  // ---------- çizim yardımcıları ----------
  var DEFS = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#667085"/></marker></defs>';
  function sv(w, h, inner, cls) { return '<svg class="fig vis ' + (cls || '') + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img">' + DEFS + inner + '</svg>'; }
  function R(x, y, w, h, cls, t, ts) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="sk ' + (cls || 'la') + '" rx="2"/>' + (t !== undefined ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-size="' + (ts || 13) + '" class="' + ((cls || '').charAt(0) === 'f' ? 'tw' : '') + '">' + t + '</text>' : ''); }
  function T(x, y, t, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" class="' + (o.c || '') + '"' + (o.w ? ' font-weight="700"' : '') + '>' + t + '</text>'; }
  function Ln(x1, y1, x2, y2, c, dash) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (c || 'ln') + '"' + (dash ? ' stroke-dasharray="5 4"' : '') + '/>'; }
  function Ar(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#667085" stroke-width="2" marker-end="url(#ah)"/>'; }
  function P(pts, cls) { return '<polygon points="' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" class="sk ' + (cls || 'la') + '"/>'; }
  function C(x, y, r, cls) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="sk ' + (cls || 'la') + '"/>'; }
  function G(inner, cls, style) { return '<g class="' + (cls || '') + '"' + (style ? ' style="' + style + '"' : '') + '>' + inner + '</g>'; }
  function cap(t) { return '<p class="vcap">' + t + '</p>'; }
  function row() { return '<div class="vrow">' + [].slice.call(arguments).join('') + '</div>'; }
  function cards(items) { return '<div class="vcards">' + items.map(function (c) { return '<div class="vcard" style="--k:' + c[3] + '"><div class="vico">' + c[0] + '</div><b>' + c[1] + '</b><span>' + c[2] + '</span></div>'; }).join('') + '</div>'; }
  function flow(steps, colors) { // yatay akış şeması
    var w = 20 + steps.length * 130, s = '';
    steps.forEach(function (st, i) { var x = 10 + i * 130; s += (st[1] === 'o' ? '<ellipse cx="' + (x + 55) + '" cy="45" rx="55" ry="26" class="sk fa"/>' : st[1] === 'd' ? P([[x + 55, 15], [x + 110, 45], [x + 55, 75], [x, 45]], 'fc') : R(x, 20, 110, 50, (colors && colors[i]) || 'fb')) + T(x + 55, 50, st[0], { c: 'tw', s: 12 }); if (i < steps.length - 1) s += Ar(x + 112, 45, x + 128, 45); });
    return sv(w, 95, s, 'wide');
  }
  function gridN(n, lo, fn, cell) { // 1..100 tablo
    cell = cell || 24; var s = '';
    for (var i = 0; i < n; i++) { var v = lo + i, x = (i % 10) * cell + 5, y = Math.floor(i / 10) * cell + 5, c = fn(v) || 'lg'; s += R(x, y, cell - 2, cell - 2, c) + T(x + cell / 2 - 1, y + cell / 2 + 3, v, { s: 10, c: c.charAt(0) === 'f' ? 'tw' : '' }); }
    return sv(10 * cell + 10, Math.ceil(n / 10) * cell + 10, s);
  }
  function numLine(lo, hi, u, marks, hops) { // sayı doğrusu: marks [{v,l,c}], hops [{from,to,l}]
    var w = (hi - lo) * u + 40, y = 70, s = Ln(15, y, w - 10, y) + Ar(w - 30, y, w - 8, y);
    for (var v = lo; v <= hi; v++) s += Ln(20 + (v - lo) * u, y - 5, 20 + (v - lo) * u, y + 5) + T(20 + (v - lo) * u, y + 20, v, { s: 11 });
    (hops || []).forEach(function (h, i) { var x1 = 20 + (h.from - lo) * u, x2 = 20 + (h.to - lo) * u; s += '<path d="M' + x1 + ' ' + (y - 4) + ' Q' + (x1 + x2) / 2 + ' ' + (y - 34) + ' ' + x2 + ' ' + (y - 4) + '" fill="none" class="hop" pathLength="1" stroke="' + (h.c || '#4c4fef') + '" stroke-width="2" marker-end="url(#ah)"/>'; });
    (marks || []).forEach(function (m) { var x = 20 + (m.v - lo) * u; s += '<circle cx="' + x + '" cy="' + y + '" r="6" class="sk ' + (m.c || 'fd') + '"/>' + T(x, y - 14, m.l, { s: 12, w: 1 }); });
    return sv(w, 100, s, 'wide');
  }

  // izometrik küpler (üstten görünüm matrisi H[satır arka→ön][sütun])
  function iso(H, u) {
    u = u || 28; var A = u * 0.866, B = u * 0.5, cells = [], mx = 0, r, c, z;
    for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) { mx = Math.max(mx, H[r][c]); for (z = 0; z < H[r][c]; z++) cells.push([r, c, z]); }
    cells.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2]; });
    var ox = 3 * A + 8, oy = mx * u + 8, W = 6 * A + 16, Hh = 6 * B + mx * u + 16, s = '';
    function p(cc, rr, zz) { return [ox + (cc - rr) * A, oy + (cc + rr) * B - zz * u]; }
    cells.forEach(function (k) { var rr = k[0], cc = k[1], zz = k[2];
      s += P([p(cc, rr, zz + 1), p(cc + 1, rr, zz + 1), p(cc + 1, rr + 1, zz + 1), p(cc, rr + 1, zz + 1)], 'la');
      s += P([p(cc, rr + 1, zz), p(cc + 1, rr + 1, zz), p(cc + 1, rr + 1, zz + 1), p(cc, rr + 1, zz + 1)], 'lc');
      s += P([p(cc + 1, rr, zz), p(cc + 1, rr + 1, zz), p(cc + 1, rr + 1, zz + 1), p(cc + 1, rr, zz + 1)], 'fc'); });
    return sv(W, Hh, s);
  }
  function colsView(h, u, lbl) { u = u || 22; var s = '', mx = Math.max.apply(null, h.concat([1])); h.forEach(function (v, i) { for (var k = 0; k < v; k++) s += R(8 + i * u, 8 + (mx - 1 - k) * u, u, u, 'lb'); }); s += Ln(4, 8 + mx * u, 12 + h.length * u, 8 + mx * u); return sv(h.length * u + 16, mx * u + 40, s + T((h.length * u + 16) / 2, mx * u + 30, lbl || '', { s: 12, w: 1 })); }
  function topView(H, u) { u = u || 22; var s = ''; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) s += R(8 + c * u, 8 + r * u, u, u, H[r][c] ? 'la' : 'lg', H[r][c] || ''); return sv(3 * u + 16, 3 * u + 40, s + T((3 * u + 16) / 2, 3 * u + 30, 'Üstten', { s: 12, w: 1 })); }
  // çok yüzlü prizma (a: sağa, b: öne, h: yükseklik)
  function cuboid(a, b, h, u, cls3) {
    u = u || 22; var A = u * 0.866, B = u * 0.5, ox = b * A + 10, oy = h * u + 10, W = (a + b) * A + 20, Hh = (a + b) * B + h * u + 20;
    function p(c, r, z) { return [ox + (c - r) * A, oy + (c + r) * B - z * u]; }
    var cl = cls3 || ['la', 'lb', 'lc'];
    return sv(W, Hh, P([p(0, 0, h), p(a, 0, h), p(a, b, h), p(0, b, h)], cl[0]) + P([p(0, b, 0), p(a, b, 0), p(a, b, h), p(0, b, h)], cl[1]) + P([p(a, 0, 0), p(a, b, 0), p(a, b, h), p(a, 0, h)], cl[2]));
  }
  function pie(parts, r) {
    r = r || 80; var tot = parts.reduce(function (s, p) { return s + p.v; }, 0), a = -Math.PI / 2, s = '';
    parts.forEach(function (p) { var a2 = a + p.v / tot * 2 * Math.PI, big = p.v / tot > .5 ? 1 : 0; s += '<path d="M100 100 L' + (100 + r * Math.cos(a)) + ' ' + (100 + r * Math.sin(a)) + ' A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + (100 + r * Math.cos(a2)) + ' ' + (100 + r * Math.sin(a2)) + ' Z" class="sk ' + p.c + '"/>' + T(100 + r * .62 * Math.cos((a + a2) / 2), 104 + r * .62 * Math.sin((a + a2) / 2), p.l, { c: 'tw', s: 12 }); a = a2; });
    return sv(200, 200, s);
  }
  function coord(min, max, u, drawFn, w2) { // koordinat düzlemi
    var n = max - min, W = n * u + 30, X = function (x) { return 15 + (x - min) * u; }, Y = function (y) { return 15 + (max - y) * u; }, s = '';
    for (var i = min; i <= max; i++) { s += Ln(X(i), Y(min), X(i), Y(max), 'grid') + Ln(X(min), Y(i), X(max), Y(i), 'grid'); if (i !== 0) s += T(X(i), Y(0) + 13, i, { s: 9 }) + T(X(0) - 8, Y(i) + 3, i, { s: 9, a: 'end' }); }
    s += Ln(X(min), Y(0), X(max), Y(0)) + Ln(X(0), Y(min), X(0), Y(max)) + T(X(max) + 2, Y(0) - 4, 'x', { s: 12, a: 'start' }) + T(X(0) + 6, Y(max) + 8, 'y', { s: 12, a: 'start' });
    s += drawFn(X, Y);
    return sv(W + 10, W + 10, s);
  }
  function tri(X, Y, pts, cls) { return P(pts.map(function (q) { return [X(q[0]), Y(q[1])]; }), cls); }

  // ============ 6. SINIF ============
  // H1 çarpan-kat
  (function () {
    var s = ''; var pairs = [[1, 24], [2, 12], [3, 8], [4, 6]], x0 = 6, cols = ['fa', 'fb', 'fc', 'fd'];
    pairs.forEach(function (pr, k) { var u = Math.min(10, 130 / pr[1], 60 / pr[0]); var out = ''; for (var i = 0; i < pr[0]; i++) for (var j = 0; j < pr[1]; j++) out += '<rect x="' + (j * u) + '" y="' + (i * u) + '" width="' + u + '" height="' + u + '" class="sk ' + cols[k] + '"/>'; s += '<g transform="translate(' + (10) + ',' + (10 + k * 74) + ')">' + out + '</g>' + T(160, 40 + k * 74, pr[0] + ' × ' + pr[1] + ' = 24', { a: 'start', w: 1, s: 14 }); });
    add(1, 'Aynı 24 kare, farklı dikdörtgenler: 24’ün çarpanları', sv(260, 310, s) + cap('Her dizilişteki kenar sayıları 24’ün <b>çarpanlarıdır</b>: 1, 2, 3, 4, 6, 8, 12, 24.'), true);
    add(1, '3’ün katları sayı doğrusunda', numLine(0, 30, 11, [{ v: 12, l: '12', c: 'fb' }, { v: 24, l: '24', c: 'fb' }], [0, 3, 6, 9, 12, 15, 18, 21, 24, 27].map(function (v) { return { from: v, to: v + 3 }; })) + cap('3’er atlayarak ulaştığımız her sayı 3’ün katıdır: 3, 6, 9, 12, …'));
  })();
  // H2 bölünebilme
  [[3, 'fa'], [6, 'fb'], [9, 'fc']].forEach(function (k) { add(2, k[0] + '’ün katları 1–100 tablosunda', gridN(100, 1, function (v) { return v % k[0] === 0 ? k[1] : ''; }) + cap(k[0] === 9 ? '9’un katları aynı zamanda <b>3’ün katıdır</b>; rakamları toplamı 9’un katıdır.' : k[0] === 6 ? '6’nın katları hem <b>2’nin</b> hem <b>3’ün</b> katıdır.' : '3’ün katlarının rakamları toplamı 3’ün katıdır: 12 → 1+2 = 3.'), k[0] === 3); });
  // H3 asal
  (function () {
    var pr = function (n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
    add(3, 'Eratosthenes kalburu: 100’e kadar asallar', gridN(100, 1, function (v) { return v === 1 ? 'lg' : pr(v) ? 'fd' : 'la'; }) + cap('<span class="chip" style="background:#e84393">asal</span> <span class="chip" style="background:#dfe3ff;color:#223">bileşik</span> 1 ne asal ne bileşik. 100’e kadar <b>25 asal</b> vardır.'), true);
    var s = T(160, 18, '60', { s: 18, w: 1 }) + Ln(140, 24, 90, 55) + Ln(180, 24, 230, 55) + T(80, 70, '6', { s: 16 }) + T(240, 70, '10', { s: 16 }) + Ln(75, 76, 50, 105) + Ln(95, 76, 115, 105) + Ln(235, 76, 215, 105) + Ln(250, 76, 275, 105) + [[45, 'fa', 2], [118, 'fb', 3], [210, 'fa', 2], [278, 'fc', 5]].map(function (q) { return C(q[0], 120, 14, q[1]) + T(q[0], 125, q[2], { c: 'tw', w: 1 }); }).join('');
    add(3, 'Çarpan ağacı: 60 = 2 · 2 · 3 · 5', sv(330, 150, s) + cap('Asal sayılara ulaşınca dallanma durur; yaprakların çarpımı sayıyı verir.'));
  })();
  // H4 ortak kat/bölen
  add(4, 'Venn şeması: 24 ve 36’nın bölenleri', sv(320, 190, '<ellipse cx="120" cy="95" rx="100" ry="80" class="sk la" fill-opacity=".7"/><ellipse cx="200" cy="95" rx="100" ry="80" class="sk ld" fill-opacity=".6"/>' + T(70, 55, '24', { w: 1, s: 15 }) + T(250, 55, '36', { w: 1, s: 15 }) + T(70, 95, '8', {}) + T(70, 125, '24', {}) + T(250, 95, '9, 18', {}) + T(250, 125, '36', {}) + T(160, 70, '1, 2, 3', {}) + T(160, 95, '4, 6, 12', { w: 1 }) + T(160, 160, 'Ortak bölenler (EBOB = 12)', { s: 11, c: 'note' })), true);
  add(4, '12 ve 18 sayı doğrusunda buluşuyor (EKOK = 36)', numLine(0, 40, 9, [{ v: 36, l: '36', c: 'fd' }], [0, 12, 24].map(function (v) { return { from: v, to: v + 12, c: '#4c4fef' }; }).concat([0, 18].map(function (v) { return { from: v, to: v + 18, c: '#14a44d' }; }))) + cap('<span style="color:#4c4fef"><b>12’şer</b></span> ve <span style="color:#14a44d"><b>18’er</b></span> atlayınca ilk buluştukları yer 36’dır.'));
  // H5 işlem makinesi (bilinmeyen nicelik)
  function machine(inp, rule, out) { return sv(380, 110, R(10, 30, 70, 50, 'la', inp, 18) + Ar(82, 55, 120, 55) + R(122, 15, 130, 80, 'fa', rule, 16) + Ar(254, 55, 292, 55) + R(294, 30, 76, 50, 'lb', out, 18)); }
  add(5, 'İşlem makinesi: giren sayıya kural uygulanır', machine('t = 3', '× 15', '45') + cap('Bilinmeyen niceliği harfle gösteririz: <b>t</b> tane tişört → gelir <b>15·t</b>. t = 3 için 45 TL.'), true);
  // H6 cebirsel ifade parçaları
  add(6, 'Cebirsel ifadenin parçaları', sv(380, 150, T(190, 60, '3x + 5', { s: 44, w: 1 }) + Ar(110, 95, 120, 70) + R(60, 100, 90, 28, 'fa', 'katsayı: 3', 13) + Ar(180, 95, 180, 72) + R(140, 100, 80, 28, 'fb', 'değişken: x', 13) + Ar(260, 95, 250, 70) + R(230, 100, 120, 28, 'fc', 'sabit terim: 5', 13) + '<rect x="40" y="18" width="300" height="5" class="fg"/>' + T(190, 14, '2 terim: 3x ve 5', { s: 11 })), true);
  // H7 denk ifadeler (cebir karoları)
  add(7, 'Cebir karolarıyla denk ifadeler: 4a = a + 3a', sv(380, 130, [0, 1, 2, 3].map(function (i) { return R(10 + i * 85, 10, 78, 36, 'fa', 'a'); }).join('') + T(190, 66, '4a', { s: 15, w: 1 }) + R(10, 80, 78, 36, 'fb', 'a') + [0, 1, 2].map(function (i) { return R(95 + i * 85, 80, 78, 36, 'fc', 'a'); }).join('') + T(350, 104, '= a + 3a', { a: 'end', s: 13 })) + cap('Aynı toplam, farklı gruplama: <b>4a</b>, <b>a + 3a</b>, <b>2a + 2a</b> hepsi denktir.'), true);
  add(7, '2x + 2y: dikdörtgenin çevresi', sv(300, 150, R(60, 30, 160, 80, 'la') + T(140, 22, 'x', { w: 1 }) + T(140, 128, 'x', { w: 1 }) + T(48, 75, 'y', { w: 1 }) + T(232, 75, 'y', { w: 1 }) + T(140, 78, 'Çevre = 2x + 2y', { s: 14 })));
  // H8 sınama akışı
  add(8, 'Bir iddiayı nasıl sınarız?', flow([['İddia', 'o'], ['Değer ver', 'r'], ['Eşit mi?', 'd'], ['Genelleme geçerli', 'o']], ['fa', 'fb', 'fc', 'fa']) + cap('Her denemede eşit çıkıyorsa genelleme güçlenir. <b>Bir tane karşı örnek</b> bulursak iddia çürür.'), true);
  // H9 sayı örüntüsü
  add(9, 'Adım–terim: 2, 5, 8, 11, 14 (kural 3n − 1)', sv(340, 170, [2, 5, 8, 11, 14].map(function (v, i) { return R(20 + i * 62, 140 - v * 8, 48, v * 8, ['fa', 'fb', 'fc', 'fd', 'fe'][i], v) + T(44 + i * 62, 158, (i + 1) + '. adım', { s: 10 }) + (i < 4 ? T(66 + i * 62, 138 - v * 8 - 6, '+3', { s: 11, w: 1 }) : ''); }).join('')), true);
  // H10 şekil örüntüsü & çokgen
  (function () {
    var s = ''; for (var n = 1; n <= 3; n++) { var x0 = 20 + (n - 1) * 100, k; for (k = 0; k < n; k++) { var x = x0 + k * 32; s += '<polygon points="' + x + ',70 ' + (x + 32) + ',70 ' + (x + 16) + ',40" fill="none" stroke="#e17055" stroke-width="3"/>'; } s += T(x0 + n * 16, 100, n + ' üçgen: ' + (2 * n + 1) + ' çöp', { s: 11 }); }
    add(10, 'Kibrit çöpüyle üçgen örüntüsü: 2n + 1', sv(340, 120, s) + cap('Her yeni üçgen 2 çöp ekler: 3, 5, 7, 9, …'), true);
    var pts = [], i; for (i = 0; i < 6; i++) { var a = i * Math.PI / 3 - Math.PI / 2; pts.push([110 + 70 * Math.cos(a), 95 + 70 * Math.sin(a)]); }
    add(10, 'Altıgen = 4 üçgen → 4 · 180° = 720°', sv(220, 190, P(pts, 'la') + Ln(pts[0][0], pts[0][1], pts[2][0], pts[2][1]) + Ln(pts[0][0], pts[0][1], pts[3][0], pts[3][1]) + Ln(pts[0][0], pts[0][1], pts[4][0], pts[4][1]) + T(110, 100, '(n − 2) · 180°', { s: 12, w: 1 })) + cap('Tek köşeden köşegen çizince <b>n − 2</b> üçgen oluşur.'));
  })();
  // H11 algoritma akışı
  add(11, 'Akış şeması: 3n + 2', flow([['Başla', 'o'], ['n al', 'r'], ['s = 3n + 2', 'r'], ['s yaz', 'r'], ['Bitir', 'o']], ['fa', 'fb', 'fc', 'fb', 'fa']) + cap('n = 4 için s = 3·4 + 2 = <b>14</b>. Tablo: n = 1, 2, 3, 4 → 5, 8, 11, 14.'), true);
  // H12 paralel doğru–kesen
  [['yöndeş', { a: '!a', e: '!e' }], ['iç ters', { d: '!d', e: '!e' }], ['dış ters', { a: '!a', h: '!h' }]].forEach(function (k, i) { add(12, k[0].charAt(0).toUpperCase() + k[0].slice(1) + ' açılar (eşit)', MC.parallelFig(120, k[1]) + cap('Kırmızı işaretli açılar <b>' + k[0] + '</b> açılardır ve ölçüleri <b>eşittir</b>.'), i === 0); });
  // H13 dörtgen ailesi
  add(13, 'Dörtgenler ailesi', sv(420, 230, R(150, 8, 120, 36, 'fa', 'Dörtgen', 14) + Ar(210, 46, 210, 62) + R(150, 64, 120, 36, 'fb', 'Yamuk', 14) + Ar(210, 102, 210, 118) + R(150, 120, 120, 36, 'fc', 'Paralelkenar', 14) + Ar(190, 158, 100, 176) + Ar(230, 158, 320, 176) + R(30, 178, 140, 36, 'fd', 'Dikdörtgen', 14) + R(250, 178, 140, 36, 'fe', 'Eşkenar dörtgen', 14) + T(210, 224, 'Kare: ikisinin de özelliklerini taşır', { s: 12, w: 1 })), true);
  // H14 köşegenler
  add(14, 'Paralelkenar: köşegenler birbirini ortalar', sv(260, 140, P([[30, 110], [170, 110], [230, 30], [90, 30]], 'la') + Ln(30, 110, 230, 30, 'trans') + Ln(170, 110, 90, 30, 'trans') + C(130, 70, 4, 'fd') + T(130, 62, 'O', { w: 1 }) + T(30, 128, 'A') + T(170, 128, 'B') + T(236, 24, 'C') + T(84, 24, 'D')) + cap('AO = OC ve BO = OD.'), true);
  add(14, 'Dikdörtgen: köşegenler eşit', sv(260, 130, R(30, 20, 200, 90, 'la') + Ln(30, 20, 230, 110, 'trans') + Ln(230, 20, 30, 110, 'trans') + C(130, 65, 4, 'fd') + T(130, 58, 'O', { w: 1 })) + cap('AC = BD ve O’dan köşelere uzaklıklar eşittir.'));
  add(14, 'Eşkenar dörtgen: köşegenler dik', sv(260, 150, P([[130, 10], [230, 75], [130, 140], [30, 75]], 'la') + Ln(130, 10, 130, 140, 'trans') + Ln(30, 75, 230, 75, 'trans') + '<rect x="130" y="65" width="10" height="10" class="rt"/>' + C(130, 75, 4, 'fd')) + cap('Köşegenler birbirini <b>dik</b> keser ve köşe açılarını ikiye böler.'));
  // H15 açı toplamı
  add(15, 'Üçgenin açıları toplamı 180°', sv(380, 190, P([[30, 90], [150, 90], [90, 20]], 'la') + T(55, 85, 'a', { w: 1 }) + T(130, 85, 'b', { w: 1 }) + T(90, 45, 'c', { w: 1 }) + Ar(160, 60, 200, 60) + '<path d="M215 140 A38 38 0 0 1 253 102 L215 140 Z" class="sk fa"/><path d="M253 102 A38 38 0 0 1 291 140 L215 140 Z" class="sk fc"/><path d="M215 140 L253 102 L291 140 Z" class="sk fb"/>' + Ln(190, 140, 340, 140) + T(236, 130, 'a', { c: 'tw', w: 1 }) + T(253, 128, 'c', { c: 'tw', w: 1 }) + T(285, 130, 'b', { c: 'tw', w: 1 }) + T(265, 170, 'a + b + c = 180° (düz açı)', { s: 12, w: 1 })), true);
  // H16 birim kare
  add(16, '1 dm² = 100 cm²', sv(300, 280, (function () { var o = ''; for (var i = 0; i < 10; i++) for (var j = 0; j < 10; j++) o += '<rect x="' + (30 + j * 24) + '" y="' + (30 + i * 24) + '" width="24" height="24" class="sk ' + ((i + j) % 2 ? 'la' : 'lb') + '"/>'; return o + T(150, 18, '10 cm', { w: 1 }) + T(14, 150, '10 cm', { w: 1, s: 11 }) + T(150, 285 - 12, '10 × 10 = 100 küçük kare', { s: 13, w: 1 }); })()), true);
  // H17 paralelkenar → dikdörtgen (animasyon)
  add(17, 'Paralelkenar → dikdörtgen (alan değişmez)', '<div class="anim-pk">' + sv(330, 150, P([[60, 120], [210, 120], [270, 20], [120, 20]], 'ld') + '<polygon class="pk-move sk la" points="60,120 120,120 120,20"/>' + Ln(120, 20, 120, 120, 'trans', true) + T(165, 140, 'taban', { s: 12 }) + T(285, 75, 'h', { w: 1 })) + '</div>' + cap('Yüksekliği çizip oluşan dik üçgeni diğer tarafa taşıyoruz → elimizde dikdörtgen: <b>Alan = taban × yükseklik</b>.'), true);
  // H18 üçgen = yarım paralelkenar
  add(18, 'İki eş üçgen = bir paralelkenar', '<div class="anim-tri">' + sv(330, 150, P([[40, 120], [180, 120], [110, 20]], 'la') + '<polygon class="tri-rot sk lb" points="40,120 180,120 110,20"/>' + T(110, 138, 'taban a', { s: 12 }) + T(25, 75, 'h', { w: 1 })) + '</div>' + cap('Üçgenin kopyasını 180° çevirip yanına koyunca paralelkenar olur: <b>Alan = (a · h) ÷ 2</b>.'), true);
  // H19 bileşik şekil
  add(19, 'Bileşik şekil: büyük dikdörtgen − küçük dikdörtgen', sv(340, 190, '<path d="M30 20 H250 V110 H170 V170 H30 Z" class="sk la"/>' + R(170, 110, 80, 60, 'lc').replace('class="sk lc"', 'class="sk lc" stroke-dasharray="5 4" fill-opacity=".4"') + T(140, 14, '10 m', { w: 1 }) + T(18, 100, '8 m', { w: 1, s: 11 }) + T(212, 142, 'çıkan:', { s: 11 }) + T(212, 156, '4 m × 3 m', { s: 11 }) + T(120, 100, '80 − 12 = 68 m²', { s: 14, w: 1 })), true);
  // H20 çember → doğru: yuvarlanan tekerlek
  add(20, 'Çember bir tur dönünce: yol = π · d', '<div class="anim-roll">' + sv(420, 140, Ln(10, 100, 410, 100) + '<g class="wheel"><circle cx="50" cy="65" r="35" class="sk la"/><line x1="50" y1="65" x2="50" y2="30" class="ln trans"/><circle cx="50" cy="65" r="3" class="pt"/></g>' + [0, 1, 2].map(function (i) { return R(50 + i * 70, 104, 70, 9, ['fa', 'fb', 'fc'][i]); }).join('') + R(260, 104, 10, 9, 'fd') + T(85, 130, 'd', { w: 1 }) + T(155, 130, 'd', { w: 1 }) + T(225, 130, 'd', { w: 1 }) + T(266, 130, '0,14d', { s: 10 })) + '</div>' + cap('Çember bir tam tur dönünce 3 çap ve biraz daha (0,14 çap) yol alır → <b>π ≈ 3,14</b>. Yani <b>Ç = π · d</b>.'), true);
  // H21 yarım çember
  add(21, 'Yarım daire levhanın çevresi', sv(300, 150, '<path d="M30 110 A100 100 0 0 1 230 110 Z" class="sk la"/>' + Ln(30, 110, 230, 110, 'trans') + T(130, 130, 'çap d', { w: 1 }) + T(130, 50, 'yay = π·d ÷ 2', { w: 1 })) + cap('Çevre = yay + çap = π·d ÷ 2 + d.'), true);
  // H22 merkez açı widget
  add(22, 'Merkez açıyı değiştir: yay uzunluğu nasıl değişir?', '<div data-widget="arc"></div>', true);
  // H23 veri türleri
  add(23, 'Veri türleri', cards([['🎨', 'Kategorik', 'Gruplara ayrılır<br>Favori renk, spor dalı', '#8e44ad'], ['🔢', 'Nicel (kesikli)', 'Sayarak bulunur<br>Kardeş sayısı, kitap sayısı', '#0984e3']]), true);
  // H24 gösterimler
  add(24, 'Aynı veri iki gösterimde: 12, 15, 21, 23, 23, 28, 34', MC.stemLeaf([12, 15, 21, 23, 23, 28, 34]) + MC.dotPlot([1, 2, 2, 3, 3, 3, 4], 0, 5) + cap('Kök-yaprak: iki basamaklı veri • Nokta grafiği: az sayıda farklı değer.'), true);
  // H25 ortalama eşitleme animasyonu
  add(25, 'Ortalama adil paylaşımdır: 3, 5, 7, 9 → 6', '<div class="anim-mean">' + sv(300, 180, [3, 5, 7, 9].map(function (x, i) { return '<rect class="mb mb' + i + '" x="' + (20 + i * 68) + '" y="' + (150 - x * 14) + '" width="52" height="' + x * 14 + '" rx="3" style="--k:' + (84 / (x * 14)).toFixed(3) + ';transform-origin:' + (46 + i * 68) + 'px 150px"/>' + T(46 + i * 68, 166, x, { s: 12 }); }).join('') + Ln(10, 66, 290, 66, 'trans', true) + T(290, 58, 'ortalama = 6', { s: 11, w: 1, a: 'end' })) + '</div>' + cap('Uzun sütunlardan alıp kısalara verince hepsi <b>6</b> olur. Toplam 24 ÷ 4 = 6.'), true);
  // H26 ortanca sayı doğrusu
  add(26, 'Ortanca: sıralıdaki ortadaki değer', sv(340, 90, [2, 4, 5, 8, 9].map(function (v, i) { return C(40 + i * 60, 40, 18, i === 2 ? 'fd' : 'la') + T(40 + i * 60, 45, v, { w: i === 2, c: i === 2 ? 'tw' : '' }); }).join('') + T(160, 80, '↑ ortanca = 5', { w: 1, s: 13 })), true);
  // H27 kontrol listesi
  add(27, 'Dedektif gibi oku', cards([['🧑‍🤝‍🧑', 'Kimden?', 'Örneklem yeterli ve temsilci mi?', '#e17055'], ['📏', 'Eksen', '0’dan başlıyor mu?', '#0984e3'], ['🔗', 'Neden?', 'Birlikte artış = neden değil', '#8e44ad'], ['📊', 'Özet', 'Ortalama herkes demek değildir', '#14a44d']]), true);
  // H28/H29 büyük sayılar
  (function () {
    var v = [0.7, 0.6, 0.55, 0.53, 0.52, 0.51, 0.505, 0.502]; var s = Ln(40, 25 + 120 * (1 - .5), 360, 25 + 120 * (1 - .5), 'trans', true) + T(370, 25 + 60 + 4, '0,5', { a: 'start', s: 11, w: 1 }); var pts = v.map(function (y, i) { return (60 + i * 42) + ',' + (25 + 120 * (1 - y)); }).join(' ');
    var g = sv(430, 190, Ln(40, 25, 40, 145) + Ln(40, 145, 380, 145) + s + '<polyline points="' + pts + '" fill="none" stroke="#4c4fef" stroke-width="3"/>' + v.map(function (y, i) { return C(60 + i * 42, 25 + 120 * (1 - y), 4, 'fa') + T(60 + i * 42, 162, [10, 20, 50, 100, 200, 500, 1000, 5000][i], { s: 10 }); }).join('') + T(210, 183, 'atış sayısı', { s: 11 }), 'wide');
    add(28, 'Tekrar arttıkça göreli sıklık 0,5’e yaklaşır', g + cap('Az atışta sonuç 0,7 olabilir; çok atışta <b>0,5’e</b> çok yaklaşır.'), true);
    add(29, 'Çok tekrar = güvenilir tahmin', g + cap('Deneysel olasılığı tahmin etmek için deneyi <b>çok sayıda</b> tekrarlamak gerekir.'), true);
    add(29, 'Olasılık çizgisi', sv(380, 90, '<defs><linearGradient id="gp"><stop offset="0" stop-color="#ffd6d6"/><stop offset=".5" stop-color="#fff3c9"/><stop offset="1" stop-color="#d5f5e3"/></linearGradient></defs><rect x="20" y="25" width="340" height="24" rx="12" fill="url(#gp)" class="sk"/>' + [0, 0.25, 0.5, 0.75, 1].map(function (p, i) { return T(20 + p * 340, 70, N(p), { s: 12, w: 1 }); }).join('') + T(30, 20, 'imkânsız', { s: 10, a: 'start' }) + T(350, 20, 'kesin', { s: 10, a: 'end' })));
  })();

  // ============ 7. SINIF ============
  add(101, 'Sayı kümeleri iç içe', sv(340, 220, '<ellipse cx="170" cy="110" rx="160" ry="100" class="sk ld" fill-opacity=".6"/><ellipse cx="170" cy="130" rx="120" ry="72" class="sk lc" fill-opacity=".7"/><ellipse cx="170" cy="145" rx="78" ry="46" class="sk lb" fill-opacity=".8"/><ellipse cx="170" cy="155" rx="40" ry="24" class="sk la"/>' + T(170, 28, 'Rasyonel sayılar', { w: 1 }) + T(170, 70, 'Tam sayılar', { w: 1 }) + T(170, 112, 'Doğal sayılar', { w: 1 }) + T(170, 160, 'Sayma', { s: 11 }) + T(170, 173, 'sayıları', { s: 11 })), true);
  add(101, 'Rasyonel sayılar sayı doğrusunda', numLine(-3, 3, 50, [{ v: -2.5, l: '−5/2', c: 'fa' }, { v: -0.5, l: '−1/2', c: 'fb' }, { v: 0.75, l: '3/4', c: 'fc' }, { v: 2, l: '2', c: 'fd' }]) + cap('Sağdaki sayı soldakinden büyüktür. Negatif sayılar sıfırın solundadır.'), true);
  add(101, 'Mutlak değer = 0’a uzaklık', numLine(-5, 5, 40, [{ v: -3, l: '−3', c: 'fa' }, { v: 3, l: '3', c: 'fb' }], [{ from: 0, to: -3, c: '#4c4fef' }, { from: 0, to: 3, c: '#14a44d' }]) + cap('|−3| = 3 ve |3| = 3: ikisi de sıfırdan 3 birim uzaktadır.'));
  // H102 kesir çubukları
  function bars(a, b, w, colA) { var s = ''; for (var i = 0; i < b; i++) s += R(10 + i * (w / b), 10, w / b, 34, i < a ? (colA || 'fa') : 'lg'); return sv(w + 20, 54, s); }
  add(102, '3/4 ve 5/6 karşılaştırması (12’lik paydada)', bars(9, 12, 320, 'fa') + bars(10, 12, 320, 'fb') + cap('3/4 = 9/12 ve 5/6 = 10/12 → <b>3/4 &lt; 5/6</b>.'), true);
  add(102, '0–1 arasında ondalık gösterim', numLine(0, 1, 280, [{ v: .25, l: '0,25', c: 'fa' }, { v: .5, l: '0,5', c: 'fb' }, { v: .75, l: '0,75', c: 'fc' }]).replace('>0<', '>0<'));
  // H103 toplama
  add(103, '1/3 + 1/4: paydaları eşitle', bars(4, 12, 320, 'fa') + bars(3, 12, 320, 'fb') + bars(7, 12, 320, 'fc') + cap('1/3 = 4/12 ve 1/4 = 3/12 → toplam <b>7/12</b>.'), true);
  // H104 alan modeli
  add(104, '2/3 × 3/4 = 6/12 = 1/2', sv(260, 180, (function () { var o = ''; for (var i = 0; i < 3; i++) for (var j = 0; j < 4; j++) { var cls = (i < 2 && j < 3) ? 'fd' : (i < 2 ? 'la' : (j < 3 ? 'lb' : 'lg')); o += R(20 + j * 50, 10 + i * 50, 48, 48, cls); } return o + T(130, 172, '12 kareden 6’sı boyalı', { w: 1, s: 13 }); })()) + cap('Yatay 3/4, dikey 2/3 boyanır; kesişen bölge çarpımdır.'), true);
  // H105 şerit modeli
  add(105, 'Şerit modeli: bir sayının 2/3’ü 24 ise', sv(340, 100, R(10, 20, 100, 40, 'fa', '12') + R(110, 20, 100, 40, 'fa', '12') + R(210, 20, 100, 40, 'lg', '12') + T(110, 85, '2/3 = 24', { w: 1 }) + T(260, 85, 'tamamı = 36', { w: 1, s: 12 })), true);
  // H106 izometrik yapı ve görünümler
  (function () {
    var H = [[2, 0, 1], [1, 3, 0], [0, 1, 2]], fr = [], sd = [], c, r;
    for (c = 0; c < 3; c++) fr.push(Math.max(H[0][c], H[1][c], H[2][c])); for (r = 2; r >= 0; r--) sd.push(Math.max.apply(null, H[r]));
    add(106, 'Yapı ve üç görünümü', row('<div>' + iso(H, 24) + '</div>', '<div>' + colsView(fr, 20, 'Önden') + '</div>', '<div>' + colsView(sd, 20, 'Sağdan') + '</div>', '<div>' + topView(H, 20) + '</div>') + cap('Önden: her <b>sütunun</b> en yükseği • Sağdan: her <b>sıranın</b> en yükseği • Üstten: kaplanan kareler (sayı = küp sayısı).'), true);
  })();
  // H107 prizma ve açınım
  add(107, 'Prizma ve açınımı (aynı renkler eş yüzlerdir)', row(cuboid(4, 3, 2, 24), (function () {
    var u = 26, a = 4, b = 3, c = 2, x0 = 8, y0 = 8 + b * u, s = R(x0 + b * u, 8, a * u, b * u, 'la', 'Üst') + R(x0, y0, b * u, c * u, 'lc', 'Sol') + R(x0 + b * u, y0, a * u, c * u, 'lb', 'Ön') + R(x0 + b * u + a * u, y0, b * u, c * u, 'lc', 'Sağ') + R(x0 + 2 * b * u + a * u, y0, a * u, c * u, 'lb', 'Arka') + R(x0 + b * u, y0 + c * u, a * u, b * u, 'la', 'Alt');
    return sv(x0 * 2 + (2 * a + 2 * b) * u, 16 + (2 * b + c) * u, s);
  })()) + cap('6 yüz, 3 çift eş yüz: <b>Yüzey alanı = 2(ab + ac + bc)</b>.'), true);
  // H108 hacim widget
  add(108, 'Ayrıtları değiştir: hacim ve yüzey alanı', '<div data-widget="prism"></div>', true);
  add(108, 'Hacim birimleri: her basamak 1000 kat', sv(420, 90, ['m³', 'dm³', 'cm³', 'mm³'].map(function (u, i) { return R(10 + i * 100, 25, 80, 40, ['fa', 'fb', 'fc', 'fd'][i], u, 16) + (i < 3 ? Ar(92 + i * 100, 45, 108 + i * 100, 45) + T(100 + i * 100, 20, '×1000', { s: 11, w: 1 }) : ''); }).join('') + T(210, 85, '1 dm³ = 1 litre', { w: 1 })), false);
  // H109 akvaryum
  add(109, 'Su yüksekliği = hacim ÷ taban alanı', sv(300, 170, R(50, 20, 160, 110, 'la').replace('class="sk la"', 'class="sk la" fill-opacity=".25"') + R(50, 70, 160, 60, 'fe').replace('class="sk fe"', 'class="sk fe" fill-opacity=".6"') + Ln(225, 70, 225, 130) + T(262, 104, 'h = 10 cm', { w: 1, s: 12 }) + T(130, 150, '20 cm × 25 cm taban', { s: 12 }) + T(130, 100, '5 L = 5000 cm³', { w: 1, s: 12 })), true);
  // H110 kartlar
  add(110, 'Üç veri türü', cards([['🎨', 'Kategorik', 'Göz rengi, favori ders', '#8e44ad'], ['🔢', 'Nicel kesikli', 'Kardeş sayısı, ayakkabı no', '#0984e3'], ['📏', 'Nicel sürekli', 'Boy, kütle, süre, sıcaklık', '#e17055']]), true);
  // H111 daire grafiği
  add(111, 'Daire grafiği: yüzde ve merkez açı', pie([{ v: 40, c: 'fa', l: '%40' }, { v: 30, c: 'fb', l: '%30' }, { v: 20, c: 'fc', l: '%20' }, { v: 10, c: 'fd', l: '%10' }]) + cap('Tam daire 360° = %100 • %40 → 40 · 3,6 = <b>144°</b>.'), true);
  // H112 merkezi eğilim
  add(112, 'Ortalama, ortanca ve tepe değer bir arada', sv(360, 120, [3, 4, 4, 5, 9].map(function (v, i) { return C(40 + i * 60, 50, 18, i === 1 || i === 2 ? 'fb' : (i === 4 ? 'fd' : 'la')) + T(40 + i * 60, 55, v, {}); }).join('') + T(130, 95, 'tepe değer = 4', { s: 12, w: 1 }) + T(160, 112, 'ortanca = 4 • ortalama = 5 • açıklık = 6', { s: 12 })), true);
  // H113 sapma
  add(113, 'Sapma: ortalamadan uzaklık (ortalama 20)', sv(340, 140, Ln(20, 70, 320, 70) + Ln(170, 40, 170, 100, 'trans', true) + [[100, 'fa'], [170, 'fb'], [240, 'fa']].map(function (q) { return C(q[0], 70, 9, q[1]); }).join('') + Ar(170, 52, 102, 52) + Ar(170, 52, 238, 52) + T(135, 45, '10', { w: 1 }) + T(205, 45, '10', { w: 1 }) + T(170, 120, 'Verilerin ortalamadan uzaklıklarının ortalaması = OMS', { s: 12, w: 1 })), true);
  // H114 hata
  add(114, 'Eleştirel okur kontrol listesi', cards([['👥', 'Örneklem', 'Küçük ve yanlı olabilir', '#e17055'], ['📏', 'Eksen', '0’dan başlamıyor olabilir', '#0984e3'], ['🔗', 'Neden–sonuç', 'Birlikte artış neden değildir', '#8e44ad'], ['🧮', 'Özet', 'Uç değer ortalamayı yanıltır', '#14a44d']]), true);
  // H115 yansıma
  add(115, 'y eksenine göre yansıma: A(−2,1) ↔ A′(2,1)', coord(-5, 5, 26, function (X, Y) { var t1 = [[-4, 1], [-1, 1], [-3, 4]], t2 = t1.map(function (q) { return [-q[0], q[1]]; }); return tri(X, Y, t1, 'la') + tri(X, Y, t2, 'lc') + t1.map(function (q, i) { return Ln(X(q[0]), Y(q[1]), X(-q[0]), Y(q[1]), 'trans', true); }).join('') + T(X(-3), Y(4) - 6, 'A') + T(X(3), Y(4) - 6, 'A′'); }) + cap('Noktalar y eksenine eşit uzaklıktadır; <b>(x, y) → (−x, y)</b>.'), true);
  add(115, 'x eksenine göre yansıma: (x, y) → (x, −y)', coord(-5, 5, 26, function (X, Y) { var t1 = [[1, 1], [4, 1], [2, 4]], t2 = t1.map(function (q) { return [q[0], -q[1]]; }); return tri(X, Y, t1, 'la') + tri(X, Y, t2, 'lc') + Ln(X(2), Y(4), X(2), Y(-4), 'trans', true); }));
  // H116 inşalar
  add(116, 'Orta dikme inşası', sv(300, 190, Ln(40, 100, 260, 100, 'ln') + C(40, 100, 4, 'fd') + C(260, 100, 4, 'fd') + T(40, 120, 'A', { w: 1 }) + T(260, 120, 'B', { w: 1 }) + '<path d="M150 30 A125 125 0 0 1 150 170" fill="none" stroke="#4c4fef" stroke-width="2" stroke-dasharray="4 3"/><path d="M150 30 A125 125 0 0 0 150 170" fill="none" stroke="#14a44d" stroke-width="2" stroke-dasharray="4 3"/>' + Ln(150, 20, 150, 180, 'trans') + C(150, 100, 4, 'fb') + T(165, 96, 'D', { w: 1 })) + cap('A ve B merkezli, aynı açıklıkla (AB’nin yarısından fazla) yaylar çiz; kesişimleri birleştir. <b>Orta dikme üzerindeki her nokta A ve B’ye eşit uzaklıktadır.</b>'), true);
  add(116, 'Açıortay inşası', sv(300, 190, Ln(40, 150, 270, 150) + Ln(40, 150, 240, 40) + '<path d="M120 150 A80 80 0 0 0 107 106" fill="none" stroke="#4c4fef" stroke-width="2"/>' + Ln(40, 150, 262, 82, 'trans') + T(150, 140, '', {}) + T(180, 120, 'α/2', { w: 1 }) + T(215, 142, 'α/2', { w: 1 })) + cap('Açıortay açıyı iki eş açıya böler; üzerindeki her nokta <b>kollara eşit uzaklıktadır</b>.'));
  // H117 kenarortay
  add(117, 'Kenarortaylar ve ağırlık merkezi G (2 : 1)', sv(320, 200, P([[40, 170], [280, 170], [150, 25]], 'la') + Ln(150, 25, 160, 170, 'trans') + Ln(40, 170, 215, 97.5, 'trans') + Ln(280, 170, 95, 97.5, 'trans') + C(157, 122, 5, 'fd') + T(170, 118, 'G', { w: 1 }) + T(150, 18, 'A', { w: 1 }) + T(36, 188, 'B', { w: 1 }) + T(284, 188, 'C', { w: 1 }) + T(160, 188, 'D', { w: 1 })) + cap('Üç kenarortay aynı noktada kesişir. AG : GD = <b>2 : 1</b>.'), true);
  // H118 oran çubukları
  add(118, 'Oran modeli: kız : erkek = 3 : 4', sv(340, 100, [0, 1, 2].map(function (i) { return R(10 + i * 44, 14, 42, 30, 'fd', 'K'); }).join('') + [0, 1, 2, 3].map(function (i) { return R(10 + i * 44, 52, 42, 30, 'fa', 'E'); }).join('') + T(260, 34, '3 parça', { a: 'start', w: 1 }) + T(260, 72, '4 parça', { a: 'start', w: 1 })) + cap('Toplam 7 parça. 28 öğrenci → 1 parça = 4 → 12 kız, 16 erkek.'), true);
  // H119 doğru orantı grafiği
  add(119, 'Doğru orantı grafiği: y = 3x', coord(0, 6, 36, function (X, Y) { var pts = [[1, 3], [2, 6]]; return Ln(X(0), Y(0), X(2), Y(6), 'ln trans') + pts.map(function (q) { return C(X(q[0]), Y(q[1]), 5, 'fd') + T(X(q[0]) + 22, Y(q[1]) - 4, '(' + q[0] + ',' + q[1] + ')', { s: 11 }); }).join('') + C(X(0), Y(0), 5, 'fb'); }) + cap('Doğru orantının grafiği <b>orijinden geçen doğrudur</b>.'), true);
  // H120 ikili sayı doğrusu
  add(120, 'İkili sayı doğrusu: 5 kg = 40 TL', sv(360, 150, Ln(20, 45, 340, 45) + Ln(20, 105, 340, 105) + [0, 5, 8].map(function (v, i) { var x = 30 + v * 36; return Ln(x, 38, x, 52) + T(x, 30, v + ' kg', { s: 12, w: 1 }) + Ln(x, 98, x, 112) + T(x, 128, [0, 40, 64][i] + ' TL', { s: 12, w: 1 }) + Ln(x, 52, x, 98, 'trans', true); }).join('') + T(180, 80, '×8', { w: 1, s: 12 })), true);
  // H121 yüzde ızgarası
  add(121, '%35 = 100 karede 35 boyalı kare', sv(260, 260, (function () { var o = ''; for (var i = 0; i < 100; i++) o += R(10 + (i % 10) * 24, 10 + Math.floor(i / 10) * 24, 22, 22, i < 35 ? 'fd' : 'lg'); return o; })()) + cap('%35 = 35/100 = 0,35. Yüzde, paydası 100 olan orandır.'), true);
  // H122 indirim
  add(122, '%25 indirim: 400 TL → 300 TL', sv(360, 120, R(10, 15, 300, 36, 'fa', '400 TL (%100)') + R(10, 62, 225, 36, 'fb', '300 TL (%75)') + R(235, 62, 75, 36, 'fd', '100 TL indirim') + T(330, 40, '%100', { s: 11 }) + T(330, 86, '%75', { s: 11 })), true);

  // ---------- etkileşimli araçlar ----------
  window.VISW = {
    arc: function (el) {
      el.innerHTML = '<div class="sim"><h4>🍕 Merkez açı ve yay (yarıçap 10 cm, π = 3,14)</h4><div class="row"><label>Merkez açı: <b id="av">90</b>°</label><input type="range" min="0" max="360" step="5" value="90" id="ar" style="width:60%"></div><div id="ad"></div></div>';
      var ar = el.querySelector('#ar'), av = el.querySelector('#av'), ad = el.querySelector('#ad');
      function draw() { var a = +ar.value, rad = a * Math.PI / 180, x = 110 + 80 * Math.cos(rad), y = 110 - 80 * Math.sin(rad), big = a > 180 ? 1 : 0; av.textContent = a;
        var path = a === 0 ? '' : a === 360 ? '<circle cx="110" cy="110" r="80" class="sk fa"/>' : '<path d="M110 110 L190 110 A80 80 0 ' + big + ' 0 ' + x + ' ' + y + ' Z" class="sk fa"/>';
        var yay = Math.round(62.8 * a / 360 * 100) / 100; ad.innerHTML = '<div class="vrow">' + sv(220, 220, '<circle cx="110" cy="110" r="80" class="sk la"/>' + path + Ln(110, 110, 190, 110) + (a ? Ln(110, 110, x, y) : '') + '<circle cx="110" cy="110" r="3" class="pt"/>') + '<div class="vstat"><div>Tam açıya oranı: <b>' + a + '/360</b></div><div>Yay uzunluğu = ' + a + '/360 · 62,8</div><div class="big">≈ ' + N(yay) + ' cm</div><div>Çemberin tamamı: 62,8 cm</div></div></div>'; }
      ar.oninput = draw; draw();
    },
    prism: function (el) {
      el.innerHTML = '<div class="sim"><h4>📦 Dikdörtgenler prizması</h4><div class="row"><label>a = <b id="pa">4</b></label><input type="range" min="1" max="8" value="4" id="ia"><label>b = <b id="pb">3</b></label><input type="range" min="1" max="8" value="3" id="ib"><label>c = <b id="pc">2</b></label><input type="range" min="1" max="8" value="2" id="ic"></div><div id="pd"></div></div>';
      function draw() { var a = +el.querySelector('#ia').value, b = +el.querySelector('#ib').value, c = +el.querySelector('#ic').value; el.querySelector('#pa').textContent = a; el.querySelector('#pb').textContent = b; el.querySelector('#pc').textContent = c;
        el.querySelector('#pd').innerHTML = '<div class="vrow">' + cuboid(a, b, c, 18) + '<div class="vstat"><div>Hacim = a·b·c = ' + a + '·' + b + '·' + c + '</div><div class="big">' + a * b * c + ' cm³</div><div>Yüzey alanı = 2(ab+ac+bc)</div><div class="big">' + 2 * (a * b + a * c + b * c) + ' cm²</div></div></div>'; }
      ['#ia', '#ib', '#ic'].forEach(function (id) { el.querySelector(id).oninput = draw; }); draw();
    }
  };
})();
