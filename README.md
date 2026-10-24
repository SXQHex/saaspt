# SaaSPT

Dark-first, responsive SaaS frontend. Turborepo, pnpm, Next.js, TypeScript ve Tailwind CSS. Backend hedefi Supabase + Supabase Auth.

İlk merkez yöneticisi günlük program önizlemesi hazır: gün seçimi, salon filtresi, arama, ders ayrıntısı ve üç görsel yön. Sentetik veriler kullanılır; Auth/backend bağlantısı yoktur.

## Gezilebilir tasarım kapsamı

Günlük ekranın yanında Takvim, Kişiler, Finans, Paketler, Etkinlikler, Adaylar, Raporlar, Belgeler, Ayarlar, Eğitmen hakedişleri ve Bildirimler sayfaları hazır. Menü bağlantıları gerçek tasarım sayfalarına gider. Arama/filtre, kayıt ayrıntısı, yerel taslak formlar ve boş/hata/erişim durumu örnekleri incelenebilir. Gerçek işlem kaydedilmez.

[Ekran ve sözleşme eşlemesi, testler ve açık işler](docs/design-coverage.md).

Bekleyen işler alanında açık yoklamalar, ayrı borç/alacak tablosu ve iptal etkisi önizlemesi bulunur. Önizlemenin eskimesi ve sonucu bilinmeyen işlem senaryoları incelenebilir; gerçek kayıt/iptal yapılmaz.

Üstteki **Marka ve görünüm** panelinden üç renk paketi, üç yerel font paketi ve ayrı açık/koyu/sistem görünümü denenebilir. Marka ve kişisel görünüm ayrı sıfırlanır. Seçimler bellektedir; yenilemede başlangıca döner. Fontlar sistem yedekleriyle çalışır; kesin, dağıtılabilir katalog veya logo yükleme desteği değildir.

Kabuk menüleri: masaüstünde yan menü, 850px ve altında Bugün/Takvim/Kişiler/Finans/Daha alt menüsü. Tüm bölüm bağlantıları tasarım sayfalarına gider; Daha, diğer tasarım sayfalarını açar. Tema/font ve menü durumu sayfalar arasında korunur. Yetki/plan filtrelemesi henüz canlı değildir.

Yan menü ikon şeridine daraltılabilir. Mobil üst başlık kaydırmada görünür kalır; Ders programına geç kısayolu odağı doğrudan programa taşır.

## Çalıştırma

Node 24.21.0 (`.nvmrc`) ve Corepack ile:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Önizleme: http://127.0.0.1:3000

```sh
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

`test:e2e` önce production build alır ve ayrı `127.0.0.1:3002` sunucusunda tarayıcı testlerini çalıştırır. Geliştirme önizlemesi `3000` portunda kalır.

`apps/web` önizlemeyi, `packages/ui` ortak UI başlangıcını içerir. Akış, Sahne ve Atölye tasarım önerileridir; kesin marka kararı değildir. Arayüz şu an Türkçedir; RTL denemesi çeviri yapmaz. i18n kütüphanesi/diller açık karardır.

Turbopack bu ortamın alt süreç/port kısıtına takıldığı için dev/build aynı Next sürümünde Webpack kullanır. [Mevcut teslim ve kontroller](docs/frontend-start.md).

## Yeni yerel Codex oturumu

```sh
git clone https://github.com/SXQHex/saaspt.git
cd saaspt
```

Bu klasörü Codex'te yerel proje olarak aç ve şunu iste:

> AGENTS.md, docs/conversation-handover.md ve .agents/skills/saaspt-design-system/SKILL.md dosyalarını oku. Konuşma kararlarına göre yerel frontend geliştirmesine devam edelim; önce mevcut durumu ve hedef sürümlerin uyumluluğunu kontrol et.

- [Ajan talimatları](AGENTS.md)
- [Konuşma kararları ve devir](docs/conversation-handover.md)
- [Proje tasarım skilli](.agents/skills/saaspt-design-system/SKILL.md)
- [Upstream skill kaynakları](.agents/skills/sources.json)
- [Backend entegrasyon devri](https://github.com/SXQHex/FtkSaaS/blob/main/docs/claude-handover.md)
