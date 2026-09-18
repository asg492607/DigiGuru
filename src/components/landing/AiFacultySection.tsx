import React from 'react';
import {
  Sparkles,
  Bot,
  Volume2,
  Users,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AiFacultySectionProps {
  onEnterCampus: () => void;
}

export const AiFacultySection: React.FC<AiFacultySectionProps> = ({ onEnterCampus }) => {
  return (
    <section id="faculty" className="py-20 relative bg-slate-950/70 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Intelligent AI Pedagogy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Meet Your Virtual Faculty &{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              AI Companions
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every classroom at DigiGuru is powered by conversational AI educators that adapt to each student's pace,
            speak aloud with lifelike voice synthesis, and bring textbooks to life through 3D AR holograms.
          </p>
        </div>

        {/* Dual AI Faculty Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Miss Maya Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-pink-500/30 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30">
                  👩‍🏫
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
                  Lead Humanoid AI Mentor
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
                Miss Maya
              </h3>
              <p className="text-xs text-pink-400 font-semibold mb-4">
                Head of Early Years & Spatial Storytelling
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Miss Maya greets students warmly at the classroom door, conducts interactive whiteboard sessions,
                explains foundational mathematics with voice synthesis, and summons 3D safari animals directly into the room.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Volume2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span>Real-time speech synthesis with friendly articulation</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span>Interactive question prompts with instant DigiStar rewards</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span>Dynamic classroom gestures: pointing, waving, and celebrating</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                soundManager.speakTeacher("Hello! I am Miss Maya. Welcome to DigiGuru!");
                onEnterCampus();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Attend Miss Maya's Class in 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guru-Bot Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30">
                  🤖
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
                  STEM & Robotics Companion
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
                Guru-Bot 2.0
              </h3>
              <p className="text-xs text-cyan-400 font-semibold mb-4">
                Advanced Math, Coding & Physics AI Tutor
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Guru-Bot features an animated glowing visor, robotic precision calculations, and interactive
                STEM puzzles. Students can switch any class to Guru-Bot mode with a single click on the podium!
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>One-click swap between Human and Robot teacher avatars</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Precision step-by-step arithmetic and geometry breakdowns</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Instant quiz feedback with celebratory star jingles</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                soundManager.speakTeacher("Greetings student! Guru-Bot online and ready to teach!");
                onEnterCampus();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Learn STEM with Guru-Bot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Classmates Bar */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">
                Interactive Classmates on Campus
              </div>
              <div className="text-xs text-slate-400">
                Meet Aryan, Ananya, Rohan, and Priya walking across campus grounds and studying in classrooms.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg p-2 rounded-xl bg-slate-800 border border-slate-700">👦 Aryan</span>
            <span className="text-lg p-2 rounded-xl bg-slate-800 border border-slate-700">👧 Ananya</span>
            <span className="text-lg p-2 rounded-xl bg-slate-800 border border-slate-700">🧒 Rohan</span>
            <span className="text-lg p-2 rounded-xl bg-slate-800 border border-slate-700">👧 Priya</span>
          </div>
        </div>
      </div>
    </section>
  );
};
