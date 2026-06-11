"use client"

import {
  ArrowRight,
  Copy,
  FileText,
  Info,
  Layers,
  User as UserIcon,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { WizardBadge, StatusBadge } from "@/components/activity-badges"
import { CompareCards } from "@/components/compare-cards"
import {
  type ActivityLog,
  formatTimestamp,
  wizardMeta,
} from "@/lib/activity-data"
import { cn } from "@/lib/utils"

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground text-pretty">{value}</span>
    </div>
  )
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Info
  children: React.ReactNode
}) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </h3>
  )
}

export function ActivityDetailDrawer({
  activity,
  open,
  onOpenChange,
}: {
  activity: ActivityLog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!activity) return null
  const a = activity
  const meta = wizardMeta[a.wizard]

  const isVerification = a.wizard === "verification"
  const isAssociation = a.wizard === "cfa" || a.wizard === "nfr"
  const isSuperseded = a.wizard === "superseded"
  const isDuplicate = a.wizard === "duplicate"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="gap-3 border-b p-5">
          <div className="flex flex-wrap items-center gap-2">
            <WizardBadge wizard={a.wizard} />
            <StatusBadge status={a.status} />
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {a.id}
            </span>
          </div>
          <SheetTitle className="text-balance text-lg leading-snug">
            {a.actionType}: {a.fieldOrAssociation}
          </SheetTitle>
          <SheetDescription className="text-pretty">
            {meta.description}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-5">
          {/* Comparison */}
          <section className="flex flex-col gap-3">
            <SectionTitle icon={ArrowRight}>Before / After</SectionTitle>
            {isVerification && (
              <CompareCards
                items={[
                  {
                    label: "OCR / AI Captured",
                    value: a.ocrValue ?? "—",
                    tone: "ocr",
                  },
                  {
                    label: "Original Verified",
                    value: a.previousValue,
                    tone: "previous",
                  },
                  {
                    label: "Final Verified",
                    value: a.newValue,
                    tone: "new",
                  },
                ]}
              />
            )}
            {isAssociation && (
              <CompareCards
                items={[
                  {
                    label: "Previous Association",
                    value: a.previousAssociation ?? a.previousValue,
                    tone: "previous",
                  },
                  {
                    label: "New Association",
                    value: a.newAssociation ?? a.newValue,
                    tone: "new",
                  },
                ]}
              />
            )}
            {isSuperseded && (
              <CompareCards
                items={[
                  {
                    label: "Superseded Document",
                    value: a.supersededDocument ?? "—",
                    tone: "suppressed",
                  },
                  {
                    label: "Current Document",
                    value: a.currentDocument ?? "—",
                    tone: "retained",
                  },
                ]}
              />
            )}
            {isDuplicate && (
              <CompareCards
                items={[
                  {
                    label: "Retained",
                    value: a.retainedValue ?? "—",
                    tone: "retained",
                  },
                  {
                    label: "Suppressed",
                    value: a.suppressedValue ?? "—",
                    tone: "suppressed",
                  },
                ]}
              />
            )}
          </section>

          {/* Confidence */}
          {typeof a.confidence === "number" && (
            <section className="flex flex-col gap-2">
              <SectionTitle icon={Info}>Confidence Score</SectionTitle>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      a.confidence >= 0.85
                        ? "bg-confirmed"
                        : a.confidence >= 0.7
                          ? "bg-superseded"
                          : "bg-duplicate",
                    )}
                    style={{ width: `${Math.round(a.confidence * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-medium tabular-nums">
                  {Math.round(a.confidence * 100)}%
                </span>
              </div>
            </section>
          )}

          {typeof a.similarity === "number" && (
            <section className="flex flex-col gap-2">
              <SectionTitle icon={Layers}>System Similarity</SectionTitle>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-superseded"
                    style={{ width: `${Math.round(a.similarity * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-medium tabular-nums">
                  {Math.round(a.similarity * 100)}%
                </span>
              </div>
            </section>
          )}

          <Separator />

          {/* Context */}
          <section className="flex flex-col gap-4">
            <SectionTitle icon={FileText}>Context</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Client" value={a.client} />
              <Field label="Return ID" value={a.returnId} />
              <Field label="Tax Year" value={String(a.taxYear)} />
              <Field label="Wizard" value={meta.label} />
              <Field label="Document" value={a.document} />
              <Field label="Form" value={a.form} />
              <Field label="Area / Section" value={a.area} />
              <Field label="Timestamp" value={formatTimestamp(a.timestamp)} />
            </div>
          </section>

          <Separator />

          {/* User */}
          <section className="flex flex-col gap-4">
            <SectionTitle icon={UserIcon}>Performed By</SectionTitle>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-verification-subtle text-sm font-semibold text-verification">
                {a.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{a.user}</span>
                <span className="text-xs text-muted-foreground">
                  {a.userRole}
                </span>
              </div>
            </div>
          </section>

          {a.notes && (
            <>
              <Separator />
              <section className="flex flex-col gap-2">
                <SectionTitle icon={Info}>Notes / Comments</SectionTitle>
                <p className="rounded-lg border bg-muted/40 p-3 text-sm leading-relaxed text-pretty">
                  {a.notes}
                </p>
              </section>
            </>
          )}

          {/* Downstream impact */}
          <section className="flex items-start gap-3 rounded-lg border border-verification/20 bg-verification-subtle p-3">
            <Info
              className="mt-0.5 size-4 shrink-0 text-verification"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-verification">
                Downstream impact
              </span>
              <span className="text-sm leading-relaxed text-foreground text-pretty">
                {a.downstreamImpact}
              </span>
            </div>
          </section>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Copy className="size-3.5" aria-hidden="true" />
              Copy Activity Summary
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
