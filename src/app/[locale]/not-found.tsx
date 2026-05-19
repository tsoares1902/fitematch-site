import Link from 'next/link';
import { FaArrowLeft, FaBriefcase, FaHome } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-20">
      <div className="relative w-full max-w-3xl text-center">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-100/5 blur-3xl" />

        <div className="relative rounded-3xl border border-gray-800 bg-black p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-12">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-gray-700 bg-gray-950 text-gray-100">
            <span className="text-4xl font-black">404</span>
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-100 md:text-5xl">
            Ops, página não encontrada!
          </h1>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={ROUTES.HOME}>
              <Button variant="positive" icon={<FaHome />}>
                Ir para home
              </Button>
            </Link>

            <Link href={ROUTES.JOBS}>
              <Button variant="login" icon={<FaBriefcase />}>
                Ver vagas
              </Button>
            </Link>

            <Link href={ROUTES.HOME}>
              <Button variant="profile" icon={<FaArrowLeft />}>
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
