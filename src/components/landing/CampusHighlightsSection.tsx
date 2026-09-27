import React, { useState } from 'react';
import {
  ArrowRight,
  Compass,
  Scan,
  MapPin,
  Zap,
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
  borderColor: string;
  accentColor: string;
  arTag: string;
  features: string[];
}

const LANDMARKS: Landmark[] = [
  {
    title: 'Chhatrapati Shivaji Maharaj Memorial Plaza',
    category: 'Cultural Landmark',
    icon: '🚩',
    badge: 'Campus Center',
    description:
      'The crown jewel of DigiGuru: a magnificent bronze equestrian statue on tiered stone steps with saffron standards, Maratha cultural emblems, and a sacred courtyard.',
    coords: 'X:0, Z:5',
    gradient: 'from-amber-600/30 to-orange-600/20',
    borderColor: 'border-amber-500/30',
    accentColor: 'text-amber-400',
    arTag: 'Cultural AR Overlay',
    features: ['Bronze equestrian monument', 'Saffron flag standards', 'Interactive history plaques'],
  },
  {
    title: 'Nursery Smart Wing & Rainbow Classroom',
    category: 'Early Learning AR',
    icon: '🧸',
    badge: 'Interactive AR Zone',
    description:
      'Rainbow circle rugs, ABC & 123 wall posters, low wooden desks, and a glowing AR projection pad for summoning life-size 3D safari animals and floating number orbs.',
    coords: 'X:-22, Z:2',
    gradient: 'from-pink-600/25 to-rose-600/20',
    borderColor: 'border-pink-500/30',
    accentColor: 'text-pink-400',
    arTag: 'Elephant Hologram',
    features: ['3D AR animal projector', 'Miss Maya AI podium', 'Rainbow sensory rug circle'],
  },
  {
    title: 'Robotics & Innovation Hub',
    category: 'Advanced STEM Lab',
    icon: '🤖',
    badge: 'AI & Coding Center',
    description:
      'Home to Guru-Bot 2.0 AI, live coding terminals, 3D printing simulators, robotics arenas, and physics sandbox environments where tomorrow\'s engineers are built today.',
    coords: 'X:30, Z:-25',
    gradient: 'from-cyan-600/25 to-blue-600/20',
    borderColor: 'border-cyan-500/30',
    accentColor: 'text-cyan-400',
    arTag: 'AR Circuit Overlay',
    features: ['Guru-Bot teaching station', 'Code compilation terminal', 'AR electronics workbench'],
  },
  {
    title: 'Grand Central Library & Digital Archives',
    category: 'Academic Knowledge',
    icon: '📚',
    badge: 'Research Library',
    description:
      'Two levels of towering wooden bookshelves, quiet study carrels with holographic displays, and digitized manuscripts spanning Vedic sciences to modern quantum mechanics.',
    coords: 'X:-30, Z:-25',
    gradient: 'from-indigo-600/25 to-violet-600/20',
    borderColor: 'border-indigo-500/30',
    accentColor: 'text-indigo-400',
    arTag: 'AR Book Scanner',
    features: ['Holographic reading desks', 'Vedic to modern archives', '3D knowledge visualization'],
  },
  {
    title: 'Olympic Sports Arena & Wellness Pavilion',
    category: 'Athletics & Wellness',
    icon: '⚽',
    badge: 'Sports Complex',
    description:
      'Full-size running tracks, basketball courts, and grassy playfields where students practice coordination, sportsmanship, and trigger outdoor emotes with classmates.',
    coords: 'X:35, Z:25',
    gradient: 'from-emerald-600/25 to-teal-600/20',
    borderColor: 'border-emerald-500/30',
    accentColor: 'text-emerald-400',
    arTag: 'AR Score Tracker',
    features: ['Running & basketball courts', '3D avatar sports emotes', 'Wellness & fitness modules'],
  },
  {
    title: 'Grand Boulevard & School Gate',
    category: 'Campus Entrance',
    icon: '🏛️',
    badge: 'Welcome Portal',
    description:
      'The ceremonial school entrance framed by illuminated archways, solar lamp posts, manicured cypress trees, interactive noticeboards, and the morning assembly grounds.',
    coords: 'X:0, Z:56',
    gradient: 'from-blue-600/25 to-indigo-600/20',
    borderColor: 'border-blue-500/30',
    accentColor: 'text-blue-400',
    arTag: 'AR School Map',
    features: ['Illuminated entrance archway', 'Interactive noticeboards', 'Morning assembly grounds'],
  },
];

export const CampusHighlightsSection: React.FC<CampusHighlightsSectionProps> = ({
  onEnterCampus,
  onOpenMap,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="landmarks" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1c] via-[#07111f] to-[#060d1c]" />

      {/* Subtle radial light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-700/4 rounded-full blur-3xl pointer-events-none" />

      <div className="section-glow-divider" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold mb-4">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>3D Spatial Architecture • 25+ Zones</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Iconic Campus{' '}
              <span className="text-gradient-cyan">Destinations</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-2xl">
              25+ hand-crafted 3D zones designed to inspire curiosity and deep academic focus —
              each with AR overlays, spatial audio, and immersive storytelling.
            </p>
          </div>

          <button
            onClick={() => { soundManager.playClick(); onOpenMap(); }}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl glass-bright border border-indigo-500/30 text-slate-200 hover:text-white text-sm font-bold transition-all hover:scale-105 hover:border-indigo-500/60 shadow-lg shadow-indigo-950/30"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Full Campus Blueprint</span>
          </button>
        </div>

        {/* Landmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LANDMARKS.map((landmark, idx) => (
            <div
              key={idx}
              onClick={() => { soundManager.playClick(); onEnterCampus(); }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`group cursor-pointer rounded-3xl glass border ${landmark.borderColor} p-6 transition-all duration-400 hover:scale-[1.03] shadow-xl relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Top color accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${landmark.gradient.replace('/25', '/60').replace('/20', '/50')}`} />

              {/* Background gradient glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${landmark.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative">
                {/* Icon row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <span className="text-4xl p-3 rounded-2xl glass border border-slate-700/40 group-hover:scale-110 transition-transform duration-300 block">
                      {landmark.icon}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full glass border ${landmark.borderColor} ${landmark.accentColor} block mb-1`}>
                      {landmark.badge}
                    </span>
                    {/* AR tag */}
                    <div className={`flex items-center justify-end gap-1 text-[9px] font-mono ${landmark.accentColor}/60`}>
                      <Scan className="w-2.5 h-2.5" />
                      <span>{landmark.arTag}</span>
                    </div>
                    {/* Coords */}
                    <div className="text-[9px] font-mono text-slate-600 mt-0.5">
                      {landmark.coords}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className={`text-[10px] font-bold uppercase tracking-widest ${landmark.accentColor} mb-1.5`}>
                  {landmark.category}
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-slate-100 group-hover:text-white transition-colors mb-2.5">
                  {landmark.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {landmark.description}
                </p>

                {/* Feature mini-list */}
                <div className="space-y-1.5 mb-4">
                  {landmark.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <div className={`w-1 h-1 rounded-full ${landmark.accentColor.replace('text-', 'bg-')} flex-shrink-0`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className={`pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold ${landmark.accentColor} group-hover:opacity-100`}>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Teleport in 3D</span>
                </div>
                <div className="flex items-center gap-1">
                  {hoveredIdx === idx && <Zap className="w-3.5 h-3.5 animate-pulse" />}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 p-6 rounded-2xl glass border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-slate-200 font-bold text-sm mb-1">Want to explore every corner?</div>
            <div className="text-xs text-slate-500">25+ zones across 3 academic blocks, sports arena, library, observatory & more.</div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onOpenMap(); }}
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-indigo-700/30"
          >
            <Compass className="w-4 h-4" />
            <span>View Full Blueprint Map</span>
          </button>
        </div>
      </div>
    </section>
  );
};
