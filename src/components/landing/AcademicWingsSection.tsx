import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Microscope,
  Baby,
  Cpu,
  Palette,
  Calculator,
  ChevronRight,
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
  standards: string[];
  description: string;
  highlights: string[];
  color: string;
  accentBg: string;
}

const WINGS: Wing[] = [
  {
    id: 'early_years',
    name: 'Early Childhood Foundation',
    subtitle: 'Ages 3 to 6 • Play-based spatial learning',
    badge: 'Foundation Stage',
    icon: <Baby className="w-5 h-5" />,
    standards: ['Nursery A & B', 'Junior Kindergarten (Jr. KG)', 'Senior Kindergarten (Sr. KG)'],
    description:
      'A colorful, sensory-rich environment featuring rainbow circle rugs, counting orbs, 3D animal safaris, and phonics guided by Miss Maya.',
    highlights: [
      'Interactive 3D AR Elephant & Lion Holograms',
      'Number Counting Orbs with Voice Speech Synthesis',
      'Child-safe joy-stick navigation and cartoon avatars',
      'Gamified Star rewards and milestone badges',
    ],
    color: 'from-pink-500 to-rose-500',
    accentBg: 'border-pink-500/30 bg-pink-500/10',
  },
  {
    id: 'primary',
    name: 'Primary Academic Wing',
    subtitle: 'Grades 1 to 5 • Core foundational mastery',
    badge: 'Preparatory Stage',
    icon: <BookOpen className="w-5 h-5" />,
    standards: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
    description:
      'Structured curriculum integrating arithmetic, English literature, environmental studies, and cultural heritage around the central campus quad.',
    highlights: [
      'Dedicated 2-story buildings with natural courtyard lighting',
      'Interactive whiteboard quizzes with instant peer feedback',
      'Cultural stories of Maratha history at Shivaji Memorial',
      'Classmate socialization and multiplayer emote interactions',
    ],
    color: 'from-amber-500 to-orange-500',
    accentBg: 'border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'middle_secondary',
    name: 'Middle & Secondary School',
    subtitle: 'Grades 6 to 10 • Rigorous STEM & Humanities',
    badge: 'Middle Stage',
    icon: <Microscope className="w-5 h-5" />,
    standards: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10 (Board Prep)'],
    description:
      'Advanced 3-story academic complexes with physics simulations, chemistry testing bays, geometry visualizations, and state-of-the-art computer labs.',
    highlights: [
      '3D Molecular and geometric model manipulation in WebGL',
      'Virtual Science Complex & Astronomy Observatory access',
      'Board examination preparation with Guru-Bot AI tutor',
      'Grand Library with digital archives & research desks',
    ],
    color: 'from-indigo-500 to-cyan-500',
    accentBg: 'border-indigo-500/30 bg-indigo-500/10',
  },
  {
    id: 'senior_secondary',
    name: 'Senior Secondary & Tech Hub',
    subtitle: 'Grades 11 & 12 • Pre-University & Innovation',
    badge: 'Secondary Stage',
    icon: <Cpu className="w-5 h-5" />,
    standards: ['Grade 11 (Science, AI & Arts)', 'Grade 12 (Advanced STEM & Commerce)'],
    description:
      'Cutting-edge innovation labs, coding terminals, robotics arena, and collegiate auditorium preparing students for global university leadership.',
    highlights: [
      'Robotics simulation arena with real-time AI companions',
      'Engineering mechanics, organic chemistry, and calculus modules',
      'Olympic-standard sports arena & fitness pavilion',
      'Student government and collaborative group study pods',
    ],
    color: 'from-purple-500 to-indigo-500',
    accentBg: 'border-purple-500/30 bg-purple-500/10',
  },
];

export const AcademicWingsSection: React.FC<AcademicWingsSectionProps> = ({ onEnterCampus }) => {
  const [activeTab, setActiveTab] = useState<string>('early_years');
  const activeWing = WINGS.find((w) => w.id === activeTab) || WINGS[0];

  return (
    <section id="academics" className="py-20 relative bg-slate-950/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>K-12 Comprehensive Pedagogy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            15 Academic Standards,{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              One Unified Campus
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From playful sensory exploration in Nursery to advanced AI and robotics in Grade 12,
            DigiGuru provides purpose-built 3D digital classrooms tailored for every stage of development.
          </p>
        </div>

        {/* Wing Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {WINGS.map((wing) => {
            const isSelected = wing.id === activeTab;
            return (
              <button
                key={wing.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(wing.id);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 border ${
                  isSelected
                    ? `bg-gradient-to-r ${wing.color} text-white border-white/20 shadow-lg scale-105`
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                {wing.icon}
                <span>{wing.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Wing Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${activeWing.accentBg}">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>{activeWing.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {activeWing.name}
            </h3>

            <p className="text-xs sm:text-sm text-indigo-300 font-medium">
              {activeWing.subtitle}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeWing.description}
            </p>

            {/* Standards Included Pills */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Encompassed Academic Levels:
              </div>
              <div className="flex flex-wrap gap-2">
                {activeWing.standards.map((std) => (
                  <span
                    key={std}
                    className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60"
                  >
                    {std}
                  </span>
                ))}
              </div>
            </div>

            {/* Feature Highlights Bullet Points */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Learning Highlights:
              </div>
              {activeWing.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                    ✓
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onEnterCampus();
                }}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${activeWing.color} hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}
              >
                <span>Explore This Wing in 3D Campus</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Diagram / Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl p-6 bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-indigo-400">
                  WING_ID // {activeWing.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/20 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="text-5xl mb-3 animate-float">
                  {activeWing.id === 'early_years'
                    ? '🐘'
                    : activeWing.id === 'primary'
                    ? '🎒'
                    : activeWing.id === 'middle_secondary'
                    ? '🔬'
                    : '🤖'}
                </div>
                <h4 className="text-sm font-bold text-slate-100">
                  Interactive 3D Classroom Environment
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Equipped with real-time AR projection, AI instructor podium, and seating for 30 avatars.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Classroom Capacity</div>
                  <div className="text-sm font-bold text-slate-200">30 Students / Wing</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Spatial Audio</div>
                  <div className="text-sm font-bold text-slate-200">3D Stereo Engine</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
