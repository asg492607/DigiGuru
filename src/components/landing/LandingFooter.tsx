import React from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';
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
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent">
                  DigiGuru
                </span>
                <span className="block text-[10px] text-slate-500">
                  3D Digital School Metaverse • India
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Empowering K-12 learners with immersive 3D spatial classrooms, conversational AI faculty,
              gamified DigiStars, and honoring Indian cultural heritage.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onEnterCampus();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                Launch Campus Tour
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenMap();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all"
              >
                Blueprint Map
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-200 font-bold uppercase tracking-wider mb-3">Campus</h4>
            <ul className="space-y-2">
              <li>
                <a href="#overview" className="hover:text-indigo-300 transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-indigo-300 transition-colors">
                  15 Standards
                </a>
              </li>
              <li>
                <a href="#faculty" className="hover:text-indigo-300 transition-colors">
                  AI Teachers
                </a>
              </li>
              <li>
                <a href="#landmarks" className="hover:text-indigo-300 transition-colors">
                  Shivaji Memorial
                </a>
              </li>
              <li>
                <a href="#studentlife" className="hover:text-indigo-300 transition-colors">
                  DigiStars & Badges
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Wings */}
          <div>
            <h4 className="text-slate-200 font-bold uppercase tracking-wider mb-3">Divisions</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">Early Years (Nursery - Sr KG)</span>
              </li>
              <li>
                <span className="text-slate-400">Primary (Grades 1 - 5)</span>
              </li>
              <li>
                <span className="text-slate-400">Middle School (Grades 6 - 8)</span>
              </li>
              <li>
                <span className="text-slate-400">Secondary (Grades 9 & 10)</span>
              </li>
              <li>
                <span className="text-slate-400">Senior Secondary (11 & 12)</span>
              </li>
            </ul>
          </div>

          {/* Technology & Core */}
          <div>
            <h4 className="text-slate-200 font-bold uppercase tracking-wider mb-3">Technology</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">WebGL 3D Engine</span>
              </li>
              <li>
                <span className="text-slate-400">Three.js & React Fiber</span>
              </li>
              <li>
                <span className="text-slate-400">Web Speech Synthesis</span>
              </li>
              <li>
                <span className="text-slate-400">3D Spatial Audio</span>
              </li>
              <li>
                <span className="text-slate-400">Persistent Local Storage</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} DigiGuru Metaverse School. Built for India's Future Leaders.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
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
