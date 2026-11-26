"use client";

import { useEffect, useMemo, useState } from "react";
import { Environment, Html, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import EmployeeAvatar from "./EmployeeAvatar";
import KenneyModel from "./KenneyModel";
import {
  GlassDoor,
  GlassPartition,
  LinearLight,
  PendantLamp,
  WhiteboardPanel,
  WoodSlatWall,
} from "./props";
import {
  CameraPresetId,
  EMPLOYEES,
  EmployeeId,
  MEETING_CHAIRS,
  OWNER_VISITOR_CHAIRS,
  StationId,
} from "@/lib/officeLayout";
import {
  createAssistantSignTexture,
  createLobbySignTexture,
  createMasterFloorTexture,
  createMeetingTVTexture,
  createOwnerNameplateTexture,
  createPlatformPosterTexture,
  createTVDashboardTexture,
  createWhiteboardTexture,
} from "@/lib/officeTextures";

const F = "/models/kenney/furniture";

type EmployeeCommand = {
  station: StationId;
  seq: number;
};

type OfficeSceneProps = {
  isIsometric: boolean;
  selectedEmployeeId: EmployeeId;
  employeeCommands: Record<EmployeeId, EmployeeCommand>;
  greetSignals: Record<EmployeeId, number>;
  customBubbles: Record<EmployeeId, { text: string; seq: number }>;
  autoRoutine: boolean;
  language: "id" | "en";
  onSelectEmployee: (id: EmployeeId) => void;
  onFocusRoom: (room: CameraPresetId) => void;
  onEmployeeStateChange: (info: {
    id: EmployeeId;
    station: StationId;
    moving: boolean;
  }) => void;
  avatarPositionsRef: React.MutableRefObject<Record<string, THREE.Vector3>>;
};

type ClickableZone = {
  id: CameraPresetId;
  labelId: string;
  labelEn: string;
  accent: string;
  center: [number, number];
  size: [number, number];
  topBadgePos: [number, number, number];
};

const ROOM_ZONES: ClickableZone[] = [
  {
    id: "meeting",
    labelId: "Ruang Meeting & TV",
    labelEn: "Meeting Room & TV",
    accent: "#818cf8",
    center: [-14.6, 0.0],
    size: [6.4, 17.2],
    topBadgePos: [-14.6, 3.85, 0.2],
  },
  {
    id: "desk",
    labelId: "Ruang Team",
    labelEn: "Team Room",
    accent: "#38bdf8",
    center: [-5.7, -4.1],
    size: [10.4, 8.2],
    topBadgePos: [-5.5, 3.85, -4.1],
  },
  {
    id: "assistant",
    labelId: "Meja Owner Assistant · Maya",
    labelEn: "Owner Assistant · Maya",
    accent: "#fbbf24",
    center: [1.35, -7.25],
    size: [2.9, 3.2],
    topBadgePos: [1.35, 3.55, -7.25],
  },
  {
    id: "owner",
    labelId: "Ruang Owner",
    labelEn: "Owner Suite",
    accent: "#34d399",
    center: [7.4, -5.0],
    size: [8.6, 7.4],
    topBadgePos: [7.4, 3.85, -5.0],
  },
  {
    id: "lounge",
    labelId: "Lounge & Smart TV",
    labelEn: "Lounge & Smart TV",
    accent: "#fb923c",
    center: [-6.4, 5.6],
    size: [9.0, 5.8],
    topBadgePos: [-6.4, 3.65, 5.5],
  },
  {
    id: "lobby",
    labelId: "Lobby & Resepsionis",
    labelEn: "Reception Lobby",
    accent: "#a78bfa",
    center: [6.4, 6.4],
    size: [9.8, 4.6],
    topBadgePos: [6.4, 3.65, 6.4],
  },
  {
    id: "pantry",
    labelId: "Pantry & Coffee Bar",
    labelEn: "Pantry & Coffee Bar",
    accent: "#2dd4bf",
    center: [10.0, 1.35],
    size: [3.6, 4.4],
    topBadgePos: [10.0, 3.45, 1.35],
  },
];

export default function OfficeScene({
  isIsometric,
  selectedEmployeeId,
  employeeCommands,
  greetSignals,
  customBubbles,
  autoRoutine,
  language,
  onSelectEmployee,
  onFocusRoom,
  onEmployeeStateChange,
  avatarPositionsRef,
}: OfficeSceneProps) {
  const [hoveredRoom, setHoveredRoom] = useState<CameraPresetId | null>(null);

  const textures = useMemo(() => {
    return {
      masterFloor: createMasterFloorTexture(),
      tvDashboard: createTVDashboardTexture(),
      meetingTV: createMeetingTVTexture(),
      lobbySign: createLobbySignTexture(),
      whiteboard: createWhiteboardTexture(),
      ownerNameplate: createOwnerNameplateTexture(),
      assistantSign: createAssistantSignTexture(),
      posterThreads: createPlatformPosterTexture("THREADS", "Storytelling", "#1e293b", "#475569"),
      posterIG: createPlatformPosterTexture("INSTAGRAM", "Reels & Visual", "#ec4899", "#f97316"),
      posterTikTok: createPlatformPosterTexture("TIKTOK", "Viral Hooks", "#0f766e", "#06b6d4"),
      posterYT: createPlatformPosterTexture("YOUTUBE", "Long-Form", "#dc2626", "#f43f5e"),
      meetArt1: createPlatformPosterTexture("CREATE", "Bold Ideas", "#6366f1", "#a855f7"),
      meetArt2: createPlatformPosterTexture("GROW", "Q4 Strategy", "#0ea5e9", "#10b981"),
      meetArt3: createPlatformPosterTexture("INSPIRE", "Creative Hub", "#f97316", "#ec4899"),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  const contentTeam = EMPLOYEES.filter((e) => e.id !== "assistant");

  return (
    <>
      {/* Bright Cheerful Studio IBL */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={1.85}
          position={[-3, 10, -4]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[28, 14, 1]}
          color="#fffaf0"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-3, 4, -12]}
          scale={[26, 5, 1]}
          color="#bae6fd"
        />
        <Lightformer
          form="circle"
          intensity={1.3}
          position={[10, 5, 8]}
          scale={[8, 8, 1]}
          color="#fde68a"
        />
      </Environment>

      {/* Crisp Vibrant Daylight + Warm Zone Accent Lighting */}
      <ambientLight intensity={0.72} color="#fffbf5" />
      <hemisphereLight args={["#e0f2fe", "#b58d63", 0.72]} />
      <directionalLight
        position={[11, 18, 11]}
        intensity={1.85}
        color="#fffaf0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={16}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-far={48}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-14.6, 3.2, 0.4]} intensity={8} distance={12} color="#e0e7ff" />
      <pointLight position={[-6.4, 3.1, 5.4]} intensity={7} distance={11} color="#ffd8a8" />
      <pointLight position={[6.2, 3.1, 6.4]} intensity={7} distance={11} color="#ffedd5" />
      <pointLight position={[7.6, 3.1, -5.0]} intensity={8} distance={12} color="#fef3c7" />

      {/* ==================== 100% PATEN SINGLE-MESH FLOOR (30m x 18m: X -18..+12, Z -9..+9) ==================== */}
      {/* ONE single flat floor mesh with ALL colorful zones baked into 1 high-res texture = ZERO Z-fighting! */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0, 0]}>
        <planeGeometry args={[30, 18]} />
        <meshStandardMaterial
          map={textures.masterFloor}
          roughness={0.62}
          metalness={0.04}
        />
      </mesh>

      {/* 4 Perimeter Plinth Skirts ONLY (NO top plate underneath the floor!) */}
      {/* South skirt */}
      <mesh position={[-3, -0.2, 9.08]}>
        <boxGeometry args={[30.36, 0.4, 0.16]} />
        <meshStandardMaterial color="#1d283a" roughness={0.8} />
      </mesh>
      <mesh position={[-3, -0.02, 9.17]}>
        <boxGeometry args={[30.38, 0.04, 0.02]} />
        <meshStandardMaterial color="#2dd4bf" roughness={0.45} />
      </mesh>
      {/* North skirt */}
      <mesh position={[-3, -0.2, -9.08]}>
        <boxGeometry args={[30.36, 0.4, 0.16]} />
        <meshStandardMaterial color="#1d283a" roughness={0.8} />
      </mesh>
      {/* East skirt */}
      <mesh position={[12.08, -0.2, 0]}>
        <boxGeometry args={[0.16, 0.4, 18.0]} />
        <meshStandardMaterial color="#1d283a" roughness={0.8} />
      </mesh>
      <mesh position={[12.17, -0.02, 0]}>
        <boxGeometry args={[0.02, 0.04, 18.36]} />
        <meshStandardMaterial color="#2dd4bf" roughness={0.45} />
      </mesh>
      {/* West skirt */}
      <mesh position={[-18.08, -0.2, 0]}>
        <boxGeometry args={[0.16, 0.4, 18.0]} />
        <meshStandardMaterial color="#1d283a" roughness={0.8} />
      </mesh>

      {/* ==================== VIBRANT ARCHITECTURAL WALLS & LOFT WINDOWS (30m WIDE) ==================== */}
      {/* Back Wall (-Z = -9.0, spans X = -18..+12) */}
      <mesh receiveShadow position={[-3, 0.45, -9.0]}>
        <boxGeometry args={[30, 0.9, 0.18]} />
        <meshStandardMaterial color="#2a6f7f" roughness={0.78} />
      </mesh>
      <mesh receiveShadow position={[-3, 3.45, -9.0]}>
        <boxGeometry args={[30, 0.55, 0.18]} />
        <meshStandardMaterial color="#f8f4ec" roughness={0.85} />
      </mesh>
      {[-17.82, -11.2, -0.2, 2.9, 11.82].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 1.85, -8.98]}>
          <boxGeometry args={[0.36, 3.7, 0.26]} />
          <meshStandardMaterial color="#1f2937" roughness={0.65} />
        </mesh>
      ))}
      <mesh position={[-3, 2.05, -9.08]}>
        <planeGeometry args={[29.6, 2.35]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#bae6fd"
          emissiveIntensity={0.95}
          roughness={0.2}
        />
      </mesh>
      {[-14.6, -8.4, -5.6, -2.8, 5.8, 8.8].map((x) => (
        <mesh key={x} position={[x, 2.05, -8.98]}>
          <boxGeometry args={[0.07, 2.35, 0.09]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[-3, 2.6, -8.98]}>
        <boxGeometry args={[29.6, 0.06, 0.09]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Far West Wall (-X = -18.0) — Meeting Room Feature Wall (Two-Tone Indigo-Teal + Cream) */}
      <mesh receiveShadow position={[-18.0, 0.65, 0]}>
        <boxGeometry args={[0.18, 1.3, 18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>
      <mesh receiveShadow position={[-18.0, 2.5, 0]}>
        <boxGeometry args={[0.18, 2.4, 18]} />
        <meshStandardMaterial color="#f5f3ff" roughness={0.85} />
      </mesh>
      <mesh position={[-17.88, 1.3, 0]}>
        <boxGeometry args={[0.06, 0.08, 18]} />
        <meshStandardMaterial color="#c99f6e" roughness={0.5} />
      </mesh>

      {/* Right Wall (+X = +12.0): Sims-style low cutaway wall in Isometric mode */}
      <mesh receiveShadow position={[12.0, isIsometric ? 0.35 : 1.85, 0]}>
        <boxGeometry args={[0.18, isIsometric ? 0.7 : 3.7, 18]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.85} />
      </mesh>

      {/* Suspended Architectural Lighting */}
      <LinearLight position={[-14.4, 3.25, 0.4]} length={4.6} rotation={Math.PI / 2} />
      <LinearLight position={[-5.3, 3.3, -6.2]} length={7.2} />
      <LinearLight position={[-5.3, 3.3, -2.1]} length={7.2} />
      <LinearLight position={[7.8, 3.3, -5.0]} length={4.2} rotation={Math.PI / 2} />
      <PendantLamp position={[-14.6, 3.05, 5.8]} />
      <PendantLamp position={[-6.4, 3.05, 5.4]} />
      <PendantLamp position={[6.2, 3.05, 6.4]} />
      <PendantLamp position={[1.35, 3.05, -7.1]} />
      <PendantLamp position={[10.15, 3.05, 1.3]} />

      {/* ==================== ZONE 1: NEW LEFT-WING DECORATED MEETING ROOM & TV (X: -18..-11.2) ==================== */}
      <group>
        {/* Glass Partition Wall along X = -11.2 separating Meeting Room from Content Studio & Lounge
            with a wide 2.2m open entrance at Z = 0.0..+2.2 */}
        <GlassPartition position={[-11.2, 1.7, -4.5]} size={[9.0, 3.4]} rotation={Math.PI / 2} />
        <GlassPartition position={[-11.2, 1.7, 5.6]} size={[6.8, 3.4]} rotation={Math.PI / 2} />

        {/* Acoustic Warm Oak Vertical Slats on Far West Wall flanking the Meeting Smart TV */}
        {[-2.35, -2.1, -1.85, 2.65, 2.9, 3.15].map((z, i) => (
          <mesh key={i} castShadow position={[-17.85, 1.8, z]}>
            <boxGeometry args={[0.06, 3.3, 0.1]} />
            <meshStandardMaterial color="#c99f6e" roughness={0.5} />
          </mesh>
        ))}

        {/* Large Wall-Mounted Presentation Smart TV facing East (+X) into the Meeting Room */}
        <KenneyModel
          url={`${F}/cabinetTelevisionDoors.glb`}
          position={[-17.35, 0, 0.4]}
          rotation={Math.PI / 2}
          scale={2.4}
        />
        <group position={[-17.8, 1.9, 0.4]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 1.82, 0.06]} />
            <meshStandardMaterial color="#090b10" roughness={0.25} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.036]}>
            <planeGeometry args={[3.04, 1.7]} />
            <meshStandardMaterial
              map={textures.meetingTV}
              emissiveMap={textures.meetingTV}
              emissive="#ffffff"
              emissiveIntensity={0.86}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[3.36, 1.96]} />
            <meshStandardMaterial
              color="#818cf8"
              emissive="#6366f1"
              emissiveIntensity={1.25}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>

        {/* Attractive Colorful Framed Art Posters on West Wall */}
        <group position={[-17.85, 2.35, -4.4]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.3, 1.56, 0.05]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.18, 1.44]} />
            <meshStandardMaterial map={textures.meetArt1} roughness={0.35} />
          </mesh>
        </group>
        <group position={[-17.85, 2.35, -6.3]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.3, 1.56, 0.05]} />
            <meshStandardMaterial color="#34d399" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.18, 1.44]} />
            <meshStandardMaterial map={textures.meetArt2} roughness={0.35} />
          </mesh>
        </group>
        <group position={[-17.85, 2.35, 5.2]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.3, 1.56, 0.05]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.18, 1.44]} />
            <meshStandardMaterial map={textures.meetArt3} roughness={0.35} />
          </mesh>
        </group>

        {/* Credenza Decorations: Books + Golden Award Trophy + Bookcase */}
        <KenneyModel
          url={`${F}/books.glb`}
          position={[-17.3, 0.78, -0.5]}
          rotation={Math.PI / 2}
          scale={2.2}
        />
        <group position={[-17.3, 0.78, 1.3]}>
          <mesh castShadow position={[0, 0.045, 0]}>
            <boxGeometry args={[0.16, 0.09, 0.16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.09, 0.045, 0.22, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
        <KenneyModel
          url={`${F}/bookcaseOpen.glb`}
          position={[-17.35, 0, -5.3]}
          rotation={Math.PI / 2}
          scale={2.25}
        />

        {/* Long Executive Conference Table oriented along Z so everyone faces the West Presentation TV */}
        <group position={[-14.4, 0, 0.4]}>
          <mesh castShadow receiveShadow position={[0, 0.76, 0]}>
            <boxGeometry args={[1.35, 0.075, 4.1]} />
            <meshStandardMaterial color="#8f6542" roughness={0.4} />
          </mesh>
          {[-1.4, 1.4].map((z) => (
            <mesh key={z} castShadow position={[0, 0.37, z]}>
              <boxGeometry args={[0.9, 0.74, 0.1]} />
              <meshStandardMaterial color="#14171d" metalness={0.55} roughness={0.4} />
            </mesh>
          ))}
          {/* Center glowing speakerphone */}
          <mesh position={[0, 0.81, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.035, 18]} />
            <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.835, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.065, 0.085, 18]} />
            <meshStandardMaterial
              color="#34d399"
              emissive="#34d399"
              emissiveIntensity={1.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Open Laptops & Colorful Notebooks on Table */}
          <KenneyModel
            url={`${F}/laptop.glb`}
            position={[0.28, 0.8, -1.05]}
            rotation={-Math.PI / 2 + 0.18}
            scale={0.82}
          />
          <KenneyModel
            url={`${F}/laptop.glb`}
            position={[-0.28, 0.8, 1.15]}
            rotation={Math.PI / 2 - 0.18}
            scale={0.82}
          />
          <mesh castShadow position={[0.25, 0.81, 0.55]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.28, 0.02, 0.22]} />
            <meshStandardMaterial color="#f472b6" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[-0.25, 0.81, -0.55]} rotation={[0, -0.18, 0]}>
            <boxGeometry args={[0.28, 0.02, 0.22]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.7} />
          </mesh>
        </group>

        {/* 6 Modern Meeting Chairs */}
        {MEETING_CHAIRS.map((chair, idx) => (
          <KenneyModel
            key={idx}
            url={`${F}/chairModernFrameCushion.glb`}
            position={chair.position}
            rotation={chair.rotation}
            scale={2.15}
          />
        ))}

        {/* South Breakout Corner inside Meeting Room (Accent Chairs + Coffee Table + Floor Lamp + Plants) */}
        <KenneyModel
          url={`${F}/loungeDesignChair.glb`}
          position={[-15.8, 0, 5.4]}
          rotation={0.65}
          scale={2.15}
        />
        <KenneyModel
          url={`${F}/loungeDesignChair.glb`}
          position={[-13.2, 0, 5.6]}
          rotation={-0.65}
          scale={2.15}
        />
        <KenneyModel
          url={`${F}/tableCoffeeGlass.glb`}
          position={[-14.5, 0, 6.7]}
          rotation={0}
          scale={2.0}
        />
        <KenneyModel
          url={`${F}/lampRoundFloor.glb`}
          position={[-16.9, 0, 6.8]}
          rotation={0}
          scale={2.15}
        />
        <KenneyModel url={`${F}/pottedPlant.glb`} position={[-17.0, 0, -7.8]} scale={2.5} />
        <KenneyModel url={`${F}/pottedPlant.glb`} position={[-12.2, 0, -7.8]} scale={2.3} />
        <KenneyModel url={`${F}/plantSmall2.glb`} position={[-12.2, 0, 7.6]} scale={2.4} />
      </group>

      {/* ==================== ZONE 2: 6 CONTENT SPECIALIST WORKSTATIONS ==================== */}
      {contentTeam.map((emp) => (
        <group key={emp.id}>
          <KenneyModel
            url={`${F}/desk.glb`}
            position={emp.deskPos}
            rotation={0}
            scale={2.1}
          />
          <KenneyModel
            url={`${F}/chairDesk.glb`}
            position={emp.chairPos}
            rotation={emp.deskFacing}
            scale={2.0}
          />
          <KenneyModel
            url={`${F}/computerScreen.glb`}
            position={[emp.deskPos[0] - 0.12, 0.8, emp.deskPos[2] - 0.2]}
            rotation={0}
            scale={1.85}
          />
          <KenneyModel
            url={`${F}/computerKeyboard.glb`}
            position={[emp.deskPos[0] - 0.12, 0.8, emp.deskPos[2] + 0.14]}
            rotation={0}
            scale={1.75}
          />
          <KenneyModel
            url={`${F}/computerMouse.glb`}
            position={[emp.deskPos[0] + 0.28, 0.8, emp.deskPos[2] + 0.14]}
            rotation={0}
            scale={1.75}
          />
          <KenneyModel
            url={`${F}/lampRoundTable.glb`}
            position={[emp.deskPos[0] + 0.54, 0.8, emp.deskPos[2] - 0.18]}
            rotation={0}
            scale={1.45}
          />
          <mesh position={[emp.deskPos[0], 0.81, emp.deskPos[2] - 0.42]}>
            <boxGeometry args={[0.78, 0.03, 0.04]} />
            <meshStandardMaterial
              color={emp.accent}
              emissive={emp.accent}
              emissiveIntensity={0.85}
            />
          </mesh>
        </group>
      ))}

      {/* Lemari Kerja / Filing Cabinets tucked cleanly along the Content Studio West glass edge */}
      <KenneyModel
        url={`${F}/bookcaseClosedWide.glb`}
        position={[-10.62, 0, -6.4]}
        rotation={Math.PI / 2}
        scale={2.15}
      />
      <KenneyModel
        url={`${F}/bookcaseOpen.glb`}
        position={[-10.62, 0, -3.9]}
        rotation={Math.PI / 2}
        scale={2.15}
      />
      <KenneyModel
        url={`${F}/bookcaseClosedDoors.glb`}
        position={[-10.62, 0, -1.6]}
        rotation={Math.PI / 2}
        scale={2.15}
      />

      {/* ==================== ZONE 3: OWNER ASSISTANT STATION IN OWNER GLASS CORNER (MAYA) ==================== */}
      <group>
        <KenneyModel
          url={`${F}/desk.glb`}
          position={[1.35, 0, -7.05]}
          rotation={Math.PI}
          scale={2.15}
        />
        <KenneyModel
          url={`${F}/chairModernFrameCushion.glb`}
          position={[1.35, 0, -7.95]}
          rotation={0}
          scale={2.1}
        />
        <KenneyModel
          url={`${F}/computerScreen.glb`}
          position={[1.15, 0.83, -6.82]}
          rotation={Math.PI}
          scale={1.85}
        />
        <KenneyModel
          url={`${F}/laptop.glb`}
          position={[1.72, 0.83, -7.12]}
          rotation={Math.PI - 0.35}
          scale={0.82}
        />
        <KenneyModel
          url={`${F}/lampRoundTable.glb`}
          position={[0.68, 0.83, -6.82]}
          rotation={Math.PI}
          scale={1.5}
        />
        <KenneyModel
          url={`${F}/bookcaseOpen.glb`}
          position={[2.52, 0, -7.95]}
          rotation={-Math.PI / 2}
          scale={2.0}
        />
        <KenneyModel
          url={`${F}/plantSmall1.glb`}
          position={[2.5, 0, -6.35]}
          scale={2.3}
        />
        <group position={[1.35, 0.91, -6.5]} rotation={[0, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.15, 0.06]} />
            <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.66, 0.135]} />
            <meshStandardMaterial map={textures.assistantSign} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ==================== ZONE 4: COZY LOUNGE & 75" SMART TV ==================== */}
      <mesh castShadow receiveShadow position={[-6.4, 1.35, 2.75]}>
        <boxGeometry args={[5.4, 2.7, 0.2]} />
        <meshStandardMaterial color="#1d3557" roughness={0.72} />
      </mesh>
      {[-2.5, 2.5].map((dx) => (
        <mesh key={dx} position={[-6.4 + dx, 1.35, 2.86]}>
          <boxGeometry args={[0.14, 2.6, 0.04]} />
          <meshStandardMaterial color="#e07a5f" emissive="#e07a5f" emissiveIntensity={0.35} />
        </mesh>
      ))}
      <KenneyModel
        url={`${F}/cabinetTelevisionDoors.glb`}
        position={[-6.4, 0, 3.22]}
        rotation={0}
        scale={2.4}
      />
      <KenneyModel
        url={`${F}/televisionModern.glb`}
        position={[-6.4, 0.78, 3.18]}
        rotation={0}
        scale={3.3}
      />
      <mesh position={[-6.4, 1.58, 3.43]}>
        <planeGeometry args={[2.12, 1.2]} />
        <meshStandardMaterial
          map={textures.tvDashboard}
          emissiveMap={textures.tvDashboard}
          emissive="#ffffff"
          emissiveIntensity={0.85}
          roughness={0.18}
        />
      </mesh>
      {/* Platform Posters on the North face of the Lounge TV divider facing the Content Team! */}
      {[
        { x: -8.1, tex: textures.posterThreads },
        { x: -6.4, tex: textures.posterIG },
        { x: -4.7, tex: textures.posterTikTok },
      ].map((p, i) => (
        <group key={i} position={[p.x, 1.5, 2.62]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.05, 1.28, 0.04]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.024]}>
            <planeGeometry args={[0.96, 1.18]} />
            <meshStandardMaterial map={p.tex} roughness={0.35} />
          </mesh>
        </group>
      ))}
      <KenneyModel url={`${F}/speaker.glb`} position={[-8.35, 0, 3.22]} rotation={0.22} scale={2.0} />
      <KenneyModel url={`${F}/speaker.glb`} position={[-4.45, 0, 3.22]} rotation={-0.22} scale={2.0} />

      <KenneyModel
        url={`${F}/loungeDesignSofa.glb`}
        position={[-6.4, 0, 7.05]}
        rotation={Math.PI}
        scale={2.55}
      />
      <KenneyModel
        url={`${F}/loungeDesignChair.glb`}
        position={[-9.35, 0, 5.4]}
        rotation={1.15}
        scale={2.25}
      />
      <KenneyModel
        url={`${F}/loungeDesignChair.glb`}
        position={[-3.35, 0, 5.3]}
        rotation={-1.15}
        scale={2.25}
      />
      <KenneyModel
        url={`${F}/tableCoffeeGlass.glb`}
        position={[-6.4, 0, 5.3]}
        rotation={0}
        scale={2.35}
      />
      <KenneyModel
        url={`${F}/lampRoundFloor.glb`}
        position={[-9.5, 0, 7.2]}
        rotation={0}
        scale={2.15}
      />

      {/* ==================== ZONE 5: LOBBY & RECEPTION ==================== */}
      <WoodSlatWall
        position={[6.8, 0, 4.05]}
        rotation={0}
        width={7.4}
        height={3.25}
        signTexture={textures.lobbySign}
      />
      <KenneyModel url={`${F}/kitchenBar.glb`} position={[4.85, 0, 6.25]} rotation={0} scale={2.35} />
      <KenneyModel url={`${F}/kitchenBar.glb`} position={[5.85, 0, 6.25]} rotation={0} scale={2.35} />
      <KenneyModel url={`${F}/kitchenBar.glb`} position={[6.85, 0, 6.25]} rotation={0} scale={2.35} />
      <KenneyModel
        url={`${F}/laptop.glb`}
        position={[5.95, 0.98, 6.22]}
        rotation={Math.PI}
        scale={0.9}
      />
      <KenneyModel
        url={`${F}/benchCushion.glb`}
        position={[9.25, 0, 6.8]}
        rotation={-0.65}
        scale={2.45}
      />
      <KenneyModel
        url={`${F}/benchCushion.glb`}
        position={[2.55, 0, 7.65]}
        rotation={0.5}
        scale={2.35}
      />
      <KenneyModel
        url={`${F}/coatRackStanding.glb`}
        position={[10.85, 0, 4.9]}
        rotation={0}
        scale={2.15}
      />

      {/* ==================== ZONE 6: OPEN AIRY PANTRY & COFFEE BAR (NO OBSTRUCTION!) ==================== */}
      <KenneyModel
        url={`${F}/kitchenCabinet.glb`}
        position={[11.3, 0, 2.3]}
        rotation={-Math.PI / 2}
        scale={2.2}
      />
      <KenneyModel
        url={`${F}/kitchenCabinetDrawer.glb`}
        position={[11.3, 0, 1.3]}
        rotation={-Math.PI / 2}
        scale={2.2}
      />
      <KenneyModel
        url={`${F}/kitchenSink.glb`}
        position={[11.3, 0, 0.3]}
        rotation={-Math.PI / 2}
        scale={2.2}
      />
      <KenneyModel
        url={`${F}/kitchenCabinetUpperDouble.glb`}
        position={[11.45, 1.85, 1.4]}
        rotation={-Math.PI / 2}
        scale={2.2}
      />
      <KenneyModel
        url={`${F}/kitchenCoffeeMachine.glb`}
        position={[11.2, 0.99, 1.35]}
        rotation={-Math.PI / 2}
        scale={1.9}
      />
      <KenneyModel
        url={`${F}/kitchenFridgeSmall.glb`}
        position={[11.35, 0, -0.55]}
        rotation={-Math.PI / 2}
        scale={1.95}
      />
      <KenneyModel url={`${F}/stoolBar.glb`} position={[9.0, 0, 2.25]} rotation={0} scale={2.0} />
      <KenneyModel url={`${F}/stoolBar.glb`} position={[9.0, 0, 0.95]} rotation={0} scale={2.0} />

      {/* ==================== ZONE 7: SPACIOUS OWNER EXECUTIVE GLASS SUITE ==================== */}
      <GlassPartition position={[3.0, 1.7, -6.5]} size={[5.0, 3.4]} rotation={Math.PI / 2} />
      <GlassDoor
        hingePosition={[3.0, 0, -4.0]}
        rotation={-Math.PI / 2}
        width={1.22}
        height={2.35}
        transomHeight={1.05}
        avatarPositionsRef={avatarPositionsRef}
      />
      <GlassPartition position={[3.0, 1.7, -1.99]} size={[1.58, 3.4]} rotation={Math.PI / 2} />
      <GlassPartition position={[7.45, 1.7, -1.2]} size={[8.9, 3.4]} rotation={0} />

      <KenneyModel
        url={`${F}/desk.glb`}
        position={[8.9, 0, -5.85]}
        rotation={-Math.PI / 2}
        scale={2.3}
      />
      <KenneyModel
        url={`${F}/desk.glb`}
        position={[8.9, 0, -4.15]}
        rotation={-Math.PI / 2}
        scale={2.3}
      />
      <KenneyModel
        url={`${F}/computerScreen.glb`}
        position={[8.75, 0.87, -6.05]}
        rotation={Math.PI / 2 - 0.35}
        scale={2.05}
      />
      <KenneyModel
        url={`${F}/laptop.glb`}
        position={[8.82, 0.87, -4.05]}
        rotation={Math.PI / 2 + 0.35}
        scale={0.9}
      />
      <KenneyModel
        url={`${F}/lampRoundTable.glb`}
        position={[8.55, 0.87, -3.55]}
        rotation={0}
        scale={1.65}
      />
      <group position={[8.38, 0.92, -5.0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.52, 0.12, 0.06]} />
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.005, 0.032]}>
          <planeGeometry args={[0.48, 0.105]} />
          <meshStandardMaterial map={textures.ownerNameplate} roughness={0.3} />
        </mesh>
      </group>

      <KenneyModel
        url={`${F}/chairModernCushion.glb`}
        position={[10.1, 0, -5.0]}
        rotation={-Math.PI / 2}
        scale={2.25}
      />

      {OWNER_VISITOR_CHAIRS.map((chair) => (
        <group key={chair.id}>
          <KenneyModel
            url={`${F}/chairModernFrameCushion.glb`}
            position={chair.position}
            rotation={chair.rotation}
            scale={2.25}
          />
          {chair.accent && (
            <mesh position={[chair.position[0] - 0.2, 1.04, chair.position[2]]}>
              <boxGeometry args={[0.04, 0.03, 0.3]} />
              <meshStandardMaterial
                color={chair.accent}
                emissive={chair.accent}
                emissiveIntensity={0.85}
              />
            </mesh>
          )}
        </group>
      ))}

      {!isIsometric && (
        <WhiteboardPanel
          position={[11.82, 1.75, -5.0]}
          rotation={-Math.PI / 2}
          texture={textures.whiteboard}
        />
      )}
      <KenneyModel
        url={`${F}/bookcaseClosedWide.glb`}
        position={[11.45, 0, -7.45]}
        rotation={-Math.PI / 2}
        scale={2.25}
      />

      {/* ==================== LUSH BIOPHILIC INDOOR PLANTS ==================== */}
      <KenneyModel url={`${F}/pottedPlant.glb`} position={[-10.4, 0, 7.8]} scale={2.6} />
      <KenneyModel url={`${F}/plantSmall1.glb`} position={[-1.9, 0, 7.9]} scale={2.5} />
      <KenneyModel url={`${F}/pottedPlant.glb`} position={[1.7, 0, 8.0]} scale={2.5} />
      <KenneyModel url={`${F}/plantSmall2.glb`} position={[11.1, 0, 7.8]} scale={2.4} />
      <KenneyModel url={`${F}/pottedPlant.glb`} position={[3.8, 0, -8.1]} scale={2.5} />
      <KenneyModel url={`${F}/plantSmall1.glb`} position={[11.0, 0, -2.0]} scale={2.4} />
      <KenneyModel url={`${F}/pottedPlant.glb`} position={[-10.3, 0, -8.1]} scale={2.4} />
      <KenneyModel url={`${F}/plantSmall2.glb`} position={[5.6, 0, 3.2]} scale={2.4} />

      {/* ==================== HOVER-ONLY OVERHEAD ROOM TITLES & CLICK-TO-FOCUS ==================== */}
      {ROOM_ZONES.map((zone) => {
        const hovered = hoveredRoom === zone.id;
        return (
          <group key={zone.id}>
            {/* Pure invisible raycast target (NEVER writes pixels or depth until hovered!) */}
            <mesh
              position={[zone.center[0], 0.04, zone.center[1]]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onFocusRoom(zone.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredRoom(zone.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHoveredRoom((prev) => (prev === zone.id ? null : prev));
                document.body.style.cursor = "auto";
              }}
            >
              <planeGeometry args={zone.size} />
              <meshBasicMaterial
                color={zone.accent}
                transparent
                opacity={isIsometric && hovered ? 0.14 : 0}
                colorWrite={isIsometric && hovered}
                depthWrite={false}
              />
            </mesh>

            {isIsometric && hovered && (
              <Html
                position={zone.topBadgePos}
                center
                distanceFactor={19}
                zIndexRange={[30, 0]}
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border bg-slate-950/90 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white shadow-2xl backdrop-blur-md select-none"
                  style={{ borderColor: `${zone.accent}aa` }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: zone.accent }}
                  />
                  <span>{language === "id" ? zone.labelId : zone.labelEn}</span>
                  <span className="text-[10px] font-normal text-slate-300">
                    · {language === "id" ? "Klik untuk masuk" : "Click to focus"}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* ==================== ALL 7 AI EMPLOYEES ==================== */}
      {EMPLOYEES.map((emp) => (
        <EmployeeAvatar
          key={emp.id}
          employee={emp}
          targetStation={employeeCommands[emp.id].station}
          commandSeq={employeeCommands[emp.id].seq}
          autoRoutine={autoRoutine}
          greetSignal={greetSignals[emp.id]}
          customBubble={customBubbles[emp.id]}
          isSelected={selectedEmployeeId === emp.id}
          language={language}
          onSelect={() => onSelectEmployee(emp.id)}
          onStateChange={onEmployeeStateChange}
          avatarPositionsRef={avatarPositionsRef}
        />
      ))}
    </>
  );
}
