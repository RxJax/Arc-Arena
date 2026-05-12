import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const ARC_TESTNET_CONFIG = {
  chainId: '0x4D8D02', // 5042002
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app']
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(new ethers.providers.JsonRpcProvider(ARC_TESTNET_CONFIG.rpcUrls[0]));
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    xp: 0,
    streak: 0,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    lastCheckIn: null,
    level: 1
  });
  const [globalActivity, setGlobalActivity] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Load user data on account change
  useEffect(() => {
    if (account) {
      const savedData = localStorage.getItem(`arc_arena_stats_${account.toLowerCase()}`);
      if (savedData) {
        setUserStats(JSON.parse(savedData));
      } else {
        const initialStats = {
          xp: 0,
          streak: 0,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          lastCheckIn: null,
          level: 1
        };
        setUserStats(initialStats);
        localStorage.setItem(`arc_arena_stats_${account.toLowerCase()}`, JSON.stringify(initialStats));
      }
      
      // Load global activity
      const savedActivity = localStorage.getItem('arc_arena_global_activity');
      if (savedActivity) {
        setGlobalActivity(JSON.parse(savedActivity));
      }

      // Refresh leaderboard
      updateLeaderboard();
    }
  }, [account]);

  const updateLeaderboard = () => {
    const allStats = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('arc_arena_stats_')) {
        const address = key.replace('arc_arena_stats_', '');
        const stats = JSON.parse(localStorage.getItem(key));
        allStats.push({ address, ...stats });
      }
    }
    const sorted = allStats.sort((a, b) => b.xp - a.xp || b.streak - a.streak || b.gamesPlayed - a.gamesPlayed);
    setLeaderboard(sorted);
  };

  const addXP = async (amount, activityType, additionalData = {}) => {
    if (!account) return;

    setUserStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const updated = {
        ...prev,
        xp: newXP,
        level: newLevel,
        gamesPlayed: activityType !== 'Check-In' ? prev.gamesPlayed + 1 : prev.gamesPlayed,
        ...additionalData
      };
      
      localStorage.setItem(`arc_arena_stats_${account.toLowerCase()}`, JSON.stringify(updated));
      return updated;
    });

    const newActivity = {
      address: account,
      type: activityType,
      xp: amount,
      timestamp: Date.now(),
      ...additionalData
    };

    setGlobalActivity(prev => {
      const updated = [newActivity, ...prev].slice(0, 50);
      localStorage.setItem('arc_arena_global_activity', JSON.stringify(updated));
      return updated;
    });

    updateLeaderboard();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const { chainId } = await tempProvider.getNetwork();

      if (chainId !== 5042002) {
        await switchNetwork();
      }

      setAccount(accounts[0]);
      setProvider(tempProvider);
      setSigner(tempSigner);
      setNetwork(chainId);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARC_TESTNET_CONFIG],
          });
        } catch (addError) {
          throw addError;
        }
      }
      throw switchError;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      provider,
      signer,
      network,
      loading,
      error,
      userStats,
      globalActivity,
      leaderboard,
      connectWallet,
      switchNetwork,
      addXP
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
