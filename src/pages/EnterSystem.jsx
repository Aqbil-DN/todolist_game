import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, ShieldCheck, Cpu, Network, Zap,
  Fingerprint, ArrowRight, Loader2, Gamepad2
} from 'lucide-react';

export default function EnterSystemApp() {
  const navigate = useNavigate();
  // Stages: 0 = Idle, 1 = Terminal Booting, 2 = Portal Expanding, 3 = Ready
  const [bootStage, setBootStage] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "[OK] INITIALIZING SECOND_BRAIN_OS V.2.0.4...",
    "[OK] MOUNTING VIRTUAL NEURAL NETWORK...",
    "[OK] ALLOCATING MEMORY FOR QUESTS_DB...",
    "[WARN] GHOST_PROTOCOL DETECTED. BYPASSING...",
    "[OK] FIREWALL BREACHED. CONNECTION SECURED.",
    "[OK] CALIBRATING FOCUS ARENA PHYSICS...",
    "[OK] SYNCING EXP MULTIPLIERS...",
    "[OK] LOADING ARCADE MAZE ASSETS...",
    "[OK] SYSTEM OVERRIDE COMPLETE. READY."
  ];

  const initiateBootSequence = () => {
    setBootStage(1);
    let currentLogIndex = 0;
    
    // Simulate terminal typing
    const logInterval = setInterval(() => {
      if (currentLogIndex < bootLogs.length) {
        // Fix: Capture the exact string value synchronously before the state update
        const currentLog = bootLogs[currentLogIndex];
        setDisplayedLogs(prev => [...prev, currentLog]);
        setProgress(((currentLogIndex + 1) / bootLogs.length) * 100);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setBootStage(2), 1000); // Transition to Portal
        setTimeout(() => setBootStage(3), 3500); // Transition to Ready
      }
    }, 400); // Speed of logs appearing
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
        --matrix-green: #A3FF12;
      }

      body { background-color: var(--bg-dark); color: white; overflow: hidden; }

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
          linear-gradient(to right, rgba(0, 180, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 180, 255, 0.05) 1px, transparent 1px);
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

      @keyframes glitch {
        0% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); }
        20% { clip-path: inset(80% 0 1% 0); transform: translate(2px, -2px); }
        40% { clip-path: inset(43% 0 1% 0); transform: translate(2px, 2px); }
        60% { clip-path: inset(25% 0 58% 0); transform: translate(-2px, -2px); }
        80% { clip-path: inset(5% 0 85% 0); transform: translate(2px, 2px); }
        100% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, -2px); }
      }
      .animate-glitch { position: relative; }
      .animate-glitch::before, .animate-glitch::after {
        content: attr(data-text);
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: var(--bg-dark);
      }
      .animate-glitch::before {
        left: 2px; text-shadow: -2px 0 var(--ghost-pink);
        animation: glitch 2s infinite linear alternate-reverse;
      }
      .animate-glitch::after {
        left: -2px; text-shadow: -2px 0 var(--ghost-cyan);
        animation: glitch 3s infinite linear alternate-reverse;
      }

      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      .scanline-effect::after {
        content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px;
        background: rgba(163, 255, 18, 0.5); /* Matrix Green */
        box-shadow: 0 0 20px rgba(163, 255, 18, 0.5);
        animation: scanline 3s linear infinite; pointer-events: none;
      }

      @keyframes portalExpand {
        0% { transform: scale(0); opacity: 0; border-width: 50px; }
        50% { opacity: 1; border-width: 10px; }
        100% { transform: scale(20); opacity: 0; border-width: 1px; }
      }
      .animate-portal { animation: portalExpand 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] crt pixel-grid relative flex flex-col items-center justify-center p-6 overflow-hidden">
      <CustomStyles />
      
      {/* Background Ambience */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] pointer-events-none transition-all duration-1000 ${bootStage >= 2 ? 'bg-[#5CE1E6]/30' : 'bg-[#00B4FF]/5'}`}></div>

      {/* STAGE 0: Idle / Initiation */}
      {bootStage === 0 && (
        <div className="z-10 flex flex-col items-center animate-pulse">
          <div className="w-24 h-24 mb-8 bg-black border-4 border-[#FFD60A] rounded-2xl flex items-center justify-center shadow-[0_0_30px_#FFD60A]">
            <Fingerprint className="w-12 h-12 text-[#FFD60A]" />
          </div>
          <h1 className="font-pixel text-2xl md:text-4xl text-[#FFD60A] mb-4 text-center drop-shadow-[0_0_10px_#FFD60A]">
            SYSTEM STANDBY
          </h1>
          <p className="font-vt text-2xl text-white/50 mb-12 tracking-widest">AWAITING USER DIRECTIVE</p>
          
          <button 
            onClick={initiateBootSequence}
            className="bg-transparent text-[#5CE1E6] font-pixel text-sm py-5 px-8 border-2 border-[#5CE1E6] hover:bg-[#5CE1E6]/10 hover:shadow-[0_0_20px_#5CE1E6] transition-all flex items-center gap-4 group"
          >
            INITIATE BOOT SEQUENCE 
            <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
          </button>
        </div>
      )}

      {/* STAGE 1: Terminal Booting */}
      {bootStage === 1 && (
        <div className="w-full max-w-4xl h-[60vh] bg-black/90 border-2 border-[#A3FF12] rounded-lg p-6 shadow-[0_0_30px_rgba(163,255,18,0.2)] flex flex-col scanline-effect z-10 relative overflow-hidden">
          <div className="flex items-center gap-3 border-b-2 border-[#A3FF12]/30 pb-4 mb-4">
            <Terminal className="w-6 h-6 text-[#A3FF12]" />
            <span className="font-pixel text-[10px] text-[#A3FF12]">SB_KERNEL_TERMINAL</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 font-vt text-2xl tracking-wider text-[#A3FF12] drop-shadow-[0_0_2px_#A3FF12]">
            {displayedLogs.map((log, index) => (
              <div key={index} className="flex gap-4">
                <span className="opacity-50">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                {/* Fix: Safely check if log exists and is a string before calling includes */}
                <span className={log && typeof log === 'string' && log.includes('[WARN]') ? 'text-[#FFD60A]' : ''}>
                  {String(log)}
                </span>
              </div>
            ))}
            <div className="animate-pulse">_</div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-[#A3FF12]/30">
            <div className="flex justify-between font-pixel text-[8px] text-[#A3FF12] mb-2">
              <span>BOOT PROGRESS</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-black border border-[#A3FF12]/50 rounded-full overflow-hidden">
              <div className="h-full bg-[#A3FF12] transition-all duration-300 shadow-[0_0_10px_#A3FF12]" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: Portal Expanding / Core Rendering */}
      {bootStage === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          {/* Expanding rings */}
          <div className="absolute border-[#5CE1E6] rounded-full animate-portal" style={{ borderColor: '#5CE1E6' }}></div>
          <div className="absolute border-[#FF5DA2] rounded-full animate-portal" style={{ animationDelay: '0.2s', borderColor: '#FF5DA2' }}></div>
          <div className="absolute border-[#FFD60A] rounded-full animate-portal" style={{ animationDelay: '0.4s', borderColor: '#FFD60A' }}></div>
          
          <div className="z-10 flex flex-col items-center">
            <Cpu className="w-24 h-24 text-white mb-8 animate-pulse drop-shadow-[0_0_30px_white]" />
            <h1 className="font-pixel text-4xl text-white drop-shadow-[0_0_10px_white] animate-glitch" data-text="LINK ESTABLISHED">
              LINK ESTABLISHED
            </h1>
          </div>
        </div>
      )}

      {/* STAGE 3: Final Ready Screen */}
      {bootStage === 3 && (
        <div className="z-10 flex flex-col items-center animate-pop text-center max-w-2xl">
          <div className="w-32 h-32 mb-10 maze-wall rounded-full flex items-center justify-center bg-black/50 shadow-[0_0_50px_#00B4FF]">
            <Gamepad2 className="w-16 h-16 text-[#5CE1E6] drop-shadow-[0_0_10px_#5CE1E6] animate-bounce" />
          </div>
          
          <h1 className="font-pixel text-4xl md:text-5xl text-white mb-6 drop-shadow-[0_0_10px_white]">
            WELCOME TO <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5CE1E6] to-[#FF5DA2] drop-shadow-[0_0_10px_rgba(92,225,230,0.5)]">
              THE ARCADE
            </span>
          </h1>
          
          <p className="font-vt text-3xl text-[#00B4FF] mb-12 px-4">
            Your neuro-link is secure. The maze is ready. Let's conquer today's quests.
          </p>

          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#FFD60A] text-black font-pixel text-sm md:text-lg py-6 px-12 comic-shadow-pink btn-comic flex items-center gap-4 group border-2 border-white"
          >
            ENTER DASHBOARD
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}
      
    </div>
  );
}
