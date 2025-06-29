import type { Movie } from "./types" // Assuming Movie type is declared in a separate file

const API_KEY = "f524fea9"
const BASE_URL = "https://www.omdbapi.com"

// Get current year dynamically
const getCurrentYear = () => new Date().getFullYear()

// Get recent years for better movie discovery
const getRecentYears = () => {
  const currentYear = getCurrentYear()
  return [currentYear, currentYear - 1, currentYear - 2]
}

export async function searchMoviesAPI(query: string, page = 1) {
  try {
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.Response === "False") {
      throw new Error(data.Error || "No movies found")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

export async function getLatestMoviesAPI(): Promise<Movie[]> {
  try {
    const currentYear = getCurrentYear()
    const recentYears = getRecentYears()

    // Search for popular recent movies to show as latest
    const popularSearches = ["Avengers", "Batman", "Spider", "Marvel", "Star Wars", "Fast", "Mission", "John Wick"]
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)]

    // Try current year first
    let response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${randomSearch}&y=${currentYear}`)

    if (!response.ok) {
      throw new Error("Failed to fetch latest movies")
    }

    let data = await response.json()

    // If no results for current year, try previous years
    if (data.Response === "False") {
      for (const year of recentYears) {
        try {
          response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${randomSearch}&y=${year}`)
          if (response.ok) {
            data = await response.json()
            if (data.Response === "True" && data.Search) {
              break
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch movies for year ${year}:`, error)
          continue
        }
      }
    }

    // If still no results, try broader searches without year restriction
    if (data.Response === "False" || !data.Search) {
      const fallbackSearches = ["movie", "action", "drama", "comedy", "thriller"]

      for (const searchTerm of fallbackSearches) {
        try {
          // Try with recent years first
          for (const year of recentYears) {
            response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${searchTerm}&y=${year}`)
            if (response.ok) {
              data = await response.json()
              if (data.Response === "True" && data.Search) {
                return data.Search.slice(0, 10)
              }
            }
          }

          // If no results with year, try without year restriction
          response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${searchTerm}`)
          if (response.ok) {
            data = await response.json()
            if (data.Response === "True" && data.Search) {
              // Filter for more recent movies from the results
              const recentMovies = data.Search.filter((movie: Movie) => {
                const movieYear = Number.parseInt(movie.Year)
                return movieYear >= currentYear - 5 // Movies from last 5 years
              })

              if (recentMovies.length > 0) {
                return recentMovies.slice(0, 10)
              }

              return data.Search.slice(0, 10)
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch movies with search term ${searchTerm}:`, error)
          continue
        }
      }
    }

    return (data.Search || []).slice(0, 10)
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

export async function getMovieDetailsAPI(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${id}&plot=full`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found!")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Utility function to get movies by year range
export async function getMoviesByYearRange(searchTerm: string, startYear?: number, endYear?: number): Promise<Movie[]> {
  try {
    const currentYear = getCurrentYear()
    const start = startYear || currentYear - 2
    const end = endYear || currentYear

    const allMovies: Movie[] = []

    for (let year = end; year >= start && allMovies.length < 10; year--) {
      try {
        const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&y=${year}`)

        if (response.ok) {
          const data = await response.json()
          if (data.Response === "True" && data.Search) {
            allMovies.push(...data.Search)
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch movies for year ${year}:`, error)
        continue
      }
    }

    // Remove duplicates and return up to 10 movies
    const uniqueMovies = allMovies.filter(
      (movie, index, self) => index === self.findIndex((m) => m.imdbID === movie.imdbID),
    )

    return uniqueMovies.slice(0, 10)
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}
