// Spacious 24m x 18m Colorful Isometric Startup Office Layout, 7-Employee Roster, Meeting Room & Obstacle-Free Routing
// Units = meters. Room footprint: X in [-12, +12] (24m wide), Z in [-9, +9] (18m deep).

export type Vec3 = [number, number, number];

export type StationId =
  | "desk"
  | "owner_update"
  | "meeting"
  | "lounge"
  | "lobby"
  | "pantry"
  | "cabinet";

export type PoseKind = "work" | "sit" | "update" | "meeting" | "stand" | "pantry" | "cabinet";

export type EmployeeId =
  | "assistant"
  | "threads"
  | "instagram"
  | "reddit"
  | "facebook"
  | "tiktok"
  | "youtube";

export type BriefingMetric = {
  labelId: string;
  labelEn: string;
  value: string;
  colorClass: string;
};

export type DivisionId = "Executive" | "Marketing" | "Sales";

export type EmployeeConfig = {
  id: EmployeeId;
  name: string;
  role: string;
  division: DivisionId;
  icon: string;
  accent: string;
  modelUrl: string;
  deskPos: Vec3;
  chairPos: Vec3;
  deskApproach: Vec3;
  deskFacing: number;
  ownerChairIndex: number; // 0..3 inside Owner Suite
  meetingSeatIndex: number; // 0..5 around Meeting Conference Table
  loungeSpot: Vec3;
  lobbySpot: Vec3;
  pantrySpot: Vec3;
  cabinetSpot: Vec3;
  routineOffsetMs: number;
  updateSummaryId: string;
  updateSummaryEn: string;
  proposalId: string;
  proposalEn: string;
  metrics: BriefingMetric[];
};

export type StationMeta = {
  id: StationId;
  labelId: string;
  labelEn: string;
  statusId: string;
  statusEn: string;
  pose: PoseKind;
  seatHeight?: number;
};

export const STATION_META: Record<StationId, StationMeta> = {
  desk: {
    id: "desk",
    labelId: "Meja Kerja",
    labelEn: "Work Desk",
    statusId: "Sedang bekerja di meja",
    statusEn: "Working at desk",
    pose: "work",
    seatHeight: 0.44,
  },
  owner_update: {
    id: "owner_update",
    labelId: "Update ke Owner",
    labelEn: "Report to Owner",
    statusId: "Melaporkan progress di Meja Owner",
    statusEn: "Reporting progress at Owner Desk",
    pose: "update",
    seatHeight: 0.44,
  },
  meeting: {
    id: "meeting",
    labelId: "Ruang Meeting",
    labelEn: "Meeting Room",
    statusId: "Diskusi strategi di Ruang Meeting",
    statusEn: "Strategy meeting in Meeting Room",
    pose: "meeting",
    seatHeight: 0.44,
  },
  lounge: {
    id: "lounge",
    labelId: "Sofa Lounge",
    labelEn: "Lounge Sofa",
    statusId: "Istirahat di Lounge & TV KPI",
    statusEn: "Relaxing at Lounge & KPI TV",
    pose: "sit",
    seatHeight: 0.42,
  },
  lobby: {
    id: "lobby",
    labelId: "Lobby",
    labelEn: "Reception Lobby",
    statusId: "Berada di area Lobby",
    statusEn: "At Reception Lobby",
    pose: "stand",
  },
  pantry: {
    id: "pantry",
    labelId: "Pantry & Kopi",
    labelEn: "Coffee Pantry",
    statusId: "Membuat kopi di Pantry",
    statusEn: "Grabbing coffee at Pantry",
    pose: "pantry",
  },
  cabinet: {
    id: "cabinet",
    labelId: "Lemari Arsip",
    labelEn: "Filing Cabinets",
    statusId: "Cek dokumen di Lemari Kerja",
    statusEn: "Checking files at Cabinets",
    pose: "cabinet",
  },
};

// --- OWNER SUITE VISITOR CHAIRS (4 spacious seats facing +X toward Owner's Desk at X = 8.9) ---
export const OWNER_VISITOR_CHAIRS: {
  id: string;
  label: string;
  position: Vec3;
  rotation: number;
  accent?: string;
}[] = [
  {
    id: "chair-slot-1",
    label: "Main Update Seat",
    position: [6.7, 0, -4.95],
    rotation: Math.PI / 2,
    accent: "#34d399",
  },
  {
    id: "chair-slot-2",
    label: "Update Seat 2",
    position: [6.76, 0, -6.1],
    rotation: Math.PI / 2 - 0.14,
  },
  {
    id: "chair-slot-3",
    label: "Update Seat 3",
    position: [7.05, 0, -7.2],
    rotation: Math.PI / 2 - 0.34,
  },
  {
    id: "chair-slot-4",
    label: "Update Seat 4",
    position: [6.82, 0, -3.2],
    rotation: Math.PI / 2 + 0.22,
  },
];

// --- MEETING ROOM CONFERENCE CHAIRS (Left Wing X: -18..-11.2, table centered at [-14.4, 0, 0.4]) ---
export const MEETING_CHAIRS: { position: Vec3; rotation: number }[] = [
  { position: [-13.3, 0, -1.0], rotation: -Math.PI / 2 }, // East side facing table & West TV (-X)
  { position: [-13.3, 0, 0.4], rotation: -Math.PI / 2 },
  { position: [-13.3, 0, 1.8], rotation: -Math.PI / 2 },
  { position: [-15.5, 0, -1.0], rotation: Math.PI / 2 }, // West side facing table (+X)
  { position: [-15.5, 0, 0.4], rotation: Math.PI / 2 },
  { position: [-15.5, 0, 1.8], rotation: Math.PI / 2 },
];

// --- 7 AI EMPLOYEES: 1 OWNER ASSISTANT (GLASS CORNER NEXT TO OWNER) + 6 CONTENT SPECIALISTS ---
export const EMPLOYEES: EmployeeConfig[] = [
  {
    id: "assistant",
    name: "Maya",
    role: "Owner Assistant",
    division: "Executive",
    icon: "👑",
    accent: "#fbbf24",
    modelUrl: "/models/kenney/characters/character-female-d.glb",
    // Tucked right into the glass corner next to the Owner's West Glass Wall (X=3.0) & Back Window (Z=-9.0), FAR from Pantry!
    deskPos: [1.35, 0, -7.05],
    chairPos: [1.35, 0, -7.95],
    deskApproach: [1.0, 0, -5.6],
    deskFacing: 0, // facing +Z overlooking the corridor & Owner's glass door!
    ownerChairIndex: 0,
    meetingSeatIndex: 4,
    loungeSpot: [-6.4, 0, 6.85],
    lobbySpot: [3.4, 0, 6.5],
    pantrySpot: [9.8, 0, 1.3],
    cabinetSpot: [-10.1, 0, -3.5],
    routineOffsetMs: 5000,
    updateSummaryId:
      "Halo Boss! Seluruh 6 tim Marketing sedang aktif mengerjakan konten. Divisi Sales saat ini masih kosong dan siap ditambahkan kapan saja.",
    updateSummaryEn:
      "Hi Boss! All 6 Marketing content specialists are active. The Sales division is currently empty and ready whenever you want to add agents.",
    proposalId: "Kirim ringkasan jadwal harian & minta seluruh tim Marketing setor 4 draft konten ke meja Owner.",
    proposalEn: "Send daily digest & request all 4 pending content drafts from the Marketing team.",
    metrics: [
      { labelId: "Tim Marketing", labelEn: "Marketing Team", value: "6 Aktif", colorClass: "text-emerald-300" },
      { labelId: "Tim Sales", labelEn: "Sales Team", value: "0 (Kosong)", colorClass: "text-slate-400" },
      { labelId: "Approval Konten", labelEn: "Pending Review", value: "4 Draft", colorClass: "text-sky-300" },
      { labelId: "Prioritas", labelEn: "Top Focus", value: "Threads & IG", colorClass: "text-amber-300" },
    ],
  },
  {
    id: "threads",
    name: "Nadia",
    role: "Threads Specialist",
    division: "Marketing",
    icon: "🧵",
    accent: "#e2e8f0",
    modelUrl: "/models/kenney/characters/character-female-a.glb",
    deskPos: [-8.5, 0, -6.2],
    chairPos: [-8.5, 0, -5.28],
    deskApproach: [-8.5, 0, -4.15],
    deskFacing: Math.PI,
    ownerChairIndex: 0,
    meetingSeatIndex: 0,
    loungeSpot: [-7.1, 0, 6.85],
    lobbySpot: [2.7, 0, 6.4],
    pantrySpot: [9.8, 0, 0.7],
    cabinetSpot: [-10.1, 0, -6.0],
    routineOffsetMs: 14000,
    updateSummaryId:
      "Update Threads Boss! Fokus penuh di Threads hari ini: 6 utas storytelling terjadwal, 48 balasan aktif, dan 9 DM prospek masuk.",
    updateSummaryEn:
      "Threads update Boss! Full focus on Threads today: 6 storytelling threads queued, 48 active replies, and 9 inbound prospect DMs.",
    proposalId: "Publish 6 utas storytelling Threads hari ini & follow-up 9 DM prospek yang masuk.",
    proposalEn: "Publish today's 6 Threads storytelling posts & follow up on all 9 inbound DMs.",
    metrics: [
      { labelId: "Utas Hari Ini", labelEn: "Threads Posted", value: "6 Utas", colorClass: "text-slate-100" },
      { labelId: "Balasan & Diskusi", labelEn: "Active Replies", value: "48", colorClass: "text-emerald-300" },
      { labelId: "Impresi 24 Jam", labelEn: "24h Views", value: "31.4K", colorClass: "text-sky-300" },
      { labelId: "Lead dari Threads", labelEn: "Threads Leads", value: "+9 DM", colorClass: "text-amber-300" },
    ],
  },
  {
    id: "instagram",
    name: "Sarah",
    role: "Instagram Specialist",
    division: "Marketing",
    icon: "📸",
    accent: "#f472b6",
    modelUrl: "/models/kenney/characters/character-female-b.glb",
    deskPos: [-5.3, 0, -6.2],
    chairPos: [-5.3, 0, -5.28],
    deskApproach: [-5.3, 0, -4.15],
    deskFacing: Math.PI,
    ownerChairIndex: 1,
    meetingSeatIndex: 1,
    loungeSpot: [-6.4, 0, 6.85],
    lobbySpot: [3.2, 0, 7.0],
    pantrySpot: [9.8, 0, 1.8],
    cabinetSpot: [-10.1, 0, -3.8],
    routineOffsetMs: 24000,
    updateSummaryId:
      "Update Instagram Boss! 2 Reels + 1 Carousel edukasi produk sudah siap tayang, engagement rate naik ke 6.4% minggu ini.",
    updateSummaryEn:
      "Instagram update Boss! 2 Reels + 1 product carousel ready to publish, and engagement rate climbed to 6.4% this week.",
    proposalId: "Tayangkan 2 Reels + 1 Carousel produk hari ini & balas 14 DM prospek Instagram.",
    proposalEn: "Publish 2 Reels + 1 product carousel today & reply to 14 Instagram prospect DMs.",
    metrics: [
      { labelId: "Reels & Carousel", labelEn: "Reels & Posts", value: "3 Siap", colorClass: "text-pink-300" },
      { labelId: "Jangkauan", labelEn: "Reach", value: "54.2K", colorClass: "text-sky-300" },
      { labelId: "Engagement", labelEn: "Engagement", value: "6.4%", colorClass: "text-emerald-300" },
      { labelId: "DM Prospek", labelEn: "Lead DMs", value: "+14", colorClass: "text-amber-300" },
    ],
  },
  {
    id: "reddit",
    name: "Raka",
    role: "Reddit Specialist",
    division: "Marketing",
    icon: "🟠",
    accent: "#fb923c",
    modelUrl: "/models/kenney/characters/character-male-a.glb",
    deskPos: [-2.1, 0, -6.2],
    chairPos: [-2.1, 0, -5.28],
    deskApproach: [-0.4, 0, -4.15],
    deskFacing: Math.PI,
    ownerChairIndex: 2,
    meetingSeatIndex: 2,
    loungeSpot: [-5.65, 0, 6.85],
    lobbySpot: [4.1, 0, 7.2],
    pantrySpot: [9.8, 0, 0.2],
    cabinetSpot: [-10.1, 0, -2.5],
    routineOffsetMs: 34000,
    updateSummaryId:
      "Update Reddit Boss! Saya aktif riset pain-point di 5 subreddit target, 12 komentar value-first naik ke top thread, dan 6 klik organik ke landing page.",
    updateSummaryEn:
      "Reddit update Boss! Tracking pain points across 5 target subreddits, 12 value-first comments trending, and 6 organic landing page clicks.",
    proposalId: "Lanjutkan 12 komentar value-first di 5 subreddit niche & rangkum insight pain-point audiens.",
    proposalEn: "Post 12 value-first replies across 5 niche subreddits & compile audience pain-point insights.",
    metrics: [
      { labelId: "Subreddit Aktif", labelEn: "Subreddits", value: "5 Niche", colorClass: "text-orange-300" },
      { labelId: "Komentar Value", labelEn: "Top Comments", value: "12 Post", colorClass: "text-emerald-300" },
      { labelId: "Upvotes", labelEn: "Upvotes", value: "+340", colorClass: "text-sky-300" },
      { labelId: "Traffic Organik", labelEn: "Organic Clicks", value: "126", colorClass: "text-amber-300" },
    ],
  },
  {
    id: "facebook",
    name: "Bima",
    role: "Facebook Specialist",
    division: "Marketing",
    icon: "📘",
    accent: "#60a5fa",
    modelUrl: "/models/kenney/characters/character-male-b.glb",
    deskPos: [-8.5, 0, -2.1],
    chairPos: [-8.5, 0, -1.18],
    deskApproach: [-8.5, 0, 0.45],
    deskFacing: Math.PI,
    ownerChairIndex: 3,
    meetingSeatIndex: 3,
    loungeSpot: [-7.0, 0, 6.85],
    lobbySpot: [2.9, 0, 7.3],
    pantrySpot: [9.8, 0, 2.3],
    cabinetSpot: [-10.1, 0, -1.2],
    routineOffsetMs: 44000,
    updateSummaryId:
      "Update Facebook Boss! 3 grup komunitas aktif dimoderasi, 2 materi copywriting FB Page siap publish, dan 11 leads masuk via Messenger.",
    updateSummaryEn:
      "Facebook update Boss! 3 community groups engaged, 2 FB Page posts queued, and 11 qualified leads came in via Messenger.",
    proposalId: "Publish 2 materi copywriting FB Page & kirim follow-up ke 11 leads di Messenger.",
    proposalEn: "Publish 2 FB Page copy posts & send follow-ups to 11 Messenger leads.",
    metrics: [
      { labelId: "Grup & Page", labelEn: "Groups & Page", value: "3 Aktif", colorClass: "text-blue-300" },
      { labelId: "Leads Messenger", labelEn: "Messenger Leads", value: "+11", colorClass: "text-emerald-300" },
      { labelId: "Share Organik", labelEn: "Shares", value: "84", colorClass: "text-sky-300" },
      { labelId: "CTR Post", labelEn: "Post CTR", value: "3.9%", colorClass: "text-amber-300" },
    ],
  },
  {
    id: "tiktok",
    name: "Kira",
    role: "TikTok Specialist",
    division: "Marketing",
    icon: "🎵",
    accent: "#2dd4bf",
    modelUrl: "/models/kenney/characters/character-female-c.glb",
    deskPos: [-5.3, 0, -2.1],
    chairPos: [-5.3, 0, -1.18],
    deskApproach: [-5.3, 0, 0.45],
    deskFacing: Math.PI,
    ownerChairIndex: 1,
    meetingSeatIndex: 0,
    loungeSpot: [-6.0, 0, 6.85],
    lobbySpot: [2.3, 0, 6.9],
    pantrySpot: [9.8, 0, 1.1],
    cabinetSpot: [-10.1, 0, -4.8],
    routineOffsetMs: 54000,
    updateSummaryId:
      "Update TikTok Boss! 4 skrip hook pendek tren minggu ini sudah jadi, 1 video tembus 42K views dan bawa 18 klik link bio.",
    updateSummaryEn:
      "TikTok update Boss! 4 trending short hook scripts drafted, 1 video hit 42K views driving 18 bio link clicks.",
    proposalId: "Produksi & jadwalkan 4 video pendek TikTok dengan hook tren minggu ini + CTA link bio.",
    proposalEn: "Produce & schedule 4 short TikTok videos with this week's trending hooks + bio CTA.",
    metrics: [
      { labelId: "Skrip & Hook", labelEn: "Scripts Ready", value: "4 Video", colorClass: "text-teal-300" },
      { labelId: "Views Tertinggi", labelEn: "Top Views", value: "42.8K", colorClass: "text-sky-300" },
      { labelId: "Watch Time", labelEn: "Avg Watch", value: "74%", colorClass: "text-emerald-300" },
      { labelId: "Klik Bio", labelEn: "Bio Clicks", value: "+18", colorClass: "text-amber-300" },
    ],
  },
  {
    id: "youtube",
    name: "Dion",
    role: "YouTube Specialist",
    division: "Marketing",
    icon: "▶️",
    accent: "#f87171",
    modelUrl: "/models/kenney/characters/character-male-c.glb",
    deskPos: [-2.1, 0, -2.1],
    chairPos: [-2.1, 0, -1.18],
    deskApproach: [-0.4, 0, 0.45],
    deskFacing: Math.PI,
    ownerChairIndex: 2,
    meetingSeatIndex: 1,
    loungeSpot: [-5.6, 0, 6.85],
    lobbySpot: [3.8, 0, 6.1],
    pantrySpot: [9.8, 0, -0.1],
    cabinetSpot: [-10.1, 0, -1.8],
    routineOffsetMs: 64000,
    updateSummaryId:
      "Update YouTube Boss! Outline video long-form demo produk & 3 YouTube Shorts sudah siap produksi, CTR thumbnail naik ke 7.1%.",
    updateSummaryEn:
      "YouTube update Boss! Long-form product walkthrough outline & 3 YouTube Shorts are ready for production, thumbnail CTR is up to 7.1%.",
    proposalId: "Finalisasi skrip video demo long-form & jadwalkan upload 3 YouTube Shorts baru.",
    proposalEn: "Finalize long-form demo script & schedule 3 new YouTube Shorts uploads.",
    metrics: [
      { labelId: "Long-Form & Shorts", labelEn: "Videos Queued", value: "1 + 3", colorClass: "text-red-300" },
      { labelId: "Thumbnail CTR", labelEn: "Thumbnail CTR", value: "7.1%", colorClass: "text-emerald-300" },
      { labelId: "Retensi", labelEn: "Retention", value: "58%", colorClass: "text-sky-300" },
      { labelId: "Subscriber Baru", labelEn: "New Subs", value: "+215", colorClass: "text-amber-300" },
    ],
  },
];

export const EMPLOYEE_MAP: Record<EmployeeId, EmployeeConfig> = Object.fromEntries(
  EMPLOYEES.map((e) => [e.id, e]),
) as Record<EmployeeId, EmployeeConfig>;

export type ResolvedStation = {
  id: StationId;
  pose: PoseKind;
  target: Vec3;
  approach: Vec3;
  entryWaypoints?: Vec3[];
  facing: number;
  seatHeight?: number;
};

export function getEmployeeStation(emp: EmployeeConfig, stationId: StationId): ResolvedStation {
  const ownerChair = OWNER_VISITOR_CHAIRS[emp.ownerChairIndex] ?? OWNER_VISITOR_CHAIRS[0];
  const meetChair = MEETING_CHAIRS[emp.meetingSeatIndex] ?? MEETING_CHAIRS[0];

  switch (stationId) {
    case "desk":
      return {
        id: "desk",
        pose: "work",
        target:
          emp.id === "assistant"
            ? [emp.chairPos[0], 0, emp.chairPos[2] + 0.04]
            : [emp.chairPos[0], 0, emp.chairPos[2] - 0.04],
        approach: emp.deskApproach,
        entryWaypoints:
          emp.id === "assistant"
            ? [
                [0.2, 0, -7.2],
                [0.2, 0, -7.95],
              ]
            : undefined,
        facing: emp.deskFacing,
        seatHeight: 0.44,
      };
    case "owner_update":
      return {
        id: "owner_update",
        pose: "update",
        target: [ownerChair.position[0] + 0.06, 0, ownerChair.position[2]],
        approach: [1.65, 0, -3.4],
        entryWaypoints: [
          [3.0, 0, -3.4],
          [4.3, 0, -3.9],
          [7.45, 0, -4.05],
          [7.45, 0, ownerChair.position[2]],
        ],
        facing: ownerChair.rotation,
        seatHeight: 0.44,
      };
    case "meeting":
      return {
        id: "meeting",
        pose: "meeting",
        target: meetChair.position,
        approach: [-10.0, 0, 1.1],
        entryWaypoints: [
          [-11.8, 0, 1.1],
          [-12.5, 0, meetChair.position[2]],
        ],
        facing: meetChair.rotation,
        seatHeight: 0.44,
      };
    case "lounge":
      return {
        id: "lounge",
        pose: "sit",
        target: emp.loungeSpot,
        approach: [-2.8, 0, 5.9],
        facing: Math.PI,
        seatHeight: 0.42,
      };
    case "lobby":
      return {
        id: "lobby",
        pose: "stand",
        target: emp.lobbySpot,
        approach: [1.5, 0, 5.2],
        facing: 0.15,
      };
    case "pantry":
      return {
        id: "pantry",
        pose: "pantry",
        target: emp.pantrySpot,
        approach: [8.85, 0, 3.2],
        facing: Math.PI / 2,
      };
    case "cabinet":
      return {
        id: "cabinet",
        pose: "cabinet",
        target: emp.cabinetSpot,
        approach: [-10.0, 0, 0.5],
        facing: -Math.PI / 2,
      };
  }
}

// --- WIDE CORRIDOR HUB NETWORK FOR 24m x 18m OBSTACLE-FREE PATHFINDING ---
type HubId =
  | "hub_center"
  | "hub_north"
  | "hub_south"
  | "hub_row_mid"
  | "hub_west"
  | "hub_meeting_door"
  | "hub_pantry_south"
  | "hub_owner_door";

const HUBS: Record<HubId, Vec3> = {
  hub_center: [0.9, 0, 0.85],
  hub_north: [0.9, 0, -4.2],
  hub_south: [0.9, 0, 4.9],
  hub_row_mid: [-5.3, 0, -4.15],
  hub_west: [-5.3, 0, 0.85],
  hub_meeting_door: [-10.0, 0, 1.1],
  hub_pantry_south: [8.0, 0, 1.6],
  hub_owner_door: [1.65, 0, -3.4],
};

const HUB_EDGES: Record<HubId, HubId[]> = {
  hub_center: ["hub_north", "hub_south", "hub_west", "hub_pantry_south"],
  hub_north: ["hub_center", "hub_row_mid", "hub_owner_door"],
  hub_row_mid: ["hub_north"],
  hub_south: ["hub_center", "hub_west", "hub_pantry_south"],
  hub_west: ["hub_center", "hub_south", "hub_meeting_door"],
  hub_meeting_door: ["hub_west"],
  hub_pantry_south: ["hub_center", "hub_south"],
  hub_owner_door: ["hub_north"],
};

function getStationHub(emp: EmployeeConfig, stationId: StationId): HubId {
  if (stationId === "desk") {
    if (emp.id === "assistant") return "hub_north";
    return emp.deskPos[2] < -4.0 ? "hub_row_mid" : "hub_west";
  }
  switch (stationId) {
    case "owner_update":
      return "hub_owner_door";
    case "meeting":
      return "hub_meeting_door";
    case "lounge":
    case "lobby":
      return "hub_south";
    case "pantry":
      return "hub_pantry_south";
    case "cabinet":
      return "hub_west";
  }
}

function dist2D(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[2] - b[2]);
}

function shortestHubPath(start: HubId, goal: HubId): HubId[] {
  if (start === goal) return [start];
  const queue: HubId[][] = [[start]];
  const visited = new Set<HubId>([start]);
  while (queue.length > 0) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    for (const next of HUB_EDGES[last]) {
      if (next === goal) return [...path, next];
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return [start, goal];
}

export function buildWalkPath(
  emp: EmployeeConfig,
  fromPos: Vec3,
  fromStation: StationId | null,
  toStation: StationId,
): Vec3[] {
  const dest = getEmployeeStation(emp, toStation);
  const points: Vec3[] = [];

  const pushUnique = (p: Vec3) => {
    const prev = points.length > 0 ? points[points.length - 1] : fromPos;
    if (dist2D(prev, p) > 0.1) {
      points.push([p[0], 0, p[2]]);
    }
  };

  if (fromStation && fromStation !== toStation) {
    const src = getEmployeeStation(emp, fromStation);
    if (src.entryWaypoints) {
      for (let i = src.entryWaypoints.length - 1; i >= 0; i--) {
        pushUnique(src.entryWaypoints[i]);
      }
    }
    pushUnique(src.approach);
  } else if (!fromStation && fromPos[0] > 3.0 && fromPos[2] < -1.2) {
    pushUnique([4.3, 0, -3.9]);
    pushUnique([3.0, 0, -3.4]);
    pushUnique([1.65, 0, -3.4]);
  }

  const startHub: HubId = fromStation
    ? getStationHub(emp, fromStation)
    : fromPos[0] > 3.0 && fromPos[2] < -1.2
      ? "hub_owner_door"
      : (Object.keys(HUBS) as HubId[]).reduce(
          (best, id) =>
            dist2D(fromPos, HUBS[id]) < dist2D(fromPos, HUBS[best]) ? id : best,
          "hub_center" as HubId,
        );
  const endHub = getStationHub(emp, toStation);

  for (const h of shortestHubPath(startHub, endHub)) {
    pushUnique(HUBS[h]);
  }

  pushUnique(dest.approach);
  if (dest.entryWaypoints) {
    for (const wp of dest.entryWaypoints) {
      pushUnique(wp);
    }
  }
  pushUnique(dest.target);

  return points;
}

export const AUTO_ROUTINE_ORDER: { station: StationId; durationMs: number }[] = [
  { station: "desk", durationMs: 26000 },
  { station: "meeting", durationMs: 8500 },
  { station: "desk", durationMs: 24000 },
  { station: "pantry", durationMs: 6500 },
  { station: "desk", durationMs: 22000 },
  { station: "lounge", durationMs: 9000 },
];

// --- CAMERA PRESETS FOR SPACIOUS 24m x 18m OFFICE ---
export type CameraPresetId =
  | "isometric"
  | "owner"
  | "assistant"
  | "meeting"
  | "follow"
  | "desk"
  | "lounge"
  | "lobby"
  | "pantry";

export type CameraPreset = {
  id: CameraPresetId;
  label: string;
  position: Vec3;
  target: Vec3;
  fov: number;
};

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: "isometric",
    label: "Isometric",
    position: [19.5, 20.0, 22.0],
    target: [-3.0, 0.7, -0.2],
    fov: 28,
  },
  {
    id: "owner",
    label: "Ruang Owner",
    position: [9.85, 1.38, -5.0],
    target: [6.4, 1.08, -4.95],
    fov: 48,
  },
  {
    id: "assistant",
    label: "Ruang Owner Assistant",
    position: [-1.4, 3.2, -3.5],
    target: [1.5, 0.9, -7.2],
    fov: 40,
  },
  {
    id: "meeting",
    label: "Ruang Meeting & TV",
    position: [-9.2, 3.8, 5.4],
    target: [-14.8, 1.1, 0.3],
    fov: 42,
  },
  {
    id: "follow",
    label: "Follow",
    position: [-0.5, 2.8, 3.6],
    target: [-2.1, 1.0, -0.3],
    fov: 40,
  },
  {
    id: "desk",
    label: "Ruang Team",
    position: [1.6, 4.8, 4.2],
    target: [-5.5, 0.8, -4.2],
    fov: 38,
  },
  {
    id: "lounge",
    label: "Lounge & TV",
    position: [-0.8, 3.6, 9.6],
    target: [-6.4, 1.0, 5.2],
    fov: 38,
  },
  {
    id: "lobby",
    label: "Lobby",
    position: [1.5, 3.6, 11.4],
    target: [6.0, 1.1, 6.4],
    fov: 40,
  },
  {
    id: "pantry",
    label: "Pantry & Coffee Bar",
    position: [5.5, 3.2, 4.4],
    target: [10.4, 1.0, 1.1],
    fov: 40,
  },
];
