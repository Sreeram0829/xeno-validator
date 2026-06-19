import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import Home from './pages/Home.jsx';
import ValidationResult from './pages/ValidationResult.jsx';
import About from './pages/About.jsx';
import './styles/Global.css';

/**
 * Main App Component
 * Root component with routing and context providers
 */
const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="app min-h-screen flex flex-col">
          {/* Navigation */}
          <Navbar />
          
          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<ValidationResult />} />
              <Route path="/results/:fileId" element={<ValidationResult />} />
              <Route path="/about" element={<About />} />
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};

/**
 * 404 Not Found Component
 */
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default App;