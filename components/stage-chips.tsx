"use client"

import { STAGES, type StageId } from "@/lib/audit-data"
import { StageDot } from "@/components/audit-visuals"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type StageFilter = StageId | "all"

interface StageChipsProps {
  selected: StageFilter
  counts: Record<StageId, number>
  total: number
  onSelect: (stage: StageFilter) => void
}

function Count({ children, active }: { children: number; active: boolean }) {
  return (
    <span
      className={`ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
        active
          ? "bg-primary-foreground/20 text-primary-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {children}
    </span>
  )
}

export function StageChips({
  selected,
  counts,
  total,
  onSelect,
}: StageChipsProps) {
  const allActive = selected === "all"

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Wizard stage
        <span className="ml-2 font-normal normal-case text-muted-foreground/80">
          in workflow order — select one to filter
        </span>
      </p>
      <TooltipProvider delay={250}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect("all")}
          aria-pressed={allActive}
          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            allActive
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-card text-foreground hover:bg-accent"
          }`}
        >
          All
          <Count active={allActive}>{total}</Count>
        </button>

        {STAGES.map((stage) => {
          const active = selected === stage.id
          return (
            <Tooltip key={stage.id}>
              <TooltipTrigger
                type="button"
                onClick={() => onSelect(stage.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary bg-accent text-foreground ring-1 ring-primary"
                    : "border-input bg-card text-foreground hover:bg-accent"
                }`}
              >
                <StageDot stage={stage.id} />
                {stage.label}
                <Count active={false}>{counts[stage.id]}</Count>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-pretty">
                {stage.tooltip}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
      </TooltipProvider>
    </div>
  )
}
