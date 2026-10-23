"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@saaspt/ui/button";

export function useDetailSelection(initialId: string) {
  const [selectedId, updateId] = useState(initialId);
  const detailRef = useRef<HTMLElement>(null);
  function setSelectedId(id: string) {
    updateId(id);
    if (window.matchMedia("(max-width: 640px)").matches) {
      requestAnimationFrame(() => {
        detailRef.current?.focus({ preventScroll: true });
        detailRef.current?.scrollIntoView({
          block: "start",
          behavior: "instant",
        });
      });
    }
  }
  return { selectedId, setSelectedId, detailRef };
}

export function ViewSearch({
  value,
  onChange,
  label = "Kayıt ara",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <label className="view-search">
      <span>{label}</span>
      <input
        type="search"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ad veya başlık yaz…"
      />
    </label>
  );
}
export function FilterButtons({
  items,
  value,
  onChange,
  label,
}: {
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="view-filters" role="group" aria-label={label}>
      {items.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={value === item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function EmptyView({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty">
      <h2>Eşleşen kayıt yok.</h2>
      <p>Aramayı veya filtreyi değiştirerek yeniden dene.</p>
      <Button onClick={onReset}>Filtreleri temizle</Button>
    </div>
  );
}
export function DetailPrompt() {
  return (
    <div className="detail-prompt">
      <span aria-hidden="true">◇</span>
      <h2>Bir kayıt seç.</h2>
      <p>Ayrıntıları ve ilgili işlem tasarımlarını burada inceleyebilirsin.</p>
    </div>
  );
}
export function DesignAction({
  title,
  trigger,
  children,
}: {
  title: string;
  trigger: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button onClick={() => ref.current?.showModal()} aria-haspopup="dialog">
        {trigger}
      </Button>
      <dialog
        ref={ref}
        className="effect-dialog design-action"
        aria-label={title}
      >
        <div className="effect-header">
          <span className="sample-label">İşlem tasarımı</span>
          <Button
            aria-label="İşlem tasarımını kapat"
            onClick={() => ref.current?.close()}
          >
            ×
          </Button>
        </div>
        <h2>{title}</h2>
        {children}
        <p className="design-write-note">
          Bu alanlar yalnız yerel taslak içindir. Gerçek kayıt, yetki ve sürüm
          doğrulamasıyla backend üzerinden bağlanacak.
        </p>
        <form method="dialog" className="effect-footer">
          <Button type="submit">Taslağı kapat</Button>
          <span>Hiçbir işlem kaydedilmedi.</span>
        </form>
      </dialog>
    </>
  );
}
export function StateTag({ children }: { children: ReactNode }) {
  return <span className="view-state">{children}</span>;
}
export function InfoPairs({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="info-pairs">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
