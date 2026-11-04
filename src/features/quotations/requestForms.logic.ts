import { emailError, minLength, required, type FieldErrors } from '@/lib/validation';
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
    fullName: required(v.fullName, 'field.fullName'),
    organisation: required(v.organisation, 'field.organisation'),
    email: emailError(v.email),
    quantity: !v.quantity.trim()
      ? { key: 'validation.required', labelKey: 'field.quantity' }
      : !Number.isInteger(qty) || qty < 1 || qty > 9999
        ? { key: 'validation.quantity' }
        : undefined,
    details: required(v.details, 'field.requirements') ?? minLength(v.details, 10, 'field.requirements'),
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
    fullName: required(v.fullName, 'field.fullName'),
    organisation: required(v.organisation, 'field.organisation'),
    email: emailError(v.email),
    equipmentDescription: required(v.equipmentDescription, 'field.equipment'),
    serviceType: required(v.serviceType, 'field.serviceType'),
    urgency: required(v.urgency, 'field.urgency'),
    details: required(v.details, 'field.problem') ?? minLength(v.details, 10, 'field.problem'),
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
