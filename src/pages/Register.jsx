import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Key, Monitor, 
  Paintbrush, Crosshair, Sparkles, Zap, Shield, Loader2
} from 'lucide-react';

export default function CreateCharacterApp() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('hacker');
  const [playerTag, setPlayerTag] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const characterClasses = [
    { 
      id: 'hacker', 
      name: 'CYBER HACKER', 
      icon: <Monitor className="w-8 h-8" />, 
      desc: 'Master of the digital realm. Bonus to Logic & Coding.',
      stats: { int: 8, vit: 4, agi: 6 },
      color: '#5CE1E6', // Ghost Cyan
      glow: 'shadow-[0_0_15px_#5CE1E6]'
    },
    { 
      id: 'artist', 
      name: 'NEON ARTIST', 
      icon: <Paintbrush className="w-8 h-8" />, 
      desc: 'Wielder of visual aesthetics. Bonus to Creativity & Design.',
      stats: { int: 6, vit: 5, agi: 7 },
      color: '#FF5DA2', // Ghost Pink
      glow: 'shadow-[0_0_15px_#FF5DA2]'
    },
    { 
      id: 'hustler', 
      name: 'STREET SAMURAI', 
      icon: <Crosshair className="w-8 h-8" />, 
      desc: 'Relentless executor. Bonus to Grit & Communication.',
      stats: { int: 5, vit: 8, agi: 5 },
      color: '#FFD60A', // Pac Yellow
      glow: 'shadow-[0_0_15px_#FFD60A]'
    }
  ];

  const activeClass = characterClasses.find(c => c.id === selectedClass);

  const handleForgeCharacter = (e) => {
    e.preventDefault();
    if (!playerTag || !email || !password) {
      setErrorMessage('SYSTEM ERROR: ALL FIELDS REQUIRED TO FORGE.');
      return;
    }
    if (playerTag.length < 3) {
      setErrorMessage('SYSTEM ERROR: PLAYER TAG TOO SHORT.');
      return;
    }
    
    setErrorMessage('');
    setIsForging(true);
    
    // Simulate API Call for Registration
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Press+Start+2P&family=VT323&display=swap');

      :root {
        --bg-dark: #0D0D0D;
        --pac-yellow: #FFD60A;
        --ghost-pink: #FF5DA2;
        --ghost-cyan: #5CE1E6;
        --maze-blue: #00B4FF;
      }

      body { background-color: var(--bg-dark); color: white; overflow-x: hidden; }

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
          linear-gradient(to right, rgba(0, 180, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 180, 255, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
      }

      .maze-wall {
        border: 2px solid var(--maze-blue);
        box-shadow: 0 0 10px var(--maze-blue), inset 0 0 10px var(--maze-blue);
        background: rgba(0, 180, 255, 0.02);
      }

      .btn-comic { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .btn-comic:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0px 0px currentColor; }
      .btn-comic:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px currentColor; }
      
      .arcade-input {
        background: rgba(0,0,0,0.8);
        border: 2px solid #00B4FF;
        color: white;
      }
      .arcade-input:focus {
        outline: none;
        border-color: currentColor;
        box-shadow: 0 0 15px currentColor;
      }
      .arcade-input::placeholder { color: rgba(255, 255, 255, 0.3); }

      @keyframes hologramPulse {
        0% { opacity: 0.8; filter: hue-rotate(0deg); }
        50% { opacity: 1; filter: hue-rotate(15deg); }
        100% { opacity: 0.8; filter: hue-rotate(0deg); }
      }
      .animate-hologram { animation: hologramPulse 3s infinite alternate; }

      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      .scanline-effect::after {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; height: 10px;
        background: rgba(255,255,255,0.1);
        box-shadow: 0 0 20px rgba(255,255,255,0.2);
        animation: scanline 4s linear infinite;
        pointer-events: none;
      }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] crt pixel-grid relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden">
      <CustomStyles />
      
      {/* Background Ambience based on active class */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: `${activeClass.color}20` }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: `${activeClass.color}15` }}
      ></div>

      {/* Header & Back Navigation */}
      <div className="w-full max-w-6xl flex justify-between items-start mb-8 z-20">
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all">
          <ArrowLeft className="w-4 h-4" /> BACK TO LOGIN
        </button>
        <div className="text-right hidden md:block">
          <h2 className="font-pixel text-xl text-white drop-shadow-[0_0_10px_white]">CHARACTER CREATION</h2>
          <div className="font-vt text-lg text-[#00B4FF]">V.2.0.4 ONLINE</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 z-10 relative">
        
        {/* LEFT COLUMN: Hologram Preview */}
        <div className="lg:col-span-5 h-[500px] md:h-auto flex flex-col items-center justify-center relative maze-wall p-8 rounded-2xl bg-black/60 scanline-effect overflow-hidden">
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" style={{ backgroundColor: activeClass.color, color: activeClass.color }}></div>
            <span className="font-pixel text-[8px] tracking-widest text-white/50">LIVE PREVIEW</span>
          </div>

          {/* Avatar Hologram */}
          <div className="relative w-48 h-48 mb-8 animate-hologram transition-all duration-500 flex items-center justify-center">
            {/* Hexagon Outline */}
            <div className="absolute inset-0 border-4 rounded-full border-dashed animate-spin-slow opacity-30" style={{ borderColor: activeClass.color }}></div>
            <div className="absolute inset-4 border-2 rounded-full opacity-50" style={{ borderColor: activeClass.color, boxShadow: `0 0 30px ${activeClass.color}80` }}></div>
            
            {/* Avatar Icon */}
            <div className="w-24 h-24 text-white drop-shadow-[0_0_15px_currentColor]" style={{ color: activeClass.color }}>
              {activeClass.icon}
            </div>
          </div>

          <div className="text-center mb-8 w-full">
            <h3 className="font-pixel text-2xl text-white mb-2 uppercase break-all px-4" style={{ textShadow: `0 0 15px ${activeClass.color}` }}>
              {playerTag || 'PLAYER_ONE'}
            </h3>
            <div className="inline-block bg-white/10 px-4 py-1 rounded border" style={{ borderColor: activeClass.color, color: activeClass.color }}>
              <span className="font-vt text-xl">{activeClass.name}</span>
            </div>
          </div>

          {/* Base Stats Preview */}
          <div className="w-full max-w-xs space-y-4">
            <div>
              <div className="flex justify-between font-pixel text-[8px] text-white/70 mb-1">
                <span>INTELLECT</span><span>{activeClass.stats.int * 10}</span>
              </div>
              <div className="w-full h-2 bg-black border border-white/20 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${activeClass.stats.int * 10}%`, backgroundColor: activeClass.color, boxShadow: `0 0 10px ${activeClass.color}` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-pixel text-[8px] text-white/70 mb-1">
                <span>VITALITY</span><span>{activeClass.stats.vit * 10}</span>
              </div>
              <div className="w-full h-2 bg-black border border-white/20 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${activeClass.stats.vit * 10}%`, backgroundColor: activeClass.color, boxShadow: `0 0 10px ${activeClass.color}` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-pixel text-[8px] text-white/70 mb-1">
                <span>AGILITY</span><span>{activeClass.stats.agi * 10}</span>
              </div>
              <div className="w-full h-2 bg-black border border-white/20 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${activeClass.stats.agi * 10}%`, backgroundColor: activeClass.color, boxShadow: `0 0 10px ${activeClass.color}` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form & Selection */}
        <div className="lg:col-span-7 bg-black/80 maze-wall p-8 rounded-2xl flex flex-col justify-center">
          
          <h2 className="font-pixel text-xl text-[#00B4FF] mb-6 drop-shadow-[0_0_5px_#00B4FF]">1. SELECT CLASS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {characterClasses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClass(c.id)}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 ${
                  selectedClass === c.id 
                    ? `bg-black scale-105 ${c.glow}` 
                    : 'bg-black/50 border-[#00B4FF]/30 text-white/50 hover:border-[#00B4FF]'
                }`}
                style={{ borderColor: selectedClass === c.id ? c.color : undefined }}
              >
                <div className="mb-3" style={{ color: selectedClass === c.id ? c.color : 'currentColor' }}>
                  {c.icon}
                </div>
                <div className="font-pixel text-[8px] text-center mb-2" style={{ color: selectedClass === c.id ? c.color : 'white' }}>
                  {c.name}
                </div>
              </button>
            ))}
          </div>

          <p className="font-sans text-sm text-white/70 mb-8 border-l-4 pl-4 bg-white/5 p-3 rounded-r-lg italic transition-colors" style={{ borderColor: activeClass.color }}>
            "{activeClass.desc}"
          </p>

          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00B4FF]/50 to-transparent mb-8"></div>

          <h2 className="font-pixel text-xl text-[#00B4FF] mb-6 drop-shadow-[0_0_5px_#00B4FF]">2. PLAYER REGISTRY</h2>

          {errorMessage && (
            <div className="bg-red-500/20 border-2 border-[#FF5DA2] p-3 mb-6 rounded text-center shadow-[0_0_10px_#FF5DA2]">
              <span className="font-pixel text-[8px] text-[#FF5DA2] animate-pulse">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleForgeCharacter} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player Tag */}
              <div>
                <label className="block font-pixel text-[10px] text-[#5CE1E6] mb-2">PLAYER TAG (USERNAME)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input 
                    type="text" 
                    value={playerTag}
                    onChange={(e) => setPlayerTag(e.target.value)}
                    placeholder="Enter Alias..."
                    maxLength={15}
                    className="w-full arcade-input py-4 pl-12 pr-4 font-vt text-2xl rounded-lg transition-colors"
                    style={{ color: activeClass.color }}
                    disabled={isForging}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-pixel text-[10px] text-[#5CE1E6] mb-2">TRANSMISSION (EMAIL)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@arcade.com"
                    className="w-full arcade-input py-4 pl-12 pr-4 font-vt text-2xl rounded-lg transition-colors"
                    style={{ color: activeClass.color }}
                    disabled={isForging}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-pixel text-[10px] text-[#5CE1E6] mb-2">SECRET CIPHER (PASSWORD)</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full arcade-input py-4 pl-12 pr-4 font-vt text-2xl tracking-widest rounded-lg transition-colors"
                  style={{ color: activeClass.color }}
                  disabled={isForging}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isForging}
              className="w-full text-black font-pixel text-xs md:text-sm py-5 px-6 btn-comic flex items-center justify-center gap-3 border-2 border-white mt-8 disabled:opacity-70 disabled:transform-none disabled:shadow-none transition-colors"
              style={{ 
                backgroundColor: activeClass.color, 
                boxShadow: !isForging ? `6px 6px 0px 0px ${activeClass.color}` : 'none'
              }}
            >
              {isForging ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> FORGING CHARACTER...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> FORGE CHARACTER
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
