"use client";

import { useRef, useState } from "react";
import { Button } from "@saaspt/ui/button";

const money = (amount: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
type Task = "attendance" | "preview" | "collections";
type PreviewState = "stale" | "ready" | "unknown";

// Synthetic presentation data; never consumed as backend requests or responses.
const collections = [
  { name: "Örnek öğrenci A", debt: 1200, credit: 300 },
  { name: "Örnek öğrenci B", debt: 450, credit: 0 },
  { name: "Örnek öğrenci C", debt: 800, credit: 0 },
];

export function ManagerPriorities({
  onInspectSession,
}: {
  onInspectSession: (id: string) => void;
}) {
  const [task, setTask] = useState<Task>("attendance");
  const [previewState, setPreviewState] = useState<PreviewState>("stale");
  const dialog = useRef<HTMLDialogElement>(null);
  const totalDebt = collections.reduce((sum, person) => sum + person.debt, 0);
  const tasks: {
    id: Task;
    count: number;
    title: string;
    description: string;
  }[] = [
    {
      id: "attendance",
      count: 2,
      title: "Yoklama sonucu bekleniyor",
      description: "Saati geçmiş iki dersin kaydı açık.",
    },
    {
      id: "preview",
      count: 1,
      title: "İptal etkisi yeniden incelenmeli",
      description: "Ödeme değişti; önceki sonuç güncel değil.",
    },
    {
      id: "collections",
      count: collections.length,
      title: "Açık borçlar incelenmeli",
      description: `${money(totalDebt)} borç; alacaklar ayrı tutulur.`,
    },
  ];

  return (
    <section className="priorities" aria-labelledby="priorities-title">
      <header className="priorities-heading">
        <div>
          <h2 id="priorities-title">Önce ilgilenmen gerekenler</h2>
          <p>
            Merkez geneli · 23 Ekim örnek iş listesi. Program filtrelerinden
            bağımsızdır.
          </p>
        </div>
        <span className="sample-label">Senaryo</span>
      </header>
      <div className="priority-workspace">
        <div className="priority-list" role="group" aria-label="Bekleyen işler">
          {tasks.map((item) => (
            <button
              key={item.id}
              className="priority-item"
              aria-pressed={task === item.id}
              aria-controls="priority-detail"
              onClick={() => setTask(item.id)}
            >
              <span className="priority-count">{item.count}</span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div
          id="priority-detail"
          className="priority-detail"
          aria-live="polite"
        >
          {task === "attendance" ? (
            <>
              <h3>Seans bitti, yoklama henüz kapanmadı.</h3>
              <p>
                Saatin geçmesi katılımı veya hak tüketimini kesinleştirmez. Önce
                dersin kaydını incele.
              </p>
              <ul className="pending-sessions">
                <li>
                  <span>
                    <strong>Güne hareketle başla</strong>
                    <small>10:00–11:00 · Salon A</small>
                  </span>
                  <Button onClick={() => onInspectSession("demo-1")}>
                    Dersi incele
                  </Button>
                </li>
                <li>
                  <span>
                    <strong>Öğle arası akışı</strong>
                    <small>12:30–13:30 · Salon B</small>
                  </span>
                  <Button onClick={() => onInspectSession("demo-2")}>
                    Dersi incele
                  </Button>
                </li>
              </ul>
              <small className="scope-note">
                Örnek kayıtlar. Yoklama kaydetme bu önizlemede kapalıdır.
              </small>
            </>
          ) : null}
          {task === "preview" ? (
            <>
              <h3>Atölye iptal edilirse ne değişecek?</h3>
              <p>
                Örnek atölyenin ödeme bilgisi değişti. Eski önizlemeye dayanarak
                karar verme; güncel para ve hak etkisini birlikte incele.
              </p>
              <Button
                variant="accent"
                onClick={() => {
                  setPreviewState("stale");
                  dialog.current?.showModal();
                }}
              >
                İptal etkisini incele
              </Button>
              <small className="scope-note">
                Etkinlik iptal edilmez. Yalnız örnek etkiler gösterilir.
              </small>
            </>
          ) : null}
          {task === "collections" ? (
            <>
              <h3>Borç ve alacağı birlikte gör, ayrı değerlendir.</h3>
              <div className="debt-table-wrap">
                <table className="debt-table">
                  <caption>Örnek öğrenci bakiyeleri</caption>
                  <thead>
                    <tr>
                      <th scope="col">Kişi</th>
                      <th scope="col">Borç</th>
                      <th scope="col">Alacak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((person) => (
                      <tr key={person.name}>
                        <th scope="row">{person.name}</th>
                        <td>{money(person.debt)}</td>
                        <td>{money(person.credit)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row">Toplam</th>
                      <td>{money(totalDebt)}</td>
                      <td>
                        {money(
                          collections.reduce(
                            (sum, person) => sum + person.credit,
                            0,
                          ),
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <small className="scope-note">
                Alacak, borçtan otomatik düşülmedi. Bu görünüm tahsilat veya
                mahsup yapmaz.
              </small>
            </>
          ) : null}
        </div>
      </div>

      <dialog
        ref={dialog}
        className="effect-dialog"
        aria-labelledby="effect-title"
        aria-describedby="effect-description"
      >
        <div className="effect-header">
          <span className="sample-label">Sentetik işlem senaryosu</span>
          <Button
            aria-label="İptal önizlemesini kapat"
            onClick={() => dialog.current?.close()}
          >
            ×
          </Button>
        </div>
        <h2 id="effect-title">İptalin etkisi</h2>
        <p id="effect-description">Örnek hafta sonu atölyesi · Merkez Stüdyo</p>
        <label className="scenario-control">
          Tasarım durumunu dene
          <select
            value={previewState}
            onChange={(event) =>
              setPreviewState(event.target.value as PreviewState)
            }
          >
            <option value="stale">Önizleme eskidi</option>
            <option value="ready">Güncel örnek</option>
            <option value="unknown">İşlem sonucu bilinmiyor</option>
          </select>
        </label>
        <div className="effect-content" aria-live="polite">
          {previewState === "stale" ? (
            <div className="effect-message">
              <h3>Ödeme bilgisi değişti.</h3>
              <p>
                Eski tutarlar gösterilmiyor. Karar vermeden önce önizlemeyi
                yenile. Bu senaryoda henüz iptal uygulanmadı.
              </p>
              <Button variant="accent" onClick={() => setPreviewState("ready")}>
                Örnek önizlemeyi yenile
              </Button>
            </div>
          ) : null}
          {previewState === "ready" ? (
            <>
              <p className="effect-status">Güncel örnek · Henüz uygulanmadı</p>
              <dl className="effect-values">
                <div>
                  <dt>Kaldırılacak kalan borç</dt>
                  <dd>{money(600)}</dd>
                </div>
                <div>
                  <dt>Öğrenci alacağına eklenecek</dt>
                  <dd>{money(400)}</dd>
                </div>
                <div>
                  <dt>Serbest kalacak ayrılmış hak</dt>
                  <dd>2 ders hakkı</dd>
                </div>
                <div>
                  <dt>Geri verilecek tüketilmiş hak</dt>
                  <dd>1 ders hakkı</dd>
                </div>
                <div>
                  <dt>Otomatik nakit iade</dt>
                  <dd>Yok</dd>
                </div>
              </dl>
              <p className="effect-explanation">
                Para ve hak satırları farklı örnek katılımların etkileridir. Hak
                iadesi ayrıca parasal alacak üretmez; nakit iade ve mahsup ayrı
                işlemlerdir.
              </p>
              <div className="effect-unavailable">
                <strong>Uygulama bu önizlemede kapalı.</strong>
                <p>
                  Bu tutarlar canlı hesaplama değildir. Gerçek işlem, güncel
                  yetki ve önizleme doğrulandıktan sonra bağlanacak.
                </p>
              </div>
            </>
          ) : null}
          {previewState === "unknown" ? (
            <div className="effect-message">
              <h3>İşlemin sonucu henüz bilinmiyor.</h3>
              <p>
                Bağlantı kesilmesi, işlemin başarısız olduğu anlamına gelmez.
                Önce mevcut işlemin durumu doğrulanmalı; yeni bir iptal
                başlatılmamalı.
              </p>
              <p className="scope-note">
                Durum sorgulama bu tasarımda bağlı değil. Örnek, başarı veya
                başarısızlık kaydı üretmez.
              </p>
            </div>
          ) : null}
        </div>
        <form method="dialog" className="effect-footer">
          <Button type="submit">Önizlemeyi kapat</Button>
          <span>Hiçbir gerçek işlem yapılmaz.</span>
        </form>
      </dialog>
    </section>
  );
}
