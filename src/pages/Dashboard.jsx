import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Timer, BookOpen, Sparkles,
  User, Flame, Zap, Trophy, Bell, Search, Hexagon,
  Target, Activity, ChevronRight, Shield, Cpu, Swords, Loader2
} from 'lucide-react';

export default function DashboardApp() {
  const navigate = useNavigate();
  const [playerXP, setPlayerXP] = useState(1240);
  const [playerLevel, setPlayerLevel] = useState(24);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [floatingXPs, setFloatingXPs] = useState([]);
  const xpBarRef = useRef(null);

  // Main Quests State
  const [quests, setQuests] = useState([
    { id: 1, title: 'Drink 2L of Water', xp: 15, tag: 'HEALTH', color: '#FF5DA2', completed: false },
    { id: 2, title: 'Finish Dashboard UI Component', xp: 100, tag: 'WORK', color: '#FFD60A', completed: false },
    { id: 3, title: 'Read 10 pages of Atomic Habits', xp: 25, tag: 'LEARN', color: '#5CE1E6', completed: false },
    { id: 4, title: '30 Min Cardio Workout', xp: 50, tag: 'FITNESS', color: '#A3FF12', completed: true },
  ]);

  // AI Bardify (Quests) State
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isBardLoading, setIsBardLoading] = useState(false);

  // AI Boss Summoner (Focus Arena) State
  const [focusTask, setFocusTask] = useState('');
  const [isBossLoading, setIsBossLoading] = useState(false);
  const [bossData, setBossData] = useState(null);

  // AI Alchemist (Journal) State
  const [journalInput, setJournalInput] = useState('');
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const [journalResult, setJournalResult] = useState(null);
  const [journalError, setJournalError] = useState('');

  // AI Oracle State
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiQuests, setAiQuests] = useState([]);
  const [aiError, setAiError] = useState('');

  const handleCompleteQuest = (e, quest) => {
    if (quest.completed) return; // Prevent double completion

    // 1. Mark as complete
    setQuests(quests.map(q => q.id === quest.id ? { ...q, completed: true } : q));

    // 2. Add XP
    setPlayerXP(prev => prev + quest.xp);

    // 3. Create floating XP text at mouse click coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const newFloatingXP = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY - 20,
      amount: quest.xp,
      color: quest.color
    };

    setFloatingXPs(prev => [...prev, newFloatingXP]);

    // 4. Remove floating XP after animation finishes
    setTimeout(() => {
      setFloatingXPs(prev => prev.filter(fxp => fxp.id !== newFloatingXP.id));
    }, 1000);
  };

  const addNormalTask = () => {
    if (!newTaskInput.trim()) return;
    const newQuest = { id: Date.now(), title: newTaskInput, xp: 15, tag: 'MISC', color: '#ffffff', completed: false };
    setQuests(prev => [newQuest, ...prev]);
    setNewTaskInput('');
  };

  const bardifyTask = async () => {
    if (!newTaskInput.trim()) return;
    setIsBardLoading(true);

    const apiKey = ""; // Injected by environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `You are a dramatic RPG Bard. Turn this mundane task: "${newTaskInput}" into an epic, gamified quest. Return a JSON object with: 't' (the epic quest title, max 60 chars), 'xp' (integer 10-100 based on estimated difficulty), 'tag' (1-word category like CHORES, WORK, HEALTH, BATTLE), and 'color' (a hex code matching the vibe, e.g. #5CE1E6, #FF5DA2, #A3FF12, #FFD60A, #6A4CFF).`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            t: { type: "STRING" },
            xp: { type: "INTEGER" },
            tag: { type: "STRING" },
            color: { type: "STRING" }
          }
        }
      }
    };

    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
      const newQuest = { id: Date.now(), title: parsed.t, xp: parsed.xp, tag: parsed.tag, color: parsed.color, completed: false };
      setQuests(prev => [newQuest, ...prev]);
      setNewTaskInput('');
    } catch (error) {
      addNormalTask();
    }
    setIsBardLoading(false);
  };

  const summonBoss = async () => {
    if (!focusTask.trim()) return;
    setIsBossLoading(true);

    const apiKey = ""; // Injected by environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `The player is entering a 25-minute deep focus arena to work on: "${focusTask}". Invent a creative, retro-arcade cyberpunk RPG Boss Monster they are battling by doing this work. Return a JSON object with: 'name' (string, max 30 chars), 'desc' (string, short 1-sentence flavor text), 'emoji' (string, a single emoji representing the boss like 👾, 🐉, 🤖, 🦠), and 'color' (a hex code matching its vibe, e.g., #FF5DA2, #FFD60A, #5CE1E6, #A3FF12, #6A4CFF).`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            desc: { type: "STRING" },
            emoji: { type: "STRING" },
            color: { type: "STRING" }
          }
        }
      }
    };

    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
      setBossData(parsed);
    } catch (error) {
      console.error("Failed to summon boss", error);
    }
    setIsBossLoading(false);
  };

  const analyzeMood = async () => {
    if (!journalInput.trim()) return;
    setIsJournalLoading(true);
    setJournalError('');
    setJournalResult(null);

    const apiKey = ""; // Injected by environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `You are an RPG 'Energy Alchemist' analyzing a player's real-life journal entry. Based on their entry: "${journalInput}", determine their current mental state. Return a reading (a short, 1-2 sentence in-character RPG-style assessment of their energy), an auraColor (a hex color representing their mood, e.g., #5CE1E6, #FF5DA2, #A3FF12, #FFD60A, #6A4CFF), and stats (an array of 3 RPG stat modifications based on their mood, e.g., {name: 'FOCUS', value: '+10'}, {name: 'STAMINA', value: '-5'}).`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            reading: { type: "STRING" },
            auraColor: { type: "STRING" },
            stats: {
              type: "ARRAY",
              items: { type: "OBJECT", properties: { name: { type: "STRING" }, value: { type: "STRING" } } }
            }
          }
        }
      }
    };

    let retries = 0;
    while (retries <= 3) {
      try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error();
        const data = await response.json();
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        setJournalResult(parsed);
        break;
      } catch (error) {
        retries++;
        if (retries > 3) setJournalError('The Alchemist is gathering herbs. Please try again later.');
        else await new Promise(r => setTimeout(r, Math.pow(2, retries - 1) * 1000));
      }
    }
    setIsJournalLoading(false);
  };

  const generateQuests = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiError('');

    const apiKey = ""; // Injected by environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `Break down this large goal into 3 to 4 smaller, actionable gamified quests: "${aiInput}". Assign suitable XP (10-100) and a short 1-word tag (e.g. FOCUS, HEALTH, CODE, LORE) and a hex color code matching the tag's vibe (e.g. #5CE1E6, #FF5DA2, #A3FF12, #FFD60A, #6A4CFF).`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            quests: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: { t: { type: "STRING" }, xp: { type: "INTEGER" }, tag: { type: "STRING" }, color: { type: "STRING" } }
              }
            }
          }
        }
      }
    };

    let retries = 0;
    while (retries <= 3) {
      try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error();
        const data = await response.json();
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        setAiQuests(parsed.quests || []);
        break;
      } catch (error) {
        retries++;
        if (retries > 3) setAiError('The Oracle is meditating. Please try again later.');
        else await new Promise(r => setTimeout(r, Math.pow(2, retries - 1) * 1000));
      }
    }
    setIsAiLoading(false);
  };

  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{
      __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Press+Start+2P&family=VT323&display=swap');

      :root {
        --bg-dark: #0D0D0D;
        --pac-yellow: #FFD60A;
        --ghost-pink: #FF5DA2;
        --ghost-cyan: #5CE1E6;
        --matrix-green: #A3FF12;
        --maze-blue: #00B4FF;
        --purple: #6A4CFF;
      }

      body { background-color: var(--bg-dark); color: white; overflow: hidden; margin: 0; padding: 0;}

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

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.5); border-left: 1px solid var(--maze-blue); }
      ::-webkit-scrollbar-thumb { background: var(--maze-blue); border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--ghost-cyan); }

      @keyframes floatUpAndFade {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        50% { transform: translateY(-30px) scale(1.5); opacity: 1; }
        100% { transform: translateY(-60px) scale(1); opacity: 0; }
      }
      .animate-float-xp {
        animation: floatUpAndFade 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        pointer-events: none;
        z-index: 9999;
      }

      .quest-card { transition: all 0.3s ease; }
      .quest-card.completed {
        opacity: 0.5;
        transform: scale(0.98);
        border-color: rgba(255,255,255,0.1) !important;
        box-shadow: none !important;
      }
      .strike-line {
        position: absolute;
        top: 50%; left: 0; width: 0; height: 2px;
        background: currentColor;
        transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .quest-card.completed .strike-line { width: 100%; }

      .comic-shadow-cyan { box-shadow: 4px 4px 0px 0px var(--ghost-cyan); }
      .comic-shadow-pink { box-shadow: 4px 4px 0px 0px var(--ghost-pink); }
      .comic-shadow-yellow { box-shadow: 4px 4px 0px 0px var(--pac-yellow); }

      @keyframes popIn {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-pop { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    `}} />
  );

  return (
    <div className="h-screen w-full bg-[#0D0D0D] crt pixel-grid flex overflow-hidden selection:bg-[#FFD60A] selection:text-black">
      <CustomStyles />

      {/* Floating XP Elements */}
      {floatingXPs.map(fxp => (
        <div
          key={fxp.id}
          className="fixed font-vt text-4xl animate-float-xp font-bold drop-shadow-[0_0_10px_currentColor]"
          style={{ left: fxp.x, top: fxp.y, color: fxp.color }}
        >
          +{fxp.amount} XP
        </div>
      ))}

      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 h-full bg-black/80 border-r-2 border-[#00B4FF]/50 p-6 z-20 shadow-[5px_0_20px_rgba(0,180,255,0.15)] relative">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center gap-3 mb-12 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#FFD60A] flex items-center justify-center rounded border-2 border-white comic-shadow-pink">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-pixel text-[10px] text-[#5CE1E6] drop-shadow-[0_0_5px_#5CE1E6] leading-tight">SECOND<br />BRAIN</h1>
          </div>
        </div>

        {/* Navigation Links (With Active State Logic) */}
        <div className="flex-1 space-y-4">
          <p className="font-pixel text-[8px] text-[#00B4FF] mb-4 tracking-widest">MAIN MENU</p>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-4 p-3 rounded transition-all font-vt text-2xl font-bold group ${activeTab === 'dashboard' ? 'bg-[#FFD60A] text-black comic-shadow-cyan transform translate-x-2' : 'text-white hover:text-[#FFD60A] hover:bg-[#FFD60A]/10'}`}>
            <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('quests')}
            className={`w-full flex items-center gap-4 p-3 rounded transition-all font-vt text-2xl group ${activeTab === 'quests' ? 'bg-[#5CE1E6] text-black comic-shadow-pink transform translate-x-2' : 'text-white hover:text-[#5CE1E6] hover:bg-[#00B4FF]/10'}`}>
            <CheckSquare className="w-6 h-6 group-hover:scale-110 transition-transform" /> Quests
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`w-full flex items-center gap-4 p-3 rounded transition-all font-vt text-2xl group ${activeTab === 'arena' ? 'bg-[#FF5DA2] text-black comic-shadow-yellow transform translate-x-2' : 'text-white hover:text-[#FF5DA2] hover:bg-[#FF5DA2]/10'}`}>
            <Timer className="w-6 h-6 group-hover:scale-110 transition-transform" /> Focus Arena
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`w-full flex items-center gap-4 p-3 rounded transition-all font-vt text-2xl group ${activeTab === 'journal' ? 'bg-[#A3FF12] text-black comic-shadow-cyan transform translate-x-2' : 'text-white hover:text-[#A3FF12] hover:bg-[#A3FF12]/10'}`}>
            <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" /> Journal
          </button>

          <button
            onClick={() => setActiveTab('oracle')}
            className={`w-full flex items-center gap-4 p-3 rounded transition-all font-vt text-2xl group mt-8 border ${activeTab === 'oracle' ? 'bg-[#6A4CFF] text-white comic-shadow-yellow transform translate-x-2 border-[#6A4CFF]' : 'text-[#FFD60A] hover:bg-[#FFD60A]/10 border-[#FFD60A]/30'}`}>
            <Sparkles className="w-6 h-6 group-hover:animate-spin" /> AI Oracle
          </button>
        </div>

        <div className="mt-auto pt-6 border-t-2 border-[#00B4FF]/30">
          <div className="flex items-center justify-between font-pixel text-[8px] text-white/50">
            <span>SYS_STATUS</span>
            <span className="text-[#A3FF12] animate-pulse">NOMINAL</span>
          </div>
        </div>
      </aside>

      { }
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5CE1E6]/10 blur-[150px] pointer-events-none"></div>

        {/* TOP HEADER */}
        <header className="h-20 border-b-2 border-[#00B4FF]/30 flex items-center justify-between px-6 md:px-10 bg-black/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative text-white/50 focus-within:text-[#5CE1E6] transition-colors">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quests, logs..."
                className="bg-black/50 border border-[#00B4FF]/50 rounded-full py-2 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-[#5CE1E6] focus:shadow-[0_0_10px_#5CE1E6] w-64 transition-all"
              />
            </div>
            <h1 className="md:hidden font-pixel text-xs text-[#5CE1E6] uppercase">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#FF9F1C]/10 border border-[#FF9F1C] px-3 py-1 rounded-full cursor-pointer hover:bg-[#FF9F1C]/20 transition-colors">
              <Flame className="w-4 h-4 text-[#FF9F1C]" />
              <span className="font-vt text-xl text-[#FF9F1C]">14 <span className="hidden md:inline">Days</span></span>
            </div>

            <button onClick={() => navigate('/notifications')} className="relative text-white/70 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF5DA2] border border-black rounded-full shadow-[0_0_8px_#FF5DA2]"></span>
            </button>

            <div onClick={() => navigate('/profile')} className="flex items-center gap-3 pl-6 border-l-2 border-[#00B4FF]/30 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="font-sans font-bold text-sm text-white group-hover:text-[#5CE1E6] transition-colors">Player_One</div>
                <div className="font-pixel text-[8px] text-[#FFD60A]">LVL {playerLevel}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#5CE1E6] to-[#FF5DA2] rounded border-2 border-white flex items-center justify-center">
                <span className="font-pixel text-lg">😎</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth pb-24 md:pb-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN - Dynamic Content Based on activeTab */}
            <div className="lg:col-span-8 flex flex-col gap-8 min-h-[600px]">

              { }
              {activeTab === 'dashboard' && (
                <div className="animate-pop flex flex-col gap-8">
                  <div className="maze-wall bg-[#00B4FF]/10 p-8 rounded-2xl relative overflow-hidden flex items-center justify-between">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-[#5CE1E6]/20 rounded-full blur-[80px]"></div>
                    <div className="relative z-10">
                      <div className="inline-block bg-[#A3FF12] text-black font-pixel text-[8px] px-2 py-1 mb-4">SYSTEM ONLINE</div>
                      <h2 className="font-pixel text-2xl md:text-3xl text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        WELCOME BACK, <br />
                        <span className="text-[#5CE1E6] drop-shadow-[0_0_10px_#5CE1E6]">PLAYER ONE.</span>
                      </h2>
                      <p className="font-vt text-xl text-[#00B4FF] mt-2">Your neural-link is stable. Ready to conquer the maze?</p>
                    </div>
                    <div className="hidden md:flex relative z-10 w-32 h-32 bg-black border-4 border-[#00B4FF] rounded-full items-center justify-center shadow-[0_0_30px_#00B4FF]">
                      <Hexagon className="w-16 h-16 text-[#5CE1E6] animate-spin-slow opacity-50 absolute" />
                      <Cpu className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-4 border-b-2 border-[#00B4FF]/30 pb-2">
                      <h3 className="font-pixel text-lg text-[#FFD60A] drop-shadow-[0_0_5px_#FFD60A] flex items-center gap-3">
                        <Target className="w-5 h-5" /> DAILY QUESTS
                      </h3>
                      <button onClick={() => setActiveTab('quests')} className="font-vt text-lg text-[#00B4FF] hover:text-[#5CE1E6]">View All</button>
                    </div>

                    <div className="space-y-4">
                      {quests.slice(0, 4).map((quest) => (
                        <div key={quest.id} onClick={(e) => handleCompleteQuest(e, quest)} className={`quest-card relative bg-black/60 border-2 rounded-xl p-4 md:p-5 flex items-center justify-between cursor-pointer group ${quest.completed ? 'completed' : ''}`} style={{ borderColor: quest.completed ? '#333' : `${quest.color}50` }}>
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full">
                            <div className="w-8 h-8 rounded border-2 flex items-center justify-center shrink-0 transition-all" style={{ borderColor: quest.completed ? '#666' : quest.color, backgroundColor: quest.completed ? '#222' : 'transparent', color: quest.completed ? '#A3FF12' : 'transparent' }}>
                              <CheckSquare className="w-5 h-5" />
                            </div>
                            <div className="flex-1 relative">
                              <div className={`font-sans font-bold text-base md:text-lg transition-colors ${quest.completed ? 'text-white/40' : 'text-white group-hover:text-white/90'}`}>
                                {quest.title}
                                {quest.completed && <div className="strike-line"></div>}
                              </div>
                              <div className="font-pixel text-[8px] mt-2 tracking-wider" style={{ color: quest.completed ? '#666' : quest.color }}>{quest.tag}</div>
                            </div>
                            <div className="font-vt text-2xl md:text-3xl shrink-0" style={{ color: quest.completed ? '#666' : quest.color }}>+{quest.xp} XP</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              { }
              {activeTab === 'quests' && (
                <div className="animate-pop flex flex-col h-full bg-black/40 p-8 rounded-2xl maze-wall border-[#5CE1E6]/50 shadow-[0_0_20px_rgba(92,225,230,0.1)]">
                  <div className="flex justify-between items-center mb-8 border-b-2 border-[#5CE1E6]/30 pb-4">
                    <h3 className="font-pixel text-xl text-[#5CE1E6] drop-shadow-[0_0_5px_#5CE1E6] flex items-center gap-3">
                      <Target className="w-6 h-6" /> ACTIVE QUESTS
                    </h3>
                    <div className="bg-[#5CE1E6]/20 text-[#5CE1E6] px-4 py-2 font-vt text-xl rounded-full border border-[#5CE1E6]">
                      {quests.filter(q => q.completed).length}/{quests.length} DONE
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 mb-8 bg-[#111] p-4 rounded-xl border-2 border-[#333]">
                    <input
                      type="text"
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      placeholder="Add a boring real-life task..."
                      className="flex-1 bg-black border-2 border-[#00B4FF] p-3 rounded-lg font-sans text-sm text-white focus:outline-none focus:border-[#A3FF12] focus:shadow-[0_0_10px_#A3FF12] transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && addNormalTask()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={bardifyTask}
                        disabled={isBardLoading || !newTaskInput.trim()}
                        className="bg-[#A3FF12] text-black font-pixel text-[10px] px-6 py-3 md:py-0 rounded-lg comic-shadow-pink hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center border-2 border-white"
                      >
                        {isBardLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "BARDIFY ✨"}
                      </button>
                      <button
                        onClick={addNormalTask}
                        disabled={!newTaskInput.trim() || isBardLoading}
                        className="bg-transparent text-[#00B4FF] font-pixel text-[10px] px-4 rounded-lg hover:bg-[#00B4FF]/20 transition-colors border-2 border-[#00B4FF]"
                      >
                        ADD
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {quests.map((quest) => (
                      <div key={quest.id} onClick={(e) => handleCompleteQuest(e, quest)} className={`quest-card relative bg-black/60 border-2 rounded-xl p-5 flex items-center justify-between cursor-pointer group ${quest.completed ? 'completed' : ''}`} style={{ borderColor: quest.completed ? '#333' : `${quest.color}50` }}>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                        <div className="flex items-center gap-6 relative z-10 w-full">
                          <div className="w-8 h-8 rounded border-2 flex items-center justify-center shrink-0 transition-all" style={{ borderColor: quest.completed ? '#666' : quest.color, backgroundColor: quest.completed ? '#222' : 'transparent', color: quest.completed ? '#A3FF12' : 'transparent' }}>
                            <CheckSquare className="w-5 h-5" />
                          </div>
                          <div className="flex-1 relative">
                            <div className={`font-sans font-bold text-lg transition-colors ${quest.completed ? 'text-white/40' : 'text-white group-hover:text-white/90'}`}>
                              {quest.title} {quest.completed && <div className="strike-line"></div>}
                            </div>
                            <div className="font-pixel text-[8px] mt-2 tracking-wider" style={{ color: quest.completed ? '#666' : quest.color }}>{quest.tag}</div>
                          </div>
                          <div className="font-vt text-3xl shrink-0" style={{ color: quest.completed ? '#666' : quest.color }}>+{quest.xp} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              { }
              {activeTab === 'arena' && (
                <div className="animate-pop h-full flex flex-col items-center justify-center relative p-8 maze-wall bg-black/40 border-[#FF5DA2]/50 shadow-[0_0_20px_rgba(255,93,162,0.1)] rounded-2xl overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5DA2]/10 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>

                  {!bossData ? (
                    <div className="relative z-20 flex flex-col items-center max-w-md w-full">
                      <div className="w-16 h-16 bg-[#FF5DA2] text-black flex items-center justify-center rounded-2xl mb-6 shadow-[0_0_15px_#FF5DA2] transform rotate-12">
                        <Swords className="w-8 h-8" />
                      </div>
                      <h3 className="font-pixel text-xl text-[#FF5DA2] mb-4 drop-shadow-[0_0_8px_#FF5DA2] text-center">SUMMON A BOSS</h3>
                      <p className="font-sans text-base text-center text-white/70 mb-8">What are you focusing on? The AI will generate a boss for you to defeat during this 25m session.</p>
                      <input
                        type="text"
                        value={focusTask}
                        onChange={(e) => setFocusTask(e.target.value)}
                        placeholder="e.g. Study Calculus, Write Emails..."
                        className="w-full bg-black border-2 border-[#00B4FF] p-4 rounded-xl font-sans text-sm text-white focus:outline-none focus:border-[#FFD60A] hover:shadow-[0_0_10px_#00B4FF] transition-all mb-6 text-center"
                        onKeyDown={(e) => e.key === 'Enter' && summonBoss()}
                      />
                      <button
                        onClick={summonBoss}
                        disabled={isBossLoading || !focusTask.trim()}
                        className="bg-[#FF5DA2] text-black font-pixel text-xs py-4 px-8 comic-shadow-yellow hover:-translate-y-1 transition-transform border-2 border-white w-full flex items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {isBossLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "GENERATE ENEMY ✨"}
                      </button>
                    </div>
                  ) : (
                    <div className="relative z-20 flex flex-col items-center bg-black/80 border-4 p-12 rounded-2xl shadow-2xl" style={{ borderColor: bossData.color, boxShadow: `0 0 30px ${bossData.color}40` }}>
                      <div className="text-8xl mb-6 animate-bounce" style={{ textShadow: `0 0 30px ${bossData.color}` }}>{bossData.emoji}</div>
                      <h3 className="font-pixel text-2xl mb-2 text-center uppercase" style={{ color: bossData.color, textShadow: `0 0 10px ${bossData.color}` }}>{bossData.name}</h3>
                      <p className="font-sans text-base text-white/70 mb-10 max-w-sm text-center italic">"{bossData.desc}"</p>
                      <div className="font-vt text-9xl text-white drop-shadow-[0_0_20px_#FF5DA2] mb-10">25:00</div>
                      <div className="flex gap-6">
                        <button onClick={() => navigate('/arena')} className="bg-[#FFD60A] text-black font-pixel text-xs py-4 px-8 comic-shadow-pink hover:-translate-y-1 transition-transform border-2 border-white">
                          START BATTLE
                        </button>
                        <button onClick={() => { setBossData(null); setFocusTask(''); }} className="bg-transparent border-2 border-[#00B4FF] text-[#00B4FF] font-pixel text-xs py-4 px-8 hover:bg-[#00B4FF]/20 transition-all">
                          FLEE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              { }
              {activeTab === 'journal' && (
                <div className="animate-pop flex flex-col h-full bg-black/40 p-8 rounded-2xl maze-wall border-[#A3FF12]/50 shadow-[0_0_20px_rgba(163,255,18,0.1)]">
                  <div className="mb-8 border-b-2 border-[#A3FF12]/30 pb-4">
                    <h3 className="font-pixel text-xl text-[#A3FF12] mb-2 drop-shadow-[0_0_5px_#A3FF12] flex items-center gap-3">
                      <BookOpen className="w-6 h-6" /> ENERGY ALCHEMIST
                    </h3>
                    <p className="font-sans text-sm text-white/60">Log your thoughts. The AI will analyze your aura and translate your mood into RPG stat effects.</p>
                  </div>

                  <div className="flex flex-col gap-4 mb-8">
                    <textarea
                      value={journalInput}
                      onChange={(e) => setJournalInput(e.target.value)}
                      placeholder="How goes your journey today? e.g., 'Feeling pretty burnt out after debugging all night, but glad it works.'"
                      className="w-full bg-black border-2 border-[#00B4FF] p-5 rounded-xl font-sans text-white focus:outline-none focus:border-[#A3FF12] focus:shadow-[0_0_15px_#A3FF12] transition-all resize-none h-40"
                    />
                    <button
                      onClick={analyzeMood}
                      disabled={isJournalLoading || !journalInput.trim()}
                      className="bg-[#A3FF12] text-black font-pixel text-xs py-4 px-8 rounded-xl comic-shadow-cyan hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center self-start border-2 border-white"
                    >
                      {isJournalLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ALCHEMIZE ✨"}
                    </button>
                  </div>

                  {journalError && <div className="bg-red-500/20 text-[#FF5DA2] border-2 border-[#FF5DA2] p-4 rounded-xl font-sans mb-4 shadow-[0_0_10px_#FF5DA2]">{journalError}</div>}

                  {journalResult && (
                    <div className="bg-black/80 border-4 p-8 rounded-xl animate-pop relative overflow-hidden" style={{ borderColor: journalResult.auraColor, boxShadow: `0 0 30px ${journalResult.auraColor}40` }}>
                      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-30" style={{ backgroundColor: journalResult.auraColor }}></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-5 h-5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: journalResult.auraColor, color: journalResult.auraColor }}></div>
                          <span className="font-vt text-3xl tracking-widest drop-shadow-[0_0_5px_currentColor]" style={{ color: journalResult.auraColor }}>AURA DETECTED</span>
                        </div>
                        <p className="font-sans text-xl italic text-white/90 mb-8 border-l-4 pl-5 bg-white/5 p-5 rounded-r-lg leading-relaxed" style={{ borderColor: journalResult.auraColor }}>
                          "{journalResult.reading}"
                        </p>
                        <div className="grid grid-cols-3 gap-6">
                          {journalResult.stats.map((stat, i) => {
                            const isPositive = stat.value.startsWith('+');
                            return (
                              <div key={i} className="bg-black border-2 rounded-xl p-4 text-center" style={{ borderColor: `${journalResult.auraColor}50` }}>
                                <div className="font-pixel text-[8px] text-white/50 mb-3 tracking-widest">{stat.name}</div>
                                <div className={`font-vt text-4xl drop-shadow-[0_0_5px_currentColor] ${isPositive ? 'text-[#A3FF12]' : 'text-[#FF5DA2]'}`}>{stat.value}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              { }
              {activeTab === 'oracle' && (
                <div className="animate-pop flex flex-col h-full bg-black/40 p-8 rounded-2xl maze-wall border-[#6A4CFF]/50 shadow-[0_0_20px_rgba(106,76,255,0.1)]">
                  <div className="mb-8 border-b-2 border-[#6A4CFF]/30 pb-4">
                    <h3 className="font-pixel text-xl text-[#6A4CFF] mb-2 drop-shadow-[0_0_5px_#6A4CFF] flex items-center gap-3">
                      <Sparkles className="w-6 h-6" /> THE ORACLE
                    </h3>
                    <p className="font-sans text-sm text-white/60">Give the AI Oracle a massive life goal, and it will forge a clear path of epic quests for you.</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="e.g. Build my first startup, Learn Japanese..."
                      className="flex-1 bg-black border-2 border-[#00B4FF] p-4 rounded-xl font-sans text-white focus:outline-none focus:border-[#6A4CFF] focus:shadow-[0_0_15px_#6A4CFF] transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && generateQuests()}
                    />
                    <button
                      onClick={generateQuests}
                      disabled={isAiLoading || !aiInput.trim()}
                      className="bg-[#6A4CFF] text-white font-pixel text-xs px-8 py-4 md:py-0 rounded-xl comic-shadow-yellow hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center min-w-[140px] border-2 border-white"
                    >
                      {isAiLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ASK ✨"}
                    </button>
                  </div>

                  {aiError && <div className="bg-red-500/20 text-[#FF5DA2] border-2 border-[#FF5DA2] p-4 rounded-xl font-sans mb-4 shadow-[0_0_10px_#FF5DA2]">{aiError}</div>}

                  <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {aiQuests.length === 0 && !isAiLoading && !aiError && (
                      <div className="text-center text-[#6A4CFF] font-vt text-3xl mt-16 animate-pulse drop-shadow-[0_0_5px_#6A4CFF]">
                        Awaiting coordinates...
                      </div>
                    )}
                    {aiQuests.map((q, i) => (
                      <div key={i} className="bg-black/80 border-2 border-[#00B4FF]/30 p-5 rounded-xl flex items-center justify-between hover:border-white/30 transition-all cursor-pointer group hover:translate-x-2 duration-300">
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-md border-2 border-[#00B4FF] group-hover:border-[#FFD60A] group-hover:shadow-[0_0_10px_#FFD60A] transition-all flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#00B4FF] group-hover:text-[#FFD60A]" />
                          </div>
                          <div>
                            <div className="font-sans font-bold text-lg text-white group-hover:text-[#FFD60A] transition-colors">{q.t}</div>
                            <div className="font-pixel text-[8px] mt-2 tracking-widest drop-shadow-[0_0_2px_currentColor]" style={{ color: q.color }}>{q.tag}</div>
                          </div>
                        </div>
                        <div className="font-vt text-3xl drop-shadow-[0_0_5px_currentColor]" style={{ color: q.color }}>+{q.xp} XP</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            { }
            {/* RIGHT COLUMN (Narrower) - Stats & Widgets (PERSISTENT) */}
            <div className="lg:col-span-4 flex flex-col gap-8">

              <div className="bg-black/80 border-2 border-[#5CE1E6]/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#5CE1E6]/10 rounded-full blur-[40px]"></div>

                <h3 className="font-pixel text-xs text-[#5CE1E6] mb-6 tracking-widest border-b border-[#5CE1E6]/30 pb-2">PLAYER STATS</h3>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#FFD60A" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * (playerXP % 1000) / 1000)} className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-pixel text-[8px] text-[#FFD60A]">LVL</span>
                      <span className="font-vt text-3xl text-white leading-none">{playerLevel}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between font-pixel text-[8px] text-white/50 mb-2">
                      <span>TOTAL XP</span>
                      <span className="text-[#FFD60A]">{playerXP}</span>
                    </div>
                    <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden border border-[#333]">
                      <div className="h-full bg-[#FFD60A] shadow-[0_0_10px_#FFD60A] transition-all duration-1000" style={{ width: `${(playerXP % 1000) / 10}%` }}></div>
                    </div>
                    <div className="font-sans text-[10px] text-right mt-1 text-white/40">{1000 - (playerXP % 1000)} XP to next level</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => navigate('/achievements')} className="bg-[#111] p-3 rounded-lg border border-[#333] flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
                    <Trophy className="w-6 h-6 text-[#A3FF12]" />
                    <div>
                      <div className="font-pixel text-[8px] text-white/50">ACHIEVEMENTS</div>
                      <div className="font-vt text-2xl">12/50</div>
                    </div>
                  </div>
                  <div onClick={() => navigate('/hero')} className="bg-[#111] p-3 rounded-lg border border-[#333] flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
                    <Shield className="w-6 h-6 text-[#FF5DA2]" />
                    <div>
                      <div className="font-pixel text-[8px] text-white/50">HERO</div>
                      <div className="font-vt text-2xl text-[#FF5DA2]">6/15</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="maze-wall bg-[#FF5DA2]/5 p-6 rounded-2xl relative group overflow-hidden border-[#FF5DA2]/50">
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF5DA2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="font-pixel text-xs text-[#FF5DA2] mb-4 tracking-widest drop-shadow-[0_0_5px_#FF5DA2]">BOSS ENCOUNTER</h3>
                <div className="text-center my-6 relative z-10">
                  <div className="font-vt text-7xl text-white drop-shadow-[0_0_15px_#FF5DA2] group-hover:scale-105 transition-transform">25:00</div>
                  <p className="font-sans text-sm text-[#FF5DA2] font-medium mt-2">DEEP WORK ARENA</p>
                </div>
                <button onClick={() => navigate('/arena')} className="w-full bg-[#FF5DA2] text-black font-pixel text-xs py-4 px-6 rounded comic-shadow-yellow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all border-2 border-white flex items-center justify-center gap-3 relative z-10">
                  <Swords className="w-5 h-5" /> ENTER ARENA
                </button>
              </div>

              <div className="bg-black/80 border-2 border-[#333] rounded-2xl p-6">
                <h3 className="font-pixel text-xs text-white/70 mb-6 tracking-widest">SYSTEM LOGS</h3>
                <div className="space-y-4">
                  {[
                    { log: "Completed 'Cardio'", time: "2m ago", color: "#A3FF12" },
                    { log: "Gained 'Early Bird' Badge", time: "3h ago", color: "#FFD60A" },
                    { log: "Logged Mood: Energetic", time: "5h ago", color: "#5CE1E6" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: item.color, color: item.color }}></div>
                      <div>
                        <p className="font-sans text-sm text-white/90">{item.log}</p>
                        <p className="font-vt text-sm text-white/40">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      { }
      <nav className="md:hidden fixed bottom-0 w-full bg-black border-t-2 border-[#00B4FF]/50 flex justify-around p-4 z-50 pb-8">
        <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'text-[#FFD60A] scale-110' : 'text-white/50 hover:text-[#FFD60A]'} flex flex-col items-center gap-1 transition-all`}>
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('quests')} className={`${activeTab === 'quests' ? 'text-[#5CE1E6] scale-110' : 'text-white/50 hover:text-[#5CE1E6]'} flex flex-col items-center gap-1 transition-all`}>
          <CheckSquare className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('arena')} className={`relative -top-6 ${activeTab === 'arena' ? 'bg-[#FF5DA2] shadow-[0_0_20px_#FF5DA2]' : 'bg-[#111] border-[#FF5DA2]'} p-4 rounded-full border-2 border-white text-white`}>
          <Timer className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('journal')} className={`${activeTab === 'journal' ? 'text-[#A3FF12] scale-110' : 'text-white/50 hover:text-[#A3FF12]'} flex flex-col items-center gap-1 transition-all`}>
          <BookOpen className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('oracle')} className={`${activeTab === 'oracle' ? 'text-[#6A4CFF] scale-110' : 'text-white/50 hover:text-[#6A4CFF]'} flex flex-col items-center gap-1 transition-all`}>
          <Sparkles className="w-6 h-6" />
        </button>
      </nav>

    </div>
  );
}