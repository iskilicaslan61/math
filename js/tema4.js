/* 4. TEMA: Geometrik Nicelikler (33 ders saati) — Hafta 12-18 */
(function () {
  'use strict';
  var N = MC.num, Q = MC.Q;
  TEMAS.push({ id: 4, title: 'Geometrik Nicelikler', hours: 33, color: '#e17055',
    summary: 'Uzunluk ve alan birimleri, paralelkenar ve üçgenin alanı, alan problemleri, çemberin uzunluğu ve π, merkez açı ve yay.' });
  var PI = 3.14;
  function r2(x) { return Math.round(x * 100) / 100; }

  // ============ HAFTA 12 ============
  var UL = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
  WEEKS.push({
    tema: 4, no: 12, title: 'Uzunluk ve Alan Ölçme Birimleri Arasındaki İlişki', hours: 5, code: 'MAT.6.4.1 (a, b, c)',
    outcomes: ['Uzunluk ve alan ölçme birimleri arasındaki ilişkileri gözlemler ve tespit eder.', 'Uzunluk birimlerinden hareketle alan birimleri arasındaki ilişkiye dair çıkarım yapar.'],
    lesson: [
      { h: 'Ders Açılışı', html: '<p>Bir tarlanın büyüklüğü “dönüm”, evin büyüklüğü “m²” ile söylenir. Peki 1 m² kaç cm²? Uzunlukta 1 m = 100 cm biliyoruz. Alanda bu neden “100” değil de “10 000”?</p>' },
      { h: 'Uzunluk Birimleri', html: '<p>km → hm → dam → m → dm → cm → mm: her basamak <b>10</b> kat.</p><div class="box def">1 km = 10 hm &nbsp; 1 hm = 10 dam &nbsp; 1 dam = 10 m &nbsp; 1 m = 10 dm &nbsp; 1 dm = 10 cm &nbsp; 1 cm = 10 mm</div>' },
      { h: 'Keşif: Birim Kare', html: '<p>Kenarı <b>1 dm</b> olan bir kare düşünelim. Kenarı 10 cm olan bu karenin içine kenarı 1 cm olan birim kareler dizersek 10 sıra, her sırada 10 kare → <b>10 · 10 = 100</b> birim kare. Yani <b>1 dm² = 100 cm²</b>.</p><div class="box idea">Milimetrik kâğıt üzerinde 1 cm² ve 1 dm² çizin, kaç küçük kare olduğunu sayın.</div>' },
      { h: 'Alan Birimleri', html: '<div class="box def">Alan birimlerinde her basamak <b>100</b> katıdır:<br>km² → hm² → dam² → m² → dm² → cm² → mm²<br><b>Büyük birimden küçüğe: ×100</b> &nbsp; | &nbsp; <b>Küçük birimden büyüğe: ÷100</b></div><table class="tbl"><thead><tr><th>Dönüşüm</th><th>Değer</th></tr></thead><tbody><tr><td>1 m²</td><td>100 dm² = 10 000 cm²</td></tr><tr><td>1 dam²</td><td>100 m²</td></tr><tr><td>1 hm²</td><td>10 000 m²</td></tr><tr><td>1 km²</td><td>1 000 000 m²</td></tr></tbody></table><div class="box ex"><b>Örnek:</b> 3 m² = 3 · 100 = 300 dm² = 30 000 cm².<br><b>Örnek:</b> 4 500 cm² = 45 dm² = 0,45 m².</div>' },
      { h: 'Neden 100?', html: '<p>Alan = uzunluk × uzunluk. Her iki uzunlukta da 10 kat olduğundan 10 · 10 = 100 kat. Bu <b>analoji</b> ile (uzunlukta 10, alanda 10 · 10) tüm birimleri çıkarabiliriz.</p>' }
    ],
    makers: [
      function (r) { var v = r.int(2, 9), pairs = [['m²', 'dm²', 100], ['dm²', 'cm²', 100], ['cm²', 'mm²', 100], ['dam²', 'm²', 100], ['m²', 'cm²', 10000]]; var p = r.pick(pairs); return Q(r, v + ' ' + p[0] + ' kaç ' + p[1] + ' eder?', N(v * p[2]) + ' ' + p[1], [N(v * p[2] / 10) + ' ' + p[1], N(v * p[2] * 10) + ' ' + p[1], N(v * 10) + ' ' + p[1]], v + ' · ' + N(p[2]) + ' = ' + N(v * p[2])); },
      function (r) { var v = r.int(2, 9), pairs = [['dm²', 'm²', 100], ['cm²', 'dm²', 100], ['m²', 'dam²', 100], ['cm²', 'm²', 10000]]; var p = r.pick(pairs); var val = v * p[2]; return Q(r, N(val) + ' ' + p[0] + ' kaç ' + p[1] + ' eder?', v + ' ' + p[1], [N(v * 10) + ' ' + p[1], N(v / 10) + ' ' + p[1], N(val * 10) + ' ' + p[1]], 'Küçük birimden büyüğe geçerken ' + N(p[2]) + ' e bölünür: ' + v); },
      function (r) { return Q(r, 'Kenarı 1 dm olan karenin alanı kaç cm²’dir?', '100 cm²', ['10 cm²', '1 000 cm²', '1 cm²'], '1 dm = 10 cm → 10 · 10 = 100 cm².'); },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9) * 100; return Q(r, 'Aşağıdakilerden hangisi daha büyüktür?', a + ' m²', [N(b) + ' dm²'.replace('dm²', 'cm²').replace('cm²', 'cm²'), N(a * 99) + ' dm²', N(a * 100 - 1) + ' cm²'], a + ' m² = ' + N(a * 10000) + ' cm²; diğerleri bundan küçüktür.'); },
      function (r) { var u = r.pick([['hm²', 10000, 'm²'], ['dam²', 100, 'm²'], ['km²', 1000000, 'm²']]); return Q(r, '1 ' + u[0] + ' kaç ' + u[2] + 'dir?', N(u[1]), [N(u[1] / 10), N(u[1] * 10), N(u[1] / 100)], 'Her basamak 100 kat: ' + N(u[1]) + '.'); },
      function (r) { var a = r.int(2, 6) * 10, b = r.int(2, 5) * 10; return Q(r, 'Kenar uzunlukları ' + a + ' m ve ' + b + ' m olan dikdörtgen şeklindeki bir arsanın alanı kaç dam²’dir?', N(a * b / 100) + ' dam²', [N(a * b) + ' dam²', N(a * b / 10) + ' dam²', N(a * b / 1000) + ' dam²'], 'Alan = ' + a + ' · ' + b + ' = ' + N(a * b) + ' m² = ' + N(a * b / 100) + ' dam².'); },
      function (r) { return Q(r, 'Uzunluk birimlerinde komşu basamaklar arasında 10 kat varken alan birimlerinde komşu basamaklar arasında 100 kat olmasının nedeni nedir?', 'Alan iki uzunluğun çarpımıdır: 10 · 10 = 100', ['Alan birimleri daha büyüktür', 'Alan, uzunluğun 2 katıdır', 'Alanda sadece bir boyut vardır'], 'Alan = uzunluk × uzunluk olduğundan dönüşüm katı da 10 · 10 = 100 olur.'); }
    ]
  });

  // ============ HAFTA 13 ============
  WEEKS.push({
    tema: 4, no: 13, title: 'Paralelkenarın Alanı', hours: 5, code: 'MAT.6.4.2 (a, b, c)',
    outcomes: ['Dikdörtgenin alan bağıntısını gözden geçirir.', 'Dikdörtgenin alan bağıntısından yola çıkarak paralelkenarın alan bağıntısı hakkında çıkarım yapar; farklı örneklerle değerlendirir.'],
    lesson: [
      { h: 'Hatırlayalım', html: '<p>Dikdörtgenin alanı = uzun kenar × kısa kenar = <b>taban × yükseklik</b>.</p>' },
      { h: 'Keşif: Dikdörtgenden Paralelkenara', html: '<div class="box idea"><b>Etkinlik:</b> Kareli kâğıtta bir paralelkenar çizin. Yüksekliği çizip oluşan <b>dik üçgeni</b> keserek diğer tarafa taşıyın. Elinizde ne kaldı? Bir <b>dikdörtgen</b>! Alanı değişmedi çünkü parçayı sadece yer değiştirdik.</div>' + MC.paraFig(8, 6, 5, {}) + '<p>Dikdörtgenin boyutları: <b>taban</b> ve <b>yükseklik</b>.</p>' },
      { h: 'Bağıntı', html: '<div class="box def"><b>Paralelkenarın alanı = taban uzunluğu × o tabana ait yükseklik</b><br>A = a · h</div><div class="box warn"><b>Dikkat:</b> Yükseklik, tabana <b>dik</b> olan uzunluktur. Yan kenar (eğik kenar) yükseklik <b>değildir</b>!</div>' },
      { h: 'Çözümlü Örnekler', html: '<div class="box ex"><b>Örnek 1.</b> Tabanı 12 cm, yüksekliği 5 cm olan paralelkenarın alanı: 12 · 5 = <b>60 cm²</b>.<br><b>Örnek 2.</b> Alanı 72 cm², tabanı 9 cm olan paralelkenarın yüksekliği: 72 ÷ 9 = <b>8 cm</b>.<br><b>Örnek 3.</b> Bir kenarı 10 cm ve ona ait yükseklik 6 cm olan paralelkenarın diğer kenarı 8 cm ise ona ait yükseklik: Alan = 10 · 6 = 60 → 60 ÷ 8 = <b>7,5 cm</b>.</div>' },
      { h: 'Farklı Örnekler Üzerinden Sınama', html: '<p>Önce kendi çizdiğiniz birkaç paralelkenarın alanını (kare sayma ile) hesaplayın, sonra a · h ile karşılaştırın. İkisi hep aynı çıkıyor mu?</p>' }
    ],
    makers: [
      function (r) { var a = r.int(4, 20), h = r.int(3, 15); return Q(r, 'Tabanı ' + a + ' cm, bu tabana ait yüksekliği ' + h + ' cm olan paralelkenarın alanı kaç cm²’dir?', N(a * h), [N(a + h), N(2 * (a + h)), N(a * h / 2)], 'A = a · h = ' + a + ' · ' + h + ' = ' + a * h); },
      function (r) { var a = r.int(4, 15), h = r.int(3, 12); return Q(r, 'Alanı ' + a * h + ' cm² olan bir paralelkenarın tabanı ' + a + ' cm ise bu tabana ait yükseklik kaç cm’dir?', h, [a, h + 2, a * h - a], h + ' = ' + a * h + ' ÷ ' + a); },
      function (r) { var b = r.int(6, 14), s = r.int(5, 12), h = r.int(3, 9); return Q(r, 'Şekildeki paralelkenarın alanı kaç cm²’dir?', N(b * h), [N(b * s), N(b + s + h), N(b * h / 2)], 'Yükseklik tabana diktir: A = ' + b + ' · ' + h + ' = ' + b * h + '. Yan kenar (' + s + ' cm) yükseklik değildir.', { fig: MC.paraFig(b, s, h) }); },
      function (r) { var a = r.int(4, 12), h = r.int(3, 10); return Q(r, 'Boyutları ' + a + ' cm ve ' + h + ' cm olan dikdörtgen biçimindeki bir kâğıttan, yükseklikten kesilen dik üçgen parçası diğer tarafa kaydırılarak paralelkenar elde ediliyor. Elde edilen paralelkenarın alanı kaç cm²’dir?', N(a * h), [N(a * h / 2), N(2 * (a + h)), N(a * h + h)], 'Parça yer değiştirdi; alan değişmedi: ' + a + ' · ' + h); },
      function (r) { var a = r.int(2, 6) * 2, ha = r.int(3, 9), b = r.pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18].filter(function (d) { return (a * ha) % d === 0 && d !== a && a * ha / d !== ha; })); var area = a * ha; return Q(r, 'Bir kenarı ' + a + ' cm ve bu kenara ait yükseklik ' + ha + ' cm olan paralelkenarın diğer bir kenarı ' + b + ' cm’dir. Bu kenara ait yükseklik kaç cm’dir?', N(area / b), [N(area / b + 1), N(area / b - 1 > 0 ? area / b - 1 : area / b + 2), N(ha)], 'Alan = ' + area + ' cm² olduğundan ' + area + ' ÷ ' + b + ' = ' + N(area / b)); },
      function (r) { var a = r.int(4, 14), h = r.int(3, 10); return Q(r, 'Tabanları ve yükseklikleri eşit (' + a + ' cm ve ' + h + ' cm) olan iki farklı paralelkenarın alanları için aşağıdakilerden hangisi doğrudur?', 'Alanları eşittir', ['Yan kenarı uzun olanın alanı daha büyüktür', 'Alanları farklıdır', 'Hangisinin büyük olduğu belli değildir'], 'Alan yalnızca taban ve yüksekliğe bağlıdır: ' + a + ' · ' + h + '.'); },
      function (r) { var a = r.int(5, 20), h = r.int(4, 12); return Q(r, 'Tabanı ' + (2 * a) + ' cm, yüksekliği ' + h + ' cm olan paralelkenarın alanı, tabanı ' + a + ' cm olan aynı yükseklikteki paralelkenarın alanının kaç katıdır?', 2, [1, 3, 4], 'Taban 2 katına çıkınca alan da 2 katına çıkar.'); }
    ]
  });

  // ============ HAFTA 14 ============
  WEEKS.push({
    tema: 4, no: 14, title: 'Üçgenin Alanı', hours: 5, code: 'MAT.6.4.2 (a, b, c)',
    outcomes: ['Paralelkenarın alan bağıntısından yola çıkarak üçgenin alan bağıntısı hakkında çıkarım yapar; farklı örneklerle değerlendirir.'],
    lesson: [
      { h: 'Keşif: Paralelkenarı Ortadan Kesmek', html: '<div class="box idea"><b>Etkinlik:</b> Bir paralelkenarı köşegeninden keserseniz iki <b>eş üçgen</b> elde edersiniz. Üçgenlerden biri paralelkenarın alanının <b>yarısı</b> kadardır.</div>' + MC.triFig(9, 7, 6, {}) },
      { h: 'Bağıntı', html: '<div class="box def"><b>Üçgenin alanı = (taban × yükseklik) ÷ 2</b><br>A = (a · h) ÷ 2</div><p>Her üçgenin üç tabanı ve üç yüksekliği vardır. <b>Hangi tabanı seçersek ona ait yüksekliği kullanırız.</b> Üç hesap da aynı alanı verir.</p>' },
      { h: 'Çözümlü Örnekler', html: '<div class="box ex"><b>Örnek 1.</b> Tabanı 10 cm, yüksekliği 6 cm olan üçgen: (10 · 6) ÷ 2 = <b>30 cm²</b>.<br><b>Örnek 2.</b> Alanı 36 cm² ve tabanı 9 cm olan üçgenin yüksekliği: 36 · 2 ÷ 9 = <b>8 cm</b>.<br><b>Örnek 3 (dik üçgen).</b> Dik kenarları 6 cm ve 8 cm olan üçgenin alanı: (6 · 8) ÷ 2 = <b>24 cm²</b> (dik kenarlar birbirinin yüksekliğidir).</div>' },
      { h: 'Sık Yapılan Hatalar', html: '<ul><li>“Yarısını almayı” unutmak.</li><li>Yan kenarı yükseklik sanmak.</li><li>Tabanın ve yüksekliğin uyumsuz seçilmesi.</li></ul>' }
    ],
    makers: [
      function (r) { var a = r.int(2, 10) * 2, h = r.int(3, 12); return Q(r, 'Tabanı ' + a + ' cm, yüksekliği ' + h + ' cm olan üçgenin alanı kaç cm²’dir?', N(a * h / 2), [N(a * h), N(a + h), N(a * h / 4)], 'A = ' + a + ' · ' + h + ' ÷ 2 = ' + N(a * h / 2)); },
      function (r) { var a = r.int(3, 10), h = r.int(3, 12) * 2; var A = a * h / 2; return Q(r, 'Alanı ' + N(A) + ' cm² ve tabanı ' + a + ' cm olan üçgenin yüksekliği kaç cm’dir?', h, [h / 2, a, h + 2], h + ' = 2 · ' + A + ' ÷ ' + a); },
      function (r) { var b = r.int(3, 6) * 2, s = r.int(5, 12), h = r.int(3, 9); return Q(r, 'Şekildeki üçgenin alanı kaç cm²’dir?', N(b * h / 2), [N(b * h), N(b * s / 2), N(b + s + h)], 'Yükseklik h = ' + h + ' cm olarak verilmiştir: ' + b + ' · ' + h + ' ÷ 2 = ' + N(b * h / 2), { fig: MC.triFig(b, s, h) }); },
      function (r) { var a = r.int(3, 12), b = r.int(2, 8) * 2; return Q(r, 'Dik kenar uzunlukları ' + a + ' cm ve ' + b + ' cm olan dik üçgenin alanı kaç cm²’dir?', N(a * b / 2), [N(a * b), N(a + b), N(a * b / 4)], 'Dik kenarlar birbirinin yüksekliğidir: ' + a + ' · ' + b + ' ÷ 2'); },
      function (r) { var a = r.int(4, 14), h = r.int(3, 10); return Q(r, 'Alanı ' + (a * h) + ' cm² olan bir paralelkenar bir köşegeni boyunca ikiye ayrılıyor. Oluşan üçgenlerden birinin alanı kaç cm²’dir?', N(a * h / 2), [N(a * h), N(a * h / 4), N(a * h * 2)], 'Köşegen paralelkenarı iki eş üçgene böler: ' + a * h + ' ÷ 2.'); },
      function (r) { var a = r.int(3, 8), ha = r.int(4, 10) * 2, A = a * ha / 2; var b = r.pick([2, 3, 4, 6, 8, 12].filter(function (d) { return (A * 2) % d === 0 && d !== a; })); return Q(r, 'Bir kenarı ' + a + ' cm ve ona ait yükseklik ' + ha + ' cm olan üçgenin diğer bir kenarı ' + b + ' cm’dir. Bu kenara ait yükseklik kaç cm’dir?', N(A * 2 / b), [N(A * 2 / b + 1), N(A * 2 / b + 2), N(A / b)], 'Alan ' + A + ' cm²: ' + b + ' · h ÷ 2 = ' + A + ' → h = ' + N(A * 2 / b)); },
      function (r) { var a = r.int(4, 14), h = r.int(3, 10); return Q(r, 'Tabanı ' + a + ' cm, yüksekliği ' + h + ' cm olan üçgenle aynı tabana ve aynı yüksekliğe sahip başka bir üçgenin alanı hakkında ne söylenebilir?', 'Aynıdır', ['Daha büyüktür', 'Daha küçüktür', 'Belirlenemez'], 'Alan sadece taban ve yüksekliğe bağlıdır.'); }
    ]
  });

  // ============ HAFTA 15 ============
  WEEKS.push({
    tema: 4, no: 15, title: 'Alanla İlgili Gerçek Yaşam Problemleri', hours: 6, code: 'MAT.6.4.3 (a-h)',
    outcomes: ['Geometrik şekillerin alanları ile modellenen gerçek yaşam problemlerinde matematiksel bileşenleri belirler, strateji geliştirir, uygular ve genelleştirir.'],
    lesson: [
      { h: 'Problem Çözme Stratejisi', html: '<ol><li><b>Anla:</b> Hangi şekil? Hangi ölçüler? Hangi birim?</li><li><b>Birimleri eşitle</b> (m ↔ cm, m² ↔ cm²).</li><li><b>Şekli çiz</b> ve bileşenleri adlandır.</li><li><b>Formülü seç:</b> Dikdörtgen a·b, paralelkenar a·h, üçgen a·h÷2.</li><li><b>Tahmin et</b> ve sonra hesapla; <b>kontrol et</b>.</li></ol>' },
      { h: 'Çözümlü Örnekler', html: '<div class="box ex"><b>Örnek 1 – Zemin döşeme.</b> 6 m × 4 m ebadındaki bir odaya kenarı 50 cm olan kare karolar döşenecek. Kaç karo gerekir?<br>Oda: 6 · 4 = 24 m². Karo: 0,5 m · 0,5 m = 0,25 m². 24 ÷ 0,25 = <b>96 karo</b>. (Her m²’ye 4 karo gelir.)</div><div class="box ex"><b>Örnek 2 – Boya.</b> 5 m × 3 m duvara m² başına 20 TL’lik boya sürülecek: 15 · 20 = <b>300 TL</b>.</div><div class="box ex"><b>Örnek 3 – Bileşik şekil.</b> L biçimli bahçe: 10 m × 8 m’lik dikdörtgenden 4 m × 3 m’lik köşe çıkarılıyor: 80 − 12 = <b>68 m²</b>.</div>' },
      { h: 'Genelleme', html: '<p>“Bileşik şeklin alanı = parçaların alanları toplamı veya büyük şeklin alanından çıkarılan parçaların farkı” stratejisi her bileşik şekle uygulanabilir. Başka bir bileşik şekille deneyin.</p>' },
      { h: 'Proje Önerisi', html: '<p>Sınıfınızın veya odanızın zemin alanını ölçün; kaç karo/halı gerekeceğini ve maliyetini hesaplayın. Sonuçları infografik olarak sunun.</p>' }
    ],
    makers: [
      function (r) { var w = r.int(3, 9), l = r.int(3, 9), k = r.pick([[20, 25], [25, 16], [50, 4]]); return Q(r, w + ' m × ' + l + ' m boyutundaki dikdörtgen biçimli bir salonun zeminine kenarı ' + k[0] + ' cm olan kare karolar döşenecek. Kaç karo gerekir?', N(w * l * k[1]), [N(w * l), N(w * l * k[1] / 2), N(w * l * k[1] + 4)], 'Alan ' + w * l + ' m²; her m²’ye ' + k[1] + ' karo gelir: ' + w * l * k[1]); },
      function (r) { var w = r.int(3, 8), h = r.int(2, 4), p = r.pick([15, 20, 25, 30]); return Q(r, w + ' m genişliğinde, ' + h + ' m yüksekliğinde dikdörtgen biçimli bir duvar, m² si ' + p + ' TL olan boya ile boyanacaktır. Boya maliyeti kaç TL’dir?', N(w * h * p), [N((w + h) * p), N(2 * (w + h) * p), N(w * h + p)], 'Alan ' + w * h + ' m² → ' + w * h + ' · ' + p + ' = ' + w * h * p); },
      function (r) { var a = r.int(8, 15), b = r.int(6, 10), c = r.int(2, 4), d = r.int(2, 4); return Q(r, 'Dikdörtgen biçimli ' + a + ' m × ' + b + ' m’lik bir bahçenin bir köşesinden ' + c + ' m × ' + d + ' m’lik dikdörtgen biçimli bir havuz çıkarılıyor. Kalan bölümün alanı kaç m²’dir?', N(a * b - c * d), [N(a * b + c * d), N(a * b), N(a * b - c - d)], 'Büyük alan − küçük alan = ' + a * b + ' − ' + c * d); },
      function (r) { var a = r.int(6, 14), h = r.int(4, 10), kg = r.pick([2, 3, 4, 5]); return Q(r, 'Tabanı ' + a + ' m, yüksekliği ' + h + ' m olan paralelkenar biçimli bir tarlanın her m²’sinden ' + kg + ' kg ürün alınıyor. Toplam kaç kg ürün alınır?', N(a * h * kg), [N(a * h), N((a + h) * kg), N(a * h * kg / 2)], 'Alan ' + a * h + ' m² → ' + a * h + ' · ' + kg + ' (alan × verim)'); },
      function (r) { var a = r.int(3, 9) * 2, h = r.int(3, 8), p = r.pick([10, 20, 30]); return Q(r, 'Tabanı ' + a + ' m, yüksekliği ' + h + ' m olan üçgen biçimli bir zemine m² si ' + p + ' TL olan çim kaplanacaktır. Toplam maliyet kaç TL’dir?', N(a * h / 2 * p), [N(a * h * p), N((a + h) * p), N(a * h / 2 + p)], 'Üçgenin alanı ' + a * h / 2 + ' m² → ' + a * h / 2 * p); },
      function (r) { var a = r.int(2, 6) * 100, b = r.int(2, 5) * 100; return Q(r, 'Dikdörtgen biçimli bir halının boyutları ' + a + ' cm ve ' + b + ' cm’dir. Halının alanı kaç m²’dir?', N(a * b / 10000), [N(a * b / 100), N(a * b), N(a * b / 1000)], a / 100 + ' m · ' + b / 100 + ' m = ' + N(a * b / 10000) + ' m²'); },
      function (r) { var a = r.int(5, 12), b = r.int(4, 9); return Q(r, 'Kenar uzunlukları ' + a + ' m ve ' + b + ' m olan dikdörtgen biçimli bir parsel, bir köşegeni boyunca iki üçgen parsele ayrılıyor. Bir üçgen parselin alanı kaç m²’dir?', N(a * b / 2), [N(a * b), N(a + b), N(a * b / 4)], 'Dikdörtgenin yarısı: ' + a * b + ' ÷ 2'); }
    ]
  });

  // ============ HAFTA 16 ============
  WEEKS.push({
    tema: 4, no: 16, title: 'Çemberin Uzunluğu ve π Sayısı', hours: 4, code: 'MAT.6.4.4 (a, b, c, ç, d)',
    outcomes: ['Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiye yönelik varsayımlarda bulunur, ölçümlerle listeler ve karşılaştırır.', 'Çemberin uzunluğunun çapa oranının sabit bir sayı (π) olduğuna ilişkin önerme sunar.'],
    lesson: [
      { h: 'Ölçelim ve Keşfedelim', html: '<div class="box idea"><b>Etkinlik – Çember ölçümü:</b> Farklı büyüklükte yuvarlak cisimler (şişe kapağı, bardak, tabak, tekerlek) alın. Bir ip ile çevresini, cetvelle çapını ölçün. Çevre ÷ çap hesaplayın. Tabloyu doldurun:</div><table class="tbl"><thead><tr><th>Nesne</th><th>Çap (cm)</th><th>Çevre (cm)</th><th>Çevre ÷ Çap</th></tr></thead><tbody><tr><td>Kapak</td><td>3</td><td>9,4</td><td>3,13</td></tr><tr><td>Bardak</td><td>7</td><td>22</td><td>3,14</td></tr><tr><td>Tabak</td><td>20</td><td>62,8</td><td>3,14</td></tr></tbody></table><p>Hangi çember olursa olsun <b>Çevre ÷ Çap ≈ 3,14</b> çıkıyor! Bu sabit sayıya <b>π (pi) sayısı</b> denir.</p>' },
      { h: 'π Sayısı', html: '<div class="box def"><b>π = Çemberin uzunluğu ÷ Çapı ≈ 3,14</b><br>Bu sayı ondalık gösterimde bitmez ve tekrar etmez (3,14159265…). Biz çoğunlukla <b>3,14</b> kullanacağız.</div>' },
      { h: 'Çember Uzunluğu', html: '<div class="box def"><b>Çemberin uzunluğu (Ç) = π · çap = π · d</b><br>Çap, yarıçapın 2 katı olduğu için <b>Ç = 2 · π · r</b></div><div class="box ex"><b>Örnek:</b> Çapı 10 cm olan çemberin uzunluğu: 3,14 · 10 = <b>31,4 cm</b>.<br><b>Örnek:</b> Yarıçapı 5 cm: 2 · 3,14 · 5 = <b>31,4 cm</b>.</div><div class="box tip">Çap 2 katına çıkarsa çemberin uzunluğu da 2 katına çıkar. Çünkü Çevre ÷ Çap oranı sabittir.</div>' }
    ],
    makers: [
      function (r) { var d = r.pick([10, 20, 30, 40, 50, 5, 15]); return Q(r, 'Çapı ' + d + ' cm olan çemberin uzunluğu kaç cm’dir? (π = 3,14)', N(r2(PI * d)), [N(r2(PI * d / 2)), N(r2(PI * d * 2)), N(r2(PI + d))], 'Ç = π · d = 3,14 · ' + d + ' = ' + N(r2(PI * d))); },
      function (r) { var rr = r.pick([2, 3, 5, 10, 20, 25]); return Q(r, 'Yarıçapı ' + rr + ' cm olan çemberin uzunluğu kaç cm’dir? (π = 3,14)', N(r2(2 * PI * rr)), [N(r2(PI * rr)), N(r2(PI * rr * rr)), N(r2(4 * PI * rr))], 'Ç = 2 · π · r = 2 · 3,14 · ' + rr + ' = ' + N(r2(2 * PI * rr))); },
      function (r) { return Q(r, 'Bir çemberin çevre uzunluğunun çap uzunluğuna oranı için aşağıdakilerden hangisi doğrudur?', 'Çember ne kadar büyük olursa olsun yaklaşık 3,14’tür', ['Çember büyüdükçe artar', 'Çember büyüdükçe azalır', 'Yarıçapa eşittir'], 'Bu oran π sayısıdır ve sabittir.'); },
      function (r) { var d = r.pick([10, 20, 30, 50]); return Q(r, 'Çevresi ' + N(r2(PI * d)) + ' cm, çapı ' + d + ' cm olan bir çemberde Çevre ÷ Çap oranı yaklaşık kaçtır?', '3,14', ['6,28', '1,57', '3'], 'Ç ÷ d = π ≈ 3,14.'); },
      function (r) { return Q(r, 'Aşağıdakilerden hangisi çemberin uzunluğunu veren bağıntı <b>değildir</b>?', 'π · r · r', ['π · d', '2 · π · r', 'π · 2r'], 'π·r² çemberin değil dairenin alanıdır; çember uzunluğu π·d = 2πr’dir.'); },
      function (r) { var d = r.int(2, 6) * 5; return Q(r, 'Bir çemberin çapı ' + d + ' cm’den ' + 2 * d + ' cm’ye çıkarılırsa çemberin uzunluğu nasıl değişir?', '2 katına çıkar', ['Aynı kalır', '4 katına çıkar', 'Yarıya iner'], 'Ç = π·d olduğundan çap 2 katına çıkınca çevre de 2 katına çıkar.'); },
      function (r) { var d = r.pick([2, 4, 6, 8]); return Q(r, 'Çapı ' + d + ' cm olan bir çemberin yarıçapı kaç cm’dir?', d / 2, [d, d * 2, d / 2 + 1], 'Yarıçap, çapın yarısıdır.'); }
    ]
  });

  // ============ HAFTA 17 ============
  WEEKS.push({
    tema: 4, no: 17, title: 'Çember Uzunluğu Problemleri', hours: 4, code: 'MAT.6.4.5 (a-g)',
    outcomes: ['Çap veya yarıçap uzunluğu verilen bir çemberin uzunluğuyla ilgili problemlerde bileşenleri belirler; strateji geliştirir, uygular ve genelleştirir.'],
    lesson: [
      { h: 'Problemlerde Bileşenler', html: '<p>Çember problemlerinde bileşenler: <b>çap, yarıçap, çevre (uzunluk), tur sayısı, alınan yol</b>. İlişkiler:</p><div class="box def">Ç = π · d = 2πr<br>d = Ç ÷ π &nbsp; r = Ç ÷ (2π)<br>Alınan yol = tur sayısı × Ç</div>' },
      { h: 'Çözümlü Örnekler', html: '<div class="box ex"><b>Tekerlek:</b> Yarıçapı 50 cm olan bir tekerlek 10 tam tur dönerse kaç metre yol alır?<br>Ç = 2 · 3,14 · 50 = 314 cm. 10 tur: 3 140 cm = <b>31,4 m</b>.</div><div class="box ex"><b>Çevreden çapa:</b> Çevresi 62,8 cm olan çemberin çapı: 62,8 ÷ 3,14 = <b>20 cm</b>; yarıçapı 10 cm.</div><div class="box ex"><b>Yarım çember:</b> Çapı 20 cm olan yarım çemberin yay uzunluğu 31,4 cm; çapla birlikte (kapalı yarım daire çevresi) 31,4 + 20 = <b>51,4 cm</b>.</div>' },
      { h: 'Strateji Genellemesi', html: '<p>“Tekerlek, koşu pisti, saat ibresi, bisiklet tekeri” gibi dönen nesnelerde <b>bir tur = çevre uzunluğu</b> fikri ortaktır. Farklı problem tiplerine uygulayın.</p>' }
    ],
    makers: [
      function (r) { var rr = r.pick([25, 50]), n = r.pick([10, 20, 50]); var c = 2 * PI * rr; var m = c * n / 100; return Q(r, 'Yarıçapı ' + rr + ' cm olan bir tekerlek ' + n + ' tam tur döndüğünde kaç metre yol alır? (π = 3,14)', N(r2(m)) + ' m', [N(r2(m * 10)) + ' m', N(r2(m / 10)) + ' m', N(r2(PI * rr * n / 100)) + ' m'], 'Ç = 2 · 3,14 · ' + rr + ' = ' + c + ' cm; ' + n + ' tur → ' + c * n + ' cm = ' + N(r2(m)) + ' m.'); },
      function (r) { var d = r.pick([10, 20, 30, 40, 50]); var c = r2(PI * d); return Q(r, 'Çevresi ' + N(c) + ' cm olan çemberin çapı kaç cm’dir? (π = 3,14)', d, [d / 2, 2 * d, d + 10], d + ' = ' + N(c) + ' ÷ 3,14'); },
      function (r) { var rr = r.pick([5, 10, 15, 20, 25]); var c = r2(2 * PI * rr); return Q(r, 'Çevresi ' + N(c) + ' cm olan çemberin yarıçapı kaç cm’dir? (π = 3,14)', rr, [2 * rr, rr / 5 + rr, rr + 5], 'Ç = 2πr → r = ' + N(c) + ' ÷ 6,28 = ' + rr); },
      function (r) { var d = r.pick([100, 200, 50]), n = r.pick([2, 3, 5]); var c = r2(PI * d); return Q(r, 'Çapı ' + d + ' m olan dairesel bir pistte ' + n + ' tur koşan bir sporcu kaç metre yol koşar? (π = 3,14)', N(r2(c * n)) + ' m', [N(r2(c)) + ' m', N(r2(c * n * 2)) + ' m', N(r2(d * n)) + ' m'], 'Bir tur Ç = 3,14 · ' + d + ' = ' + N(c) + ' m; ' + n + ' tur → ' + N(r2(c * n))); },
      function (r) { var d = r.pick([10, 20, 30, 40]); var c = r2(PI * d / 2 + d); return Q(r, 'Çapı ' + d + ' cm olan yarım daire şeklindeki bir levhanın çevresi (yay + çap) kaç cm’dir? (π = 3,14)', N(c), [N(r2(PI * d)), N(r2(PI * d / 2)), N(r2(PI * d + d))], 'Yay: 3,14 · ' + d + ' ÷ 2 = ' + N(r2(PI * d / 2)) + '; çap eklenir: ' + N(c)); },
      function (r) { var k = r.pick([2, 3, 4]); return Q(r, 'Yarıçapları oranı 1 : ' + k + ' olan iki çemberin uzunlukları oranı nedir?', '1 : ' + k, ['1 : ' + k * k, k + ' : 1', '1 : ' + (k + 1)], 'Ç = 2πr; çevre yarıçapla doğru orantılıdır.'); },
      function (r) { var rr = r.pick([7, 14, 21]); var c = 2 * 22 / 7 * rr; return Q(r, 'Yarıçapı ' + rr + ' cm olan çemberin uzunluğu π yerine 22/7 alınırsa kaç cm olur?', N(c) + ' cm', [N(c / 2) + ' cm', N(c * 2) + ' cm', N(c + 7) + ' cm'], '2 · (22/7) · ' + rr + ' = ' + N(c)); }
    ]
  });

  // ============ HAFTA 18 ============
  WEEKS.push({
    tema: 4, no: 18, title: 'Merkez Açı ve Gördüğü Yay Uzunluğu', hours: 4, code: 'MAT.6.4.6 (a, b, c)',
    outcomes: ['Çemberde farklı ölçülere sahip merkez açıların gördüğü yayların uzunluklarını gözlemler.', 'Merkez açı ölçüsü ile yay uzunluğu arasındaki ilişkiye dair örüntü bulur ve genelleme yapar.'],
    lesson: [
      { h: 'Merkez Açı', html: '<p>Köşesi çemberin merkezinde olan ve kolları çemberi kesen açıya <b>merkez açı</b> denir. Gördüğü çember parçasına <b>yay</b> denir.</p>' + MC.circleFig(90, {}) },
      { h: 'Tümevarımla Keşif', html: '<table class="tbl"><thead><tr><th>Merkez açı</th><th>Tam açıya oranı</th><th>Yay uzunluğu (Ç = 36 cm)</th></tr></thead><tbody><tr><td>360°</td><td>1</td><td>36 cm</td></tr><tr><td>180°</td><td>1/2</td><td>18 cm</td></tr><tr><td>90°</td><td>1/4</td><td>9 cm</td></tr><tr><td>60°</td><td>1/6</td><td>6 cm</td></tr><tr><td>30°</td><td>1/12</td><td>3 cm</td></tr></tbody></table><p>Merkez açı kaç katına çıkarsa <b>yay uzunluğu da o kadar katına çıkar</b>.</p>' },
      { h: 'Genelleme', html: '<div class="box def"><b>Yay uzunluğu = (Merkez açı ÷ 360°) × Çemberin uzunluğu</b></div><div class="box ex"><b>Örnek:</b> Çevresi 72 cm olan çemberde 50°’lik merkez açının gördüğü yay: 50 ÷ 360 · 72 = <b>10 cm</b>.<br><b>Örnek:</b> Yarıçapı 10 cm olan çemberde 90°’lik merkez açının gördüğü yay: Ç = 62,8; 62,8 ÷ 4 = <b>15,7 cm</b>.</div>' },
      { h: 'Gerçek Yaşam', html: '<p>Saat kadranı, pizza dilimi, hız göstergesi. Dakika ibresi 20 dakikada 120° döner (360° ÷ 3).</p>' }
    ],
    makers: [
      function (r) { var c = r.pick([36, 72, 108, 144, 180]); var a = r.pick([30, 40, 60, 90, 120, 180]); var y = c * a / 360; return Q(r, 'Uzunluğu ' + c + ' cm olan çemberde ' + a + '°’lik merkez açının gördüğü yayın uzunluğu kaç cm’dir?', N(y), [N(y * 2), N(y / 2), N(y + 5)], a + ' ÷ 360 · ' + c + ' = ' + N(y)); },
      function (r) { var c = r.pick([36, 72, 108]); var a = r.pick([30, 60, 90, 120]); var y = c * a / 360; return Q(r, 'Uzunluğu ' + c + ' cm olan çemberde uzunluğu ' + N(y) + ' cm olan yayı gören merkez açı kaç derecedir?', a + '°', [(a * 2) + '°', (a / 2) + '°', (a + 30) + '°'], N(y) + ' ÷ ' + c + ' · 360 = ' + a); },
      function (r) { var a = r.pick([60, 90, 120, 45, 30]); var y = r.pick([5, 6, 8, 10, 12]); var c = y * 360 / a; return Q(r, a + '°’lik merkez açının gördüğü yay ' + y + ' cm ise çemberin uzunluğu kaç cm’dir?', N(c), [N(c / 2), N(c * 2), N(c + 10)], '360 ÷ ' + a + ' = ' + 360 / a + ' kat → ' + y + ' · ' + 360 / a + ' = ' + N(c)); },
      function (r) { var a = r.pick([20, 30, 40, 45]); return Q(r, 'Bir çemberde ' + a + '°’lik merkez açının gördüğü yay uzunluğu ℓ ise ' + 2 * a + '°’lik merkez açının gördüğü yay uzunluğu kaç ℓ olur?', '2ℓ', ['ℓ', '4ℓ', 'ℓ/2'], 'Merkez açı 2 katına çıkınca yay uzunluğu da 2 katına çıkar.'); },
      function (r) { var d = r.pick([2, 3, 4, 5, 6]); var t = r.pick([[20, 120], [15, 90], [30, 180], [10, 60], [5, 30]]); return Q(r, 'Bir saatin dakika ibresi ' + t[0] + ' dakikada kaç derece döner?', t[1] + '°', [(t[1] * 2) + '°', (t[1] / 2) + '°', (t[1] + 30) + '°'], '60 dakikada 360°; 1 dakikada 6° → ' + t[0] * 6 + '°.'); },
      function (r) { var rr = 10, a = r.pick([90, 180, 60, 120]); var c = 2 * PI * rr; var y = r2(c * a / 360); return Q(r, 'Yarıçapı 10 cm olan çemberde ' + a + '°’lik merkez açının gördüğü yay uzunluğu kaç cm’dir? (π = 3,14)', N(y), [N(r2(y * 2)), N(r2(y / 2)), N(r2(y + 3))], 'Ç = 62,8; ' + a + ' ÷ 360 · 62,8 = ' + N(y)); },
      function (r) { var k = r.pick([[180, 'yarım'], [90, 'çeyrek']]); return Q(r, 'Merkez açısı ' + k[0] + '° olan yay, çemberin kaçta kaçıdır?', k[0] === 180 ? '1/2' : '1/4', ['1/3', '1/6', '1/8'], k[0] + ' ÷ 360 = ' + (k[0] === 180 ? '1/2' : '1/4')); }
    ]
  });
})();
