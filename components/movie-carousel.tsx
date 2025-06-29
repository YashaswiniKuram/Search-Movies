"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Film, Calendar, Play } from "lucide-react"
import type { Movie } from "@/types/movie"

interface MovieCarouselProps {
  movies: Movie[]
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const [isPaused, setIsPaused] = useState(false)
  const router = useRouter()

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (movies.length === 0 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [movies.length, isPaused])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }

  const handleImageError = (movieId: string) => {
    setImageErrors((prev) => ({ ...prev, [movieId]: true }))
  }

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`)
  }

  if (movies.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border border-border rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">Featured Movies</h2>
            <p className="text-muted-foreground">Search for movies to see featured content</p>
          </div>
        </div>
      </div>
    )
  }

  const currentMovie = movies[currentIndex]

  return (
    <div
      className="relative h-96 bg-gradient-to-r from-background via-muted/50 to-background border border-border rounded-xl overflow-hidden mb-8 shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)]" />
      </div>

      {/* Movie Slide */}
      <div className="relative h-full flex items-center justify-center">
        <div className="flex items-center gap-8 px-8 w-full max-w-6xl">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <Card
              className="cursor-pointer transition-all duration-700 transform hover:scale-105 shadow-2xl border-2 border-primary/20 hover:border-primary/40"
              onClick={() => handleMovieClick(currentMovie.imdbID)}
            >
              <CardContent className="p-0">
                <div className="relative w-64 h-80 overflow-hidden rounded-lg">
                  {!imageErrors[currentMovie.imdbID] && currentMovie.Poster !== "N/A" ? (
                    <Image
                      src={currentMovie.Poster || "/placeholder.svg"}
                      alt={currentMovie.Title}
                      fill
                      className="object-cover transition-transform duration-700"
                      sizes="256px"
                      onError={() => handleImageError(currentMovie.imdbID)}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80 flex flex-col items-center justify-center p-6 text-foreground">
                      <Film className="w-16 h-16 mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-center leading-tight line-clamp-3">
                        {currentMovie.Title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">{currentMovie.Year}</p>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Movie Info */}
          <div className="flex-1 space-y-4">
            <div>
              <Badge className="mb-3 bg-primary text-primary-foreground border-0 hover:bg-primary/90">FEATURED</Badge>
              <h2 className="text-4xl font-bold mb-2 leading-tight text-foreground">{currentMovie.Title}</h2>
              <div className="flex items-center gap-4 text-lg text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{currentMovie.Year}</span>
                </div>
                <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                  {currentMovie.Type}
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Discover this amazing {currentMovie.Type} from {currentMovie.Year}. Click to explore more details,
              ratings, cast, and everything you need to know about this title.
            </p>

            <Button
              onClick={() => handleMovieClick(currentMovie.imdbID)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              View Details
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground border border-border w-12 h-12"
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground border border-border w-12 h-12"
          onClick={handleNext}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-4000 ease-linear"
          style={{
            width: isPaused ? "100%" : "0%",
            animation: isPaused ? "none" : "progress 4s linear infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
