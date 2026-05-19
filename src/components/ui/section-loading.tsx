'use client';

import { motion } from 'framer-motion';

interface SectionLoadingProps {
  label?: string;
  className?: string;
  fullHeight?: boolean;
}

export function SectionLoading({
  label = 'Loading...',
  className = '',
  fullHeight = false,
}: SectionLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      aria-busy="true"
      aria-live="polite"
      role="status"
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/30 ${
        fullHeight ? 'min-h-[60vh]' : 'min-h-72'
      } ${className}`}
    >
      <div className="absolute inset-0 animate-pulse bg-black/55 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_36%)]" />

      <div className="relative flex flex-col items-center gap-4">
        <span className="h-9 w-9 animate-spin rounded-full border border-white/15 border-t-white shadow-[0_0_32px_rgba(255,255,255,0.08)]" />
        <span className="text-sm font-medium text-white/60">{label}</span>
      </div>
    </motion.div>
  );
}
