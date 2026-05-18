export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  FAQ: '/faq',
  TERMS_OF_USE: '/terms-of-use',
  PRIVACY_POLICY: '/privacy-policy',
  HEALTH_CHECK: '/health-check',

  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ACTIVATION_CODE: '/activation-code',
  ACTIVATE_ACCOUNT: '/activate-account',

  PROFILE: '/profile',
  SESSIONS: '/sessions',
  APPLICATIONS: '/applications',

  CANDIDATE_DASHBOARD: '/candidate',
  CANDIDATE_PROFILE: '/candidate/profile',
  CANDIDATE_APPLICATIONS: '/candidate/applications',
  CANDIDATE_SESSIONS: '/candidate/sessions',

  RECRUITER_DASHBOARD: '/recruiter',
  RECRUITER_PROFILE: '/recruiter/profile',
  RECRUITER_COMPANY: '/recruiter/company',
  RECRUITER_JOBS: '/recruiter/jobs',
  RECRUITER_SESSIONS: '/recruiter/sessions',
  RECRUITER_NEW_JOB: '/recruiter/jobs/new',
  RECRUITER_EDIT_JOB: (jobId: string) => `/recruiter/jobs/${jobId}/edit`,
  RECRUITER_JOB_APPLICATIONS: (jobId: string) => `/recruiter/jobs/${jobId}/applications`,
};
