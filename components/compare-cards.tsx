import { ArrowRight, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompareItem {
  label: string
  value: string
  tone?: "neutral" | "previous" | "new" | "ocr" | "suppressed" | "retained"
}

const toneClasses: Record<NonNullable<CompareItem["tone"]>, string> = {
  neutral: "border-border bg-muted/40",
  previous: "border-border bg-muted/40",
  ocr: "border-border bg-muted/40",
  new: "border-confirmed/30 bg-confirmed-subtle",
  retained: "border-confirmed/30 bg-confirmed-subtle",
  suppressed: "border-duplicate/30 bg-duplicate-subtle",
}

const toneLabel: Record<NonNullable<CompareItem["tone"]>, string> = {
  neutral: "text-muted-foreground",
  previous: "text-muted-foreground",
  ocr: "text-muted-foreground",
  new: "text-confirmed",
  retained: "text-confirmed",
  suppressed: "text-duplicate",
}

export function CompareCards({
  items,
  direction = "horizontal",
}: {
  items: CompareItem[]
  direction?: "horizontal" | "vertical"
}) {
  const isHorizontal = direction === "horizontal"
  return (
    <div
      className={cn(
        "flex gap-2",
        isHorizontal ? "flex-col sm:flex-row sm:items-stretch" : "flex-col",
      )}
    >
      {items.map((item, i) => {
        const tone = item.tone ?? "neutral"
        return (
          <div key={item.label} className="flex flex-1 items-stretch gap-2">
            <div
              className={cn(
                "flex flex-1 flex-col gap-1 rounded-lg border p-3",
                toneClasses[tone],
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-medium uppercase tracking-wide",
                  toneLabel[tone],
                )}
              >
                {item.label}
              </span>
              <span className="font-mono text-sm font-medium text-foreground break-words">
                {item.value}
              </span>
            </div>
            {i < items.length - 1 && (
              <div className="flex items-center justify-center text-muted-foreground">
                {isHorizontal ? (
                  <ArrowRight className="size-4 shrink-0 max-sm:hidden" />
                ) : null}
                {isHorizontal ? (
                  <ArrowDown className="size-4 shrink-0 sm:hidden" />
                ) : (
                  <ArrowDown className="size-4 shrink-0" />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
