import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, ShieldCheck, Activity, Trophy, LayoutDashboard, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { account, connectWallet, network } = useWeb3();

  const isArcTestnet = network === 5042002;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            {/* Soft Cyan Glow behind logo */}
            <div className="absolute -inset-2 bg-cyber-blue/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <img 
              src="/logo.png" 
              className="w-12 h-12 relative object-contain filter drop-shadow-[0_0_12px_rgba(0,242,255,0.6)]" 
            />
          </div>
          <div className="flex flex-col -space-y-2">
            <span className="text-3xl font-black italic tracking-tighter text-white leading-none">
              ARC<span className="text-[#00f2ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]">ARENA</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link to="/arena" className="hover:text-cyber-blue flex items-center gap-2 transition-colors">
            <Activity size={18} /> ARENA
          </Link>
          <Link to="/leaderboard" className="hover:text-cyber-purple flex items-center gap-2 transition-colors">
            <Trophy size={18} /> LEADERBOARD
          </Link>
          <Link to="/dashboard" className="hover:text-cyber-pink flex items-center gap-2 transition-colors">
            <LayoutDashboard size={18} /> DASHBOARD
          </Link>
          <Link to="/faucet" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Droplets size={18} /> FAUCET
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {account && isArcTestnet && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue animate-glow-pulse">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold">ARC TESTNET</span>
            </div>
          )}
          
          {account ? (
            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="btn-cyber flex items-center gap-2 text-white"
            >
              <Wallet size={18} />
              CONNECT
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
