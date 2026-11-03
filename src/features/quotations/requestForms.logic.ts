import { isEmail, minLength, required, type FieldErrors } from '@/lib/validation';
import type { QuotationInput } from './quotations.types';
import type { MaintenanceInput } from '@/features/maintenance/maintenance.types';

export interface QuotationFormValues {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  equipmentSlug: string;
  quantity: string;
  details: string;
}

export type QuotationField = keyof QuotationFormValues;

export function validateQuotation(v: QuotationFormValues): FieldErrors<QuotationField> {
  const qty = Number(v.quantity);
  return {
    fullName: required(v.fullName, 'Full name'),
    organisation: required(v.organisation, 'Organisation'),
    email: required(v.email, 'Email') ?? (isEmail(v.email) ? undefined : 'Enter a valid email address.'),
    quantity: !v.quantity.trim() ? 'Quantity is required.' : !Number.isInteger(qty) || qty < 1 || qty > 9999 ? 'Enter a whole number between 1 and 9999.' : undefined,
    details: required(v.details, 'Requirements') ?? minLength(v.details, 10, 'Requirements'),
  };
}

export function toQuotationInput(v: QuotationFormValues, equipmentName: string): QuotationInput {
  return {
    fullName: v.fullName.trim(),
    organisation: v.organisation.trim(),
    email: v.email.trim(),
    phone: v.phone.trim() || undefined,
    equipmentSlug: v.equipmentSlug || undefined,
    equipmentName: equipmentName || 'General enquiry',
    quantity: Number(v.quantity),
    details: v.details.trim(),
  };
}

export interface MaintenanceFormValues {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  equipmentDescription: string;
  serviceType: string;
  urgency: string;
  details: string;
}

export type MaintenanceField = keyof MaintenanceFormValues;

export function validateMaintenance(v: MaintenanceFormValues): FieldErrors<MaintenanceField> {
  return {
    fullName: required(v.fullName, 'Full name'),
    organisation: required(v.organisation, 'Organisation'),
    email: required(v.email, 'Email') ?? (isEmail(v.email) ? undefined : 'Enter a valid email address.'),
    equipmentDescription: required(v.equipmentDescription, 'Equipment'),
    serviceType: required(v.serviceType, 'Service type'),
    urgency: required(v.urgency, 'Urgency'),
    details: required(v.details, 'Problem description') ?? minLength(v.details, 10, 'Problem description'),
  };
}

export function toMaintenanceInput(v: MaintenanceFormValues): MaintenanceInput {
  return {
    fullName: v.fullName.trim(),
    organisation: v.organisation.trim(),
    email: v.email.trim(),
    phone: v.phone.trim() || undefined,
    equipmentDescription: v.equipmentDescription.trim(),
    serviceType: v.serviceType as MaintenanceInput['serviceType'],
    urgency: v.urgency as MaintenanceInput['urgency'],
    details: v.details.trim(),
  };
}
