import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { Droplets, Clock, ShieldCheck, History, ExternalLink, Loader2 } from 'lucide-react';

const Faucet = () => {
  const { account, signer } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const requestFunds = () => {
    // Open the official Circle Faucet in a new tab
    window.open('https://faucet.circle.com/', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-cyber-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Droplets size={32} className="text-cyber-blue" />
        </div>
        <h1 className="text-4xl font-black italic mb-4">ARC TESTNET <span className="text-cyber-blue">FAUCET</span></h1>
        <p className="text-gray-500">Get free testnet USDC to play games and test the arena.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Droplets size={20} className="text-cyber-blue" /> REQUEST USDC
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Wallet Address</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-gray-400">
                {account || 'Connect Wallet first'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-blue-400" />
                <span className="text-sm font-bold text-blue-400">Cooldown: 2h</span>
              </div>
              <span className="text-xs text-gray-500">2 claims available</span>
            </div>

            <button
              onClick={requestFunds}
              className="w-full btn-cyber flex items-center justify-center gap-2 text-white"
            >
              <ExternalLink size={20} />
              CLAIM VIA CIRCLE
            </button>

            {txHash && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center"
              >
                <div className="text-green-400 font-bold text-sm mb-1">Success! Funds are on the way.</div>
                <a 
                  href={`https://testnet.arcscan.app/tx/${txHash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] text-gray-500 hover:underline flex items-center justify-center gap-1"
                >
                  VIEW ON ARCSCAN <ExternalLink size={10} />
                </a>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-cyber-purple" /> ELIGIBILITY
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                Wallet must be connected to Arc Testnet
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue" />
                Limit: 20 USDC per 2 hours (you can claim 2 times per 2 hours)
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <History size={20} className="text-cyber-pink" /> RECENT REQUESTS
            </h2>
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="text-gray-400 font-mono">0x4a...2f1b</div>
                  <div className="text-cyber-blue font-bold">+10 USDC</div>
                  <div className="text-gray-600">2h ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
