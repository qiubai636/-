
import React, { useState } from 'react';
import { ShieldCheck, Wallet, Globe, X, Check } from 'lucide-react';
import { WalletNetwork } from '../types';

interface LoginProps {
  onLogin: (wallet: string, network: WalletNetwork) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnect = (network: WalletNetwork) => {
    setLoading(true);
    setShowWalletModal(false);
    
    // Simulate wallet connection delay
    setTimeout(() => {
      setLoading(false);
      // Mock Address Generation based on Network
      const mockAddress = network === 'TRC20' 
        ? "T9yD14Nj9j7xAB4dbGeMz4h8qTRC20" 
        : "0x71C7656EC7ab88b098defB751BEP20";
      
      onLogin(mockAddress, network);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 relative overflow-hidden flex flex-col pb-safe">
      {/* Background Image Simulation */}
      <div className="absolute inset-0 z-0">
         <img 
           src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop" 
           alt="Stadium Background" 
           className="w-full h-full object-cover opacity-30"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-8">
        
        {/* Logo Area */}
        <div className="mb-10 text-center">
           <h1 className="text-6xl font-black text-white tracking-tighter italic drop-shadow-2xl transform -skew-x-6">
             AYX
             <span className="text-amber-500 text-3xl ml-1 not-italic align-top relative top-2">®</span>
           </h1>
           <p className="text-slate-400 text-xs tracking-[0.2em] uppercase mt-3 font-medium">爱游戏体育官方合作伙伴</p>
           <div className="flex justify-center gap-6 mt-6 items-center opacity-80">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Borussia_M%C3%B6nchengladbach_logo.svg/1200px-Borussia_M%C3%B6nchengladbach_logo.svg.png" alt="Partner" className="h-10 grayscale brightness-150 contrast-125" />
              <div className="w-px h-8 bg-slate-600"></div>
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Newcastle_United_Logo.svg/1200px-Newcastle_United_Logo.svg.png" alt="Partner" className="h-10 grayscale brightness-150 contrast-125" />
           </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
            <div className="space-y-4">
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <ShieldCheck className="text-slate-500 group-focus-within:text-amber-400" size={20} />
                   </div>
                   <input 
                     type="text" 
                     placeholder="用户名 / 手机号" 
                     className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-900/80 transition-all"
                   />
                </div>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <Globe className="text-slate-500 group-focus-within:text-amber-400" size={20} />
                   </div>
                   <input 
                     type="password" 
                     placeholder="密码" 
                     className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-900/80 transition-all"
                   />
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-xs text-slate-400 px-1">
                <button className="hover:text-white transition-colors">记住密码</button>
                <button className="hover:text-white transition-colors">忘记密码?</button>
            </div>

            <button className="w-full mt-8 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-[0.98]">
                登录
            </button>
        </div>

        {/* Divider */}
        <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative px-4 bg-transparent text-slate-500 text-[10px] uppercase tracking-widest bg-slate-900">或使用钱包连接</span>
        </div>

        {/* Web3 Connect */}
        <button 
          onClick={() => setShowWalletModal(true)}
          disabled={loading}
          className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 text-slate-300 hover:text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
        >
            {loading ? (
                <span className="animate-pulse">连接中...</span>
            ) : (
                <>
                    <Wallet size={20} className="text-amber-500" />
                    连接钱包 (Web3)
                </>
            )}
        </button>
      </div>
      
      <div className="relative z-10 p-6 flex justify-between text-slate-500 text-xs font-medium mt-auto">
        <button className="hover:text-slate-300 transition-colors">立即注册</button>
        <button className="hover:text-slate-300 transition-colors">游客进入</button>
        <button className="hover:text-slate-300 transition-colors">在线客服</button>
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-slate-800 w-full max-w-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl animate-slide-up relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-white font-bold text-lg">选择钱包网络</h3>
                  <button onClick={() => setShowWalletModal(false)} className="text-slate-400 hover:text-white bg-slate-700/50 p-2 rounded-full"><X size={20}/></button>
               </div>
               
               <div className="space-y-4">
                  <button 
                    onClick={() => handleConnect('BEP20')}
                    className="w-full p-4 rounded-2xl bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 hover:border-yellow-500/50 transition-all flex items-center justify-between group active:scale-[0.98]"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#F0B90B] flex items-center justify-center text-slate-900 font-bold text-xs shadow-lg shadow-[#F0B90B]/20">BSC</div>
                        <div className="text-left">
                           <div className="text-white font-bold">Binance Smart Chain</div>
                           <div className="text-slate-400 text-xs mt-0.5">MetaMask / Trust Wallet</div>
                        </div>
                     </div>
                     <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center group-hover:border-[#F0B90B] group-hover:bg-[#F0B90B] transition-all">
                        <Check size={14} className="text-slate-900 opacity-0 group-hover:opacity-100" />
                     </div>
                  </button>

                  <button 
                    onClick={() => handleConnect('TRC20')}
                    className="w-full p-4 rounded-2xl bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 hover:border-red-500/50 transition-all flex items-center justify-between group active:scale-[0.98]"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FF0606] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#FF0606]/20">TRX</div>
                        <div className="text-left">
                           <div className="text-white font-bold">TRON Network</div>
                           <div className="text-slate-400 text-xs mt-0.5">TronLink / Trust Wallet</div>
                        </div>
                     </div>
                     <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center group-hover:border-[#FF0606] group-hover:bg-[#FF0606] transition-all">
                         <Check size={14} className="text-white opacity-0 group-hover:opacity-100" />
                     </div>
                  </button>
               </div>
               <p className="text-center text-slate-500 text-xs mt-8">
                 连接即代表您同意 <span className="text-amber-500">服务条款</span> 和 <span className="text-amber-500">隐私政策</span>
               </p>
            </div>
         </div>
      )}

    </div>
  );
};

export default Login;