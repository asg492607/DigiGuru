import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Play,
  Award,
  Building2,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context';
import { soundManager } from '../../utils/audio';

interface LandingHeroProps {
  onEnterCampus: () => void;
  onOpenMap: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterCampus, onOpenMap }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b15_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Pill Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-emerald-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide shadow-lg shadow-amber-500/10">
              <span className="text-sm">🚩</span>
              <span>Chhatrapati Shivaji Maharaj Memorial Campus • India</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Nursery to Grade 12 Metaverse</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-100 leading-[1.1] mb-6">
            Where Modern Education{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              Meets the 3D Metaverse
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto mb-10">
            Step directly onto India’s premier digital school campus. Stroll down the Grand Boulevard,
            sit in rainbow-lit smart classrooms, study with AI Teachers Miss Maya & Guru-Bot,
            summon 3D AR holograms, and master 15 academic standards in real-time WebGL.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => {
                soundManager.playClick();
                onEnterCampus();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-extrabold text-base shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-500/60 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-indigo-400/30"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{isAuthenticated ? 'Resume 3D Campus Experience' : 'Launch 3D Campus Tour'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  openAuthModal('register');
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white font-bold text-base border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 backdrop-blur-md shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Enroll Free (+50 DigiStars)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenMap();
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white font-bold text-base border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 backdrop-blur-md shadow-lg"
              >
                <Compass className="w-5 h-5 text-blue-400" />
                <span>Open Campus Blueprint</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Counter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
                <Building2 className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-100">15</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">Academic Standards</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Nursery to Class 12</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-pink-400 mb-1">
                <Compass className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-100">25+</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">Campus Zones</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Labs, Arena, Quad, Labs</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                <Cpu className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-100">2 AI</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">Teacher Avatars</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Miss Maya & Guru-Bot</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
                <Award className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-100">100%</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">Interactive 3D</p>
              <p className="text-[10px] text-slate-500 mt-0.5">WebGL in Browser</p>
            </div>
          </div>
        </div>

        {/* Hero 3D Campus Feature Card Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 md:p-6 shadow-2xl shadow-indigo-950/50">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                digiguru.campus.webgl // live_render_mode
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Realtime 3D Engine Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => {
                soundManager.playClick();
                onEnterCampus();
              }}
              className="cursor-pointer group p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/60 hover:border-indigo-500/60 transition-all hover:scale-[1.02]"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚩</div>
              <h3 className="font-bold text-slate-100 text-sm mb-1 group-hover:text-indigo-300">
                Chhatrapati Shivaji Memorial
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Central bronze equestrain monument flanked by stone plinths and Maratha cultural emblems.
              </p>
            </div>

            <div
              onClick={() => {
                soundManager.playClick();
                onEnterCampus();
              }}
              className="cursor-pointer group p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/60 hover:border-pink-500/60 transition-all hover:scale-[1.02]"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏫</div>
              <h3 className="font-bold text-slate-100 text-sm mb-1 group-hover:text-pink-300">
                Nursery Smart Wing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step inside the classroom to study counting, animal safari, and summon the 3D Elephant AR Hologram!
              </p>
            </div>

            <div
              onClick={() => {
                soundManager.playClick();
                onEnterCampus();
              }}
              className="cursor-pointer group p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/60 transition-all hover:scale-[1.02]"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="font-bold text-slate-100 text-sm mb-1 group-hover:text-cyan-300">
                Dual AI Teachers
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toggle between human mentor Miss Maya with real-time speech, or the high-tech Guru-Bot AI!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
