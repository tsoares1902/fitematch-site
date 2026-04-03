import type { Metadata } from "next";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";

export const metadata: Metadata = {
  title: "fitematch | Criar Conta",
  description: "Crie sua conta na fitematch.",
};

export default function SignUpPage() {
  return (
    <section className="relative z-10 overflow-hidden pt-8 pb-16 md:pb-20 lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                Criar sua conta
              </h3>
              <p className="text-body-color mb-10 text-center text-base font-medium">
                Escolha seu perfil para cadastro.
              </p>

              <div className="flex flex-col gap-4">
                <Link
                  href="/account/candidate/register"
                  className="shadow-submit flex w-full items-center justify-center gap-2 rounded-xs bg-green-900 px-9 py-4 text-base font-medium text-white duration-300 hover:bg-green-600"
                >
                  <FaUserPlus className="h-[1.1em] w-[1.1em] shrink-0" />
                  Criar conta de candidato
                </Link>
                <Link
                  href="/account/recruiter/register"
                  className="shadow-submit flex w-full items-center justify-center gap-2 rounded-xs bg-green-900 px-9 py-4 text-base font-medium text-white duration-300 hover:bg-green-600"
                >
                  <FaUserPlus className="h-[1.1em] w-[1.1em] shrink-0" />
                  Criar conta de recrutador
                </Link>
              </div>

              <p className="text-body-color mt-8 text-center text-base font-medium">
                Já tem uma conta?{" "}
                <Link href="/account/login" className="text-primary hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
