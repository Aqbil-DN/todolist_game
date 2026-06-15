import { useState, useEffect, useCallback } from 'react';

const COINS_KEY = 'sbrain_coins';
const DEFAULT_COINS = 1000;

// Shared coin wallet persisted in localStorage so coins earned on the
// Dashboard can be spent on the Gacha page (pages don't share React state).
export function useCoins() {
  const [coins, setCoins] = useState(() => {
    const stored = localStorage.getItem(COINS_KEY);
    if (stored === null) return DEFAULT_COINS;
    const parsed = parseInt(stored, 10);
    return Number.isNaN(parsed) ? DEFAULT_COINS : parsed;
  });

  useEffect(() => {
    localStorage.setItem(COINS_KEY, String(coins));
  }, [coins]);

  // Keep the balance in sync if another tab changes it.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === COINS_KEY && e.newValue !== null) {
        const parsed = parseInt(e.newValue, 10);
        if (!Number.isNaN(parsed)) setCoins(parsed);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addCoins = useCallback((amount) => {
    setCoins((c) => c + amount);
  }, []);

  // Returns true if the spend succeeded, false if the balance is too low.
  const spendCoins = useCallback((amount) => {
    if (coins < amount) return false;
    setCoins((c) => c - amount);
    return true;
  }, [coins]);

  return { coins, addCoins, spendCoins };
}
