import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Spinner, Nav, Form, InputGroup, Modal } from 'react-bootstrap';
import './App.css';

function App() {
  const [impiegati, setImpiegati] = useState([]);
  const [datori, setDatori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [impiegatiData, datoriData] = await Promise.all([
        fetch('http://127.0.0.1:8080/api/impiegati').then(res => res.json()),
        fetch('http://127.0.0.1:8080/api/datori').then(res => res.json())
      ]);
      setImpiegati(impiegatiData);
      setDatori(datoriData);
    } catch (error) {
      setError('Errore nel caricamento dei dati.');
    } finally {
      setLoading(false);
    }
  };

  const filteredImpiegati = impiegati.filter(imp =>
    `${imp[1]} ${imp[2]}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDatori = datori.filter(dat =>
    `${dat[1]} ${dat[2]}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowDetails = (person) => {
    setSelectedPerson(person);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="app-background">
      <Container className="py-4">
        <div className="custom-navbar mb-4 p-3 rounded shadow-sm text-center d-flex align-items-center justify-content-between">
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="Server Logo" width="50" height="50" className="me-2" />
          <h2 className="navbar-title flex-grow-1 text-center">DBLavoratori</h2>
          <Nav className="nav-buttons">
            <Button variant={activeTab === 'home' ? "primary" : "outline-primary"} onClick={() => setActiveTab('home')} className="mx-2">Home</Button>
            <Button variant={activeTab === 'impiegati' ? "primary" : "outline-primary"} onClick={() => setActiveTab('impiegati')} className="mx-2">Impiegati</Button>
            <Button variant={activeTab === 'datori' ? "primary" : "outline-primary"} onClick={() => setActiveTab('datori')} className="mx-2">Datori di lavoro</Button>
          </Nav>
        </div>

        {activeTab === 'home' && (
          <div className="home-section text-center p-5 rounded shadow-sm">
            <marquee className="scrolling-text" behavior="scroll" direction="left" scrollamount="5">
              Trova qui i dipendenti e datori di lavoro
            </marquee>
          </div>
        )}

        {activeTab !== 'home' && (
          <>
            <InputGroup className="mb-3 search-bar">
              <Form.Control
                type="text"
                placeholder="Cerca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>Reset</Button>
            </InputGroup>

            <div className="content-section p-4 rounded shadow-sm">
              <Row>
                {activeTab === 'impiegati' && filteredImpiegati.map(imp => (
                  <Col md={6} key={imp[0]} className="mb-4">
                    <Card className="p-3 shadow-sm custom-card">
                      <Card.Body>
                        <Card.Title>{imp[1]} {imp[2]}</Card.Title>
                        <Card.Text>Ruolo: {imp[4]} | Stipendio: {imp[5]} €</Card.Text>
                        <Button variant="info" onClick={() => handleShowDetails(imp)}>Dettagli</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}

                {activeTab === 'datori' && filteredDatori.map(dat => (
                  <Col md={6} key={dat[0]} className="mb-4">
                    <Card className="p-3 shadow-sm custom-card">
                      <Card.Body>
                        <Card.Title>{dat[1]} {dat[2]}</Card.Title>
                        <Card.Text>Azienda: {dat[3]}</Card.Text>
                        <Button variant="info" onClick={() => handleShowDetails(dat)}>Dettagli</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}

        {/* Modale per i dettagli */}
        <Modal show={selectedPerson !== null} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Dettagli</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPerson && (
              <>
                <p><strong>Nome:</strong> {selectedPerson[1]} {selectedPerson[2]}</p>
                {activeTab === 'impiegati' ? (
                  <>
                    <p><strong>Ruolo:</strong> {selectedPerson[4]}</p>
                    <p><strong>Stipendio:</strong> {selectedPerson[5]} €</p>
                  </>
                ) : (
                  <p><strong>Azienda:</strong> {selectedPerson[3]}</p>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default App;
