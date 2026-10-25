"use client";

import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people } from "./design-data";
import type { DemoSession } from "./demo-program";
import { DesignAction, InfoPairs, ViewSearch } from "./view-primitives";

const students = people.filter((person) => person.roles.includes("Öğrenci"));
// Presentation candidates only: inclusion is not a server eligibility result.
const sampleRights = [
  {
    id: "sample-right-a",
    personId: "person-a",
    title: "Salsa ders hakkı",
    detail: "Merkez Stüdyo · 3 kullanılabilir, 1 ayrılmış",
  },
  {
    id: "sample-right-b",
    personId: "person-a",
    title: "Süreli ders hakkı",
    detail: "Merkez Stüdyo · tarih ve kota kontrolü bekliyor",
  },
  {
    id: "sample-right-c",
    personId: "person-b",
    title: "Bachata ders hakkı",
    detail: "Merkez Stüdyo · 5 kullanılabilir, 2 ayrılmış",
  },
  {
    id: "sample-right-d",
    personId: "person-c",
    title: "Salsa ders hakkı",
    detail: "Merkez Stüdyo · 4 kullanılabilir, 0 ayrılmış",
  },
  {
    id: "sample-right-e",
    personId: "person-e",
    title: "Pilates ders hakkı",
    detail: "Merkez Stüdyo · 1 kullanılabilir, 1 ayrılmış",
  },
];
const steps = ["Öğrenci", "Hak ve kayıt türü", "Kontrol"];

export function ReservationDraft({ session }: { session: DemoSession }) {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [personId, setPersonId] = useState("");
  const [rightId, setRightId] = useState("");
  const [mode, setMode] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const person = students.find((item) => item.id === personId);
  const right = sampleRights.find(
    (item) => item.id === rightId && item.personId === personId,
  );
  const visible = students.filter((item) =>
    item.name
      .toLocaleLowerCase("tr-TR")
      .includes(query.trim().toLocaleLowerCase("tr-TR")),
  );
  function goTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      contentRef.current?.focus({ preventScroll: true });
      contentRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    });
  }
  return (
    <DesignAction
      title="Rezervasyon taslağı"
      trigger="Rezervasyon tasarımını incele"
    >
      <p>
        {session.title} · {session.day} Ekim 2026 · {session.start}–
        {session.end} · Salon {session.room}
      </p>
      <p>
        Sentetik kişi ve hak örnekleri. Bu adımlar yer ayırmaz; uygunluk
        doğrulaması yapmaz.
      </p>
      <div
        ref={contentRef}
        tabIndex={-1}
        className="flow-content"
        aria-label={steps[step]}
      >
        <p className="section-caption">
          {session.title} · {session.day} Ekim · {session.start}–{session.end}
        </p>
        <ol className="flow-steps" aria-label="Rezervasyon adımları">
          {steps.map((label, index) => (
            <li key={label} aria-current={step === index ? "step" : undefined}>
              <span aria-hidden="true">{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        {step === 0 ? (
          <>
            <h3>Hangi öğrenci için?</h3>
            <ViewSearch
              label="Rezervasyon için öğrenci ara"
              value={query}
              onChange={setQuery}
            />
            <fieldset className="flow-choices">
              <legend>Öğrenci seç</legend>
              {visible.map((item) => (
                <label key={item.id}>
                  <input
                    type="radio"
                    name={`booking-person-${session.id}`}
                    value={item.id}
                    checked={personId === item.id}
                    onChange={() => {
                      setPersonId(item.id);
                      setRightId("");
                      setMode("");
                    }}
                  />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.roles.join(" · ")}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            {visible.length === 0 ? (
              <div className="flow-empty">
                <p>Bu aramada öğrenci bulunamadı.</p>
                <Button onClick={() => setQuery("")}>Aramayı temizle</Button>
              </div>
            ) : null}
            {person ? (
              <p className="scope-note">Seçili öğrenci: {person.name}</p>
            ) : (
              <p className="scope-note">Devam etmek için bir öğrenci seç.</p>
            )}
            <Button disabled={!person} onClick={() => goTo(1)}>
              Hak seçimine geç
            </Button>
          </>
        ) : step === 1 ? (
          <>
            <h3>{person?.name} için kaynak hakkı seç</h3>
            <p className="scope-note">
              Listede görünmesi bu derse uygun olduğu anlamına gelmez. Tarih,
              kapsam, kota, dondurma ve belge koşulları gerçek işlemde kontrol
              edilir.
            </p>
            <fieldset className="flow-choices">
              <legend>Kullanılacak hak</legend>
              <label>
                <input
                  type="radio"
                  name={`booking-right-${session.id}`}
                  checked={rightId === "auto"}
                  onChange={() => setRightId("auto")}
                />
                <span>
                  <strong>Uygun hakkı işlem sırasında belirle</strong>
                  <small>Kesin kaynak seçimi canlı koşullara bağlıdır.</small>
                </span>
              </label>
              {sampleRights
                .filter((item) => item.personId === personId)
                .map((item) => (
                  <label key={item.id}>
                    <input
                      type="radio"
                      name={`booking-right-${session.id}`}
                      checked={rightId === item.id}
                      onChange={() => setRightId(item.id)}
                    />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </span>
                  </label>
                ))}
            </fieldset>
            <fieldset className="flow-choices">
              <legend>Kayıt türü</legend>
              {["Esnek", "Öncelikli"].map((label) => (
                <label key={label}>
                  <input
                    type="radio"
                    name={`booking-mode-${session.id}`}
                    checked={mode === label}
                    onChange={() => setMode(label)}
                  />
                  <span>
                    <strong>{label}</strong>
                    <small>
                      Destek ve uygunluk, seçilen hak ve sınıf koşullarıyla
                      doğrulanır.
                    </small>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="draft-actions">
              <Button onClick={() => goTo(0)}>Öğrenciye dön</Button>
              <Button
                disabled={!mode || (!right && rightId !== "auto")}
                onClick={() => goTo(2)}
              >
                Kontrol özetini incele
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3>Rezervasyon öncesi kontrol</h3>
            <InfoPairs
              rows={[
                ["Öğrenci", person?.name],
                ["Ders", session.title],
                ["Hak kaynağı", right?.title ?? "İşlem sırasında belirlenecek"],
                ["Kayıt türü", mode],
                [
                  "Örnek kontenjan",
                  `${session.participants} / ${session.capacity}`,
                ],
              ]}
            />
            <div className="flow-notice">
              <strong>Henüz rezervasyon oluşmadı.</strong>
              <p>
                Güncel kapasite, hak, belge, plan ve yetki kontrolü bekliyor.
                Buradaki kontenjan bilgisi bir yer garantisi değildir.
              </p>
            </div>
            {session.participants === session.capacity ? (
              <p className="scope-note">
                Örnek kontenjan dolu. Canlı kapasite ve varsa bekleme listesi
                koşulları incelenmeden kayıt sözü verilemez.
              </p>
            ) : null}
            <ul
              className="flow-checklist"
              aria-label="Doğrulama bekleyen kontroller"
            >
              <li>Canlı kapasite ve mevcut kayıt</li>
              <li>Hakkın bu ders için geçerliliği ve kullanılabilirliği</li>
              <li>Belge, katılım koşulları ve işlem yetkisi</li>
            </ul>
            <Button onClick={() => goTo(1)}>Seçimleri düzenle</Button>
            <p className="scope-note">
              Gerçek kayıt bağlantısı kurulunca sonuç burada gösterilecek. Bu
              taslak hak tüketmez veya ayırmaz.
            </p>
          </>
        )}
      </div>
    </DesignAction>
  );
}
