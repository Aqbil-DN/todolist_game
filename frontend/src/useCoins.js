// The coin wallet is now server-authoritative. This hook simply re-exports the
// CoinsContext so existing imports (`import { useCoins } from '../useCoins'`)
// keep working. It exposes { coins, setCoins, refreshCoins }.
export { useCoinsContext as useCoins } from './context/CoinsContext';
