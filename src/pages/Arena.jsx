import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Swords, Play, Pause, 
  ShieldAlert, XOctagon, Trophy, Shield, Zap, Clock, Target
} from 'lucide-react';

export default function ArenaBattleApp() {
  const navigate = useNavigate();
  // States: 'select' | 'battling' | 'victory' | 'defeat'
  const [battleState, setBattleState] = useState('select');
  const [selectedBoss, setSelectedBoss] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const [damageEffect, setDamageEffect] = useState(false);
  const [deflectEffect, setDeflectEffect] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  // Pre-defined Quests / Bosses
  const arenaBosses = [
    {
      id: 'bug_swarm',
      name: 'GLITCH SWARM',
      task: 'Quick Code / Bug Fix',
      desc: 'A cluster of syntax errors trying to crash your flow.',
      emoji: '👾',
      color: '#A3FF12', // Matrix Green
      durationMinutes: 15,
      bgGlow: 'bg-[#A3FF12]/20'
    },
    {
      id: 'inbox_hydra',
      name: 'INBOX HYDRA',
      task: 'Clear Emails & Admin',
      desc: 'Reply to one, and two more take its place.',
      emoji: '🐙',
      color: '#00B4FF', // Maze Blue
      durationMinutes: 25,
      bgGlow: 'bg-[#00B4FF]/20'
    },
    {
      id: 'lazy_golem',
      name: 'SLOTH GOLEM',
      task: 'Physical Chores / Clean Up',
      desc: 'A heavy beast that makes your bed feel like a magnet.',
      emoji: '🗿',
      color: '#FFD60A', // Pac Yellow
      durationMinutes: 30,
      bgGlow: 'bg-[#FFD60A]/20'
    },
    {
      id: 'procrastination_dragon',
      name: 'PROCRASTO-WYRM',
      task: 'Deep Study / Heavy Work',
      desc: 'An ancient dragon that feeds on doom-scrolling.',
      emoji: '🐉',
      color: '#FF5DA2', // Ghost Pink
      durationMinutes: 45,
      bgGlow: 'bg-[#FF5DA2]/20'
    }
  ];

  const handleSelectBoss = (boss) => {
    setSelectedBoss(boss);
    const timeInSeconds = boss.durationMinutes * 60;
    setTimeLeft(timeInSeconds);
    setTotalTime(timeInSeconds);
    setDistractionCount(0);
    setBattleState('battling');
    setIsPaused(false);
  };

  useEffect(() => {
    let timer;
    if (battleState === 'battling' && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev % 15 === 0) triggerDamage(); // Visual effect every 15s
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && battleState === 'battling') {
      setBattleState('victory');
    }
    return () => clearInterval(timer);
  }, [battleState, isPaused, timeLeft]);

  const triggerDamage = () => {
    setDamageEffect(true);
    setTimeout(() => setDamageEffect(false), 300);
  };

  const handleDeflect = () => {
    setDeflectEffect(true);
    setDistractionCount(prev => prev + 1);
    setTimeout(() => setDeflectEffect(false), 500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const bossHealthPercent = Math.max(0, (timeLeft / totalTime) * 100);

  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Press+Start+2P&family=VT323&display=swap');

      :root {
        --bg-dark: #050505;
      }

      body { background-color: var(--bg-dark); color: white; overflow-x: hidden; margin: 0; }

      .font-pixel { font-family: 'Press Start 2P', cursive; line-height: 1.4; }
      .font-vt { font-family: 'VT323', monospace; }
      .font-sans { font-family: 'Inter', sans-serif; }

      .crt::before {
        content: " ";
        display: block;
        position: fixed;
        top: 0; left: 0; bottom: 0; right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        z-index: 100;
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
      }

      .pixel-grid {
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 40px 40px;
      }

      .vignette {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        box-shadow: 0 0 200px rgba(0,0,0,0.9) inset;
        pointer-events: none; z-index: 10;
      }

      /* Boss Animations */
      @keyframes bossFloat {
        0% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-20px) scale(1.05); }
        100% { transform: translateY(0px) scale(1); }
      }
      .animate-boss { animation: bossFloat 3s ease-in-out infinite; }

      @keyframes shakeDamage {
        0%, 100% { transform: translateX(0) scale(1); filter: brightness(1); }
        20% { transform: translateX(-10px) scale(0.9); filter: brightness(2) hue-rotate(90deg); }
        40% { transform: translateX(10px) scale(1.1); filter: brightness(2) hue-rotate(90deg); }
        60% { transform: translateX(-10px) scale(0.9); filter: brightness(2) hue-rotate(90deg); }
        80% { transform: translateX(10px) scale(1.1); filter: brightness(2) hue-rotate(90deg); }
      }
      .boss-damaged { animation: shakeDamage 0.4s; }

      @keyframes shieldPulse {
        0% { transform: scale(1); opacity: 0; }
        50% { transform: scale(1.5); opacity: 0.8; box-shadow: 0 0 50px #5CE1E6; }
        100% { transform: scale(2); opacity: 0; }
      }
      .shield-effect {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 150px; height: 150px; border: 8px solid #5CE1E6; border-radius: 50%;
        animation: shieldPulse 0.5s ease-out forwards; pointer-events: none;
      }

      .btn-comic { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .btn-comic:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0px 0px currentColor; }
      .btn-comic:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px currentColor; }

      .boss-health-bar {
        clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
      }
      
      @keyframes popIn {
        0% { transform: scale(0.9) translateY(20px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      .animate-pop { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#050505] crt pixel-grid relative flex flex-col justify-center items-center selection:bg-[#FFD60A] selection:text-black pt-20 pb-10">
      <CustomStyles />
      <div className="vignette"></div>

      {/* BACK BUTTON */}
      <button onClick={() => navigate('/dashboard')} className="absolute top-8 left-8 flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all z-50">
        <ArrowLeft className="w-4 h-4" /> ABORT
      </button>

      {/* STATE 1: SELECT BOSS LOBBY */}
      {battleState === 'select' && (
        <div className="w-full max-w-5xl px-6 relative z-20 animate-pop">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#FFD60A] text-black font-pixel text-[10px] px-3 py-1 mb-6 border-2 border-black transform -rotate-2">
              STAGE SELECT
            </div>
            <h1 className="font-pixel text-3xl md:text-5xl text-white drop-shadow-[0_0_10px_white] mb-4">
              FOCUS ARENA
            </h1>
            <p className="font-vt text-2xl text-[#00B4FF] tracking-widest drop-shadow-[0_0_5px_#00B4FF]">
              CHOOSE YOUR TARGET. START THE TIMER.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {arenaBosses.map((boss, index) => (
              <div 
                key={boss.id}
                onClick={() => handleSelectBoss(boss)}
                className="bg-black/60 border-2 rounded-xl p-6 cursor-pointer hover:-translate-y-2 transition-all group relative overflow-hidden flex items-center gap-6"
                style={{ borderColor: boss.color, boxShadow: `0 8px 30px rgba(0,0,0,0.5), inset 0 0 20px ${boss.color}10` }}
              >
                {/* Hover Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: boss.color }}></div>
                
                {/* Boss Emoji Avatar */}
                <div className="w-24 h-24 shrink-0 bg-[#111] border-2 rounded-xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ borderColor: boss.color, textShadow: `0 0 20px ${boss.color}` }}>
                  {boss.emoji}
                </div>

                {/* Boss Info */}
                <div className="flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-pixel text-sm md:text-base leading-tight uppercase" style={{ color: boss.color, textShadow: `0 0 5px ${boss.color}` }}>
                      {boss.name}
                    </h3>
                  </div>
                  <div className="font-sans text-xs text-white/90 font-bold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 opacity-50" /> {boss.task}
                  </div>
                  <p className="font-vt text-lg text-white/50 leading-snug mb-4 line-clamp-2">
                    "{boss.desc}"
                  </p>
                  
                  {/* Timer Badge */}
                  <div className="inline-flex items-center gap-2 bg-black border border-white/20 px-3 py-1 rounded font-vt text-xl text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Clock className="w-4 h-4" /> {boss.durationMinutes} MIN
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATE 2: BATTLING */}
      {battleState === 'battling' && selectedBoss && (
        <div className="w-full flex-1 flex flex-col relative z-20 animate-pop">
          {/* Dynamic Background Glow based on Boss Color */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] pointer-events-none opacity-30 ${selectedBoss.bgGlow}`}></div>

          {/* Top HUD */}
          <div className="w-full max-w-4xl mx-auto p-6 md:p-10 flex justify-between items-start z-30">
            {/* Player Stats */}
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-black border-2 border-[#5CE1E6] rounded flex items-center justify-center shadow-[0_0_15px_#5CE1E6]">
                <span className="font-pixel text-2xl">😎</span>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-[#5CE1E6] mb-2 drop-shadow-[0_0_5px_#5CE1E6]">PLAYER ONE</div>
                {/* Visual Timer Progress Bar */}
                <div className="w-32 md:w-48 h-3 bg-black border border-white/30 rounded-sm overflow-hidden">
                  <div className="h-full bg-[#5CE1E6] shadow-[0_0_10px_#5CE1E6] transition-all duration-1000" style={{ width: `${100 - bossHealthPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Warning / Status */}
            <div className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded text-red-500 font-pixel text-[8px] animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> DANGER ZONE
            </div>
          </div>

          {/* Main Battle Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-20 mt-[-5vh]">
            
            {/* The Boss */}
            <div className="relative mb-10 flex flex-col items-center">
              {deflectEffect && <div className="shield-effect"></div>}
              
              <div 
                className={`text-[120px] md:text-[180px] leading-none drop-shadow-[0_0_50px_currentColor] transition-all ${damageEffect ? 'boss-damaged' : 'animate-boss'}`}
                style={{ color: selectedBoss.color, textShadow: `0 0 40px ${selectedBoss.color}` }}
              >
                {selectedBoss.emoji}
              </div>
              
              {/* Boss Info Panel */}
              <div className="mt-8 text-center bg-black/60 p-4 border border-white/10 rounded-xl backdrop-blur-md relative overflow-hidden max-w-sm md:max-w-lg">
                <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: selectedBoss.color }}></div>
                <h2 className="font-pixel text-xl md:text-2xl mb-2 uppercase tracking-widest" style={{ color: selectedBoss.color, textShadow: `0 0 10px ${selectedBoss.color}` }}>
                  {selectedBoss.name}
                </h2>
                <p className="font-vt text-lg text-white/70 italic">"{selectedBoss.task}"</p>
              </div>
            </div>

            {/* Boss Health Bar */}
            <div className="w-full max-w-xl px-6 mb-12">
              <div className="flex justify-between font-pixel text-[10px] text-white mb-2">
                <span>BOSS HP</span>
                <span className="text-red-500">{Math.ceil(bossHealthPercent)}%</span>
              </div>
              <div className="w-full h-8 bg-[#111] border-2 border-white/20 p-1 boss-health-bar relative">
                {/* Grid overlay for health bar */}
                <div className="absolute inset-0 pixel-grid opacity-50 z-10 pointer-events-none"></div>
                <div 
                  className="h-full boss-health-bar transition-all duration-1000 bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_20px_red]"
                  style={{ width: `${bossHealthPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Huge Timer Display */}
            <div className={`font-vt text-[100px] md:text-[160px] leading-none tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all ${isPaused ? 'text-white/30 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex gap-6 z-30 mt-10">
              {/* Play/Pause */}
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="bg-white text-black w-16 h-16 rounded-full flex items-center justify-center border-4 border-black shadow-[0_0_20px_white] hover:scale-110 transition-transform"
                title={isPaused ? "Resume Battle" : "Pause Battle"}
              >
                {isPaused ? <Play className="w-8 h-8 ml-1" /> : <Pause className="w-8 h-8" />}
              </button>
              
              {/* Block Distraction Action */}
              <button 
                onClick={handleDeflect}
                className="bg-[#00B4FF] text-black px-6 rounded-full font-pixel text-[10px] border-4 border-black comic-shadow-pink hover:-translate-y-1 transition-all flex items-center gap-2 group"
              >
                <Shield className="w-5 h-5 group-hover:animate-ping" /> BLOCK DISTRACTION
              </button>

              {/* Flee Action */}
              <button 
                onClick={() => setBattleState('defeat')}
                className="bg-transparent text-red-500 w-16 h-16 rounded-full flex items-center justify-center border-4 border-red-500 hover:bg-red-500 hover:text-black transition-colors shadow-[0_0_15px_red]"
                title="Flee Battle"
              >
                <XOctagon className="w-6 h-6" />
              </button>
            </div>
            
            {distractionCount > 0 && (
              <div className="font-vt text-xl text-[#00B4FF] mt-6 bg-black/50 px-4 py-1 rounded-full border border-[#00B4FF]/30">
                Attacks Deflected: {distractionCount}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STATE 3: POST-BATTLE (VICTORY / DEFEAT) */}
      {(battleState === 'victory' || battleState === 'defeat') && selectedBoss && (
        <div className="w-full max-w-2xl relative z-20 animate-pop text-center px-6">
          <div className="w-48 h-48 mx-auto mb-8 relative">
            <div className={`absolute inset-0 rounded-full blur-[50px] ${battleState === 'victory' ? 'bg-[#FFD60A]' : 'bg-red-600'}`}></div>
            <div className={`relative z-10 w-full h-full bg-black rounded-full border-8 flex items-center justify-center text-7xl ${battleState === 'victory' ? 'border-[#FFD60A] text-[#FFD60A]' : 'border-red-600 text-red-600'}`}>
              {battleState === 'victory' ? <Trophy className="w-24 h-24" /> : '💀'}
            </div>
          </div>
          
          <h1 className={`font-pixel text-4xl md:text-6xl mb-4 drop-shadow-[0_0_20px_currentColor] ${battleState === 'victory' ? 'text-[#FFD60A]' : 'text-red-500'}`}>
            {battleState === 'victory' ? 'BOSS DEFEATED!' : 'YOU DIED (FLED)'}
          </h1>
          
          <p className="font-vt text-3xl text-white/70 mb-12">
            {battleState === 'victory' 
              ? `You conquered "${selectedBoss.name}" and completed your focus session.` 
              : `You succumbed to the distractions of "${selectedBoss.name}".`
            }
          </p>

          {/* Reward Summary */}
          {battleState === 'victory' && (
            <div className="bg-black/50 border-2 border-[#FFD60A] p-6 rounded-xl inline-block mb-12 relative overflow-hidden shadow-[0_0_30px_rgba(255,214,10,0.2)]">
              <div className="absolute inset-0 pixel-grid opacity-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div>
                  <div className="font-pixel text-[10px] text-[#FFD60A] mb-2">REWARDS GAINED</div>
                  <div className="font-vt text-5xl text-white">+{selectedBoss.durationMinutes * 20} XP</div>
                </div>
                <div className="hidden md:block w-[2px] h-16 bg-white/20"></div>
                <div>
                  <div className="font-pixel text-[10px] text-[#5CE1E6] mb-2">DEFLECT BONUS</div>
                  <div className="font-vt text-5xl text-white">+{distractionCount * 10} XP</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button 
              onClick={() => setBattleState('select')} 
              className="bg-transparent text-white font-pixel text-xs py-5 px-8 border-2 border-white hover:bg-white hover:text-black transition-colors"
            >
              BACK TO STAGE SELECT
            </button>
            <button 
              onClick={() => handleSelectBoss(selectedBoss)} 
              className={`text-black font-pixel text-xs py-5 px-8 border-2 border-white comic-shadow-pink btn-comic ${battleState === 'victory' ? 'bg-[#FFD60A]' : 'bg-[#FF5DA2]'}`}
            >
              REMATCH BOSS
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
