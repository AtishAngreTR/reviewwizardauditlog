"use client"

import { Search, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CONTRIBUTORS } from "@/lib/audit-data"

interface AuditFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  contributor: string
  onContributorChange: (value: string) => void
}

export function AuditFilters({
  search,
  onSearchChange,
  contributor,
  onContributorChange,
}: AuditFiltersProps) {
  const contributorItems: Record<string, string> = {
    all: "All contributors",
    ...CONTRIBUTORS.reduce<Record<string, string>>((acc, c) => {
      acc[c] = c
      return acc
    }, {}),
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <div className="relative w-full sm:w-72">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search form, field, or person"
          aria-label="Search form, field, or person"
          className="h-10 bg-card pl-9"
        />
      </div>

      <Select
        value={contributor}
        onValueChange={onContributorChange}
        items={contributorItems}
      >
        <SelectTrigger
          className="h-10 w-full bg-card sm:w-52"
          aria-label="Filter by contributor"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All contributors</SelectItem>
          {CONTRIBUTORS.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface ResultsBarProps {
  shown: number
  total: number
  stageLabel: string | null
  filtersActive: boolean
  onClear: () => void
}

export function ResultsBar({
  shown,
  total,
  stageLabel,
  filtersActive,
  onClear,
}: ResultsBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-y border-border bg-results-bar px-4 py-2.5 sm:px-6">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{shown}</span> of{" "}
        {total} actions
        {stageLabel ? (
          <span className="text-muted-foreground"> · {stageLabel} stage</span>
        ) : null}
      </p>
      <button
        type="button"
        onClick={onClear}
        disabled={!filtersActive}
        className="inline-flex items-center gap-1.5 rounded-md border border-input bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RotateCcw aria-hidden="true" className="size-3.5" />
        Clear filters
      </button>
    </div>
  )
}
