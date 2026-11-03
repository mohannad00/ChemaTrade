import type { Equipment } from '@/features/equipment/equipment.types';

const T = '2026-09-14T09:00:00.000Z';

/**
 * SAMPLE CONTENT ONLY. Generic, brand-free examples used to demonstrate the design.
 * Specifications are illustrative and must not be relied upon.
 */
export const mockEquipment: Equipment[] = [
  {
    id: 'eq-001', slug: 'binocular-compound-microscope-demo', name: 'Binocular Compound Microscope', categoryId: 'cat-microscopy', status: 'Available', featured: true, isDemo: true, updatedAt: T,
    summary: 'Sample entry: LED-illuminated binocular microscope for teaching and routine laboratory observation.',
    description: 'A sample listing used to demonstrate the equipment detail page. A typical instrument in this class offers a quadruple nosepiece, Köhler-style illumination and a mechanical stage. Real models, configurations and availability are confirmed by Chema Trade on request.',
    specs: [{ label: 'Magnification range', value: '40× – 1000× (illustrative)' }, { label: 'Illumination', value: 'LED, adjustable' }, { label: 'Nosepiece', value: 'Quadruple' }, { label: 'Head', value: 'Binocular, 30° inclined' }, { label: 'Power', value: '100–240 V AC' }],
    illustrativePrice: 'Illustrative: from EUR 900 (not a quotation)',
  },
  {
    id: 'eq-002', slug: 'stereo-zoom-microscope-demo', name: 'Stereo Zoom Microscope', categoryId: 'cat-microscopy', status: 'Request a Quote', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: low-power stereo microscope for inspection and dissection work.',
    description: 'A sample listing for a stereoscopic zoom instrument used for inspection, dissection and electronics work. Configuration options such as stands and ring lights vary and are quoted individually.',
    specs: [{ label: 'Zoom ratio', value: '7:1 (illustrative)' }, { label: 'Working distance', value: '≈ 100 mm' }, { label: 'Stand', value: 'Pillar, table-top' }, { label: 'Illumination', value: 'Top and bottom LED' }],
  },
  {
    id: 'eq-003', slug: 'analytical-balance-220g-demo', name: 'Analytical Balance, 220 g', categoryId: 'cat-weighing', status: 'Available', featured: true, isDemo: true, updatedAt: T,
    summary: 'Sample entry: 0.1 mg readability analytical balance with draft shield.',
    description: 'A sample listing for a laboratory analytical balance with a glass draft shield. Calibration, verification and installation requirements depend on the intended use and should be discussed with Chema Trade.',
    specs: [{ label: 'Capacity', value: '220 g' }, { label: 'Readability', value: '0.1 mg' }, { label: 'Pan size', value: '≈ 90 mm diameter' }, { label: 'Calibration', value: 'Internal or external, model dependent' }, { label: 'Interface', value: 'USB / RS-232' }],
  },
  {
    id: 'eq-004', slug: 'precision-balance-2200g-demo', name: 'Precision Balance, 2200 g', categoryId: 'cat-weighing', status: 'Request a Quote', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: 10 mg readability top-loading balance for general laboratory weighing.',
    description: 'A sample listing for a top-loading precision balance suited to formulation, media preparation and general weighing tasks.',
    specs: [{ label: 'Capacity', value: '2200 g' }, { label: 'Readability', value: '10 mg' }, { label: 'Pan size', value: '≈ 180 × 180 mm' }, { label: 'Interface', value: 'USB' }],
  },
  {
    id: 'eq-005', slug: 'benchtop-centrifuge-demo', name: 'Benchtop Centrifuge', categoryId: 'cat-separation', status: 'Request a Quote', featured: true, isDemo: true, updatedAt: T,
    summary: 'Sample entry: compact benchtop centrifuge with interchangeable rotors.',
    description: 'A sample listing for a general-purpose benchtop centrifuge. Rotor selection, tube formats and safety accessories should be specified in the quotation request.',
    specs: [{ label: 'Max speed', value: 'Up to ≈ 6,000 rpm (illustrative)' }, { label: 'Capacity', value: '6 × 50 mL (rotor dependent)' }, { label: 'Timer', value: '1–99 min / continuous' }, { label: 'Lid', value: 'Safety lock' }],
  },
  {
    id: 'eq-006', slug: 'microcentrifuge-demo', name: 'Microcentrifuge', categoryId: 'cat-separation', status: 'Sourcing on Request', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: small-format microcentrifuge for 1.5/2.0 mL tubes.',
    description: 'A sample listing for a microcentrifuge used for small-volume sample processing. Sourced on request after specifications are agreed.',
    specs: [{ label: 'Rotor', value: '12 × 1.5/2.0 mL (illustrative)' }, { label: 'Max speed', value: 'Up to ≈ 13,000 rpm' }, { label: 'Noise', value: 'Model dependent' }],
  },
  {
    id: 'eq-007', slug: 'laboratory-drying-oven-demo', name: 'Laboratory Drying Oven', categoryId: 'cat-thermal', status: 'Available', featured: true, isDemo: true, updatedAt: T,
    summary: 'Sample entry: forced-convection drying oven for laboratory use.',
    description: 'A sample listing for a forced-air drying and heating oven. Chamber volume, shelving and temperature uniformity vary by model.',
    specs: [{ label: 'Temperature range', value: 'Ambient +10 °C to 250 °C (illustrative)' }, { label: 'Chamber volume', value: '≈ 55 L' }, { label: 'Airflow', value: 'Forced convection' }, { label: 'Controller', value: 'Digital PID' }],
  },
  {
    id: 'eq-008', slug: 'co2-incubator-demo', name: 'Laboratory Incubator', categoryId: 'cat-thermal', status: 'Request a Quote', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: benchtop incubator for microbiological and general laboratory use.',
    description: 'A sample listing for a laboratory incubator. Options such as gas control or cooling are model dependent and confirmed on request.',
    specs: [{ label: 'Temperature range', value: '5 °C above ambient to 70 °C (illustrative)' }, { label: 'Chamber volume', value: '≈ 50 L' }, { label: 'Control', value: 'Microprocessor' }],
  },
  {
    id: 'eq-009', slug: 'uv-vis-spectrophotometer-demo', name: 'UV-Vis Spectrophotometer', categoryId: 'cat-analytical', status: 'Request a Quote', featured: true, isDemo: true, updatedAt: T,
    summary: 'Sample entry: single-beam UV-Vis spectrophotometer for routine analysis.',
    description: 'A sample listing for a UV-Vis spectrophotometer used for concentration measurements and routine analytical methods. Software, accessories and validation support are specified per request.',
    specs: [{ label: 'Wavelength range', value: '190–1100 nm (illustrative)' }, { label: 'Optical system', value: 'Single beam' }, { label: 'Bandwidth', value: '2 nm' }, { label: 'Cell holder', value: 'Standard 10 mm cuvette' }],
  },
  {
    id: 'eq-010', slug: 'benchtop-ph-meter-demo', name: 'Benchtop pH / Conductivity Meter', categoryId: 'cat-analytical', status: 'Available', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: multi-parameter benchtop meter with electrode stand.',
    description: 'A sample listing for a benchtop meter supporting pH and conductivity measurements. Electrodes and calibration buffers are typically separate items.',
    specs: [{ label: 'pH range', value: '−2.00 to 16.00 (illustrative)' }, { label: 'Resolution', value: '0.01 pH' }, { label: 'Calibration', value: 'Up to 3-point' }, { label: 'Data output', value: 'USB' }],
  },
  {
    id: 'eq-011', slug: 'magnetic-stirrer-hotplate-demo', name: 'Magnetic Stirrer with Hotplate', categoryId: 'cat-prep', status: 'Available', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: ceramic-top hotplate stirrer for general preparation.',
    description: 'A sample listing for a hotplate stirrer with digital display and temperature probe input.',
    specs: [{ label: 'Stirring capacity', value: 'Up to ≈ 10 L (illustrative)' }, { label: 'Speed', value: '100–1500 rpm' }, { label: 'Plate temperature', value: 'Up to 350 °C' }],
  },
  {
    id: 'eq-012', slug: 'orbital-shaker-demo', name: 'Orbital Shaker', categoryId: 'cat-prep', status: 'Sourcing on Request', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: variable-speed orbital shaker with interchangeable platforms.',
    description: 'A sample listing for an orbital shaker. Platforms and clamp formats are chosen according to the flask or plate types in use.',
    specs: [{ label: 'Orbit', value: '≈ 20 mm' }, { label: 'Speed', value: '30–300 rpm (illustrative)' }, { label: 'Load', value: 'Model dependent' }],
  },
  {
    id: 'eq-013', slug: 'fume-hood-demo', name: 'Laboratory Fume Cupboard', categoryId: 'cat-safety', status: 'Sourcing on Request', featured: false, isDemo: true, updatedAt: T,
    summary: 'Sample entry: laboratory fume cupboard. Sizing, ducting and compliance are project specific.',
    description: 'A sample listing for a fume cupboard. Installation, ducting, airflow verification and applicable standards depend on the site and must be confirmed with Chema Trade and the relevant authorities.',
    specs: [{ label: 'Width', value: '1200 mm (illustrative)' }, { label: 'Sash', value: 'Vertical sliding' }, { label: 'Work surface', value: 'Chemical-resistant' }],
  },
];
