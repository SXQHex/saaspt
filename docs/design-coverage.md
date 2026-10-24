# Mevcut sözleşmelerle tasarım kapsamı

24 Ekim 2026. Frontend kaynağı saaspt yerel `codex/frontend-start` dalıdır. İlk teslim `a1e36f2` ile GitHub'a gönderildi; sonraki takvim/yoklama ve ayarlar UX değişiklikleri henüz commit edilmedi. Backend kaynak kontrolü: [FtkSaaS 702063807b0a0d09f559f070ffde1b1ae3e7563b](https://github.com/SXQHex/FtkSaaS/tree/702063807b0a0d09f559f070ffde1b1ae3e7563b).

Bu belge frontend tasarım tesliminin haritasıdır; backend sözleşmesinin paralel kopyası veya API uygulama kabulü değildir. Ürün kapsamı, durum/izin belgesi, entegrasyon devri ve endpoint envanteri incelendi. Aşağıdaki 52 farklı operasyon adı yayımlanmış envanterde kontrol edildi; her Request/Response alanının gerçek istemciye bağlandığı iddia edilmez. Frontend henüz Auth/API/veritabanına bağlı değildir.

## Gezilebilir sayfalar

| Sayfa | Tasarım ve yerel etkileşim | İlgili mevcut operasyonlar |
| --- | --- | --- |
| `/` | Günlük işler, program, salon/arama/gün filtreleri, eski önizleme ve bilinmeyen sonuç senaryosu | calendar_get_v1, session_get_v1, event_cancel_preview_v1, preview_get_v1, operation_status_get_v1 |
| `/takvim` | Salon zaman çizelgesi, mobil ajanda, gün/salon seçimi, seans ayrıntısı, tam işaretleme gerektiren yoklama taslağı ve kapanış özeti | calendar_get_v1, session_get_v1, attendance_get_v1, attendance_mark_v1, attendance_close_v1, reservation_create_v1 |
| `/kisiler` | Arama, ilişki filtresi, tek kişinin çoklu ilişkileri, kişi/hak/ayrılmış hak/borç/alacak ayrımı | people_list_v1, person_get_v1, entitlements_get_v1 |
| `/paketler` | Ders sayılı/süreli katalog filtresi, kapsam/uygunluk/kota, açık satış tarihleri taslağı | products_list_v1, entitlements_get_v1, sale_preview_v1, sale_apply_v1 |
| `/finans` | Karşılaştırılabilir bakiye tablosu, borç/alacak ayrımı, yerel tahsilat formu, bağlı hareketler, iki merkezli başvuru/onay anlatımı | finance_get_v1, collection_record_v1, collection_correct_preview_v1, collection_correct_apply_v1, student_credit_refund_v1, student_credit_offset_v1, settlement_requests_list_v1, settlement_request_decide_v1 |
| `/etkinlikler` | Taslak/yayımlandı filtresi, kayıt koşulları, yer tutmayan ödeme hazırlığı ve kesin kayıt ayrımı | event_list_v1, event_get_v1, event_payment_prepare_v1, event_payment_get_v1, event_registration_preview_v1, event_register_v1 |
| `/adaylar` | Arama, açık/dönüştü/kapalı filtresi, takip bilgisi, geçmiş ve görüşme notu taslağı | leads_list_v1, crm_followup_list_v1, crm_activity_save_v1, lead_convert_v1 |
| `/belgeler` | Sürüm/durum/kapsam, kabul bekleyenler, eski kabul kanıtını koruyan sürüm önizlemesi | document_requirements_get_v1, document_publication_preview_v1, document_version_publish_v1, document_accept_v1 |
| `/raporlar` | Güne göre planlama/kayıt doluluğu, ayrı bakiye kesiti, dışa aktarım iş yaşam döngüsü anlatımı | report_get_v1, report_export_start_v1, job_status_get_v1, report_file_get_v1 |
| `/hakedisler` | Eğitmen seçimi, sabitlenmiş değerleme, hakediş/ödeme ayrımı | instructor_agreements_list_v1, earnings_list_v1, instructor_payment_record_v1 |
| `/bildirimler` | Kendi uygulama içi inbox örneği, yeni/okundu filtreleri, ilgili sayfaya geçiş | notifications_list_v1, notification_mark_read_v1 |
| `/ayarlar` | Organizasyon/merkez/kişisel etki alanı, bağımsız marka/kişisel görünüm önizlemeleri, görünen ad doğrulama/inceleme/geri alma taslağı, bağlı olmayan güvenlik alanlarının açıklanması | organization_get_v1, centers_list_v1, policies_get_v1, account_get_v1, management_state_get_v1, account_profile_update_v1 |

Operasyonların listelenmesi ilgili ekrandaki her alan için tek bir hazır projeksiyon bulunduğu anlamına gelmez. Özellikle çapraz kişi/bakiye/hak görünümü ve belge/sürüm listesinde kesin read projection/alan görünürlüğü/izin analizi gerçek entegrasyon işidir. Yalnız frontend view model'leri kullanıldı; bağımsız API DTO veya mock endpoint yazılmadı.

## Korunan ürün sınırları

- Örnek hesap/kişi adları, tarihler, fiyatlar, kayıtlar ve hakediş tutarları sentetiktir. Ticari varsayılan veya kullanıcı tarafından seçilmiş işletme verisi değildir.
- Saatin geçmesi gerçekleşme, yoklama kapanışı, hak tüketimi veya hakediş üretmez. Yerel yoklama işaretleri kayıt yapmaz; gerçek etkiyi frontend hesaplamaz.
- Hesap, organizasyon kişi kaydı ve öğrenci/eğitmen ilişkileri ayrıdır. İki ilişkili kişi tek kayıttır; bu ekranlar kimlik birleştirme veya yeni yetki oluşturmaz.
- Para borcu, öğrenci alacağı, kullanılabilir ve ayrılmış haklar ayrı gösterilir. Tahsilat taslağı bakiye değiştirmez. Finans hareket örneği tam ekstre değildir; sonradan tutar/borç türetilmez.
- Paket kapsamı, ders/etkinlik uygunluğu ve kota ayrıdır. Satış bitişi otomatik hesaplanmaz. Etkinlik negatif kredi kabul etmez. Ödeme hazırlığı yer tutmaz; ödeme düğmesiyle kesin kayıt sözü verilmez.
- CRM'de yeni pipeline aşamaları icat edilmedi; açık, dönüştü ve kapalı durumları mevcut LeadState anlamlarıyla gösterilir. Reklam sağlayıcı bağlantısı kurulmadı.
- Belge önizlemesindeki metin hukuki belge değildir; yönetici adına kabul yapılmaz. Yeni sürüm geçmiş kabulü değiştirmez.
- Rapor kayıt yeri sayısını tekil kişi veya gerçekleşmiş katılım diye sunmaz. Bakiye, dönem geliri/kasa olarak etiketlenmez. Hayali export dosyası veya job sonucu üretilmez.
- Owner/CM/OM izinleri canlı bağlanmadı. Demo yönetici menüsü gerçek yetki veya plan kanıtı değildir. Settings sprintinin durdurulması korunur; yeni runtime/DTO/izin anahtarı oluşturulmadı.

## Ayarlar UX sınırı

24 Ekim'de backend kaynak indeksi, devir/kalan işler/Claude talimatları ve teknik sözleşmenin S01–S10 ayarlar bölümü GitHub main üzerinden yeniden okundu. Görünüm yerel tasarımı izinli; yeni settings runtime/DTO geliştirmesi durdurulmuş durumda. Gerçek profil yazması yalnız display_name ile sınırlı ve management sürüm kaynağı gerektirir; buradaki form yalnız yerel incelemedir. Renk/font ve kişisel görünüm AppShell içinde paylaşılır; hesap/org tercihi saklama veya senkronizasyonu uygulanmadı. Kalıcı kayıt, logo yükleme, kimlik/iletişim, giriş yöntemleri ve oturum yönetimi çalışan işlem olarak sunulmaz.

## Ortak deneyim

AppShell kök layout'ta ortak tutulur. Tema, font, kişisel görünüm, RTL ve daraltılmış menü client gezinmesinde korunur; sayfa yenilendiğinde başlangıca döner. Gerçek sayfa URL'leri ve aktif menü vardır. Mobil Daha menüsü sayfa seçilince kapanır. Küçük ekranda kayıt seçimi ilgili ayrıntıya odaklanır ve sabit başlığı hesaba katar.

Her bölümde yerel tasarım seçicisiyle içerik/yükleniyor/boş/erişim yok/bağlantı hatası/oturum doldu durumları incelenebilir. Bu seçici gerçek bağlantı ya da yetki sorgulamaz. Erişim yok durumunda eski ayrıntılar ekrandan kaldırılır.

## Kontroller ve açık işler

- Production build: günlük ekran + 11 bölüm, statik çıktı başarılı. Typecheck ve iki Vitest testi geçti.
- Güncel UX devamıyla ayrı localhost:3002 production sunucusunda 49 Playwright testi tek koşuda başarılı. Test komutu artık önce build alır ve açık development önizlemesini yeniden kullanmaz. İlk development denemelerindeki geçiş/panel zaman aşımları başarılı kabul diye sayılmadı.
- 390px ve 1440px'te bütün bölümler: 200 yanıtı, başlık, sentetik veri notu, yatay sayfa taşması ve pageerror kontrolü. Ana akışlar, bağımsız tema durumu, aktif menü, mobil odak, yoklama özeti, tahsilatın bakiyeyi değiştirmemesi, erişim durumu ve bilinmeyen route için 404 kontrol edildi.
- Masaüstü/mobil tarayıcı ekran görüntüleri görsel incelendi. Bu, bütün erişilebilirlik ve gerçek backend kabulünün tamamlandığı anlamına gelmez.

Sonraki özelleştirme: gerçek marka/token/font kataloğu, bilgi yoğunluğu, kullanıcı kelimeleri, kesin ilk görev akışları, diller ve Auth yöntemleri. Gerçek entegrasyonda backend-generated ortak tipler, alan bazlı read projection, rol/plan görünürlüğü, expected_version/preview kaynağı ve hata sözlüğü bağlanmalı. Öğrenci/eğitmen için ayrı uygulama kabukları, gerçek public başvuru, import dosya hattı, tam SaaS abonelik/rol yönetimi, otomasyon konfigürasyonu ve gerçek işlem kabulü bu tasarım tesliminde tamamlandı sayılmaz.
