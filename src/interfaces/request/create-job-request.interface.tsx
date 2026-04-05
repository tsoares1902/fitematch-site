export interface CreateJobRequestInterface {
  companyId: string;
  slug: string;
  title: string;
  slots: number;
  role: string;
  logo: string;
  logoAlt: string;
  status: string;
}