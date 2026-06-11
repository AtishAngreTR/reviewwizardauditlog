"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { clients, returns, users, taxYears } from "@/lib/activity-data"

export interface Filters {
  search: string
  client: string
  returnId: string
  taxYear: string
  user: string
  status: string
}

export const emptyFilters: Filters = {
  search: "",
  client: "all",
  returnId: "all",
  taxYear: "all",
  user: "all",
  status: "all",
}

const statusOptions = [
  { value: "all", label: "All actions" },
  { value: "edited", label: "Edited" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "overridden", label: "Overridden" },
  { value: "matched", label: "Matched" },
  { value: "reassigned", label: "Reassigned" },
  { value: "associated", label: "Associated" },
  { value: "confirmed", label: "Confirmed" },
  { value: "marked-superseded", label: "Marked Superseded" },
  { value: "suppressed", label: "Suppressed" },
]

export function FiltersBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
  resultCount: number
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })
  const hasActiveFilters =
    filters.search !== "" ||
    filters.client !== "all" ||
    filters.returnId !== "all" ||
    filters.taxYear !== "all" ||
    filters.user !== "all" ||
    filters.status !== "all"

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search by document, form, field, or value..."
            className="pl-9"
            aria-label="Search activity"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Client"
            value={filters.client}
            onValueChange={(v) => set({ client: v })}
            options={[
              { value: "all", label: "All clients" },
              ...clients.map((c) => ({ value: c, label: c })),
            ]}
          />
          <FilterSelect
            label="Return"
            value={filters.returnId}
            onValueChange={(v) => set({ returnId: v })}
            options={[
              { value: "all", label: "All returns" },
              ...returns.map((r) => ({ value: r, label: r })),
            ]}
          />
          <FilterSelect
            label="Tax Year"
            value={filters.taxYear}
            onValueChange={(v) => set({ taxYear: v })}
            options={[
              { value: "all", label: "All years" },
              ...taxYears.map((y) => ({
                value: String(y),
                label: String(y),
              })),
            ]}
          />
          <FilterSelect
            label="User"
            value={filters.user}
            onValueChange={(v) => set({ user: v })}
            options={[
              { value: "all", label: "All users" },
              ...users.map((u) => ({ value: u, label: u })),
            ]}
          />
          <FilterSelect
            label="Action"
            value={filters.status}
            onValueChange={(v) => set({ status: v })}
            options={statusOptions}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground tabular-nums">
              {resultCount}
            </span>{" "}
            {resultCount === 1 ? "activity" : "activities"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(emptyFilters)}
          disabled={!hasActiveFilters}
          className="h-8 gap-1.5 text-muted-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const itemsMap = options.reduce<Record<string, string>>((acc, o) => {
    acc[o.value] = o.label
    return acc
  }, {})
  return (
    <Select value={value} onValueChange={onValueChange} items={itemsMap}>
      <SelectTrigger
        size="sm"
        className="h-8 min-w-[8rem] bg-background text-xs"
        aria-label={label}
      >
        <span className="text-muted-foreground">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-xs">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
