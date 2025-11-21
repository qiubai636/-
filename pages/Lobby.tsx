import React, { useState, useEffect } from 'react';
import { 
  Home, Gift, Headset, Store, User, Menu, Bell, CreditCard, 
  Shield, Wallet, ChevronRight, Flame, Mic, ArrowDown, Crown, ArrowRightLeft, RefreshCw
} from 'lucide-react';
import { UserState, AppTab, CategoryId, WalletTab } from '../types';
import { CATEGORIES, GAME_PROVIDERS } from '../constants';
import WalletModal from '../components/WalletModal';
import LiveAssistant from '../components/LiveAssistant';

interface LobbyProps {
  user: UserState;
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  updateBalance: (amount: number) => void;
  withdraw: (amount: number, address: string) => void;
  refreshBalance: () => Promise<void>;
}

const Lobby: React.FC<LobbyProps> = ({ user, currentTab, setTab, updateBalance, withdraw, refreshBalance }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(CategoryId.SPORTS);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletTab, setWalletTab] = useState<WalletTab>('deposit');
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    // Simulate API call
    setTimeout(() => {
        updateBalance(amt);
        alert(`成功充值 ${amt} USDT!`);
        setIsWalletOpen(false);
    }, 1000);
  };

  const handleWithdraw = (amt: number, addr: string) => {
      if (amt < 30) {
          alert("最低提现金额为 30 USDT");
          return;
      }
      if (user.balance < amt) {
          alert("余额不足");
          return;
      }
      // Simulate withdrawal hold
      updateBalance(-amt);
      alert(`您的 ${amt} USDT 提现申请已提交人工审核。`);
      setIsWalletOpen(false);
  };

  const filteredProviders = GAME_PROVIDERS.filter(g => g.category === selectedCategory);

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 overflow-hidden">
      
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-20 relative pt-safe">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md border border-amber-200">
                V{user.vipLevel}
             </div>
             <div>
                 <div className="text-xs text-slate-400 font-medium">欢迎回来</div>
                 <div className="flex items-center gap-2">
                     <div className="text-sm font-bold truncate max-w-[100px] text-slate-800 font-mono">
                        {user.walletAddress?.substring(0, 6)}...{user.walletAddress?.substring(user.walletAddress.length - 4)}
                     </div>
                     {user.network && (
                        <span className={`text-[9px] px-1.5 rounded font-bold ${user.network === 'BEP20' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {user.network}
                        </span>
                     )}
                 </div>
             </div>
         </div>
         <div className="flex items-center gap-2">
             <div className="flex flex-col items-end mr-1">
                 <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    余额
                    <button 
                        onClick={handleManualRefresh} 
                        disabled={isRefreshing}
                        className={`transition-all ${isRefreshing ? 'animate-spin text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}
                    >
                        <RefreshCw size={10} />
                    </button>
                 </div>
                 <div className="text-amber-600 font-black font-mono text-sm leading-none">{user.balance.toFixed(2)}</div>
             </div>
             <button 
               onClick={() => openWallet('deposit')}
               className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-transform"
             >
                 <Wallet size={16} />
             </button>
             <button className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-transform">
                 <Bell size={16} />
             </button>
         </div>
      </div>

      {/* Marquee */}
      <div className="bg-white border-b border-slate-100 py-2 px-4 flex items-center gap-2 overflow-hidden shrink-0">
         <div className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">公告</div>
         <div className="whitespace-nowrap overflow-hidden text-xs text-slate-500 animate-marquee w-full font-medium">
            欢迎来到爱游戏! 新用户首存送 300% 红利。如有疑问请联系在线客服。系统将于 UTC 03:00 进行例行维护。
         </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative">
         
         {/* Sidebar */}
         <div className="w-[84px] bg-white flex flex-col items-center py-2 overflow-y-auto hide-scroll border-r border-slate-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 pb-24">
            {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex flex-col items-center justify-center py-4 gap-1.5 relative transition-all ${isActive ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full shadow-lg shadow-amber-500/50"></div>}
                        <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-amber-50 shadow-sm translate-x-1' : 'bg-slate-50/50'}`}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'drop-shadow-sm' : ''}/>
                        </div>
                        <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{cat.name}</span>
                    </button>
                )
            })}
         </div>

         {/* Main Content */}
         <div className="flex-1 overflow-y-auto bg-slate-100 p-4 pb-32">
            
            {/* Banner Slider (Static mock) */}
            <div className="w-full aspect-[2/1] sm:aspect-[5/2] rounded-2xl bg-slate-800 mb-6 relative overflow-hidden shadow-xl group">
                <img 
                    src="https://images.unsplash.com/photo-1626246998258-223317db5cb9?q=80&w=2070&auto=format&fit=crop" 
                    alt="Banner" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                
                <div className="relative z-10 p-5 flex flex-col justify-center h-full items-start">
                    <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block shadow-lg shadow-amber-500/20">
                        独家赞助
                    </div>
                    <h3 className="text-amber-400 font-black text-2xl italic tracking-tighter">PREMIER LEAGUE</h3>
                    <h2 className="text-white font-bold text-lg leading-tight mt-1 mb-4">英超联赛 <br/>官方合作伙伴</h2>
                    <button className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-1">
                        立即投注 <ChevronRight size={12} />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <button onClick={() => openWallet('deposit')} className="flex flex-col items-center gap-2 p-1 active:scale-95 transition-transform group">
                     <div className="w-12 h-12 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         <CreditCard size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-[11px] font-bold text-slate-600">充值</span>
                </button>
                <button onClick={() => openWallet('transfer')} className="flex flex-col items-center gap-2 p-1 active:scale-95 transition-transform group">
                     <div className="w-12 h-12 rounded-[18px] bg-green-50 text-green-600 flex items-center justify-center shadow-sm border border-white group-hover:bg-green-600 group-hover:text-white transition-colors">
                         <ArrowRightLeft size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-[11px] font-bold text-slate-600">转账</span>
                </button>
                <button onClick={() => openWallet('withdraw')} className="flex flex-col items-center gap-2 p-1 active:scale-95 transition-transform group">
                     <div className="w-12 h-12 rounded-[18px] bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm border border-white group-hover:bg-purple-600 group-hover:text-white transition-colors">
                         <Wallet size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-[11px] font-bold text-slate-600">提现</span>
                </button>
                <button onClick={() => openWallet('vip')} className="flex flex-col items-center gap-2 p-1 active:scale-95 transition-transform group">
                     <div className="w-12 h-12 rounded-[18px] bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm border border-white group-hover:bg-amber-600 group-hover:text-white transition-colors">
                         <Crown size={20} strokeWidth={2.5} />
                     </div>
                     <span className="text-[11px] font-bold text-slate-600">VIP</span>
                </button>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                    热门{CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </h3>
                <button className="text-xs text-slate-400 flex items-center">全部 <ChevronRight size={12}/></button>
            </div>

            {/* Game Providers List */}
            <div className="space-y-4">
                {filteredProviders.map((provider) => (
                    <div key={provider.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100/50 flex gap-4 items-center relative overflow-hidden group active:scale-[0.98] transition-all">
                        <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 relative">
                            <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                        <div className="flex-1 z-10 py-1">
                            <div className="flex items-center gap-2 mb-1">
                               <h3 className="font-bold text-slate-800 text-base">{provider.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] text-slate-400">{provider.count} 款游戏</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-100">返水 {provider.rebate}</span>
                                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold border border-red-100 flex items-center gap-0.5">
                                    <Flame size={10} className="fill-current" /> 热门
                                </span>
                            </div>
                        </div>
                        <div className="pr-2">
                             <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredProviders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-300">
                            <Gift size={32} />
                        </div>
                        <p className="text-sm">暂无该类别的游戏</p>
                    </div>
                )}
            </div>
         </div>
      </div>

      {/* Floating Live Support Button */}
      <button 
        onClick={() => setIsLiveOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center z-40 animate-bounce-slow border-2 border-white/20 backdrop-blur-sm active:scale-90 transition-transform"
      >
        <Mic size={24} strokeWidth={2.5} />
      </button>

      {/* Bottom Navigation */}
      <div className="bg-white/95 backdrop-blur-lg border-t border-slate-200 fixed bottom-0 w-full pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
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

      {/* Modals */}
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

    </div>
  );
};

export default Lobby;