# Sıralı UI/UX çalışma listesi

25 Ekim 2026. Kullanıcı açık işlerin sıra atlanmadan sürdürülmesini istedi. Bu liste tasarım/prototip teslimini izler; gerçek Auth/API kaydı veya işletim kabulü değildir.

Durumlar: **Hazır** yerel etkileşim ve doğrulaması mevcut; **Karar/entegrasyon bekliyor** kesinleştirilemeyen bağımlılık. Bir formun hazır olması gerçek işlemin yapılabildiği anlamına gelmez.

| Sıra | İş | Durum |
|---|---|---|
| A1 | Günlük/takvim, arama, mobil ayrıntı/liste dönüşü | Hazır |
| A2 | Rezervasyon öğrenci/hak/tür, iptal isteği | Hazır |
| A3 | Yoklama seçim/özet, gerekçeli kapanış düzeltme | Hazır |
| A4 | Saat/salon değişikliği, tekil/seri kapsamı | Hazır |
| A5 | Sonlu program oluşturma isteği ve kontroller | Kısmi hazır: tarih/gün/saat/salon taslağı doğrulandı; kapasite A7 ve gerçek oluşumlar A8 bekleniyor |
| A6 | Bekleme listesi ve süreli yer teklifinin ayrımı | Hazır |
| A7 | Yeni kapasite toplam/erkek-kadın ile nominal/azami eşlemesi | Karar/entegrasyon bekliyor: kullanıcı yeni sözleşmede netleştirecek |
| A8 | Gerçek kapasite/çakışma/hak/hakediş önizleme, kayıt ve stale/replay kabulü | Karar/entegrasyon bekliyor: Auth/API bağlı değil |
| B1 | Paket satış öğrenci/tarih/istek özeti | Hazır |
| B2 | Tahsilat borç/tutar/zaman/açıklama ve hassas kuruş girişi | Hazır |
| B3 | Tahsilat fark düzeltmesi, iade/mahsup ayrımı | Hazır |
| B4 | Gerçek satış etkisi, tahsilat dağıtımı ve makbuz | Karar/entegrasyon bekliyor |
| C1 | Kişi oluşturma/düzenleme ve hesap ayrımı | Hazır |
| C2 | Öğrenci ilişkisi ve güvenli bağlantı açıklamaları | Hazır |
| C3 | Aday görüşme/takip ve dönüşüm isteği | Hazır |
| C4 | Gerçek güvenli davet, kimlik eşlemesi ve birleştirme kabulü | Karar/entegrasyon bekliyor |
| D1 | Etkinlik hazırlık/kesin kayıt/iptal ayrımı | Hazır |
| D2 | Belge sürümü/yayımlama ve kişisel kabul ayrımı | Hazır |
| D3 | Rapor hazırlama/dosya/erişim yaşam döngüsü | Hazır |
| D4 | Liste/ayrıntı dönüşü, klavye ve dar ekran ortak tutarlılığı | Yerel kapsam hazır; gerçek cursor sayfalama, büyük veri ve kapsamlı erişilebilirlik kabulü entegrasyonda |
| E1 | Kesin marka, font kataloğu, logo | Karar/entegrasyon bekliyor |
| E2 | Dil listesi, çeviriler ve i18n kütüphanesi | Kullanıcı kararı bekliyor |
| E3 | Giriş/kurtarma/iletişim/oturumlar ve kalıcı tercih senkronizasyonu | Karar/entegrasyon bekliyor: settings/sağlayıcı eşlemesi açık |
| E4 | Ayrı öğrenci/eğitmen kabukları, public başvuru/import, tam abonelik/rol/otomasyon yönetimi | Tasarım kapsamı ve rol/alan eşlemesi bekliyor |

İlk üç grup kullanıcı tarafından bu sırayla kabul edildi. Kararı açık işleri tamamlanmış göstermeden bağımsız frontend tasarımları ilerletilir. Kapasite veya henüz seçilmemiş sağlayıcı/dil/marka için yeni varsayılan üretilmez.

## Son kontrol ve kalan bağımlılıklar

- Production build, typecheck, 86 Playwright ve 5 Vitest testi başarılı. Yedi yeni işlem paneli 390px/1440px ekran görüntülerinde incelendi; diyalog yatay taşması görülmedi.
- A–D satırlarında hazır ifadesi yalnız sentetik verili, kayıt yapmayan yerel taslağı kapsar. Gerçek sonuç, yetki, eşzamanlı değişiklik, tekrar deneme ve belirsiz sonuç kabulü A8/B4/C4 kapsamındadır.
- Kişi düzenleme mevcut/önerilen adla sınırlı; tam iletişim projeksiyonu alınmadan alanların üzerine yazılmaz. Birleştirme yönü ve davet incelemesi gerçek onay, kimlik bağı veya e-posta göndermez.
- D2 dosya adı gösterir; yükleme/içerik okuma yapmaz. D3 yerel iş durumu senaryolarıdır; gerçek dosya indirmez.
- Sonraki bağımlılıklar sırasıyla A7/A8, B4, C4 ve E1–E4. Açık kararların yerine yeni ürün kuralı üretilmedi. Çalışma henüz commit/push edilmedi.
