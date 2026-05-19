'use client';

import { FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-4 py-20">
      <div className="w-full max-w-xl rounded-2xl border border-gray-800 bg-black p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-100">
          <FaExclamationTriangle className="h-9 w-9" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-gray-100">Algo deu errado</h1>

        <p className="mt-4 text-sm leading-6 text-gray-300">
          Não foi possível carregar esta página agora. Tente novamente em alguns instantes.
        </p>

        <div className="mt-8 flex justify-center">
          <Button type="button" variant="positive" icon={<FaRedoAlt />} onClick={reset}>
            Tentar novamente
          </Button>
        </div>
      </div>
    </section>
  );
}
