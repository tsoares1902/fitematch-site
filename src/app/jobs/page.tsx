import type { Metadata } from "next";
import Jobs from "@/components/Jobs";

export const metadata: Metadata = {
  title: "fitematch | Vagas",
  description: "Confira as vagas disponíveis na fitematch.",
};

export default function JobsPage() {
  return <main className="pt-8"><Jobs /></main>;
}
