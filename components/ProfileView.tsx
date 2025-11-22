
import React, { useState } from 'react';
import { ViewProps, SubViewType } from '../types';
import { 
  Settings, LogOut, ChevronRight, RefreshCw, Copy, Wallet, 
  CreditCard, ArrowRightLeft, History, MessageSquare, Shield, 
  HelpCircle, Share2, Crown
} from 'lucide-react';
import { HistoryView, TransactionView, MessageView, SecurityView, HelpView } from './ProfileSubViews';

const ProfileView: React.FC<ViewProps> = ({ user, openWallet, onLogout, refreshBalance, isRefreshing, onNavigate }) => {
  const [activeSubView, setActiveSubView] = useState<SubViewType>(null);
  const [recycling, setRecycling] = useState(false);

  const handleRecycle = () => {
      if (recycling) return;
      setRecycling(true);
      // Simulate API call to recycle funds
      setTimeout(() => {
          setRecycling(false);
          alert("资金已成功回收至中心钱包！");
          if(refreshBalance) refreshBalance();
      }, 1500);
  };

  const handleShare = () => {
      const shareData = {
          title: '爱游戏 AYX',
          text: '加入爱游戏，体验顶级体育与真人娱乐！',
          url: window.location.href,
      };

      if (navigator.share) {
          navigator.share(shareData).catch(() => {});
      } else {
          navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
          alert("推广链接已复制到剪贴板！");
      }
  };

  // Render SubView Overlay if active
  if (activeSubView) {
      switch (activeSubView) {
          case 'HISTORY': return <HistoryView onBack={() => setActiveSubView(null)} />;
          case 'TRANSACTIONS': return <TransactionView onBack={() => setActiveSubView(null)} />;
          case 'MESSAGES': return <MessageView onBack={() => setActiveSubView(null)} />;
          case 'SECURITY': return <SecurityView onBack={() => setActiveSubView(null)} />;
          case 'HELP': return <HelpView onBack={() => setActiveSubView(null)} onNavigate={onNavigate} />;
      }
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-y-auto animate-fade-in relative">
      {/* Profile Header */}
      <div className="bg-slate-900 pt-safe pb-12 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/95"></div>
          
          <div className="relative z-10 px-6 pt-6">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-white font-bold text-lg">个人中心</h2>
                 <button 
                    onClick={() => setActiveSubView('SECURITY')}
                    className="text-slate-400 hover:text-white transition-colors p-2 -mr-2 active:scale-90"
                 >
                     <Settings size={20} />
                 </button>
             </div>

             <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20">
                     <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                        <UserAvatar />
                     </div>
                 </div>
                 <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">Ayx_User888</h3>
                        <button 
                            onClick={() => openWallet('vip')}
                            className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
                        >
                           <Crown size={10} className="fill-current" /> VIP {user.vipLevel} <ChevronRight size={10}/>
                        </button>
                     </div>
                     <div className="flex items-center gap-2 text-slate-400 text-xs font-mono bg-white/5 px-2 py-1 rounded-lg w-fit border border-white/10">
                        {user.walletAddress?.substring(0, 6)}...{user.walletAddress?.substring(user.walletAddress.length - 4)}
                        <button 
                            onClick={() => {navigator.clipboard.writeText(user.walletAddress || ''); alert('地址已复制');}}
                            className="hover:text-white ml-1"
                        >
                            <Copy size={10}/>
                        </button>
                     </div>
                 </div>
             </div>
          </div>
      </div>

      {/* Wallet Card */}
      <div className="px-4 -mt-8 relative z-20 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100/50">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <div className="text-slate-400 text-xs font-medium mb-1 flex items-center gap-1">
                          中心钱包余额 (USDT)
                          <button 
                            onClick={refreshBalance} 
                            disabled={isRefreshing}
                            className={`transition-all p-1 -m-1 ${isRefreshing ? 'animate-spin text-amber-500' : 'hover:text-amber-500'}`}
                          >
                            <RefreshCw size={12} />
                          </button>
                      </div>
                      <div className="text-3xl font-black text-slate-800 font-mono tracking-tight leading-none mt-1">
                          {user.balance.toFixed(2)}
                      </div>
                  </div>
                  <button 
                     onClick={handleRecycle}
                     disabled={recycling}
                     className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1.5 disabled:opacity-70 active:scale-95"
                  >
                      {recycling ? '回收中...' : '一键回收'} 
                      <ArrowRightLeft size={12} className={recycling ? 'animate-spin' : ''}/>
                  </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => openWallet('deposit')} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                      <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm group-hover:shadow-blue-500/30">
                          <CreditCard size={20} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">充值</span>
                  </button>
                  <button onClick={() => openWallet('withdraw')} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                      <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm group-hover:shadow-purple-500/30">
                          <Wallet size={20} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">提现</span>
                  </button>
                  <button onClick={() => openWallet('transfer')} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                      <div className="w-11 h-11 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm group-hover:shadow-green-500/30">
                          <ArrowRightLeft size={20} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">转账</span>
                  </button>
              </div>
          </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 space-y-4 pb-32">
          {/* Transaction Group */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <MenuItem icon={History} label="投注记录" color="text-blue-500" onClick={() => setActiveSubView('HISTORY')} />
              <MenuItem icon={ArrowRightLeft} label="交易明细" color="text-green-500" onClick={() => setActiveSubView('TRANSACTIONS')} />
          </div>

          {/* Service Group */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <MenuItem icon={MessageSquare} label="消息中心" color="text-amber-500" badge="3" onClick={() => setActiveSubView('MESSAGES')} />
              <MenuItem icon={Shield} label="安全中心" color="text-indigo-500" onClick={() => setActiveSubView('SECURITY')} />
              <MenuItem icon={HelpCircle} label="帮助中心" color="text-cyan-500" onClick={() => setActiveSubView('HELP')} />
              <MenuItem icon={Share2} label="分享好友" color="text-pink-500" onClick={handleShare} />
          </div>

          {/* Logout */}
          <button 
            onClick={onLogout}
            className="w-full bg-white py-4 rounded-2xl text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors shadow-sm active:scale-[0.99] border border-slate-100"
          >
              <LogOut size={18} />
              退出登录
          </button>
          
          <p className="text-center text-[10px] text-slate-400 pt-2">爱游戏 - 当前版本 v2.4.0 (Build 883)</p>
      </div>
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, color, badge, onClick }: any) => (
    <button 
      onClick={onClick}
      className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none active:bg-slate-100 group"
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                 <Icon size={18} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm shadow-red-500/30">{badge}</span>}
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
        </div>
    </button>
);

const UserAvatar = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-slate-600 translate-y-1" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

export default ProfileView;
