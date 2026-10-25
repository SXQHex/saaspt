"use client";

import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import type { DemoSession } from "./demo-program";
import { people } from "./design-data";
import { DesignAction, InfoPairs } from "./view-primitives";

// Isolated recorded-state examples, unrelated to live attendance or capacity.
const recordedStudents = people.filter((person) =>
  person.roles.includes("Öğrenci"),
);
const resultNames = { attended: "Katıldı", no_show: "Gelmedi" };
function useDraftReview() {
  const [review, setReview] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  function showReview() {
    setReview(true);
    requestAnimationFrame(() => {
      summaryRef.current?.focus({ preventScroll: true });
      summaryRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    });
  }
  return { review, setReview, summaryRef, showReview };
}

export function ReservationCancelDraft({ session }: { session: DemoSession }) {
  const [personId, setPersonId] = useState("");
  const [reason, setReason] = useState("");
  const { review, setReview, summaryRef, showReview } = useDraftReview();
  const person = recordedStudents.find((item) => item.id === personId);
  return (
    <DesignAction
      title="Rezervasyon iptal taslağı"
      trigger="Rezervasyon iptal örneği"
    >
      <p>
        {session.title} · {session.start}–{session.end}
      </p>
      <div className="flow-notice">
        <strong>Bu liste ayrı bir kayıt örneğidir.</strong>
        <p>
          Aşağıdaki sentetik aktif rezervasyonlar dersin canlı katılımcı listesi
          değildir. İptal işlemi yapılmaz.
        </p>
      </div>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (person && reason.trim()) showReview();
        }}
      >
        <fieldset className="flow-choices">
          <legend>İptali incelenecek örnek rezervasyon</legend>
          {recordedStudents.map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name={`cancel-${session.id}`}
                checked={personId === item.id}
                onChange={() => {
                  setPersonId(item.id);
                  setReview(false);
                }}
              />
              <span>
                <strong>{item.name}</strong>
                <small>Sentetik aktif rezervasyon</small>
              </span>
            </label>
          ))}
        </fieldset>
        <label>
          İptal gerekçesi
          <textarea
            name="cancel-reason"
            autoComplete="off"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setReview(false);
            }}
          />
        </label>
        <p className="scope-note">
          İptal edilecek kayıt ve gerekçe açıkça seçilmelidir.
        </p>
        <Button type="submit" disabled={!person || !reason.trim()}>
          İptal isteğini incele
        </Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>İptal isteği taslağı</h3>
          <InfoPairs
            rows={[
              ["Öğrenci", person?.name],
              ["Mevcut durum", "Örnek aktif rezervasyon"],
              ["İstenen işlem", "Rezervasyon iptali"],
              ["Gerekçe", reason.trim()],
            ]}
          />
          <p>
            İptal henüz gerçekleşmedi. Güncel kayıt sürümü, yetki ve iptal
            koşulları kontrol edilmeden sonuç kesinleşmez.
          </p>
          <p>
            Hak iadesi, tüketim veya parasal etki bu taslakta hesaplanmaz.
            İptal, nakit iade yapıldığı anlamına gelmez.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}

export function AttendanceCorrectionDraft({
  session,
}: {
  session: DemoSession;
}) {
  const [personId, setPersonId] = useState("");
  const [result, setResult] = useState<"attended" | "no_show" | "">("");
  const [reason, setReason] = useState("");
  const { review, setReview, summaryRef, showReview } = useDraftReview();
  const person = recordedStudents.find((item) => item.id === personId);
  const previous = personId === "person-b" ? "no_show" : "attended";
  const changed = Boolean(person && result && result !== previous);
  return (
    <DesignAction
      title="Kapanmış yoklama düzeltme taslağı"
      trigger="Kapanmış yoklama düzeltme örneği"
    >
      <p>
        {session.title} · {session.start}–{session.end}
      </p>
      <div className="flow-notice">
        <strong>Bağımsız kapanmış yoklama örneği</strong>
        <p>
          Dersin saati veya mevcut taslak işaretleri kapanmış kabul edilmez.
          Aşağıdaki geçmiş sonuçlar yalnız bu düzeltme senaryosuna aittir.
        </p>
      </div>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (changed && reason.trim()) showReview();
        }}
      >
        <fieldset className="flow-choices">
          <legend>Düzeltilecek öğrenci</legend>
          {recordedStudents.map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name={`correct-person-${session.id}`}
                checked={personId === item.id}
                onChange={() => {
                  setPersonId(item.id);
                  setResult("");
                  setReview(false);
                }}
              />
              <span>
                <strong>{item.name}</strong>
                <small>
                  Kapanıştaki örnek sonuç:{" "}
                  {item.id === "person-b" ? "Gelmedi" : "Katıldı"}
                </small>
              </span>
            </label>
          ))}
        </fieldset>
        {person ? (
          <>
            <p className="scope-note">
              Kapanıştaki sonuç: <strong>{resultNames[previous]}</strong>
            </p>
            <fieldset className="flow-choices">
              <legend>Yeni sonuç</legend>
              {(["attended", "no_show"] as const).map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name={`correct-result-${session.id}`}
                    checked={result === value}
                    onChange={() => {
                      setResult(value);
                      setReview(false);
                    }}
                  />
                  <span>
                    <strong>{resultNames[value]}</strong>
                    {value === previous ? <small>Mevcut sonuç</small> : null}
                  </span>
                </label>
              ))}
            </fieldset>
            {result && !changed ? (
              <p className="scope-note">
                Sonuç değişmedi. İncelemek için farklı bir sonuç seç.
              </p>
            ) : null}
            <label>
              Düzeltme gerekçesi
              <textarea
                name="correction-reason"
                autoComplete="off"
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setReview(false);
                }}
              />
            </label>
          </>
        ) : (
          <p className="scope-note">
            Yeni sonuç ve gerekçe için önce öğrenciyi seç.
          </p>
        )}
        <Button type="submit" disabled={!changed || !reason.trim()}>
          Düzeltme isteğini incele
        </Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Düzeltme için etki kontrolü gerekiyor</h3>
          <InfoPairs
            rows={[
              ["Öğrenci", person?.name],
              ["Kapanıştaki sonuç", resultNames[previous]],
              ["Önerilen sonuç", result ? resultNames[result] : ""],
              ["Gerekçe", reason.trim()],
            ]}
          />
          <p>
            Bu yalnız istek özeti; gerçek etki önizlemesi alınmadı. Hak ve varsa
            hakediş etkileri güncel kayıt üzerinden sunucuda
            değerlendirilmelidir.
          </p>
          <p>
            Düzeltme geçmiş kapanışı silmez ve seansı yeniden açmaz. Gerçek
            düzeltme yapılmadı.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
