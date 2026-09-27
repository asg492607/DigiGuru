import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Play,
  Award,
  Building2,
  Cpu,
  Scan,
  Zap,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context';
import { soundManager } from '../../utils/audio';

interface LandingHeroProps {
  onEnterCampus: () => void;
  onOpenMap: () => void;
}

// Animated floating AR particle dots
const ARParticle: React.FC<{ delay: number; x: number; y: number; size: number; color: string }> = ({
  delay, x, y, size, color
}) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: color,
      opacity: 0.6,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + delay}s`,
      animation: `float ${4 + delay}s ease-in-out ${delay}s infinite`,
      boxShadow: `0 0 ${size * 2}px ${color}`,
    }}
  />
);

// Counter animation hook
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterCampus, onOpenMap }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showARHint, setShowARHint] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 100);
    const t2 = setTimeout(() => setShowARHint(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const studentsCount = useCountUp(24780, 2000, mounted);
  const zonesCount = useCountUp(25, 1200, mounted);

  const arParticles = [
    { x: 8, y: 20, size: 5, color: '#818cf8', delay: 0 },
    { x: 15, y: 65, size: 3, color: '#f472b6', delay: 1.2 },
    { x: 88, y: 18, size: 6, color: '#22d3ee', delay: 0.8 },
    { x: 82, y: 72, size: 4, color: '#a78bfa', delay: 1.8 },
    { x: 5, y: 85, size: 3, color: '#34d399', delay: 2.4 },
    { x: 93, y: 50, size: 5, color: '#fbbf24', delay: 0.5 },
    { x: 50, y: 8, size: 4, color: '#f472b6', delay: 3.1 },
    { x: 25, y: 95, size: 3, color: '#818cf8', delay: 1.6 },
    { x: 70, y: 90, size: 5, color: '#22d3ee', delay: 2.1 },
  ];

  return (
    <section ref={sectionRef} className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06091a] via-[#080d20] to-[#060c1a]" />

      {/* Animated grid */}
      <div className="absolute inset-0 animate-grid"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.07) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Large ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[900px] h-[900px] bg-gradient-radial from-indigo-600/12 via-purple-700/8 to-transparent rounded-full blur-3xl animate-drift pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none animate-drift" style={{ animationDelay: '5s' }} />
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-3xl pointer-events-none animate-drift" style={{ animationDelay: '10s' }} />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-600/6 rounded-full blur-3xl pointer-events-none" />

      {/* AR Floating Particles */}
      {arParticles.map((p, i) => (
        <ARParticle key={i} {...p} />
      ))}

      {/* AR Scan lines (decorative) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line"
          style={{ top: '30%' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">

          {/* Top pill badges */}
          <div
            className="inline-flex flex-wrap items-center justify-center gap-3 mb-8"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease' }}
          >
            {/* India badge */}
            <div className="ar-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-bold tracking-wide shadow-lg shadow-amber-900/20 glow-amber">
              <span className="text-sm">🚩</span>
              <span>Chhatrapati Shivaji Maharaj Memorial Campus • India</span>
            </div>

            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Live 3D Campus • {studentsCount.toLocaleString()} Students Online</span>
            </div>

            {/* AR badge */}
            <div className="ar-badge inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-xs font-semibold glow-indigo">
              <Scan className="w-3.5 h-3.5 text-cyan-400" />
              <span>AR Holograms • Nursery → Grade 12</span>
            </div>
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05] mb-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s ease 0.2s',
            }}
          >
            <span className="block text-slate-100">India's First</span>
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(99,102,241,0.5)]">
              3D School Metaverse
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-300 mt-2">
              with Real AR Classroom Experience
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-xl text-slate-400 font-normal leading-relaxed max-w-3xl mx-auto mb-10"
            style={{
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.9s ease 0.4s',
            }}
          >
            Walk the Grand Boulevard, attend real-time classes with AI Teachers Miss Maya & Guru-Bot,
            summon <span className="text-cyan-300 font-semibold">life-size 3D AR elephant holograms</span>, earn DigiStars,
            and experience a complete school day across 25+ campus zones — all in your browser.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.9s ease 0.6s' }}
          >
            <button
              onClick={() => { soundManager.playClick(); onEnterCampus(); }}
              className="group relative w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-extrabold text-base shadow-2xl shadow-indigo-700/50 hover:shadow-indigo-500/70 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-indigo-400/30 overflow-hidden"
              style={{ padding: '14px 36px' }}
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Play className="w-5 h-5 fill-white" />
              <span>{isAuthenticated ? 'Resume 3D Campus' : 'Launch 3D Campus Tour'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => { soundManager.playClick(); openAuthModal('register'); }}
                className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl glass-bright text-slate-100 hover:text-white font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 shadow-lg"
                style={{ padding: '14px 32px' }}
              >
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Enroll Free <span className="text-amber-400">(+50 DigiStars)</span></span>
              </button>
            ) : (
              <button
                onClick={() => { soundManager.playClick(); onOpenMap(); }}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl glass-bright text-slate-100 hover:text-white font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 shadow-lg"
                style={{ padding: '14px 32px' }}
              >
                <Compass className="w-5 h-5 text-blue-400 group-hover:rotate-45 transition-transform" />
                <span>Open Campus Blueprint</span>
              </button>
            )}
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.8s' }}
          >
            {[
              { icon: <Building2 className="w-5 h-5" />, value: '15', label: 'Academic Standards', sub: 'Nursery → Class 12', color: 'text-indigo-400', glow: 'shadow-indigo-900/40', border: 'border-indigo-500/20' },
              { icon: <Compass className="w-5 h-5" />, value: `${zonesCount}+`, label: 'Campus Zones', sub: 'Labs, Arena, Quad', color: 'text-pink-400', glow: 'shadow-pink-900/40', border: 'border-pink-500/20' },
              { icon: <Cpu className="w-5 h-5" />, value: '2 AI', label: 'Teacher Avatars', sub: 'Miss Maya & Guru-Bot', color: 'text-cyan-400', glow: 'shadow-cyan-900/40', border: 'border-cyan-500/20' },
              { icon: <Award className="w-5 h-5" />, value: '100%', label: 'Browser-Based', sub: 'No download needed', color: 'text-amber-400', glow: 'shadow-amber-900/40', border: 'border-amber-500/20' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`group p-4 rounded-2xl glass border ${stat.border} shadow-xl ${stat.glow} hover:scale-105 transition-all duration-300 cursor-default`}
              >
                <div className={`flex items-center justify-center gap-2 ${stat.color} mb-1.5`}>
                  <span className="group-hover:scale-110 transition-transform">{stat.icon}</span>
                  <span className="text-2xl font-black text-slate-100">{stat.value}</span>
                </div>
                <p className="text-xs text-slate-300 font-semibold">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hero Feature Preview Card ── */}
        <div
          className="mt-20 relative max-w-5xl mx-auto"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1.1s ease 1s' }}
        >
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-purple-600/10 rounded-3xl blur-2xl scale-105 pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden border border-indigo-500/25 glass shadow-2xl shadow-indigo-950/60">
            {/* Browser chrome bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/70 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/70 border border-slate-700/50">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-mono text-slate-400 select-text">
                    digiguru.school/campus/3d-metaverse
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Realtime 3D Engine Active</span>
              </div>
            </div>

            {/* Preview content: 3 feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
              {/* AR Classroom */}
              <div
                onClick={() => { soundManager.playClick(); onEnterCampus(); }}
                className="group cursor-pointer p-7 bg-gradient-to-br from-slate-900/60 to-slate-950/80 hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors" />

                {/* AR Hologram preview box */}
                <div className="relative w-full aspect-video rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-slate-950 to-indigo-950/80 border border-indigo-500/20 flex items-center justify-center ar-hologram">
                  <div className="text-5xl animate-float-slow select-none">🐘</div>
                  <div className="absolute bottom-2 left-2 right-2 h-6 flex items-center">
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/60 to-transparent" />
                    <span className="text-[9px] text-cyan-400 font-mono px-2 whitespace-nowrap">AR_HOLOGRAM_ACTIVE</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-cyan-400/60 to-transparent" />
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span className="text-[9px] text-cyan-400 font-mono">LIVE</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-1 block">Interactive AR</span>
                <h3 className="font-bold text-slate-100 text-sm mb-1.5 group-hover:text-pink-300 transition-colors">
                  Nursery Smart Classroom
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Study counting & animal safari then summon a life-size 3D Elephant hologram right in the classroom!
                </p>
                <div className="mt-3 flex items-center gap-1 text-pink-400 text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>Enter Classroom</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Shivaji Memorial */}
              <div
                onClick={() => { soundManager.playClick(); onEnterCampus(); }}
                className="group cursor-pointer p-7 bg-gradient-to-br from-slate-900/60 to-slate-950/80 hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />

                <div className="relative w-full aspect-video rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/20 flex items-center justify-center">
                  <div className="text-5xl animate-float select-none" style={{ animationDelay: '1s' }}>🚩</div>
                  {/* Decorative stone plinth lines */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1">
                    <div className="h-1.5 rounded-full bg-amber-800/40" />
                    <div className="h-2 rounded-sm bg-amber-800/30" />
                    <div className="h-3 rounded-sm bg-amber-900/40" />
                  </div>
                  <div className="absolute top-2 left-2 text-[9px] font-mono text-amber-500/70">SHIVAJI_MEMORIAL</div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1 block">Cultural Landmark</span>
                <h3 className="font-bold text-slate-100 text-sm mb-1.5 group-hover:text-amber-300 transition-colors">
                  Chhatrapati Shivaji Maharaj Memorial
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The central bronze equestrian monument flanked by saffron standards, celebrating Maratha heritage.
                </p>
                <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>Visit Memorial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Dual AI Teachers */}
              <div
                onClick={() => { soundManager.playClick(); onEnterCampus(); }}
                className="group cursor-pointer p-7 bg-gradient-to-br from-slate-900/60 to-slate-950/80 hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />

                <div className="relative w-full aspect-video rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/20 flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl animate-float-slow select-none" style={{ animationDelay: '0.5s' }}>👩‍🏫</span>
                    <span className="text-[9px] font-bold text-pink-400">Miss Maya</span>
                  </div>
                  <div className="w-px h-8 bg-slate-700" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl animate-float-slow select-none" style={{ animationDelay: '1.5s' }}>🤖</span>
                    <span className="text-[9px] font-bold text-cyan-400">Guru-Bot</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-[9px] font-mono text-cyan-400/70 text-center">AI_SPEECH_SYNTHESIS • ACTIVE</div>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1 block">AI Faculty</span>
                <h3 className="font-bold text-slate-100 text-sm mb-1.5 group-hover:text-cyan-300 transition-colors">
                  Dual AI Teacher System
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Toggle between human mentor Miss Maya with live speech, or the precision tech of Guru-Bot AI!
                </p>
                <div className="mt-3 flex items-center gap-1 text-cyan-400 text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>Meet the Faculty</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="px-5 py-2.5 border-t border-slate-800/70 bg-slate-950/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-4">
                <span className="text-emerald-400">● WebGL Active</span>
                <span className="text-cyan-400">● AR Engine Ready</span>
                <span className="text-pink-400">● Speech Synth Online</span>
              </div>
              <span className="hidden sm:block text-slate-600">Three.js r164 • React Three Fiber • WebSpeech API</span>
            </div>
          </div>

          {/* AR hint tooltip */}
          {showARHint && (
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-fadeIn whitespace-nowrap">
              <Scan className="w-3.5 h-3.5 animate-pulse" />
              <span>Click any zone card above to teleport directly there in 3D!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
