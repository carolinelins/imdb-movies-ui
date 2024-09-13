import { Navbar, Image } from 'react-bootstrap'

function NavBar() {
  return <Navbar className="bg-black justify-content-between">
    <div className='d-flex align-items-center'>
      <Image src='/imdb_brand.png' height={32} className='m-2' />
      <span className='text-white fw-semibold'>Movie Database</span>
    </div>
  </Navbar>
}

export {
  NavBar
}