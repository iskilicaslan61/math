/* 2. TEMA: İşlemlerle Cebirsel Düşünme ve Değişimler (33 ders saati) — Hafta 1-7 */
(function () {
  'use strict';
  var N = MC.num, Q = MC.Q, near = MC.near;
  var T = { id: 2, title: 'İşlemlerle Cebirsel Düşünme ve Değişimler', hours: 33, color: '#6c5ce7',
    summary: 'Bilinmeyen nicelikler, cebirsel ifadeler, sayı ve şekil örüntüleri, algoritmalar.' };
  TEMAS.push(T);
  var LET = ['x', 'y', 'a', 'b', 'k', 'm', 'n', 'p', 't'];

  // ============ HAFTA 1 ============
  WEEKS.push({
    tema: 2, no: 5, title: 'Bilinmeyen Nicelikler ve Tablo Temsili', hours: 5, code: 'MAT.6.2.1 (a, b)',
    outcomes: ['Gerçek yaşam durumlarında nicelikleri belirler.', 'Nicelikler arasındaki ilişkileri tablo temsili kullanarak belirler.'],
    lesson: [
      { h: 'Ders Açılışı (Köprü Kurma)', html: '<p>Cebirin tarihine kısa bir yolculukla başlayın: <b>Harezmî</b> ve <b>Ömer Hayyam</b> gibi âlimler bilinmeyen bir niceliği bulmak için yöntemler geliştirdi. Bugün aynı fikri günlük hayatta kullanıyoruz.</p><div class="box idea"><b>Etkinlik – “Aklından bir sayı tut”:</b> Öğrencilerden bir sayı tutmalarını isteyin. “Sayını 2 ile çarp, 3 ekle, söyle.” Sonucu duyunca siz tutulan sayıyı bulun. Bu oyun “bilinmeyen nicelik” fikrinin kapısıdır.</div>' },
      { h: 'Nicelik Nedir?', html: '<p><b>Nicelik</b>, sayıyla ifade edebildiğimiz her şeydir: kalem sayısı, para miktarı, yaş, uzunluk gibi. Bazı nicelikler <b>bellidir</b> (bir defterin fiyatı 7 TL), bazıları ise <b>bilinmez ya da değişebilir</b> (satılacak defter sayısı).</p><div class="box ex"><b>Örnek – Kütüphane kampanyası:</b> Okulda tişört satılacak. Niceliklere bakalım:<ul><li>Bir tişörtün satış fiyatı: <b>belli</b> (15 TL)</li><li>Bir tişörtün maliyeti: <b>belli</b> (9 TL)</li><li>Satılacak tişört sayısı: <b>değişebilir</b></li><li>Toplam gelir: tişört sayısına <b>bağlı</b> yeni bir nicelik</li></ul></div>' },
      { h: 'Tablo ile İlişkiyi Görme', html: '<p>Nicelikler arasındaki ilişkiyi bulmanın en kolay yolu <b>tablo</b> yapmaktır.</p><table class="tbl"><thead><tr><th>Satılan tişört sayısı</th><th>1</th><th>2</th><th>3</th><th>4</th><th>10</th></tr></thead><tbody><tr><td>Gelir (TL)</td><td>15</td><td>30</td><td>45</td><td>60</td><td>150</td></tr></tbody></table><p>Her adımda gelir <b>15 artıyor</b>. Yani gelir = tişört sayısı × 15. Tişört sayısı bilinmiyorsa onu bir <b>harf</b> ile gösterebiliriz: tişört sayısı <b>t</b> ise gelir <b>15·t</b> olur.</p><div class="box tip"><b>Hatırla:</b> Harf, bilinmeyen veya değişebilen bir sayıyı temsil eder. Çarpma işareti olarak “·” kullanılır.</div>' },
      { h: 'Çözümlü Örnekler', html: '<div class="box ex"><b>Örnek 1.</b> Bir paket bisküvide 6 bisküvi var. p paket varsa toplam bisküvi sayısı kaçtır?<br><b>Çözüm:</b> Tablo yapalım: 1 paket → 6, 2 paket → 12, 3 paket → 18. Toplam = <b>6·p</b>. p = 5 için 6·5 = 30 bisküvi.</div><div class="box ex"><b>Örnek 2.</b> Ahmet 12 yaşında, kardeşi ondan 4 yaş küçük. Ahmet a yaşında olunca kardeşi kaç yaşında olur?<br><b>Çözüm:</b> Kardeşinin yaşı = a − 4. (Ahmet 12 iken 8, 14 iken 10 …)</div>' },
      { h: 'Sık Yapılan Hatalar', html: '<ul><li>“7 defter n tane” ilişkisini 7 + n diye yazmak. (Tekrarlı toplama = çarpma!)</li><li>Tablodaki artışı fark etmeden tahmin yürütmek: önce farkı bulun.</li></ul>' },
      { h: 'Sınıf İçi Çalışma', html: '<p><b>Grup çalışması:</b> Gruplara açık uçlu çalışma kâğıdı verin: “Hayvan barınağına yardım için kek satacağız. Hangi nicelikler vardır? Hangisi değişebilir? Aralarındaki ilişkiyi tabloyla gösterin.” Grupların sonuçlarını sınıfla paylaşmalarını isteyin. <i>(Değerler: Merhamet, Yardımseverlik, Tasarruf)</i></p>' }
    ],
    makers: [
      function (r) { var p = r.int(3, 9), L = r.pick(['n', 'k', 'm']), it = r.pick(['defter', 'kalem', 'simit']); return Q(r, 'Bir ' + it + 'in fiyatı ' + p + ' TL’dir. ' + L + ' tane ' + it + ' alan birinin ödeyeceği tutar için aşağıdakilerden hangisi doğrudur?', p + '·' + L, [p + '+' + L, L + '−' + p, L + ' ÷ ' + p], 'Her ' + it + ' ' + p + ' TL ise ' + L + ' tanesi ' + p + '·' + L + ' TL eder.'); },
      function (r) { var d = r.int(4, 12), k = r.int(8, 14); return Q(r, 'Tabloya göre ' + k + ' paket için toplam ücret kaç TL’dir?<br>' + MC.table(['Paket sayısı', '1', '2', '3', '4'], [['Ücret (TL)', d, 2 * d, 3 * d, 4 * d]]), N(d * k), [N(d * k + d), N(d * (k - 1) - 1), N(d + k)], 'Her pakette ücret ' + d + ' TL artıyor: ' + k + '·' + d + ' = ' + d * k + '.'); },
      function (r) { var a = r.int(10, 14), d = r.int(2, 6), L = r.pick(LET); return Q(r, 'Ali ' + L + ' yaşındadır. Kardeşi Ali’den ' + d + ' yaş küçük olduğuna göre kardeşinin yaşı nasıl gösterilir?', L + '−' + d, [L + '+' + d, d + '·' + L, L + ' ÷ ' + d], 'Küçük olduğu için çıkarma yapılır.'); },
      function (r) { var set = [['Bir kalemin fiyatı 3 TL', false], ['Bir sınıftaki öğrenci sayısı', true], ['Bir üçgenin kenar sayısı', false], ['Hafta içi günlerinin sayısı', false], ['Bir kumbaradaki para miktarı (her gün değişiyor)', true], ['Bir bitkinin boyu (her gün büyüyor)', true], ['Bir şehirde gün boyunca ölçülen sıcaklık', true], ['Sınıftaki sıra sayısı (sabit)', false]]; var ch = r.pick([true, false]); var pool = set.filter(function (x) { return x[1] === ch; }); var oth = set.filter(function (x) { return x[1] !== ch; }); var c = r.pick(pool)[0]; var w = r.sample(oth, 3).map(function (x) { return x[0]; }); if (ch === false) { return Q(r, 'Aşağıdakilerden hangisi <b>değişebilir</b> bir nicelik <b>değildir</b>?', c, w, 'Sabit olan nicelikler değişmez.'); } return Q(r, 'Aşağıdakilerden hangisi <b>değişebilir</b> bir niceliktir?', c, w, 'Zamanla ya da duruma göre değişen nicelik değişebilirdir.'); },
      function (r) { var k = r.int(4, 9), p = r.int(3, 12); return Q(r, 'Bir pakette ' + k + ' çikolata vardır. ' + p + ' paketteki çikolata sayısı kaçtır?', N(k * p), [N(k + p), N(k * p + k), N(k * p - p)], k + ' · ' + p + ' = ' + k * p + ' (paket sayısı kadar ' + k + ' toplanır)'); },
      function (r) { var a = r.int(2, 6), b = r.int(1, 9), n = r.int(7, 12); return Q(r, 'Tabloda sıra numarası ile karşılığı verilmiştir. Sıra numarası ' + n + ' olduğunda karşılığı kaçtır?<br>' + MC.table(['Sıra', '1', '2', '3', '4'], [['Karşılığı', a + b, 2 * a + b, 3 * a + b, 4 * a + b]]), N(a * n + b), [N(a * n), N(a * n + b + a), N((a + b) * n)], 'Her adımda ' + a + ' artıyor; kural: ' + a + '·sıra + ' + b + '.'); }
    ]
  });

  // ============ HAFTA 2 ============
  WEEKS.push({
    tema: 2, no: 6, title: 'Cebirsel İfadeler: Değişken, Katsayı, Sabit Terim', hours: 5, code: 'MAT.6.2.1 (c, ç)',
    outcomes: ['Nicelikler arasındaki ilişkileri cebirsel olarak ifade eder.', 'Cebirsel ifadenin anlamını kendi cümleleri ile açıklar.'],
    lesson: [
      { h: 'Ders Açılışı', html: '<p>Önceki haftadaki “15·t” ifadesini hatırlatın. <b>Cebirsel ifade</b> en az bir değişken (harf) içeren matematiksel ifadedir. Bu hafta onların “parçalarını” tanıyacağız.</p>' },
      { h: 'Cebirsel İfadenin Parçaları', html: '<div class="box def"><b>3x + 5</b> ifadesinde:<ul><li><b>Değişken:</b> x (değeri değişebilen harf)</li><li><b>Katsayı:</b> 3 (değişkenin çarpanı)</li><li><b>Sabit terim:</b> 5 (değeri değişmeyen sayı)</li><li><b>Terim:</b> + ile ayrılan her parça → 3x ve 5 (2 terim)</li></ul></div><p>Yazım kuralı: 4·a yerine kısaca <b>4a</b> yazarız. a·4 de <b>4a</b> biçiminde yazılır; 1a yerine <b>a</b> yazılır.</p>' },
      { h: 'Sözelden Cebirsele', html: '<table class="tbl"><thead><tr><th>Sözel</th><th>Cebirsel</th></tr></thead><tbody><tr><td>Bir sayının 4 fazlası</td><td>x + 4</td></tr><tr><td>Bir sayının 3 katı</td><td>3x</td></tr><tr><td>Bir sayının 3 katının 5 fazlası</td><td>3x + 5</td></tr><tr><td>Bir sayının 4 fazlasının 3 katı</td><td>3(x + 4)</td></tr><tr><td>Bir sayının yarısı</td><td>x ÷ 2</td></tr></tbody></table><div class="box warn"><b>Dikkat:</b> “3x + 4” ile “3(x + 4)” aynı değildir! Parantez, önce toplamanın yapılacağını gösterir.</div>' },
      { h: 'Değer Bulma', html: '<div class="box ex"><b>Örnek.</b> 2m + 7 ifadesinde m = 5 için değer: 2·5 + 7 = 10 + 7 = <b>17</b>.<br><b>Örnek.</b> 3(k + 1) ifadesinde k = 4 için: 3·(4 + 1) = 3·5 = <b>15</b>.</div>' },
      { h: 'Etkinlik', html: '<p><b>Kart eşleştirme:</b> Sözel ifade kartları ile cebirsel ifade kartlarını eşleştirin. Ardından her öğrenci kendi sözel ifadesini yazıp eşine cebirsel olarak yazdırsın.</p>' }
    ],
    makers: [
      function (r) { var a = r.int(2, 9), b = r.int(2, 9), L = r.pick(LET), ask = r.pick(['k', 's', 'd', 't']); var e = a + L + ' + ' + b; if (ask === 'k') return Q(r, e + ' ifadesinde <b>katsayı</b> kaçtır?', a, [b, a + b, 1], 'Değişkenin çarpanı ' + a + '’dır.'); if (ask === 's') return Q(r, e + ' ifadesinde <b>sabit terim</b> kaçtır?', b, [a, a + b, 1], 'Değişkensiz terim ' + b + '’dir.'); if (ask === 'd') return Q(r, e + ' ifadesinde <b>değişken</b> hangisidir?', L, [String(a), String(b), a + L, e], 'Harf ile gösterilen değişkendir.'); return Q(r, e + ' ifadesinde kaç terim vardır?', 2, [1, 3, 4], a + L + ' ve ' + b + ' olmak üzere 2 terim.'); },
      function (r) { var k = r.int(2, 6), c = r.int(2, 9), L = r.pick(LET); return Q(r, '“Bir sayının ' + k + ' katının ' + c + ' fazlası” ifadesinin cebirsel gösterimi hangisidir?', k + L + ' + ' + c, [k + '(' + L + ' + ' + c + ')', L + ' + ' + k + ' + ' + c, k + ' + ' + c + L], 'Önce ' + k + ' ile çarpılır, sonra ' + c + ' eklenir.'); },
      function (r) { var k = r.int(2, 6), c = r.int(2, 9), L = r.pick(LET); return Q(r, '“Bir sayının ' + c + ' fazlasının ' + k + ' katı” ifadesinin cebirsel gösterimi hangisidir?', k + '(' + L + ' + ' + c + ')', [k + L + ' + ' + c, L + ' + ' + k + c, k + L + c], 'Önce ' + c + ' eklenir (parantez), sonra ' + k + ' ile çarpılır.'); },
      function (r) { var a = r.int(2, 9), b = r.int(1, 9), v = r.int(2, 9), L = r.pick(LET); return Q(r, L + ' = ' + v + ' için ' + a + L + ' + ' + b + ' ifadesinin değeri kaçtır?', N(a * v + b), [N(a + v + b), N(a * (v + b)), N(a * v - b)], a + '·' + v + ' + ' + b + ' = ' + (a * v + b)); },
      function (r) { var k = r.int(2, 5), v = r.int(2, 9), L = r.pick(LET), c = r.int(1, 6); return Q(r, L + ' = ' + v + ' için ' + k + '(' + L + ' + ' + c + ') ifadesinin değeri kaçtır?', N(k * (v + c)), [N(k * v + c), N(k + v + c), N(k * v)], 'Önce parantez: ' + (v + c) + ', sonra ' + k + ' ile çarpılır: ' + k * (v + c)); },
      function (r) { var a = r.int(3, 9), L = r.pick(LET); return Q(r, 'Aşağıdakilerden hangisi <b>cebirsel ifade değildir</b>?', a + ' + ' + (a + 4), [a + L, L + ' + ' + a, a + '(' + L + ' − 1)'], 'Değişken içermeyen ifade sayısal ifadedir.'); },
      function (r) { var a = r.int(3, 9), L = r.pick(['a', 'm', 'x', 'n']); return Q(r, a + '·' + L + ' ifadesinin kısa yazılışı hangisidir?', a + L, [L + a, a + ' + ' + L, L + ' ÷ ' + a], 'Katsayı değişkenin önüne yazılır: ' + a + L); }
    ]
  });

  // ============ HAFTA 3 ============
  WEEKS.push({
    tema: 2, no: 7, title: 'Cebirsel İfadeleri Yorumlama ve Denk İfadeler', hours: 5, code: 'MAT.6.2.1 (d, e)',
    outcomes: ['Yorumladığı cebirsel ifadelere karşılık gelen durumlara yönelik varsayımda bulunur.', 'Varsayımda bulunduğu durumları inceleyerek değişkenlerin ve cebirsel ifadelerin anlamlarına yönelik genellemeleri belirler.'],
    lesson: [
      { h: 'Aynı İfade, Farklı Hikâyeler', html: '<p>Bir cebirsel ifade birçok farklı duruma karşılık gelebilir. Örneğin <b>2x + 2y</b>:</p><ul><li>Kenarları x ve y birim olan <b>dikdörtgenin çevresi</b>,</li><li>iki farklı sayının <b>2 katlarının toplamı</b>,</li><li>x TL’lik 2 defter ile y TL’lik 2 kalemin toplam fiyatı.</li></ul>' },
      { h: 'Örnek: Kantin', html: '<div class="box ex"><b>9m + 5n</b> ifadesi şunlara karşılık gelebilir:<br>• Birim fiyatı 9 TL olan m simit ile birim fiyatı 5 TL olan n ayran için ödenecek ücret.<br>• Birim fiyatı m TL olan 9 simit ile birim fiyatı n TL olan 5 ayran için ödenecek ücret.<br>İki yorum da doğrudur; değişkenin ne anlama geldiğini <b>biz belirleriz</b>.</div>' },
      { h: 'Değişkene Bağlı Yeni Nicelik', html: '<div class="box ex"><b>Mehmet’in parası Ahmet’in parasından 8 TL fazla.</b><br>Ahmet’in parası x TL → Mehmet’in parası <b>x + 8</b> TL.<br>Ters düşünelim: Mehmet’in parası y TL ise Ahmet’in parası <b>y − 8</b> TL.</div><p>Ahmet’in parası <b>değişebilir bir nicelik</b>; Mehmet’in parası ise ona <b>bağlı yeni bir nicelik</b>tir.</p>' },
      { h: 'Denk İfadeler', html: '<div class="box def">Her değer için aynı sonucu veren ifadelere <b>denk ifadeler</b> denir.</div><ul><li>4a = a + a + a + a = a + 3a = a + 2a + a</li><li>4·a = a·4 = 4a</li><li>a + b = b + a (toplamada sıra değişir, sonuç değişmez)</li></ul><div class="box tip"><b>Sınama:</b> Denk olup olmadıklarını anlamak için değişkene farklı değerler verin. a = 3 için 4a = 12 ve a + 3a = 12 ✓.</div>' },
      { h: 'Etkinlik', html: '<p><b>“Hikâyesini yaz” oyunu:</b> Tahtaya 3(k+1), 7p + 5a, ab gibi ifadeler yazın. Her grup, ifadeye uygun bir günlük hayat hikâyesi ve bir geometri durumu yazsın.</p>' }
    ],
    makers: [
      function (r) { var k = r.int(3, 6); return Q(r, k + 'a ifadesine <b>denk</b> olan ifade hangisidir?', 'a + ' + (k - 1) + 'a', ['a + ' + k, k + ' + a', 'a + ' + (k - 1)], k + 'a = a + ' + (k - 1) + 'a'); },
      function (r) { return Q(r, '2x + 2y ifadesi aşağıdaki durumlardan hangisiyle ilişkilendirilebilir?', 'Kenar uzunlukları x ve y birim olan dikdörtgenin çevre uzunluğu', ['Kenar uzunlukları x ve y birim olan dikdörtgenin alanı', 'x ve y sayılarının çarpımının 2 katı', 'x ve y sayılarının toplamının yarısı'], 'Dikdörtgenin çevresi 2 kısa + 2 uzun kenardır.'); },
      function (r) { var a = r.int(3, 12), b = r.int(2, 9); return Q(r, 'Okul kantininde birim fiyatı ' + a + ' TL olan m simit ile birim fiyatı ' + b + ' TL olan n ayran alan bir öğrencinin ödeyeceği ücret hangisidir?', a + 'm + ' + b + 'n', [a + 'n + ' + b + 'm', a + b + 'mn', a + 'm · ' + b + 'n'], 'Simit: ' + a + '·m, ayran: ' + b + '·n; ikisi toplanır.'); },
      function (r) { var d = r.int(3, 15), ad = r.pick(['Ayşe', 'Zeynep', 'Elif']), ad2 = r.pick(['Deniz', 'Ece', 'Selin']); return Q(r, ad + '’nin parası ' + ad2 + '’nin parasından ' + d + ' TL fazladır. ' + ad2 + '’nin parası x TL ise ' + ad + '’nin parası nasıl gösterilir?', 'x + ' + d, ['x − ' + d, d + 'x', 'x ÷ ' + d], 'Fazla olduğu için ' + d + ' eklenir.'); },
      function (r) { var d = r.int(3, 15), ad = r.pick(['Can', 'Mert', 'Kaan']), ad2 = r.pick(['Ali', 'Baran', 'Emre']); return Q(r, ad + '’ın parası ' + ad2 + '’nin parasından ' + d + ' TL fazladır. ' + ad + '’ın parası y TL ise ' + ad2 + '’nin parası nasıl gösterilir?', 'y − ' + d, ['y + ' + d, d + 'y', d + ' − y'], 'Ters düşünülür: fazlalık çıkarılır.'); },
      function (r) { var a = r.int(2, 5), b = r.int(2, 5); return Q(r, 'x + x + x + y + y ifadesine denk olan hangisidir?', '3x + 2y', ['5xy', '3y + 2x', 'x + 3 + y + 2'], '3 tane x ve 2 tane y vardır.'); },
      function (r) { var kk = r.int(2, 6), v = r.int(1, 8); return Q(r, '3(k + 1) ifadesinde k = ' + v + ' için değer kaçtır?', N(3 * (v + 1)), [N(3 * v + 1), N(3 + v + 1), N(3 * v)], '3·(' + v + ' + 1) = ' + 3 * (v + 1)); }
    ]
  });

  // ============ HAFTA 4 ============
  WEEKS.push({
    tema: 2, no: 8, title: 'Genelleme, Sınama ve Yeniden İfade Etme', hours: 4, code: 'MAT.6.2.1 (f, g, ğ)',
    outcomes: ['Genellemelerin varsayımını karşılayıp karşılamadığını farklı sözel ve cebirsel ifadelerle sınar.', 'Doğrulayabileceği ifadeleri farklı değişken ve değerlerle yeniden ifade eder.', 'Cebirsel ifadelerin matematiğin farklı alanlarındaki ve gerçek yaşamdaki katkısını ifade eder.'],
    lesson: [
      { h: 'Genelleme Nedir?', html: '<p>Birkaç örnekte gördüğümüz ilişkinin <b>her durumda geçerli</b> olduğunu söylemeye <b>genelleme</b> denir. Cebirsel ifadeler genellemeleri kısa yazmamızı sağlar:</p><ul><li>Karenin çevresi = <b>4a</b> (a: kenar uzunluğu)</li><li>Dikdörtgenin çevresi = <b>2(a + b)</b></li><li>Çift sayılar = <b>2n</b>, ardışık iki sayı: <b>n</b> ve <b>n + 1</b></li></ul>' },
      { h: 'Sınama: Değer Vererek Kontrol', html: '<div class="box ex"><b>Soru:</b> “3x ile x + 2x denktir” genellemesini sınayın.<br>x = 2: 3·2 = 6, 2 + 4 = 6 ✓<br>x = 7: 21 ve 7 + 14 = 21 ✓<br>x = 10: 30 ve 30 ✓ → Genelleme tutarlı görünüyor.</div><div class="box warn"><b>Karşı örnek:</b> “2x ile x + 2 denktir” diyen Ali, x = 2 için 4 = 4 buldu. Ama x = 5 için 10 ≠ 7. <b>Tek örnek yetmez; bir karşı örnek genellemeyi çürütür.</b></div>' },
      { h: 'Yeniden İfade Etme', html: '<p>Ahmet’in parası x, Mehmet’in parası x + 8 ise Mehmet’in parasını y diye adlandırırsak Ahmet’inki y − 8 olur. Aynı durum farklı değişkenle yeniden ifade edilir.</p>' },
      { h: 'Cebir Ne İşe Yarar?', html: '<ul><li><b>Matematikte:</b> İlişkileri tek formülle genelleriz (çevre, alan, örüntü kuralı).</li><li><b>Gerçek yaşamda:</b> Nüfus artışı, alışveriş, bütçe planlama, tasarruf hesapları.</li></ul>' },
      { h: 'Etkinlik', html: '<p><b>Dedektif gibi:</b> Gruplara bir iddia verin (örn. “a + b = b + a”, “a − b = b − a”). Farklı sayılar deneyip iddiaları sınasınlar, karşı örnek bulabilen grup puan kazansın.</p>' }
    ],
    makers: [
      function (r) { var v = r.int(2, 9); return Q(r, 'x = ' + v + ' için 3x ve x + 2x ifadelerinin değerleri hakkında ne söylenebilir?', 'İkisi de ' + 3 * v + ' eder', ['3x, ' + 3 * v + '; x + 2x, ' + (v + 2) + ' eder', 'İkisi de ' + (v + 3) + ' eder', 'Değerleri farklıdır'], '3·' + v + ' = ' + 3 * v + ' ve ' + v + ' + ' + 2 * v + ' = ' + 3 * v); },
      function (r) { var x = r.int(4, 9); return Q(r, 'Ali “2x ile x + 2 denktir” diyor. x = 2 için eşit çıkıyor. x = ' + x + ' denenirse ne olur ve Ali hakkında ne söylenir?', '2x = ' + 2 * x + ', x + 2 = ' + (x + 2) + ' olur; ifadeler denk değildir', ['İkisi de ' + 2 * x + ' olur; Ali haklıdır', 'Tek bir örnek yeterlidir; Ali haklıdır', 'x = ' + x + ' için eşit olur'], 'Bir karşı örnek, genellemeyi çürütmeye yeter.'); },
      function (r) { var d = r.int(3, 12), nm = r.pick(['Mehmet', 'Kaan', 'Burak']), nm2 = r.pick(['Ahmet', 'Arda', 'Okan']); return Q(r, nm2 + '’in parası x TL, ' + nm + '’in parası x + ' + d + ' TL’dir. ' + nm + '’in parasını y TL alırsak ' + nm2 + '’in parası nasıl yazılır?', 'y − ' + d, ['y + ' + d, d + 'y', 'x − ' + d], 'y = x + ' + d + ' olduğundan x = y − ' + d); },
      function (r) { var a = r.int(3, 12); return Q(r, 'Kenar uzunluğu a cm olan karenin çevresi hangi ifadeyle gösterilir? a = ' + a + ' için değeri kaçtır?', '4a, ' + 4 * a + ' cm', ['a + 4, ' + (a + 4) + ' cm', '2a, ' + 2 * a + ' cm', '4 + a, ' + (a + 4) + ' cm'], 'Kare 4 eşit kenara sahiptir.'); },
      function (r) { return Q(r, 'x + y + z ifadesi aşağıdakilerden hangisiyle <b>ilişkilendirilemez</b>?', 'Kenar uzunlukları x ve y birim olan dikdörtgenin çevresi', ['Kenar uzunlukları x, y, z birim olan çeşitkenar üçgenin çevresi', 'Zeynep, Ayşe ve Mehmet’in para miktarları toplamı', 'Üç farklı sayının toplamı'], 'Dikdörtgenin çevresi 2(x + y) biçimindedir ve z içermez.'); },
      function (r) { var n = r.int(3, 20); return Q(r, 'n bir doğal sayı olmak üzere, ardışık iki sayıdan küçüğü n ise büyüğü nedir? n = ' + n + ' için büyüğü kaçtır?', 'n + 1, ' + (n + 1), ['n − 1, ' + (n - 1), '2n, ' + 2 * n, 'n + 2, ' + (n + 2)], 'Ardışık sayılar 1 farkla gider.'); },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9); return Q(r, 'Aşağıdaki genellemelerden hangisi <b>doğrudur</b>?', 'a + b = b + a', ['a − b = b − a', 'a ÷ b = b ÷ a', 'a + b = a·b'], 'Toplamada değişme özelliği vardır; ' + a + ' + ' + b + ' = ' + b + ' + ' + a + '. Çıkarma ve bölmede ise değişme yoktur.'); }
    ]
  });

  // ============ HAFTA 5 ============
  function arithQ(r, kind) { var a1 = r.int(1, 9), d = r.int(2, 7), n = r.int(7, 15); return { a1: a1, d: d, n: n }; }
  WEEKS.push({
    tema: 2, no: 9, title: 'Sayı Örüntüleri ve Cebirsel Kural', hours: 5, code: 'MAT.6.2.2 (a, b, c)',
    outcomes: ['Sayı örüntülerindeki ilişkileri inceler.', 'İncelediği ilişkileri tablo, grafik ve sözel temsillerle ifade eder.', 'Örüntülerdeki yapıları cebirsel olarak ifade eder.'],
    lesson: [
      { h: 'Örüntü Avı', html: '<p>Örüntü, belli bir kurala göre devam eden sayı veya şekil dizisidir. Sınıfta <b>2, 5, 8, 11, 14, …</b> dizisini yazın. Soru: “Sonraki sayıyı nasıl buldunuz?”</p>' },
      { h: 'Adım Sayısı ve Terim', html: '<p>Örüntüdeki her sayıya <b>terim</b>, kaçıncı sırada olduğuna <b>adım</b> denir.</p><table class="tbl"><thead><tr><th>Adım (n)</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><td>Terim</td><td>2</td><td>5</td><td>8</td><td>11</td><td>14</td></tr></tbody></table><p>Her adımda terim <b>3 artıyor</b>. Bu yüzden kuralda <b>3n</b> var. 1. adımda 3·1 = 3 olur ama terim 2; yani 1 eksik: <b>kural = 3n − 1</b>.</p><div class="box tip"><b>Yöntem:</b> 1) Terimler arasındaki sabit farkı bul (katsayı). 2) Katsayıyla n’yi çarp. 3) Gerçek terimle farkı sabit terim olarak ekle/çıkar.</div>' },
      { h: 'Kuralı Kullanma', html: '<div class="box ex"><b>Soru:</b> Kuralı 3n − 1 olan örüntünün 20. terimi?<br>3·20 − 1 = <b>59</b>.<br><b>Soru:</b> 65 sayısı bu örüntünün kaçıncı terimidir?<br>3n − 1 = 65 → 3n = 66 → n = <b>22</b>.</div>' },
      { h: 'Grafik Temsil', html: '<p>Adım sayılarını yatay eksende, terimleri dikey eksende noktalarla gösterirsek noktaların <b>düzgün bir sıra</b> izlediğini görürüz. Bu da sabit artış demektir.</p>' },
      { h: 'Etkinlik', html: '<p><b>Örüntü fabrikası:</b> Her öğrenci bir kural yazsın (örn. 4n + 1), ilk 5 terimi hesaplayıp arkadaşına versin; arkadaşı kuralı bulsun.</p>' }
    ],
    makers: [
      function (r) { var p = arithQ(r); var t = []; for (var i = 0; i < 5; i++) t.push(p.a1 + i * p.d); var ans = p.a1 + (p.n - 1) * p.d; return Q(r, t.join(', ') + ', … örüntüsünün ' + p.n + '. terimi kaçtır?', N(ans), near(r, ans, [p.d, -p.d, 1, -1, 10]).map(N), 'Fark ' + p.d + '; kural: ' + p.d + 'n + ' + MC.sgn(p.a1 - p.d) + ' → ' + ans); },
      function (r) { var a = r.int(2, 7), b = r.int(1, 9), n = r.int(8, 15); return Q(r, 'Kuralı ' + a + 'n + ' + b + ' olan örüntünün ' + n + '. terimi kaçtır?', N(a * n + b), [N(a * n), N(a + n + b), N(a * (n + b))], a + '·' + n + ' + ' + b + ' = ' + (a * n + b)); },
      function (r) { var a = r.int(2, 6), b = r.int(1, 8), t = []; for (var i = 1; i <= 4; i++) t.push(a * i + b); return Q(r, t.join(', ') + ', … örüntüsünün kuralı hangisidir?', a + 'n + ' + b, [(a + b) + 'n', a + 'n − ' + b, b + 'n + ' + a], 'Fark ' + a + '; n=1 için ' + a + '+' + b + '=' + (a + b) + ' ✓'); },
      function (r) { var a = r.int(3, 7), b = r.int(1, 4), n = r.int(6, 14); var t = a * n - b; return Q(r, 'Kuralı ' + a + 'n − ' + b + ' olan örüntüde ' + t + ' sayısı kaçıncı terimdir?', n, near(r, n, [1, -1, 2, -2, 3]).concat([b]), a + 'n − ' + b + ' = ' + t + ' → ' + a + 'n = ' + (t + b) + ' → n = ' + n); },
      function (r) { var a = r.int(2, 6), b = r.int(0, 5), missing = r.int(2, 4), t = []; for (var i = 1; i <= 5; i++) t.push(i === missing ? '?' : a * i + b); return Q(r, 'Aşağıdaki örüntüde “?” yerine hangi sayı gelmelidir?<br><b>' + t.join(' , ') + '</b>', N(a * missing + b), near(r, a * missing + b, [1, -1, a, -a, 2]).map(N), 'Terimler ' + a + ' er artar.'); },
      function (r) { var p = arithQ(r), t = []; for (var i = 0; i < 4; i++) t.push(p.a1 + i * p.d); var nxt = p.a1 + 4 * p.d; return Q(r, t.join(', ') + ', … örüntüsünde sıradaki sayı kaçtır?', N(nxt), [N(nxt + 1), N(nxt - 1), N(nxt + p.d)], 'Her terim ' + p.d + ' artıyor.'); },
      function (r) { var a = r.int(2, 6), b = r.int(1, 4); return Q(r, 'Bir örüntüde adım sayısı n, terim ' + a + 'n + ' + b + ' kuralıyla bulunuyor. 1. terim kaçtır?', N(a + b), [N(a), N(b), N(a * b)], 'n = 1 için ' + a + ' + ' + b + ' = ' + (a + b)); }
    ]
  });

  // ============ HAFTA 6 ============
  WEEKS.push({
    tema: 2, no: 10, title: 'Şekil Örüntüleri ve Çokgenlerin Açıları', hours: 5, code: 'MAT.6.2.2 + Genellemeler',
    outcomes: ['Şekil örüntülerindeki yapıyı tablo, grafik ve sözel temsillerle ifade eder.', 'Çokgenlerin iç açıları toplamı ve düzgün çokgenlerde bir iç/dış açının ölçüsünü genelleyerek cebirsel olarak ifade eder.'],
    lesson: [
      { h: 'Kibrit Çöpü Örüntüsü', html: '<p>Yan yana dizilen üçgenleri kibrit çöpleriyle yapalım:</p><table class="tbl"><thead><tr><th>Üçgen sayısı (n)</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td>Çöp sayısı</td><td>3</td><td>5</td><td>7</td><td>9</td></tr></tbody></table><p>Her yeni üçgen için 2 çöp eklenir → kural: <b>2n + 1</b>. 10 üçgen için 2·10 + 1 = <b>21</b> çöp gerekir.</p><div class="box ex"><b>Kareler:</b> Yan yana n kare için çöp sayısı <b>3n + 1</b> (1 kare 4, 2 kare 7, 3 kare 10 …).</div>' },
      { h: 'Çokgenlerin İç Açıları Toplamı', html: '<p>Bir çokgeni tek köşesinden köşegenlerle üçgenlere ayıralım. <b>n kenarlı çokgen (n − 2) üçgene</b> bölünür. Her üçgenin iç açıları toplamı 180° olduğuna göre:</p><div class="box def">İç açılar toplamı = <b>(n − 2) · 180°</b></div><table class="tbl"><thead><tr><th>Çokgen</th><th>Kenar (n)</th><th>Üçgen sayısı</th><th>İç açılar toplamı</th></tr></thead><tbody><tr><td>Üçgen</td><td>3</td><td>1</td><td>180°</td></tr><tr><td>Dörtgen</td><td>4</td><td>2</td><td>360°</td></tr><tr><td>Beşgen</td><td>5</td><td>3</td><td>540°</td></tr><tr><td>Altıgen</td><td>6</td><td>4</td><td>720°</td></tr></tbody></table>' },
      { h: 'Düzgün Çokgenler', html: '<p>Bütün kenarları ve bütün açıları eşit olan çokgene <b>düzgün çokgen</b> denir.</p><div class="box def"><b>Bir iç açı</b> = (n − 2)·180° ÷ n<br><b>Bir dış açı</b> = 360° ÷ n<br>(İç açı + dış açı = 180°)</div><div class="box ex"><b>Düzgün altıgen:</b> iç açı = 720° ÷ 6 = <b>120°</b>, dış açı = 360° ÷ 6 = <b>60°</b>.</div>' },
      { h: 'Etkinlik', html: '<p>Öğrencilerden kâğıttan çokgenler kesip tek köşeden üçgenlere ayırmalarını ve tabloyu kendilerinin doldurmasını isteyin; kuralı <b>kendileri keşfetsin</b> (genelleme becerisi).</p>' }
    ],
    makers: [
      function (r) { var n = r.int(6, 14); return Q(r, 'Yan yana dizilen üçgenlerle yapılan örüntüde 1 üçgen için 3, 2 üçgen için 5, 3 üçgen için 7 çöp kullanılıyor. ' + n + ' üçgen için kaç çöp gerekir?', N(2 * n + 1), [N(2 * n), N(3 * n), N(2 * n + 2)], 'Kural: 2n + 1 → ' + (2 * n + 1)); },
      function (r) { var n = r.int(5, 15); return Q(r, 'Yan yana dizilen karelerle yapılan örüntüde 1 kare için 4, 2 kare için 7, 3 kare için 10 çöp gerekir. ' + n + ' kare için kaç çöp gerekir?', N(3 * n + 1), [N(4 * n), N(3 * n), N(3 * n + 4)], 'Kural: 3n + 1 → ' + (3 * n + 1)); },
      function (r) { var k = r.pick([5, 6, 7, 8, 9, 10, 12]); return Q(r, 'Kenar sayısı ' + k + ' olan bir çokgenin iç açıları toplamı kaç derecedir?', (k - 2) * 180 + '°', [k * 180 + '°', (k - 1) * 180 + '°', (k - 2) * 90 + '°'], '(' + k + ' − 2)·180° = ' + (k - 2) * 180 + '°'); },
      function (r) { var k = r.pick([5, 6, 8, 9, 10, 12]); var v = (k - 2) * 180 / k; return Q(r, 'Düzgün ' + k + 'gende bir iç açının ölçüsü kaç derecedir?', N(v) + '°', [N((k - 2) * 180) + '°', N(360 / k) + '°', N(v + 10) + '°'], '(' + k + ' − 2)·180° ÷ ' + k + ' = ' + N(v) + '°'); },
      function (r) { var k = r.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20]); return Q(r, 'Düzgün ' + k + ' kenarlı çokgenin bir dış açısı kaç derecedir?', N(360 / k) + '°', [N(180 / k) + '°', N(180 - 360 / k) + '°', N(360 / k + 10) + '°'], '360° ÷ ' + k + ' = ' + N(360 / k) + '°'); },
      function (r) { var k = r.pick([5, 6, 8, 9, 10, 12, 15, 18]); return Q(r, 'Bir dış açısı ' + N(360 / k) + '° olan düzgün çokgenin kenar sayısı kaçtır?', k, [k + 1, k - 1, k * 2], '360° ÷ ' + N(360 / k) + '° = ' + k); },
      function (r) { var k = r.pick([6, 7, 8, 9, 10]); return Q(r, 'İç açıları toplamı ' + (k - 2) * 180 + '° olan çokgen kaç kenarlıdır?', k, [k + 1, k - 1, k + 2], '(n − 2)·180° = ' + (k - 2) * 180 + '° → n − 2 = ' + (k - 2) + ' → n = ' + k); }
    ]
  });

  // ============ HAFTA 7 ============
  WEEKS.push({
    tema: 2, no: 11, title: 'Cebirsel İfadeler İçeren Algoritmalar', hours: 4, code: 'MAT.6.2.3 (a, b, c)',
    outcomes: ['Cebirsel ifadeler içeren durumlardaki algoritmik yapıyı inceler.', 'Algoritmik yapıyı tablo temsiline veya cebirsel ifadelere dönüştürür.', 'Algoritmik yapının içerdiği matematiksel ilişkileri sözel olarak ifade eder.'],
    lesson: [
      { h: 'Algoritma Nedir?', html: '<p><b>Algoritma</b>, bir problemi çözmek için izlenen, adım adım ve sırası belli işlemler dizisidir. Yemek tarifi, oyun kuralları, telefon uygulamaları birer algoritmadır.</p>' },
      { h: 'Üç Gösterim Biçimi', html: '<table class="tbl"><thead><tr><th>Doğal dil</th><th>Sözde kod</th><th>Akış şeması</th></tr></thead><tbody><tr><td>1) Bir sayı al. 2) 3 ile çarp. 3) 2 ekle. 4) Sonucu yaz.</td><td>BAŞLA<br>n ← GİRDİ<br>s ← 3·n + 2<br>YAZ s<br>BİTİR</td><td>(Başla) → [n al] → [s = 3n + 2] → [s yaz] → (Bitir)</td></tr></tbody></table><p>Bu algoritma <b>3n + 2</b> cebirsel ifadesine karşılık gelir.</p>' },
      { h: 'Tabloya ve İfadeye Dönüştürme', html: '<table class="tbl"><thead><tr><th>Girdi (n)</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td>Çıktı (3n + 2)</td><td>5</td><td>8</td><td>11</td><td>14</td></tr></tbody></table><p>Bu çıktılar <b>5, 8, 11, 14, …</b> örüntüsünü oluşturur: algoritma ile örüntü aynı yapıdır!</p>' },
      { h: 'Algoritma Değiştirme ve Hata Bulma', html: '<div class="box ex"><b>Değişiklik:</b> 3·n + 2 yerine 3·n + 5 yazarsak her çıktı <b>3 artar</b>.<br><b>Hatalı algoritma:</b> “n ile 3’ü topla, sonra 2 ile çarp” diye anlatılan 3n + 2 hatalıdır: bu 2(n + 3) olur.</div>' },
      { h: 'Etkinlik', html: '<p><b>Robot oyunu:</b> Bir öğrenci robot olur; arkadaşı “bir sayı al, 2 ile çarp, 1 çıkar” talimatı verir. Robot yanlış yorumlayınca hatayı beraber bulun. Ardından algoritmanın ifadesini yazın. <i>İsteğe bağlı:</i> Fibonacci veya Collatz algoritmalarını araştırın.</p>' }
    ],
    makers: [
      function (r) { var a = r.int(2, 6), b = r.int(1, 9), n = r.int(3, 12); return Q(r, 'Algoritma: 1) Bir n sayısı al. 2) ' + a + ' ile çarp. 3) Sonuca ' + b + ' ekle. 4) Sonucu yaz.<br>n = ' + n + ' için yazılan sayı kaçtır?', N(a * n + b), [N(a * (n + b)), N(a + n + b), N(a * n)], a + '·' + n + ' + ' + b + ' = ' + (a * n + b)); },
      function (r) { var a = r.int(2, 6), b = r.int(1, 9); return Q(r, 'Algoritma: 1) Bir n sayısı al. 2) ' + b + ' ekle. 3) Sonucu ' + a + ' ile çarp. 4) Sonucu yaz.<br>Bu algoritmaya karşılık gelen cebirsel ifade hangisidir?', a + '(n + ' + b + ')', [a + 'n + ' + b, a + ' + n + ' + b, a + 'n·' + b], 'Önce toplama (parantez), sonra çarpma.'); },
      function (r) { var s = r.int(1, 9), d = r.int(2, 6), k = r.int(3, 5); return Q(r, 'Sözde kod:<br><code>sayı ← ' + s + '<br>' + k + ' KEZ TEKRARLA: sayı ← sayı + ' + d + '<br>YAZ sayı</code><br>Yazdırılan sayı kaçtır?', N(s + k * d), [N(s + (k - 1) * d), N(s + (k + 1) * d), N(k * d)], 'Başlangıç ' + s + '; her tekrarda ' + d + ' eklenir: ' + s + ' + ' + k + '·' + d + ' = ' + (s + k * d)); },
      function (r) { var a = r.int(2, 6), b = r.int(1, 5); return Q(r, 'Bir algoritmanın girdi-çıktı tablosu verilmiştir. Algoritmanın cebirsel ifadesi hangisidir?<br>' + MC.table(['Girdi (n)', '1', '2', '3', '4'], [['Çıktı', a + b, 2 * a + b, 3 * a + b, 4 * a + b]]), a + 'n + ' + b, [(a + b) + 'n', a + 'n − ' + b, b + 'n + ' + a], 'Çıktı ' + a + ' şer artıyor; n=1 için ' + (a + b) + '.'); },
      function (r) { var a = r.int(2, 6), b = r.int(1, 5), c = r.int(2, 5); return Q(r, 'Bir algoritma n sayısını alıp ' + a + 'n + ' + b + ' değerini yazdırıyor. Algoritmada ' + b + ' yerine ' + (b + c) + ' yazılırsa her çıktı nasıl değişir?', c + ' artar', [c + ' azalır', a * c + ' artar', 'Değişmez'], 'Sabit terim ' + c + ' büyüdü; her çıktı ' + c + ' artar.'); },
      function (r) { var a = r.int(2, 6), b = r.int(1, 5); return Q(r, 'Şu algoritma yanlış anlatılmıştır: “Bir n sayısı al, ' + b + ' ile topla, sonra ' + a + ' ile çarp.” Bu algoritma aşağıdakilerden hangisini <b>göstermez</b>?', a + 'n + ' + b, [a + '(n + ' + b + ')', a + 'n + ' + a * b, a + '·(' + b + ' + n)'], 'Anlatım a(n + b) ifadesidir; ' + a + 'n + ' + b + ' farklıdır.'); },
      function (r) { var a = r.int(2, 5), b = r.int(0, 5), n = r.int(10, 20), t = []; for (var i = 1; i <= 4; i++) t.push(a * i + b); return Q(r, 'Algoritmanın çıktıları 1, 2, 3, 4 girdileri için sırasıyla ' + t.join(', ') + ' ise girdi ' + n + ' iken çıktı kaç olur?', N(a * n + b), [N(a * n), N(a * n + b + a), N((a + b) * n)], 'Kural: ' + a + 'n + ' + b + '.'); }
    ]
  });
})();
