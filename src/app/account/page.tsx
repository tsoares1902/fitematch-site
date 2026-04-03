import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "fitematch | Minha Conta",
  description: "Acesse a area principal da sua conta na fitematch.",
};

export default function AccountPage() {
  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
          <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
            Conta
          </span>
          <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            Minha conta
          </h1>
          <p className="text-body-color mb-8 text-base leading-relaxed md:text-lg">
            Esta e a area principal da sua conta. A partir daqui voce pode
            acessar seus dados de perfil, membership e seguranca dentro da
            plataforma.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/account/profile"
              className="shadow-submit bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-xs px-8 py-4 text-base font-medium text-white duration-300"
            >
              Perfil
            </Link>
            <Link
              href="/account/membership"
              className="shadow-submit bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-xs px-8 py-4 text-base font-medium text-white duration-300"
            >
              Membership
            </Link>
            <Link
              href="/account/security"
              className="shadow-submit bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-xs px-8 py-4 text-base font-medium text-white duration-300"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
