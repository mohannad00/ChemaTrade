import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  const open = css.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) { end = i; break; }
    }
  }
  const out: Record<string, string> = {};
  for (const m of css.slice(open + 1, end).matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]!] = m[2]!.trim();
  return out;
}

const light = block(':root');
const dark = { ...light, ...block("[data-theme='dark']") };

function rgb(value: string, over: [number, number, number]): [number, number, number] {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1]!.slice(i, i + 2), 16)) as [number, number, number];
  const rgba = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/.exec(value);
  if (rgba) {
    const a = Number(rgba[4]);
    return [1, 2, 3].map((i) => Math.round(Number(rgba[i]) * a + over[i - 1]! * (1 - a))) as [number, number, number];
  }
  throw new Error(`cannot parse ${value}`);
}
const lin = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]: [number, number, number]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
function ratio(fg: string, bg: string, theme: Record<string, string>): number {
  const base = rgb(theme['--paper']!, [255, 255, 255]);
  const b = rgb(theme[bg]!, base);
  const f = rgb(theme[fg]!, b);
  const [hi, lo] = [lum(f), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT_ON_SURFACES: [string, string][] = [
  ['--ink', '--paper'], ['--ink', '--paper-2'], ['--ink', '--card'], ['--ink', '--card-solid'], ['--ink', '--field'],
  ['--ink-2', '--paper'], ['--ink-2', '--paper-2'], ['--ink-2', '--card'],
  ['--muted', '--paper'], ['--muted', '--paper-2'], ['--muted', '--card'],
  ['--coral-ink', '--paper'], ['--coral-ink', '--paper-2'], ['--coral-ink', '--card'],
  ['--accent', '--paper'], ['--accent', '--card'], ['--danger', '--paper'], ['--danger', '--card'], ['--success', '--paper'], ['--success', '--card'],
];
const WHITE_ON_SOLIDS = ['--solid-coral', '--solid-coral-strong', '--solid-accent', '--solid-danger', '--inverse-bg'];

describe.each([['light', light], ['dark', dark]] as const)('%s theme contrast (WCAG AA 4.5:1)', (_name, theme) => {
  it.each(TEXT_ON_SURFACES)('%s on %s', (fg, bg) => expect(ratio(fg, bg, theme)).toBeGreaterThanOrEqual(4.5));
  it.each(WHITE_ON_SOLIDS)('white on %s', (bg) => {
    const t = { ...theme, '--white': '#FFFFFF' };
    expect(ratio('--white', bg, t)).toBeGreaterThanOrEqual(4.5);
  });
  it('text on the inverse panel is readable', () => {
    for (const fg of ['--on-inverse-accent', '--on-inverse-text']) expect(ratio(fg, '--inverse-bg', theme)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('theme token completeness', () => {
  it('dark overrides only tokens that exist in light', () => {
    for (const key of Object.keys(block("[data-theme='dark']"))) expect(light[key], key).toBeDefined();
  });
});
