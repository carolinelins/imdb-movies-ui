import axios from 'axios'

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
  } catch (err: any) {
    throw err
  }
}

async function getGenres() {
  try {
    const response = await axios.get(`${API_BASE_URL}/genres`)
    return response.data
  } catch (err: any) {
    throw err
  }
}

export {
  getMovies,
  getGenres
}