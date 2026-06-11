"use client"

import { ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { WizardBadge, StatusBadge } from "@/components/activity-badges"
import { type ActivityLog, formatTimestamp } from "@/lib/activity-data"

export function ActivityTable({
  activities,
  onSelect,
}: {
  activities: ActivityLog[]
  onSelect: (a: ActivityLog) => void
}) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-xl border bg-card py-16 text-center">
        <p className="text-sm font-medium">No activities found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting or clearing your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="whitespace-nowrap">Timestamp</TableHead>
              <TableHead>Wizard</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="whitespace-nowrap">Client / Return</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Field / Association</TableHead>
              <TableHead>Previous</TableHead>
              <TableHead>New</TableHead>
              <TableHead>User</TableHead>
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
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatTimestamp(a.timestamp)}
                </TableCell>
                <TableCell>
                  <WizardBadge wizard={a.wizard} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={a.status} />
                </TableCell>
                <TableCell className="max-w-[12rem]">
                  <div className="flex flex-col">
                    <span className="truncate text-sm font-medium">
                      {a.client}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {a.returnId}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[11rem]">
                  <div className="flex flex-col">
                    <span className="truncate text-sm">{a.document}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.form} · {a.area}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[13rem]">
                  <span className="line-clamp-2 text-sm text-pretty">
                    {a.fieldOrAssociation}
                  </span>
                </TableCell>
                <TableCell className="max-w-[9rem]">
                  <span className="line-clamp-2 font-mono text-xs text-muted-foreground">
                    {a.previousValue}
                  </span>
                </TableCell>
                <TableCell className="max-w-[9rem]">
                  <span className="line-clamp-2 font-mono text-xs font-medium text-foreground">
                    {a.newValue}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {a.user}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(a)
                    }}
                  >
                    View
                    <ChevronRight className="size-3.5" aria-hidden="true" />
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
