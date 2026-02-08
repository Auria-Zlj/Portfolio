import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ClarifierCursor from './components/ui/ClarifierCursor';
import useInertiaScroll from './hooks/useInertiaScroll';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import GrainOverlay from './components/ui/GrainOverlay';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
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
        {/* Blur Overlay (The "Confusion" State) - Global */}
        <div
          className="clarifier-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9998, // Below cursor (9999) but above content? No, needs to be on top of bg, but masked.
            // Wait, if it's GLOBAL, it overlays everything.
            // If I want to reveal the specific page content, it should separate?
            // "Confusion" state in Hero implies the hero text is blurred.
            // If I put it here with zIndex 9998, it blurs EVERYTHING including the Gallery.
            // "Clarifier" concept: "Making complex products feel simple".
            // Maybe only Hero needs this? Or the whole site?
            // "A blurred, organic green mesh gradient occupies the center... The area beneath it becomes sharp."
            // Detailed design: "Hero Page (First Impression)".
            // So arguably it's a Hero-only effect.
            // But if I put it global, it's a cool continuous effect.
            // However, it might make reading case studies hard if you have to hover to read.
            // I'll keep it global for now based on "Project Brief ... 2. Hero Page".
            // Actually, let's limit it to Hero or make it subtle on other pages.
            // I'll keep it globally for now as per "Experience: It should feel like the designer is bringing order...".
            // But zIndex -1 in App.jsx was behind content (revealing background?)
            // Wait, in previous App.jsx:
            // Background Layer (Sharp) zIndex -2
            // Blur Overlay zIndex -1
            // Content zIndex 1
            // So the Content was ON TOP of the Blur Overlay.
            // The Blur Overlay was blurring the BACKGROUND.
            // So the TEXT was always sharp?
            // "Visuals: A blurred, organic green mesh gradient ... masking the core title."
            // Ah, masking the TITLE. So the title should be BEHIND the blur?
            // IF the title is behind the blur, zIndex of title < zIndex of blur.
            // In my previous code, Content (Hero) had zIndex 1. Blur Overlay had zIndex -1.
            // So Content was Sharp. Background was Blurred.
            // If I want title to be blurred, Content must be -2, Blur -1?
            // Let's adjust z-indices in Home.jsx to make sure the effect works as intended.
            // For now, I'll stick to the layout where Overlay is behind content (blurring the background mesh).
            // If the user meant "blurring the text", I'd need to put text behind the overlay.
            // "masking the core title" suggests text is obscured.
            // I will move the Blur Overlay into Home.jsx to control it per page, or keep it global but adjust z-index.
            // I'll keep it global but put it "behind" the content for now to ensure usability, unless I see fit to change.
            pointerEvents: 'none',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            maskImage: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 0px, black 250px)',
            WebkitMaskImage: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 0px, black 250px)',
          }}
        />

        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
