export interface CompanyData {
  id?: number;
  verified?: boolean;
  name: string;
  companyLogo?: string;
  email?: string;
  company_name?: string;
  designation?: string;
  phone?: string;
  website?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  is_profile_complete?: boolean;
  profileProgress?: number;
  // updateProfileProgress?: (progress: number) => Promise<void>;
  // updateUserProfile?: (data: any) => Promise<void>;
}

export interface CompanyRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  industry: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
}

export interface CompanyLoginData {
  email: string;
  password: string;
}

export interface CompanyPublicData {
  id: number;
  name: string;
  companyLogo?: string;
  bannerUrl?: string;
  tagline?: string;
  aboutUs?: string;
  aboutUsPosterUrl?: string;
  website?: string;
  industry?: string;
  minCompanySize?: number;
  maxCompanySize?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  email?: string;
  phone?: string;
  rating?: number;
  ratingsCount?: number;
  tags?: string;
  foundationYear?: number;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
