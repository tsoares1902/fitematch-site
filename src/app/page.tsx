import type { Metadata } from "next";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import HeroSwitch from "@/components/HeroSwitch";
import Jobs from "@/components/Jobs";

export const metadata: Metadata = {
  title: "fitematch | Vagas para profissionais de academias",
  description: "Encontre vagas em academias, studios e negócios fitness.",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <HeroSwitch />
      <Features />
      <Jobs />
    </>
  );
}
