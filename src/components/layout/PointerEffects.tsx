import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/common';
import styles from './PointerEffects.module.css';

const INTERACTIVE = 'a, button, input, select, textarea, summary, label, [role="button"], [data-cursor="hover"]';

/**
 * Mouse highlight, shown only for fine pointers (mouse/trackpad):
 *  - a soft teal "light" that trails the pointer and lights the page beneath the content,
 *  - a small coral ring that follows exactly and grows over interactive elements.
 * Both are driven by CSS variables written in one rAF loop, so React never re-renders on mouse move.
 * Disabled for touch and for prefers-reduced-motion.
 */
export function PointerEffects() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const root = rootRef.current;
    if (reduced || !fine.matches || !root) return undefined;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let sx = tx; // smoothed spotlight position
    let sy = ty;
    let rx = tx; // ring position
    let ry = ty;
    let visible = false;
    let raf = 0;

    const apply = () => {
      sx += (tx - sx) * 0.12;
      sy += (ty - sy) * 0.12;
      rx += (tx - rx) * 0.38;
      ry += (ty - ry) * 0.38;
      root.style.setProperty('--sx', `${sx.toFixed(1)}px`);
      root.style.setProperty('--sy', `${sy.toFixed(1)}px`);
      root.style.setProperty('--rx', `${rx.toFixed(1)}px`);
      root.style.setProperty('--ry', `${ry.toFixed(1)}px`);
      root.style.setProperty('--ax', `${tx.toFixed(1)}px`);
      root.style.setProperty('--ay', `${ty.toFixed(1)}px`);
      const settled = Math.abs(tx - sx) < 0.2 && Math.abs(ty - sy) < 0.2 && Math.abs(tx - rx) < 0.2 && Math.abs(ty - ry) < 0.2;
      raf = settled ? 0 : requestAnimationFrame(apply);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        sx = rx = tx;
        sy = ry = ty;
        visible = true;
        root.dataset.on = 'true';
      }
      const target = e.target instanceof Element ? e.target : null;
      root.dataset.hover = target?.closest(INTERACTIVE) ? 'true' : 'false';
      const text = target?.closest('input:not([type=checkbox]):not([type=radio]), textarea');
      root.dataset.text = text ? 'true' : 'false';
      const glow = target?.closest<HTMLElement>('[data-glow]');
      if (glow) {
        const r = glow.getBoundingClientRect();
        glow.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
        glow.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
      }
      kick();
    };
    const hide = () => {
      visible = false;
      root.dataset.on = 'false';
    };
    const down = () => (root.dataset.down = 'true');
    const up = () => (root.dataset.down = 'false');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div ref={rootRef} className={styles.root} data-on="false" data-hover="false" data-down="false" data-text="false" aria-hidden="true">
      <div className={styles.spot} />
      <div className={styles.ring} />
      <div className={styles.dot} />
    </div>
  );
}
