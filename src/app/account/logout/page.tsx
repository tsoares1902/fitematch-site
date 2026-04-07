import type { Metadata } from "next";

import LogoutPageClient from "./logout-page-client";

export const metadata: Metadata = {
  title: "fitematch | Sair da Conta",
  description: "Encerre sua sessao com seguranca na fitematch.",
};

export default function LogoutPage() {
  return <LogoutPageClient />;
}
