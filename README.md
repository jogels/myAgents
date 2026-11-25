# AI Employees — Virtual 3D Office

> Status: **F1 selesai** (2026-11-25) — shell 3D + avatar VRM + idle animasi + greeting bilingual.
> First system: **Sales & Marketing**.

## Jalan yang dipakai (keputusan 2026-11-25)

- Karakter: **VRM** (avatar `public/models/avatar_sample.vrm`, CC0 sample dari pixiv/three-vrm)
- LLM: **cloud free tier** (OpenRouter) — menyusul di F2
- Bahasa: **bilingual ID/EN**

## Cara jalan

```bash
cd app
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start -- -p 3100
```

## Yang sudah ada di F1

- `src/app/page.tsx` — Canvas + HUD
- `src/components/office/OfficeScene.tsx` — ruang kantor, meja, kursi, tanaman, lighting
- `src/components/office/EmployeeAvatar.tsx` — loader VRM, idle (breathing/head sway),
  wave + bubble greeting bilingual saat avatar diklik, label nama via drei `Html`

## Tujuan

 Kantor virtual 3D di browser, karyawan = AI agent dengan avatar + animasi + voice.
Fokus sistem pertama: sales & marketing (lead intake, follow-up, konten, laporan).

## Prinsip

- **100% free / open source** untuk core. Paid hanya kalau nanti butuh skala.
- Avatar & animasi harus "bagus" tanpa biaya: pakai aset CC0 / standar terbuka.
- Setiap karyawan = persona + memory + tools + state animasi (idle/talk/gesture).

## Rekomendasi Stack (default)

| Layer | Pilihan | Lisensi |
|---|---|---|
| App shell | Next.js 15 + TypeScript | MIT |
| 3D | three.js + @react-three/fiber + drei | MIT |
| Avatar | VRM (VRoid Studio) via `three-vrm`, atau Mixamo FBX | VRM open standard / Mixamo free |
| Animasi | Mixamo (idle, talk, walk, gesture) + state machine | Free (Adobe account) |
| Aset kantor | Kenney / Quaternius CC0 | CC0 |
| Otak (LLM) | Ollama lokal (Qwen2.5 / Llama 3.1) atau OpenRouter free tier | Free |
| Voice | Piper TTS (lokal) + faster-whisper (STT) | MIT |
| Backend | FastAPI (Python) + WebSocket | MIT |
| Memory | Postgres + pgvector (atau SQLite + sqlite-vec) | PostgreSQL license |
| Deploy | Vercel free (frontend) + VPS/Ryzen lokal (Ollama) | Free tier |

## Arsitektur

```
Browser (R3F office)
   │  WebSocket (state: posisi, animasi, subtitle)
   ▼
Orchestrator (FastAPI)
   ├── Agent Runtime (1 proses per karyawan: persona, memory, tools)
   ├── LLM Gateway (Ollama / OpenRouter)
   ├── TTS/STT
   └── Tool adapters: CRM, email, WhatsApp, Sheets
```

## Fase

1. **F1 — Shell 3D**: kantor + 1 avatar VRM + idle animasi + label nama. (1–2 hari)
2. **F2 — Agent Sales pertama**: persona, memory, tool email/CRM, balas lead. (2–3 hari)
3. **F3 — Voice**: TTS + STT, bicara masuk-keluar. (1–2 hari)
4. **F4 — Marketing agent**: jadwal konten, draft, laporan. (2 hari)
5. **F5 — Multi karyawan + orkestrasi**: koordinasi, handoff, dashboard. (3+ hari)

## Keputusan yang dibutuhkan

- [ ] Avatar: VRM (anime/stylized) atau Mixamo (realistis)?
- [ ] LLM: lokal Ollama (butuh RAM/VRAM) atau cloud free tier?
- [ ] Bahasa: Indonesia / English / bilingual?
- [ ] Target user: internal tim, atau klien?