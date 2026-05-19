import { render, screen } from '@testing-library/react';
import { JobCard } from './job-card';
import { JobStatusEnum } from '@/types/entities/job.entity';
import { EducationLevelEnum, LanguagesEnum, LanguagesLevelEnum } from '@/types/entities/job.entity';

const company = {
  _id: 'company-1',
  slug: 'smart-fit',
  tradeName: 'Smart Fit',
  contacts: {
    website: 'https://smartfit.com',
    address: {
      city: 'São Paulo',
      state: 'SP',
    },
  },
  media: {
    logoUrl: '/logo.png',
  },
};

const job = {
  _id: 'job-1',
  slug: 'personal-trainer',
  companyId: 'company-1',
  title: 'Personal Trainer',
  description: 'Atendimento aos alunos.',
  slots: 2,
  contractType: 'clt',
  company: company as never,
  status: JobStatusEnum.ACTIVE,
  benefits: {
    salary: 3500,
    healthInsurance: true,
    dentalInsurance: false,
    alimentationVoucher: true,
    transportationVoucher: true,
  },
  requirements: {
    educationLevel: EducationLevelEnum.BACHELOR,
    minExperienceYears: 2,
    languages: [
      {
        name: LanguagesEnum.ENGLISH,
        level: LanguagesLevelEnum.BASIC,
      },
    ],
  },
  media: {
    coverUrl: '/cover.png',
  },
} as const;

describe('JobCard', () => {
  it('render title/company', () => {
    render(<JobCard job={job as never} company={company as never} />);

    expect(screen.getByText('Personal Trainer')).toBeInTheDocument();
    expect(screen.getByText('São Paulo · SP')).toBeInTheDocument();
  });

  it('links', () => {
    render(<JobCard job={job as never} company={company as never} />);

    expect(screen.getByRole('link', { name: /Detalhes/i })).toHaveAttribute('href', '/jobs/job-1');
  });

  it('badges', () => {
    render(<JobCard job={job as never} company={company as never} />);

    expect(screen.getByText('CLT')).toBeInTheDocument();
    expect(screen.getByText('2 vagas')).toBeInTheDocument();
    expect(screen.getByText(/R\$?\s?3.500,00/)).toBeInTheDocument();
  });

  it('fallback de imagem', () => {
    render(
      <JobCard
        job={
          {
            ...job,
            media: undefined,
          } as never
        }
        company={company as never}
      />,
    );

    expect(screen.queryByAltText('Personal Trainer')).not.toBeInTheDocument();
    expect(screen.getByText('2 vagas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Detalhes/i })).toHaveAttribute('href', '/jobs/job-1');
  });
});
