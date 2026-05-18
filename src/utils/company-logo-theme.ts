interface CompanyLogoThemeInput {
  tradeName: string;
  slug?: string;
  logo?: string;
  media?: {
    logoUrl?: string;
  };
}

interface CompanyLogoTheme {
  background: string;
  borderColor: string;
  boxShadow: string;
  textColor: string;
}

const KNOWN_COMPANY_THEMES: Array<{ keys: string[]; theme: CompanyLogoTheme }> = [
  {
    keys: ['ocian'],
    theme: buildTheme('#0369a1'),
  },
  {
    keys: ['nexo'],
    theme: buildTheme('#166534'),
  },
  {
    keys: ['ironforce', 'iron-force', 'iron force'],
    theme: buildTheme('#4d7c0f'),
  },
  {
    keys: ['caicara', 'caiçara'],
    theme: buildTheme('#0f766e'),
  },
  {
    keys: ['serenity'],
    theme: buildTheme('#075985'),
  },
  {
    keys: ['inspire'],
    theme: buildTheme('#27272a'),
  },
];

const FALLBACK_THEMES = [
  buildTheme('#0f766e'),
  buildTheme('#1d4ed8'),
  buildTheme('#7c3aed'),
  buildTheme('#be123c'),
  buildTheme('#b45309'),
  buildTheme('#15803d'),
];

function buildTheme(baseColor: string): CompanyLogoTheme {
  return {
    background: baseColor,
    borderColor: baseColor,
    boxShadow: `0 18px 42px color-mix(in srgb, ${baseColor} 42%, transparent)`,
    textColor: '#ffffff',
  };
}

function getPlaceholderTheme(logoUrl?: string): CompanyLogoTheme | null {
  if (!logoUrl) {
    return null;
  }

  const match = logoUrl.match(/placehold\.co\/[^/]+\/([0-9a-f]{3,8})(?:\/([0-9a-f]{3,8}))?/i);

  if (!match) {
    return null;
  }

  const backgroundColor = `#${match[1]}`;
  const textColor = match[2] ? `#${match[2]}` : '#ffffff';

  return {
    background: backgroundColor,
    borderColor: backgroundColor,
    boxShadow: `0 18px 42px color-mix(in srgb, ${backgroundColor} 42%, transparent)`,
    textColor,
  };
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function hash(value: string) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function getCompanyLogoTheme(company: CompanyLogoThemeInput): CompanyLogoTheme {
  const placeholderTheme = getPlaceholderTheme(company.media?.logoUrl || company.logo);

  if (placeholderTheme) {
    return placeholderTheme;
  }

  const themeKey = normalize(
    [company.tradeName, company.slug, company.logo, company.media?.logoUrl]
      .filter(Boolean)
      .join(' '),
  );

  const knownTheme = KNOWN_COMPANY_THEMES.find(({ keys }) =>
    keys.some((key) => themeKey.includes(normalize(key))),
  );

  if (knownTheme) {
    return knownTheme.theme;
  }

  return FALLBACK_THEMES[hash(themeKey || company.tradeName) % FALLBACK_THEMES.length];
}
