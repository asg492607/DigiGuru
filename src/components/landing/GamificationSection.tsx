import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface GamificationSectionProps {
  onEnterCampus?: () => void;
}

export const GamificationSection: React.FC<GamificationSectionProps> = ({ onEnterCampus }) => {
  const [animatedStars, setAnimatedStars] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count += 7;
      if (count >= 248) {
        setAnimatedStars(248);
        clearInterval(timer);
      } else {
        setAnimatedStars(count);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle features
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(f => (f + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  const sampleBadges = [
    { icon: '🎒', name: 'First Day at School', desc: 'Stepped onto DigiGuru Campus', rarity: 'Common', color: 'border-slate-600' },
    { icon: '⭐', name: 'Counting Star', desc: 'Mastered numbers 1–10 with Guru-Bot', rarity: 'Uncommon', color: 'border-amber-500/50' },
    { icon: '🐘', name: 'Safari Ranger', desc: 'Summoned the 3D Elephant AR Hologram', rarity: 'Rare', color: 'border-pink-500/50' },
    { icon: '🚩', name: 'Shivaji Scholar', desc: 'Explored the central memorial plaza', rarity: 'Epic', color: 'border-orange-500/50' },
    { icon: '🔔', name: 'Punctual Learner', desc: 'Attended all morning timetable periods', rarity: 'Uncommon', color: 'border-blue-500/50' },
    { icon: '🤖', name: 'Tech Pioneer', desc: 'Switched to Guru-Bot mode 5 times', rarity: 'Rare', color: 'border-cyan-500/50' },
    { icon: '🏆', name: 'Campus Champion', desc: 'Explored all 25+ campus zones', rarity: 'Legendary', color: 'border-yellow-400/70' },
    { icon: '📚', name: 'Library Legend', desc: 'Visited the Grand Central Library', rarity: 'Common', color: 'border-indigo-500/50' },
  ];

  const rarityColors: Record<string, string> = {
    Common: 'text-slate-400',
    Uncommon: 'text-emerald-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-400',
    Legendary: 'text-yellow-400',
  };

  const features = [
    {
      icon: '⭐',
      title: 'DigiStars Economy',
      desc: 'Earn stars by answering lesson questions, ringing the school bell, and discovering new campus sectors. Stars persist between sessions.',
      color: 'bg-amber-500/15 border-amber-500/30 shadow-amber-900/30',
      iconBg: 'bg-amber-500/20 border-amber-500/30',
      textColor: 'text-amber-300',
    },
    {
      icon: '🎒',
      title: 'Virtual 3D Backpack',
      desc: 'Carry your student profile, unlocked badges, DigiStar count, and academic progress across all 15 grade levels.',
      color: 'bg-indigo-500/15 border-indigo-500/30 shadow-indigo-900/30',
      iconBg: 'bg-indigo-500/20 border-indigo-500/30',
      textColor: 'text-indigo-300',
    },
    {
      icon: '🔔',
      title: 'Real School Bell Engine',
      desc: 'A realistic timetable cycles through Morning Assembly, Period 1, Recess, Period 2 — with real audio bell chimes!',
      color: 'bg-pink-500/15 border-pink-500/30 shadow-pink-900/30',
      iconBg: 'bg-pink-500/20 border-pink-500/30',
      textColor: 'text-pink-300',
    },
    {
      icon: '🙌',
      title: '3D Social Emotes',
      desc: 'Express yourself with wave, celebration cheer, and peaceful sit animations — trigger them anywhere on campus in full 3D!',
      color: 'bg-cyan-500/15 border-cyan-500/30 shadow-cyan-900/30',
      iconBg: 'bg-cyan-500/20 border-cyan-500/30',
      textColor: 'text-cyan-300',
    },
  ];

  return (
    <section id="studentlife" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#06101c] via-[#07121e] to-[#06101c]" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-glow-divider" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Student Progression & Rewards System</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
            Learn, Earn{' '}
            <span className="text-gradient-amber">DigiStars & Badges</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Education becomes an adventure when every achievement is celebrated. Earn DigiStars,
            unlock collectible badges, respond to the school bell, and build your student legacy.
          </p>
        </div>

        {/* Live Star Counter + Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* Live counter card */}
          <div className="lg:col-span-1 glass-bright border border-amber-500/25 rounded-3xl p-7 shadow-2xl shadow-amber-950/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

            <div className="text-6xl mb-4 animate-float">⭐</div>
            <div className="text-6xl font-black text-amber-300 mb-1 font-mono">
              {animatedStars}
            </div>
            <div className="text-sm font-bold text-slate-300 mb-1">Your DigiStars</div>
            <div className="text-xs text-slate-500 mb-6">Earned this session</div>

            {/* Progress ring visual */}
            <div className="w-full bg-slate-800/50 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((animatedStars / 300) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500">{animatedStars}/300 to next rank: ⚡ DigiGuru Scholar</div>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>+10 stars for every correct answer</span>
            </div>
          </div>

          {/* 4 Feature cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                onClick={() => { soundManager.playClick(); setActiveFeature(i); }}
                className={`p-6 rounded-2xl border shadow-lg transition-all duration-300 cursor-pointer ${f.color} ${activeFeature === i ? 'scale-[1.02] ring-1 ring-white/10' : 'hover:scale-[1.01]'}`}
              >
                <div className={`w-12 h-12 rounded-xl ${f.iconBg} border flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className={`font-extrabold text-sm mb-2 ${f.textColor}`}>{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="glass-bright border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
            <div>
              <h3 className="text-xl font-black text-white mb-1">🏅 Collectible Campus Badges</h3>
              <p className="text-xs text-slate-400">Unlock rare & legendary badges — permanently stored in your 3D student backpack.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 text-[10px] font-bold flex-wrap">
                {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map(r => (
                  <span key={r} className={`px-2 py-0.5 rounded-full glass border border-slate-700/40 ${rarityColors[r]}`}>{r}</span>
                ))}
              </div>
              <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                Permanent Sync
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {sampleBadges.map((b, i) => (
              <div
                key={i}
                className={`group p-4 rounded-2xl glass border ${b.color} flex flex-col items-center text-center hover:scale-110 transition-all duration-300 cursor-pointer relative overflow-hidden`}
              >
                {/* Shimmer on hover */}
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{b.icon}</span>
                <span className="text-[10px] font-black text-slate-100 mb-1 leading-tight">{b.name}</span>
                <span className={`text-[9px] font-bold ${rarityColors[b.rarity]}`}>{b.rarity}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3].map(i => <Zap key={i} className="w-4 h-4 text-amber-400" />)}
              </div>
              <span className="text-sm text-slate-300 font-semibold">25+ unique badges to unlock across the campus</span>
            </div>
            {onEnterCampus && (
              <button
                onClick={() => { soundManager.playClick(); onEnterCampus(); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-amber-700/30"
              >
                <span>Start Earning Badges</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
