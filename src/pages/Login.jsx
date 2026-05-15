import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, GitBranch, Mail, Key, TerminalSquare, 
  Gamepad2, Zap, CircleDashed, Loader2, LogIn, ChevronRight
} from 'lucide-react';

export default function InsertCoinApp() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('waiting'); // 'waiting' | 'inserting' | 'login' | 'authenticating'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInsertCoin = () => {
    setGameState('inserting');
    // Simulate coin drop and system bootup
    setTimeout(() => {
      setGameState('login');
    }, 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('SYSTEM ERROR: INCOMPLETE CREDENTIALS');
      return;
    }
    setErrorMessage('');
    setGameState('authenticating');
    
    // Simulate API Call
    setTimeout(() => {
      navigate('/');
    }, 2000);
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

      body { background-color: var(--bg-dark); color: white; overflow: hidden; }

      .font-pixel { font-family: 'Press Start 2P', cursive; line-height: 1.4; }
      .font-vt { font-family: 'VT323', monospace; }
      .font-sans { font-family: 'Inter', sans-serif; }

      /* CRT Scanline Effect */
      .crt::before {
        content: " ";
        display: block;
        position: absolute;
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

      /* Comic Buttons */
      .btn-comic { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .btn-comic:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0px 0px currentColor; }
      .btn-comic:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px currentColor; }
      
      .comic-shadow-yellow { box-shadow: 6px 6px 0px 0px var(--pac-yellow); border: 2px solid white; }
      .comic-shadow-pink { box-shadow: 6px 6px 0px 0px var(--ghost-pink); border: 2px solid white; }

      /* Animations */
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      .animate-blink { animation: blink 1.5s infinite; }
      .animate-blink-fast { animation: blink 0.5s infinite; }

      @keyframes coinDrop {
        0% { transform: translateY(-100vh) rotate(0deg); }
        60% { transform: translateY(20px) rotate(360deg); }
        80% { transform: translateY(-10px) rotate(380deg); }
        100% { transform: translateY(0) rotate(360deg); }
      }
      .animate-coin-drop { animation: coinDrop 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

      @keyframes glitch {
        0% { transform: translate(0) }
        20% { transform: translate(-2px, 2px) }
        40% { transform: translate(-2px, -2px) }
        60% { transform: translate(2px, 2px) }
        80% { transform: translate(2px, -2px) }
        100% { transform: translate(0) }
      }
      .hover-glitch:hover { animation: glitch 0.2s linear infinite; }

      /* Custom Input Styling */
      .arcade-input {
        background: rgba(0,0,0,0.8);
        border: 2px solid #00B4FF;
        color: #5CE1E6;
      }
      .arcade-input:focus {
        outline: none;
        border-color: #FFD60A;
        box-shadow: 0 0 15px rgba(255, 214, 10, 0.5);
      }
      .arcade-input::placeholder { color: rgba(0, 180, 255, 0.5); }
    `}} />
  );

  if (gameState === 'waiting' || gameState === 'inserting') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center crt pixel-grid relative cursor-pointer" onClick={handleInsertCoin}>
        <CustomStyles />
        
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/'); }}
            className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO BASE
          </button>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFD60A]/10 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00B4FF]/10 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>

        {gameState === 'inserting' && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-coin-drop">
            <div className="w-24 h-24 bg-[#FFD60A] rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_50px_#FFD60A]">
              <span className="font-vt text-4xl text-black font-bold">25¢</span>
            </div>
          </div>
        )}

        <div className={`text-center transition-opacity duration-500 ${gameState === 'inserting' ? 'opacity-0' : 'opacity-100'}`}>
          <Gamepad2 className="w-24 h-24 text-[#00B4FF] mx-auto mb-8 drop-shadow-[0_0_15px_#00B4FF]" />
          
          <h1 className="font-pixel text-4xl md:text-6xl text-[#FFD60A] mb-8 drop-shadow-[0_0_20px_#FFD60A] animate-blink">
            INSERT COIN
          </h1>
          
          <p className="font-vt text-2xl md:text-3xl text-[#5CE1E6] drop-shadow-[0_0_5px_#5CE1E6]">
            CLICK ANYWHERE TO START
          </p>
          
          <div className="mt-16 flex justify-center gap-4 text-[#FF5DA2] font-pixel text-xs">
            <span>CREDIT 0</span>
            <span>/</span>
            <span>FREE PLAY</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] crt pixel-grid relative flex flex-col items-center justify-center p-6">
      <CustomStyles />
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6A4CFF]/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF5DA2]/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navigation / Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => setGameState('waiting')}
          className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> ABORT MISSION
        </button>
      </div>

      {/* Main Terminal Container */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center z-10 relative">
        
        <div className="hidden md:flex flex-col gap-6">
          <div className="inline-block bg-[#FFD60A] text-black font-pixel text-[10px] py-2 px-4 transform -rotate-2 border-2 border-white comic-shadow-pink self-start">
            PLAYER IDENTIFICATION
          </div>
          
          <h1 className="font-pixel text-4xl leading-tight text-white drop-shadow-[0_0_10px_white]">
            WELCOME <br/>
            <span className="text-[#5CE1E6] drop-shadow-[0_0_15px_#5CE1E6]">BACK,</span><br/>
            PLAYER 1.
          </h1>
          
          <p className="font-vt text-2xl text-[#00B4FF] mb-8">
            The maze awaits. Authenticate to sync your progress and resume your quests.
          </p>

          <div className="maze-wall p-6 rounded-xl bg-black/60 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#FF5DA2]/10 blur-2xl"></div>
            <div className="flex items-center gap-4 mb-4">
              <TerminalSquare className="w-8 h-8 text-[#FF5DA2]" />
              <h3 className="font-pixel text-xs text-[#FF5DA2]">SYSTEM STATUS</h3>
            </div>
            <ul className="font-vt text-xl text-white/70 space-y-2">
              <li className="flex justify-between"><span>CORE SERVERS:</span> <span className="text-[#A3FF12]">ONLINE</span></li>
              <li className="flex justify-between"><span>XP MULTIPLIER:</span> <span className="text-[#FFD60A]">1.5x ACTIVE</span></li>
              <li className="flex justify-between"><span>GHOST PROXIMITY:</span> <span className="text-[#FF5DA2]">UNDETECTED</span></li>
            </ul>
          </div>
        </div>

        <div className="maze-wall p-8 rounded-2xl bg-black/80 shadow-[0_0_30px_rgba(0,180,255,0.2)]">
          <div className="flex items-center justify-between mb-8 border-b-2 border-[#00B4FF]/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#FF5DA2] animate-blink-fast rounded-full shadow-[0_0_10px_#FF5DA2]"></div>
              <span className="font-pixel text-xs text-white tracking-widest">AUTH_NODE</span>
            </div>
            <Zap className="w-6 h-6 text-[#FFD60A]" />
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-white text-black font-pixel text-[10px] py-4 px-4 comic-shadow-blue btn-comic flex items-center justify-center gap-2 hover-glitch border-2 border-black">
              <GitBranch className="w-5 h-5" /> GITHUB
            </button>
            <button className="flex-1 bg-white text-black font-pixel text-[10px] py-4 px-4 comic-shadow-pink btn-comic flex items-center justify-center gap-2 hover-glitch border-2 border-black">
              <span className="font-sans font-bold text-lg">G</span> GOOGLE
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] flex-1 bg-[#00B4FF]/30"></div>
            <span className="font-vt text-xl text-[#00B4FF]">OR MANUAL OVERRIDE</span>
            <div className="h-[2px] flex-1 bg-[#00B4FF]/30"></div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="bg-red-500/20 border-2 border-[#FF5DA2] p-3 mb-6 rounded text-center">
              <span className="font-pixel text-[8px] text-[#FF5DA2] animate-pulse">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-pixel text-[10px] text-[#5CE1E6] mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00B4FF]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player1@secondbrain.com"
                  className="w-full arcade-input py-4 pl-12 pr-4 font-vt text-xl rounded-lg"
                  disabled={gameState === 'authenticating'}
                />
              </div>
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-[#5CE1E6] mb-2 flex justify-between">
                <span>PASSWORD</span>
                <a href="#" className="text-[#FF5DA2] hover:underline">FORGOT?</a>
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00B4FF]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full arcade-input py-4 pl-12 pr-4 font-vt text-xl tracking-widest rounded-lg"
                  disabled={gameState === 'authenticating'}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={gameState === 'authenticating'}
              className="w-full bg-[#FFD60A] text-black font-pixel text-xs md:text-sm py-5 px-6 comic-shadow-pink btn-comic flex items-center justify-center gap-3 border-2 border-white mt-4 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
            >
              {gameState === 'authenticating' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> ESTABLISHING LINK...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> INITIALIZE
                </>
              )}
            </button>
          </form>

          <p className="text-center font-sans text-sm text-white/50 mt-8">
            New to the Arcade? <button onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-[#5CE1E6] hover:text-[#FFD60A] hover:underline transition-colors font-bold">Create Character</button>
          </p>
        </div>

      </div>
    </div>
  );
}
