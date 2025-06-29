"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  movieId: string
}

export function Rating({ movieId }: RatingProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    const savedRating = localStorage.getItem(`rating-${movieId}`)
    if (savedRating) {
      setRating(Number.parseInt(savedRating))
    }
  }, [movieId])

  const handleRating = (value: number) => {
    setRating(value)
    localStorage.setItem(`rating-${movieId}`, value.toString())
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="transition-colors duration-150 hover:scale-110 transform"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors duration-150",
                hoverRating >= star || (!hoverRating && rating >= star)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground hover:text-yellow-400",
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-2">{rating > 0 ? `${rating}/5` : "Rate this movie"}</span>
    </div>
  )
}
