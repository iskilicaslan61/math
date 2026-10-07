/* 1. TEMA: Sayılar ve Nicelikler (1) (15 ders saati) — Hafta 1-4 */
(function () {
  'use strict';
  var N = MC.num, Q = MC.Q;
  TEMAS.push({ id: 1, title: 'Sayılar ve Nicelikler (1)', hours: 15, color: '#8e44ad',
    summary: 'Çarpan ve kat, bölünebilme kuralları, asal sayılar ve asal çarpanlar, ortak kat ve ortak bölen.' });

  function divs(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function factors(n) { var f = [], p = 2; while (n > 1) { while (n % p === 0) { f.push(p); n /= p; } p++; } return f; }
  var PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  var COMPS = [9, 15, 21, 25, 27, 33, 35, 39, 49, 51, 55, 57, 63, 77, 91];
  function list(a) { return a.join(', '); }

  // ============ HAFTA 1 ============
  WEEKS.push({
    tema: 1, no: 1, title: 'Bir Doğal Sayının Çarpanları ve Katları', hours: 4, code: 'MAT.6.1.1 (a-f)',
    outcomes: ['Bir doğal sayının çarpan ve katlarına yönelik varsayımlarda bulunur.', 'Örnekleri inceleyerek çarpan ve katlara ilişkin genellemeleri belirler ve modellerle sınar.', 'Doğrulayabileceği önermeyi sözel ya da sembolik olarak sunar.'],
    lesson: [
      { h: 'Ders Açılışı (Köprü Kurma)', html: '<p>24 kareyi dikdörtgen biçiminde kaç farklı şekilde dizebilirsiniz? Öğrencilere kareli kâğıt/küp verin: 1×24, 2×12, 3×8, 4×6. Her dizilişteki kenar sayıları 24’ün <b>çarpanlarıdır</b>. Bir sayının ikiden fazla çarpanı olabileceğini keşfettirin.</p>' },
      { h: 'Çarpan Nedir?', html: '<div class="box def">Bir doğal sayıyı <b>kalansız bölen</b> doğal sayılara o sayının <b>çarpanları</b> (bölenleri) denir. 3 · 8 = 24 ise 3 ve 8, 24’ün çarpanlarıdır.</div><div class="box ex"><b>Örnek:</b> 24’ün çarpanları: 1, 2, 3, 4, 6, 8, 12, 24 (8 tane).<br>Çarpanları bulurken çarpım çiftleri yazın: 1·24, 2·12, 3·8, 4·6.</div><div class="box tip"><b>Genelleme:</b> Sıfır hariç her doğal sayı 1’e ve kendisine kalansız bölünür; yani 1 ve sayının kendisi her zaman çarpandır.</div>' },
      { h: 'Kat Nedir?', html: '<div class="box def">Bir doğal sayının, sayma sayılarıyla çarpımından elde edilen sayılara o sayının <b>katları</b> denir. 6’nın katları: 6, 12, 18, 24, 30, …</div><ul><li>Bir sayının <b>katları sonsuzdur</b>, çarpanları <b>sonludur</b>.</li><li>Bir sayının katları o sayıya <b>tam bölünür</b>.</li><li>a sayısı b’nin katı ise b, a’nın çarpanıdır. (24, 6’nın katıdır ⇔ 6, 24’ün çarpanıdır.)</li></ul>' },
      { h: 'Varsayım – Sınama – Önerme', html: '<div class="box idea"><b>Etkinlik:</b> “Bir sayının katları hep o sayıdan büyüktür veya ona eşittir.” varsayımını sayı doğrusunda atlamalarla sınayın (3’er, 5’er atlama). Bulduğunuz ilişkiyi cümleyle yazın: <i>“Bir doğal sayının katları, bu sayıya eşit ya da ondan büyüktür.”</i></div><p>Örüntü çalışması: 7, 14, 21, 28… Hangi sayılar 7’nin katıdır? Her adımda ne kadar artıyor?</p>' },
      { h: 'Sık Yapılan Hatalar', html: '<ul><li>1’i ve sayının kendisini çarpan olarak yazmayı unutmak.</li><li>“Kat” ile “çarpan”ı karıştırmak: 3, 12’nin çarpanı; 12, 3’ün katıdır.</li><li>0’ı sayma sayısı sanmak: katlar 6·1, 6·2, … ile başlar.</li></ul>' }
    ],
    makers: [
      function (r) { var n = r.pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 45, 48]); var c = divs(n).length; return Q(r, N(n) + ' sayısının kaç tane çarpanı vardır?', c, [c + 1, c - 1, c + 2], N(n) + '’in çarpanları: ' + list(divs(n)) + ' → ' + c + ' tane.'); },
      function (r) { var n = r.pick([24, 30, 36, 40, 42, 48, 60]); var d = divs(n); var wrong = []; for (var i = 2; i < n; i++) if (n % i) wrong.push(i); var w = r.sample(wrong.filter(function (x) { return x < n; }), 1)[0]; return Q(r, 'Aşağıdakilerden hangisi ' + n + ' sayısının çarpanı <b>değildir</b>?', w, r.sample(d.filter(function (x) { return x > 1 && x < n; }), 3), w + ', ' + n + '’i kalansız bölmez.'); },
      function (r) { var a = r.int(3, 12), k = r.int(5, 9); return Q(r, a + ' sayısının ' + k + '. katı (sayma sayısıyla çarpımı) kaçtır?', a * k, [a + k, a * (k - 1), a * (k + 1)], a + ' · ' + k + ' = ' + a * k); },
      function (r) { var a = r.int(4, 9), good = a * r.int(3, 9), bad = []; for (var i = 0; i < 3; i++) bad.push(a * r.int(3, 9) + r.int(1, a - 1)); return Q(r, 'Aşağıdakilerden hangisi ' + a + ' sayısının katıdır?', good, bad, good + ' ÷ ' + a + ' = ' + good / a + ' (kalan 0).'); },
      function (r) { var a = r.int(3, 9), b = r.int(4, 9); return Q(r, a * b + ' sayısı ' + a + ' sayısının katıdır. Buna göre aşağıdakilerden hangisi kesinlikle doğrudur?', a + ', ' + a * b + ' sayısının çarpanıdır', [a * b + ', ' + a + ' sayısının çarpanıdır', a + ', ' + a * b + ' sayısının katıdır', a * b + ' sayısı ' + a + ' ile bölünemez'], 'Bir sayının katı olan sayıya o sayı tam bölünür; bu yüzden ' + a + ' çarpandır.'); },
      function (r) { return Q(r, 'Aşağıdakilerden hangisi sıfırdan farklı her doğal sayının çarpanıdır?', '1', ['2', '5', '10'], '1, her doğal sayıyı kalansız böler.'); },
      function (r) { var n = r.pick([12, 18, 20, 24, 30, 36]); var c = divs(n).length / 2; return Q(r, N(n) + ' tane kare, boşluk kalmayacak biçimde dikdörtgen olarak kaç farklı şekilde dizilebilir? (Dik açılı yerleşim; 3×4 ile 4×3 aynı sayılır.)', c, [c * 2, c + 1, c - 1], N(n) + ' çarpım çiftleri: ' + divs(n).filter(function (d) { return d * d <= n; }).map(function (d) { return d + '×' + n / d; }).join(', ') + ' → ' + c); },
      function (r) { var a = r.int(3, 9); return Q(r, 'Bir doğal sayının katları ve çarpanları için aşağıdakilerden hangisi doğrudur?', 'Katları sonsuz, çarpanları sonludur', ['Katları sonlu, çarpanları sonsuzdur', 'İkisi de sonsuzdur', 'İkisi de sonludur'], a + ' sayısının katları ' + a + ', ' + 2 * a + ', ' + 3 * a + ', … diye sonsuza gider; çarpanları ise ' + a + '’dan büyük olamaz.'); }
    ]
  });

  // ============ HAFTA 2 ============
  function rndDiv(r, k, lo, hi) { var x; do { x = r.int(lo, hi); } while (x % k); return x; }
  function rndNon(r, k, lo, hi) { var x; do { x = r.int(lo, hi); } while (x % k === 0); return x; }
  WEEKS.push({
    tema: 1, no: 2, title: 'Bölünebilme Kuralları (2, 3, 4, 5, 6, 9, 10)', hours: 4, code: 'MAT.6.1.2 (a-d)',
    outcomes: ['Doğal sayının katlarını ve basamak değerlerini inceleyerek 2, 3, 4, 5, 6, 9 ve 10 ile bölünebilme kriterleriyle ilgili varsayımlarda bulunur.', 'Genellemeleri örneklerle sınar; kriterlere ilişkin önerme sunar ve kullanışlılığını değerlendirir.'],
    lesson: [
      { h: 'Neden Bölünebilme Kuralı?', html: '<p>2 345 678 sayısının 9’a bölünüp bölünmediğini bölme işlemi yapmadan anlayabilir miyiz? Katlar tablosuna bakıp örüntü arayın: 2’nin katları hep çift, 5’in katları 0 veya 5 ile biter…</p>' },
      { h: 'Kurallar Tablosu', html: '<table class="tbl"><thead><tr><th>Sayı</th><th>Bölünebilme kuralı</th><th>Örnek</th></tr></thead><tbody><tr><td>2</td><td>Birler basamağı 0, 2, 4, 6, 8</td><td>3 476 ✔</td></tr><tr><td>3</td><td>Rakamları toplamı 3’ün katı</td><td>4 521 → 12 ✔</td></tr><tr><td>4</td><td>Son iki basamağı 00 veya 4’ün katı</td><td>1 316 → 16 ✔</td></tr><tr><td>5</td><td>Birler basamağı 0 veya 5</td><td>2 735 ✔</td></tr><tr><td>6</td><td>Hem 2’ye hem 3’e bölünür</td><td>348 → çift, 15 ✔</td></tr><tr><td>9</td><td>Rakamları toplamı 9’un katı</td><td>7 218 → 18 ✔</td></tr><tr><td>10</td><td>Birler basamağı 0</td><td>4 560 ✔</td></tr></tbody></table>' },
      { h: 'Neden Çalışıyor?', html: '<p><b>10’a bölünme:</b> 10’un katları hep 0 ile biter. <b>4:</b> 100, 4’ün katı olduğundan yüzler ve daha büyük basamaklar 4’e bölünür; sadece son iki basamağa bakmak yeter. <b>3 ve 9:</b> 10, 100, 1000… sayılarının 9’a bölümünden kalan hep 1’dir; bu yüzden sayının 9’a bölümünden kalan, rakamları toplamının 9’a bölümünden kalanla aynıdır.</p>' },
      { h: 'Çözümlü Örnek', html: '<div class="box ex"><b>Soru:</b> 4A5 üç basamaklı sayısı 3’e tam bölünüyorsa A yerine yazılabilecek en küçük rakam?<br>4 + A + 5 = 9 + A → A = 0 olunca 9 (3’ün katı) ✔ → <b>A = 0</b>. (A = 3, 6, 9 da olur.)</div><div class="box ex"><b>Soru:</b> 7A2 sayısı 9’a bölünüyorsa A? 7 + A + 2 = 9 + A → A = 0 veya 9. (Bu örnekte iki cevap var!)</div>' },
      { h: 'Etkinlik', html: '<p><b>Kural dedektifi:</b> 100’lük sayı tablosunda 3’ün, 9’un, 6’nın katlarını farklı renklerle boyayın. Hangi kurallar birbirini kapsıyor? (9’un katları 3’ün katıdır; 6’nın katları 2 ve 3’ün katıdır.)</p>' }
    ],
    makers: [
      function (r) { var k = r.pick([2, 3, 4, 5, 6, 9, 10]); var good = rndDiv(r, k, 120, 980), bad = []; while (bad.length < 3) { var b = rndNon(r, k, 120, 980); bad.push(b); } return Q(r, 'Aşağıdakilerden hangisi ' + k + ' ile tam bölünür?', good, bad, good + ' sayısı ' + k + ' için bölünebilme kuralını sağlar.'); },
      function (r) { var d1 = r.int(1, 9), d3 = r.int(1, 9); var a = 0; while ((d1 + d3 + a) % 3) a++; var wr = []; for (var v = 0; v <= 9; v++) if ((d1 + d3 + v) % 3) wr.push(v); return Q(r, d1 + 'A' + d3 + ' üç basamaklı sayısı 3 ile tam bölünüyorsa A yerine yazılabilecek <b>en küçük</b> rakam kaçtır?', a, r.sample(wr.filter(function (v) { return v > a; }).concat(wr), 3), d1 + ' + A + ' + d3 + ' toplamı 3’ün katı olmalı; en küçük A = ' + a); },
      function (r) { var d1, d3; do { d1 = r.int(1, 9); d3 = r.int(1, 9); } while ((d1 + d3) % 9 === 0); var a = (9 - (d1 + d3) % 9) % 9; var wr = []; for (var v = 0; v <= 9; v++) if (v !== a) wr.push(v); return Q(r, d1 + 'A' + d3 + ' üç basamaklı sayısı 9 ile tam bölünüyorsa A kaçtır?', a, wr, d1 + ' + A + ' + d3 + ' = 9’un katı → A = ' + a); },
      function (r) { var good = rndDiv(r, 6, 120, 990), bad = []; while (bad.length < 3) { var b = rndNon(r, 6, 120, 990); bad.push(b); } return Q(r, 'Aşağıdakilerden hangisi 6 ile tam bölünür?', good, bad, '6 ile bölünme: hem 2’ye hem 3’e bölünmeli. ' + good + ' çift ve rakamları toplamı 3’ün katıdır.'); },
      function (r) { var s = r.pick([12, 15, 21, 24]); return Q(r, 'Rakamları toplamı ' + s + ' olan bir doğal sayı aşağıdakilerden hangisine <b>kesinlikle</b> tam bölünür?', '3', ['9', '6', '4'], s + ', 3’ün katıdır ama 9’un katı değildir; 6 ve 4 için başka koşullar da gerekir.'); },
      function (r) { var n = rndDiv(r, 10, 110, 990); return Q(r, N(n) + ' sayısı aşağıdakilerden hangilerine tam bölünür?', '2, 5 ve 10', ['Yalnızca 2', 'Yalnızca 5', 'Yalnızca 10'], 'Birler basamağı 0 olan sayı 2’ye, 5’e ve 10’a bölünür.'); },
      function (r) { var good = rndDiv(r, 4, 1000, 9996), bad = []; while (bad.length < 3) bad.push(rndNon(r, 4, 1000, 9996)); return Q(r, 'Aşağıdakilerden hangisi 4 ile tam bölünür?', good, bad, 'Son iki basamağı (' + (good % 100) + ') 4’ün katıdır.'); },
      function (r) { var d = r.int(1, 9); return Q(r, 'Birler basamağı 5 olan bir doğal sayı için aşağıdakilerden hangisi <b>kesinlikle</b> doğrudur?', '5’e tam bölünür', ['2’ye tam bölünür', '10’a tam bölünür', '4’e tam bölünür'], 'Birler basamağı 5 olan sayılar 5’in katıdır ama tek olduğundan 2, 4 ve 10’a bölünmez.'); }
    ]
  });

  // ============ HAFTA 3 ============
  function fact(n) { var f = factors(n), m = {}; f.forEach(function (x) { m[x] = (m[x] || 0) + 1; }); return f.join(' · '); }
  WEEKS.push({
    tema: 1, no: 3, title: 'Asal Sayılar ve Asal Çarpanlar', hours: 4, code: 'MAT.6.1.3 (a, b)',
    outcomes: ['Bir doğal sayının asal olup olmadığını ve asal çarpanlarını belirler.', 'Asal sayıların özelliklerini ve bir doğal sayı ile asal çarpanları arasındaki ilişkileri belirler.'],
    lesson: [
      { h: 'Çarpan Sayısına Göre Sınıflandırma', html: '<table class="tbl"><thead><tr><th>Sayı</th><th>Çarpanları</th><th>Tür</th></tr></thead><tbody><tr><td>1</td><td>1</td><td>Ne asal ne de bileşik</td></tr><tr><td>7</td><td>1, 7</td><td>Asal</td></tr><tr><td>12</td><td>1, 2, 3, 4, 6, 12</td><td>Bileşik</td></tr></tbody></table><div class="box def"><b>Asal sayı:</b> Yalnızca iki çarpanı (1 ve kendisi) olan 1’den büyük doğal sayıdır.</div>' },
      { h: 'Eratosthenes Kalburu', html: '<div class="box idea"><b>Etkinlik:</b> 1–100 tablosunda önce 1’i çizin; 2’yi daire içine alıp katlarını çizin; 3’ü daire içine alıp katlarını çizin; 5, 7 için devam edin. Çizilmeyenler asal sayılardır: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, …</div><ul><li>Hem çift hem asal olan <b>tek sayı</b>: <b>2</b>.</li><li>Asal sayılar sonsuzdur.</li><li>Asal sayılar internet güvenliğinde (şifreleme) kullanılır — araştırma ödevi için güzel bir konu.</li></ul>' },
      { h: 'Asal Çarpanlara Ayırma', html: '<p>Bileşik bir sayıyı asal sayıların çarpımı olarak yazmaya <b>asal çarpanlarına ayırma</b> denir. <b>Çarpan ağacı</b> kullanın:</p><div class="box ex"><b>60:</b> 60 = 6 · 10 = (2·3)·(2·5) → 60 = 2 · 2 · 3 · 5<br><b>36:</b> 36 = 4 · 9 = 2·2·3·3<br>Asal çarpanlar (farklı olanlar): 36 için 2 ve 3.</div><div class="box tip">Her bileşik sayı, asal çarpanlarının çarpımı olarak <b>tek türlü</b> yazılır (sıra hariç).</div>' },
      { h: 'Asal mı Değil mi?', html: '<p>Sayıyı 2, 3, 5, 7 gibi küçük asallara bölünebilme kurallarıyla deneyin. Örnek: 91 → 2 ✘, 3 ✘ (9+1=10), 5 ✘, 7 ✔ (7·13) → bileşik. 97 → hiçbirine bölünmüyor → asal.</p>' }
    ],
    makers: [
      function (r) { var p = r.pick(PRIMES); return Q(r, 'Aşağıdakilerden hangisi asal sayıdır?', p, r.sample(COMPS, 3), p + ' sayısının yalnızca 1 ve ' + p + ' çarpanları vardır.'); },
      function (r) { var c = r.pick(COMPS); return Q(r, 'Aşağıdakilerden hangisi asal sayı <b>değildir</b>?', c, r.sample(PRIMES, 3), c + ' = ' + fact(c) + ' olduğundan ikiden fazla çarpanı vardır.'); },
      function (r) { var n = r.pick([12, 18, 20, 24, 30, 36, 45, 50, 60, 72, 90]); var f = factors(n); var wr = [fact(n * 2).replace(/ · /g, ' · '), (function () { var g = f.slice(); g[0] = g[0] === 2 ? 4 : g[0] * 2; return g.join(' · '); })(), (function () { var g = f.slice(); g.push(f[0]); return g.join(' · '); })(), (function () { var g = f.slice(); g.pop(); return g.join(' · '); })()]; return Q(r, N(n) + ' sayısının asal çarpanlarına ayrılmış hâli hangisidir?', f.join(' · '), wr, N(n) + ' = ' + f.join(' · ')); },
      function (r) { var n = r.pick([30, 42, 66, 70, 78, 105, 60, 90, 84]); var f = factors(n).filter(function (x, i, a) { return a.indexOf(x) === i; }); var s = f.reduce(function (a, b) { return a + b; }, 0); return Q(r, N(n) + ' sayısının <b>farklı</b> asal çarpanlarının toplamı kaçtır?', s, [s + 1, s - 1, s + 2, s * 2], N(n) + ' = ' + factors(n).join(' · ') + '; farklı asallar: ' + f.join(' + ') + ' = ' + s); },
      function (r) { return Q(r, 'Hem çift hem asal olan doğal sayı kaçtır?', '2', ['1', '4', '0'], '2’den başka çift sayıların hepsi 2’ye bölündüğünden en az 3 çarpanı vardır; bu yüzden tek çift asal 2’dir.'); },
      function (r) { var a = r.pick([2, 3]), b = r.pick([5, 7]), c = r.pick([11, 13]); var p = a * b * c; return Q(r, 'Asal çarpanlarına ayrılmış hâli ' + a + ' · ' + b + ' · ' + c + ' olan doğal sayı kaçtır?', p, [p + a, p - b, p + c], a + ' · ' + b + ' · ' + c + ' = ' + p); },
      function (r) { var t = r.pick([[10, 4], [20, 8], [30, 10], [40, 12], [50, 15]]); return Q(r, '1’den ' + t[0] + '’a kadar (' + t[0] + ' dâhil) kaç tane asal sayı vardır?', t[1], [t[1] + 1, t[1] - 1, t[1] + 2], 'Asallar: ' + list(PRIMES.concat([2, 3, 5, 7]).sort(function (x, y) { return x - y; }).filter(function (x) { return x <= t[0]; })) + ' → ' + t[1] + ' tane.'); },
      function (r) { return Q(r, '1 sayısı için aşağıdakilerden hangisi doğrudur?', 'Ne asal ne de bileşiktir', ['Asaldır', 'Bileşiktir', 'Hem asal hem bileşiktir'], '1’in tek bir çarpanı vardır; asal olması için tam iki çarpanı olmalıdır.'); }
    ]
  });

  // ============ HAFTA 4 ============
  WEEKS.push({
    tema: 1, no: 4, title: 'Ortak Kat ve Ortak Bölen', hours: 3, code: 'MAT.6.1.4 (a, b, c)',
    outcomes: ['Verilen iki sayının ortak katlarını ve ortak bölenlerini inceler.', 'Ortak kat ve ortak bölen ilişkilerini çizim, tablo ve sayı doğrusu ile ifade eder.', 'Ortak kat ve ortak bölenleri kendi ifadeleriyle açıklar.'],
    lesson: [
      { h: 'İki Otobüs Hikâyesi', html: '<div class="box idea">Bir otobüs 12 dakikada, diğeri 18 dakikada bir kalkıyor; saat 08:00’de aynı anda kalktılar. Tekrar ne zaman aynı anda kalkarlar? Sayı doğrusunda 12’şer ve 18’er atlama yapın; ilk karşılaştıkları yer <b>36</b>.</div>' },
      { h: 'Ortak Katlar', html: '<p>12’nin katları: 12, 24, <b>36</b>, 48, 60, <b>72</b>, …<br>18’in katları: 18, <b>36</b>, 54, <b>72</b>, …<br><b>Ortak katlar:</b> 36, 72, 108, … (sonsuz)<br><b>En küçük ortak kat (EKOK) = 36.</b></p><div class="box tip">Ortak katların hepsi, en küçük ortak katın katıdır: 36, 72, 108, …</div>' },
      { h: 'Ortak Bölenler', html: '<p>24’ün çarpanları: 1, 2, 3, 4, 6, 8, 12, 24<br>36’nın çarpanları: 1, 2, 3, 4, 6, 9, 12, 18, 36<br><b>Ortak bölenler:</b> 1, 2, 3, 4, 6, 12 (sonlu)<br><b>En büyük ortak bölen (EBOB) = 12.</b></p><p>Venn şemasında iki çemberin kesişimine ortak bölenleri yazın.</p>' },
      { h: 'Problem Tipleri', html: '<div class="box ex"><b>EBOB problemi:</b> 24 kalem ve 36 silgi, hiçbiri artmayacak biçimde eşit sayıda paketlenecek. En çok kaç paket? EBOB(24, 36) = <b>12 paket</b> (her pakette 2 kalem, 3 silgi).</div><div class="box ex"><b>EKOK problemi:</b> “Aynı anda başlayıp tekrar aynı anda buluşma / tekrar aynı anda olma” problemlerinde EKOK kullanılır.</div>' }
    ],
    makers: [
      function (r) { var p = r.pick([[12, 18], [8, 12], [12, 16], [18, 24], [20, 30], [24, 36], [16, 24], [15, 20], [14, 21], [30, 45]]); var g = gcd(p[0], p[1]); return Q(r, p[0] + ' ve ' + p[1] + ' sayılarının ortak bölenlerinin en büyüğü kaçtır?', g, [g * 2, g / 2 >= 1 && g % 2 === 0 ? g / 2 : g + 1, p[0] - p[1] > 0 ? p[0] - p[1] : p[1] - p[0], g + 2], 'Ortak bölenler: ' + list(divs(g)) + ' → en büyüğü ' + g); },
      function (r) { var p = r.pick([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [12, 18], [9, 12], [4, 10], [5, 7]]); var l = lcm(p[0], p[1]); return Q(r, p[0] + ' ve ' + p[1] + ' sayılarının en küçük ortak katı kaçtır?', l, [l * 2, l / 2 === Math.floor(l / 2) && l / 2 > Math.max(p[0], p[1]) - 1 ? l / 2 : l + p[0], p[0] * p[1] === l ? l + 1 : p[0] * p[1], l + p[1]], 'İlk ortak kat: ' + l); },
      function (r) { var p = r.pick([[12, 18], [10, 15], [8, 12], [6, 8], [15, 20], [9, 12]]); var l = lcm(p[0], p[1]); return Q(r, 'İki otobüs sabah 08:00’de aynı anda kalkıyor. Biri ' + p[0] + ', diğeri ' + p[1] + ' dakikada bir kalkıyorsa tekrar aynı anda kaç dakika sonra kalkarlar?', l + ' dakika', [l * 2 + ' dakika', (p[0] + p[1]) + ' dakika', gcd(p[0], p[1]) + ' dakika'], 'Ortak kalkış, ortak katlardır; ilki EKOK = ' + l + '.'); },
      function (r) { var p = r.pick([[24, 36], [18, 24], [20, 30], [16, 24], [30, 45], [12, 18]]); var g = gcd(p[0], p[1]); return Q(r, p[0] + ' kalem ve ' + p[1] + ' silgi, hiçbiri artmayacak ve her pakette eşit sayıda kalem ile eşit sayıda silgi olacak biçimde paketlenecektir. En çok kaç paket yapılabilir?', g, [g * 2, p[0] - p[1] > 0 ? p[0] - p[1] : p[1] - p[0], lcm(p[0], p[1])], 'Paket sayısı iki sayının ortak böleni olmalı; en çok ' + g + ' paket.'); },
      function (r) { var p = r.pick([[12, 18], [24, 36], [16, 24], [20, 30], [18, 24]]); var c = divs(gcd(p[0], p[1])).length; return Q(r, p[0] + ' ve ' + p[1] + ' sayılarının kaç tane ortak böleni vardır?', c, [c + 1, c - 1, c + 2], 'Ortak bölenler: ' + list(divs(gcd(p[0], p[1]))) + ' → ' + c); },
      function (r) { var p = r.pick([[4, 6], [6, 8], [6, 9], [4, 10], [8, 12]]); var l = lcm(p[0], p[1]); var good = l * r.int(2, 5), bad = []; while (bad.length < 3) { var b = (r.f() < .5 ? p[0] : p[1]) * r.int(2, 9); if (b % l) bad.push(b); } return Q(r, 'Aşağıdakilerden hangisi ' + p[0] + ' ve ' + p[1] + ' sayılarının ortak katıdır?', good, bad, good + ' hem ' + p[0] + ' hem ' + p[1] + ' ile tam bölünür.'); },
      function (r) { var p = r.pick([[4, 6], [6, 8], [6, 9], [10, 15], [12, 18]]); var l = lcm(p[0], p[1]); return Q(r, p[0] + ' ve ' + p[1] + ' sayılarının ilk iki ortak katının toplamı kaçtır?', l * 3, [l * 2, l * 4, l + p[0]], 'İlk iki ortak kat ' + l + ' ve ' + 2 * l + '; toplam ' + 3 * l + '.'); },
      function (r) { return Q(r, 'İki doğal sayının ortak katları ve ortak bölenleri için aşağıdakilerden hangisi doğrudur?', 'Ortak katları sonsuz, ortak bölenleri sonludur', ['Ortak katları sonlu, ortak bölenleri sonsuzdur', 'İkisi de sonsuzdur', 'İkisi de sonludur'], 'Katlar sonsuza gider; bölenler sayıdan büyük olamaz.'); }
    ]
  });
})();
