import type { Category } from '@/features/equipment/equipment.types';

const baseCategories: Category[] = [
  { id: 'cat-microscopy', slug: 'microscopy-imaging', name: 'Microscopy & Imaging', description: 'Optical microscopes and imaging accessories for teaching and routine laboratory work.', sortOrder: 1 },
  { id: 'cat-weighing', slug: 'balances-weighing', name: 'Balances & Weighing', description: 'Analytical and precision balances for quantitative laboratory weighing.', sortOrder: 2 },
  { id: 'cat-separation', slug: 'centrifuges-separation', name: 'Centrifuges & Separation', description: 'Benchtop centrifuges and separation equipment for sample processing.', sortOrder: 3 },
  { id: 'cat-thermal', slug: 'heating-cooling-incubation', name: 'Heating, Cooling & Incubation', description: 'Ovens, incubators, water baths and thermal control equipment.', sortOrder: 4 },
  { id: 'cat-analytical', slug: 'analytical-instruments', name: 'Analytical Instruments', description: 'Spectrophotometers, pH and conductivity instruments for chemical analysis.', sortOrder: 5 },
  { id: 'cat-prep', slug: 'sample-preparation-mixing', name: 'Sample Preparation & Mixing', description: 'Stirrers, shakers, homogenisers and general preparation equipment.', sortOrder: 6 },
  { id: 'cat-safety', slug: 'safety-air-handling', name: 'Safety & Air Handling', description: 'Fume extraction and laboratory safety equipment.', sortOrder: 7 },
];

import { categoriesAr } from './content.ar';

export const mockCategories: Category[] = baseCategories.map((c) => ({ ...c, i18n: { ar: categoriesAr[c.id] } }));
