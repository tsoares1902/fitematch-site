'use client';

import { useTranslations } from 'next-intl';
import { FaSearch } from 'react-icons/fa';

interface JobSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobSearchInput({ value, onChange }: JobSearchInputProps) {
  const t = useTranslations('Jobs');

  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-lime-400">
          {t('searchTitle')}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
            <FaSearch className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <input
              id="jobs-search"
              type="text"
              placeholder={t('searchPlaceholder')}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-lg font-semibold text-white outline-none placeholder:text-zinc-500 md:text-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
