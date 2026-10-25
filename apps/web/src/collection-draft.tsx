"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people } from "./design-data";
import { DesignAction, InfoPairs } from "./view-primitives";
import { formatTryMinor, parsePositiveTryMinor } from "./money-input";

// Selected debt examples only. Not a full ledger or an API response projection.
const sampleDebts = [
  {
    id: "sample-debt-a1",
    personId: "person-a",
    title: "Örnek paket satış borcu",
    remainingMinor: "80000",
  },
  {
    id: "sample-debt-a2",
    personId: "person-a",
    title: "Örnek ders satış borcu",
    remainingMinor: "40000",
  },
  {
    id: "sample-debt-b1",
    personId: "person-b",
    title: "Örnek paket satış borcu",
    remainingMinor: "45000",
  },
  {
    id: "sample-debt-e1",
    personId: "person-e",
    title: "Örnek paket satış borcu",
    remainingMinor: "80000",
  },
];

// Format the entered wall clock only; no UTC instant is derived for a request.
function displayWallTime(value: string) {
  const date = new Date(`${value}Z`);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(date);
}

export function CollectionDraft({
  person,
}: {
  person: (typeof people)[number];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [note, setNote] = useState("");
  const [review, setReview] = useState(false);
  const [error, setError] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const debts = sampleDebts.filter((item) => item.personId === person.id);
  const selected = debts.filter((item) => selectedIds.includes(item.id));
  const minor = parsePositiveTryMinor(amount);
  const remaining = selected.reduce(
    (sum, item) => sum + BigInt(item.remainingMinor),
    0n,
  );
  const exceeds = minor && selected.length > 0 && BigInt(minor) > remaining;
  return (
    <DesignAction
      title="Manuel tahsilat taslağı"
      trigger="Tahsilat tasarımını aç"
    >
      <p>{person.name} · Merkez Stüdyo · TRY</p>
      <p>
        Bu akış seçili borçlara tahsilat isteği hazırlamayı gösterir. Borçlar ve
        tutarlar sentetiktir; bakiye değişmez.
      </p>
      {debts.length === 0 ? (
        <div className="flow-empty">
          <strong>Bu örnekte seçilecek açık borç yok.</strong>
          <p>
            Bu taslak yalnız seçili borca bağlı tahsilatı kapsar; diğer tahsilat
            biçimleri burada modellenmedi.
          </p>
        </div>
      ) : (
        <form
          className="draft-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!minor) {
              setError(true);
              amountRef.current?.focus();
              return;
            }
            if (selected.length === 0) return;
            setError(false);
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
          <fieldset className="flow-choices">
            <legend>Bağlanacak borçları seç</legend>
            {debts.map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  name={`collection-debts-${person.id}`}
                  checked={selectedIds.includes(item.id)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setSelectedIds((value) =>
                      checked
                        ? [...value, item.id]
                        : value.filter((debtId) => debtId !== item.id),
                    );
                    setReview(false);
                  }}
                />
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    Örnek kalan: {formatTryMinor(item.remainingMinor)}
                  </small>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="scope-note">
            {selected.length > 0
              ? `${selected.length} borç seçildi. Örnek kalan toplamı ${formatTryMinor(String(remaining))}.`
              : "Bu taslakta devam etmek için en az bir borç seç."}
          </p>
          <label>
            Tahsilat tutarı (TRY)
            <input
              ref={amountRef}
              name="collection-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              required
              value={amount}
              aria-invalid={error || undefined}
              aria-describedby={
                error ? `${id}-amount-error` : `${id}-amount-hint`
              }
              placeholder="Örn. 400,50"
              onChange={(event) => {
                setAmount(event.target.value);
                setError(false);
                setReview(false);
              }}
            />
          </label>
          {error ? (
            <p id={`${id}-amount-error`} className="field-error" role="alert">
              Sıfırdan büyük bir tutar gir. Binlik ayıracı kullanma; kuruş için
              virgül veya nokta ile en fazla 2 basamak yaz.
            </p>
          ) : null}
          <p id={`${id}-amount-hint`} className="scope-note">
            Örneğin 400,50 veya 400.50. Tutar kuruş hassasiyetiyle incelenir.
          </p>
          {exceeds ? (
            <div className="flow-notice">
              <strong>Tutar, seçili örnek borç toplamından fazla.</strong>
              <p>
                Dağıtım ve varsa öğrenci alacağı sonucu canlı işlemde
                belirlenir. Burada otomatik mahsup veya iade yapılmaz.
              </p>
            </div>
          ) : null}
          <label>
            Tahsilat zamanı (Europe/Istanbul)
            <input
              type="datetime-local"
              name="collection-occurred-at"
              required
              value={occurredAt}
              onChange={(event) => {
                setOccurredAt(event.target.value);
                setReview(false);
              }}
            />
          </label>
          <p className="scope-note">
            Paranın gerçekte alındığı zamanı belirt. Bu yerel saat önerisidir;
            gerçek istekte saat dilimi ve kesin an ayrıca doğrulanır.
          </p>
          <label>
            Açıklama
            <textarea
              name="collection-note"
              autoComplete="off"
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setReview(false);
              }}
              placeholder="Örnek tahsilat açıklaması…"
            />
          </label>
          <Button type="submit" disabled={selected.length === 0}>
            Tahsilat taslağını incele
          </Button>
        </form>
      )}
      {review && minor ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Kontrol edilecek tahsilat isteği</h3>
          <InfoPairs
            rows={[
              ["Öğrenci", person.name],
              ["Tutar", formatTryMinor(minor)],
              ["Seçili borçlar", selected.map((item) => item.title).join(", ")],
              ["Yerel gerçekleşme zamanı", displayWallTime(occurredAt)],
              ["Saat dilimi", "Europe/Istanbul"],
              ["Açıklama", note.trim() || "Belirtilmedi"],
            ]}
          />
          <p>
            Bu bir tahsilat makbuzu değildir. Canlı borç, dağıtım ve yetki
            doğrulanmadı; bakiye değişmedi.
          </p>
          <p>
            Seçilen borçların gerçek dağıtımı ve varsa alacak sonucu sunucudan
            alınmalıdır. Öğrenci alacağı borçtan otomatik düşülmez.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
