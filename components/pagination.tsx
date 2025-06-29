"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  hasMorePages: boolean
  onPageChange: (page: number) => void
  totalResults: number
}

export function Pagination({ currentPage, hasMorePages, onPageChange, totalResults }: PaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = hasMorePages

  if (!canGoPrevious && !canGoNext) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className="flex items-center gap-2 border-border hover:bg-muted hover:border-primary/50"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous 10
      </Button>

      <div className="flex items-center gap-2 px-4">
        <span className="text-sm text-muted-foreground">Page {currentPage}</span>
        {totalResults > 0 && (
          <span className="text-xs text-muted-foreground">
            ({Math.min(currentPage * 10, totalResults)} of {totalResults})
          </span>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="flex items-center gap-2 border-border hover:bg-muted hover:border-primary/50"
      >
        Next 10
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
