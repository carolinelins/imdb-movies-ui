import { useEffect, useState } from 'react'
import { Col, Form, Row, Spinner } from 'react-bootstrap'
import MovieCard from '../components/MovieCard'
import { MovieInterface } from '../interfaces/Movie'
import { getPosters, getRecommendedMovies, getMovies } from '../services/movieService'

export function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPosters, setIsLoadingPosters] = useState(false)
  const [movies, setMovies] = useState<MovieInterface[]>([])
  const [clickedMovies, setClickedMovies] = useState<MovieInterface[]>([])
  const [mode, setMode] = useState<'clicks' | 'profile'>('clicks')
  const [savedGenres, setSavedGenres] = useState<string[]>([]);

  useEffect(() => {
    const localStorageGenres = localStorage.getItem("genres");
    if (localStorageGenres) setSavedGenres(JSON.parse(localStorageGenres));

    const stored: MovieInterface[] = JSON.parse(localStorage.getItem('clickedMovies') || '[]')
    setClickedMovies(stored)
    fetchRecommendations(stored)
  }, [])

  useEffect(() => {
    if (isLoadingPosters) fetchPosters(movies)
  }, [isLoadingPosters])

  async function fetchRecommendations(storedMovies: MovieInterface[]) {
    setIsLoading(true)
    try {
      if (!storedMovies.length) {
        setMovies([])
        return
      }

      const response = await getRecommendedMovies(storedMovies)
      setMovies(response)
    } catch (error: any) {
      console.error(error)
      setMovies([])
    } finally {
      setIsLoading(false)
      setIsLoadingPosters(true)
    }
  }

  async function fetchProfileRecommendations() {
    setIsLoading(true)
    try {
      const savedGenres = JSON.parse(localStorage.getItem('genres') || '[]')
      if (!savedGenres.length) {
        setMovies([])
        return
      }

      const response = await getMovies({
        genres: savedGenres,
        sort: 'RANDOM()',
        page: 1,
      })

      setMovies(response.movies)
    } catch (error: any) {
      console.error(error)
      setMovies([])
    } finally {
      setIsLoading(false)
      setIsLoadingPosters(true)
    }
  }

  function handleModeChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const selectedMode = evt.target.value as 'clicks' | 'profile'
    setMode(selectedMode)

    setIsLoading(true)
    setMovies([])

    if (selectedMode === 'clicks') {
      const stored: MovieInterface[] = JSON.parse(localStorage.getItem('clickedMovies') || '[]')
      setClickedMovies(stored)
      fetchRecommendations(stored)
    } else {
      fetchProfileRecommendations()
    }
  }

  async function fetchPosters(moviesParam: MovieInterface[]) {
    try {
      const moviesWithoutPosters = moviesParam.filter(m => !m.poster).map(m => m.tconst)
      const response = await getPosters(moviesWithoutPosters)

      const moviesAux: MovieInterface[] = moviesParam.map(movie => {
        const poster = response.find((p: { tconst: string }) => p.tconst === movie.tconst)?.poster
        return poster ? { ...movie, poster } : movie
      })

      setMovies(moviesAux)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingPosters(false)
    }
  }

  function handleMovieClick(movie: MovieInterface) {
    try {
      const existing = JSON.parse(localStorage.getItem('clickedMovies') || '[]')

      const minimalMovie = {
        tconst: movie.tconst,
        title: movie.title,
        genres: movie.genres,
        runtime: movie.runtime,
        rating: movie.rating,
        releaseYear: movie.releaseYear,
        poster: movie.poster
      }

      const alreadyClicked = existing.some((m: any) => m.tconst === minimalMovie.tconst)
      if (!alreadyClicked) {
        const updated = [...existing, minimalMovie].slice(-20)
        localStorage.setItem('clickedMovies', JSON.stringify(updated))
      }
    } catch (err) {
      console.error('Error saving movie click', err)
    }
  }

  function renderBasedOnText() {
    if (mode === 'profile') return 'Based on your profile preferences'
    const titles = clickedMovies.map(m => m.title)
    if (!titles.length) return ''
    if (titles.length === 1) return `Based on ${titles[0]}`
    if (titles.length === 2) return `Based on ${titles[0]} and ${titles[1]}`
    if (titles.length === 3) return `Based on ${titles[0]}, ${titles[1]} and ${titles[2]}`

    const shuffled = [...titles].sort(() => Math.random() - 0.5)
    const randomThree = shuffled.slice(0, 3)
    return `Based on ${randomThree[0]}, ${randomThree[1]}, ${randomThree[2]} and more`
  }

  return (
    <div className='p-3'>
      <Form>
        <Form.Group className='mb-3 text-center'>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio1"
              value="clicks"
              checked={mode === 'clicks'}
              onChange={handleModeChange}
            />
            <label className="form-check-label" htmlFor="inlineRadio1">
              Based on my clicks
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio2"
              value="profile"
              checked={mode === 'profile'}
              onChange={handleModeChange}
            />
            <label className="form-check-label" htmlFor="inlineRadio2">
              Based on my profile
            </label>
          </div>
        </Form.Group>
      </Form>

      {isLoading ? (
        <div className='text-center mt-5'>
          <Spinner animation='border' />
        </div>
      ) : movies.length === 0 ? (
        <div className='text-center mt-5 text-muted'>
          {mode === 'clicks'
            ? 'No history found. Explore some movies first. 🎥'
            : 'No genres found in your profile. Go to your profile page and set your favorite genres.'}
        </div>
      ) : (
        <>
          <h5 className='text-dark'>{renderBasedOnText()}</h5>
          <p className='text-muted'>
            {mode === 'profile'
              ? 'Movies with genres from your profile: ' + savedGenres.join(', ')
              : 'Movies with similar genres, ratings, release year and runtimes.'}
          </p>

          <Row className='p-3 g-3'>
            {movies.map(movie => (
              <Col md={3} key={movie.tconst} className='d-flex'>
                <MovieCard
                  tconst={movie.tconst}
                  title={movie.title}
                  genres={movie.genres}
                  releaseYear={movie.releaseYear}
                  rating={movie.rating}
                  runtime={movie.runtime}
                  poster={movie.poster}
                  isLoading={isLoadingPosters}
                  onClickMovie={() => handleMovieClick(movie)}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  )
}
