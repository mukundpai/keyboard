'use client';

import { motion } from 'framer-motion';

/*
  Gentle ambient orbs that drift very slowly across the page background.
  Completely pointer-events-none so they never interfere with typing.
  Opacity is kept very low — just enough to feel alive, not distracting.
*/

interface Orb {
  size: number;       // px
  x: string;         // initial left position (%)
  y: string;         // initial top position (%)
  dx: number[];      // keyframe x translations (px)
  dy: number[];      // keyframe y translations (px)
  duration: number;  // seconds per loop
  delay: number;     // stagger start
  color: string;     // tailwind-compatible rgba
  blur: number;      // px blur
}

const ORBS: Orb[] = [
  {
    size: 520,
    x: '-8%',
    y: '-5%',
    dx: [0, 28, -12, 18, 0],
    dy: [0, 22, 40, 12, 0],
    duration: 38,
    delay: 0,
    color: 'rgba(212,165,116,0.07)',  // warm amber
    blur: 90,
  },
  {
    size: 400,
    x: '65%',
    y: '10%',
    dx: [0, -22, 10, -30, 0],
    dy: [0, 35, 12, -18, 0],
    duration: 44,
    delay: 6,
    color: 'rgba(244,193,129,0.055)', // light gold
    blur: 80,
  },
  {
    size: 340,
    x: '30%',
    y: '60%',
    dx: [0, 18, -8, 24, 0],
    dy: [0, -18, 28, 6, 0],
    duration: 50,
    delay: 14,
    color: 'rgba(139,111,71,0.065)',  // sepia brown
    blur: 100,
  },
  {
    size: 280,
    x: '82%',
    y: '72%',
    dx: [0, -14, 22, -6, 0],
    dy: [0, -24, -10, 16, 0],
    duration: 42,
    delay: 20,
    color: 'rgba(212,165,116,0.05)',  // amber again, smaller
    blur: 70,
  },
];

export function HomeBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            willChange: 'transform',
          }}
          animate={{
            x: orb.dx,
            y: orb.dy,
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
