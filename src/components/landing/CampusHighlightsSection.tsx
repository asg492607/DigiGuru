import React from 'react';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Flame,
  Activity,
  Compass,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CampusHighlightsSectionProps {
  onEnterCampus: () => void;
  onOpenMap: () => void;
}

interface Landmark {
  title: string;
  category: string;
  icon: string;
  badge: string;
  description: string;
  coords: string;
  gradient: string;
}

const LANDMARKS: Landmark[] = [
  {
    title: 'Chhatrapati Shivaji Maharaj Memorial Plaza',
    category: 'Cultural Landmark',
    icon: '🚩',
    badge: 'Campus Center',
    description:
      'The crown jewel of DigiGuru: a magnificent bronze statue mounted on tiered stone steps with saffron standards, celebrating valor, leadership, and Indian heritage.',
    coords: '[0, 0, 5]',
    gradient: 'from-amber-600/30 to-orange-600/30',
  },
  {
    title: 'Nursery Wing & Rainbow Interactive Classroom',
    category: 'Early Learning',
    icon: '🧸',
    badge: 'Interactive AR',
    description:
      'A cozy learning sanctum with rainbow circle rugs, ABC & 123 wall posters, low wooden desks, and an AR projection pad for summoning life-sized 3D safari animals.',
    coords: '[-22, 0, 2]',
    gradient: 'from-pink-600/30 to-purple-600/30',
  },
  {
    title: 'High-Tech Innovation & Robotics Hub',
    category: 'Advanced STEM',
    icon: '🤖',
    badge: 'AI & Coding',
    description:
      'Home to Guru-Bot AI, coding terminals, 3D printing simulators, and physics sandbox arenas where middle & high schoolers build tomorrow’s tech.',
    coords: '[30, 0, -25]',
    gradient: 'from-cyan-600/30 to-blue-600/30',
  },
  {
    title: 'Grand Central Library & Archives',
    category: 'Academic Knowledge',
    icon: '📚',
    badge: 'Digital Library',
    description:
      'Two levels of towering wooden bookshelves, quiet study carrels, and digitized manuscripts spanning Vedic sciences to modern quantum mechanics.',
    coords: '[-30, 0, -25]',
    gradient: 'from-indigo-600/30 to-purple-600/30',
  },
  {
    title: 'Olympic Sports Arena & Pavilion',
    category: 'Athletics & Wellness',
    icon: '⚽',
    badge: 'Physical Health',
    description:
      'Full-size running tracks, basketball courts, and grassy playfields where students practice coordination, sportsmanship, and virtual outdoor emotes.',
    coords: '[35, 0, 25]',
    gradient: 'from-emerald-600/30 to-teal-600/30',
  },
  {
    title: 'Grand Boulevard & Reception Gates',
    category: 'Campus Arrival',
    icon: '🏛️',
    badge: 'Welcome Portal',
    description:
      'The ceremonial entrance portal framed by illuminated archways, solar lamp posts, manicured cypress trees, and interactive school noticeboards.',
    coords: '[0, 0, 56]',
    gradient: 'from-blue-600/30 to-indigo-600/30',
  },
];

export const CampusHighlightsSection: React.FC<CampusHighlightsSectionProps> = ({
  onEnterCampus,
  onOpenMap,
}) => {
  return (
    <section id="landmarks" className="py-20 relative bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Spatial Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
              Iconic Campus{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                Destinations
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Explore 25+ hand-crafted 3D zones designed to inspire curiosity, physical activity, and deep academic focus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenMap();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 shadow-md"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Full Campus Blueprint</span>
            </button>
          </div>
        </div>

        {/* Landmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANDMARKS.map((landmark, idx) => (
            <div
              key={idx}
              onClick={() => {
                soundManager.playClick();
                onEnterCampus();
              }}
              className="group cursor-pointer rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 p-6 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-indigo-950/40 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Accent Gradient */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${landmark.gradient}`}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                    {landmark.icon}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {landmark.badge}
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {landmark.coords}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  {landmark.category}
                </div>

                <h3 className="text-lg font-extrabold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2">
                  {landmark.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {landmark.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Teleport in 3D Campus</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
