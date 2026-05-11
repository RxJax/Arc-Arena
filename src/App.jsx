import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Arena from './pages/Arena';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';
import Faucet from './pages/Faucet';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen relative">
          <ParticleBackground />
          <Navbar />
          <main className="pt-24 pb-12 px-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/arena" element={<Arena />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faucet" element={<Faucet />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
