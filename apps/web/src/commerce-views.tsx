"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CollectionDraft } from "./collection-draft";
import {
  CashCorrectionDraft,
  CreditActionDraft,
  SaleRefundDraft,
} from "./finance-action-drafts";
import { EventRegistrationDraft, EventCancelDraft } from "./supporting-drafts";
import { SaleDraft } from "./sale-draft";
import { people, products, events, money } from "./design-data";
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

export function FinanceView() {
  return (
    <Suspense fallback={<p role="status">Finans görünümü hazırlanıyor…</p>}>
      <FinanceFromLink />
    </Suspense>
  );
}
function FinanceFromLink() {
  const params = useSearchParams();
  const requested = params.get("person");
  const initialId =
    requested === null
      ? "person-a"
      : people.some(
            (person) =>
              person.id === requested && person.roles.includes("Öğrenci"),
          )
        ? requested
        : "";
  return <FinancePanel key={requested ?? "default"} initialId={initialId} />;
}
function FinancePanel({ initialId }: { initialId: string }) {
  const [tab, setTab] = useState("Bakiyeler");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Hepsi");
  const { selectedId, setSelectedId, detailRef } =
    useDetailSelection(initialId);
  const data = people.filter(
    (person) =>
      person.roles.includes("Öğrenci") &&
      person.name
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")) &&
      (filter === "Hepsi" ||
        (filter === "Borçlu" ? person.debt > 0 : person.credit > 0)),
  );
  const selected = data.find((person) => person.id === selectedId);
  return (
    <>
      <FilterButtons
        label="Finans görünümü"
        items={["Bakiyeler", "Hareketler", "Merkez hesaplaşması"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Bakiyeler" ? (
        <>
          <div className="view-toolbar">
            <ViewSearch
              label="Finans kişisi ara"
              value={query}
              onChange={setQuery}
            />
            <FilterButtons
              label="Bakiye filtresi"
              items={["Hepsi", "Borçlu", "Alacaklı"]}
              value={filter}
              onChange={setFilter}
            />
          </div>
          <div className="view-split">
            <section
              id="finance-balances"
              data-master-list
              tabIndex={-1}
              aria-label="Bakiye listesi"
            >
              <div className="comparison-table-wrap">
                <table className="comparison-table">
                  <caption>Merkez Stüdyo · Örnek öğrenci bakiyeleri</caption>
                  <thead>
                    <tr>
                      <th>Kişi</th>
                      <th>Borç</th>
                      <th>Alacak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((person) => (
                      <tr
                        key={person.id}
                        data-selected={selectedId === person.id}
                      >
                        <th scope="row">
                          <button onClick={() => setSelectedId(person.id)}>
                            {person.name}
                          </button>
                        </th>
                        <td>{money(person.debt)}</td>
                        <td>{money(person.credit)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Görünen toplam</th>
                      <td>{money(data.reduce((sum, p) => sum + p.debt, 0))}</td>
                      <td>
                        {money(data.reduce((sum, p) => sum + p.credit, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {data.length === 0 ? (
                <EmptyView
                  onReset={() => {
                    setQuery("");
                    setFilter("Hepsi");
                  }}
                />
              ) : null}
              <p className="scope-note">
                Alacaklar borçlardan otomatik düşülmez. Bu ekran ödeme veya
                mahsup yapmaz.
              </p>
            </section>
            <aside
              ref={detailRef}
              tabIndex={-1}
              className="view-detail"
              aria-label="Finans ayrıntısı"
            >
              {selected ? (
                <>
                  <ReturnToList
                    targetId="finance-balances"
                    label="Bakiyelere dön"
                  />
                  <StateTag>Öğrenci bakiyesi</StateTag>
                  <h2>{selected.name}</h2>
                  <div className="balance-grid">
                    <div>
                      <span>Borç</span>
                      <strong>{money(selected.debt)}</strong>
                    </div>
                    <div>
                      <span>Alacak</span>
                      <strong>{money(selected.credit)}</strong>
                    </div>
                  </div>
                  <InfoPairs
                    rows={[
                      ["İlgili merkez", "Merkez Stüdyo"],
                      ["Para birimi", "TRY"],
                      ["Hareket geçmişi", "Bağlı düzeltmelerle korunur"],
                    ]}
                  />
                  <CollectionDraft key={selected.id} person={selected} />
                  <CreditActionDraft
                    key={`credit-${selected.id}`}
                    person={selected}
                  />
                </>
              ) : (
                <DetailPrompt />
              )}
            </aside>
          </div>
        </>
      ) : tab === "Hareketler" ? (
        <Ledger />
      ) : (
        <SettlementPreview />
      )}
    </>
  );
}
function Ledger() {
  return (
    <section className="wide-surface">
      <h2>Geçmiş silinmez.</h2>
      <p>Örnek bağlı hareketler · Elif Aksoy</p>
      <div className="draft-actions">
        <CashCorrectionDraft />
        <SaleRefundDraft />
      </div>
      <ol className="history-list">
        <li>
          <span>23 Ekim</span>
          <div>
            <strong>Hatalı tahsilat düzeltmesi</strong>
            <p>Önceki tahsilata bağlı ters kayıt. İlk hareket korunur.</p>
          </div>
          <b>−{money(300)}</b>
        </li>
        <li>
          <span>22 Ekim</span>
          <div>
            <strong>Manuel tahsilat</strong>
            <p>Örnek paket borcuna bağlandı.</p>
          </div>
          <b>+{money(300)}</b>
        </li>
        <li>
          <span>5 Ekim</span>
          <div>
            <strong>Paket satışı</strong>
            <p>8 derslik Salsa · Hak ve para kayıtları ayrı izlenir.</p>
          </div>
          <b>{money(2400)}</b>
        </li>
      </ol>
      <p className="scope-note">
        Seçilmiş hareket örneğidir; tam hesap ekstresi veya bakiye türetme
        kaynağı değildir.
      </p>
    </section>
  );
}
function SettlementPreview() {
  return (
    <section className="wide-surface">
      <StateTag>Başvuru ve ayrı onay</StateTag>
      <h2>Merkezler arasında hesaplaşma</h2>
      <p>Örnek başvuru · A Merkezinden B Merkezine · {money(1200)}</p>
      <div className="process-steps">
        <div>
          <strong>Başvuru</strong>
          <p>A merkezinde açık yetki gerekir. Başvuru bakiyeyi değiştirmez.</p>
        </div>
        <div>
          <strong>Karşı merkez onayı</strong>
          <p>
            B merkezindeki canlı yetki ayrıca doğrulanır. Aynı hesap iki
            kapsamda da yetkili olabilir.
          </p>
        </div>
        <div>
          <strong>Kesin kayıt</strong>
          <p>
            Onay, ilgili kayıtları atomik kesinleştirir; banka transferi
            değildir.
          </p>
        </div>
      </div>
      <p className="scope-note">
        Bu görünüm karar akışını anlatır. Başvuru veya onay gönderilmez.
      </p>
    </section>
  );
}

export function PackagesView() {
  const [filter, setFilter] = useState("Hepsi");
  const { selectedId, setSelectedId, detailRef } =
    useDetailSelection("product-a");
  const data = products.filter(
    (item) => filter === "Hepsi" || item.kind === filter,
  );
  const selected = data.find((item) => item.id === selectedId);
  return (
    <>
      <FilterButtons
        label="Ürün türü"
        items={["Hepsi", "Ders sayılı", "Süreli"]}
        value={filter}
        onChange={setFilter}
      />
      <div className="view-split">
        <section
          id="package-list"
          data-master-list
          tabIndex={-1}
          className="product-list"
          aria-label="Paket kataloğu"
        >
          {data.map((item) => (
            <button
              className="product-record"
              key={item.id}
              aria-pressed={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="product-kind">{item.kind}</span>
              <strong>{item.title}</strong>
              <p>{item.scope}</p>
              <div>
                <span>{item.credits}</span>
                <b>{money(item.price)}</b>
              </div>
            </button>
          ))}
        </section>
        <aside
          ref={detailRef}
          tabIndex={-1}
          className="view-detail"
          aria-label="Paket ayrıntısı"
        >
          {selected ? (
            <>
              <ReturnToList
                targetId="package-list"
                label="Paket listesine dön"
              />
              <StateTag>{selected.kind}</StateTag>
              <h2>{selected.title}</h2>
              <InfoPairs
                rows={[
                  ["Kullanım kapsamı", selected.scope],
                  ["Uygunluk", selected.use],
                  ["Hak / kota", selected.credits],
                  ["Örnek bedel", money(selected.price)],
                ]}
              />
              <p>{selected.period}</p>
              <p className="scope-note">
                Bitiş son kullanım günü değildir; başlangıç dahil, bitiş
                hariçtir. Para borcu ile kullanım hakkı aynı kayıt değildir.
              </p>
              <SaleDraft key={selected.id} product={selected} />
            </>
          ) : (
            <DetailPrompt />
          )}
        </aside>
      </div>
    </>
  );
}

export function EventsView() {
  const [filter, setFilter] = useState("Hepsi");
  const { selectedId, setSelectedId, detailRef } =
    useDetailSelection("event-a");
  const data = events.filter(
    (item) => filter === "Hepsi" || item.state === filter,
  );
  const selected = data.find((item) => item.id === selectedId);
  return (
    <>
      <FilterButtons
        label="Etkinlik durumu"
        items={["Hepsi", "Yayımlandı", "Taslak"]}
        value={filter}
        onChange={setFilter}
      />
      <div className="view-split">
        <section
          id="event-list"
          data-master-list
          tabIndex={-1}
          className="event-list"
          aria-label="Etkinlik listesi"
        >
          {data.map((item) => (
            <button
              className="event-record"
              key={item.id}
              aria-pressed={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="event-date-block">
                {item.date.split(" ")[0]}
                <small>Ekim</small>
              </span>
              <div>
                <StateTag>{item.state}</StateTag>
                <strong>{item.title}</strong>
                <small>{item.time} · Merkez Stüdyo</small>
                <p>
                  {item.people} / {item.capacity} katılımcı
                </p>
              </div>
            </button>
          ))}
        </section>
        <aside
          ref={detailRef}
          tabIndex={-1}
          className="view-detail"
          aria-label="Etkinlik ayrıntısı"
        >
          {selected ? (
            <>
              <ReturnToList
                targetId="event-list"
                label="Etkinlik listesine dön"
              />
              <StateTag>{selected.state}</StateTag>
              <h2>{selected.title}</h2>
              <InfoPairs
                rows={[
                  ["Tarih", selected.date],
                  ["Saat", selected.time],
                  ["Disiplin", selected.discipline],
                  ["Kontenjan", `${selected.people}/${selected.capacity}`],
                  ["Örnek bedel", money(selected.price)],
                ]}
              />
              <p className="scope-note">
                Etkinlik uygunluğu normal ders paketinden ayrı değerlendirilir.
                Etkinliklerde negatif kredi kullanılmaz.
              </p>
              {selected.state === "Yayımlandı" ? (
                <div className="draft-actions">
                  <EventRegistrationDraft
                    key={`event-register-${selected.id}`}
                    event={selected}
                  />
                  <EventCancelDraft
                    key={`event-cancel-${selected.id}`}
                    event={selected}
                  />
                </div>
              ) : (
                <p className="scope-note">
                  Taslak etkinlik, yayımlanmış kayıt akışı gibi sunulmaz.
                </p>
              )}
              <Link className="button" href="/">
                Günlük işlere dön
              </Link>
            </>
          ) : (
            <DetailPrompt />
          )}
        </aside>
      </div>
    </>
  );
}
