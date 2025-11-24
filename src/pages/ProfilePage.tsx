import React, { useEffect, useMemo, useState } from "react";
import { ListGroup, Form, Spinner, OverlayTrigger, Tooltip, Toast, ToastContainer } from "react-bootstrap";
import { getGenres } from '../services/movieService'

function ProfilePage() {
    const [genreOptions, setGenreOptions] = useState<string[]>([])
    const [genres, setGenres] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState('')
    const [isGenreOptionsLoading, setIsGenreOptionsLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showToast, setShowToast] = useState(false);
    const [savedGenres, setSavedGenres] = useState<string[]>([]);

    useEffect(() => {
        fetchGenres()

        const localStorageGenres = localStorage.getItem("genres");
        if (localStorageGenres) {
            try {
                setGenres(JSON.parse(localStorageGenres));
                setSavedGenres(JSON.parse(localStorageGenres));
            } catch (err) {
                console.error(err);
                setGenres([]);
            }
        } else {
            setGenres([])
        }
    }, [])

    const isSameAsSaved = useMemo(() => {
        if (savedGenres.length === 0) return genres.length === 0;
        if (genres.length !== savedGenres.length) return false;
        const sortedA = [...genres].sort();
        const sortedB = [...savedGenres].sort();
        return sortedA.every((val, idx) => val === sortedB[idx]);
    }, [genres, savedGenres]);

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

    async function handleSetGenres(evt: React.FormEvent) {
        evt.preventDefault();
        setIsLoading(true);
        try {
            localStorage.setItem("genres", JSON.stringify(genres));
            setSavedGenres(genres);
        } finally {
            setShowToast(true);
            setIsLoading(false);
        }
    }

    return <>
        <div className="w-50 mx-auto">
            <h5 className='text-dark text-center'>Choose your favorite genres</h5>
            <p className='text-muted text-center'>
                We'll recommend movies based on your favorite genres.
            </p>
            <ListGroup>
                <Form onSubmit={handleSetGenres}>
                    <ListGroup.Item className='d-flex flex-column w-50 mx-auto rounded-top'>
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
                    {isSameAsSaved && !isLoading
                        ? <OverlayTrigger overlay={<Tooltip>Change genres to set new profile</Tooltip>}>
                            <span className='d-block'>
                                <ListGroup.Item
                                    variant='dark'
                                    action
                                    type='submit'
                                    disabled
                                    className='rounded-bottom text-center fs-6 border border-dark-subtle d-flex flex-column w-50 mx-auto'
                                >
                                    <i className='bi bi-funnel' /> Set
                                </ListGroup.Item>
                            </span>
                        </OverlayTrigger>
                        : <ListGroup.Item
                            variant='dark'
                            action
                            type='submit'
                            disabled={isLoading || isSameAsSaved}
                            className='rounded-bottom text-center fs-6 border border-dark-subtle d-flex flex-column w-50 mx-auto'
                        >
                            {isLoading
                                ? <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                : <i className='bi bi-funnel' />} Set
                        </ListGroup.Item>}
                </Form>
            </ListGroup>
        </div>
        <ToastContainer position="top-end">
            <Toast  onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide className="m-2" bg="success">
                <Toast.Header></Toast.Header>
                <Toast.Body className="text-white">
                    Your profile has been updated successfully!
                </Toast.Body>
            </Toast>
        </ToastContainer>
    </>
}

export {
    ProfilePage
}