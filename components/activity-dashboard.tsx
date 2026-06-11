"use client"

import { useMemo, useState } from "react"
import { Download, FileSpreadsheet, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCards } from "@/components/metric-cards"
import { FiltersBar, emptyFilters, type Filters } from "@/components/filters-bar"
import { ActivityTable } from "@/components/activity-table"
import { ActivityDetailDrawer } from "@/components/activity-detail-drawer"
import {
  VerificationView,
  AssociationView,
  SupersededView,
  DuplicateView,
} from "@/components/wizard-views"
import {
  activityLogs,
  type ActivityLog,
  type WizardType,
} from "@/lib/activity-data"

type TabValue = "all" | WizardType

const tabs: { value: TabValue; label: string }[] = [
  { value: "all", label: "All Activity" },
  { value: "verification", label: "Verification" },
  { value: "cfa", label: "CFA" },
  { value: "nfr", label: "NFR" },
  { value: "superseded", label: "Superseded" },
  { value: "duplicate", label: "Duplicate Data" },
]

export function ActivityDashboard() {
  const [tab, setTab] = useState<TabValue>("all")
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [selected, setSelected] = useState<ActivityLog | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return activityLogs.filter((a) => {
      if (tab !== "all" && a.wizard !== tab) return false
      if (filters.client !== "all" && a.client !== filters.client) return false
      if (filters.returnId !== "all" && a.returnId !== filters.returnId)
        return false
      if (filters.taxYear !== "all" && String(a.taxYear) !== filters.taxYear)
        return false
      if (filters.user !== "all" && a.user !== filters.user) return false
      if (filters.status !== "all" && a.status !== filters.status) return false
      if (q) {
        const haystack = [
          a.document,
          a.form,
          a.area,
          a.fieldOrAssociation,
          a.previousValue,
          a.newValue,
          a.client,
          a.returnId,
          a.user,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [tab, filters])

  const openDetail = (a: ActivityLog) => {
    setSelected(a)
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-balance">
                  1040SCAN Activity Log
                </h1>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Audit Trail
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
                Track every user action across the verification and
                post-verification wizards — what changed, by whom, when, and in
                which wizard.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileSpreadsheet className="size-4" aria-hidden="true" />
              Download CSV
            </Button>
            <Button size="sm" className="gap-1.5">
              <Download className="size-4" aria-hidden="true" />
              Export Audit Log
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 py-6 md:px-6">
        <MetricCards />

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabValue)}
          className="gap-5"
        >
          <div className="sticky top-0 z-20 -mx-4 flex flex-col gap-4 bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
            <div className="overflow-x-auto">
              <TabsList className="w-max">
                {tabs.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <FiltersBar
              filters={filters}
              onChange={setFilters}
              resultCount={filtered.length}
            />
          </div>

          <div>
            {tab === "all" && (
              <ActivityTable activities={filtered} onSelect={openDetail} />
            )}
            {tab === "verification" && (
              <VerificationView activities={filtered} onSelect={openDetail} />
            )}
            {(tab === "cfa" || tab === "nfr") && (
              <AssociationView activities={filtered} onSelect={openDetail} />
            )}
            {tab === "superseded" && (
              <SupersededView activities={filtered} onSelect={openDetail} />
            )}
            {tab === "duplicate" && (
              <DuplicateView activities={filtered} onSelect={openDetail} />
            )}
          </div>
        </Tabs>
      </main>

      <ActivityDetailDrawer
        activity={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
