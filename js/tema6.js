/* 6. TEMA: Veriden Olasılığa (9 ders saati) — Hafta 24-25 */
(function () {
  'use strict';
  var N = MC.num, Q = MC.Q;
  TEMAS.push({ id: 6, title: 'Veriden Olasılığa', hours: 9, color: '#d63031',
    summary: 'Deney, çıktı, göreli sıklık ve deneysel olasılık.' });
  function p2(x) { return N(Math.round(x * 100) / 100); }

  // ============ HAFTA 24 ============
  WEEKS.push({
    tema: 6, no: 24, title: 'Deney, Çıktı ve Göreli Sıklık', hours: 5, code: 'MAT.6.6.1 (a, b)',
    outcomes: ['Bir olayın olasılığı ile deneylerden elde ettiği veriyi ilişkilendirir.', 'Deneye ait tekrar sayısı ile deneyin çıktılarının göreli sıklıkları arasındaki ilişkiye yönelik çıkarım yapar.'],
    lesson: [
      { h: 'Olasılık Spektrumu', html: '<p>Bir olayın olabilirliğini “imkânsız – az olası – eşit – çok olası – kesin” çizgisinde gösterelim. Bu hafta bu tahminleri <b>deneyle</b> sayıya çevireceğiz.</p><div class="spectrum"><span>0 İmkânsız</span><span>0,25</span><span>0,5 Eşit</span><span>0,75</span><span>1 Kesin</span></div>' },
      { h: 'Temel Kavramlar', html: '<ul><li><b>Deney:</b> Sonucu önceden kesin bilinmeyen işlem (yazı-tura atmak, zar atmak).</li><li><b>Çıktı:</b> Deneyde ortaya çıkan her bir sonuç (yazı, tura; 1, 2, …, 6).</li><li><b>Göreli sıklık:</b> Bir çıktının görülme sayısının toplam tekrar sayısına oranı.</li></ul><div class="box def"><b>Göreli sıklık = Olayın görülme sayısı ÷ Deneyin tekrar sayısı</b></div>' },
      { h: 'Deney Yapalım', html: '<p>Aşağıdaki simülatörle bir madeni parayı veya zarı çok sayıda atın. Tekrar sayısı arttıkça göreli sıklığın nasıl değiştiğini izleyin.</p><div data-widget="coin"></div><div data-widget="dice"></div>' },
      { h: 'Çözümlü Örnek', html: '<div class="box ex"><b>Örnek:</b> Bir madeni para 60 kez atılıyor, 24 kez yazı geliyor. Yazı gelmesinin göreli sıklığı: 24 ÷ 60 = 2/5 = <b>0,4</b>.</div><div class="box tip"><b>Büyük sayılar:</b> Tekrar sayısı arttıkça göreli sıklık, olayın gerçek olasılığına yaklaşma eğilimindedir. 10 atışta yazı oranı 0,7 olabilir; 1000 atışta genellikle 0,5’e çok daha yakın olur.</div>' }
    ],
    makers: [
      function (r) { var n = r.pick([40, 50, 60, 80, 100]); var k = r.int(Math.floor(n * 0.3), Math.floor(n * 0.7)); return Q(r, 'Bir madeni para ' + n + ' kez atılıyor ve ' + k + ' kez yazı geliyor. Yazı gelmesinin göreli sıklığı kaçtır?', p2(k / n), [p2(n / k), p2((n - k) / n + 0.05), p2(k / (n + 10))], k + ' ÷ ' + n + ' = ' + p2(k / n)); },
      function (r) { return Q(r, 'Bir deneyin tekrar sayısı arttıkça olayın göreli sıklığı genellikle nasıl değişir?', 'Olayın gerçek olasılığına yaklaşır', ['Sürekli artar', 'Sürekli azalır', 'Hep 0 olur'], 'Büyük sayılar yasasına göre çok sayıda tekrarda göreli sıklık kararlı hale gelir.'); },
      function (r) { var k1 = r.int(6, 8), k2 = r.int(47, 53); return Q(r, 'Ali bir madeni parayı 10 kez atıp ' + k1 + ' yazı, Ayşe 100 kez atıp ' + k2 + ' yazı elde ediyor. Paranın yazı gelme olasılığını tahmin etmek için hangisinin verisi daha güvenilirdir?', 'Ayşe’nin; tekrar sayısı fazla', ['Ali’nin; sonuç daha büyük', 'İkisi de aynı', 'Hiçbiri'], 'Tekrar sayısı çok olan deney daha güvenilir bir tahmin verir.'); },
      function (r) { var cs = [['Zar atma', '6 sonucu'], ['Madeni para atma', 'yazı gelmesi'], ['Torbadan bilye çekme', 'mavi bilye çekilmesi']]; var c = r.pick(cs); return Q(r, 'Bir zar atılıyor ve üst yüzdeki sayı kaydediliyor. Bu işlem için “zar atmak” neyi ifade eder, “üstteki sayı 4” neyi ifade eder?', 'Zar atmak deneydir; üstteki sayının 4 olması bir çıktıdır', ['Zar atmak çıktıdır; 4 gelmesi deneydir', 'İkisi de deneydir', 'İkisi de göreli sıklıktır'], 'Deney yapılan işlem, çıktı da sonucudur.'); },
      function (r) { var n = r.pick([50, 60, 100, 40]); var k = r.int(5, Math.floor(n / 4)); return Q(r, 'Bir zar ' + n + ' kez atılıyor ve 6 sayısı ' + k + ' kez geliyor. 6 gelmesinin göreli sıklığı kaçtır?', p2(k / n), [p2(k / n * 6), p2((n - k) / n), p2(1 / 6)], k + ' ÷ ' + n + ' = ' + p2(k / n)); },
      function (r) { var t = r.pick([20, 40, 50]); var k = r.int(Math.floor(t * 0.6), Math.floor(t * 0.8)); var tot = r.pick([20, 25, 30, 40]); var est = Math.round(tot * k / t); return Q(r, 'Bir torbada kırmızı ve mavi toplam ' + tot + ' bilye vardır. Torbadan ' + t + ' kez (her seferinde geri koyarak) bilye çekilince ' + k + ' kez kırmızı gelmiştir. Torbada yaklaşık kaç kırmızı bilye olduğu söylenebilir?', est, [tot - est, est + 3, est - 3 > 0 ? est - 3 : est + 5], 'Göreli sıklık ' + p2(k / t) + '; ' + tot + ' · ' + p2(k / t) + ' ≈ ' + est); },
      function (r) { return Q(r, 'Bir olayın göreli sıklığı 0 ile 1 arasında bir sayıdır. Aşağıdakilerden hangisi göreli sıklık olamaz?', '1,3', ['0', '0,45', '1'], 'Olayın görülme sayısı tekrar sayısından büyük olamaz; oran 1’i geçemez.'); }
    ]
  });

  // ============ HAFTA 25 ============
  WEEKS.push({
    tema: 6, no: 25, title: 'Deneysel Olasılık ve Yorumlama', hours: 4, code: 'MAT.6.6.1 (c)',
    outcomes: ['Çıkarımlardan hareketle olasılık değerini belirlemek için göreli sıklığın kullanımına yönelik yargıda bulunur.'],
    lesson: [
      { h: 'Deneysel Olasılık', html: '<div class="box def"><b>Deneysel olasılık = Olayın meydana gelme sayısı ÷ Deneyin tekrar sayısı</b></div><p>Deneysel olasılık <b>deneyden elde edilen veriye</b> dayanır. Aynı deneyi tekrarladığımızda sonuç biraz değişebilir; ama çok tekrarla kararlı hale gelir.</p>' },
      { h: 'Olasılığın Sınırları', html: '<p>Her olayın olasılığı <b>0 ile 1 arasındadır</b> (0 ve 1 dâhil). 0: imkânsız, 1: kesin. Tüm çıktıların olasılıkları toplamı <b>1</b>’dir.</p>' },
      { h: 'Tahmin Yürütme', html: '<div class="box ex"><b>Örnek:</b> Bir spinnerın kırmızı bölgede durma olasılığı deneyle 0,25 bulunmuştur. 200 kez çevrilirse yaklaşık <b>200 · 0,25 = 50</b> kez kırmızıda durması beklenir.</div><div class="box warn"><b>Dikkat:</b> “Yazı yazı yazı yazı yazı geldi, şimdi tura gelme olasılığı yüksek” demek yanlıştır. Her atış bağımsızdır; 5 atışlık bir deney de olasılığı belirlemek için çok azdır.</div>' },
      { h: 'Simülasyon Zamanı', html: '<div data-widget="spinner"></div><p>Spinneri çok sayıda çevirin; her rengin göreli sıklığını inceleyin ve “gerçek” olasılığı tahmin edin.</p>' },
      { h: 'Performans Görevi', html: '<p>Kendi deneyinizi tasarlayın (zar, bozuk para, torbada renkli fasulye). Tahmin → deney → tablo/grafik → sonuç sunumu → akran değerlendirmesi.</p>' }
    ],
    makers: [
      function (r) { var p = r.pick([0.2, 0.25, 0.4, 0.5, 0.1]); var n = r.pick([100, 200, 400, 500]); return Q(r, 'Bir olayın deneysel olasılığı ' + N(p) + ' bulunmuştur. Deney ' + n + ' kez tekrarlanırsa olay yaklaşık kaç kez gerçekleşir?', N(p * n), [N(n - p * n), N(p * n + 10), N(n * p * 2)], n + ' · ' + N(p) + ' = ' + N(p * n)); },
      function (r) { return Q(r, 'Aşağıdakilerden hangisi bir olayın olasılığı olamaz?', '−0,2', ['0', '0,5', '1'], 'Olasılık 0 ile 1 arasındadır.'); },
      function (r) { var a = r.pick([0.2, 0.3, 0.25, 0.1]), b = r.pick([0.3, 0.4, 0.35, 0.2]); var rest = Math.round((1 - a - b) * 100) / 100; return Q(r, 'Bir spinner deneyinde kırmızı için olasılık ' + N(a) + ', mavi için ' + N(b) + ' ’dir. Diğer renkler yalnızca yeşil ve sarıdır. Yeşil ile sarının olasılıkları toplamı kaçtır?', N(rest), [N(a + b), N(1 - a), N(rest + 0.1)], 'Tüm olasılıkların toplamı 1: 1 − ' + N(a) + ' − ' + N(b) + ' = ' + N(rest)); },
      function (r) { var n = r.pick([100, 120, 150, 200]); var t = [r.int(10, 25), r.int(15, 30), r.int(10, 30)]; var rest = n - t[0] - t[1] - t[2]; var names = ['1', '2', '3']; return Q(r, 'Dört yüzlü (1, 2, 3, 4 numaralı) bir zar ' + n + ' kez atıldı. 1 geldi ' + t[0] + ', 2 geldi ' + t[1] + ', 3 geldi ' + t[2] + ' kez; geri kalan atışlarda 4 geldi. 4 gelmesinin deneysel olasılığı kaçtır?', p2(rest / n), [p2(t[0] / n), p2(rest / n + 0.1), p2(1 / 4)], '4 gelme sayısı ' + rest + '; ' + rest + ' ÷ ' + n + ' = ' + p2(rest / n)); },
      function (r) { var cs = ['Bir madeni para 5 kez atıldı ve 5’inde de yazı geldi. Bu sonuca bakarak “her zaman yazı gelir” denebilir mi?']; return Q(r, cs[0], 'Hayır; 5 atış çok az, daha çok tekrar gerekir', ['Evet; çünkü hepsi yazı geldi', 'Evet; çünkü yazı daha ağır', 'Hayır; çünkü deneyin sonucu önemsizdir'], 'Az sayıda tekrar, olasılık için güvenilir bir tahmin sağlamaz.'); },
      function (r) { var p = r.pick([0.25, 0.5, 0.2]), n = r.pick([40, 80, 100]); return Q(r, 'Bir futbolcu penaltı atışlarında deneysel olarak ' + N(p) + ' olasılıkla gol atıyor. Bu futbolcu ' + n + ' penaltı atarsa yaklaşık kaç gol bekleriz?', N(p * n), [N(n - p * n + 5), N(p * n + 10), N(p * n * 2)], n + ' · ' + N(p) + ' = ' + N(p * n)); },
      function (r) { var n = r.pick([50, 100, 200]), k = r.pick([20, 25, 40, 50]); return Q(r, n + ' tekrarlı bir deneyde bir olay ' + k + ' kez gerçekleşmiştir. Bu olayın olasılığı, deneysel olarak aşağıdakilerden hangisi gibi yazılabilir?', MC.num(k) + '/' + n, [n + '/' + k, (n - k) + '/' + k, k + '/' + (n + 10)], 'Olasılık = görülme sayısı ÷ tekrar sayısı = ' + k + '/' + n); }
    ]
  });
})();
