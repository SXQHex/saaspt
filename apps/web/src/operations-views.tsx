"use client";

import { useState } from "react";
import Link from "next/link";
import { sessions, type DemoSession } from "./demo-program";
import { AttendanceDraft } from "./attendance-draft";
import { ReservationDraft } from "./reservation-draft";
import {
  AccountAccessDraft,
  PersonCreateDraft,
  PersonEditDraft,
  StudentRelationDraft,
  PersonMergeDraft,
} from "./people-drafts";
import { ProgramDraft, WaitlistDraft } from "./planning-drafts";
import { SessionChangeDraft } from "./session-change-draft";
import {
  ReservationCancelDraft,
  AttendanceCorrectionDraft,
} from "./lesson-record-drafts";
import { people, money } from "./design-data";
import {
  useDetailSelection,
  ReturnToList,
  ViewSearch,
  FilterButtons,
  EmptyView,
  DetailPrompt,
  StateTag,
  InfoPairs,
} from "./view-primitives";

export function CalendarView() {
  const [day, setDay] = useState("23 Ekim");
  const [room, setRoom] = useState("Tüm salonlar");
  const [query, setQuery] = useState("");
  const { selectedId, setSelectedId, detailRef } = useDetailSelection("demo-3");
  const [view, setView] = useState("Zaman çizelgesi");
  const data = sessions.filter(
    (item) =>
      item.day === (day === "23 Ekim" ? 23 : 24) &&
      (room === "Tüm salonlar" || `Salon ${item.room}` === room) &&
      `${item.title} ${item.instructor} ${item.discipline}`
        .toLocaleLowerCase("tr-TR")
        .includes(query.trim().toLocaleLowerCase("tr-TR")),
  );
  const selected = data.find((item) => item.id === selectedId);
  return (
    <>
      <div className="view-actions">
        <ProgramDraft />
      </div>
      <div className="view-toolbar">
        <FilterButtons
          label="Takvim günü"
          items={["23 Ekim", "24 Ekim"]}
          value={day}
          onChange={setDay}
        />
        <FilterButtons
          label="Takvim görünümü"
          items={["Zaman çizelgesi", "Ajanda"]}
          value={view}
          onChange={setView}
        />
      </div>
      <FilterButtons
        label="Takvim salonu"
        items={["Tüm salonlar", "Salon A", "Salon B"]}
        value={room}
        onChange={setRoom}
      />
      <ViewSearch
        label="Takvimde ders veya eğitmen ara"
        value={query}
        onChange={setQuery}
      />
      <p className="scope-note" aria-live="polite">
        {data.length} ders gösteriliyor.
      </p>
      <div className="view-split calendar-split">
        <section
          id="calendar-schedule"
          tabIndex={-1}
          aria-label="Merkez takvimi"
        >
          <p className="section-caption">{day} 2026 · İstanbul saati</p>
          <div
            className={`calendar-grid ${view === "Ajanda" ? "calendar-hidden" : ""}`}
          >
            <div className="calendar-column-head" style={{ gridColumn: 2 }}>
              Salon A
            </div>
            <div className="calendar-column-head" style={{ gridColumn: 3 }}>
              Salon B
            </div>
            {Array.from({ length: 12 }, (_, i) => (
              <span
                className="calendar-hour"
                key={i}
                style={{ gridRow: i * 2 + 2 }}
              >
                {String(10 + i).padStart(2, "0")}:00
              </span>
            ))}
            {data.map((item) => (
              <CalendarCard
                key={item.id}
                item={item}
                selected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
              />
            ))}
          </div>
          <div
            className={`calendar-agenda ${view === "Ajanda" ? "agenda-selected" : ""}`}
          >
            {data.map((item) => (
              <button
                key={item.id}
                className="agenda-row"
                aria-pressed={selectedId === item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.start}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    Salon {item.room} · {item.instructor}
                  </small>
                </span>
                <StateTag>
                  {item.participants}/{item.capacity}
                </StateTag>
              </button>
            ))}
          </div>
          {data.length === 0 ? (
            <EmptyView
              onReset={() => {
                setDay("23 Ekim");
                setRoom("Tüm salonlar");
                setQuery("");
              }}
            />
          ) : null}
        </section>
        <aside
          ref={detailRef}
          tabIndex={-1}
          className="view-detail"
          aria-label="Seans ayrıntısı"
        >
          {selected ? (
            <>
              <ReturnToList targetId="calendar-schedule" />
              <StateTag>Planlandı</StateTag>
              <h2>{selected.title}</h2>
              <InfoPairs
                rows={[
                  ["Saat", `${selected.start}–${selected.end}`],
                  ["Salon", `Salon ${selected.room}`],
                  ["Eğitmen", selected.instructor],
                  ["Disiplin", selected.discipline],
                  [
                    "Kontenjan",
                    `${selected.participants} / ${selected.capacity}`,
                  ],
                ]}
              />
              <p className="scope-note">
                Saatin geçmesi gerçekleşme veya hak tüketimi oluşturmaz.
              </p>
              <AttendanceDraft key={selected.id} title={selected.title} />
              <ReservationDraft
                key={`booking-${selected.id}`}
                session={selected}
              />
              <SessionChangeDraft
                key={`change-${selected.id}`}
                session={selected}
              />
              <WaitlistDraft key={`wait-${selected.id}`} session={selected} />
              <details className="lesson-record-examples">
                <summary>Kayıt ve düzeltme örnekleri</summary>
                <p className="scope-note">
                  Ayrı sentetik kayıt senaryolarıdır; bu dersin gerçekleşme veya
                  kapanış durumu değildir.
                </p>
                <div className="draft-actions">
                  <ReservationCancelDraft
                    key={`cancel-${selected.id}`}
                    session={selected}
                  />
                  <AttendanceCorrectionDraft
                    key={`correct-${selected.id}`}
                    session={selected}
                  />
                </div>
              </details>
            </>
          ) : (
            <DetailPrompt />
          )}
        </aside>
      </div>
    </>
  );
}
function CalendarCard({
  item,
  selected,
  onSelect,
}: {
  item: DemoSession;
  selected: boolean;
  onSelect: () => void;
}) {
  const index = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    return (h! - 10) * 2 + m! / 30 + 2;
  };
  return (
    <button
      className="calendar-session"
      aria-pressed={selected}
      onClick={onSelect}
      style={{
        gridColumn: item.room === "A" ? 2 : 3,
        gridRow: `${index(item.start)} / ${index(item.end)}`,
      }}
    >
      <strong>{item.title}</strong>
      <small>
        {item.start} · {item.participants}/{item.capacity}
      </small>
    </button>
  );
}

export function PeopleView() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("Hepsi");
  const { selectedId, setSelectedId, detailRef } =
    useDetailSelection("person-a");
  const data = people.filter(
    (person) =>
      (role === "Hepsi" || person.roles.includes(role)) &&
      `${person.name} ${person.discipline}`
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")),
  );
  const selected = data.find((person) => person.id === selectedId);
  return (
    <>
      <div className="view-toolbar">
        <PersonCreateDraft />
        <ViewSearch label="Kişi ara" value={query} onChange={setQuery} />
        <FilterButtons
          label="Kişi ilişkisi"
          items={["Hepsi", "Öğrenci", "Eğitmen"]}
          value={role}
          onChange={setRole}
        />
      </div>
      <div className="view-split">
        <section
          id="people-list"
          data-master-list
          tabIndex={-1}
          className="record-list"
          aria-label="Kişi listesi"
        >
          {data.map((person) => (
            <button
              className="person-record"
              key={person.id}
              aria-pressed={person.id === selectedId}
              onClick={() => setSelectedId(person.id)}
            >
              <span className="person-avatar">{person.initials}</span>
              <span>
                <strong>{person.name}</strong>
                <small>
                  {person.roles.join(" · ")} · {person.discipline}
                </small>
              </span>
              <span className="record-end">
                {person.roles.includes("Öğrenci")
                  ? `${person.rights} hak`
                  : "Eğitmen"}
              </span>
            </button>
          ))}
          {data.length === 0 ? (
            <EmptyView
              onReset={() => {
                setQuery("");
                setRole("Hepsi");
              }}
            />
          ) : null}
        </section>
        <aside
          ref={detailRef}
          tabIndex={-1}
          className="view-detail"
          aria-label="Kişi ayrıntısı"
        >
          {selected ? (
            <>
              <ReturnToList targetId="people-list" label="Kişi listesine dön" />
              <span className="large-avatar">{selected.initials}</span>
              <h2>{selected.name}</h2>
              <p>{selected.roles.join(" · ")}</p>
              <InfoPairs
                rows={[
                  ["İletişim", selected.contact],
                  ["İlişki başlangıcı", selected.joined],
                  ["Merkez", "Merkez Stüdyo"],
                  ["Disiplin", selected.discipline],
                ]}
              />
              <div className="balance-grid">
                <div>
                  <span>Kullanılabilir hak</span>
                  <strong>{selected.rights}</strong>
                </div>
                <div>
                  <span>Ayrılmış hak</span>
                  <strong>{selected.reserved}</strong>
                </div>
                <div>
                  <span>Borç</span>
                  <strong>{money(selected.debt)}</strong>
                </div>
                <div>
                  <span>Alacak</span>
                  <strong>{money(selected.credit)}</strong>
                </div>
              </div>
              <p className="scope-note">
                Hesap ile organizasyona ait kişi kaydı farklıdır. Birden fazla
                ilişki yeni kişi kaydı oluşturmaz.
              </p>
              <div className="draft-actions">
                <PersonEditDraft
                  key={`edit-${selected.id}`}
                  person={selected}
                />
                <StudentRelationDraft
                  key={`relation-${selected.id}`}
                  person={selected}
                />
                <AccountAccessDraft
                  key={`access-${selected.id}`}
                  person={selected}
                />
                <PersonMergeDraft
                  key={`merge-${selected.id}`}
                  person={selected}
                />
              </div>
              <div className="view-actions">
                <Link
                  className="button"
                  href={`/finans?person=${encodeURIComponent(selected.id)}`}
                >
                  Finansı incele
                </Link>
                <Link className="button" href="/paketler">
                  Paketleri incele
                </Link>
              </div>
            </>
          ) : (
            <DetailPrompt />
          )}
        </aside>
      </div>
    </>
  );
}
