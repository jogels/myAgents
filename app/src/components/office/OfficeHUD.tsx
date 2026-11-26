"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  CAMERA_PRESETS,
  CameraPresetId,
  EMPLOYEES,
  EMPLOYEE_MAP,
  EmployeeId,
  STATION_META,
  StationId,
} from "@/lib/officeLayout";

export type ProposalStatus = "pending" | "executed" | "done";

export type ChatMessage = {
  id: string;
  sender: "owner" | "agent";
  text: string;
  time: string;
  proposal?: {
    actionText: string;
    status: ProposalStatus;
  };
};

type EmployeeLiveState = {
  station: StationId;
  moving: boolean;
};

type TopBarProps = {
  selectedEmployeeId: EmployeeId;
  employeeStates: Record<EmployeeId, EmployeeLiveState>;
  chatHistory: Record<EmployeeId, ChatMessage[]>;
  autoRoutine: boolean;
  cameraPreset: CameraPresetId;
  language: "id" | "en";
  onSelectEmployee: (id: EmployeeId) => void;
  onCallUpdate: (empId?: EmployeeId) => void;
  onSendMessage: (empId: EmployeeId, text: string) => void;
  onProposalDecision: (
    empId: EmployeeId,
    decision: "executed" | "done",
    messageId?: string,
  ) => void;
  onToggleAuto: () => void;
  onSelectCamera: (preset: CameraPresetId) => void;
  onGreet: () => void;
  onToggleLanguage: () => void;
};

export function OfficeTopBar({
  selectedEmployeeId,
  employeeStates,
  chatHistory,
  autoRoutine,
  cameraPreset,
  language,
  onSelectEmployee,
  onCallUpdate,
  onSendMessage,
  onProposalDecision,
  onToggleAuto,
  onSelectCamera,
  onGreet,
  onToggleLanguage,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const emp = EMPLOYEE_MAP[selectedEmployeeId] ?? EMPLOYEES[0];
  const activeLive = employeeStates?.[selectedEmployeeId] ?? {
    station: "desk" as StationId,
    moving: false,
  };
  const activeStation = activeLive.station;
  const messages = chatHistory?.[selectedEmployeeId] ?? [];
  const activePresetMeta = CAMERA_PRESETS.find((c) => c.id === cameraPreset);

  const countPendingFor = (id: EmployeeId) =>
    (chatHistory?.[id] ?? []).filter((m) => m.proposal?.status === "pending").length;

  const totalPending = EMPLOYEES.reduce((sum, e) => sum + countPendingFor(e.id), 0);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [menuOpen, selectedEmployeeId, messages.length]);

  const getLiveStatusText = (id: EmployeeId) => {
    const st = employeeStates?.[id] ?? { station: "desk" as StationId, moving: false };
    const meta = STATION_META[st.station] ?? STATION_META.desk;
    if (st.moving) {
      return language === "id"
        ? `Berjalan ke ${meta.labelId}...`
        : `Walking to ${meta.labelEn}...`;
    }
    return language === "id" ? meta.statusId : meta.statusEn;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSendMessage(selectedEmployeeId, trimmed);
    setDraft("");
  };

  const executiveList = EMPLOYEES.filter((e) => e.division === "Executive");
  const marketingList = EMPLOYEES.filter((e) => e.division === "Marketing");
  const salesList = EMPLOYEES.filter((e) => e.division === "Sales");

  const renderMemberButton = (
    member: (typeof EMPLOYEES)[number],
    roleColorClass: string,
    compactRole: string,
  ) => {
    const selected = member.id === selectedEmployeeId;
    const lastMsg = chatHistory?.[member.id]?.at(-1);
    const pendingCount = countPendingFor(member.id);

    return (
      <button
        key={member.id}
        onClick={() => onSelectEmployee(member.id)}
        className={`mb-1 flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
          selected
            ? "bg-emerald-500/20 ring-1 ring-emerald-400/50"
            : "hover:bg-white/[0.06]"
        }`}
      >
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm">
          <span>{member.icon}</span>
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0f1a]"
            style={{ backgroundColor: member.accent }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-xs font-semibold text-white">
              {member.name}
            </span>
            <div className="flex items-center gap-1">
              <span className={`truncate text-[9.5px] ${roleColorClass}`}>
                {compactRole}
              </span>
              {pendingCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </div>
          </div>
          <div className="truncate text-[10px] text-slate-400">
            {lastMsg ? lastMsg.text : getLiveStatusText(member.id)}
          </div>
        </div>
      </button>
    );
  };

  return (
    <header className="relative z-50 w-full shrink-0 border-b border-white/10 bg-[#0d1320] px-4 py-2 text-white shadow-lg">
      <div className="flex items-center justify-between gap-3">
        {/* LEFT: Minimal Brand + Back to Isometric (only shown when focused inside a room) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <div className="leading-tight">
              <div className="text-xs font-bold tracking-wide text-white">
                MyAgents HQ
              </div>
              <div className="text-[10px] text-emerald-300/80">
                Marketing · Sales · Executive
              </div>
            </div>
          </div>

          {cameraPreset !== "isometric" ? (
            <button
              onClick={() => onSelectCamera("isometric")}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
            >
              <span>←</span>
              <span>
                {language === "id" ? "Kembali ke Denah" : "Back to Isometric"}
              </span>
              {activePresetMeta && (
                <span className="text-emerald-300/70">
                  · {activePresetMeta.label}
                </span>
              )}
            </button>
          ) : (
            <span className="hidden text-[11px] text-slate-400 md:inline">
              {language === "id"
                ? "Klik ruangan di denah untuk fokus ke ruangan tersebut"
                : "Click any room on the floorplan to focus inside"}
            </span>
          )}
        </div>

        {/* RIGHT: Language + Compact Team & Room Chat Dropdown Button */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          <button
            onClick={onToggleLanguage}
            title="Switch language ID / EN"
            className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-amber-200 transition hover:bg-white/15"
          >
            {language.toUpperCase()}
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`relative flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-left transition ${
              menuOpen
                ? "border-emerald-400/60 bg-emerald-500/20 text-white"
                : "border-white/15 bg-white/[0.06] text-white hover:bg-white/10"
            }`}
          >
            <span className="text-sm">{emp.icon}</span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span>{emp.name}</span>
                {totalPending > 0 ? (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9.5px] font-bold text-white">
                    {totalPending} {language === "id" ? "Update" : "Pending"}
                  </span>
                ) : (
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-300">
                    {EMPLOYEES.length} Tim
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-300">{emp.role}</div>
            </div>
            <span className="ml-1 text-[10px] text-slate-400">
              {menuOpen ? "▲" : "▼"}
            </span>
          </button>

          {/* RIGHT-ALIGNED DROPDOWN: TEAM ROOM LIST + LIVE PROPOSAL CHAT */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 flex w-[min(95vw,710px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0e1524]/98 shadow-2xl backdrop-blur-xl sm:h-[490px] sm:flex-row">
              {/* Left Column: Chat-Room-Style Team List (Executive, Marketing, Sales) */}
              <div className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#0a0f1a] sm:w-[250px] sm:border-b-0 sm:border-r">
                <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    {language === "id" ? "Room Chat Tim" : "Team Chat Rooms"}
                  </span>
                  <button
                    onClick={onToggleAuto}
                    className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                      autoRoutine
                        ? "bg-amber-400/20 text-amber-200 ring-1 ring-amber-400/40"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        autoRoutine ? "bg-amber-400" : "bg-slate-500"
                      }`}
                    />
                    <span>Auto {autoRoutine ? "ON" : "OFF"}</span>
                  </button>
                </div>

                <div className="max-h-[200px] flex-1 overflow-y-auto p-1.5 sm:max-h-none">
                  {/* 1. Executive Staff */}
                  <div className="flex items-center justify-between px-2 pb-1 pt-1 text-[9.5px] font-semibold uppercase tracking-widest text-amber-300/80">
                    <span>Executive</span>
                    <span className="text-slate-500">{executiveList.length}</span>
                  </div>
                  {executiveList.map((m) =>
                    renderMemberButton(m, "text-amber-300", m.role),
                  )}

                  {/* 2. Marketing Division */}
                  <div className="mt-2 flex items-center justify-between px-2 pb-1 text-[9.5px] font-semibold uppercase tracking-widest text-emerald-300/80">
                    <span>Marketing</span>
                    <span className="text-slate-500">{marketingList.length}</span>
                  </div>
                  {marketingList.map((m) =>
                    renderMemberButton(
                      m,
                      "text-slate-400",
                      m.role.replace(" Specialist", ""),
                    ),
                  )}

                  {/* 3. Sales Division (empty) */}
                  <div className="mt-2 flex items-center justify-between px-2 pb-1 text-[9.5px] font-semibold uppercase tracking-widest text-sky-300/80">
                    <span>Sales</span>
                    <span className="text-slate-500">{salesList.length}</span>
                  </div>
                  {salesList.length === 0 ? (
                    <div className="mx-1.5 mb-2 rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-3 py-2.5 text-center text-[10.5px] text-slate-500">
                      {language === "id"
                        ? "Belum ada avatar di divisi Sales"
                        : "No agents in Sales yet"}
                    </div>
                  ) : (
                    salesList.map((m) =>
                      renderMemberButton(m, "text-sky-300", m.role),
                    )
                  )}
                </div>
              </div>

              {/* Right Column: Live Room Chat + Proposal Approval Controls */}
              <div className="flex min-h-[270px] flex-1 flex-col bg-[#0e1524]">
                {/* Chat Header with single clean chip row: Meja Owner, Follow, Sapa */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span>{emp.icon}</span>
                      <span>{emp.name}</span>
                      <span className="font-normal text-slate-400">· {emp.role}</span>
                    </div>
                    <div className="truncate text-[10px] text-emerald-300/90">
                      {getLiveStatusText(selectedEmployeeId)}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => {
                        onCallUpdate(selectedEmployeeId);
                        setMenuOpen(false);
                      }}
                      className={`cursor-pointer rounded-lg px-2 py-1 text-[10px] font-semibold transition ${
                        activeStation === "owner_update"
                          ? "bg-emerald-500/30 text-emerald-200 ring-1 ring-emerald-400/60"
                          : "border border-emerald-400/35 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
                      }`}
                    >
                      📋 {language === "id" ? "Meja Owner" : "Owner Desk"}
                    </button>
                    <button
                      onClick={() => {
                        onSelectCamera("follow");
                        setMenuOpen(false);
                      }}
                      className="cursor-pointer rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-200 transition hover:bg-white/15"
                    >
                      🎯 Follow
                    </button>
                    <button
                      onClick={onGreet}
                      className="cursor-pointer rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-200 transition hover:bg-white/15"
                    >
                      👋 {language === "id" ? "Sapa" : "Wave"}
                    </button>
                  </div>
                </div>

                {/* Chat Messages + Specialist Proposals (Owner decides: Lakukan / Selesai) */}
                <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === "owner" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                          msg.sender === "owner"
                            ? "rounded-br-sm bg-emerald-500 font-medium text-slate-950"
                            : "rounded-bl-sm border border-white/10 bg-white/[0.06] text-slate-100"
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Specialist Action Proposal Box inside Room Chat */}
                        {msg.proposal && (
                          <div className="mt-2.5 rounded-xl border border-white/12 bg-slate-950/70 p-2.5">
                            <div className="text-[9.5px] font-bold uppercase tracking-wider text-amber-300">
                              {language === "id"
                                ? "Pengajuan Aksi · Menunggu Kendali Owner"
                                : "Action Proposal · Owner Approval"}
                            </div>
                            <p className="mt-1 text-[11px] leading-snug text-slate-200">
                              {msg.proposal.actionText}
                            </p>

                            {msg.proposal.status === "pending" ? (
                              <div className="mt-2.5 flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    onProposalDecision(
                                      selectedEmployeeId,
                                      "executed",
                                      msg.id,
                                    )
                                  }
                                  className="flex-1 cursor-pointer rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-slate-950 transition hover:bg-emerald-400"
                                >
                                  ✅ {language === "id" ? "Lakukan" : "Execute"}
                                </button>
                                <button
                                  onClick={() =>
                                    onProposalDecision(
                                      selectedEmployeeId,
                                      "done",
                                      msg.id,
                                    )
                                  }
                                  className="flex-1 cursor-pointer rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/20"
                                >
                                  ✔ {language === "id" ? "Selesai" : "Done"}
                                </button>
                              </div>
                            ) : msg.proposal.status === "executed" ? (
                              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                                <span>✓</span>
                                <span>
                                  {language === "id"
                                    ? "Disetujui Owner · Sedang Dilakukan"
                                    : "Approved by Owner · Executing"}
                                </span>
                              </div>
                            ) : (
                              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-slate-700/60 px-2 py-1 text-[10px] font-semibold text-slate-300">
                                <span>✔</span>
                                <span>
                                  {language === "id"
                                    ? "Ditandai Selesai oleh Owner"
                                    : "Marked Done by Owner"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="mt-0.5 px-1 text-[9px] text-slate-500">
                        {msg.sender === "owner" ? "Owner" : emp.name} · {msg.time}
                      </span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 border-t border-white/10 bg-[#0a0f1a] p-2.5"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={
                      language === "id"
                        ? `Beri arahan / minta update ke ${emp.name}...`
                        : `Send instruction to ${emp.name}...`
                    }
                    className="min-w-0 flex-1 rounded-xl border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400/60"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    {language === "id" ? "Kirim" : "Send"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function OwnerBriefingCard({
  employeeId,
  language,
  onExecute,
  onFinish,
}: {
  employeeId: EmployeeId;
  language: "id" | "en";
  onExecute: () => void;
  onFinish: () => void;
}) {
  const emp = EMPLOYEE_MAP[employeeId] ?? EMPLOYEES[0];

  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-20 w-[330px] rounded-2xl border border-emerald-400/35 bg-slate-950/90 p-4 text-left shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
          {language === "id" ? "Laporan Progress" : "Progress Briefing"}
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
          {emp.icon} {emp.role}
        </span>
      </div>
      <div className="mt-1.5 text-sm font-semibold text-white">{emp.name}</div>
      <p className="mt-1 text-xs leading-relaxed text-slate-200">
        {language === "id" ? emp.updateSummaryId : emp.updateSummaryEn}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {emp.metrics.map((m) => (
          <div key={m.labelEn} className="rounded-xl bg-white/5 p-2.5">
            <div className="text-[10px] text-slate-400">
              {language === "id" ? m.labelId : m.labelEn}
            </div>
            <div className={`mt-0.5 text-sm font-bold ${m.colorClass}`}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Specialist Proposal Box awaiting Owner decision */}
      <div className="mt-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-2.5">
        <div className="text-[9.5px] font-bold uppercase tracking-wider text-amber-300">
          {language === "id" ? "Pengajuan Selanjutnya" : "Proposed Next Action"}
        </div>
        <p className="mt-1 text-[11px] leading-snug text-slate-200">
          {language === "id" ? emp.proposalId : emp.proposalEn}
        </p>
      </div>

      {/* Owner Decision Controls: Lakukan & Selesai */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onExecute}
          className="cursor-pointer rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
        >
          ✅ {language === "id" ? "Lakukan" : "Execute"}
        </button>
        <button
          onClick={onFinish}
          className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          ✔ {language === "id" ? "Selesai" : "Done"}
        </button>
      </div>
    </div>
  );
}
