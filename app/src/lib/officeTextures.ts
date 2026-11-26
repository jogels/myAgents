import * as THREE from "three";

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  return [canvas, ctx];
}

export function createOakFloorTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = "#d6b082";
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 64;
  const tones = ["#d8b282", "#cca372", "#e0be92", "#c69c6b", "#d3ac7c", "#dbb789"];

  for (let row = 0; row < 512 / plankH; row++) {
    const y = row * plankH;
    const offset = (row % 2) * 128 + ((row * 37) % 64);
    for (let col = -1; col < 3; col++) {
      const x = col * 256 + offset;
      const tone = tones[(row * 3 + col + 5) % tones.length];
      ctx.fillStyle = tone;
      ctx.fillRect(x, y, 254, plankH - 2);

      ctx.strokeStyle = "rgba(96, 58, 22, 0.08)";
      ctx.lineWidth = 1.5;
      for (let g = 0; g < 6; g++) {
        const gy = y + 6 + g * 9 + ((row + g) % 3);
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.bezierCurveTo(x + 80, gy - 2, x + 170, gy + 2, x + 254, gy);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(75, 48, 24, 0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 256, plankH);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createTerrazzoTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = "#f2efe9";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "rgba(120, 115, 108, 0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 256, 256);
  ctx.strokeRect(256, 0, 256, 256);
  ctx.strokeRect(0, 256, 256, 256);
  ctx.strokeRect(256, 256, 256, 256);

  // Pastel colorful terrazzo chips
  const chipColors = ["#e07a5f", "#3d8b85", "#f2cc8f", "#60a5fa", "#a78bfa", "#34d399"];
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < 460; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 2.5 + rand() * 5.5;
    ctx.fillStyle = chipColors[Math.floor(rand() * chipColors.length)];
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.9, y - r * 0.2);
    ctx.lineTo(x + r * 0.4, y + r);
    ctx.lineTo(x - r * 0.8, y + r * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createTVDashboardTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(1024, 576);
  const bg = ctx.createLinearGradient(0, 0, 1024, 576);
  bg.addColorStop(0, "#0b1120");
  bg.addColorStop(1, "#172554");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 576);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, 0, 1024, 72);
  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.arc(42, 36, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 24px system-ui, sans-serif";
  ctx.fillText("MYAGENTS · SALES & MARKETING CONTENT HQ", 66, 44);

  ctx.fillStyle = "#93c5fd";
  ctx.font = "600 18px system-ui, sans-serif";
  ctx.fillText("6 CHANNELS LIVE", 815, 43);

  const kpis = [
    { label: "THREADS REACH", value: "31.4K", delta: "+28% wk", color: "#34d399" },
    { label: "IG + TIKTOK", value: "97.0K", delta: "6 reels live", color: "#f472b6" },
    { label: "REDDIT + FB", value: "210", delta: "+20 leads", color: "#fb923c" },
    { label: "YOUTUBE CTR", value: "7.1%", delta: "+215 subs", color: "#f87171" },
  ];

  kpis.forEach((k, i) => {
    const x = 36 + i * 242;
    const y = 98;
    ctx.fillStyle = "rgba(30, 41, 59, 0.88)";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, 224, 118, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText(k.label, x + 18, y + 32);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px system-ui, sans-serif";
    ctx.fillText(k.value, x + 18, y + 76);

    ctx.fillStyle = k.color;
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.fillText(k.delta, x + 18, y + 102);
  });

  ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.16)";
  ctx.beginPath();
  ctx.roundRect(36, 240, 580, 298, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 19px system-ui, sans-serif";
  ctx.fillText("Content Growth & Lead Velocity", 60, 278);

  const barColors = ["#f472b6", "#38bdf8", "#fb923c", "#60a5fa", "#2dd4bf", "#f87171", "#a78bfa", "#34d399", "#fbbf24", "#34d399"];
  const bars = [44, 62, 55, 76, 72, 92, 96, 102, 114, 128];
  bars.forEach((h, i) => {
    const bx = 66 + i * 52;
    const bh = h * 1.45;
    const by = 496 - bh;
    ctx.fillStyle = barColors[i % barColors.length];
    ctx.beginPath();
    ctx.roundRect(bx, by, 34, bh, 8);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
  ctx.beginPath();
  ctx.roundRect(638, 240, 350, 298, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 19px system-ui, sans-serif";
  ctx.fillText("Active Content Queue", 662, 278);

  const items = [
    { title: "Threads — 6 Storytelling Posts", col: "#e2e8f0" },
    { title: "Instagram — 2 Reels + Carousel", col: "#f472b6" },
    { title: "TikTok — 4 Viral Hook Scripts", col: "#2dd4bf" },
    { title: "YouTube — Product Walkthrough", col: "#f87171" },
  ];

  items.forEach((item, i) => {
    const iy = 304 + i * 56;
    ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
    ctx.beginPath();
    ctx.roundRect(660, iy, 306, 44, 10);
    ctx.fill();

    ctx.fillStyle = item.col;
    ctx.beginPath();
    ctx.arc(680, iy + 22, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f1f5f9";
    ctx.font = "500 15px system-ui, sans-serif";
    ctx.fillText(item.title, 696, iy + 27);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createLobbySignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(1024, 256);
  ctx.clearRect(0, 0, 1024, 256);

  const grad = ctx.createLinearGradient(24, 24, 1000, 232);
  grad.addColorStop(0, "rgba(15, 23, 42, 0.92)");
  grad.addColorStop(1, "rgba(17, 53, 74, 0.92)");
  ctx.fillStyle = grad;
  ctx.strokeStyle = "rgba(52, 211, 153, 0.7)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(24, 24, 976, 208, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.roundRect(68, 76, 20, 104, 10);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 66px system-ui, sans-serif";
  ctx.fillText("MYAGENTS HQ", 118, 134);

  ctx.fillStyle = "#fde68a";
  ctx.font = "600 26px system-ui, sans-serif";
  ctx.fillText("AI EMPLOYEES  ·  SALES & MARKETING STUDIO", 120, 182);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createWhiteboardTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(768, 448);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, 768, 448);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.fillText("Sales & Marketing Content Funnel", 36, 52);

  const stages = [
    { label: "CONTENT (Threads · IG · TikTok · YT)", w: 430, col: "#38bdf8" },
    { label: "COMMUNITY (Reddit · Facebook)", w: 340, col: "#818cf8" },
    { label: "INBOUND LEADS & DEMO", w: 250, col: "#f59e0b" },
    { label: "CLOSED WON", w: 170, col: "#10b981" },
  ];
  stages.forEach((s, i) => {
    const y = 90 + i * 76;
    ctx.fillStyle = s.col;
    ctx.beginPath();
    ctx.roundRect(42, y, s.w, 54, 10);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(s.label, 58, y + 33);
  });

  const notes = [
    { x: 520, y: 92, col: "#fef08a", t: "Threads\n6 Utas/hr" },
    { x: 632, y: 112, col: "#fbcfe8", t: "IG Reels\n+ TikTok" },
    { x: 536, y: 224, col: "#fed7aa", t: "Reddit\nValue Post" },
    { x: 636, y: 242, col: "#bbf7d0", t: "YouTube\nWalkthrough" },
  ];
  notes.forEach((n) => {
    ctx.fillStyle = n.col;
    ctx.fillRect(n.x, n.y, 96, 92);
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px system-ui, sans-serif";
    n.t.split("\n").forEach((line, li) => {
      ctx.fillText(line, n.x + 10, n.y + 34 + li * 20);
    });
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createOwnerNameplateTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 128);
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 112);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 40px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("OWNER · FOUNDER", 256, 62);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "600 20px system-ui, sans-serif";
  ctx.fillText("MYAGENTS EXECUTIVE SUITE", 256, 98);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createAssistantSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 128);
  const grad = ctx.createLinearGradient(0, 0, 512, 128);
  grad.addColorStop(0, "#1e293b");
  grad.addColorStop(1, "#0f172a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 112);

  ctx.fillStyle = "#fef3c7";
  ctx.font = "bold 34px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("OWNER ASSISTANT", 256, 60);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "600 20px system-ui, sans-serif";
  ctx.fillText("MAYA · EXECUTIVE HUB", 256, 96);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPantryTileTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  const size = 64;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f0f9ff" : "#bae6fd";
      ctx.fillRect(c * size, r * size, size, size);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(c * size, r * size, size, size);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createLoungeRugTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = "#f7ead9";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "#e07a5f";
  ctx.lineWidth = 28;
  ctx.strokeRect(20, 20, 472, 472);

  ctx.fillStyle = "#e07a5f";
  ctx.beginPath();
  ctx.arc(155, 175, 76, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2a9d8f";
  ctx.beginPath();
  ctx.roundRect(255, 105, 160, 135, 24);
  ctx.fill();

  ctx.fillStyle = "#f4a261";
  ctx.beginPath();
  ctx.roundRect(100, 290, 300, 112, 24);
  ctx.fill();

  ctx.fillStyle = "#264653";
  ctx.beginPath();
  ctx.arc(348, 346, 44, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPlatformPosterTexture(
  title: string,
  subtitle: string,
  bgFrom: string,
  bgTo: string,
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(384, 480);
  const grad = ctx.createLinearGradient(0, 0, 384, 480);
  grad.addColorStop(0, bgFrom);
  grad.addColorStop(1, bgTo);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 384, 480);

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.beginPath();
  ctx.arc(310, 95, 85, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(70, 390, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 344, 440);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 46px system-ui, sans-serif";
  ctx.fillText(title, 192, 232);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "600 22px system-ui, sans-serif";
  ctx.fillText(subtitle, 192, 282);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBorderedCarpetTexture(
  fillColor: string,
  borderColor: string,
  subtlePatternColor?: string,
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, 512, 512);

  if (subtlePatternColor) {
    ctx.strokeStyle = subtlePatternColor;
    ctx.lineWidth = 2;
    for (let i = 32; i < 512; i += 48) {
      ctx.beginPath();
      ctx.moveTo(i, 24);
      ctx.lineTo(i, 488);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(24, i);
      ctx.lineTo(488, i);
      ctx.stroke();
    }
  }

  // Painted border directly in the texture — zero stacked meshes, zero Z-fighting!
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 18;
  ctx.strokeRect(10, 10, 492, 492);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMeetingTVTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(1024, 576);
  const bg = ctx.createLinearGradient(0, 0, 1024, 576);
  bg.addColorStop(0, "#1e1b4b");
  bg.addColorStop(1, "#0f172a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 576);

  // Header strip
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, 0, 1024, 78);
  ctx.fillStyle = "#a78bfa";
  ctx.beginPath();
  ctx.roundRect(36, 22, 16, 34, 6);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.fillText("WEEKLY STRATEGY · CONTENT & GROWTH ROADMAP", 68, 49);

  // 3 colorful strategy pillars
  const cards = [
    { title: "1. SHORT VIDEO", desc: "IG Reels · TikTok · Shorts", stat: "15 / wk", col: "#f472b6" },
    { title: "2. COMMUNITY", desc: "Threads · Reddit · Facebook", stat: "42 / wk", col: "#38bdf8" },
    { title: "3. CONVERSION", desc: "Inbound DM & Demo Funnel", stat: "+35%", col: "#34d399" },
  ];
  cards.forEach((c, i) => {
    const x = 42 + i * 322;
    ctx.fillStyle = "rgba(30, 41, 59, 0.88)";
    ctx.strokeStyle = c.col;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, 114, 296, 200, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = c.col;
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(c.title, x + 22, 156);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 17px system-ui, sans-serif";
    ctx.fillText(c.desc, x + 22, 194);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 46px system-ui, sans-serif";
    ctx.fillText(c.stat, x + 22, 276);
  });

  // Bottom sprint timeline bar
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(42, 352, 940, 180, 18);
  ctx.fill();

  ctx.fillStyle = "#fde68a";
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.fillText("Q4 TEAM SPRINT MILESTONES", 68, 392);

  const steps = [
    { label: "W1 · Content Audit", col: "#34d399" },
    { label: "W2 · Threads Sprint", col: "#38bdf8" },
    { label: "W3 · Viral Reels", col: "#f472b6" },
    { label: "W4 · Scale Leads", col: "#fbbf24" },
  ];
  steps.forEach((s, i) => {
    const sx = 68 + i * 226;
    ctx.fillStyle = s.col;
    ctx.beginPath();
    ctx.roundRect(sx, 424, 204, 72, 14);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 17px system-ui, sans-serif";
    ctx.fillText(s.label, sx + 16, 467);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}


/**
 * Bakes the ENTIRE 30m x 18m office floor (X in [-18, +12], Z in [-9, +9]) into ONE
 * high-resolution 3072x1844 architectural floorplan texture with distinct, harmonious
 * materials and woven carpets per room — 100% paten, zero overlapping meshes, zero Z-fighting!
 */
export function createMasterFloorTexture(): THREE.CanvasTexture {
  const W = 3072;
  const H = 1844;
  const [canvas, ctx] = makeCanvas(W, H);

  const wx = (x: number) => ((x + 18) / 30) * W;
  const wz = (z: number) => ((z + 9) / 18) * H;
  const rectWorld = (x1: number, z1: number, x2: number, z2: number) => ({
    x: wx(x1),
    y: wz(z1),
    w: wx(x2) - wx(x1),
    h: wz(z2) - wz(z1),
  });

  // Deterministic PRNG for organic textures (wood grain, stone clouds, terrazzo flecks, woven fabric)
  let seed = 2026;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // Helper: Draw realistic plank flooring clipped to a world rectangle
  const drawPlanks = (
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    tones: string[],
    plankW: number,
    plankH: number,
    seamColor: string,
    grainColor: string,
  ) => {
    const r = rectWorld(x1, z1, x2, z2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    ctx.fillStyle = tones[0];
    ctx.fillRect(r.x, r.y, r.w, r.h);

    const rows = Math.ceil(r.h / plankH) + 1;
    const cols = Math.ceil(r.w / plankW) + 2;
    for (let row = 0; row < rows; row++) {
      const py = r.y + row * plankH;
      const stagger = ((row * 47) % plankW) - plankW;
      for (let col = 0; col < cols; col++) {
        const px = r.x + col * plankW + stagger;
        ctx.fillStyle = tones[(row * 5 + col * 3) % tones.length];
        ctx.fillRect(px, py, plankW - 1, plankH - 1);

        // Subtle longitudinal wood grain
        ctx.strokeStyle = grainColor;
        ctx.lineWidth = 1;
        for (let g = 0; g < 3; g++) {
          const gy = py + 5 + g * ((plankH - 8) / 3);
          ctx.beginPath();
          ctx.moveTo(px, gy);
          ctx.lineTo(px + plankW, gy + ((row + g) % 2 === 0 ? 1.5 : -1.5));
          ctx.stroke();
        }

        ctx.strokeStyle = seamColor;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px, py, plankW, plankH);
      }
    }
    ctx.restore();
  };

  // Helper: Subtle woven textile cross-hatch inside clipped rug area
  const drawWeave = (x: number, y: number, w: number, h: number, color: string, step = 10) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let gx = x; gx < x + w; gx += step) {
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx, y + h);
      ctx.stroke();
    }
    for (let gy = y; gy < y + h; gy += step) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + w, gy);
      ctx.stroke();
    }
  };

  // Helper: Slim brushed-brass architectural threshold strip between floor materials
  const drawThreshold = (x1: number, z1: number, x2: number, z2: number) => {
    const r = rectWorld(x1, z1, x2, z2);
    ctx.fillStyle = "#c9a45c";
    ctx.fillRect(r.x, r.y, Math.max(r.w, 6), Math.max(r.h, 6));
    ctx.strokeStyle = "rgba(30, 41, 59, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(r.x, r.y, Math.max(r.w, 6), Math.max(r.h, 6));
  };

  // ============================================================================
  // 1. CENTRAL CORRIDOR BASE — Warm Natural Honey-Oak Herringbone Parquet
  // ============================================================================
  ctx.fillStyle = "#d4ae81";
  ctx.fillRect(0, 0, W, H);
  {
    const oakTones = ["#d8b387", "#cca376", "#dfbe95", "#c79e70", "#d4ae81"];
    const step = 36;
    ctx.save();
    for (let y = -step * 2; y < H + step * 2; y += step) {
      for (let x = -step * 2; x < W + step * 2; x += step * 2) {
        const idx = Math.abs(Math.floor(x / step) * 3 + Math.floor(y / step) * 5);
        // Up-right herringbone tile
        ctx.fillStyle = oakTones[idx % oakTones.length];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y - step);
        ctx.lineTo(x + step * 1.5, y - step * 0.5);
        ctx.lineTo(x + step * 0.5, y + step * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(88, 56, 26, 0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Down-right herringbone tile
        ctx.fillStyle = oakTones[(idx + 2) % oakTones.length];
        ctx.beginPath();
        ctx.moveTo(x + step, y - step);
        ctx.lineTo(x + step * 2, y);
        ctx.lineTo(x + step * 1.5, y + step * 0.5);
        ctx.lineTo(x + step * 0.5, y - step * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ============================================================================
  // 2. RUANG MEETING & TV (X: -18.0..-11.2, Z: -9.0..+9.0)
  //    Floor: Cool Light Architectural Microcement Stone
  //    Rugs: Deep Indigo Woven Conference Carpet + Round Cream-Sage Breakout Rug
  // ============================================================================
  {
    const r = rectWorld(-18.0, -9.0, -11.2, 9.0);
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();

    ctx.fillStyle = "#dce2ea";
    ctx.fillRect(r.x, r.y, r.w, r.h);

    // Subtle troweled microcement stone clouds
    for (let i = 0; i < 85; i++) {
      const cx = r.x + rand() * r.w;
      const cy = r.y + rand() * r.h;
      const rad = 40 + rand() * 110;
      const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, rad);
      g.addColorStop(0, i % 2 === 0 ? "rgba(255,255,255,0.28)" : "rgba(100,116,139,0.12)");
      g.addColorStop(1, "rgba(220,226,234,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Large architectural stone slab joints (1.6m grid)
    ctx.strokeStyle = "rgba(100, 116, 139, 0.22)";
    ctx.lineWidth = 2;
    const slab = 155;
    for (let gx = r.x; gx < r.x + r.w; gx += slab) {
      ctx.beginPath();
      ctx.moveTo(gx, r.y);
      ctx.lineTo(gx, r.y + r.h);
      ctx.stroke();
    }
    for (let gy = r.y; gy < r.y + r.h; gy += slab) {
      ctx.beginPath();
      ctx.moveTo(r.x, gy);
      ctx.lineTo(r.x + r.w, gy);
      ctx.stroke();
    }

    // Conference Table Woven Indigo-Slate Carpet (X: -16.6..-12.3, Z: -2.8..+3.5)
    const cr = rectWorld(-16.6, -2.8, -12.3, 3.5);
    ctx.fillStyle = "rgba(15, 23, 42, 0.16)";
    ctx.beginPath();
    ctx.roundRect(cr.x + 6, cr.y + 6, cr.w, cr.h, 14);
    ctx.fill();

    ctx.fillStyle = "#36466d";
    ctx.beginPath();
    ctx.roundRect(cr.x, cr.y, cr.w, cr.h, 14);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cr.x, cr.y, cr.w, cr.h, 14);
    ctx.clip();
    drawWeave(cr.x, cr.y, cr.w, cr.h, "rgba(255,255,255,0.06)", 10);
    // Inset cream & muted-gold double border
    ctx.strokeStyle = "rgba(226, 232, 240, 0.65)";
    ctx.lineWidth = 4;
    ctx.strokeRect(cr.x + 18, cr.y + 18, cr.w - 36, cr.h - 36);
    ctx.strokeStyle = "rgba(212, 175, 55, 0.55)";
    ctx.lineWidth = 2;
    ctx.strokeRect(cr.x + 28, cr.y + 28, cr.w - 56, cr.h - 56);
    ctx.restore();

    // South Breakout Round Woven Cream-Sage Rug (center [-14.5, 6.0], radius ~2.1m)
    const bx = wx(-14.5);
    const by = wz(6.0);
    const br = (2.1 / 30) * W;
    ctx.fillStyle = "rgba(15, 23, 42, 0.12)";
    ctx.beginPath();
    ctx.arc(bx + 5, by + 5, br, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#efe8dc";
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#84a98c";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(bx, by, br - 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#d4a373";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bx, by, br - 28, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
    drawThreshold(-11.26, -9.0, -11.14, 9.0);
  }

  // ============================================================================
  // 3. RUANG TEAM (X: -11.14..-0.6, Z: -9.0..-0.1)
  //    Floor: Light Scandinavian Blonde Birch Wood Planks
  //    Carpets: 2 Soft Heathered Sage-Green Acoustic Carpet Runners under Desk Rows
  // ============================================================================
  drawPlanks(
    -11.14,
    -9.0,
    -0.6,
    -0.1,
    ["#eadcc6", "#e3d3ba", "#efe3cf", "#decba9"],
    160,
    30,
    "rgba(120, 96, 68, 0.16)",
    "rgba(130, 102, 70, 0.08)",
  );
  drawThreshold(-11.14, -0.14, -0.6, -0.06);
  drawThreshold(-0.64, -9.0, -0.56, -0.1);

  // Two soft heathered sage acoustic carpet runners (Row A & Row B)
  [
    [-9.8, -7.25, -1.1, -4.45],
    [-9.8, -3.15, -1.1, -0.45],
  ].forEach(([x1, z1, x2, z2]) => {
    const r = rectWorld(x1, z1, x2, z2);
    ctx.save();
    ctx.fillStyle = "rgba(30, 41, 59, 0.1)";
    ctx.beginPath();
    ctx.roundRect(r.x + 4, r.y + 4, r.w, r.h, 12);
    ctx.fill();

    ctx.fillStyle = "#c7ded1";
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, 12);
    ctx.fill();
    ctx.clip();

    // Subtle acoustic carpet tile checkerboard
    const tile = 54;
    for (let gy = 0; gy < Math.ceil(r.h / tile); gy++) {
      for (let gx = 0; gx < Math.ceil(r.w / tile); gx++) {
        ctx.fillStyle = (gx + gy) % 2 === 0 ? "#c3dcd0" : "#cfe4d9";
        ctx.fillRect(r.x + gx * tile, r.y + gy * tile, tile, tile);
      }
    }
    drawWeave(r.x, r.y, r.w, r.h, "rgba(45, 106, 79, 0.07)", 9);

    ctx.strokeStyle = "#52997b";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(r.x + 3, r.y + 3, r.w - 6, r.h - 6, 10);
    ctx.stroke();
    ctx.restore();
  });

  // ============================================================================
  // 4. MEJA OWNER ASSISTANT · MAYA (X: -0.15..+2.85, Z: -8.75..-5.55)
  //    Rug: Warm Sand & Brushed-Gold Geometric Boucle Executive Rug
  // ============================================================================
  {
    const r = rectWorld(-0.1, -8.7, 2.8, -5.55);
    ctx.save();
    ctx.fillStyle = "rgba(30, 41, 59, 0.14)";
    ctx.beginPath();
    ctx.roundRect(r.x + 5, r.y + 5, r.w, r.h, 12);
    ctx.fill();

    ctx.fillStyle = "#f4e8d4";
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, 12);
    ctx.fill();
    ctx.clip();

    drawWeave(r.x, r.y, r.w, r.h, "rgba(180, 130, 60, 0.09)", 9);

    // Subtle caramel & gold geometric diamond border
    ctx.strokeStyle = "#d4a052";
    ctx.lineWidth = 6;
    ctx.strokeRect(r.x + 12, r.y + 12, r.w - 24, r.h - 24);
    ctx.strokeStyle = "rgba(146, 102, 42, 0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(r.x + 22, r.y + 22, r.w - 44, r.h - 44);
    ctx.restore();
  }

  // ============================================================================
  // 5. RUANG OWNER (X: +3.0..+12.0, Z: -9.0..-1.2)
  //    Floor: Rich Dark Smoked Walnut Wood Planks
  //    Rug: Deep Petrol-Navy Wool Rug with Champagne-Gold Double Pinstripe
  // ============================================================================
  drawPlanks(
    3.0,
    -9.0,
    12.0,
    -1.2,
    ["#6e503a", "#634632", "#785840", "#5b3f2d"],
    170,
    34,
    "rgba(24, 14, 8, 0.34)",
    "rgba(36, 20, 10, 0.14)",
  );
  drawThreshold(2.96, -9.0, 3.06, -1.2);
  drawThreshold(3.0, -1.24, 12.0, -1.14);

  {
    const r = rectWorld(4.1, -7.85, 10.9, -2.15);
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.beginPath();
    ctx.roundRect(r.x + 6, r.y + 6, r.w, r.h, 12);
    ctx.fill();

    ctx.fillStyle = "#1d354d";
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, 12);
    ctx.fill();
    ctx.clip();

    drawWeave(r.x, r.y, r.w, r.h, "rgba(255,255,255,0.045)", 9);

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 6;
    ctx.strokeRect(r.x + 18, r.y + 18, r.w - 36, r.h - 36);
    ctx.strokeStyle = "rgba(248, 250, 252, 0.38)";
    ctx.lineWidth = 2;
    ctx.strokeRect(r.x + 30, r.y + 30, r.w - 60, r.h - 60);
    ctx.restore();
  }

  // ============================================================================
  // 6. PANTRY & COFFEE BAR (X: +8.2..+12.0, Z: -1.14..+3.95)
  //    Floor: Boutique Parisian Café Warm-Cream & Dusty-Sage Ceramic Tiles
  // ============================================================================
  {
    const r = rectWorld(8.2, -1.14, 12.0, 3.95);
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();

    const tile = 44;
    for (let ry = 0; ry < Math.ceil(r.h / tile) + 1; ry++) {
      for (let cx = 0; cx < Math.ceil(r.w / tile) + 1; cx++) {
        ctx.fillStyle = (ry + cx) % 2 === 0 ? "#f7f4ec" : "#d3e4db";
        ctx.fillRect(r.x + cx * tile, r.y + ry * tile, tile, tile);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(r.x + cx * tile, r.y + ry * tile, tile, tile);
      }
    }
    ctx.restore();
    drawThreshold(8.16, -1.14, 8.26, 3.95);
  }

  // ============================================================================
  // 7. LOBBY & RESEPSIONIS (X: +1.5..+12.0, Z: +3.95..+9.0)
  //    Floor: Warm-White Italian Terrazzo Marble Tiles + Charcoal Welcome Runner
  // ============================================================================
  {
    const r = rectWorld(1.5, 3.95, 12.0, 9.0);
    ctx.save();
    ctx.fillStyle = "#f2efe9";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();

    // Large marble tile bevel grid
    const tile = 110;
    ctx.strokeStyle = "rgba(120, 113, 108, 0.18)";
    ctx.lineWidth = 2;
    for (let gx = r.x; gx < r.x + r.w; gx += tile) {
      ctx.beginPath();
      ctx.moveTo(gx, r.y);
      ctx.lineTo(gx, r.y + r.h);
      ctx.stroke();
    }
    for (let gy = r.y; gy < r.y + r.h; gy += tile) {
      ctx.beginPath();
      ctx.moveTo(r.x, gy);
      ctx.lineTo(r.x + r.w, gy);
      ctx.stroke();
    }

    // Harmonized terrazzo stone chips (terracotta, eucalyptus, slate, warm gold)
    const chips = ["#d4755b", "#558b7e", "#d4a052", "#64748b", "#c9b8a3", "#84a98c"];
    for (let i = 0; i < 950; i++) {
      const px = r.x + rand() * r.w;
      const py = r.y + rand() * r.h;
      const rad = 1.8 + rand() * 4.2;
      ctx.fillStyle = chips[Math.floor(rand() * chips.length)];
      ctx.beginPath();
      ctx.moveTo(px, py - rad);
      ctx.lineTo(px + rad * 0.85, py - rad * 0.2);
      ctx.lineTo(px + rad * 0.35, py + rad);
      ctx.lineTo(px - rad * 0.75, py + rad * 0.45);
      ctx.closePath();
      ctx.fill();
    }

    // Sleek Charcoal Ribbed Welcome Runner Mat in front of Reception Desk
    const mat = rectWorld(4.3, 7.05, 7.4, 8.25);
    ctx.fillStyle = "#2b3442";
    ctx.beginPath();
    ctx.roundRect(mat.x, mat.y, mat.w, mat.h, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    for (let my = mat.y + 8; my < mat.y + mat.h - 6; my += 10) {
      ctx.beginPath();
      ctx.moveTo(mat.x + 8, my);
      ctx.lineTo(mat.x + mat.w - 8, my);
      ctx.stroke();
    }
    ctx.strokeStyle = "#c9a45c";
    ctx.lineWidth = 3;
    ctx.strokeRect(mat.x + 4, mat.y + 4, mat.w - 8, mat.h - 8);
    ctx.restore();

    drawThreshold(1.46, 3.95, 1.56, 9.0);
    drawThreshold(1.5, 3.91, 12.0, 4.01);
  }

  // ============================================================================
  // 8. LOUNGE & SMART TV (X: -10.3..-2.5, Z: +3.3..+8.3)
  //    Rug: Designer Terracotta, Eucalyptus & Warm Ochre Boucle Arch Rug + Fringe
  // ============================================================================
  {
    const r = rectWorld(-10.3, 3.3, -2.5, 8.3);
    ctx.save();

    // Tassel fringe along left and right edges
    ctx.strokeStyle = "#e6d8c5";
    ctx.lineWidth = 3;
    for (let fy = r.y + 10; fy < r.y + r.h - 8; fy += 11) {
      ctx.beginPath();
      ctx.moveTo(r.x - 14, fy);
      ctx.lineTo(r.x, fy);
      ctx.moveTo(r.x + r.w, fy);
      ctx.lineTo(r.x + r.w + 14, fy);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(30, 41, 59, 0.14)";
    ctx.beginPath();
    ctx.roundRect(r.x + 6, r.y + 6, r.w, r.h, 14);
    ctx.fill();

    ctx.fillStyle = "#f4eadc";
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, 14);
    ctx.fill();
    ctx.clip();

    // Soft organic mid-century designer arches (harmonized muted palette)
    ctx.fillStyle = "#d4755b"; // terracotta
    ctx.beginPath();
    ctx.arc(r.x + r.w * 0.25, r.y + r.h * 0.36, r.h * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4d8a7e"; // muted eucalyptus
    ctx.beginPath();
    ctx.roundRect(r.x + r.w * 0.46, r.y + r.h * 0.16, r.w * 0.38, r.h * 0.32, 30);
    ctx.fill();

    ctx.fillStyle = "#e3b56c"; // warm ochre
    ctx.beginPath();
    ctx.roundRect(r.x + r.w * 0.16, r.y + r.h * 0.6, r.w * 0.66, r.h * 0.24, 24);
    ctx.fill();

    ctx.fillStyle = "#2b4557"; // deep slate-blue accent dot
    ctx.beginPath();
    ctx.arc(r.x + r.w * 0.72, r.y + r.h * 0.72, r.h * 0.095, 0, Math.PI * 2);
    ctx.fill();

    // Tactile boucle weave over entire rug
    drawWeave(r.x, r.y, r.w, r.h, "rgba(120, 80, 50, 0.07)", 8);

    ctx.strokeStyle = "#c96f53";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(r.x + 5, r.y + 5, r.w - 10, r.h - 10, 12);
    ctx.stroke();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
}
