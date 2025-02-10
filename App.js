import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Blog from './components/Blog';
import Services from './components/Services';
import Appointments from './components/Appointments';
import NavigationBar from './components/Navbar';
import { Container } from 'react-bootstrap'; 

const App = () => {
  return (
    <Router>
      <div>
        <NavigationBar /> {}
        <Container className="mt-5"> {}
          <Routes> {}
            <Route path="/blog" element={<Blog />} />
            <Route path="/services" element={<Services />} />
            <Route path="/appointments" element={<Appointments />} />
            {}
            <Route path="/" element={<h2>Witaj na blogu fizjoterapeutycznym z systemem rezerwacji wizyt!</h2>} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
