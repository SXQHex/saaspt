# Mevcut sözleşmelerle tasarım kapsamı

25 Ekim 2026. Frontend kaynağı saaspt yerel `codex/frontend-start` dalıdır. İlk tasarım ve ayarlar/takvim UX değişiklikleri `2b31dd5` kaynağından PR1 ile `bec7e20` main commit'ine birleştirildi. Bu belgedeki yeni rezervasyon/iptal/yoklama düzeltme, ders değişikliği satış/tahsilat, kişi/aday ve destek akışı taslakları henüz commit edilmedi. Önceki backend kaynak kontrolü: [FtkSaaS 702063807b0a0d09f559f070ffde1b1ae3e7563b](https://github.com/SXQHex/FtkSaaS/tree/702063807b0a0d09f559f070ffde1b1ae3e7563b); yeni akışlar için aşağıda belirtilen yayımlanmış tipler GitHub main üzerinden yeniden okundu.

Bu belge frontend tasarım tesliminin haritasıdır; backend sözleşmesinin paralel kopyası veya API uygulama kabulü değildir. Ürün kapsamı, durum/izin belgesi, entegrasyon devri ve endpoint envanteri incelendi. Aşağıdaki operasyon adları yayımlanmış envanterde kontrol edildi; her Request/Response alanının gerçek istemciye bağlandığı iddia edilmez. Frontend henüz Auth/API/veritabanına bağlı değildir.

## Gezilebilir sayfalar

| Sayfa | Tasarım ve yerel etkileşim | İlgili mevcut operasyonlar |
| --- | --- | --- |
| `/` | Günlük işler, program, salon/arama/gün filtreleri, eski önizleme ve bilinmeyen sonuç senaryosu | calendar_get_v1, session_get_v1, event_cancel_preview_v1, preview_get_v1, operation_status_get_v1, reservation_create_v1, entitlements_get_v1 |
| `/takvim` | Salon zaman çizelgesi, mobil ajanda, gün/salon seçimi, seans ayrıntısı, tam işaretleme gerektiren yoklama taslağı ve kapanış özeti | calendar_get_v1, session_get_v1, attendance_get_v1, attendance_mark_v1, attendance_close_v1, reservation_create_v1, reservation_cancel_v1, reservation_list_v1, entitlements_get_v1, attendance_correct_preview_v1, attendance_correct_apply_v1, session_change_preview_v1, session_change_apply_v1, program_preview_v1, program_apply_v1, waitlist_join_v1, waitlist_leave_v1 |
| `/kisiler` | Arama, ilişki filtresi, tek kişinin çoklu ilişkileri, kişi/hak/ayrılmış hak/borç/alacak ayrımı | people_list_v1, person_get_v1, entitlements_get_v1, person_create_v1, person_update_v1, student_activate_v1, student_deactivate_v1, person_merge_preview_v1, person_merge_approve_v1, person_merge_apply_v1, account_access_send_v1 |
| `/paketler` | Ders sayılı/süreli katalog filtresi, kapsam/uygunluk/kota, öğrenci aramalı satış adımları, açık tarih doğrulaması ve kontrol özeti | products_list_v1, entitlements_get_v1, sale_preview_v1, sale_apply_v1 |
| `/finans` | Karşılaştırılabilir bakiye tablosu, borç/alacak ayrımı, çoklu örnek borç seçimli, zaman/açıklama ve kuruş hassasiyetli tahsilat taslağı, bağlı hareketler, iki merkezli başvuru/onay anlatımı | finance_get_v1, collection_record_v1, collection_correct_preview_v1, collection_correct_apply_v1, student_credit_refund_v1, student_credit_offset_v1, settlement_requests_list_v1, settlement_request_decide_v1, sale_refund_preview_v1, sale_refund_apply_v1 |
| `/etkinlikler` | Taslak/yayımlandı filtresi, kayıt koşulları, yer tutmayan ödeme hazırlığı ve kesin kayıt ayrımı | event_list_v1, event_get_v1, event_payment_prepare_v1, event_payment_get_v1, event_registration_preview_v1, event_register_v1, event_cancel_preview_v1, event_cancel_apply_v1 |
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

## İlk öncelik — ders, rezervasyon ve yoklama

Kullanıcı sıralamayı kabul etti: (1) ders/rezervasyon/yoklama, (2) paket satışı/tahsilat, (3) kişi/aday. İlk aşamada günlük program ve takvimde ortak rezervasyon taslağı eklendi: öğrenci arama/seçimi, hak kaynağı veya işlem sırasında belirleme tercihi, açık esnek/öncelikli kayıt türü ve kontrol özeti. Kişi değişince eski hak/tür temizlenir. Kaynak örneklerinin listede bulunması uygunluk kararı değildir; örnek kontenjan kesin yer garantisi vermez. Hiçbir rezervasyon veya hak hareketi yazılmaz.

Takvimde ayrı açılan aktif rezervasyon iptal örneği kayıt ve gerekçe ister; istek özeti sürüm/yetki/iptal koşullarının henüz doğrulanmadığını açıklar. İptal için yeni bir backend preview endpoint'i icat edilmedi. Kapanmış yoklama düzeltme örneği eski sonuç, farklı yeni sonuç ve gerekçe ister; istemci etki hesaplamaz, geçmiş kapanışı silmez/seansı açmaz. Bu ayrı geçmiş durum örneği mevcut dersin kapanmış veya gerçekleşmiş olduğu anlamına gelmez. Engelli katılım sonucu için yeni keyfi gerekçe/sahte değerlendirme üretilmedi.

Yeniden okunan kaynaklar: `packages/contracts/src/operations.ts`, gerçek DTO kaynağı `packages/contracts/src/generated.ts`, `docs/program-session-handover.md`, `docs/starter-attendance-protection-handover.md`. Oluşturma person/session/mode ve isteğe bağlı source_sale_id; iptal reservation/version/reason; düzeltme gerekçeli preview/apply ayrımına dayanır. Koda API DTO kopyası veya endpoint mock'u eklenmedi.

Saat/tarih/salon değişikliği taslağı da günlük ve takvime eklendi. Tekil ders veya programa bağlı sentetik örnek için seri kapsamı seçilir; eski/yeni alanlar karşılaştırılır. Gerçek çakışma ve seri etki listesi henüz alınmaz. Kullanıcı fiziksel oda sınırından bağımsız toplam veya erkek/kadın seans kontenjanı istedi; 50 kişilik oda için 30 toplam veya 10 erkek + 10 kadın örnekleri salt okunur gösterilir. Nominal/azami ile ilişkiyi yeni sözleşmede netleştireceğini belirttiği için kapasite düzenleme alanları bekletildi. Yeni API/DTO veya cinsiyet/kota eşleme kuralı oluşturulmadı.

Sonlu program ve bekleme listesi istek taslakları da eklendi. Program tarih/gün/saat/salon kontrolü yapar; yeni kapasite eşlemesi açık olduğu için gerçek program üretimi bekler. Bekleme isteği rezervasyon/hak tüketimi değildir. Süreli yer teklifi salt okunur senaryodur; yönetici öğrenci adına kabul yapamaz. Canlı rezervasyon listesi, sunucu çakışma/kapasite/engelli katılım değerlendirmesi, gerçekleşen eğitmen ve hak/hakediş etkileri entegrasyonda doğrulanacak.

## İkinci öncelik — paket satışı ve tahsilat

Paket ayrıntısında öğrenci → geçerlilik → kontrol adımları vardır. Başlangıç ve bitiş açıkça girilir; bitiş başlangıçtan sonra olmalı, bitiş sınırı hariçtir. Örnek katalog fiyatı gerçek satış bedeli, doğmuş borç veya alınmış ödeme gibi sunulmaz. Ürün sürümü/borç/hak etkileri için gerçek sale_preview/sale_apply bağlantısı hâlâ gerekir.

Tahsilat örneği kişi bazlı seçili borçlara bağlı akışla sınırlıdır. Birden çok borç, TRY tutarı, gerçekleşme yerel zamanı ve açıklama incelenir. Yerel saatten gerçek Instant henüz türetilmez. Tutar girişinde virgül/nokta kabul edilir; BigInt ile kuruş dönüşümü ve hassas gösterim vardır. Seçili örnek borç toplamı aşıldığında dağıtım/alacak sonucu hesaplanmaz. Açıklama dahil her alan değişikliği özeti geçersizleştirir. Örnek borcu olmayan kişide bu taslağın kapsamı açıklanır; genel borçsuz tahsilat kuralı icat edilmez. Gerçek collection_record çağrısı, makbuz veya otomatik mahsup yoktur.

Kaynak: yayımlanmış generated.ts içindeki RequestSalePreview/SaleApply/CollectionRecord ve docs/p03-handover.md. Sale preview ve collection komutu ayrıdır; uydurma collection preview endpoint'i veya paralel API DTO'su eklenmedi. Tahsilat düzeltme taslağı artış/azalış farkını ister; yeni toplam olarak sunmaz. Ayrı satış iadesi, nakit alacak iadesi ve borca mahsup taslakları gerekçeyi/bağlamı korur. Gerçek dağıtım ve hata/yeniden deneme/sonuç-bilinmiyor kabulü entegrasyon işidir.

## Kişi/aday ve destek akışları

Yeni kişi oluşturma, mükerrer kayıt incelemesi, ad düzenleme ve öğrenci ilişkisi ayrı istek taslaklarıdır. İletişim veya ad değişikliği eski mükerrer kontrol onayını geçersizleştirir. Tam iletişim güncellemesi kaynak projeksiyonu bekler. Birleştirmede kaynak/korunan hedef yönü açık; iletişim eşitliği kimlik kanıtı değildir. Hesap erişimi formu davet veya e-posta göndermez. LeadConvert mevcut kişi bağını korur; yeni kişi seçtirmez. Görüşme/takip kaydı kendiliğinden aday durumunu değiştirmez.

Etkinlik hazırlık/kesin kayıt/kapasite dolu senaryosu ve gerekçeli merkez iptali ayrıdır. Belge sürüm/gereklilik taslağında dosya içeriği okunmaz/yüklenmez; yönetici başkası adına kabul yapmaz. Gereklilik yoksa yenilenmiş kabul seçimi temizlenir. Rapor CSV/filter/tarih isteği ve açıkça yerel ready/error/erişim değişimi örnekleri vardır; gerçek iş veya indirilebilir dosya yoktur.

## Ayarlar UX sınırı

24 Ekim'de backend kaynak indeksi, devir/kalan işler/Claude talimatları ve teknik sözleşmenin S01–S10 ayarlar bölümü GitHub main üzerinden yeniden okundu. Görünüm yerel tasarımı izinli; yeni settings runtime/DTO geliştirmesi durdurulmuş durumda. Gerçek profil yazması yalnız display_name ile sınırlı ve management sürüm kaynağı gerektirir; buradaki form yalnız yerel incelemedir. Renk/font ve kişisel görünüm AppShell içinde paylaşılır; hesap/org tercihi saklama veya senkronizasyonu uygulanmadı. Kalıcı kayıt, logo yükleme, kimlik/iletişim, giriş yöntemleri ve oturum yönetimi çalışan işlem olarak sunulmaz.

## Ortak deneyim

AppShell kök layout'ta ortak tutulur. Tema, font, kişisel görünüm, RTL ve daraltılmış menü client gezinmesinde korunur; sayfa yenilendiğinde başlangıca döner. Gerçek sayfa URL'leri ve aktif menü vardır. Mobil Daha menüsü sayfa seçilince kapanır. Küçük ekranda kayıt seçimi ilgili ayrıntıya odaklanır ve sabit başlığı hesaba katar. Ders, kişi, aday, finans, paket, etkinlik ve belge ayrıntısından listeye odakla dönülür. Kişiden finans bağlantısı seçimi korur; bilinmeyen kişi başka kayda dönüşmez. Gerçek cursor sayfalama ve büyük veri kabulü henüz yapılmadı.

Her bölümde yerel tasarım seçicisiyle içerik/yükleniyor/boş/erişim yok/bağlantı hatası/oturum doldu durumları incelenebilir. Bu seçici gerçek bağlantı ya da yetki sorgulamaz. Erişim yok durumunda eski ayrıntılar ekrandan kaldırılır.

## Kontroller ve açık işler

- Production build: günlük ekran + 11 bölüm, statik çıktı başarılı. Typecheck ve beş Vitest testi geçti.
- Güncel UX devamıyla ayrı localhost:3002 production sunucusunda 86 Playwright testi tek koşuda başarılı. Test komutu artık önce build alır ve açık development önizlemesini yeniden kullanmaz. İlk development denemelerindeki geçiş/panel zaman aşımları başarılı kabul diye sayılmadı.
- 390px ve 1440px'te bütün bölümler: 200 yanıtı, başlık, sentetik veri notu, yatay sayfa taşması ve pageerror kontrolü. Ana akışlar, bağımsız tema durumu, aktif menü, mobil odak, yoklama özeti, tahsilatın bakiyeyi değiştirmemesi, erişim durumu ve bilinmeyen route için 404 kontrol edildi.
- Masaüstü/mobil tarayıcı ekran görüntüleri görsel incelendi; son yedi panel için 390px/1440px toplam 14 görüntü kontrol edildi. Bu, bütün erişilebilirlik ve gerçek backend kabulünün tamamlandığı anlamına gelmez.

Sonraki özelleştirme: gerçek marka/token/font kataloğu, bilgi yoğunluğu, kullanıcı kelimeleri, kesin ilk görev akışları, diller ve Auth yöntemleri. Gerçek entegrasyonda backend-generated ortak tipler, alan bazlı read projection, rol/plan görünürlüğü, expected_version/preview kaynağı ve hata sözlüğü bağlanmalı. Öğrenci/eğitmen için ayrı uygulama kabukları, gerçek public başvuru, import dosya hattı, tam SaaS abonelik/rol yönetimi, otomasyon konfigürasyonu ve gerçek işlem kabulü bu tasarım tesliminde tamamlandı sayılmaz.

Güncel tamamlanma ve bağımlılık sırası: [UI/UX iş listesi](ux-worklist.md).
