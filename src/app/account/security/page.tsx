import type { Metadata } from "next";

import SecurityPageClient from "./security-page-client";

export const metadata: Metadata = {
  title: "fitematch | Seguranca",
  description: "Acompanhe sessoes ativas e dados de seguranca da sua conta na fitematch.",
};

export default function SecurityPage() {
  return <SecurityPageClient />;
}
