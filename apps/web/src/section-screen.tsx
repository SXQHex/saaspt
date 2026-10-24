"use client";

import Link from "next/link";
import { useState } from "react";
import { sectionConfig, type Section } from "./section-config";
import { CalendarView, PeopleView } from "./operations-views";
import { SettingsView } from "./settings-view";
import { FinanceView, PackagesView, EventsView } from "./commerce-views";
import {
  LeadsView,
  DocumentsView,
  ReportsView,
  EarningsView,
  NotificationsView,
} from "./management-views";

export function SectionScreen({ section }: { section: Section }) {
  const [state, setState] = useState("İçerik");
  const config = sectionConfig[section];
  const views = {
    takvim: CalendarView,
    kisiler: PeopleView,
    finans: FinanceView,
    paketler: PackagesView,
    etkinlikler: EventsView,
    adaylar: LeadsView,
    raporlar: ReportsView,
    belgeler: DocumentsView,
    ayarlar: SettingsView,
    hakedisler: EarningsView,
    bildirimler: NotificationsView,
  };
  const View = views[section];
  return (
    <div className="section-screen">
      <header className="section-intro">
        <p>{config.title}</p>
        <h1>{config.heading}</h1>
        <span>{config.description}</span>
      </header>
      <div className="design-scope-note">
        <span aria-hidden="true">◇</span>
        <p>
          Sentetik verilerle tasarım önizlemesi. Gerçek kayıt, yetki veya hesap
          bağlantısı yok.
        </p>
      </div>
      <details className="screen-state-controls">
        <summary>Durum örnekleri</summary>
        <div
          className="view-filters"
          role="group"
          aria-label="Ekran durum örnekleri"
        >
          {[
            "İçerik",
            "Yükleniyor",
            "Boş",
            "Erişim yok",
            "Bağlantı hatası",
            "Oturum doldu",
          ].map((item) => (
            <button
              key={item}
              aria-pressed={state === item}
              onClick={() => setState(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <p>
          Bu seçim yalnız tasarım durumunu değiştirir; canlı erişim veya
          bağlantı kontrolü değildir.
        </p>
      </details>
      {state === "İçerik" ? (
        <View />
      ) : (
        <section
          className="screen-state"
          aria-live="polite"
          aria-busy={state === "Yükleniyor"}
        >
          <span aria-hidden="true">
            {state === "Yükleniyor" ? "◌" : state === "Erişim yok" ? "◇" : "○"}
          </span>
          <h2>
            {
              (
                {
                  Yükleniyor: "Kayıtlar hazırlanıyor…",
                  Boş: "Bu kapsamda kayıt yok.",
                  "Erişim yok": "Bu alanı görüntüleme yetkin yok.",
                  "Bağlantı hatası": "Veriler şu an alınamıyor.",
                  "Oturum doldu": "Oturumun süresi doldu.",
                } as Record<string, string>
              )[state]
            }
          </h2>
          <p>
            {state === "Erişim yok"
              ? "Yetkili bir bağlam seçilmeli veya ilgili erişim doğrulanmalı. Önceki kayıt ayrıntıları gösterilmez."
              : state === "Oturum doldu"
                ? "Gerçek uygulamada yeniden kimlik doğrulama gerekir. Bu tasarım giriş veya token yenileme işlemi yapmaz."
                : state === "Bağlantı hatası"
                  ? "Güncel veri alınamadı. Eski değerler kesin sonuç gibi gösterilmez."
                  : state === "Boş"
                    ? "Arama, filtre ve yetkili kapsam birlikte değerlendirilir."
                    : "Yükleme görünümü örneği. Canlı veri isteği gönderilmedi."}
          </p>
          <button className="button" onClick={() => setState("İçerik")}>
            İçerik örneğine dön
          </button>
        </section>
      )}
      <div className="section-related">
        <Link href="/hakedisler">Eğitmen hakedişleri</Link>
        <Link href="/bildirimler">Uygulama içi bildirimler</Link>
      </div>
    </div>
  );
}
