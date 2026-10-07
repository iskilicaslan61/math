/* Çekirdek yardımcılar: rastgele sayı üretici, biçimlendirme, soru üretici, SVG yardımcıları */
(function (global) {
  'use strict';

  // ---- Tohumlu rastgele sayı üretici (aynı test her açılışta aynı sorular) ----
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function makeRng(seedStr) {
    var f = mulberry32(hash(seedStr));
    var r = {
      f: f,
      int: function (a, b) { return a + Math.floor(f() * (b - a + 1)); },
      pick: function (arr) { return arr[Math.floor(f() * arr.length)]; },
      shuffle: function (arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(f() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
      },
      // arr içinden n farklı eleman
      sample: function (arr, n) { return r.shuffle(arr).slice(0, n); }
    };
    return r;
  }

  // ---- Sayı biçimleri (Türkçe: virgül ondalık, nokta binlik) ----
  function num(n) {
    if (typeof n === 'string') return n;
    var r = Math.round(n * 1e6) / 1e6;
    var s = String(r);
    var neg = s[0] === '-'; if (neg) s = s.slice(1);
    var parts = s.split('.');
    var ip = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, parts[0].length > 4 ? '.' : '');
    var out = parts.length > 1 ? ip + ',' + parts[1] : ip;
    return (neg ? '−' : '') + out;
  }
  function frac(n, d) { return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  function sgn(n) { return n < 0 ? '−' + Math.abs(n) : String(n); }

  // ---- Soru üretici ----
  // Q(q, doğru, [yanlışlar], açıklama) -> {q, opts, ans, exp}
  var N_ = num;
  function Q(rng, q, correct, wrongs, exp, extra) {
    var seen = {}; seen[String(correct)] = true;
    var w = [];
    wrongs.forEach(function (x) {
      var k = String(x);
      if (!seen[k]) { seen[k] = true; w.push(x); }
    });
    if (typeof correct === 'number') {
      for (var d = 1; w.length < 3 && d < 50; d++) {
        [correct + d, correct - d].forEach(function (v) { if (w.length < 3 && v >= 0 && !seen[String(v)]) { seen[String(v)] = true; w.push(v); } });
      }
    }
    if (w.length < 3 && typeof correct === 'string') {
      var m = /^(%?)([−-]?\d[\d.,]*)(.*)$/.exec(correct), pre = m ? m[1] : '';
      if (m) { m = [m[0], m[2], m[3]]; }
      if (m) {
        var raw = m[1].replace('−', '-'), v;
        if (raw.indexOf(',') >= 0) v = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
        else if (/^-?\d{1,3}(\.\d{3})+$/.test(raw)) v = parseFloat(raw.replace(/\./g, ''));
        else v = parseFloat(raw);
        var suf = m[2];
        var cand = [v + 1, v - 1, v + 2, v - 2, v + 5, v - 5, v + 10, v - 10, v * 2, v / 2, v + 20, v - 20, v + 30];
        cand.forEach(function (x) {
          x = Math.round(x * 100) / 100;
          if (w.length >= 3 || x < 0 || (/°/.test(suf) && x > 360)) return;
          var s = pre + num(x) + suf;
          if (!seen[s]) { seen[s] = true; w.push(s); }
        });
      }
    }
    if (w.length < 3) throw new Error('Yetersiz şık: ' + q + ' | ' + correct + ' | ' + wrongs);
    w = rng.shuffle(w).slice(0, 3);
    var opts = rng.shuffle([correct].concat(w));
    return { q: q, opts: opts.map(String), ans: opts.indexOf(correct), exp: exp || '', fig: extra && extra.fig || '' };
  }
  // Sayısal şıklar için yakın yanlışlar üretir
  function near(rng, correct, deltas) {
    var out = [];
    (deltas || [1, 2, 10, -1, -2, -10]).forEach(function (d) {
      var v = correct + d; if (v > 0 || correct <= 0) out.push(v);
    });
    return out;
  }

  // ---- SVG yardımcıları ----
  function svg(w, h, inner, cls) {
    return '<svg class="fig ' + (cls || '') + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img">' + inner + '</svg>';
  }
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || 'middle') + '" font-size="' + (o.size || 14) + '" class="' + (o.cls || '') + '">' + s + '</text>';
  }
  function line(x1, y1, x2, y2, cls) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || 'ln') + '"/>';
  }
  function poly(pts, cls) {
    return '<polygon points="' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" class="' + (cls || 'shape') + '"/>';
  }

  // İki paralel doğru + kesen. A = a açısının ölçüsü (sol-üst bölge). lab: harf -> gösterilecek metin
  function parallelFig(A, lab) {
    var W = 360, H = 220, y1 = 70, y2 = 150;
    var th = (180 - A) * Math.PI / 180;           // kesenin yukarı-sağ yönü
    var dx = (y2 - y1) / Math.tan(th);            // alt kesişim x farkı (ekranda aşağı gitmek)
    // üst kesişim
    var cx = W / 2 + dx / 2, cy = y1;             // alt kesişim x = cx - dx  (yukarı yön (cos,−sin))
    var bx = cx - (y2 - y1) / Math.tan(th) * 1;   // aynı değer, açıklık için
    var ux = cx, uy = y1, lx = cx - (y2 - y1) / Math.tan(th), ly = y2;
    var s = '';
    s += line(20, y1, W - 20, y1) + line(20, y2, W - 20, y2);
    // kesen: iki kesişim noktasını uzat
    var ex = (y2 - y1) / Math.tan(th);
    var ax = ux + (30) / Math.tan(th) * 1, ay = y1 - 30;           // yukarı uzantı
    var bx2 = lx - (30) / Math.tan(th), by2 = y2 + 30;             // aşağı uzantı
    s += line(ax, ay, bx2, by2, 'ln trans');
    s += txt(W - 28, y1 - 6, 'ℓ₁', { cls: 'lbl' }) + txt(W - 28, y2 - 6, 'ℓ₂', { cls: 'lbl' });
    var r = 26;
    function place(cx0, cy0, bis, letter) {
      var a = bis * Math.PI / 180;
      var x = cx0 + r * Math.cos(a), y = cy0 - r * Math.sin(a);
      var t = lab[letter] !== undefined ? lab[letter] : letter, bang = typeof t === 'string' && t.charAt(0) === '!';
      if (bang) t = t.slice(1);
      var cls = (lab[letter] !== undefined && /\d|\?/.test(String(t))) || bang ? 'ang known' : 'ang';
      return txt(x, y + 5, t, { size: 13, cls: cls });
    }
    var T = (180 - A);          // yukarı-sağ ışının açısı (derece)
    var bis = { TL: (180 + T) / 2, TR: T / 2, BL: 180 + T / 2, BR: 270 + T / 2 };
    ['TL', 'TR', 'BL', 'BR'].forEach(function (k, i) { s += place(ux, uy, bis[k], 'abcd'[i]); });
    ['TL', 'TR', 'BL', 'BR'].forEach(function (k, i) { s += place(lx, ly, bis[k], 'efgh'[i]); });
    return svg(W, H, s, 'wide');
  }

  // Paralelkenar: taban b, yan kenar s, yükseklik h
  function paraFig(b, sideLen, h, labs) {
    labs = labs || {};
    var W = 300, Hh = 170, sc = 1;
    var base = 160, hh = 90, off = 50;
    var x0 = 40, y0 = 140;
    var pts = [[x0, y0], [x0 + base, y0], [x0 + base + off, y0 - hh], [x0 + off, y0 - hh]];
    var s = poly(pts);
    s += line(x0 + off, y0 - hh, x0 + off, y0, 'ln dash');
    s += '<rect x="' + (x0 + off) + '" y="' + (y0 - 10) + '" width="10" height="10" class="rt"/>';
    s += txt(x0 + base / 2, y0 + 20, labs.b || ('taban = ' + b + ' cm'));
    s += txt(x0 + base + off / 2 + 22, y0 - hh / 2, labs.s || (sideLen + ' cm'), { anchor: 'start' });
    s += txt(x0 + off - 6, y0 - hh / 2 + 4, labs.h || ('h = ' + h + ' cm'), { anchor: 'end' });
    return svg(W, Hh, s);
  }
  // Üçgen: taban b, yükseklik h, yan kenar s
  function triFig(b, sideLen, h, labs) {
    labs = labs || {};
    var W = 300, Hh = 170;
    var x0 = 40, y0 = 140, base = 190, apexX = x0 + 70, apexY = 40;
    var s = poly([[x0, y0], [x0 + base, y0], [apexX, apexY]]);
    s += line(apexX, apexY, apexX, y0, 'ln dash');
    s += '<rect x="' + apexX + '" y="' + (y0 - 10) + '" width="10" height="10" class="rt"/>';
    s += txt(x0 + base / 2, y0 + 20, labs.b || ('taban = ' + b + ' cm'));
    s += txt(apexX + base / 2 + 28, apexY + 55, labs.s || (sideLen + ' cm'), { anchor: 'start' });
    s += txt(apexX - 6, (apexY + y0) / 2, labs.h || ('h = ' + h + ' cm'), { anchor: 'end' });
    return svg(W, Hh, s);
  }
  // Çember ve merkez açı
  function circleFig(alpha, labs) {
    labs = labs || {};
    var cx = 110, cy = 100, r = 72;
    var a = alpha * Math.PI / 180;
    var x1 = cx + r, y1 = cy;
    var x2 = cx + r * Math.cos(a), y2 = cy - r * Math.sin(a);
    var big = alpha > 180 ? 1 : 0;
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="shape"/>';
    s += '<path d="M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + big + ' 0 ' + x2 + ' ' + y2 + '" class="arc"/>';
    s += line(cx, cy, x1, y1) + line(cx, cy, x2, y2);
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="3" class="pt"/>';
    s += txt(cx - 12, cy + 16, 'O') + txt(cx + 34 * Math.cos(a / 2) + 6, cy - 34 * Math.sin(a / 2) + 4, labs.a || (alpha + '°'), { size: 12 });
    return svg(220, 200, s);
  }
  // Nokta grafiği: values dizisi, min..max eksen
  function dotPlot(values, lo, hi) {
    var W = 40 + (hi - lo + 1) * 34, H = 40 + 20 * 5 + 24;
    var counts = {};
    values.forEach(function (v) { counts[v] = (counts[v] || 0) + 1; });
    var maxc = Math.max.apply(null, Object.keys(counts).map(function (k) { return counts[k]; }));
    H = 50 + maxc * 20;
    var s = line(20, H - 30, W - 10, H - 30);
    for (var v = lo; v <= hi; v++) {
      var x = 40 + (v - lo) * 34;
      s += line(x, H - 30, x, H - 25) + txt(x, H - 10, v, { size: 12 });
      for (var k = 0; k < (counts[v] || 0); k++) {
        s += '<circle cx="' + x + '" cy="' + (H - 42 - k * 19) + '" r="7" class="dot"/>';
      }
    }
    return svg(W, H, s, 'wide');
  }
  // Kök-yaprak tablosu (HTML)
  function stemLeaf(values) {
    var v = values.slice().sort(function (a, b) { return a - b; });
    var map = {};
    v.forEach(function (x) { var st = Math.floor(x / 10); (map[st] = map[st] || []).push(x % 10); });
    var stems = Object.keys(map).map(Number).sort(function (a, b) { return a - b; });
    var lo = stems[0], hi = stems[stems.length - 1], rows = '';
    for (var s = lo; s <= hi; s++) {
      rows += '<tr><td class="stem">' + s + '</td><td class="leaf">' + (map[s] || []).join(' ') + '</td></tr>';
    }
    return '<table class="stemleaf"><thead><tr><th>Kök</th><th>Yaprak</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }
  // Basit tablo
  function table(head, rows) {
    return '<table class="tbl"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  }
  // Çubuk grafik
  function barChart(labels, values, o) {
    o = o || {};
    var base = o.base || 0, top = o.top || Math.max.apply(null, values);
    var W = 60 + labels.length * 70, H = 200, plotH = 140;
    var s = line(40, 20 + plotH, W - 10, 20 + plotH);
    s += line(40, 20, 40, 20 + plotH);
    var steps = o.steps || 4;
    for (var i = 0; i <= steps; i++) {
      var val = base + (top - base) * i / steps, y = 20 + plotH - plotH * i / steps;
      s += line(36, y, 40, y) + txt(34, y + 4, num(Math.round(val * 10) / 10), { size: 11, anchor: 'end' });
    }
    labels.forEach(function (l, i) {
      var h = plotH * (values[i] - base) / (top - base), x = 60 + i * 70;
      s += '<rect x="' + x + '" y="' + (20 + plotH - h) + '" width="40" height="' + h + '" class="bar"/>';
      s += txt(x + 20, 20 + plotH + 16, l, { size: 12 });
    });
    return svg(W, H, s, 'wide');
  }

  global.MC = {
    makeRng: makeRng, num: num, frac: frac, gcd: gcd, sgn: sgn, Q: Q, near: near,
    svg: svg, txt: txt, line: line, poly: poly,
    parallelFig: parallelFig, paraFig: paraFig, triFig: triFig, circleFig: circleFig,
    dotPlot: dotPlot, stemLeaf: stemLeaf, table: table, barChart: barChart
  };
  global.WEEKS = [];
  global.TEMAS = [];
})(window);
