import { useTranslations } from 'next-intl';

type JobsTranslator = ReturnType<typeof useTranslations>;

function normalizeContractType(value?: string) {
  return value
    ?.trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s-]+/g, '_');
}

export function getJobContractTypeLabel(value: string | undefined, t: JobsTranslator) {
  const normalizedValue = normalizeContractType(value);

  if (!normalizedValue) {
    return '';
  }

  const contractTypeMap: Record<string, string> = {
    clt: 'CLT',
    pj: 'PJ',
    freelance: 'Freelance',
    internship: t('contractInternship'),
    estagio: t('contractInternship'),
    temporary: t('contractTemporary'),
    temporario: t('contractTemporary'),
    part_time: t('contractPartTime'),
    meio_periodo: t('contractPartTime'),
    full_time: t('contractFullTime'),
    tempo_integral: t('contractFullTime'),
    autonomous: t('contractAutonomous'),
    autonomo: t('contractAutonomous'),
  };

  if (contractTypeMap[normalizedValue]) {
    return contractTypeMap[normalizedValue];
  }

  if (normalizedValue.includes('clt')) {
    return 'CLT';
  }

  if (normalizedValue.includes('pj')) {
    return 'PJ';
  }

  if (normalizedValue.includes('freela') || normalizedValue.includes('freelance')) {
    return 'Freelance';
  }

  if (normalizedValue.includes('estag')) {
    return t('contractInternship');
  }

  if (normalizedValue.includes('tempor')) {
    return t('contractTemporary');
  }

  if (normalizedValue.includes('part_time') || normalizedValue.includes('meio_periodo')) {
    return t('contractPartTime');
  }

  if (normalizedValue.includes('full_time') || normalizedValue.includes('tempo_integral')) {
    return t('contractFullTime');
  }

  if (normalizedValue.includes('autonom')) {
    return t('contractAutonomous');
  }

  return value;
}
