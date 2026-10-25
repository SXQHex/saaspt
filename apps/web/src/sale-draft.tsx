"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people, products, money } from "./design-data";
import { DesignAction, InfoPairs, ViewSearch } from "./view-primitives";

function displayDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
}

export function SaleDraft({ product }: { product: (typeof products)[number] }) {
  const id = useId();
  const [personId, setPersonId] = useState("");
  const [query, setQuery] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const person = people.find((item) => item.id === personId);
  const students = people.filter(
    (item) =>
      item.roles.includes("Öğrenci") &&
      item.name
        .toLocaleLowerCase("tr-TR")
        .includes(query.trim().toLocaleLowerCase("tr-TR")),
  );
  function goTo(value: number) {
    setStep(value);
    requestAnimationFrame(() => {
      contentRef.current?.focus({ preventScroll: true });
      contentRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    });
  }
  return (
    <DesignAction title="Paket satış taslağı" trigger="Satış tasarımını incele">
      <p>
        {product.title} · Örnek katalog bedeli {money(product.price)}
      </p>
      <p>Satış isteği taslağı hak, borç veya tahsilat kaydı oluşturmaz.</p>
      <div
        ref={contentRef}
        tabIndex={-1}
        className="flow-content"
        aria-label="Satış adımı"
      >
        <ol className="flow-steps" aria-label="Satış adımları">
          {["Öğrenci", "Geçerlilik", "Kontrol"].map((label, index) => (
            <li key={label} aria-current={step === index ? "step" : undefined}>
              <span aria-hidden="true">{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        {step === 0 ? (
          <>
            <h3>Paket kimin için?</h3>
            <ViewSearch
              label="Satış için öğrenci ara"
              value={query}
              onChange={setQuery}
            />
            <fieldset className="flow-choices">
              <legend>Öğrenci seç</legend>
              {students.map((item) => (
                <label key={item.id}>
                  <input
                    type="radio"
                    name={`sale-person-${product.id}`}
                    checked={personId === item.id}
                    onChange={() => {
                      setPersonId(item.id);
                      setStart("");
                      setEnd("");
                      setError(false);
                    }}
                  />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.roles.join(" · ")}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            {students.length === 0 ? (
              <div className="flow-empty">
                <p>Bu aramada öğrenci bulunamadı.</p>
                <Button onClick={() => setQuery("")}>Aramayı temizle</Button>
              </div>
            ) : null}
            <p className="scope-note">
              {person
                ? `Seçili öğrenci: ${person.name}`
                : "Devam etmek için öğrenciyi seç."}
            </p>
            <Button disabled={!person} onClick={() => goTo(1)}>
              Geçerliliği belirle
            </Button>
          </>
        ) : step === 1 ? (
          <>
            <h3>{person?.name} için geçerlilik</h3>
            <InfoPairs
              rows={[
                ["Paket", product.title],
                ["Kapsam", product.scope],
                ["Kullanım", product.use],
                ["Hak / kota", product.credits],
              ]}
            />
            <form
              className="draft-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (end <= start) {
                  setError(true);
                  endRef.current?.focus();
                  return;
                }
                setError(false);
                goTo(2);
              }}
            >
              <label>
                Başlangıç tarihi
                <input
                  type="date"
                  name="sale-start-date"
                  required
                  value={start}
                  onChange={(event) => {
                    setStart(event.target.value);
                    setError(false);
                  }}
                />
              </label>
              <label>
                Bitiş sınırı
                <input
                  ref={endRef}
                  type="date"
                  name="sale-end-date"
                  required
                  value={end}
                  aria-invalid={error || undefined}
                  aria-describedby={error ? `${id}-date-error` : undefined}
                  onChange={(event) => {
                    setEnd(event.target.value);
                    setError(false);
                  }}
                />
              </label>
              {error ? (
                <p id={`${id}-date-error`} className="field-error" role="alert">
                  Bitiş sınırı başlangıçtan sonra olmalı.
                </p>
              ) : null}
              <p className="scope-note">
                Başlangıç dahil, bitiş hariçtir. Bitiş tarihi paket adına göre
                otomatik hesaplanmaz; iki tarihi de açıkça seç.
              </p>
              <div className="draft-actions">
                <Button type="button" onClick={() => goTo(0)}>
                  Öğrenciye dön
                </Button>
                <Button type="submit">Satış isteğini incele</Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h3>Satış öncesi kontrol</h3>
            <InfoPairs
              rows={[
                ["Öğrenci", person?.name],
                ["Paket", product.title],
                ["Başlangıç (dahil)", displayDate(start)],
                ["Bitiş sınırı (hariç)", displayDate(end)],
                ["Örnek katalog bedeli", money(product.price)],
                ["Ödeme durumu", "Bu akışta tahsilat yapılmadı"],
              ]}
            />
            <div className="flow-notice">
              <strong>Gerçek satış önizlemesi henüz alınmadı.</strong>
              <p>
                Kesin ürün sürümü, kapsam, fiyat, borç ve hak etkileri canlı
                önizlemede birlikte doğrulanmalıdır. Örnek bedel, kesin borç
                veya alınmış ödeme değildir.
              </p>
            </div>
            <p className="scope-note">
              Satış ve tahsilat ayrı işlemlerdir. Bu ekran mevcut borçtan alacak
              düşmez, yeni hak veya rezervasyon üretmez.
            </p>
            <Button onClick={() => goTo(1)}>Satış seçimlerini düzenle</Button>
          </>
        )}
      </div>
    </DesignAction>
  );
}
