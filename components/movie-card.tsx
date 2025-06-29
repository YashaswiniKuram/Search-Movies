"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Movie } from "@/types/movie"
import { Calendar, Film } from "lucide-react"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleClick = () => {
    // Add a small delay for smooth transition
    setTimeout(() => {
      router.push(`/movies/${movie.imdbID}`)
    }, 100)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group border-border hover:border-primary/50 hover-lift"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          {!imageError && movie.Poster !== "N/A" ? (
            <>
              <Image
                src={movie.Poster || "/placeholder.svg"}
                alt={movie.Title}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {imageLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover text */}
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <p className="text-sm font-medium">Click to view details</p>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80 flex flex-col items-center justify-center p-4 text-foreground group-hover:from-muted/90 group-hover:to-muted/70 transition-all duration-300">
              <Film className="w-12 h-12 mb-3 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              <h3 className="text-sm font-semibold text-center leading-tight mb-2 line-clamp-3 group-hover:text-primary transition-colors duration-300">
                {movie.Title}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Calendar className="w-3 h-3" />
                <span>{movie.Year}</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-card transition-colors duration-300 group-hover:bg-card/90">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 text-card-foreground">
            {movie.Title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar className="w-3 h-3" />
              <span>{movie.Year}</span>
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            >
              {movie.Type}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
