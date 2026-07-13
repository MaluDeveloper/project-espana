import { useEffect, useRef } from "react";

/**
 * HeroParticles
 * High-performance Canvas particle field — Spanish flag palette
 * (red #AA151B, gold #F1BF00, sparse white sparkles) on dark backdrop.
 *
 * - 60 FPS target via requestAnimationFrame
 * - Slow organic floating + gentle global rotation
 * - Mouse repel with smooth easing
 * - Additive bloom/glow on gold particles (emissive feel)
 * - Pauses on tab blur, respects prefers-reduced-motion
 * - DPR-aware, ResizeObserver-driven
 */

type Particle = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  angle: number;
  angularSpeed: number;
  orbitRadius: number;
  color: "red" | "gold" | "white";
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
};

const COLORS = {
  red: { r: 170, g: 21, b: 27 },     // #AA151B
  gold: { r: 241, g: 191, b: 0 },    // #F1BF00
  white: { r: 255, g: 255, b: 255 },
};

interface HeroParticlesProps {
  className?: string;
}

export const HeroParticles = ({ className }: HeroParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const { w, h } = sizeRef.current;
      // Density: tuned for performance. Cap to keep small screens snappy.
      const area = w * h;
      const target = Math.min(220, Math.max(90, Math.floor(area / 7000)));
      const arr: Particle[] = [];
      for (let i = 0; i < target; i++) {
        const roll = Math.random();
        // Distribution: 50% gold, 35% red, 15% white sparkles
        const color: Particle["color"] =
          roll < 0.5 ? "gold" : roll < 0.85 ? "red" : "white";
        const r =
          color === "white"
            ? 0.6 + Math.random() * 1.1
            : 0.7 + Math.random() * 1.8;
        const baseX = Math.random() * w;
        const baseY = Math.random() * h;
        arr.push({
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          vx: 0,
          vy: 0,
          r,
          angle: Math.random() * Math.PI * 2,
          angularSpeed: (Math.random() * 0.0006 + 0.0002) * (Math.random() < 0.5 ? -1 : 1),
          orbitRadius: 6 + Math.random() * 22,
          color,
          alpha: 0.35 + Math.random() * 0.55,
          twinkleSpeed: 0.0008 + Math.random() * 0.0018,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = arr;
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    const onVisibility = () => {
      runningRef.current = !document.hidden;
      if (runningRef.current && rafRef.current === null) {
        lastT = performance.now();
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    const REPEL_RADIUS = 110;
    const REPEL_STRENGTH = 0.55;
    const RETURN = 0.018;
    const FRICTION = 0.92;

    let lastT = performance.now();

    const loop = (t: number) => {
      rafRef.current = null;
      if (!runningRef.current) return;
      const dt = Math.min(48, t - lastT); // cap to prevent jumps
      lastT = t;

      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Additive blending for the bloom feel on gold/white
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slow orbital drift around base (organic floating)
        if (!reduced) {
          p.angle += p.angularSpeed * dt;
          const targetX = p.baseX + Math.cos(p.angle) * p.orbitRadius;
          const targetY = p.baseY + Math.sin(p.angle) * p.orbitRadius;

          // Spring back toward orbital target
          p.vx += (targetX - p.x) * RETURN;
          p.vy += (targetY - p.y) * RETURN;

          // Mouse repel
          if (mouseActive) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const distSq = dx * dx + dy * dy;
            const r2 = REPEL_RADIUS * REPEL_RADIUS;
            if (distSq < r2 && distSq > 0.0001) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
              p.vx += (dx / dist) * force * 6;
              p.vy += (dy / dist) * force * 6;
            }
          }

          p.vx *= FRICTION;
          p.vy *= FRICTION;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Twinkle alpha
        p.twinklePhase += p.twinkleSpeed * dt;
        const twinkle = 0.65 + 0.35 * Math.sin(p.twinklePhase);
        const a = p.alpha * twinkle;

        const c = COLORS[p.color];

        if (p.color === "gold" || p.color === "white") {
          // Bloom: large soft halo + bright core
          const haloR = p.r * (p.color === "white" ? 8 : 6);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
          grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a * 0.9})`);
          grad.addColorStop(0.4, `rgba(${c.r},${c.g},${c.b},${a * 0.25})`);
          grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
          ctx.fill();

          // Bright core
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${Math.min(1, a + 0.25)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Red — softer, no big bloom (keeps palette balanced)
          const haloR = p.r * 3.5;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
          grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a * 0.85})`);
          grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};
