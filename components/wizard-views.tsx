"use client"

import { ArrowRight, FileText, Layers } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/activity-badges"
import {
  type ActivityLog,
  formatTimestamp,
} from "@/lib/activity-data"
import { cn } from "@/lib/utils"

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border bg-card py-16 text-center">
      <p className="text-sm font-medium">No {label} found</p>
      <p className="text-sm text-muted-foreground">
        Try adjusting or clearing your filters.
      </p>
    </div>
  )
}

/* ---------------- Verification edit history ---------------- */

export function VerificationView({
  activities,
  onSelect,
}: {
  activities: ActivityLog[]
  onSelect: (a: ActivityLog) => void
}) {
  if (activities.length === 0) return <EmptyState label="verification edits" />
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Field</TableHead>
              <TableHead>Form / Document</TableHead>
              <TableHead>OCR / AI Value</TableHead>
              <TableHead>Previous Value</TableHead>
              <TableHead>Updated Value</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Edited By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((a) => (
              <TableRow
                key={a.id}
                className="cursor-pointer"
                onClick={() => onSelect(a)}
              >
                <TableCell className="font-medium">
                  {a.fieldOrAssociation}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{a.form}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.document}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {a.ocrValue ?? "—"}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {a.previousValue}
                </TableCell>
                <TableCell className="font-mono text-xs font-medium">
                  {a.newValue}
                </TableCell>
                <TableCell>
                  {typeof a.confidence === "number" ? (
                    <ConfidencePill value={a.confidence} />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  <div className="flex flex-col">
                    {a.user}
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(a.timestamp)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={a.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(a)
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ConfidencePill({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const tone =
    value >= 0.85
      ? "bg-confirmed-subtle text-confirmed"
      : value >= 0.7
        ? "bg-superseded-subtle text-superseded"
        : "bg-duplicate-subtle text-duplicate"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-medium",
        tone,
      )}
    >
      {pct}%
    </span>
  )
}

/* ---------------- Document association (CFA / NFR) ---------------- */

export function AssociationView({
  activities,
  onSelect,
}: {
  activities: ActivityLog[]
  onSelect: (a: ActivityLog) => void
}) {
  if (activities.length === 0) return <EmptyState label="associations" />
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {activities.map((a) => (
        <Card
          key={a.id}
          className="cursor-pointer gap-4 p-4 transition-colors hover:border-association/40"
          onClick={() => onSelect(a)}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-association">
              {a.wizard.toUpperCase()}
            </span>
            <StatusBadge status={a.status} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 flex-col gap-1 rounded-lg border bg-muted/40 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {a.wizard === "nfr" ? "Source Document" : "Child Document"}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                {a.childDocument ?? a.document}
              </span>
            </div>
            <ArrowRight className="size-4 shrink-0 text-association" />
            <div className="flex flex-1 flex-col gap-1 rounded-lg border border-association/30 bg-association-subtle p-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-association">
                {a.wizard === "nfr" ? "Proforma Form" : "Parent Form"}
              </span>
              <span className="text-sm font-medium text-foreground">
                {a.parentForm ?? a.form}
              </span>
              <span className="text-xs text-muted-foreground">{a.area}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
            <span>
              Was:{" "}
              <span className="text-foreground">
                {a.previousAssociation ?? a.previousValue}
              </span>
            </span>
            <span>
              {a.user} · {formatTimestamp(a.timestamp)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}

/* ---------------- Superseded documents ---------------- */

export function SupersededView({
  activities,
  onSelect,
}: {
  activities: ActivityLog[]
  onSelect: (a: ActivityLog) => void
}) {
  if (activities.length === 0) return <EmptyState label="superseded documents" />
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {activities.map((a) => (
        <Card
          key={a.id}
          className="cursor-pointer gap-4 p-4 transition-colors hover:border-superseded/40"
          onClick={() => onSelect(a)}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-superseded">
              <Layers className="size-3.5" />
              Superseded
            </span>
            {typeof a.similarity === "number" && (
              <span className="rounded-md bg-superseded-subtle px-2 py-0.5 font-mono text-xs font-medium text-superseded">
                {Math.round(a.similarity * 100)}% match
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 rounded-lg border border-superseded/30 bg-superseded-subtle p-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-superseded">
                Superseded
              </span>
              <span className="text-sm font-medium line-through decoration-superseded/50">
                {a.supersededDocument}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-confirmed/30 bg-confirmed-subtle p-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-confirmed">
                Current / Retained
              </span>
              <span className="text-sm font-medium">{a.currentDocument}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
            <span>{a.client}</span>
            <span>
              {a.user} · {formatTimestamp(a.timestamp)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}

/* ---------------- Duplicate data ---------------- */

export function DuplicateView({
  activities,
  onSelect,
}: {
  activities: ActivityLog[]
  onSelect: (a: ActivityLog) => void
}) {
  if (activities.length === 0) return <EmptyState label="duplicate data actions" />
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {activities.map((a) => {
        const organizerSuppressed = a.sideMarkedDuplicate === "organizer"
        return (
          <Card
            key={a.id}
            className="cursor-pointer gap-4 p-4 transition-colors hover:border-duplicate/40"
            onClick={() => onSelect(a)}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-duplicate">
                {a.fieldOrAssociation}
              </span>
              <StatusBadge status={a.status} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <DuplicateSide
                title="Organizer"
                field={a.organizerField ?? "—"}
                value={a.organizerValue ?? "—"}
                suppressed={organizerSuppressed}
              />
              <DuplicateSide
                title="Source Document"
                field={a.sourceField ?? "—"}
                value={a.sourceValue ?? "—"}
                suppressed={!organizerSuppressed}
              />
            </div>
            <p className="rounded-lg border border-duplicate/20 bg-duplicate-subtle px-3 py-2 text-xs leading-relaxed text-foreground text-pretty">
              {a.downstreamImpact}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
              <span>{a.client}</span>
              <span>
                {a.user} · {formatTimestamp(a.timestamp)}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function DuplicateSide({
  title,
  field,
  value,
  suppressed,
}: {
  title: string
  field: string
  value: string
  suppressed: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-3",
        suppressed
          ? "border-duplicate/30 bg-duplicate-subtle"
          : "border-confirmed/30 bg-confirmed-subtle",
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
            suppressed
              ? "bg-duplicate text-duplicate-foreground"
              : "bg-confirmed text-confirmed-foreground",
          )}
        >
          {suppressed ? "Suppressed" : "Retained"}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{field}</span>
      <span
        className={cn(
          "font-mono text-sm font-medium",
          suppressed && "line-through decoration-duplicate/50",
        )}
      >
        {value}
      </span>
    </div>
  )
}
