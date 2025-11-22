
import React, { useState, useEffect } from 'react';
import { X, Wifi, Battery, Maximize2, RotateCw, Loader2 } from 'lucide-react';
import { GameProvider } from '../types';

interface GameLaunchViewProps {
  game: GameProvider;
  balance: number;
  onClose: () => void;
}

const GameLaunchView: React.FC<GameLaunchViewProps> = ({ game, balance, onClose }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHud, setShowHud] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 500);
          return 100;
        }
        // Randomize progress speed
        return prev + Math.floor(Math.random() * 15) + 5; 
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Toggle HUD visibility on tap
  const handleContentClick = () => {
    if (isLoaded) {
      setShowHud(prev => !prev);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
      
      {/* Game HUD (Heads-Up Display) */}
      <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 transition-transform duration-300 ${showHud ? 'translate-y-0' : '-translate-y-20'}`}>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors active:scale-90">
             <X size={18} />
           </button>
           <div className="h-4 w-px bg-white/20 mx-1"></div>
           <span className="text-xs font-bold">{game.name}</span>
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex flex-col items-end">
              <span className="text-[9px] text-slate-400 uppercase font-bold">Balance</span>
              <span className="text-sm font-mono font-bold text-amber-400">{balance.toFixed(2)}</span>
           </div>
        </div>
      </div>

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
           <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl mb-8 border-2 border-amber-500/30 relative">
              <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <Loader2 size={32} className="animate-spin text-amber-500" />
              </div>
           </div>

           <h2 className="text-2xl font-black tracking-tight mb-2 italic">ENTERING GAME</h2>
           <p className="text-slate-400 text-xs tracking-widest uppercase mb-8 animate-pulse">Connecting to Secure Server...</p>

           <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
           </div>
           <span className="text-[10px] text-slate-500 mt-2 font-mono">{loadingProgress}%</span>
        </div>
      )}

      {/* Simulated Game Content (Iframe Placeholder) */}
      <div 
        className="flex-1 bg-slate-800 relative cursor-pointer" 
        onClick={handleContentClick}
      >
         {isLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-30 bg-cover bg-center grayscale" style={{ backgroundImage: `url(${game.image})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80"></div>
                
                <div className="relative z-10 text-center p-8 max-w-md border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl">
                    <h3 className="text-3xl font-bold mb-2 text-amber-500">{game.name}</h3>
                    <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                        此处为游戏内容展示区域。<br/>
                        在真实应用中，这里将加载游戏供应商提供的 WebGL 或 HTML5 游戏界面。
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left bg-white/5 p-4 rounded-xl mb-6">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase">Session ID</div>
                            <div className="font-mono text-xs">GX-{Math.floor(Math.random()*1000000)}</div>
                        </div>
                        <div>
                             <div className="text-[10px] text-slate-400 uppercase">RTP</div>
                             <div className="font-mono text-xs text-green-400">98.5%</div>
                        </div>
                    </div>

                    <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 mx-auto">
                       <RotateCw size={18} /> 开始游戏 / Spin
                    </button>
                </div>

                {/* Orientation Hint */}
                <div className="absolute bottom-8 flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest">
                    <Maximize2 size={14} /> Best Experience in Landscape
                </div>
            </div>
         ) : null}
         
         {/* Simulated System Status Bar (Mobile) */}
         <div className="absolute top-0 right-0 p-2 flex gap-2 text-[10px] text-white/40 z-0">
             <Wifi size={12} />
             <Battery size={12} />
         </div>
      </div>
    </div>
  );
};

export default GameLaunchView;
