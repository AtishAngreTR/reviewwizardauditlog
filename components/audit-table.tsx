"use client"

import { Fragment, useState } from "react"
import { ChevronDown, UserRound, Info } from "lucide-react"
import type { AuditAction } from "@/lib/audit-data"
import { STAGE_LABEL } from "@/lib/audit-data"
import { StageDot, ActionGlyph } from "@/components/audit-visuals"

/** Renders the detail sub-line, emphasizing the highlighted value fragment. */
function DetailLine({
  text,
  value,
}: {
  text: string
  value?: string
}) {
  if (!value || !text.includes(value)) {
    return <span>{text}</span>
  }
  const [before, after] = text.split(value)
  return (
    <span>
      {before}
      <span className="font-mono text-foreground">{value}</span>
      {after}
    </span>
  )
}

function DetailPanel({ action }: { action: AuditAction }) {
  return (
    <div className="bg-detail-surface px-4 py-4 sm:px-6">
      <dl className="grid grid-cols-1 gap-y-2.5">
        {action.details.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-x-6 sm:grid-cols-[10rem_1fr]"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd
              className={`text-sm text-foreground ${
                row.mono ? "font-mono" : ""
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {action.note ? (
        <>
          <div className="my-3.5 border-t border-dashed border-border" />
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span className="text-pretty">{action.note}</span>
          </p>
        </>
      ) : null}
    </div>
  )
}

const TH =
  "border-b border-border px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"

export function AuditTable({ actions }: { actions: AuditAction[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (actions.length === 0) {
    return (
      <div className="border border-border bg-card px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No actions match your filters</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try a different stage, contributor, or search term.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-card">
            <th scope="col" className={TH}>
              Date / time
            </th>
            <th scope="col" className={TH}>
              Stage
            </th>
            <th scope="col" className={TH}>
              Action
            </th>
            <th scope="col" className={TH}>
              Form / detail
            </th>
            <th scope="col" className={`${TH} whitespace-nowrap`}>
              Source page
            </th>
            <th scope="col" className={TH}>
              By
            </th>
            <th scope="col" className={`${TH} w-10`}>
              <span className="sr-only">Toggle detail</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => {
            const isOpen = expanded.has(a.id)
            return (
              <Fragment key={a.id}>
                <tr
                  onClick={() => toggle(a.id)}
                  className={`cursor-pointer border-b border-border align-top transition-colors hover:bg-accent/60 ${
                    isOpen ? "bg-accent/40" : ""
                  }`}
                >
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-foreground">
                    {a.dateLabel} · {a.timeLabel}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs text-foreground">
                      <StageDot stage={a.stage} />
                      {STAGE_LABEL[a.stage]}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-foreground">
                      <ActionGlyph
                        icon={a.actionIcon}
                        className="size-4 text-muted-foreground"
                      />
                      {a.action}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-foreground">{a.form}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <DetailLine text={a.detail} value={a.detailValue} />
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-muted-foreground">
                    {a.sourcePage}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-foreground">
                      <UserRound
                        aria-hidden="true"
                        className="size-3.5 text-muted-foreground"
                      />
                      {a.by}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(a.id)
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`detail-${a.id}`}
                      aria-label={isOpen ? "Collapse detail" : "Expand detail"}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </td>
                </tr>
                {isOpen ? (
                  <tr id={`detail-${a.id}`} className="border-b border-border">
                    <td colSpan={7} className="p-0">
                      <DetailPanel action={a} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
