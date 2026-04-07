import type { Metadata } from "next";
import AccountMenu from "@/components/Common/AccountMenu";

export const metadata: Metadata = {
  title: "fitematch | Membership",
  description: "Acesse os detalhes de membership da sua conta na fitematch.",
};

export default function MembershipPage() {
  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AccountMenu />
          </div>
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
              <h4 className="mb-4 text-base font-bold text-black md:text-lg">
                Plano Padrão
              </h4>
              <p className="text-body-color text-base leading-relaxed md:text-lg">
                Sua conta padrão está ativa no momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
