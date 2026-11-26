"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import {
  AUTO_ROUTINE_ORDER,
  EmployeeConfig,
  StationId,
  Vec3,
  buildWalkPath,
  getEmployeeStation,
} from "@/lib/officeLayout";

type Props = {
  employee: EmployeeConfig;
  targetStation: StationId;
  commandSeq: number;
  autoRoutine: boolean;
  greetSignal: number;
  customBubble?: { text: string; seq: number };
  isSelected: boolean;
  language: "id" | "en";
  onSelect: () => void;
  onStateChange?: (info: {
    id: EmployeeConfig["id"];
    station: StationId;
    moving: boolean;
  }) => void;
  avatarPositionsRef: React.MutableRefObject<Record<string, THREE.Vector3>>;
};

const AVATAR_SCALE = 2.02;

function shortestAngleDelta(from: number, to: number): number {
  let diff = ((to - from + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

export default function EmployeeAvatar({
  employee,
  targetStation,
  commandSeq,
  autoRoutine,
  greetSignal,
  customBubble,
  isSelected,
  language,
  onSelect,
  onStateChange,
  avatarPositionsRef,
}: Props) {
  const { scene, animations } = useGLTF(employee.modelUrl);

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const [greeting, setGreeting] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  const rootRef = useRef<THREE.Group>(null);
  const visualRef = useRef<THREE.Group>(null);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const activeClipRef = useRef<string>("");

  const startResolved = getEmployeeStation(employee, targetStation);
  const currentPos = useRef<THREE.Vector3>(new THREE.Vector3(...startResolved.target));
  const currentYaw = useRef<number>(startResolved.facing);
  const currentStation = useRef<StationId>(targetStation);
  const destStation = useRef<StationId>(targetStation);
  const waypoints = useRef<Vec3[]>([]);
  const phase = useRef<"at_station" | "standing_up" | "walking">("at_station");
  const sitBlend = useRef<number>(
    startResolved.pose === "work" ||
      startResolved.pose === "sit" ||
      startResolved.pose === "update" ||
      startResolved.pose === "meeting"
      ? 1
      : 0,
  );
  const stationTimer = useRef(employee.routineOffsetMs);
  const routineIndex = useRef(0);
  const emoteUntil = useRef(0);
  const bubbleUntil = useRef(0);
  const prevBubbleVisible = useRef(false);
  const lastReportedKey = useRef("");
  const lastCommandSeq = useRef(commandSeq);
  const lastBubbleSeq = useRef(customBubble?.seq ?? 0);
  const pendingBubbleText = useRef<string | null>(null);

  // Setup AnimationMixer & built-in Kenney clips
  useEffect(() => {
    const mixer = new THREE.AnimationMixer(clonedScene);
    const map: Record<string, THREE.AnimationAction> = {};
    for (const clip of animations) {
      map[clip.name] = mixer.clipAction(clip);
    }
    mixerRef.current = mixer;
    actionsRef.current = map;
    activeClipRef.current = "";

    const initialClip = map["sit"] && sitBlend.current > 0.5 ? "sit" : map["idle"] ? "idle" : Object.keys(map)[0];
    if (initialClip && map[initialClip]) {
      map[initialClip].reset().play();
      activeClipRef.current = initialClip;
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(clonedScene);
      mixerRef.current = null;
      actionsRef.current = {};
      activeClipRef.current = "";
    };
  }, [clonedScene, animations]);

  const enqueueWalk = (next: StationId) => {
    if (
      next === destStation.current &&
      (phase.current === "walking" || phase.current === "at_station")
    ) {
      return;
    }
    const from: Vec3 = [currentPos.current.x, 0, currentPos.current.z];
    const path = buildWalkPath(
      employee,
      from,
      phase.current === "at_station" ? currentStation.current : null,
      next,
    );
    destStation.current = next;
    waypoints.current = path;
    stationTimer.current = 0;

    if (sitBlend.current > 0.15) {
      phase.current = "standing_up";
    } else {
      phase.current = "walking";
    }
  };

  // React to explicit manual commands for this employee
  useEffect(() => {
    if (commandSeq === lastCommandSeq.current) return;
    lastCommandSeq.current = commandSeq;
    enqueueWalk(targetStation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandSeq, targetStation]);

  // React to explicit greet signal for this employee
  useEffect(() => {
    if (greetSignal <= 0) return;
    const now = performance.now() / 1000;
    pendingBubbleText.current = null;
    emoteUntil.current = now + 2.8;
    bubbleUntil.current = now + 5.5;
  }, [greetSignal]);

  // React to custom chat reply bubbles triggered from Room Chat
  useEffect(() => {
    if (!customBubble || customBubble.seq === lastBubbleSeq.current) return;
    lastBubbleSeq.current = customBubble.seq;
    const now = performance.now() / 1000;
    pendingBubbleText.current = customBubble.text;
    emoteUntil.current = now + 2.5;
    bubbleUntil.current = now + 7.5;
  }, [customBubble]);

  useFrame((state, rawDelta) => {
    if (!rootRef.current || !visualRef.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const nowSec = performance.now() / 1000;

    const dest = getEmployeeStation(employee, destStation.current);
    const wantsSit =
      dest.pose === "work" ||
      dest.pose === "sit" ||
      dest.pose === "update" ||
      dest.pose === "meeting";

    const bubbleVisible = nowSec < bubbleUntil.current;
    if (bubbleVisible !== prevBubbleVisible.current) {
      prevBubbleVisible.current = bubbleVisible;
      setBubbleText(bubbleVisible ? pendingBubbleText.current : null);
      setGreeting(bubbleVisible);
    } else if (bubbleVisible && pendingBubbleText.current !== null && pendingBubbleText.current !== bubbleText) {
      setBubbleText(pendingBubbleText.current);
    }

    // --- 1. AUTONOMOUS STAGGERED OFFICE ROUTINE ---
    if (autoRoutine && phase.current === "at_station" && destStation.current !== "owner_update") {
      stationTimer.current += delta * 1000;
      const currentRoutine = AUTO_ROUTINE_ORDER[routineIndex.current];
      const holdDuration = currentRoutine?.durationMs ?? 18000;
      if (stationTimer.current >= holdDuration) {
        routineIndex.current = (routineIndex.current + 1) % AUTO_ROUTINE_ORDER.length;
        const nextSt = AUTO_ROUTINE_ORDER[routineIndex.current].station;
        enqueueWalk(nextSt);
      }
    }

    // --- 2. MOVEMENT & SIT/STAND STATE MACHINE ---
    const WALK_SPEED = 1.65;

    if (phase.current === "standing_up") {
      sitBlend.current = THREE.MathUtils.lerp(sitBlend.current, 0, 1 - Math.exp(-8 * delta));
      if (sitBlend.current < 0.08) {
        sitBlend.current = 0;
        phase.current = "walking";
      }
    } else if (phase.current === "walking") {
      sitBlend.current = THREE.MathUtils.lerp(sitBlend.current, 0, 1 - Math.exp(-9 * delta));
      const nextWp = waypoints.current[0];
      if (!nextWp) {
        phase.current = "at_station";
        currentStation.current = destStation.current;
        stationTimer.current = 0;
      } else {
        const dx = nextWp[0] - currentPos.current.x;
        const dz = nextWp[2] - currentPos.current.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.08) {
          currentPos.current.set(nextWp[0], 0, nextWp[2]);
          waypoints.current.shift();
          if (waypoints.current.length === 0) {
            phase.current = "at_station";
            currentStation.current = destStation.current;
            stationTimer.current = 0;
            if (destStation.current === "owner_update") {
              emoteUntil.current = nowSec + 2.4;
              bubbleUntil.current = nowSec + 8.5;
            }
          }
        } else {
          const step = Math.min(dist, WALK_SPEED * delta);
          currentPos.current.x += (dx / dist) * step;
          currentPos.current.z += (dz / dist) * step;

          const desiredYaw = Math.atan2(dx, dz);
          currentYaw.current +=
            shortestAngleDelta(currentYaw.current, desiredYaw) *
            (1 - Math.exp(-10 * delta));
        }
      }
    } else {
      const yawErr = shortestAngleDelta(currentYaw.current, dest.facing);
      currentYaw.current += yawErr * (1 - Math.exp(-8 * delta));

      if (wantsSit && Math.abs(yawErr) < 0.4) {
        sitBlend.current = THREE.MathUtils.lerp(sitBlend.current, 1, 1 - Math.exp(-6.5 * delta));
      } else if (!wantsSit) {
        sitBlend.current = THREE.MathUtils.lerp(sitBlend.current, 0, 1 - Math.exp(-7.5 * delta));
      }
    }

    // Apply world transform & publish live position for Follow camera & GlassDoor
    rootRef.current.position.copy(currentPos.current);
    rootRef.current.rotation.y = currentYaw.current;
    if (!avatarPositionsRef.current[employee.id]) {
      avatarPositionsRef.current[employee.id] = currentPos.current.clone();
    } else {
      avatarPositionsRef.current[employee.id].copy(currentPos.current);
    }

    const seatLift = (dest.seatHeight ?? 0.42) * 0.48;
    visualRef.current.position.y = THREE.MathUtils.lerp(0, seatLift, sitBlend.current);

    if (phase.current === "at_station" && dest.pose === "work" && sitBlend.current > 0.7) {
      visualRef.current.rotation.x = THREE.MathUtils.lerp(
        visualRef.current.rotation.x,
        0.08 + Math.sin(t * 7 + employee.routineOffsetMs) * 0.015,
        1 - Math.exp(-8 * delta),
      );
    } else if (phase.current === "at_station" && dest.pose === "update" && sitBlend.current > 0.7) {
      visualRef.current.rotation.x = THREE.MathUtils.lerp(
        visualRef.current.rotation.x,
        0.05 + Math.sin(t * 3.2) * 0.025,
        1 - Math.exp(-8 * delta),
      );
    } else {
      visualRef.current.rotation.x = THREE.MathUtils.lerp(
        visualRef.current.rotation.x,
        0,
        1 - Math.exp(-8 * delta),
      );
    }

    // Notify parent only on state transitions
    const moving = phase.current !== "at_station";
    const stateKey = `${destStation.current}:${moving}`;
    if (stateKey !== lastReportedKey.current) {
      lastReportedKey.current = stateKey;
      onStateChange?.({
        id: employee.id,
        station: destStation.current,
        moving,
      });
    }

    // --- 3. CROSSFADE KENNEY BUILT-IN ANIMATIONS ---
    const isWalking = phase.current === "walking";
    const isEmoting = nowSec < emoteUntil.current && !isWalking;

    let desiredClip = "idle";
    if (isWalking) {
      desiredClip = "walk";
    } else if (sitBlend.current > 0.45) {
      desiredClip = "sit";
    } else if (isEmoting) {
      desiredClip = "emote-yes";
    } else if (dest.pose === "pantry" || dest.pose === "cabinet") {
      desiredClip = "interact-right";
    } else {
      desiredClip = "idle";
    }

    const actions = actionsRef.current;
    if (desiredClip !== activeClipRef.current && actions[desiredClip]) {
      const prev = actions[activeClipRef.current];
      const next = actions[desiredClip];
      if (prev) prev.fadeOut(0.2);
      next.reset().fadeIn(0.2).play();
      next.timeScale = desiredClip === "walk" ? 1.25 : 1.0;
      activeClipRef.current = desiredClip;
    }

    mixerRef.current?.update(delta);
  });

  return (
    <group ref={rootRef}>
      {/* Subtle selection ring on floor when selected */}
      {isSelected && (
        <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.48, 28]} />
          <meshStandardMaterial
            color={employee.accent}
            emissive={employee.accent}
            emissiveIntensity={1.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <group
        ref={visualRef}
        scale={AVATAR_SCALE}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
          const now = performance.now() / 1000;
          emoteUntil.current = now + 2.8;
          bubbleUntil.current = now + 5.5;
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <primitive object={clonedScene} />
      </group>

      {/* NAME & ROLE LABEL CLEARLY BELOW THE AVATAR'S FEET */}
      <group position={[0, -0.26, 0]}>
        <Html
          center
          distanceFactor={11}
          zIndexRange={[15, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className={`mt-4 flex flex-col items-center whitespace-nowrap rounded-xl border px-2.5 py-1 text-center shadow-lg backdrop-blur-md select-none ${
              isSelected
                ? "border-emerald-400/75 bg-slate-950/92"
                : "border-white/15 bg-slate-950/78"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: employee.accent }}
              />
              <span className="text-[11px] font-bold leading-none text-white">
                {employee.name}
              </span>
            </div>
            <span className="mt-0.5 text-[9.5px] font-medium leading-none text-slate-300">
              {employee.role}
            </span>
          </div>
        </Html>
      </group>

      {/* SPEECH / CHAT BUBBLE CLEANLY ABOVE HEAD — WIDE HORIZONTAL PROPORTION */}
      {greeting && (
        <group position={[0, 2.15, 0]}>
          <Html
            center
            distanceFactor={11}
            zIndexRange={[25, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div className="relative w-max min-w-[200px] max-w-[360px] rounded-2xl border border-emerald-400/40 bg-slate-950/92 px-4 py-2.5 text-left text-[11.5px] leading-snug text-white shadow-2xl backdrop-blur-md select-none">
              <div className="mb-0.5 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-emerald-300/90">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: employee.accent }}
                />
                <span>{employee.name}</span>
              </div>
              <p className="break-words whitespace-normal">
                {bubbleText ??
                  (language === "id"
                    ? employee.updateSummaryId
                    : employee.updateSummaryEn)}
              </p>
              <div className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-emerald-400/40 bg-slate-950/92" />
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
