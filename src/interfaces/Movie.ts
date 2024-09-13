interface MovieFiltersInterface {
  title?: string
  runtimeMin?: number
  runtimeMax?: number
  genres: string[]
}

interface MovieInterface {
  tconst: string
  title: string
  genres: string[]
  releaseYear: number
  runtime: number
  rating: number
  poster: string | null
}

interface MoviePosterInterface {
  tconst: string
  poster: string | null
}

export {
  type MovieFiltersInterface,
  type MovieInterface,
  type MoviePosterInterface
}