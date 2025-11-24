import { Button, Card, Container, ListGroup, Spinner } from 'react-bootstrap'
import { toHoursAndMinutes } from '../utils/humanizeMinutes'

interface MovieCardProps {
  tconst: string
  title: string
  genres: string[] | null
  releaseYear: number | null
  rating: number | null
  runtime: number | null
  poster: string | null
  isLoading: boolean
  onClickMovie?: (movie: MovieCardProps) => void
}

function MovieCard(props: MovieCardProps) {
  const handleClick = () => {
    props.onClickMovie?.(props)
    window.open(`https://imdb.com/title/${props.tconst}`, '_blank')
  }

  return (
    <Card className='w-100'>
      {props.poster ?
        <Card.Img variant="top" width='231px' height='306px' src={props.poster} />
        : <Container
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ width: '100%', height: '306px', backgroundColor: '#f0f0f0' }}
        >
          {props.isLoading ?
            <>
              <Spinner animation='grow' />
              <p>Loading poster...</p>
            </>
            :
            <>
              <i className="bi bi-image-alt" style={{ fontSize: '50px' }} />
              <p>No poster available</p>
            </>
          }
        </Container>
      }

      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {props.genres ? props.genres.join(', ') : 'No genres listed'}
        </Card.Subtitle>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <i className='bi bi-calendar' /> {props.releaseYear || 'Empty year'}
          </ListGroup.Item>
          <ListGroup.Item>
            <i className='bi bi-clock' /> {props.runtime ? toHoursAndMinutes(props.runtime) : 'Empty runtime'}
          </ListGroup.Item>
          <ListGroup.Item>
            <i className='bi bi-star-half' /> {props.rating || 'Empty rating'}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>

      <Card.Footer className='p-0'>
        <Button
          variant='warning'
          className='w-100 rounded-top-0 text-black fw-semibold border-0'
          onClick={handleClick}
        >
          See on IMDb <i className='bi bi-box-arrow-up-right' />
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default MovieCard
