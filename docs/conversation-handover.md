# SaaSPT — konuşma kararları ve yerel çalışma devri

Tarih: 23 Ekim 2026 (Türkiye).
Bu belge konuşmadaki kararların ve yapılan işlerin kalıcı özetidir; birebir sohbet transkripti değildir. Yeni kullanıcı talimatları bu özeti güncelleyebilir.

## 25 Ekim — sıralı UX taslakları ve son doğrulama

Kullanıcının açık işleri sırayla sürdürme isteğiyle ders/program/bekleme, finans düzeltmeleri, kişi/aday ve destek akışları ilerletildi. Güncel durum ve bağımlılıklar [sıralı iş listesinde](ux-worklist.md). Buradaki yeni bölüm güncel durumu verir; alttaki tarihli doğrulama sayıları geçmiş aşamalardır.

Sonlu program taslağı tarih aralığı, haftanın günleri, yerel saat/süre ve salonu inceler; gerçek oluşum üretmez. Kapasite alanı kullanıcının yeni sözleşmesini bekler. Bekleme listesine katılma/ayrılma isteği ile süreli yer teklifi ayrı gösterilir; yönetici öğrenci adına teklifi kabul edemez, sahte süre/sıra üretilmez.

Finansta tahsilat düzeltmesi yeni toplam yerine increase/decrease yönünde farktır. Satış iadesi ayrı eski satış örneğine bağlı gerekçeli istek; nakit iade ve borca mahsup ayrı taslaklardır. Sunucu etkileri hesaplanmaz, eski kayıtlar silinmez. Kişiden finans bağlantısı aynı kişiyi korur; bilinmeyen person parametresi başka kişiyi sessizce seçmez. Statik finans sayfasında useSearchParams Suspense sınırındadır.

Kişi oluşturma mükerrer kayıt incelemesi, isteğe bağlı iletişim alanları ve istek özeti içerir; kimlik alanı değişince eski inceleme onayı düşer. Ad düzenleme, öğrenci ilişkisi etkinleştirme/gerekçeli kapatma, kaynak/hedef birleştirme yönü ve hesap erişimi isteği ayrıdır. Gerçek kişi/öğrenci/hesap oluşturma, birleştirme ve e-posta gönderme yoktur. Aday görüşme/takip taslağı durum değiştirmez; dönüşüm mevcut person_id bağını korur ve yalnız açık adaya sunulur.

Etkinlik ödeme hazırlığı, kesin kayıt kontrolü ve yer doldu örneği ayrıldı; merkez iptali gerekçeli taslaktır. Belge yayımlama yalnız seçilen dosya adını gösterir, yükleme yapmaz; sürüm/gereklilik adımları/yenilenmiş kabul ayrıdır. Son gereklilik kaldırılırsa yenilenmiş kabul seçimi temizlenir. Rapor filtre/tarih/CSV isteği ve yerel iş durumu senaryoları var; sahte dosya indirtilmez. Kişi, aday, paket, etkinlik, belge ve finans mobil ayrıntılarında odakla listeye dönüş sağlandı.

Kaynak kontrolü: yayımlanmış operations.ts/generated.ts, program/yoklama devirleri ve P03 finans devri. generated.ts 25 Ekim'de GitHub main üzerinden yeniden okundu; settings runtime/DTO geliştirmesinin durdurulması korunur. Yerel modeller API DTO'su değildir. Sunucu kapasite/yetki/kimlik/hak/finans kararı istemcide taklit edilmez.

Son doğrulama: production build, typecheck, 86 Playwright ve 5 Vitest testi geçti. Yedi yeni panel 390px/1440px'te toplam 14 ekran görüntüsüyle incelendi; diyalog yatay taşması görülmedi. Bu kontroller tam erişilebilirlik veya canlı backend kabulü değildir. Kod ve doküman değişiklikleri codex/frontend-start dalında henüz commit/push edilmedi; önceki PR1 merge durumu değişmedi. Yeni kapasite sözleşmesi, gerçek Auth/API, kesin marka/dil ve ayrı persona kapsamları açık kalır.

## 24 Ekim — ikinci öncelik: paket satışı ve tahsilat

Kullanıcının devam isteğiyle kapasite alanları beklemede tutularak kabul edilen ikinci sıraya geçildi. Paket satış taslağı ayrı SaleDraft bileşenine alındı: öğrenci arama/seçimi, iki açık tarih, başlangıç dahil/bitiş hariç kontrolü ve satış isteği özeti. Tarihler otomatik hesaplanmaz; öğrenci veya paket değişince eski seçimler korunmaz. Örnek katalog fiyatı kesin borç/ödeme değildir; gerçek preview/apply bağlantısı kurulmadı.

Manuel tahsilat taslağı ayrı CollectionDraft bileşenine alındı. Kişiye bağlı birden fazla örnek borç checkbox ile seçilir; tutar, gerçekleşme yerel zamanı ve açıklama incelenir. Bu örnek akış seçili borca bağlı tahsilatla sınırlıdır; borçsuz tahsilatın ürün genelinde yasak olduğu iddia edilmez. Seçili borç toplamını aşan tutarda yalnız uyarı gösterilir; dağıtım/alacak/iade sonucu türetilmez. Alan veya borç seçimi değişince özet kaldırılır. Gerçek kayıt/makbuz/mahsup yoktur.

Yerel TRY tutar girişi, virgül/nokta ve en çok iki kuruş basamağını BigInt ile tam minor birime çevirir; sıfır/negatif/gruplu/bilimsel/fazla ondalıklı değerler reddedilir. Gösterim büyük değerlerde de kuruş hassasiyetini korur. Bu yardımcı API DTO'su değildir. RequestSalePreview, RequestSaleApply, RequestCollectionRecord ve P03 devir notları esas alındı; tahsilat için uydurma preview endpoint'i eklenmedi.

Doğrulama: production build, tip kontrolü, 66 tarayıcı testi ve 5 birim testi geçti. Mobil/masaüstü kontrol özetleri görsel incelendi. Değişiklikler önceki yerel akışlarla birlikte henüz commit edilmedi. Gerçek satış etkileri, tahsilat dağıtımı, düzeltme/iade, canlı stale/replay/sonuç-bilinmiyor kabulü ve üçüncü sıradaki kişi/aday UX işleri açık.

## 24 Ekim — ders değişikliği ve yeni kapasite kararı

Günlük/takvim ayrıntılarına gerekçeli saat/tarih/salon değişikliği taslağı eklendi. Başlangıç ve bitiş tarihleri ayrı; geceyi aşan dersler için bitiş sonraki güne alınabilir. Tarihler merkez yerel saat önerisidir; DST/UTC/çakışma/yetki/rezervasyon uygunluğu gerçek önizleme olmadan doğrulanmış sayılmaz. Yalnız bu ders veya programa bağlı örnekte bu ve sonraki açık oluşumlar kapsamı gösterilir; gerçek etkilenen seri listesi üretilmez. Program bağı yalnız sentetik demo-3 örneğine açıklamalı eklendi. Tekil ders seri seçemez. Özet sadece değişen alanları karşılaştırır; düzenleme eski özeti kaldırır, geri alma taslağı temizler.

Kullanıcı oda kapasitesinden bağımsız seans kontenjanı istedi: 50 kişilik odada toplam 30 veya 10 erkek + 10 kadın örnekleri. Nominal/azami ile ilişkisine "Bu ilişkiyi sözleşmede ayrıca netleştireceğiz" cevabı verdi. Bu nedenle yeni formdaki nominal/azami kapasite düzenlemesi kaldırıldı, salt okunur kapasite modeli örnekleri kondu. Backend alanları, cinsiyet kimliği/kota eşlemesi, boş kontenjan devri, toplam/alt limit ilişkisi veya sınırsız kapasite davranışı uydurulmadı. Yeni sözleşme sonrası bu eşleme yeniden ele alınacak; saat/salon UX devamı bundan bağımsızdır.

Production derlemesi, 60 tarayıcı testi ve iki birim testi geçti; tip kontrolü başarılı. Yeni değişiklikler yerelde ve henüz commit edilmedi.

## 24 Ekim — kabul edilen UX sırası ve ilk akışlar

Kullanıcı ders–rezervasyon–yoklama → paket satışı–tahsilat → kişi–aday sırasını kabul edip başlamamızı istedi. Yayımlanmış operations/generated tipleri ve ilgili program/yoklama devirleri yeniden okundu. Günlük ve takvimde ortak rezervasyon taslağı; takvimde ayrı sentetik aktif rezervasyon iptali ve kapanmış yoklama düzeltme örnekleri eklendi. Kişi/hak/tür seçimleri, gerekçe, eski/yeni sonuç ve odaklı kontrol özetleri var; gerçek kayıt veya frontend hak/finans hesabı yok. Detay ve açık ilk-aşama işleri docs/design-coverage.md içinde tutulur. Mobil kaydırmada işlem kapatma başlığı sabittir; adım değişiminde ders bağlamı korunur.

Önceki frontend değişiklikleri PR1 üzerinden bec7e20 main commit'ine merge edildi. Yeni ders/rezervasyon/yoklama UX değişiklikleri yerelde, henüz commit edilmedi. Bu aşamada production build, tip kontrolü ve 55 tarayıcı testi geçti; mobil/masaüstü görseller incelendi.

## 24 Ekim — ayarlar UX devamı

Kullanıcı sözleşmeler kapsamında UX'e devam edilmesini istedi. Backend kaynak indeksi, güncel devir, kalan işler, Claude devri ve teknik sözleşmenin ayarlar bölümü GitHub main'den yeniden okundu. Yeni settings API/DTO/runtime geliştirmesinin durdurulması korunur; görünüm prototipi ve gerçek kayıt ayrı tutulur.

Ayarlar için ayrı `settings-view.tsx` eklendi. Organizasyon/merkez/kişisel kapsamda etki açıklaması değişir. Marka ve kişisel görünüm kendi kapsamlı panellerinden denenir; üstteki ortak panelle aynı AppShell durumunu kullanır. Sayfa yenilenince sıfırlanır; diğer hesaplara yazılmaz. Birden fazla panelin etiket/id çakışmasını önlemek için useId kullanıldı. Mevcut API alanına paralel yerel görünen ad taslağı boş ad kontrolü, mevcut/önerilen değer incelemesi ve geri alma içerir; hesap adı gerçekten değişmez. Fotoğraf/hitap/iletişim veya güvenlik komutları eklenmedi. Merkezden takvim/belgelere gerçek tasarım bağlantıları var. İletişim, hesap bağı ve giriş/oturum açıklamaları işlemsiz bilgi alanlarıdır.

Doğrulama: production derlemesi ve 49 Playwright testi geçti. Beş yeni ayarlar testi; marka/kişisel seçim ayrımı, benzersiz id'ler, profil taslağı/odak/geri alma, merkez bağlantısı ve 320px RTL kapsamını kontrol eder. Mobil/masaüstü ekran görüntüleri incelendi. İlk frontend teslimi a1e36f2 ile GitHub codex/frontend-start dalına gönderilmişti; sonraki takvim/yoklama ve bu ayarlar UX değişiklikleri henüz commit edilmedi.

## 23 Ekim yerel devamı — güncel durum

UX devamı: günlük programda mobil ders seçimi ayrıntıya odaklanır; günlük/takvim ayrıntısından Ders listesine dön ile filtreleri koruyarak listeye dönülür. Takvim ders/eğitmen/disiplin araması salon/gün filtreleriyle birleşir ve boş sonuçtan temizlemeyle toparlanır. Yoklama ilerlemesi, katıldı/gelmedi/bekleyen sayıları ve yalnız bekleyenler filtresi eklendi. Filtrede işaretlenen satır çıkınca odak sıradaki öğrenciye, son öğrenci sonrası filtreye döner. Tüm öğrencileri göster ile seçimler korunur; özet açılınca odak özete taşınır. Bu değişikliklerin production derlemesinde 44 tarayıcı testi geçti. Gerçek kayıt/iş kuralı değişmedi.

Yoklama taslağında kullanıcı açılır liste yerine doğrudan seçim istedi. Her öğrenci için Bekliyor / Katıldı / Gelmedi seçenekleri, tek seçimli ve klavyeyle kullanılabilen radio düğmeleri olarak gösterilir. Bekliyor, işaretlenmemiş durumdur; tüm öğrenciler işaretlenmeden kapanış özeti açılmaz.

Kabul sonrası aynı `AttendanceDraft` bileşeni günlük program ve takvim ders ayrıntılarına bağlandı. Ders değişince yerel işaretler sıfırlanır. Mobilde taslağı açma, seçim, Escape ile kapatma/odak dönüşü ve farklı dersin temiz başlaması doğrulandı. Bu değişiklik için derleme, tip kontrolü ve beş ilgili tarayıcı testi geçti; gerçek yoklama kaydı yapılmaz.

Kullanıcı mevcut sözleşmelerin izin verdiği ölçüde tasarımı ilerletmemizi, sonra özelleştirmeyi istedi. Günlük ekran + on bir gerçek tasarım sayfası, ortak kalıcı layout kabuğu, arama/filtre/ayrıntılar ve yerel işlem/durum taslakları hazırlandı. Güncel teslim [tasarım kapsamı](design-coverage.md) belgesindedir. Son doğrulama: ayrı production sunucusunda 41 tarayıcı testi; build/typecheck ve iki birim testi başarılı. Auth/backend hâlâ bağlı değil; tüm tasarım verileri sentetik.

Organizasyonların kontrol edilmiş hazır renk/font paketlerini ve marka logosunu seçebilmesi, kullanıcı açık/koyu/sistem ve erişilebilirlik tercihlerinin ayrı kalması kabul edildi. Kesin paket/fontlar seçilmedi. Backend ihtiyaçları FtkSaaS mevcut entegrasyon devri ve kalan işlerine [taslak PR43](https://github.com/SXQHex/FtkSaaS/pull/43) ile kaydedildi; main'e merge veya runtime/API geliştirmesi yapılmadı. Ayrı backend sözleşme kopyası burada tutulmaz.

Kullanıcı geliştirmeye başlama talimatı verdi ve ilk persona/görev olarak **merkez yöneticisi ve günlük program** seçti. Monorepo ve ilk etkileşimli tasarım önizlemesi kuruldu; ayrıntılar [ilk frontend çalışmasında](frontend-start.md). İstenen paket sürümleri doğrulanıp kuruldu. Auth/backend bağlantısı yoktur. Aşağıdaki uygulama kurulmadı ve persona seçilmedi ifadeleri ilk devir anının tarihsel durumudur; güncel kapsam için yeni belge ve README esas alınır.

## Devam eden iş ve çalışma yeri

Kullanıcı geliştirmeyi bulut ortamında değil, kendi bilgisayarındaki Codex oturumunda sürdürmek istiyor. Bu deponun yerel klonunu aç; önce AGENTS.md, bu belge ve ilgili skill dosyalarını oku. Yeni konuşma eski sohbet hafızasını varsaymamalı.

Frontend deposu: https://github.com/SXQHex/saaspt (main).
İlk ortam deposu SXQHex/SaaS idi; kullanıcı isteğiyle saaspt ile değiştirildi. Eski depo yalnız README.md (# FESaas) ve .gitignore içeriyordu; uygulama geliştirmesi yoktu. Eski Git geçmişi ve bulut makinesi arşivleri bu frontend projesinin kaynakları değildir.

## Kabul edilen yön

- SaaS frontend geliştirmesi bir Turborepo monoreposunda başlayacak.
- Modern, özgün, dark-theme-first görsel dil; sıradan CRM tablo kabuğu istenmiyor.
- Responsive arayüz ve tip güvenli LTR/RTL yerelleştirme hedefleniyor. İlk mesajdaki “relative” ifadesi responsive olarak yorumlandı; ayrı bir görsel stil adı olarak kesinleştirilmedi.
- pnpm, Next.js, TypeScript, Tailwind CSS; tarayıcı doğrulaması için Playwright, uygun birim testleri için Vitest.
- Backend BaaS Supabase; kimlik doğrulama Supabase Auth.
- Expo ileride değerlendirilebilir; şu anda Expo uygulaması kurulmayacak.
- Kullanıcı dört hazır skill ve projeye özel tasarım skillini kabul etti; dosyaları bu depoya eklendi.

## Kullanıcının istediği sürümler — henüz doğrulanmadı/kurulmadı

| Araç | İstenen sürüm / kaynak |
|---|---|
| Turborepo | [2.11.10](https://github.com/vercel/turborepo/releases/tag/v2.11.10) |
| Next.js | [16.4.2](https://github.com/vercel/next.js/releases/tag/v16.4.2) |
| pnpm | [12.15.0](https://github.com/pnpm/pnpm/releases/tag/v12.15.0) |
| TypeScript | [7.0.2](https://github.com/microsoft/TypeScript/releases/tag/v7.0.2) |
| Tailwind CSS | [4.3.3](https://github.com/tailwindlabs/tailwindcss/releases/tag/v4.3.3) |
| Playwright | [1.64.1](https://github.com/microsoft/playwright/releases/tag/v1.64.1) |
| Vitest | [5.0.5](https://github.com/vitest-dev/vitest/releases/tag/v5.0.5) |
| i18n seçenekleri | [i18n-node 0.15.4](https://github.com/mashpie/i18n-node/releases/tag/v0.15.4) veya [i18next 26.5.6](https://github.com/i18next/i18next/releases/tag/v26.5.6) |

Kurulumdan önce registry sürümlerini, Node gereksinimlerini ve peer bağımlılık uyumunu doğrula. Sürümler kullanılamıyorsa sessizce başka sürüm seçme; durumu açıkla. Node sürümü seçilmedi. i18next + react-i18next, gelecekte Expo kullanımı için önerildi; son kütüphane kararı alınmadı. Radix/shadcn ve Motion da öneri olarak konuşuldu; kabul edilmiş/kurulmuş bağımlılık değiller.

## Skilller ve eklentiler

Skilller `.agents/skills/` altında:

1. `frontend-design` — Anthropic: özgün görsel yön, tipografi ve kompozisyon.
2. `web-design-guidelines` — Vercel: arayüz, erişilebilirlik ve UX incelemesi.
3. `vercel-composition-patterns` — Vercel: ortak UI bileşen mimarisi.
4. `vercel-react-best-practices` — Vercel: React/Next.js uygulama ve performans rehberi.
5. `saaspt-design-system` — projeye özel kabul edilmiş tasarım ve entegrasyon kuralları.

Dört upstream skillin ilgili dizinleri referans dosyalarıyla kopyalandı; 93 dosya kaynaklarla byte düzeyinde karşılaştırıldı. Kaynak repoları ve kesin commitleri `.agents/skills/sources.json` içindedir. Dosyalar her oturumda otomatik skill keşfi yapıldığını kanıtlamaz; AGENTS.md ilgili dosyaların okunmasını yönlendirir.

Figma isteğe bağlı önerildi; kurulmadı. Başka bir eklenti kurulmadı. Bulut onboarding skilli ortam kurulumunda kullanıldı; frontend tasarım skilli değildir ve yerel geliştirme için yüklenmiş varsayılmamalı.

## Backend ilişkisi ve kaynak önceliği

Backend ayrı geliştirilmekte: https://github.com/SXQHex/FtkSaaS . Kullanıcı backend tamamlandığında frontend ile birleşeceğini/entegre edileceğini belirtti; Git depolarını birleştirme veya geçmiş taşıma yöntemi seçilmedi.

Kullanıcı, backend belgelerindeki “Claude” talimatlarının bu ajan için geçerli olduğunu açıkça söyledi. Bu oturum frontend tasarımı, akışları, istemci kodu ve frontend testlerini üstlenir. Backend şema/migration/RPC/Edge değişiklikleri burada tek taraflı yapılmaz; ihtiyaç sözleşme üzerinden iletilir.

Backend referansı salt okunur olarak `bfb8ccb29a1e0ca9efde7813dc3af4bbbad8768d` main snapshot'ında incelendi. Bu, güncel backend CI veya hosted kabulünün bağımsız doğrulandığı anlamına gelmez. Başlıca okunan belgeler: kök AGENTS.md, docs/source-index.md, docs/claude-handover.md ve ürün/sorumluluk sözleşmelerinin ilgili bölümleri. Tüm backend belgelerinin okunduğu iddia edilmez.

Yeni entegrasyon işinde backend AGENTS.md ve kaynak indeksine göre güncel devir, kalan işler, Claude devri, ilgili sözleşme ve kararları oku. Backend belgelerini buraya kopyalayıp ikinci bir sözleşme ağacı üretme. AGENTS.md içindeki entegrasyon kısıtları bu kaynaklara yönlendiren çalışma özetidir.

Temel kurallar:

- Domain işlemleri `POST {API_URL}/functions/v1/backend-v1/{operation}` üzerinden, Supabase Auth access token ve publishable key ile çağrılır.
- Backend `packages/contracts` ortak üretilmiş tipleri kullanılır; bağımsız elle API tip kopyaları oluşturulmaz.
- core/private tablolara veya service-only RPC'lere doğrudan istemci erişimi yoktur. Service-role anahtarı frontend'e girmez.
- Yetki, organizasyon/merkez kapsamı ve plan kontrollerinin sahibi backend'dir.
- request_id/operation_key, UUIDv7, idempotency, expected_version ve retry kuralları güncel sözleşmeye uyar.
- Mocklar sözleşmeye uyar, açıkça mock olarak kalır; gerçek entegrasyon kabulü yerine geçmez.
- Dış e-posta/Resend ertelendi. Production dağıtımı yetkisi verilmedi.
- Eski backend CI/merge/dağıtım yetkileri bu frontend oturumuna otomatik taşınmaz.

Backend kapsamı organizasyon ve merkezler, öğrenci/eğitmen/personel ilişkileri, ders planlama/rezervasyon/yoklama, paket ve haklar, finans, hakedişler, CRM, bildirimler, raporlar, SaaS abonelikleri, etkinlikler ve belgeleri içeriyor. Kesin sınırlar backend ürün sözleşmesinden okunmalı; bu liste yeni ürün kuralı oluşturmaz.

## Mevcut uygulama durumu

- Bu çalışma başladığında saaspt boş ve commitsizdi.
- Şu ana kadar skill ve ajan/devir belgeleri hazırlandı.
- Turborepo/Next.js iskeleti, package.json, lockfile, uygulama kodu veya bağımlılık kurulumu yok.
- Supabase projesine bu frontend'den bağlantı yapılmadı; auth akışı, database veya backend entegrasyonu kurulmadı.
- Build, typecheck, Vitest veya Playwright testleri henüz çalıştırılmadı; çalıştırılabilir uygulama bulunmuyor.
- Kimlik bilgileri veya yerel .env dosyası aktarılmıyor.
- Bulut ortamında bir yerel aktarım ZIP'i hazırlanmıştı; GitHub'a aktarım sonrası devam için gerekli içerik bu depodadır. Makineye özgü arşivler, .git dizini ve backend referans klonu kaynak dosyası olarak eklenmez.

## Açık kararlar ve sonraki adım

İlk persona/rol ve ana kullanıcı görevi, ilk ekran, marka, renk paleti, fontlar, desteklenecek diller ve auth yöntemleri seçilmedi. Ürün kapsamı backend sözleşmelerinde mevcut; kullanıcıdan tüm ürünü yeniden anlatmasını istemeden ilgili belgeleri oku.

Yerel Codex'te bu depoyu aç. Mevcut dosyaları ve ilgili skillleri oku, sürüm uygunluğunu doğrula; ilk kullanıcı akışını netleştirip 2–3 görsel yön öner. Onaylanmış görsel kararları proje tasarım skillinde kaydet. Ardından uygun monorepo iskeleti ve ilk ekranla ilerle. İşletim sistemi ve yerel araçlar bu bulut oturumunda tespit edilmedi.
