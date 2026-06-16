import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Trophy, Lock, Unlock, Search, Filter
} from 'lucide-react';
import { api } from '../api/client';

export default function AchievementsApp() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNLOCKED' | 'LOCKED'
  const [searchQuery, setSearchQuery] = useState('');

  // The achievement catalog and the player's unlock state both come from the
  // backend; the catalog is merged with the set of unlocked achievement ids.
  const [achievementsData, setAchievementsData] = useState([]);

  useEffect(() => {
    let active = true;
    api.getAchievements()
      .then(async (catalog) => {
        if (!active) return;
        let owned = new Set();
        try {
          const mine = await api.getMyAchievements();
          owned = new Set(mine.map(m => m.achievementId));
        } catch {
          // Not signed in yet (or transient error): show the catalog fully locked.
        }
        if (!active) return;
        setAchievementsData(catalog.map(a => ({ ...a, unlocked: owned.has(a.id) })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Progress counts only the regular (non-secret) achievements.
  const regularAchievements = achievementsData.filter(a => !a.isSecret);
  const unlockedCount = regularAchievements.filter(a => a.unlocked).length;
  const regularTotal = regularAchievements.length;
  const progressPercent = regularTotal ? Math.round((unlockedCount / regularTotal) * 100) : 0;

  const filteredAchievements = achievementsData.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || (filter === 'UNLOCKED' && a.unlocked) || (filter === 'LOCKED' && !a.unlocked);
    return matchesSearch && matchesFilter;
  });

  // Group achievements by category based on ID ranges
  const groupedAchievements = [
    { title: 'QUESTS & TASKS', color: '#A3FF12', items: filteredAchievements.filter(a => a.id >= 1 && a.id <= 10) },
    { title: 'STREAKS & CONSISTENCY', color: '#FF9F1C', items: filteredAchievements.filter(a => a.id >= 11 && a.id <= 20) },
    { title: 'FOCUS ARENA & BOSSES', color: '#FF5DA2', items: filteredAchievements.filter(a => a.id >= 21 && a.id <= 30) },
    { title: 'JOURNAL & ENERGY', color: '#5CE1E6', items: filteredAchievements.filter(a => a.id >= 31 && a.id <= 40) },
    { title: 'SYSTEM & ORACLE', color: '#6A4CFF', items: filteredAchievements.filter(a => a.id >= 41 && a.id <= 50) },
    { title: 'CLASSIFIED ANOMALIES', color: '#FF003C', isSecretGroup: true, items: filteredAchievements.filter(a => a.isSecret) },
  ];

  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{
      __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Press+Start+2P&family=VT323&display=swap');

      :root { --bg-dark: #050505; }
      body { background-color: var(--bg-dark); color: white; overflow-x: hidden; margin: 0; }

      .font-pixel { font-family: 'Press Start 2P', cursive; line-height: 1.4; }
      .font-vt { font-family: 'VT323', monospace; }
      .font-sans { font-family: 'Inter', sans-serif; }

      /* Cyberpunk CRT & Grid Background */
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

      /* Locked Card Dimming */
      .locked-card { filter: grayscale(100%) opacity(0.5); }
      .locked-card:hover { filter: grayscale(20%) opacity(0.9); }

      /* Progress Bar Stripes */
      .progress-stripes {
        background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        background-size: 1rem 1rem;
        animation: progressMove 1s linear infinite;
      }
      @keyframes progressMove { from { background-position: 1rem 0; } to { background-position: 0 0; } }

      /* --- SEQUENTIAL GLITCH & REVEAL ANIMATIONS --- */
      
      .ach-card {
        transition: all 0.2s ease-out;
        perspective: 1000px;
      }
      
      .ach-card:hover {
        transform: scale(1.05);
        z-index: 20;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      }

      /* 1. FRONT FACE (Initially Visible, Fades out immediately on hover) */
      .face-front {
        opacity: 1;
        transition: opacity 0s; /* Instant hide on hover */
      }
      .group:hover .face-front {
        opacity: 0;
      }

      /* 2. GLITCH OVERLAY (Appears on hover, runs sequence, then hides) */
      .face-glitch {
        opacity: 0;
        pointer-events: none;
      }
      .group:hover .face-glitch {
        animation: glitch-sequence 0.4s steps(4) forwards;
      }

      @keyframes glitch-sequence {
        0% { opacity: 1; filter: hue-rotate(90deg) invert(1); transform: translate(-4px, 4px) skewX(10deg); }
        25% { opacity: 1; filter: hue-rotate(180deg); transform: translate(4px, -4px) skewX(-10deg); }
        50% { opacity: 1; filter: invert(1); transform: translate(-2px, -2px) scale(1.1); }
        75% { opacity: 1; filter: hue-rotate(270deg); transform: translate(2px, 2px) scale(0.9); }
        100% { opacity: 0; visibility: hidden; } /* Hides after glitching */
      }

      /* 3. BACK FACE / REVEAL (Fades in after the glitch ends) */
      .face-back {
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .group:hover .face-back {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.4s; /* Waits for glitch to finish */
      }

      /* Additional Glitch effects for text */
      .glitch-text-layer {
        position: relative;
        display: inline-block;
      }
      .glitch-text-layer::before, .glitch-text-layer::after {
        content: attr(data-text);
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        opacity: 0.8;
      }
      .glitch-text-layer::before {
        color: #00ffff;
        z-index: -1;
        transform: translate(-2px, 1px);
      }
      .glitch-text-layer::after {
        color: #ff00ff;
        z-index: -2;
        transform: translate(2px, -1px);
      }

      @keyframes popIn {
        0% { transform: scale(0.9) translateY(20px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      .animate-pop { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#050505] crt pixel-grid relative flex flex-col selection:bg-[#FFD60A] selection:text-black pb-20">
      <CustomStyles />

      {/* HEADER & NAV */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b-2 border-white/10 pt-8 pb-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center">

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all self-start">
              <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
            </button>
            <h1 className="font-pixel text-2xl md:text-4xl text-white drop-shadow-[0_0_10px_white] flex items-center gap-4 mt-2">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[#FFD60A]" /> TROPHY ROOM
            </h1>
          </div>

          {/* Master Progress */}
          <div className="w-full md:w-96 bg-black/50 border-2 border-white/20 p-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between font-pixel text-[10px] text-white mb-3">
              <span className="text-[#FFD60A]">GLOBAL PROGRESS</span>
              <span className="text-[#00B4FF]">{unlockedCount} / {regularTotal}</span>
            </div>
            <div className="w-full h-4 bg-[#111] border border-white/10 rounded overflow-hidden">
              <div
                className="h-full bg-[#FFD60A] progress-stripes shadow-[0_0_10px_#FFD60A] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* FILTERS & SEARCH */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-8 z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-black/60 border-2 border-white/10 p-4 rounded-2xl backdrop-blur-md">

          {/* Tabs */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button
              onClick={() => setFilter('ALL')}
              className={`font-vt text-xl md:text-2xl px-6 py-2 rounded-lg border-2 transition-all shrink-0 ${filter === 'ALL' ? 'bg-white text-black border-white shadow-[4px_4px_0_0_#FF5DA2]' : 'bg-transparent text-white/50 border-transparent hover:bg-white/10'}`}
            >
              ALL ({regularTotal})
            </button>
            <button
              onClick={() => setFilter('UNLOCKED')}
              className={`font-vt text-xl md:text-2xl px-6 py-2 rounded-lg border-2 transition-all shrink-0 flex items-center gap-2 ${filter === 'UNLOCKED' ? 'bg-[#A3FF12] text-black border-[#A3FF12] shadow-[4px_4px_0_0_#5CE1E6]' : 'bg-transparent text-[#A3FF12]/50 border-transparent hover:bg-[#A3FF12]/10'}`}
            >
              <Unlock className="w-4 h-4" /> UNLOCKED ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('LOCKED')}
              className={`font-vt text-xl md:text-2xl px-6 py-2 rounded-lg border-2 transition-all shrink-0 flex items-center gap-2 ${filter === 'LOCKED' ? 'bg-[#333] text-white border-white/30 shadow-[4px_4px_0_0_#FFD60A]' : 'bg-transparent text-white/30 border-transparent hover:bg-white/5'}`}
            >
              <Lock className="w-4 h-4" /> LOCKED ({50 - unlockedCount})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search trophies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border-2 border-white/20 p-2 pl-10 rounded-lg font-sans text-sm text-white focus:outline-none focus:border-[#00B4FF] focus:shadow-[0_0_10px_#00B4FF] transition-all"
            />
          </div>
        </div>
      </div>

      {/* ACHIEVEMENT GRID */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-10 z-10 flex-1">

        {filteredAchievements.length === 0 && (
          <div className="text-center py-20 animate-pulse">
            <Filter className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="font-vt text-3xl text-white/40">No achievements found in this sector.</h2>
          </div>
        )}

        {/* MAPPING OVER CATEGORIES */}
        {groupedAchievements.map(group => {
          if (group.items.length === 0) return null; // Sembunyikan kategori jika kosong (saat dicari/di-filter)

          return (
            <div key={group.title} className="mb-16">

              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6 border-b-2 pb-2" style={{ borderColor: `${group.color}50` }}>
                <h2 className="font-pixel text-xl drop-shadow-[0_0_5px_currentColor]" style={{ color: group.color }}>
                  {group.title}
                </h2>
                {!group.isSecretGroup ? (
                  <div className="font-vt text-lg px-3 py-1 rounded-full bg-white/5 border border-white/10" style={{ color: group.color }}>
                    {group.items.filter(a => a.unlocked).length} / {group.items.length}
                  </div>
                ) : (
                  <div className="font-vt text-lg px-3 py-1 rounded-full bg-red-500/10 border border-red-500/50 animate-pulse" style={{ color: group.color }}>
                    TOP SECRET
                  </div>
                )}
              </div>

              {/* Grid per Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {group.items.map((ach, index) => (
                  <div
                    key={ach.id}
                    className={`ach-card group relative bg-[#0D0D0D] border-2 rounded-xl h-48 cursor-pointer animate-pop ${!ach.unlocked ? 'locked-card border-dashed' : ''}`}
                    style={{
                      animationDelay: `${index * 0.02}s`,
                      borderColor: ach.unlocked ? ach.color : '#333'
                    }}
                  >
                    {/* Overlay Glow (Base) */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-xl" style={{ backgroundColor: ach.color }}></div>

                    {/* ========================================= */}
                    {/* 1. FRONT FACE (Icon & Title)              */}
                    {/* ========================================= */}
                    <div className="face-front absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl mb-4 border-2 shadow-lg"
                        style={{
                          borderColor: ach.unlocked ? ach.color : 'transparent',
                          backgroundColor: ach.unlocked ? '#000' : '#111',
                          textShadow: ach.unlocked ? `0 0 15px ${ach.color}` : 'none'
                        }}
                      >
                        {ach.unlocked ? ach.emoji : <Lock className="w-8 h-8 text-white/20" />}
                      </div>
                      <h3
                        className="font-pixel text-[10px] text-center leading-tight uppercase px-2 line-clamp-2"
                        style={{ color: ach.unlocked ? 'white' : '#666' }}
                      >
                        {ach.unlocked ? ach.title : (ach.isSecret ? 'CORRUPTED DATA' : 'UNDISCOVERED')}
                      </h3>
                    </div>

                    {/* ========================================= */}
                    {/* 2. GLITCH OVERLAY (Flashes briefly)       */}
                    {/* ========================================= */}
                    <div className="face-glitch absolute inset-0 bg-black flex flex-col items-center justify-center border-2 border-white z-20">
                      <div className="text-5xl glitch-text-layer" data-text={ach.emoji}>{ach.emoji}</div>
                      <h3 className="font-pixel text-xs text-white mt-4 glitch-text-layer uppercase text-center px-2" data-text={ach.title}>{ach.title}</h3>
                    </div>

                    {/* ========================================= */}
                    {/* 3. BACK FACE (Detailed Description)       */}
                    {/* ========================================= */}
                    <div className="face-back absolute inset-0 bg-[#111] p-4 flex flex-col items-center justify-center text-center z-10 border-2 rounded-xl" style={{ borderColor: ach.color }}>

                      {/* ID Tag */}
                      <div className="absolute top-2 right-3 font-vt text-lg opacity-30">
                        {ach.isSecret ? '#ERR' : `#${ach.id.toString().padStart(2, '0')}`}
                      </div>

                      {/* Small Header */}
                      <div className="font-pixel text-[8px] mb-4 px-2 py-1 rounded border" style={{ color: ach.color, borderColor: ach.color }}>
                        {ach.unlocked ? 'ACHIEVEMENT UNLOCKED' : (ach.isSecret ? 'ANOMALY DETECTED' : 'LOCKED REQUIREMENT')}
                      </div>

                      {/* Description Text */}
                      <p className="font-pixel text-[8px] md:text-[9px] text-white/90 leading-relaxed px-1">
                        {ach.unlocked || !ach.isSecret ? ach.desc : '?????????????????????????????'}
                      </p>

                      {/* Visual Flair if Unlocked */}
                      {ach.unlocked && (
                        <div className="absolute bottom-2 font-vt text-2xl text-[#FFD60A] drop-shadow-[0_0_5px_#FFD60A]">+XP</div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

    </div>
  );
}
