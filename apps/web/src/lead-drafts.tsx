"use client";
import { useState } from "react";
import { Button } from "@saaspt/ui/button";
import { leads } from "./design-data";
import {
  DesignAction,
  FilterButtons,
  InfoPairs,
  useLocalReview,
} from "./view-primitives";
type Lead = (typeof leads)[number];
export function LeadActivityDraft({ lead }: { lead: Lead }) {
  const [kind, setKind] = useState("İletişim");
  const [note, setNote] = useState("");
  const [due, setDue] = useState("");
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction title="Görüşme notu taslağı" trigger="Görüşme tasarımını aç">
      <p>{lead.name} · Aday geçmişine eklenecek ayrı aktivite</p>
      <FilterButtons
        label="Aktivite türü"
        items={["İletişim", "Takip", "Sonuç notu"]}
        value={kind}
        onChange={(value) => {
          setKind(value);
          setReview(false);
        }}
      />
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (note.trim()) showReview();
        }}
      >
        <label>
          Görüşme notu
          <textarea
            required
            name="lead-drafts-note"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setReview(false);
            }}
          />
        </label>
        {kind === "Takip" ? (
          <label>
            Takip zamanı (Europe/Istanbul)
            <input
              type="datetime-local"
              required
              name="lead-drafts-due"
              value={due}
              onChange={(event) => {
                setDue(event.target.value);
                setReview(false);
              }}
            />
          </label>
        ) : null}
        <Button type="submit" disabled={!note.trim()}>
          Aktivite isteğini incele
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
              ["Aday", lead.name],
              ["Tür", kind],
              ["Not", note.trim()],
              ["Takip önerisi", kind === "Takip" ? due : "Bu aktivitede yok"],
            ]}
          />
          <p>
            Gerçek not veya takip kaydı yapılmadı. Yerel takip saati, yetki ve
            varsa mevcut aktivite sürümü canlı işlemde doğrulanmalıdır. Sonuç
            notu adayın durumunu kendiliğinden değiştirmez.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
export function LeadConvertDraft({ lead }: { lead: Lead }) {
  const [confirmed, setConfirmed] = useState(false);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction
      title="Aday dönüşüm isteği"
      trigger="Öğrenciye dönüşümü incele"
    >
      <p>
        {lead.name} · {lead.interest} · {lead.source}
      </p>
      <div className="flow-notice">
        <strong>Adayın mevcut kişi bağı korunur.</strong>
        <p>
          Dönüşüm komutunda yeniden kişi seçilmez. Yanlış veya mükerrer kişi
          şüphesi varsa önce yetkili kişi incelemesi gerekir; e-posta eşitliği
          otomatik bağlama yapmaz.
        </p>
      </div>
      <InfoPairs
        rows={[
          ["Örnek bağlı kişi", lead.name],
          ["Mevcut aday durumu", lead.state],
          ["İstenen işlem", "Mevcut kişide öğrenci ilişkisine dönüşüm"],
        ]}
      />
      <fieldset className="flow-choices">
        <legend>İnceleme</legend>
        <label>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => {
              setConfirmed(event.target.checked);
              setReview(false);
            }}
          />
          <span>Bağlı kişiyi ve aday geçmişini kontrol ettim</span>
        </label>
      </fieldset>
      <Button
        disabled={!confirmed || lead.state !== "Açık"}
        onClick={showReview}
      >
        Dönüşüm isteğini incele
      </Button>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Dönüşüm için canlı kontrol bekleniyor</h3>
          <p>
            Mevcut kişi ve ilişki, plan ve yetki yeniden doğrulanmalıdır. İkinci
            kişi, hesap, paket satışı veya giriş yetkisi üretilmedi. Aday
            geçmişi silinmedi; gerçek dönüşüm yapılmadı.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
