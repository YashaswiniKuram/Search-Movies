"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SearchBar } from "@/components/search-bar"
import { MovieCard } from "@/components/movie-card"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pagination } from "@/components/pagination"
import { searchMovies, clearSearch, fetchLatestMovies } from "@/store/slices/movie-slice"
import type { RootState, AppDispatch } from "@/store/store"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Film, Sparkles, Star } from "lucide-react"

export default function MoviesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { movies, latestMovies, loading, latestLoading, error, searchQuery, currentPage, totalResults, hasMorePages } =
    useSelector((state: RootState) => state.movies)
  const { toast } = useToast()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const lastScrollYRef = useRef(0)
  const isScrolledRef = useRef(false)

  // Page load animation
  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  // Handle scroll with aggressive debouncing and large hysteresis
  useEffect(() => {
    const handleScroll = () => {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Debounce the scroll handling
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = window.scrollY
        const lastScrollY = lastScrollYRef.current
        const currentIsScrolled = isScrolledRef.current

        // Large hysteresis gap to prevent flickering
        if (scrollTop > lastScrollY) {
          // Scrolling down - compact header at 150px
          if (scrollTop > 150 && !currentIsScrolled) {
            setIsScrolled(true)
            isScrolledRef.current = true
          }
        } else {
          // Scrolling up - expand header at 50px
          if (scrollTop < 50 && currentIsScrolled) {
            setIsScrolled(false)
            isScrolledRef.current = false
          }
        }

        lastScrollYRef.current = scrollTop
      }, 50) // 50ms debounce
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Fetch latest movies on component mount
  useEffect(() => {
    dispatch(fetchLatestMovies())
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim().length >= 2) {
        dispatch(searchMovies({ query, page: 1 }))
      } else if (query.trim().length === 0) {
        dispatch(clearSearch())
      }
    },
    [dispatch],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (searchQuery) {
        dispatch(searchMovies({ query: searchQuery, page }))
        // Smooth scroll to top of results
        const resultsSection = document.getElementById("results-section")
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    },
    [dispatch, searchQuery],
  )

  const displayMovies = searchQuery ? movies : latestMovies
  const isLoading = searchQuery ? loading : latestLoading

  return (
    <div
      className={`min-h-screen bg-background transition-colors duration-300 ${isPageLoaded ? "page-transition" : "opacity-0"}`}
    >
      {/* Navigation Bar */}
      <nav className="elegant-header sticky top-0 z-50 transition-all duration-500">
        <div className="container mx-auto px-4">
          <div
            className={`flex items-center justify-between transition-all duration-500 ease-out ${
              isScrolled ? "py-3" : "py-6"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className={`elegant-title font-bold transition-all duration-500 ease-out ${
                    isScrolled ? "text-xl" : "text-3xl"
                  }`}
                >
                  CinemaSearch
                </h2>
                {!isScrolled && (
                  <p className="elegant-subtitle text-sm font-medium animate-fade-in">Premium Movie Discovery</p>
                )}
              </div>
            </div>
            <div className="animate-slide-in-right">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Header Section */}
      <header className="bg-background">
        <div className="container mx-auto px-4">
          {/* Main H1 Title - Always visible below navigation */}
          <div
            className={`text-center transition-all duration-500 ease-out ${
              isScrolled
                ? "py-8 opacity-0 max-h-0 pointer-events-none"
                : "py-16 opacity-100 max-h-96 pointer-events-auto"
            }`}
            style={{
              overflow: "hidden",
            }}
          >
            <div
              className={`transition-transform duration-500 ease-out ${isScrolled ? "transform -translate-y-8" : "transform translate-y-0"}`}
            >
              <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
                <Sparkles className="w-8 h-8 text-accent" />
                <h1 className="text-5xl md:text-6xl font-bold elegant-title">Discover Cinema</h1>
                <Star className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xl elegant-subtitle mb-8 max-w-2xl mx-auto animate-fade-in animate-stagger-1">
                Explore the world of movies with our premium search experience. Find detailed information, ratings, and
                everything you need to discover your next favorite film.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in animate-stagger-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Latest Releases</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>Detailed Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Premium Experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div
            className={`max-w-3xl mx-auto transition-all duration-500 ease-out ${
              isScrolled ? "pb-4" : "pb-8"
            } animate-fade-in animate-stagger-3`}
          >
            <div className="search-container rounded-2xl p-6 shadow-xl">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Movies Section */}
        <div className="mb-8" id="results-section">
          <div className="flex items-center justify-between mb-8 animate-fade-in animate-stagger-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {searchQuery ? `Search Results` : "Latest Movies"}
              </h2>
              {searchQuery ? (
                <p className="text-muted-foreground">
                  Found {totalResults > 0 ? totalResults : "no"} results for "{searchQuery}"
                </p>
              ) : (
                <p className="text-muted-foreground">Discover the newest and most popular movies</p>
              )}
            </div>
            {!searchQuery && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full border border-primary/20 animate-slide-in-right">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm font-medium text-primary">Live Updates</span>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`animate-fade-in animate-stagger-${Math.min(i + 1, 8)}`}>
                  <SkeletonLoader />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && searchQuery && (
            <div className="flex items-center justify-center py-16 animate-fade-in">
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 max-w-md w-full animate-scale-in shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  <h2 className="text-lg font-semibold text-destructive">Search Error</h2>
                </div>
                <p className="text-destructive/80 mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords or check your spelling.
                </p>
              </div>
            </div>
          )}

          {!isLoading && displayMovies.length > 0 && (
            <>
              {searchQuery && (
                <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10 animate-fade-in">
                  <p className="text-foreground font-medium">Showing 10 most recent results for "{searchQuery}"</p>
                  {totalResults > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalResults} total movies found • Page {currentPage}
                    </p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-12">
                {displayMovies.map((movie, index) => (
                  <div
                    key={movie.imdbID}
                    className={`animate-fade-in animate-stagger-${Math.min(index + 1, 8)} hover-lift`}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              {/* Pagination - only show for search results */}
              {searchQuery && (
                <div className="animate-fade-in animate-stagger-5">
                  <Pagination
                    currentPage={currentPage}
                    hasMorePages={hasMorePages}
                    onPageChange={handlePageChange}
                    totalResults={totalResults}
                  />
                </div>
              )}
            </>
          )}

          {!isLoading && !searchQuery && displayMovies.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Film className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome to CinemaSearch</h2>
                <p className="text-muted-foreground mb-2">
                  Your premium destination for movie discovery and exploration
                </p>
                <p className="text-sm text-muted-foreground">Enter at least 2 characters to start searching</p>
              </div>
            </div>
          )}

          {!isLoading && searchQuery && displayMovies.length === 0 && !error && (
            <div className="text-center py-20 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Film className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">No Movies Found</h2>
                <p className="text-muted-foreground">Try searching with different keywords or movie titles</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
