import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Volume2,
  Users,
  CheckCircle,
  ArrowRight,
  Mic,
  Zap,
  Brain,
  Star,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AiFacultySectionProps {
  onEnterCampus: () => void;
}

export const AiFacultySection: React.FC<AiFacultySectionProps> = ({ onEnterCampus }) => {
  const [missMayaSpeaking, setMissMayaSpeaking] = useState(false);
  const [guruBotSpeaking, setGuruBotSpeaking] = useState(false);

  const handleMissMayaSpeak = () => {
    soundManager.playClick();
    setMissMayaSpeaking(true);
    soundManager.speakTeacher("Namaste students! I am Miss Maya. Welcome to DigiGuru! Today we will learn counting and meet our safari friends!");
    setTimeout(() => setMissMayaSpeaking(false), 5000);
    onEnterCampus();
  };

  const handleGuruBotSpeak = () => {
    soundManager.playClick();
    setGuruBotSpeaking(true);
    soundManager.speakTeacher("Greetings, student. Guru-Bot Two-point-Zero is now online. Ready to engage precision STEM instruction protocols.");
    setTimeout(() => setGuruBotSpeaking(false), 5000);
    onEnterCampus();
  };

  return (
    <section id="faculty" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07101e] via-[#060d1c] to-[#07101e]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl pointer-events-none animate-drift" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none animate-drift" style={{ animationDelay: '8s' }} />

      <div className="section-glow-divider" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-semibold mb-4">
            <Brain className="w-3.5 h-3.5 text-pink-400" />
            <span>Intelligent Conversational AI Pedagogy</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
            Meet Your{' '}
            <span className="text-gradient-blue-pink">Virtual Faculty</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every DigiGuru classroom is powered by real-time conversational AI educators. They speak aloud with
            lifelike voice synthesis, animate with natural gestures, and summon 3D AR holograms directly into the lesson.
          </p>
        </div>

        {/* Dual AI Faculty Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

          {/* ── Miss Maya Card ── */}
          <div className="group relative rounded-3xl glass-bright border border-pink-500/25 p-8 shadow-2xl overflow-hidden flex flex-col justify-between hover:border-pink-500/45 transition-all duration-500 hover:shadow-pink-950/50">
            {/* Background glow */}
            <div className="absolute -right-12 -top-12 w-52 h-52 bg-pink-500/12 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors duration-700 pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-rose-500/8 rounded-full blur-2xl pointer-events-none" />

            {/* Shimmer on hover */}
            <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative">
              {/* Header row */}
              <div className="flex items-start justify-between mb-7">
                <div className="relative">
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-4xl shadow-xl shadow-pink-600/40 transition-transform ${missMayaSpeaking ? 'scale-110' : 'group-hover:scale-105'}`}>
                    👩‍🏫
                  </div>
                  {/* Speaking indicator */}
                  {missMayaSpeaking && (
                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-pink-400 opacity-75" />
                      <span className="relative rounded-full h-2.5 w-2.5 bg-pink-400" />
                    </div>
                  )}
                  {/* Online badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25 text-[10px] font-black uppercase tracking-wider mb-2">
                    Lead Humanoid Mentor
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white mb-1">Miss Maya</h3>
              <p className="text-sm text-pink-400 font-semibold mb-5">
                Head of Early Years • Spatial Storytelling Expert
              </p>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Miss Maya greets students at the classroom door, conducts interactive whiteboard sessions,
                explains foundational mathematics with real-time voice synthesis, and summons life-size
                3D safari animals directly into the classroom — all in your browser.
              </p>

              {/* Feature list */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: <Volume2 className="w-4 h-4 text-pink-400 flex-shrink-0" />, text: 'Real-time Web Speech Synthesis with warm, friendly articulation' },
                  { icon: <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />, text: 'Dynamic AR gestures: waving, pointing to board, summoning holograms' },
                  { icon: <CheckCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />, text: 'Interactive lesson prompts with instant DigiStar reward showers' },
                  { icon: <Zap className="w-4 h-4 text-pink-400 flex-shrink-0" />, text: 'Walks across classroom, adjusts teaching style per student response' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-slate-300">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Live speech bubble preview */}
              {missMayaSpeaking && (
                <div className="mb-5 px-4 py-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-xs text-pink-200 italic animate-fadeIn">
                  <Mic className="w-3 h-3 inline mr-1.5 text-pink-400 animate-pulse" />
                  "Namaste students! Today we will count safari animals with our 3D elephant friend! 🐘"
                </div>
              )}
            </div>

            <button
              onClick={handleMissMayaSpeak}
              disabled={missMayaSpeaking}
              className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-700/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden border border-pink-400/20 disabled:opacity-80"
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 hover:opacity-100" />
              <Volume2 className={`w-4 h-4 ${missMayaSpeaking ? 'animate-pulse' : ''}`} />
              <span>{missMayaSpeaking ? 'Miss Maya is Speaking...' : "Hear Miss Maya • Enter Classroom"}</span>
              {!missMayaSpeaking && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* ── Guru-Bot Card ── */}
          <div className="group relative rounded-3xl glass-bright border border-cyan-500/25 p-8 shadow-2xl overflow-hidden flex flex-col justify-between hover:border-cyan-500/45 transition-all duration-500 hover:shadow-cyan-950/50">
            {/* Background glow */}
            <div className="absolute -right-12 -top-12 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/18 transition-colors duration-700 pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-blue-500/7 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative">
              <div className="flex items-start justify-between mb-7">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-xl shadow-cyan-600/40 transition-transform ${guruBotSpeaking ? 'scale-110' : 'group-hover:scale-105'}`}>
                    🤖
                  </div>
                  {guruBotSpeaking && (
                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative rounded-full h-2.5 w-2.5 bg-cyan-400" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-[10px] font-black uppercase tracking-wider mb-2">
                    STEM & Robotics AI
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white mb-1">Guru-Bot 2.0</h3>
              <p className="text-sm text-cyan-400 font-semibold mb-5">
                Advanced Math, Physics & Coding AI Tutor
              </p>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Guru-Bot features a glowing holographic visor, robotic precision calculations, and
                interactive STEM puzzles with step-by-step breakdowns. Switch any class to Guru-Bot
                mode instantly from the classroom podium — all powered by real AI speech.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { icon: <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0" />, text: 'One-click toggle between human Miss Maya and Guru-Bot at podium' },
                  { icon: <Brain className="w-4 h-4 text-cyan-400 flex-shrink-0" />, text: 'Precision step-by-step arithmetic, algebra, and geometry breakdowns' },
                  { icon: <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />, text: 'Instant quiz feedback with celebratory star jingles & badge rewards' },
                  { icon: <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />, text: 'Board exam prep module with adaptive difficulty per student level' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-slate-300">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {guruBotSpeaking && (
                <div className="mb-5 px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 italic animate-fadeIn font-mono">
                  <Mic className="w-3 h-3 inline mr-1.5 text-cyan-400 animate-pulse" />
                  "GURU-BOT ONLINE. Initiating arithmetic lesson sequence. Preparing 3D geometry projection..."
                </div>
              )}
            </div>

            <button
              onClick={handleGuruBotSpeak}
              disabled={guruBotSpeaking}
              className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-700/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-cyan-400/20 disabled:opacity-80 overflow-hidden"
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 hover:opacity-100" />
              <Bot className={`w-4 h-4 ${guruBotSpeaking ? 'animate-spin' : ''}`} />
              <span>{guruBotSpeaking ? 'Guru-Bot is Transmitting...' : 'Activate Guru-Bot • Enter Lab'}</span>
              {!guruBotSpeaking && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Classmates Social Bar */}
        <div className="p-6 sm:p-8 rounded-3xl glass border border-slate-700/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 mb-0.5">
                Live Classmates Walking Campus Grounds
              </div>
              <div className="text-xs text-slate-400">
                Interact with Aryan, Ananya, Rohan & Priya — click to wave, cheer or chat in 3D!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {[
              { emoji: '👦', name: 'Aryan', grade: 'Nursery A', color: 'bg-blue-500/20 border-blue-500/30' },
              { emoji: '👧', name: 'Ananya', grade: 'Grade 4', color: 'bg-pink-500/20 border-pink-500/30' },
              { emoji: '🧒', name: 'Rohan', grade: 'Grade 7', color: 'bg-amber-500/20 border-amber-500/30' },
              { emoji: '👧', name: 'Priya', grade: 'Grade 10', color: 'bg-emerald-500/20 border-emerald-500/30' },
            ].map((c, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${c.color} border text-xs font-semibold text-slate-200 hover:scale-105 transition-transform cursor-pointer`}>
                <span className="text-lg">{c.emoji}</span>
                <div>
                  <div>{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.grade}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
