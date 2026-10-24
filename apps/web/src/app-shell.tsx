"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@saaspt/ui/button";
import { ThemeControls } from "./theme-controls";
import { AppearancePreviewContext } from "./appearance-preview";
import {
  palettes,
  type Palette,
  type FontPackage,
  type Appearance,
} from "./theme-config";
import { DesktopNavigation, MobileNavigation } from "./shell-navigation";
import { sectionConfig, type Section } from "./section-config";

export function AppShell({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState<Palette>("akis");
  const [font, setFont] = useState<FontPackage>("balanced");
  const [appearance, setAppearance] = useState<Appearance>("dark");
  const [rtl, setRtl] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const path = usePathname();
  const section = path.split("/")[1] as Section;
  const title = sectionConfig[section]?.title ?? "Günlük program";
  const light = palettes[palette].light;
  const style = {
    "--light-bg": light.bg,
    "--light-surface": light.surface,
    "--light-elevated": light.elevated,
    "--light-line": light.line,
    "--light-text": light.text,
    "--light-muted": light.muted,
    "--light-accent": light.accent,
    "--light-accent-text": light.accentText,
    "--light-wash": light.wash,
  } as CSSProperties;
  const appearancePreview = {
    palette,
    font,
    appearance,
    onPaletteChange: setPalette,
    onFontChange: setFont,
    onAppearanceChange: setAppearance,
  };
  return (
    <AppearancePreviewContext value={appearancePreview}>
      <div
        className="preview"
        dir={rtl ? "rtl" : "ltr"}
        data-sidebar={collapsed ? "collapsed" : "expanded"}
        data-direction={palette}
        data-font={font}
        data-appearance={appearance}
        style={style}
      >
        <a className="skip-link" href="#program">
          İçeriğe geç
        </a>
        <div className="design-bar">
          <span>
            <span className="preview-dot" />
            Tasarım önizlemesi
          </span>
          <div
            className="direction-switch"
            role="group"
            aria-label="Görsel yön"
          >
            {(Object.keys(palettes) as Palette[]).map((key) => (
              <button
                key={key}
                aria-pressed={palette === key}
                onClick={() => setPalette(key)}
              >
                {palettes[key].name}
              </button>
            ))}
          </div>
          <ThemeControls {...appearancePreview} />
          <button
            className="rtl-switch"
            aria-pressed={rtl}
            onClick={() => setRtl((value) => !value)}
          >
            RTL denemesi
          </button>
        </div>
        <div className="workspace" dir={rtl ? "rtl" : "ltr"}>
          <aside className="sidebar">
            <div className="sidebar-heading">
              <Link
                className="brand"
                href="/"
                aria-label="SaaSPT günlük program"
              >
                <span className="brand-symbol" aria-hidden="true">
                  s<span>p</span>
                </span>
                <span className="brand-name">SaaSPT</span>
              </Link>
              <Button
                className="sidebar-toggle"
                aria-label={
                  collapsed ? "Yan menüyü genişlet" : "Yan menüyü daralt"
                }
                aria-expanded={!collapsed}
                aria-controls="sidebar-navigation"
                onClick={() => setCollapsed((value) => !value)}
              >
                <span aria-hidden="true">{collapsed ? "›" : "‹"}</span>
              </Button>
            </div>
            <div className="mobile-context">
              <strong>Merkez Stüdyo</strong>
              <span>{title}</span>
            </div>
            <div className="center-label">
              <span className="center-avatar">M</span>
              <div>
                Merkez Stüdyo<small>Örnek işletme</small>
              </div>
            </div>
            <DesktopNavigation />
            <div className="sidebar-note">
              <span className="tiny-orbit" aria-hidden="true" />
              <p>
                Her dersin
                <br />
                kendi ritmi var.
              </p>
              <small>
                Günün tamamı,
                <br />
                tek bir çalışma alanında.
              </small>
            </div>
            <div className="profile">
              <span className="profile-avatar">MY</span>
              <div>
                Merkez yöneticisi<small>Örnek kullanıcı</small>
              </div>
            </div>
          </aside>
          <main id="program" tabIndex={-1} className="main">
            <header className="topline">
              <span>
                Çalışma alanı <span className="breadcrumb">/</span> {title}
              </span>
              <span className="context-pill">Merkez Stüdyo</span>
            </header>
            {children}
            <footer className="page-footer">
              <span>Sentetik veriler · Gerçek hesap bağlantısı yok</span>
              <span>
                {palettes[palette].name} · {palettes[palette].description}
              </span>
            </footer>
          </main>
        </div>
        <MobileNavigation />
      </div>
    </AppearancePreviewContext>
  );
}
