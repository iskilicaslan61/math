# 6. ve 7. Sınıf Matematik

Konu anlatımı, testler, oyunlar, sınav/çalışma kâğıtları, hata defteri, öğrenci raporu ve öğretmen paneli.

## Çalışma biçimleri
1. **Sadece statik site** (GitHub Pages vb.): `index.html` yeterli. Sonuçlar ve hata defteri tarayıcıda (bu cihazda) saklanır; öğrenci girişi/öğretmen paneli kapalıdır.
2. **Sunucu + Supabase:** Node.js sunucusu öğrenci/öğretmen API'sini çalıştırır, veriler Supabase PostgreSQL'de tutulur. Sunucuyu ayrıca Node.js destekleyen bir servise dağıtın; GitHub Pages Node API'sini çalıştıramaz.
3. **Yerel geliştirme:** `DATABASE_URL` tanımlı değilse sunucu yerel `data/app.db` SQLite dosyasını kullanır.

### Sunucuyu başlatma
```
npm install
$env:DATABASE_URL = "postgresql://postgres.[project-ref]:[password]@[host]:5432/postgres?sslmode=require"
$env:TEACHER_PASSWORD = "guclu-bir-sifre"
$env:PORT = "8080"
npm start
```
`DATABASE_URL` değerini Supabase projenizin **Connect** bölümündeki PostgreSQL bağlantı dizesiyle değiştirin. Pooler kullanıyorsanız Supabase'in önerdiği pooled connection dizesini kullanın. Bağlantı dizesi ve `TEACHER_PASSWORD` gizli ortam değişkenleri olarak ayarlanmalı, kaynak koduna eklenmemelidir. Sunucu gerekli tabloları başlangıçta oluşturur; `supabase/schema.sql` aynı şemayı Supabase SQL Editor'da elle kurmak için de sağlanmıştır.

Sunucu tabloları oluşturur ve Supabase tablolarında Row Level Security'yi etkinleştirir; uygulama PostgreSQL'e sunucu tarafında bağlandığından tarayıcıya Supabase anahtarı verilmez. `TEACHER_PASSWORD` verilmezse ilk açılışta rastgele bir şifre üretilir ve **bir kez** konsola yazılır.
Tarayıcıdan sunucu adresini açın → üstte **Öğretmen** → şifre → öğrenci ekle (erişim kodu otomatik üretilir) → ödev ata.
Öğrenci: **Öğrenci Girişi** → erişim kodu → ödevleri çözer, sonuçlar veri tabanına yazılır, **Raporum** ve **Hata Defterim** sayfalarını görür.

### Haftalık erişim ve teslim
Öğretmen panelinde öğrencileri seçip **Haftalık erişim** bölümünden bir hafta açın. Öğrenci panelinde o haftanın konu anlatımı ve 10 testi görünür; 10 testi bitirince **Öğretmene gönder** ile teslim eder. İlerleme ve teslim durumu öğretmenin öğrenci raporunda görünür. Sonraki hafta için öğretmen ayrıca erişim vermelidir.

### Siteyi GitHub Pages'te, API sunucusunu ayrı yerde çalıştırmak
`config.js` içindeki `window.APP_API` değerine sunucu adresini yazın (ör. `https://sunucum.example.com`).

### Dikkat
- Sunucu çocukların adını ve sonuçlarını saklar: HTTPS ile yayınlayın, ad yerine ilk ad/rumuz kullanın, veli/okul izni alın (KVKK).
- GitHub Pages'teki ders içerikleri herkese açık statik dosyalardır. Öğrenci oturumundaki hafta kısıtlaması arayüz ve sonuç API'sinde uygulanır; içerik dosyalarını anonim ziyaretçilerden gizlemez. İçeriğe gerçek erişim gizliliği gerekiyorsa siteyi kimlik doğrulaması yapan bir sunucudan sunun.
- Supabase veritabanının yedeklerini ve erişim politikalarını Supabase projenizden yönetin. Bağlantı dizesini yalnızca sunucu tarafında saklayın; tarayıcıya veya `config.js` dosyasına koymayın.
- Erişim kodları gizli bilgidir; öğretmen panelinden yenilenebilir.
