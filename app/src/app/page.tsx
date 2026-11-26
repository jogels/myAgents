"use client";

import { useCallback, useState } from "react";
import IsometricOffice2D from "@/components/office/IsometricOffice2D";
import {
  ChatMessage,
  OfficeTopBar,
  OwnerBriefingCard,
} from "@/components/office/OfficeHUD";
import {
  CameraPresetId,
  EMPLOYEES,
  EMPLOYEE_MAP,
  EmployeeId,
  StationId,
} from "@/lib/officeLayout";

type EmployeeCommand = { station: StationId; seq: number };
type EmployeeLiveState = { station: StationId; moving: boolean };
type BubbleState = { text: string; seq: number };

function createInitialCommands(): Record<EmployeeId, EmployeeCommand> {
  return Object.fromEntries(
    EMPLOYEES.map((e) => [e.id, { station: "desk" as StationId, seq: 0 }]),
  ) as Record<EmployeeId, EmployeeCommand>;
}

function createInitialStates(): Record<EmployeeId, EmployeeLiveState> {
  return Object.fromEntries(
    EMPLOYEES.map((e) => [e.id, { station: "desk" as StationId, moving: false }]),
  ) as Record<EmployeeId, EmployeeLiveState>;
}

function createInitialGreets(): Record<EmployeeId, number> {
  return Object.fromEntries(EMPLOYEES.map((e) => [e.id, 0])) as Record<EmployeeId, number>;
}

function createInitialBubbles(): Record<EmployeeId, BubbleState> {
  return Object.fromEntries(
    EMPLOYEES.map((e) => [e.id, { text: "", seq: 0 }]),
  ) as Record<EmployeeId, BubbleState>;
}

function createInitialChatHistory(): Record<EmployeeId, ChatMessage[]> {
  return Object.fromEntries(
    EMPLOYEES.map((e) => [
      e.id,
      [
        {
          id: `init-${e.id}`,
          sender: "agent" as const,
          text: e.updateSummaryId,
          time: "09:00",
          proposal: {
            actionText: e.proposalId,
            status: "pending" as const,
          },
        },
      ],
    ]),
  ) as Record<EmployeeId, ChatMessage[]>;
}

function formatNowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function Home() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<EmployeeId>("threads");
  const [employeeCommands, setEmployeeCommands] = useState(createInitialCommands);
  const [employeeStates, setEmployeeStates] = useState(createInitialStates);
  const [greetSignals, setGreetSignals] = useState(createInitialGreets);
  const [customBubbles, setCustomBubbles] = useState(createInitialBubbles);
  const [chatHistory, setChatHistory] = useState(createInitialChatHistory);
  const [autoRoutine, setAutoRoutine] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>("isometric");
  const [language, setLanguage] = useState<"id" | "en">("id");

  const sendEmployeeTo = useCallback((empId: EmployeeId, station: StationId) => {
    setEmployeeCommands((prev) => ({
      ...prev,
      [empId]: { station, seq: prev[empId].seq + 1 },
    }));
  }, []);

  const handleCallUpdate = useCallback(
    (empId?: EmployeeId) => {
      const targetId = empId ?? selectedEmployeeId;
      const emp = EMPLOYEE_MAP[targetId];
      setSelectedEmployeeId(targetId);
      setCameraPreset("owner");
      sendEmployeeTo(targetId, "owner_update");

      // Ensure a fresh pending progress proposal exists in Room Chat when called to Owner Desk
      setChatHistory((prev) => {
        const list = prev[targetId] ?? [];
        const hasPending = list.some((m) => m.proposal?.status === "pending");
        if (hasPending) return prev;
        return {
          ...prev,
          [targetId]: [
            ...list,
            {
              id: `report-${Date.now()}`,
              sender: "agent",
              text: language === "id" ? emp.updateSummaryId : emp.updateSummaryEn,
              time: formatNowTime(),
              proposal: {
                actionText: language === "id" ? emp.proposalId : emp.proposalEn,
                status: "pending",
              },
            },
          ],
        };
      });
    },
    [language, selectedEmployeeId, sendEmployeeTo],
  );

  const handleProposalDecision = useCallback(
    (empId: EmployeeId, decision: "executed" | "done", messageId?: string) => {
      const emp = EMPLOYEE_MAP[empId];
      const nowTime = formatNowTime();

      const ownerText =
        decision === "executed"
          ? language === "id"
            ? "✅ Lakukan — silakan langsung eksekusi pengajuan ini."
            : "✅ Execute — go ahead and run this action."
          : language === "id"
            ? "✔ Selesai — laporan diterima, cukup dulu untuk sekarang."
            : "✔ Done — update received, no further action needed right now.";

      const agentReply =
        decision === "executed"
          ? language === "id"
            ? `Siap Boss! Langsung saya kerjakan sekarang di meja (${emp.role}).`
            : `On it Boss! Heading back to execute this right away (${emp.role}).`
          : language === "id"
            ? "Baik Boss, laporan saya tutup. Saya kembali stand-by di meja kerja."
            : "Understood Boss, report closed. Returning to my desk on standby.";

      setChatHistory((prev) => {
        const list = prev[empId] ?? [];
        // Update matching messageId (or latest pending proposal if triggered from Briefing Card)
        let targetId = messageId;
        if (!targetId) {
          for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].proposal?.status === "pending") {
              targetId = list[i].id;
              break;
            }
          }
        }

        const updated = list.map((m) =>
          m.id === targetId && m.proposal
            ? { ...m, proposal: { ...m.proposal, status: decision } }
            : m,
        );

        return {
          ...prev,
          [empId]: [
            ...updated,
            { id: `o-${Date.now()}`, sender: "owner", text: ownerText, time: nowTime },
            { id: `a-${Date.now() + 1}`, sender: "agent", text: agentReply, time: nowTime },
          ],
        };
      });

      // Show agent's response bubble above their head & send them back to their desk!
      setCustomBubbles((prev) => ({
        ...prev,
        [empId]: { text: agentReply, seq: prev[empId].seq + 1 },
      }));
      sendEmployeeTo(empId, "desk");
    },
    [language, sendEmployeeTo],
  );

  const handleGreet = useCallback(() => {
    setGreetSignals((prev) => ({
      ...prev,
      [selectedEmployeeId]: prev[selectedEmployeeId] + 1,
    }));
  }, [selectedEmployeeId]);

  const handleSendMessage = useCallback(
    (empId: EmployeeId, text: string) => {
      const emp = EMPLOYEE_MAP[empId];
      const nowTime = formatNowTime();
      const replyText =
        language === "id"
          ? `Siap Boss! Saya sudah catat arahan "${text}". Mau langsung saya eksekusi sekarang?`
          : `Got it Boss! I've noted "${text}". Should I proceed and execute this now?`;

      setChatHistory((prev) => ({
        ...prev,
        [empId]: [
          ...prev[empId],
          { id: `o-${Date.now()}`, sender: "owner", text, time: nowTime },
          {
            id: `a-${Date.now() + 1}`,
            sender: "agent",
            text: replyText,
            time: nowTime,
            proposal: {
              actionText:
                language === "id"
                  ? `[${emp.role}] Eksekusi arahan: "${text}"`
                  : `[${emp.role}] Execute instruction: "${text}"`,
              status: "pending",
            },
          },
        ],
      }));

      setCustomBubbles((prev) => ({
        ...prev,
        [empId]: { text: replyText, seq: prev[empId].seq + 1 },
      }));
    },
    [language],
  );

  const handleEmployeeStateChange = useCallback(
    (info: { id: EmployeeId; station: StationId; moving: boolean }) => {
      setEmployeeStates((prev) => ({
        ...prev,
        [info.id]: { station: info.station, moving: info.moving },
      }));
    },
    [],
  );

  const selectedLive = employeeStates[selectedEmployeeId];
  const showBriefing =
    selectedLive.station === "owner_update" && !selectedLive.moving;

  return (
    <main className="fixed inset-0 flex h-full w-full flex-col overflow-hidden bg-[#0b1019] text-white">
      <OfficeTopBar
        selectedEmployeeId={selectedEmployeeId}
        employeeStates={employeeStates}
        chatHistory={chatHistory}
        autoRoutine={autoRoutine}
        cameraPreset={cameraPreset}
        language={language}
        onSelectEmployee={setSelectedEmployeeId}
        onCallUpdate={handleCallUpdate}
        onSendMessage={handleSendMessage}
        onProposalDecision={handleProposalDecision}
        onToggleAuto={() => setAutoRoutine((v) => !v)}
        onSelectCamera={setCameraPreset}
        onGreet={handleGreet}
        onToggleLanguage={() => setLanguage((l) => (l === "id" ? "en" : "id"))}
      />

      <section className="relative min-h-0 flex-1 w-full overflow-hidden">
        <IsometricOffice2D
          cameraPreset={cameraPreset}
          selectedEmployeeId={selectedEmployeeId}
          employeeCommands={employeeCommands}
          greetSignals={greetSignals}
          customBubbles={customBubbles}
          autoRoutine={autoRoutine}
          language={language}
          onSelectEmployee={setSelectedEmployeeId}
          onFocusRoom={setCameraPreset}
          onEmployeeStateChange={handleEmployeeStateChange}
        />

        {showBriefing && (
          <OwnerBriefingCard
            employeeId={selectedEmployeeId}
            language={language}
            onExecute={() => handleProposalDecision(selectedEmployeeId, "executed")}
            onFinish={() => handleProposalDecision(selectedEmployeeId, "done")}
          />
        )}
      </section>
    </main>
  );
}
