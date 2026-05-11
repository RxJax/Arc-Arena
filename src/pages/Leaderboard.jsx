import { useWeb3 } from '../context/Web3Context';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';

const Leaderboard = () => {
  const { leaderboard } = useWeb3();

  // If leaderboard is empty, show a few placeholders or just empty
  const displayPlayers = leaderboard.length > 0 ? leaderboard : [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/30"
        >
          <Trophy size={40} className="text-yellow-500" />
        </motion.div>
        <h1 className="text-5xl font-black italic mb-4">ARENA <span className="text-cyber-blue">CHAMPIONS</span></h1>
        <p className="text-gray-500">The most legendary warriors on Arc Testnet.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-6 border-b border-white/5 bg-white/5 text-xs font-black text-gray-500 uppercase tracking-widest">
          <div className="col-span-1">Rank</div>
          <div className="col-span-2">Player</div>
          <div className="col-span-1 text-center">XP</div>
          <div className="col-span-1 text-center">Games</div>
          <div className="col-span-1 text-center">Streak</div>
        </div>

        <div className="divide-y divide-white/5">
          {displayPlayers.map((player, i) => (
            <motion.div
              key={player.address}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`grid grid-cols-6 gap-4 p-6 items-center hover:bg-white/5 transition-colors group ${i < 3 ? 'bg-cyber-blue/5' : ''}`}
            >
              <div className="col-span-1 flex items-center gap-3">
                {i === 0 && <Crown size={18} className="text-yellow-500" />}
                {i === 1 && <Medal size={18} className="text-gray-400" />}
                {i === 2 && <Medal size={18} className="text-amber-600" />}
                {i > 2 && <span className="font-mono text-gray-500 pl-1">{i + 1}</span>}
              </div>
              
              <div className="col-span-2 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl border border-white/10 group-hover:border-cyber-blue/30 transition-all">
                  👤
                </div>
                <div className="font-bold text-sm tracking-wide font-mono">
                  {player.address.slice(0, 6)}...{player.address.slice(-4)}
                </div>
              </div>

              <div className="col-span-1 text-center">
                <div className="font-black text-cyber-blue">{player.xp.toLocaleString()}</div>
              </div>

              <div className="col-span-1 text-center text-gray-400 font-bold">{player.gamesPlayed}</div>
              
              <div className="col-span-1 text-center">
                <div className="inline-flex items-center gap-1 text-orange-500 font-bold">
                  {player.streak} <Star size={12} fill="currentColor" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12 glass-panel p-8 text-center bg-cyber-gradient/5">
        <h3 className="text-xl font-bold mb-4 italic">READY TO CLIMB THE RANKS?</h3>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">Play more games, earn higher XP, and maintain your streak to secure your spot among the legends.</p>
        <button className="btn-cyber text-white px-12">
          JOIN THE ARENA
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
