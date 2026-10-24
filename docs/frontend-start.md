# İlk frontend çalışması

Bu belge ilk aşamaların kaydıdır. Güncel 12 sayfalık tasarım kapsamı, sözleşme eşleştirmeleri ve doğrulama sonuçları için [tasarım kapsamına](design-coverage.md) bakın.

23 Ekim 2026, yerel macOS / Node 24.21.0. Başlangıç kaynağı: `8648f9f28efe48d2644a919ffa2861ad853c7648`; dal: `codex/frontend-start`. Değişiklikler henüz commit/push edilmedi.

## Kabul ve öneriler

Kullanıcı ilk persona/görevi **merkez yöneticisi ve günlük program** olarak seçti. Üç görsel yön aynı ekran üzerinde öneriliyor; henüz marka onayı yok.

| Yön | Renkler | Tipografi/düzen |
|---|---|---|
| Akış | Gece #101923, yüzey #15212e, sınır #304154, metin #eef3f8, mavi #a2caff | Yerel Avenir Next / Segoe UI; zaman çizgisi ve sağ ayrıntı |
| Sahne | Mürdüm #221b29, yüzey #2b2233, sınır #58465e, metin #faf1e7, şampanya #ecd3a8 | Başlıklarda Iowan / Palatino; editoryal program |
| Atölye | Petrol #102526, yüzey #163031, sınır #365556, metin #edf7f2, kayısı #f2bc9c | Sans tipografi; kompakt ders satırları |

Tasarım öncesi değerlendirmede tekrarlanan istatistik kartları yerine program ana odak seçildi. Hizalama okuma yönünü izler. Üstteki sayaç görünen derslerin sayısıdır.

```text
Gezinme | Tarih ve günlük program
        | Gün seçimi / arama
        | Salon filtresi    | Seçilen ders
        | Zaman çizelgesi   | Eğitmen, saat, kontenjan
```

Mobilde ayrıntı programın altına geçer. CSS logical properties kullanılır; RTL testi yalnız yerleşimi değiştirir. Diller/i18n kütüphanesi ve tip güvenli çeviri katalogları sonraki iştir. Sunum fixture'ları backend DTO veya API mock'u değildir.

## Kurulum

İstenen kesin sürümler npm registry üzerinden doğrulanıp lockfile'a alındı: turbo 2.11.10, Next 16.4.2, pnpm 12.15.0, TypeScript 7.0.2, Tailwind 4.3.3, Playwright 1.64.1, Vitest 5.0.5. React/react-dom 19.3.1 seçildi; Next peer aralığı ve Node 24 ile uyumlu. i18next 26.5.6 varlığı doğrulandı, kütüphane kararı açık olduğundan kurulmadı.

Turbopack CSS derlemesinde alt süreç/yerel port açma EPERM hatası verdi. Next'in aynı sürümünde Webpack başarılı; dev/build bu seçeneği kullanır. Radix/shadcn/Motion eklenmedi.

## Doğrulama

- Workspace typecheck: iki paket başarılı.
- Vitest: iki test; tarih/salon/Türkçe arama birleşimi ve boş sonuç izolasyonu.
- Playwright Chromium: iki akış; ders arama/filtreleme/ayrıntı/gün/boş durum ve 390px mobil tema/RTL/taşma kontrolü.
- Next production build (Webpack): başarılı, `/` statik oluşturuldu.
- Masaüstü ve mobil gerçek tarayıcı ekran görüntüleriyle görsel kontrol.

Kanıtlar yalnız sentetik frontend önizlemesine aittir. Backend CI, Auth, gerçek DTO entegrasyonu, yetki veya kayıt başarısı doğrulanmadı. Production dağıtımı yoktur.

## Yönetici iş akışı devamı

Kullanıcı değerlendirme sonrası ilerlemeyi kabul etti. Görsel marka aktarılmadan, bekleyen işler ve işlem etkisini anlama ilkeleri mevcut programa eklendi:

- Merkez genelindeki sentetik iş listesi: iki açık yoklama, güncel olmayan bir iptal önizlemesi ve üç kişinin açık borcu. Tarih/salon/arama filtrelerinden bağımsız 23 Ekim senaryosu olduğu görünür biçimde belirtilir.
- Yoklama satırı ilgili ders ayrıntısını açar, program filtrelerini temizler ve odağı ayrıntıya taşır. Ders saatinin geçmesi yoklama kapanışı olarak sunulmaz.
- Borçlar kompakt tabloda gösterilir; 2.450 TL borç ve 300 TL alacak ayrı kalır. Otomatik mahsup yapılmaz.
- Native modal önizlemede üç tasarım durumu: eski önizleme, güncel sentetik etkiler, sonucu bilinmeyen işlem. Eski/bilinmeyen durumda parasal etki satırları gizlenir. Güncel örnek; kalan borç kaldırma, öğrenci alacağı, ayrılmış/tüketilmiş hak ve nakit iade ayrımını gösterir. Gerçek uygula/onayla eylemi yoktur.
- Tasarım durumu seçicisi yalnız senaryoları incelemek içindir; backend durumu veya kullanıcı tercihi kaydetmez. Başarılı finans/iptal sonucu üretilmez.

Bu devam, başka frontend'in marka/palet/fontlarının onaylandığı anlamına gelmez. İlk üç görsel yön hâlâ öneridir. Gerçek uygulama için güncel ortak DTO'lar ve backend önizleme/sürüm/izin sözleşmeleri gerekir.

Devam doğrulaması: production build ve workspace typecheck başarılı; iki Vitest testi ve beş Playwright testi geçti. Yeni tarayıcı senaryoları açık yoklamadan derse geçiş/odak, borç-alacak ayrımı, eski önizlemede etki gizleme, bilinmeyen sonuç, Escape ile kapatma/odağı geri verme ve mobil RTL diyalog taşmasını kapsar. Gerçek finans veya backend kabul testi değildir.

## Yerel marka ve kişisel görünüm önizlemesi

Renk paleti ile font seçimi ayrıldı; artık Sahne seçimi kendiliğinden serif başlık getirmez, Atölye seçimi satır yoğunluğunu değiştirmez. Yerel katalog üç palet ve üç font örneği sunar: Dengeli (sans), Editoryal (serif başlık/sans gövde), Yumuşak (hümanist sans). Sistem fontları/yedekleri kullanılır; lisanslı dağıtım, bütün dil glifleri veya yayımlanmış backend kataloğu iddiası yoktur.

Marka ve görünüm panelinde organizasyon markası ile kişisel açık/koyu/sistem tercihi ayrı gruplardır. İki sıfırlama birbirini etkilemez. Sistem modu CSS media query ile cihaz tercihi değişimini canlı izler. Veri yalnız React belleğinde tutulur; yenilemede başlangıca dönülür ve hiçbir backend kaydetme başarısı gösterilmez. Logo yükleme hâlâ bağlı değildir.

Her palette açık/koyu renkler ayrı tanımlandı. Başarı/uyarı/hata/bilgi ve odak renkleri paletten bağımsız sistem tokenlarıdır. Seçicilerin görünür etiketleri açık id/for ilişkisiyle bağlandı; native modal Escape/odak iadesini korur, RTL panelin tamamına uygulanır.

Doğrulama: sekiz Playwright testi geçti. Ek üç test; bağımsız sıfırlama/yenilemede kalıcılık olmaması, üç palette açık/koyu metin kontrastı (en az 4.5:1), odak kontrastı (en az 3:1), semantik renklerin marka değişiminde korunması, sistem modu ve 390px RTL/font taşmasını kapsar. Bu sayısal kontroller tüm uygulama için kapsamlı WCAG sertifikası değildir. Production build, workspace typecheck ve mevcut iki Vitest testi başarılı. Açık tema masaüstü/panel ve koyu mobil RTL gerçek ekran görüntüleri incelendi; tarayıcı pageerror kaydı yok.

## Kabuk menüleri

Kullanıcı içerikler ve bağlantılar netleşmeden menülerin kabukta yer almasını açıkça istedi. Masaüstünde Bugün, Takvim, Kişiler, Finans; yönetim grubunda Paketler ve haklar, Etkinlikler, Adaylar, Raporlar, Belgeler ve Ayarlar bulunur. 850px ve altındaki alt menü Bugün/Takvim/Kişiler/Finans/Daha olarak düzenlendi; Daha native modal alt paneli diğer bölüm taslaklarını gösterir.

Bugün mevcut programa bağlıdır. Diğer bölüm öğeleri native disabled düğme ve taslak bilgisiyle gösterilir; hayali URL, hazır modül veya canlı erişim yetkisi üretilmez. Gerçek destination/capability eşlemesi sonraki entegrasyondur. Masaüstü ve mobil aynı bölüm tanımlarını kullanır.

Alt menü safe-area boşluğunu hesaba katar; sayfa sonunda içerik için yer ayrılır ve klavye kaydırma alanı korunur. Modal Escape ve kapatma ile kapanır. Mobil panel açıkken masaüstüne geçiş görünmez modal kilidi yaratmaz.

Kontrol: on Playwright akışı geçti; menüye eklenen iki test pasif taslaklar, Daha açma/Escape/odak iadesi, sayfa sonunun alt menü üstünde kalması, RTL ve panel açıkken breakpoint değişimini kapsar. Masaüstü menü/mobil alt menü ayrımı ve gerçek mobil ekran görüntüleri incelendi. Next geliştirme rozeti alt menünün ilk düğmesini örttüğü için `devIndicators: false` kullanıldı; runtime hata ekranları kapatılmadı.

## Kabuk kullanım iyileştirmeleri

Masaüstü yan menü, erişilebilir adı ve aria-expanded durumu olan düğmeyle 78px ikon şeridine daralır; mevcut ve taslak bölüm adları erişilebilir ad/title olarak korunur. Durum yalnız bu önizleme belleğindedir. Mobilde daraltma gizlenir, merkez adı ve bölüm bilgisini gösteren üst başlık kaydırmada sabit kalır. Bugün/skip bağlantısının hedefi odaklanabilir; Ders programına geç kısayolu odağı program bölgesine taşır. Kaydırma payı üst başlığın hedefi örtmesini engeller.

Production build ve typecheck başarılı. Tarayıcı koşusunun ilk dört gezinme testi sayfa açılışında ERR_NETWORK_IO_SUSPENDED aldı; diğer sekiz test geçti. Etkilenen dört test tek worker ile yeniden çalıştırıldı ve 4/4 geçti. Toplam 12 senaryo son kaynakta doğrulandı; ilk toplu koşu tamamen başarılıymış gibi sayılmadı. Daraltılmış RTL masaüstü ve sabit başlıklı mobil ekran görüntüleri incelendi.

## Entegrasyon bekleyenler

Görsel yön seçimi, diller ve Auth yöntemleri açık. Gerçek entegrasyon öncesinde backend'in güncel ortak tip dağıtımı ve işlem bazlı sözleşmeleri kontrol edilmeli; sunum fixture'ları elle API tipine dönüştürülmemeli. Program okuması ve hata/yetki durumları ayrı teslimdir.
