
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Search, PlayCircle, 
  Timer, AlignLeft, Share2, MoreHorizontal, 
  ChevronDown, Trophy, Gift, ChevronRight,
  ListChecks, Filter, AlertCircle, CheckCircle, TrendingUp, TrendingDown, MessageSquare
} from 'lucide-react';

interface SportsViewProps {
    onBack?: () => void;
    balance?: number;
    onUpdateBalance?: (amount: number) => void;
}

// --- Data Types for API Integration ---
export type SportType = 'football' | 'basketball' | 'tennis' | 'esports' | 'vr';

interface MarketOption {
  label: string;
  odd: number;
  locked?: boolean;
}

interface Market {
  id: string;
  name: string;
  type: 'grid' | 'list' | 'row'; 
  options: MarketOption[];
}

export interface Match {
  id: string;
  sportType: SportType;
  league: string;
  home: { name: string; logo: string; score: number; red: number; yellow: number; corner: number };
  away: { name: string; logo: string; score: number; red: number; yellow: number; corner: number };
  time: string; 
  period: string; 
  hasLiveVideo: boolean;
  hasAnimation: boolean;
  mainOdds: { h: number; d: number; a: number }; 
  markets: Market[];
}

// --- Mock API Data ---
const MOCK_API_DATA: Match[] = [
  {
    id: 'm1',
    sportType: 'football',
    league: '欧洲冠军联赛',
    home: { name: '皇家马德里', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png', score: 1, red: 0, yellow: 1, corner: 4 },
    away: { name: '拜仁慕尼黑', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png', score: 1, red: 0, yellow: 2, corner: 3 },
    time: '65:20',
    period: '下半场',
    hasLiveVideo: true,
    hasAnimation: true,
    mainOdds: { h: 2.80, d: 3.10, a: 2.55 },
    markets: [
      {
        id: 'match_winner',
        name: '全场独赢 (输赢)',
        type: 'row',
        options: [
          { label: '主胜 (皇马)', odd: 2.80 },
          { label: '平局', odd: 3.10 },
          { label: '客胜 (拜仁)', odd: 2.55 }
        ]
      },
      {
        id: 'correct_score',
        name: '波胆 (正确比分)',
        type: 'grid',
        options: [
          { label: '1:1', odd: 3.50 }, { label: '2:1', odd: 6.50 }, { label: '1:2', odd: 7.00 },
          { label: '2:2', odd: 11.0 }, { label: '3:1', odd: 15.0 }, { label: '1:3', odd: 18.0 },
          { label: '3:2', odd: 26.0 }, { label: '2:3', odd: 28.0 }, { label: '3:3', odd: 51.0 },
          { label: '其他', odd: 8.50 }
        ]
      },
      {
        id: 'total_goals',
        name: '全场总进球数',
        type: 'grid',
        options: [
            { label: '2 球', odd: 2.80 },
            { label: '3 球', odd: 2.50 },
            { label: '4 球', odd: 3.80 },
            { label: '5 球+', odd: 5.50 }
        ]
      }
    ]
  },
  {
    id: 'm2',
    sportType: 'football',
    league: '英格兰超级联赛',
    home: { name: '曼彻斯特城', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png', score: 2, red: 0, yellow: 0, corner: 6 },
    away: { name: '阿森纳', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png', score: 0, red: 0, yellow: 1, corner: 1 },
    time: '32:10',
    period: '上半场',
    hasLiveVideo: true,
    hasAnimation: true,
    mainOdds: { h: 1.25, d: 5.50, a: 11.00 },
    markets: [
        {
            id: 'match_winner',
            name: '全场独赢',
            type: 'row',
            options: [
              { label: '主胜', odd: 1.25 },
              { label: '平局', odd: 5.50 },
              { label: '客胜', odd: 11.00 }
            ]
        },
        {
            id: 'correct_score',
            name: '波胆 (正确比分)',
            type: 'grid',
            options: [
                { label: '2:0', odd: 3.20 }, { label: '2:1', odd: 8.50 }, { label: '3:0', odd: 5.50 },
                { label: '3:1', odd: 10.0 }, { label: '4:0', odd: 12.0 }, { label: '2:2', odd: 15.0 },
                { label: '0:0', odd: 101.0, locked: true }, { label: '0:1', odd: 41.0 }, { label: '1:1', odd: 21.0 },
                { label: '其他', odd: 4.50 }
            ]
        },
        {
            id: 'total_goals',
            name: '全场总进球数',
            type: 'grid',
            options: [
                { label: '2 球', odd: 4.50 },
                { label: '3 球', odd: 2.80 },
                { label: '4 球+', odd: 2.10 }
            ]
        }
    ]
  },
  {
    id: 'm3',
    sportType: 'football',
    league: '意大利甲级联赛',
    home: { name: 'AC米兰', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/1200px-Logo_of_AC_Milan.svg.png', score: 0, red: 0, yellow: 0, corner: 2 },
    away: { name: '国际米兰', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png', score: 0, red: 0, yellow: 0, corner: 1 },
    time: '00:00',
    period: '未开赛',
    hasLiveVideo: false,
    hasAnimation: false,
    mainOdds: { h: 2.60, d: 3.30, a: 2.60 },
    markets: [
        {
            id: 'match_winner',
            name: '全场独赢',
            type: 'row',
            options: [
              { label: '主胜', odd: 2.60 },
              { label: '平局', odd: 3.30 },
              { label: '客胜', odd: 2.60 }
            ]
        },
        {
            id: 'correct_score',
            name: '波胆',
            type: 'grid',
            options: [
                { label: '1:0', odd: 8.00 }, { label: '0:0', odd: 9.50 }, { label: '0:1', odd: 8.00 },
                { label: '2:0', odd: 13.0 }, { label: '1:1', odd: 6.50 }, { label: '0:2', odd: 13.0 },
                { label: '2:1', odd: 9.00 }, { label: '2:2', odd: 15.0 }, { label: '1:2', odd: 9.00 },
                { label: '其他', odd: 5.00 }
            ]
        }
    ]
  }
];

// --- Betting Modal Component (Extracted) ---
interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  selection: { label: string; odd: number } | null;
  balance: number;
  onConfirm: (amount: number) => void;
}

const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose, match, selection, balance, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen, selection]);

  if (!isOpen || !selection) return null;

  const handleConfirm = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError("请输入有效的投注金额");
      return;
    }
    if (val > balance) {
      setError("账户余额不足，请先充值");
      return;
    }
    
    setIsSuccess(true);
    onConfirm(val);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div 
         className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-20 shadow-2xl animate-in slide-in-from-bottom mx-auto overflow-y-auto max-h-[85vh] flex flex-col"
         onClick={e => e.stopPropagation()}
      >
          {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 flex-1">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-1">投注成功</h3>
                  <p className="text-slate-500 text-sm">注单确认中...</p>
              </div>
          ) : (
              <>
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <span className="font-bold text-slate-800 text-lg">确认投注</span>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><ChevronDown size={20}/></button>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 shrink-0">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-base text-slate-800 font-bold">{selection.label}</span>
                        <span className="text-2xl text-amber-600 font-mono font-black">@{selection.odd.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                        {match ? match.league : '快速模式'} - {match ? `${match.home.name} vs ${match.away.name}` : '滚球盘'}
                    </div>
                </div>

                <div className="mb-4 shrink-0">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500 font-bold">投注金额</span>
                        <span className="text-slate-400">余额: <span className="text-slate-800 font-bold">{balance.toFixed(2)}</span></span>
                    </div>
                    <div className="relative">
                        <input 
                          type="text"
                          inputMode="decimal" 
                          value={amount}
                          onChange={(e) => { 
                              // Only allow numeric input (with one decimal point)
                              const val = e.target.value;
                              if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                                  setAmount(val); 
                                  setError(null); 
                              }
                          }}
                          placeholder="请输入金额"
                          className={`w-full bg-slate-100 border rounded-xl py-3 pl-4 pr-12 font-bold text-lg text-slate-800 focus:bg-white outline-none transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-amber-500'}`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">USDT</span>
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1 animate-in slide-in-from-left-2"><AlertCircle size={12}/> {error}</p>}
                </div>

                <div className="grid grid-cols-4 gap-2 mb-6 shrink-0">
                        {[100, 500, 1000, 5000].map(amt => (
                            <button 
                              key={amt} 
                              onClick={() => { setAmount(amt.toString()); setError(null); }}
                              className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${amount === amt.toString() ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'}`}
                            >
                                {amt}
                            </button>
                        ))}
                </div>
                
                <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                     <span className="text-xs text-slate-400">预计返还</span>
                     <span className="text-sm font-bold text-green-600">
                         {amount && !isNaN(parseFloat(amount)) ? (parseFloat(amount) * selection.odd).toFixed(2) : '0.00'} USDT
                     </span>
                </div>

                <button 
                    onClick={handleConfirm}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-transform mb-2 shrink-0"
                >
                    确认投注
                </button>
              </>
          )}
      </div>
    </div>
  );
};

// --- Main Component ---

const SportsView: React.FC<SportsViewProps> = ({ onBack, balance = 0, onUpdateBalance }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  // Store ID instead of object to prevent stale state during detailed view
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('betting'); 
  const [activeSport, setActiveSport] = useState<SportType>('football');
  const [isLoading, setIsLoading] = useState(true);
  
  const [placingBet, setPlacingBet] = useState<{label: string, odd: number} | null>(null);

  // Derived active match object
  const activeMatch = matches.find(m => m.id === activeMatchId) || null;

  // --- 1. Data Fetching Simulation ---
  useEffect(() => {
     const fetchMatches = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        const filtered = MOCK_API_DATA.filter(m => m.sportType === 'football'); 
        setMatches(filtered);
        setIsLoading(false);
     };

     fetchMatches();
  }, [activeSport]);

  // --- 2. Real-time Timer & Odds Calculation ---
  useEffect(() => {
     const timer = setInterval(() => {
        setMatches(prev => prev.map(m => {
            let newTime = m.time;
            if (m.time.includes(':') && m.period !== '未开赛') {
                const [min, sec] = m.time.split(':').map(Number);
                let newSec = sec + 1;
                let newMin = min;
                if (newSec >= 60) {
                    newSec = 0;
                    newMin += 1;
                }
                newTime = `${newMin}:${newSec.toString().padStart(2, '0')}`;
            }
            
            // Smart Odds Adjustment logic
            const scoreDiff = m.home.score - m.away.score;
            const minutes = parseInt(m.time.split(':')[0]) || 0;
            
            let hTrend = 0; // Home trend
            let dTrend = 0; // Draw trend
            let aTrend = 0; // Away trend
            const trendBase = 0.01;

            if (scoreDiff > 0) {
                // Home winning: Home odds drop, Away odds rise significantly
                hTrend = -trendBase;
                aTrend = trendBase * 2;
                dTrend = trendBase * 0.5;
            } else if (scoreDiff < 0) {
                // Away winning
                aTrend = -trendBase;
                hTrend = trendBase * 2;
                dTrend = trendBase * 0.5;
            } else {
                // Draw
                if (minutes > 70) dTrend = -trendBase; // Late game draw likely, odds drop
                else dTrend = 0;
            }

            const adjustOdd = (currentOdd: number, trend: number = 0) => {
                if (currentOdd <= 1.01 || currentOdd >= 100 || !currentOdd) return currentOdd;
                const randomFlux = (Math.random() - 0.5) * 0.02;
                // Apply trend + random fluctuation
                const newOdd = currentOdd + randomFlux + trend;
                return Math.max(1.01, parseFloat(newOdd.toFixed(2)));
            };

            const newMainOdds = {
                h: adjustOdd(m.mainOdds.h, hTrend),
                d: adjustOdd(m.mainOdds.d, dTrend),
                a: adjustOdd(m.mainOdds.a, aTrend)
            };

            const newMarkets = m.markets.map(market => ({
                ...market,
                options: market.options.map(opt => {
                    if (opt.locked) return opt;
                    
                    // Simple heuristic for Correct Score based on match state would be complex,
                    // so we apply a general small flux for now, but could be expanded.
                    return {
                        ...opt,
                        odd: adjustOdd(opt.odd, 0) // Just random flux for detailed markets for now
                    };
                })
            }));

            return { 
                ...m, 
                time: newTime, 
                mainOdds: newMainOdds,
                markets: newMarkets
            };
        }));
     }, 1000);
     return () => clearInterval(timer);
  }, []);

  const getSportCount = (type: SportType) => MOCK_API_DATA.filter(m => m.sportType === type).length;

  const handleBetConfirm = (amount: number) => {
    if (onUpdateBalance) {
        onUpdateBalance(-amount);
    }
  };

  const openBetModal = (option: {label: string, odd: number}, e: React.MouseEvent) => {
      e.stopPropagation();
      setPlacingBet(option);
  };

  const renderDetailHeader = (match: Match) => (
    <div className="relative w-full h-64 bg-slate-900 shrink-0 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      
      <div className="relative z-10 flex justify-between items-center px-4 py-3 pt-safe text-white">
        <button onClick={() => setActiveMatchId(null)} className="w-8 h-8 flex items-center justify-center -ml-2 hover:bg-white/10 rounded-full transition-colors">
           <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-sm truncate max-w-[200px]">{match.league}</span>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
           <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center mt-4">
         <div className="text-xs text-amber-400 font-bold mb-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-amber-500/30 animate-pulse">
            {match.period === '未开赛' ? '即将开始' : `${match.period} ${match.time}`}
         </div>

         <div className="flex justify-between items-center w-full px-10">
            <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full p-2 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-bold text-sm text-center max-w-[100px] truncate">{match.home.name}</span>
            </div>

            <div className="text-5xl font-black text-white tracking-widest flex items-center gap-4 mx-4 drop-shadow-2xl">
                <span>{match.home.score}</span>
                <span className="text-slate-400 text-3xl">:</span>
                <span>{match.away.score}</span>
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full p-2 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-bold text-sm text-center max-w-[100px] truncate">{match.away.name}</span>
            </div>
         </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
         {match.hasLiveVideo && (
             <button className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform">
                 <PlayCircle size={14} /> 视频直播
             </button>
         )}
         {match.hasAnimation && (
             <button className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white flex items-center gap-1.5 hover:bg-white/10 transition-colors">
                 <AlignLeft size={14} /> 动画直播
             </button>
         )}
      </div>
    </div>
  );

  const renderMarkets = (match: Match) => (
    <div className="p-3 space-y-3 pb-32">
        {match.markets.length > 0 ? match.markets.map((market) => (
            <div key={market.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                        <span className="font-bold text-sm text-slate-800">{market.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-green-600 flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                           <TrendingUp size={10} /> 实时滚球
                        </span>
                        <ChevronDown size={16} className="text-slate-400" />
                    </div>
                </div>
                
                <div className={`p-3 ${market.type === 'grid' ? 'grid grid-cols-3 gap-2' : 'flex flex-col gap-2'}`}>
                    {market.options.map((option, idx) => (
                        <button 
                          key={idx} 
                          disabled={option.locked}
                          onClick={(e) => openBetModal(option, e)}
                          className={`
                            relative flex items-center justify-between px-3 py-3 rounded-lg border text-xs transition-all active:scale-[0.98]
                            ${market.type === 'grid' ? 'flex-col justify-center gap-1.5 text-center min-h-[70px]' : ''}
                            ${option.locked ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' : 'bg-white border-slate-100 hover:border-amber-500 hover:shadow-sm hover:bg-amber-50/30'}
                          `}
                        >
                            <span className={`font-medium ${option.locked ? 'text-slate-300' : 'text-slate-600'}`}>{option.label}</span>
                            
                            {!option.locked && (
                                <span className={`font-bold font-mono ${market.type === 'grid' ? 'text-base text-amber-600' : 'text-sm text-amber-600'} transition-colors duration-300`}>
                                    @{option.odd > 0 ? option.odd.toFixed(2) : '-'}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        )) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ListChecks size={32} className="mb-2 opacity-30"/>
                <p className="text-xs">暂无盘口数据</p>
            </div>
        )}
    </div>
  );

  // A. Detail View (derived match)
  if (activeMatch) {
      return (
        <div className="flex flex-col h-full bg-slate-100 absolute inset-0 z-40 animate-in slide-in-from-right duration-300">
            {renderDetailHeader(activeMatch)}
            
            <div className="bg-white border-b border-slate-100 sticky top-0 z-20 flex justify-around">
                {[
                    { id: 'betting', label: '基础投注' },
                    { id: 'stats', label: '赛况' },
                    { id: 'lineups', label: '首发' },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 text-sm font-bold relative transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-amber-600' : 'text-slate-500'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-500 rounded-full"></div>}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto">
                 {activeTab === 'betting' ? renderMarkets(activeMatch) : (
                     <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                         <Trophy size={32} className="mb-2 opacity-50" />
                         <span className="text-xs">暂无{activeTab === 'stats' ? '赛况' : '首发'}信息</span>
                     </div>
                 )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 px-4 flex items-center gap-3 z-30 pb-safe">
                 <div className="flex-1 bg-slate-100 rounded-full h-10 flex items-center px-4 text-xs text-slate-400 gap-2">
                    <MessageSquare size={14}/>
                    直播间热聊中...
                 </div>
                 <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-amber-50 hover:text-amber-500 transition-colors">
                     <Share2 size={18} />
                 </button>
                 <button className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform">
                     <Gift size={18} />
                 </button>
            </div>

            {/* Modal defined outside but rendered here */}
            <BettingModal 
                isOpen={!!placingBet}
                onClose={() => setPlacingBet(null)}
                match={activeMatch}
                selection={placingBet}
                balance={balance}
                onConfirm={handleBetConfirm}
            />
        </div>
      );
  }

  // B. List View (Lobby)
  return (
    <div className="flex flex-col h-full bg-slate-100 absolute inset-0 z-30 animate-in slide-in-from-right duration-300">
       <div className="bg-white pt-safe pb-2 px-4 border-b border-slate-100 sticky top-0 z-20">
           <div className="flex items-center justify-between mb-3 mt-2">
               <div className="flex items-center gap-2">
                   {onBack && (
                       <button onClick={onBack} className="p-1 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
                           <ChevronLeft size={24} />
                       </button>
                   )}
                   <div className="flex items-center gap-4 overflow-x-auto hide-scroll text-sm font-bold text-slate-500">
                       <button className="text-amber-600 whitespace-nowrap relative">
                           今日赛事
                           <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>
                       </button>
                   </div>
               </div>
               <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0 border border-slate-100">
                   <Search size={12}/> 搜索赛事
               </div>
           </div>
       </div>

       <div className="bg-white p-2 mb-2 grid grid-cols-5 gap-2 text-center shadow-sm">
           {[
               { id: 'football', name: '足球', icon: '⚽' },
           ].map((cat) => {
               const count = getSportCount(cat.id as SportType);
               return (
                   <button 
                     key={cat.id} 
                     onClick={() => setActiveSport(cat.id as SportType)}
                     className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${activeSport === cat.id ? 'bg-amber-50 border-amber-200 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}
                   >
                       <span className="text-xl mb-1">{cat.icon}</span>
                       <span className={`text-xs font-bold ${activeSport === cat.id ? 'text-amber-800' : 'text-slate-500'}`}>{cat.name}</span>
                       <span className="text-[9px] text-slate-400">{count}</span>
                   </button>
               )
           })}
       </div>

       <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-32">
           <div className="flex items-center justify-between px-1">
               <h3 className="font-bold text-amber-600 flex items-center gap-2 text-sm">
                   <Timer size={14} className={isLoading ? 'animate-spin' : 'animate-pulse'}/> 
                   {isLoading ? '加载中...' : '进行中'}
               </h3>
           </div>

           {!isLoading && matches.length === 0 && (
               <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                   <Filter size={32} className="mb-2 opacity-30"/>
                   <p className="text-xs">当前类别暂无比赛</p>
               </div>
           )}

           {matches.map((match) => (
               <div key={match.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform" onClick={() => setActiveMatchId(match.id)}>
                   <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                           <div className="w-0.5 h-3 bg-amber-500 rounded-full"></div>
                           {match.league}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] text-slate-400">
                           {match.hasLiveVideo && <span className="flex items-center gap-1 text-amber-600"><PlayCircle size={10}/> 直播</span>}
                           <ChevronRight size={12}/>
                       </div>
                   </div>

                   <div className="flex items-center justify-between mb-4">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <img src={match.home.logo} className="w-5 h-5 object-contain" alt=""/>
                                        <span className="text-sm font-bold text-slate-800">{match.home.name}</span>
                                        {match.home.red > 0 && <span className="bg-red-500 text-white text-[9px] px-1 rounded">{match.home.red}</span>}
                                    </div>
                                    <span className="font-bold text-amber-600">{match.home.score}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <img src={match.away.logo} className="w-5 h-5 object-contain" alt=""/>
                                        <span className="text-sm font-bold text-slate-800">{match.away.name}</span>
                                    </div>
                                    <span className="font-bold text-amber-600">{match.away.score}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-16 flex flex-col items-end justify-center pl-2 border-l border-slate-100 ml-2">
                             <span className="text-[10px] text-amber-600 font-bold">{match.period}</span>
                             <span className="text-xs font-mono text-slate-500">{match.time}</span>
                        </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                       <div className="bg-slate-50 rounded-lg p-2 flex flex-col items-center justify-center border border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition-colors" onClick={(e) => openBetModal({label: '主胜', odd: match.mainOdds.h}, e)}>
                           <span className="text-[10px] text-slate-400 mb-0.5">主胜</span>
                           <span className="text-xs font-bold text-slate-800">{match.mainOdds.h > 0 ? match.mainOdds.h.toFixed(2) : '-'}</span>
                       </div>
                       <div className="bg-slate-50 rounded-lg p-2 flex flex-col items-center justify-center border border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition-colors" onClick={(e) => openBetModal({label: '平局', odd: match.mainOdds.d}, e)}>
                           <span className="text-[10px] text-slate-400 mb-0.5">平局</span>
                           <span className="text-xs font-bold text-slate-800">{match.mainOdds.d > 0 ? match.mainOdds.d.toFixed(2) : '-'}</span>
                       </div>
                       <div className="bg-slate-50 rounded-lg p-2 flex flex-col items-center justify-center border border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition-colors" onClick={(e) => openBetModal({label: '客胜', odd: match.mainOdds.a}, e)}>
                           <span className="text-[10px] text-slate-400 mb-0.5">客胜</span>
                           <span className="text-xs font-bold text-slate-800">{match.mainOdds.a > 0 ? match.mainOdds.a.toFixed(2) : '-'}</span>
                       </div>
                   </div>
                   
                   <div className="mt-3 flex justify-center text-[10px] text-slate-400">
                       点击查看 波胆(比分) 和 进球数 投注
                   </div>
               </div>
           ))}
       </div>

       {/* Modal defined outside but rendered here */}
       <BettingModal 
            isOpen={!!placingBet}
            onClose={() => setPlacingBet(null)}
            match={null} // List view has no specific active match context usually, but we clicked a specific odd
            selection={placingBet}
            balance={balance}
            onConfirm={handleBetConfirm}
       />
    </div>
  );
};

export default SportsView;
