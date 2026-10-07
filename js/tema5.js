/* 5. TEMA: İstatistiksel Araştırma Süreci (24 ders saati) — Hafta 19-23 */
(function () {
  'use strict';
  var N = MC.num, Q = MC.Q;
  TEMAS.push({ id: 5, title: 'İstatistiksel Araştırma Süreci', hours: 24, color: '#0984e3',
    summary: 'Araştırma sorusu, veri toplama, kök-yaprak ve nokta grafiği, aritmetik ortalama, ortanca, tepe değer, açıklık, başkalarının yorumlarını değerlendirme.' });

  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function sorted(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function median(a) { var s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  function mode(a) { var c = {}; a.forEach(function (x) { c[x] = (c[x] || 0) + 1; }); var best = -1, bv = null, uniq = true; Object.keys(c).forEach(function (k) { if (c[k] > best) { best = c[k]; bv = +k; uniq = true; } else if (c[k] === best) uniq = false; }); return uniq ? bv : null; }
  // tek tepe değerli rastgele veri
  function dataSet(r, n, lo, hi) {
    for (var t = 0; t < 200; t++) {
      var a = []; for (var i = 0; i < n; i++) a.push(r.int(lo, hi));
      var m = mode(a); if (m !== null) { var c = a.filter(function (x) { return x === m; }).length; if (c >= 2) return a; }
    }
    return [lo + 2, lo + 2, lo + 3, lo + 4, lo + 5, lo + 1, lo].slice(0, n);
  }

  // ============ HAFTA 19 ============
  var KATEGORIK = ['En sevdiğin spor dalı', 'Gözlerinin rengi', 'Okula geliş şekli', 'En sevdiğin meyve', 'Doğduğun şehir', 'Favori renk', 'Sevdiğin ders'];
  var NICEL = ['Kardeş sayısı', 'Bir haftada okuduğun kitap sayısı', 'Ayakkabı numarası', 'Evdeki oda sayısı', 'Bir günde içilen su bardağı sayısı', 'Sınıfındaki öğrenci sayısı'];
  WEEKS.push({
    tema: 5, no: 23, title: 'Araştırma Sorusu ve Veri Toplama', hours: 5, code: 'MAT.6.5.1 (a, b, c, ç)',
    outcomes: ['Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren durumları fark eder.', 'Betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.', 'Veriye ulaşmak için plan yapar; anket sorularıyla veri toplar veya hazır veriye ulaşır.'],
    lesson: [
      { h: 'İstatistik Neden Gerekli?', html: '<p>“Okulumuzda en çok hangi spor sevilir?”, “Öğrenciler günde kaç saat uyuyor?” gibi soruların cevabı tahminle değil <b>veriyle</b> bulunur. İstatistiksel araştırma bu işin sistemli yoludur.</p>' },
      { h: 'Veri Türleri', html: '<table class="tbl"><thead><tr><th>Tür</th><th>Açıklama</th><th>Örnek</th></tr></thead><tbody><tr><td><b>Kategorik veri</b></td><td>Gruplara/kategorilere ayrılır, sayılamaz-ölçülemez</td><td>Favori renk, spor dalı, göz rengi</td></tr><tr><td><b>Nicel (kesikli) veri</b></td><td>Sayılarla ifade edilir, sayarak bulunur</td><td>Kardeş sayısı, okunan kitap sayısı</td></tr></tbody></table>' },
      { h: 'Araştırma Süreci', html: '<ol><li><b>Soru oluştur:</b> Net, tek anlamlı, yanıtlanabilir bir soru. Örn. “6. sınıf öğrencilerinin sevdiği spor dalları nelerdir?” (<b>betimleme</b>) / “Kızlar mı erkekler mi daha çok kitap okuyor?” (<b>karşılaştırma</b>)</li><li><b>Plan yap:</b> Kimden, nasıl, ne kadar veri toplanacak?</li><li><b>Veri topla:</b> Anket, gözlem, ölçme veya hazır veri (TÜİK, MEB).</li><li><b>Düzenle ve göster:</b> Tablo, grafik.</li><li><b>Özetle ve yorumla:</b> Ortalama, ortanca vb.</li><li><b>Yeniden değerlendir:</b> Soru cevaplandı mı?</li></ol>' },
      { h: 'İyi Anket Sorusu', html: '<ul><li>Anlaşılır, kısa, <b>yönlendirmeyen</b> olmalı. (“Herkesin sevdiği futbol mu yoksa…?” kötü örnek.)</li><li>Tek konuyu sormalı.</li><li><b>Örneklem</b> farklı grupları temsil etmeli (sadece basketbol takımına “en sevdiğin spor?” diye sormak yanlıdır).</li></ul>' },
      { h: 'Etkinlik', html: '<p>Sınıfta mini anket yapın: Her grup bir araştırma sorusu yazsın, akran değerlendirme formuyla diğer gruplar değerlendirsin.</p>' }
    ],
    makers: [
      function (r) { var c = r.pick(KATEGORIK), n = r.sample(NICEL, 3); return Q(r, 'Aşağıdakilerden hangisi <b>kategorik</b> veridir?', c, n, 'Kategorik veri gruplara ayrılır, sayıyla ölçülmez.'); },
      function (r) { var n = r.pick(NICEL), c = r.sample(KATEGORIK, 3); return Q(r, 'Aşağıdakilerden hangisi <b>nicel (kesikli)</b> veridir?', n, c, 'Sayarak bulunan sayısal veridir.'); },
      function (r) { var cs = [['6. sınıf öğrencilerinin en çok sevdiği meyveler nelerdir?', 'betimleme'], ['Hangi sınıf seviyesinde öğrenciler günde daha çok kitap okuyor?', 'karşılaştırma'], ['Sınıfımızdaki öğrencilerin kardeş sayısı nasıl dağılıyor?', 'betimleme'], ['Kızların mı erkeklerin mi ortalama ayakkabı numarası daha büyüktür?', 'karşılaştırma']]; var c = r.pick(cs); return Q(r, '“' + c[0] + '” sorusu nasıl bir araştırma sorusudur?', c[1].charAt(0).toUpperCase() + c[1].slice(1) + ' sorusu', [c[1] === 'betimleme' ? 'Karşılaştırma sorusu' : 'Betimleme sorusu', 'Tahmin sorusu', 'Cevabı olmayan soru'], c[1] === 'betimleme' ? 'Tek bir grubu tanıtır.' : 'İki grubu karşılaştırır.'); },
      function (r) { var bad = ['Herkesin sevdiği basketbolu mu yoksa sıkıcı olan yüzmeyi mi seversin?', 'Sen de en güzel olan mavi rengi seviyorsun, değil mi?']; var good = ['En sevdiğin spor dalı nedir?', 'Haftada kaç kitap okursun?', 'Okula nasıl geliyorsun?']; return Q(r, 'Aşağıdaki anket sorularından hangisi <b>yönlendirici olduğu için</b> uygun değildir?', r.pick(bad), r.sample(good, 3), 'Yönlendirmeyen, tarafsız sorular sorulmalıdır.'); },
      function (r) { var cs = [['Okul genelinde en sevilen sporu bulmak için yalnızca basketbol takımındaki öğrencilere sormak', 'Örneklem sadece belli bir grubu temsil ettiği için yanlıdır'], ['Sınıftaki tüm öğrencilerin kardeş sayısını sormak', 'Sınıfı temsil eder'], ['Okul genelinde bütün sınıflardan rastgele öğrencilere sormak', 'Okulu temsil eder']]; var c = cs[0]; var ok = [cs[1][0], cs[2][0]]; return Q(r, 'Aşağıdaki veri toplama yöntemlerinden hangisi <b>yanlı sonuç</b> verebilir?', c[0], ['Okuldaki farklı sınıflardan rastgele seçilen öğrencilere anket uygulamak', 'Tüm sınıfa anket uygulamak', 'Her sınıftan eşit sayıda öğrenciye anket uygulamak'], c[1] + '.'); },
      function (r) { var a = r.int(3, 9), b = r.int(4, 12), c = r.int(2, 8), d = r.int(5, 11); var names = ['Futbol', 'Basketbol', 'Voleybol', 'Yüzme']; var v = [a, b, c, d]; var mx = v.indexOf(Math.max.apply(null, v)); var cnt = 0; v.forEach(function (x) { if (x === v[mx]) cnt++; }); if (cnt > 1) { v[mx] += 3; } mx = v.indexOf(Math.max.apply(null, v)); return Q(r, 'Tabloda sınıftaki öğrencilerin en sevdiği spor dalları verilmiştir. En çok tercih edilen spor dalı hangisidir?<br>' + MC.table(['Spor dalı'].concat(names), [['Öğrenci sayısı'].concat(v)]), names[mx], names.filter(function (x, i) { return i !== mx; }), 'En büyük değer ' + v[mx] + ' öğrenci ile ' + names[mx] + '.'); }
    ]
  });

  // ============ HAFTA 20 ============
  WEEKS.push({
    tema: 5, no: 24, title: 'Veri Görselleştirme: Kök-Yaprak ve Nokta Grafiği', hours: 5, code: 'MAT.6.5.1 (d, e)',
    outcomes: ['Veri görselleştirme araçlarını (kök-yaprak gösterimi, nokta grafiği) seçme gerekçelerini belirtir.', 'Toplanan veriyi uygun araçlarla analiz eder.'],
    lesson: [
      { h: 'Nokta Grafiği', html: '<p>Az sayıda farklı değer alan nicel verilerde kullanılır. Her veri bir nokta ile gösterilir; aynı değerler üst üste dizilir.</p>' + MC.dotPlot([1, 2, 2, 3, 3, 3, 4, 4, 6], 0, 7) + '<p>Grafikte 3 değerinin üzerinde 3 nokta var → 3 değeri üç kez tekrar etmiş. <b>En yüksek nokta kümesi</b> en sık görülen değerdir.</p>' },
      { h: 'Kök-Yaprak Gösterimi', html: '<p>İki basamaklı (geniş aralıklı) verilerde kullanılır. Onlar basamağı <b>kök</b>, birler basamağı <b>yaprak</b> olur.</p><p>Veri: 12, 15, 21, 23, 23, 28, 34, 36, 41</p>' + MC.stemLeaf([12, 15, 21, 23, 23, 28, 34, 36, 41]) + '<div class="box tip"><b>Okuma:</b> Kök 2, yaprak 3 → <b>23</b>. Yapraklar küçükten büyüğe sıralanır. Kök-yaprak gösteriminde tüm veri değerleri görülür ve dağılımın şekli bellidir.</div>' },
      { h: 'Hangisini Seçmeliyim?', html: '<table class="tbl"><thead><tr><th>Veri durumu</th><th>Uygun gösterim</th></tr></thead><tbody><tr><td>0–10 gibi küçük aralıkta tamsayılar (kardeş sayısı)</td><td>Nokta grafiği</td></tr><tr><td>Geniş aralıkta, iki basamaklı sayılar (boy, puan)</td><td>Kök-yaprak</td></tr></tbody></table>' },
      { h: 'Dağılımı Yorumlama', html: '<p>Dağılımın <b>merkezi</b> (değerlerin yoğunlaştığı yer) ve <b>yayılımı</b> (değerlerin ne kadar geniş dağıldığı) hakkında konuşuruz. Veride bir uç değer varsa grafikte hemen görünür.</p>' }
    ],
    makers: [
      function (r) { var d = []; var n = r.int(10, 14); for (var i = 0; i < n; i++) d.push(r.int(11, 58)); var s = sorted(d); var big = r.pick(s); return Q(r, 'Aşağıdaki kök-yaprak gösteriminde kaç veri vardır?<br>' + MC.stemLeaf(d), n, [n - 1, n + 1, n + 2], 'Yaprakların toplam sayısı veri sayısıdır: ' + n); },
      function (r) { var st = r.int(1, 4), lf = r.int(0, 9); var d = [st * 10 + lf, st * 10 + 1, (st + 1) * 10 + 5, (st + 2) * 10 + 2, (st + 2) * 10 + 7]; return Q(r, 'Bir kök-yaprak gösteriminde kök ' + st + ', yaprak ' + lf + ' ise bu hangi değeri gösterir?', st * 10 + lf, [st + lf, lf * 10 + st, st * 10 + lf + 10], 'Kök onlar basamağı, yaprak birler basamağı: ' + (st * 10 + lf)); },
      function (r) { var d = []; var n = r.int(11, 15); for (var i = 0; i < n; i++) d.push(r.int(12, 55)); var lim = r.pick([20, 30, 40]); var cnt = d.filter(function (x) { return x > lim; }).length; return Q(r, 'Kök-yaprak gösterimine göre ' + lim + '’den büyük kaç veri vardır?<br>' + MC.stemLeaf(d), cnt, [cnt + 1, cnt - 1 >= 0 ? cnt - 1 : cnt + 3, cnt + 2], lim + '’den büyük olan yaprakları say: ' + cnt); },
      function (r) { var d = dataSet(r, r.int(9, 12), 1, 7); var m = mode(d); return Q(r, 'Nokta grafiğine göre en sık görülen değer kaçtır?<br>' + MC.dotPlot(d, 1, 7), m, [m + 1 <= 7 ? m + 1 : m - 2, m - 1 >= 1 ? m - 1 : m + 2, m + 2 <= 7 ? m + 2 : m - 3], 'En fazla noktaya sahip değer ' + m); },
      function (r) { var d = dataSet(r, r.int(9, 12), 1, 7); var m = mode(d); var c = d.filter(function (x) { return x === m; }).length; return Q(r, 'Nokta grafiğine göre ' + m + ' değeri kaç kez görülmüştür?<br>' + MC.dotPlot(d, 1, 7), c, [c + 1, c + 2, c - 1 >= 1 ? c - 1 : c + 3], m + ' değerinin üzerindeki noktaları say: ' + c); },
      function (r) { var v = [{ q: 'Bir sınıftaki öğrencilerin kardeş sayıları (0-5 arası)', a: 'Nokta grafiği' }, { q: 'Öğrencilerin deneme sınavı puanları (20-95 arasında)', a: 'Kök-yaprak gösterimi' }]; var c = r.pick(v); return Q(r, c.q + ' hangi gösterimle daha uygun şekilde gösterilir?', c.a, [c.a === 'Nokta grafiği' ? 'Kök-yaprak gösterimi' : 'Nokta grafiği', 'Daire grafiği', 'Hiçbiri'], c.a === 'Nokta grafiği' ? 'Az sayıda farklı değer varsa nokta grafiği kullanılır.' : 'Geniş aralıkta iki basamaklı veride kök-yaprak uygundur.'); },
      function (r) { var d = []; for (var i = 0; i < 12; i++) d.push(r.int(15, 58)); var s = sorted(d); var rg = s[s.length - 1] - s[0]; return Q(r, 'Kök-yaprak gösteriminden en büyük ve en küçük değer arasındaki fark (açıklık) kaçtır?<br>' + MC.stemLeaf(d), rg, [rg + 1, rg + 2, rg - 1], 'En büyük ' + s[s.length - 1] + ' − en küçük ' + s[0] + ' = ' + rg); }
    ]
  });

  // ============ HAFTA 21 ============
  WEEKS.push({
    tema: 5, no: 25, title: 'Aritmetik Ortalama', hours: 5, code: 'MAT.6.5.1 (d, e, f)',
    outcomes: ['Veri özetleme araçlarından aritmetik ortalamayı seçme gerekçesini belirtir ve analiz eder.', 'Sonuçlara yönelik gerekçeler sunar.'],
    lesson: [
      { h: 'Adil Paylaşım Fikri', html: '<div class="box idea"><b>Etkinlik:</b> 4 arkadaşın bilyeleri: 3, 5, 7, 9. Bilyeleri toplayıp eşit paylaştırırsak herkese kaç bilye düşer? Toplam 24 → 24 ÷ 4 = <b>6</b>. İşte bu 6 sayısı <b>aritmetik ortalamadır</b>.</div>' },
      { h: 'Tanım', html: '<div class="box def"><b>Aritmetik ortalama = Verilerin toplamı ÷ Veri sayısı</b></div><div class="box ex"><b>Örnek:</b> Matematik notları 70, 80, 90, 100, 60 → toplam 400, 5 sınav → ortalama 400 ÷ 5 = <b>80</b>.</div>' },
      { h: 'Özellikleri', html: '<ul><li>Ortalama, en küçük ve en büyük değerin <b>arasındadır</b>.</li><li>Ortalamanın verilerden biri olması gerekmez.</li><li><b>Uç değerler</b> (çok büyük/çok küçük) ortalamayı çok etkiler.</li><li>Toplam = Ortalama × Veri sayısı</li></ul>' },
      { h: 'Çözümlü Örnek', html: '<div class="box ex">4 sınavın ortalaması 80. 5. sınavdan kaç alırsa ortalama 82 olur?<br>4 sınavın toplamı: 4 · 80 = 320. İstenen 5 sınav toplamı: 5 · 82 = 410. 5. sınav: 410 − 320 = <b>90</b>.</div>' }
    ],
    makers: [
      function (r) { var n = r.int(4, 6), m = r.int(8, 25); var d = []; for (var i = 0; i < n - 1; i++) d.push(r.int(m - 6, m + 6)); var last = m * n - sum(d); if (last < 1) { last = m; d[0] = d[0] + (m * n - sum(d) - last); } return Q(r, 'Bir öğrencinin ' + n + ' sınavdan aldığı puanlar ' + d.concat([last]).join(', ') + ' ise aritmetik ortalaması kaçtır?', m, [m + 1, m - 1, m + 2], 'Toplam ' + m * n + ' ÷ ' + n + ' = ' + m); },
      function (r) { var n = r.int(4, 6), m = r.int(60, 90); var d = []; for (var i = 0; i < n - 1; i++) d.push(r.int(m - 10, m + 10)); var last = m * n - sum(d); return Q(r, '' + n + ' sınavın ortalaması ' + m + ' dir. İlk ' + (n - 1) + ' sınavın puanları ' + d.join(', ') + ' ise son sınav kaç puandır?', last, [last + 5, last - 5, last + 10], 'Toplam ' + m * n + '; ilk ' + (n - 1) + ' sınavın toplamı ' + sum(d) + ' → ' + last); },
      function (r) { var m = r.int(10, 30), n = r.int(5, 8); return Q(r, 'Ortalaması ' + m + ' olan ' + n + ' sayının toplamı kaçtır?', m * n, [m + n, m * n + m, m * n - n], 'Toplam = Ortalama × Sayı = ' + m + ' · ' + n); },
      function (r) { var m = r.int(70, 85), n = 4, inc = r.pick([1, 2, 3]); var need = (m + inc) * (n + 1) - m * n; return Q(r, n + ' sınavın ortalaması ' + m + ' dir. Ortalamayı ' + inc + ' puan artırmak için 5. sınavdan kaç alınmalıdır?', need, [need - 5, need + 5, m + inc], '(' + (m + inc) + ' · 5) − (' + m + ' · 4) = ' + need); },
      function (r) { var a = r.int(3, 6), b = r.int(7, 12), c = r.int(2, 5); var d = [a, b, a + 2, c, b + 1]; var total = sum(d); while (total % 5 !== 0) { d[0]++; total++; } return Q(r, 'Bir takımın 5 maçta attığı goller ' + d.join(', ') + ' ise maç başına ortalama kaç gol atmıştır?', total / 5, [total / 5 + 1, total / 5 - 1, total / 5 + 2], total + ' ÷ 5 = ' + total / 5); },
      function (r) { return Q(r, 'Bir veri grubuna çok büyük bir değer eklenirse aritmetik ortalama nasıl değişir?', 'Artar', ['Azalır', 'Değişmez', 'Her zaman 0 olur'], 'Çok büyük bir değer toplamı ve ortalamayı büyütür; ortalama uç değerlerden etkilenir.'); },
      function (r) { var a = r.int(2, 9), b = r.int(10, 19); var m = (a + b) / 2; return Q(r, 'Bir veri grubunun en küçük değeri ' + a + ', en büyük değeri ' + b + ' dir. Aritmetik ortalaması aşağıdakilerden hangisi olamaz?', N(b + 3), [N(a + 1), N((a + b) / 2), N(b - 1)], 'Ortalama, en küçük ve en büyük değerin arasındadır; ' + (b + 3) + ' > ' + b + '.'); }
    ]
  });

  // ============ HAFTA 22 ============
  WEEKS.push({
    tema: 5, no: 26, title: 'Ortanca, Tepe Değer ve Açıklık', hours: 5, code: 'MAT.6.5.1 (d, e, f, g)',
    outcomes: ['Veri özetleme araçlarını (ortanca, tepe değer, açıklık) seçme gerekçelerini belirtir.', 'Dağılımın merkezi ve yayılımı hakkında sonuçlar çıkarır; araştırma sürecini değerlendirir.'],
    lesson: [
      { h: 'Merkez ve Yayılım', html: '<p>Verilerin <b>nerede toplandığını</b> (merkez) ve <b>ne kadar yayıldığını</b> söylemek için dört araç kullanırız: ortalama, ortanca, tepe değer, açıklık.</p>' },
      { h: 'Ortanca (Medyan)', html: '<div class="box def">Veriler <b>küçükten büyüğe sıralanınca ortada kalan</b> değerdir. Veri sayısı çiftse ortadaki iki değerin ortalaması alınır.</div><div class="box ex">3, 9, 5, 7, 4 → sıra: 3, 4, <b>5</b>, 7, 9 → ortanca <b>5</b>.<br>2, 4, 6, 10 → ortadaki iki değer 4 ve 6 → ortanca <b>5</b>.</div>' },
      { h: 'Tepe Değer (Mod)', html: '<div class="box def">En çok tekrar eden değerdir. Nokta grafiğinde en yüksek nokta kümesidir.</div><div class="box ex">2, 3, 3, 3, 5, 7 → tepe değer <b>3</b>.</div>' },
      { h: 'Açıklık', html: '<div class="box def"><b>Açıklık = En büyük değer − En küçük değer</b></div><div class="box ex">2, 3, 3, 3, 5, 7 → 7 − 2 = <b>5</b>.</div>' },
      { h: 'Hangisini Kullanmalı?', html: '<ul><li>Uç değer yoksa <b>ortalama</b> iyi bir merkez ölçüsüdür.</li><li>Uç değer varsa <b>ortanca</b> daha dengeli bir özetleyicidir. (Maaşlar: 1000, 1100, 1200, 1300, 10 000 → ortalama 2 920 ama ortanca 1 200.)</li><li><b>Tepe değer</b> en sık görülen durumu (kategorik veride de) anlatır.</li><li><b>Açıklık</b> verilerin ne kadar yayıldığını anlatır.</li></ul>' }
    ],
    makers: [
      function (r) { var n = r.pick([5, 7, 9]); var d = []; for (var i = 0; i < n; i++) d.push(r.int(3, 40)); return Q(r, d.join(', ') + ' veri grubunun ortancası kaçtır?', median(d), [sorted(d)[1], d[Math.floor(n / 2)] === median(d) ? d[0] + 1 : d[Math.floor(n / 2)], Math.round(sum(d) / n) === median(d) ? Math.round(sum(d) / n) + 2 : Math.round(sum(d) / n)], 'Sıralı: ' + sorted(d).join(', ') + ' → ortadaki değer ' + median(d)); },
      function (r) { var n = r.pick([4, 6, 8]); var d = []; for (var i = 0; i < n; i++) d.push(r.int(3, 30)); var s = sorted(d); var md = median(d); return Q(r, d.join(', ') + ' veri grubunun ortancası kaçtır?', N(md), [N(s[n / 2]), N(s[n / 2 - 1]), N(md + 1)], 'Sıralı: ' + s.join(', ') + '. Ortadaki iki değer ' + s[n / 2 - 1] + ' ve ' + s[n / 2] + ' → ' + N(md)); },
      function (r) { var d = dataSet(r, r.int(8, 11), 1, 9); return Q(r, d.join(', ') + ' veri grubunun tepe değeri kaçtır?', mode(d), [mode(d) + 1, mode(d) - 1 > 0 ? mode(d) - 1 : mode(d) + 2, mode(d) + 2], 'En çok tekrar eden değer ' + mode(d)); },
      function (r) { var n = r.int(6, 9); var d = []; for (var i = 0; i < n; i++) d.push(r.int(4, 48)); var s = sorted(d); return Q(r, d.join(', ') + ' veri grubunun açıklığı kaçtır?', s[n - 1] - s[0], [s[n - 1], s[n - 1] - s[0] + 2, s[n - 1] + s[0]], 'En büyük ' + s[n - 1] + ' − en küçük ' + s[0] + ' = ' + (s[n - 1] - s[0])); },
      function (r) { var c = [{ t: 'Bir mahallede evlerin fiyatları: 500 bin, 520 bin, 540 bin, 560 bin, 9 milyon TL', a: 'Ortanca' }]; return Q(r, 'Bir mahalledeki 5 evin fiyatları: 500 bin, 520 bin, 540 bin, 560 bin ve 9 milyon TL’dir. Mahallenin “tipik” ev fiyatını anlatmak için hangi özetleyici daha uygundur?', 'Ortanca; çünkü uç değerden etkilenmez', ['Aritmetik ortalama; çünkü her zaman en iyisidir', 'Açıklık; çünkü merkezi gösterir', 'Tepe değer; çünkü her zaman vardır'], 'Uç değer ortalamayı çok yükseltir; ortanca daha dengelidir.'); },
      function (r) { var base = r.int(5, 9); var d = [base, base + 1, base + 1, base + 2, base + 3, base + 1, base + 5]; var s = sorted(d); return Q(r, d.join(', ') + ' veri grubu için hangisi <b>doğrudur</b>?', 'Tepe değer ' + (base + 1) + ', açıklık 5 tir', ['Tepe değer ' + (base + 2) + ', açıklık 5 tir', 'Tepe değer ' + (base + 1) + ', açıklık 6 dır', 'Tepe değer ' + base + ', açıklık 4 tür'], 'En çok tekrar eden ' + (base + 1) + '; açıklık ' + (base + 5) + ' − ' + base + ' = 5.'); },
      function (r) { var a = r.int(2, 6); var d = [a, a + 1, a + 2, a + 3, a + 14]; return Q(r, d.join(', ') + ' veri grubunda uç değer (' + (a + 14) + ') çıkarılırsa aritmetik ortalama nasıl değişir?', 'Azalır', ['Artar', 'Değişmez', 'Ortanca artar'], 'Çok büyük değer çıkarılınca toplam ve ortalama azalır.'); }
    ]
  });

  // ============ HAFTA 23 ============
  WEEKS.push({
    tema: 5, no: 27, title: 'Başkalarının İstatistiksel Yorumlarını Değerlendirme', hours: 4, code: 'MAT.6.5.2 (a, b, c)',
    outcomes: ['Başkaları tarafından oluşturulan veriye dayalı sonuç veya yorumlara yönelik istatistiksel temellendirme yapar.', 'Hataları ve yanlılıkları tespit eder; yorumları çürütür ya da kabul eder.'],
    lesson: [
      { h: 'Eleştirel Okur Olmak', html: '<p>Haberlerde, reklamlarda, sosyal medyada grafikler ve istatistikler görüyoruz. Her söylenen doğru mu? Bu hafta <b>şüpheci ama adil</b> bir dedektif gibi olacağız.</p>' },
      { h: 'Kontrol Listesi', html: '<ol><li><b>Veri kimden toplanmış?</b> (Örneklem temsil ediyor mu? Çok mu az kişi?)</li><li><b>Soru yönlendirici mi?</b></li><li><b>Grafik dürüst mü?</b> Eksen 0’dan başlıyor mu? Ölçek eşit aralıklı mı?</li><li><b>Yorum veriye uygun mu?</b> (“Dondurma satışı arttıkça boğulma arttı → dondurma boğulmaya yol açıyor” hatalı: <b>ortak neden</b> yazdır.)</li><li><b>Özet doğru yorumlanmış mı?</b> (“Ortalama 70, herkes 70” yanlıştır.)</li></ol>' },
      { h: 'Yanıltıcı Grafik Örneği', html: '<p>Aynı veri, iki farklı grafikte: A = 52, B = 54.</p><div class="twocol"><div>' + MC.barChart(['A', 'B'], [52, 54], { base: 50, top: 55, steps: 5 }) + '<p class="note">Eksen 50’den başlıyor → B, A’nın 3 katı gibi görünüyor!</p></div><div>' + MC.barChart(['A', 'B'], [52, 54], { base: 0, top: 60, steps: 6 }) + '<p class="note">Eksen 0’dan başlıyor → fark çok küçük.</p></div></div>' },
      { h: 'Çürütme ve Kabul Etme', html: '<p>Bir iddiayı kabul veya reddetmek için <b>gerekçemiz veriden gelmeli</b>. Örnek: “Bu okulda öğrenciler en çok futbolu seviyor.” iddiası, 10 kişilik futbol takımına yapılan ankete dayanıyorsa kabul edilemez.</p>' },
      { h: 'Etkinlik', html: '<p>Gazete/internetten bir grafik bulun; hatalı veya yanıltıcı yönlerini bulup düzeltilmiş halini çizin. Sonra sınıfa sunun.</p>' }
    ],
    makers: [
      function (r) { var a = r.int(50, 70), d = r.int(1, 4); return Q(r, 'Bir mağaza, çubuk grafiği 50’den başlatarak A şubesinin satışını ' + a + ', B şubesinin satışını ' + (a + d) + ' gösteriyor ve “B’nin satışları A’nın kat kat üstünde!” diyor. Bu grafikteki hata nedir?', 'Dikey eksen 0’dan başlamadığı için fark olduğundan büyük gösteriliyor', ['Grafik çubuklu olmamalıdır', 'A şubesinin değeri hatalı yazılmıştır', 'Grafikte renk kullanılmamıştır'], 'Eksen 0’dan başlamazsa küçük farklar büyük görünür.'); },
      function (r) { var s = r.int(8, 12); return Q(r, 'Bir spor markası, “öğrencilerin çoğu bizim ayakkabıyı seviyor” iddiasını yalnızca marka mağazasından çıkan ' + s + ' kişiye sorarak yapmıştır. Bu çıkarım için ne söylenir?', 'Örneklem küçük ve yanlıdır; sonuç genellenemez', ['Kesinlikle doğrudur', 'Sadece soruyu yeniden yazmak yeterlidir', 'Hiç veri yok'], 'Seçilen kişiler tüm öğrencileri temsil etmiyor.'); },
      function (r) { return Q(r, 'Bir şehirde dondurma satışları arttıkça boğulma olayları da artıyor. “Dondurma yemek boğulmaya neden oluyor.” yorumu hakkında ne söylenir?', 'Hatalıdır; sıcak hava her ikisini de artırmış olabilir', ['Doğrudur; dondurma tehlikelidir', 'Verinin kesin sonucudur', 'Boğulma sayısı hatalı yazılmıştır'], 'İki nicelik birlikte artsa bile biri diğerinin nedeni olmayabilir.'); },
      function (r) { var m = r.int(60, 85); return Q(r, 'Bir sınıfın matematik sınavı ortalaması ' + m + ' bulunmuştur. Aşağıdaki yorumlardan hangisi <b>hatalıdır</b>?', 'Sınıftaki herkes tam olarak ' + m + ' almıştır', ['Bazı öğrenciler ' + m + '’den fazla, bazıları az almış olabilir', 'Ortalamanın ' + m + ' olması toplamın öğrenci sayısına bölünmesiyle bulunmuştur', 'En yüksek puan ' + m + '’den büyüktür veya ona eşittir'], 'Ortalama, herkesin aynı puanı aldığı anlamına gelmez.'); },
      function (r) { var a = r.int(12, 18), b = r.int(4, 9), c = r.int(3, 6); return Q(r, 'Tabloda ' + (a + b + c) + ' öğrencinin tercih ettiği etkinlikler verilmiştir. Hangi yorum <b>veriye uygundur</b>?<br>' + MC.table(['Etkinlik', 'Satranç', 'Resim', 'Müzik'], [['Öğrenci sayısı', a, b, c]]), 'Öğrencilerin çoğu satranç etkinliğini seçmiştir', ['Resim etkinliği en çok seçilmiştir', 'Müzik, satrançtan daha çok tercih edilmiştir', 'Her etkinliği aynı sayıda öğrenci seçmiştir'], 'Satranç ' + a + ' ile en yüksek değere sahip.'); },
      function (r) { return Q(r, 'Bir kişi, sınıftaki 3 arkadaşına sorup “bütün okulun %80’i yaz tatilini sevdiğini söylüyor” demiştir. Bu yorumun eksikliği hangisidir?', 'Çok az kişiye sorularak okula genelleme yapılmıştır', ['Yaz tatili sorusu yanlış yazılmıştır', 'Yüzde hesabı yapılmıştır', 'Veri kategorik değildir'], 'Küçük bir örneklemden genelleme yapılamaz.'); },
      function (r) { var m = r.int(1000, 1400); return Q(r, 'Bir şirket “çalışanlarımızın maaş ortalaması ' + N(m * 3) + ' TL” diyor, ancak çalışanların çoğunun maaşı ' + N(m) + ' TL civarında ve yönetim kurulunun maaşları çok yüksek. Bu durumda en uygun yorum hangisidir?', 'Uç değerler ortalamayı yükseltmiştir; ortanca daha doğru bir fikir verir', ['Ortalama her zaman en doğru özettir', 'Açıklık maaşları gösterir', 'Tepe değer bulunamaz'], 'Uç değerler ortalamayı yanıltıcı kılabilir.'); }
    ]
  });
})();
