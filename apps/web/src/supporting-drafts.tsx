"use client";
import { useId, useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { documents, events, people } from "./design-data";
import {
  DesignAction,
  FilterButtons,
  InfoPairs,
  useLocalReview,
} from "./view-primitives";

export function EventRegistrationDraft({
  event,
}: {
  event: (typeof events)[number];
}) {
  const [personId, setPersonId] = useState("");
  const [scenario, setScenario] = useState("Hazırlık isteği");
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  const person = people.find((item) => item.id === personId);
  return (
    <DesignAction
      title="Etkinlik kayıt hazırlığı"
      trigger="Kayıt akışını incele"
    >
      <p>{event.title} · Tam ödeme şartlı sentetik senaryo</p>
      <fieldset className="flow-choices">
        <legend>Örnek öğrenci</legend>
        {people
          .filter((item) => item.roles.includes("Öğrenci"))
          .map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name={`event-person-${event.id}`}
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
      <FilterButtons
        label="Etkinlik kayıt adımı"
        items={["Hazırlık isteği", "Kesin kayıt kontrolü", "Yer doldu örneği"]}
        value={scenario}
        onChange={(value) => {
          setScenario(value);
          setReview(false);
        }}
      />
      <Button disabled={!person} onClick={showReview}>
        Kayıt adımını incele
      </Button>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>{scenario}</h3>
          <p>
            {person?.name} · {event.title}
          </p>
          {scenario === "Hazırlık isteği" ? (
            <p>
              Ödeme hazırlığı yer ayırmaz. Gerçek hazırlık borcu veya kaydı
              oluşturulmadı; ilgili borca tahsilat ayrı işlemdir.
            </p>
          ) : scenario === "Kesin kayıt kontrolü" ? (
            <p>
              Tam ödemenin ilgili hazırlık borcuna bağlılığı, canlı kapasite,
              belge ve uygunluk yeniden kontrol edilmelidir. Hazırlık kimliği
              veya geçerli kayıt önizlemesi okunmadı; kesin kayıt oluşmadı.
            </p>
          ) : (
            <p>
              Bu ayrı örnekte ödeme sonrası yer dolmuştur. Kesin kayıt oluşmaz;
              hazırlık kapatma/borç ters kaydı ve varsa öğrenci alacağı
              sonuçları sunucudan okunmalıdır. Nakit iade otomatik değildir.
            </p>
          )}
          <p>
            Etkinlikte negatif kredi kullanılmaz. Bu ekran ödeme almaz, yer
            ayırmaz ve gerçek kayıt oluşturmaz.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
export function EventCancelDraft({
  event,
}: {
  event: (typeof events)[number];
}) {
  const [reason, setReason] = useState("");
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction
      title="Merkez etkinlik iptali taslağı"
      trigger="Etkinlik iptalini incele"
    >
      <p>{event.title} · Merkez iptal isteği</p>
      <form
        className="draft-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (reason.trim()) showReview();
        }}
      >
        <label>
          Etkinlik iptal gerekçesi
          <textarea
            required
            name="supporting-drafts-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setReview(false);
            }}
          />
        </label>
        <Button type="submit" disabled={!reason.trim()}>
          İptal kontrolünü incele
        </Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Merkez iptal etkileri bekleniyor</h3>
          <p>Gerekçe: {reason.trim()}</p>
          <p>
            Katılımcı rezervasyonu iptali ile merkez etkinlik iptali ayrı
            işlemlerdir. Tam para/hak sonuçları ve bağlı işlemler güncel
            önizlemede okunmalıdır; istemci tutar hesaplamadı.
          </p>
          <p>
            Eski önizlemeyle uygulama yapılamaz. Gerçek iptal, nakit iade veya
            hak hareketi yapılmadı.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}

export function DocumentPublishDraft({
  document,
}: {
  document: (typeof documents)[number];
}) {
  const [fileName, setFileName] = useState("");
  const [version, setVersion] = useState("");
  const [gates, setGates] = useState<string[]>([]);
  const [renew, setRenew] = useState(false);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction
      title="Belge yayımlama taslağı"
      trigger="Yeni sürüm isteğini hazırla"
    >
      <p>
        {document.name} · Mevcut örnek sürüm {document.version} ·{" "}
        {document.scope}
      </p>
      <form
        className="draft-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (fileName && version.trim()) showReview();
        }}
      >
        <label>
          Yerel dosya örneği
          <input
            type="file"
            required
            onChange={(e) => {
              setFileName(e.target.files?.[0]?.name ?? "");
              setReview(false);
            }}
          />
        </label>
        <p className="scope-note">
          Yalnız dosya adı gösterilir; içerik okunmaz veya yüklenmez.
          Yükleme/tamamlama, tür, boyut ve güvenlik kontrolü gerçek dosya
          hattına bağlıdır.
        </p>
        <label>
          Yeni sürüm etiketi
          <input
            required
            name="supporting-drafts-version"
            value={version}
            onChange={(e) => {
              setVersion(e.target.value);
              setReview(false);
            }}
          />
        </label>
        <fieldset className="flow-choices">
          <legend>Gereklilik adımları</legend>
          {["Satış", "Rezervasyon", "Yoklama", "Etkinlik kaydı"].map((gate) => (
            <label key={gate}>
              <input
                type="checkbox"
                checked={gates.includes(gate)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setGates((value) =>
                    checked
                      ? [...value, gate]
                      : value.filter((item) => item !== gate),
                  );
                  if (!checked && gates.length === 1) setRenew(false);
                  setReview(false);
                }}
              />
              <span>{gate}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="flow-choices">
          <legend>Kabul davranışı</legend>
          <label>
            <input
              type="checkbox"
              checked={renew && gates.length > 0}
              disabled={gates.length === 0}
              onChange={(e) => {
                setRenew(e.target.checked);
                setReview(false);
              }}
            />
            <span>Yenilenmiş kabul gereksinimini incele</span>
          </label>
        </fieldset>
        <Button type="submit" disabled={!fileName || !version.trim()}>
          Yayımlama isteğini incele
        </Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <InfoPairs
            rows={[
              ["Dosya adı", fileName],
              ["Önerilen sürüm", version.trim()],
              ["Gereklilik", gates.join(", ") || "Bu taslakta eklenmedi"],
              [
                "Yenilenmiş kabul isteği",
                renew && gates.length > 0 ? "Evet" : "Hayır",
              ],
            ]}
          />
          <p>
            Dosya kimliği, gerçek kapsam ve etkilenen kayıt/onay listesi canlı
            yayımlama önizlemesinde doğrulanmalıdır. Bu seçim tüm merkezlere
            yetki vermez; gerçek dosya yüklenmedi veya sürüm yayımlanmadı.
          </p>
          <p>
            Eski sürüm ve kabul kanıtı korunur. Bu yönetici taslağı başka kişi
            adına belge kabul etmez.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}

export function ReportExportDraft() {
  const [report, setReport] = useState("Doluluk");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [state, setState] = useState("İstek özeti");
  const [error, setError] = useState(false);
  const endRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  function invalidate() {
    setReview(false);
    setError(false);
    setState("İstek özeti");
  }
  return (
    <DesignAction
      title="Rapor dışa aktarım akışı"
      trigger="Dışa aktarım tasarımını incele"
    >
      <p>Merkez Stüdyo · Yetkili ve filtrelenmiş kapsam · CSV</p>
      <form
        className="draft-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (end <= start) {
            setError(true);
            endRef.current?.focus();
            return;
          }
          showReview();
        }}
      >
        <label htmlFor={`${id}-report`}>Rapor türü</label>
        <select
          id={`${id}-report`}
          name="supporting-drafts-report"
          value={report}
          onChange={(e) => {
            setReport(e.target.value);
            invalidate();
          }}
        >
          {[
            "Doluluk",
            "Ders katılımı",
            "Tahsilat ve borçlar",
            "Kaynak kullanımı",
            "Hakediş",
            "CRM dönüşümü",
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <label>
          Rapor başlangıcı
          <input
            type="date"
            required
            name="supporting-drafts-start"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              invalidate();
            }}
          />
        </label>
        <label>
          Rapor bitiş sınırı
          <input
            ref={endRef}
            type="date"
            required
            name="supporting-drafts-end"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              invalidate();
            }}
          />
        </label>
        {error ? (
          <p className="field-error" role="alert">
            Bitiş sınırı başlangıçtan sonra olmalı.
          </p>
        ) : null}
        <p className="scope-note">
          Başlangıç dahil, bitiş hariçtir. Yerel sınırların kesin an
          karşılıkları gerçek istekte doğrulanır. Yalnız görünür sayfa değil,
          yetkili filtre kapsamı dışa aktarılır.
        </p>
        <Button type="submit">Rapor isteğini incele</Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <InfoPairs
            rows={[
              ["Rapor", report],
              ["Tarih önerisi", `${start} → ${end}`],
              ["Biçim", "CSV"],
            ]}
          />
          <FilterButtons
            label="Rapor işi durum örnekleri"
            items={[
              "İstek özeti",
              "Hazırlanıyor örneği",
              "Dosya hazır örneği",
              "Erişim değişti örneği",
              "İş hatası örneği",
            ]}
            value={state}
            onChange={setState}
          />
          <h3>{state}</h3>
          <p>
            {state === "Hazırlanıyor örneği"
              ? "Gerçek iş başlatılmadı. Bağlantı kopması işin tamamlanmadığı anlamına gelmez; aynı iş kimliğiyle durum okunmalıdır."
              : state === "Dosya hazır örneği"
                ? "Bu yalnız hazır durum tasarımıdır; gerçek dosya veya indirme bağlantısı yok. Dosya erişiminde güncel yetki/kapsam yeniden doğrulanmalıdır."
                : state === "Erişim değişti örneği"
                  ? "Eski dosya bağlantısı erişim vermez. Önceki rapor içeriği bu örnekte gösterilmez."
                  : state === "İş hatası örneği"
                    ? "Gerçek hata koduna göre yeniden deneme değerlendirilir; yeni iş başlatıp yinelenen çıktı üretilmez."
                    : "Gerçek export işi başlatılmadı; yetki, filtreler ve durum kaynağı bekleniyor."}
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
