'use client';

import { useState } from 'react';
import { Building2, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FaqItem } from './faq-item';

export function FaqTabs() {
  const [activeTab, setActiveTab] = useState<'candidate' | 'recruiter'>('candidate');
  const t = useTranslations('Faq');
  const candidateFaq = [
    {
      question: t('candidateCreateAccountQuestion'),
      answer: t('candidateCreateAccountAnswer'),
    },
    {
      question: t('candidateActivateQuestion'),
      answer: t('candidateActivateAnswer'),
    },
    {
      question: t('candidateApplyQuestion'),
      answer: t('candidateApplyAnswer'),
    },
    {
      question: t('candidateProfileQuestion'),
      answer: t('candidateProfileAnswer'),
    },
  ];
  const recruiterFaq = [
    {
      question: t('recruiterCreateQuestion'),
      answer: t('recruiterCreateAnswer'),
    },
    {
      question: t('recruiterCompanyQuestion'),
      answer: t('recruiterCompanyAnswer'),
    },
    {
      question: t('recruiterJobQuestion'),
      answer: t('recruiterJobAnswer'),
    },
    {
      question: t('recruiterProfileQuestion'),
      answer: t('recruiterProfileAnswer'),
    },
  ];

  const items = activeTab === 'candidate' ? candidateFaq : recruiterFaq;

  return (
    <div>
      <div className="mb-8 inline-flex rounded-2xl border border-zinc-800 bg-zinc-950/90 p-1 backdrop-blur">
        <button
          type="button"
          onClick={() => setActiveTab('candidate')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === 'candidate'
              ? 'bg-lime-500/10 text-lime-300'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <UserRound className="h-4 w-4" />
          {t('candidateTab')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recruiter')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === 'recruiter'
              ? 'bg-lime-500/10 text-lime-300'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <Building2 className="h-4 w-4" />
          {t('recruiterTab')}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
