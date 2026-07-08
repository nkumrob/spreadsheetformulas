"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { ParsedWorkbook, WorkbookFinding } from "@/lib/workbook-analysis";

// The editor pulls in the spreadsheet engine + parser — load it only when needed.
const WorkbookEditor = dynamic(() => import("./WorkbookEditor"), {
  ssr: false,
  loading: () => <p className="mt-10 font-mono text-[13px] text-ink-faint">Opening workbook…</p>,
});

const MAX_BYTES = 8 * 1024 * 1024;

type State =
  | { phase: "idle"; error?: string }
  | { phase: "working"; name: string }
  | { phase: "ready"; name: string; workbook: ParsedWorkbook; findings: WorkbookFinding[] };

export function WorkbookAnalyzer() {
  const [state, setState] = useState<State>({ phase: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function analyze(file: File) {
    if (file.size > MAX_BYTES) {
      setState({ phase: "idle", error: "That file is over 8 MB — trim it down or split it first." });
      return;
    }
    if (!/\.(xlsx|csv)$/i.test(file.name)) {
      setState({ phase: "idle", error: "Upload an .xlsx or .csv file. From Google Sheets: File → Download → .xlsx." });
      return;
    }
    setState({ phase: "working", name: file.name });
    try {
      const lib = await import("@/lib/workbook-analysis");
      const buffer = await file.arrayBuffer();
      const workbook = lib.parseWorkbook(buffer);
      if (workbook.sheets.length === 0) {
        setState({ phase: "idle", error: "We couldn't find any sheets with data in that file." });
        return;
      }
      const report = lib.analyzeWorkbook(workbook);
      const recompute = lib.recomputeFindings(workbook);
      const findings = [...report.findings, ...recompute];
      track("tool_use", { tool: "workbook-analyzer", findings: String(findings.length) });
      setState({ phase: "ready", name: file.name, workbook, findings });
    } catch {
      setState({ phase: "idle", error: "That file couldn't be read. If it's an old .xls, re-save it as .xlsx and try again." });
    }
  }

  if (state.phase === "ready") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setState({ phase: "idle" })}
          className="text-[13px] font-medium text-ink-faint hover:text-ink-soft"
        >
          ← Analyze a different file
        </button>
        <WorkbookEditor name={state.name} workbook={state.workbook} initialFindings={state.findings} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void analyze(file);
        }}
        className={`relative rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging ? "border-ledger bg-ledger-tint/40" : "border-rule bg-white"
        }`}
      >
        <p className="font-display text-[24px] text-ink">
          {state.phase === "working" ? `Opening ${state.name}…` : "Drop your spreadsheet here"}
        </p>
        <p className="mt-2 text-[14px] text-ink-soft">
          It opens right here as an editable grid — click cells, fix formulas, watch everything
          recompute, then download the repaired file.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={state.phase === "working"}
          className="mt-5 rounded-lg bg-ledger px-5 py-2.5 text-[14px] font-semibold text-paper transition-colors hover:bg-ledger-deep disabled:opacity-50"
        >
          {state.phase === "working" ? "Opening…" : "Choose a file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          aria-label="Upload a spreadsheet"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void analyze(file);
            e.target.value = "";
          }}
        />
        <p className="mt-5 flex items-center justify-center gap-2 text-[12.5px] font-medium text-ledger-deep">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
            <path d="M6 1L1 3v4c0 3 2.2 5.3 5 6 2.8-.7 5-3 5-6V3L6 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          Your file never leaves this browser — parsing, editing, and recomputation happen locally.
        </p>
        {state.phase === "idle" && state.error ? (
          <p role="alert" className="mt-4 text-[13.5px] font-medium text-rust">
            {state.error}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-[12.5px] text-ink-faint">
        .xlsx or .csv, up to 8 MB. From Google Sheets: File → Download → Microsoft Excel (.xlsx).
      </p>
    </div>
  );
}
