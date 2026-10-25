"use client";
import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people } from "./design-data";
import {
  DesignAction,
  InfoPairs,
  ViewSearch,
  useLocalReview,
} from "./view-primitives";
type Person = (typeof people)[number];

export function PersonCreateDraft() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  const [error, setError] = useState(false);
  const matches = query.trim()
    ? people.filter((item) =>
        `${item.name} ${item.contact}`
          .toLocaleLowerCase("tr-TR")
          .includes(query.trim().toLocaleLowerCase("tr-TR")),
      )
    : [];
  function invalidate() {
    setReview(false);
    setError(false);
  }
  return (
    <DesignAction title="Yeni kişi taslağı" trigger="Yeni kişi taslağı hazırla">
      <p>
        Kişi organizasyona aittir. Bu işlem kendi başına öğrenci ilişkisi, hesap
        veya giriş yetkisi oluşturmaz.
      </p>
      <ViewSearch
        label="Yeni kişi öncesi mevcut kaydı ara"
        value={query}
        onChange={(value) => {
          setQuery(value);
          setChecked(false);
          invalidate();
        }}
      />
      {query.trim() ? (
        <div className="flow-notice">
          <strong>{matches.length} örnek eşleşme</strong>
          <ul>
            {matches.map((item) => (
              <li key={item.id}>
                {item.name} · {item.contact}
              </li>
            ))}
          </ul>
          <p>
            Arama sonucu kimlik kanıtı değildir. Eşleşme otomatik bağlama veya
            birleştirme yapmaz.
          </p>
        </div>
      ) : null}
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) {
            setError(true);
            nameRef.current?.focus();
            return;
          }
          if (checked) showReview();
        }}
      >
        <label>
          Kişinin görünen adı
          <input
            ref={nameRef}
            aria-invalid={error || undefined}
            required
            name="people-drafts-name"
            value={name}
            autoComplete="off"
            onChange={(event) => {
              setName(event.target.value);
              setChecked(false);
              invalidate();
            }}
          />
        </label>
        <label>
          E-posta (isteğe bağlı)
          <input
            type="email"
            autoComplete="off"
            name="people-drafts-email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setChecked(false);
              invalidate();
            }}
          />
        </label>
        <label>
          Telefon (isteğe bağlı)
          <input
            type="tel"
            autoComplete="off"
            name="people-drafts-phone"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setChecked(false);
              invalidate();
            }}
          />
        </label>
        <fieldset className="flow-choices">
          <legend>Tekrarlı kayıt kontrolü</legend>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => {
                setChecked(event.target.checked);
                invalidate();
              }}
            />
            <span>Mevcut kişi kaydı olasılığını inceledim</span>
          </label>
        </fieldset>
        {error ? (
          <p className="field-error" role="alert">
            Görünen ad boş olamaz.
          </p>
        ) : null}
        <Button type="submit" disabled={!checked}>
          Kişi isteğini incele
        </Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Kişi oluşturma isteği</h3>
          <InfoPairs
            rows={[
              ["Görünen ad", name.trim()],
              ["E-posta", email.trim() || "Belirtilmedi"],
              ["Telefon", phone.trim() || "Belirtilmedi"],
            ]}
          />
          <p>
            İletişim doğrulanmadı. Hesap, öğrenci ilişkisi, abonelik veya rol
            yaratılmadı; gerçek kişi kaydı yapılmadı.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
export function PersonEditDraft({ person }: { person: Person }) {
  const [name, setName] = useState(person.name);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction
      title="Kişi düzenleme taslağı"
      trigger="Kişi bilgisini düzenle"
    >
      <p>
        Organizasyon kişi kaydı: {person.name}. Hesaba bağlı kimlik alanları
        güncel hesap kaynağına tabidir; bu form global hesap kimliğini
        değiştirmez.
      </p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim() && name.trim() !== person.name) showReview();
        }}
      >
        <label>
          Önerilen görünen ad
          <input
            required
            autoComplete="off"
            name="people-drafts-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setReview(false);
            }}
          />
        </label>
        <p className="scope-note">
          Örnek iletişim: {person.contact}. Eksiksiz kaynak eşlemesi olmadan
          iletişim listesi üzerine yazılmaz.
        </p>
        <div className="draft-actions">
          <Button
            type="submit"
            disabled={!name.trim() || name.trim() === person.name}
          >
            Kişi değişikliğini incele
          </Button>
          <Button
            type="button"
            onClick={() => {
              setName(person.name);
              setReview(false);
            }}
          >
            Geri al
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
          <InfoPairs
            rows={[
              ["Mevcut ad", person.name],
              ["Önerilen ad", name.trim()],
            ]}
          />
          <p>
            Güncel kişi sürümü ve yetki kontrolü bekleniyor. Kişi, hesap kimliği
            ve geçmiş kayıtlar değiştirilmedi.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
export function StudentRelationDraft({ person }: { person: Person }) {
  const existing = person.roles.includes("Öğrenci");
  const [reason, setReason] = useState("");
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction
      title="Öğrenci ilişkisi taslağı"
      trigger="Öğrenci ilişkisini incele"
    >
      <p>{person.name} · Bu kişi kaydı korunur; ikinci kişi oluşturulmaz.</p>
      <p>
        {existing
          ? "Örnekte öğrenci ilişkisi var. Pasife alma isteği gerekçesi incelenebilir."
          : "Örnekte öğrenci ilişkisi yok. Etkinleştirme isteği incelenebilir."}
      </p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!existing || reason.trim()) showReview();
        }}
      >
        {existing ? (
          <label>
            Pasife alma gerekçesi
            <textarea
              required
              name="people-drafts-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setReview(false);
              }}
            />
          </label>
        ) : null}
        <Button type="submit" disabled={existing && !reason.trim()}>
          İlişki isteğini incele
        </Button>
      </form>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>{existing ? "Pasife alma" : "Etkinleştirme"} isteği</h3>
          <p>
            Öğrenci ilişkisi değişmedi. Yetki, plan ve mevcut bağımlılıklar
            kontrol edilmelidir; borç, hak ve geçmiş kayıtlar kendiliğinden
            silinmez.
          </p>
          <p>Bu işlem hesap bağlantısı, rol verme veya hesap silme değildir.</p>
        </div>
      ) : null}
    </DesignAction>
  );
}
export function PersonMergeDraft({ person }: { person: Person }) {
  const [targetId, setTargetId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  const target = people.find((item) => item.id === targetId);
  return (
    <DesignAction
      title="Kişi birleştirme incelemesi"
      trigger="Mükerrer kişi incelemesi"
    >
      <p>
        Kaynak örnek kişi: {person.name}. İletişim benzerliği kendi başına aynı
        kişi olduklarını kanıtlamaz.
      </p>
      <fieldset className="flow-choices">
        <legend>Korunacak hedef örnek kişi</legend>
        {people
          .filter((item) => item.id !== person.id)
          .map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name={`merge-${person.id}`}
                checked={targetId === item.id}
                onChange={() => {
                  setTargetId(item.id);
                  setConfirmed(false);
                  setReview(false);
                }}
              />
              <span>{item.name}</span>
            </label>
          ))}
      </fieldset>
      <fieldset className="flow-choices">
        <legend>Yönü kontrol et</legend>
        <label>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => {
              setConfirmed(event.target.checked);
              setReview(false);
            }}
          />
          <span>Kaynak ve korunacak hedef kaydı kontrol ettim</span>
        </label>
      </fieldset>
      <Button disabled={!target || !confirmed} onClick={showReview}>
        Birleştirme isteğini incele
      </Button>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <InfoPairs
            rows={[
              ["Kaynak", person.name],
              ["Korunacak hedef", target?.name],
            ]}
          />
          <p>
            Gerçek etki önizlemesi, bağlantı/kimlik denetimi ve etkilenen
            merkezlerin gerekli onayları bekleniyor. Bu yön seçimi kimlik kanıtı
            veya onay yerine geçmez; hiçbir kayıt birleştirilmedi.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}

export function AccountAccessDraft({ person }: { person: Person }) {
  const [checked, setChecked] = useState(false);
  const { review, setReview, summaryRef, showReview } = useLocalReview();
  return (
    <DesignAction
      title="Hesap erişimi incelemesi"
      trigger="Hesap erişimini incele"
    >
      <p>{person.name} · Mevcut organizasyon kişi kaydı</p>
      <InfoPairs
        rows={[
          ["Örnek kişi iletişimi", person.contact],
          ["Canlı hesap bağı", "Henüz okunmadı"],
          ["İstenen yol", "Mevcut kişiye güvenli erişim daveti"],
        ]}
      />
      <p>
        İletişim eşitliği hesap bağlama kanıtı değildir. Davet kabulü güvenli
        doğrulama ister; ikinci kişi veya otomatik rol oluşturmaz.
      </p>
      <fieldset className="flow-choices">
        <legend>Kişi kontrolü</legend>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => {
              setChecked(event.target.checked);
              setReview(false);
            }}
          />
          <span>Doğru organizasyon kişi kaydını inceledim</span>
        </label>
      </fieldset>
      <Button disabled={!checked} onClick={showReview}>
        Erişim isteğini incele
      </Button>
      {review ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="review-summary"
          role="status"
        >
          <h3>Güvenli erişim isteği taslağı</h3>
          <p>
            Canlı kişi/hesap bağı, iletişim, yetki ve davet koşulları
            doğrulanmalıdır. Gerçek davet veya e-posta gönderilmedi; hesap
            bağlanmadı.
          </p>
          <p>
            Erişim kaldırma kişi geçmişini silmez. Yeniden bağlanma eski
            yetkileri kendiliğinden geri açmaz; global hesabı silme ayrı
            işlemdir.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
