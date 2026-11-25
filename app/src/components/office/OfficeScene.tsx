"use client";

import { ContactShadows } from "@react-three/drei";
import EmployeeAvatar from "./EmployeeAvatar";

const WALL = "#f2efe9";
const FLOOR = "#dcd8d2";
const WOOD = "#c69a63";
const METAL = "#2b2f36";
const SCREEN = "#7dd3fc";

function Desk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* top */}
      <mesh castShadow receiveShadow position={[0, 0.74, 0]}>
        <boxGeometry args={[1.7, 0.06, 0.85]} />
        <meshStandardMaterial color={WOOD} roughness={0.55} />
      </mesh>
      {/* legs */}
      {[
        [-0.78, 0.35, -0.36],
        [0.78, 0.35, -0.36],
        [-0.78, 0.35, 0.36],
        [0.78, 0.35, 0.36],
      ].map((p, i) => (
        <mesh key={i} castShadow position={p as [number, number, number]}>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
          <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
      {/* monitor */}
      <group position={[0, 1.02, -0.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.36, 0.03]} />
          <meshStandardMaterial color="#111318" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <planeGeometry args={[0.56, 0.3]} />
          <meshStandardMaterial
            color={SCREEN}
            emissive={SCREEN}
            emissiveIntensity={0.55}
          />
        </mesh>
        <mesh position={[0, -0.2, 0.02]}>
          <boxGeometry args={[0.04, 0.1, 0.04]} />
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      {/* keyboard */}
      <mesh position={[0, 0.78, 0.18]}>
        <boxGeometry args={[0.42, 0.02, 0.14]} />
        <meshStandardMaterial color="#3a3f47" roughness={0.6} />
      </mesh>
      {/* mug */}
      <mesh castShadow position={[0.55, 0.83, 0.1]}>
        <cylinderGeometry args={[0.045, 0.04, 0.11, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.35} />
      </mesh>
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.78, -0.22]}>
        <boxGeometry args={[0.5, 0.6, 0.08]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.44, 16]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.7} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          castShadow
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.14,
            0.62 + (i % 2) * 0.12,
            Math.sin((i / 5) * Math.PI * 2) * 0.14,
          ]}
        >
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#2f7d5b" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export default function OfficeScene() {
  return (
    <>
      {/* lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
      />
      <pointLight position={[0, 2.7, -2]} intensity={12} color="#bfe3ff" />
      <pointLight position={[-3, 2.4, 2]} intensity={8} color="#ffe9c7" />

      {/* room shell */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color={FLOOR} roughness={0.85} />
      </mesh>
      <mesh receiveShadow position={[0, 1.6, -5]}>
        <boxGeometry args={[18, 3.2, 0.1]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[-6, 1.6, 0]}>
        <boxGeometry args={[0.1, 3.2, 10]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[6, 1.6, 0]}>
        <boxGeometry args={[0.1, 3.2, 10]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>

      {/* window strip on back wall */}
      <mesh position={[0, 1.9, -4.93]}>
        <planeGeometry args={[7, 1.5]} />
        <meshStandardMaterial
          color="#cfe9ff"
          emissive="#9ecbe8"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* ceiling light panels */}
      {[-3, 0, 3].map((x) => (
        <mesh key={x} position={[x, 3.05, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.5]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.4}
          />
        </mesh>
      ))}

      {/* furniture */}
      <Desk position={[-2.4, 0, -2.2]} />
      <Desk position={[2.4, 0, -2.2]} />
      <Desk position={[-2.4, 0, 1.4]} />
      <Desk position={[2.4, 0, 1.4]} />
      <Chair position={[-2.4, 0, -1.3]} />
      <Chair position={[2.4, 0, -1.3]} />
      <Plant position={[-4.9, 0, -3.6]} />
      <Plant position={[4.9, 0, 3.2]} />
      <Plant position={[4.6, 0, -3.4]} />

      {/* the employee */}
      <EmployeeAvatar
        modelUrl="/models/avatar_sample.vrm"
        name="Sarah Tan"
        role="Sales & Marketing"
        roleId="sales-marketing-01"
        position={[-0.1, 0, 0.2]}
        accent="#34d399"
      />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.45}
        scale={16}
        blur={2.6}
        far={4}
      />
    </>
  );
}