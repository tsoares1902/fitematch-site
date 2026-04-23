export type SignUpProductRole = 'candidate' | 'recruiter';

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  birthday: string;
  productRole: SignUpProductRole;
}

export interface SignInPayload {
  email: string;
  password: string;
  client?: AuthClientContextInterface;
}

export interface MePayload {
  token: string;
}

export interface UpdateMePayload {
  name?: string;
  birthday?: string;
}

export interface ActivationCodePayload {
  email: string;
}

export interface ActivateAccountPayload {
  email: string;
  code: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface SignOutPayload {
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  birthday?: string;
  candidateProfile?: {
    availability?: string[];
    contacts?: {
      address?: {
        city?: string;
        complement?: string;
        country?: string;
        neighborhood?: string;
        number?: string;
        state?: string;
        street?: string;
        zipCode?: string;
      };
      phone?: {
        country?: string;
        isTelegram?: boolean;
        isWhatsapp?: boolean;
        number?: string;
      };
      social?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        tiktok?: string;
        twitter?: string;
        x?: string;
        youtube?: string;
      };
    };
    diversity?: {
      genderIdentity?: string;
      sexualOrientation?: string;
    };
    documents?: {
      cpf?: {
        number?: string;
      };
      cref?: {
        category?: string;
        isActive?: boolean;
        number?: string;
      };
      passport?: {
        country?: string;
        expirationDate?: string;
        number?: string;
      };
      rg?: {
        issuer?: string;
        number?: string;
        state?: string;
      };
    };
    educations?: Array<{
      courseName?: string;
      courseType?: string;
      endYear?: number;
      institution?: string;
      isOngoing?: boolean;
      startYear?: number;
    }>;
    ethnicity?: string;
    media?: {
      resumeUrl?: string;
    };
    physicalAttributes?: {
      height?: number;
      weight?: number;
    };
    professionalExperiences?: Array<{
      companyName?: string;
      endYear?: number;
      isCurrent?: boolean;
      role?: string;
      startYear?: number;
    }>;
    uniform?: {
      jacketSize?: string;
      pantsSize?: string;
      shoeSize?: number;
      shoeSizeUnit?: string;
      shortSize?: string;
      tShirtSize?: string;
    };
  };
  productRole?: string;
  adminRole?: string;
  permissions?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthClientContextInterface {
  browser?: string;
  deviceType?: string;
  ip?: string;
  os?: string;
  timezone?: string;
  userAgent?: string;
}

export interface AuthAccessItemInterface {
  id?: string;
  sessionId?: string;
  startedAt?: string;
  loggedAt?: string;
  browser?: string;
  deviceType?: string;
  ip?: string;
  os?: string;
  timezone?: string;
  client?: AuthClientContextInterface;
}

export interface GetSessionsByUserPayload {
  access_token: string;
  userId: string;
}

export interface GetSessionsByUserResponse {
  items: AuthAccessItemInterface[];
}

export interface SignUpResponse {
  id: string;
  name: string;
  email: string;
  birthday: string;
  productRole: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface ActivationCodeResponse {
  message: string;
}

export interface ActivateAccountResponse {
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignOutResponse {
  message: string;
}
