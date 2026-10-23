import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../src/app-shell";

export const metadata: Metadata = {
  title: "SaaSPT · Günlük program",
  description: "Merkez yöneticisi için günlük program tasarım önizlemesi.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" dir="ltr">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
