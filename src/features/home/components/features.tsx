'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaApple } from 'react-icons/fa';
import { IoLogoAndroid } from 'react-icons/io';
import { BrainCircuit, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: BrainCircuit,
    titleKey: 'featureIntelligenceTitle',
    descriptionKey: 'featureIntelligenceDescription',
  },
  {
    icon: ShieldCheck,
    titleKey: 'featureTrustTitle',
    descriptionKey: 'featureTrustDescription',
  },
  {
    icon: IoLogoAndroid,
    titleKey: 'featureAndroidTitle',
    descriptionKey: 'featureAndroidDescription',
  },
  {
    icon: FaApple,
    titleKey: 'featureIosTitle',
    descriptionKey: 'featureIosDescription',
  },
];

export function HomeFeatures() {
  const t = useTranslations('Home');

  return (
    <section className="border-t border-zinc-900 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.26em] text-lime-400">
            {t('featuresTitle')}
          </p>
          <p className="mt-5 text-lg leading-8 text-zinc-400">{t('featuresDescription')}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur transition-all duration-300 hover:border-lime-500/30 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_18px_60px_rgba(0,0,0,0.32),0_0_30px_rgba(34,197,94,0.08)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-50">{t(feature.titleKey)}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{t(feature.descriptionKey)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
