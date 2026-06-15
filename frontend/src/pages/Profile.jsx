import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Calendar, Shield, 
  Activity, Cpu, Zap, Edit2, Save, X, Camera, 
  TerminalSquare, Loader2, Sparkles
} from 'lucide-react';

export default function ProfileApp() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoreLoading, setIsLoreLoading] = useState(false);

  // Initial Profile Data
  const [profile, setProfile] = useState({
    username: 'PLAYER_ONE',
    title: 'CYBER HACKER',
    email: 'player.one@secondbrain.net',
    bio: 'Just trying to survive the daily grind and level up my coding skills. 14-day streak intact.',
    joinDate: '12 OCT 2025',
    level: 24,
    xp: '12,450',
    color: '#5CE1E6', // Ghost Cyan
    stats: {
      focus: 85,
      consistency: 90,
      creativity: 60,
      stamina: 75
    }
  });

  // Temp Data for Editing
  const [editData, setEditData] = useState({ ...profile });

  const handleEditToggle = () => {
    setEditData({ ...profile }); // Reset temp data to current profile
    setIsEditing(!isEditing);
  };

  const generateLore = async () => {
    setIsLoreLoading(true);
    const apiKey = ""; // API Key will be injected by the environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const baseBio = editData.bio || "Just a normal person trying to level up in life.";
    const prompt = `You are a futuristic cyberpunk RPG lore writer. Take this brief user bio idea: "${baseBio}". Rewrite it into a badass, 1-2 sentence character background. It MUST be under 120 characters total. Return ONLY the text, no quotes, no extra formatting.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    let retries = 0;
    const maxRetries = 3;

    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error!`);
        
        const data = await response.json();
        // Take the response, trim whitespace, remove quotes if AI added them, and enforce 120 char limit
        let generatedText = data.candidates[0].content.parts[0].text.trim().replace(/^"|"$/g, '').substring(0, 120);
        setEditData(prev => ({ ...prev, bio: generatedText }));
        break;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
           console.error('Failed to generate lore');
        } else {
           await new Promise(r => setTimeout(r, Math.pow(2, retries - 1) * 1000));
        }
      }
    }
    setIsLoreLoading(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API Call
    setTimeout(() => {
      setProfile({ ...editData });
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

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

      /* Comic Button & Shadows */
      .btn-comic { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .btn-comic:hover { transform: translate(-4px, -4px); box-shadow: 6px 6px 0px 0px currentColor; }
      .btn-comic:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px currentColor; }

      /* Animations */
      @keyframes popIn {
        0% { transform: scale(0.9) translateY(20px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      .animate-pop { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

      @keyframes scanlineDown {
        0% { transform: translateY(-100%); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translateY(500px); opacity: 0; }
      }
      .id-scanline {
        position: absolute; top: 0; left: 0; width: 100%; height: 10px;
        background: linear-gradient(to bottom, transparent, rgba(92, 225, 230, 0.5), transparent);
        animation: scanlineDown 3s linear infinite; pointer-events: none; z-index: 20;
      }

      /* Custom Input */
      .arcade-input {
        background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; transition: all 0.3s ease;
      }
      .arcade-input:focus {
        outline: none; border-color: var(--focus-color); box-shadow: 0 0 15px var(--focus-glow);
      }
    `}} />
  );

  return (
    <div className="min-h-screen bg-[#050505] crt pixel-grid relative flex flex-col selection:bg-[#FFD60A] selection:text-black pb-20">
      <CustomStyles />

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b-2 border-white/10 pt-8 pb-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center relative">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#00B4FF] font-pixel text-[10px] hover:text-[#FFD60A] hover:drop-shadow-[0_0_8px_#FFD60A] transition-all self-start">
              <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
            </button>
            <h1 className="font-pixel text-2xl md:text-3xl text-white drop-shadow-[0_0_10px_white] flex items-center gap-4 mt-2">
              <User className="w-8 h-8 md:w-10 md:h-10 text-[#5CE1E6]" /> 
              PLAYER IDENTITY
            </h1>
          </div>

          {!isEditing && (
            <button 
              onClick={handleEditToggle}
              className="bg-transparent text-[#5CE1E6] border-2 border-[#5CE1E6] font-pixel text-[10px] py-3 px-6 hover:bg-[#5CE1E6] hover:text-black transition-all flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> EDIT IDENTITY
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto w-full px-6 md:px-12 mt-10 z-10 flex-1 relative grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Holographic ID Card */}
        <div className="lg:col-span-5 flex flex-col gap-6 animate-pop">
          <div 
            className="bg-[#0D0D0D] border-4 rounded-2xl p-6 relative overflow-hidden shadow-2xl group"
            style={{ borderColor: profile.color, boxShadow: `0 0 30px ${profile.color}20` }}
          >
            {/* Hologram ID Scanline Effect */}
            <div className="id-scanline"></div>
            
            {/* Watermark / Background Logo */}
            <Shield className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 rotate-12 pointer-events-none" style={{ color: profile.color }} />

            <div className="flex justify-between items-start mb-8">
              <div className="font-pixel text-[10px] bg-white/10 px-3 py-1 rounded border border-white/20" style={{ color: profile.color }}>
                CLASSIFIED ID
              </div>
              <div className="font-vt text-2xl opacity-50">#SB-2026</div>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center mb-8 relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-black border-4 rounded-full flex items-center justify-center relative overflow-hidden" style={{ borderColor: profile.color, boxShadow: `0 0 20px ${profile.color}50` }}>
                <div className="text-6xl group-hover:scale-110 transition-transform">😎</div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                    <Camera className="w-8 h-8 text-white animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 bg-black border-2 px-4 py-1 rounded-full flex items-center gap-2 transform translate-y-1/2" style={{ borderColor: profile.color }}>
                <span className="font-pixel text-[8px] text-white">LVL</span>
                <span className="font-vt text-2xl" style={{ color: profile.color }}>{profile.level}</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="font-pixel text-xl md:text-2xl text-white mb-2 break-all drop-shadow-[0_0_8px_currentColor]" style={{ color: profile.color }}>
                {profile.username}
              </h2>
              <p className="font-vt text-2xl text-white/50">{profile.title}</p>
            </div>

            {/* RPG Stats Mini-Dashboard */}
            <div className="space-y-4 border-t-2 border-dashed pt-6" style={{ borderColor: `${profile.color}40` }}>
              <div className="flex justify-between font-pixel text-[8px] text-white/50 mb-4">
                <span>COMBAT STATS</span>
                <span>UPLINKED</span>
              </div>
              
              {[
                { name: 'FOCUS', val: profile.stats.focus, icon: <Activity className="w-3 h-3" /> },
                { name: 'CONSISTENCY', val: profile.stats.consistency, icon: <Calendar className="w-3 h-3" /> },
                { name: 'CREATIVITY', val: profile.stats.creativity, icon: <Sparkles className="w-3 h-3" /> },
                { name: 'STAMINA', val: profile.stats.stamina, icon: <Zap className="w-3 h-3" /> }
              ].map(stat => (
                <div key={stat.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-pixel text-[8px] text-white flex items-center gap-2">
                      {stat.icon} {stat.name}
                    </span>
                    <span className="font-vt text-lg" style={{ color: profile.color }}>{stat.val}</span>
                  </div>
                  <div className="w-full h-2 bg-black border border-white/20 rounded overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${stat.val}%`, backgroundColor: profile.color, boxShadow: `0 0 10px ${profile.color}` }}></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Details or Edit Form */}
        <div className="lg:col-span-7 flex flex-col gap-6 animate-pop" style={{ animationDelay: '0.1s' }}>
          
          {!isEditing ? (
            // === VIEW MODE ===
            <div className="space-y-6">
              
              {/* Bio & Details Box */}
              <div className="bg-[#0D0D0D] border-2 border-[#333] rounded-2xl p-6 md:p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD60A]/5 rounded-full blur-[40px] pointer-events-none"></div>
                
                <h3 className="font-pixel text-sm text-[#FFD60A] mb-6 flex items-center gap-3 drop-shadow-[0_0_5px_#FFD60A]">
                  <TerminalSquare className="w-5 h-5" /> DOSSIER
                </h3>
                
                <div className="bg-white/5 border-l-4 p-4 rounded-r-lg mb-8" style={{ borderColor: profile.color }}>
                  <p className="font-sans text-base md:text-lg text-white/90 leading-relaxed italic">
                    "{profile.bio}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                    <div className="font-pixel text-[8px] text-white/40 mb-2 flex items-center gap-2"><Mail className="w-3 h-3" /> COMM-LINK</div>
                    <div className="font-sans text-sm text-white/90 truncate">{profile.email}</div>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                    <div className="font-pixel text-[8px] text-white/40 mb-2 flex items-center gap-2"><Calendar className="w-3 h-3" /> AWAKENED ON</div>
                    <div className="font-sans text-sm text-white/90">{profile.joinDate}</div>
                  </div>
                </div>
              </div>

              {/* Active Buffs / Equipment */}
              <div className="bg-[#0D0D0D] border-2 border-[#333] rounded-2xl p-6 md:p-8">
                <h3 className="font-pixel text-sm text-[#A3FF12] mb-6 flex items-center gap-3 drop-shadow-[0_0_5px_#A3FF12]">
                  <Cpu className="w-5 h-5" /> ACTIVE BUFFS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-black border border-[#A3FF12]/30 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#A3FF12]/10 rounded border border-[#A3FF12] flex items-center justify-center text-[#A3FF12]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-sm text-white">XP Multiplier</div>
                      <div className="font-vt text-lg text-[#A3FF12]">1.5x ACTIVE</div>
                    </div>
                  </div>
                  <div className="bg-black border border-[#FF5DA2]/30 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FF5DA2]/10 rounded border border-[#FF5DA2] flex items-center justify-center text-[#FF5DA2]">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-sm text-white">Distraction Shield</div>
                      <div className="font-vt text-lg text-[#FF5DA2]">Equipped</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            // === EDIT MODE ===
            <div className="bg-[#0D0D0D] border-2 border-[#5CE1E6] rounded-2xl p-6 md:p-8 relative shadow-[0_0_30px_rgba(92,225,230,0.15)]">
              <div className="flex justify-between items-center mb-8 border-b-2 border-white/10 pb-4">
                <h3 className="font-pixel text-sm text-[#5CE1E6] flex items-center gap-3 drop-shadow-[0_0_5px_#5CE1E6]">
                  <Edit2 className="w-5 h-5" /> OVERRIDE PROTOCOL
                </h3>
                <button onClick={handleEditToggle} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6" style={{ '--focus-color': profile.color, '--focus-glow': `${profile.color}50` }}>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Edit Username */}
                  <div>
                    <label className="block font-pixel text-[8px] text-white/50 mb-2">PLAYER TAG</label>
                    <input 
                      type="text" 
                      value={editData.username}
                      onChange={(e) => setEditData({...editData, username: e.target.value})}
                      className="w-full arcade-input p-3 rounded-lg font-vt text-xl"
                      maxLength={15}
                      required
                      disabled={isSaving}
                    />
                  </div>

                  {/* Edit Title */}
                  <div>
                    <label className="block font-pixel text-[8px] text-white/50 mb-2">CLASS TITLE</label>
                    <select 
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="w-full arcade-input p-3 rounded-lg font-vt text-xl cursor-pointer"
                      disabled={isSaving}
                    >
                      <option value="CYBER HACKER">CYBER HACKER</option>
                      <option value="NEON ARTIST">NEON ARTIST</option>
                      <option value="STREET SAMURAI">STREET SAMURAI</option>
                    </select>
                  </div>
                </div>

                {/* Edit Email */}
                <div>
                  <label className="block font-pixel text-[8px] text-white/50 mb-2">COMM-LINK (EMAIL)</label>
                  <input 
                    type="email" 
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full arcade-input p-3 rounded-lg font-sans text-sm"
                    required
                    disabled={isSaving}
                  />
                </div>

                {/* Edit Bio */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block font-pixel text-[8px] text-white/50">BIOGRAPHY (LORE)</label>
                    <button 
                      type="button"
                      onClick={generateLore}
                      disabled={isLoreLoading || isSaving}
                      className="text-[#FFD60A] font-pixel text-[8px] flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isLoreLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI LORE ✨
                    </button>
                  </div>
                  <textarea 
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="w-full arcade-input p-3 rounded-lg font-sans text-sm h-32 resize-none"
                    maxLength={120}
                    disabled={isSaving || isLoreLoading}
                  />
                  <div className="text-right mt-1 font-vt text-sm text-white/30">{editData.bio.length}/120</div>
                </div>

                <div className="border-t-2 border-white/10 pt-6 mt-8 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                    className="font-pixel text-[10px] px-6 py-4 text-white/70 hover:text-white hover:bg-white/10 rounded border border-transparent transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="font-pixel text-[10px] px-8 py-4 text-black bg-[#5CE1E6] rounded border-2 border-white comic-shadow-cyan btn-comic flex items-center justify-center gap-2 min-w-[150px] disabled:opacity-70 disabled:hover:transform-none disabled:shadow-none"
                    style={{ backgroundColor: profile.color, boxShadow: !isSaving ? `4px 4px 0 0 ${profile.color}` : 'none' }}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> COMMIT</>}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
