import { useEffect, useState } from 'react'
import { Col, Container, Pagination, Row, Spinner } from 'react-bootstrap'
import MovieCard from '../components/MovieCard'
import { FiltersNavBar } from '../components/FiltersNavBar'
import { FiltersAndSortSelects } from '../components/FiltersAndSortSelects'
import { MovieFiltersInterface } from '../interfaces/MovieFilters'
import { getMovies } from '../services/movieService'

interface MovieInterface {
  tconst: string
  title: string
  genres: string[]
  releaseYear: number
  runtime: number
  rating: number
  poster: string | null
}

function MoviePage() {
  const [isLoading, setIsLoading] = useState(true)
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

  function handleButtonFilterOnClick(filtersInput: MovieFiltersInterface) {
    setPage(0)
    setFilters(filtersInput)
    fetchMovies(0, filtersInput, sortOrder, sortClassification)
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
    } catch (err: any) {
      setMovies([])
      setTotalPages(0)
      setErrorMessage(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return <>

    <Container fluid className='p-0 m-0'>

      <Row className='m-0'>
        <Col className='p-0'>
          <FiltersNavBar filters={filters} handleButtonFilterOnClick={handleButtonFilterOnClick} />
        </Col>
      </Row>
    </Container>
    <FiltersAndSortSelects
      sortOrder={sortOrder}
      sortClassification={sortClassification}
      handleButtonSortOrderOnClick={handleButtonSortOrderOnClick}
      handleSelectSortClassificationOnClick={handleButtonSortClassificationOnClick}
      filters={filters}
    />
    {isLoading
      ? <Container className='d-flex flex-grow-1'>
        <Row className='flex-grow-1'>
          <Col className='d-flex justify-content-center align-items-center'>
            <Spinner variant='warning' animation='grow' className='p-2' />
          </Col>
        </Row>
      </Container>
      : <Container>
        <Row className='p-3 g-3 m-0'>

          {movies.length > 0 ? movies.map(el => <Col className='d-flex' md={2} key={el.tconst}>
            <MovieCard
              tconst={el.tconst}
              title={el.title}
              genres={el.genres}
              releaseYear={el.releaseYear}
              rating={el.rating}
              runtime={el.runtime}
              poster={el.poster}
            />
          </Col>)
            : <Col className='d-flex flex-column align-items-center'>
              <i className={`bi bi-${errorMessage ? 'exclamation-triangle' : 'x-circle'} fs-1`} />
              <span className='fs-1 fw-semibold' >{errorMessage ? 'Server error' : 'No results found'}</span>
              <span className='fs-5'>{errorMessage || 'Please adjust your filters or start a new search'}</span>
            </Col>}

        </Row>
        {totalPages > 0 && <Row>
          <Pagination className='justify-content-center'>
            {page !== 0 && <>
              <Pagination.First onClick={() => handlePageOnClick(0)} />
              <Pagination.Prev onClick={() => handlePageOnClick(page - 1)} />
            </>}
            <Pagination.Item disabled>{page + 1}</Pagination.Item>
            {page !== totalPages - 1 && <>
              <Pagination.Next onClick={() => handlePageOnClick(page + 1)} />
              <Pagination.Last onClick={() => handlePageOnClick(totalPages - 1)} />
            </>}
          </Pagination>
        </Row>}
      </Container>}
  </>
}

export {
  MoviePage
}