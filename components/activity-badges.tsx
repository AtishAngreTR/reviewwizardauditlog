import { cn } from "@/lib/utils"
import {
  type ActionStatus,
  type WizardType,
  statusMeta,
  wizardMeta,
} from "@/lib/activity-data"

const tokenClasses: Record<string, { bg: string; text: string; dot: string }> = {
  verification: {
    bg: "bg-verification-subtle",
    text: "text-verification",
    dot: "bg-verification",
  },
  association: {
    bg: "bg-association-subtle",
    text: "text-association",
    dot: "bg-association",
  },
  superseded: {
    bg: "bg-superseded-subtle",
    text: "text-superseded",
    dot: "bg-superseded",
  },
  duplicate: {
    bg: "bg-duplicate-subtle",
    text: "text-duplicate",
    dot: "bg-duplicate",
  },
  confirmed: {
    bg: "bg-confirmed-subtle",
    text: "text-confirmed",
    dot: "bg-confirmed",
  },
  "muted-foreground": {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
}

export function WizardBadge({
  wizard,
  className,
}: {
  wizard: WizardType
  className?: string
}) {
  const meta = wizardMeta[wizard]
  const c = tokenClasses[meta.token]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        c.bg,
        c.text,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  )
}

export function StatusBadge({
  status,
  className,
}: {
  status: ActionStatus
  className?: string
}) {
  const meta = statusMeta[status]
  const c = tokenClasses[meta.token] ?? tokenClasses["muted-foreground"]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        c.bg,
        c.text,
        "border-transparent",
        className,
      )}
    >
      {meta.label}
    </span>
  )
}
