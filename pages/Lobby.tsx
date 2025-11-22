
import React, { useState, useEffect } from 'react';
import { 
  Home, Gift, Headset, Shield, User, Mic
} from 'lucide-react';
import { UserState, AppTab, WalletTab, ViewProps, GameProvider } from '../types';
import WalletModal from '../components/WalletModal';
import LiveAssistant from '../components/LiveAssistant';
import LiveChat from '../components/LiveChat';
import HomeView from '../components/HomeView';
import ProfileView from '../components/ProfileView';
import GameLaunchView from '../components/GameLaunchView';
import { PromoView, SupportView, SponsorshipView } from '../components/ExtraViews';

interface LobbyProps {
  user: UserState;
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  updateBalance: (amount: number) => void;
  withdraw: (amount: number, address: string) => void;
  refreshBalance: () => Promise<void>;
  onLogout: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ user, currentTab, setTab, updateBalance, withdraw, refreshBalance, onLogout }) => {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletTab, setWalletTab] = useState<WalletTab>('deposit');
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeGame, setActiveGame] = useState<GameProvider | null>(null);

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    const handleAutoRefresh = async () => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      await refreshBalance();
      setIsRefreshing(false);
    };

    const intervalId = setInterval(handleAutoRefresh, 30000);
    return () => clearInterval(intervalId);
  }, [refreshBalance, isRefreshing]);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await refreshBalance();
    setIsRefreshing(false);
  };

  const openWallet = (tab: WalletTab) => {
      setWalletTab(tab);
      setIsWalletOpen(true);
  };

  const handleDeposit = (amt: number) => {
    // Update balance logic. 
    // Note: We do NOT close the modal here. WalletModal handles the success message and auto-close.
    updateBalance(amt);
  };

  const handleWithdraw = (amt: number, addr: string) => {
      if (amt < 30) {
          // Validation handled in UI usually, but safety check here
          return;
      }
      if (user.balance < amt) {
          return;
      }
      updateBalance(-amt);
      // WalletModal handles success message and close
  };

  const handleLaunchGame = (game: GameProvider) => {
    setActiveGame(game);
  };

  // View Props passed to all sub-views
  const viewProps: ViewProps = {
      user,
      openWallet,
      onLogout,
      refreshBalance: handleManualRefresh,
      onUpdateBalance: updateBalance,
      isRefreshing,
      onLaunchGame: handleLaunchGame,
      onNavigate: setTab,
      onOpenLiveSupport: () => setIsLiveOpen(true),
      onOpenChat: () => setIsChatOpen(true)
  };

  // Render Content based on Tab
  const renderContent = () => {
      switch (currentTab) {
          case AppTab.HOME:
              return <HomeView {...viewProps} />;
          case AppTab.PROMO:
              return <PromoView {...viewProps} />;
          case AppTab.CS:
              return <SupportView {...viewProps} />;
          case AppTab.SPONSOR:
              return <SponsorshipView {...viewProps} />;
          case AppTab.ME:
              return <ProfileView {...viewProps} />;
          default:
              return <HomeView {...viewProps} />;
      }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 overflow-hidden">
      
      {/* Main Content Layer */}
      <div className="flex-1 overflow-hidden relative z-10">
          {renderContent()}
      </div>

      {/* Floating Live Support Button (Global) */}
      <button 
        onClick={() => setIsLiveOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center z-40 animate-bounce-slow border-2 border-white/20 backdrop-blur-sm active:scale-90 transition-transform"
      >
        <Mic size={24} strokeWidth={2.5} />
      </button>

      {/* Bottom Navigation */}
      <div className="bg-white/95 backdrop-blur-lg border-t border-slate-200 fixed bottom-0 w-full pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex justify-around items-center h-14 sm:h-16">
             {[
                 { id: AppTab.HOME, icon: Home, label: '首页' },
                 { id: AppTab.PROMO, icon: Gift, label: '优惠' },
                 { id: AppTab.CS, icon: Headset, label: '客服' },
                 { id: AppTab.SPONSOR, icon: Shield, label: '赞助' },
                 { id: AppTab.ME, icon: User, label: '我的' },
             ].map((item) => {
                 const isActive = currentTab === item.id;
                 return (
                     <button 
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={`flex flex-col items-center gap-1 flex-1 h-full justify-center relative ${isActive ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                         {isActive && <div className="absolute top-0 w-8 h-0.5 bg-amber-500 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.5)]"></div>}
                         <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform ${isActive ? '-translate-y-0.5' : ''}`}/>
                         <span className="text-[10px] font-bold scale-95">{item.label}</span>
                     </button>
                 )
             })}
          </div>
      </div>

      {/* Global Modals */}
      <WalletModal 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)}
        balance={user.balance}
        initialTab={walletTab}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        userVipLevel={user.vipLevel}
      />

      {isLiveOpen && (
        <LiveAssistant onClose={() => setIsLiveOpen(false)} />
      )}

      {isChatOpen && (
        <LiveChat onClose={() => setIsChatOpen(false)} />
      )}

      {/* Game Launch Overlay */}
      {activeGame && (
        <GameLaunchView 
          game={activeGame} 
          balance={user.balance}
          onClose={() => setActiveGame(null)} 
        />
      )}

    </div>
  );
};

export default Lobby;
