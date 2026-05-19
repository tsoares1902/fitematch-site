import { Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function ContactChannels() {
  const t = await getTranslations('contact');

  const channels = [
    {
      label: t('channels.hours'),
      value: t('channels.hoursValue'),
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <div
            key={channel.label}
            className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-black text-lime-400">
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-medium text-zinc-100">{channel.label}</span>
              <span className="mt-1 block text-sm text-zinc-500">{channel.value}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
