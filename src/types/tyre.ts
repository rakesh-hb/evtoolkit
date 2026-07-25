export interface TyreRecord {
  id: number;

  // Tyre details
  brand: string;
  model: string;
  size: string;

  // Purchase & Installation
  purchaseDate: string;
  installDate: string;
  odometer: number;

  cost: number;
  dealer: string;
  warrantyMonths: number;

  // Documents
  receipt?: string;

  // Notes
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export const tyreHistory: TyreRecord[] = [];