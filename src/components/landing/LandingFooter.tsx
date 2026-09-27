import React from 'react';
import { Sparkles, ArrowUp, ArrowRight, Globe, Shield } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface LandingFooterProps {
  onEnterCampus: () => void;
  onOpenMap: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onEnterCampus, onOpenMap }) => {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040a15] border-t border-slate-800/60 text-slate-400 text-xs overflow-hidden">
      {/* Top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="section-glow-divider" />

      {/* Main footer CTA band */}
      <div className="relative px-4 py-12 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40 border border-indigo-500/20 p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Floating sparkles */}
            <div className="absolute top-4 left-8 text-indigo-400/20 text-4xl pointer-events-none animate-float">✦</div>
            <div className="absolute bottom-4 right-8 text-purple-400/20 text-3xl pointer-events-none animate-float-slow">✦</div>
            <div className="absolute top-8 right-20 text-pink-400/15 text-2xl pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}>✦</div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus is open & accepting new students</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Ready to Walk the<br />
              <span className="text-gradient-blue-pink">DigiGuru Campus?</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of students attending India's first 3D school metaverse — complete with AI teachers,
              AR holograms, real timetables, and Indian cultural heritage at its heart.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => { soundManager.playClick(); onEnterCampus(); }}
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-extrabold text-sm shadow-2xl shadow-indigo-700/40 hover:shadow-indigo-500/60 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 border border-indigo-400/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-4 h-4" />
                <span>Enter 3D Campus Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => { soundManager.playClick(); onOpenMap(); }}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-bright border border-slate-600/50 text-slate-200 hover:text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
              >
                View Campus Blueprint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/50">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-gradient-blue-pink">
                  DigiGuru
                </span>
                <span className="block text-[10px] text-slate-600">
                  3D Digital School Metaverse • India
                </span>
              </div>
            </div>

            <p className="text-slate-500 leading-relaxed max-w-sm text-[12px]">
              Empowering K-12 learners across India with immersive 3D spatial classrooms, conversational
              AI faculty, gamified DigiStars, and deep-rooted Indian cultural heritage at campus center.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                <Shield className="w-3 h-3" />
                <span>Student Safe</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold">
                <Globe className="w-3 h-3" />
                <span>Made in India</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold">
                <span>🚩</span>
                <span>CBSE Aligned</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => { soundManager.playClick(); onEnterCampus(); }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                Launch Campus Tour
              </button>
              <button
                onClick={() => { soundManager.playClick(); onOpenMap(); }}
                className="px-4 py-2 rounded-xl glass border border-slate-700/40 text-slate-300 font-semibold text-xs hover:text-white transition-all hover:border-slate-600/60"
              >
                Blueprint Map
              </button>
            </div>
          </div>

          {/* Campus Links */}
          <div>
            <h4 className="text-slate-200 font-black uppercase tracking-widest text-[11px] mb-4">Campus</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Campus Overview', href: '#overview' },
                { label: '15 Standards', href: '#academics' },
                { label: 'AI Teachers', href: '#faculty' },
                { label: 'Shivaji Memorial', href: '#landmarks' },
                { label: 'DigiStars & Badges', href: '#studentlife' },
                { label: 'FAQ', href: '#faq' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-indigo-300 transition-colors text-[12px]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="text-slate-200 font-black uppercase tracking-widest text-[11px] mb-4">Academic Wings</h4>
            <ul className="space-y-2.5">
              {[
                '🌸 Early Years (Nursery → Sr. KG)',
                '📗 Primary (Grades 1 – 5)',
                '🔬 Middle School (Grades 6 – 8)',
                '📐 Secondary (Grades 9 & 10)',
                '🚀 Sr. Secondary (Grades 11 & 12)',
              ].map((l) => (
                <li key={l} className="text-[12px] text-slate-500">{l}</li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-slate-200 font-black uppercase tracking-widest text-[11px] mb-4">Technology</h4>
            <ul className="space-y-2.5">
              {[
                '⚡ WebGL 3D Engine',
                '🎯 Three.js + R3F',
                '🗣️ Web Speech API',
                '🔊 3D Spatial Audio',
                '💾 Persistent Storage',
                '📱 Mobile First',
                '🌐 No Download',
              ].map((l) => (
                <li key={l} className="text-[12px] text-slate-500">{l}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} DigiGuru Metaverse School • Honoring Chhatrapati Shivaji Maharaj
            </p>
            <p className="text-[10px] text-slate-700 mt-0.5">
              Built for India's Future Leaders • Powered by WebGL & Web AI
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Online</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold px-3 py-1.5 rounded-lg glass border border-slate-700/30 hover:border-indigo-500/25"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
