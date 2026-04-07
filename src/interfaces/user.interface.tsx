export interface User {
  id: string;
  role: string;
  username: string;
  isPaidMembership?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: string;
  status: string;
  phone?: string;
  isWhatsApp?: boolean;
  isTelegram?: boolean;
  identityDocument?: string;
  socialDocument?: string;
  street?: string;
  number?: string | number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
