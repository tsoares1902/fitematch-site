export interface CreateCompanyRequestInterface {
  slug: string;
  name: string;
  address: {
    street: string;
    number: number;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
  social: {
    website: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  role: string;
  status: string;
}
