"use client";

import { useRef } from "react";
import { Button } from "@saaspt/ui/button";
import {
  palettes,
  fontPackages,
  type Palette,
  type FontPackage,
  type Appearance,
} from "./theme-config";

type Props = {
  palette: Palette;
  font: FontPackage;
  appearance: Appearance;
  onPaletteChange: (value: Palette) => void;
  onFontChange: (value: FontPackage) => void;
  onAppearanceChange: (value: Appearance) => void;
};

export function ThemeControls({
  palette,
  font,
  appearance,
  onPaletteChange,
  onFontChange,
  onAppearanceChange,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        Marka ve görünüm
      </Button>
      <dialog
        ref={dialog}
        className="effect-dialog theme-dialog"
        aria-labelledby="theme-title"
        aria-describedby="theme-description"
      >
        <div className="effect-header">
          <span className="sample-label">Yerel önizleme</span>
          <Button
            aria-label="Tema panelini kapat"
            onClick={() => dialog.current?.close()}
          >
            ×
          </Button>
        </div>
        <h2 id="theme-title">Marka ve görünüm</h2>
        <p id="theme-description">
          Seçimleri burada dene. Organizasyona veya hesabına kaydedilmez; sayfa
          yenilendiğinde sıfırlanır.
        </p>
        <fieldset className="theme-fieldset">
          <legend>Organizasyon markası</legend>
          <p>
            Örnek organizasyonun renk ve font paketleri birbirinden bağımsızdır.
          </p>
          <div className="theme-choice">
            <label htmlFor="color-package">Renk paketi</label>
            <select
              id="color-package"
              name="color-package"
              value={palette}
              onChange={(event) =>
                onPaletteChange(event.target.value as Palette)
              }
            >
              {Object.entries(palettes).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="theme-choice">
            <label htmlFor="font-package">Font paketi</label>
            <select
              id="font-package"
              name="font-package"
              value={font}
              onChange={(event) =>
                onFontChange(event.target.value as FontPackage)
              }
            >
              {Object.entries(fontPackages).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="font-specimen">
            <span>Türkçe karakter denemesi</span>
            <h3>Günün ritmi, şehrin enerjisi.</h3>
            <p>İstanbul, Çeşme, Iğdır · Öğrenci ve eğitmen</p>
            <small>
              {fontPackages[font].description} Yerel fontlar ve sistem yedekleri
              kullanılır; kesin font kataloğu henüz seçilmedi.
            </small>
          </div>
          <Button
            onClick={() => {
              onPaletteChange("akis");
              onFontChange("balanced");
            }}
          >
            Markayı başlangıca döndür
          </Button>
          <small className="scope-note">
            Logo yükleme, kalıcı seçim ve yetkiler backend sözleşmesiyle
            bağlanacak.
          </small>
        </fieldset>
        <fieldset className="theme-fieldset">
          <legend>Kişisel görünüm</legend>
          <p>Markayı değiştirmeden bu ekrandaki görünümü seç.</p>
          <div className="theme-choice">
            <label htmlFor="appearance">Görünüm</label>
            <select
              id="appearance"
              name="appearance"
              value={appearance}
              onChange={(event) =>
                onAppearanceChange(event.target.value as Appearance)
              }
            >
              <option value="dark">Koyu</option>
              <option value="light">Açık</option>
              <option value="system">Sistem</option>
            </select>
          </div>
          <p className="theme-note">
            Sistem seçimi cihazın açık/koyu tercihini izler. Marka sıfırlaması
            bu seçimi değiştirmez.
          </p>
          <Button onClick={() => onAppearanceChange("dark")}>
            Görünümü başlangıca döndür
          </Button>
        </fieldset>
        <div
          className="semantic-samples"
          aria-label="Sistemin koruduğu durum renkleri"
        >
          <span className="semantic-success">✓ Başarı</span>
          <span className="semantic-warning">! Uyarı</span>
          <span className="semantic-error">× Hata</span>
          <span className="semantic-info">ⓘ Bilgi</span>
        </div>
        <form method="dialog" className="effect-footer">
          <Button type="submit">Programda gör</Button>
          <span>Yalnız bu önizlemede değişir.</span>
        </form>
      </dialog>
    </>
  );
}
