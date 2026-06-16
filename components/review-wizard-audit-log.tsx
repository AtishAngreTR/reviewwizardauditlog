"use client"

import { useMemo, useState } from "react"
import {
  AUDIT_ACTIONS,
  STAGES,
  STAGE_LABEL,
  ENGAGEMENT,
  type StageId,
} from "@/lib/audit-data"
import { AuditHeader } from "@/components/audit-header"
import { StageChips, type StageFilter } from "@/components/stage-chips"
import { AuditFilters, ResultsBar } from "@/components/audit-filters"
import { AuditTable } from "@/components/audit-table"

export function ReviewWizardAuditLog() {
  const [stage, setStage] = useState<StageFilter>("all")
  const [search, setSearch] = useState("")
  const [contributor, setContributor] = useState("all")

  const counts = useMemo(() => {
    const base = STAGES.reduce(
      (acc, s) => {
        acc[s.id] = 0
        return acc
      },
      {} as Record<StageId, number>,
    )
    for (const a of AUDIT_ACTIONS) base[a.stage] += 1
    return base
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return AUDIT_ACTIONS.filter((a) => {
      if (stage !== "all" && a.stage !== stage) return false
      if (contributor !== "all" && a.by !== contributor) return false
      if (q) {
        const haystack = [
          a.form,
          a.detail,
          a.action,
          a.by,
          STAGE_LABEL[a.stage],
          ...a.details.map((d) => `${d.label} ${d.value}`),
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    }).sort((x, y) => (x.sortKey < y.sortKey ? 1 : -1))
  }, [stage, search, contributor])

  const filtersActive =
    stage !== "all" || search.trim() !== "" || contributor !== "all"

  const clearFilters = () => {
    setStage("all")
    setSearch("")
    setContributor("all")
  }

  return (
    <main className="min-h-dvh bg-background pb-16">
      <AuditHeader />

      <div className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-6">
        <StageChips
          selected={stage}
          counts={counts}
          total={ENGAGEMENT.actionCount}
          onSelect={setStage}
        />

        <div className="mt-5">
          <AuditFilters
            search={search}
            onSearchChange={setSearch}
            contributor={contributor}
            onContributorChange={setContributor}
          />
        </div>
      </div>

      <div className="mt-4">
        <ResultsBar
          shown={filtered.length}
          total={ENGAGEMENT.actionCount}
          stageLabel={stage === "all" ? null : STAGE_LABEL[stage]}
          filtersActive={filtersActive}
          onClear={clearFilters}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6">
        <AuditTable actions={filtered} />
      </div>
    </main>
  )
}
