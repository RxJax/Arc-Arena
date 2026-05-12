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
          <footer className="py-12 text-center border-t border-white/5 relative z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-[0.3em]">
                <div className="w-8 h-[1px] bg-white/10" />
                Engineering & Design
                <div className="w-8 h-[1px] bg-white/10" />
              </div>
              <p className="text-white font-black italic text-lg tracking-tighter">
                Built by <a href="https://x.com/rxjax007" target="_blank" rel="noreferrer" className="text-cyber-blue hover:text-cyber-pink transition-colors">rxjax007</a>
              </p>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                © 2026 ArcArena • Powered by Arc Network
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
