"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { WorkbookSession } from "@/lib/workbook-session";
import {
  exportWorkbook,
  type FindingKind,
  type ParsedWorkbook,
  type WorkbookFinding,
} from "@/lib/workbook-analysis";
import { checkFormula } from "@/lib/formula-check";
import { track } from "@/lib/analytics";
import { WorkbookGrid, colLetter, type Selection } from "./WorkbookGrid";

function decodeAddress(cell: string): Selection | null {
  const match = /^([A-Z]+)([0-9]+)$/.exec(cell);
  if (!match) return null;
  let c = 0;
  for (const ch of match[1]) c = c * 26 + (ch.charCodeAt(0) - 64);
  return { r: Number(match[2]) - 1, c: c - 1 };
}

const KIND_LABEL: Record<FindingKind, string> = {
  "error-cell": "error",
  "stale-value": "stale value",
  "inconsistent-formula": "breaks pattern",
  "number-as-text": "number as text",
  "extra-spaces": "stray spaces",
  "cannot-evaluate": "not checked",
};

export default function WorkbookEditor({
  name,
  workbook,
  initialFindings,
}: {
  name: string;
  workbook: ParsedWorkbook;
  initialFindings: WorkbookFinding[];
}) {
  // Create + destroy are paired inside one effect so React StrictMode's
  // dev double-mount gets its own fresh engine each time (a memoized
  // session destroyed by the first unmount crashed the second mount).
  const [session, setSession] = useState<WorkbookSession | null>(null);
  useEffect(() => {
    const next = WorkbookSession.open(workbook);
    setSession(next);
    return () => next.destroy();
  }, [workbook]);

  const [sheet, setSheet] = useState(workbook.sheets[0].name);
  const [selection, setSelection] = useState<Selection>({ r: 0, c: 0 });
  const [version, setVersion] = useState(0);
  const [findings, setFindings] = useState(initialFindings);
  const [edited, setEdited] = useState(false);
  const [barDraft, setBarDraft] = useState("");
  const barFocused = useRef(false);

  // Formula bar mirrors the selected cell unless the user is typing in it.
  useEffect(() => {
    if (session && !barFocused.current) {
      setBarDraft(session.cellContent(sheet, selection.r, selection.c));
    }
  }, [session, sheet, selection, version]);

  const sheetFindings = findings.filter((f) => f.sheet === sheet);
  const findingCells = useMemo(() => {
    const map = new Map<string, FindingKind>();
    for (const finding of sheetFindings) {
      const address = decodeAddress(finding.cell);
      if (address) map.set(`${address.r}:${address.c}`, finding.kind);
    }
    return map;
  }, [sheetFindings]);

  if (!session) {
    return <p className="mt-10 font-mono text-[13px] text-ink-faint">Opening workbook…</p>;
  }

  function commit(target: Selection, input: string) {
    session!.setCell(sheet, target.r, target.c, input);
    setVersion((v) => v + 1);
    setEdited(true);
  }

  function rescan() {
    const next = session!.scanFindings();
    setFindings(next);
    track("tool_use", { tool: "workbook-rescan", findings: String(next.length) });
  }

  function download() {
    const bytes = exportWorkbook(session!.snapshot());
    const blob = new Blob([bytes as BlobPart], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${name.replace(/\.(xlsx|csv)$/i, "")}-fixed.xlsx`;
    anchor.click();
    URL.revokeObjectURL(url);
    track("tool_use", { tool: "workbook-download" });
  }

  const barChecks = barDraft.trim().startsWith("=") ? checkFormula(barDraft).slice(0, 2) : [];

  return (
    <div className="mt-10">
      {/* Header row: name, tabs, actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="truncate font-display text-[22px] text-ink">{name}</h2>
          {session.sheetNames().length > 1 ? (
            <div className="flex gap-0.5 rounded-md border border-rule bg-cream p-0.5">
              {session.sheetNames().map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSheet(s);
                    setSelection({ r: 0, c: 0 });
                  }}
                  className={`rounded px-2.5 py-1 text-[12.5px] font-medium ${
                    s === sheet ? "bg-white text-ink shadow-bar" : "text-ink-faint hover:text-ink-soft"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={rescan}
            className="rounded-md border border-rule bg-white px-3 py-1.5 text-[13px] font-medium text-ink-soft shadow-bar hover:text-ink"
          >
            Re-scan
          </button>
          <button
            type="button"
            onClick={download}
            className="rounded-md bg-ledger px-3.5 py-1.5 text-[13px] font-semibold text-paper hover:bg-ledger-deep"
          >
            Download {edited ? "fixed " : ""}.xlsx
          </button>
        </div>
      </div>

      {/* Formula bar */}
      <div className="mb-2 flex items-center gap-2.5 rounded-lg border border-rule bg-white py-1.5 pl-3 pr-1.5 shadow-bar">
        <span className="rounded bg-cream px-1.5 py-0.5 font-mono text-[11.5px] font-medium text-ink-soft tabular">
          {colLetter(selection.c)}
          {selection.r + 1}
        </span>
        <span aria-hidden="true" className="select-none font-display text-base italic leading-none text-ledger">fx</span>
        <span aria-hidden="true" className="h-5 w-px bg-rule" />
        <input
          value={barDraft}
          onFocus={() => (barFocused.current = true)}
          onBlur={() => (barFocused.current = false)}
          onChange={(e) => setBarDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit(selection, barDraft);
              barFocused.current = false;
              e.currentTarget.blur();
            } else if (e.key === "Escape") {
              setBarDraft(session.cellContent(sheet, selection.r, selection.c));
              e.currentTarget.blur();
            }
          }}
          placeholder="Select a cell, then type a value or =formula"
          aria-label="Formula bar"
          className="min-w-0 flex-1 bg-transparent py-1 font-mono text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
        />
      </div>
      {barChecks.length > 0 ? (
        <ul className="mb-2 space-y-1">
          {barChecks.map((finding, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] text-ink-soft">
              <span aria-hidden="true" className="font-mono text-rust">!</span>
              {finding.message}{" "}
              {finding.link ? (
                <Link href={finding.link} className="font-medium text-ledger-deep hover:underline">Guide →</Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <WorkbookGrid
        session={session}
        sheet={sheet}
        selection={selection}
        onSelect={setSelection}
        onCommit={commit}
        version={version}
        findingCells={findingCells}
      />

      <p className="mt-2 text-[12px] text-ink-faint">
        Click a cell to select · double-click or Enter to edit · arrows to move · edits recompute
        instantly · nothing leaves your browser. <em>Italic cells</em> show your file&apos;s saved
        value for formulas our engine can&apos;t recalculate. Downloads carry values, formulas, and
        number formats — charts and cell styling from the original aren&apos;t included.
      </p>
      {workbook.truncated?.map((notice) => (
        <p key={notice} className="mt-2 rounded-md bg-gold-tint px-3 py-2 text-[12.5px] text-gold">
          {notice} Edits and downloads cover the loaded portion only.
        </p>
      ))}

      {/* Findings */}
      <section aria-label="Findings" className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-[22px] text-ink">
            {findings.length === 0 ? "No problems found" : `${findings.length} finding${findings.length === 1 ? "" : "s"}`}
          </h3>
          {edited ? (
            <span className="text-[12.5px] text-ink-faint">You&apos;ve made edits — hit Re-scan to refresh this list.</span>
          ) : null}
        </div>
        {findings.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {findings.slice(0, 24).map((finding, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    setSheet(finding.sheet);
                    const address = decodeAddress(finding.cell);
                    if (address) setSelection(address);
                  }}
                  className="flex w-full items-baseline gap-2.5 rounded-lg border border-rule bg-white px-3.5 py-2.5 text-left shadow-bar transition-colors hover:border-ledger/50"
                >
                  <code className="shrink-0 rounded bg-cream px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink">
                    {finding.cell}
                  </code>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-soft">{finding.detail}</span>
                  <span className="shrink-0 font-mono text-[10.5px] text-ink-faint">{KIND_LABEL[finding.kind]}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-ink-soft">
            No error cells, no text-formatted numbers, and every formula matches its column&apos;s
            pattern. Click any cell to inspect or edit it.
          </p>
        )}
        {findings.length > 24 ? (
          <p className="mt-2 font-mono text-[12px] text-ink-faint">+{findings.length - 24} more — fix a batch and re-scan</p>
        ) : null}
      </section>
    </div>
  );
}
