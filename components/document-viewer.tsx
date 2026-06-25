"use client"

import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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
  const [zoom, setZoom] = useState(100)
  const canPrevious = currentPage > 1
  const canNext = currentPage < totalPages

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50))

  return (
    <div className="flex h-full flex-col bg-card rounded-lg border border-border shadow-sm">
      {/* Header with Close */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {documentName}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 w-7 p-0"
        >
          <X className="size-3.5" />
        </Button>
      </div>

      {/* Controls Bar - Top */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 bg-muted/30">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPrevious}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="size-3" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground min-w-fit px-1.5">
            {currentPage}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNext}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="size-3" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="h-7 w-7 p-0"
          >
            <ZoomOut className="size-3" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground min-w-fit px-1.5">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="h-7 w-7 p-0"
          >
            <ZoomIn className="size-3" />
          </Button>
        </div>
      </div>

      {/* Document Preview Area */}
      <div className="flex-1 bg-muted/20 flex items-center justify-center overflow-auto p-3">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
          className="transition-transform duration-200"
        >
          <img
            src="/forms/1099-misc-2025.png"
            alt={documentName}
            className="max-w-full bg-white shadow-md border border-border/50"
          />
        </div>
      </div>
    </div>
  )
}
