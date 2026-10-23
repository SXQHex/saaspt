"use client";

import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";
import { filterSessions, type DemoSession } from "./demo-program";
import { ManagerPriorities } from "./manager-priorities";
import { AttendanceDraft } from "./attendance-draft";

function Arrow({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`arrow ${reverse ? "reverse" : ""}`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function ProgramPreview() {
  const [day, setDay] = useState(23);
  const [room, setRoom] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>("demo-3");
  const detailRef = useRef<HTMLElement>(null);
  function inspectSession(id: string) {
    setDay(23);
    setRoom("all");
    setQuery("");
    setSelectedId(id);
    requestAnimationFrame(() => {
      detailRef.current?.focus({ preventScroll: true });
      detailRef.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    });
  }
  const visible = filterSessions(day, room, query);
  const selected = visible.find((session) => session.id === selectedId);
  const date = new Date(Date.UTC(2026, 9, day, 9));
  const dateLabel = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(date);
  const weekday = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    timeZone: "Europe/Istanbul",
  }).format(date);
  const upcoming = visible.filter(
    (session) => session.state === "upcoming",
  ).length;

  return (
    <div className="daily-program">
      <div className="intro">
        <div>
          <p className="date-label">{dateLabel}</p>
          <h1>Günün ritmi.</h1>
          <p className="intro-copy">
            Bekleyen işleri gör, günün programını birlikte yönet.
          </p>
        </div>
        <div className="day-summary">
          <strong>{String(visible.length).padStart(2, "0")}</strong>
          <span>
            ders programda
            <br />
            <b>{upcoming} ders sırada</b>
          </span>
        </div>
      </div>

      <ManagerPriorities onInspectSession={inspectSession} />

      <a className="schedule-shortcut" href="#daily-schedule">
        Ders programına geç <span aria-hidden="true">↓</span>
      </a>

      <div className="program-toolbar">
        <div className="date-control">
          <Button
            aria-label="Önceki gün"
            onClick={() => {
              setDay((value) => value - 1);
              setSelectedId(null);
            }}
          >
            <Arrow reverse />
          </Button>
          <div>
            <strong>{weekday}</strong>
            <span>{dateLabel}</span>
          </div>
          <Button
            aria-label="Sonraki gün"
            onClick={() => {
              setDay((value) => value + 1);
              setSelectedId(null);
            }}
          >
            <Arrow />
          </Button>
        </div>
        <Button
          onClick={() => {
            setDay(23);
            setSelectedId("demo-3");
          }}
        >
          Örnek güne dön
        </Button>
        <label className="search">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="6" />
            <path d="m15 15 5 5" />
          </svg>
          <input
            name="program-search"
            autoComplete="off"
            aria-label="Ders veya eğitmen ara"
            placeholder="Ders veya eğitmen ara…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="program-body">
        <section
          id="daily-schedule"
          tabIndex={-1}
          className="schedule"
          aria-label="Ders programı"
        >
          <div className="schedule-heading">
            <div
              className="room-switch"
              role="group"
              aria-label="Salon filtresi"
            >
              {[
                ["all", "Tüm salonlar"],
                ["A", "Salon A"],
                ["B", "Salon B"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setRoom(value!)}
                  aria-pressed={room === value}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="timezone">İstanbul saati</span>
          </div>
          <div className="session-list" aria-live="polite">
            {visible.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                selected={session.id === selectedId}
                onSelect={() => setSelectedId(session.id)}
              />
            ))}
            {visible.length === 0 ? (
              <div className="empty">
                <span aria-hidden="true">☷</span>
                <h2>Bu görünümde ders yok.</h2>
                <p>
                  Başka bir gün seç veya arama ve salon filtrelerini temizle.
                </p>
                <Button
                  onClick={() => {
                    setQuery("");
                    setRoom("all");
                  }}
                >
                  Filtreleri temizle
                </Button>
              </div>
            ) : null}
          </div>
          <p className="list-footnote">Örnek program · 23–24 Ekim 2026</p>
        </section>

        <aside
          ref={detailRef}
          tabIndex={-1}
          className="details"
          aria-label="Ders ayrıntısı"
        >
          {selected ? (
            <>
              <div className="detail-top">
                <span>Ders ayrıntısı</span>
                <button
                  aria-label="Ayrıntıyı kapat"
                  onClick={() => setSelectedId(null)}
                >
                  ×
                </button>
              </div>
              <div className="discipline-emblem" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p className="discipline-name">{selected.discipline}</p>
              <h2>{selected.title}</h2>
              <p className="detail-time">
                {selected.start} — {selected.end}
              </p>
              <dl>
                <div>
                  <dt>Eğitmen</dt>
                  <dd>{selected.instructor}</dd>
                </div>
                <div>
                  <dt>Konum</dt>
                  <dd>Salon {selected.room}</dd>
                </div>
                <div>
                  <dt>Katılımcı</dt>
                  <dd>
                    {selected.participants} / {selected.capacity}
                  </dd>
                </div>
              </dl>
              <div
                className="capacity-track"
                role="img"
                aria-label={`${selected.capacity} kişilik kapasitede ${selected.participants} katılımcı`}
              >
                <span
                  style={{
                    width: `${(selected.participants / selected.capacity) * 100}%`,
                  }}
                />
              </div>
              <p className="detail-hint">
                {selected.participants === selected.capacity
                  ? "Örnek kontenjan dolu."
                  : "Örnek kontenjan bilgisi."}
              </p>
              <AttendanceDraft key={selected.id} title={selected.title} />
              <div className="integration-note">
                <span aria-hidden="true">◇</span>
                <p>
                  Yoklama işaretleri yalnız taslaktır. Gerçek rezervasyon ve
                  yoklama işlemleri backend entegrasyonuyla açılacak.
                </p>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <h2>Programı keşfet.</h2>
              <p>Saat, eğitmen ve kontenjanı görmek için bir ders seç.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function SessionRow({
  session,
  selected,
  onSelect,
}: {
  session: DemoSession;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`session ${selected ? "session-selected" : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="session-hour">
        <strong>{session.start}</strong>
        <small>{session.end}</small>
      </span>
      <span className="session-marker" aria-hidden="true" />
      <span className="session-info">
        <span className="session-category">
          {session.discipline}
          <span className="room-tag">Salon {session.room}</span>
        </span>
        <strong>{session.title}</strong>
        <small>{session.instructor}</small>
      </span>
      <span className="session-meta">
        <span>
          {session.participants}
          <small> / {session.capacity}</small>
        </span>
        <small className={`state state-${session.state}`}>
          {session.state === "completed" ? "Saati geçti" : "Sıradaki"}
        </small>
      </span>
      <Arrow />
    </button>
  );
}
