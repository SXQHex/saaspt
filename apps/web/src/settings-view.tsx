"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@saaspt/ui/button";
import { useAppearancePreview } from "./appearance-preview";
import { ThemeControls } from "./theme-controls";
import { palettes, fontPackages } from "./theme-config";
import {
  DesignAction,
  FilterButtons,
  InfoPairs,
  StateTag,
} from "./view-primitives";

const scopeNotes = {
  Organizasyon: {
    heading: "Ortak marka, ayrı kişisel tercihler",
    description:
      "Renk ve font paketi organizasyon markasını temsil eder. Her kullanıcı kendi açık/koyu görünümünü ayrı seçer.",
    boundary:
      "Marka seçimi rol, erişim, ders koşulları veya finansal sonuç oluşturmaz. Bu önizleme diğer kullanıcıları etkilemez.",
  },
  Merkez: {
    heading: "Merkezin iş zamanı korunur",
    description:
      "Salonlar ve programlar merkez bağlamındadır. Kişisel saat veya görünüm seçimi dersin gerçek zamanını değiştirmez.",
    boundary:
      "Kaynak uygunluğu, çakışma ve işlem yetkisi gerçek işlemde yeniden kontrol edilir. Örnek salonlar kesin politika değildir.",
  },
  Kişisel: {
    heading: "Senin hesabın, senin görünümün",
    description:
      "Görünen ad hesap genelindedir. Organizasyonun kişi kaydı, yasal ad ve geçmiş belge bilgileri ayrı tutulur.",
    boundary:
      "Görünüm tercihi organizasyon markasını veya yetkilerini değiştirmez. Buradaki denemeler hesabına kaydedilmez.",
  },
};
type Scope = keyof typeof scopeNotes;

function ProfileNameDraft() {
  const initialName = "Örnek yönetici";
  const [name, setName] = useState(initialName);
  const [error, setError] = useState(false);
  const [review, setReview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const changed = name.trim() !== initialName;
  return (
    <DesignAction title="Profil adı taslağı" trigger="Görünen adı düzenle">
      <p>
        Bu ad hesabını temsil eder. Yasal adını veya geçmiş belgeleri
        değiştirmez.
      </p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) {
            setError(true);
            inputRef.current?.focus();
            return;
          }
          setReview(true);
          requestAnimationFrame(() => {
            summaryRef.current?.focus({ preventScroll: true });
            summaryRef.current?.scrollIntoView({
              block: "nearest",
              behavior: "instant",
            });
          });
        }}
      >
        <label htmlFor={`${id}-name`}>
          Görünen ad
          <input
            ref={inputRef}
            id={`${id}-name`}
            name="display-name"
            autoComplete="off"
            value={name}
            aria-invalid={error || undefined}
            aria-describedby={error ? `${id}-error` : `${id}-hint`}
            onChange={(event) => {
              setName(event.target.value);
              setError(false);
              setReview(false);
            }}
          />
        </label>
        {error ? (
          <p id={`${id}-error`} className="field-error" role="alert">
            Görünen ad boş olamaz. Kullanmak istediğin adı yaz.
          </p>
        ) : null}
        <p id={`${id}-hint`} className="scope-note">
          {changed
            ? "Değişiklik henüz kaydedilmedi. Önce taslak özeti incele."
            : "İncelemek için görünen adı değiştir."}
        </p>
        <div className="draft-actions">
          <Button type="submit" disabled={!changed}>
            Değişikliği incele
          </Button>
          <Button
            type="button"
            disabled={name === initialName}
            onClick={() => {
              setName(initialName);
              setError(false);
              setReview(false);
              inputRef.current?.focus();
            }}
          >
            Taslağı geri al
          </Button>
        </div>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Ad değişikliği taslağı</h3>
          <InfoPairs
            rows={[
              ["Mevcut ad", initialName],
              ["Önerilen ad", name.trim()],
            ]}
          />
          <p>
            Bu yalnız yerel inceleme. Hesap adı değişmedi; gerçek kayıt
            yapılmadı.
          </p>
        </div>
      ) : null}
      <p className="scope-note">
        Fotoğraf, hitap ve iletişim doğrulaması ayrı akışlardır; bu formun
        parçası değildir.
      </p>
    </DesignAction>
  );
}

export function SettingsView() {
  const [scope, setScope] = useState<Scope>("Organizasyon");
  const preview = useAppearancePreview();
  const note = scopeNotes[scope];
  return (
    <>
      <FilterButtons
        label="Ayar kapsamı"
        items={Object.keys(scopeNotes)}
        value={scope}
        onChange={(value) => setScope(value as Scope)}
      />
      <div className="settings-layout">
        <section className="wide-surface" aria-label={`${scope} ayarları`}>
          {scope === "Organizasyon" ? (
            <>
              <StateTag>Organizasyon kapsamı</StateTag>
              <h2>Birlikte çalışan merkezler</h2>
              <InfoPairs
                rows={[
                  ["Örnek organizasyon", "Merkez Stüdyo"],
                  ["Disiplinler", "Salsa, Bachata, Pilates, Yoga"],
                ]}
              />
              <div className="settings-block">
                <div className="settings-block-heading">
                  <h3>Marka ve fontlar</h3>
                  <StateTag>Yalnız önizleme</StateTag>
                </div>
                <p>
                  Hazır renk ve font paketlerini ayrı ayrı dene. Seçimler
                  sayfalar arasında korunur; sayfa yenilendiğinde sıfırlanır.
                </p>
                <InfoPairs
                  rows={[
                    ["Renk paketi", palettes[preview.palette].name],
                    ["Font paketi", fontPackages[preview.font].name],
                  ]}
                />
                <ThemeControls {...preview} scope="brand" />
                <p className="scope-note">
                  Logo yükleme ve organizasyona kalıcı kayıt bu önizlemede
                  kullanılamıyor.
                </p>
              </div>
              <div className="settings-block">
                <div className="settings-block-heading">
                  <h3>SaaS aboneliği</h3>
                  <StateTag>Organizasyon sahibi</StateTag>
                </div>
                <p>
                  Ders paketlerinden ayrı ürün erişimidir. Plan, fiyat ve limit
                  bilgisi bağlı olmadığı için burada örnek ücret gösterilmiyor.
                </p>
              </div>
            </>
          ) : scope === "Merkez" ? (
            <>
              <StateTag>Merkez kapsamı</StateTag>
              <h2>Merkez Stüdyo</h2>
              <InfoPairs
                rows={[
                  ["Saat dilimi", "Europe/Istanbul"],
                  ["Örnek salonlar", "Salon A, Salon B"],
                ]}
              />
              <h3>Çalışma alanları</h3>
              <div className="room-preview">
                <div>
                  <strong>Salon A</strong>
                  <p>Salsa ve Bachata programları</p>
                </div>
                <div>
                  <strong>Salon B</strong>
                  <p>Yoga ve Pilates programları</p>
                </div>
              </div>
              <p className="scope-note">
                Örnek atamalar kesin salon politikası değildir. Salon, seans ve
                kontenjanı program içinde birlikte incele.
              </p>
              <Link className="button" href="/takvim">
                Merkez takvimini aç
              </Link>
              <div className="settings-block">
                <h3>Katılım ve belge koşulları</h3>
                <p>
                  İptal, rezervasyon ve belge gereklilikleri görünüm tercihiyle
                  değişmez. Bu ekranda yeni kural veya süre tanımlanmaz.
                </p>
                <Link className="button" href="/belgeler">
                  Belge gerekliliklerini incele
                </Link>
              </div>
            </>
          ) : (
            <>
              <StateTag>Hesap kapsamı</StateTag>
              <h2>Kendi deneyimin</h2>
              <div className="settings-block">
                <div className="settings-block-heading">
                  <h3>Görünüm</h3>
                  <StateTag>Yalnız önizleme</StateTag>
                </div>
                <p>
                  Organizasyonun renk ve font paketini değiştirmeden açık, koyu
                  veya cihazın görünümünü seç.
                </p>
                <InfoPairs
                  rows={[
                    [
                      "Görünüm",
                      { dark: "Koyu", light: "Açık", system: "Sistem" }[
                        preview.appearance
                      ],
                    ],
                    ["Kayıt kapsamı", "Bu önizleme oturumu"],
                  ]}
                />
                <ThemeControls {...preview} scope="personal" />
              </div>
              <div className="settings-block">
                <div className="settings-block-heading">
                  <h3>Profil</h3>
                  <StateTag>Taslak</StateTag>
                </div>
                <InfoPairs rows={[["Örnek görünen ad", "Örnek yönetici"]]} />
                <ProfileNameDraft />
              </div>
              <div className="settings-block">
                <h3>Giriş, iletişim ve oturumlar</h3>
                <p>
                  Güvenlik işlemleri henüz bağlı değil. Aşağıdaki açıklamalar
                  çalışan işlem düğmesi değildir.
                </p>
                <details className="settings-explanation">
                  <summary>İletişim değişirse ne olur?</summary>
                  <p>
                    Yeni e-posta veya telefon doğrulanana kadar eski doğrulanmış
                    değer geçerlidir. Bekleyen değer diğer organizasyonlara
                    yayılmaz.
                  </p>
                </details>
                <details className="settings-explanation">
                  <summary>
                    Hesap bağlantısını kaldırmak neyi değiştirir?
                  </summary>
                  <p>
                    İlgili organizasyona erişim ve gelecekteki bilgi paylaşımı
                    durur. Kişi kaydı, borç, hak ve işlem geçmişi kendiliğinden
                    silinmez. Yeniden bağlanma eski yetkileri geri açmaz.
                  </p>
                </details>
                <details className="settings-explanation">
                  <summary>Giriş yöntemleri ve cihazlar</summary>
                  <p>
                    Desteklenecek giriş yöntemleri henüz seçilmedi. Bu tasarım
                    gerçek cihaz listesi göstermez, parola değiştirmez veya
                    oturum kapatmaz.
                  </p>
                </details>
              </div>
            </>
          )}
        </section>
        <aside
          className="view-detail settings-scope-note"
          aria-label="Ayarın etki alanı"
        >
          <span className="section-caption">Etki alanı</span>
          <h2>{note.heading}</h2>
          <p>{note.description}</p>
          <p>{note.boundary}</p>
          <div className="settings-local-note">
            <strong>Kalıcı kayıt yapılmaz.</strong>
            <p>
              Bu ekran denemek ve kapsamı incelemek içindir. Canlı hesap, yetki
              ve kayıt bağlantısı kurulmadı.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
