'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Bike, Brain, Building2, Dumbbell, UsersRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const ABOUT_IMAGES = {
  office: '/images/about/fitematch_office.png',
  fun: '/images/about/fitemach-fun.png',
  gym: '/images/about/fitematch-gym.png',
  bathroom: '/images/about/fitematch-bathroom.png',
  meeting: '/images/about/fitematch-meeting.png',
  logo: '/images/about/fitematch_logo.png',
};

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.62, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-400">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-zinc-50 md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-8 text-zinc-400 md:text-lg">{description}</p>
      )}
    </div>
  );
}

function AboutStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-3 text-lg font-semibold text-zinc-50">{value}</p>
    </div>
  );
}

function ImagePanel({
  src,
  alt,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_28px_100px_rgba(0,0,0,0.42)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
    </div>
  );
}

export function AboutPageContent() {
  const t = useTranslations('about');
  const headerT = useTranslations('Header');
  const pageT = useTranslations('PublicPages');
  const spaces = ['office', 'meeting', 'gym', 'fun', 'bathroom'] as const;
  const [selectedSpace, setSelectedSpace] = useState<(typeof spaces)[number]>('office');
  const stats = ['foundation', 'city', 'segment', 'model'];
  const spaceIcons = {
    office: Building2,
    meeting: Brain,
    gym: Dumbbell,
    fun: UsersRound,
    bathroom: Bike,
  };
  const spaceImages = {
    office: ABOUT_IMAGES.office,
    meeting: ABOUT_IMAGES.meeting,
    gym: ABOUT_IMAGES.gym,
    fun: ABOUT_IMAGES.fun,
    bathroom: ABOUT_IMAGES.bathroom,
  };
  const SelectedSpaceIcon = spaceIcons[selectedSpace];

  return (
    <div className="overflow-hidden bg-black text-zinc-100">
      <section className="relative pb-12 pt-10 md:pb-16 md:pt-12">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: pageT('home'), href: ROUTES.HOME }, { label: headerT('about') }]}
          />

          <Reveal className="mt-8 overflow-hidden rounded-[2.25rem] border border-lime-500/15 bg-zinc-950/70 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.46)] backdrop-blur md:p-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <SectionTitle
                  eyebrow={t('story.eyebrow')}
                  title={t('story.title')}
                  description={t('story.description')}
                />
                <p className="mt-6 text-base leading-8 text-zinc-400">{t('story.body')}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {stats.map((key) => (
                    <AboutStat
                      key={key}
                      label={t(`story.stats.${key}.label`)}
                      value={t(`story.stats.${key}.value`)}
                    />
                  ))}
                </div>
              </div>
              <ImagePanel
                src={ABOUT_IMAGES.logo}
                alt={t('story.imageAlt')}
                priority
                className="aspect-[4/3] min-h-[28rem]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-lime-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle
              eyebrow={t('spaces.eyebrow')}
              title={t('spaces.title')}
              description={t('spaces.description')}
              align="center"
            />
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch"
          >
            <div className="order-2 flex flex-col gap-3 lg:order-1">
              {spaces.map((space) => {
                const Icon = spaceIcons[space];
                const isActive = selectedSpace === space;

                return (
                  <button
                    key={space}
                    type="button"
                    onClick={() => setSelectedSpace(space)}
                    className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-lime-500/35 bg-lime-500/10 shadow-[0_0_34px_rgba(132,204,22,0.08)]'
                        : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/70'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                        isActive
                          ? 'border-lime-500/30 bg-lime-500/10 text-lime-300'
                          : 'border-zinc-800 bg-black/40 text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-zinc-100">
                        {t(`spaces.items.${space}.title`)}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-zinc-500">
                        {t(`spaces.items.${space}.summary`)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="order-1 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_28px_100px_rgba(0,0,0,0.42)] lg:order-2">
              <motion.div
                key={selectedSpace}
                initial={{ opacity: 0.35, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.42, ease: 'easeOut' }}
                className="relative min-h-[34rem]"
              >
                <Image
                  src={spaceImages[selectedSpace]}
                  alt={t(`spaces.items.${selectedSpace}.imageAlt`)}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="max-w-2xl rounded-2xl border border-white/10 bg-black/55 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-lime-300">
                      <SelectedSpaceIcon className="h-5 w-5" />
                      <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                        {t(`spaces.items.${selectedSpace}.label`)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-50 md:text-3xl">
                      {t(`spaces.items.${selectedSpace}.headline`)}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-base">
                      {t(`spaces.items.${selectedSpace}.body`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
