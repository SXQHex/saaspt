"use client";

import { useState } from "react";
import { Button } from "@saaspt/ui/button";
import { people } from "./design-data";
import { DesignAction } from "./view-primitives";

export function AttendanceDraft({ title }: { title: string }) {
  const participants = people.filter((person) =>
    person.roles.includes("Öğrenci"),
  );
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
  const marked = participants.filter((person) => marks[person.id]).length;
  return (
    <DesignAction title="Yoklama taslağı" trigger="Yoklama tasarımını aç">
      <p>
        {title} · {participants.length} kişilik sentetik liste
      </p>
      <p>
        Taslak işaretler hak tüketmez. Gerçek kapanış ve düzeltme ayrı
        işlemlerdir.
      </p>
      <div className="attendance-list">
        {participants.map((person) => (
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
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <p aria-live="polite">
        {marked} / {participants.length} sonuç işaretlendi.
      </p>
      <Button
        disabled={marked !== participants.length}
        onClick={() => setReview(true)}
      >
        Kapanış özetini incele
      </Button>
      {review ? (
        <div className="review-summary" role="status">
          <h3>İşaretler kontrol için hazır.</h3>
          <p>
            {Object.values(marks).filter((mark) => mark === "attended").length}{" "}
            katıldı,{" "}
            {Object.values(marks).filter((mark) => mark === "no_show").length}{" "}
            gelmedi.
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
