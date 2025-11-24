import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from './components/NavBar';
import { MoviePage } from './pages/MoviePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className='d-flex flex-column overflow-x-hidden' style={{ minHeight: '100vh' }}>
      <Container fluid className='p-0 m-0'>
        <Row className='m-0'>
          <Col className='p-0'>
            <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
          </Col>
        </Row>
      </Container>

      <Container className='p-3'>
        {activeTab === 'search' && <MoviePage />}
        {activeTab === 'recommendations' && <RecommendationsPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </Container>
    </div>
  );
}

export default App;
