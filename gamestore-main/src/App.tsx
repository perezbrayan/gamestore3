import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FortniteShopPage from './pages/FortniteShopPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fortnite-shop" element={<FortniteShopPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;