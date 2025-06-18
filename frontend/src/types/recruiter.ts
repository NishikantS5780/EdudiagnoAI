export interface RecruiterData {
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

export interface RecruiterLoginData {
  email: string;
  password: string;
}
