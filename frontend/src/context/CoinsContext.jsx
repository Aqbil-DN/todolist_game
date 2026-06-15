import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const CoinsContext = createContext(null);

export function CoinsProvider({ children }) {
  const { firebaseUser } = useAuth();
  const [coins, setCoins] = useState(0);

  const refreshCoins = useCallback(async () => {
    try {
      const wallet = await api.getWallet();
      setCoins(wallet.coins);
    } catch {
      // ignore - wallet stays at its last known value
    }
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      refreshCoins();
    } else {
      setCoins(0);
    }
  }, [firebaseUser, refreshCoins]);

  return (
    <CoinsContext.Provider value={{ coins, setCoins, refreshCoins }}>
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoinsContext() {
  const context = useContext(CoinsContext);
  if (!context) throw new Error('useCoinsContext must be used within a CoinsProvider');
  return context;
}
