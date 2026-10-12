/* 7. SINIF — Ders kitabı (1. Kitap) tarzı ek soru üreticileri: Hafta 1-9 (Tema 1 ve 2).
   Mevcut haftalara yeni "makers" eklenir; her konudaki 10 test bu havuzdan üretilir. */
(function () {
  'use strict';
  var N = MC.num, Q = MC.Q, F = MC.frac, R = window.R7, sh = R.sh, FQ = R.FQ, rd = R.rd, bar = R.bar;
  function add(wk, makers) {
    var w = WEEKS.filter(function (x) { return x.grade === 7 && x.wk === wk; })[0];
    makers.forEach(function (m) { w.makers.push(m); });
  }
  // rasyonel aritmetik: [pay, payda]
  function ra(a, b) { return rd(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function rm(a, b) { return rd(a[0] * b[0], a[1] * b[1]); }
  function rv(a, b) { return rd(a[0] * b[1], a[1] * b[0]); }
  function rs(a, b) { return ra(a, [-b[0], b[1]]); }
  function S(x) { return sh(x[0], x[1]); }
  function FR(r, q, x, exp, wr) { return FQ(r, q, x[0], x[1], wr || [], exp); }
  function pf(r, lo, hi) { var d, n; do { d = r.int(lo || 2, hi || 9); n = r.int(1, d * 2 - 1); } while (n % d === 0 || R.gcd(n, d) !== 1); return [n, d]; }
  function sup(a, n) { return '(' + a + ')<sup>' + n + '</sup>'; }
  function qnum(r, q, correct, wrongs, exp) { return Q(r, q, N(correct), wrongs.map(N), exp); }

  // ================= HAFTA 1: Sayı kümeleri, tam sayılar, rasyonel sayılar, mutlak değer =================
  add(1, [
    function (r) { var g = r.int(2, 12), d = r.int(g + 2, g + 15); return qnum(r, 'Bir şehirde gece sıcaklığı −' + g + ' °C, gündüz sıcaklığı ' + d + ' °C ölçülmüştür. Gündüz ile gece sıcaklığı arasındaki fark kaç °C’dir?', d + g, [d - g, g - d, d * g], 'Fark = ' + d + ' − (−' + g + ') = ' + (d + g) + ' °C'); },
    function (r) { var v = r.int(3, 9), t = r.int(4, 12); return qnum(r, 'Bir dalgıç deniz seviyesinden başlayarak dakikada ' + v + ' metre aşağı iniyor. ' + t + ' dakika sonra dalgıcın konumunu deniz seviyesine göre gösteren tam sayı kaçtır?', -v * t, [v * t, -(v + t), -(v * t) + v], 'Konum = (−' + v + ') · ' + t + ' = ' + N(-v * t)); },
    function (r) { var v = r.int(3, 9), t = r.int(5, 14); return qnum(r, 'Deniz seviyesinden dakikada ' + v + ' metre hızla inen bir dalgıç ' + (v * t) + ' metre derinliğe kaç dakikada ulaşır?', t, [t + 1, t - 1, v + t], (v * t) + ' ÷ ' + v + ' = ' + t + ' dakika'); },
    function (r) { var a = r.int(3, 20), b = r.int(2, 9), c = r.int(2, 9), d = r.int(2, 15); return qnum(r, 'Aşağıdaki işlemin sonucu kaçtır?<br><b>' + a + ' + ' + b + ' · (−' + c + ') − ' + d + '</b>', a - b * c - d, [a + b * c - d, (a + b) * (-c) - d, a - b * c + d], 'Önce çarpma: ' + b + ' · (−' + c + ') = ' + N(-b * c) + '. Sonra soldan sağa: ' + a + ' − ' + (b * c) + ' − ' + d + ' = ' + N(a - b * c - d)); },
    function (r) {
      var P = r.pick([24, 30, 36, 48, 60]), sums = [];
      for (var a = 1; a * a <= P; a++) if (P % a === 0) sums.push(a + P / a);
      var wr = sums.slice(1).map(function (s) { return N(-s); });
      return Q(r, 'Çarpımları ' + P + ' olan iki negatif tam sayının toplamı <b>en az</b> kaç olabilir?', N(-(1 + P)), wr.slice(0, 3), '(−1) · (−' + P + ') çiftinin toplamı −' + (1 + P) + ' olup tüm çiftler arasında en küçüğüdür.');
    },
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return qnum(r, '−' + a + ' &lt; x ≤ ' + b + ' koşulunu sağlayan kaç farklı tam sayı vardır?', a + b, [a + b + 1, a + b - 1, a + b + 2], 'x = ' + N(-a + 1) + ', …, ' + b + ' → ' + (a + b) + ' tam sayı'); },
    function (r) { var a = r.int(4, 14), b = r.int(1, a - 1); return qnum(r, '|x − ' + a + '| = ' + b + ' eşitliğini sağlayan x değerlerinin toplamı kaçtır?', 2 * a, [a, a + b, 2 * b], 'x = ' + (a + b) + ' veya x = ' + (a - b) + '; toplam ' + 2 * a); },
    function (r) { var a = r.int(15, 80), b = r.int(5, 40), c = r.int(10, 90), res = -a + b - c; return Q(r, 'Banka hesabında −' + a + ' TL (borç) bulunan Ece hesabına ' + b + ' TL yatırıyor, ardından ' + c + ' TL çekiyor. Hesabın son durumunu gösteren tam sayı kaçtır?', N(res), [N(a + b - c), N(-a - b + c), N(res + 2 * c), N(res - 10), N(-res), N(res + 5)], '−' + a + ' + ' + b + ' − ' + c + ' = ' + N(res)); },
    function (r) {
      var pool = [[-3, 4], [1, 2], [-1, 3], [2, 5], [-5, 6], [4, 3], [-7, 8], [3, 2]], pick = r.sample(pool, 4);
      var best = pick.slice().sort(function (x, y) { return Math.abs(x[0] / x[1]) - Math.abs(y[0] / y[1]); })[0];
      return Q(r, 'Aşağıdaki rasyonel sayılardan hangisi sayı doğrusunda <b>0’a en yakındır</b>?', S(best), pick.filter(function (x) { return x !== best; }).map(S), 'Mutlak değeri en küçük olan sayı 0’a en yakındır.');
    },
    function (r) { var n = r.pick([3, 4, 5, 6, 8]), k; do { k = r.int(1, 2 * n - 1); } while (k % n === 0); return FQ(r, 'Sayı doğrusunda 0 ile 1 arası ' + n + ' eş parçaya bölünmüştür. 0’ın <b>solunda</b> bulunan ' + k + '. çizgi hangi rasyonel sayıyı gösterir?', -k, n, [], 'Her parça ' + F(1, n) + ' birimdir; sola ' + k + ' parça gidilirse −' + F(k, n)); }
  ]);

  // ================= HAFTA 2: Ondalık gösterim, karşılaştırma, sıralama =================
  function rep(n, d) {
    var ip = Math.floor(n / d), rem = n % d, digs = [], seen = {};
    while (rem && seen[rem] === undefined) { seen[rem] = digs.length; rem *= 10; digs.push(Math.floor(rem / d)); rem %= d; }
    var pre = digs, per = '';
    if (rem) { pre = digs.slice(0, seen[rem]); per = digs.slice(seen[rem]).join(''); }
    return { ip: ip, pre: pre.join(''), per: per };
  }
  function repStr(o) { return o.ip + ((o.pre || o.per) ? ',' + o.pre + (o.per ? bar(o.per) : '') : ''); }
  function plain(o) { return o.ip + ',' + o.pre + o.per; }
  add(2, [
    function (r) { var d = r.pick([2, 4, 5, 8, 20, 25]), n = r.int(1, d - 1); while (R.gcd(n, d) !== 1) n = r.int(1, d - 1); return Q(r, F(n, d) + ' rasyonel sayısının ondalık gösterimi hangisidir?', N(n / d), [N(d / n < 1 ? n / (d + 1) : n / (d * 2)), N(Math.round((n / d + 0.1) * 1e6) / 1e6), N(Math.round((n / d * 10) * 1e6) / 1e6)], 'Pay payda’ya bölünür: ' + n + ' ÷ ' + d + ' = ' + N(n / d)); },
    function (r) {
      var d = r.pick([3, 6, 9, 11, 12, 15]), n = r.int(1, d - 1); while (R.gcd(n, d) !== 1) n = r.int(1, d - 1);
      var o = rep(n, d), c = repStr(o), cands = [plain(o), repStr(rep(n + 1, d)), repStr(rep(d - n, d)), repStr(rep(n, d + 1))], w = [];
      cands.forEach(function (x) { if (x !== c && w.indexOf(x) < 0 && w.length < 3) w.push(x); });
      return Q(r, F(n, d) + ' rasyonel sayısının ondalık gösterimi aşağıdakilerden hangisidir? (Üstü çizili rakamlar devreder.)', c, w, 'Bölme işlemi sürdürülünce rakamlar tekrar eder: ' + c);
    },
    function (r) {
      var q1 = r.pick([8, 16, 20, 25, 40, 50]), q2 = r.sample([3, 6, 7, 9, 11, 12, 14, 15], 3), p = function (q) { var x; do { x = r.int(1, q - 1); } while (R.gcd(x, q) !== 1); return x; };
      return Q(r, 'Aşağıdaki sade kesirlerden hangisinin ondalık gösterimi <b>sonludur</b> (devirli değildir)?', F(p(q1), q1), q2.map(function (q) { return F(p(q), q); }), 'Paydası yalnız 2 ve 5 asal çarpanlarını içeren sade kesirlerin ondalık gösterimi sonludur.');
    },
    function (r) {
      var pool = [['0,4', .4], [F(1, 3), 1 / 3], [F(3, 8), .375], ['0,45', .45], [F(1, 2), .5], ['0,3', .3], [F(5, 8), .625], ['0,7', .7], [F(3, 4), .75], [F(2, 5), .4001], ['0,55', .55], [F(4, 5), .8]];
      var v = r.sample(pool, 4), mx = v.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
      return Q(r, 'Aşağıdaki sayılardan hangisi <b>en büyüktür</b>?', mx[0], v.filter(function (x) { return x !== mx; }).map(function (x) { return x[0]; }), 'Hepsini ondalık biçime çevirip karşılaştırın.');
    },
    function (r) {
      var pool = [['0,4', .4], [F(1, 3), 1 / 3], [F(3, 8), .375], ['0,45', .45], [F(1, 2), .5], ['0,3', .3], [F(5, 8), .625], ['0,7', .7], [F(3, 4), .75], ['0,55', .55], [F(4, 5), .8], ['0,6', .6]];
      var v = r.sample(pool, 3), s = v.slice().sort(function (a, b) { return a[1] - b[1]; }), txt = function (l) { return l.map(function (x) { return x[0]; }).join(' &lt; '); };
      var w = [[s[0], s[2], s[1]], [s[1], s[0], s[2]], [s[2], s[1], s[0]], [s[1], s[2], s[0]]].map(txt);
      return Q(r, 'Aşağıdakilerden hangisi sayıların <b>küçükten büyüğe</b> doğru sıralanmış hâlidir?<br>' + v.map(function (x) { return x[0]; }).join(' , '), txt(s), w.filter(function (x) { return x !== txt(s); }).slice(0, 3), 'Ondalık değerler: ' + s.map(function (x) { return N(Math.round(x[1] * 1000) / 1000); }).join(' &lt; '));
    },
    function (r) { var a = r.int(11, 49), b = r.int(11, 39); return Q(r, 'Gece sıcaklığı −' + N(a / 10) + ' °C, gündüz sıcaklığı ' + N(b / 10) + ' °C olan bir yerde gündüz ile gece arasındaki sıcaklık farkı kaç °C’dir?', N((a + b) / 10), [N(Math.abs(b - a) / 10 || 0.1), N((a + b) / 100), N((a * b) / 100)], N(b / 10) + ' − (−' + N(a / 10) + ') = ' + N((a + b) / 10)); },
    function (r) { var t = r.int(20, 29), lo = t / 10, hi = (t + 1) / 10; return Q(r, 'Bir aracın ön lastik basıncının ' + N(lo) + ' bar ile ' + N(hi) + ' bar arasında olması gerekiyor. Aşağıdakilerden hangisi bu aralıkta bir basınç değeri olabilir?', N((t * 10 + 5) / 100), [N(lo), N(hi), N((t * 10 + 15) / 100)], N(lo) + ' &lt; ' + N((t * 10 + 5) / 100) + ' &lt; ' + N(hi)); },
    function (r) { var d = r.pick([20, 25, 40, 50, 8]), n = r.int(1, d - 1); while (R.gcd(n, d) !== 1) n = r.int(1, d - 1); return FQ(r, N(n / d) + ' ondalık sayısının en sade kesir biçimi hangisidir?', n, d, [], N(n / d) + ' = ' + F(Math.round(n / d * 100), 100) + ' = ' + F(n, d)); },
    function (r) { var k = r.int(11, 39), p = r.int(4, 9); return Q(r, '1 kg elmanın fiyatı ' + N(k / 2 + 0.5) + ' TL’dir. ' + p + ' kg elma için kaç TL ödenir?', N(Math.round((k / 2 + 0.5) * p * 100) / 100), [N(Math.round((k / 2 + 0.5) * (p + 1) * 100) / 100), N(Math.round(((k / 2 + 0.5) + p) * 100) / 100), N(Math.round((k / 2 + 0.5) * p * 10) / 100)], N(k / 2 + 0.5) + ' · ' + p + ' = ' + N(Math.round((k / 2 + 0.5) * p * 100) / 100)); },
    function (r) { var a = r.int(1, 8), b = r.int(1, 8); return Q(r, 'Sayı doğrusunda −' + a + ' ile −' + (a + 1) + ' arasında, −' + a + ',' + b + ' ile −' + a + ',' + (b + 1 > 9 ? 9 : b + 1) + ' arasında kalan sayı hangisidir?', N(-(a + (b * 10 + 5) / 100)), [N(-(a + (b * 10) / 100)), N(-(a + 1 + (b * 10 + 5) / 100)), N(-(a + (b * 10 + 5) / 1000))], 'Sayı −' + a + ',' + b + ' ile −' + a + ',' + (b + 1) + ' arasında olmalıdır: ' + N(-(a + (b * 10 + 5) / 100))); }
  ]);

  // ================= HAFTA 3: Rasyonel sayılarla toplama ve çıkarma =================
  add(3, [
    function (r) { var a = pf(r, 2, 9), b = pf(r, 2, 9), x = ra(a, b); return FR(r, F(a[0], a[1]) + ' + ' + F(b[0], b[1]) + ' işleminin sonucu aşağıdakilerden hangisidir?', x, 'Paydalar eşitlenir: ' + S(x)); },
    function (r) { var a = pf(r, 2, 9), b = pf(r, 2, 9), x = ra([-a[0], a[1]], b); return FR(r, '−' + F(a[0], a[1]) + ' + ' + F(b[0], b[1]) + ' işleminin sonucu hangisidir?', x, 'Paydalar eşitlenir: ' + S(x)); },
    function (r) { var a = pf(r, 2, 8), b = pf(r, 2, 8), x = ra([-a[0], a[1]], b); return FR(r, 'Bir denizaltı deniz seviyesinin ' + F(a[0], a[1]) + ' km altında bulunmaktadır. Denizaltı ' + F(b[0], b[1]) + ' km yukarı çıkarsa deniz seviyesine göre konumunu gösteren rasyonel sayı hangisi olur?', x, 'Konum = −' + F(a[0], a[1]) + ' + ' + F(b[0], b[1]) + ' = ' + S(x)); },
    function (r) { var a = pf(r, 2, 6), b = pf(r, 2, 6), c = pf(r, 2, 6), x = ra(rs(a, b), c); return FR(r, F(a[0], a[1]) + ' − ' + F(b[0], b[1]) + ' + ' + F(c[0], c[1]) + ' işleminin sonucu kaçtır?', x, 'Soldan sağa işlem yapılır: ' + S(x)); },
    function (r) { var a = pf(r, 2, 8), b = pf(r, 2, 8), x = ra(a, [-b[0], b[1]]); return FR(r, 'x + (−' + F(b[0], b[1]) + ') = ' + F(a[0], a[1]) + ' eşitliğini sağlayan x değeri kaçtır?', ra(a, b), 'x = ' + F(a[0], a[1]) + ' + ' + F(b[0], b[1]) + ' = ' + S(ra(a, b))); },
    function (r) { var a = pf(r, 2, 9), b = pf(r, 2, 9); return FR(r, '(' + F(a[0], a[1]) + ' + ' + F(b[0], b[1]) + ') + (−' + F(b[0], b[1]) + ') işleminin sonucu kaçtır?', a, 'Bir sayı ile toplamsal tersi toplanınca 0 olur; geriye ' + S(a) + ' kalır.'); },
    function (r) { var a = pf(r, 3, 8), b = pf(r, 3, 8), rest = rs(rs([1, 1], a), b); if (rest[0] <= 0) { a = [1, 4]; b = [1, 3]; rest = rs(rs([1, 1], a), b); } return FR(r, 'Bir depodaki suyun ' + F(a[0], a[1]) + '’i ilk gün, ' + F(b[0], b[1]) + '’i ikinci gün kullanıldı. Suyun kaçta kaçı kalmıştır?', rest, '1 − ' + F(a[0], a[1]) + ' − ' + F(b[0], b[1]) + ' = ' + S(rest)); },
    function (r) { var a = r.pick([2, 4, 5, 10]), b = r.pick([2, 4, 5, 10]), p = r.int(1, 3 * a - 1), q = r.int(1, 2 * b - 1), v = Math.round((-1.5 * 1e2 + p / a * 1e2 + q / b * 1e2)) / 1e2; return Q(r, '−1,5 + ' + F(p, a) + ' + ' + F(q, b) + ' işleminin sonucunu ondalık sayı olarak yazınız.', N(v), [N(v + 0.5), N(-v), N(Math.round((v + 1.5) * 100) / 100)], 'Kesirleri ondalık yazıp toplarız: ' + N(v)); },
    function (r) { var a = pf(r, 2, 8), b = pf(r, 2, 8), x = ra(a, b); return FR(r, 'Sayı doğrusunda −' + F(a[0], a[1]) + ' ile ' + F(b[0], b[1]) + ' noktaları arasındaki uzaklık kaç birimdir?', x, 'Uzaklık = ' + F(b[0], b[1]) + ' − (−' + F(a[0], a[1]) + ') = ' + S(x)); },
    function (r) { var a = pf(r, 3, 9); while (a[0] >= a[1]) a = pf(r, 3, 9); var x = rs([1, 1], a); return FR(r, F(a[0], a[1]) + ' + □ = 1 olması için □ yerine hangi rasyonel sayı gelmelidir?', x, '□ = 1 − ' + F(a[0], a[1]) + ' = ' + S(x)); }
  ]);

  // ================= HAFTA 4: Rasyonel sayılarla çarpma ve bölme =================
  add(4, [
    function (r) { var a = pf(r, 2, 8), b = pf(r, 2, 8), x = rm(a, b); return FR(r, F(a[0], a[1]) + ' × ' + F(b[0], b[1]) + ' işleminin sonucunun en sade hâli hangisidir?', x, 'Paylar ve paydalar çarpılır: ' + S(x)); },
    function (r) { var m = r.int(2, 9), a = pf(r, 2, 9), x = rm([-m, 1], a); return FR(r, '(−' + m + ') × ' + F(a[0], a[1]) + ' işleminin sonucu kaçtır?', x, 'Negatif × pozitif = negatif: ' + S(x)); },
    function (r) { var d = r.pick([2, 3, 4, 5]), n = r.int(1, d - 1), t = d * r.int(1, 3) * 2 / (d % 2 === 0 ? 2 : 1), x = rm([-n, d], [t, 1]); return FR(r, 'Bir köstebek her dakika yer seviyesinin ' + F(n, d) + ' metre altına doğru ilerliyor. ' + t + ' dakika sonra köstebeğin yer seviyesine göre konumunu gösteren rasyonel sayı hangisidir?', x, '(−' + F(n, d) + ') × ' + t + ' = ' + S(x)); },
    function (r) { var a = pf(r, 2, 5), n = r.pick([2, 3, 4]), neg = r.pick([true, false]), base = neg ? [-a[0], a[1]] : a, res = [Math.pow(base[0], n), Math.pow(base[1], n)]; return FR(r, '(' + S(base) + ')<sup>' + n + '</sup> işleminin sonucu aşağıdakilerden hangisidir?', res, n + ' kez çarpılır: ' + S(res)); },
    function (r) { var n = r.int(2, 9); return Q(r, '(−1)<sup>' + n + '</sup> + (−1)<sup>' + (n + 1) + '</sup> işleminin sonucu kaçtır?', '0', ['1', '−1', '2'], 'Biri 1, diğeri −1 olur; toplamları 0’dır.'); },
    function (r) { var d = r.pick([2, 3, 4, 5]), c = r.int(1, d * 2 - 1), m = r.int(2, 7); while (R.gcd(c, d) !== 1) c = r.int(1, d * 2 - 1); var V = c * m, k = d * m; return qnum(r, 'Zehra teyze ' + V + ' litre sirkeyi ' + F(c, d) + ' litrelik şişelere dolduracaktır. Kaç şişe gerekir?', k, [k + 1, k - 1, V * c], V + ' ÷ ' + F(c, d) + ' = ' + k); },
    function (r) { var a = pf(r, 2, 8), b = pf(r, 2, 8), x = rv(a, b); return FR(r, F(a[0], a[1]) + ' ÷ ' + F(b[0], b[1]) + ' işleminin sonucu aşağıdakilerden hangisidir?', x, 'Bölme, bölenin çarpmaya göre tersi ile çarpmadır: ' + S(x)); },
    function (r) { var a = pf(r, 2, 6), b = pf(r, 2, 6), c = pf(r, 2, 6), x = ra(a, rm(b, c)); return FR(r, F(a[0], a[1]) + ' + ' + F(b[0], b[1]) + ' × ' + F(c[0], c[1]) + ' işleminin sonucu kaçtır?', x, 'Önce çarpma yapılır: ' + S(rm(b, c)) + '. Sonra toplanır: ' + S(x)); },
    function (r) { var b = r.pick([3, 4, 5]), d = r.pick([3, 4, 5]), a = r.pick(b === 4 ? [1, 3] : [1, 2]), c = r.pick(d === 4 ? [1, 3] : [1, 2]), m = r.int(2, 6), P = b * d * m, left = P - P * a / b, rest = left - left * c / d; return qnum(r, 'Yiğit’in parası ' + P + ' TL’dir. Önce parasının ' + F(a, b) + '’ünü harcıyor, sonra kalan parasının ' + F(c, d) + '’ünü harcıyor. Yiğit’in kalan parası kaç TL’dir?', rest, [P * a / b, left * c / d, rest + 10], 'İlk harcama ' + (P * a / b) + ' TL → kalan ' + left + ' TL; ikinci harcama ' + (left * c / d) + ' TL → kalan ' + rest + ' TL'); },
    function (r) { var d = r.pick([3, 4, 5, 6]), c = r.int(1, d - 1), m = r.int(3, 9), x = d * m; while (R.gcd(c, d) !== 1) c = r.int(1, d - 1); return qnum(r, 'Bir sayının ' + F(c, d) + '’si ' + (c * m) + ' ise bu sayı kaçtır?', x, [c * m, x + d, x - c], 'Sayı = ' + (c * m) + ' ÷ ' + F(c, d) + ' = ' + x); },
    function (r) { var a = pf(r, 2, 6), x = r.int(5, 20), y = r.int(5, 20); var tot = rm(a, [x + y, 1]); return FR(r, F(a[0], a[1]) + ' × ' + x + ' + ' + F(a[0], a[1]) + ' × ' + y + ' işleminin sonucu kaçtır?', tot, 'Dağılma özelliği: ' + F(a[0], a[1]) + ' × (' + x + ' + ' + y + ') = ' + S(tot)); }
  ]);

  // ================= HAFTA 5: Rasyonel sayılarla ilgili problemler =================
  add(5, [
    function (r) { var a = pf(r, 3, 9), b = pf(r, 3, 9), rest = rs(rs([1, 1], a), b); if (rest[0] <= 0) { a = [1, 5]; b = [2, 5]; rest = rs(rs([1, 1], a), b); } return FR(r, 'Bir işin ilk gün ' + F(a[0], a[1]) + '’i, ikinci gün ' + F(b[0], b[1]) + '’i yapılmıştır. İşin kaçta kaçı kalmıştır?', rest, '1 − ' + F(a[0], a[1]) + ' − ' + F(b[0], b[1]) + ' = ' + S(rest)); },
    function (r) { var d = r.pick([4, 5, 8]), n = r.int(1, d - 1), L = d * r.int(1, 4), cut = L * n / d; return qnum(r, 'Uzunluğu ' + L + ' metre olan bir ipin ' + F(n, d) + '’i kesiliyor. Geriye kaç metrelik ip kalır?', L - cut, [cut, L + cut, L - n], L + ' − ' + cut + ' = ' + (L - cut)); },
    function (r) { var d = r.pick([5, 6, 8]), n = r.int(2, d - 1), m = r.int(2, 9); while (R.gcd(n, d) !== 1) n = r.int(2, d - 1); var T = d * m * 10, part = T * n / d; return qnum(r, 'Bir yolculukta toplam yolun ' + F(n, d) + '’i olan ' + part + ' km gidilmiştir. Yolun tamamı kaç km’dir?', T, [part * n, part + d, T + 10], 'Yolun tamamı = ' + part + ' ÷ ' + F(n, d) + ' = ' + T + ' km'); },
    function (r) { var k = r.pick([10, 12, 15, 20]), th = r.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8]), tot = Math.round(th * k * 10) / 10; return Q(r, k + ' dilimlik bir ekmeğin tüm dilimleri üst üste konulduğunda yükseklik ' + N(tot) + ' cm oluyor. Bir dilim ekmeğin kalınlığı kaç cm’dir?', N(th), [N(Math.round(th * 10 * 100) / 100), N(Math.round(th / 10 * 100) / 100), N(Math.round((th + 0.1) * 100) / 100)], N(tot) + ' ÷ ' + k + ' = ' + N(th)); },
    function (r) { var s = r.pick([2.5, 2.8, 3, 3.2]), k = r.int(4, 12); return qnum(r, 'Ardışık katlar arası mesafesi ' + N(s) + ' metre olan bir binada asansör zemin kattan ' + N(Math.round(s * k * 10) / 10) + ' metre yükseliyor. Asansör kaçıncı kattadır?', k, [k + 1, k - 1, k + 2], N(Math.round(s * k * 10) / 10) + ' ÷ ' + N(s) + ' = ' + k); },
    function (r) { var T0 = r.int(15, 28), rate = r.int(2, 5), t = r.int(6, 14), T1 = T0 - rate * t; return Q(r, 'Derin dondurucuya konulan bir gıdanın sıcaklığı ' + t + ' dakikada ' + T0 + ' °C’den ' + N(T1) + ' °C’ye düşüyor. Gıdanın sıcaklığı her dakika ortalama kaç °C değişmiştir?', N(-rate), [N(rate), N(-rate - 1), N(-(T0 + T1) / t || -rate * 2)], '(' + N(T1) + ' − ' + T0 + ') ÷ ' + t + ' = ' + N(-rate)); },
    function (r) { var t = [r.int(-6, 6), r.int(-6, 6), r.int(-6, 8), r.int(-4, 12), r.int(-4, 10)], avg = r.int(2, 6), sum = t.reduce(function (a, b) { return a + b; }, 0), six = avg * 6 - sum; return qnum(r, 'Beş bölgenin Ocak ayı ortalama sıcaklıkları (°C): ' + t.map(N).join(', ') + '. Altı bölgenin sıcaklık ortalaması ' + avg + ' °C olduğuna göre altıncı bölgenin sıcaklığı kaç °C’dir?', six, [six + 1, six - 1, avg * 6 + sum], 'Toplam = ' + avg + ' · 6 = ' + (avg * 6) + '; altıncı değer = ' + (avg * 6) + ' − (' + N(sum) + ') = ' + N(six)); },
    function (r) { var k = r.pick([2, 3]), t = r.int(2, 4), s = r.int(2, 5), v = s * Math.pow(k, t); return qnum(r, 'Bir bakteri kolonisinde başlangıçta ' + s + ' bakteri vardır ve bakteri sayısı her saat ' + k + ' katına çıkmaktadır. ' + t + ' saat sonra kaç bakteri olur?', v, [s * k * t, s * Math.pow(k, t - 1), s * Math.pow(k, t + 1)], s + ' · ' + k + '<sup>' + t + '</sup> = ' + v); },
    function (r) { var b = r.pick([2, 3]), a = r.int(1, b - 1), H = b * b * r.int(2, 8) * 5, h2 = H * a * a / (b * b); while (R.gcd(a, b) !== 1) { a = r.int(1, b - 1); h2 = H * a * a / (b * b); } return qnum(r, 'Bir top bırakıldığı yüksekliğin ' + F(a, b) + '’i kadar yüksekliğe sıçrıyor. ' + H + ' metreden bırakılan top yere iki kez çarptıktan sonra kaç metre yüksekliğe çıkar?', h2, [H * a / b, H * a * 2 / b, h2 + 1], H + ' · ' + F(a, b) + ' · ' + F(a, b) + ' = ' + h2); },
    function (r) {
      var L = r.int(10, 16), a = [r.pick([1, 3]), 4], k = r.int(4, 7), c = [3, 2], used = rm([k, 1], a), rest = rs([L, 1], used), cnt = Math.floor(rest[0] / rest[1] / (c[0] / c[1]));
      return qnum(r, 'Esra’nın ' + L + ' metre kurdelesi var. Her biri ' + F(a[0], a[1]) + ' metre kurdele kullanan ' + k + ' küçük paketi süslüyor. Kalan kurdeleyle her biri ' + F(c[0], c[1]) + ' metre kurdele gerektiren en fazla kaç büyük paket süsleyebilir?', cnt, [cnt + 1, cnt - 1 < 0 ? cnt + 2 : cnt - 1, cnt + 2], 'Kullanılan: ' + S(used) + ' m; kalan: ' + S(rest) + ' m; kalan ÷ ' + F(c[0], c[1]) + ' ≈ ' + N(Math.round(rest[0] / rest[1] / (c[0] / c[1]) * 100) / 100) + ' → tam kısmı ' + cnt);
    }
  ]);

  // ================= HAFTA 6: Eş küplerle yapılar ve üç görünüm =================
  function heightGrid(r) { var g = []; for (var y = 0; y < 3; y++) { g.push([]); for (var x = 0; x < 3; x++) g[y].push(r.pick([0, 1, 1, 2, 2, 3])); } return g; }
  function gridHtml(g) { return '<table class="tbl" style="width:auto;margin:6px auto"><tbody>' + g.map(function (row, i) { return '<tr><th>' + (i + 1) + '. sıra</th>' + row.map(function (v) { return '<td style="text-align:center;min-width:44px">' + v + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'; }
  add(6, [
    function (r) { var a = r.int(2, 6), b = r.int(2, 5), c = r.int(2, 5); return qnum(r, 'Eş küplerle ' + a + ' × ' + b + ' × ' + c + ' ölçülerinde (uzunluk × genişlik × yükseklik) dolu bir dikdörtgenler prizması yapılıyor. Kaç eş küp kullanılır?', a * b * c, [a * b + c, a + b + c, 2 * (a * b + b * c + a * c)], 'Küp sayısı = ' + a + ' · ' + b + ' · ' + c + ' = ' + a * b * c); },
    function (r) { var a = r.int(2, 6), b = r.int(2, 5), c = r.int(2, 5), v = r.pick(['önden', 'yandan', 'üstten']), val = v === 'önden' ? a * c : v === 'yandan' ? b * c : a * b; return qnum(r, a + ' × ' + b + ' × ' + c + ' ölçülerinde (uzunluk × genişlik × yükseklik) eş küplerden oluşan dolu prizmaya <b>' + v + '</b> bakıldığında kaç kare görünür?', val, [a * b * c, a + b, val + 1], 'Görünen yüz bir ' + (v === 'önden' ? a + ' × ' + c : v === 'yandan' ? b + ' × ' + c : a + ' × ' + b) + ' dikdörtgenidir.'); },
    function (r) { var n = r.int(3, 6), k = r.pick(['üç', 'iki', 'bir', 'hiçbir']), val = k === 'üç' ? 8 : k === 'iki' ? 12 * (n - 2) : k === 'bir' ? 6 * (n - 2) * (n - 2) : Math.pow(n - 2, 3); return qnum(r, 'Ayrıtı ' + n + ' birim olan bir küp, ayrıtları 1 birim olan ' + (n * n * n) + ' eş küpten oluşturulmuştur. Dış yüzeyi boyanan bu küpün ' + k + ' yüzü boyalı olan kaç küçük küpü vardır?', val, [val + 2, val * 2, val + 4], k === 'üç' ? 'Üç yüzü boyalı küpler köşelerdedir: 8' : k === 'iki' ? 'Her ayrıtta (n−2) tane: 12 · ' + (n - 2) + ' = ' + val : k === 'bir' ? 'Her yüzde (n−2)² tane: 6 · ' + (n - 2) * (n - 2) + ' = ' + val : 'İç küp: (n−2)³ = ' + val); },
    function (r) {
      var N0 = r.pick([12, 16, 18, 20, 24, 30, 36]), cnt = 0;
      for (var a = 1; a <= N0; a++) for (var b = a; b <= N0; b++) { if (N0 % (a * b) === 0) { var c = N0 / (a * b); if (c >= b) cnt++; } }
      return qnum(r, N0 + ' adet eş küp tamamen kullanılarak (hiç küp artmadan) kaç farklı dikdörtgenler prizması oluşturulabilir? (Ayrıt uzunlukları sıralanışı farklı olan prizmalar aynı sayılır.)', cnt, [cnt + 1, cnt + 2, cnt - 1 > 0 ? cnt - 1 : cnt + 3], 'a ≤ b ≤ c ve a · b · c = ' + N0 + ' olan üçlüler sayılır: ' + cnt + ' farklı prizma.');
    },
    function (r) { var a = r.int(2, 5), b = r.int(2, 5), c = r.int(2, 6), V = a * b * c; return qnum(r, 'Hacmi ' + V + ' birimküp olan bir dikdörtgenler prizmasının tabanı ' + a + ' × ' + b + ' birimdir. Prizmanın yüksekliği kaç birimdir?', c, [c + 1, c - 1 > 0 ? c - 1 : c + 2, a + b], 'Yükseklik = ' + V + ' ÷ (' + a + ' · ' + b + ') = ' + c); },
    function (r) { var a = r.int(3, 6), b = r.int(3, 6), c = r.int(3, 6), k = r.int(1, 2); return qnum(r, a + ' × ' + b + ' × ' + c + ' ölçülerindeki dolu prizmanın bir köşesinden ayrıtı ' + k + ' birim olan küp biçiminde parça çıkarılıyor. Kalan yapı kaç birimküptür?', a * b * c - k * k * k, [a * b * c, a * b * c - k * k, a * b * c + k * k * k], a * b * c + ' − ' + k * k * k + ' = ' + (a * b * c - k * k * k)); },
    function (r) { var g = heightGrid(r), tot = 0; g.forEach(function (row) { row.forEach(function (v) { tot += v; }); }); return qnum(r, 'Aşağıdaki tabloda, 3 × 3’lük bir zemine yerleştirilen eş küp kulelerinin yükseklikleri (küp sayısı) verilmiştir.' + gridHtml(g) + 'Bu yapıda toplam kaç eş küp kullanılmıştır?', tot, [tot + 1, tot - 1, tot + 3], 'Tüm sayılar toplanır: ' + tot); },
    function (r) { var g = heightGrid(r), nz = 0; g.forEach(function (row) { row.forEach(function (v) { if (v > 0) nz++; }); }); return qnum(r, 'Aşağıdaki tabloda 3 × 3’lük zemine yerleştirilen eş küp kulelerinin yükseklikleri verilmiştir.' + gridHtml(g) + 'Yapıya <b>üstten</b> bakıldığında kaç kare görülür?', nz, [nz + 1, nz === 0 ? 2 : nz - 1, 9 + 1], 'Yüksekliği 0’dan büyük olan sütunların sayısı kadar kare görünür: ' + nz); },
    function (r) { var g = heightGrid(r), s = 0, cols = []; for (var x = 0; x < 3; x++) { var m = 0; for (var y = 0; y < 3; y++) m = Math.max(m, g[y][x]); cols.push(m); s += m; } return qnum(r, 'Tabloda her satır bir sırayı, her sütun bir kolonu göstermektedir; sayılar küp sayısıdır.' + gridHtml(g) + 'Yapıya <b>önden</b> (sıralara doğru) bakıldığında her kolondan en yüksek kule görünür. Önden görünümde toplam kaç kare görülür?', s, [s + 1, s - 1 >= 0 ? s - 1 : s + 2, s + 2], 'Kolonların en büyük değerleri: ' + cols.join(' + ') + ' = ' + s); },
    function (r) { var a = r.int(2, 4), b = r.int(2, 4), h = r.int(2, 4), n = a * b * h; return qnum(r, 'Tabanı ' + a + ' × ' + b + ' olan ve ' + h + ' kat yüksekliğindeki dolu eş küp yapısına küp eklenerek aynı tabanla bir kat daha yükseltiliyor. Kaç eş küp daha gerekir?', a * b, [a * b * h, a + b, a * b + 1], 'Bir kat = ' + a + ' · ' + b + ' = ' + a * b + ' küp'); },
    function (r) { var e = r.int(2, 5), m = r.int(2, 4), side = e * m; return qnum(r, 'Ayrıtı ' + side + ' cm olan bir küp biçimindeki tahta bloktan ayrıtı ' + e + ' cm olan en fazla kaç küp kesilebilir?', m * m * m, [m * m, m * 6, m * m * m + m], 'Her ayrıtta ' + side + ' ÷ ' + e + ' = ' + m + ' küp; toplam ' + m + '³ = ' + m * m * m); }
  ]);

  // ================= HAFTA 7: Dikdörtgenler prizmasının açınımı ve yüzey alanı =================
  function area(a, b, c) { return 2 * (a * b + b * c + a * c); }
  add(7, [
    function (r) { var a = r.int(2, 12), b = r.int(2, 10), c = r.int(2, 9); return qnum(r, 'Ayrıtları ' + a + ' cm, ' + b + ' cm ve ' + c + ' cm olan dikdörtgenler prizmasının yüzey alanı kaç cm²’dir?', area(a, b, c), [a * b * c, area(a, b, c) / 2, area(a, b, c) + a * b], '2(' + a * b + ' + ' + b * c + ' + ' + a * c + ') = ' + area(a, b, c)); },
    function (r) { var a = r.int(2, 14); return qnum(r, 'Bir ayrıtı ' + a + ' cm olan küpün yüzey alanı kaç cm²’dir?', 6 * a * a, [4 * a * a, a * a * a, 12 * a], '6 · ' + a + '² = ' + 6 * a * a); },
    function (r) { var a = r.int(3, 12); return qnum(r, 'Yüzey alanı ' + (6 * a * a) + ' cm² olan küpün bir ayrıtı kaç cm’dir?', a, [a + 1, a * 2, a - 1], '6a² = ' + 6 * a * a + ' → a² = ' + a * a + ' → a = ' + a); },
    function (r) { var a = r.int(4, 14), b = r.int(3, 10), c = r.int(2, 9), op = 2 * c * (a + b) + a * b; return qnum(r, 'Üstü açık, taban ölçüleri ' + a + ' cm × ' + b + ' cm ve yüksekliği ' + c + ' cm olan dikdörtgenler prizması biçimindeki bir kutuyu yapmak için en az kaç cm² karton gerekir?', op, [area(a, b, c), 2 * c * (a + b), op + a * b], 'Alt ' + a * b + ' + yan yüzeyler ' + 2 * c * (a + b) + ' = ' + op); },
    function (r) { var a = r.int(3, 10), b = r.int(3, 10), c = r.int(2, 8), p = r.int(2, 9); return qnum(r, 'Ayrıtları ' + a + ' dm, ' + b + ' dm ve ' + c + ' dm olan kapalı dikdörtgenler prizması biçimindeki bir kutunun dış yüzeyi dm² başına ' + p + ' TL’ye boyanacaktır. Boyama ücreti kaç TL’dir?', area(a, b, c) * p, [area(a, b, c) * p / 2, (a * b * c) * p, (area(a, b, c) + a) * p], area(a, b, c) + ' · ' + p + ' = ' + area(a, b, c) * p); },
    function (r) { var a = r.int(3, 9), h = r.int(3, 12); return qnum(r, 'Tabanı kenar uzunluğu ' + a + ' cm olan kare, yüksekliği ' + h + ' cm olan kare prizmanın yüzey alanı kaç cm²’dir?', 2 * a * a + 4 * a * h, [a * a * h, 2 * a * a + 2 * a * h, 4 * a * h], '2 · ' + a * a + ' + 4 · ' + a * h + ' = ' + (2 * a * a + 4 * a * h)); },
    function (r) { var x = r.int(2, 9), y = r.int(2, 9), z = r.int(2, 9); return qnum(r, 'Bir dikdörtgenler prizmasının farklı üç yüzünün alanları ' + (x * y) + ' cm², ' + (y * z) + ' cm² ve ' + (x * z) + ' cm²’dir. Bu prizmanın yüzey alanı kaç cm²’dir?', 2 * (x * y + y * z + x * z), [x * y + y * z + x * z, 3 * (x * y + y * z + x * z), 2 * x * y * z], 'Karşılıklı yüzler eştir: 2(' + x * y + ' + ' + y * z + ' + ' + x * z + ') = ' + 2 * (x * y + y * z + x * z)); },
    function (r) { var k = r.pick([2, 3, 4]); return Q(r, 'Bir küpün ayrıtları ' + k + ' katına çıkarılırsa yüzey alanı kaç katına çıkar?', k * k + ' katı', [k + ' katı', k * k * k + ' katı', 2 * k + ' katı'], 'Yüzey alanı ayrıtın karesiyle orantılıdır: ' + k + '² = ' + k * k); },
    function (r) { var a = r.int(4, 10), b = r.int(3, 8), c = r.int(2, 6), p = r.int(2, 8); return qnum(r, 'Zemin ve tavanı boyanmayacak olan, taban ölçüleri ' + a + ' m × ' + b + ' m ve yüksekliği ' + c + ' m olan dikdörtgenler prizması biçimindeki bir odanın duvarları m² başına ' + p + ' TL’ye boyanacaktır. Boya ücreti kaç TL’dir?', 2 * c * (a + b) * p, [area(a, b, c) * p, c * (a + b) * p, 2 * (a + b) * p], 'Duvarların alanı 2 · ' + c + ' · (' + a + ' + ' + b + ') = ' + 2 * c * (a + b) + ' m²'); },
    function (r) { var a = r.int(3, 10), b = r.int(3, 10), c = r.int(2, 8); return qnum(r, 'Ayrıtları ' + a + ' cm, ' + b + ' cm ve ' + c + ' cm olan dikdörtgenler prizmasının <b>yan yüzey alanı</b> (taban ve tavan hariç) kaç cm²’dir? (Taban ayrıtları ' + a + ' ve ' + b + ' cm’dir.)', 2 * c * (a + b), [area(a, b, c), c * (a + b), 2 * a * b], 'Yan yüzler 2 · ' + c + ' · (' + a + ' + ' + b + ') = ' + 2 * c * (a + b)); }
  ]);

  // ================= HAFTA 8: Hacim ve hacim ölçme birimleri =================
  add(8, [
    function (r) { var a = r.int(2, 12), b = r.int(2, 10), c = r.int(2, 9); return qnum(r, 'Ayrıtları ' + a + ' cm, ' + b + ' cm ve ' + c + ' cm olan dikdörtgenler prizmasının hacmi kaç cm³’tür?', a * b * c, [area(a, b, c), a + b + c, a * b * c + a * b], a + ' · ' + b + ' · ' + c + ' = ' + a * b * c); },
    function (r) { var x = r.int(2, 20); return qnum(r, x + ' dm³ kaç litredir?', x, [x * 10, x * 100, x * 1000], '1 dm³ = 1 litre'); },
    function (r) { var x = r.int(2, 15); return qnum(r, x + ' litre kaç cm³’tür?', x * 1000, [x * 100, x * 10, x * 10000], '1 L = 1 dm³ = 1000 cm³'); },
    function (r) { var x = r.int(2, 9); return qnum(r, x + ' m³ kaç litredir?', x * 1000, [x * 100, x * 1000000, x * 10], '1 m³ = 1000 dm³ = 1000 L'); },
    function (r) {
      var a, b, h, tries = 0; do { a = r.pick([40, 50, 25, 20, 100]); b = r.pick([20, 25, 30, 40, 50]); h = r.int(4, 30); tries++; } while ((a * b * h) % 1000 !== 0 && tries < 200);
      if ((a * b * h) % 1000 !== 0) { a = 50; b = 40; h = r.int(5, 30); }
      var L = a * b * h / 1000;
      return qnum(r, 'Tabanı ' + a + ' cm × ' + b + ' cm olan dikdörtgenler prizması biçimindeki bir akvaryuma ' + N(L) + ' litre su konuluyor. Suyun yüksekliği kaç cm olur?', h, [h + 2, h * 2, h - 1], 'Hacim = ' + N(L * 1000) + ' cm³; yükseklik = ' + N(L * 1000) + ' ÷ (' + a + ' · ' + b + ') = ' + h);
    },
    function (r) { var e = r.pick([40, 50, 25, 20]), m = r.int(2, 4), n = r.int(2, 3), p = r.int(2, 3), A = e * m / 100 * 1, V; var a = e * m, b = e * n, c = e * p; var cnt = m * n * p; return qnum(r, 'Ölçüleri ' + N(a / 100) + ' m × ' + N(b / 100) + ' m × ' + N(c / 100) + ' m olan bir kamyon kasasına ayrıtı ' + e + ' cm olan küp biçimindeki koliler boşluk kalmayacak biçimde dizilecektir. Kasaya kaç koli sığar?', cnt, [cnt + m, cnt * 2, cnt - 1 > 0 ? cnt - 1 : cnt + 3], 'Her ayrıtta ' + m + ', ' + n + ', ' + p + ' koli: ' + m + ' · ' + n + ' · ' + p + ' = ' + cnt); },
    function (r) { var a = r.pick([20, 25, 40, 50]), b = r.pick([20, 25, 40, 50]), h1 = r.int(10, 20), dh = r.int(2, 6); return qnum(r, 'Tabanı ' + a + ' cm × ' + b + ' cm olan dikdörtgenler prizması biçimindeki bir kapta su yüksekliği ' + h1 + ' cm iken kaba bir taş atılıyor ve su yüksekliği ' + (h1 + dh) + ' cm oluyor. Taşın hacmi kaç cm³’tür? (Su taşmamıştır.)', a * b * dh, [a * b * (h1 + dh), a * b * h1, (a + b) * dh], 'Hacim = taban × yükselme = ' + a * b + ' · ' + dh + ' = ' + a * b * dh); },
    function (r) { var a = r.int(4, 10), b = r.int(3, 9), c = r.int(2, 6), L = r.pick([2, 4, 5]); var V = a * b * c * 1; return qnum(r, 'Ayrıtları ' + a + ' dm, ' + b + ' dm ve ' + c + ' dm olan dikdörtgenler prizması biçimindeki bir kabın hacmi kaç litredir?', V, [V * 10, V / 10 === Math.floor(V / 10) ? V / 10 : V + 10, V * 2], a + ' · ' + b + ' · ' + c + ' = ' + V + ' dm³ = ' + V + ' L'); },
    function (r) { var p = r.pick([6, 8, 10, 12]), P = r.pick([250, 500, 1000, 2000]), m3 = p * 4 * P / 1000; return qnum(r, 'Dakikada ' + p + ' litre su akıtan bir musluk, günde 2 kez 2’şer dakika açık bırakılıyor. ' + P + ' kişi bunu bir gün yaparsa toplam kaç m³ su israf edilir?', m3, [m3 * 10, m3 * 100, m3 / 10], p + ' · 4 · ' + P + ' = ' + (p * 4 * P) + ' L = ' + m3 + ' m³'); },
    function (r) { var V = r.pick([1, 2, 3, 4, 5]) * 1000, a = r.pick([10, 20, 25, 40, 50]); var b = r.pick([10, 20, 25, 40, 50]); var h = V / (a * b); if (h !== Math.floor(h)) { a = 20; b = 25; h = V / (a * b); } return qnum(r, 'Hacmi ' + N(V) + ' cm³ olan, tabanı ' + a + ' cm × ' + b + ' cm olan dikdörtgenler prizmasının yüksekliği kaç cm’dir?', h, [h + 1, h * 2, V / a], 'Yükseklik = ' + N(V) + ' ÷ ' + (a * b) + ' = ' + h); }
  ]);

  // ================= HAFTA 9: Yüzey alanı ve hacim problemleri =================
  add(9, [
    function (r) { var a = r.int(4, 10), b = r.int(4, 10), c = r.int(4, 10), k = r.int(1, 3); return qnum(r, 'Ayrıtları ' + a + ' cm, ' + b + ' cm ve ' + c + ' cm olan dolu bir dikdörtgenler prizmasının bir köşesinden ayrıtı ' + k + ' cm olan küp biçiminde bir parça kesilip çıkarılıyor. Kalan cismin yüzey alanı kaç cm²’dir?', area(a, b, c), [area(a, b, c) - 3 * k * k, area(a, b, c) + 3 * k * k, area(a, b, c) - k * k], 'Köşeden küp çıkarılınca üç yüz küçülür, üç yeni yüz eklenir; yüzey alanı değişmez: ' + area(a, b, c)); },
    function (r) { var a = r.int(4, 10), b = r.int(4, 10), c = r.int(4, 10), k = r.int(1, 3); return qnum(r, 'Ayrıtları ' + a + ' cm, ' + b + ' cm ve ' + c + ' cm olan dolu bir dikdörtgenler prizmasının bir köşesinden ayrıtı ' + k + ' cm olan küp biçiminde parça kesilip çıkarılıyor. Kalan cismin hacmi kaç cm³’tür?', a * b * c - k * k * k, [a * b * c, a * b * c - k * k, a * b * c + k * k * k], a * b * c + ' − ' + k * k * k + ' = ' + (a * b * c - k * k * k)); },
    function (r) { var a = r.int(3, 10); return qnum(r, 'Yüzey alanı ' + (6 * a * a) + ' cm² olan bir küpün hacmi kaç cm³’tür?', a * a * a, [a * a, 6 * a * a * a, a * a * a + a], 'a = ' + a + ' cm; hacim = ' + a * a * a); },
    function (r) { var a = r.int(2, 5), b = r.int(2, 5), c = r.int(2, 6); return qnum(r, 'Hacmi ' + (a * b * c) + ' cm³ olan bir dikdörtgenler prizmasının ayrıtları birer tam sayı ve ' + a + ' cm ile ' + b + ' cm’dir. Prizmanın yüzey alanı kaç cm²’dir?', area(a, b, c), [a * b * c, area(a, b, c) / 2, area(a, b, c) + 2 * a], 'Üçüncü ayrıt ' + c + ' cm; yüzey alanı 2(' + a * b + ' + ' + b * c + ' + ' + a * c + ') = ' + area(a, b, c)); },
    function (r) { var k = r.pick([2, 3, 4]); return Q(r, 'Bir küpün ayrıtları ' + k + ' katına çıkarılırsa hacmi kaç katına çıkar?', k * k * k + ' katı', [k * k + ' katı', k + ' katı', 3 * k + ' katı'], 'Hacim ayrıtın küpüyle orantılıdır: ' + k + '³ = ' + k * k * k); },
    function (r) { var e = r.int(2, 4), m = r.int(2, 4), n = r.int(2, 4), p = r.int(2, 4); return qnum(r, 'Ölçüleri ' + (e * m) + ' cm × ' + (e * n) + ' cm × ' + (e * p) + ' cm olan dikdörtgenler prizması biçimindeki bir peynir bloğu, ayrıtı ' + e + ' cm olan küplere kesiliyor. Kaç küp elde edilir?', m * n * p, [m + n + p, m * n * p + m, (m * n * p) / 2 === Math.floor(m * n * p / 2) ? (m * n * p) / 2 : m * n * p + 2], m + ' · ' + n + ' · ' + p + ' = ' + m * n * p); },
    function (r) { var a = r.int(3, 8), b = r.int(3, 8), c = r.int(2, 6), p = r.int(2, 9); return qnum(r, 'Ayrıtları ' + a + ' dm, ' + b + ' dm ve ' + c + ' dm olan kapalı dikdörtgenler prizması biçimindeki bir kutunun dış yüzeyi dm² başına ' + p + ' TL’ye kaplanacaktır. Kaplama maliyeti kaç TL’dir?', area(a, b, c) * p, [a * b * c * p, area(a, b, c) * p / 2, (area(a, b, c) - a * b) * p], area(a, b, c) + ' · ' + p + ' = ' + area(a, b, c) * p); },
    function (r) { var a = r.pick([20, 25, 40]), b = r.pick([20, 25, 40]), h = r.pick([20, 40, 50]), A2 = r.pick([50, 40, 25]), B2 = r.pick([20, 25, 40]); var V = a * b * h, h2 = V / (A2 * B2); if (h2 !== Math.floor(h2)) { a = 50; b = 40; h = 20; A2 = 40; B2 = 25; V = a * b * h; h2 = V / (A2 * B2); } return qnum(r, 'Tabanı ' + a + ' cm × ' + b + ' cm ve yüksekliği ' + h + ' cm olan tamamen dolu bir su deposunun suyu, tabanı ' + A2 + ' cm × ' + B2 + ' cm olan boş bir depoya boşaltılıyor. İkinci depodaki suyun yüksekliği kaç cm olur?', h2, [h2 + 5, h, h2 * 2], 'Hacim = ' + N(V) + ' cm³; yükseklik = ' + N(V) + ' ÷ ' + (A2 * B2) + ' = ' + h2); },
    function (r) { var e = r.pick([2, 4, 5, 10]), ok = [2, 3, 4, 5, 6].filter(function (v) { return (v * 10) % e === 0; }), a = r.pick(ok), b = r.pick(ok), c = r.pick(ok), cnt = (a * 10 / e) * (b * 10 / e) * (c * 10 / e); return qnum(r, 'Ölçüleri ' + a + ' m × ' + b + ' m × ' + c + ' m olan bir konteynere, ayrıtı ' + e + ' dm olan küp biçimindeki kutular boşluk kalmayacak şekilde yerleştirilecektir. Kaç kutu sığar?', cnt, [cnt / 2, cnt * 2, cnt + e], (a * 10) + ' ÷ ' + e + ', ' + (b * 10) + ' ÷ ' + e + ', ' + (c * 10) + ' ÷ ' + e + ' → ' + (a * 10 / e) + ' · ' + (b * 10 / e) + ' · ' + (c * 10 / e) + ' = ' + cnt); },
    function (r) { var a = r.int(3, 8), b = r.int(3, 8), c = r.int(3, 8), k = r.int(3, 12); return qnum(r, 'Ayrıtları ' + a + ' cm, ' + b + ' cm, ' + c + ' cm olan dikdörtgenler prizmasından yapılmış ' + k + ' tane özdeş kutunun toplam hacmi kaç cm³’tür?', a * b * c * k, [area(a, b, c) * k, a * b * c + k, a * b * c], a + ' · ' + b + ' · ' + c + ' · ' + k + ' = ' + a * b * c * k); }
  ]);
})();
