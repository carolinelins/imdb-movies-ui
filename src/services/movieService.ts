import axios from 'axios'
import { MovieInterface } from '../interfaces/Movie'

const API_BASE_URL = 'http://localhost:8000/api'

interface GetMoviesRequestInterface {
  title?: string
  genres?: string[]
  runtimeMin?: number
  runtimeMax?: number
  sort: string
  page: number
}

async function getMovies(params: GetMoviesRequestInterface) {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`, { params })
    return response.data
  } catch (error: any) {
    throw error
  }
}

async function getGenres() {
  try {
    const response = await axios.get(`${API_BASE_URL}/genres`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

async function getPosters(tconsts: string[]) {
  try {
    const response = await axios.get(`${API_BASE_URL}/posters`, { params: { tconsts } })
    return response.data
  } catch (error: any) {
    throw error
  }
}

async function getRecommendedMovies(clickedMovies: MovieInterface[]): Promise<MovieInterface[]> {
  if (!clickedMovies.length) return []

  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations`, {
      params: {
        clicked: JSON.stringify(clickedMovies)
      }
    })
    return response.data
  } catch (error: any) {
    console.error('Error fetching recommended movies:', error)
    throw error
  }
}

export {
  getMovies,
  getGenres,
  getPosters,
  getRecommendedMovies
}