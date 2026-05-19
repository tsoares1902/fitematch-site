import { ApiStatusCard } from '@/components/status/api-status-card';

export default function HealthCheckPage() {
  return (
    <section className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-100">Status da API</h1>

        <p className="mt-3 text-gray-700">Acompanhe o status atual da API da fitematch.</p>

        <div className="mt-10">
          <ApiStatusCard />
        </div>
      </div>
    </section>
  );
}
