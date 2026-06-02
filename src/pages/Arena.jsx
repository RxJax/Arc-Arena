import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3, ARC_TESTNET_CONFIG } from '../context/Web3Context';
import { 
  Dices, 
  RotateCw, 
  Box, 
  Timer, 
  CalendarCheck,
  ChevronRight,
  ExternalLink,
  Loader2,
  Activity,
  Zap,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Arena = () => {
  const { account, signer, provider, connectWallet, switchNetwork, addXP, userStats } = useWeb3();
  const [activeGame, setActiveGame] = useState(null);
  const [txPending, setTxPending] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState(null);
  const [flipOutcome, setFlipOutcome] = useState(null); // 'win' or 'lose'
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [isUnboxing, setIsUnboxing] = useState(false);
  const [boxReward, setBoxReward] = useState(null);
  const [showReactionArena, setShowReactionArena] = useState(false);
  const [reactionStartTime, setReactionStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [canClick, setCanClick] = useState(false);
  const [reactionWaiting, setReactionWaiting] = useState(false);

  const games = [
    {
      id: 'check-in',
      name: 'Daily Check-In',
      description: 'Sign in daily to earn XP and build your streak.',
      icon: <CalendarCheck size={32} className="text-blue-400" />,
      fee: '0.01',
      color: 'blue',
      xp: 50
    },
    {
      id: 'coin-flip',
      name: 'Coin Flip',
      description: 'Double your XP or lose it all. 50/50 chance.',
      icon: <Dices size={32} className="text-purple-400" />,
      fee: '0.5',
      color: 'purple',
      xp: 20
    },
    {
      id: 'spin-wheel',
      name: 'Spin Wheel',
      description: 'Spin for XP, Badges, and Mystery Rewards.',
      icon: <RotateCw size={32} className="text-pink-400" />,
      fee: '2.0',
      color: 'pink',
      xp: 0 // Dynamic
    },
    {
      id: 'mystery-box',
      name: 'Mystery Box',
      description: 'Unbox legendary loot and arena badges.',
      icon: <Box size={32} className="text-yellow-400" />,
      fee: '1.0',
      color: 'yellow',
      xp: 0 // Dynamic
    },
    {
      id: 'reaction',
      name: 'Reaction Arena',
      description: 'Test your speed and climb the leaderboard.',
      icon: <Timer size={32} className="text-cyan-400" />,
      fee: '0.05',
      color: 'cyan',
      xp: 0 // Dynamic
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
      // Ensure the wallet is on the correct network before sending
      const { chainId } = await provider.getNetwork();
      const targetChainId = parseInt(ARC_TESTNET_CONFIG.chainId, 16);
      if (chainId !== targetChainId) {
        await switchNetwork();
        // After switching, the page will reload due to chainChanged listener,
        // so we stop here to avoid sending on the wrong chain.
        setTxPending(false);
        return;
      }

      const txRequest = {
        to: "0xe693240068ae7be819446d3284b979e312061619", // ArcArena Treasury
        value: ethers.utils.parseEther("0.00001"), // Simulating USDC fee
      };

      const tx = await signer.sendTransaction(txRequest);
      setLastTx(tx.hash);
      setTxPending(false); // Hide transaction modal immediately after user confirms in MetaMask
      
      // Start the game logic immediately for better UX
      let xpEarned = game.xp;
      let additionalData = {};

      // Optional: Wait for receipt in background without blocking the UI
      tx.wait().then(receipt => {
        console.log("Transaction confirmed in background:", receipt.hash);
      }).catch(err => console.error("Background confirmation error:", err));

      if (true) { // Assume success since user confirmed in wallet
        if (game.id === 'check-in') {
          const now = Date.now();
          const lastCheckIn = userStats.lastCheckIn;
          let newStreak = 1;
          
          if (lastCheckIn) {
            const diff = now - lastCheckIn;
            if (diff < 86400000 * 2) { // Within 48 hours
              newStreak = userStats.streak + 1;
            }
          }
          additionalData = { streak: newStreak, lastCheckIn: now };
        } else if (game.id === 'coin-flip') {
          // Open coin flip modal
          setShowCoinFlip(true);
          setIsFlipping(true);
          setFlipResult(null);
          
          const won = Math.random() > 0.5;
          setFlipOutcome(won ? 'win' : 'lose');

          // Wait for animation
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          setIsFlipping(false);
          setFlipResult(won ? 'Heads' : 'Tails');
          
          xpEarned = won ? (userStats.xp || 50) : -userStats.xp;
          additionalData = { result: won ? 'Won' : 'Lost' };

          // Wait to show result before closing
          await new Promise(resolve => setTimeout(resolve, 2000));
          setShowCoinFlip(false);
        } else if (game.id === 'spin-wheel') {
          setShowSpinWheel(true);
          setIsSpinning(true);
          
          const wheelRewards = [
            { label: '50 XP', xp: 50, color: '#00f2ff' },
            { label: '100 XP', xp: 100, color: '#7000ff' },
            { label: '250 XP', xp: 250, color: '#ff00e5' },
            { label: 'BADGE', xp: 150, color: '#fbbf24', badge: 'Silver' },
            { label: '500 XP', xp: 500, color: '#00f2ff' },
            { label: 'BOX', xp: 200, color: '#ec4899', box: true },
            { label: '750 XP', xp: 750, color: '#7000ff' },
            { label: 'JACKPOT', xp: 2000, color: '#fbbf24', badge: 'Gold' },
          ];

          const randomIndex = Math.floor(Math.random() * wheelRewards.length);
          const newRotation = rotation + (360 * 5) + (360 - (randomIndex * 45)); 
          setRotation(newRotation);
          
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          setIsSpinning(false);
          const reward = wheelRewards[randomIndex];
          setSpinResult(reward);
          xpEarned = reward.xp;
          additionalData = { 
            result: reward.label,
            badge: reward.badge,
            box: reward.box
          };

          await new Promise(resolve => setTimeout(resolve, 3000));
          setShowSpinWheel(false);
          setSpinResult(null);
        } else if (game.id === 'mystery-box') {
          setShowMysteryBox(true);
          setIsUnboxing(true);
          setBoxReward(null);

          const rarities = [
            { name: 'Common', xp: 50, color: 'text-gray-400' },
            { name: 'Rare', xp: 150, color: 'text-cyber-blue' },
            { name: 'Epic', xp: 450, color: 'text-cyber-purple' },
            { name: 'Legendary', xp: 1000, color: 'text-cyber-pink', badge: 'Diamond' }
          ];

          const roll = Math.random();
          let reward;
          if (roll > 0.95) reward = rarities[3];
          else if (roll > 0.8) reward = rarities[2];
          else if (roll > 0.5) reward = rarities[1];
          else reward = rarities[0];
          
          // Shaking animation time
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          setIsUnboxing(false);
          setBoxReward(reward);
          xpEarned = reward.xp;
          additionalData = { rarity: reward.name, badge: reward.badge };

          await new Promise(resolve => setTimeout(resolve, 4000));
          setShowMysteryBox(false);
        } else if (game.id === 'reaction') {
          setShowReactionArena(true);
          setReactionWaiting(true);
          setReactionTime(null);
          setCanClick(false);
          
          // Wait for a random delay between 2-5 seconds
          const delay = Math.floor(Math.random() * 3000) + 2000;
          
          await new Promise(resolve => {
            setTimeout(() => {
              setReactionWaiting(false);
              setCanClick(true);
              setReactionStartTime(Date.now());
              resolve();
            }, delay);
          });
          
          // The actual XP awarding happens in the click handler now
          // We need to wait for the user to click or time out
          return; // Early return as we'll call addXP from the handler
        }

        await addXP(xpEarned, game.name, additionalData);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2ff', '#7000ff', '#ff00e5']
        });
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('txpool is full')) {
        alert("Arc Testnet is currently congested (txpool full). Please wait a minute and try again!");
      } else {
        alert("Transaction failed: " + err.message);
      }
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

      {/* Coin Flip Modal */}
      <AnimatePresence>
        {showCoinFlip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel max-w-sm w-full p-10 text-center relative overflow-hidden">
              {/* Background Glow */}
              <div className={`absolute inset-0 opacity-20 bg-${flipOutcome === 'win' ? 'cyber-blue' : 'red-500'} blur-3xl`} />
              
              <h2 className="text-3xl font-black italic mb-8 relative">COIN <span className="text-cyber-blue">FLIP</span></h2>
              
              <div className="relative h-48 flex items-center justify-center mb-8">
                <motion.div
                  animate={isFlipping ? {
                    rotateY: [0, 1800],
                    y: [0, -100, 0],
                    scale: [1, 1.2, 1]
                  } : {
                    rotateY: flipResult === 'Heads' ? 0 : 180,
                    y: 0,
                    scale: 1
                  }}
                  transition={isFlipping ? {
                    duration: 3,
                    ease: "easeInOut",
                  } : {
                    duration: 0.5,
                  }}
                  className="w-32 h-32 relative preserve-3d"
                >
                  {/* Heads Face */}
                  <div className="absolute inset-0 backface-hidden rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple border-4 border-white/30 shadow-[0_0_30px_rgba(0,242,255,0.5)] flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white italic">XP</span>
                    <span className="text-[10px] font-bold text-white/70 uppercase">Heads</span>
                  </div>
                  
                  {/* Tails Face */}
                  <div className="absolute inset-0 backface-hidden rounded-full bg-gray-800 border-4 border-white/10 flex flex-col items-center justify-center [transform:rotateY(180deg)]">
                    <span className="text-2xl font-black text-gray-500 italic uppercase">Lose</span>
                    <span className="text-[10px] font-bold text-gray-600 uppercase">Tails</span>
                  </div>
                </motion.div>
              </div>

              <div className="relative">
                <div className={`text-2xl font-black italic tracking-widest mb-2 ${isFlipping ? 'text-white animate-pulse' : (flipOutcome === 'win' ? 'text-cyber-blue' : 'text-red-500')}`}>
                  {isFlipping ? 'FLIPPING...' : (flipOutcome === 'win' ? 'YOU WON!' : 'YOU LOST!')}
                </div>
                {!isFlipping && flipOutcome && (
                  <p className="text-gray-400 font-bold uppercase tracking-tighter text-sm">
                    {flipOutcome === 'win' ? `+${userStats.xp || 50} XP EARNED` : 'ALL XP LOST'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin Wheel Modal */}
      <AnimatePresence>
        {showSpinWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel max-w-md w-full p-10 text-center relative overflow-hidden">
              <h2 className="text-3xl font-black italic mb-8">SPIN <span className="text-cyber-pink">WHEEL</span></h2>
              
              <div className="relative w-64 h-64 mx-auto mb-12">
                {/* Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  <div className="w-full h-full bg-white clip-path-triangle" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
                </div>
                
                {/* Wheel */}
                <motion.div
                  animate={{ rotate: rotation }}
                  transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
                  className="w-full h-full rounded-full border-8 border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(112,0,255,0.3)]"
                >
                  {[...Array(8)].map((_, i) => {
                    const labels = ['50 XP', '100 XP', '250 XP', 'BADGE', '500 XP', 'BOX', '750 XP', 'JACKPOT'];
                    const colors = [
                      'rgba(0, 242, 255, 0.1)',   // cyan
                      'rgba(112, 0, 255, 0.1)',   // purple
                      'rgba(255, 0, 229, 0.1)',   // pink
                      'rgba(251, 191, 36, 0.15)', // yellow (badge)
                      'rgba(0, 242, 255, 0.1)',   // cyan
                      'rgba(236, 72, 153, 0.15)', // pink (box)
                      'rgba(112, 0, 255, 0.1)',   // purple
                      'rgba(251, 191, 36, 0.2)'   // yellow (jackpot)
                    ];
                    return (
                      <div
                        key={i}
                        className="absolute top-0 left-1/2 w-1/2 h-full origin-left flex items-center justify-center"
                        style={{ 
                          transform: `rotate(${i * 45}deg)`,
                          backgroundColor: colors[i],
                          borderRight: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <div className="rotate-90 translate-x-16 flex flex-col items-center gap-1">
                          <span className={`text-[11px] font-black tracking-tighter text-white drop-shadow-md whitespace-nowrap`}>
                            {labels[i]}
                          </span>
                          {labels[i] === 'JACKPOT' && <Zap size={10} className="text-yellow-400 animate-pulse" />}
                          {labels[i] === 'BOX' && <Box size={10} className="text-pink-400" />}
                          {labels[i] === 'BADGE' && <Shield size={10} className="text-yellow-400" />}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
                
                {/* Center Cap */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyber-dark border-4 border-white/20 flex items-center justify-center shadow-2xl z-20">
                  <div className="w-2 h-2 rounded-full bg-cyber-pink animate-ping" />
                </div>
              </div>

              <div className="relative min-h-[60px]">
                {isSpinning ? (
                  <div className="text-xl font-black italic text-white animate-pulse tracking-widest">
                    SPINNING...
                  </div>
                ) : spinResult && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="text-3xl font-black italic text-cyber-pink mb-1">
                      {spinResult.label}!
                    </div>
                    <p className="text-gray-400 font-bold text-sm uppercase">
                      +{spinResult.xp} XP AWARDED
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mystery Box Modal */}
      <AnimatePresence>
        {showMysteryBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel max-w-sm w-full p-10 text-center relative overflow-hidden">
              <h2 className="text-3xl font-black italic mb-8">MYSTERY <span className="text-yellow-400">BOX</span></h2>
              
              <div className="relative h-48 flex items-center justify-center mb-10">
                <AnimatePresence mode="wait">
                  {isUnboxing ? (
                    <motion.div
                      key="box"
                      animate={{ 
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5 
                      }}
                      className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                    >
                      <Box size={100} />
                    </motion.div>
                  ) : boxReward && (
                    <motion.div
                      key="reward"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-24 h-24 rounded-3xl bg-white/5 border-2 border-current ${boxReward.color} flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,255,255,0.1)]`}>
                        <span className="text-4xl font-black italic">XP</span>
                      </div>
                      <div className={`text-2xl font-black italic uppercase tracking-widest ${boxReward.color}`}>
                        {boxReward.name}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative min-h-[40px]">
                {isUnboxing ? (
                  <div className="text-lg font-bold text-gray-500 animate-pulse uppercase tracking-widest">
                    UNBOXING...
                  </div>
                ) : boxReward && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-white font-black text-2xl mb-1">+{boxReward.xp} XP</p>
                    {boxReward.badge && (
                      <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1">
                        <Loader2 size={12} className="animate-spin" /> NEW BADGE: {boxReward.badge}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reaction Arena Modal */}
      <AnimatePresence>
        {showReactionArena && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel max-w-md w-full p-10 text-center relative overflow-hidden">
              <h2 className="text-3xl font-black italic mb-8">REACTION <span className="text-cyan-400">ARENA</span></h2>
              
              <div 
                className={`relative h-64 rounded-3xl border-2 border-white/5 flex items-center justify-center cursor-pointer transition-colors duration-200 overflow-hidden ${
                  reactionWaiting ? 'bg-red-500/10 border-red-500/20' : 
                  (canClick ? 'bg-green-500/20 border-green-500/40' : 'bg-white/5')
                }`}
                onClick={async () => {
                  if (reactionWaiting) {
                    alert("TOO FAST! Wait for the screen to turn GREEN.");
                    setShowReactionArena(false);
                    return;
                  }
                  if (canClick) {
                    const time = Date.now() - reactionStartTime;
                    setCanClick(false);
                    setReactionTime(time);
                    
                    const xp = Math.max(10, Math.floor(1000 - time));
                    await addXP(xp, 'Reaction Arena', { reactionTime: `${time}ms` });
                    
                    confetti({
                      particleCount: 100,
                      spread: 60,
                      colors: ['#22d3ee', '#ffffff']
                    });

                    setTimeout(() => setShowReactionArena(false), 3000);
                  }
                }}
              >
                <div className="text-center relative z-10">
                  {reactionWaiting ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full border-4 border-red-500/50 border-t-red-500 animate-spin" />
                      <span className="text-xl font-black text-red-500 italic tracking-widest">WAIT FOR GREEN...</span>
                    </div>
                  ) : (
                    canClick ? (
                      <div className="flex flex-col items-center gap-4 animate-bounce">
                        <Zap size={64} className="text-green-500 fill-current" />
                        <span className="text-3xl font-black text-green-500 italic">CLICK NOW!</span>
                      </div>
                    ) : (
                      reactionTime && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center"
                        >
                          <span className="text-5xl font-black text-white mb-2">{reactionTime}ms</span>
                          <span className="text-cyan-400 font-bold tracking-widest uppercase">SUPER SONIC!</span>
                        </motion.div>
                      )
                    )
                  )}
                </div>
                
                {/* Scanner line effect */}
                {reactionWaiting && (
                  <motion.div 
                    animate={{ y: [0, 256, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 right-0 h-1 bg-red-500/30 blur-sm z-0"
                  />
                )}
              </div>

              <p className="mt-8 text-gray-500 text-sm font-medium italic">
                Test your reflexes. Higher speed = More XP.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
