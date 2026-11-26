"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const OAK = "#c99f6e";
const WALNUT = "#8f6542";
const CHARCOAL = "#1f242d";
const MATTE_BLACK = "#14171d";
const BRUSHED_METAL = "#94a3b8";
const WARM_WHITE = "#f4f1ea";
const BOUCLE = "#384152";

type P = { position: [number, number, number]; rotation?: number };

// --- MODERN WORKSTATION DESK WITH DUAL MONITORS ---
export function WorkDesk({
  position,
  rotation = 0,
  screenTexture,
  secondaryTexture,
}: P & {
  screenTexture?: THREE.Texture;
  secondaryTexture?: THREE.Texture;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Warm oak desktop */}
      <mesh castShadow receiveShadow position={[0, 0.74, 0]}>
        <boxGeometry args={[1.85, 0.05, 0.86]} />
        <meshStandardMaterial color={OAK} roughness={0.48} />
      </mesh>
      {/* Sleek black steel loop legs */}
      {[-0.84, 0.84].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow position={[0, 0.36, -0.36]}>
            <boxGeometry args={[0.045, 0.72, 0.045]} />
            <meshStandardMaterial color={MATTE_BLACK} roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 0.36, 0.36]}>
            <boxGeometry args={[0.045, 0.72, 0.045]} />
            <meshStandardMaterial color={MATTE_BLACK} roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 0.03, 0]}>
            <boxGeometry args={[0.045, 0.04, 0.76]} />
            <meshStandardMaterial color={MATTE_BLACK} roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Acoustic fabric desk divider */}
      <mesh castShadow position={[0, 0.92, -0.41]}>
        <boxGeometry args={[1.8, 0.32, 0.035]} />
        <meshStandardMaterial color="#475569" roughness={0.92} />
      </mesh>
      {/* Under-desk drawer pedestal (right side) */}
      <group position={[0.62, 0.35, 0.04]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.66, 0.56]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.55} />
        </mesh>
        {[-0.18, 0, 0.18].map((y, i) => (
          <mesh key={i} position={[0, y, 0.285]}>
            <boxGeometry args={[0.16, 0.015, 0.02]} />
            <meshStandardMaterial color={BRUSHED_METAL} metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>
      {/* Desk mat */}
      <mesh receiveShadow position={[-0.1, 0.768, 0.16]}>
        <boxGeometry args={[0.88, 0.005, 0.36]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Dual monitors on slim arm */}
      <group position={[-0.31, 1.06, -0.22]} rotation={[0, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.36, 0.025]} />
          <meshStandardMaterial color={MATTE_BLACK} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.58, 0.32]} />
          <meshStandardMaterial
            map={screenTexture}
            emissiveMap={screenTexture}
            emissive="#ffffff"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>
      </group>
      <group position={[0.31, 1.06, -0.22]} rotation={[0, -0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.36, 0.025]} />
          <meshStandardMaterial color={MATTE_BLACK} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.58, 0.32]} />
          <meshStandardMaterial
            map={secondaryTexture ?? screenTexture}
            emissiveMap={secondaryTexture ?? screenTexture}
            emissive="#ffffff"
            emissiveIntensity={0.55}
            roughness={0.2}
          />
        </mesh>
      </group>
      {/* Monitor stand column */}
      <mesh position={[0, 0.9, -0.26]}>
        <cylinderGeometry args={[0.024, 0.024, 0.3, 12]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Keyboard & Mouse */}
      <mesh castShadow position={[-0.16, 0.78, 0.17]}>
        <boxGeometry args={[0.4, 0.018, 0.13]} />
        <meshStandardMaterial color="#334155" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0.18, 0.78, 0.18]}>
        <boxGeometry args={[0.065, 0.024, 0.105]} />
        <meshStandardMaterial color="#334155" roughness={0.45} />
      </mesh>
      {/* Ceramic coffee mug */}
      <mesh castShadow position={[-0.68, 0.82, 0.14]}>
        <cylinderGeometry args={[0.042, 0.036, 0.1, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Minimalist LED desk lamp */}
      <group position={[0.72, 0.765, -0.26]}>
        <mesh>
          <cylinderGeometry args={[0.065, 0.07, 0.018, 16]} />
          <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.21, 0]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.01, 0.01, 0.42, 8]} />
          <meshStandardMaterial color={MATTE_BLACK} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.1, 0.41, 0]}>
          <boxGeometry args={[0.24, 0.018, 0.045]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fde68a"
            emissiveIntensity={1.1}
          />
        </mesh>
      </group>
    </group>
  );
}

// --- ERGONOMIC MESH OFFICE CHAIR ---
export function ErgonomicChair({ position, rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat cushion (top at y = 0.46) */}
      <mesh castShadow receiveShadow position={[0, 0.43, 0]}>
        <boxGeometry args={[0.5, 0.065, 0.48]} />
        <meshStandardMaterial color="#27303f" roughness={0.85} />
      </mesh>
      {/* Mesh backrest (on -Z in local frame, so when rotation=Math.PI it's on +Z behind seated person) */}
      <mesh castShadow position={[0, 0.76, -0.23]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.46, 0.56, 0.05]} />
        <meshStandardMaterial color="#334155" roughness={0.88} />
      </mesh>
      {/* Headrest */}
      <mesh castShadow position={[0, 1.12, -0.24]}>
        <boxGeometry args={[0.26, 0.12, 0.05]} />
        <meshStandardMaterial color="#27303f" roughness={0.85} />
      </mesh>
      {/* Armrests */}
      {[-0.27, 0.27].map((x) => (
        <group key={x} position={[x, 0.54, -0.02]}>
          <mesh>
            <boxGeometry args={[0.04, 0.2, 0.04]} />
            <meshStandardMaterial color={MATTE_BLACK} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.1, 0.04]}>
            <boxGeometry args={[0.07, 0.028, 0.26]} />
            <meshStandardMaterial color={MATTE_BLACK} roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Gas lift cylinder */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.032, 0.036, 0.36, 12]} />
        <meshStandardMaterial color={BRUSHED_METAL} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* 5-star caster base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0, 0.06, 0.15]}>
              <boxGeometry args={[0.035, 0.025, 0.3]} />
              <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.025, 0.28]}>
              <cylinderGeometry args={[0.025, 0.025, 0.025, 10]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// --- LEMARI KERJA / MODERN FILING CABINET & LOCKERS ---
export function FilingCabinet({ position, rotation = 0 }: P) {
  const binderColors = ["#34d399", "#38bdf8", "#f59e0b", "#f43f5e", "#a78bfa", "#e2e8f0"];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main tall cabinet frame */}
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[1.55, 2.1, 0.52]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.58} />
      </mesh>
      {/* Lower oak sliding/hinged doors */}
      {[-0.37, 0.37].map((x, idx) => (
        <group key={idx} position={[x, 0.52, 0.265]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 0.96, 0.025]} />
            <meshStandardMaterial color={OAK} roughness={0.5} />
          </mesh>
          <mesh position={[idx === 0 ? 0.28 : -0.28, 0.12, 0.02]}>
            <boxGeometry args={[0.02, 0.22, 0.025]} />
            <meshStandardMaterial color={MATTE_BLACK} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Open upper shelving bays with binders & boxes */}
      {[1.18, 1.62].map((y, row) => (
        <group key={y}>
          {/* Shelf recess */}
          <mesh position={[0, y + 0.16, 0.04]}>
            <boxGeometry args={[1.45, 0.38, 0.46]} />
            <meshStandardMaterial color="#2b323f" roughness={0.8} />
          </mesh>
          {/* Shelf board */}
          <mesh position={[0, y, 0.06]}>
            <boxGeometry args={[1.46, 0.03, 0.46]} />
            <meshStandardMaterial color={OAK} roughness={0.5} />
          </mesh>
          {/* Colorful binders & files */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              castShadow
              position={[-0.58 + i * 0.145, y + 0.16, 0.12]}
              rotation={[0, 0, i === 7 ? -0.08 : 0]}
            >
              <boxGeometry args={[0.07, 0.28 + (i % 2) * 0.03, 0.24]} />
              <meshStandardMaterial
                color={binderColors[(i + row * 2) % binderColors.length]}
                roughness={0.65}
              />
            </mesh>
          ))}
        </group>
      ))}
      {/* Warm under-cabinet LED accent strip */}
      <mesh position={[0, 1.98, 0.24]}>
        <boxGeometry args={[1.42, 0.015, 0.02]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

// --- VERTICAL OAK WOOD SLAT FEATURE WALL + BACKLIT SIGN ---
export function WoodSlatWall({
  position,
  rotation = 0,
  width = 4.8,
  height = 3.1,
  signTexture,
}: P & {
  width?: number;
  height?: number;
  signTexture?: THREE.Texture;
}) {
  const count = Math.floor(width / 0.14);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Acoustic dark felt backing */}
      <mesh castShadow receiveShadow position={[0, height / 2, -0.04]}>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color="#181c23" roughness={0.95} />
      </mesh>
      {/* Vertical oak slats */}
      {Array.from({ length: count }).map((_, i) => {
        const x = -width / 2 + 0.08 + i * (width / count);
        return (
          <mesh key={i} castShadow receiveShadow position={[x, height / 2, 0.01]}>
            <boxGeometry args={[0.065, height - 0.04, 0.05]} />
            <meshStandardMaterial color={i % 2 === 0 ? OAK : "#c09362"} roughness={0.55} />
          </mesh>
        );
      })}
      {/* Warm LED top & bottom wash strips */}
      <mesh position={[0, height - 0.06, 0.05]}>
        <boxGeometry args={[width - 0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fcd34d" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[0, 0.06, 0.05]}>
        <boxGeometry args={[width - 0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fcd34d" emissiveIntensity={1.4} />
      </mesh>
      {/* Backlit company signage */}
      {signTexture && (
        <group position={[0, 2.05, 0.08]}>
          <mesh>
            <planeGeometry args={[2.9, 0.72]} />
            <meshStandardMaterial
              map={signTexture}
              emissiveMap={signTexture}
              emissive="#ffffff"
              emissiveIntensity={0.6}
              transparent
              roughness={0.25}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// --- MODERN CURVED/FLUTED RECEPTION DESK (LOBBY) ---
export function ReceptionDesk({ position, rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main white Corian counter body */}
      <mesh castShadow receiveShadow position={[0, 0.56, 0]}>
        <boxGeometry args={[2.5, 1.04, 0.78]} />
        <meshStandardMaterial color={WARM_WHITE} roughness={0.35} />
      </mesh>
      {/* Fluted warm oak front accent panel */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} castShadow position={[-1.08 + i * 0.127, 0.52, 0.4]}>
          <cylinderGeometry args={[0.032, 0.032, 0.9, 10]} />
          <meshStandardMaterial color={OAK} roughness={0.5} />
        </mesh>
      ))}
      {/* Overhanging marble/Corian top */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0.04]}>
        <boxGeometry args={[2.62, 0.06, 0.88]} />
        <meshStandardMaterial color="#ffffff" roughness={0.22} />
      </mesh>
      {/* Floating warm LED toe-kick glow */}
      <mesh position={[0, 0.04, 0.36]}>
        <boxGeometry args={[2.4, 0.04, 0.05]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={2.2} />
      </mesh>
      {/* Receptionist slim monitor & guest tablet */}
      <mesh castShadow position={[0.45, 1.28, -0.14]} rotation={[0, -0.25, 0]}>
        <boxGeometry args={[0.46, 0.28, 0.025]} />
        <meshStandardMaterial color={MATTE_BLACK} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[-0.75, 1.18, 0.12]} rotation={[-0.45, 0.2, 0]}>
        <boxGeometry args={[0.24, 0.18, 0.015]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>
      {/* Small succulent planter on counter */}
      <mesh castShadow position={[-1.02, 1.2, -0.1]}>
        <cylinderGeometry args={[0.07, 0.06, 0.14, 14]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[-1.02, 1.32, -0.1]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#2f855a" roughness={0.85} />
      </mesh>
    </group>
  );
}

// --- 75" WALL-MOUNTED SMART TV + MEDIA CONSOLE (LOUNGE) ---
export function SmartTVWall({
  position,
  rotation = 0,
  tvTexture,
}: P & { tvTexture?: THREE.Texture }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Low architectural partition wall (height 2.55m, width 3.8m) */}
      <mesh castShadow receiveShadow position={[0, 1.28, -0.08]}>
        <boxGeometry args={[3.9, 2.56, 0.18]} />
        <meshStandardMaterial color="#252a34" roughness={0.75} />
      </mesh>
      {/* Warm wood side slat accents flanking TV */}
      {[-1.72, -1.58, 1.58, 1.72].map((x, i) => (
        <mesh key={i} castShadow position={[x, 1.28, 0.03]}>
          <boxGeometry args={[0.06, 2.48, 0.05]} />
          <meshStandardMaterial color={OAK} roughness={0.5} />
        </mesh>
      ))}
      {/* Floating media credenza / TV console */}
      <mesh castShadow receiveShadow position={[0, 0.42, 0.24]}>
        <boxGeometry args={[2.75, 0.34, 0.44]} />
        <meshStandardMaterial color={OAK} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.24, 0.24]}>
        <boxGeometry args={[2.65, 0.02, 0.38]} />
        <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1.6} />
      </mesh>
      {/* Soundbar */}
      <mesh castShadow position={[0, 0.63, 0.22]}>
        <boxGeometry args={[1.15, 0.07, 0.09]} />
        <meshStandardMaterial color={MATTE_BLACK} roughness={0.4} metalness={0.4} />
      </mesh>
      {/* 75" Smart TV frame */}
      <group position={[0, 1.52, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[2.35, 1.34, 0.045]} />
          <meshStandardMaterial color="#090b10" roughness={0.25} metalness={0.4} />
        </mesh>
        {/* Live KPI Dashboard Display */}
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[2.24, 1.24]} />
          <meshStandardMaterial
            map={tvTexture}
            emissiveMap={tvTexture}
            emissive="#ffffff"
            emissiveIntensity={0.85}
            roughness={0.15}
          />
        </mesh>
        {/* Ambient emerald/cyan TV backlight glow */}
        <mesh position={[0, 0, -0.025]}>
          <planeGeometry args={[2.46, 1.44]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={1.2}
            transparent
            opacity={0.32}
          />
        </mesh>
      </group>
    </group>
  );
}

// --- MODERN L-SHAPED SECTIONAL LOUNGE SOFA ---
export function LoungeSofa({ position, rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main 3-seater base (seat top at y = 0.44) */}
      <mesh castShadow receiveShadow position={[0, 0.24, 0]}>
        <boxGeometry args={[2.65, 0.34, 0.92]} />
        <meshStandardMaterial color={BOUCLE} roughness={0.94} />
      </mesh>
      {/* Plush seat cushions */}
      {[-0.82, 0, 0.82].map((x, i) => (
        <mesh key={i} castShadow receiveShadow position={[x, 0.42, 0.04]}>
          <boxGeometry args={[0.8, 0.12, 0.8]} />
          <meshStandardMaterial color="#475569" roughness={0.95} />
        </mesh>
      ))}
      {/* Chaise L-extension on left (+X when rotated Math.PI, or -X in local) */}
      <mesh castShadow receiveShadow position={[1.0, 0.24, 0.72]}>
        <boxGeometry args={[0.92, 0.34, 0.86]} />
        <meshStandardMaterial color={BOUCLE} roughness={0.94} />
      </mesh>
      <mesh castShadow receiveShadow position={[1.0, 0.42, 0.72]}>
        <boxGeometry args={[0.84, 0.12, 0.82]} />
        <meshStandardMaterial color="#475569" roughness={0.95} />
      </mesh>
      {/* Backrest */}
      <mesh castShadow position={[0, 0.66, -0.37]}>
        <boxGeometry args={[2.65, 0.56, 0.2]} />
        <meshStandardMaterial color={BOUCLE} roughness={0.94} />
      </mesh>
      {/* Armrests */}
      {[-1.26, 1.38].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.52, 0.02]}>
          <boxGeometry args={[0.18, 0.44, 0.92]} />
          <meshStandardMaterial color="#2d3646" roughness={0.94} />
        </mesh>
      ))}
      {/* Accent throw pillows (terracotta, sage, cream) */}
      <mesh castShadow position={[-0.96, 0.62, -0.18]} rotation={[-0.18, 0.28, 0.1]}>
        <boxGeometry args={[0.38, 0.36, 0.12]} />
        <meshStandardMaterial color="#d97757" roughness={0.92} />
      </mesh>
      <mesh castShadow position={[0.92, 0.62, -0.18]} rotation={[-0.18, -0.25, -0.08]}>
        <boxGeometry args={[0.38, 0.36, 0.12]} />
        <meshStandardMaterial color="#34d399" roughness={0.92} />
      </mesh>
      <mesh castShadow position={[0.62, 0.58, -0.16]} rotation={[-0.22, -0.12, 0.05]}>
        <boxGeometry args={[0.32, 0.3, 0.11]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.92} />
      </mesh>
      {/* Walnut wooden sofa legs */}
      {[
        [-1.22, 0.05, -0.36],
        [1.32, 0.05, -0.36],
        [-1.22, 0.05, 0.38],
        [1.32, 0.05, 1.05],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.025, 0.02, 0.1, 8]} />
          <meshStandardMaterial color={WALNUT} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// --- ACCENT LOUNGE ARMCHAIR ---
export function AccentChair({ position, rotation = 0, color = "#b45309" }: P & { color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[0.72, 0.16, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.66, -0.28]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[0.72, 0.48, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} castShadow position={[x, 0.5, 0.02]}>
          <boxGeometry args={[0.09, 0.24, 0.66]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
      {[
        [-0.28, 0.16, -0.26],
        [0.28, 0.16, -0.26],
        [-0.28, 0.16, 0.26],
        [0.28, 0.16, 0.26],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.022, 0.018, 0.32, 8]} />
          <meshStandardMaterial color={MATTE_BLACK} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// --- ORGANIC TERRAZZO COFFEE TABLE ---
export function CoffeeTable({ position, rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.045, 28]} />
        <meshStandardMaterial color="#ece8e1" roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.24, 0.32, 0.38, 20]} />
        <meshStandardMaterial color={WALNUT} roughness={0.55} />
      </mesh>
      {/* Magazine + ceramic cup */}
      <mesh castShadow position={[0.18, 0.435, 0.08]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.28, 0.022, 0.21]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.2, 0.46, -0.1]}>
        <cylinderGeometry args={[0.045, 0.038, 0.085, 14]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
    </group>
  );
}

// --- CONFERENCE TABLE + CHAIRS (GLASS MEETING ROOM) ---
export function ConferenceTable({ position, rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Warm walnut tabletop */}
      <mesh castShadow receiveShadow position={[0, 0.74, 0]}>
        <boxGeometry args={[2.6, 0.06, 1.18]} />
        <meshStandardMaterial color={WALNUT} roughness={0.45} />
      </mesh>
      {/* Matte black architectural trestle legs */}
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} castShadow position={[x, 0.36, 0]}>
          <boxGeometry args={[0.08, 0.72, 0.82]} />
          <meshStandardMaterial color={MATTE_BLACK} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Center cable hub & conference speakerphone */}
      <mesh position={[0, 0.775, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.03, 18]} />
        <meshStandardMaterial color={MATTE_BLACK} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.793, 0]}>
        <ringGeometry args={[0.05, 0.065, 18]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Open laptop on table */}
      <group position={[-0.7, 0.78, 0.1]} rotation={[0, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.015, 0.24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.11, -0.11]} rotation={[-0.22, 0, 0]}>
          <boxGeometry args={[0.34, 0.22, 0.01]} />
          <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.35} />
        </mesh>
      </group>
      {/* 4 Meeting Chairs */}
      <ErgonomicChair position={[-0.65, 0, -0.92]} rotation={0} />
      <ErgonomicChair position={[0.65, 0, -0.92]} rotation={0} />
      <ErgonomicChair position={[-0.65, 0, 0.92]} rotation={Math.PI} />
      <ErgonomicChair position={[0.65, 0, 0.92]} rotation={Math.PI} />
    </group>
  );
}

// --- MODERN PANTRY & ESPRESSO COFFEE BAR ---
export function PantryBar({ position, rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base cabinetry */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[2.45, 0.9, 0.64]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
      </mesh>
      {/* Butcher block oak countertop */}
      <mesh castShadow receiveShadow position={[0, 0.92, 0.02]}>
        <boxGeometry args={[2.52, 0.055, 0.68]} />
        <meshStandardMaterial color={OAK} roughness={0.45} />
      </mesh>
      {/* Espresso machine */}
      <group position={[-0.55, 1.15, -0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.42, 0.34]} />
          <meshStandardMaterial color="#111827" metalness={0.55} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.05, 0.175]}>
          <boxGeometry args={[0.32, 0.12, 0.02]} />
          <meshStandardMaterial color={BRUSHED_METAL} metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.14, 0.16]}>
          <cylinderGeometry args={[0.042, 0.036, 0.09, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>
      {/* Stainless sink + faucet */}
      <mesh position={[0.65, 0.945, 0]}>
        <boxGeometry args={[0.52, 0.04, 0.4]} />
        <meshStandardMaterial color={BRUSHED_METAL} metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0.65, 1.1, -0.16]}>
        <cylinderGeometry args={[0.018, 0.018, 0.28, 10]} />
        <meshStandardMaterial color={BRUSHED_METAL} metalness={0.9} roughness={0.18} />
      </mesh>
      {/* Floating wooden upper shelves + LED underlight */}
      {[1.65, 2.05].map((y, idx) => (
        <group key={y} position={[0, y, -0.22]}>
          <mesh castShadow>
            <boxGeometry args={[2.35, 0.045, 0.26]} />
            <meshStandardMaterial color={OAK} roughness={0.5} />
          </mesh>
          {idx === 0 && (
            <mesh position={[0, -0.03, 0]}>
              <boxGeometry args={[2.2, 0.015, 0.02]} />
              <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.6} />
            </mesh>
          )}
          {/* Coffee jars & mugs */}
          {[-0.8, -0.45, -0.1, 0.45, 0.8].map((x, j) => (
            <mesh key={j} castShadow position={[x, 0.1, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.14, 12]} />
              <meshStandardMaterial
                color={j % 2 === 0 ? "#f8fafc" : "#10b981"}
                roughness={0.35}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// --- WATER COOLER / DISPENSER ---
export function WaterCooler({ position, rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 0.54, 0]}>
        <boxGeometry args={[0.38, 1.08, 0.38]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.26, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.38, 18]} />
        <meshStandardMaterial color="#7dd3fc" transparent opacity={0.72} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.82, 0.195]}>
        <boxGeometry args={[0.12, 0.07, 0.02]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
    </group>
  );
}

// --- FRAMELESS GLASS PARTITION WITH BLACK ALUMINUM MULLIONS ---
export function GlassPartition({
  position,
  size,
  rotation = 0,
}: P & { size: [number, number] }) {
  const [w, h] = size;
  const posts = Math.max(2, Math.round(w / 1.4));
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Double-glazed tinted architectural glass */}
      <mesh>
        <boxGeometry args={[w, h, 0.035]} />
        <meshPhysicalMaterial
          color="#d8f0ff"
          transparent
          opacity={0.18}
          roughness={0.06}
          metalness={0.05}
          reflectivity={0.85}
        />
      </mesh>
      {/* Frosted privacy manifestation band at eye level */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[w - 0.04, 0.42, 0.04]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.22} roughness={0.5} />
      </mesh>
      {/* Top & bottom matte black aluminum rails */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w + 0.04, 0.055, 0.065]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -h / 2 + 0.025, 0]}>
        <boxGeometry args={[w + 0.04, 0.055, 0.065]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Vertical mullions */}
      {Array.from({ length: posts + 1 }).map((_, i) => {
        const x = -w / 2 + (i / posts) * w;
        return (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.045, h, 0.065]} />
            <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

// --- WHITEBOARD WITH SALES FUNNEL ---
export function WhiteboardPanel({
  position,
  rotation = 0,
  texture,
}: P & { texture?: THREE.Texture }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.3, 1.35, 0.045]} />
        <meshStandardMaterial color={MATTE_BLACK} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[2.22, 1.27]} />
        <meshStandardMaterial map={texture} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.7, 0.05]}>
        <boxGeometry args={[2.2, 0.035, 0.07]} />
        <meshStandardMaterial color={BRUSHED_METAL} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// --- BIOPHILIC INDOOR PLANTER ---
export function IndoorPlant({ position, scale = 1 }: P & { scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Matte ceramic planter pot */}
      <mesh castShadow receiveShadow position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.52, 18]} />
        <meshStandardMaterial color="#e7e5e0" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.51, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
        <meshStandardMaterial color="#3f2e21" roughness={0.95} />
      </mesh>
      {/* Main woody stem */}
      <mesh castShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.022, 0.032, 0.52, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Layered lush foliage clusters */}
      {[
        [0, 1.08, 0, 0.22, "#2f855a"],
        [0.18, 0.94, 0.12, 0.19, "#276749"],
        [-0.17, 0.92, 0.14, 0.18, "#38a169"],
        [0.14, 0.88, -0.17, 0.19, "#2f855a"],
        [-0.16, 0.96, -0.14, 0.2, "#276749"],
        [0.04, 1.24, -0.04, 0.17, "#38a169"],
      ].map(([x, y, z, r, col], i) => (
        <mesh key={i} castShadow position={[x as number, y as number, z as number]}>
          <dodecahedronGeometry args={[r as number, 1]} />
          <meshStandardMaterial color={col as string} roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

// --- LINEAR ARCHITECTURAL SUSPENDED LED FIXTURE ---
export function LinearLight({
  position,
  length = 2.6,
  rotation = 0,
}: P & { length?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Suspension wires */}
      {[-length / 2 + 0.25, length / 2 - 0.25].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.7, 6]} />
          <meshStandardMaterial color={MATTE_BLACK} />
        </mesh>
      ))}
      <mesh>
        <boxGeometry args={[length, 0.055, 0.075]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[length - 0.04, 0.012, 0.055]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fef3c7" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

// --- WARM PENDANT LAMP (LOUNGE & LOBBY) ---
export function PendantLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.84, 6]} />
        <meshStandardMaterial color={MATTE_BLACK} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <coneGeometry args={[0.24, 0.22, 22, 1, true]} />
        <meshStandardMaterial
          color="#1e293b"
          side={THREE.DoubleSide}
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial color="#fff7ed" emissive="#fde68a" emissiveIntensity={2.4} />
      </mesh>
    </group>
  );
}

// --- AREA RUG ---
export function AreaRug({
  position,
  size,
  color = "#cbd5e1",
  borderColor = "#94a3b8",
}: P & { size: [number, number]; color?: string; borderColor?: string }) {
  return (
    <group position={[position[0], 0.008, position[2]]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color={borderColor} roughness={0.98} />
      </mesh>
      <mesh receiveShadow position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0] - 0.16, size[1] - 0.16]} />
        <meshStandardMaterial color={color} roughness={0.98} />
      </mesh>
    </group>
  );
}

// --- OWNER EXECUTIVE DESK (FACING +Z IN LOCAL SPACE; ROTATE -PI/2 TO FACE WEST) ---
export function OwnerExecutiveDesk({
  position,
  rotation = 0,
  screenTexture,
  nameplateTexture,
}: P & {
  screenTexture?: THREE.Texture;
  nameplateTexture?: THREE.Texture;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Rich walnut wide executive tabletop (2.6m wide x 0.96m deep) */}
      <mesh castShadow receiveShadow position={[0, 0.74, 0]}>
        <boxGeometry args={[2.6, 0.065, 0.96]} />
        <meshStandardMaterial color={WALNUT} roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Front fluted executive modesty panel (faces visitors at +Z) */}
      <mesh castShadow receiveShadow position={[0, 0.37, 0.36]}>
        <boxGeometry args={[2.45, 0.72, 0.08]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
      </mesh>
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} castShadow position={[-1.12 + i * 0.15, 0.37, 0.415]}>
          <boxGeometry args={[0.045, 0.68, 0.035]} />
          <meshStandardMaterial color={OAK} roughness={0.5} />
        </mesh>
      ))}
      {/* Warm gold LED floor strip along front of Owner's desk */}
      <mesh position={[0, 0.03, 0.42]}>
        <boxGeometry args={[2.35, 0.025, 0.03]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.6} />
      </mesh>
      {/* Side pedestals */}
      {[-1.08, 1.08].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.36, -0.02]}>
          <boxGeometry args={[0.42, 0.72, 0.84]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.55} />
        </mesh>
      ))}
      {/* Center dark leather desk pad (clean clear sightline in front of Owner!) */}
      <mesh receiveShadow position={[0, 0.776, -0.14]}>
        <boxGeometry args={[0.82, 0.006, 0.42]} />
        <meshStandardMaterial color="#111827" roughness={0.85} />
      </mesh>
      {/* Sleek keyboard + mouse on desk pad */}
      <mesh castShadow position={[-0.06, 0.788, -0.16]}>
        <boxGeometry args={[0.38, 0.016, 0.12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0.24, 0.79, -0.15]}>
        <boxGeometry args={[0.06, 0.022, 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.45} />
      </mesh>
      {/* Executive notebook + brass pen */}
      <mesh castShadow position={[-0.56, 0.784, -0.05]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.22, 0.018, 0.28]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>
      {/* Gold/Black "OWNER · FOUNDER" Nameplate facing visitors (+Z) & angled slightly */}
      <group position={[0, 0.825, 0.34]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.1, 0.06]} />
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
        </mesh>
        {nameplateTexture && (
          <mesh position={[0, 0.005, 0.032]}>
            <planeGeometry args={[0.4, 0.092]} />
            <meshStandardMaterial map={nameplateTexture} roughness={0.3} />
          </mesh>
        )}
      </group>
      {/* Side-angled Ultrawide Executive Monitor (placed on right/north side so center POV is clear!) */}
      <group position={[0.88, 1.05, 0.04]} rotation={[0, Math.PI - 0.55, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.78, 0.38, 0.03]} />
          <meshStandardMaterial color={MATTE_BLACK} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[0.74, 0.34]} />
          <meshStandardMaterial
            map={screenTexture}
            emissiveMap={screenTexture}
            emissive="#ffffff"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -0.22, -0.02]}>
          <cylinderGeometry args={[0.025, 0.025, 0.24, 10]} />
          <meshStandardMaterial color={BRUSHED_METAL} metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
      {/* Open Executive Laptop on left side */}
      <group position={[-0.86, 0.78, -0.02]} rotation={[0, Math.PI + 0.48, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.015, 0.25]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.115, -0.11]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.36, 0.23, 0.012]} />
          <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.45} />
        </mesh>
      </group>
      {/* Ceramic espresso mug on desk */}
      <mesh castShadow position={[0.44, 0.82, -0.16]}>
        <cylinderGeometry args={[0.04, 0.035, 0.095, 14]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.28} />
      </mesh>
      {/* Brass executive desk lamp */}
      <group position={[-1.08, 0.77, 0.26]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#b48a4e" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
          <meshStandardMaterial color="#b48a4e" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.08, 0.43, 0]}>
          <boxGeometry args={[0.24, 0.022, 0.055]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={1.3} />
        </mesh>
      </group>
    </group>
  );
}

// --- VISITOR / DIVISION UPDATE CHAIR (FACING +Z IN LOCAL SPACE) ---
export function VisitorChair({
  position,
  rotation = 0,
  accent,
}: P & { accent?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Cushioned executive guest seat (top at y = 0.45) */}
      <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[0.54, 0.07, 0.5]} />
        <meshStandardMaterial color="#2c3545" roughness={0.85} />
      </mesh>
      {/* Curved low-profile backrest */}
      <mesh castShadow position={[0, 0.7, -0.23]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.52, 0.48, 0.06]} />
        <meshStandardMaterial color="#334155" roughness={0.88} />
      </mesh>
      {/* Subtle accent piping on backrest if assigned to a division */}
      {accent && (
        <mesh position={[0, 0.94, -0.255]}>
          <boxGeometry args={[0.36, 0.022, 0.025]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.65} />
        </mesh>
      )}
      {/* Sleek armrests */}
      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, 0.53, -0.02]}>
          <mesh>
            <boxGeometry args={[0.035, 0.18, 0.035]} />
            <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.09, 0.04]}>
            <boxGeometry args={[0.065, 0.025, 0.28]} />
            <meshStandardMaterial color={WALNUT} roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Cantilever matte-black steel legs */}
      {[-0.24, 0.24].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow position={[0, 0.2, 0.2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.4, 8]} />
            <meshStandardMaterial color={MATTE_BLACK} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0, 0.2, -0.2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.4, 8]} />
            <meshStandardMaterial color={MATTE_BLACK} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.016, 0]}>
            <boxGeometry args={[0.03, 0.024, 0.44]} />
            <meshStandardMaterial color={MATTE_BLACK} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// --- ANIMATED FRAMELESS GLASS DOOR (AUTO-SWINGS OPEN WHEN ANY AVATAR APPROACHES) ---
export function GlassDoor({
  hingePosition,
  rotation = 0,
  width = 1.18,
  height = 2.24,
  transomHeight = 0.96,
  avatarPositionsRef,
}: {
  hingePosition: [number, number, number];
  rotation?: number;
  width?: number;
  height?: number;
  transomHeight?: number;
  avatarPositionsRef: React.MutableRefObject<Record<string, THREE.Vector3>>;
}) {
  const leafRef = useRef<THREE.Group>(null);
  const currentAngle = useRef(0);

  useFrame((_, rawDelta) => {
    if (!leafRef.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const cx = hingePosition[0] + Math.cos(rotation) * (width / 2);
    const cz = hingePosition[2] - Math.sin(rotation) * (width / 2);

    let minDist = Infinity;
    const positions = avatarPositionsRef.current;
    for (const key in positions) {
      const p = positions[key];
      const d = Math.hypot(p.x - cx, p.z - cz);
      if (d < minDist) minDist = d;
    }

    const targetAngle = minDist < 1.95 ? 1.35 : 0; // swings smoothly open into Owner Suite!
    currentAngle.current = THREE.MathUtils.lerp(
      currentAngle.current,
      targetAngle,
      1 - Math.exp(-5.5 * delta),
    );
    leafRef.current.rotation.y = currentAngle.current;
  });

  return (
    <group position={hingePosition} rotation={[0, rotation, 0]}>
      {/* Static door frame jambs + header */}
      <mesh position={[0, (height + transomHeight) / 2, 0]}>
        <boxGeometry args={[0.06, height + transomHeight, 0.075]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[width, (height + transomHeight) / 2, 0]}>
        <boxGeometry args={[0.06, height + transomHeight, 0.075]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[width / 2, height + 0.03, 0]}>
        <boxGeometry args={[width + 0.06, 0.06, 0.075]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[width / 2, height + transomHeight, 0]}>
        <boxGeometry args={[width + 0.06, 0.06, 0.075]} />
        <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Fixed glass transom above doorway */}
      <mesh position={[width / 2, height + transomHeight / 2, 0]}>
        <boxGeometry args={[width - 0.04, transomHeight - 0.05, 0.03]} />
        <meshPhysicalMaterial
          color="#d8f0ff"
          transparent
          opacity={0.18}
          roughness={0.06}
          metalness={0.05}
        />
      </mesh>

      {/* Swinging Glass Door Leaf pivoted at x = 0 */}
      <group ref={leafRef} position={[0.03, 0, 0]}>
        {/* Glass pane */}
        <mesh position={[(width - 0.06) / 2, height / 2, 0]}>
          <boxGeometry args={[width - 0.1, height - 0.06, 0.025]} />
          <meshPhysicalMaterial
            color="#cde9ff"
            transparent
            opacity={0.22}
            roughness={0.05}
            metalness={0.06}
            reflectivity={0.9}
          />
        </mesh>
        {/* Frosted manifestation band across door */}
        <mesh position={[(width - 0.06) / 2, 1.25, 0]}>
          <boxGeometry args={[width - 0.14, 0.34, 0.03]} />
          <meshStandardMaterial color="#f1f5f9" transparent opacity={0.24} roughness={0.5} />
        </mesh>
        {/* Slim black aluminum perimeter frame on door leaf */}
        <mesh position={[(width - 0.06) / 2, height - 0.02, 0]}>
          <boxGeometry args={[width - 0.06, 0.04, 0.045]} />
          <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[(width - 0.06) / 2, 0.03, 0]}>
          <boxGeometry args={[width - 0.06, 0.06, 0.045]} />
          <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[width - 0.08, height / 2, 0]}>
          <boxGeometry args={[0.04, height, 0.045]} />
          <meshStandardMaterial color={MATTE_BLACK} metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Brushed stainless vertical pull handles (both sides of glass door) */}
        {[-0.055, 0.055].map((z) => (
          <mesh key={z} position={[width - 0.2, 1.08, z]}>
            <cylinderGeometry args={[0.014, 0.014, 0.56, 12]} />
            <meshStandardMaterial color={BRUSHED_METAL} metalness={0.9} roughness={0.18} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

