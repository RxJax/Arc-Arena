import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { 
  Dices, 
  RotateCw, 
  Box, 
  Timer, 
  CalendarCheck,
  ChevronRight,
  ExternalLink,
  Loader2,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Arena = () => {
  const { account, signer, connectWallet } = useWeb3();
  const [activeGame, setActiveGame] = useState(null);
  const [txPending, setTxPending] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  const games = [
    {
      id: 'check-in',
      name: 'Daily Check-In',
      description: 'Sign in daily to earn XP and build your streak.',
      icon: <CalendarCheck size={32} className="text-blue-400" />,
      fee: '0.01',
      color: 'blue'
    },
    {
      id: 'coin-flip',
      name: 'Coin Flip',
      description: 'Double your USDC or lose it all. 50/50 chance.',
      icon: <Dices size={32} className="text-purple-400" />,
      fee: '0.5',
      color: 'purple'
    },
    {
      id: 'spin-wheel',
      name: 'Spin Wheel',
      description: 'Spin for XP, Badges, and Mystery Rewards.',
      icon: <RotateCw size={32} className="text-pink-400" />,
      fee: '0.1',
      color: 'pink'
    },
    {
      id: 'mystery-box',
      name: 'Mystery Box',
      description: 'Unbox legendary loot and arena badges.',
      icon: <Box size={32} className="text-yellow-400" />,
      fee: '1.0',
      color: 'yellow'
    },
    {
      id: 'reaction',
      name: 'Reaction Arena',
      description: 'Test your speed and climb the leaderboard.',
      icon: <Timer size={32} className="text-cyan-400" />,
      fee: '0.05',
      color: 'cyan'
    }
  ];

  const handleGameAction = async (game) => {
    if (!account) {
      connectWallet();
      return;
    }

    setTxPending(true);
    setLastTx(null);

    try {
      // Simulate real Arc Testnet transaction
      // In a real app, this would be: 
      // const tx = await signer.sendTransaction({ to: GAME_CONTRACT, value: ethers.utils.parseEther(game.fee) });
      
      const txRequest = {
        to: "0xe693240068aE7Be819446d3284B979E312061619", // ArcArena Treasury Placeholder
        value: ethers.utils.parseEther("0.00001"), // Tiny fee for demo purposes on testnet
      };

      const tx = await signer.sendTransaction(txRequest);
      setLastTx(tx.hash);
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2ff', '#7000ff', '#ff00e5']
        });
      }
    } catch (err) {
      console.error(err);
      alert("Transaction failed: " + err.message);
    } finally {
      setTxPending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic mb-2">ARCADE <span className="text-cyber-blue">ARENA</span></h1>
        <p className="text-gray-400">Choose your game and generate real on-chain activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ y: -10 }}
            className="glass-panel group relative overflow-hidden"
          >
            {/* Holographic effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-white to-transparent pointer-events-none" />
            
            <div className="p-8">
              <div className={`w-16 h-16 rounded-2xl bg-${game.color}-400/10 flex items-center justify-center mb-6 border border-${game.color}-400/20 group-hover:scale-110 transition-transform`}>
                {game.icon}
              </div>
              
              <h3 className="text-2xl font-black mb-3">{game.name}</h3>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                {game.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entry Fee</span>
                  <span className="text-white font-black">{game.fee} USDC</span>
                </div>
                
                <button
                  onClick={() => handleGameAction(game)}
                  disabled={txPending}
                  className={`btn-cyber flex items-center gap-2 text-sm !px-6 ${txPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {txPending ? <Loader2 className="animate-spin" size={16} /> : 'PLAY NOW'}
                  {!txPending && <ChevronRight size={16} />}
                </button>
              </div>
            </div>

            {/* Glowing bottom edge */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${game.color}-400 to-transparent opacity-50`} />
          </motion.div>
        ))}
      </div>

      {/* Transaction Status Overlay */}
      <AnimatePresence>
        {txPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="glass-panel max-w-md w-full p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-cyber-blue/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-cyber-blue rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="text-cyber-blue animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black italic mb-2">TRANSACTION PENDING</h2>
              <p className="text-gray-400 mb-6">Processing your interaction on Arc Testnet. Please confirm in MetaMask.</p>
              
              {lastTx && (
                <a 
                  href={`https://testnet.arcscan.app/tx/${lastTx}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 text-cyber-blue text-sm font-bold hover:underline"
                >
                  VIEW ON ARCSCAN <ExternalLink size={14} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Arena;
