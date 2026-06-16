import { Lock, FileText, Printer, X } from "lucide-react"
import { ENGAGEMENT } from "@/lib/audit-data"

function MetaSep() {
  return <span className="text-border">·</span>
}

export function AuditHeader() {
  return (
    <header>
      {/* Thomson Reuters brand bar */}
      <div className="bg-brand text-brand-foreground">
        <div className="mx-auto flex h-11 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold tracking-tight">Thomson Reuters</span>
            <span className="h-4 w-px bg-brand-foreground/30" aria-hidden="true" />
            <span className="font-medium">Review Wizard</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-foreground/85">
            <Lock aria-hidden="true" className="size-3.5" />
            <span>Verification complete · read-only record</span>
          </div>
        </div>
      </div>

      {/* Title block */}
      <div className="relative border-b border-border bg-card">
        {/* Centered close affordance (read-only modal chrome) */}
        <div className="pointer-events-none absolute inset-x-0 -top-5 flex justify-center">
          <button
            type="button"
            aria-label="Close audit log"
            className="pointer-events-auto flex size-12 items-center justify-center rounded-full bg-muted-foreground/70 text-background shadow-sm transition-colors hover:bg-muted-foreground"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 pt-8 pb-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground text-balance">
              Review wizard audit log
            </h1>
            <p className="mt-1.5 text-sm">
              <span className="font-semibold text-foreground">
                {ENGAGEMENT.taxpayer}
              </span>{" "}
              <span className="font-mono text-link">({ENGAGEMENT.clientId})</span>
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span>
                Domain <span className="font-mono">{ENGAGEMENT.domain}</span>
              </span>
              <MetaSep />
              <span>{ENGAGEMENT.returnType}</span>
              <MetaSep />
              <span>{ENGAGEMENT.taxYear}</span>
              <MetaSep />
              <span>{ENGAGEMENT.actionCount} actions</span>
              <MetaSep />
              <span>{ENGAGEMENT.fieldValueCount} field values</span>
              <MetaSep />
              <span>{ENGAGEMENT.contributorCount} contributors</span>
              <MetaSep />
              <span>{ENGAGEMENT.dateRange}</span>
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-input bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Export CSV
              </button>
              <button
                type="button"
                className="rounded-md border border-input bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Export PDF
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Printer aria-hidden="true" className="size-4" />
                Print
              </button>
            </div>
            <FileText
              aria-label="PDF record"
              className="size-6 text-destructive"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
