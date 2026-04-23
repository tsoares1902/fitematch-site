export type CompanyStatus =
  | 'pending'
  | 'active'
  | 'inactive'
  | 'banned';

export interface CompanyPhone {
  number?: string;
  countryCode?: string;
  areaCode?: string;
  isWhatsapp?: boolean;
  isTelegram?: boolean;
}

export interface CompanyAddress {
  street?: string;
  number?: string | number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface CompanySocial {
  facebook?: string;
  instagram?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface CompanyContacts {
  email: string;
  website?: string;
  phone: CompanyPhone;
  address: CompanyAddress;
  social?: CompanySocial;
}

export interface CompanyAudit {
  createdByUserId?: string;
}

export interface CompanyApproval {
  approvedAt?: string;
  approvedByUserId?: string;
}

export interface CompanyDocuments {
  cnpj?: string;
  socialDocument?: string;
  isVerified?: boolean;
}

export interface CompanyMedia {
  logoUrl?: string;
  coverUrl?: string;
  galleryUrls?: string[];
}

export interface CompanyItem {
  _id?: string;
  id: string;
  slug: string;
  tradeName: string;
  name?: string;
  legalName?: string;
  contacts: CompanyContacts;
  address?: CompanyAddress;
  social?: CompanySocial & {
    twitter?: string;
  };
  documents: CompanyDocuments;
  media: CompanyMedia;
  logo?: string | null;
  cover?: string | null;
  audit?: CompanyAudit;
  approval?: CompanyApproval;
  status: CompanyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyPayload {
  slug?: string;
  tradeName: string;
  legalName?: string;
  contacts: CompanyContacts;
  documents: CompanyDocuments;
  media: CompanyMedia;
}

export type CreateCompanyResponse = CompanyItem;

export interface UpdateCompanyPayload {
  slug?: string;
  tradeName?: string;
  legalName?: string;
  contacts?: Partial<CompanyContacts>;
  documents?: Partial<CompanyDocuments>;
  media?: Partial<CompanyMedia>;
}

export type Company = CompanyItem;

export type UpdateCompanyResponse = CompanyItem;

export type ReadCompanyResponse = CompanyItem;

export type ListCompaniesResponse = CompanyItem[];
