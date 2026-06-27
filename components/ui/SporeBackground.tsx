'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

/**
 * Interactive particle field for the hero — inspired by the "anti-gravity"
 * particle demo, adapted to the brand and made production-safe:
 *   - two layers: drifting ambient "stars" + cursor-reactive particles that
 *     spring back to their origin,
 *   - a soft pulsing radial glow,
 *   - theme-aware (bright white/amber on the near-black dark theme; subtle
 *     browns on the light theme),
 *   - performance-safe: NO O(n^2) collision pass, particle counts capped,
 *     DPR capped at 2, and fully disabled for `prefers-reduced-motion`.
 * Rendered as a non-interactive background layer (pointer-events: none).
 */

interface Particle { x: number; y: number; ox: number; oy: number; vx: number; vy: number; size: number; color: string; }
interface Star { x: number; y: number; vx: number; vy: number; size: number; alpha: number; phase: number; }

const P_DENSITY = 0.00011;
const STAR_DENSITY = 0.00007;
const P_MAX = 130;
const STAR_MAX = 100;
const MOUSE_R = 170;
const RETURN = 0.055;
const DAMP = 0.9;
const REPULSE = 1.1;

const rand = (a: number, b: number) => Math.random() * (b - a) + a;

export const SporeBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const stars = useRef<Star[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const raf = useRef<number>(0);
  const { resolvedTheme } = useTheme();
  const dark = useRef(resolvedTheme === 'dark');
  dark.current = resolvedTheme === 'dark';

  const init = useCallback((w: number, h: number) => {
    const isDark = dark.current;
    const pcount = Math.min(P_MAX, Math.floor(w * h * P_DENSITY));
    const ps: Particle[] = [];
    for (let i = 0; i < pcount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const accent = Math.random() > 0.82;
      const color = isDark
        ? (accent ? '240,164,92' : '255,255,255')   // amber accent / white
        : (accent ? '188,108,37' : '139,69,19');     // brand browns
      ps.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, size: rand(1, 2.6), color });
    }
    particles.current = ps;

    const scount = Math.min(STAR_MAX, Math.floor(w * h * STAR_DENSITY));
    const ss: Star[] = [];
    for (let i = 0; i < scount; i++) {
      ss.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15),
        size: rand(0.4, 1.4), alpha: rand(0.1, 0.4),
        phase: Math.random() * Math.PI * 2,
      });
    }
    stars.current = ss;
  }, []);

  const animate = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const isDark = dark.current;
    ctx.clearRect(0, 0, w, h);

    // soft pulsing radial glow (warm amber) — the focal "energy"
    const cx = w / 2;
    const cy = h * 0.42;
    const pulse = Math.sin(t * 0.0008) * 0.03 + (isDark ? 0.1 : 0.04);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
    g.addColorStop(0, `rgba(240,164,92,${pulse})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // ambient drifting stars / dust
    const starRGB = isDark ? '255,255,255' : '150,110,55';
    for (const s of stars.current) {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
      const tw = Math.sin(t * 0.002 + s.phase) * 0.5 + 0.5;
      ctx.globalAlpha = s.alpha * (0.3 + 0.7 * tw) * (isDark ? 1 : 0.6);
      ctx.fillStyle = `rgb(${starRGB})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // cursor-reactive particles (spring back to origin)
    const m = mouse.current;
    for (const p of particles.current) {
      if (m.active) {
        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_R && d > 0.01) {
          const f = ((MOUSE_R - d) / MOUSE_R) * REPULSE;
          p.vx -= (dx / d) * f * 4;
          p.vy -= (dy / d) * f * 4;
        }
      }
      p.vx += (p.ox - p.x) * RETURN;
      p.vy += (p.oy - p.y) * RETURN;
      p.vx *= DAMP;
      p.vy *= DAMP;
      p.x += p.vx;
      p.y += p.vy;
      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const op = Math.min((isDark ? 0.35 : 0.22) + sp * 0.12, isDark ? 0.95 : 0.6);
      ctx.fillStyle = `rgba(${p.color},${op.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const cont = containerRef.current;
      const canvas = canvasRef.current;
      if (!cont || !canvas) return;
      const { width, height } = cont.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      init(width, height);
    };

    const onMove = (e: MouseEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mouse.current = { x, y, active: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    if (!reduce) raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [init, animate]);

  // rebuild colors when the theme flips
  useEffect(() => {
    const cont = containerRef.current;
    if (cont) {
      const { width, height } = cont.getBoundingClientRect();
      init(width, height);
    }
  }, [resolvedTheme, init]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
