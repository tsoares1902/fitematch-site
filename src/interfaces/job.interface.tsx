export interface Job {
  id: string;
  companyId: string;
  slug: string;
  title: string;
  slots: number;
  role: string;
  isPaidAdvertising?: boolean | string | number;
  logo: string;
  logoAlt: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  company?: {
    name?: string;
    role?: string;
    logo?: string;
    cover?: string;
  };
}
