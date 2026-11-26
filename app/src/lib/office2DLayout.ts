// Pixel-mapped 2D Hand-Drawn Isometric Office Coordinates (percentage of 1376x768 artwork)
import { CameraPresetId, EmployeeId, StationId } from "./officeLayout";

export type Pt2D = { x: number; y: number }; // percentage 0..100

export type Room2DZone = {
  id: CameraPresetId;
  labelId: string;
  labelEn: string;
  accent: string;
  /** Polygon clip points (% of canvas width/height) for hover highlight & clicking */
  polygon: string;
  /** Overhead floating label position (shown ONLY on hover in overview mode) */
  badgePos: Pt2D;
  /** Target zoom level & focal center when clicking this room */
  zoom: number;
  focus: Pt2D;
};

export const OWNER_SPRITE_POS: Pt2D = { x: 83.6, y: 35.8 };

export const ROOM_2D_ZONES: Room2DZone[] = [
  {
    id: "owner",
    labelId: "Ruang Owner",
    labelEn: "Owner Suite",
    accent: "#fbbf24",
    polygon: "58% 21%, 76% 5%, 98% 21%, 98% 44%, 80% 60%, 58% 42%",
    badgePos: { x: 80.5, y: 12.5 },
    zoom: 2.25,
    focus: { x: 81.0, y: 38.0 },
  },
  {
    id: "assistant",
    labelId: "Meja Owner Assistant · Maya",
    labelEn: "Owner Assistant · Maya",
    accent: "#f59e0b",
    polygon: "41% 24%, 51% 14%, 60% 24%, 51% 37%",
    badgePos: { x: 51.0, y: 13.5 },
    zoom: 2.45,
    focus: { x: 51.0, y: 27.5 },
  },
  {
    id: "meeting",
    labelId: "Ruang Meeting & TV",
    labelEn: "Meeting Room & TV",
    accent: "#818cf8",
    polygon: "2% 42%, 22% 26%, 35% 40%, 35% 58%, 16% 74%, 2% 62%",
    badgePos: { x: 18.0, y: 30.0 },
    zoom: 2.25,
    focus: { x: 18.5, y: 54.0 },
  },
  {
    id: "desk",
    labelId: "Ruang Team",
    labelEn: "Team Room",
    accent: "#34d399",
    polygon: "31% 38%, 45% 28%, 64% 52%, 52% 70%, 33% 54%",
    badgePos: { x: 47.0, y: 31.0 },
    zoom: 2.05,
    focus: { x: 47.5, y: 50.0 },
  },
  {
    id: "lounge",
    labelId: "Lounge & Smart TV",
    labelEn: "Lounge & Smart TV",
    accent: "#fb923c",
    polygon: "22% 76%, 35% 63%, 50% 80%, 36% 95%",
    badgePos: { x: 35.5, y: 63.0 },
    zoom: 2.35,
    focus: { x: 36.0, y: 78.5 },
  },
  {
    id: "lobby",
    labelId: "Lobby & Resepsionis",
    labelEn: "Reception Lobby",
    accent: "#38bdf8",
    polygon: "58% 78%, 73% 65%, 88% 85%, 75% 98%",
    badgePos: { x: 73.0, y: 64.0 },
    zoom: 2.25,
    focus: { x: 73.5, y: 79.0 },
  },
  {
    id: "pantry",
    labelId: "Pantry & Coffee Bar",
    labelEn: "Pantry & Coffee Bar",
    accent: "#2dd4bf",
    polygon: "80% 62%, 88% 52%, 97% 62%, 97% 78%, 88% 87%, 80% 76%",
    badgePos: { x: 89.5, y: 54.5 },
    zoom: 2.5,
    focus: { x: 88.5, y: 72.5 },
  },
];

export const CHAR_SPRITES: Record<EmployeeId | "owner", string> = {
  owner: "/art/chars/owner.png",
  assistant: "/art/chars/assistant.png",
  threads: "/art/chars/threads.png",
  instagram: "/art/chars/instagram.png",
  reddit: "/art/chars/reddit.png",
  facebook: "/art/chars/facebook.png",
  tiktok: "/art/chars/tiktok.png",
  youtube: "/art/chars/youtube.png",
};

type Employee2DSpots = {
  desk: Pt2D & { facingLeft: boolean };
  ownerUpdate: Pt2D & { facingLeft: boolean };
  meeting: Pt2D & { facingLeft: boolean };
  lounge: Pt2D & { facingLeft: boolean };
  lobby: Pt2D & { facingLeft: boolean };
  pantry: Pt2D & { facingLeft: boolean };
  cabinet: Pt2D & { facingLeft: boolean };
  deskHub: Hub2DId;
};

type Hub2DId =
  | "top_junction"
  | "owner_door_out"
  | "owner_door_in"
  | "center_aisle"
  | "meeting_door_out"
  | "meeting_door_in"
  | "south_promenade"
  | "lounge_entry"
  | "lobby_entry"
  | "pantry_entry";

const HUBS_2D: Record<Hub2DId, Pt2D> = {
  top_junction: { x: 52.5, y: 40.0 },
  owner_door_out: { x: 61.5, y: 46.0 },
  owner_door_in: { x: 67.5, y: 42.5 },
  center_aisle: { x: 46.5, y: 48.0 },
  meeting_door_out: { x: 34.0, y: 56.5 },
  meeting_door_in: { x: 26.0, y: 58.0 },
  south_promenade: { x: 63.0, y: 67.0 },
  lounge_entry: { x: 46.5, y: 72.5 },
  lobby_entry: { x: 67.0, y: 76.5 },
  pantry_entry: { x: 81.5, y: 76.5 },
};

const HUB_2D_EDGES: Record<Hub2DId, Hub2DId[]> = {
  top_junction: ["owner_door_out", "center_aisle"],
  owner_door_out: ["top_junction", "owner_door_in", "south_promenade"],
  owner_door_in: ["owner_door_out"],
  center_aisle: ["top_junction", "meeting_door_out", "lounge_entry", "south_promenade"],
  meeting_door_out: ["center_aisle", "meeting_door_in", "lounge_entry"],
  meeting_door_in: ["meeting_door_out"],
  south_promenade: ["owner_door_out", "center_aisle", "lounge_entry", "lobby_entry", "pantry_entry"],
  lounge_entry: ["center_aisle", "meeting_door_out", "south_promenade"],
  lobby_entry: ["south_promenade", "pantry_entry"],
  pantry_entry: ["south_promenade", "lobby_entry"],
};

export const EMPLOYEE_2D_SPOTS: Record<EmployeeId, Employee2DSpots> = {
  assistant: {
    desk: { x: 52.4, y: 26.8, facingLeft: true },
    ownerUpdate: { x: 76.2, y: 43.2, facingLeft: false },
    meeting: { x: 18.2, y: 48.5, facingLeft: false },
    lounge: { x: 39.2, y: 74.5, facingLeft: true },
    lobby: { x: 73.5, y: 73.2, facingLeft: true },
    pantry: { x: 85.0, y: 79.0, facingLeft: false },
    cabinet: { x: 50.0, y: 23.0, facingLeft: true },
    deskHub: "top_junction",
  },
  threads: {
    desk: { x: 37.4, y: 48.0, facingLeft: false },
    ownerUpdate: { x: 75.8, y: 43.5, facingLeft: false },
    meeting: { x: 12.6, y: 54.0, facingLeft: false },
    lounge: { x: 30.8, y: 82.5, facingLeft: false },
    lobby: { x: 67.5, y: 81.5, facingLeft: false },
    pantry: { x: 87.0, y: 81.0, facingLeft: false },
    cabinet: { x: 35.0, y: 40.5, facingLeft: false },
    deskHub: "center_aisle",
  },
  instagram: {
    desk: { x: 43.7, y: 43.8, facingLeft: false },
    ownerUpdate: { x: 84.2, y: 49.5, facingLeft: true },
    meeting: { x: 15.5, y: 51.2, facingLeft: false },
    lounge: { x: 41.8, y: 76.5, facingLeft: true },
    lobby: { x: 72.0, y: 84.5, facingLeft: false },
    pantry: { x: 89.0, y: 76.5, facingLeft: false },
    cabinet: { x: 41.5, y: 37.0, facingLeft: false },
    deskHub: "top_junction",
  },
  reddit: {
    desk: { x: 36.8, y: 35.8, facingLeft: false },
    ownerUpdate: { x: 86.8, y: 47.0, facingLeft: true },
    meeting: { x: 17.8, y: 61.5, facingLeft: true },
    lounge: { x: 39.0, y: 87.2, facingLeft: true },
    lobby: { x: 77.5, y: 83.0, facingLeft: true },
    pantry: { x: 84.2, y: 78.2, facingLeft: false },
    cabinet: { x: 38.5, y: 34.0, facingLeft: false },
    deskHub: "top_junction",
  },
  facebook: {
    desk: { x: 51.7, y: 62.2, facingLeft: false },
    ownerUpdate: { x: 73.2, y: 45.2, facingLeft: false },
    meeting: { x: 21.0, y: 58.8, facingLeft: true },
    lounge: { x: 42.6, y: 84.5, facingLeft: true },
    lobby: { x: 65.5, y: 78.5, facingLeft: false },
    pantry: { x: 86.5, y: 75.5, facingLeft: false },
    cabinet: { x: 54.5, y: 58.5, facingLeft: false },
    deskHub: "center_aisle",
  },
  tiktok: {
    desk: { x: 58.0, y: 56.8, facingLeft: false },
    ownerUpdate: { x: 84.8, y: 49.0, facingLeft: true },
    meeting: { x: 24.0, y: 56.2, facingLeft: true },
    lounge: { x: 38.2, y: 73.8, facingLeft: true },
    lobby: { x: 70.0, y: 80.5, facingLeft: false },
    pantry: { x: 88.2, y: 82.0, facingLeft: false },
    cabinet: { x: 59.5, y: 54.0, facingLeft: true },
    deskHub: "south_promenade",
  },
  youtube: {
    desk: { x: 45.4, y: 54.5, facingLeft: false },
    ownerUpdate: { x: 77.0, y: 42.8, facingLeft: false },
    meeting: { x: 15.2, y: 51.8, facingLeft: false },
    lounge: { x: 32.5, y: 84.0, facingLeft: false },
    lobby: { x: 75.5, y: 85.0, facingLeft: true },
    pantry: { x: 85.8, y: 80.0, facingLeft: false },
    cabinet: { x: 48.0, y: 50.5, facingLeft: false },
    deskHub: "center_aisle",
  },
};

export function get2DStationTarget(
  empId: EmployeeId,
  station: StationId,
): Pt2D & { facingLeft: boolean } {
  const s = EMPLOYEE_2D_SPOTS[empId];
  switch (station) {
    case "desk":
      return s.desk;
    case "owner_update":
      return s.ownerUpdate;
    case "meeting":
      return s.meeting;
    case "lounge":
      return s.lounge;
    case "lobby":
      return s.lobby;
    case "pantry":
      return s.pantry;
    case "cabinet":
      return s.cabinet;
  }
}

function get2DStationHub(empId: EmployeeId, station: StationId): Hub2DId {
  switch (station) {
    case "desk":
    case "cabinet":
      return EMPLOYEE_2D_SPOTS[empId].deskHub;
    case "owner_update":
      return "owner_door_in";
    case "meeting":
      return "meeting_door_in";
    case "lounge":
      return "lounge_entry";
    case "lobby":
      return "lobby_entry";
    case "pantry":
      return "pantry_entry";
  }
}

function distPt(a: Pt2D, b: Pt2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function shortest2DHubs(start: Hub2DId, goal: Hub2DId): Hub2DId[] {
  if (start === goal) return [start];
  const queue: Hub2DId[][] = [[start]];
  const visited = new Set<Hub2DId>([start]);
  while (queue.length > 0) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    for (const next of HUB_2D_EDGES[last]) {
      if (next === goal) return [...path, next];
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return [start, goal];
}

export function build2DWalkPath(
  empId: EmployeeId,
  from: Pt2D,
  fromStation: StationId | null,
  toStation: StationId,
): Pt2D[] {
  const dest = get2DStationTarget(empId, toStation);
  const points: Pt2D[] = [];

  const pushUnique = (p: Pt2D) => {
    const prev = points.length > 0 ? points[points.length - 1] : from;
    if (distPt(prev, p) > 0.8) {
      points.push({ x: p.x, y: p.y });
    }
  };

  const startHub: Hub2DId = fromStation
    ? get2DStationHub(empId, fromStation)
    : (Object.keys(HUBS_2D) as Hub2DId[]).reduce(
        (best, id) =>
          distPt(from, HUBS_2D[id]) < distPt(from, HUBS_2D[best]) ? id : best,
        "center_aisle" as Hub2DId,
      );
  const endHub = get2DStationHub(empId, toStation);

  for (const h of shortest2DHubs(startHub, endHub)) {
    pushUnique(HUBS_2D[h]);
  }
  pushUnique({ x: dest.x, y: dest.y });
  return points;
}
