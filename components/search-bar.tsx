"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSearchRef = useRef<string>("")

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      // Prevent duplicate searches
      if (lastSearchRef.current === searchQuery) {
        return
      }

      lastSearchRef.current = searchQuery

      if (searchQuery.trim().length >= 2) {
        onSearch(searchQuery.trim())
      } else if (searchQuery.trim().length === 0) {
        onSearch("")
      }
    },
    [onSearch],
  )

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      debouncedSearch(query)
    }, 300)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, debouncedSearch])

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
        <Input
          type="text"
          placeholder="Search for movies, actors, directors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-12 py-4 text-lg bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 backdrop-blur-sm"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50 z-10"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {query.length > 0 && query.length < 2 && (
        <p className="text-xs text-muted-foreground mt-2 ml-1">Enter at least 2 characters to search</p>
      )}
    </div>
  )
}
