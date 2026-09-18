import React from 'react';
import {
  Trophy,
} from 'lucide-react';

export const GamificationSection: React.FC = () => {
  const sampleBadges = [
    { icon: '🎒', name: 'First Day at School', desc: 'Stepped onto the DigiGuru Campus' },
    { icon: '⭐', name: 'Counting Star', desc: 'Learned numbers 1 to 5 with Guru-Bot' },
    { icon: '🐘', name: 'Safari Ranger', desc: 'Summoned the 3D Elephant AR Hologram' },
    { icon: '🚩', name: 'Shivaji Scholar', desc: 'Explored the central memorial plaza' },
    { icon: '🔔', name: 'Punctual Learner', desc: 'Attended all morning periods on schedule' },
  ];

  return (
    <section id="studentlife" className="py-20 relative bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Engaging Gamification Economy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Learn, Earn{' '}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              DigiStars & Badges
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Education becomes an adventure when progress is celebrated. Every completed lesson,
            on-time bell response, and landmark quest rewards you with DigiStars and collectible badges.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center text-2xl mb-4">
              ⭐
            </div>
            <h3 className="font-extrabold text-slate-100 text-base mb-2">DigiStars Economy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn stars by answering interactive lesson questions, ringing the school bell, and exploring new campus sectors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-2xl mb-4">
              🎒
            </div>
            <h3 className="font-extrabold text-slate-100 text-base mb-2">Virtual 3D Backpack</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Carry your student profile, unlocked achievement badges, and current academic standard wherever you walk.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 text-pink-300 flex items-center justify-center text-2xl mb-4">
              🔔
            </div>
            <h3 className="font-extrabold text-slate-100 text-base mb-2">School Bell Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Realistic timetable schedule cycling between Morning Assembly, Period 1, Recess, and Period 2 with audio chimes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-2xl mb-4">
              🙌
            </div>
            <h3 className="font-extrabold text-slate-100 text-base mb-2">3D Social Emotes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express enthusiasm anytime! Trigger joyful wave, celebration cheer, and peaceful sit animations in the 3D space.
            </p>
          </div>
        </div>

        {/* Sample Badges Showcase */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Collectible Campus Badges</h3>
              <p className="text-xs text-slate-400">Unlock these milestone badges in your 3D student backpack.</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Permanent Sync
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {sampleBadges.map((b, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center text-center hover:scale-105 transition-transform"
              >
                <span className="text-3xl mb-2">{b.icon}</span>
                <span className="text-xs font-bold text-slate-200 mb-1">{b.name}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
