export type StageId =
  | "prever"
  | "verify"
  | "superseded"
  | "cfa"
  | "duplicate"
  | "nfr"

export type ActionIcon =
  | "field-edited"
  | "field-added"
  | "page-reviewed"
  | "template"
  | "incorrect-ssn"
  | "doc-deleted"
  | "doc-restored"
  | "prior-year"
  | "bookmark"
  | "page-cleared"
  | "doc-superseded"
  | "workpaper"
  | "duplicate-resolved"
  | "pages-merged"
  | "linked-proforma"

export interface DetailRow {
  label: string
  value: string
  /** Render the value in monospace (IDs, amounts, codes). */
  mono?: boolean
}

/** One edited field shown in the Pre-verification / Verification change table. */
export interface FieldChange {
  fieldName: string
  originalValue: string
  valueChanged: string
  /** Single page the field was read from (e.g. "1"), never a range. */
  page: string
}

/** Superseded document detail (Superseded stage only) — shows only the focused document's pages. */
export interface SupersededDetail {
  pages: {
    pageNumber: number
    isSuperseded: boolean
  }[]
}

export interface DuplicateDetail {
  items: {
    label: string
    amount?: string
    isDuplicate: boolean
  }[]
}

export interface AuditAction {
  id: string
  /** Sortable ISO-ish key for ordering (newest first). */
  sortKey: string
  dateLabel: string
  timeLabel: string
  stage: StageId
  action: string
  actionIcon: ActionIcon
  /** Bold form / document name. */
  form: string
  /** Secondary line beneath the form name. */
  detail: string
  /** The highlighted value fragment inside `detail`, rendered monospace. */
  detailValue?: string
  sourcePage: string
  by: string
  /** Label/value pairs shown in the expanded detail grid. */
  details: DetailRow[]
  /**
   * Edited fields shown as a table in the expanded detail (Pre-verification &
   * Verification only). When present, this replaces the label/value grid.
   */
  fieldChanges?: FieldChange[]
  /**
   * Superseded document detail (Superseded stage only).
   * When present, adds to the label/value grid.
   */
  supersededDetail?: SupersededDetail
  /**
   * Duplicate data detail (Duplicate stage only).
   * When present, shows items marked as duplicate vs kept.
   */
  duplicateDetail?: DuplicateDetail
  /** Optional explanatory note shown under the detail grid. */
  note?: string
}

export interface StageConfig {
  id: StageId
  label: string
  /** Workflow step number (forward-only sequence). */
  step: number
  tooltip: string
}

/** Stages in strict forward-only workflow order. */
export const STAGES: StageConfig[] = [
  {
    id: "prever",
    label: "Pre-verification",
    step: 1,
    tooltip:
      "Step 1. Confirms identifier fields only — payer's name, account number, statement date, recipient name. Not dollar amounts. Drives aggregation and bookmarking of multi-page documents.",
  },
  {
    id: "verify",
    label: "Verification",
    step: 2,
    tooltip:
      "Step 2. Review/edit OCR-read fields, add fields OCR missed, apply templates, clear page data, and mark pages reviewed.",
  },
  {
    id: "superseded",
    label: "Superseded",
    step: 3,
    tooltip:
      "Step 3. The system flags similar or replaced documents; the reviewer confirms which version is retained.",
  },
  {
    id: "cfa",
    label: "CFA",
    step: 4,
    tooltip:
      "Step 4. Child Form Association — move orphaned workpapers under the right parent so their data flows to the tax software.",
  },
  {
    id: "duplicate",
    label: "Duplicate",
    step: 5,
    tooltip:
      "Step 5. When an organizer and a source document hold the same data, choose which to keep.",
  },
  {
    id: "nfr",
    label: "NFR",
    step: 6,
    tooltip:
      "Step 6. New Form Review — link documents to a prior-year proforma and merge split pages back into one document.",
  },
]

export const STAGE_LABEL: Record<StageId, string> = STAGES.reduce(
  (acc, s) => {
    acc[s.id] = s.label
    return acc
  },
  {} as Record<StageId, string>,
)

export const ENGAGEMENT = {
  taxpayer: "Anderson, Jill",
  clientId: "47248390",
  domain: "TCProd-TR-03",
  returnType: "1040 Individual",
  taxYear: "TY 2025",
  actionCount: 33,
  fieldValueCount: 40,
  contributorCount: 2,
  dateRange: "Jun 11–12, 2026",
}

export const CONTRIBUTORS = ["M. Chen", "A. Rivera"]

export const AUDIT_ACTIONS: AuditAction[] = [
  // ---------- Pre-verification (4) ----------
  {
    id: "pv-1",
    sortKey: "2026-06-12T09:25",
    dateLabel: "Jun 12",
    timeLabel: "09:25 AM",
    stage: "prever",
    action: "Field edited",
    actionIcon: "field-edited",
    form: "Consolidated 1099 · Morgan Stanley (brokerage)",
    detail: "Last edit: Account number = •••• 7782",
    detailValue: "•••• 7782",
    sourcePage: "pp. 1–20",
    by: "M. Chen",
    details: [{ label: "By", value: "M. Chen · Jun 12 · 09:25 AM" }],
    fieldChanges: [
      { fieldName: "Account number", originalValue: "•••• 1782", valueChanged: "•••• 7782", page: "1" },
      { fieldName: "Payer's name", originalValue: "Morgan Stnly", valueChanged: "Morgan Stanley", page: "1" },
      { fieldName: "Statement date", originalValue: "12/31/25", valueChanged: "12/31/2025", page: "3" },
    ],
    note: "Pre-verification (Step 1) confirms identifier fields — payer name, account number, statement date, recipient name — not dollar amounts. These drive correct aggregation and bookmarking of multi-page documents. Only each field's final value is logged.",
  },
  {
    id: "pv-2",
    sortKey: "2026-06-12T09:20",
    dateLabel: "Jun 12",
    timeLabel: "09:20 AM",
    stage: "prever",
    action: "Field edited",
    actionIcon: "field-edited",
    form: "Consolidated 1099 · Morgan Stanley (brokerage)",
    detail: "Last edit: Payer's name = Morgan Stanley",
    detailValue: "Morgan Stanley",
    sourcePage: "pp. 1–20",
    by: "M. Chen",
    details: [{ label: "By", value: "M. Chen · Jun 12 · 09:20 AM" }],
    fieldChanges: [
      { fieldName: "Payer's name", originalValue: "Morgan Stnly", valueChanged: "Morgan Stanley", page: "1" },
    ],
  },
  {
    id: "pv-3",
    sortKey: "2026-06-11T15:55",
    dateLabel: "Jun 11",
    timeLabel: "3:55 PM",
    stage: "prever",
    action: "Field edited",
    actionIcon: "field-edited",
    form: "Grantor Letter · Ross Family Trust",
    detail: "Last edit: Recipient name = Mark A. Ross Family Trust",
    detailValue: "Mark A. Ross Family Trust",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [{ label: "By", value: "A. Rivera · Jun 11 · 3:55 PM" }],
    fieldChanges: [
      { fieldName: "Recipient name", originalValue: "Mark Ross", valueChanged: "Mark A. Ross Family Trust", page: "1" },
      { fieldName: "Recipient TIN", originalValue: "blank", valueChanged: "••••• 4321", page: "1" },
    ],
  },
  {
    id: "pv-4",
    sortKey: "2026-06-11T15:50",
    dateLabel: "Jun 11",
    timeLabel: "3:50 PM",
    stage: "prever",
    action: "Field edited",
    actionIcon: "field-edited",
    form: "1099-INT �� Ally Bank",
    detail: "Last edit: Statement date = 12/31/2025",
    detailValue: "12/31/2025",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [{ label: "By", value: "A. Rivera · Jun 11 · 3:50 PM" }],
    fieldChanges: [
      { fieldName: "Statement date", originalValue: "01/31/2025", valueChanged: "12/31/2025", page: "1" },
      { fieldName: "Account number", originalValue: "•••• 0098", valueChanged: "••���• 0090", page: "1" },
    ],
  },

  // ---------- Verification (12) ----------
  {
    id: "vf-1",
    sortKey: "2026-06-12T10:42",
    dateLabel: "Jun 12",
    timeLabel: "10:42 AM",
    stage: "verify",
    action: "Field edited",
    actionIcon: "field-edited",
    form: "1099-DIV · Fidelity Investments",
    detail: "Last edit: Box 7 Foreign tax paid = 56.00",
    detailValue: "56.00",
    sourcePage: "p. 1",
    by: "M. Chen",
    details: [{ label: "By", value: "M. Chen · Jun 12 · 10:42 AM" }],
    fieldChanges: [
      { fieldName: "Box 7 Foreign tax paid", originalValue: "0.00", valueChanged: "56.00", page: "1" },
      { fieldName: "Box 1a Total ordinary dividends", originalValue: "2,310.00", valueChanged: "2,318.00", page: "1" },
      { fieldName: "Box 1b Qualified dividends", originalValue: "1,180.00", valueChanged: "1,205.00", page: "1" },
      { fieldName: "Box 2a Total capital gain distr.", originalValue: "0.00", valueChanged: "540.00", page: "2" },
    ],
    note: "Only each field's final value is logged — re-edits to the same field collapse to the last value, and fields left unchanged aren't recorded.",
  },
  {
    id: "vf-2",
    sortKey: "2026-06-12T10:36",
    dateLabel: "Jun 12",
    timeLabel: "10:36 AM",
    stage: "verify",
    action: "Field added",
    actionIcon: "field-added",
    form: "1099-DIV · Fidelity Investments",
    detail: "Last edit: Box 5 Section 199A dividends = 318.00",
    detailValue: "318.00",
    sourcePage: "p. 1",
    by: "M. Chen",
    details: [
      { label: "Reason", value: "OCR did not detect this field" },
      { label: "By", value: "M. Chen · Jun 12 · 10:36 AM" },
    ],
    fieldChanges: [
      { fieldName: "Box 5 Section 199A dividends", originalValue: "— (not captured)", valueChanged: "318.00", page: "1" },
    ],
  },
  {
    id: "vf-3",
    sortKey: "2026-06-12T10:33",
    dateLabel: "Jun 12",
    timeLabel: "10:33 AM",
    stage: "verify",
    action: "Page marked reviewed",
    actionIcon: "page-reviewed",
    form: "1099-DIV · Fidelity — page 2",
    detail: "Page: 2 of 2",
    sourcePage: "p. 2",
    by: "M. Chen",
    details: [
      { label: "Page", value: "2 of 2" },
      { label: "Status", value: "Reviewed" },
      { label: "By", value: "M. Chen · Jun 12 · 10:33 AM" },
    ],
  },
  {
    id: "vf-4",
    sortKey: "2026-06-12T09:50",
    dateLabel: "Jun 12",
    timeLabel: "09:50 AM",
    stage: "verify",
    action: "Template applied & captured",
    actionIcon: "template",
    form: "Brokerage stmt · Raymond James",
    detail: "Last edit: Box 1a Ordinary dividends = 440.00",
    detailValue: "440.00",
    sourcePage: "p. 2",
    by: "M. Chen",
    details: [
      { label: "Template", value: "Raymond James brokerage statement" },
      { label: "By", value: "M. Chen · Jun 12 · 09:50 AM" },
    ],
    fieldChanges: [
      { fieldName: "Box 1a Ordinary dividends", originalValue: "— (not captured)", valueChanged: "440.00", page: "2" },
      { fieldName: "Box 1b Qualified dividends", originalValue: "— (not captured)", valueChanged: "410.00", page: "2" },
    ],
  },
  {
    id: "vf-5",
    sortKey: "2026-06-12T09:40",
    dateLabel: "Jun 12",
    timeLabel: "09:40 AM",
    stage: "verify",
    action: "Marked incorrect SSN",
    actionIcon: "incorrect-ssn",
    form: "W-2 · The Walt Disney Company",
    detail: "Flagged value: SSN •••–••–1234",
    detailValue: "•••–••–1234",
    sourcePage: "p. 1",
    by: "M. Chen",
    details: [
      { label: "Flagged value", value: "SSN •••–••–1234", mono: true },
      { label: "Status", value: "Marked incorrect — pending taxpayer confirmation" },
      { label: "By", value: "M. Chen · Jun 12 · 09:40 AM" },
    ],
  },
  {
    id: "vf-6",
    sortKey: "2026-06-11T16:21",
    dateLabel: "Jun 11",
    timeLabel: "4:21 PM",
    stage: "verify",
    action: "Field edited",
    actionIcon: "field-edited",
    form: "1099-DIV · Vanguard",
    detail: "Last edit: Box 1b Qualified dividends = 1,180.00",
    detailValue: "1,180.00",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [{ label: "By", value: "A. Rivera · Jun 11 · 4:21 PM" }],
    fieldChanges: [
      { fieldName: "Box 1b Qualified dividends", originalValue: "1,080.00", valueChanged: "1,180.00", page: "1" },
    ],
  },
  {
    id: "vf-7",
    sortKey: "2026-06-11T16:05",
    dateLabel: "Jun 11",
    timeLabel: "4:05 PM",
    stage: "verify",
    action: "Document deleted",
    actionIcon: "doc-deleted",
    form: "1099-MISC · blank scan",
    detail: "Reason: Blank page · no reportable data",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [
      { label: "Document", value: "1099-MISC · blank scan" },
      { label: "Reason", value: "Blank page · no reportable data" },
      { label: "Recoverable", value: "Yes — moved to Deleted items" },
      { label: "By", value: "A. Rivera · Jun 11 · 4:05 PM" },
    ],
  },
  {
    id: "vf-8",
    sortKey: "2026-06-11T16:02",
    dateLabel: "Jun 11",
    timeLabel: "4:02 PM",
    stage: "verify",
    action: "Document restored",
    actionIcon: "doc-restored",
    form: "1099-INT · Ally Bank",
    detail: "Restored from: Deleted items",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [
      { label: "Document", value: "1099-INT · Ally Bank" },
      { label: "Restored from", value: "Deleted items" },
      { label: "By", value: "A. Rivera · Jun 11 · 4:02 PM" },
    ],
  },
  {
    id: "vf-9",
    sortKey: "2026-06-11T15:48",
    dateLabel: "Jun 11",
    timeLabel: "3:48 PM",
    stage: "verify",
    action: "Marked as prior year",
    actionIcon: "prior-year",
    form: "1098-E · Nelnet",
    detail: "Classification: Prior year (2024)",
    detailValue: "2024",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [
      { label: "Document", value: "1098-E · Nelnet" },
      { label: "Classification", value: "Prior year (2024)" },
      { label: "Effect", value: "Excluded from current-year aggregation" },
      { label: "By", value: "A. Rivera · Jun 11 · 3:48 PM" },
    ],
  },
  {
    id: "vf-10",
    sortKey: "2026-06-11T15:30",
    dateLabel: "Jun 11",
    timeLabel: "3:30 PM",
    stage: "verify",
    action: "Bookmark with identifiers",
    actionIcon: "bookmark",
    form: "Consolidated 1099 · Vanguard",
    detail: "Identifier: Vanguard — joint brokerage",
    sourcePage: "pp. 1–2",
    by: "A. Rivera",
    details: [
      { label: "Identifier", value: "Vanguard — joint brokerage" },
      { label: "Pages", value: "1–2" },
      { label: "By", value: "A. Rivera · Jun 11 · 3:30 PM" },
    ],
  },
  {
    id: "vf-11",
    sortKey: "2026-06-11T15:12",
    dateLabel: "Jun 11",
    timeLabel: "3:12 PM",
    stage: "verify",
    action: "Page data cleared",
    actionIcon: "page-cleared",
    form: "Schedule K-1 · Partnership XYZ — page 3",
    detail: "Cleared: All captured values on page 3",
    sourcePage: "p. 3",
    by: "A. Rivera",
    details: [
      { label: "Page", value: "3" },
      { label: "Cleared", value: "All captured values on page 3" },
      { label: "Reason", value: "Mis-captured page — re-scan requested" },
      { label: "By", value: "A. Rivera · Jun 11 · 3:12 PM" },
    ],
  },
  {
    id: "vf-12",
    sortKey: "2026-06-11T15:05",
    dateLabel: "Jun 11",
    timeLabel: "3:05 PM",
    stage: "verify",
    action: "Field edited",
    actionIcon: "field-edited",
    form: "1099-DIV · Vanguard",
    detail: "Last edit: Box 2a Total capital gain distr. = 540.00",
    detailValue: "540.00",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [{ label: "By", value: "A. Rivera · Jun 11 · 3:05 PM" }],
    fieldChanges: [
      { fieldName: "Box 2a Total capital gain distr.", originalValue: "500.00", valueChanged: "540.00", page: "3" },
    ],
  },

  // ---------- Superseded (2) ----------
  {
    id: "ss-1",
    sortKey: "2026-06-12T10:18",
    dateLabel: "Jun 12",
    timeLabel: "10:18 AM",
    stage: "superseded",
    action: "Document superseded",
    actionIcon: "doc-superseded",
    form: "1099-DIV · Charles Schwab",
    detail: "Flagged similar to: 1099-DIV · Schwab (v2, corrected)",
    sourcePage: "pp. 1–4",
    by: "M. Chen",
    details: [{ label: "By", value: "M. Chen · Jun 12 · 10:18 AM" }],
    supersededDetail: {
      pages: [
        { pageNumber: 2, isSuperseded: true },
        { pageNumber: 5, isSuperseded: false },
        { pageNumber: 8, isSuperseded: true },
        { pageNumber: 12, isSuperseded: false },
      ],
    },
    note: "Superseded documents were detected as duplicate/corrected versions. Newer versions retained; older versions excluded from current-year aggregation.",
  },
  {
    id: "ss-2",
    sortKey: "2026-06-12T09:48",
    dateLabel: "Jun 12",
    timeLabel: "09:48 AM",
    stage: "superseded",
    action: "Document superseded",
    actionIcon: "doc-superseded",
    form: "1099-B · Fidelity",
    detail: "Flagged similar to: 1099-B · Fidelity (corrected)",
    sourcePage: "pp. 3–4",
    by: "A. Rivera",
    details: [{ label: "By", value: "A. Rivera · Jun 12 · 09:48 AM" }],
    supersededDetail: {
      pages: [
        { pageNumber: 3, isSuperseded: true },
        { pageNumber: 7, isSuperseded: false },
      ],
    },
    note: "Superseded documents were detected as duplicate/corrected versions. Newer versions retained; older versions excluded from current-year aggregation.",
  },

  // ---------- CFA (6) ----------
  {
    id: "cf-1",
    sortKey: "2026-06-12T11:20",
    dateLabel: "Jun 12",
    timeLabel: "11:20 AM",
    stage: "cfa",
    action: "Child form associated",
    actionIcon: "workpaper",
    form: "1099-MISC · Westchester Property Management",
    detail: "Associated to parent: Schedule E · Rental or Royalty Income",
    sourcePage: "p. 1",
    by: "M. Chen",
    details: [
      { label: "Child form", value: "1099-MISC · Westchester Property Management (111-11-1111)" },
      { label: "Associated to parent", value: "Schedule E · Rental or Royalty Income & Expenses" },
      { label: "By", value: "M. Chen · Jun 12 · 11:20 AM" },
    ],
  },
  {
    id: "cf-2",
    sortKey: "2026-06-12T11:05",
    dateLabel: "Jun 12",
    timeLabel: "11:05 AM",
    stage: "cfa",
    action: "Child form associated",
    actionIcon: "workpaper",
    form: "1098 Mortgage · Citibank Mortgage Inc.",
    detail: "Associated to parent: Schedule A · Itemized Deductions",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [
      { label: "Child form", value: "1098 Mortgage · CITIMORGAGE, INC. (698-00-23698)" },
      { label: "Associated to parent", value: "Schedule A · Itemized Deductions (Interest & Taxes)" },
      { label: "By", value: "A. Rivera · Jun 12 · 11:05 AM" },
    ],
  },
  {
    id: "cf-3",
    sortKey: "2026-06-12T10:50",
    dateLabel: "Jun 12",
    timeLabel: "10:50 AM",
    stage: "cfa",
    action: "Child form associated",
    actionIcon: "workpaper",
    form: "1099-MISC · Honii Smith Revenue Bank",
    detail: "Associated to parent: Schedule C · Business Income and Expenses",
    sourcePage: "p. 1",
    by: "M. Chen",
    details: [
      { label: "Child form", value: "1099-MISC · Honii Smith Revenue Bank (KS53)" },
      { label: "Associated to parent", value: "Schedule C · Business Income and Expenses" },
      { label: "By", value: "M. Chen · Jun 12 · 10:50 AM" },
    ],
  },
  {
    id: "cf-4",
    sortKey: "2026-06-12T10:35",
    dateLabel: "Jun 12",
    timeLabel: "10:35 AM",
    stage: "cfa",
    action: "Child form associated",
    actionIcon: "workpaper",
    form: "1099-B · Fidelity Investments",
    detail: "Associated to parent: Schedule D · Capital Gains and Losses",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [
      { label: "Child form", value: "1099-B · Fidelity Investments (securities sales)" },
      { label: "Associated to parent", value: "Schedule D · Capital Gains and Losses" },
      { label: "By", value: "A. Rivera · Jun 12 · 10:35 AM" },
    ],
  },
  {
    id: "cf-5",
    sortKey: "2026-06-12T12:30",
    dateLabel: "Jun 12",
    timeLabel: "12:30 PM",
    stage: "cfa",
    action: "Form added manually",
    actionIcon: "workpaper",
    form: "ABC Consulting · Farm Income and Expenses",
    detail: "Added to parent: Schedule F · Farm Income and Expenses",
    sourcePage: "manual entry",
    by: "A. Rivera",
    details: [
      { label: "Form added", value: "ABC Consulting (111-11-1111)" },
      { label: "Payer name", value: "ABC Consulting" },
      { label: "Recipient ID", value: "111-11-1111" },
      { label: "Added to parent", value: "Schedule F · Farm Income and Expenses" },
      { label: "By", value: "A. Rivera · Jun 12 · 12:30 PM" },
    ],
  },
  {
    id: "cf-6",
    sortKey: "2026-06-12T12:15",
    dateLabel: "Jun 12",
    timeLabel: "12:15 PM",
    stage: "cfa",
    action: "Form added manually",
    actionIcon: "workpaper",
    form: "Newport Beach Lane · 1099-MISC",
    detail: "Added to parent: 1099-MISC",
    sourcePage: "manual entry",
    by: "M. Chen",
    details: [
      { label: "Form added", value: "Newport Beach Lane (RENTAL) (T)" },
      { label: "Payer name", value: "Newport Beach Lane (RENTAL) (T)" },
      { label: "Recipient ID", value: "Not provided" },
      { label: "Added to parent", value: "1099-MISC" },
      { label: "By", value: "M. Chen · Jun 12 · 12:15 PM" },
    ],
  },

  // ---------- Duplicate (4) ----------
  {
    id: "dp-1",
    sortKey: "2026-06-12T10:24",
    dateLabel: "Jun 12",
    timeLabel: "10:24 AM",
    stage: "duplicate",
    action: "Duplicate marked",
    actionIcon: "duplicate-resolved",
    form: "1099-INT · Citizens Bank",
    detail: "Organizer: $132.00 interest income (duplicate)",
    detailValue: "$132.00",
    sourcePage: "Organizer page 5",
    by: "M. Chen",
    details: [
      { label: "Organizer value", value: "$132.00 interest income" },
      { label: "Source value", value: "$132.00 interest income" },
      { label: "Match reason", value: "Identical amounts and description" },
      { label: "Resolution", value: "Marked as duplicate in Organizer (will exclude from export)" },
      { label: "By", value: "M. Chen · Jun 12 · 10:24 AM" },
    ],
    duplicateDetail: {
      items: [
        { label: "Organizer · Interest income", amount: "$132.00", isDuplicate: true },
        { label: "Source · 1099-INT", amount: "$132.00", isDuplicate: false },
      ],
    },
  },
  {
    id: "dp-2",
    sortKey: "2026-06-12T10:30",
    dateLabel: "Jun 12",
    timeLabel: "10:30 AM",
    stage: "duplicate",
    action: "Duplicate marked",
    actionIcon: "duplicate-resolved",
    form: "1099-MISC · Cole Co",
    detail: "Organizer: $150 royalty (duplicate)",
    detailValue: "$150",
    sourcePage: "Organizer page 7",
    by: "A. Rivera",
    details: [
      { label: "Organizer value", value: "$150 royalty" },
      { label: "Source value", value: "$150 royalty from 1099-MISC" },
      { label: "Match reason", value: "Auto-match: payer EIN and amount verified" },
      { label: "Resolution", value: "Confirmed duplicate match (Organizer excluded from export)" },
      { label: "By", value: "A. Rivera · Jun 12 · 10:30 AM" },
    ],
    duplicateDetail: {
      items: [
        { label: "Organizer · Royalty income", amount: "$150", isDuplicate: true },
        { label: "Source · Cole Co 1099-MISC", amount: "$150", isDuplicate: false },
      ],
    },
  },
  {
    id: "dp-3",
    sortKey: "2026-06-12T10:18",
    dateLabel: "Jun 12",
    timeLabel: "10:18 AM",
    stage: "duplicate",
    action: "Duplicate unmarked",
    actionIcon: "duplicate-resolved",
    form: "Form 1041 · Estate",
    detail: "Organizer: $2050 distribution (not duplicate)",
    detailValue: "$2050",
    sourcePage: "Organizer page 9",
    by: "M. Chen",
    details: [
      { label: "Organizer value", value: "$2050 estate distribution" },
      { label: "Source value", value: "$2050 estate distribution (Box 1a)" },
      { label: "Reason", value: "Determined not duplicate; different source documents" },
      { label: "Resolution", value: "Removed duplicate marking (both amounts will be retained)" },
      { label: "By", value: "M. Chen · Jun 12 · 10:18 AM" },
    ],
    duplicateDetail: {
      items: [
        { label: "Organizer · Estate distribution", amount: "$2050", isDuplicate: false },
        { label: "Source · 1041-K1 distribution", amount: "$2050", isDuplicate: false },
      ],
    },
  },
  {
    id: "dp-4",
    sortKey: "2026-06-12T10:12",
    dateLabel: "Jun 12",
    timeLabel: "10:12 AM",
    stage: "duplicate",
    action: "Duplicate marked",
    actionIcon: "duplicate-resolved",
    form: "Schedule C · Self-Employment Income",
    detail: "Organizer: $17451 business income (duplicate)",
    detailValue: "$17451",
    sourcePage: "Organizer page 3",
    by: "A. Rivera",
    details: [
      { label: "Organizer value", value: "$17451 net business income" },
      { label: "Source value", value: "$17451 business income (from 1099-NEC)" },
      { label: "Match reason", value: "Manually identified duplicate by reviewer" },
      { label: "Resolution", value: "Marked as duplicate in Organizer (will exclude from export)" },
      { label: "By", value: "A. Rivera · Jun 12 · 10:12 AM" },
    ],
    duplicateDetail: {
      items: [
        { label: "Organizer · Net business income", amount: "$17451", isDuplicate: true },
        { label: "Source · 1099-NEC", amount: "$17451", isDuplicate: false },
      ],
    },
  },

  // ---------- NFR (6) ----------
  {
    id: "nf-1",
    sortKey: "2026-06-12T09:58",
    dateLabel: "Jun 12",
    timeLabel: "09:58 AM",
    stage: "nfr",
    action: "Split pages merged",
    actionIcon: "pages-merged",
    form: "1099-B · Fidelity Investments",
    detail: "Merged pages: Pages 1–3 (split on name mismatch)",
    sourcePage: "pp. 1–3",
    by: "M. Chen",
    details: [
      { label: "Merged pages", value: "Pages 1–3 (split on name mismatch)" },
      { label: "Into", value: "1099-B · Fidelity (complete document)" },
      { label: "Why split", value: "Account number differed across pages" },
      { label: "By", value: "M. Chen · Jun 12 · 09:58 AM" },
    ],
  },
  {
    id: "nf-2",
    sortKey: "2026-06-12T09:30",
    dateLabel: "Jun 12",
    timeLabel: "09:30 AM",
    stage: "nfr",
    action: "Linked to proforma",
    actionIcon: "linked-proforma",
    form: "W-2 · The Walt Disney Company",
    detail: "Linked to proforma: PY Proforma · W-2 Disney (2024)",
    sourcePage: "p. 1",
    by: "M. Chen",
    details: [
      { label: "Linked to", value: "PY Proforma · W-2 Disney (2024)" },
      { label: "Match", value: "Employer EIN and recipient matched" },
      { label: "By", value: "M. Chen · Jun 12 · 09:30 AM" },
    ],
  },
  {
    id: "nf-3",
    sortKey: "2026-06-11T10:40",
    dateLabel: "Jun 11",
    timeLabel: "10:40 AM",
    stage: "nfr",
    action: "Linked to proforma",
    actionIcon: "linked-proforma",
    form: "Schedule K-1 · Partnership XYZ",
    detail: "Linked to proforma: PY Proforma · Schedule K-1 (2024)",
    sourcePage: "pp. 1–5",
    by: "M. Chen",
    details: [
      { label: "Linked to", value: "PY Proforma · Schedule K-1 (2024)" },
      { label: "Match", value: "Partnership EIN matched" },
      { label: "By", value: "M. Chen · Jun 11 · 10:40 AM" },
    ],
  },
  {
    id: "nf-4",
    sortKey: "2026-06-12T14:15",
    dateLabel: "Jun 12",
    timeLabel: "2:15 PM",
    stage: "nfr",
    action: "Document associated",
    actionIcon: "linked-proforma",
    form: "1099-DIV · Mellon Investor Services",
    detail: "Associated to proforma: divo1 (prior-year 1099-DIV)",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [
      { label: "Unassociated document", value: "1099-DIV-MELLON INVESTOR SERVICES" },
      { label: "Associated to proforma", value: "divo1 (prior-year 1099-DIV)" },
      { label: "Match basis", value: "Payer EIN and recipient TIN matched" },
      { label: "By", value: "A. Rivera · Jun 12 · 2:15 PM" },
    ],
  },
  {
    id: "nf-5",
    sortKey: "2026-06-12T14:08",
    dateLabel: "Jun 12",
    timeLabel: "2:08 PM",
    stage: "nfr",
    action: "Document associated",
    actionIcon: "linked-proforma",
    form: "1099-DIV · Exxon",
    detail: "Associated to proforma: 1099-DIV (primary)",
    sourcePage: "p. 1",
    by: "A. Rivera",
    details: [
      { label: "Unassociated document", value: "1099-DIV-EXXON" },
      { label: "Associated to proforma", value: "1099-DIV (primary proforma)" },
      { label: "Match basis", value: "Payer EIN matched; recipient on file" },
      { label: "By", value: "A. Rivera · Jun 12 · 2:08 PM" },
    ],
  },
  {
    id: "nf-6",
    sortKey: "2026-06-12T13:45",
    dateLabel: "Jun 12",
    timeLabel: "1:45 PM",
    stage: "nfr",
    action: "Document associated",
    actionIcon: "linked-proforma",
    form: "1099-DIV",
    detail: "Associated to proforma: 1099-DIV (primary)",
    sourcePage: "p. 1",
    by: "M. Chen",
    details: [
      { label: "Unassociated document", value: "1099-DIV" },
      { label: "Associated to proforma", value: "1099-DIV (primary proforma)" },
      { label: "Match basis", value: "Automatic system match confirmed by reviewer" },
      { label: "By", value: "M. Chen · Jun 12 · 1:45 PM" },
    ],
  },
]
