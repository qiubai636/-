
import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, RefreshCw, ChevronRight, ArrowRightLeft, Crown, CreditCard, Wallet, TrendingUp } from 'lucide-react';
import { WALLET_ADDRESS_BEP20, WALLET_ADDRESS_TRC20, CATEGORIES } from '../constants';
import { WalletNetwork, WalletTab } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  initialTab: WalletTab;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number, address: string) => void;
  userVipLevel: number;
}

const WalletModal: React.FC<WalletModalProps> = ({ 
  isOpen, onClose, balance, initialTab, onDeposit, onWithdraw, userVipLevel 
}) => {
  const [activeTab, setActiveTab] = useState<WalletTab>(initialTab);
  const [network, setNetwork] = useState<WalletNetwork>('TRC20');
  const [amount, setAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Transfer State
  const [transferFrom, setTransferFrom] = useState('main');
  const [transferTo, setTransferTo] = useState('sports');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const addressToDisplay = network === 'TRC20' ? WALLET_ADDRESS_TRC20 : WALLET_ADDRESS_BEP20;

  const handleCopy = () => {
    navigator.clipboard.writeText(addressToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (activeTab === 'deposit') {
        onDeposit(100); // Mock deposit
      } else if (activeTab === 'withdraw') {
        const val = parseFloat(amount);
        if (!isNaN(val)) {
          onWithdraw(val, withdrawAddress);
        }
      } else if (activeTab === 'transfer') {
        // Mock transfer logic
        alert("转账成功！资金已划转。");
      }
      setIsProcessing(false);
      setAmount('');
      setWithdrawAddress('');
    }, 1500);
  };

  // Render Content Helper
  const renderContent = () => {
    switch (activeTab) {
      case 'deposit':
        return (
          <div className="animate-fade-in">
             <div className="mb-6">
                <label className="text-sm font-bold text-slate-700 mb-2 block">选择充值网络</label>
                <div className="flex gap-3">
                  {['TRC20', 'BEP20'].map((net) => (
                    <button
                      key={net}
                      onClick={() => setNetwork(net as WalletNetwork)}
                      className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-all flex items-center justify-center gap-2 ${network === net ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-200 text-slate-600 bg-slate-50'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${net === 'TRC20' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                      USDT-{net}
                    </button>
                  ))}
                </div>
             </div>

             <div className="flex flex-col items-center p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl mb-6">
                  <div className="w-48 h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 relative overflow-hidden group">
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
                         {[...Array(36)].map((_,i) => <div key={i} className="border-[0.5px] border-black"></div>)}
                      </div>
                      <span className="z-10 text-xs">[ 模拟二维码区域 ]</span>
                  </div>
                  <p className="text-xs text-center text-slate-500 mb-4 font-medium">
                    请仅向此地址充值 <span className="text-amber-600 font-bold">USDT-{network}</span><br/>否则资产将无法找回
                  </p>
                  <div className="w-full bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-200 group cursor-pointer" onClick={handleCopy}>
                     <span className="text-xs text-slate-600 font-mono truncate mr-2 select-all">
                       {addressToDisplay}
                     </span>
                     <button className="text-amber-600 hover:text-amber-700 transition-colors">
                       {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                     </button>
                  </div>
              </div>

              <button 
                onClick={handleAction}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={20}/> : <CheckCircle size={20}/>}
                {isProcessing ? '正在确认链上数据...' : '我已完成支付'}
              </button>
          </div>
        );

      case 'withdraw':
        return (
          <div className="animate-fade-in space-y-5">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-red-100 p-1.5 rounded-full text-red-600 mt-0.5"><TrendingUp size={16}/></div>
                  <div>
                      <h4 className="text-xs font-bold text-red-700 mb-1">提现须知</h4>
                      <p className="text-[10px] text-red-600/80 leading-relaxed">
                          1. 请务必确认您的提现地址协议（TRC20/BEP20）。<br/>
                          2. 每日首次提现免手续费，之后每笔收取 1 USDT。<br/>
                          3. 大额提现可能需要人工审核，请耐心等待。
                      </p>
                  </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">提现网络</label>
                <div className="flex gap-3">
                  {['TRC20', 'BEP20'].map((net) => (
                    <button
                      key={net}
                      onClick={() => setNetwork(net as WalletNetwork)}
                      className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-all ${network === net ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-600'}`}
                    >
                      USDT-{net}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">接收地址</label>
                <input 
                  type="text"
                  placeholder={`粘贴您的 USDT-${network} 钱包地址`}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:bg-white outline-none text-sm font-mono transition-all"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-slate-700">提现金额</label>
                    <span className="text-xs text-slate-400">可提现: <span className="text-slate-800 font-bold">{balance.toFixed(2)}</span></span>
                </div>
                <div className="relative">
                  <input 
                      type="number"
                      placeholder="最低 30"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:bg-white outline-none text-sm font-bold pr-24 transition-all"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                      <button onClick={() => setAmount(balance.toFixed(2))} className="text-[10px] text-amber-600 font-bold bg-amber-100 px-2 py-1 rounded-md hover:bg-amber-200 transition-colors">全部</button>
                      <span className="text-slate-400 text-sm font-medium">USDT</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAction}
                disabled={isProcessing || !amount || !withdrawAddress || parseFloat(amount) < 30}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={18}/> : <Wallet size={18}/>}
                {isProcessing ? '提交中...' : '提交提现申请'}
              </button>
          </div>
        );

      case 'transfer':
        return (
           <div className="animate-fade-in space-y-6">
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                   <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                   <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">中心钱包余额</p>
                   <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black tracking-tight">{balance.toFixed(2)}</span>
                       <span className="text-amber-400 text-sm font-bold">USDT</span>
                   </div>
                   <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-lg backdrop-blur-sm transition-colors">
                       <RefreshCw size={18} className="text-white/80" />
                   </button>
               </div>

               <div className="flex flex-col gap-2">
                   {/* From */}
                   <div className="flex items-center gap-3 bg-slate-50 p-2 pr-4 rounded-xl border border-slate-200">
                       <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400 text-xs font-bold border border-slate-100">
                           从
                       </div>
                       <select 
                         value={transferFrom}
                         onChange={(e) => setTransferFrom(e.target.value)}
                         className="flex-1 bg-transparent font-bold text-slate-700 outline-none"
                       >
                           <option value="main">中心钱包</option>
                           {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}钱包</option>)}
                       </select>
                   </div>
                   
                   {/* Swap Icon */}
                   <div className="flex justify-center -my-3 relative z-10">
                       <button 
                         onClick={() => {
                             const temp = transferFrom;
                             setTransferFrom(transferTo);
                             setTransferTo(temp);
                         }}
                         className="w-8 h-8 rounded-full bg-white border border-slate-200 text-amber-500 flex items-center justify-center shadow-md hover:rotate-180 transition-transform duration-300"
                        >
                           <ArrowRightLeft size={14} />
                       </button>
                   </div>

                   {/* To */}
                   <div className="flex items-center gap-3 bg-slate-50 p-2 pr-4 rounded-xl border border-slate-200">
                       <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400 text-xs font-bold border border-slate-100">
                           到
                       </div>
                       <select 
                         value={transferTo}
                         onChange={(e) => setTransferTo(e.target.value)}
                         className="flex-1 bg-transparent font-bold text-slate-700 outline-none"
                       >
                           <option value="main">中心钱包</option>
                           {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}钱包</option>)}
                       </select>
                   </div>
               </div>

               <div>
                   <label className="text-sm font-bold text-slate-700 mb-2 block">划转金额</label>
                   <div className="relative">
                       <input 
                           type="number" 
                           placeholder="0.00"
                           className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold text-lg outline-none focus:border-amber-500 transition-colors"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                       />
                       <button className="absolute right-3 top-3.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100">
                           最大
                       </button>
                   </div>
               </div>

               <div className="flex gap-3">
                   <button className="flex-1 py-3.5 rounded-xl bg-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-300 transition-colors">
                       一键回收
                   </button>
                   <button 
                     onClick={handleAction}
                     disabled={isProcessing}
                     className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                    >
                       {isProcessing ? '处理中...' : '确认划转'}
                   </button>
               </div>
           </div>
        );

      case 'vip':
        return (
            <div className="animate-fade-in">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 text-white/5 rotate-12">
                        <Crown size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg italic">VIP MEMBER</h3>
                                <p className="text-slate-400 text-xs">尊贵的会员，您好</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-full flex items-center justify-center text-slate-900 font-black text-xl border-2 border-white/20 shadow-lg">
                                {userVipLevel}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-slate-300">
                                <span>当前成长值: 4,500</span>
                                <span>下一级: 10,000</span>
                            </div>
                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-600 w-[45%]"></div>
                            </div>
                            <p className="text-[10px] text-slate-500 text-right mt-1">再充值 5,500 USDT 即可升级</p>
                        </div>
                    </div>
                </div>

                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Crown size={16} className="text-amber-500"/> 等级特权
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                        <div className="text-slate-400 text-xs mb-1">每日提款额度</div>
                        <div className="text-slate-800 font-bold text-lg">50,000 <span className="text-xs text-slate-400 font-normal">USDT</span></div>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                        <div className="text-slate-400 text-xs mb-1">体育返水比例</div>
                        <div className="text-amber-600 font-bold text-lg">1.18%</div>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                        <div className="text-slate-400 text-xs mb-1">真人返水比例</div>
                        <div className="text-amber-600 font-bold text-lg">0.80%</div>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                        <div className="text-slate-400 text-xs mb-1">生日礼金</div>
                        <div className="text-slate-800 font-bold text-lg">188 <span className="text-xs text-slate-400 font-normal">USDT</span></div>
                    </div>
                </div>

                <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-medium text-sm hover:bg-slate-50 transition-colors">
                    查看完整 VIP 详情
                </button>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-50 w-full max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh] shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center flex-shrink-0">
            <h2 className="font-black text-lg text-slate-800">资金中心</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
                <X size={20} />
            </button>
        </div>

        {/* Sidebar/Tabs (Mobile Horizontal) */}
        <div className="flex sm:grid sm:grid-cols-4 p-2 bg-white gap-2 overflow-x-auto border-b border-slate-100 shrink-0 hide-scroll">
             {[
                 { id: 'deposit', label: '快速充值', icon: CreditCard },
                 { id: 'transfer', label: '资金划转', icon: ArrowRightLeft },
                 { id: 'withdraw', label: '余额提现', icon: Wallet },
                 { id: 'vip', label: 'VIP特权', icon: Crown },
             ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as WalletTab)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all whitespace-nowrap flex-1 sm:flex-none ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                     <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2}/>
                     <span className="text-xs font-bold">{tab.label}</span>
                 </button>
             ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
            {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default WalletModal;
