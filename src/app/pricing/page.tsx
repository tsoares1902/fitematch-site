import type { Metadata } from "next";
import Pricing from "@/components/Pricing";

export const metadata: Metadata = {
  title: "fitematch | Preços",
  description: "Conheça os planos e preços da fitematch.",
};

export default function PricingPage() {
  return <main className="pt-8"><Pricing /></main>;
}
