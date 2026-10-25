"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import type { DemoSession } from "./demo-program";
import { DesignAction } from "./view-primitives";

type LocalFields = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  room: string;
};
const dateLabel = (date: string) => {
  const value = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(value.valueOf())) return date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
};

export function SessionChangeDraft({ session }: { session: DemoSession }) {
  const date = `2026-10-${String(session.day).padStart(2, "0")}`;
  const initial: LocalFields = {
    startDate: date,
    startTime: session.start,
    endDate: date,
    endTime: session.end,
    room: session.room,
  };
  const [draft, setDraft] = useState(initial);
  const [scope, setScope] = useState("single");
  const [reason, setReason] = useState("");
  const [review, setReview] = useState(false);
  const [error, setError] = useState<"" | "interval">("");
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const dirty = (Object.keys(initial) as (keyof LocalFields)[]).some(
    (key) => draft[key] !== initial[key],
  );
  function change(field: keyof LocalFields, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setReview(false);
    setError("");
  }
  function reset() {
    setDraft(initial);
    setReason("");
    setScope("single");
    setReview(false);
    setError("");
    startRef.current?.focus();
  }
  const comparison = [
    {
      label: "Başlangıç",
      before: `${dateLabel(initial.startDate)} ${initial.startTime}`,
      after: draft.startDate
        ? `${dateLabel(draft.startDate)} ${draft.startTime}`
        : "",
    },
    {
      label: "Bitiş",
      before: `${dateLabel(initial.endDate)} ${initial.endTime}`,
      after: draft.endDate
        ? `${dateLabel(draft.endDate)} ${draft.endTime}`
        : "",
    },
    {
      label: "Salon",
      before: `Salon ${initial.room}`,
      after: `Salon ${draft.room}`,
    },
  ].filter((row) => row.before !== row.after);
  return (
    <DesignAction
      title="Ders değişikliği taslağı"
      trigger="Ders değişikliğini tasarla"
    >
      <p>
        {session.title} · {session.day} Ekim 2026 · {session.start}–
        {session.end}
      </p>
      <p>
        Örnek plan üzerinden öneri hazırla. Saatin geçmiş olması dersin
        gerçekleştiği anlamına gelmez; gerçek değiştirilebilirlik henüz
        doğrulanmadı.
      </p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (
            `${draft.endDate}T${draft.endTime}` <=
            `${draft.startDate}T${draft.startTime}`
          ) {
            setError("interval");
            endRef.current?.focus();
            return;
          }
          if (!dirty || !reason.trim()) return;
          setError("");
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
        <fieldset className="session-edit-group">
          <legend>Merkez saatinde zaman</legend>
          <p className="scope-note">
            Europe/Istanbul. Bu alanlar yerel saat önerisidir; UTC dönüşümü ve
            varsa belirsiz/geçersiz saat kontrolü henüz yapılmaz.
          </p>
          <div className="session-edit-grid">
            <label>
              Başlangıç tarihi
              <input
                ref={startRef}
                type="date"
                name="session-start-date"
                required
                value={draft.startDate}
                onChange={(event) => change("startDate", event.target.value)}
              />
            </label>
            <label>
              Başlangıç saati
              <input
                type="time"
                name="session-start-time"
                required
                value={draft.startTime}
                onChange={(event) => change("startTime", event.target.value)}
              />
            </label>
            <label>
              Bitiş tarihi
              <input
                ref={endRef}
                type="date"
                name="session-end-date"
                required
                value={draft.endDate}
                aria-invalid={error === "interval" || undefined}
                aria-describedby={
                  error === "interval" ? `${id}-interval-error` : undefined
                }
                onChange={(event) => change("endDate", event.target.value)}
              />
            </label>
            <label>
              Bitiş saati
              <input
                type="time"
                name="session-end-time"
                required
                value={draft.endTime}
                aria-invalid={error === "interval" || undefined}
                onChange={(event) => change("endTime", event.target.value)}
              />
            </label>
          </div>
          {error === "interval" ? (
            <p id={`${id}-interval-error`} className="field-error" role="alert">
              Bitiş, başlangıçtan sonra olmalı. Geceyi aşan ders için bitiş
              tarihini ilerlet.
            </p>
          ) : null}
        </fieldset>
        <fieldset className="session-edit-group">
          <legend>Salon ve kapasite</legend>
          <label htmlFor={`${id}-room`}>Örnek salon</label>
          <select
            id={`${id}-room`}
            name="session-room"
            value={draft.room}
            onChange={(event) => change("room", event.target.value)}
          >
            <option value="A">Salon A</option>
            <option value="B">Salon B</option>
          </select>
          <p className="scope-note">
            Salonun bu zamanda boş olduğu veya derse uygun olduğu henüz
            doğrulanmadı.
          </p>
          <div className="capacity-contract-note">
            <strong>Oda kapasitesi ve seans kontenjanı ayrı olacak.</strong>
            <p>
              Odanın kapasitesi seansın öğrenci sınırı değildir. Seans toplam
              kişi sayısıyla veya erkek/kadın kontenjanlarıyla
              sınırlandırılabilecek.
            </p>
            <dl
              className="capacity-examples"
              aria-label="Yeni kapasite modeli örnekleri"
            >
              <div>
                <dt>Örnek oda</dt>
                <dd>50 kişi</dd>
              </div>
              <div>
                <dt>Toplam kontenjan örneği</dt>
                <dd>30 kişi</dd>
              </div>
              <div>
                <dt>Erkek/kadın örneği</dt>
                <dd>10 erkek + 10 kadın</dd>
              </div>
            </dl>
            <p>
              Bunlar seçenek örnekleridir; seçili salonun gerçek kapasitesi veya
              bu dersin kontenjanı değildir.
            </p>
            <p>
              Nominal/azami limitlerle ilişkisi sözleşmede netleşeceği için
              kapasite düzenleme henüz açılmadı. Bu form yalnız saat ve salon
              önerisini inceler.
            </p>
          </div>
        </fieldset>
        <fieldset className="flow-choices">
          <legend>Değişiklik kapsamı</legend>
          <label>
            <input
              type="radio"
              name={`change-scope-${session.id}`}
              checked={scope === "single"}
              onChange={() => {
                setScope("single");
                setReview(false);
              }}
            />
            <span>
              <strong>Yalnız bu ders</strong>
              <small>Diğer oluşumlar değişiklik isteğine dahil edilmez.</small>
            </span>
          </label>
          <label>
            <input
              type="radio"
              name={`change-scope-${session.id}`}
              disabled={!session.programTitle}
              checked={scope === "this_and_future"}
              onChange={() => {
                setScope("this_and_future");
                setReview(false);
              }}
            />
            <span>
              <strong>Bu ve sonraki dersler</strong>
              <small>
                {session.programTitle
                  ? `Aynı programdaki gelecekteki açık oluşumlar: ${session.programTitle}`
                  : "Bu örnek tekil ders. Programa bağlı olmadığı için seri kapsamı kullanılamaz."}
              </small>
            </span>
          </label>
        </fieldset>
        <label>
          Değişiklik gerekçesi
          <textarea
            name="session-change-reason"
            autoComplete="off"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setReview(false);
            }}
          />
        </label>
        <p className="scope-note">
          {dirty
            ? "Önce yerel öneriyi incele. Henüz ders veya rezervasyon değişmedi."
            : "İncelemek için saat veya salonda değişiklik yap."}
        </p>
        <div className="draft-actions">
          <Button type="submit" disabled={!dirty || !reason.trim()}>
            Değişiklik özetini incele
          </Button>
          <Button
            type="button"
            disabled={!dirty && !reason && scope === "single"}
            onClick={reset}
          >
            Değişiklikleri geri al
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
          <h3>Önerilen değişiklikler</h3>
          <div
            className="session-comparison"
            tabIndex={0}
            role="region"
            aria-label="Mevcut ve önerilen ders değerleri"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Alan</th>
                  <th scope="col">Mevcut</th>
                  <th scope="col">Önerilen</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.before}</td>
                    <td>{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong>Kapsam:</strong>{" "}
            {scope === "single" ? "Yalnız bu ders" : "Bu ve sonraki dersler"}
          </p>
          <p>
            <strong>Gerekçe:</strong> {reason.trim()}
          </p>
          {scope === "this_and_future" ? (
            <p>
              Bu tablo yalnız seçili dersi karşılaştırır. Aynı programdaki
              etkilenecek gerçek oluşumlar canlı önizlemede listelenmelidir;
              geçmiş veya sonuçlanmış dersler bu kapsamla değiştirilmez.
            </p>
          ) : null}
          <div className="flow-notice">
            <strong>Canlı etki önizlemesi bekleniyor.</strong>
            <p>
              Salon/eğitmen çakışması, görevler, mevcut rezervasyonların
              hak/kota/geçerliliği ve erişim birlikte kontrol edilmelidir.
              Engeller çözülmeden değişiklik kesinleşmez.
            </p>
          </div>
          <p>
            Gerçek değişiklik yapılmadı. Güncel ve engelleri çözülmüş önizleme
            olmadan onay veya uygulama sunulmaz.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
