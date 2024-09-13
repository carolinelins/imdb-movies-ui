import { useEffect, useState } from 'react'
import { Col, Container, Pagination, Row, Spinner } from 'react-bootstrap'
import MovieCard from '../components/MovieCard'
import { NavBar } from '../components/NavBar'
import { FiltersAndSortSelects } from '../components/FiltersAndSortSelects'
import { MovieFiltersInterface, MovieInterface, MoviePosterInterface } from '../interfaces/Movie'
import { getMovies, getPosters } from '../services/movieService'
import { FilterListGroup } from '../components/FilterListGroup'

function MoviePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPosters, setIsLoadingPosters] = useState(false)
  const [movies, setMovies] = useState<MovieInterface[]>([])
  const [filters, setFilters] = useState<MovieFiltersInterface>({ title: undefined, genres: [], runtimeMin: undefined, runtimeMax: undefined })
  const [sortClassification, setSortClassification] = useState('title')
  const [sortOrder, setSortOrder] = useState('ASC')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchMovies(page, filters, sortOrder, sortClassification)
  }, [])

  useEffect(() => {
    if (isLoadingPosters) fetchPosters(movies)
  }, [isLoadingPosters])

  function handleButtonSortOrderOnClick(order: string) {
    setPage(0)
    setSortOrder(order)
    fetchMovies(0, filters, order, sortClassification)
  }

  function handleButtonSortClassificationOnClick(classification: string) {
    setPage(0)
    setSortClassification(classification)
    fetchMovies(0, filters, sortOrder, classification)
  }

  async function handleButtonFilterOnClick(filtersInput: MovieFiltersInterface) {
    setPage(0)
    setFilters(filtersInput)
    await fetchMovies(0, filtersInput, sortOrder, sortClassification)
  }

  async function handlePageOnClick(pageInput: number) {
    setPage(pageInput)
    await fetchMovies(pageInput, filters, sortOrder, sortClassification)
  }

  async function fetchMovies(pageInput: number, filtersInput: MovieFiltersInterface, sortOrderInput: string, sortClassificationInput: string) {
    setIsLoading(true)

    const {
      title,
      genres,
      runtimeMin,
      runtimeMax
    } = filtersInput

    const sort = `${sortClassificationInput} ${sortOrderInput}`

    try {
      const response = await getMovies({ title, genres, runtimeMax, runtimeMin, sort, page: pageInput })

      setMovies(response.movies)
      setTotalPages(Math.ceil(response.count / 18))
    } catch (error: any) {
      setMovies([])
      setTotalPages(0)
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
      setIsLoadingPosters(true)
    }
  }

  async function fetchPosters(moviesParam: MovieInterface[]) {
    try {
      const moviesWithoutPosters = moviesParam.filter((el: MovieInterface) => !el.poster).map((el: MovieInterface) => el.tconst)

      const response = await getPosters(moviesWithoutPosters)

      const moviesAux: MovieInterface[] = []

      for (const movie of moviesParam) {
        const poster = response.find((el: MoviePosterInterface) => el.tconst === movie.tconst)?.poster
        poster ? moviesAux.push({ ...movie, poster }) : moviesAux.push({ ...movie })
      }

      setMovies(moviesAux)
      return response
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingPosters(false)
    }
  }

  return <>
    <Container fluid className='p-0 m-0'>
      <Row className='m-0'>
        <Col className='p-0'>
          <NavBar />
        </Col>
      </Row>
    </Container>
    <FiltersAndSortSelects
      sortOrder={sortOrder}
      sortClassification={sortClassification}
      handleButtonSortOrderOnClick={handleButtonSortOrderOnClick}
      handleSelectSortClassificationOnClick={handleButtonSortClassificationOnClick}
      filters={filters}
      isLoading={isLoading || isLoadingPosters}
    />
    <Row className='px-2'>
      <Col>
        <FilterListGroup handleButtonFilterOnClick={handleButtonFilterOnClick} isLoading={isLoading || isLoadingPosters} filters={filters} />
      </Col>
      <Col className='d-flex align-items-center justify-content-center col-9'>

        {isLoading
          ? <Spinner variant='warning' animation='grow' className='p-2' />
          : <Row className='p-3 g-3 m-0'>

            {movies.length > 0 ? movies.map(el => <Col className='d-flex' md={3} key={el.tconst}>
              <MovieCard
                tconst={el.tconst}
                title={el.title}
                genres={el.genres}
                releaseYear={el.releaseYear}
                rating={el.rating}
                runtime={el.runtime}
                poster={el.poster}
                isLoading={isLoadingPosters}
              />
            </Col>)
              : <Col className='d-flex flex-column align-items-center'>
                <i className={`bi bi-${errorMessage ? 'exclamation-triangle' : 'x-circle'} fs-1`} />
                <span className='fs-1 fw-semibold' >{errorMessage ? 'Server error' : 'No results found'}</span>
                <span className='fs-5'>{errorMessage || 'Please adjust your filters or start a new search'}</span>
              </Col>}

            {totalPages > 0 && <Row className='pt-2 px-0'>
              <Pagination className='justify-content-center pe-0'>

                {page !== 0 && <>
                  <Pagination.First disabled={isLoading || isLoadingPosters} onClick={() => handlePageOnClick(0)} />
                  <Pagination.Prev disabled={isLoading || isLoadingPosters} onClick={() => handlePageOnClick(page - 1)} />
                </>}

                <Pagination.Item disabled>{page + 1}</Pagination.Item>

                {page !== totalPages - 1 && <>
                  <Pagination.Next disabled={isLoading || isLoadingPosters} onClick={() => handlePageOnClick(page + 1)} />
                  <Pagination.Last disabled={isLoading || isLoadingPosters} onClick={() => handlePageOnClick(totalPages - 1)} />
                </>}

              </Pagination>
            </Row>}

          </Row>}

      </Col>
    </Row>
  </>
}

export {
  MoviePage
}