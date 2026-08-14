export interface DocumentRecord {
    id: number;
    user_id: string;
    title: string;
    category: string;
    vehicle: string;
    documentDate: string;
    file: string;
    notes?: string;
    createdAt?: string;
  }