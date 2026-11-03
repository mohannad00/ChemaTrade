import type { Article } from '@/features/resources/resources.types';

const base = { author: 'Chema Trade (demo editorial)', isDemo: true as const };

/** SAMPLE EDITORIAL CONTENT: general laboratory-practice notes written for the demo. */
export const mockArticles: Article[] = [
  {
    ...base, id: 'ar-001', slug: 'choosing-an-analytical-balance', title: 'Choosing an analytical balance: readability, capacity and environment', tag: 'Weighing', status: 'Published', publishedAt: '2026-08-12T08:00:00.000Z', updatedAt: '2026-08-12T08:00:00.000Z',
    excerpt: 'Readability is only part of the story. Capacity, draft control and bench location all shape real-world weighing performance.',
    body: 'Selecting a balance starts with the smallest quantity you must weigh reliably, not with the headline readability figure.\n\n## Capacity and readability\n\nChoose a capacity comfortably above your heaviest load, including the container. Very small samples on a large-capacity balance are more affected by the balance\'s minimum weight than by its display resolution.\n\n## The bench matters\n\nDrafts, vibration and temperature changes disturb sensitive weighing. A stable, level bench away from doors, vents and foot traffic often improves results more than a higher-specification instrument.\n\n## Calibration and verification\n\nDecide early how the balance will be calibrated and verified, and how often. Requirements depend on your quality system, so confirm them with your quality manager and the instrument supplier.',
  },
  {
    ...base, id: 'ar-002', slug: 'microscope-care-basics', title: 'Microscope care basics for teaching laboratories', tag: 'Microscopy', status: 'Published', publishedAt: '2026-07-03T08:00:00.000Z', updatedAt: '2026-07-03T08:00:00.000Z',
    excerpt: 'A short routine of cleaning, covering and careful handling extends the useful life of optical instruments.',
    body: 'Optical instruments reward simple, consistent habits.\n\n## Before and after use\n\nLower the stage, rotate to the lowest-power objective, switch off the illumination and fit the dust cover. Avoid leaving slides on the stage.\n\n## Cleaning optics\n\nRemove dust with a blower first, then use lens tissue with a suitable lens-cleaning fluid. Never use abrasive materials. Follow the manufacturer\'s instructions for immersion objectives.\n\n## Know when to call for service\n\nIf the focus mechanism is stiff, illumination flickers or images remain unclear after cleaning, arrange an inspection rather than forcing the mechanism.',
  },
  {
    ...base, id: 'ar-003', slug: 'preventive-maintenance-planning', title: 'Planning preventive maintenance for laboratory equipment', tag: 'Maintenance', status: 'Published', publishedAt: '2026-06-18T08:00:00.000Z', updatedAt: '2026-06-18T08:00:00.000Z',
    excerpt: 'An equipment register and a simple schedule turn unplanned downtime into planned service.',
    body: 'Preventive maintenance is mostly about knowing what you have and when it was last checked.\n\n## Build an equipment register\n\nList each instrument with its model, serial number, location, installation date and last service date.\n\n## Set intervals from the manual\n\nManufacturers publish recommended service intervals. Adjust for usage intensity and environment, and record every intervention.\n\n## Keep critical spares in mind\n\nIdentify consumable and wear parts for your critical instruments, and agree lead times in advance so a failure does not become a long outage.',
  },
  {
    ...base, id: 'ar-004', slug: 'centrifuge-safety-checklist', title: 'A short safety checklist for benchtop centrifuges', tag: 'Safety', status: 'Published', publishedAt: '2026-05-21T08:00:00.000Z', updatedAt: '2026-05-21T08:00:00.000Z',
    excerpt: 'Balanced loads, matched tubes and a closed lid prevent the most common centrifuge incidents.',
    body: 'Most centrifuge incidents are preventable.\n\n## Balance every load\n\nPlace tubes opposite each other and match both volume and tube type. When in doubt, add a balance tube.\n\n## Inspect rotors and tubes\n\nCheck rotors and buckets for corrosion or cracks, and use only tubes rated for the speed in use.\n\n## Never override the lid lock\n\nWait until the rotor has fully stopped before opening the lid.',
  },
  {
    ...base, id: 'ar-005', slug: 'writing-a-good-quotation-request', title: 'How to write a good quotation request', tag: 'Procurement', status: 'Draft', publishedAt: '2026-10-01T08:00:00.000Z', updatedAt: '2026-10-01T08:00:00.000Z',
    excerpt: 'Draft: what to include so a supplier can respond with an accurate quotation the first time.',
    body: 'Draft article. State the application, the required capacity or range, any standards you must meet, and your site constraints.\n\n## Include delivery and installation needs\n\nMention the delivery location, whether installation or training is required, and your target timeline.',
  },
];
