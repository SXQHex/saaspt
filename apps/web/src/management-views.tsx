"use client";

import { useState } from "react";
import Link from "next/link";
import { leads, documents, people, money } from "./design-data";
import { LeadActivityDraft, LeadConvertDraft } from "./lead-drafts";
import { DocumentPublishDraft, ReportExportDraft } from "./supporting-drafts";
import { sessions } from "./demo-program";
import {
  useDetailSelection,
  ReturnToList,
  ViewSearch,
  FilterButtons,
  EmptyView,
  DetailPrompt,
  StateTag,
  InfoPairs,
  DesignAction,
} from "./view-primitives";

export function LeadsView() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Hepsi");
  const { selectedId, setSelectedId, detailRef } = useDetailSelection("lead-a");
  const data = leads.filter(
    (item) =>
      (filter === "Hepsi" || item.state === filter) &&
      `${item.name} ${item.interest}`
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")),
  );
  const selected = data.find((item) => item.id === selectedId);
  return (
    <>
      <div className="view-toolbar">
        <ViewSearch label="Aday ara" value={query} onChange={setQuery} />
        <FilterButtons
          label="Aday durumu"
          items={["Hepsi", "Açık", "Dönüştü", "Kapalı"]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <div className="view-split">
        <section
          id="lead-list"
          data-master-list
          tabIndex={-1}
          className="record-list"
          aria-label="Aday listesi"
        >
          {data.map((item) => (
            <button
              className="lead-record"
              aria-pressed={item.id === selectedId}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span
                className={
                  item.followup === "Gecikti"
                    ? "followup-dot overdue"
                    : "followup-dot"
                }
                aria-hidden="true"
              />
              <span>
                <strong>{item.name}</strong>
                <small>
                  {item.interest} · {item.source}
                </small>
              </span>
              <span className="record-end">
                {item.followup}
                <small>{item.state}</small>
              </span>
            </button>
          ))}
          {data.length === 0 ? (
            <EmptyView
              onReset={() => {
                setQuery("");
                setFilter("Hepsi");
              }}
            />
          ) : null}
        </section>
        <aside
          ref={detailRef}
          tabIndex={-1}
          className="view-detail"
          aria-label="Aday ayrıntısı"
        >
          {selected ? (
            <>
              <ReturnToList targetId="lead-list" label="Aday listesine dön" />
              <StateTag>{selected.state}</StateTag>
              <h2>{selected.name}</h2>
              <InfoPairs
                rows={[
                  ["İlgi", selected.interest],
                  ["Kaynak", selected.source],
                  ["Takip", selected.followup],
                ]}
              />
              <p>{selected.note}</p>
              <h3>İlişki geçmişi</h3>
              <ul className="simple-history">
                {selected.history.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="draft-actions">
                <LeadActivityDraft
                  key={`activity-${selected.id}`}
                  lead={selected}
                />
                {selected.state === "Açık" ? (
                  <LeadConvertDraft
                    key={`convert-${selected.id}`}
                    lead={selected}
                  />
                ) : (
                  <p className="scope-note">
                    Dönüşmüş aday için yeni dönüşüm isteği açılmaz; mevcut
                    geçmiş korunur.
                  </p>
                )}
              </div>
              <p className="scope-note">
                Dönüşüm kişi geçmişini silmez. Kaynaklar ve notlar sentetiktir;
                reklam platformu bağlantısı kurulmadı.
              </p>
            </>
          ) : (
            <DetailPrompt />
          )}
        </aside>
      </div>
    </>
  );
}

export function DocumentsView() {
  const [filter, setFilter] = useState("Hepsi");
  const { selectedId, setSelectedId, detailRef } = useDetailSelection("doc-a");
  const data = documents.filter(
    (item) => filter === "Hepsi" || item.state === filter,
  );
  const selected = data.find((item) => item.id === selectedId);
  return (
    <>
      <FilterButtons
        label="Belge durumu"
        items={["Hepsi", "Yayımlandı", "Taslak"]}
        value={filter}
        onChange={setFilter}
      />
      <div className="view-split">
        <section
          id="document-list"
          data-master-list
          tabIndex={-1}
          className="document-list"
          aria-label="Belge listesi"
        >
          {data.map((item) => (
            <button
              className="document-record"
              key={item.id}
              aria-pressed={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="document-version">{item.version}</span>
              <span>
                <strong>{item.name}</strong>
                <small>
                  {item.scope} · {item.state}
                </small>
              </span>
              <span className="record-end">
                {item.pending > 0
                  ? `${item.pending} kabul bekliyor`
                  : item.state}
              </span>
            </button>
          ))}
        </section>
        <aside
          ref={detailRef}
          tabIndex={-1}
          className="view-detail"
          aria-label="Belge ayrıntısı"
        >
          {selected ? (
            <>
              <ReturnToList
                targetId="document-list"
                label="Belge listesine dön"
              />
              <StateTag>{selected.state}</StateTag>
              <h2>{selected.name}</h2>
              <InfoPairs
                rows={[
                  ["Sürüm", selected.version],
                  ["Kapsam", selected.scope],
                  ["Kabul eden", selected.accepted],
                  ["Bekleyen", selected.pending],
                ]}
              />
              <p>
                Yeni sürüm, eski kabul kanıtını değiştirmez. Gereklilik ve
                yayımlama etkisi işlem öncesinde değerlendirilir.
              </p>
              <DocumentPublishDraft
                key={`publish-${selected.id}`}
                document={selected}
              />
              <DesignAction
                title="Belge sürümü önizlemesi"
                trigger="Sürüm tasarımını incele"
              >
                <StateTag>{selected.version}</StateTag>
                <h3>{selected.name}</h3>
                <p>
                  Bu alan yalnız belge okuma düzenini göstermek içindir. Hukuki
                  metin veya gerçek belge içeriği değildir.
                </p>
                <InfoPairs
                  rows={[
                    ["Kabul kanıtı", "Kişi, sürüm, zaman ve ilgili işlem"],
                    ["Yönetici adına kabul", "Bu önizlemede yok"],
                    ["Eski kayıtlar", "Yeni sürümle yeniden yazılmaz"],
                  ]}
                />
              </DesignAction>
            </>
          ) : (
            <DetailPrompt />
          )}
        </aside>
      </div>
    </>
  );
}

export function ReportsView() {
  const [tab, setTab] = useState("Planlama");
  const [day, setDay] = useState("23 Ekim");
  const data = sessions.filter(
    (item) => item.day === (day === "23 Ekim" ? 23 : 24),
  );
  return (
    <>
      <div className="view-toolbar">
        <FilterButtons
          label="Rapor alanı"
          items={["Planlama", "Bakiyeler"]}
          value={tab}
          onChange={setTab}
        />
        {tab === "Planlama" ? (
          <FilterButtons
            label="Rapor günü"
            items={["23 Ekim", "24 Ekim"]}
            value={day}
            onChange={setDay}
          />
        ) : (
          <span className="section-caption">Güncel örnek bakiye kesiti</span>
        )}
      </div>
      {tab === "Planlama" ? (
        <div className="report-layout">
          <section className="wide-surface">
            <h2>Ders bazında kayıt doluluğu</h2>
            <p>
              {day} 2026 · Planlanan kapasiteye göre örnek rezervasyon görünümü
            </p>
            <div className="report-bars">
              {data.map((item) => (
                <div key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {item.participants} / {item.capacity}
                    </span>
                  </div>
                  <div className="report-track">
                    <span
                      style={{
                        width: `${(item.participants / item.capacity) * 100}%`,
                      }}
                    />
                  </div>
                  <small>
                    Salon {item.room} · {item.start}
                  </small>
                </div>
              ))}
            </div>
          </section>
          <aside className="view-detail">
            <h2>Bu rapor ne söylüyor?</h2>
            <InfoPairs
              rows={[
                ["Planlanan ders", data.length],
                [
                  "Ayrılmış katılım yeri",
                  data.reduce((sum, item) => sum + item.participants, 0),
                ],
                [
                  "Toplam kapasite",
                  data.reduce((sum, item) => sum + item.capacity, 0),
                ],
              ]}
            />
            <p>
              Aynı kişi birden fazla derse kayıtlı olabilir. Katılım yeri sayısı
              tekil öğrenci veya gerçekleşmiş katılım değildir.
            </p>
            <Link className="button" href="/takvim">
              Takvimde incele
            </Link>
          </aside>
        </div>
      ) : (
        <section className="wide-surface">
          <h2>Borç ve alacak kesiti</h2>
          <div className="balance-grid">
            <div>
              <span>Toplam öğrenci borcu</span>
              <strong>
                {money(people.reduce((sum, p) => sum + p.debt, 0))}
              </strong>
            </div>
            <div>
              <span>Toplam öğrenci alacağı</span>
              <strong>
                {money(people.reduce((sum, p) => sum + p.credit, 0))}
              </strong>
            </div>
          </div>
          <p>
            Bu değerler dönem geliri, kasa bakiyesi veya netleştirilmiş hesap
            değildir.
          </p>
          <Link className="button" href="/finans">
            Finans ayrıntısına git
          </Link>
        </section>
      )}
      <div className="report-export">
        <ReportExportDraft />
      </div>
    </>
  );
}

export function EarningsView() {
  const [person, setPerson] = useState("Deniz Kaya");
  return (
    <>
      <FilterButtons
        label="Eğitmen"
        items={["Deniz Kaya", "Ece Yılmaz"]}
        value={person}
        onChange={setPerson}
      />
      <div className="view-split">
        <section className="wide-surface">
          <h2>{person}</h2>
          <p>Merkez Stüdyo · Örnek gerçekleşmiş görevlendirme kesiti</p>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Görev</th>
                  <th>Değerleme</th>
                  <th>Örnek tutar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>20 Ekim · Ders görevi</th>
                  <td>Başlangıçta sabitlendi</td>
                  <td>{money(600)}</td>
                </tr>
                <tr>
                  <th>21 Ekim · Ders görevi</th>
                  <td>Başlangıçta sabitlendi</td>
                  <td>{money(450)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <aside className="view-detail">
          <h2>Anlaşma ve ödeme ayrı.</h2>
          <p>
            Sonradan değişen anlaşma veya geçmiş ödemeler gerçekleşmiş sabit
            değerlemeyi yeniden yazmaz.
          </p>
          <InfoPairs
            rows={[
              ["Örnek hakediş", money(1050)],
              ["Ödeme durumu", "Gerçek ödeme kaydı bağlı değil"],
              ["Bordro", "Bu ekranın kapsamı değil"],
            ]}
          />
          <DesignAction
            title="Eğitmen ödeme tasarımı"
            trigger="Ödeme tasarımını incele"
          >
            <p>{person} · Seçili hakedişler</p>
            <p>
              Kişi, merkez, para birimi ve seçili hakediş kapsamı birlikte
              doğrulanmalı. Ödeme veya düzeltme geçmiş kayıtları silmez.
            </p>
          </DesignAction>
        </aside>
      </div>
    </>
  );
}

export function NotificationsView() {
  const [filter, setFilter] = useState("Hepsi");
  const data = [
    {
      title: "Ders programı güncellendi",
      body: "Merkez Stüdyo için örnek program bilgisi.",
      state: "Yeni",
      href: "/takvim",
    },
    {
      title: "Belge sürümü yayımlandı",
      body: "Yeni belge gerekliliğini inceleyebilirsin.",
      state: "Okundu",
      href: "/belgeler",
    },
  ].filter((item) => filter === "Hepsi" || item.state === filter);
  return (
    <>
      <FilterButtons
        label="Bildirim filtresi"
        items={["Hepsi", "Yeni", "Okundu"]}
        value={filter}
        onChange={setFilter}
      />
      <section className="wide-surface">
        <p className="scope-note">
          Kendi uygulama içi inbox tasarımıdır; başka kullanıcıların
          bildirimleri veya dış e-posta teslimi değildir.
        </p>
        {data.map((item) => (
          <Link
            className="notification-record"
            key={item.title}
            href={item.href}
          >
            <StateTag>{item.state}</StateTag>
            <span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </section>
    </>
  );
}
