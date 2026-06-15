import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Filter, Sparkles,
  Lock, Unlock, Zap, Shield, Cpu, Stars
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

export default function HeroCollectionApp() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNLOCKED' | 'LOCKED'
  const [rarityFilter, setRarityFilter] = useState('ALL'); // 'ALL' | 'LEGENDARY' | 'EPIC' | 'RARE'

  // Data 15 Neural Net Idols (Berdasarkan Prompt Gacha sebelumnya)
  const heroesData = [
    { id: '001', name: 'OMEGA', title: 'THE SOVEREIGN AI', rarity: 'LEGENDARY', color: '#FF003C', glow: '#FFD60A', emoji: '👑', img: heroImages[0], unlocked: true, desc: 'Master Taskmaster. Rules the digital void with absolute efficiency. Grants immense XP boosts.' },
    { id: '002', name: 'KAIRO', title: 'THE CHRONO-WITCH', rarity: 'EPIC', color: '#9D4EDD', glow: '#FF5DA2', emoji: '⏳', img: heroImages[1], unlocked: true, desc: 'Focus Arena Master. Bends time to maximize deep work sessions. Slows down distraction timers.' },
    { id: '003', name: 'CYPHER', title: 'THE GHOST NETRUNNER', rarity: 'EPIC', color: '#00B4FF', glow: '#9D4EDD', emoji: '🥷', img: heroImages[2], unlocked: false, desc: 'AI Oracle Agent. Navigates the data streams unseen. Reveals hidden sub-quests.' },
    { id: '004', name: 'GIA', title: 'THE ENERGY ALCHEMIST', rarity: 'EPIC', color: '#FF5DA2', glow: '#A3FF12', emoji: '⚗️', img: heroImages[3], unlocked: true, desc: 'Mood Journal Spirit. Transmutes chaotic emotions into raw productive power.' },
    { id: '005', name: 'REX', title: 'THE CYBER-SAMURAI', rarity: 'EPIC', color: '#A3FF12', glow: '#00B4FF', emoji: '⚔️', img: heroImages[4], unlocked: false, desc: 'Habit Warrior. Slices through procrastination with unmatched discipline and a neon katana.' },
    { id: '006', name: 'PULSE', title: 'THE DATA DRUMMER', rarity: 'RARE', color: '#00B4FF', glow: '#00B4FF', emoji: '🥁', img: heroImages[5], unlocked: true, desc: 'Rhythm Keeper. Keeps the system heartbeat steady. Boosts consistency multipliers.' },
    { id: '007', name: 'VECTOR', title: 'THE GRAFFITI HACKER', rarity: 'RARE', color: '#FFD60A', glow: '#FF5DA2', emoji: '🎨', img: heroImages[6], unlocked: true, desc: 'Creative Spark. Paints the gray mainframe with brilliant ideas. Enhances design tasks.' },
    { id: '008', name: 'SHADE', title: 'THE COFFEE TECHNO-MAGE', rarity: 'RARE', color: '#FF9F1C', glow: '#FFD60A', emoji: '☕', img: heroImages[7], unlocked: false, desc: 'Alertness Spirit. Brews the finest digital caffeine for endless stamina in the late hours.' },
    { id: '009', name: 'NOVA', title: 'THE STAR-CHART PILOT', rarity: 'RARE', color: '#A3FF12', glow: '#A3FF12', emoji: '🚀', img: heroImages[8], unlocked: true, desc: 'Goal Navigator. Charts the optimal course through the habit galaxy.' },
    { id: '010', name: 'BLADE', title: 'THE INBOX-SLAYER', rarity: 'RARE', color: '#9D4EDD', glow: '#9D4EDD', emoji: '🗡️', img: heroImages[9], unlocked: true, desc: 'Organization Expert. Clears unread messages and clutter with lethal precision.' },
    { id: '011', name: 'REZ', title: 'THE GLITCH-GEISHA', rarity: 'RARE', color: '#FF003C', glow: '#00B4FF', emoji: '🎎', img: heroImages[10], unlocked: false, desc: 'Anomaly Detector. Finds and neutralizes system bugs gracefully with her fan of code.' },
    { id: '012', name: 'DRIFT', title: 'THE SYNTHWAVE RACER', rarity: 'RARE', color: '#FF5DA2', glow: '#FFD60A', emoji: '🏎️', img: heroImages[11], unlocked: true, desc: 'Speed Organizer. Accelerates through daily repetitive tasks at terminal velocity.' },
    { id: '013', name: 'ECHO', title: 'THE SOUND-TRACKER', rarity: 'RARE', color: '#5CE1E6', glow: '#5CE1E6', emoji: '🎧', img: heroImages[12], unlocked: false, desc: 'Focus Beats. Drowns out real-world distractions with heavy cyber-bass.' },
    { id: '014', name: 'LOOP', title: 'THE HABIT-BOT', rarity: 'RARE', color: '#A3FF12', glow: '#FF5DA2', emoji: '🤖', img: heroImages[13], unlocked: true, desc: 'Consistency Drone. Automates repetitive thought processes without fatigue.' },
    { id: '015', name: 'SPARK', title: 'THE IDEA-COLLECTOR', rarity: 'RARE', color: '#FFD60A', glow: '#00B4FF', emoji: '💡', img: heroImages[14], unlocked: false, desc: 'Note Taker. Captures fleeting thoughts before they dissolve into the void.' },
  ];

  const unlockedCount = heroesData.filter(h => h.unlocked).length;
  const progressPercent = Math.round((unlockedCount / 15) * 100);

  const filteredHeroes = heroesData.filter(h => {
    const matchesStatus = filter === 'ALL' || (filter === 'UNLOCKED' && h.unlocked) || (filter === 'LOCKED' && !h.unlocked);
    const matchesRarity = rarityFilter === 'ALL' || h.rarity === rarityFilter;
    return matchesStatus && matchesRarity;
  });

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

      /* Buttons */
      .btn-comic { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .btn-comic:hover { transform: translate(-4px, -4px); box-shadow: 6px 6px 0px 0px currentColor; }
      .btn-comic:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px currentColor; }

      /* --- 3D FLIP CARD STYLES --- */
      .perspective-1000 { perspective: 1000px; }
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotate-y-180 { transform: rotateY(180deg); }
      
      .hero-card {
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
      }
      .card-container:hover .hero-card { transform: rotateY(180deg); z-index: 20; }
      
      .card-front, .card-back {
        position: absolute; width: 100%; height: 100%;
        backface-visibility: hidden;
        border-radius: 12px;
        overflow: hidden;
      }
      .card-back {
        transform: rotateY(180deg);
      }

      /* Legendary Holographic Foil Effect */
      .legendary-foil::before {
        content: ""; position: absolute; inset: 0;
        background: linear-gradient(125deg, transparent 20%, rgba(255,214,10,0.3) 40%, rgba(255,0,60,0.3) 60%, transparent 80%);
        background-size: 200% 200%;
        animation: foilShift 3s linear infinite;
        pointer-events: none; z-index: 10;
        mix-blend-mode: color-dodge;
      }
      @keyframes foilShift { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

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

      /* Card Hover Pop */
      @keyframes floatPulse {
        0% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0); }
      }
      .card-container:hover .card-front-content { animation: floatPulse 2s ease-in-out infinite; }

      @keyframes popIn { 0% { transform: scale(0.9) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
      .animate-pop { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#050505] crt pixel-grid relative flex flex-col selection:bg-[#FFD60A] selection:text-black pb-20">
      <CustomStyles />

      {/* HEADER & NAV */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b-2 border-white/10 pt-8 pb-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center relative">

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all self-start">
              <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
            </button>
            <h1 className="font-pixel text-2xl md:text-3xl text-white drop-shadow-[0_0_10px_white] flex items-center gap-4 mt-2">
              <Stars className="w-8 h-8 md:w-10 md:h-10 text-[#FF5DA2]" />
              NEURAL NET IDOLS
            </h1>
          </div>

          {/* Gacha Button (Top Right) */}
          <div className="w-full md:w-auto flex justify-end">
            <button onClick={() => navigate('/gacha')} className="w-full md:w-auto bg-gradient-to-r from-[#FF5DA2] to-[#9D4EDD] text-white font-pixel text-[10px] md:text-xs py-4 px-8 rounded border-2 border-white comic-shadow-yellow btn-comic flex items-center justify-center gap-3 animate-pulse shadow-[0_0_20px_rgba(255,93,162,0.5)]">
              <Sparkles className="w-5 h-5" />
              ACCESS GACHA TERMINAL
            </button>
          </div>
        </div>
      </header>

      {/* PROGRESS & FILTERS */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-8 z-20">
        <div className="bg-black/60 border-2 border-white/10 p-5 rounded-2xl backdrop-blur-md flex flex-col lg:flex-row gap-6 justify-between items-center shadow-xl">

          {/* Progress Bar */}
          <div className="w-full lg:w-1/3">
            <div className="flex justify-between font-pixel text-[10px] text-white mb-2">
              <span className="text-[#A3FF12]">COLLECTION PROTOCOL</span>
              <span>{unlockedCount} / 15</span>
            </div>
            <div className="w-full h-3 bg-[#111] border border-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A3FF12] shadow-[0_0_10px_#A3FF12] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Status Filter */}
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/10">
              {['ALL', 'UNLOCKED', 'LOCKED'].map(f => (
                <button
                  key={f} onClick={() => setFilter(f)}
                  className={`font-vt text-lg px-4 py-1 rounded transition-all ${filter === f ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Rarity Filter */}
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/10 overflow-x-auto hide-scrollbar">
              {['ALL', 'LEGENDARY', 'EPIC', 'RARE'].map(r => {
                const badge = getRarityBadgeStyle(r);
                return (
                  <button
                    key={r} onClick={() => setRarityFilter(r)}
                    className={`font-pixel text-[8px] px-3 py-2 rounded transition-all whitespace-nowrap`}
                    style={{
                      backgroundColor: rarityFilter === r ? badge.bg : 'transparent',
                      color: rarityFilter === r ? badge.text : '#666',
                      textShadow: rarityFilter === r ? badge.shadow : 'none'
                    }}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* HERO GRID */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-10 z-10 flex-1">

        {filteredHeroes.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-white/20 mx-auto mb-4 animate-pulse" />
            <h2 className="font-vt text-3xl text-white/40">NO IDOLS DETECTED IN THIS SECTOR.</h2>
          </div>
        )}

        <div className="flex flex-col gap-16">
          {['LEGENDARY', 'EPIC', 'RARE'].map(rarityGroup => {
            const groupHeroes = filteredHeroes.filter(h => h.rarity === rarityGroup);
            if (groupHeroes.length === 0) return null;

            const badgeStyle = getRarityBadgeStyle(rarityGroup);

            return (
              <div key={rarityGroup} className="w-full">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8 border-b-2 border-white/10 pb-4">
                  <h2 className="font-pixel text-2xl tracking-widest" style={{ color: badgeStyle.text, textShadow: badgeStyle.shadow }}>
                    {rarityGroup} IDOLS
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {groupHeroes.map((hero, index) => {
                    const badge = getRarityBadgeStyle(hero.rarity);

                    return (
                      <div
                        key={hero.id}
                        className={`card-container relative perspective-1000 animate-pop cursor-pointer ${!hero.unlocked ? 'opacity-70 grayscale hover:grayscale-0 transition-all' : ''}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* Invisible static image to dictate the exact aspect ratio and size of the container */}
                        <img src={hero.img} alt="" className="w-full h-auto opacity-0 pointer-events-none invisible block" />

                        <div className={`hero-card absolute inset-0 w-full h-full ${hero.unlocked && hero.rarity === 'LEGENDARY' ? 'legendary-foil' : ''}`}>

                          {/* ======================= */}
                          {/* CARD FRONT              */}
                          {/* ======================= */}
                          <div
                            className="card-front bg-[#0D0D0D] border-4 flex flex-col justify-end relative overflow-hidden"
                            style={{
                              borderColor: hero.unlocked ? hero.color : '#333',
                              boxShadow: hero.unlocked ? `0 0 20px ${hero.color}40, inset 0 0 30px ${hero.color}10` : 'none'
                            }}
                          >
                            {/* FULL BACKGROUND IMAGE */}
                            {hero.unlocked ? (
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
                            ) : (
                              <div className="absolute inset-0 z-0 bg-black/80 flex items-center justify-center">
                                <img
                                  src={hero.img}
                                  alt="Locked"
                                  className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale blur-sm"
                                />
                                <div className="absolute inset-0 pixel-anim-overlay opacity-20 pointer-events-none"></div>
                              </div>
                            )}

                            {/* Top Bar: Rarity & ID */}
                            <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                              <div
                                className="font-pixel text-[6px] px-2 py-1 rounded shadow-lg"
                                style={{ backgroundColor: badge.bg, color: badge.text, textShadow: badge.shadow }}
                              >
                                {hero.rarity}
                              </div>
                              <div className="font-vt text-lg bg-black/60 px-2 rounded" style={{ color: hero.unlocked ? hero.color : '#666' }}>
                                #{hero.id}
                              </div>
                            </div>

                            {/* Name Plate at the bottom */}
                            <div className="card-front-content relative z-10 w-full p-4 border-t-2 bg-black/60 backdrop-blur-md" style={{ borderColor: hero.unlocked ? hero.color : '#333' }}>
                              <h3 className="font-pixel text-xs text-white mb-1 tracking-widest drop-shadow-[0_0_5px_currentColor]" style={{ color: hero.unlocked ? hero.color : '#666' }}>
                                {hero.unlocked ? hero.name : '???'}
                              </h3>
                              <p className="font-vt text-sm" style={{ color: hero.unlocked ? hero.glow : '#444' }}>
                                {hero.unlocked ? hero.title : 'UNKNOWN DATA'}
                              </p>
                            </div>

                            {/* Locked Overlay Icon */}
                            {!hero.unlocked && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111]/80 border border-[#333] p-4 rounded-full backdrop-blur-md z-20 shadow-xl">
                                <Lock className="w-8 h-8 text-[#666]" />
                              </div>
                            )}
                          </div>

                          {/* ======================= */}
                          {/* CARD BACK (Stats & Lore)*/}
                          {/* ======================= */}
                          <div
                            className="card-back bg-[#111] border-4 p-4 flex flex-col justify-between"
                            style={{ borderColor: hero.unlocked ? hero.glow : '#333' }}
                          >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 pixel-grid opacity-20 pointer-events-none"></div>

                            {hero.unlocked ? (
                              <>
                                {/* Header Back */}
                                <div className="text-center relative z-10 border-b-2 pb-2 mb-4" style={{ borderColor: `${hero.color}50` }}>
                                  <h3 className="font-pixel text-[10px] text-white drop-shadow-[0_0_5px_currentColor]" style={{ color: hero.color }}>{hero.name}</h3>
                                  <div className="font-vt text-lg text-white/50">{hero.title}</div>
                                </div>

                                {/* Lore Description */}
                                <div className="flex-1 relative z-10">
                                  <div className="font-pixel text-[6px] text-white/40 mb-2">SYSTEM_LORE_DECRYPTED:</div>
                                  <p className="font-sans text-xs text-white/90 leading-relaxed italic bg-black/50 p-3 rounded border-l-2" style={{ borderColor: hero.color }}>
                                    "{hero.desc}"
                                  </p>
                                </div>

                                {/* Fake Stats UI */}
                                <div className="grid grid-cols-2 gap-2 relative z-10 mt-4">
                                  <div className="bg-black/80 border border-white/10 p-2 rounded text-center">
                                    <Cpu className="w-4 h-4 mx-auto mb-1" style={{ color: hero.color }} />
                                    <div className="font-vt text-sm text-white">SYS_LOAD</div>
                                  </div>
                                  <div className="bg-black/80 border border-white/10 p-2 rounded text-center">
                                    <Zap className="w-4 h-4 mx-auto mb-1" style={{ color: hero.glow }} />
                                    <div className="font-vt text-sm text-white">PWR_CORE</div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              /* Back of Locked Card */
                              <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
                                <Lock className="w-12 h-12 text-[#333] mb-4" />
                                <h3 className="font-pixel text-[10px] text-[#666] mb-2">ACCESS DENIED</h3>
                                <p className="font-vt text-lg text-[#444]">Acquire via Neural Summoning to decrypt data.</p>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
