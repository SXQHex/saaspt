"use client";
import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people, money } from "./design-data";
import { parsePositiveTryMinor, formatTryMinor } from "./money-input";
import {
  DesignAction,
  FilterButtons,
  InfoPairs,
  useLocalReview,
} from "./view-primitives";

export function CashCorrectionDraft() {
  const [direction, setDirection] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  const minor = parsePositiveTryMinor(amount);
  const amountRef = useRef<HTMLInputElement>(null);
  function invalidate() {
    setReview(false);
    setError(false);
  }
  return (
    <DesignAction
      title="Tahsilat fark düzeltmesi taslağı"
      trigger="Tahsilat düzeltmesini incele"
    >
      <p>Elif Aksoy · 22 Ekim · {money(300)} tutarlı bağımsız örnek tahsilat</p>
      <p>
        Girilen tutar yeni toplam değil, özgün harekete bağlanacak yönlü
        farktır. İlk kayıt silinmez.
      </p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!minor) {
            setError(true);
            amountRef.current?.focus();
            return;
          }
          if (direction && reason.trim()) showReview();
        }}
      >
        <fieldset className="flow-choices">
          <legend>Farkın yönü</legend>
          {["Artır", "Azalt"].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="cash-correction-direction"
                checked={direction === value}
                onChange={() => {
                  setDirection(value);
                  invalidate();
                }}
              />
              <span>{value}</span>
            </label>
          ))}
        </fieldset>
        <label>
          Fark tutarı (TRY)
          <input
            ref={amountRef}
            aria-invalid={error || undefined}
            inputMode="decimal"
            autoComplete="off"
            required
            name="finance-action-drafts-amount"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              invalidate();
            }}
          />
        </label>
        <label>
          Düzeltme gerçekleşme zamanı
          <input
            type="datetime-local"
            required
            name="finance-action-drafts-time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value);
              invalidate();
            }}
          />
        </label>
        <label>
          Düzeltme gerekçesi
          <textarea
            required
            name="finance-action-drafts-reason"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              invalidate();
            }}
          />
        </label>
        {error ? (
          <p className="field-error" role="alert">
            Sıfırdan büyük, en fazla iki ondalıklı fark tutarı gir.
          </p>
        ) : null}
        <Button type="submit" disabled={!direction || !reason.trim()}>
          Fark isteğini incele
        </Button>
      </form>
      {review && minor ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Yönlü fark isteği</h3>
          <InfoPairs
            rows={[
              ["Özgün örnek tahsilat", money(300)],
              ["Fark yönü", direction],
              ["Fark tutarı", formatTryMinor(minor)],
              ["Gerekçe", reason.trim()],
            ]}
          />
          <p>
            Yeni toplam hesaplanmadı. Dağıtım, bağlı öğrenci alacağı ve
            harcanmış alacak koşulları gerçek önizlemede kontrol edilmelidir.
          </p>
          <p>
            İlk hareket korunur. Gerçek düzeltme, para transferi veya
            rezervasyon iptali yapılmadı.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
export function SaleRefundDraft() {
  const [reason, setReason] = useState("");
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction
      title="Satış iade isteği taslağı"
      trigger="Satış iade isteğini incele"
    >
      <p>
        Elif Aksoy · Örnek 8 derslik Salsa satışı. Bu, katalogdaki yeni satış
        değil bağımsız geçmiş kayıt senaryosudur.
      </p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (reason.trim()) showReview();
        }}
      >
        <label>
          Satış iade gerekçesi
          <textarea
            required
            name="finance-action-drafts-reason"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setReview(false);
            }}
          />
        </label>
        <Button disabled={!reason.trim()} type="submit">
          İade isteği özetini incele
        </Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>İade etkisi henüz hesaplanmadı</h3>
          <p>
            Satışta sabitlenen yöntem, tarih ve önceki hareketler gerçek
            önizlemede değerlendirilir. Gerekçe: {reason.trim()}
          </p>
          <p>
            Paket iadesi otomatik nakit ödeme, hak veya rezervasyon iptali
            değildir. Borç indirimi, varsa öğrenci alacağı ve nakit iade ayrı
            sonuçlardır. Gerçek iade yapılmadı.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
export function CreditActionDraft({
  person,
}: {
  person: (typeof people)[number];
}) {
  const [action, setAction] = useState("Nakit iade");
  const [amount, setAmount] = useState("");
  const [debt, setDebt] = useState(false);
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  const minor = parsePositiveTryMinor(amount);
  const amountRef = useRef<HTMLInputElement>(null);
  function invalidate() {
    setReview(false);
    setError(false);
  }
  return (
    <DesignAction
      title="Öğrenci alacağı işlem taslağı"
      trigger="Alacak işlemlerini incele"
    >
      <p>
        {person.name} · Örnek alacak {money(person.credit)} · TRY
      </p>
      {person.credit === 0 ? (
        <div className="flow-empty">
          <p>
            Bu senaryoda kullanılacak örnek alacak yok. Gerçek bakiye ve yetki
            okunmadı.
          </p>
        </div>
      ) : (
        <>
          <FilterButtons
            label="Alacak işlemi"
            items={["Nakit iade", "Borca mahsup"]}
            value={action}
            onChange={(value) => {
              setAction(value);
              invalidate();
            }}
          />
          <form
            className="draft-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!minor) {
                setError(true);
                return;
              }
              showReview();
            }}
          >
            <label>
              Alacak işlem tutarı (TRY)
              <input
                ref={amountRef}
                aria-invalid={error || undefined}
                inputMode="decimal"
                required
                name="finance-action-drafts-amount"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  invalidate();
                }}
              />
            </label>
            {action === "Borca mahsup" ? (
              <fieldset className="flow-choices">
                <legend>Hedef borç</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={debt}
                    onChange={(event) => {
                      setDebt(event.target.checked);
                      invalidate();
                    }}
                  />
                  <span>
                    Örnek paket satış borcu · aynı kişi, merkez ve TRY
                  </span>
                </label>
              </fieldset>
            ) : (
              <>
                <label>
                  İade gerçekleşme zamanı
                  <input
                    type="datetime-local"
                    required
                    name="finance-action-drafts-time"
                    value={time}
                    onChange={(event) => {
                      setTime(event.target.value);
                      invalidate();
                    }}
                  />
                </label>
                <label>
                  Nakit iade gerekçesi
                  <textarea
                    required
                    name="finance-action-drafts-reason"
                    value={reason}
                    onChange={(event) => {
                      setReason(event.target.value);
                      invalidate();
                    }}
                  />
                </label>
              </>
            )}
            {error ? (
              <p className="field-error" role="alert">
                Geçerli pozitif tutar gir.
              </p>
            ) : null}
            <Button type="submit" disabled={action === "Borca mahsup" && !debt}>
              Alacak isteğini incele
            </Button>
          </form>
          {review && minor ? (
            <div
              ref={summaryRef}
              tabIndex={-1}
              className="review-summary"
              role="status"
            >
              <h3>{action} isteği</h3>
              <InfoPairs
                rows={[
                  ["Öğrenci", person.name],
                  ["İşlem", action],
                  ["Tutar", formatTryMinor(minor)],
                  [
                    "Hedef",
                    action === "Borca mahsup"
                      ? "Seçili örnek borç"
                      : "Ayrı nakit iade kaydı",
                  ],
                ]}
              />
              <p>
                Güncel kullanılabilir alacak, borç kalanı, para birimi, kapsam
                ve yetki yeniden doğrulanmalıdır. Bakiyeler değişmedi; gerçek
                iade, mahsup veya banka işlemi yapılmadı.
              </p>
            </div>
          ) : null}
        </>
      )}
    </DesignAction>
  );
}
