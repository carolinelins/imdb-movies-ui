import React, { useEffect, useMemo, useState } from 'react'
import { FloatingLabel, Form, InputGroup, ListGroup, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'
import { getGenres } from '../services/movieService'
import { MovieFiltersInterface } from '../interfaces/Movie'

interface FilterListGroupProps {
  handleButtonFilterOnClick?: Function
  isLoading: boolean
  filters?: MovieFiltersInterface
}

function FilterListGroup(props: FilterListGroupProps) {
  const [title, setTitle] = useState<string>('')
  const [runtimeMin, setRuntimeMin] = useState<number | string>('')
  const [runtimeMax, setRuntimeMax] = useState<number | string>('')
  const [runtimeMinValidationMessage, setRuntimeMinValidationMessage] = useState<string>()
  const [runtimeMaxValidationMessage, setRuntimeMaxValidationMessage] = useState<string>()
  const [genres, setGenres] = useState<string[]>([])
  const [genreOptions, setGenreOptions] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isGenreOptionsLoading, setIsGenreOptionsLoading] = useState(true)

  const isButtonFilterDisabled = useMemo(() => {
    return (title === '' ? !props.filters?.title : props.filters?.title === title)
      && (runtimeMin === '' ? !props.filters?.runtimeMin : props.filters?.runtimeMin === runtimeMin)
      && (runtimeMax === '' ? !props.filters?.runtimeMax : props.filters?.runtimeMax === runtimeMax)
      && (genres.length === props.filters?.genres.length && genres.every(el => props.filters?.genres.includes(el)))
  }, [props.filters, title, runtimeMin, runtimeMax, genres])

  useEffect(() => {
    fetchGenres()
  }, [])

  async function fetchGenres() {
    try {
      const response = await getGenres()
      setGenreOptions(response)
    } catch (err: any) {
      setGenreOptions([])
      setErrorMessage(err.message)
    } finally {
      setIsGenreOptionsLoading(false)
    }
  }

  async function handleButtonFilterOnClick(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    let filters

    if (runtimeMin && runtimeMax && runtimeMin > runtimeMax) {
      const fixedRuntimeMax = runtimeMin
      const fixedRuntimeMin = runtimeMax
      setRuntimeMin(fixedRuntimeMin)
      setRuntimeMax(fixedRuntimeMax)
      filters = { title, genres, runtimeMin: fixedRuntimeMin, runtimeMax: fixedRuntimeMax }
    } else filters = { title, runtimeMin, runtimeMax, genres }

    if (props.handleButtonFilterOnClick) await props.handleButtonFilterOnClick(filters)
  }

  function handleFormOnInvalid(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    const target = evt.target as HTMLFormElement

    if (target.id === 'runtime-min-input') setRuntimeMinValidationMessage(target.validationMessage)
    if (target.id === 'runtime-max-input') setRuntimeMaxValidationMessage(target.validationMessage)
  }

  function handleRuntimeMinOnInput(evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setRuntimeMinValidationMessage('')
    setRuntimeMin(evt.currentTarget.value)
  }

  function handleRuntimeMaxOnInput(evt: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setRuntimeMaxValidationMessage('')
    setRuntimeMax(evt.currentTarget.value)
  }

  return <ListGroup>
    <Form onSubmit={handleButtonFilterOnClick} onInvalid={handleFormOnInvalid}>
      <ListGroup.Item className='rounded-top'>
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Filter by title" value={title} onInput={evt => setTitle(evt.currentTarget.value)} />
        </Form.Group>
      </ListGroup.Item>
      <ListGroup.Item>
        <Form.Group  >
          <Form.Label>Runtime in minutes</Form.Label>
          <InputGroup className='mb-2'>
            <FloatingLabel
              label="From"
              className={runtimeMinValidationMessage ? 'was-validated' : ''} >
              <Form.Control
                id='runtime-min-input'
                type="number"
                placeholder="Runtime in min (from)"
                value={runtimeMin}
                min={1}
                onInput={handleRuntimeMinOnInput}
              />
              <Form.Control.Feedback className='ms-1 border border-0' type='invalid'>
                {runtimeMinValidationMessage}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel label="To" className={runtimeMaxValidationMessage ? 'was-validated' : ''} >
              <Form.Control
                className={(!runtimeMaxValidationMessage && runtimeMinValidationMessage) ? 'border-left-transparent' : ''}
                id='runtime-max-input'
                type="number"
                placeholder="Runtime in min (to)"
                value={runtimeMax}
                min={1}
                onInput={handleRuntimeMaxOnInput}
              />
              <Form.Control.Feedback className='ms-1' type='invalid'>
                {runtimeMaxValidationMessage}
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>
        </Form.Group>
      </ListGroup.Item>
      <ListGroup.Item className='d-flex flex-column'>
        <Form.Label>Genres</Form.Label>
        {genreOptions.length > 0 ? <Form.Group className='text-center mb-2'>

          {genreOptions.map(el => <React.Fragment key={el}>
            <input
              name='genres'
              type="checkbox"
              className="btn-check"
              value={el}
              id={el}
              checked={genres.includes(el)}
              onChange={evt => setGenres(prevState => prevState.includes(evt.target.value)
                ? prevState.filter(el => el !== evt.target.value)
                : [...prevState, evt.target.value]
              )}
            />
            <label className="btn btn-sm me-1 mb-1 btn-outline-dark fw-semibold" htmlFor={el}>
              {genres.includes(el) && <i className='bi bi-check-lg me-1' />}{el}
            </label>
          </React.Fragment>)}

        </Form.Group>
          : isGenreOptionsLoading
            ? <Spinner className='align-self-center' animation="grow" />
            : <span>
              <i className='bi bi-exclamation-triangle me-1' />Could not fetch movie genres{errorMessage ? ` (${errorMessage})` : ''}. Please refresh the page.
            </span>}
      </ListGroup.Item>

      {isButtonFilterDisabled && !props.isLoading
        ? <OverlayTrigger overlay={<Tooltip>Change filters to search</Tooltip>}>
          <span className='d-block'>
            <ListGroup.Item
              variant='dark'
              action
              type='submit'
              disabled
              className='rounded-bottom text-center fs-6 border border-dark-subtle'
            >
              <i className='bi bi-funnel' /> Filter
            </ListGroup.Item>
          </span>
        </OverlayTrigger>
        : <ListGroup.Item
          variant='dark'
          action
          type='submit'
          disabled={props.isLoading || isButtonFilterDisabled}
          className='rounded-bottom text-center fs-6 border border-dark-subtle'
        >
          {props.isLoading
            ? <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            : <i className='bi bi-funnel' />} Filter
        </ListGroup.Item>}

    </Form>
  </ListGroup>
}

export {
  FilterListGroup
}