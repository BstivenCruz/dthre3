export interface Package {
  id: string;
  name: string;
  description?: string;
  credits: number;
  isUnlimited: boolean;
  price: number;
  durationDays: number;
  isActive: boolean;
}

export interface PackagesData {
  packages: Package[];
  activePackage?: {
    id: string;
    name: string;
    creditsRemaining: number;
    isUnlimited: boolean;
    validUntil: string;
  };
}
