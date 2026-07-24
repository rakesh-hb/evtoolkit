export interface InsurancePolicy {
    id: number;
    provider: string;
    policyNumber: string;
    startDate: string;
    expiryDate: string;
    premium: number;
    coverage: string;
    ncb: number;
  }
  
  export const insurancePolicies: InsurancePolicy[] = [];