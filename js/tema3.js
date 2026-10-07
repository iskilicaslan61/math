/* 3. TEMA: Geometrik Şekiller (20 ders saati) — Hafta 8-11 */
(function () {
  'use strict';
  var N = MC.num, Q = MC.Q;
  TEMAS.push({ id: 3, title: 'Geometrik Şekiller', hours: 20, color: '#00a8a8',
    summary: 'Paralel doğrular ve kesen, yamuk, paralelkenar, eşkenar dörtgen, dikdörtgen, kare, köşegen özellikleri, açı problemleri.' });

  // Açı harfleri: üst kesişimde a(sol-üst) b(sağ-üst) c(sol-alt) d(sağ-alt); alt kesişimde e f g h
  var GRP1 = 'adeh', GRP2 = 'bcfg';
  var REL = {
    'yöndeş': [['a', 'e'], ['b', 'f'], ['c', 'g'], ['d', 'h']],
    'iç ters': [['d', 'e'], ['c', 'f']],
    'dış ters': [['a', 'h'], ['b', 'g']],
    'ters (karşı)': [['a', 'd'], ['b', 'c'], ['e', 'h'], ['f', 'g']],
    'komşu bütünler': [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd'], ['e', 'f'], ['e', 'g'], ['f', 'h'], ['g', 'h']]
  };
  function sameGroup(p, q) { return (GRP1.indexOf(p) >= 0) === (GRP1.indexOf(q) >= 0); }
  function angleOf(letter, A) { return GRP1.indexOf(letter) >= 0 ? A : 180 - A; }

  // ============ HAFTA 8 ============
  WEEKS.push({
    tema: 3, no: 8, title: 'İki Paralel Doğru ve Bir Kesenin Oluşturduğu Açılar', hours: 5, code: 'MAT.6.3.1 (a, b, c, ç)',
    outcomes: ['İki paralel doğru ve bir kesen ile oluşan açıları belirler, ayrıştırır, sınıflandırır ve adlandırır.'],
    lesson: [
      { h: 'Ders Açılışı', html: '<p>Demiryolu rayları, yol çizgileri, defter çizgileri… Etrafımızda paralel doğrular çok. Bir yol bu çizgileri keserse ne olur? Öğrencilerden paralel iki çizgiyi bir cetvelle kesen bir doğru çizip açıları işaretlemelerini isteyin.</p>' },
      { h: 'Şekil ve Açılar', html: '<p>ℓ₁ ∥ ℓ₂ ve bir kesen çizildiğinde <b>8 açı</b> oluşur.</p>' + MC.parallelFig(120, {}) + '<p>Bu şekilde: <b>a, b, c, d</b> üst kesişimdeki; <b>e, f, g, h</b> alt kesişimdeki açılardır.</p>' },
      { h: 'Açı Çiftlerinin Adları', html: '<table class="tbl"><thead><tr><th>Adı</th><th>Örnek çiftler</th><th>Ölçüleri</th></tr></thead><tbody><tr><td><b>Yöndeş açılar</b></td><td>a–e, b–f, c–g, d–h</td><td>Eşit</td></tr><tr><td><b>İç ters açılar</b></td><td>d–e, c–f</td><td>Eşit</td></tr><tr><td><b>Dış ters açılar</b></td><td>a–h, b–g</td><td>Eşit</td></tr><tr><td><b>Ters (karşı) açılar</b></td><td>a–d, b–c, e–h, f–g</td><td>Eşit</td></tr><tr><td><b>Komşu bütünler</b></td><td>a–b, a–c, …</td><td>Toplamları 180°</td></tr></tbody></table><div class="box tip"><b>Akılda kalsın:</b> “Yöndeş” aynı yerde duran açılardır (aynı konumda). “İç ters” paralellerin arasında, kesenin zıt taraflarında; “dış ters” paralellerin dışında, kesenin zıt taraflarında bulunur. Paralel doğrularda bu çiftlerin hepsi <b>eşittir</b>.</div>' },
      { h: 'Çözümlü Örnek', html: '<div class="box ex"><b>Soru:</b> ℓ₁ ∥ ℓ₂ ve a = 120° ise e, f, c açılarını bulunuz.<br>• a ile e yöndeş → e = <b>120°</b><br>• a ile b komşu bütünler → b = 180° − 120° = 60°; f ile b yöndeş → f = <b>60°</b><br>• a ile d ters açı → d = 120°; c ile b ters açı → c = <b>60°</b></div>' },
      { h: 'Etkinlik', html: '<p><b>Renkli şerit:</b> Renkli kâğıt şeritleri paralel doğru olarak yapıştırın. Kesen olarak bir ip alın. Açıları renkli kalemle gösterip aynı renkli açıları (eşit olanlar) eşleştirin. Dinamik geometri yazılımıyla (GeoGebra) kesenin eğimini değiştirerek aynı sonucu gözlemleyin.</p>' }
    ],
    makers: [
      function (r) { var pair = r.pick(REL['yöndeş']); var m = r.int(4, 13) * 10; if (m === 90) m = 85; var p = pair[0], q = pair[1]; var A = angleOf(p, 0) === 0 ? 0 : 0; var Aa = (GRP1.indexOf(p) >= 0) ? m : 180 - m; var lab = {}; lab[p] = m + '°'; lab[q] = '?'; return Q(r, 'ℓ₁ ∥ ℓ₂ olduğuna göre şekilde ' + p + ' = ' + m + '° ise ' + q + ' açısı kaç derecedir?', m + '°', [(180 - m) + '°', (m + 10) + '°', '90°'], p + ' ile ' + q + ' yöndeş açılardır, eşittir.', { fig: MC.parallelFig(Aa, lab) }); },
      function (r) { var pair = r.pick(REL['iç ters']); var m = r.int(4, 13) * 10; if (m === 90) m = 85; var p = pair[0], q = pair[1], lab = {}; var Aa = GRP1.indexOf(p) >= 0 ? m : 180 - m; lab[p] = m + '°'; lab[q] = '?'; return Q(r, 'ℓ₁ ∥ ℓ₂ olduğuna göre şekilde ' + p + ' = ' + m + '° ise ' + q + ' açısı kaç derecedir?', m + '°', [(180 - m) + '°', (m + 20) + '°', '90°'], p + ' ile ' + q + ' iç ters açılardır, eşittir.', { fig: MC.parallelFig(Aa, lab) }); },
      function (r) { var pair = r.pick(REL['dış ters']); var m = r.int(4, 13) * 10; if (m === 90) m = 85; var p = pair[0], q = pair[1], lab = {}; var Aa = GRP1.indexOf(p) >= 0 ? m : 180 - m; lab[p] = m + '°'; lab[q] = '?'; return Q(r, 'ℓ₁ ∥ ℓ₂ olduğuna göre şekilde ' + p + ' = ' + m + '° ise ' + q + ' açısı kaç derecedir?', m + '°', [(180 - m) + '°', (m - 10) + '°', '90°'], p + ' ile ' + q + ' dış ters açılardır, eşittir.', { fig: MC.parallelFig(Aa, lab) }); },
      function (r) { var pair = r.pick(REL['komşu bütünler']); var m = r.int(4, 13) * 10; if (m === 90) m = 85; var p = pair[0], q = pair[1], lab = {}; var Aa = GRP1.indexOf(p) >= 0 ? m : 180 - m; lab[p] = m + '°'; lab[q] = '?'; return Q(r, 'ℓ₁ ∥ ℓ₂ olduğuna göre şekilde ' + p + ' = ' + m + '° ise ' + q + ' açısı kaç derecedir?', (180 - m) + '°', [m + '°', (360 - m) + '°', (90 - m / 2) + '°'], p + ' ile ' + q + ' komşu bütünler açılardır: 180° − ' + m + '° = ' + (180 - m) + '°.', { fig: MC.parallelFig(Aa, lab) }); },
      function (r) { var names = ['yöndeş', 'iç ters', 'dış ters', 'ters (karşı)']; var nm = r.pick(names); var pair = r.pick(REL[nm]); var swap = r.f() < 0.5; var p = swap ? pair[1] : pair[0], q = swap ? pair[0] : pair[1]; var A = r.int(5, 13) * 10; if (A === 90) A = 100; var wr = names.filter(function (x) { return x !== nm; }).concat(['komşu bütünler']); return Q(r, 'ℓ₁ ∥ ℓ₂ iken şekildeki ' + p + ' ve ' + q + ' açıları hangi açı ilişkisindedir?', nm, wr, 'Konumlarına bakınca ' + p + '–' + q + ' çifti “' + nm + '” açılardır.', { fig: MC.parallelFig(A, {}) }); },
      function (r) { var defs = [['Paralel doğruların arasında kalan ve kesenin zıt taraflarında bulunan açı çiftlerine ne denir?', 'İç ters açılar'], ['Paralel doğruların dışında kalan ve kesenin zıt taraflarında bulunan açı çiftlerine ne denir?', 'Dış ters açılar'], ['Kesenin aynı tarafında, paralel doğrulara göre aynı konumda bulunan açı çiftlerine ne denir?', 'Yöndeş açılar'], ['İki doğrunun kesişmesiyle oluşan, köşeleri ortak olan karşılıklı açılara ne denir?', 'Ters (karşı) açılar']]; var d = r.pick(defs); var all = defs.map(function (x) { return x[1]; }); return Q(r, d[0], d[1], all.filter(function (x) { return x !== d[1]; }).concat(['Komşu bütünler açılar']), 'Tanımı hatırla: ' + d[1] + '.'); },
      function (r) { var m = r.int(3, 8) * 10; return Q(r, 'Bir kesen, iki paralel doğruyu keserek oluşan açılardan biri ' + m + '° ise aynı kesişimde bunun <b>komşu bütünleri</b> kaç derecedir?', (180 - m) + '°', [m + '°', (90 - m) + '°', (360 - m) + '°'], '180° − ' + m + '° = ' + (180 - m) + '°'); }
    ]
  });

  // ============ HAFTA 9 ============
  var SHAPES = {
    'Yamuk': {}, 'Paralelkenar': {}, 'Eşkenar dörtgen': {}, 'Dikdörtgen': {}, 'Kare': {}
  };
  var PROP = [
    { t: 'köşegenlerinin uzunlukları her zaman eşit', has: ['Dikdörtgen', 'Kare'], lack: ['Paralelkenar', 'Eşkenar dörtgen'] },
    { t: 'köşegenleri her zaman birbirine dik', has: ['Eşkenar dörtgen', 'Kare'], lack: ['Paralelkenar', 'Dikdörtgen'] },
    { t: 'dört kenarının uzunluğu her zaman eşit', has: ['Eşkenar dörtgen', 'Kare'], lack: ['Paralelkenar', 'Dikdörtgen'] },
    { t: 'dört açısının ölçüsü her zaman 90°', has: ['Dikdörtgen', 'Kare'], lack: ['Paralelkenar', 'Eşkenar dörtgen'] },
    { t: 'karşılıklı iki çift kenarı her zaman paralel', has: ['Paralelkenar', 'Eşkenar dörtgen', 'Dikdörtgen', 'Kare'], lack: [], extraLack: ['Yamuk'] }
  ];
  WEEKS.push({
    tema: 3, no: 9, title: 'Yamuk, Paralelkenar, Eşkenar Dörtgen, Dikdörtgen ve Kare', hours: 6, code: 'MAT.6.3.2 (a, b, c, ç, d)',
    outcomes: ['İki paralel doğrunun iki kesenle oluşturduğu şekillerin özelliklerine dair varsayımda bulunur.', 'Oluşan şekilleri özelliklerine göre listeler ve karşılaştırır.', 'İç açıları toplamı ve ortak özelliklere dair önermeler sunar; dörtgenlerin sınıflandırılmasına katkısını değerlendirir.'],
    lesson: [
      { h: 'Şekil Nasıl Oluşur?', html: '<p>İki paralel doğruyu iki farklı kesen doğru keserse <b>bir dörtgen</b> oluşur. Keselerin durumuna göre bu dörtgen yamuk, paralelkenar, eşkenar dörtgen, dikdörtgen ya da kare olabilir.</p><div class="box idea"><b>Etkinlik – GeoGebra:</b> İki paralel doğru ve iki kesen çizin. Kesenleri hareket ettirerek hangi dörtgenlerin oluştuğunu gözlemleyin. Varsayımınızı yazın, sonra ölçüm yaparak karşılaştırın.</div>' },
      { h: 'Dörtgenlerin İç Açıları Toplamı', html: '<p>Her dörtgeni bir köşegenle iki üçgene ayırabiliriz → iç açılar toplamı <b>2 · 180° = 360°</b>.</p>' },
      { h: 'Özellikler Tablosu', html: '<table class="tbl compare"><thead><tr><th>Özellik</th><th>Yamuk</th><th>Paralelkenar</th><th>Eşkenar dörtgen</th><th>Dikdörtgen</th><th>Kare</th></tr></thead><tbody><tr><td>En az bir çift paralel kenar</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td></tr><tr><td>İki çift paralel kenar</td><td>✘</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td></tr><tr><td>Karşılıklı kenarlar eşit</td><td>✘</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td></tr><tr><td>Dört kenar eşit</td><td>✘</td><td>✘</td><td>✔</td><td>✘</td><td>✔</td></tr><tr><td>Karşılıklı açılar eşit</td><td>✘</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td></tr><tr><td>Dört açı 90°</td><td>✘</td><td>✘</td><td>✘</td><td>✔</td><td>✔</td></tr><tr><td>Köşegenler eşit</td><td>✘</td><td>✘</td><td>✘</td><td>✔</td><td>✔</td></tr><tr><td>Köşegenler dik</td><td>✘</td><td>✘</td><td>✔</td><td>✘</td><td>✔</td></tr><tr><td>Köşegenler birbirini ortalar</td><td>✘</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td></tr></tbody></table><p class="note">(Yamukta köşegenlerin eşitliği sadece ikizkenar yamukta olur; genel yamuk için ✘ yazılmıştır.)</p>' },
      { h: 'Açı Bilgisi', html: '<ul><li><b>Paralelkenar / eşkenar dörtgen:</b> karşılıklı açılar eşit, komşu açıların toplamı 180°.</li><li><b>Yamuk:</b> paralel kenarlara komşu açıların toplamı 180° (iç açılar paralel doğrularla keseni oluşturur).</li><li><b>Dikdörtgen / kare:</b> bütün açılar 90°.</li><li><b>Eşkenar dörtgenin köşegenleri</b> köşe açılarını iki eşit parçaya böler (açıortay).</li></ul>' },
      { h: 'Sınıflandırma: Küme Şeması', html: '<p>Dörtgenler birbirinin içinde yer alır: <b>Kare ⊂ Dikdörtgen ⊂ Paralelkenar ⊂ Yamuk</b> ve <b>Kare ⊂ Eşkenar dörtgen ⊂ Paralelkenar</b>. Yani her kare aynı zamanda dikdörtgen, eşkenar dörtgen, paralelkenar ve yamuktur.</p><div class="box tip">Sınıflandırmada bu önermelere dayanırız: “Köşegenleri eşit olan paralelkenar dikdörtgendir.”</div>' }
    ],
    makers: [
      function (r) { var a = r.int(60, 110), b = r.int(70, 120), c = r.int(60, 110); var d = 360 - a - b - c; if (d < 30) { a = 80; b = 100; c = 90; d = 90; } return Q(r, 'Bir dörtgenin üç iç açısı ' + a + '°, ' + b + '° ve ' + c + '° ise dördüncü iç açısı kaç derecedir?', d + '°', [(180 - a) + '°', (d + 10) + '°', (d - 10) + '°'], '360° − (' + a + '° + ' + b + '° + ' + c + '°) = ' + d + '°'); },
      function (r) { var x = r.int(5, 13) * 10; if (x === 90) x = 70; return Q(r, 'ABCD bir paralelkenar ve A açısı ' + x + '° ise komşu B açısı kaç derecedir?', (180 - x) + '°', [x + '°', (360 - x) + '°', (90 - x / 2) + '°'], 'Komşu açıların toplamı 180°: 180° − ' + x + '° = ' + (180 - x) + '°.'); },
      function (r) { var p = r.pick(PROP.slice(0, 4)); var correct = r.pick(p.has); var wrongs = r.sample(p.lack.concat(['Yamuk']), 3); return Q(r, 'Aşağıdaki dörtgenlerden hangisinin ' + p.t + 'dir?', correct, wrongs, p.has.join(' ve ') + ' için bu özellik her zaman doğrudur.'); },
      function (r) { var p = r.pick(PROP.slice(0, 4)); var correct = r.pick(p.has); var wrongs = r.sample(p.lack.concat(['Yamuk']), 3); return Q(r, '“' + p.t.replace(' her zaman', '') + ' olan” dörtgenlerden biri aşağıdakilerden hangisidir?', correct, wrongs, correct + ' bu özelliğe sahiptir.'); },
      function (r) { var x = r.int(5, 12) * 10; if (x === 90) x = 80; return Q(r, 'ABCD yamuğunda AB ∥ DC ve A açısı ' + x + '° ise D açısı kaç derecedir?', (180 - x) + '°', [x + '°', (360 - x) + '°', '90°'], 'AD kesen olduğundan A ile D iç açılar toplamı 180°: ' + (180 - x) + '°.'); },
      function (r) { var h = r.int(2, 8) * 10; return Q(r, 'Eşkenar dörtgenin köşegeni köşe açısını iki eşit açıya böler. Bu açılardan biri ' + h + '° ise o köşenin iç açısı kaç derecedir?', (2 * h) + '°', [h + '°', (180 - h) + '°', (h / 2) + '°'], 'Köşegen açıortaydır: 2·' + h + '° = ' + 2 * h + '°.'); },
      function (r) { return Q(r, 'Aşağıdakilerden hangisi <b>yanlıştır</b>?', 'Her dikdörtgen bir karedir.', ['Her kare bir dikdörtgendir.', 'Her kare bir eşkenar dörtgendir.', 'Her eşkenar dörtgen bir paralelkenardır.'], 'Dikdörtgenin kenarları eşit olmak zorunda değildir; dolayısıyla her dikdörtgen kare değildir.'); },
      function (r) { var k = r.pick(['Dikdörtgen', 'Eşkenar dörtgen', 'Paralelkenar', 'Kare']); var m = { 'Dikdörtgen': 360, 'Eşkenar dörtgen': 360, 'Paralelkenar': 360, 'Kare': 360 }; return Q(r, k + 'nın iç açılarının ölçüleri toplamı kaç derecedir?', '360°', ['180°', '270°', '540°'], 'Her dörtgende iç açılar toplamı 360°’dir.'); }
    ]
  });

  // ============ HAFTA 10 ============
  WEEKS.push({
    tema: 3, no: 10, title: 'Köşegenleri Birbirini Ortalayan Dörtgenler', hours: 4, code: 'MAT.6.3.3 (a, b, c, ç, d)',
    outcomes: ['Birbirlerini ortalayan doğru parçalarını köşegen kabul eden dörtgenleri oluşturur ve listeler.', 'Özelliklerine bağlı önermeler sunar; dörtgenlerin farklı yollardan tanımlanmasına katkısını değerlendirir.'],
    lesson: [
      { h: 'Deney: İki Çubuk, Bir Dörtgen', html: '<p>İki pipet veya çubuk alın, orta noktalarından bir pime bağlayın. Çubukların uçlarını birleştirirseniz bir dörtgen elde edersiniz. Çubukların <b>uzunluklarını ve aralarındaki açıyı</b> değiştirerek farklı dörtgenler oluşturun.</p>' },
      { h: 'Temel Önermeler', html: '<div class="box def"><ul><li>Köşegenleri <b>birbirini ortalayan</b> dörtgen → <b>paralelkenar</b></li><li>Köşegenleri birbirini ortalayan ve <b>eşit uzunlukta</b> → <b>dikdörtgen</b></li><li>Köşegenleri birbirini ortalayan ve <b>birbirine dik</b> → <b>eşkenar dörtgen</b></li><li>Köşegenleri birbirini ortalayan, eşit ve dik → <b>kare</b></li></ul></div>' },
      { h: 'Uzunluk Problemleri', html: '<div class="box ex"><b>Örnek:</b> ABCD paralelkenarında köşegenlerin kesim noktası O, AO = 7 cm ise AC = 14 cm’dir.<br><b>Örnek:</b> Dikdörtgende AC = 18 cm ise OA = OB = OC = OD = 9 cm.</div>' },
      { h: 'Tanımları Farklı Yollardan Yapma', html: '<p>Dikdörtgen için iki farklı tanım düşünebiliriz: (1) “Dört açısı 90° olan dörtgen.” (2) “Köşegenleri birbirini ortalayan ve eşit olan dörtgen.” İkisi de aynı şekli tanımlar. Bu bize sınıflandırmada esneklik sağlar.</p>' }
    ],
    makers: [
      function (r) { var cs = [['birbirini ortalayan', 'Paralelkenar'], ['birbirini ortalayan ve eşit uzunlukta olan', 'Dikdörtgen'], ['birbirini ortalayan ve birbirine dik olan', 'Eşkenar dörtgen'], ['birbirini ortalayan, eşit uzunlukta ve birbirine dik olan', 'Kare']]; var c = r.pick(cs); return Q(r, 'Köşegenleri ' + c[0] + ' dörtgen aşağıdakilerden hangisidir?', c[1], ['Yamuk', 'Deltoid (uçurtma)', 'İkizkenar yamuk', 'Genel dörtgen'], 'Özellik: ' + c[0] + ' → ' + c[1] + '.'); },
      function (r) { var x = r.int(3, 15); return Q(r, 'ABCD paralelkenarında köşegenler O noktasında kesişiyor. AO = ' + x + ' cm ise AC kaç cm’dir?', 2 * x, [x, x + 2, 3 * x], 'Köşegenler birbirini ortalar: AC = 2·AO = ' + 2 * x + '.'); },
      function (r) { var x = r.int(4, 20) * 2; return Q(r, 'Bir dikdörtgenin köşegeni ' + x + ' cm’dir. Köşegenlerin kesim noktasının köşelere uzaklığı kaç cm’dir?', x / 2, [x, x / 2 + 1, 2 * x], 'Dikdörtgende köşegenler eşittir ve birbirini ortalar: ' + x + ' ÷ 2 = ' + x / 2 + '.'); },
      function (r) { var x = r.int(4, 12); return Q(r, 'ABCD eşkenar dörtgeninde AC ve BD köşegenleri O noktasında kesişiyor. BO = ' + x + ' cm ise BD kaç cm’dir? Köşegenlerin arasındaki açı kaç derecedir?', 2 * x + ' cm, 90°', [x + ' cm, 90°', 2 * x + ' cm, 60°', 2 * x + ' cm, 45°'], 'Eşkenar dörtgenin köşegenleri birbirini ortalar ve dik keser.'); },
      function (r) { var T = [['Köşegenleri birbirini ortalayan her dörtgen paralelkenardır.', true], ['Köşegenleri birbirini ortalayan ve eşit olan dörtgen dikdörtgendir.', true], ['Köşegenleri birbirini ortalayan ve dik olan dörtgen eşkenar dörtgendir.', true], ['Her kare aynı zamanda dikdörtgendir.', true], ['Köşegenleri dik olan her dörtgen eşkenar dörtgendir.', false], ['Her dikdörtgen karedir.', false], ['Her paralelkenar eşkenar dörtgendir.', false], ['Köşegenleri eşit olan her dörtgen dikdörtgendir.', false]]; var t = T.filter(function (x) { return x[1]; }), f = T.filter(function (x) { return !x[1]; }); if (r.f() < 0.5) return Q(r, 'Aşağıdaki ifadelerden hangisi <b>doğrudur</b>?', r.pick(t)[0], r.sample(f, 3).map(function (x) { return x[0]; }), 'Diğerleri için karşı örnek bulunabilir.'); return Q(r, 'Aşağıdaki ifadelerden hangisi <b>yanlıştır</b>?', r.pick(f)[0], r.sample(t, 3).map(function (x) { return x[0]; }), 'Karşı örnek bulunabildiği için bu ifade yanlıştır.'); },
      function (r) { var cs = [['Köşegenleri eşit olan bir paralelkenar', 'dikdörtgendir'], ['Köşegenleri dik olan bir paralelkenar', 'eşkenar dörtgendir'], ['Köşegenleri hem eşit hem dik olan bir paralelkenar', 'karedir'], ['Köşegenleri birbirini ortalayan bir dörtgen', 'paralelkenardır']]; var c = r.pick(cs); return Q(r, c[0] + ' hangi dörtgendir?', c[1], cs.map(function (x) { return x[1]; }).filter(function (x) { return x !== c[1]; }).concat(['yamuktur']), 'Önermeye göre: ' + c[0] + ' ' + c[1]); },
      function (r) { var x = r.int(3, 9); return Q(r, 'Kare şeklindeki bir bahçenin köşegenleri O noktasında kesişiyor. AC = ' + 2 * x + ' m ise BO kaç m’dir?', x, [2 * x, x + 1, 4 * x], 'Karede köşegenler eşit ve birbirini ortalar: BO = AC ÷ 2 = ' + x + '.'); }
    ]
  });

  // ============ HAFTA 11 ============
  WEEKS.push({
    tema: 3, no: 11, title: 'Üçgen ve Dörtgenlerde Açı Problemleri', hours: 5, code: 'MAT.6.3.4 (a-h)',
    outcomes: ['Açı problemlerinde matematiksel bileşenleri belirler, aralarındaki ilişkiyi bulur.', 'Strateji geliştirir, uygular, çözümü kontrol eder ve genelleştirir.'],
    lesson: [
      { h: 'Problem Çözme Adımları', html: '<ol><li><b>Anla:</b> Şekil, verilenler, istenen.</li><li><b>Plan yap:</b> Hangi bilgi işe yarar? (180°, 360°, paralellik, eşitlik)</li><li><b>Uygula:</b> İşlemleri yap.</li><li><b>Kontrol et:</b> Sonuç mantıklı mı? Toplam doğru mu?</li></ol>' },
      { h: 'Gerekli Bilgiler', html: '<ul><li>Üçgenin iç açıları toplamı <b>180°</b>.</li><li>Eşkenar üçgenin her açısı <b>60°</b>.</li><li>İkizkenar üçgende taban açıları eşittir: tepe açısı t ise taban açısı (180° − t) ÷ 2.</li><li>Dik üçgende iki dar açının toplamı <b>90°</b>.</li><li>Üçgenin bir dış açısı, kendisine komşu olmayan iki iç açının toplamına eşittir.</li><li>Dörtgenin iç açıları toplamı <b>360°</b>; paralelkenarda komşu açılar bütünler.</li></ul>' },
      { h: 'Çözümlü Örnek', html: '<div class="box ex"><b>Soru:</b> İkizkenar bir üçgende tepe açısı 40° ise taban açıları kaçar derecedir?<br><b>Çözüm:</b> Taban açılarının toplamı 180° − 40° = 140°. İkisi eşit olduğundan her biri 140° ÷ 2 = <b>70°</b>.<br><b>Kontrol:</b> 40° + 70° + 70° = 180° ✓.</div><div class="box ex"><b>Soru:</b> Açıları 2 : 3 : 4 oranında olan üçgenin en büyük açısı?<br>Toplam parça 9 → 1 parça = 180° ÷ 9 = 20° → en büyük açı 4·20° = <b>80°</b>.</div>' },
      { h: 'Alternatif Çözüm ve Genelleme', html: '<p>Aynı sorunun birden fazla yolu olabilir. Çözümünüzü bir arkadaşınızınkiyle karşılaştırın. “Tepe açısı bilinen ikizkenar üçgen” stratejisi her ikizkenar üçgen için çalışır: bu bir <b>genellemedir</b>; farklı sayılarla test edin.</p>' }
    ],
    makers: [
      function (r) { var a = r.int(3, 11) * 5, b = r.int(3, 11) * 5; return Q(r, 'Bir üçgenin iki iç açısı ' + a + '° ve ' + b + '° ise üçüncü iç açısı kaç derecedir?', (180 - a - b) + '°', [(a + b) + '°', (360 - a - b) + '°', (90 - a) + '°'], '180° − ' + a + '° − ' + b + '° = ' + (180 - a - b) + '°'); },
      function (r) { var t = r.int(2, 14) * 10; return Q(r, 'İkizkenar bir üçgende tepe açısı ' + t + '° ise bir taban açısı kaç derecedir?', N((180 - t) / 2) + '°', [N(180 - t) + '°', N(t / 2) + '°', N(90 - t) + '°'], '(180° − ' + t + '°) ÷ 2 = ' + N((180 - t) / 2) + '°'); },
      function (r) { var b = r.int(2, 8) * 10; return Q(r, 'ABC dik üçgeninde A = 90° ve B = ' + b + '° ise C açısı kaç derecedir?', (90 - b) + '°', [b + '°', (180 - b) + '°', (90 + b) + '°'], 'Dik üçgende iki dar açı toplamı 90°: 90° − ' + b + '° = ' + (90 - b) + '°.'); },
      function (r) { var m = r.pick([[2, 3, 4], [1, 2, 3], [3, 4, 5], [1, 1, 2], [2, 3, 5]]); var s = m[0] + m[1] + m[2]; if (180 % s !== 0) { m = [2, 3, 4]; s = 9; } var u = 180 / s; return Q(r, 'Bir üçgenin açılarının ölçüleri ' + m.join(' : ') + ' oranındadır. En büyük açı kaç derecedir?', (m[2] * u) + '°', [(m[1] * u) + '°', (m[2] * u + 10) + '°', (m[0] * u) + '°'], 'Toplam ' + s + ' parça → 1 parça ' + u + '° → en büyük açı ' + m[2] * u + '°.'); },
      function (r) { var a = r.int(5, 12) * 10, b = r.int(5, 12) * 10; var c = r.int(7, 11) * 10; var d = 360 - a - b - c; if (d <= 0) { a = 90; b = 70; c = 100; d = 100; } return Q(r, 'Bir dörtgenin iç açıları ' + a + '°, ' + b + '°, ' + c + '° ve x ise x kaç derecedir?', d + '°', [(180 - a) + '°', (d + 20) + '°', (360 - d) + '°'], '360° − (' + a + ' + ' + b + ' + ' + c + ')° = ' + d + '°'); },
      function (r) { var a = r.int(4, 10) * 10, b = r.int(3, 9) * 10; return Q(r, 'Bir üçgenin iki iç açısı ' + a + '° ve ' + b + '° ise üçüncü köşesindeki <b>dış açının</b> ölçüsü kaç derecedir?', (a + b) + '°', [(180 - a - b) + '°', (360 - a - b) + '°', (a + b + 10) + '°'], 'Dış açı, komşu olmayan iki iç açının toplamına eşittir: ' + a + '° + ' + b + '° = ' + (a + b) + '°.'); },
      function (r) { var x = r.int(5, 12) * 10, y = r.int(3, 9) * 10; return Q(r, 'ABCD paralelkenarında A = ' + x + '°. Paralelkenarın dört açısının ölçüleri toplamı kaç derecedir ve C açısı kaç derecedir?', '360°, ' + x + '°', ['180°, ' + x + '°', '360°, ' + (180 - x) + '°', '270°, ' + x + '°'], 'Karşılıklı açılar eşit: C = A = ' + x + '°. Toplam her dörtgende 360°.'); },
      function (r) { return Q(r, 'Eşkenar üçgenin bir iç açısı kaç derecedir?', '60°', ['45°', '90°', '120°'], '180° ÷ 3 = 60°'); }
    ]
  });
})();
