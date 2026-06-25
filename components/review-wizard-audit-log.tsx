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
import { AuditFilters } from "@/components/audit-filters"
import { AuditTable } from "@/components/audit-table"
import { DocumentViewer } from "@/components/document-viewer"

const ITEMS_PER_PAGE = 10

export function ReviewWizardAuditLog() {
  const [stage, setStage] = useState<StageFilter>("all")
  const [search, setSearch] = useState("")
  const [contributor, setContributor] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerDoc, setViewerDoc] = useState<{ name: string; pages: number } | null>(null)
  const [viewerPage, setViewerPage] = useState(1)

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

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [stage, search, contributor])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const paginatedActions = filtered.slice(startIdx, endIdx)

  const filtersActive =
    stage !== "all" || search.trim() !== "" || contributor !== "all"

  const clearFilters = () => {
    setStage("all")
    setSearch("")
    setContributor("all")
  }

  const openDocument = (docName: string, pageCount: number = 4) => {
    setViewerDoc({ name: docName, pages: pageCount })
    setViewerPage(1)
    setViewerOpen(true)
  }

  const closeDocument = () => {
    setViewerOpen(false)
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

        <div className="mt-4">
          <AuditFilters
            search={search}
            onSearchChange={setSearch}
            contributor={contributor}
            onContributorChange={setContributor}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_350px]">
          <div className="space-y-3">
            <AuditTable actions={paginatedActions} onOpenDocument={openDocument} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages} ({filtered.length} records)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-xs rounded border transition-colors ${
                          page === currentPage
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {viewerOpen && viewerDoc && (
            <div className="h-[calc(100vh-200px)] sticky top-20">
              <DocumentViewer
                documentName={viewerDoc.name}
                currentPage={viewerPage}
                totalPages={viewerDoc.pages}
                onPageChange={setViewerPage}
                onClose={closeDocument}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
