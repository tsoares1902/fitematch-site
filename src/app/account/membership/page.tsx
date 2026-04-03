import type { Metadata } from "next";
import Link from "next/link";
import { CiTrash } from "react-icons/ci";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
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
              <hr className="my-6 border-gray-200" />
              <h4 className="mb-4 text-base font-bold text-black md:text-lg">
                Alterar Plano
              </h4>
              <Link
                href="/pricing"
                className="text-body-color flex items-center justify-between gap-3 text-base leading-relaxed transition-colors duration-300 hover:text-gray-700 md:text-lg"
              >
                <span>Consulte os planos disponiveis.</span>
                <MdKeyboardDoubleArrowDown className="h-5 w-5 shrink-0" />
              </Link>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xs border border-gray-200 bg-white px-8 py-4 text-base font-medium text-black transition-colors duration-300 hover:bg-red-900 hover:text-[#FCFCFC]"
            >
              <CiTrash className="h-5 w-5 shrink-0" />
              <span>Cancelar minha assinatura</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
