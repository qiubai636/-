
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Users, Info, ChevronRight, Loader2 } from 'lucide-react';
import { GameProvider, CategoryId } from '../types';

interface CardsViewProps {
  onBack: () => void;
  onLaunchGame: (game: GameProvider) => void;
  balance: number;
}

// --- Game Data Configuration ---
const CARD_GAMES = [
  { 
      id: 'zhajinhua', 
      name: '炸金花', 
      code: '1744', 
      image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=800&auto=format&fit=crop',
      online: 1744,
      roomType: 'type_a' // Zha Jin Hua Config
  },
  { 
      id: 'blackjack', 
      name: '二十一点', 
      code: '1279', 
      image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1e?q=80&w=800&auto=format&fit=crop',
      online: 1279,
      roomType: 'type_b' // Blackjack Config
  },
  { 
      id: 'baccarat', 
      name: '百家乐', 
      code: '1207', 
      image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=800&auto=format&fit=crop',
      online: 1207,
      roomType: 'type_b' 
  }, 
  { 
      id: 'bull4', 
      name: '看四张抢庄牛牛', 
      code: '1236', 
      image: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?q=80&w=800&auto=format&fit=crop',
      online: 1236,
      roomType: 'type_a' 
  }, 
  { 
      id: 'bull100', 
      name: '万人牛牛', 
      code: '905', 
      // Updated Image: Casino Chips/Cards vibe
      image: 'https://images.unsplash.com/photo-1505428160878-8e349f4d301c?q=80&w=800&auto=format&fit=crop',
      online: 905,
      roomType: 'type_hall' 
  },
  { 
      id: 'dragontiger', 
      name: '龙虎斗', 
      code: '957', 
      // Updated Image: Dark gaming/cards vibe
      image: 'https://images.unsplash.com/photo-1633105308491-c295cb98124e?q=80&w=800&auto=format&fit=crop',
      online: 957,
      roomType: 'type_hall' 
  },
  { 
      id: 'fruit', 
      name: '万人水果机', 
      code: '932', 
      // Updated Image: Slot machine / Neon lights
      image: 'https://images.unsplash.com/photo-1550950020-06303305f852?q=80&w=800&auto=format&fit=crop',
      online: 932,
      roomType: 'type_hall' 
  },
  { 
      id: 'bulltb', 
      name: '通比牛牛', 
      code: '909', 
      // Updated Image: Playing cards fan
      image: 'https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?q=80&w=800&auto=format&fit=crop',
      online: 909,
      roomType: 'type_a' 
  },
];

// --- Room Configurations ---
const ROOM_CONFIGS: Record<string, any[]> = {
  type_a: [ // Based on Zha Jin Hua (Image 4)
    { name: '初级房', ante: 1, entry: 20, bg: 'bg-slate-700' },
    { name: '中级房', ante: 5, entry: 100, bg: 'bg-slate-600' },
    { name: '高级房', ante: 20, entry: 400, bg: 'bg-slate-500' },
    { name: '王者房', ante: 50, entry: 1000, bg: 'bg-amber-700' },
    { name: '至尊房', ante: 100, entry: 2000, bg: 'bg-amber-600' },
    { name: '尊享房', ante: 500, entry: 10000, bg: 'bg-amber-500' },
  ],
  type_b: [ // Based on Blackjack (Image 5)
    { name: '初级房', ante: 1, entry: 10, bg: 'bg-slate-700' },
    { name: '中级房', ante: 5, entry: 50, bg: 'bg-slate-600' },
    { name: '高级房', ante: 20, entry: 200, bg: 'bg-slate-500' },
    { name: '王者房', ante: 50, entry: 500, bg: 'bg-amber-700' },
    { name: '至尊房', ante: 100, entry: 1000, bg: 'bg-amber-600' },
    { name: '尊享房', ante: 500, entry: 5000, bg: 'bg-amber-500' },
  ],
  type_hall: [ // Simplified for Hall games
    { name: '平民厅', ante: 1, entry: 10, bg: 'bg-slate-600' },
    { name: '贵宾厅', ante: 10, entry: 100, bg: 'bg-amber-700' },
    { name: '富豪厅', ante: 100, entry: 1000, bg: 'bg-amber-500' },
  ]
};

const CardsView: React.FC<CardsViewProps> = ({ onBack, onLaunchGame, balance }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<typeof CARD_GAMES[0] | null>(null);

  // Simulate initial loading (Image 2)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleGameClick = (game: typeof CARD_GAMES[0]) => {
      setSelectedGame(game);
  };

  const handleRoomClick = (room: any) => {
      if (!selectedGame) return;
      
      const gamePayload: GameProvider = {
          id: `${selectedGame.id}_${room.level || 0}`,
          name: `${selectedGame.name} - ${room.name}`,
          category: CategoryId.CARDS,
          image: selectedGame.image,
          count: 1,
          rebate: '1.20%'
      };
      onLaunchGame(gamePayload);
  };

  // 1. Loading Screen
  if (isLoading) {
      return (
          <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
              <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-black italic text-xl text-amber-500">AYX</div>
              </div>
              <h2 className="text-xl font-bold mb-2">爱游戏棋牌</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Loading Resources...</p>
          </div>
      );
  }

  // 2. Room Selection Screen (Image 4 & 5)
  if (selectedGame) {
      const rooms = ROOM_CONFIGS[selectedGame.roomType] || ROOM_CONFIGS['type_hall'];
      
      return (
          <div className="fixed inset-0 z-40 bg-slate-900 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Background Girl Image & Overlay */}
              <div className="absolute inset-0 z-0">
                   {/* Using a high quality model image similar to the screenshots */}
                   <img 
                     src="https://images.unsplash.com/photo-1609357912478-2f4f5480d586?q=80&w=1000&auto=format&fit=crop" 
                     className="w-full h-full object-cover opacity-80"
                     alt="Background"
                   />
                   <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent"></div>
              </div>

              {/* Header */}
              <div className="relative z-10 px-4 py-3 pt-safe flex justify-between items-center">
                  <button onClick={() => setSelectedGame(null)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10">
                      <ChevronLeft size={24} />
                  </button>
                  
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <span className="text-amber-400 text-xs font-bold">$</span>
                      <span className="text-white font-mono font-bold text-sm">{balance.toFixed(2)}</span>
                  </div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col p-6">
                  <div className="mb-auto mt-8">
                       <h2 className="text-4xl font-black text-white drop-shadow-lg italic tracking-tighter mb-1">
                           {selectedGame.name}
                       </h2>
                       <p className="text-white/80 text-sm font-medium uppercase tracking-widest opacity-80">Choose Your Room</p>
                  </div>

                  {/* Room Grid */}
                  <div className="grid grid-cols-2 gap-3 pb-safe">
                      {rooms.map((room, idx) => (
                          <button 
                             key={idx}
                             onClick={() => handleRoomClick(room)}
                             className="relative overflow-hidden rounded-2xl border border-white/10 group active:scale-[0.98] transition-all"
                          >
                              {/* Card BG */}
                              <div className={`absolute inset-0 ${room.bg} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/30"></div>
                              
                              {/* Content */}
                              <div className="relative z-10 p-3 flex flex-col items-start h-24 justify-center">
                                  <div className="flex justify-between w-full mb-2 items-start">
                                      <span className="text-white font-black text-lg italic drop-shadow-md">{room.name}</span>
                                      {idx >= 3 && <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold shadow-sm">HOT</span>}
                                  </div>
                                  
                                  <div className="w-full space-y-1">
                                      <div className="flex justify-between items-center text-[10px] text-white/80 bg-black/20 px-2 py-1 rounded">
                                          <span>底注:</span>
                                          <span className="font-mono font-bold text-amber-300">{room.ante}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] text-white/80 bg-black/20 px-2 py-1 rounded">
                                          <span>准入:</span>
                                          <span className="font-mono font-bold text-white">{room.entry}</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Decorative Chips */}
                              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // 3. Lobby Screen (Image 3)
  return (
    <div className="fixed inset-0 z-30 bg-slate-900 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Lobby Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Header */}
        <div className="relative z-10 bg-slate-800/80 backdrop-blur-md border-b border-white/5 pt-safe px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-300 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-white font-bold text-lg">爱游戏棋牌</h2>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-amber-400 text-xs font-bold">$</span>
                <span className="text-white font-mono font-bold text-sm">{balance.toFixed(2)}</span>
            </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3">
            {/* Banner */}
            <div className="w-full h-32 rounded-2xl bg-gradient-to-r from-amber-600 to-red-600 mb-4 relative overflow-hidden shadow-lg flex items-center px-6">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div>
                    <h3 className="text-white font-black text-2xl italic mb-1">万人在线</h3>
                    <p className="text-amber-100 text-xs font-medium">极速匹配 | 公平公正 | 畅爽对决</p>
                </div>
            </div>

            {/* Categories Tabs (Visual only) */}
            <div className="flex gap-4 mb-4 overflow-x-auto hide-scroll px-1">
                {['全部游戏', '热门游戏', '牛牛系列', '炸金花'].map((tab, i) => (
                    <button key={i} className={`text-sm font-bold whitespace-nowrap pb-2 relative ${i === 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {tab}
                        {i === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-500 rounded-full"></div>}
                    </button>
                ))}
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 gap-3 pb-32">
                {CARD_GAMES.map((game) => (
                    <button 
                      key={game.id} 
                      onClick={() => handleGameClick(game)}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 border border-white/5 shadow-lg active:scale-[0.98] transition-transform"
                    >
                        <img src={game.image} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-1">
                                {game.name}
                            </h3>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <Users size={10} className="text-amber-500"/>
                                <span className="font-mono">{game.online}</span> 人在线
                            </div>
                        </div>

                        {/* ID Badge similar to screenshot */}
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-slate-400 font-mono border border-white/10">
                            ID:{game.code}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default CardsView;
