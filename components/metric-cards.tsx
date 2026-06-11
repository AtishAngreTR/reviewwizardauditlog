import {
  FileCheck2,
  GitMerge,
  Layers,
  Copy,
  Users,
  Activity,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { activityLogs } from "@/lib/activity-data"

interface Metric {
  label: string
  value: number
  icon: typeof Activity
  iconBg: string
  iconText: string
}

function buildMetrics(): Metric[] {
  const verificationEdits = activityLogs.filter(
    (a) => a.wizard === "verification",
  ).length
  const associations = activityLogs.filter(
    (a) => a.wizard === "cfa" || a.wizard === "nfr",
  ).length
  const superseded = activityLogs.filter((a) => a.wizard === "superseded").length
  const duplicates = activityLogs.filter((a) => a.wizard === "duplicate").length
  const activeUsers = new Set(activityLogs.map((a) => a.user)).size

  return [
    {
      label: "Total logged activities",
      value: activityLogs.length,
      icon: Activity,
      iconBg: "bg-accent",
      iconText: "text-foreground",
    },
    {
      label: "Verification edits",
      value: verificationEdits,
      icon: FileCheck2,
      iconBg: "bg-verification-subtle",
      iconText: "text-verification",
    },
    {
      label: "Document associations",
      value: associations,
      icon: GitMerge,
      iconBg: "bg-association-subtle",
      iconText: "text-association",
    },
    {
      label: "Superseded documents",
      value: superseded,
      icon: Layers,
      iconBg: "bg-superseded-subtle",
      iconText: "text-superseded",
    },
    {
      label: "Duplicate data actions",
      value: duplicates,
      icon: Copy,
      iconBg: "bg-duplicate-subtle",
      iconText: "text-duplicate",
    },
    {
      label: "Users active today",
      value: activeUsers,
      icon: Users,
      iconBg: "bg-confirmed-subtle",
      iconText: "text-confirmed",
    },
  ]
}

export function MetricCards() {
  const metrics = buildMetrics()
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m) => {
        const Icon = m.icon
        return (
          <Card
            key={m.label}
            className="flex flex-col gap-3 p-4 shadow-none"
          >
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                m.iconBg,
                m.iconText,
              )}
            >
              <Icon className="size-4.5" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-semibold tabular-nums tracking-tight">
                {m.value}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                {m.label}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
