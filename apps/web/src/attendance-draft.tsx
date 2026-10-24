"use client";

import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people } from "./design-data";
import { DesignAction } from "./view-primitives";

export function AttendanceDraft({ title }: { title: string }) {
  const participants = people.filter((person) =>
    person.roles.includes("Öğrenci"),
  );
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
  const [onlyPending, setOnlyPending] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pendingFilterRef = useRef<HTMLInputElement>(null);
  const marked = participants.filter((person) => marks[person.id]).length;
  const pending = participants.length - marked;
  const present = participants.filter(
    (person) => marks[person.id] === "attended",
  ).length;
  const absent = participants.filter(
    (person) => marks[person.id] === "no_show",
  ).length;
  const visible = participants.filter(
    (person) => !onlyPending || !marks[person.id],
  );
  return (
    <DesignAction title="Yoklama taslağı" trigger="Yoklama tasarımını aç">
      <p>
        {title} · {participants.length} kişilik sentetik liste
      </p>
      <p>
        Taslak işaretler hak tüketmez. Gerçek kapanış ve düzeltme ayrı
        işlemlerdir.
      </p>
      <div className="attendance-progress">
        <p aria-live="polite">
          {marked} / {participants.length} sonuç işaretlendi.
        </p>
        <progress
          value={marked}
          max={participants.length}
          aria-label="Yoklama ilerlemesi"
        />
        <p>
          {present} katıldı · {absent} gelmedi · {pending} bekliyor
        </p>
      </div>
      <label className="attendance-pending-filter">
        <input
          ref={pendingFilterRef}
          type="checkbox"
          checked={onlyPending}
          onChange={(event) => setOnlyPending(event.target.checked)}
        />
        Yalnız bekleyenler
      </label>
      {onlyPending && pending === 0 ? (
        <div className="attendance-complete">
          <strong>Tüm öğrenciler işaretlendi.</strong>
          <p>Özeti inceleyebilir veya seçimlerini kontrol edebilirsin.</p>
          <button
            type="button"
            onClick={() => {
              setOnlyPending(false);
              requestAnimationFrame(() =>
                listRef.current
                  ?.querySelector<HTMLInputElement>("input:checked")
                  ?.focus(),
              );
            }}
          >
            Tüm öğrencileri göster
          </button>
        </div>
      ) : null}
      <div ref={listRef} className="attendance-list">
        {visible.map((person) => (
          <fieldset key={person.id} className="attendance-person">
            <legend>{person.name}</legend>
            <div className="attendance-options">
              {[
                { value: "", label: "Bekliyor" },
                { value: "attended", label: "Katıldı" },
                { value: "no_show", label: "Gelmedi" },
              ].map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    aria-label={option.label}
                    name={`attendance-${person.id}`}
                    value={option.value}
                    checked={(marks[person.id] ?? "") === option.value}
                    onChange={() => {
                      setMarks((value) => ({
                        ...value,
                        [person.id]: option.value,
                      }));
                      setReview(false);
                      if (onlyPending && option.value) {
                        const index = visible.indexOf(person);
                        requestAnimationFrame(() => {
                          const rows =
                            listRef.current?.querySelectorAll("fieldset");
                          const next = rows?.[Math.min(index, rows.length - 1)];
                          const input =
                            next?.querySelector<HTMLInputElement>(
                              "input:checked",
                            );
                          (input ?? pendingFilterRef.current)?.focus();
                        });
                      }
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <Button
        disabled={marked !== participants.length}
        onClick={() => {
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
        Kapanış özetini incele
      </Button>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>İşaretler kontrol için hazır.</h3>
          <p>
            {present} katıldı, {absent} gelmedi.
          </p>
          <p>
            Hak ve hakediş etkileri bu ekranda hesaplanmaz. Gerçek kapanış
            yapılmadı.
          </p>
        </div>
      ) : (
        <p className="scope-note">
          Özeti incelemek için bütün sonuçları işaretle.
        </p>
      )}
    </DesignAction>
  );
}
