"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentViewerProps {
  documentName: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onClose: () => void
}

export function DocumentViewer({
  documentName,
  currentPage,
  totalPages,
  onPageChange,
  onClose,
}: DocumentViewerProps) {
  const canPrevious = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground truncate">
            {documentName}
          </h3>
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Document Preview Area */}
      <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-auto p-4">
        <div className="w-full max-w-2xl aspect-[8.5/11] bg-background border-2 border-border rounded-lg shadow-sm flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Document Preview
            </p>
            <p className="text-lg font-semibold text-foreground mb-4">
              {documentName}
            </p>
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="mt-6 text-xs text-muted-foreground space-y-1">
              <p>Document content would display here</p>
              <p>in a real implementation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Navigation */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrevious}
        >
          <ChevronLeft className="size-4 mr-1" />
          Previous
        </Button>

        <div className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
        >
          Next
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
