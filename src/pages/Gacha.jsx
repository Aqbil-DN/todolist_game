import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Database, TerminalSquare,
  Cpu, Zap, Fingerprint, Star, RefreshCcw, Coins
} from 'lucide-react';

import img1 from '../assets/card_pull/01.png';
import img2 from '../assets/card_pull/02.png';
import img3 from '../assets/card_pull/03.png';
import img4 from '../assets/card_pull/04.png';
import img5 from '../assets/card_pull/05.png';
import img6 from '../assets/card_pull/06.png';
import img7 from '../assets/card_pull/07.png';
import img8 from '../assets/card_pull/08.png';
import img9 from '../assets/card_pull/09.png';
import img10 from '../assets/card_pull/10.png';
import img11 from '../assets/card_pull/11.png';
import img12 from '../assets/card_pull/12.png';
import img13 from '../assets/card_pull/13.png';
import img14 from '../assets/card_pull/14.png';
import img15 from '../assets/card_pull/15.png';

const heroImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15
];

export default function GachaApp() {
  const navigate = useNavigate();
  const [gachaState, setGachaState] = useState('idle'); // 'idle' | 'hacking' | 'revealing' | 'result'
  const [pulledHeroes, setPulledHeroes] = useState([]);
  const [decryptLogs, setDecryptLogs] = useState([]);

  // Data 15 Neural Net Idols untuk Gacha Pool
  const gachaPool = [
    { id: '001', name: 'OMEGA', title: 'THE SOVEREIGN AI', rarity: 'LEGENDARY', color: '#FF003C', glow: '#FFD60A', emoji: '👑', img: heroImages[0] },
    { id: '002', name: 'KAIRO', title: 'THE CHRONO-WITCH', rarity: 'EPIC', color: '#9D4EDD', glow: '#FF5DA2', emoji: '⏳', img: heroImages[1] },
    { id: '003', name: 'CYPHER', title: 'THE GHOST NETRUNNER', rarity: 'EPIC', color: '#00B4FF', glow: '#9D4EDD', emoji: '🥷', img: heroImages[2] },
    { id: '004', name: 'GIA', title: 'THE ENERGY ALCHEMIST', rarity: 'EPIC', color: '#FF5DA2', glow: '#A3FF12', emoji: '⚗️', img: heroImages[3] },
    { id: '005', name: 'REX', title: 'THE CYBER-SAMURAI', rarity: 'EPIC', color: '#A3FF12', glow: '#00B4FF', emoji: '⚔️', img: heroImages[4] },
    { id: '006', name: 'PULSE', title: 'THE DATA DRUMMER', rarity: 'RARE', color: '#00B4FF', glow: '#00B4FF', emoji: '🥁', img: heroImages[5] },
    { id: '007', name: 'VECTOR', title: 'THE GRAFFITI HACKER', rarity: 'RARE', color: '#FFD60A', glow: '#FF5DA2', emoji: '🎨', img: heroImages[6] },
    { id: '008', name: 'SHADE', title: 'THE COFFEE TECHNO-MAGE', rarity: 'RARE', color: '#FF9F1C', glow: '#FFD60A', emoji: '☕', img: heroImages[7] },
    { id: '009', name: 'NOVA', title: 'THE STAR-CHART PILOT', rarity: 'RARE', color: '#A3FF12', glow: '#A3FF12', emoji: '🚀', img: heroImages[8] },
    { id: '010', name: 'BLADE', title: 'THE INBOX-SLAYER', rarity: 'RARE', color: '#9D4EDD', glow: '#9D4EDD', emoji: '🗡️', img: heroImages[9] },
    { id: '011', name: 'REZ', title: 'THE GLITCH-GEISHA', rarity: 'RARE', color: '#FF003C', glow: '#00B4FF', emoji: '🎎', img: heroImages[10] },
    { id: '012', name: 'DRIFT', title: 'THE SYNTHWAVE RACER', rarity: 'RARE', color: '#FF5DA2', glow: '#FFD60A', emoji: '🏎️', img: heroImages[11] },
    { id: '013', name: 'ECHO', title: 'THE SOUND-TRACKER', rarity: 'RARE', color: '#5CE1E6', glow: '#5CE1E6', emoji: '🎧', img: heroImages[12] },
    { id: '014', name: 'LOOP', title: 'THE HABIT-BOT', rarity: 'RARE', color: '#A3FF12', glow: '#FF5DA2', emoji: '🤖', img: heroImages[13] },
    { id: '015', name: 'SPARK', title: 'THE IDEA-COLLECTOR', rarity: 'RARE', color: '#FFD60A', glow: '#00B4FF', emoji: '💡', img: heroImages[14] },
  ];

  // Gacha Logic & Rates
  const performPull = (times) => {
    setGachaState('hacking');
    setDecryptLogs([]);
    setPulledHeroes([]);

    const newPulls = [];
    for (let i = 0; i < times; i++) {
      const rand = Math.random() * 100;
      let selectedRarity = 'RARE';

      // Rates: 5% Legendary, 25% Epic, 70% Rare
      if (rand <= 5) selectedRarity = 'LEGENDARY';
      else if (rand <= 30) selectedRarity = 'EPIC';

      const availableHeroes = gachaPool.filter(h => h.rarity === selectedRarity);
      const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];

      // Generate unique key for mapping just in case of duplicates
      newPulls.push({ ...randomHero, pullId: `pull_${Date.now()}_${i}` });
    }

    // Sequence Animation
    const logs = [
      "> INITIATING NEURAL SUMMON PROTOCOL...",
      "> BYPASSING MAINFRAME SECURITY...",
      "> DECRYPTING LORE DATA_PACKETS...",
      "> ISOLATING ANOMALIES...",
      "> UPLINK ESTABLISHED. MATERIALIZING ENTITIES..."
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      setDecryptLogs(prev => [...prev, logs[logIndex]]);
      logIndex++;
      if (logIndex === logs.length) {
        clearInterval(logInterval);
        setTimeout(() => {
          setPulledHeroes(newPulls);
          setGachaState('result');
        }, 1500);
      }
    }, 600);
  };

  const getRarityBadgeStyle = (rarity) => {
    switch (rarity) {
      case 'LEGENDARY': return { bg: '#FF003C', text: '#FFD60A', shadow: '0 0 10px #FF003C' };
      case 'EPIC': return { bg: '#9D4EDD', text: '#FFF', shadow: '0 0 10px #9D4EDD' };
      case 'RARE': return { bg: '#00B4FF', text: '#FFF', shadow: 'none' };
      default: return { bg: '#333', text: '#FFF', shadow: 'none' };
    }
  };

  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{
      __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Press+Start+2P&family=VT323&display=swap');

      :root { --bg-dark: #050505; }
      body { background-color: var(--bg-dark); color: white; overflow-x: hidden; margin: 0; }

      .font-pixel { font-family: 'Press Start 2P', cursive; line-height: 1.4; }
      .font-vt { font-family: 'VT323', monospace; }
      .font-sans { font-family: 'Inter', sans-serif; }

      /* Cyberpunk CRT & Grid */
      .crt::before {
        content: " ";
        display: block; position: fixed; top: 0; left: 0; bottom: 0; right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        z-index: 100; background-size: 100% 2px, 3px 100%; pointer-events: none;
      }
      .pixel-grid {
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 40px 40px;
      }

      .btn-comic { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .btn-comic:hover { transform: translate(-4px, -4px); box-shadow: 6px 6px 0px 0px currentColor; }
      .btn-comic:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px currentColor; }

      /* Animations */
      @keyframes popInScale {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-pop-scale { animation: popInScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

      @keyframes glitchShake {
        0% { transform: translate(0); }
        20% { transform: translate(-5px, 5px); }
        40% { transform: translate(-5px, -5px); }
        60% { transform: translate(5px, 5px); }
        80% { transform: translate(5px, -5px); }
        100% { transform: translate(0); }
      }
      .hacking-shake { animation: glitchShake 0.3s infinite; }

      /* Legendary Holographic Foil Effect */
      .legendary-foil::before {
        content: ""; position: absolute; inset: 0;
        background: linear-gradient(125deg, transparent 20%, rgba(255,214,10,0.4) 40%, rgba(255,0,60,0.4) 60%, transparent 80%);
        background-size: 200% 200%;
        animation: foilShift 3s linear infinite;
        pointer-events: none; z-index: 10;
        mix-blend-mode: color-dodge;
      }
      @keyframes foilShift { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

      /* Portal Spin */
      @keyframes spinPortal {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .portal-bg {
        position: absolute; top: 50%; left: 50%;
        width: 100vw; height: 100vw;
        background: conic-gradient(from 0deg, transparent, #FF5DA2, #00B4FF, #A3FF12, transparent);
        opacity: 0.1; mix-blend-mode: screen;
        animation: spinPortal 4s linear infinite;
        pointer-events: none;
      }
      
      /* Pixel Animation Overlay */
      @keyframes pixelFlicker {
        0% { opacity: 0.5; background-position: 0 0, 4px 4px; }
        50% { opacity: 0.8; background-position: 4px 0, 0 4px; }
        100% { opacity: 0.5; background-position: 0 0, 4px 4px; }
      }
      .pixel-anim-overlay {
        background-image: 
          linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.15) 75%, rgba(255,255,255,0.15)),
          linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.15) 75%, rgba(255,255,255,0.15));
        background-size: 8px 8px;
        background-position: 0 0, 4px 4px;
        animation: pixelFlicker 0.3s steps(2) infinite;
        mix-blend-mode: overlay;
      }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#050505] crt pixel-grid relative flex flex-col selection:bg-[#FFD60A] selection:text-black overflow-hidden">
      <CustomStyles />

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b-2 border-white/10 pt-8 pb-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button onClick={() => navigate('/hero')} className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all self-start">
              <ArrowLeft className="w-4 h-4" /> BACK TO COLLECTION
            </button>
            <h1 className="font-pixel text-xl md:text-2xl text-white drop-shadow-[0_0_10px_white] flex items-center gap-4 mt-2">
              <Database className="w-6 h-6 md:w-8 md:h-8 text-[#FFD60A]" />
              GACHA TERMINAL
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6 bg-black border-2 border-white/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#FFD60A]" />
              <span className="font-vt text-2xl text-[#FFD60A]">12,450 XP</span>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="font-pixel text-[8px] text-white/50 text-right">
              PULL RATES:<br />
              <span className="text-[#FF003C]">L:5%</span> | <span className="text-[#9D4EDD]">E:25%</span> | <span className="text-[#00B4FF]">R:70%</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex items-center justify-center relative z-10 w-full">

        {/* ==================================================== */}
        {/* STATE 0: IDLE (Banners & Buttons)                    */}
        {/* ==================================================== */}
        {gachaState === 'idle' && (
          <div className="max-w-4xl w-full px-6 flex flex-col items-center animate-pop">

            <div className="w-full relative rounded-2xl border-4 border-[#00B4FF] overflow-hidden mb-12 shadow-[0_0_50px_rgba(0,180,255,0.2)] bg-black">
              {/* Banner Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#000] via-[#FF5DA2]/20 to-[#00B4FF]/20"></div>

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="font-pixel text-[10px] text-[#A3FF12] mb-4 tracking-widest flex items-center justify-center md:justify-start gap-2">
                    <Sparkles className="w-4 h-4" /> NEW ARRIVALS
                  </div>
                  <h2 className="font-pixel text-3xl md:text-5xl text-white mb-2 leading-tight drop-shadow-[0_0_10px_white]">
                    NEURAL NET <br /><span className="text-[#FF5DA2]">IDOLS</span>
                  </h2>
                  <p className="font-vt text-2xl text-[#00B4FF] tracking-widest mt-4">SUMMON YOUR DIGITAL COMPANIONS</p>
                </div>

                {/* Hologram Showcase */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-dashed border-[#FFD60A]/50 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-4 border-2 border-[#FF003C]/30 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 rounded-full"></div>
                  <img src={heroImages[0]} alt="Showcase" className="w-full h-full object-cover rounded-full opacity-80" style={{ filter: 'drop-shadow(0 0 20px #FFD60A)' }} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <button
                onClick={() => performPull(1)}
                className="bg-transparent text-[#00B4FF] font-pixel text-sm md:text-base py-5 px-8 rounded-xl border-4 border-[#00B4FF] hover:bg-[#00B4FF]/10 hover:shadow-[0_0_20px_#00B4FF] transition-all flex items-center justify-center gap-3 w-full md:w-auto"
              >
                <Fingerprint className="w-6 h-6" /> DECRYPT 1x
                <span className="text-[#FFD60A] ml-2 text-xs">(-100 XP)</span>
              </button>

              <button
                onClick={() => performPull(10)}
                className="bg-gradient-to-r from-[#FF5DA2] to-[#9D4EDD] text-white font-pixel text-sm md:text-base py-5 px-8 rounded-xl border-4 border-white comic-shadow-yellow btn-comic flex items-center justify-center gap-3 w-full md:w-auto shadow-[0_0_20px_rgba(255,93,162,0.5)]"
                style={{ color: '#000', backgroundColor: '#FFD60A' }} // Override for comic style
              >
                <Cpu className="w-6 h-6" /> DECRYPT 10x
                <span className="text-white ml-2 text-xs bg-black px-2 py-1 rounded">(-1000 XP)</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STATE 1: HACKING / SUMMONING ANIMATION               */}
        {/* ==================================================== */}
        {gachaState === 'hacking' && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center hacking-shake">
            <div className="portal-bg"></div>

            <div className="relative z-10 w-full max-w-2xl px-6">
              <div className="flex items-center gap-4 border-b-4 border-[#A3FF12] pb-4 mb-8">
                <TerminalSquare className="w-10 h-10 text-[#A3FF12]" />
                <h2 className="font-pixel text-2xl text-[#A3FF12] drop-shadow-[0_0_10px_#A3FF12]">SYSTEM OVERRIDE</h2>
              </div>

              <div className="font-vt text-3xl md:text-4xl text-[#A3FF12] space-y-4 tracking-widest drop-shadow-[0_0_5px_#A3FF12]">
                {decryptLogs.map((log, i) => (
                  <div key={i} className="animate-pop">{log}</div>
                ))}
                {decryptLogs.length < 5 && <div className="animate-pulse">_</div>}
              </div>

              {/* Progress Bar Fake */}
              <div className="mt-12 h-2 w-full bg-[#111] border-2 border-[#A3FF12]/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A3FF12] shadow-[0_0_20px_#A3FF12] transition-all ease-linear"
                  style={{ width: `${(decryptLogs.length / 5) * 100}%`, transitionDuration: '0.6s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STATE 2: REVEAL RESULT                               */}
        {/* ==================================================== */}
        {gachaState === 'result' && (
          <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center z-10">

            <div className="text-center mb-12 animate-pop">
              <h2 className="font-pixel text-3xl text-white drop-shadow-[0_0_10px_white] mb-4">DECRYPTION COMPLETE</h2>
              <p className="font-vt text-2xl text-[#00B4FF]">NEW ENTITIES DETECTED IN ROSTER.</p>
            </div>

            {/* Grid of Results */}
            <div className={`grid gap-6 justify-center w-full ${pulledHeroes.length === 1
              ? 'grid-cols-1 max-w-sm'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
              }`}>
              {pulledHeroes.map((hero, index) => {
                const badge = getRarityBadgeStyle(hero.rarity);
                const isLegendary = hero.rarity === 'LEGENDARY';

                return (
                  <div
                    key={hero.pullId}
                    className={`relative rounded-xl overflow-hidden animate-pop-scale`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {/* Invisible static image to dictate the exact aspect ratio and size of the container */}
                    <img src={hero.img} alt="" className="w-full h-auto opacity-0 pointer-events-none invisible block" />

                    <div className={`absolute inset-0 border-4 rounded-xl overflow-hidden bg-black flex flex-col justify-end ${isLegendary ? 'legendary-foil' : ''}`}
                      style={{
                        borderColor: hero.color,
                        boxShadow: `0 0 30px ${hero.color}60, inset 0 0 20px ${hero.color}20`
                      }}
                    >
                      {/* FULL BACKGROUND IMAGE */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={hero.img}
                          alt={hero.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Animated Pixel Overlay */}
                        <div className="absolute inset-0 pixel-anim-overlay pointer-events-none"></div>
                        {/* Scanlines */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-40 pointer-events-none"></div>
                        {/* Shadow overlay from bottom for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      </div>

                      {/* Background Radial Glow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[50px] pointer-events-none opacity-40" style={{ backgroundColor: hero.glow }}></div>

                      {/* Star Effects for Rarity */}
                      {isLegendary && <Star className="absolute top-2 left-2 w-6 h-6 z-20 text-[#FFD60A] animate-spin-slow" />}
                      {isLegendary && <Star className="absolute top-2 right-2 w-6 h-6 z-20 text-[#FFD60A] animate-spin-slow" />}

                      {/* Top Badge */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full text-center z-10">
                        <div
                          className="font-pixel text-[6px] inline-block px-3 py-1 rounded shadow-lg border"
                          style={{ backgroundColor: badge.bg, color: badge.text, textShadow: badge.shadow, borderColor: badge.text }}
                        >
                          {hero.rarity}
                        </div>
                      </div>

                      {/* Name Plate at the bottom */}
                      <div className="relative z-10 w-[110%] -ml-[5%] text-center bg-black/80 backdrop-blur-sm py-3 border-y-2 border-dashed" style={{ borderColor: hero.color }}>
                        <h3 className="font-pixel text-xs text-white mb-1 tracking-widest drop-shadow-[0_0_5px_currentColor]" style={{ color: hero.color }}>
                          {hero.name}
                        </h3>
                        <p className="font-vt text-lg" style={{ color: hero.glow }}>
                          {hero.title}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons After Result */}
            <div className="mt-16 flex gap-6 animate-pop" style={{ animationDelay: '1s' }}>
              <button
                onClick={() => setGachaState('idle')}
                className="bg-transparent text-white font-pixel text-[10px] md:text-xs py-4 px-8 border-2 border-white hover:bg-white hover:text-black transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> DONE
              </button>
              <button
                onClick={() => performPull(pulledHeroes.length)} // Pull again with same amount
                className="bg-[#00B4FF] text-black font-pixel text-[10px] md:text-xs py-4 px-8 border-2 border-white comic-shadow-pink btn-comic flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> PULL AGAIN
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
