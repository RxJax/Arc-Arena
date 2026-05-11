import React from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { 
  Trophy, 
  Zap, 
  Flame, 
  History, 
  Award,
  ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const { account } = useWeb3();

  const stats = [
    { label: 'Total XP', value: '2,450', icon: <Zap className="text-cyber-blue" />, progress: 65 },
    { label: 'Current Streak', value: '12 Days', icon: <Flame className="text-orange-500" />, progress: 40 },
    { label: 'Arena Rank', value: '#128', icon: <Trophy className="text-yellow-500" />, progress: 85 },
    { label: 'Games Played', value: '342', icon: <Award className="text-cyber-purple" />, progress: null },
  ];

  const badges = [
    { name: 'Arc Gladiator', icon: '⚔️', rarity: 'Legendary', color: 'text-yellow-500' },
    { name: 'Daily Grinder', icon: '🔥', rarity: 'Epic', color: 'text-purple-500' },
    { name: 'Lucky Spinner', icon: '🍀', rarity: 'Rare', color: 'text-blue-500' },
    { name: 'Testnet Warrior', icon: '🛡️', rarity: 'Common', color: 'text-gray-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple p-1">
            <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center text-3xl">
              👤
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black italic">COMMANDER <span className="text-cyber-blue">DASHBOARD</span></h1>
            <p className="text-gray-500 font-mono">{account ? `${account.slice(0, 12)}...${account.slice(-8)}` : 'Connect Wallet to see stats'}</p>
          </div>
        </div>
        
        <div className="glass-panel px-8 py-4 flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-bold text-gray-500 uppercase">Current Level</div>
            <div className="text-2xl font-black text-white italic">LVL 24</div>
          </div>
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-cyber-gradient" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/5">{stat.icon}</div>
              {stat.progress !== null && (
                <span className="text-[10px] font-bold text-gray-500">TOP {100 - stat.progress}%</span>
              )}
            </div>
            <div className="text-sm font-bold text-gray-500 uppercase mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3">
              <Award className="text-cyber-blue" /> ARENA BADGES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {badges.map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:border-cyber-blue/50 transition-all cursor-help relative`}>
                    {badge.icon}
                    <div className="absolute inset-0 bg-cyber-mesh rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="font-bold text-sm mb-1">{badge.name}</div>
                  <div className={`text-[10px] font-black uppercase ${badge.color}`}>{badge.rarity}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8">
            <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3">
              <History className="text-cyber-purple" /> RECENT ACTIVITY
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 flex items-center justify-center text-cyber-blue">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="font-bold">Claimed Daily Check-in</div>
                      <div className="text-xs text-gray-500">May 11, 2026 • 22:45</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-cyber-blue font-bold">+50 XP</div>
                    <div className="text-[10px] font-mono text-gray-600">0x8a23...f912</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="space-y-8">
          <div className="glass-panel p-8 h-full">
            <h2 className="text-2xl font-black italic mb-8">XP ANALYTICS</h2>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Gaming</span>
                  <span className="text-xs font-bold text-white">1,240 XP</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full">
                  <div className="w-[80%] h-full bg-cyber-blue rounded-full shadow-[0_0_10px_#00f2ff]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Social</span>
                  <span className="text-xs font-bold text-white">450 XP</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full">
                  <div className="w-[30%] h-full bg-cyber-purple rounded-full shadow-[0_0_10px_#7000ff]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Streaks</span>
                  <span className="text-xs font-bold text-white">760 XP</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full">
                  <div className="w-[50%] h-full bg-cyber-pink rounded-full shadow-[0_0_10px_#ff00e5]" />
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-cyber-gradient/10 border border-cyber-blue/20">
              <div className="text-sm font-bold text-cyber-blue mb-2">NEXT REWARD</div>
              <div className="text-xl font-black mb-4">Legendary Mystery Box</div>
              <div className="text-xs text-gray-400 mb-6">Reach Level 25 to unlock your next elite reward.</div>
              <button className="w-full py-3 rounded-xl bg-cyber-blue/20 border border-cyber-blue/30 text-cyber-blue font-bold text-xs uppercase tracking-widest hover:bg-cyber-blue/30 transition-all">
                VIEW REWARDS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
