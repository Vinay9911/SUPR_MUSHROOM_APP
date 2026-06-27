'use client';

import React from 'react';

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  /** Tailwind radius class to match the wrapped element (e.g. "rounded-full", "rounded-3xl"). */
  radius?: string;
}

/**
 * Wraps any element with an animated, brand-tinted glowing border.
 * The glow is a blurred, slowly-rotating warm conic gradient sitting behind the
 * content; the content's own background covers the centre, leaving a glowing halo
 * around the edges. Respects prefers-reduced-motion (no spin when reduced).
 */
export function GlowingBorder({ children, className = '', radius = 'rounded-full' }: GlowingBorderProps) {
  return (
    <span className={`relative inline-flex isolate ${className}`}>
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-[3px] z-0 opacity-80 blur-[7px] ${radius} [background:conic-gradient(from_0deg,#F0A45C,#E8924A,#D2552E,#F4C06A,#BC6C25,#F0A45C)] motion-safe:animate-[spin_5s_linear_infinite]`}
      />
      <span className={`relative z-10 inline-flex ${radius}`}>{children}</span>
    </span>
  );
}
