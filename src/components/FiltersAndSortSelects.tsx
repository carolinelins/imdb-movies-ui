import { FloatingLabel, Form, Button, ButtonGroup, OverlayTrigger, Tooltip, Badge, Row, Col } from 'react-bootstrap'
import { MovieFiltersInterface } from '../interfaces/MovieFilters'
import { useMemo } from 'react'
import { toHoursAndMinutes } from '../utils/humanizeMinutes'

interface FiltersAndSortSelectsProps {
  sortOrder: string
  sortClassification: string
  handleButtonSortOrderOnClick: Function
  handleSelectSortClassificationOnClick: Function
  filters: MovieFiltersInterface
}

function FiltersAndSortSelects(props: FiltersAndSortSelectsProps) {
  const filters = useMemo(() => ({
    title: props.filters.title,
    genres: props.filters.genres,
    runtime: {
      runtimeMin: props.filters.runtimeMin,
      runtimeMax: props.filters.runtimeMax
    }
  }), [props.filters])

  function filterIcon(filter: string) {
    switch (filter) {
      case 'title': return 'film'
      case 'genres': return 'bookmarks'
      case 'runtime': return 'clock'
      default: return 'film'
    }
  }

  function filterCaption(filter: string, value: string | string[] | { runtimeMin?: number, runtimeMax?: number }) {
    switch (filter) {
      case 'title': return value.toString()
      case 'genres': return Array.isArray(value) ? value.join(', ') : value.toString()
      case 'runtime':
        if (typeof value === 'object' && !Array.isArray(value) && Object.values(value).some(val => val !== undefined)) {
          const runtimeMinString = value.runtimeMin ? `From ${toHoursAndMinutes(value.runtimeMin)}` : ''

          if (value.runtimeMax) {
            const runtimeMaxString = value.runtimeMin ? ` to ${toHoursAndMinutes(value.runtimeMax)}` : `To ${toHoursAndMinutes(value.runtimeMax)}`
            return runtimeMinString.concat(runtimeMaxString)
          }

          return runtimeMinString
        }
        return ''
      default: return value.toString()
    }

  }

  return <Row className='mt-2 me-1 d-flex justify-content-between align-items-center'>
    <Col className='d-flex gap-2 ms-2'>

      {Object.entries(filters).map(([key, value]) => ((typeof value === 'string' && value) || (typeof value === 'object' && Object.values(value).some(val => val)))
        && <h4 key={key}>
          <Badge bg='light' className='badge-outline-dark fw-semibold' pill>
            <i className={`bi bi-${filterIcon(key)}`} /> <span>{filterCaption(key, value)}</span>
          </Badge>
        </h4>)}

    </Col>
    <Col md='auto' className='d-flex'>
      <ButtonGroup className='w-auto me-1 my-2'>
        <OverlayTrigger overlay={<Tooltip>Ascending</Tooltip>}>
          <Button
            variant={props.sortOrder === 'ASC' ? 'dark' : 'outline-dark'}
            disabled={props.sortOrder === 'ASC'}
            value='ASC'
            onClick={evt => props.handleButtonSortOrderOnClick(evt.currentTarget.value)}
          >
            <i className='bi bi-sort-up' />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Descending</Tooltip>}>
          <Button
            variant={props.sortOrder === 'DESC' ? 'dark' : 'outline-dark'}
            disabled={props.sortOrder === 'DESC'}
            value='DESC'
            onClick={evt => props.handleButtonSortOrderOnClick(evt.currentTarget.value)}
          >
            <i className='bi bi-sort-down' />
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
      <FloatingLabel className='mx-1' label='Sort by'>
        <Form.Select value={props.sortClassification} onChange={evt => props.handleSelectSortClassificationOnClick(evt.currentTarget.value)}>
          <option value='title'>Title</option>
          <option value='release_year'>Year</option>
          <option value='runtime'>Runtime</option>
          <option value='rating'>Rating</option>
        </Form.Select>
      </FloatingLabel>
    </Col>
  </Row>
}

export {
  FiltersAndSortSelects
}