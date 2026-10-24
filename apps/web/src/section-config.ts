export const sectionConfig = {
  takvim: {
    title: "Takvim",
    heading: "Zamanı birlikte planla.",
    description: "Dersleri, salonları ve eğitmenleri aynı gün içinde gör.",
  },
  kisiler: {
    title: "Kişiler",
    heading: "Her ilişkinin bir hikâyesi var.",
    description:
      "Öğrenci, eğitmen ve personel ilişkilerini tek kişi kaydından incele.",
  },
  finans: {
    title: "Finans",
    heading: "Para hareketleri açık olsun.",
    description:
      "Borç, tahsilat ve öğrenci alacağını birbirinden ayırarak izle.",
  },
  paketler: {
    title: "Paketler ve haklar",
    heading: "Doğru hak, doğru kapsam.",
    description:
      "Ürün kapsamını, geçerliliği ve kullanım koşullarını birlikte incele.",
  },
  etkinlikler: {
    title: "Etkinlikler",
    heading: "Bir araya gelme zamanı.",
    description: "Yayımlanmış etkinlikler, kayıtlar ve katılım koşulları.",
  },
  adaylar: {
    title: "Adaylar",
    heading: "Bir sonraki görüşmeyi kaçırma.",
    description: "Kaynak, ilgi ve takip geçmişiyle aday ilişkilerini sürdür.",
  },
  raporlar: {
    title: "Raporlar",
    heading: "Görünenden fazlasını anla.",
    description:
      "Operasyon ve finansı aynı kapsamda, farklı ölçülerle değerlendir.",
  },
  belgeler: {
    title: "Belgeler",
    heading: "Doğru sürüm, açık kabul.",
    description: "Belge sürümleri, gereklilikler ve kabul durumlarını incele.",
  },
  ayarlar: {
    title: "Ayarlar",
    heading: "Çalışma alanını düzenle.",
    description:
      "Organizasyon, merkez ve kişisel tercihlerin sınırları birbirinden ayrıdır.",
  },
  hakedisler: {
    title: "Eğitmen hakedişleri",
    heading: "Emeğin karşılığı görünür.",
    description:
      "Anlaşma, gerçekleşen görev ve ödeme kayıtlarını birlikte incele.",
  },
  bildirimler: {
    title: "Bildirimler",
    heading: "Sana ulaşan gelişmeler.",
    description: "Kendi uygulama içi bildirimlerin ve işlem bağlantıların.",
  },
} as const;
export type Section = keyof typeof sectionConfig;
