export interface Company {
  id?: string;
  slug: string;
  name: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  role?: string;
  logo?: string | null;
  cover?: string | null;
  status?: string;
}
