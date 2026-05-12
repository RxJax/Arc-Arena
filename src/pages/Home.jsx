import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Coins, Shield, Users, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

const Home = () => {
  const { globalActivity, provider } = useWeb3();
  const [stats, setStats] = useState({
    players: '0',
    transactions: '0',
    games: '0',
    secured: '100%'
  });

  useEffect(() => {
    const updateStats = async () => {
      if (!provider) return;

      try {
        // Fetch current block number to use as a factor for live feel
        const blockNumber = await provider.getBlockNumber();
        const treasuryTxCount = await provider.getTransactionCount("0xe693240068ae7be819446d3284b979e312061619");
        
        // Calculate active players
        const uniquePlayers = new Set(globalActivity.map(a => a.address)).size;
        const basePlayers = 1500;
        
        // Games Played: Base + Live + Block number offset
        const baseGames = 92000;
        const liveGames = globalActivity.length;
        const totalGames = baseGames + liveGames + (blockNumber % 1000);

        // Transactions: Base + Treasury Txs + Block offset
        const baseTxs = 48000;
        const totalTxs = baseTxs + treasuryTxCount + (blockNumber % 500);

        setStats({
          players: (basePlayers + uniquePlayers + (blockNumber % 50)).toLocaleString(),
          transactions: (totalTxs / 1000).toFixed(1) + 'K',
          games: (totalGames / 1000).toFixed(1) + 'K',
          secured: '100%'
        });
      } catch (e) {
        console.error("Error fetching live stats:", e);
      }
    };

    updateStats();
    // Refresh every 30 seconds
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, [globalActivity, provider]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* ... Hero and Stats sections remain same ... */}
      <section className="flex flex-col items-center justify-center text-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-cyber-blue/20 blur-3xl rounded-full" />
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4 text-white">
            WELCOME TO <br />
            <span className="text-transparent bg-clip-text bg-cyber-gradient">ARCARENA</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl"
        >
          The Onchain Gaming Playground of Arc Testnet. 
          Experience the future of Web3 gaming with real-time wallet interactions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link to="/arena" className="btn-cyber flex items-center gap-2 text-white group">
            <Play fill="currentColor" size={18} />
            ENTER ARENA
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <a 
            href="https://faucet.circle.com/" 
            target="_blank" 
            rel="noreferrer"
            className="px-8 py-3 rounded-lg border border-cyber-blue/30 text-cyber-blue font-bold hover:bg-cyber-blue/10 transition-all flex items-center gap-2"
          >
            <Coins size={18} />
            GET TESTNET USDC
          </a>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
        {[
          { icon: <Users className="text-cyber-blue" />, label: "Active Players", value: stats.players },
          { icon: <Zap className="text-cyber-purple" />, label: "Arena Transactions", value: stats.transactions },
          { icon: <Play className="text-cyber-pink" />, label: "Games Played", value: stats.games },
          { icon: <Shield className="text-green-400" />, label: "Secured by Arc", value: stats.secured },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 flex flex-col items-center text-center group hover:border-cyber-blue/50 transition-colors"
          >
            <div className="mb-4 p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Activity Feed */}
      <section className="mt-32 glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={100} />
        </div>
        <h2 className="text-2xl font-black italic mb-8 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
          LIVE ARENA ACTIVITY
        </h2>
        
        <div className="space-y-4">
          {globalActivity.length > 0 ? (
            globalActivity.map((act, i) => (
              <motion.div 
                key={act.timestamp} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple p-[1px]">
                    <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center text-xs font-bold">
                      {act.address.slice(2, 4)}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">
                      {act.address.slice(0, 6)}...{act.address.slice(-4)} earned {act.xp} XP in {act.type} 
                      {act.result && ` (${act.result})`}
                      {act.rarity && ` (${act.rarity})`}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(act.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
                <div className="text-cyber-blue font-mono text-sm underline cursor-pointer">
                  {act.address.slice(0, 8)}...
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 italic py-8 text-center">No recent activity. Enter the arena to start!</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
