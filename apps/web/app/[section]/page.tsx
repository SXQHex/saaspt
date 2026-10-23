import { notFound } from "next/navigation";
import { sectionConfig, type Section } from "../../src/section-config";
import { SectionScreen } from "../../src/section-screen";

export function generateStaticParams() {
  return Object.keys(sectionConfig).map((section) => ({ section }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return {
    title: `SaaSPT · ${sectionConfig[section as Section]?.title ?? "Sayfa bulunamadı"}`,
  };
}
export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!Object.hasOwn(sectionConfig, section)) notFound();
  return <SectionScreen key={section} section={section as Section} />;
}
