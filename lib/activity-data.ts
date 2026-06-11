export type WizardType =
  | "verification"
  | "cfa"
  | "nfr"
  | "superseded"
  | "duplicate"

export type ActionStatus =
  | "edited"
  | "accepted"
  | "rejected"
  | "overridden"
  | "matched"
  | "reassigned"
  | "removed"
  | "confirmed"
  | "associated"
  | "marked-superseded"
  | "unmarked"
  | "reviewed"
  | "suppressed"

export interface ActivityLog {
  id: string
  timestamp: string // ISO string
  wizard: WizardType
  actionType: string
  status: ActionStatus
  // Context
  client: string
  returnId: string
  taxYear: number
  user: string
  userRole: string
  document: string
  form: string
  area: string
  fieldOrAssociation: string
  previousValue: string
  newValue: string
  // Optional wizard-specific
  ocrValue?: string
  confidence?: number
  notes?: string
  downstreamImpact: string
  // Association-specific
  parentForm?: string
  childDocument?: string
  previousAssociation?: string
  newAssociation?: string
  // Superseded-specific
  currentDocument?: string
  supersededDocument?: string
  similarity?: number
  // Duplicate-specific
  organizerField?: string
  organizerValue?: string
  sourceField?: string
  sourceValue?: string
  sideMarkedDuplicate?: "organizer" | "source"
  retainedValue?: string
  suppressedValue?: string
}

export const wizardMeta: Record<
  WizardType,
  { label: string; token: string; subtle: string; description: string }
> = {
  verification: {
    label: "Verification",
    token: "verification",
    subtle: "verification-subtle",
    description: "Field-level edits to OCR/AI captured data",
  },
  cfa: {
    label: "CFA",
    token: "association",
    subtle: "association-subtle",
    description: "Parent-child document associations",
  },
  nfr: {
    label: "NFR",
    token: "association",
    subtle: "association-subtle",
    description: "Unmatched documents matched to proforma forms",
  },
  superseded: {
    label: "Superseded",
    token: "superseded",
    subtle: "superseded-subtle",
    description: "Duplicate or identical documents marked as superseded",
  },
  duplicate: {
    label: "Duplicate Data",
    token: "duplicate",
    subtle: "duplicate-subtle",
    description: "Organizer vs source duplicate data suppressed downstream",
  },
}

export const statusMeta: Record<ActionStatus, { label: string; token: string }> =
  {
    edited: { label: "Edited", token: "verification" },
    accepted: { label: "Accepted", token: "confirmed" },
    rejected: { label: "Rejected", token: "duplicate" },
    overridden: { label: "Overridden", token: "superseded" },
    matched: { label: "Matched", token: "association" },
    reassigned: { label: "Reassigned", token: "association" },
    removed: { label: "Removed", token: "duplicate" },
    confirmed: { label: "Confirmed", token: "confirmed" },
    associated: { label: "Associated", token: "association" },
    "marked-superseded": { label: "Marked Superseded", token: "superseded" },
    unmarked: { label: "Unmarked", token: "muted-foreground" },
    reviewed: { label: "Reviewed", token: "confirmed" },
    suppressed: { label: "Suppressed", token: "duplicate" },
  }

export const activityLogs: ActivityLog[] = [
  {
    id: "act-1001",
    timestamp: "2026-03-14T10:42:00",
    wizard: "verification",
    actionType: "Field edit",
    status: "edited",
    client: "Anderson Family Trust",
    returnId: "1040-2025-000187",
    taxYear: 2025,
    user: "Sarah Miller",
    userRole: "Senior Verifier",
    document: "W-2 - Acme Corp",
    form: "W-2",
    area: "Federal Withholding",
    fieldOrAssociation: "Federal Tax Withheld",
    ocrValue: "$1,250.00",
    previousValue: "$1,250.00",
    newValue: "$1,520.00",
    confidence: 0.82,
    notes: "OCR misread box 2; corrected against source scan.",
    downstreamImpact:
      "This change will be included in the final reviewed dataset sent to tax software.",
  },
  {
    id: "act-1002",
    timestamp: "2026-03-14T11:05:00",
    wizard: "cfa",
    actionType: "Document association",
    status: "matched",
    client: "Anderson Family Trust",
    returnId: "1040-2025-000187",
    taxYear: 2025,
    user: "Daniel Kim",
    userRole: "Verifier",
    document: "1099-INT Page 2",
    form: "Schedule B",
    area: "Interest Income",
    fieldOrAssociation: "1099-INT Page 2 → Schedule B",
    parentForm: "Schedule B",
    childDocument: "1099-INT Page 2",
    previousAssociation: "Unmatched",
    newAssociation: "Schedule B - Interest Income",
    previousValue: "Unmatched",
    newValue: "Schedule B - Interest Income",
    notes: "Child page belongs to the same payer as page 1.",
    downstreamImpact:
      "Associated interest income will roll up under Schedule B in tax software.",
  },
  {
    id: "act-1003",
    timestamp: "2026-03-14T11:22:00",
    wizard: "nfr",
    actionType: "Proforma match",
    status: "associated",
    client: "Brightwater Holdings LLC",
    returnId: "1040-2025-000204",
    taxYear: 2025,
    user: "Priya Shah",
    userRole: "Verifier",
    document: "Brokerage Statement",
    form: "Schedule D",
    area: "Capital Gains and Losses",
    fieldOrAssociation: "Brokerage Statement → Schedule D",
    parentForm: "Schedule D",
    childDocument: "Brokerage Statement",
    previousAssociation: "Unmatched",
    newAssociation: "Schedule D",
    previousValue: "Unmatched",
    newValue: "Schedule D",
    notes: "Matched to prior-year proforma pulled from tax software.",
    downstreamImpact:
      "Document will populate the Schedule D proforma in the tax return.",
  },
  {
    id: "act-1004",
    timestamp: "2026-03-14T11:40:00",
    wizard: "superseded",
    actionType: "Mark superseded",
    status: "marked-superseded",
    client: "Anderson Family Trust",
    returnId: "1040-2025-000187",
    taxYear: 2025,
    user: "Mark Johnson",
    userRole: "Lead Reviewer",
    document: "W-2 Copy B",
    form: "W-2",
    area: "Wages",
    fieldOrAssociation: "W-2 Copy B superseded by W-2 Final Copy",
    currentDocument: "W-2 Final Copy",
    supersededDocument: "W-2 Copy B",
    similarity: 0.98,
    previousValue: "Active",
    newValue: "Superseded",
    notes: "Copy B was an earlier draft scan with identical box values.",
    downstreamImpact:
      "Superseded document is excluded from the dataset sent to tax software.",
  },
  {
    id: "act-1005",
    timestamp: "2026-03-14T12:08:00",
    wizard: "duplicate",
    actionType: "Mark duplicate",
    status: "suppressed",
    client: "Brightwater Holdings LLC",
    returnId: "1040-2025-000204",
    taxYear: 2025,
    user: "Emily Carter",
    userRole: "Senior Verifier",
    document: "Form 1098",
    form: "Schedule A",
    area: "Itemized Deductions",
    fieldOrAssociation: "Mortgage Interest (Organizer vs 1098)",
    organizerField: "Mortgage Interest",
    organizerValue: "$8,450.00",
    sourceField: "Mortgage Interest",
    sourceValue: "$8,450.00",
    sideMarkedDuplicate: "organizer",
    retainedValue: "Source Document Value ($8,450.00)",
    suppressedValue: "Organizer Value ($8,450.00)",
    previousValue: "Reported from both sources",
    newValue: "Organizer value suppressed",
    notes: "Source document retained as authoritative value.",
    downstreamImpact:
      "Organizer value suppressed from downstream reporting to prevent double counting.",
  },
  {
    id: "act-1006",
    timestamp: "2026-03-14T13:15:00",
    wizard: "verification",
    actionType: "Field accept",
    status: "accepted",
    client: "Brightwater Holdings LLC",
    returnId: "1040-2025-000204",
    taxYear: 2025,
    user: "Sarah Miller",
    userRole: "Senior Verifier",
    document: "1099-DIV - Vanguard",
    form: "1099-DIV",
    area: "Ordinary Dividends",
    fieldOrAssociation: "Total Ordinary Dividends",
    ocrValue: "$3,240.00",
    previousValue: "$3,240.00",
    newValue: "$3,240.00",
    confidence: 0.97,
    notes: "High-confidence capture accepted without change.",
    downstreamImpact:
      "Accepted value flows directly to the tax software return.",
  },
  {
    id: "act-1007",
    timestamp: "2026-03-14T13:48:00",
    wizard: "verification",
    actionType: "Field override",
    status: "overridden",
    client: "Nguyen Consulting Inc",
    returnId: "1040-2025-000231",
    taxYear: 2025,
    user: "Daniel Kim",
    userRole: "Verifier",
    document: "1099-NEC - Stripe",
    form: "1099-NEC",
    area: "Nonemployee Compensation",
    fieldOrAssociation: "Nonemployee Compensation",
    ocrValue: "$45,000.00",
    previousValue: "$45,000.00",
    newValue: "$54,000.00",
    confidence: 0.61,
    notes: "Low-confidence capture; manually overridden from source PDF.",
    downstreamImpact:
      "Overridden value replaces the OCR capture in the final dataset.",
  },
  {
    id: "act-1008",
    timestamp: "2026-03-14T14:10:00",
    wizard: "cfa",
    actionType: "Reassign association",
    status: "reassigned",
    client: "Nguyen Consulting Inc",
    returnId: "1040-2025-000231",
    taxYear: 2025,
    user: "Priya Shah",
    userRole: "Verifier",
    document: "K-1 Page 3",
    form: "Schedule E",
    area: "Partnership Income",
    fieldOrAssociation: "K-1 Page 3 → Schedule E",
    parentForm: "Schedule E",
    childDocument: "K-1 Page 3",
    previousAssociation: "Schedule B - Interest Income",
    newAssociation: "Schedule E - Partnership Income",
    previousValue: "Schedule B - Interest Income",
    newValue: "Schedule E - Partnership Income",
    notes: "Originally mis-associated; reassigned to correct schedule.",
    downstreamImpact:
      "Income will now report under Schedule E instead of Schedule B.",
  },
  {
    id: "act-1009",
    timestamp: "2026-03-14T14:35:00",
    wizard: "nfr",
    actionType: "Proforma match",
    status: "confirmed",
    client: "Anderson Family Trust",
    returnId: "1040-2025-000187",
    taxYear: 2025,
    user: "Emily Carter",
    userRole: "Senior Verifier",
    document: "Property Tax Statement",
    form: "Schedule A",
    area: "Taxes Paid",
    fieldOrAssociation: "Property Tax Statement → Schedule A",
    parentForm: "Schedule A",
    childDocument: "Property Tax Statement",
    previousAssociation: "Suggested: Schedule A",
    newAssociation: "Schedule A - Taxes Paid",
    previousValue: "Suggested: Schedule A",
    newValue: "Schedule A - Taxes Paid",
    notes: "Confirmed system-suggested proforma match.",
    downstreamImpact:
      "Confirmed match populates the Schedule A proforma.",
  },
  {
    id: "act-1010",
    timestamp: "2026-03-14T15:02:00",
    wizard: "superseded",
    actionType: "Mark superseded",
    status: "marked-superseded",
    client: "Nguyen Consulting Inc",
    returnId: "1040-2025-000231",
    taxYear: 2025,
    user: "Mark Johnson",
    userRole: "Lead Reviewer",
    document: "1099-INT Draft",
    form: "1099-INT",
    area: "Interest Income",
    fieldOrAssociation: "1099-INT Draft superseded by 1099-INT Corrected",
    currentDocument: "1099-INT Corrected",
    supersededDocument: "1099-INT Draft",
    similarity: 0.94,
    previousValue: "Active",
    newValue: "Superseded",
    notes: "Corrected version received from payer.",
    downstreamImpact:
      "Draft document excluded from the dataset sent to tax software.",
  },
  {
    id: "act-1011",
    timestamp: "2026-03-14T15:30:00",
    wizard: "duplicate",
    actionType: "Mark duplicate",
    status: "suppressed",
    client: "Nguyen Consulting Inc",
    returnId: "1040-2025-000231",
    taxYear: 2025,
    user: "Sarah Miller",
    userRole: "Senior Verifier",
    document: "Charitable Receipt",
    form: "Schedule A",
    area: "Charitable Contributions",
    fieldOrAssociation: "Cash Contributions (Organizer vs Receipt)",
    organizerField: "Cash Contributions",
    organizerValue: "$2,000.00",
    sourceField: "Cash Contributions",
    sourceValue: "$2,000.00",
    sideMarkedDuplicate: "source",
    retainedValue: "Organizer Value ($2,000.00)",
    suppressedValue: "Source Document Value ($2,000.00)",
    previousValue: "Reported from both sources",
    newValue: "Source value suppressed",
    notes: "Organizer entry retained per firm policy.",
    downstreamImpact:
      "Source value suppressed from downstream reporting.",
  },
  {
    id: "act-1012",
    timestamp: "2026-03-14T16:05:00",
    wizard: "verification",
    actionType: "Field reject",
    status: "rejected",
    client: "Brightwater Holdings LLC",
    returnId: "1040-2025-000204",
    taxYear: 2025,
    user: "Daniel Kim",
    userRole: "Verifier",
    document: "1099-MISC - Unknown",
    form: "1099-MISC",
    area: "Other Income",
    fieldOrAssociation: "Other Income",
    ocrValue: "$980.00",
    previousValue: "$980.00",
    newValue: "Rejected — document not relevant",
    confidence: 0.44,
    notes: "Document belongs to a different client; rejected.",
    downstreamImpact:
      "Rejected document is excluded from the return dataset.",
  },
]

export const clients = [
  "Anderson Family Trust",
  "Brightwater Holdings LLC",
  "Nguyen Consulting Inc",
]
export const returns = [
  "1040-2025-000187",
  "1040-2025-000204",
  "1040-2025-000231",
]
export const users = [
  "Sarah Miller",
  "Daniel Kim",
  "Priya Shah",
  "Mark Johnson",
  "Emily Carter",
]
export const taxYears = [2025, 2024, 2023]

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
