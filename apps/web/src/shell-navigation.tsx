"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@saaspt/ui/button";

type IconName =
  | "today"
  | "calendar"
  | "people"
  | "finance"
  | "more"
  | "package"
  | "event"
  | "crm"
  | "report"
  | "document"
  | "settings"
  | "earnings"
  | "notification";
type NavItem = { id: IconName; label: string; href?: string };

// Proposed shell only. Real destinations and capability filtering follow integration.
const primary: NavItem[] = [
  { id: "today", label: "Bugün", href: "/#program" },
  { id: "calendar", label: "Takvim", href: "/takvim" },
  { id: "people", label: "Kişiler", href: "/kisiler" },
  { id: "finance", label: "Finans", href: "/finans" },
];
const secondary: NavItem[] = [
  { id: "earnings", label: "Eğitmen hakedişleri", href: "/hakedisler" },
  { id: "package", label: "Paketler ve haklar", href: "/paketler" },
  { id: "event", label: "Etkinlikler", href: "/etkinlikler" },
  { id: "crm", label: "Adaylar", href: "/adaylar" },
  { id: "report", label: "Raporlar", href: "/raporlar" },
  { id: "document", label: "Belgeler", href: "/belgeler" },
  { id: "notification", label: "Bildirimler", href: "/bildirimler" },
  { id: "settings", label: "Ayarlar", href: "/ayarlar" },
];

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    today: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M4 10h16M10 10v10" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4m8-4v4M4 11h16m-11 4h2m3 0h2" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2" />
      </>
    ),
    finance: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18m-5 5h2" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    package: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v10l9 4 9-4V8M12 13v9M7 5l10 6" />
      </>
    ),
    event: (
      <>
        <path d="m12 3 3 6 6 1-5 5 1 7-5-3-5 3 1-7-5-5 6-1 3-6Z" />
      </>
    ),
    crm: (
      <>
        <path d="M20 11a8 8 0 0 1-8 8H4l-2 3V11a9 9 0 0 1 18 0Z" />
        <path d="M7 10h8m-8 4h5" />
      </>
    ),
    report: (
      <>
        <path d="M4 3v18h17M8 16v-4m5 4V8m5 8V5" />
      </>
    ),
    document: (
      <>
        <path d="M5 3h9l5 5v13H5V3Zm9 0v5h5M8 12h8m-8 4h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m10 3-1 3-3 1-3 3 2 2-1 4 3 1 2 4 3-1 3 1 2-4 3-1-1-4 2-2-3-3-3-1-1-3h-4Z" />
      </>
    ),
    earnings: (
      <>
        <path d="M4 21V4h16v17M8 8h8m-8 4h8m-8 4h4" />
      </>
    ),
    notification: (
      <>
        <path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 4h4" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function NavEntry({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const path = usePathname();
  const current = path === item.href?.split("#")[0];
  const content = (
    <>
      <NavIcon name={item.id} />
      <span>{item.label}</span>
      {!item.href ? <small className="nav-draft">Taslak</small> : null}
    </>
  );
  if (item.id === "today" && path === "/")
    return (
      <a
        href="#program"
        onClick={onNavigate}
        aria-label={item.label}
        title={item.label}
        aria-current="page"
        className="shell-nav-item"
      >
        {content}
      </a>
    );
  return item.href ? (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-label={item.label}
      title={item.label}
      aria-current={current ? "page" : undefined}
      className="shell-nav-item"
    >
      {content}
    </Link>
  ) : (
    <button
      type="button"
      disabled
      title={`${item.label} — taslak`}
      className="shell-nav-item"
      aria-label={`${item.label} — bağlantı henüz eklenmedi`}
    >
      {content}
    </button>
  );
}

export function DesktopNavigation() {
  return (
    <nav
      id="sidebar-navigation"
      className="desktop-navigation"
      aria-label="Ana gezinme"
    >
      <div className="navigation-group">
        {primary.map((item) => (
          <NavEntry key={item.id} item={item} />
        ))}
      </div>
      <p className="navigation-group-label">Yönetim</p>
      <div className="navigation-group">
        {secondary.map((item) => (
          <NavEntry key={item.id} item={item} />
        ))}
      </div>
      <p className="navigation-draft-note">
        Tasarım ekranları · Sentetik veriler
      </p>
    </nav>
  );
}

export function MobileNavigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  const moreActive = secondary.some((item) => item.href === path);
  return (
    <>
      <nav className="mobile-navigation" aria-label="Mobil alt menü">
        {primary.map((item) => (
          <NavEntry key={item.id} item={item} />
        ))}
        <button
          className={`shell-nav-item ${moreActive ? "more-current" : ""}`}
          type="button"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          <NavIcon name="more" />
          <span>Daha</span>
        </button>
      </nav>
      <dialog
        ref={dialog}
        className="effect-dialog more-dialog"
        aria-labelledby="more-title"
        aria-describedby="more-description"
      >
        <div className="effect-header">
          <h2 id="more-title">Diğer bölümler</h2>
          <Button
            aria-label="Diğer bölümleri kapat"
            onClick={() => dialog.current?.close()}
          >
            ×
          </Button>
        </div>
        <p id="more-description">
          Tasarım ekranlarını incele. Gerçek menü ve işlemler backend
          yetkilerine göre şekillenecek.
        </p>
        <nav aria-label="Diğer bölümler">
          {secondary.map((item) => (
            <NavEntry
              key={item.id}
              item={item}
              onNavigate={() => dialog.current?.close()}
            />
          ))}
        </nav>
        <form method="dialog" className="effect-footer">
          <Button type="submit">Programa dön</Button>
        </form>
      </dialog>
    </>
  );
}
