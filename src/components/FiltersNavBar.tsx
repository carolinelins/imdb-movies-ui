import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { Navbar, Form, Row, Col, Button, Image, Accordion, useAccordionButton, FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { MovieFiltersInterface } from '../interfaces/MovieFilters'
import { getGenres } from '../services/movieService'

interface CustomToggleProps {
  eventKey: string
  handleAccordionFilterOnClick: Function
  children: ReactNode
}

interface FiltersNavBarProps {
  filters?: MovieFiltersInterface
  handleButtonFilterOnClick: Function
}

function CustomToggle(props: CustomToggleProps) {
  const handleAccordionFilterOnClick = useAccordionButton(props.eventKey, () => props.handleAccordionFilterOnClick())

  return <Button
    onClick={handleAccordionFilterOnClick}
    variant='outline-light'
    className='m-2 fw-semibold'
  >
    {props.children}
  </Button>
}

function FiltersNavBar(props: FiltersNavBarProps) {
  const [title, setTitle] = useState<string>('')
  const [runtimeMin, setRuntimeMin] = useState<number | ''>('')
  const [runtimeMax, setRuntimeMax] = useState<number | ''>('')
  const [genres, setGenres] = useState<string[]>([])
  const [genreOptions, setGenreOptions] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
    }
  }

  function handleAccordionFilterOnClick() {
    if (isCollapsed) {
      setTitle(props.filters?.title || '')
      setRuntimeMin(props.filters?.runtimeMin || '')
      setRuntimeMax(props.filters?.runtimeMax || '')
      setGenres(props.filters?.genres || [])
    }
    setIsCollapsed(prevState => !prevState)
  }

  function handleButtonFilterOnClick(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    setIsCollapsed(false)

    let filters

    if (runtimeMin > runtimeMax) {
      const fixedRuntimeMax = runtimeMin
      const fixedRuntimeMin = runtimeMax
      setRuntimeMin(fixedRuntimeMin)
      setRuntimeMax(fixedRuntimeMax)
      filters = { title, genres, runtimeMin: fixedRuntimeMin, runtimeMax: fixedRuntimeMax }
    } else filters = { title, runtimeMin, runtimeMax, genres }

    props.handleButtonFilterOnClick(filters)

  }

  return <Accordion>
    <Navbar className="bg-black justify-content-between">
      <div className='d-flex align-items-center'>
        <Image src='/imdb_brand.png' height={32} className='m-2' />
        <span className='text-white fw-semibold'>Movie Database</span>
      </div>
      <CustomToggle eventKey='filters' handleAccordionFilterOnClick={handleAccordionFilterOnClick}>
        Filters <i className={`ms-1 bi bi-${isCollapsed ? 'chevron-up' : 'chevron-down'}`} />
      </CustomToggle>
    </Navbar>
    <Accordion.Collapse in={isCollapsed} eventKey='filters'>
      <Navbar className="justify-content-center" style={{ backgroundColor: '#F5C518' }}>
        <Form className='d-flex flex-grow-1' data-inline onSubmit={handleButtonFilterOnClick}>
          <Row className='d-flex align-items-center flex-grow-1'>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="Title"
                className='mx-2'
              >
                <Form.Control type="text" placeholder="Title" value={title} onInput={evt => setTitle(evt.currentTarget.value)} />
              </FloatingLabel>
            </Col>
            <div className='vr p-0 border border-black' style={{ opacity: 1 }}></div>
            <Col className='d-flex flex-column'>
              <Form.Group as={Row}>
                <Col>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Runtime in min (from)"
                    className='mx-2'
                  >
                    <Form.Control
                      type="number"
                      placeholder="Runtime in min (from)"
                      value={runtimeMin}
                      onInput={evt => setRuntimeMin(parseInt(evt.currentTarget.value.replace(/[^0-9]/g, '')))
                      }
                    />

                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Runtime in min (to)"
                    className='mx-2'
                  >
                    <Form.Control
                      type="number"
                      placeholder="Runtime in min (to)"
                      value={runtimeMax}
                      onInput={evt => setRuntimeMax(parseInt(evt.currentTarget.value.replace(/[^0-9]/g, '')))
                      }
                    />
                  </FloatingLabel>
                </Col>
              </Form.Group>
            </Col>
            <div className='vr p-0 border border-black' style={{ opacity: 1 }}></div>
            <Col className='text-center'>
              {genreOptions.length > 0 ? genreOptions.map(el => <React.Fragment key={el}>
                <input
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
              </React.Fragment>
              )
                : <span>
                  <i className='bi bi-exclamation-triangle me-1' />Could not fetch movie genres{errorMessage ? ` (${errorMessage})` : ''}. Please refresh the page.
                </span>}
            </Col>
            <Col md='auto' className='mx-2'>

              {isButtonFilterDisabled
                ? <OverlayTrigger overlay={<Tooltip>Change filters to search</Tooltip>}>
                  <span className='d-inline-block'>
                    <Button variant='light' size='lg' disabled={isButtonFilterDisabled} type='submit'>
                      <i className='bi bi-funnel' /> Filter
                    </Button>
                  </span>
                </OverlayTrigger>
                : <Button variant='light' size='lg' type='submit'>
                  <i className='bi bi-funnel' /> Filter
                </Button>}

            </Col>
          </Row>
        </Form>
      </Navbar>
    </Accordion.Collapse>
  </Accordion>
}

export {
  FiltersNavBar
}