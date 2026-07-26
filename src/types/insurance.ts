export interface Insurance {
  id?: number;
  vehicle: string;
  company: string;
  policy_number: string;
  policy_type: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  idv: number;
  addons: string;
  agent: string;
  contact_number: string;
  notes: string;
  attachment: string;
  created_at?: string;
}

