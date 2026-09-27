import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Microscope,
  Baby,
  Cpu,
  ChevronRight,
  Scan,
  Zap,
  Users,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AcademicWingsSectionProps {
  onSelectStandard?: (std: string) => void;
  onEnterCampus: () => void;
}

interface Wing {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  emoji: string;
  standards: string[];
  description: string;
  highlights: string[];
  arFeature: string;
  students: number;
  color: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
  bgGlow: string;
}

const WINGS: Wing[] = [
  {
    id: 'early_years',
    name: 'Early Childhood Foundation',
    subtitle: 'Ages 3–6 • Sensory-Rich Play-Based Learning',
    badge: 'Foundation Stage',
    icon: <Baby className="w-5 h-5" />,
    emoji: '🌸',
    standards: ['Nursery A & B', 'Jr. KG (Junior Kindergarten)', 'Sr. KG (Senior Kindergarten)'],
    description:
      'A vibrant, sensory-rich digital sanctum with rainbow circle rugs, counting number orbs, 3D safari animal projections, and phonics sessions guided by Miss Maya with live voice synthesis.',
    highlights: [
      '🐘 Life-size 3D AR Elephant & Lion Holograms spawnable in classroom',
      '🔢 Floating Number Orbs with real-time voice narration',
      '🎮 Child-safe joystick navigation with cartoon avatars',
      '⭐ Gamified DigiStars & collectible milestone badges',
      '🎵 Phonics singing, alphabets, and rhyme-based sessions',
    ],
    arFeature: 'AR Elephant Hologram',
    students: 2840,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/30',
    glowColor: 'shadow-pink-900/40',
    textColor: 'text-pink-400',
    bgGlow: 'bg-pink-500/8',
  },
  {
    id: 'primary',
    name: 'Primary Academic Wing',
    subtitle: 'Grades 1–5 • Core Foundational Mastery',
    badge: 'Preparatory Stage',
    icon: <BookOpen className="w-5 h-5" />,
    emoji: '📗',
    standards: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
    description:
      'Structured curriculum integrating arithmetic, English literature, EVS, and Indian cultural heritage via the Shivaji Memorial Plaza, all within dedicated 2-story academic buildings.',
    highlights: [
      '🖊️ Interactive whiteboard quizzes with instant peer feedback',
      '🌿 Environmental Science lab with virtual plant & weather models',
      '📖 Maratha history storytelling at the Shivaji Statue courtyard',
      '👥 Classmate socialization with multiplayer wave & cheer emotes',
      '🎯 Adaptive difficulty levels per student performance',
    ],
    arFeature: 'AR Solar System',
    students: 5120,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-900/40',
    textColor: 'text-amber-400',
    bgGlow: 'bg-amber-500/8',
  },
  {
    id: 'middle_secondary',
    name: 'Middle & Secondary School',
    subtitle: 'Grades 6–10 • Rigorous STEM & Humanities',
    badge: 'Middle Stage',
    icon: <Microscope className="w-5 h-5" />,
    emoji: '🔬',
    standards: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10 (Board Prep)'],
    description:
      'Advanced 3-floor complexes with physics simulations, chemistry labs, geometry room, computer science terminals, and an Astronomy Observatory under the virtual night sky.',
    highlights: [
      '⚗️ Virtual chemistry testing bays with reaction simulations',
      '🌌 Astronomy Observatory with 3D star map projections',
      '📐 3D Geometry and Molecular model AR manipulation',
      '🤖 Board exam prep with Guru-Bot AI personalized tutor',
      '📚 Grand Library with digital archives & research carrels',
    ],
    arFeature: 'AR Molecular Lab',
    students: 6780,
    color: 'from-indigo-500 to-cyan-600',
    borderColor: 'border-indigo-500/30',
    glowColor: 'shadow-indigo-900/40',
    textColor: 'text-indigo-400',
    bgGlow: 'bg-indigo-500/8',
  },
  {
    id: 'senior_secondary',
    name: 'Senior Secondary & Innovation Hub',
    subtitle: 'Grades 11–12 • Pre-University Excellence',
    badge: 'Secondary Stage',
    icon: <Cpu className="w-5 h-5" />,
    emoji: '🚀',
    standards: ['Grade 11 — Science, AI & Arts', 'Grade 12 — Advanced STEM & Commerce'],
    description:
      "Cutting-edge innovation labs, coding terminals, robotics arena, and a collegiate auditorium, preparing India's brightest for global university leadership and tech innovation.",
    highlights: [
      '🦾 Robotics simulation arena with real-time AI companions',
      '💻 Coding terminals for Python, AI, and web development',
      '🔭 Advanced physics mechanics & organic chemistry modules',
      '🏆 Olympic-standard sports arena & fitness wellness pavilion',
      '🏛️ Student government, debate hall & collaborative study pods',
    ],
    arFeature: 'AR Robotics Arena',
    students: 4220,
    color: 'from-purple-500 to-violet-600',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-900/40',
    textColor: 'text-purple-400',
    bgGlow: 'bg-purple-500/8',
  },
];

export const AcademicWingsSection: React.FC<AcademicWingsSectionProps> = ({ onEnterCampus }) => {
  const [activeTab, setActiveTab] = useState<string>('early_years');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeWing = WINGS.find((w) => w.id === activeTab) || WINGS[0];

  const switchWing = (id: string) => {
    if (id === activeTab) return;
    soundManager.playClick();
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(id);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <section id="academics" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c1a] via-[#07101e] to-[#060c1a]" />
      <div className="absolute inset-0 animate-grid opacity-40"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Section glow */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] ${activeWing.bgGlow} rounded-full blur-3xl transition-all duration-700 pointer-events-none`} />

      <div className="section-glow-divider mb-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-4">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>K-12 Comprehensive Pedagogy • CBSE Aligned</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
            15 Standards,{' '}
            <span className="text-gradient-blue-pink">One Living Campus</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From sensory-rich nursery play to Grade 12 robotics innovation, every wing is a purpose-built
            3D environment with AR classrooms, AI teachers, and real school timetables.
          </p>
        </div>

        {/* Wing Tabs */}
        <div className="flex items-stretch justify-center gap-3 overflow-x-auto pb-4 mb-12 flex-wrap">
          {WINGS.map((wing) => {
            const isSelected = wing.id === activeTab;
            return (
              <button
                key={wing.id}
                onClick={() => switchWing(wing.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex-shrink-0 border relative overflow-hidden ${
                  isSelected
                    ? `bg-gradient-to-r ${wing.color} text-white border-white/15 shadow-xl ${wing.glowColor} scale-105`
                    : 'glass text-slate-400 hover:text-slate-200 border-slate-700/40 hover:border-slate-600/60 hover:scale-102'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 animate-shimmer opacity-40" />
                )}
                <span className="text-base">{wing.emoji}</span>
                <span className="hidden sm:inline">{wing.name.split(' ')[0]} {wing.name.split(' ')[1]}</span>
                <span className="sm:hidden">{wing.emoji}</span>
                {isSelected && (
                  <span className="ml-1 text-[10px] bg-white/20 rounded-full px-1.5 py-0.5">
                    {wing.standards.length} Grades
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Wing Showcase */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start glass-bright rounded-3xl p-6 sm:p-10 shadow-2xl border ${activeWing.borderColor} transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'}`}
        >
          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${activeWing.borderColor} ${activeWing.bgGlow} ${activeWing.textColor}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeWing.badge}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                <Users className="w-3 h-3" />
                <span>{activeWing.students.toLocaleString()} enrolled</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold">
                <Scan className="w-3 h-3" />
                <span>{activeWing.arFeature}</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">
                {activeWing.emoji} {activeWing.name}
              </h3>
              <p className={`text-sm font-semibold ${activeWing.textColor}`}>
                {activeWing.subtitle}
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-slate-700 pl-4">
              {activeWing.description}
            </p>

            {/* Standards chips */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Academic Levels Covered
              </div>
              <div className="flex flex-wrap gap-2">
                {activeWing.standards.map((std) => (
                  <span
                    key={std}
                    className={`px-3 py-1.5 rounded-xl glass border ${activeWing.borderColor} ${activeWing.textColor} text-xs font-semibold`}
                  >
                    {std}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Learning Highlights
              </div>
              <div className="space-y-2.5">
                {activeWing.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 group">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeWing.color} flex-shrink-0`} />
                    <span className="group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { soundManager.playClick(); onEnterCampus(); }}
              className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r ${activeWing.color} hover:brightness-110 text-white font-bold text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10`}
            >
              <Zap className="w-4 h-4" />
              <span>Enter This Wing in 3D</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Visual */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950/80 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  WING_ID: {activeWing.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  ● Live
                </span>
              </div>

              {/* AR Preview */}
              <div className={`relative aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 to-indigo-950/50 p-6 overflow-hidden ar-hologram`}>
                {/* Hologram grid floor */}
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                {/* Radial glow */}
                <div className={`absolute inset-0 bg-gradient-radial from-${activeWing.id === 'early_years' ? 'pink' : activeWing.id === 'primary' ? 'amber' : activeWing.id === 'middle_secondary' ? 'indigo' : 'purple'}-600/15 to-transparent pointer-events-none`} />

                {/* Main emoji */}
                <div className="text-6xl mb-3 animate-float relative z-10 select-none">
                  {activeWing.emoji}
                </div>

                {/* AR Label */}
                <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-900/40 border border-cyan-500/30">
                  <Scan className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-cyan-300">{activeWing.arFeature} — PROJECTED</span>
                </div>

                {/* Corner coords */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-600">
                  X:-22 Y:0 Z:2
                </div>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-600">
                  FOV:75°
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-px bg-slate-800/30">
                {[
                  { label: 'Classroom Capacity', value: '30 Students' },
                  { label: 'Spatial Audio', value: '3D Stereo' },
                  { label: 'AR Projection', value: 'WebGL Real-time' },
                  { label: 'Teacher AI', value: 'Miss Maya + Bot' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-slate-900/40">
                    <div className="text-[10px] text-slate-500 mb-0.5">{stat.label}</div>
                    <div className="text-xs font-bold text-slate-200">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
