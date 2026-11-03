export type QuotationStatus = 'New' | 'In Review' | 'Quoted' | 'Closed';
export const QUOTATION_STATUSES: readonly QuotationStatus[] = ['New', 'In Review', 'Quoted', 'Closed'];

export interface QuotationRequest {
  id: string;
  /** Demo reference, e.g. DEMO-QT-20261103-A7K2. */
  reference: string;
  createdAt: string;
  status: QuotationStatus;
  fullName: string;
  organisation: string;
  email: string;
  phone?: string;
  /** Slug of the equipment of interest, or empty for a general enquiry. */
  equipmentSlug?: string;
  equipmentName: string;
  quantity: number;
  details: string;
  /** True for pre-loaded sample rows; false for rows submitted in this browser. */
  isSample: boolean;
}

export interface QuotationInput {
  fullName: string;
  organisation: string;
  email: string;
  phone?: string;
  equipmentSlug?: string;
  equipmentName: string;
  quantity: number;
  details: string;
}
