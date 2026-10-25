"use client";
import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people } from "./design-data";
import type { DemoSession } from "./demo-program";
import {
  DesignAction,
  InfoPairs,
  FilterButtons,
  useLocalReview,
} from "./view-primitives";

export function ProgramDraft() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [room, setRoom] = useState("A");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLInputElement>(null);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  function invalidate() {
    setReview(false);
    setError("");
  }
  return (
    <DesignAction
      title="Sonlu program taslağı"
      trigger="Program planını hazırla"
    >
      <p>Salsa başlangıç sınıfı · Merkez Stüdyo · sentetik sınıf örneği</p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (end <= start) {
            setError("Bitiş sınırı başlangıçtan sonra olmalı.");
            endRef.current?.focus();
            return;
          }
          if (!days.length) {
            setError("En az bir program günü seç.");
            return;
          }
          if (
            !Number.isSafeInteger(Number(duration)) ||
            Number(duration) <= 0
          ) {
            setError("Süre pozitif tam dakika olmalı.");
            return;
          }
          showReview();
        }}
      >
        <label>
          Program başlangıcı
          <input
            type="date"
            required
            name="planning-drafts-start"
            value={start}
            onChange={(event) => {
              setStart(event.target.value);
              invalidate();
            }}
          />
        </label>
        <label>
          Program bitiş sınırı
          <input
            ref={endRef}
            type="date"
            required
            name="planning-drafts-end"
            value={end}
            onChange={(event) => {
              setEnd(event.target.value);
              invalidate();
            }}
          />
        </label>
        <fieldset className="flow-choices">
          <legend>Haftanın günleri</legend>
          {[
            "Pazartesi",
            "Salı",
            "Çarşamba",
            "Perşembe",
            "Cuma",
            "Cumartesi",
            "Pazar",
          ].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={days.includes(day)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setDays((value) =>
                    checked
                      ? [...value, day]
                      : value.filter((item) => item !== day),
                  );
                  invalidate();
                }}
              />
              <span>{day}</span>
            </label>
          ))}
        </fieldset>
        <label>
          Yerel başlangıç saati
          <input
            type="time"
            required
            name="planning-drafts-time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value);
              invalidate();
            }}
          />
        </label>
        <label>
          Ders süresi (dakika)
          <input
            type="number"
            min="1"
            step="1"
            required
            name="planning-drafts-duration"
            value={duration}
            onChange={(event) => {
              setDuration(event.target.value);
              invalidate();
            }}
          />
        </label>
        <label htmlFor="program-sample-room">Örnek salon</label>
        <select
          id="program-sample-room"
          name="planning-drafts-room"
          value={room}
          onChange={(event) => {
            setRoom(event.target.value);
            invalidate();
          }}
        >
          <option value="A">Salon A</option>
          <option value="B">Salon B</option>
        </select>
        <p className="scope-note">
          Europe/Istanbul · Başlangıç dahil, bitiş hariç. Sınıf görevlerinin
          miras alınması gerçek görev/anlaşma uygunluğunun doğrulandığı anlamına
          gelmez.
        </p>
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit">Program isteğini incele</Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Sonlu program isteği</h3>
          <InfoPairs
            rows={[
              ["Tarih aralığı", `${start} → ${end} (bitiş hariç)`],
              ["Günler", days.join(", ")],
              ["Başlangıç", time],
              ["Süre", `${duration} dakika`],
              ["Salon", `Salon ${room}`],
            ]}
          />
          <p>
            Somut seans listesi, DST/offset, görevler, çakışmalar ve hak
            uygunluğu canlı önizlemede hesaplanmalı. İstemci seans veya
            rezervasyon üretmedi.
          </p>
          <div className="flow-notice">
            <strong>Kapasite sözleşmesi bekleniyor.</strong>
            <p>
              Toplam/erkek-kadın kontenjanı ile nominal/azami ilişki netleşmeden
              kapasite alanları tamamlanamaz. Bu istek uygulanabilir veya
              engelleri çözülmüş program değildir.
            </p>
          </div>
        </div>
      ) : null}
    </DesignAction>
  );
}

export function WaitlistDraft({ session }: { session: DemoSession }) {
  const [personId, setPersonId] = useState("");
  const [action, setAction] = useState("Katılma isteği");
  const [offer, setOffer] = useState("Geçerli teklif örneği");
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  const person = people.find((item) => item.id === personId);
  return (
    <DesignAction
      title="Bekleme ve yer teklifi taslağı"
      trigger="Bekleme listesini incele"
    >
      <p>{session.title} · Sentetik kayıt/teklif senaryoları</p>
      <FilterButtons
        label="Bekleme işlemi"
        items={["Katılma isteği", "Ayrılma isteği", "Yer teklifi"]}
        value={action}
        onChange={(value) => {
          setAction(value);
          setReview(false);
        }}
      />
      <fieldset className="flow-choices">
        <legend>Örnek öğrenci</legend>
        {people
          .filter((item) => item.roles.includes("Öğrenci"))
          .map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name={`waitlist-${session.id}`}
                checked={personId === item.id}
                onChange={() => {
                  setPersonId(item.id);
                  setReview(false);
                }}
              />
              <span>{item.name}</span>
            </label>
          ))}
      </fieldset>
      {action === "Yer teklifi" ? (
        <>
          <FilterButtons
            label="Teklif senaryosu"
            items={["Geçerli teklif örneği", "Süresi geçmiş teklif örneği"]}
            value={offer}
            onChange={setOffer}
          />
          <div className="flow-notice">
            <strong>{offer}</strong>
            <p>
              Gerçek teklif ve bitiş zamanı okunmadı. Teklif süresince yer
              geçici tutulur; kabulde hak, belge ve kapasite yeniden kontrol
              edilir. Bekleme listesi kendi başına kesin kayıt değildir.
            </p>
            <p>
              {offer.startsWith("Süresi")
                ? "Süresi geçmiş teklif kabul edilemez. Yeni teklif kendiliğinden oluşturulmaz."
                : "Teklifin kabul/ret yanıtı ilgili kişinin güncel yetkili oturumuna aittir. Bu yönetici önizlemesi öğrenci adına yanıt vermez."}
            </p>
          </div>
        </>
      ) : (
        <>
          <Button disabled={!person} onClick={showReview}>
            {action === "Katılma isteği"
              ? "Sıraya giriş isteğini incele"
              : "Ayrılma isteğini incele"}
          </Button>
          {review ? (
            <div
              ref={summaryRef}
              tabIndex={-1}
              className="review-summary"
              role="status"
            >
              <h3>{action} özeti</h3>
              <p>
                {person?.name} · {session.title}
              </p>
              <p>
                {action === "Katılma isteği"
                  ? "Sıra numarası veya yer garantisi verilmedi. Sıraya katılım hak tüketmez ve kesin rezervasyon oluşturmaz."
                  : "Ayrılma, mevcut sıra kaydı ve sürümü üzerinden doğrulanmalıdır. Gerçek sıra kaydı kaldırılmadı."}
              </p>
              <p>
                Gerçek işlem yapılmadı; canlı kayıt/plan/izin kontrolü
                bekleniyor.
              </p>
            </div>
          ) : null}
        </>
      )}
    </DesignAction>
  );
}
