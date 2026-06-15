import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Trash2, Target, Cpu, 
  ShieldAlert, Zap, Users, CheckCircle2, Radar, X
} from 'lucide-react';

export default function NotificationsApp() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [isPurging, setIsPurging] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null); // State untuk Pop-up
  
  // Dummy Notification Data
  const [logs, setLogs] = useState([
    {
      id: 1,
      type: 'ALERT',
      title: 'STREAK WARNING',
      message: 'Your 14-Day combo is in danger! Complete a quest before midnight.',
      time: '10 mins ago',
      read: false,
      color: '#FF003C', // Danger Red
      icon: <ShieldAlert className="w-6 h-6" />
    },
    {
      id: 2,
      type: 'QUEST',
      title: 'QUEST COMPLETED',
      message: 'You vanquished "The Ceramic Horde" (Wash Dishes). +50 XP added to your core.',
      time: '1 hour ago',
      read: false,
      color: '#A3FF12', // Matrix Green
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 3,
      type: 'SYSTEM',
      title: 'ACHIEVEMENT UNLOCKED',
      message: 'Badge Unlocked: "EARLY BIRD". Reward: Rare Profile Aura.',
      time: '3 hours ago',
      read: true,
      color: '#FFD60A', // Pac Yellow
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 4,
      type: 'SOCIAL',
      title: 'GUILD ACTIVITY',
      message: 'Player_Two just beat your Focus Arena record by 15 minutes.',
      time: '5 hours ago',
      read: false,
      color: '#00B4FF', // Maze Blue
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 5,
      type: 'SYSTEM',
      title: 'UPLINK ESTABLISHED',
      message: 'Second Brain OS V.2.0.4 successfully installed. New AI Oracle features are now online.',
      time: '1 day ago',
      read: true,
      color: '#6A4CFF', // Purple
      icon: <Cpu className="w-6 h-6" />
    }
  ]);

  const unreadCount = logs.filter(log => !log.read).length;

  const markAsRead = (id) => {
    setLogs(logs.map(log => log.id === id ? { ...log, read: true } : log));
  };

  const handleLogClick = (log) => {
    if (!log.read) markAsRead(log.id);
    setSelectedLog(log); // Buka pop-up dengan data log yang diklik
  };

  const purgeLogs = () => {
    setIsPurging(true);
    setTimeout(() => {
      setLogs(logs.filter(log => !log.read)); // Hapus yang sudah dibaca saja
      setIsPurging(false);
    }, 800);
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !log.read;
    return log.type === filter;
  });

  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
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

      /* Radar Animation Background */
      @keyframes radarSweep {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .radar-bg {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 800px; height: 800px; border-radius: 50%;
        border: 2px dashed rgba(0, 180, 255, 0.1);
        pointer-events: none; z-index: 0;
      }
      .radar-bg::after {
        content: ""; position: absolute; top: 50%; left: 50%;
        width: 400px; height: 400px;
        background: conic-gradient(from 0deg, transparent 70%, rgba(0, 180, 255, 0.2) 100%);
        transform-origin: 0 0;
        animation: radarSweep 4s linear infinite;
      }

      /* Unread LED Blink */
      @keyframes blinkLED {
        0%, 100% { opacity: 1; box-shadow: 0 0 10px currentColor; }
        50% { opacity: 0.3; box-shadow: none; }
      }
      .led-blink { animation: blinkLED 1.5s infinite; }

      /* Slide In Animation for List */
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-slide { animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

      /* Glitch Purge Effect */
      @keyframes purgeGlitch {
        0% { transform: scale(1) skewX(0); filter: hue-rotate(0); opacity: 1; }
        20% { transform: scale(1.05) skewX(10deg); filter: hue-rotate(90deg) invert(1); opacity: 0.8; }
        40% { transform: scale(0.95) skewX(-10deg); filter: hue-rotate(180deg); opacity: 0.9; }
        60% { transform: scale(1.1) skewX(5deg); filter: invert(1); opacity: 0.5; }
        80% { transform: scale(0.9) skewX(-5deg); filter: hue-rotate(270deg); opacity: 0.2; }
        100% { transform: scale(0) skewX(0); filter: hue-rotate(0); opacity: 0; }
      }
      .purging { animation: purgeGlitch 0.8s forwards; pointer-events: none; }

      /* Modal Fade In & Scanline */
      @keyframes fadeIn {
        from { opacity: 0; backdrop-filter: blur(0px); }
        to { opacity: 1; backdrop-filter: blur(8px); }
      }
      .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      
      @keyframes scanlineDown {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(600px); }
      }
      .scanline-bar { animation: scanlineDown 3s linear infinite; }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#050505] crt pixel-grid relative flex flex-col selection:bg-[#FFD60A] selection:text-black pb-20">
      <CustomStyles />
      <div className="radar-bg"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b-2 border-white/10 pt-8 pb-4 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center relative">
          
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all self-start">
              <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
            </button>
            <h1 className="font-pixel text-2xl md:text-3xl text-white drop-shadow-[0_0_10px_white] flex items-center gap-4 mt-2">
              <Bell className={`w-8 h-8 md:w-10 md:h-10 ${unreadCount > 0 ? 'text-[#FF5DA2] animate-bounce' : 'text-white/50'}`} /> 
              TRANSMISSIONS
            </h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="font-vt text-xl text-white/50">
              <span className="text-[#FF5DA2] drop-shadow-[0_0_5px_#FF5DA2]">{unreadCount}</span> UNREAD
            </div>
            <button 
              onClick={purgeLogs}
              disabled={isPurging}
              className="bg-transparent text-white/50 font-pixel text-[8px] py-2 px-4 border border-white/20 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" /> PURGE READ
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto w-full px-6 md:px-12 mt-8 z-10 flex-1 relative">
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar mb-6">
          {['ALL', 'UNREAD', 'QUEST', 'SYSTEM', 'ALERT', 'SOCIAL'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`font-vt text-xl px-4 py-1 rounded border transition-all shrink-0 ${
                filter === f 
                  ? 'bg-white text-black border-white shadow-[0_0_10px_white]' 
                  : 'bg-transparent text-white/50 border-white/20 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className={`text-center py-32 flex flex-col items-center ${isPurging ? 'purging' : 'animate-pop'}`}>
            <div className="w-24 h-24 rounded-full border-4 border-[#00B4FF]/30 flex items-center justify-center mb-6 relative">
              <Radar className="w-12 h-12 text-[#00B4FF] opacity-50" />
              <div className="absolute inset-0 border-t-4 border-[#00B4FF] rounded-full animate-spin"></div>
            </div>
            <h2 className="font-pixel text-xl text-[#00B4FF] drop-shadow-[0_0_5px_#00B4FF]">NO SIGNALS DETECTED</h2>
            <p className="font-vt text-2xl text-white/40 mt-4">Your transmission logs are empty.</p>
          </div>
        )}

        {/* Notification List */}
        <div className={`space-y-4 ${isPurging ? 'purging' : ''}`}>
          {filteredLogs.map((log, index) => (
            <div 
              key={log.id}
              onClick={() => handleLogClick(log)}
              className={`relative bg-[#0D0D0D] border-2 rounded-xl p-5 md:p-6 transition-all duration-300 cursor-pointer animate-slide group hover:-translate-y-1 ${
                !log.read 
                  ? 'shadow-[0_0_15px_rgba(0,0,0,0.5)] border-solid hover:shadow-[4px_4px_0_0_currentColor]' 
                  : 'opacity-50 border-dashed border-white/20 hover:opacity-100 hover:border-white/50'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderColor: !log.read ? log.color : undefined,
                color: !log.read ? log.color : 'white'
              }}
            >
              {/* Unread Indicator LED */}
              {!log.read && (
                <div 
                  className="absolute top-4 right-4 w-3 h-3 rounded-full led-blink"
                  style={{ backgroundColor: log.color, color: log.color }}
                ></div>
              )}

              <div className="flex gap-4 md:gap-6">
                {/* Icon Box */}
                <div 
                  className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-black border-2 rounded-lg flex items-center justify-center relative overflow-hidden"
                  style={{ borderColor: !log.read ? log.color : '#333' }}
                >
                  <div className={`absolute inset-0 opacity-20 ${!log.read ? 'bg-current' : 'bg-white'}`}></div>
                  <div className={`relative z-10 ${!log.read ? '' : 'text-white/50'}`}>
                    {log.read ? <CheckCircle2 className="w-6 h-6" /> : log.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-1">
                    <h3 className="font-pixel text-[10px] md:text-xs tracking-wider" style={{ color: !log.read ? log.color : '#999' }}>
                      {log.title}
                    </h3>
                    <span className="font-vt text-lg text-white/40">{log.time}</span>
                  </div>
                  
                  <p className={`font-sans text-sm md:text-base leading-relaxed ${!log.read ? 'text-white/90' : 'text-white/50'}`}>
                    {log.message}
                  </p>

                  {/* System Tag */}
                  <div className="mt-4">
                    <span 
                      className="font-vt text-sm px-2 py-1 rounded border"
                      style={{ 
                        borderColor: !log.read ? `${log.color}50` : '#333',
                        color: !log.read ? log.color : '#666',
                        backgroundColor: !log.read ? `${log.color}10` : 'transparent'
                      }}
                    >
                      SYS_TAG: {log.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
            </div>
          ))}
        </div>

      </main>

      {/* POP-UP / MODAL DETAIL PESAN */}
      {selectedLog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedLog(null)} // Tutup pop-up jika background diklik
        >
          <div 
            className="relative w-full max-w-lg bg-[#050505] border-2 rounded-xl p-6 md:p-8 shadow-2xl animate-pop crt overflow-hidden cursor-default"
            style={{ 
              borderColor: selectedLog.color, 
              boxShadow: `0 0 40px ${selectedLog.color}40, inset 0 0 20px ${selectedLog.color}10` 
            }}
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area dalam modal diklik
          >
            {/* Decorative Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/30 shadow-[0_0_15px_white] opacity-50 scanline-bar pointer-events-none"></div>

            {/* Header Modal */}
            <div className="flex justify-between items-start mb-6 border-b-2 pb-4" style={{ borderColor: `${selectedLog.color}30` }}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-black border-2 flex items-center justify-center relative overflow-hidden" 
                  style={{ borderColor: selectedLog.color, color: selectedLog.color }}
                >
                  <div className="absolute inset-0 bg-current opacity-20"></div>
                  <div className="relative z-10 drop-shadow-[0_0_10px_currentColor] scale-125">
                    {selectedLog.icon}
                  </div>
                </div>
                <div>
                  <h2 className="font-pixel text-[10px] md:text-xs tracking-widest drop-shadow-[0_0_5px_currentColor]" style={{ color: selectedLog.color }}>
                    DECRYPTED_MSG
                  </h2>
                  <div className="font-vt text-xl text-white/50 mt-1">{selectedLog.time}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="text-white/50 hover:text-white hover:rotate-90 transition-all"
              >
                <X className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            </div>

            {/* Content Pesan */}
            <div className="mb-8 relative z-10">
              <div className="font-pixel text-[10px] text-[#00B4FF] mb-4 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00B4FF] rounded-sm animate-pulse"></span>
                SUBJECT: {selectedLog.title}
              </div>
              <p className="font-sans text-base md:text-lg leading-relaxed text-white/90 bg-white/5 p-4 md:p-6 rounded-lg border-l-4" style={{ borderColor: selectedLog.color }}>
                {selectedLog.message}
              </p>
            </div>

            {/* Footer Modal */}
            <div className="flex justify-between items-center mt-6">
              <span 
                className="font-vt text-lg px-3 py-1 rounded border"
                style={{ 
                  borderColor: `${selectedLog.color}50`, 
                  color: selectedLog.color, 
                  backgroundColor: `${selectedLog.color}10` 
                }}
              >
                SYS_TAG: {selectedLog.type}
              </span>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="font-pixel text-[10px] text-white/70 border-2 border-white/20 px-6 py-3 hover:bg-white/10 hover:text-white hover:border-white transition-all"
              >
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
