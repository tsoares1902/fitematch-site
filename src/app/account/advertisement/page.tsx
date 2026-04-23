import type { Metadata } from "next";

import { getAllCompanies } from "@/services/company/company.api";
import AdvertisementPageClient from "@/components/Advertisement/AdvertisementPageClient";

export const metadata: Metadata = {
  title: "fitematch | Anuncios",
  description: "Gerencie anuncios e empresas vinculadas a sua conta na fitematch.",
};

export default async function AdvertisementPage() {
  const companies = await getAllCompanies();

  return <AdvertisementPageClient companies={companies} />;
}
