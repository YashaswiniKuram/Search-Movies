import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Movie, MovieDetails } from "@/types/movie"
import { searchMoviesAPI, getMovieDetailsAPI, getLatestMoviesAPI } from "@/lib/api"

interface MovieState {
  movies: Movie[]
  latestMovies: Movie[]
  movieDetails: MovieDetails | null
  loading: boolean
  latestLoading: boolean
  error: string | null
  searchQuery: string
  currentPage: number
  totalResults: number
  hasMorePages: boolean
}

const initialState: MovieState = {
  movies: [],
  latestMovies: [],
  movieDetails: null,
  loading: false,
  latestLoading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  totalResults: 0,
  hasMorePages: false,
}

export const searchMovies = createAsyncThunk(
  "movies/searchMovies",
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await searchMoviesAPI(query, page)
      return {
        movies: response.Search || [],
        query,
        page,
        totalResults: Number.parseInt(response.totalResults || "0"),
        hasMorePages: response.Search && response.Search.length === 10,
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to search movies")
    }
  },
)

export const fetchLatestMovies = createAsyncThunk("movies/fetchLatestMovies", async (_, { rejectWithValue }) => {
  try {
    const movies = await getLatestMoviesAPI()
    return movies
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch latest movies")
  }
})

export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchMovieDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getMovieDetailsAPI(id)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch movie details")
    }
  },
)

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.movies = []
      state.searchQuery = ""
      state.error = null
      state.currentPage = 1
      state.totalResults = 0
      state.hasMorePages = false
    },
    clearMovieDetails: (state) => {
      state.movieDetails = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Search movies
      .addCase(searchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false
        const sortedMovies = action.payload.movies
          .sort((a, b) => Number.parseInt(b.Year) - Number.parseInt(a.Year))
          .slice(0, 10)

        state.movies = sortedMovies
        state.searchQuery = action.payload.query
        state.currentPage = action.payload.page
        state.totalResults = action.payload.totalResults
        state.hasMorePages = action.payload.hasMorePages && sortedMovies.length === 10
        state.error = null
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.movies = []
        state.hasMorePages = false
      })
      // Fetch latest movies
      .addCase(fetchLatestMovies.pending, (state) => {
        state.latestLoading = true
      })
      .addCase(fetchLatestMovies.fulfilled, (state, action) => {
        state.latestLoading = false
        state.latestMovies = action.payload
      })
      .addCase(fetchLatestMovies.rejected, (state, action) => {
        state.latestLoading = false
        state.error = action.payload as string
      })
      // Fetch movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false
        state.movieDetails = action.payload
        state.error = null
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSearch, clearMovieDetails, clearError } = movieSlice.actions
export default movieSlice.reducer
