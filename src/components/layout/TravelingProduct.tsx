import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '@/hooks/common';
import styles from './TravelingProduct.module.css';

export const PRODUCT_CUTOUT_SRC = '/assets/product-cutout.placeholder.svg';
export const PRODUCT_CUTOUT_ALT = 'Temporary placeholder illustration of a laboratory microscope';

const DESKTOP_QUERY = '(min-width: 1024px)';

/** Which presentation applies: scroll-linked travelling cutout, or a static one in the hero. */
export function useProductMode(): 'travel' | 'static' {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(() => (typeof window === 'undefined' ? true : window.matchMedia(DESKTOP_QUERY).matches));
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide && !reduced ? 'travel' : 'static';
}

interface Props {
  /** Ids of the home sections, in order. The product rests beside each in turn. */
  sectionIds: readonly string[];
  /** For each section: which side the product sits on. */
  sides: readonly ('left' | 'right')[];
}

interface Marks {
  scroll: number[];
  x: number[];
  rotate: number[];
  scale: number[];
}

const WIDTH = 340;

function measure(ids: readonly string[], sides: readonly ('left' | 'right')[]): Marks | null {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gutter = Math.max(20, Math.min(56, vw * 0.04));
  const maxW = 1280;
  const edge = Math.max(gutter, (vw - maxW) / 2 + gutter);
  const left = edge;
  const right = vw - edge - WIDTH;
  const rots = [-9, 7, -5, 8, -6, 4];
  const marks: Marks = { scroll: [], x: [], rotate: [], scale: [] };
  let prev = -Infinity;
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + window.scrollY + rect.height / 2 - vh / 2;
    const s = Math.max(center, prev + 1);
    prev = s;
    marks.scroll.push(s);
    marks.x.push(sides[i] === 'left' ? left : right);
    marks.rotate.push(rots[i % rots.length] ?? 0);
    marks.scale.push(i === 0 ? 1 : 0.92);
  });
  return marks.scroll.length >= 2 ? marks : null;
}

/** Fixed, pointer-transparent product cutout whose position, rotation and scale are linked to scroll. */
export function TravelingProduct({ sectionIds, sides }: Props) {
  const { scrollY } = useScroll();
  const [marks, setMarks] = useState<Marks | null>(null);

  useEffect(() => {
    const update = () => setMarks(measure(sectionIds, sides));
    update();
    const t = setTimeout(update, 600);
    window.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [sectionIds, sides]);

  const fallback = useMemo<Marks>(() => ({ scroll: [0, 1], x: [0, 0], rotate: [0, 0], scale: [1, 1] }), []);
  const m = marks ?? fallback;
  const x = useTransform(scrollY, m.scroll, m.x);
  const rotate = useTransform(scrollY, m.scroll, m.rotate);
  const scale = useTransform(scrollY, m.scroll, m.scale);

  if (!marks) return null;
  return (
    <motion.div className={styles.travel} style={{ x, rotate, scale, width: WIDTH }} aria-hidden="true" data-testid="traveling-product">
      <img src={PRODUCT_CUTOUT_SRC} alt="" width={WIDTH} height={Math.round(WIDTH * 1.45)} draggable={false} />
      <span className={styles.caption}>Placeholder cutout</span>
    </motion.div>
  );
}
