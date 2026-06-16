import {
  Pencil,
  SquarePlus,
  CircleCheck,
  Table2,
  IdCard,
  Trash2,
  ArchiveRestore,
  History,
  Bookmark,
  Eraser,
  CircleSlash,
  FolderTree,
  Copy,
  GitMerge,
  Link2,
  type LucideIcon,
} from "lucide-react"
import type { ActionIcon, StageId } from "@/lib/audit-data"

/** Background color class for each stage's legend dot. */
export const STAGE_DOT_CLASS: Record<StageId, string> = {
  prever: "bg-stage-prever",
  verify: "bg-stage-verify",
  superseded: "bg-stage-superseded",
  cfa: "bg-stage-cfa",
  duplicate: "bg-stage-duplicate",
  nfr: "bg-stage-nfr",
}

/** Text color class for each stage (used on the chip label when selected). */
export const STAGE_TEXT_CLASS: Record<StageId, string> = {
  prever: "text-stage-prever",
  verify: "text-stage-verify",
  superseded: "text-stage-superseded",
  cfa: "text-stage-cfa",
  duplicate: "text-stage-duplicate",
  nfr: "text-stage-nfr",
}

const ACTION_ICON_MAP: Record<ActionIcon, LucideIcon> = {
  "field-edited": Pencil,
  "field-added": SquarePlus,
  "page-reviewed": CircleCheck,
  template: Table2,
  "incorrect-ssn": IdCard,
  "doc-deleted": Trash2,
  "doc-restored": ArchiveRestore,
  "prior-year": History,
  bookmark: Bookmark,
  "page-cleared": Eraser,
  "doc-superseded": CircleSlash,
  workpaper: FolderTree,
  "duplicate-resolved": Copy,
  "pages-merged": GitMerge,
  "linked-proforma": Link2,
}

export function StageDot({ stage }: { stage: StageId }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-2 shrink-0 rounded-full ${STAGE_DOT_CLASS[stage]}`}
    />
  )
}

export function ActionGlyph({
  icon,
  className,
}: {
  icon: ActionIcon
  className?: string
}) {
  const Icon = ACTION_ICON_MAP[icon]
  return <Icon aria-hidden="true" className={className ?? "size-4"} />
}
