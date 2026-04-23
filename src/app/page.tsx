import type { Metadata } from "next";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import HeroSwitch from "@/components/HeroSwitch";
import Jobs from "@/components/Jobs";
import { isLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "fitematch | Vagas para profissionais de academias",
  description: "Encontre vagas em academias, studios e negócios fitness.",
};

export default async function Home({
  params,
}: Readonly<{
  params?: Promise<{ locale?: string }>;
}>) {
  const resolvedParams = params ? await params : undefined;
  const routeLocale = resolvedParams?.locale;
  const locale = routeLocale && isLocale(routeLocale) ? routeLocale : undefined;

  return (
    <>
      <ScrollUp />
      <HeroSwitch />
      <Features locale={locale} />
      <Jobs />
    </>
  );
}
