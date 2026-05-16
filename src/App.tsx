import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TradeList from './pages/TradeList';
import Portfolio from './pages/Portfolio';
import Performance from './pages/Performance';
import TradeAnalysis from './pages/TradeAnalysis';
import Watchlist from './pages/Watchlist';
import TradeReview from './pages/TradeReview';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<TradeList />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/analysis" element={<TradeAnalysis />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/review" element={<TradeReview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
