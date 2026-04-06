import { getAllCompanies } from "@/api/company.api";
import AdvertisementPageClient from "@/components/Advertisement/AdvertisementPageClient";

export default async function AdvertisementPage() {
  const companies = await getAllCompanies();

  return <AdvertisementPageClient companies={companies} />;
}
