"use client";

import { useEffect, useRef } from "react";
import { createCableScene, type CableScene } from "@/lib/cable-scene";

interface Props {
  /** Mirror the scene (used for right-to-left languages). */
  mirror?: boolean;
  className?: string;
}

/**
 * Decorative 3D cable animation (canvas). Purely visual, so it is hidden
 * from assistive tech. It pauses when scrolled out of view or when the tab is
 * hidden, and renders a single still frame for users who prefer reduced motion.
 */
export default function CableCanvas({ mirror = false, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CableScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const placement = () =>
      window.innerWidth < 768 ? { x: -0.1, y: 0.5 } : { x: 0.35, y: 0.05 };

    const first = placement();
    const scene = createCableScene(canvas, {
      reducedMotion: reduced,
      offsetX: first.x,
      offsetY: first.y,
    });
    sceneRef.current = scene;
    scene.start();

    const onResize = () => {
      const p = placement();
      scene.setPlacement(p.x, p.y);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      scene.setPointer(mirror ? -nx : nx, ny);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => scene.setVisible(entry.isIntersecting), {
            threshold: 0.02,
          })
        : null;
    io?.observe(canvas);

    return () => {
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      scene.destroy();
      sceneRef.current = null;
    };
  }, [mirror]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${mirror ? "-scale-x-100" : ""} ${className}`}
    />
  );
}
