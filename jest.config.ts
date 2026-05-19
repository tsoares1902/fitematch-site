import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
    '^.+\\.mjs$': 'babel-jest',
  },
  moduleNameMapper: {
    '^next-intl$': '<rootDir>/src/tests/mocks/next-intl.ts',
    '^next-intl/navigation$': '<rootDir>/src/tests/mocks/next-intl-navigation.tsx',
    '^next-intl/routing$': '<rootDir>/src/tests/mocks/next-intl-routing.ts',
    '^@/i18n/navigation$': '<rootDir>/src/tests/mocks/i18n-navigation.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^rettime$': '<rootDir>/node_modules/rettime/src/index.ts',
  },
  transformIgnorePatterns: ['/node_modules/(?!(msw|@mswjs|until-async|rettime)/)'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/contexts/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**',
    '!src/**/mocks/**',
    '!src/**/generated/**',
    '!src/**/*.types.ts',
    '!src/types/**',
    '!src/components/auth/**',
    '!src/components/companies/**',
    '!src/components/faq/**',
    '!src/components/home/**',
    '!src/components/jobs/job-details-page-content.tsx',
    '!src/components/layout/**',
    '!src/components/profile/**',
    '!src/components/recruiter/applications/**',
    '!src/components/sessions/**',
    '!src/components/status/**',
    '!src/components/seo/**',
    '!src/components/ui/badge.tsx',
    '!src/components/ui/breadcrumb.tsx',
    '!src/components/ui/card-title.tsx',
    '!src/components/ui/card.tsx',
    '!src/components/ui/inline-flash-message.tsx',
    '!src/components/ui/page-loading.tsx',
    '!src/components/ui/pagination-box.tsx',
    '!src/components/ui/section-title.tsx',
    '!src/components/ui/select.tsx',
    '!src/hooks/use-apply.ts',
    '!src/hooks/use-breakpoint.ts',
    '!src/hooks/use-job-applications.ts',
    '!src/hooks/use-job.ts',
    '!src/hooks/use-my-job.ts',
    '!src/services/health/**',
    '!src/utils/session-device.ts',
    '!src/constants/routes.ts',
    '!src/constants/api-endpoints.ts',
    '!src/constants/theme.ts',
    '!src/constants/styles.ts',
    '!src/constants/seo.ts',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '/mocks/',
    '/generated/',
    '/types/',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
  },
};

export default createJestConfig(config);
