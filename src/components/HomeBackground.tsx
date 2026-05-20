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
    size: 600,
    x: '-10%',
    y: '-10%',
    dx: [0, 40, -20, 30, 0],
    dy: [0, 30, 50, 20, 0],
    duration: 45,
    delay: 0,
    color: 'rgba(255,255,255,0.025)',  // very subtle white
    blur: 120,
  },
  {
    size: 500,
    x: '60%',
    y: '5%',
    dx: [0, -30, 15, -40, 0],
    dy: [0, 45, 15, -25, 0],
    duration: 52,
    delay: 7,
    color: 'rgba(200,200,200,0.02)', // light gray
    blur: 100,
  },
  {
    size: 450,
    x: '20%',
    y: '60%',
    dx: [0, 25, -12, 35, 0],
    dy: [0, -25, 35, 10, 0],
    duration: 60,
    delay: 15,
    color: 'rgba(255,255,255,0.015)',  // faintest white
    blur: 130,
  },
  {
    size: 350,
    x: '80%',
    y: '65%',
    dx: [0, -20, 30, -10, 0],
    dy: [0, -30, -15, 20, 0],
    duration: 50,
    delay: 22,
    color: 'rgba(150,150,150,0.02)',  // mid gray
    blur: 90,
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
