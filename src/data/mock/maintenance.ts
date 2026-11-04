import type { MaintenanceRequest, MaintenanceServiceInfo, SparePartGroup } from '@/features/maintenance/maintenance.types';

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  { id: 'mt-001', reference: 'DEMO-MT-20261022-S001', createdAt: '2026-10-22T11:30:00.000Z', status: 'New', fullName: 'Sample Person F', organisation: 'Example Teaching Lab', email: 'sample.f@example.com', equipmentDescription: 'Compound microscope, illumination flickers', serviceType: 'Repair', urgency: 'Soon', details: 'Sample request: LED illumination flickers intermittently.', isSample: true },
  { id: 'mt-002', reference: 'DEMO-MT-20261015-S002', createdAt: '2026-10-15T09:00:00.000Z', status: 'Scheduled', fullName: 'Sample Person G', organisation: 'Example Research Group', email: 'sample.g@example.com', equipmentDescription: 'Analytical balance', serviceType: 'Calibration', urgency: 'Routine', details: 'Sample request: annual calibration for two analytical balances.', isSample: true },
  { id: 'mt-003', reference: 'DEMO-MT-20261008-S003', createdAt: '2026-10-08T14:12:00.000Z', status: 'In Review', fullName: 'Sample Person H', organisation: 'Example Quality Lab', email: 'sample.h@example.com', equipmentDescription: 'Benchtop centrifuge', serviceType: 'Spare parts', urgency: 'Urgent', details: 'Sample request: replacement rotor lid seal required.', isSample: true },
  { id: 'mt-004', reference: 'DEMO-MT-20260930-S004', createdAt: '2026-09-30T08:20:00.000Z', status: 'Completed', fullName: 'Sample Person I', organisation: 'Example Training Institute', email: 'sample.i@example.com', equipmentDescription: 'Drying oven', serviceType: 'Preventive maintenance', urgency: 'Routine', details: 'Sample request: routine yearly inspection.', isSample: true },
];

const baseServices: MaintenanceServiceInfo[] = [
  { id: 'ms-prev', title: 'Preventive maintenance', summary: 'Planned inspections that keep instruments reliable and reduce unplanned downtime.', points: ['Inspection and cleaning routines', 'Service history recording', 'Scheduling to suit your laboratory calendar'] },
  { id: 'ms-repair', title: 'Repair & fault diagnosis', summary: 'Fault-finding and repair of laboratory instruments.', points: ['Initial fault description and triage', 'Repair scope agreed before work begins', 'Replacement parts sourced as needed'] },
  { id: 'ms-cal', title: 'Calibration support', summary: 'Support arranging calibration and verification of measuring instruments.', points: ['Balances, thermal equipment and meters', 'Documentation requirements discussed up front', 'Third-party accredited providers where required'] },
  { id: 'ms-install', title: 'Installation & training', summary: 'Help with commissioning new equipment and training your users.', points: ['Site requirements checklist', 'Commissioning and acceptance check', 'Basic operator familiarisation'] },
];

const baseSpareParts: SparePartGroup[] = [
  { id: 'sp-optics', name: 'Optics & illumination', description: 'Objectives, eyepieces, lamps and LED modules for microscopes.', examples: ['Objective lenses', 'Eyepieces', 'LED illumination modules'], status: 'Sourcing on Request' },
  { id: 'sp-rotors', name: 'Rotors, seals & lids', description: 'Rotors, buckets, seals and lids for centrifuges.', examples: ['Rotors and buckets', 'Lid seals', 'Drive belts'], status: 'Request a Quote' },
  { id: 'sp-electrodes', name: 'Electrodes & probes', description: 'pH electrodes, conductivity cells and temperature probes.', examples: ['pH electrodes', 'Conductivity cells', 'Temperature probes'], status: 'Request a Quote' },
  { id: 'sp-heating', name: 'Heating & thermal parts', description: 'Heating elements, fans, thermostats and door gaskets.', examples: ['Heating elements', 'Circulation fans', 'Door gaskets'], status: 'Sourcing on Request' },
  { id: 'sp-weighing', name: 'Weighing components', description: 'Pans, draft shield parts and calibration weights.', examples: ['Weighing pans', 'Draft shield glass', 'Calibration weights'], status: 'Request a Quote' },
];

import { servicesAr, sparePartsAr } from './content.ar';

export const mockMaintenanceServices: MaintenanceServiceInfo[] = baseServices.map((s) => ({ ...s, i18n: { ar: servicesAr[s.id] } }));
export const mockSparePartGroups: SparePartGroup[] = baseSpareParts.map((p) => ({ ...p, i18n: { ar: sparePartsAr[p.id] } }));
