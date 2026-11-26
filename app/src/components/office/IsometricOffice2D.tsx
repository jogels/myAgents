"use client";

import { useEffect, useRef, useState } from "react";
import {
  AUTO_ROUTINE_ORDER,
  CameraPresetId,
  EMPLOYEES,
  EmployeeConfig,
  EmployeeId,
  StationId,
} from "@/lib/officeLayout";
import {
  CHAR_SPRITES,
  OWNER_SPRITE_POS,
  Pt2D,
  ROOM_2D_ZONES,
  build2DWalkPath,
  get2DStationTarget,
} from "@/lib/office2DLayout";

type EmployeeCommand = { station: StationId; seq: number };
type BubbleState = { text: string; seq: number };

type Props = {
  cameraPreset: CameraPresetId;
  selectedEmployeeId: EmployeeId;
  employeeCommands: Record<EmployeeId, EmployeeCommand>;
  greetSignals: Record<EmployeeId, number>;
  customBubbles: Record<EmployeeId, BubbleState>;
  autoRoutine: boolean;
  language: "id" | "en";
  onSelectEmployee: (id: EmployeeId) => void;
  onFocusRoom: (room: CameraPresetId) => void;
  onEmployeeStateChange: (info: {
    id: EmployeeId;
    station: StationId;
    moving: boolean;
  }) => void;
};

type AgentRuntime = {
  pos: Pt2D;
  facingLeft: boolean;
  currentStation: StationId;
  destStation: StationId;
  waypoints: Pt2D[];
  moving: boolean;
  walkPhase: number;
  timerMs: number;
  routineIdx: number;
  bubbleUntil: number;
  bubbleDurationPending: number;
  bubbleText: string | null;
  lastCommandSeq: number;
  lastGreetSeq: number;
  lastBubbleSeq: number;
  lastReportedKey: string;
};

type AgentSnapshot = {
  id: EmployeeId;
  pos: Pt2D;
  facingLeft: boolean;
  moving: boolean;
  walkPhase: number;
  bubble: string | null;
};

const BG_RATIO = 1376 / 768;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function createInitialRuntimes(): Record<EmployeeId, AgentRuntime> {
  const result = {} as Record<EmployeeId, AgentRuntime>;
  for (const emp of EMPLOYEES) {
    const spot = get2DStationTarget(emp.id, "desk");
    result[emp.id] = {
      pos: { x: spot.x, y: spot.y },
      facingLeft: spot.facingLeft,
      currentStation: "desk",
      destStation: "desk",
      waypoints: [],
      moving: false,
      walkPhase: 0,
      timerMs: emp.routineOffsetMs,
      routineIdx: 0,
      bubbleUntil: 0,
      bubbleDurationPending: 0,
      bubbleText: null,
      lastCommandSeq: 0,
      lastGreetSeq: 0,
      lastBubbleSeq: 0,
      lastReportedKey: "desk:false",
    };
  }
  return result;
}

function createInitialSnapshots(): AgentSnapshot[] {
  return EMPLOYEES.map((emp) => {
    const spot = get2DStationTarget(emp.id, "desk");
    return {
      id: emp.id,
      pos: { x: spot.x, y: spot.y },
      facingLeft: spot.facingLeft,
      moving: false,
      walkPhase: 0,
      bubble: null,
    };
  });
}

export default function IsometricOffice2D({
  cameraPreset,
  selectedEmployeeId,
  employeeCommands,
  greetSignals,
  customBubbles,
  autoRoutine,
  language,
  onSelectEmployee,
  onFocusRoom,
  onEmployeeStateChange,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [hoveredRoom, setHoveredRoom] = useState<CameraPresetId | null>(null);
  const [ownerSpeaking, setOwnerSpeaking] = useState(false);
  const [snapshots, setSnapshots] = useState<AgentSnapshot[]>(createInitialSnapshots);

  const camCurrent = useRef({ zoom: 1, tx: 0, ty: 0 });
  const camTarget = useRef({ zoom: 1, tx: 0, ty: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0, moved: false });
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

  const runtimesRef = useRef<Record<EmployeeId, AgentRuntime>>(createInitialRuntimes());

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ w: rect.width, h: rect.height });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Prevent browser page scroll/zoom while scrolling over the office canvas
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const nextZoom = clamp(
        camTarget.current.zoom * (e.deltaY > 0 ? 0.9 : 1.12),
        0.95,
        3.0,
      );
      const ratio = nextZoom / camTarget.current.zoom;
      camTarget.current.zoom = nextZoom;
      if (nextZoom <= 1.02) {
        camTarget.current.tx = 0;
        camTarget.current.ty = 0;
      } else {
        camTarget.current.tx *= ratio;
        camTarget.current.ty *= ratio;
      }
    };
    el.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => el.removeEventListener("wheel", onNativeWheel);
  }, []);

  const stageW =
    viewportSize.w > 0 && viewportSize.h > 0
      ? viewportSize.w / viewportSize.h > BG_RATIO
        ? viewportSize.h * BG_RATIO
        : viewportSize.w
      : 0;
  const stageH = stageW > 0 ? stageW / BG_RATIO : 0;

  const propsRef = useRef({
    cameraPreset,
    selectedEmployeeId,
    employeeCommands,
    greetSignals,
    customBubbles,
    autoRoutine,
    language,
    onEmployeeStateChange,
    stageW,
    stageH,
  });

  useEffect(() => {
    propsRef.current = {
      cameraPreset,
      selectedEmployeeId,
      employeeCommands,
      greetSignals,
      customBubbles,
      autoRoutine,
      language,
      onEmployeeStateChange,
      stageW,
      stageH,
    };
  });

  useEffect(() => {
    if (cameraPreset === "isometric") {
      camTarget.current = { zoom: 1, tx: 0, ty: 0 };
      return;
    }
    if (cameraPreset === "follow") return;

    const room = ROOM_2D_ZONES.find((r) => r.id === cameraPreset);
    if (!room) return;
    const z = room.zoom;
    const dx = (50 - room.focus.x) / 100;
    const dy = (50 - room.focus.y) / 100;
    camTarget.current = {
      zoom: z,
      tx: dx * stageW * z,
      ty: dy * stageH * z,
    };
  }, [cameraPreset, stageW, stageH]);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const nowSec = now / 1000;
      const p = propsRef.current;
      const runtimes = runtimesRef.current;

      const nextSnapshots: AgentSnapshot[] = [];

      for (const emp of EMPLOYEES) {
        const rt = runtimes[emp.id];
        const cmd = p.employeeCommands[emp.id];
        const greet = p.greetSignals[emp.id];
        const customB = p.customBubbles[emp.id];

        if (cmd && cmd.seq !== rt.lastCommandSeq) {
          rt.lastCommandSeq = cmd.seq;
          const path = build2DWalkPath(
            emp.id,
            rt.pos,
            rt.moving ? null : rt.currentStation,
            cmd.station,
          );
          rt.destStation = cmd.station;
          rt.waypoints = path;
          rt.moving = path.length > 0;
          rt.timerMs = 0;
        }

        if (rt.bubbleDurationPending > 0) {
          rt.bubbleUntil = nowSec + rt.bubbleDurationPending;
          rt.bubbleDurationPending = 0;
        }

        if (greet && greet !== rt.lastGreetSeq) {
          rt.lastGreetSeq = greet;
          rt.bubbleText = null;
          rt.bubbleUntil = nowSec + 5.5;
        }

        if (customB && customB.seq !== rt.lastBubbleSeq) {
          rt.lastBubbleSeq = customB.seq;
          rt.bubbleText = customB.text;
          rt.bubbleUntil = nowSec + 7.5;
        }

        if (p.autoRoutine && !rt.moving && rt.destStation !== "owner_update") {
          rt.timerMs += dt * 1000;
          const curStep = AUTO_ROUTINE_ORDER[rt.routineIdx];
          const hold = curStep?.durationMs ?? 20000;
          if (rt.timerMs >= hold) {
            rt.routineIdx = (rt.routineIdx + 1) % AUTO_ROUTINE_ORDER.length;
            const nextSt = AUTO_ROUTINE_ORDER[rt.routineIdx].station;
            const path = build2DWalkPath(emp.id, rt.pos, rt.currentStation, nextSt);
            rt.destStation = nextSt;
            rt.waypoints = path;
            rt.moving = path.length > 0;
            rt.timerMs = 0;
          }
        }

        const SPEED = 9.2;
        if (rt.moving && rt.waypoints.length > 0) {
          const wp = rt.waypoints[0];
          const dx = wp.x - rt.pos.x;
          const dy = wp.y - rt.pos.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 0.45) {
            rt.pos.x = wp.x;
            rt.pos.y = wp.y;
            rt.waypoints.shift();
            if (rt.waypoints.length === 0) {
              rt.moving = false;
              rt.currentStation = rt.destStation;
              rt.facingLeft = get2DStationTarget(emp.id, rt.destStation).facingLeft;
              rt.timerMs = 0;
              if (rt.destStation === "owner_update") {
                rt.bubbleText = null;
                rt.bubbleUntil = nowSec + 8.5;
              }
            }
          } else {
            const move = Math.min(dist, SPEED * dt);
            rt.pos.x += (dx / dist) * move;
            rt.pos.y += (dy / dist) * move;
            rt.walkPhase += move * 1.15;
            if (Math.abs(dx) > 0.1) {
              rt.facingLeft = dx < 0;
            }
          }
        } else {
          rt.moving = false;
        }

        const key = `${rt.destStation}:${rt.moving}`;
        if (key !== rt.lastReportedKey) {
          rt.lastReportedKey = key;
          p.onEmployeeStateChange({
            id: emp.id,
            station: rt.destStation,
            moving: rt.moving,
          });
        }

        const showBubble = nowSec < rt.bubbleUntil;
        nextSnapshots.push({
          id: emp.id,
          pos: { x: rt.pos.x, y: rt.pos.y },
          facingLeft: rt.facingLeft,
          moving: rt.moving,
          walkPhase: rt.walkPhase,
          bubble: showBubble
            ? (rt.bubbleText ??
              (p.language === "id" ? emp.updateSummaryId : emp.updateSummaryEn))
            : null,
        });
      }

      if (p.cameraPreset === "follow") {
        const targetRt = runtimes[p.selectedEmployeeId];
        if (targetRt) {
          const z = 2.35;
          camTarget.current = {
            zoom: z,
            tx: ((50 - targetRt.pos.x) / 100) * p.stageW * z,
            ty: ((50 - targetRt.pos.y) / 100) * p.stageH * z,
          };
        }
      }

      const alpha = 1 - Math.exp(-7.5 * dt);
      camCurrent.current.zoom += (camTarget.current.zoom - camCurrent.current.zoom) * alpha;
      camCurrent.current.tx += (camTarget.current.tx - camCurrent.current.tx) * alpha;
      camCurrent.current.ty += (camTarget.current.ty - camCurrent.current.ty) * alpha;

      if (stageRef.current) {
        const { zoom, tx, ty } = camCurrent.current;
        stageRef.current.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${zoom.toFixed(4)})`;
      }

      frameCount++;
      if (frameCount % 2 === 0) {
        setSnapshots(nextSnapshots);
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button,[data-interactive='true']")) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      tx: camTarget.current.tx,
      ty: camTarget.current.ty,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.hypot(dx, dy) > 4) dragStart.current.moved = true;
    const maxPanX = stageW * camTarget.current.zoom * 0.45;
    const maxPanY = stageH * camTarget.current.zoom * 0.45;
    camTarget.current.tx = clamp(dragStart.current.tx + dx, -maxPanX, maxPanX);
    camTarget.current.ty = clamp(dragStart.current.ty + dy, -maxPanY, maxPanY);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleClickEmployee = (empId: EmployeeId) => {
    onSelectEmployee(empId);
    const rt = runtimesRef.current[empId];
    rt.bubbleText = null;
    rt.bubbleDurationPending = 5.5;
  };

  type RenderSprite = {
    key: string;
    isOwner: boolean;
    emp?: EmployeeConfig;
    pos: Pt2D;
    facingLeft: boolean;
    moving: boolean;
    walkPhase: number;
    spriteUrl: string;
    name: string;
    shortRole: string;
    accent: string;
    isSelected: boolean;
    bubble: string | null;
  };

  const snapMap = Object.fromEntries(snapshots.map((s) => [s.id, s])) as Record<
    EmployeeId,
    AgentSnapshot
  >;

  const sprites: RenderSprite[] = [
    {
      key: "owner",
      isOwner: true,
      pos: OWNER_SPRITE_POS,
      facingLeft: true,
      moving: false,
      walkPhase: 0,
      spriteUrl: CHAR_SPRITES.owner,
      name: "Owner",
      shortRole: "Founder",
      accent: "#fbbf24",
      isSelected: false,
      bubble: ownerSpeaking
        ? language === "id"
          ? "Tim Marketing, gimana progress konten hari ini?"
          : "Marketing team, how's today's content progress?"
        : null,
    },
    ...EMPLOYEES.map((emp) => {
      const s = snapMap[emp.id];
      return {
        key: emp.id,
        isOwner: false,
        emp,
        pos: s.pos,
        facingLeft: s.facingLeft,
        moving: s.moving,
        walkPhase: s.walkPhase,
        spriteUrl: CHAR_SPRITES[emp.id],
        name: emp.name,
        shortRole: emp.role.replace(" Specialist", ""),
        accent: emp.accent,
        isSelected: selectedEmployeeId === emp.id,
        bubble: s.bubble,
      };
    }),
  ].sort((a, b) => a.pos.y - b.pos.y);

  const isOverview = cameraPreset === "isometric";

  return (
    <div
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="absolute inset-0 flex cursor-grab items-center justify-center overflow-hidden bg-[#26323d] overscroll-none touch-none active:cursor-grabbing select-none"
    >
      {stageW > 0 && stageH > 0 && (
        <div
          ref={stageRef}
          style={{
            width: `${stageW}px`,
            height: `${stageH}px`,
            willChange: "transform",
          }}
          className="relative shrink-0 origin-center"
        >
        {/* High-Resolution 2D Hand-Drawn Isometric Office Illustration */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/art/office_iso_bg.jpg"
          alt="MyAgents HQ 2D Hand-Drawn Isometric Office"
          draggable={false}
          className="pointer-events-none h-full w-full object-contain select-none"
        />

        {/* Subtle warm ambient lamp glow overlays */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 83% 36%, rgba(255,190,85,0.14) 0%, transparent 18%), radial-gradient(circle at 34% 69%, rgba(255,185,80,0.12) 0%, transparent 16%), radial-gradient(circle at 90% 62%, rgba(255,178,75,0.12) 0%, transparent 15%)",
          }}
        />

        {/* Click-to-Focus Room Polygons (Hover-only overhead room titles!) */}
        {isOverview && (
          <div className="absolute inset-0 z-10">
            {ROOM_2D_ZONES.map((zone) => {
              const hovered = hoveredRoom === zone.id;
              return (
                <div key={zone.id}>
                  <div
                    onMouseEnter={() => setHoveredRoom(zone.id)}
                    onMouseLeave={() =>
                      setHoveredRoom((prev) => (prev === zone.id ? null : prev))
                    }
                    onClick={() => {
                      if (!dragStart.current.moved) {
                        onFocusRoom(zone.id);
                      }
                    }}
                    style={{
                      clipPath: `polygon(${zone.polygon})`,
                      backgroundColor: hovered ? `${zone.accent}24` : "transparent",
                    }}
                    className="absolute inset-0 cursor-pointer transition-colors duration-200"
                  />

                  {hovered && (
                    <div
                      style={{
                        left: `${zone.badgePos.x}%`,
                        top: `${zone.badgePos.y}%`,
                        borderColor: `${zone.accent}cc`,
                      }}
                      className="pointer-events-none absolute z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border-2 bg-slate-950/90 px-3.5 py-1 text-xs font-bold text-white shadow-2xl backdrop-blur-md"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: zone.accent }}
                      />
                      <span>{language === "id" ? zone.labelId : zone.labelEn}</span>
                      <span className="text-[10px] font-normal text-slate-300">
                        · {language === "id" ? "Klik untuk fokus" : "Click to focus"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Depth-Sorted 2D Hand-Drawn Characters + Reference-Style Comic Bubbles & Foot Labels */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {sprites.map((sp, idx) => {
            const walkBounce = sp.moving ? -Math.abs(Math.sin(sp.walkPhase)) * 5 : 0;
            const walkTilt = sp.moving ? Math.sin(sp.walkPhase) * 2.4 : 0;
            const spriteHeightPx = Math.max(44, stageH * 0.115);

            return (
              <div
                key={sp.key}
                style={{
                  left: `${sp.pos.x}%`,
                  top: `${sp.pos.y}%`,
                  zIndex: 20 + idx,
                }}
                className="absolute -translate-x-1/2 -translate-y-full"
              >
                {/* COMIC WHITE SPEECH BUBBLE ABOVE HEAD (wide horizontal proportion) */}
                {sp.bubble && (
                  <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-40 w-max min-w-[140px] max-w-[270px] -translate-x-1/2 rounded-xl border-2 border-slate-900 bg-white px-3 py-1.5 text-left text-[11px] font-bold leading-snug text-slate-900 shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
                    <p className="break-words whitespace-normal">{sp.bubble}</p>
                    <div className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-slate-900 bg-white" />
                  </div>
                )}

                {/* Grounded Realistic Soft Elliptical Shadow under shoes */}
                <div
                  style={{
                    width: `${spriteHeightPx * 0.44}px`,
                    height: `${spriteHeightPx * 0.14}px`,
                  }}
                  className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/45 blur-[2.5px]"
                />

                {sp.isSelected && (
                  <div
                    style={{
                      width: `${spriteHeightPx * 0.56}px`,
                      height: `${spriteHeightPx * 0.22}px`,
                      borderColor: sp.accent,
                      boxShadow: `0 0 12px ${sp.accent}`,
                    }}
                    className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border-2"
                  />
                )}

                {/* Hand-Drawn 2D Isometric Character Sprite */}
                <button
                  type="button"
                  data-interactive="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (sp.isOwner) {
                      setOwnerSpeaking(true);
                      window.setTimeout(() => setOwnerSpeaking(false), 5000);
                    } else if (sp.emp) {
                      handleClickEmployee(sp.emp.id);
                    }
                  }}
                  style={{
                    height: `${spriteHeightPx}px`,
                    transform: `translateY(${walkBounce.toFixed(1)}px) rotate(${walkTilt.toFixed(1)}deg) scaleX(${sp.facingLeft ? -1 : 1})`,
                  }}
                  className="pointer-events-auto relative block cursor-pointer border-0 bg-transparent p-0 transition-transform duration-75 hover:brightness-110"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sp.spriteUrl}
                    alt={`${sp.name} - ${sp.shortRole}`}
                    draggable={false}
                    className="h-full w-auto drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] select-none"
                  />
                </button>

                {/* DARK PILL NAME & ROLE LABEL CLEANLY BELOW FEET */}
                <div className="pointer-events-none absolute left-1/2 top-[calc(100%+4px)] z-30 -translate-x-1/2">
                  <div
                    className={`flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[9.5px] leading-none shadow-md backdrop-blur-sm ${
                      sp.isSelected
                        ? "border-emerald-400/80 bg-slate-950/92 text-white"
                        : "border-white/15 bg-slate-950/82 text-white"
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: sp.accent }}
                    />
                    <span className="font-bold">{sp.name}</span>
                    <span className="text-slate-300">{sp.shortRole}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-slate-950/65 px-2.5 py-1 text-[10px] text-slate-300 backdrop-blur-md">
        {language === "id"
          ? "Scroll untuk zoom · Drag untuk geser · Hover & klik ruangan untuk fokus · Klik avatar untuk menyapa"
          : "Scroll to zoom · Drag to pan · Hover & click room to focus · Click avatar to greet"}
      </div>
    </div>
  );
}
