# 6. ve 7. Sınıf Matematik

Konu anlatımı, testler, oyunlar, sınav/çalışma kâğıtları, hata defteri, öğrenci raporu ve öğretmen paneli.

## İki çalışma biçimi
1. **Sadece statik site** (GitHub Pages vb.): `index.html` yeterli. Sonuçlar ve hata defteri tarayıcıda (bu cihazda) saklanır; öğrenci girişi/öğretmen paneli kapalıdır.
2. **Sunucu ile (veri tabanlı):** `node server.js` (Node 22+, ek paket gerekmez). Statik dosyaları da sunar. Veriler `data/app.db` (SQLite) içinde tutulur.

### Sunucuyu başlatma
```
TEACHER_PASSWORD=sifreniz PORT=8080 node server.js
```
`TEACHER_PASSWORD` verilmezse ilk açılışta rastgele bir şifre üretilir ve **bir kez** konsola yazılır.
Tarayıcıdan `http://localhost:8080` → üstte **Öğretmen** → şifre → öğrenci ekle (erişim kodu otomatik üretilir) → ödev ata.
Öğrenci: **Öğrenci Girişi** → erişim kodu → ödevleri çözer, sonuçlar veri tabanına yazılır, **Raporum** ve **Hata Defterim** sayfalarını görür.

### Siteyi GitHub Pages'te, sunucuyu ayrı yerde çalıştırmak
`config.js` içindeki `window.APP_API` değerine sunucu adresini yazın (ör. `https://sunucum.example.com`).

### Dikkat
- Sunucu çocukların adını ve sonuçlarını saklar: HTTPS ile yayınlayın, ad yerine ilk ad/rumuz kullanın, veli/okul izni alın (KVKK).
- `data/` klasörü kalıcı bir diskte olmalı ve yedeklenmelidir (`DATA_DIR` ile değiştirilebilir). Ücretsiz bulut servislerinin çoğunda disk silinebilir.
- Erişim kodları gizli bilgidir; öğretmen panelinden yenilenebilir.
