import Home from './components/Home';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Add from './components/Add';
import Edit from './components/Edit';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NotFound from './components/NotFound';


function App() {
  return (
    <Router>
      <div className="app-root d-flex flex-column min-vh-100">
        <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/">EmployeeMS</Navbar.Brand>
            <Navbar.Toggle aria-controls="app-navbar-nav" />
            <Navbar.Collapse id="app-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/add">Add Employee</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <main className="py-4 flex-fill">
          <Container>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/add' element={<Add/>}/>
              <Route path='/edit' element={<Edit/>}/>
              <Route path='*' element={<NotFound/>}/>
            </Routes>
          </Container>
        </main>
        <footer className="py-3 bg-light border-top">
          <Container className="text-center text-muted small">
            © {new Date().getFullYear()} EmployeeMS. All rights reserved.
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
