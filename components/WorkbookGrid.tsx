"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkbookSession } from "@/lib/workbook-session";
import type { FindingKind } from "@/lib/workbook-analysis";

const ROW_H = 30;
const COL_W = 116;
const HEAD_W = 46;
const OVERSCAN = 6;
const VIEW_H = 520;

export function colLetter(index: number): string {
  let name = "";
  let i = index;
  do {
    name = String.fromCharCode(65 + (i % 26)) + name;
    i = Math.floor(i / 26) - 1;
  } while (i >= 0);
  return name;
}

const FINDING_TINT: Record<string, string> = {
  "error-cell": "bg-rust-tint/70",
  "stale-value": "bg-gold-tint/70",
  "inconsistent-formula": "bg-gold-tint/70",
  "number-as-text": "bg-gold-tint/40",
  "extra-spaces": "bg-gold-tint/40",
  "cannot-evaluate": "bg-cream",
};

export type Selection = { r: number; c: number };

export function WorkbookGrid({
  session,
  sheet,
  selection,
  onSelect,
  onCommit,
  version,
  findingCells,
}: {
  session: WorkbookSession;
  sheet: string;
  selection: Selection;
  onSelect: (next: Selection) => void;
  onCommit: (selection: Selection, input: string) => void;
  version: number;
  findingCells: Map<string, FindingKind>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [editing, setEditing] = useState<{ draft: string } | null>(null);

  const dims = session.dimensions(sheet);
  const firstRow = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const visibleCount = Math.ceil(VIEW_H / ROW_H) + OVERSCAN * 2;
  const lastRow = Math.min(dims.rows, firstRow + visibleCount);

  // Keep the selected cell in view when selection moves (arrow keys, finding jumps).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const top = selection.r * ROW_H;
    if (top < container.scrollTop) container.scrollTop = top;
    else if (top + ROW_H > container.scrollTop + VIEW_H - ROW_H) {
      container.scrollTop = top - VIEW_H + ROW_H * 2;
    }
    const left = HEAD_W + selection.c * COL_W;
    if (left < container.scrollLeft + HEAD_W) container.scrollLeft = left - HEAD_W;
    else if (left + COL_W > container.scrollLeft + container.clientWidth) {
      container.scrollLeft = left + COL_W - container.clientWidth;
    }
  }, [selection]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function startEdit(draft?: string) {
    setEditing({ draft: draft ?? session.cellContent(sheet, selection.r, selection.c) });
  }

  function commitEdit(move: { dr: number; dc: number } | null) {
    if (editing) onCommit(selection, editing.draft);
    setEditing(null);
    if (move) {
      onSelect({
        r: Math.min(Math.max(selection.r + move.dr, 0), dims.rows - 1),
        c: Math.min(Math.max(selection.c + move.dc, 0), dims.cols - 1),
      });
    }
    containerRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (editing) return;
    const move = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[event.key];
    if (move) {
      event.preventDefault();
      onSelect({
        r: Math.min(Math.max(selection.r + move[0], 0), dims.rows - 1),
        c: Math.min(Math.max(selection.c + move[1], 0), dims.cols - 1),
      });
      return;
    }
    if (event.key === "Enter" || event.key === "F2") {
      event.preventDefault();
      startEdit();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      onCommit(selection, "");
    } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      startEdit(event.key);
    }
  }

  const rows = [];
  for (let r = firstRow; r < lastRow; r++) {
    const cells = [];
    for (let c = 0; c < dims.cols; c++) {
      const isSelected = selection.r === r && selection.c === c;
      const isEditing = isSelected && editing !== null;
      const view = session.cellView(sheet, r, c);
      const tint = FINDING_TINT[findingCells.get(`${r}:${c}`) ?? ""] ?? "";
      cells.push(
        <td
          key={c}
          data-cell={`${colLetter(c)}${r + 1}`}
          title={view.isCached ? "Value from your file — our engine can't recalculate this formula" : undefined}
          onMouseDown={(e) => {
            if (editing && !isSelected) commitEdit(null);
            e.preventDefault();
            onSelect({ r, c });
            containerRef.current?.focus();
          }}
          onDoubleClick={() => startEdit()}
          className={`relative overflow-hidden border-b border-r border-rule px-2 text-[13px] leading-[29px] ${tint} ${
            view.isError
              ? "font-mono text-[12px] font-semibold text-rust"
              : view.isNumber
                ? "tabular text-right font-mono text-[12.5px] text-ink"
                : "whitespace-nowrap text-ink-soft"
          } ${view.isFormula && !view.isError ? "text-ledger-deep" : ""} ${view.isCached ? "italic opacity-75" : ""}`}
          style={{ minWidth: COL_W, maxWidth: COL_W, height: ROW_H }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={editing.draft}
              onChange={(e) => setEditing({ draft: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit({ dr: 1, dc: 0 });
                else if (e.key === "Tab") {
                  e.preventDefault();
                  commitEdit({ dr: 0, dc: 1 });
                } else if (e.key === "Escape") setEditing(null);
                e.stopPropagation();
              }}
              onBlur={() => commitEdit(null)}
              className="absolute inset-0 z-10 w-full border-2 border-ledger bg-white px-1.5 font-mono text-[13px] text-ink outline-none"
              aria-label={`Edit cell ${colLetter(c)}${r + 1}`}
            />
          ) : (
            view.display
          )}
          {isSelected && !isEditing ? (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 border-2 border-ledger">
              <span className="absolute -bottom-[3px] -right-[3px] h-[7px] w-[7px] rounded-[1px] border border-white bg-ledger" />
            </span>
          ) : null}
        </td>,
      );
    }
    rows.push(
      <tr key={r}>
        <th
          scope="row"
          className="sticky left-0 z-10 border-b border-r border-rule bg-cream px-1 text-center font-mono text-[11px] font-medium text-ink-faint"
          style={{ minWidth: HEAD_W, height: ROW_H }}
        >
          {r + 1}
        </th>
        {cells}
      </tr>,
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="grid"
      aria-label={`Sheet ${sheet}`}
      onKeyDown={onKeyDown}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      className="overflow-auto rounded-lg border border-rule bg-white shadow-bar outline-none focus-visible:ring-2 focus-visible:ring-ledger/50"
      style={{ height: VIEW_H }}
      data-version={version}
    >
      <table className="border-separate border-spacing-0" style={{ width: HEAD_W + dims.cols * COL_W }}>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 border-b border-r border-rule bg-cream" style={{ minWidth: HEAD_W, height: 28 }} />
            {Array.from({ length: dims.cols }, (_, c) => (
              <th
                key={c}
                className={`sticky top-0 z-20 border-b border-r border-rule bg-cream px-2 text-center font-mono text-[11px] font-medium ${
                  selection.c === c ? "text-ledger-deep" : "text-ink-faint"
                }`}
                style={{ minWidth: COL_W, height: 28 }}
              >
                {colLetter(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {firstRow > 0 ? (
            <tr style={{ height: firstRow * ROW_H }}>
              <td colSpan={dims.cols + 1} className="p-0" />
            </tr>
          ) : null}
          {rows}
          {lastRow < dims.rows ? (
            <tr style={{ height: (dims.rows - lastRow) * ROW_H }}>
              <td colSpan={dims.cols + 1} className="p-0" />
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
