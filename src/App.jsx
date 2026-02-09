import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ClarifierCursor from './components/ui/ClarifierCursor';
import useInertiaScroll from './hooks/useInertiaScroll';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import GrainOverlay from './components/ui/GrainOverlay';

import Gallery from './components/layout/Gallery';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Gallery now contains: Home (first snap) + Project cards + Footer */}
            <Gallery />
          </div>
        } />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useInertiaScroll(); // Initialize smooth scroll

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Router>
      <GrainOverlay />
      <ClarifierCursor />

      <div className="main-container">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
