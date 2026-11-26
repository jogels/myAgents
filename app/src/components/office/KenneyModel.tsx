"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type KenneyModelProps = {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number] | number;
  scale?: number | [number, number, number];
  /** Centers model on X and Z axes while locking bottom (min.y) to y = 0 */
  centerXZ?: boolean;
};

export default function KenneyModel({
  url,
  position = [0, 0, 0],
  rotation = 0,
  scale = 2,
  centerXZ = true,
}: KenneyModelProps) {
  const { scene } = useGLTF(url);

  const { cloned, offset } = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(copy);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const off: [number, number, number] = centerXZ
      ? [-center.x, -box.min.y, -center.z]
      : [0, -box.min.y, 0];

    return { cloned: copy, offset: off };
  }, [scene, centerXZ]);

  const rot: [number, number, number] =
    typeof rotation === "number" ? [0, rotation, 0] : rotation;

  return (
    <group position={position} rotation={rot} scale={scale}>
      <primitive object={cloned} position={offset} />
    </group>
  );
}
