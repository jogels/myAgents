"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import OfficeScene from "@/components/office/OfficeScene";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#0b0f14] text-white">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 1.75, 6.2], fov: 42 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0b0f14"]} />
        <Suspense fallback={null}>
          <OfficeScene />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={11}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 1.1, 0]}
        />
      </Canvas>

      {/* HUD */}
      <div className="pointer-events-none absolute left-0 top-0 p-5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300/80">
          AI Employees · Office 01
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Sales &amp; Marketing</h1>
        <p className="mt-1 text-sm text-white/50">
          Klik karyawan untuk menyapa · drag untuk melihat sekeliling
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 flex w-full items-end justify-between p-5 text-xs text-white/40">
        <span>Fase 1 · shell 3D + avatar VRM + idle animasi</span>
        <span className="hidden sm:inline">VRM · three.js · Next.js</span>
      </div>
    </main>
  );
}