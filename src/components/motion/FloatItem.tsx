import type { ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { Parallax } from './Parallax';

const SPEEDS = [8, 16, 24];

/** Grid item that slides in from alternating sides and drifts at a column-dependent speed. */
export function FloatItem({ index, children }: { index: number; children: ReactNode }) {
  return (
    <Parallax distance={SPEEDS[index % SPEEDS.length] ?? 8} fill>
      <Reveal variant={index % 2 === 0 ? 'start' : 'end'} delay={(index % 3) * 0.08} fill>
        {children}
      </Reveal>
    </Parallax>
  );
}