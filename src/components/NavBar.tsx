import { Navbar, Nav, Image } from 'react-bootstrap'

type NavBarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function NavBar({ activeTab, setActiveTab }: NavBarProps) {
  return (
    <Navbar className="bg-black p-2">
      <div className="d-flex align-items-center me-3">
        <Image src="/imdb_brand.png" height={32} className="m-2" />
        <span className="text-white fw-semibold">Movie Database</span>
      </div>
      <Nav className="me-auto">
        <Nav.Link
          onClick={() => setActiveTab('search')}
          className={activeTab === 'search' ? 'text-warning' : 'text-white'}
        >
          Search
        </Nav.Link>
        <Nav.Link
          onClick={() => setActiveTab('recommendations')}
          className={activeTab === 'recommendations' ? 'text-warning' : 'text-white'}
        >
          Recommendations
        </Nav.Link>
        <Nav.Link
          onClick={() => setActiveTab('profile')}
          className={activeTab === 'profile' ? 'text-warning' : 'text-white'}
        >
          Profile
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default NavBar
