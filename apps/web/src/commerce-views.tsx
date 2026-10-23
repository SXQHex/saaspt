"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@saaspt/ui/button";
import { people, products, events, money } from "./design-data";
import {
  useDetailSelection,
  ViewSearch,
  FilterButtons,
  EmptyView,
  DetailPrompt,
  StateTag,
  InfoPairs,
  DesignAction,
} from "./view-primitives";

export function FinanceView() {
  const [tab, setTab] = useState("Bakiyeler");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Hepsi");
  const { selectedId, setSelectedId, detailRef } =
    useDetailSelection("person-a");
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
            <section>
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
                  <CollectionDraft key={selected.id} name={selected.name} />
                  <DesignAction
                    title="Alacak ve iade ayrımı"
                    trigger="Alacak işlemlerini incele"
                  >
                    <p>
                      {selected.name} için örnek alacak:{" "}
                      {money(selected.credit)}
                    </p>
                    <InfoPairs
                      rows={[
                        ["Nakit iade", "Açık yetkili ayrı işlem"],
                        [
                          "Mahsup",
                          "Seçili borca, kapsam ve para birimi doğrulanarak",
                        ],
                        ["Otomatik işlem", "Yok"],
                      ]}
                    />
                    <p>
                      İade geçmişi silmez. Bu tasarım tutar kaydetmez veya para
                      transfer etmez.
                    </p>
                  </DesignAction>
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
function CollectionDraft({ name }: { name: string }) {
  const [amount, setAmount] = useState("300");
  const [note, setNote] = useState("");
  const [review, setReview] = useState(false);
  return (
    <DesignAction
      title="Manuel tahsilat taslağı"
      trigger="Tahsilat tasarımını aç"
    >
      <p>{name} · Merkez Stüdyo · TRY</p>
      <form
        className="draft-form"
        onSubmit={(event) => {
          event.preventDefault();
          setReview(true);
        }}
      >
        <label>
          Bağlanacak borç
          <select defaultValue="sale">
            <option value="sale">Örnek paket satış borcu</option>
          </select>
        </label>
        <label>
          Tahsilat tutarı (TRY)
          <input
            name="collection-amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setReview(false);
            }}
          />
        </label>
        <label>
          Açıklama
          <textarea
            name="collection-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Örnek tahsilat açıklaması…"
          />
        </label>
        <Button type="submit">Tahsilat taslağını incele</Button>
      </form>
      {review ? (
        <div className="review-summary" role="status">
          <h3>Kontrol edilecek taslak</h3>
          <p>
            {name} · {money(Number(amount))}
          </p>
          <p>
            Bu bir tahsilat makbuzu değildir. Canlı borç, dağıtım ve yetki
            doğrulanmadı; bakiye değişmedi.
          </p>
        </div>
      ) : null}
    </DesignAction>
  );
}
function Ledger() {
  return (
    <section className="wide-surface">
      <h2>Geçmiş silinmez.</h2>
      <p>Örnek bağlı hareketler · Elif Aksoy</p>
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
        <section className="product-list" aria-label="Paket kataloğu">
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
              <DesignAction
                title="Paket satış taslağı"
                trigger="Satış tasarımını incele"
              >
                <p>
                  {selected.title} · Örnek bedel {money(selected.price)}
                </p>
                <div className="draft-form">
                  <label>
                    Kişi
                    <select defaultValue="person-a">
                      {people
                        .filter((person) => person.roles.includes("Öğrenci"))
                        .map((person) => (
                          <option value={person.id} key={person.id}>
                            {person.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Başlangıç tarihi
                    <input type="date" defaultValue="2026-10-24" />
                  </label>
                  <label>
                    Bitiş sınırı
                    <input type="date" defaultValue="2026-11-24" />
                  </label>
                </div>
                <p>
                  Gerçek önizleme; kapsam, geçerlilik, borç ve hak etkilerini
                  backend'den döndürür. Tarihler bu taslakta otomatik
                  hesaplanmaz.
                </p>
                <p className="scope-note">
                  Satış, dondurma, yenileme ve sonlandırma kendi önizleme/uygula
                  sözleşmelerine bağlanacak.
                </p>
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
        <section className="event-list" aria-label="Etkinlik listesi">
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
                <DesignAction
                  title="Etkinlik kayıt hazırlığı"
                  trigger="Kayıt akışını incele"
                >
                  <div className="process-steps">
                    <div>
                      <strong>Ödeme hazırlığı</strong>
                      <p>
                        Tam ödeme şartlı örnekte hazırlık borcu oluşturulur. Bu
                        adım yer ayırmaz.
                      </p>
                    </div>
                    <div>
                      <strong>Bağlı borca tahsilat</strong>
                      <p>
                        Tahsilat ilgili hazırlık borcuna bağlanır; başka borca
                        ödeme şartı karşılamaz.
                      </p>
                    </div>
                    <div>
                      <strong>Kesin kayıt kontrolü</strong>
                      <p>
                        Kapasite ve uygunluk yeniden denetlenir. Yer dolmuşsa
                        kayıt oluşmaz; ilgili parasal düzeltme ve öğrenci
                        alacağı ayrı sonuçtur.
                      </p>
                    </div>
                  </div>
                  <p className="scope-note">
                    Bu ekranda ödeme alınmaz, yer ayrılmaz ve kesin kayıt
                    oluşturulmaz.
                  </p>
                </DesignAction>
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
