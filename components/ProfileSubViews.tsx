
import React, { useState } from 'react';
import { ChevronLeft, Search, CheckCircle, AlertCircle, Clock, ChevronRight, Lock, Smartphone, Eye, ChevronDown, Share2 } from 'lucide-react';
import { AppTab } from '../types';

interface SubViewProps {
  onBack: () => void;
  onNavigate?: (tab: AppTab) => void;
}

// --- Shared Layout Component ---
const SubViewLayout: React.FC<{ title: string; onBack: () => void; children: React.ReactNode }> = ({ title, onBack, children }) => (
  <div className="absolute inset-0 z-30 bg-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
    <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 pt-safe shrink-0">
      <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-600 active:scale-90 transition-transform">
        <ChevronLeft size={24} />
      </button>
      <h2 className="font-bold text-lg text-slate-800">{title}</h2>
      <div className="w-8"></div>
    </div>
    <div className="flex-1 overflow-y-auto pb-24">
      {children}
    </div>
  </div>
);

// --- 1. Betting History ---
export const HistoryView: React.FC<SubViewProps> = ({ onBack }) => {
  const [filter, setFilter] = useState('all');
  
  const bets = [
    { id: 'BET-882930', game: '曼彻斯特城 vs 利物浦', type: '体育单关', amount: 500, win: 0, status: 'pending', time: '2023-10-24 19:30' },
    { id: 'BET-882921', game: '百家乐 - 厅12', type: '真人视讯', amount: 200, win: 390, status: 'won', time: '2023-10-24 14:15' },
    { id: 'BET-882915', game: 'PG电子 - 麻将胡了2', type: '电子游艺', amount: 50, win: 0, status: 'lost', time: '2023-10-24 10:05' },
    { id: 'BET-882899', game: '洛杉矶湖人 vs 勇士', type: '体育滚球', amount: 1000, win: 1950, status: 'won', time: '2023-10-23 22:45' },
    { id: 'BET-882754', game: '彩票 - 重庆时时彩', type: '彩票游戏', amount: 20, win: 0, status: 'lost', time: '2023-10-23 18:30' },
  ];

  return (
    <SubViewLayout title="投注记录" onBack={onBack}>
      <div className="bg-white p-2 flex gap-2 sticky top-0 z-10 shadow-sm border-b border-slate-100">
         {['all', 'won', 'lost', 'pending'].map(f => (
           <button 
             key={f}
             onClick={() => setFilter(f)}
             className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-500'}`}
           >
             {f === 'all' ? '全部' : f === 'pending' ? '未结' : f === 'won' ? '中奖' : '未中'}
           </button>
         ))}
      </div>
      
      <div className="p-4 space-y-3">
        {bets.filter(b => filter === 'all' || b.status === filter).map((bet) => (
          <div key={bet.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[10px] text-slate-400 mb-1 font-mono">{bet.id}</div>
                <div className="font-bold text-slate-800 text-sm">{bet.game}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit">{bet.type}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                bet.status === 'won' ? 'bg-green-100 text-green-600' : 
                bet.status === 'lost' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-600'
              }`}>
                {bet.status === 'won' ? '已派彩' : bet.status === 'lost' ? '未中奖' : '待结算'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-slate-50 pt-3 mt-2">
               <div>
                 <div className="text-slate-400 text-[10px]">投注金额</div>
                 <div className="font-mono font-bold">{bet.amount.toFixed(2)}</div>
               </div>
               <div className="text-right">
                 <div className="text-slate-400 text-[10px]">输赢/可赢</div>
                 <div className={`font-mono font-bold ${bet.status === 'won' ? 'text-green-500' : bet.status === 'lost' ? 'text-slate-900' : 'text-amber-500'}`}>
                   {bet.status === 'pending' ? `+${(bet.amount * 1.95).toFixed(2)}` : (bet.win - bet.amount).toFixed(2)}
                 </div>
               </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Clock size={10} /> {bet.time}
            </div>
          </div>
        ))}
      </div>
    </SubViewLayout>
  );
};

// --- 2. Transaction History ---
export const TransactionView: React.FC<SubViewProps> = ({ onBack }) => {
    const txs = [
        { id: 1, type: '存款', method: 'USDT-TRC20', amount: 1000, status: 'success', time: '2023-10-24 12:30:45' },
        { id: 2, type: '转账', method: '中心 -> 体育', amount: 500, status: 'success', time: '2023-10-24 12:32:10' },
        { id: 3, type: '提款', method: 'USDT-TRC20', amount: 2000, status: 'processing', time: '2023-10-23 09:15:00' },
        { id: 4, type: '返水', method: 'VIP等级红利', amount: 58.8, status: 'success', time: '2023-10-23 00:00:00' },
        { id: 5, type: '转账', method: '真人 -> 中心', amount: 390, status: 'success', time: '2023-10-22 23:10:00' },
    ];

    return (
        <SubViewLayout title="交易明细" onBack={onBack}>
             <div className="p-4 space-y-3">
                 {txs.map((tx) => (
                     <div key={tx.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-slate-100">
                         <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                 tx.type === '存款' ? 'bg-green-50 text-green-600' : 
                                 tx.type === '提款' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                             }`}>
                                 {tx.type === '存款' ? <CheckCircle size={18}/> : tx.type === '提款' ? <AlertCircle size={18}/> : <CheckCircle size={18}/>}
                             </div>
                             <div>
                                 <div className="font-bold text-slate-800 text-sm">{tx.type}</div>
                                 <div className="text-[10px] text-slate-400 mt-0.5">{tx.time}</div>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className={`font-bold font-mono text-sm ${tx.type === '提款' || tx.type.includes('->') ? 'text-slate-800' : 'text-green-600'}`}>
                                 {tx.type === '提款' || tx.type.includes('->') ? '-' : '+'}{tx.amount.toFixed(2)}
                             </div>
                             <div className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded inline-block mt-1">{tx.method}</div>
                         </div>
                     </div>
                 ))}
             </div>
        </SubViewLayout>
    )
}

// --- 3. Message Center ---
export const MessageView: React.FC<SubViewProps> = ({ onBack }) => {
    const msgs = [
        { id: 1, title: "系统维护通知", content: "尊敬的用户，我们将于10月26日凌晨03:00进行例行维护，预计耗时2小时，期间将无法进行存款和提款操作，请您提前做好资金安排。", read: false, time: "10分钟前", type: "system" },
        { id: 2, title: "提款到账通知", content: "您申请的 2,000 USDT 提款已处理完毕，TXID: T9y...888，请留意钱包到账情况。", read: false, time: "2小时前", type: "finance" },
        { id: 3, title: "VIP 升级喜报", content: "恭喜您升级为 VIP2！专属客服经理已添加，每日提款额度提升至 50,000 USDT，请享受您的尊贵特权。", read: false, time: "昨天", type: "system" },
        { id: 4, title: "周末红利派发", content: "您的周末体育救援金 88 USDT 已派发至中心钱包，流水要求 1倍。", read: true, time: "3天前", type: "promo" },
    ];

    return (
        <SubViewLayout title="消息中心" onBack={onBack}>
            <div className="p-4 space-y-3">
                {msgs.map((msg) => (
                    <div key={msg.id} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 transition-all active:scale-[0.98] ${msg.read ? 'border-slate-200 opacity-60' : 'border-amber-500'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-bold text-sm ${msg.read ? 'text-slate-600' : 'text-slate-900'}`}>{msg.title}</h3>
                                {!msg.read && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                            </div>
                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{msg.content}</p>
                    </div>
                ))}
            </div>
        </SubViewLayout>
    );
}

// --- 4. Security Center ---
export const SecurityView: React.FC<SubViewProps> = ({ onBack }) => (
    <SubViewLayout title="安全中心" onBack={onBack}>
        <div className="p-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 relative">
                    <CheckCircle size={32} />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                         <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800">您的账户很安全</h3>
                <p className="text-slate-400 text-xs mt-1">上次登录: 刚刚 (IP: 192.168.1.1)</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                {[
                    { label: "登录密码", value: "已设置", icon: Lock, action: "修改" },
                    { label: "资金密码", value: "未设置", icon: Lock, warning: true, action: "去设置" },
                    { label: "手机绑定", value: "138****8888", icon: Smartphone, action: "修改" },
                    { label: "设备管理", value: "iPhone 14 Pro", icon: Eye, action: "查看" },
                ].map((item, i) => (
                    <button key={i} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <item.icon size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${item.warning ? 'text-amber-500' : 'text-slate-400'}`}>{item.value}</span>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="text-center text-[10px] text-slate-400">
                为了您的资金安全，建议定期修改登录密码
            </div>
        </div>
    </SubViewLayout>
);

// --- 5. Help Center ---
export const HelpView: React.FC<SubViewProps> = ({ onBack, onNavigate }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    
    const faqs = [
        { 
            q: "USDT 充值未到账怎么办？", 
            a: "请首先确认您的转账网络（TRC20/BEP20）与收款地址网络一致。区块确认通常需要3-5分钟。如果超过30分钟未到账，请准备好交易哈希（TXID）和截图，点击下方按钮联系人工客服查单。",
            cat: "充值" 
        },
        { 
            q: "如何参与首存红利活动？", 
            a: "新用户注册后，在首次充值前进入'优惠'页面点击申请'首存红利'。充值成功后，红利将自动发放至您的红利账户。请注意，红利需要完成规定的流水倍数后方可提款。",
            cat: "优惠" 
        },
        { 
            q: "体育投注规则说明", 
            a: "所有体育赛事投注结果以法定比赛时间（包括伤停补时）的赛果为准，加时赛和点球大战不计算在内（除非盘口有特别说明）。",
            cat: "规则" 
        },
        { 
            q: "如何成为 VIP 会员？", 
            a: "系统会根据您的累计有效投注额自动计算 VIP 等级。当成长值达到下一级门槛时，系统会在次日凌晨自动为您升级，并派发相应的晋级礼金。",
            cat: "会员" 
        },
        { 
            q: "提款限制说明", 
            a: "每日最低提款金额为 30 USDT。普通会员单日最高提款 20,000 USDT，VIP 会员额度更高。提款通常在 15 分钟内到账。",
            cat: "提款" 
        }
    ];

    return (
        <SubViewLayout title="帮助中心" onBack={onBack}>
            <div className="p-4">
                 <div className="mb-6">
                     <div className="relative">
                         <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                         <input type="text" placeholder="搜索问题，如：如何充值" className="w-full bg-white pl-12 pr-4 py-3 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 ring-amber-500/20 border border-slate-100" />
                     </div>
                 </div>
                 
                 <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                     <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                     热门问题
                 </h3>
                 <div className="space-y-3">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all">
                            <button 
                                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className={`text-sm font-bold transition-colors ${activeIndex === i ? 'text-amber-600' : 'text-slate-700'}`}>{item.q}</span>
                                    <span className="text-[10px] text-slate-400 bg-slate-50 w-fit px-1.5 py-0.5 rounded border border-slate-100">{item.cat}</span>
                                </div>
                                <div className={`w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-300 ${activeIndex === i ? 'rotate-180 bg-amber-100 text-amber-600' : 'text-slate-300'}`}>
                                    <ChevronDown size={16} />
                                </div>
                            </button>
                            {activeIndex === i && (
                                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2">
                                    <div className="h-px w-full bg-slate-50 mb-3"></div>
                                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-lg">
                                        {item.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
    
                <div className="mt-8 p-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl text-white text-center shadow-lg shadow-amber-500/20 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <p className="font-bold text-lg mb-1 relative z-10">没找到答案？</p>
                    <p className="text-xs text-white/80 mb-5 relative z-10">我们的 24/7 客服团队随时为您服务，解决您的所有疑问。</p>
                    <button 
                        onClick={() => {
                             if (onNavigate) {
                                 onNavigate(AppTab.CS);
                             } else {
                                 alert("正在为您连接人工客服...");
                             }
                        }}
                        className="bg-white text-amber-600 text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto relative z-10 w-full sm:w-auto"
                    >
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        联系人工客服
                    </button>
                </div>
            </div>
        </SubViewLayout>
    );
};
