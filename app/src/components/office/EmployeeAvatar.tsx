"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM, VRMUtils } from "@pixiv/three-vrm";

type Props = {
  modelUrl: string;
  name: string;
  role: string;
  roleId: string;
  position: [number, number, number];
  rotation?: number;
  accent?: string;
};

const GREETING_ID = "Selamat datang! Saya Sarah, Sales & Marketing.";
const GREETING_EN = "Hi! I'm Sarah from Sales & Marketing.";

export default function EmployeeAvatar({
  modelUrl,
  name,
  role,
  roleId,
  position,
  rotation = Math.PI,
  accent = "#34d399",
}: Props) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [greeting, setGreeting] = useState(false);
  const waveUntil = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    let disposed = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        const model = gltf.userData.vrm as VRM;
        if (!model) return;

        // three-vrm v3: models are already Y-up; only yaw is needed.
        model.scene.rotation.y = rotation;
        model.scene.traverse((o) => {
          o.castShadow = true;
          o.receiveShadow = true;
        });
        if (model.lookAt) model.lookAt.target = camera;

        setVrm(model);
      },
      undefined,
      (err) => console.error("VRM load failed", err),
    );

    return () => {
      disposed = true;
      if (vrm) VRMUtils.deepDispose(vrm.scene);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl]);

  useEffect(() => {
    if (vrm?.lookAt) vrm.lookAt.target = camera;
  }, [vrm, camera]);

  useEffect(() => {
    if (!greeting) return;
    const t = setTimeout(() => setGreeting(false), 5200);
    return () => clearTimeout(t);
  }, [greeting]);

  useFrame((state, delta) => {
    if (!vrm) return;
    const t = state.clock.elapsedTime;

    // breathing + subtle weight shift
    const hips = vrm.humanoid.getNormalizedBoneNode("hips");
    const spine = vrm.humanoid.getNormalizedBoneNode("spine");
    const head = vrm.humanoid.getNormalizedBoneNode("head");

    if (hips) hips.position.y = Math.sin(t * 1.6) * 0.006;
    if (spine) spine.rotation.x = Math.sin(t * 1.6) * 0.012;
    if (head) {
      head.rotation.y = Math.sin(t * 0.45) * 0.08;
      head.rotation.x = Math.sin(t * 0.7) * 0.02;
    }

    // wave when greeting
    const waving = t < waveUntil.current;
    const rightArm = vrm.humanoid.getNormalizedBoneNode("rightUpperArm");
    const rightLower = vrm.humanoid.getNormalizedBoneNode("rightLowerArm");
    if (rightArm) {
      const targetZ = waving ? -1.15 : -0.08;
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, targetZ, 0.12);
      rightArm.rotation.x = THREE.MathUtils.lerp(
        rightArm.rotation.x,
        waving ? -0.35 : 0.05,
        0.12,
      );
    }
    if (rightLower) {
      rightLower.rotation.z = waving
        ? -0.55 + Math.sin(t * 9) * 0.35
        : THREE.MathUtils.lerp(rightLower.rotation.z, -0.05, 0.12);
    }

    vrm.expressionManager?.setValue("happy", waving ? 0.85 : 0.25);
    vrm.update(delta);
  });

  if (!vrm) return null;

  return (
    <group position={position}>
      <primitive
        object={vrm.scene}
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          waveUntil.current = Infinity;
          setGreeting(true);
          window.setTimeout(() => {
            waveUntil.current = 0;
          }, 4200);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      />

      <Html
        position={[0, 1.95, 0]}
        center
        distanceFactor={8}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div className="flex flex-col items-center gap-1">
          <div
            className="whitespace-nowrap rounded-full border border-white/15 bg-black/55 px-3 py-1 text-center backdrop-blur"
            style={{ boxShadow: `0 0 0 1px ${accent}22` }}
          >
            <span className="text-[13px] font-semibold text-white">{name}</span>
            <span className="ml-2 text-[11px] text-white/55">{role}</span>
          </div>
          {greeting && (
            <div className="max-w-[240px] whitespace-pre-line rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-center text-[11px] leading-snug text-white/85 backdrop-blur">
              {GREETING_ID}
              {"\n"}
              <span className="text-white/55">{GREETING_EN}</span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}