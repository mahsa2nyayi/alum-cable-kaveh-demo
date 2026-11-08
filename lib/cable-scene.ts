/**
 * Cable3D - a tiny dependency-free 3D scene drawn on a 2D canvas.
 *
 * Renders a three-core power cable: insulated cores twist in a helix and
 * emerge from a graphite sheath, ending in bare aluminium strands, while
 * glowing "current pulses" travel along each core.
 *
 * Technique: every part is a depth-sorted sphere sprite (painter's algorithm)
 * with perspective projection. No WebGL / three.js needed, so it adds
 * ~0 KB of dependencies, works during SSR (only touched in effects) and costs
 * about 1-2 ms per frame on a laptop.
 */

export interface SceneOptions {
  /** Draw a single static frame instead of animating. */
  reducedMotion?: boolean;
  /** Horizontal placement of the cable: -1 (left) .. 0 (center) .. 1 (right). */
  offsetX?: number;
  /** Vertical placement: -1 (top) .. 1 (bottom). */
  offsetY?: number;
}

export interface CableScene {
  start(): void;
  stop(): void;
  setVisible(v: boolean): void;
  setPointer(nx: number, ny: number): void; // -1..1 relative to the canvas
  setPlacement(offsetX: number, offsetY: number): void;
  resize(): void;
  destroy(): void;
}

const TAU = Math.PI * 2;

// ── geometry (world units) ───────────────────────────────────────────────────
const LENGTH = 18; // cable length along z
const CORE_R = 0.5; // core radius
const HELIX_R = 0.58; // distance of core centers from the axis
const TWIST = 0.7; // radians of twist per unit length
const SHEATH_R = 1.25;
const SHEATH_BALL = 0.27;
const SHEATH_END = -LENGTH / 2 + LENGTH * 0.4; // z where the sheath stops
const STRAND_LEN = 1.15;
const CAMERA = 21; // camera distance from the origin

// ── sprites ──────────────────────────────────────────────────────────────────
type Sprite = HTMLCanvasElement;

function makeSprite(hi: string, base: string, edge: string, size = 72): Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = size / 2;
  const grad = g.createRadialGradient(r * 0.68, r * 0.62, r * 0.05, r, r, r);
  grad.addColorStop(0, hi);
  grad.addColorStop(0.45, base);
  grad.addColorStop(1, edge);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(r, r, r - 0.5, 0, TAU);
  g.fill();
  return c;
}

function makeGlow(inner: string, outer: string, size = 96): Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.25, outer);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

interface Item {
  d: number; // camera depth (bigger = farther)
  x: number;
  y: number;
  r: number;
  spr: Sprite;
  a: number;
  add: boolean;
}

export function createCableScene(
  canvas: HTMLCanvasElement,
  options: SceneOptions = {},
): CableScene {
  const ctx = canvas.getContext("2d", { alpha: true })!;
  const reduced = !!options.reducedMotion;
  let offsetX = options.offsetX ?? 0;
  let offsetY = options.offsetY ?? 0;

  // sprites
  const coreSprites = [
    makeSprite("#ffe6cc", "#f97316", "#a63f06"), // orange (brand)
    makeSprite("#dcf4ff", "#38bdf8", "#1b6a93"), // sky
    makeSprite("#ffffff", "#a9b6c7", "#4a586b"), // light grey
  ];
  const sheathSprite = makeSprite("#6b7686", "#222a36", "#04060a");
  const strandSprite = makeSprite("#ffffff", "#cfd8e3", "#5b6778", 40);
  const pulseSprite = makeGlow("rgba(255,255,255,1)", "rgba(255,170,90,0.55)");
  const dustSprite = makeGlow("rgba(180,215,255,0.9)", "rgba(90,150,255,0.25)", 32);
  const haloOrange = makeGlow("rgba(249,115,22,0.30)", "rgba(249,115,22,0.10)", 256);
  const haloBlue = makeGlow("rgba(56,189,248,0.22)", "rgba(56,189,248,0.07)", 256);

  // state
  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let running = false;
  let visible = true;
  let t0 = performance.now();
  let last = t0;
  let detail = 1; // adaptive quality 0.5..1
  let slowFrames = 0;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

  // dust particles (parallax background)
  const dust = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: 0.3 + Math.random() * 0.7,
    s: 0.4 + Math.random() * 1.2,
  }));

  // item pool (no per-frame allocations)
  const pool: Item[] = [];
  let n = 0;
  function push(d: number, x: number, y: number, r: number, spr: Sprite, a: number, add = false) {
    let it = pool[n];
    if (!it) pool[n] = it = { d, x, y, r, spr, a, add };
    else {
      it.d = d; it.x = x; it.y = y; it.r = r; it.spr = spr; it.a = a; it.add = add;
    }
    n++;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    const maxDpr = w < 700 ? 1.5 : 2;
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!running || reduced) draw(performance.now());
  }

  // ── projection ─────────────────────────────────────────────────────────────
  let cosY = 1, sinY = 0, cosP = 1, sinP = 0, unit = 60, cx = 0, cy = 0;

  function setCamera(yaw: number, pitch: number) {
    cosY = Math.cos(yaw); sinY = Math.sin(yaw);
    cosP = Math.cos(pitch); sinP = Math.sin(pitch);
    unit = Math.min(w, h) * (w < 700 ? 0.062 : 0.074);
    // Place the cable on the requested side; keep it inside the viewport.
    cx = w * (0.5 + 0.2 * offsetX);
    cy = h * (0.5 + 0.2 * offsetY);
  }

  // world -> screen. Writes into `out`: [sx, sy, depth, scale]
  const out = [0, 0, 0, 0];
  function project(x: number, y: number, z: number) {
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y1 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;
    const zc = z2 + CAMERA;
    const s = (CAMERA / zc) * unit;
    out[0] = cx + x1 * s;
    out[1] = cy - y1 * s;
    out[2] = zc;
    out[3] = s;
  }

  const fog = (zc: number) => {
    const a = 1 - (zc - 9) / 22;
    return a < 0.12 ? 0.12 : a > 1 ? 1 : a;
  };

  // ── scene assembly ─────────────────────────────────────────────────────────
  function build(time: number) {
    n = 0;
    const spin = time * 0.55; // the cable slowly rotates about its own axis
    const margin = 90;

    const add = (
      x: number, y: number, z: number, radius: number, spr: Sprite,
      alpha = 1, additive = false, bias = 0,
    ) => {
      project(x, y, z);
      const sx = out[0], sy = out[1], d = out[2], s = out[3];
      const rr = radius * s;
      if (sx < -margin - rr || sx > w + margin + rr || sy < -margin - rr || sy > h + margin + rr) return;
      push(d - bias, sx, sy, rr, spr, alpha * fog(d), additive);
    };

    // 1) sheath: rings of graphite spheres
    const ringStep = 0.2 / detail;
    const perRing = Math.round(20 * detail);
    for (let z = -LENGTH / 2; z <= SHEATH_END; z += ringStep) {
      // fade the far part of the jacket out so the cable seems to continue
      const k = (z + LENGTH / 2) / 5.5;
      const sheathFade = k >= 1 ? 1 : k * k * (3 - 2 * k);
      if (sheathFade < 0.02) continue;
      const lip = SHEATH_END - z < 0.34 ? 1.07 : 1; // flared jacket edge
      for (let i = 0; i < perRing; i++) {
        const a = (i / perRing) * TAU + z * 0.35;
        add(Math.cos(a) * SHEATH_R * lip, Math.sin(a) * SHEATH_R * lip, z, SHEATH_BALL, sheathSprite, sheathFade);
      }
    }

    // 2) twisted insulated cores
    const coreStep = 0.12 / detail;
    for (let k = 0; k < 3; k++) {
      const phase = (k * TAU) / 3;
      for (let z = SHEATH_END - 0.3; z <= LENGTH / 2; z += coreStep) {
        const a = TWIST * z + phase + spin;
        add(Math.cos(a) * HELIX_R, Math.sin(a) * HELIX_R, z, CORE_R, coreSprites[k]);
      }

      // 3) bare aluminium strands fanning out of each core end
      const endA = TWIST * (LENGTH / 2) + phase + spin;
      const ex = Math.cos(endA) * HELIX_R;
      const ey = Math.sin(endA) * HELIX_R;
      for (let sI = 0; sI < 7; sI++) {
        const sa = sI === 0 ? 0 : ((sI - 1) / 6) * TAU;
        const sr = sI === 0 ? 0 : 0.2;
        const fanDir = sI === 0 ? 0 : 1;
        for (let u = 0; u <= 1.0001; u += 0.045 / detail) {
          const z = LENGTH / 2 + u * STRAND_LEN;
          const wob = TWIST * 2.2 * u + sa + spin * 0.5;
          const splay = u * u * 0.34 * fanDir;
          add(
            ex + Math.cos(wob) * (sr + splay),
            ey + Math.sin(wob) * (sr + splay),
            z, 0.062, strandSprite,
          );
        }
      }

      // 4) current pulses racing along the core
      for (let p = 0; p < 2; p++) {
        const head = ((time * 3.2 + p * (LENGTH / 2) + k * 2.3) % LENGTH) - LENGTH / 2;
        for (let tr = 0; tr < 7; tr++) {
          const z = head - tr * 0.22;
          if (z < SHEATH_END - 0.2) continue;
          const a = TWIST * z + phase + spin;
          const f = 1 - tr / 7;
          add(
            Math.cos(a) * HELIX_R, Math.sin(a) * HELIX_R, z,
            (0.34 + 0.5 * f) * 1.0, pulseSprite, 0.95 * f * f, true, 0.75,
          );
        }
      }
    }

    pool.length = Math.max(pool.length, n);
  }

  // ── frame ──────────────────────────────────────────────────────────────────
  function drawBackground(time: number) {
    ctx.clearRect(0, 0, w, h);
    const hr = Math.max(w, h) * 0.85;
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 1;
    ctx.drawImage(haloOrange, cx - hr * 0.55, cy - hr * 0.5, hr, hr);
    ctx.drawImage(haloBlue, cx - hr * 0.1 + Math.sin(time * 0.3) * 30, cy - hr * 0.7, hr * 0.9, hr * 0.9);
    // dust
    for (const p of dust) {
      const x = ((p.x + time * 0.004 * p.z + pointer.sx * 0.02 * p.z) % 1 + 1) % 1;
      const y = ((p.y - time * 0.006 * p.z) % 1 + 1) % 1;
      ctx.globalAlpha = 0.25 + 0.5 * p.z * (0.6 + 0.4 * Math.sin(time * p.s + p.x * 9));
      const r = 3 + p.z * 5;
      ctx.drawImage(dustSprite, x * w - r, y * h - r, r * 2, r * 2);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  function draw(now: number) {
    const time = reduced ? 1.4 : (now - t0) / 1000;

    // ease pointer for parallax
    pointer.sx += (pointer.x - pointer.sx) * 0.06;
    pointer.sy += (pointer.y - pointer.sy) * 0.06;

    const yaw = Math.PI - 0.62 + Math.sin(time * 0.23) * 0.1 + pointer.sx * 0.28;
    const pitch = -0.3 + Math.sin(time * 0.17 + 1) * 0.05 - pointer.sy * 0.16;
    setCamera(yaw, pitch);

    drawBackground(time);
    build(time);

    const items = pool.slice(0, n).sort((a, b) => b.d - a.d); // far -> near
    let lastAdd = false;
    for (const it of items) {
      if (it.add !== lastAdd) {
        ctx.globalCompositeOperation = it.add ? "lighter" : "source-over";
        lastAdd = it.add;
      }
      ctx.globalAlpha = it.a;
      ctx.drawImage(it.spr, it.x - it.r, it.y - it.r, it.r * 2, it.r * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function frame(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) {
      last = now;
      return;
    }
    const dt = now - last;
    last = now;

    // adaptive quality: step down if the device struggles
    if (dt > 26) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 45 && detail > 0.5) {
      detail = Math.max(0.5, detail - 0.15);
      slowFrames = 0;
    }
    draw(now);
  }

  const onVisibility = () => { last = performance.now(); };
  document.addEventListener("visibilitychange", onVisibility);

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
  ro?.observe(canvas);
  resize();

  return {
    start() {
      if (running) return;
      if (reduced) { draw(performance.now()); return; }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    setVisible(v: boolean) { visible = v; },
    setPointer(nx: number, ny: number) {
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));
    },
    setPlacement(ox: number, oy: number) {
      offsetX = ox; offsetY = oy;
      if (!running || reduced) draw(performance.now());
    },
    resize,
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
