
export enum AppTab {
  HOME = 'HOME',
  PROMO = 'PROMO',
  CS = 'CS',
  SPONSOR = 'SPONSOR',
  ME = 'ME'
}

export enum CategoryId {
  SPORTS = 'sports',
  LIVE = 'live',
  CARDS = 'cards',
  ESPORTS = 'esports',
  LOTTERY = 'lottery',
  SLOTS = 'slots',
  FISHING = 'fishing'
}

export interface UserState {
  isLoggedIn: boolean;
  walletAddress: string | null;
  network: 'TRC20' | 'BEP20' | null;
  balance: number; // In USDT
  vipLevel: number;
}

export interface GameProvider {
  id: string;
  name: string;
  category: CategoryId;
  image: string;
  count: number;
  rebate: string;
}

export type WalletNetwork = 'TRC20' | 'BEP20';

export type WalletTab = 'deposit' | 'transfer' | 'withdraw' | 'vip';
