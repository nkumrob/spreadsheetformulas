"use client";

import { track } from "@/lib/analytics";

/** Download link for a page's engine-verified proof sheet (.xlsx). */
export function ProofDownload({ slug }: { slug: string }) {
  return (
    <a
      href={`/proofs/${slug}.xlsx`}
      download
      onClick={() => track("proof_download", { slug })}
      className="font-medium text-ledger-deep underline decoration-ledger/40 underline-offset-2 hover:decoration-ledger"
    >
      Download the proof sheet (.xlsx)
    </a>
  );
}
