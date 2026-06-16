import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare,
  User, Flame, Zap, Trophy, Bell, Search, Hexagon,
  Target, Activity, ChevronRight, ChevronLeft, Calendar, X, Shield, Cpu, Coins
} from 'lucide-react';
import { useCoins } from '../useCoins';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Quest frequency categories (per-card, editable in edit mode)
const FREQUENCIES = [
  { key: 'daily', label: 'DAILY', color: '#5CE1E6' },
  { key: 'weekly', label: 'WEEKLY', color: '#A3FF12' },
  { key: 'monthly', label: 'MONTHLY', color: '#FFD60A' },
  { key: 'yearly', label: 'YEARLY', color: '#6A4CFF' },
  { key: 'one-time', label: 'ONE-TIME', color: '#FF5DA2' },
];

// Task categories (chosen when adding a quest -> sets tag + color)
const CATEGORIES = [
  { tag: 'HEALTH', color: '#FF5DA2' },
  { tag: 'WORK', color: '#FFD60A' },
  { tag: 'LEARN', color: '#5CE1E6' },
  { tag: 'FITNESS', color: '#A3FF12' },
  { tag: 'CHORES', color: '#6A4CFF' },
  { tag: 'MISC', color: '#00B4FF' },
];

const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// --- Date helpers (local-time, TZ-safe) ---
const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

// Build a 6x7 grid of dates for a given month (incl. spillover from neighbouring months)
const buildMonthMatrix = (year, month) => {
  const first = new Date(year, month, 1);
  const start = addDays(first, -first.getDay()); // back up to the Sunday of that week
  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(start, i);
    return { date, inMonth: date.getMonth() === month };
  });
};

// Does a quest's recurrence land on the given day, based on its anchor date?
const isHighlighted = (quest, day) => {
  if (!quest?.date) return false;
  const anchor = parseISO(quest.date);
  switch (quest.frequency) {
    case 'daily': return true;
    case 'weekly': return day.getDay() === anchor.getDay();
    case 'monthly': return day.getDate() === anchor.getDate();
    case 'yearly': return day.getMonth() === anchor.getMonth() && day.getDate() === anchor.getDate();
    case 'one-time': return sameDay(day, anchor);
    default: return false;
  }
};

// Human-readable description of a quest's recurrence pattern
const recurrenceHint = (quest) => {
  if (!quest?.date) return '';
  const a = parseISO(quest.date);
  switch (quest.frequency) {
    case 'daily': return 'Highlights every day';
    case 'weekly': return `Highlights every ${WEEKDAY_LABELS[a.getDay()]}`;
    case 'monthly': return `Highlights day ${a.getDate()} of every month`;
    case 'yearly': return `Highlights ${MONTH_LABELS[a.getMonth()]} ${a.getDate()} each year`;
    case 'one-time': return `One-time on ${MONTH_LABELS[a.getMonth()]} ${a.getDate()}, ${a.getFullYear()}`;
    default: return '';
  }
};

// Compact relative timestamp ("2m ago", "3h ago", "5d ago") for the activity log.
const timeAgo = (iso) => {
  if (!iso) return '';
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// Shared month-grid calendar used by both the add-quest form and the edit modal.
// `date` is the ISO anchor day; the recurrence preview is derived from `frequency`.
function QuestCalendar({ color, frequency, date, month, setMonth, onPick }) {
  const ref = { date, frequency };
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonth(m => { const d = new Date(m.year, m.month - 1, 1); return { year: d.getFullYear(), month: d.getMonth() }; })}
          className="p-1.5 rounded-lg border-2 border-[#333] hover:border-white text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-pixel text-[10px] text-white text-center">{MONTH_LABELS[month.month]} {month.year}</span>
        <button
          onClick={() => setMonth(m => { const d = new Date(m.year, m.month + 1, 1); return { year: d.getFullYear(), month: d.getMonth() }; })}
          className="p-1.5 rounded-lg border-2 border-[#333] hover:border-white text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="text-center font-pixel text-[8px] text-white/40 py-1">{w[0]}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {buildMonthMatrix(month.year, month.month).map(({ date: day, inMonth }, i) => {
          const highlighted = isHighlighted(ref, day);
          const isAnchor = sameDay(day, parseISO(date));
          const isToday = sameDay(day, new Date());
          return (
            <button
              key={i}
              onClick={() => onPick(toISO(day))}
              className={`relative aspect-square rounded-lg font-vt text-lg flex items-center justify-center transition-all hover:brightness-125 ${inMonth ? '' : 'opacity-30'}`}
              style={{
                backgroundColor: isAnchor ? color : (highlighted ? `${color}25` : 'transparent'),
                color: isAnchor ? '#000' : (highlighted ? '#fff' : '#888'),
                border: highlighted && !isAnchor ? `1px solid ${color}80` : '1px solid transparent',
                boxShadow: isAnchor ? `0 0 12px ${color}` : 'none',
              }}
            >
              {day.getDate()}
              {isToday && !isAnchor && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></span>}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 font-vt text-sm text-white/50">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: color }}></span>Anchor date</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: `${color}25`, border: `1px solid ${color}80` }}></span>Recurs</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>Today</span>
      </div>
    </>
  );
}

export default function DashboardApp() {
  const navigate = useNavigate();
  const { coins, setCoins } = useCoins();
  const { profile } = useAuth();
  const [playerXP, setPlayerXP] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [floatingXPs, setFloatingXPs] = useState([]);
  const xpBarRef = useRef(null);
  const mountedRef = useRef(true);

  // Dashboard summary widgets (streak, activity log, collection counts, alerts).
  const [streak, setStreak] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [achCount, setAchCount] = useState({ unlocked: 0, total: 0 });
  const [heroCount, setHeroCount] = useState({ unlocked: 0, total: 0 });
  const [unreadCount, setUnreadCount] = useState(0);

  // Main Quests State (loaded from the backend)
  const [quests, setQuests] = useState([]);

  // Load quests on mount.
  useEffect(() => {
    let active = true;
    api.getQuests().then((data) => { if (active) setQuests(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Sync XP / level from the authenticated profile.
  useEffect(() => {
    if (profile) {
      setPlayerXP(profile.xp ?? 0);
      setPlayerLevel(profile.level ?? 1);
    }
  }, [profile]);

  // Aggregate dashboard widgets sourced from the backend.
  const loadDashboardSummary = async () => {
    const [streakRes, activity, myAch, allAch, myHeroes, allHeroes, notifs] = await Promise.all([
      api.getQuestStreak().catch(() => ({ streak: 0 })),
      api.getQuestActivity().catch(() => []),
      api.getMyAchievements().catch(() => []),
      api.getAchievements().catch(() => []),
      api.getMyHeroes().catch(() => []),
      api.getHeroes().catch(() => []),
      api.getNotifications().catch(() => []),
    ]);
    if (!mountedRef.current) return;
    setStreak(streakRes?.streak ?? 0);
    setActivityLog(Array.isArray(activity) ? activity : []);
    setAchCount({ unlocked: myAch.length, total: allAch.length });
    setHeroCount({ unlocked: myHeroes.length, total: allHeroes.length });
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  useEffect(() => {
    mountedRef.current = true;
    loadDashboardSummary();
    return () => { mountedRef.current = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Quest creation + edit State
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('HEALTH');
  const [newTaskFrequency, setNewTaskFrequency] = useState('daily');
  const [newTaskDate, setNewTaskDate] = useState(toISO(new Date()));
  const [showAddCalendar, setShowAddCalendar] = useState(false);
  const [addCalendarMonth, setAddCalendarMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
  const [editMode, setEditMode] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });

  const handleCompleteQuest = async (e, quest) => {
    if (editMode) return; // No completing while editing
    if (quest.completed) return; // Prevent double completion

    // Floating XP text at the click coordinates (captured before awaiting).
    const newFloatingXP = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY - 20,
      amount: quest.xp,
      color: quest.color
    };
    setFloatingXPs(prev => [...prev, newFloatingXP]);
    setTimeout(() => {
      setFloatingXPs(prev => prev.filter(fxp => fxp.id !== newFloatingXP.id));
    }, 1000);

    // Persist completion; the server awards XP + coins and recomputes level.
    try {
      const result = await api.completeQuest(quest.id);
      setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, completed: true } : q));
      setPlayerXP(result.xp);
      setPlayerLevel(result.level);
      setCoins(result.coins);
      loadDashboardSummary();
    } catch {
      // leave state unchanged on failure
    }
  };

  const addNormalTask = async () => {
    if (!newTaskInput.trim()) return;
    const category = CATEGORIES.find(c => c.tag === newTaskCategory) || CATEGORIES[0];
    try {
      const created = await api.createQuest({
        title: newTaskInput.trim(),
        xp: 15,
        tag: category.tag,
        color: category.color,
        frequency: newTaskFrequency,
        date: newTaskDate,
      });
      setQuests(prev => [created, ...prev]);
      setNewTaskInput('');
      setShowAddCalendar(false);
    } catch {
      // ignore creation failure
    }
  };

  const changeFrequency = (id, frequency) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, frequency } : q));
    api.updateQuest(id, { frequency }).catch(() => {});
  };

  const changeDate = (id, iso) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, date: iso } : q));
    setSelectedQuestId(id);
    api.updateQuest(id, { date: iso }).catch(() => {});
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

  const selectedQuest = quests.find(q => q.id === selectedQuestId) || null;
  const addColor = (CATEGORIES.find(c => c.tag === newTaskCategory) || CATEGORIES[0]).color;

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
            <div onClick={() => navigate('/gacha')} className="flex items-center gap-2 bg-[#FFD60A]/10 border border-[#FFD60A] px-3 py-1 rounded-full cursor-pointer hover:bg-[#FFD60A]/20 transition-colors" title="Spend coins on Gacha">
              <Coins className="w-4 h-4 text-[#FFD60A]" />
              <span className="font-vt text-xl text-[#FFD60A]">{coins.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#FF9F1C]/10 border border-[#FF9F1C] px-3 py-1 rounded-full cursor-pointer hover:bg-[#FF9F1C]/20 transition-colors" title="Quest completion streak">
              <Flame className="w-4 h-4 text-[#FF9F1C]" />
              <span className="font-vt text-xl text-[#FF9F1C]">{streak} <span className="hidden md:inline">Days</span></span>
            </div>

            <button onClick={() => navigate('/notifications')} className="relative text-white/70 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF5DA2] border border-black rounded-full shadow-[0_0_8px_#FF5DA2]"></span>
              )}
            </button>

            <div onClick={() => navigate('/profile')} className="flex items-center gap-3 pl-6 border-l-2 border-[#00B4FF]/30 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="font-sans font-bold text-sm text-white group-hover:text-[#5CE1E6] transition-colors">{profile?.username || 'Player_One'}</div>
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
                        <Target className="w-5 h-5" /> ACTIVE QUESTS
                      </h3>
                      <button onClick={() => setActiveTab('quests')} className="font-vt text-lg text-[#00B4FF] hover:text-[#5CE1E6]">View All</button>
                    </div>

                    <div className="space-y-4">
                      {quests.filter(q => !q.completed).slice(0, 3).map((quest) => (
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setEditMode(!editMode); if (editMode) setSelectedQuestId(null); }}
                        className={`font-pixel text-[10px] px-4 py-2 rounded-full border-2 transition-all ${editMode ? 'bg-[#FFD60A] text-black border-white comic-shadow-pink' : 'bg-transparent text-[#FFD60A] border-[#FFD60A] hover:bg-[#FFD60A]/10'}`}
                      >
                        {editMode ? 'DONE' : 'EDIT'}
                      </button>
                      <div className="bg-[#5CE1E6]/20 text-[#5CE1E6] px-4 py-2 font-vt text-xl rounded-full border border-[#5CE1E6]">
                        {quests.filter(q => q.completed).length}/{quests.length} DONE
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 bg-[#111] p-4 rounded-xl border-2 border-[#333]">
                    {/* Row 1 — the task itself */}
                    <input
                      type="text"
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      placeholder="Add a boring real-life task..."
                      className="w-full bg-black border-2 border-[#00B4FF] p-3 rounded-lg font-sans text-sm text-white focus:outline-none focus:border-[#A3FF12] focus:shadow-[0_0_10px_#A3FF12] transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && addNormalTask()}
                    />

                    {/* Row 2 — labelled metadata selectors + ADD */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3 mt-3">
                      <div className="flex flex-1 gap-2">
                        {/* Category */}
                        <label className="flex-1 flex flex-col gap-1">
                          <span className="font-pixel text-[7px] text-white/40 tracking-widest">CATEGORY</span>
                          <select
                            value={newTaskCategory}
                            onChange={(e) => setNewTaskCategory(e.target.value)}
                            className="w-full bg-black border-2 border-[#00B4FF] text-white font-pixel text-[10px] px-3 py-3 rounded-lg focus:outline-none focus:border-[#A3FF12] cursor-pointer"
                          >
                            {CATEGORIES.map(c => (
                              <option key={c.tag} value={c.tag}>{c.tag}</option>
                            ))}
                          </select>
                        </label>

                        {/* Frequency */}
                        <label className="flex-1 flex flex-col gap-1">
                          <span className="font-pixel text-[7px] text-white/40 tracking-widest">FREQUENCY</span>
                          <select
                            value={newTaskFrequency}
                            onChange={(e) => setNewTaskFrequency(e.target.value)}
                            className="w-full bg-black border-2 border-[#00B4FF] text-white font-pixel text-[10px] px-3 py-3 rounded-lg focus:outline-none focus:border-[#A3FF12] cursor-pointer"
                          >
                            {FREQUENCIES.map(f => (
                              <option key={f.key} value={f.key}>{f.label}</option>
                            ))}
                          </select>
                        </label>

                        {/* Date / recurrence anchor */}
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="font-pixel text-[7px] text-white/40 tracking-widest">DATE</span>
                          <button
                            type="button"
                            onClick={() => setShowAddCalendar(v => {
                              const next = !v;
                              if (next) { const d = parseISO(newTaskDate); setAddCalendarMonth({ year: d.getFullYear(), month: d.getMonth() }); }
                              return next;
                            })}
                            className="w-full bg-black border-2 text-white font-pixel text-[10px] px-3 py-3 rounded-lg focus:outline-none cursor-pointer flex items-center justify-center gap-2 transition-colors"
                            style={{ borderColor: showAddCalendar ? '#A3FF12' : '#00B4FF' }}
                          >
                            <Calendar className="w-3.5 h-3.5" style={{ color: addColor }} />
                            {`${MONTH_LABELS[parseISO(newTaskDate).getMonth()]} ${parseISO(newTaskDate).getDate()}`}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={addNormalTask}
                        disabled={!newTaskInput.trim()}
                        className="bg-[#A3FF12] text-black font-pixel text-[10px] px-6 py-3 rounded-lg comic-shadow-pink hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center border-2 border-white"
                      >
                        ADD
                      </button>
                    </div>

                    {/* Inline calendar — toggled by the DATE button, tinted to the category */}
                    {showAddCalendar && (
                      <div className="mt-3 p-4 bg-black/60 rounded-lg border-2 animate-pop" style={{ borderColor: `${addColor}50` }}>
                        <div className="font-vt text-base text-white/60 mb-3">{recurrenceHint({ date: newTaskDate, frequency: newTaskFrequency })}</div>
                        <QuestCalendar
                          color={addColor}
                          frequency={newTaskFrequency}
                          date={newTaskDate}
                          month={addCalendarMonth}
                          setMonth={setAddCalendarMonth}
                          onPick={(iso) => setNewTaskDate(iso)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                    {FREQUENCIES.map((freq) => {
                      const group = quests.filter(q => q.frequency === freq.key);
                      if (group.length === 0) return null;
                      return (
                        <div key={freq.key}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-pixel text-[10px] tracking-widest" style={{ color: freq.color, textShadow: `0 0 5px ${freq.color}` }}>{freq.label}</span>
                            <div className="flex-1 h-px" style={{ backgroundColor: `${freq.color}40` }}></div>
                            <span className="font-vt text-lg" style={{ color: freq.color }}>{group.length}</span>
                          </div>
                          <div className="space-y-4">
                            {group.map((quest) => {
                              const isSelected = editMode && selectedQuestId === quest.id;
                              return (
                              <div key={quest.id} onClick={(e) => editMode ? setSelectedQuestId(quest.id) : handleCompleteQuest(e, quest)} className={`quest-card relative bg-black/60 border-2 rounded-xl p-5 flex items-center justify-between cursor-pointer group ${quest.completed ? 'completed' : ''}`} style={{ borderColor: isSelected ? quest.color : (quest.completed ? '#333' : `${quest.color}50`), boxShadow: isSelected ? `0 0 16px ${quest.color}80` : 'none' }}>
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
                                  {editMode ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedQuestId(quest.id); }}
                                        className="flex items-center gap-1.5 bg-black border-2 text-white font-pixel text-[9px] px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                                        style={{ borderColor: quest.color }}
                                      >
                                        <Calendar className="w-3.5 h-3.5" style={{ color: quest.color }} />
                                        {quest.date ? `${MONTH_LABELS[parseISO(quest.date).getMonth()]} ${parseISO(quest.date).getDate()}` : 'SET'}
                                      </button>
                                      <select
                                        value={quest.frequency}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => changeFrequency(quest.id, e.target.value)}
                                        className="bg-black border-2 text-white font-pixel text-[9px] px-3 py-2 rounded-lg focus:outline-none cursor-pointer"
                                        style={{ borderColor: quest.color }}
                                      >
                                        {FREQUENCIES.map(f => (
                                          <option key={f.key} value={f.key}>{f.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  ) : (
                                    <div className="font-vt text-3xl shrink-0" style={{ color: quest.completed ? '#666' : quest.color }}>+{quest.xp} XP</div>
                                  )}
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {editMode && selectedQuest && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop"
                      onClick={() => setSelectedQuestId(null)}
                    >
                      <div
                        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border-2 rounded-2xl p-6"
                        style={{ borderColor: selectedQuest.color, boxShadow: `0 0 30px ${selectedQuest.color}40` }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedQuestId(null)}
                          className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-[#333] hover:border-white text-white transition-colors"
                          aria-label="Close calendar"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="mb-4 pr-10">
                          <div className="font-pixel text-[10px] truncate" style={{ color: selectedQuest.color, textShadow: `0 0 5px ${selectedQuest.color}` }}>{selectedQuest.title}</div>
                          <div className="font-vt text-base text-white/60 mt-1">{recurrenceHint(selectedQuest)}</div>
                        </div>

                        <QuestCalendar
                          color={selectedQuest.color}
                          frequency={selectedQuest.frequency}
                          date={selectedQuest.date}
                          month={calendarMonth}
                          setMonth={setCalendarMonth}
                          onPick={(iso) => changeDate(selectedQuest.id, iso)}
                        />
                      </div>
                    </div>
                  )}
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
                      <div className="font-vt text-2xl">{achCount.unlocked}/{achCount.total}</div>
                    </div>
                  </div>
                  <div onClick={() => navigate('/hero')} className="bg-[#111] p-3 rounded-lg border border-[#333] flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
                    <Shield className="w-6 h-6 text-[#FF5DA2]" />
                    <div>
                      <div className="font-pixel text-[8px] text-white/50">HERO</div>
                      <div className="font-vt text-2xl text-[#FF5DA2]">{heroCount.unlocked}/{heroCount.total}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/80 border-2 border-[#333] rounded-2xl p-6">
                <h3 className="font-pixel text-xs text-white/70 mb-6 tracking-widest">SYSTEM LOGS</h3>
                <div className="space-y-4">
                  {activityLog.length === 0 && (
                    <p className="font-vt text-sm text-white/40">No quests completed yet.</p>
                  )}
                  {activityLog.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: item.color, color: item.color }}></div>
                      <div>
                        <p className="font-sans text-sm text-white/90">Completed '{item.title}' (+{item.xp} XP)</p>
                        <p className="font-vt text-sm text-white/40">{timeAgo(item.completedAt)}</p>
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
      </nav>

    </div>
  );
}