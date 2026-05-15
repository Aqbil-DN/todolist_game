import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, Swords, Timer, Smile, Trophy, Zap, 
  Terminal, Target, Flame, ArrowRight, Star, Hexagon,
  MessageSquare, CheckSquare, Activity, User, Sparkles, Loader2, BookOpen,
  Ghost, Circle
} from 'lucide-react';

export default function SecondBrainApp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('quests');

  // Quests State (Dynamic List)
  const [questsList, setQuestsList] = useState([
    {t: 'Complete System Setup', xp: 50, tag: 'TUTORIAL', color: '#5CE1E6'},
    {t: 'Drink Water (1L)', xp: 10, tag: 'HEALTH', color: '#FF5DA2'},
    {t: 'Code for 2 Hours', xp: 100, tag: 'WORK', color: '#FFD60A'}
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isBardLoading, setIsBardLoading] = useState(false);

  // AI Oracle State
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiQuests, setAiQuests] = useState([]);
  const [aiError, setAiError] = useState('');

  // AI Alchemist (Journal) State
  const [journalInput, setJournalInput] = useState('');
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const [journalResult, setJournalResult] = useState(null);
  const [journalError, setJournalError] = useState('');

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
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
      setQuestsList([parsed, ...questsList]);
      setNewTaskInput('');
    } catch (error) {
      // Fallback if AI fails
      addNormalTask();
    }
    setIsBardLoading(false);
  };

  const addNormalTask = () => {
    if (!newTaskInput.trim()) return;
    setQuestsList([{ t: newTaskInput, xp: 15, tag: 'MISC', color: '#ffffff' }, ...questsList]);
    setNewTaskInput('');
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
                properties: {
                  t: { type: "STRING" },
                  xp: { type: "INTEGER" },
                  tag: { type: "STRING" },
                  color: { type: "STRING" }
                }
              }
            }
          }
        }
      }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let retries = 0;
    const maxRetries = 5;

    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        setAiQuests(parsed.quests || []);
        break;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
           setAiError('The Oracle is currently meditating. Please try again later.');
        } else {
           await sleep(Math.pow(2, retries - 1) * 1000);
        }
      }
    }
    setIsAiLoading(false);
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
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  value: { type: "STRING" }
                }
              }
            }
          }
        }
      }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let retries = 0;
    const maxRetries = 5;

    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        setJournalResult(parsed);
        break;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
           setJournalError('The Alchemist is gathering herbs. Please try again later.');
        } else {
           await sleep(Math.pow(2, retries - 1) * 1000);
        }
      }
    }
    setIsJournalLoading(false);
  };

  // Loading Screen Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Custom CSS Injection (Fonts, CRT effect, Custom Animations)
  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Press+Start+2P&family=VT323&display=swap');

      :root {
        --bg-dark: #0D0D0D;
        --pac-yellow: #FFD60A;
        --ghost-pink: #FF5DA2;
        --ghost-cyan: #5CE1E6;
        --purple: #6A4CFF;
        --maze-blue: #00B4FF;
        --lime: #A3FF12;
      }

      body {
        background-color: var(--bg-dark);
        color: white;
        overflow-x: hidden;
      }

      .font-pixel { font-family: 'Press Start 2P', cursive; line-height: 1.4; }
      .font-vt { font-family: 'VT323', monospace; }
      .font-sans { font-family: 'Inter', sans-serif; }

      /* CRT Effect */
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

      /* Arcade Maze Element */
      .maze-wall {
        border: 2px solid var(--maze-blue);
        box-shadow: 0 0 10px var(--maze-blue), inset 0 0 10px var(--maze-blue);
        border-radius: 8px;
        background: rgba(0, 180, 255, 0.02);
        position: relative;
      }
      
      .maze-path-glow {
        box-shadow: 0 0 15px var(--maze-blue);
      }

      /* Comic & Pixel Borders */
      .comic-shadow-cyan {
        box-shadow: 6px 6px 0px 0px var(--ghost-cyan);
        border: 2px solid white;
      }
      .comic-shadow-pink {
        box-shadow: 6px 6px 0px 0px var(--ghost-pink);
        border: 2px solid white;
      }
      .comic-shadow-yellow {
        box-shadow: 6px 6px 0px 0px var(--pac-yellow);
        border: 2px solid white;
      }
      .comic-shadow-purple {
        box-shadow: 6px 6px 0px 0px var(--purple);
        border: 2px solid white;
      }
      .comic-shadow-blue {
        box-shadow: 6px 6px 0px 0px var(--maze-blue);
        border: 2px solid white;
      }
      
      .btn-comic {
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .btn-comic:hover {
        transform: translate(-4px, -4px);
        box-shadow: 8px 8px 0px 0px currentColor;
      }
      .btn-comic:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px 0px currentColor;
      }

      /* Background Grid (Arcade Style) */
      .pixel-grid {
        background-image: 
          linear-gradient(to right, rgba(0, 180, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 180, 255, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
      }

      /* Floating Animations */
      .float-slow { animation: float 6s ease-in-out infinite; }
      .float-med { animation: float 4s ease-in-out infinite; }
      .float-fast { animation: float 3s ease-in-out infinite; }

      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
        100% { transform: translateY(0px); }
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .animate-blink { animation: blink 1s infinite; }

      @keyframes progress {
        0% { width: 0%; }
        100% { width: 100%; }
      }
      .animate-progress { animation: progress 2s ease-out forwards; }
      
      @keyframes popIn {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-pop { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      
      @keyframes pacman-chomp {
        0%, 100% { clip-path: polygon(100% 74%, 44% 48%, 100% 21%, 100% 0, 0 0, 0 100%, 100% 100%); }
        50% { clip-path: polygon(100% 50%, 44% 48%, 100% 50%, 100% 0, 0 0, 0 100%, 100% 100%); }
      }
      .pacman-loader {
        width: 40px; height: 40px;
        background: var(--pac-yellow);
        border-radius: 50%;
        animation: pacman-chomp 0.5s infinite;
      }
    `}} />
  );

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#0D0D0D] flex flex-col items-center justify-center font-pixel crt text-white relative overflow-hidden">
        <CustomStyles />
        <div className="absolute inset-0 pixel-grid opacity-20"></div>
        <div className="relative flex flex-col items-center z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="pacman-loader drop-shadow-[0_0_15px_#FFD60A]"></div>
            <Circle className="w-3 h-3 text-[#FFD60A] fill-current animate-blink" style={{animationDelay: '0s'}} />
            <Circle className="w-3 h-3 text-[#FFD60A] fill-current animate-blink" style={{animationDelay: '0.2s'}} />
            <Ghost className="w-10 h-10 text-[#5CE1E6] animate-bounce" />
          </div>
          <h1 className="text-xl md:text-2xl mb-8 text-center leading-loose drop-shadow-[0_0_10px_#5CE1E6]">
            LOADING <span className="text-[#FFD60A]">ARCADE</span><br/><span className="text-[#FF5DA2]">UNIVERSE...</span>
          </h1>
          <div className="w-64 h-6 maze-wall p-1">
            <div className="h-full bg-[#FFD60A] animate-progress shadow-[0_0_10px_#FFD60A]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans crt overflow-hidden pixel-grid relative selection:bg-[#FFD60A] selection:text-black">
      <CustomStyles />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#00B4FF]/30 bg-[#0D0D0D]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 font-pixel text-[#5CE1E6] drop-shadow-[0_0_5px_#5CE1E6] cursor-pointer hover:opacity-80 transition-opacity">
            <Gamepad2 className="w-6 h-6 text-[#FFD60A]" />
            <span className="text-sm md:text-base mt-1">S.BRAIN</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-vt text-2xl tracking-widest text-white/70">
            <a href="#quests" className="hover:text-[#FF5DA2] hover:drop-shadow-[0_0_8px_#FF5DA2] transition-all cursor-pointer">QUESTS</a>
            <a href="#arena" className="hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all cursor-pointer">ARENA</a>
            <a href="#journal" className="hover:text-[#5CE1E6] hover:drop-shadow-[0_0_8px_#5CE1E6] transition-all cursor-pointer">JOURNAL</a>
          </div>
          <button onClick={() => navigate('/login')} className="bg-[#6A4CFF] text-white font-pixel text-xs py-3 px-6 comic-shadow-yellow btn-comic flex items-center gap-2 border-2 border-white">
            INSERT COIN <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto min-h-screen flex items-center">
        {/* Background Decorative Orbs & Maze Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5CE1E6]/10 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF5DA2]/10 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="z-10 animate-pop">
            <div className="inline-block bg-[#FFD60A] text-black font-pixel text-[10px] md:text-xs py-2 px-4 mb-6 transform -rotate-2 border-2 border-black comic-shadow-blue">
              NEW HIGH SCORE
            </div>
            <h1 className="font-pixel text-3xl md:text-5xl lg:text-6xl leading-[1.3] md:leading-[1.2] mb-6 drop-shadow-[0_0_15px_rgba(255,214,10,0.3)]">
              YOUR DIGITAL <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD60A] to-[#FF5DA2] relative inline-block">
                SECOND BRAIN.
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#5CE1E6] transform skew-x-12 shadow-[0_0_10px_#5CE1E6]"></div>
              </span> <br/>
              BUT FUN.
            </h1>
            <p className="font-sans text-lg md:text-xl text-[#00B4FF] mb-10 max-w-lg font-medium drop-shadow-[0_0_5px_#00B4FF]">
              Transform your productivity into an immersive arcade-like experience. Collect XP, dodge burnout, and level up.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="bg-[#FF5DA2] text-white font-pixel text-xs md:text-sm py-4 px-8 comic-shadow-cyan btn-comic flex items-center gap-3">
                <Swords className="w-5 h-5" /> START QUEST
              </button>
              <button className="bg-transparent text-[#FFD60A] font-vt text-2xl py-2 px-6 border-2 border-[#FFD60A] hover:bg-[#FFD60A]/10 hover:shadow-[0_0_15px_#FFD60A] transition-all flex items-center gap-2">
                <Gamepad2 className="w-6 h-6" /> WATCH DEMO
              </button>
            </div>
          </div>

          {/* Right: Floating Arcade Dashboard Preview */}
          <div className="relative h-[500px] md:h-[600px] hidden md:block" 
               style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}>
            
            {/* Background Fake Maze Lines */}
            <div className="absolute top-10 right-20 w-32 h-32 border-t-4 border-r-4 border-[#00B4FF] rounded-tr-xl opacity-30 shadow-[0_0_10px_#00B4FF]"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 border-b-4 border-l-4 border-[#00B4FF] rounded-bl-xl opacity-30 shadow-[0_0_10px_#00B4FF]"></div>

            {/* Floating Pellets */}
            <Circle className="absolute top-1/4 right-1/4 w-4 h-4 text-[#FFD60A] fill-current float-fast shadow-[0_0_10px_#FFD60A]" />
            <Circle className="absolute bottom-1/3 left-1/3 w-3 h-3 text-[#FFD60A] fill-current float-med shadow-[0_0_10px_#FFD60A]" />
            
            {/* Floating Ghost */}
            <Ghost className="absolute top-1/3 left-10 w-10 h-10 text-[#FF5DA2] float-slow drop-shadow-[0_0_15px_#FF5DA2] -scale-x-100" />

            {/* Main Center Card (Maze Wall style) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] bg-[#0D0D0D]/90 backdrop-blur-xl maze-wall p-6 z-20 float-med">
              <div className="flex items-center gap-4 border-b border-[#00B4FF]/30 pb-4 mb-4">
                <div className="w-16 h-16 bg-[#1A1A1A] border-2 border-[#FFD60A] shadow-[0_0_10px_#FFD60A] rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="pacman-loader scale-75"></div>
                </div>
                <div>
                  <h3 className="font-pixel text-xs text-[#5CE1E6] mb-2 drop-shadow-[0_0_5px_#5CE1E6]">PLAYER 1</h3>
                  <div className="w-48 h-3 bg-black border border-[#00B4FF] rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-[#FFD60A] shadow-[0_0_10px_#FFD60A]"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-black/50 p-3 rounded flex items-center justify-between border border-[#00B4FF]/30 hover:border-[#FFD60A] hover:shadow-[0_0_10px_#FFD60A] transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-sm border-2 border-[#5CE1E6] flex items-center justify-center group-hover:bg-[#5CE1E6]">
                      <CheckSquare className="w-3 h-3 text-black opacity-0 group-hover:opacity-100" />
                    </div>
                    <span className="font-sans text-sm">Eat 3 Healthy Meals</span>
                  </div>
                  <span className="font-vt text-xl text-[#FFD60A] drop-shadow-[0_0_5px_#FFD60A]">+50 XP</span>
                </div>
                <div className="bg-black/50 p-3 rounded flex items-center justify-between border border-[#00B4FF]/30 hover:border-[#FF5DA2] hover:shadow-[0_0_10px_#FF5DA2] transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-sm border-2 border-[#FF5DA2] flex items-center justify-center group-hover:bg-[#FF5DA2]">
                      <CheckSquare className="w-3 h-3 text-black opacity-0 group-hover:opacity-100" />
                    </div>
                    <span className="font-sans text-sm">Evade Distractions</span>
                  </div>
                  <span className="font-vt text-xl text-[#FF5DA2] drop-shadow-[0_0_5px_#FF5DA2]">+25 XP</span>
                </div>
              </div>
            </div>

            {/* Floating Widget 1 - Streak */}
            <div className="absolute top-5 right-0 bg-[#6A4CFF] text-white p-4 comic-shadow-yellow rotate-6 float-slow z-30 flex items-center gap-3 border-2 border-white">
              <Flame className="w-8 h-8 text-[#FFD60A] fill-current drop-shadow-[0_0_5px_#FFD60A]" />
              <div>
                <div className="font-pixel text-[10px] text-[#FFD60A]">COMBO STREAK</div>
                <div className="font-vt text-4xl leading-none">14x</div>
              </div>
            </div>

            {/* Floating Widget 2 - Mood */}
            <div className="absolute bottom-5 -left-10 bg-[#0D0D0D] maze-wall p-4 rounded-xl -rotate-3 float-fast z-10">
              <div className="font-pixel text-[8px] text-[#5CE1E6] mb-3 drop-shadow-[0_0_5px_#5CE1E6]">ENERGY LEVEL</div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer border border-[#00B4FF]">🔋</div>
                <div className="w-10 h-10 bg-[#FF5DA2] rounded-full flex items-center justify-center text-xl shadow-[0_0_15px_#FF5DA2] scale-110">🚀</div>
                <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer border border-[#00B4FF]">🧘</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 relative z-20 bg-[#0D0D0D] border-y-4 border-[#00B4FF] shadow-[0_0_20px_#00B4FF]" id="quests">
        <div className="absolute inset-0 pixel-grid opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-2xl md:text-4xl text-white mb-6 drop-shadow-[0_0_10px_white]">CHOOSE YOUR STAGE</h2>
            <p className="font-vt text-2xl text-[#5CE1E6] drop-shadow-[0_0_5px_#5CE1E6]">Three core systems to escape the maze.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-[#0D0D0D] maze-wall p-8 hover:border-[#FFD60A] hover:shadow-[0_0_20px_#FFD60A] transition-all relative overflow-hidden comic-shadow-yellow hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD60A]/10 rounded-full blur-3xl group-hover:bg-[#FFD60A]/30 transition-colors"></div>
              <div className="w-16 h-16 bg-[#FFD60A] text-black flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform border-2 border-black shadow-[0_0_10px_#FFD60A]">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-pixel text-sm text-[#FFD60A] mb-4 drop-shadow-[0_0_5px_#FFD60A]">QUEST SYSTEM</h3>
              <p className="font-sans text-white/70 leading-relaxed mb-6">
                Turn your daily to-do list into epic arcade levels. Earn XP, collect power pellets, and unlock high scores as you complete tasks.
              </p>
              <div className="flex items-center gap-2 text-white font-vt text-xl">
                <Zap className="w-5 h-5 text-[#FFD60A]" /> +XP PELLETS
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-[#0D0D0D] maze-wall p-8 hover:border-[#5CE1E6] hover:shadow-[0_0_20px_#5CE1E6] transition-all relative overflow-hidden comic-shadow-cyan hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5CE1E6]/10 rounded-full blur-3xl group-hover:bg-[#5CE1E6]/30 transition-colors"></div>
              <div className="w-16 h-16 bg-[#5CE1E6] text-black flex items-center justify-center mb-6 transform group-hover:-rotate-12 transition-transform border-2 border-black shadow-[0_0_10px_#5CE1E6]">
                <Timer className="w-8 h-8" />
              </div>
              <h3 className="font-pixel text-sm text-[#5CE1E6] mb-4 drop-shadow-[0_0_5px_#5CE1E6]">FOCUS ARENA</h3>
              <p className="font-sans text-white/70 leading-relaxed mb-6">
                Enter the boss fight. A deeply immersive pomodoro timer with animated pixel environments and synthwave tracks to block out ghosts.
              </p>
              <div className="flex items-center gap-2 text-white font-vt text-xl">
                <Flame className="w-5 h-5 text-[#5CE1E6]" /> GHOST IMMUNITY
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-[#0D0D0D] maze-wall p-8 hover:border-[#FF5DA2] hover:shadow-[0_0_20px_#FF5DA2] transition-all relative overflow-hidden comic-shadow-pink hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5DA2]/10 rounded-full blur-3xl group-hover:bg-[#FF5DA2]/30 transition-colors"></div>
              <div className="w-16 h-16 bg-[#FF5DA2] text-black flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform border-2 border-black shadow-[0_0_10px_#FF5DA2]">
                <Ghost className="w-8 h-8" />
              </div>
              <h3 className="font-pixel text-sm text-[#FF5DA2] mb-4 drop-shadow-[0_0_5px_#FF5DA2]">ENERGY JOURNAL</h3>
              <p className="font-sans text-white/70 leading-relaxed mb-6">
                Track your mental state with animated arcade reactions. Identify patterns in your productivity based on your emotional energy reserves.
              </p>
              <div className="flex items-center gap-2 text-white font-vt text-xl">
                <Activity className="w-5 h-5 text-[#FF5DA2]" /> RADAR TRACKER
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="arena">
        <h2 className="font-pixel text-2xl md:text-4xl text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD60A] to-[#FF5DA2] drop-shadow-[0_0_10px_rgba(255,214,10,0.5)]">
          ARCADE TERMINAL
        </h2>
        
        <div className="bg-[#0D0D0D] maze-wall rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,180,255,0.4)] flex flex-col md:flex-row h-[600px] border-4">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-black border-r border-[#00B4FF]/50 p-6 flex flex-col gap-2 z-10 shadow-[5px_0_15px_rgba(0,180,255,0.1)]">
            <div className="font-pixel text-xs text-[#00B4FF] mb-4 tracking-widest drop-shadow-[0_0_5px_#00B4FF]">SYSTEM MENU</div>
            <button 
              onClick={() => setActiveTab('quests')}
              className={`flex items-center gap-4 p-4 font-vt text-2xl rounded-lg transition-all ${activeTab === 'quests' ? 'bg-[#FFD60A] text-black comic-shadow-pink translate-x-2' : 'text-white hover:bg-[#00B4FF]/10 hover:text-[#5CE1E6] hover:translate-x-1'}`}>
              <CheckSquare className="w-6 h-6" /> Quests
            </button>
            <button 
              onClick={() => setActiveTab('arena')}
              className={`flex items-center gap-4 p-4 font-vt text-2xl rounded-lg transition-all ${activeTab === 'arena' ? 'bg-[#5CE1E6] text-black comic-shadow-yellow translate-x-2' : 'text-white hover:bg-[#00B4FF]/10 hover:text-[#5CE1E6] hover:translate-x-1'}`}>
              <Timer className="w-6 h-6" /> Arena
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-4 p-4 font-vt text-2xl rounded-lg transition-all ${activeTab === 'stats' ? 'bg-[#6A4CFF] text-white comic-shadow-cyan translate-x-2' : 'text-white hover:bg-[#00B4FF]/10 hover:text-[#5CE1E6] hover:translate-x-1'}`}>
              <Activity className="w-6 h-6" /> Stats
            </button>
            <button 
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-4 p-4 font-vt text-2xl rounded-lg transition-all ${activeTab === 'journal' ? 'bg-[#FF5DA2] text-black comic-shadow-blue translate-x-2' : 'text-white hover:bg-[#00B4FF]/10 hover:text-[#5CE1E6] hover:translate-x-1'}`}>
              <BookOpen className="w-6 h-6" /> Journal
            </button>
            <button 
              onClick={() => setActiveTab('oracle')}
              className={`flex items-center gap-4 p-4 font-vt text-2xl rounded-lg transition-all ${activeTab === 'oracle' ? 'bg-[#00B4FF] text-black comic-shadow-pink translate-x-2' : 'text-[#00B4FF] hover:bg-[#00B4FF]/10 hover:translate-x-1'}`}>
              <Sparkles className="w-6 h-6" /> Oracle ✨
            </button>
            
            <div className="mt-auto pt-6 border-t border-[#00B4FF]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD60A]/20 border border-[#FFD60A] rounded-full flex items-center justify-center shadow-[0_0_10px_#FFD60A]">
                  <User className="w-5 h-5 text-[#FFD60A]" />
                </div>
                <div>
                  <div className="font-sans font-bold text-sm text-white">Player_One</div>
                  <div className="font-vt text-[#FF5DA2] drop-shadow-[0_0_5px_#FF5DA2]">Lv. 1 Noob</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 relative overflow-hidden bg-[#0D0D0D]">
            <div className="absolute inset-0 pixel-grid opacity-40"></div>
            
            {/* Ambient Corner Glows inside terminal */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B4FF]/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5DA2]/10 blur-[80px] pointer-events-none"></div>

            {activeTab === 'quests' && (
              <div className="relative z-10 animate-pop flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-pixel text-xl text-[#FFD60A] drop-shadow-[0_0_5px_#FFD60A]">ACTIVE LEVELS</h3>
                  <div className="bg-[#FFD60A]/20 text-[#FFD60A] px-4 py-2 font-vt text-xl rounded-full border border-[#FFD60A] shadow-[0_0_10px_#FFD60A]">
                    0/{questsList.length} CLEARED
                  </div>
                </div>

                {/* Add Quest Input Area */}
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter new objective..."
                    className="flex-1 bg-black border-2 border-[#00B4FF] p-3 rounded-xl font-sans text-sm text-white focus:outline-none focus:border-[#FFD60A] focus:shadow-[0_0_10px_#FFD60A] transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && addNormalTask()}
                  />
                  <button
                    onClick={bardifyTask}
                    disabled={isBardLoading || !newTaskInput.trim()}
                    className="bg-[#5CE1E6] text-black font-pixel text-[10px] px-4 rounded-xl comic-shadow-pink hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center min-w-[120px]"
                  >
                    {isBardLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "BARDIFY ✨"}
                  </button>
                  <button
                    onClick={addNormalTask}
                    disabled={!newTaskInput.trim() || isBardLoading}
                    className="bg-transparent text-[#00B4FF] font-pixel text-[10px] px-4 rounded-xl hover:bg-[#00B4FF]/20 transition-colors border-2 border-[#00B4FF]"
                  >
                    ADD
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {questsList.map((q, i) => (
                    <div key={i} className="bg-black/80 border-2 border-[#00B4FF]/30 p-5 rounded-xl flex items-center justify-between hover:border-[#FFD60A] hover:shadow-[0_0_15px_#FFD60A] transition-all cursor-pointer group hover:translate-x-2 duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-8 h-8 rounded-md border-2 border-[#00B4FF] group-hover:border-[#FFD60A] transition-colors relative flex justify-center items-center">
                           <div className="opacity-0 group-hover:opacity-100 w-4 h-4 bg-[#FFD60A] rounded-sm transition-opacity"></div>
                        </div>
                        <div>
                          <div className="font-sans font-bold text-lg text-white group-hover:text-[#FFD60A] transition-colors">{q.t}</div>
                          <div className={`font-pixel text-[8px] mt-2 drop-shadow-[0_0_2px_currentColor]`} style={{color: q.color}}>{q.tag}</div>
                        </div>
                      </div>
                      <div className="font-vt text-3xl drop-shadow-[0_0_5px_currentColor]" style={{color: q.color}}>+{q.xp} XP</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'arena' && (
              <div className="relative z-10 h-full flex flex-col items-center justify-center animate-pop">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5DA2]/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
                <div className="relative z-20 flex flex-col items-center maze-wall p-12 bg-black/50">
                  <h3 className="font-pixel text-sm text-[#FF5DA2] mb-8 drop-shadow-[0_0_8px_#FF5DA2] animate-pulse">BOSS BATTLE: FOCUS</h3>
                  <div className="font-vt text-9xl text-white drop-shadow-[0_0_20px_#FF5DA2]">
                    25:00
                  </div>
                  <div className="mt-12 flex gap-6">
                    <button onClick={() => navigate('/enter')} className="bg-[#FFD60A] text-black font-pixel text-xs py-4 px-8 comic-shadow-pink hover:-translate-y-1 transition-transform border-2 border-white">
                      START GAME
                    </button>
                    <button className="bg-transparent border-2 border-[#00B4FF] text-[#00B4FF] font-pixel text-xs py-4 px-8 hover:bg-[#00B4FF]/20 hover:shadow-[0_0_15px_#00B4FF] transition-all">
                      PAUSE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="relative z-10 animate-pop">
                <h3 className="font-pixel text-xl text-[#5CE1E6] mb-8 drop-shadow-[0_0_5px_#5CE1E6]">PLAYER STATS</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-black border-2 border-[#00B4FF]/50 p-6 rounded-xl text-center hover:border-[#FFD60A] hover:shadow-[0_0_15px_#FFD60A] transition-all">
                    <div className="font-pixel text-[10px] text-[#00B4FF] mb-2">TOTAL SCORE (XP)</div>
                    <div className="font-vt text-6xl text-[#FFD60A] drop-shadow-[0_0_10px_#FFD60A]">1,240</div>
                  </div>
                  <div className="bg-black border-2 border-[#00B4FF]/50 p-6 rounded-xl text-center hover:border-[#FF5DA2] hover:shadow-[0_0_15px_#FF5DA2] transition-all">
                    <div className="font-pixel text-[10px] text-[#00B4FF] mb-2">MAX COMBO</div>
                    <div className="font-vt text-6xl text-[#FF5DA2] drop-shadow-[0_0_10px_#FF5DA2]">7 DAYS</div>
                  </div>
                </div>
                <div className="bg-black border-2 border-[#00B4FF]/50 p-6 rounded-xl">
                  <div className="font-pixel text-[10px] text-[#00B4FF] mb-4">SKILL TREE UPLINK</div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between font-sans text-sm mb-2 text-white">
                        <span>Consistency</span>
                        <span className="text-[#5CE1E6] font-vt text-xl">Lv. 4</span>
                      </div>
                      <div className="w-full h-3 bg-[#111] rounded-full overflow-hidden border border-[#00B4FF]/30"><div className="w-[80%] h-full bg-[#5CE1E6] shadow-[0_0_10px_#5CE1E6]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between font-sans text-sm mb-2 text-white">
                        <span>Deep Work</span>
                        <span className="text-[#FF5DA2] font-vt text-xl">Lv. 2</span>
                      </div>
                      <div className="w-full h-3 bg-[#111] rounded-full overflow-hidden border border-[#00B4FF]/30"><div className="w-[40%] h-full bg-[#FF5DA2] shadow-[0_0_10px_#FF5DA2]"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'journal' && (
              <div className="relative z-10 animate-pop flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="font-pixel text-xl text-[#FF5DA2] mb-2 drop-shadow-[0_0_5px_#FF5DA2]">ENERGY ALCHEMIST</h3>
                  <p className="font-sans text-sm text-white/60">Log your thoughts. The AI will analyze your aura and translate your mood into RPG stat effects.</p>
                </div>
                
                <div className="flex flex-col gap-4 mb-6">
                  <textarea 
                    value={journalInput}
                    onChange={(e) => setJournalInput(e.target.value)}
                    placeholder="How goes your journey today? e.g., 'Feeling pretty burnt out after debugging all night, but glad it works.'"
                    className="w-full bg-black border-2 border-[#00B4FF] p-4 rounded-xl font-sans text-white focus:outline-none focus:border-[#FF5DA2] focus:shadow-[0_0_15px_#FF5DA2] transition-all resize-none h-32"
                  />
                  <button 
                    onClick={analyzeMood}
                    disabled={isJournalLoading}
                    className="bg-[#FF5DA2] text-white font-pixel text-xs py-4 px-6 rounded-xl comic-shadow-cyan hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center self-start border-2 border-white"
                  >
                    {isJournalLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ALCHEMIZE ✨"}
                  </button>
                </div>

                {journalError && (
                  <div className="bg-red-500/20 text-[#FF5DA2] border-2 border-[#FF5DA2] p-4 rounded-xl font-sans mb-4 shadow-[0_0_10px_#FF5DA2]">
                    {journalError}
                  </div>
                )}

                {journalResult && (
                  <div className="bg-black/80 border-4 p-6 rounded-xl animate-pop relative overflow-hidden" style={{ borderColor: journalResult.auraColor, boxShadow: `0 0 20px ${journalResult.auraColor}40` }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: journalResult.auraColor }}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: journalResult.auraColor, color: journalResult.auraColor }}></div>
                        <span className="font-vt text-2xl tracking-widest drop-shadow-[0_0_5px_currentColor]" style={{ color: journalResult.auraColor }}>AURA DETECTED</span>
                      </div>
                      
                      <p className="font-sans text-lg italic text-white/90 mb-6 border-l-4 pl-4 bg-white/5 p-4 rounded-r-lg" style={{ borderColor: journalResult.auraColor }}>
                        "{journalResult.reading}"
                      </p>

                      <div className="grid grid-cols-3 gap-4">
                        {journalResult.stats.map((stat, i) => {
                          const isPositive = stat.value.startsWith('+');
                          return (
                            <div key={i} className="bg-black border-2 rounded-lg p-3 text-center" style={{ borderColor: `${journalResult.auraColor}50` }}>
                              <div className="font-pixel text-[8px] text-white/50 mb-2">{stat.name}</div>
                              <div className={`font-vt text-3xl drop-shadow-[0_0_5px_currentColor] ${isPositive ? 'text-[#FFD60A]' : 'text-[#FF5DA2]'}`}>
                                {stat.value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'oracle' && (
              <div className="relative z-10 animate-pop flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="font-pixel text-xl text-[#00B4FF] mb-2 drop-shadow-[0_0_5px_#00B4FF]">THE ORACLE ✨</h3>
                  <p className="font-sans text-sm text-white/60">Give the AI Oracle a massive life goal, and it will forge a clear path of epic quests for you.</p>
                </div>
                
                <div className="flex gap-4 mb-8">
                  <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="e.g. Build my first startup, Learn Japanese..."
                    className="flex-1 bg-black border-2 border-[#00B4FF] p-4 rounded-xl font-sans text-white focus:outline-none focus:border-[#5CE1E6] focus:shadow-[0_0_15px_#5CE1E6] transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && generateQuests()}
                  />
                  <button 
                    onClick={generateQuests}
                    disabled={isAiLoading}
                    className="bg-[#00B4FF] text-white font-pixel text-xs px-6 rounded-xl comic-shadow-yellow hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center min-w-[120px] border-2 border-white"
                  >
                    {isAiLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ASK ✨"}
                  </button>
                </div>

                {aiError && (
                  <div className="bg-red-500/20 text-[#FF5DA2] border-2 border-[#FF5DA2] p-4 rounded-xl font-sans mb-4 shadow-[0_0_10px_#FF5DA2]">
                    {aiError}
                  </div>
                )}

                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {aiQuests.length === 0 && !isAiLoading && !aiError && (
                    <div className="text-center text-[#00B4FF] font-vt text-2xl mt-12 animate-pulse drop-shadow-[0_0_5px_#00B4FF]">
                      Awaiting coordinates...
                    </div>
                  )}
                  {aiQuests.map((q, i) => (
                    <div key={i} className="bg-black/80 border-2 border-[#00B4FF]/30 p-5 rounded-xl flex items-center justify-between hover:border-white/30 transition-all cursor-pointer group hover:translate-x-2 duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-8 h-8 rounded-md border-2 border-[#00B4FF] group-hover:border-[#FFD60A] group-hover:shadow-[0_0_10px_#FFD60A] transition-all"></div>
                        <div>
                          <div className="font-sans font-bold text-lg text-white group-hover:text-[#FFD60A] transition-colors">{q.t}</div>
                          <div className="font-pixel text-[8px] mt-2 drop-shadow-[0_0_2px_currentColor]" style={{color: q.color}}>{q.tag}</div>
                        </div>
                      </div>
                      <div className="font-vt text-3xl drop-shadow-[0_0_5px_currentColor]" style={{color: q.color}}>+{q.xp} XP</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gamification / RPG Section */}
      <section className="py-24 px-6 bg-[#0D0D0D] border-t-4 border-[#00B4FF] relative overflow-hidden" id="journal">
        <div className="absolute inset-0 pixel-grid opacity-30"></div>
        <div className="max-w-7xl mx-auto overflow-hidden relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/3 z-10">
              <h2 className="font-pixel text-3xl text-white mb-6 leading-tight drop-shadow-[0_0_10px_white]">
                LEVEL UP <br/><span className="text-[#FFD60A] drop-shadow-[0_0_10px_#FFD60A]">YOUR LIFE.</span>
              </h2>
              <p className="font-sans text-[#00B4FF] text-lg mb-8">
                Every task completed, every hour focused, and every habit maintained adds to your global progression. Eat pellets, avoid ghosts, unlock badges.
              </p>
              <button className="text-[#5CE1E6] font-vt text-2xl flex items-center gap-2 hover:translate-x-2 hover:drop-shadow-[0_0_8px_#5CE1E6] transition-all">
                VIEW LEADERBOARD <ArrowRight />
              </button>
            </div>
            
            <div className="md:w-2/3 relative w-full flex justify-center md:justify-end">
              {/* Fake Arcade Timeline */}
              <div className="relative w-full max-w-2xl">
                {/* Maze Path */}
                <div className="absolute top-1/2 left-0 w-full h-4 border-y-2 border-[#00B4FF] -translate-y-1/2 z-0 bg-[#00B4FF]/10 shadow-[0_0_10px_#00B4FF]">
                   {/* Eating progress */}
                  <div className="w-[60%] h-full bg-[#FFD60A]/20 relative"></div>
                </div>
                
                <div className="relative z-10 flex justify-between w-full">
                  {/* Node 1 */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-black border-4 border-[#00B4FF] rounded-full flex items-center justify-center text-[#00B4FF] shadow-[0_0_15px_#00B4FF]">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div className="text-center bg-black/80 px-2 py-1 rounded border border-[#00B4FF]/50">
                      <div className="font-pixel text-[8px] md:text-[10px] text-[#00B4FF]">LEVEL 1</div>
                      <div className="font-vt text-xl text-white">NOVICE</div>
                    </div>
                  </div>
                  
                  {/* Node 2 - Pacman active */}
                  <div className="flex flex-col items-center gap-4 -translate-y-8">
                    <div className="w-20 h-20 bg-[#FFD60A] border-4 border-white rounded-full flex items-center justify-center text-black comic-shadow-pink scale-110 shadow-[0_0_20px_#FFD60A]">
                       <div className="pacman-loader scale-125 border-white"></div>
                    </div>
                    <div className="text-center bg-black/80 px-2 py-1 rounded border border-[#FFD60A]">
                      <div className="font-pixel text-[8px] md:text-[10px] text-[#FFD60A] animate-pulse">LEVEL 10</div>
                      <div className="font-vt text-2xl text-[#FFD60A]">PLAYER 1</div>
                    </div>
                  </div>

                  {/* Node 3 */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-black border-4 border-[#333] rounded-full flex items-center justify-center text-[#555]">
                       <Circle className="w-6 h-6 fill-current" />
                    </div>
                    <div className="text-center opacity-50">
                      <div className="font-pixel text-[8px] md:text-[10px] text-white/50">LEVEL 50</div>
                      <div className="font-vt text-xl text-white">MASTER</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative border-t border-[#00B4FF]/30">
        <div className="absolute inset-0 bg-[#6A4CFF]/5 pixel-grid z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-pixel text-center text-2xl md:text-3xl mb-16 text-white drop-shadow-[0_0_10px_white]">
            HIGH <span className="text-[#5CE1E6] drop-shadow-[0_0_10px_#5CE1E6]">SCORES</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { t: "I actually look forward to doing my chores now. The combo streak is way too addicting.", a: "Alex D.", l: "Lv. 42", color: "var(--pac-yellow)" },
              { t: "The Focus Arena completely changed how I study. 25 mins feels like a mini-game boss fight.", a: "Sarah K.", l: "Lv. 18", color: "var(--ghost-pink)" },
              { t: "Finally, a productivity app that doesn't look like a boring corporate spreadsheet.", a: "Mike T.", l: "Lv. 64", color: "var(--ghost-cyan)" }
            ].map((test, i) => (
              <div key={i} className="relative bg-black text-white p-8 rounded-2xl border-2 float-med" style={{ borderColor: test.color, boxShadow: `6px 6px 0px 0px ${test.color}, 0 0 15px ${test.color}40`, animationDelay: `${i * 0.5}s` }}>
                {/* Speech Bubble Tail */}
                <div className="absolute -bottom-4 left-8 w-8 h-8 bg-black border-b-2 border-r-2 transform rotate-45" style={{ borderColor: test.color }}></div>
                
                <MessageSquare className="w-8 h-8 mb-4 opacity-80 drop-shadow-[0_0_5px_currentColor]" style={{ color: test.color }} />
                <p className="font-sans font-medium text-lg leading-relaxed mb-6 text-white/90">"{test.t}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#111] rounded-full border-2" style={{ borderColor: test.color }}></div>
                  <div>
                    <div className="font-pixel text-[10px] font-bold text-white">{test.a}</div>
                    <div className="font-vt text-lg drop-shadow-[0_0_5px_currentColor]" style={{ color: test.color }}>{test.l}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="relative pt-32 pb-20 px-6 bg-black text-white overflow-hidden border-t-8 border-[#00B4FF]">
        <div className="absolute inset-0 pixel-grid opacity-20"></div>
        
        {/* Cinematic Particles */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-[#FFD60A] rotate-45 animate-pulse shadow-[0_0_10px_#FFD60A]"></div>
        <div className="absolute bottom-20 right-20 w-6 h-6 border-2 border-[#FF5DA2] rotate-12 float-slow shadow-[0_0_10px_#FF5DA2]"></div>
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-[#5CE1E6] rounded-full animate-bounce shadow-[0_0_10px_#5CE1E6]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <Gamepad2 className="w-16 h-16 mb-8 text-[#FFD60A] fill-[#FFD60A]/20 animate-bounce drop-shadow-[0_0_15px_#FFD60A]" />
          <h2 className="font-pixel text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            READY TO ESCAPE THE <br/> <span className="text-[#5CE1E6] drop-shadow-[0_0_15px_#5CE1E6]">PRODUCTIVITY MAZE?</span>
          </h2>
          <button onClick={() => navigate('/enter')} className="bg-[#6A4CFF] text-white font-pixel text-sm md:text-xl py-6 px-12 comic-shadow-yellow btn-comic flex items-center gap-4 group border-2 border-white mt-4">
            ENTER THE SYSTEM
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="mt-24 font-vt text-2xl text-[#00B4FF] flex flex-col md:flex-row gap-6 md:gap-12 items-center">
            <span className="drop-shadow-[0_0_5px_#00B4FF]">© 2026 SECOND BRAIN.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#FFD60A] hover:drop-shadow-[0_0_5px_#FFD60A] transition-all">TWITTER</a>
              <a href="#" className="hover:text-[#FFD60A] hover:drop-shadow-[0_0_5px_#FFD60A] transition-all">DISCORD</a>
              <a href="#" className="hover:text-[#FFD60A] hover:drop-shadow-[0_0_5px_#FFD60A] transition-all">GITHUB</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
