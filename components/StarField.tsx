"use client";

import { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleOffset: number;
  twinkleSpeed: number;
  color: readonly [number, number, number];
}

interface ShootingStar {
  x: number;
  y: number;
  frame: number;
  active: boolean;
}

function pickColor(): readonly [number, number, number] {
  const r = Math.random();
  if (r < 0.7) return [255, 255, 255];
  if (r < 0.9) return [200, 220, 255];
  return [255, 240, 180];
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rawCanvas = canvasRef.current;
    if (!rawCanvas) return;
    const rawCtx = rawCanvas.getContext("2d");
    if (!rawCtx) return;

    // Bind non-null aliases so closures below see definite types
    const cv: HTMLCanvasElement = rawCanvas;
    const ctx: CanvasRenderingContext2D = rawCtx;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const mobile = window.innerWidth <= 768;

    const LAYERS = [
      { count: mobile ? 80 : 180, minR: 0.3, maxR: 0.7, minO: 0.2, maxO: 0.5 },
      { count: mobile ? 40 : 80,  minR: 0.6, maxR: 1.2, minO: 0.4, maxO: 0.7 },
      { count: mobile ? 10 : 25,  minR: 1.0, maxR: 2.0, minO: 0.6, maxO: 1.0 },
    ] as const;

    const SPEEDS = [0.03, 0.07, 0.12] as const;
    const PARALLAX = [0.004, 0.010, 0.018] as const;

    let starsLayers: Star[][] = [];
    let frameCount = 0;
    let animId = 0;
    let shooting: ShootingStar = { x: 0, y: 0, frame: 0, active: false };
    let nextShootAt = 0;
    let mouseX = 0, mouseY = 0;
    let lerpX = 0, lerpY = 0;

    function buildStars() {
      starsLayers = LAYERS.map((cfg) => {
        const arr: Star[] = [];
        for (let i = 0; i < cfg.count; i++) {
          arr.push({
            x: Math.random() * cv.width,
            y: Math.random() * cv.height,
            radius: cfg.minR + Math.random() * (cfg.maxR - cfg.minR),
            baseOpacity: cfg.minO + Math.random() * (cfg.maxO - cfg.minO),
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.003 + Math.random() * 0.007,
            color: pickColor(),
          });
        }
        return arr;
      });
    }

    function scheduleShoot() {
      nextShootAt = frameCount + 240 + Math.floor(Math.random() * 300);
    }

    function draw() {
      const w = cv.width;
      const h = cv.height;

      ctx.clearRect(0, 0, w, h);

      // Stars across all 3 depth layers
      starsLayers.forEach((stars, li) => {
        const px = noHover ? 0 : lerpX * PARALLAX[li];
        const py = noHover ? 0 : lerpY * PARALLAX[li];

        stars.forEach((s) => {
          const twinkle = 0.6 + 0.4 * Math.sin(frameCount * s.twinkleSpeed + s.twinkleOffset);
          const alpha = s.baseOpacity * twinkle;
          const [r, g, b] = s.color;
          ctx.beginPath();
          ctx.arc(s.x + px, s.y + py, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          ctx.fill();
        });
      });

      // Shooting star
      if (shooting.active) {
        const dx = 6, dy = 3;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len, uy = dy / len;
        const cx = shooting.x + dx * shooting.frame;
        const cy = shooting.y + dy * shooting.frame;

        const grad = ctx.createLinearGradient(cx, cy, cx - ux * 40, cy - uy * 40);
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - ux * 40, cy - uy * 40);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        shooting.frame++;
        if (shooting.frame >= 60) {
          shooting.active = false;
          scheduleShoot();
        }
      } else if (frameCount >= nextShootAt) {
        shooting = { x: Math.random() * w, y: Math.random() * h * 0.6, frame: 0, active: true };
      }

      // Bottom fade via composite
      const fade = ctx.createLinearGradient(0, 0, 0, h);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(0.75, "rgba(0,0,0,1)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      frameCount++;
    }

    function animate() {
      lerpX += (mouseX - lerpX) * 0.06;
      lerpY += (mouseY - lerpY) * 0.06;
      draw();
      animId = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = cv.getBoundingClientRect();
      mouseX = e.clientX - rect.left - cv.width / 2;
      mouseY = e.clientY - rect.top - cv.height / 2;
    }

    function init() {
      cv.width = cv.offsetWidth;
      cv.height = cv.offsetHeight;
      buildStars();
      scheduleShoot();
    }

    init();

    if (prefersReduced) {
      draw();
    } else {
      if (!noHover) window.addEventListener("mousemove", onMouseMove);
      animId = requestAnimationFrame(animate);
    }

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(animId);
      init();
      if (prefersReduced) {
        draw();
      } else {
        animId = requestAnimationFrame(animate);
      }
    });
    ro.observe(cv.parentElement ?? cv);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
