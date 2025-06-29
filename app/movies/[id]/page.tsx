"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Rating } from "@/components/rating"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { ThemeToggle } from "@/components/theme-toggle"
import { fetchMovieDetails } from "@/store/slices/movie-slice"
import type { RootState, AppDispatch } from "@/store/store"
import { ArrowLeft, Calendar, Clock, Star, Users, Award, Film, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MovieDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { movieDetails, loading, error } = useSelector((state: RootState) => state.movies)
  const { toast } = useToast()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    setIsPageLoaded(true)
    if (params.id) {
      dispatch(fetchMovieDetails(params.id as string))
    }
  }, [params.id, dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleBackClick = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-background ${isPageLoaded ? "page-transition" : "opacity-0"}`}>
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between animate-fade-in">
            <Button variant="ghost" onClick={handleBackClick} className="hover:bg-muted transition-all duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 animate-fade-in animate-stagger-1">
              <SkeletonLoader className="aspect-[2/3] w-full" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse animate-fade-in animate-stagger-2" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2 animate-fade-in animate-stagger-3" />
              <div className="h-20 bg-muted rounded animate-pulse animate-fade-in animate-stagger-4" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-background ${isPageLoaded ? "page-transition" : "opacity-0"}`}>
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between animate-fade-in">
            <Button variant="ghost" onClick={handleBackClick} className="hover:bg-muted transition-all duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12 animate-fade-in">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md w-full animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
                <h2 className="text-lg font-semibold text-destructive">Error</h2>
              </div>
              <p className="text-destructive/80 mb-4">{error}</p>
              <Button
                onClick={handleBackClick}
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                Go Back to Movies
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!movieDetails) {
    return (
      <div
        className={`min-h-screen bg-background flex items-center justify-center ${isPageLoaded ? "page-transition" : "opacity-0"}`}
      >
        <div className="text-center animate-fade-in">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Movie not found</h2>
          <Button onClick={handleBackClick} className="bg-primary hover:bg-primary/90 transition-all duration-200">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${isPageLoaded ? "page-transition" : "opacity-0"}`}>
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="hover:bg-muted transition-all duration-200 hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1 animate-fade-in animate-stagger-1">
            <div className="sticky top-8">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg border border-border hover-lift">
                {!imageError && movieDetails.Poster !== "N/A" ? (
                  <>
                    <Image
                      src={movieDetails.Poster || "/placeholder.svg"}
                      alt={movieDetails.Title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                    {imageLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80 flex flex-col items-center justify-center p-8 text-foreground">
                    <Film className="w-20 h-20 mb-6 text-muted-foreground" />
                    <h2 className="text-xl font-bold text-center leading-tight mb-4">{movieDetails.Title}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-lg">{movieDetails.Year}</span>
                    </div>
                    <Badge variant="secondary" className="mt-4">
                      {movieDetails.Type}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in animate-stagger-2">
              <h1 className="text-3xl font-bold mb-2 text-foreground">{movieDetails.Title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieDetails.Year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{movieDetails.Runtime}</span>
                </div>
                <Badge variant="secondary">{movieDetails.Rated}</Badge>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movieDetails.Genre.split(", ").map((genre, index) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className={`border-muted-foreground animate-fade-in animate-stagger-${Math.min(index + 3, 8)}`}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating */}
            <Card className="border-border animate-fade-in animate-stagger-3 hover-lift">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Rate this movie</h3>
                <Rating movieId={movieDetails.imdbID} />
              </CardContent>
            </Card>

            {/* Plot */}
            <Card className="border-border animate-fade-in animate-stagger-4 hover-lift">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-card-foreground">Plot</h3>
                <p className="text-muted-foreground leading-relaxed">{movieDetails.Plot}</p>
              </CardContent>
            </Card>

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border animate-fade-in animate-stagger-5 hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-card-foreground">
                    <Users className="w-5 h-5" />
                    Director
                  </h3>
                  <p className="text-muted-foreground">{movieDetails.Director}</p>
                </CardContent>
              </Card>

              <Card className="border-border animate-fade-in animate-stagger-6 hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-card-foreground">
                    <Users className="w-5 h-5" />
                    Cast
                  </h3>
                  <p className="text-muted-foreground">{movieDetails.Actors}</p>
                </CardContent>
              </Card>
            </div>

            {/* Ratings */}
            {movieDetails.Ratings && movieDetails.Ratings.length > 0 && (
              <Card className="border-border animate-fade-in animate-stagger-7 hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-card-foreground">
                    <Star className="w-5 h-5" />
                    Ratings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {movieDetails.Ratings.map((rating, index) => (
                      <div
                        key={index}
                        className={`text-center p-4 bg-muted rounded-lg transition-all duration-300 hover:bg-muted/80 animate-fade-in animate-stagger-${Math.min(index + 1, 8)}`}
                      >
                        <div className="font-semibold text-lg text-foreground">{rating.Value}</div>
                        <div className="text-sm text-muted-foreground">{rating.Source}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Awards */}
            {movieDetails.Awards !== "N/A" && (
              <Card className="border-border animate-fade-in animate-stagger-8 hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-card-foreground">
                    <Award className="w-5 h-5" />
                    Awards
                  </h3>
                  <p className="text-muted-foreground">{movieDetails.Awards}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
