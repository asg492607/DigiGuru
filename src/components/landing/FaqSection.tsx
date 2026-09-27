import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    tag: 'Tech',
    question: 'Do I need a VR headset or high-end PC to use DigiGuru?',
    answer:
      'Not at all! DigiGuru runs entirely in modern web browsers (Chrome, Edge, Safari, Firefox) on laptops, tablets, desktops, and phones using lightweight WebGL and Three.js. You can navigate using touch controls, on-screen joystick, arrow keys, or click-to-walk — no plugins, no downloads, no expensive hardware required.',
  },
  {
    tag: 'Account',
    question: 'How does student registration and account persistence work?',
    answer:
      'When you enroll, your account is securely stored. Your custom avatar, academic standard (Nursery to Grade 12), earned DigiStars, unlocked backpack badges, and lesson progress are permanently preserved between every visit. Simply log in to continue from exactly where you left off.',
  },
  {
    tag: 'AI Teachers',
    question: 'How exactly do AI Teachers Miss Maya and Guru-Bot teach?',
    answer:
      'Both AI teachers use real-time Web Speech Synthesis to deliver lessons aloud with lifelike articulation. They animate with physical gestures — waving, pointing to the whiteboard, summoning 3D AR holograms like safari elephants and counting star orbs. Students answer interactive prompts to earn instant DigiStar rewards.',
  },
  {
    tag: 'Culture',
    question: 'What is the significance of the Chhatrapati Shivaji Maharaj Memorial Plaza?',
    answer:
      'DigiGuru proudly anchors its campus around Indian cultural heritage. The central quad honors Chhatrapati Shivaji Maharaj with a detailed bronze equestrian monument, saffron standards, and Maratha stone plinths — instilling courage, leadership, and ethical values in every student who passes through.',
  },
  {
    tag: 'Rewards',
    question: 'How are DigiStars earned and what can you do with them?',
    answer:
      'Students earn DigiStars by answering lesson questions correctly, exploring new campus zones, attending scheduled timetable periods, and engaging with classmates. Stars are displayed live in your HUD and safely stored in your student backpack — building toward rank milestones and unlocking exclusive campus badges.',
  },
  {
    tag: 'AR',
    question: 'How do the AR Holograms work inside the classroom?',
    answer:
      'When Miss Maya triggers an AR moment (like summoning a safari elephant for a counting lesson), a full 3D holographic animal appears inside the classroom space, rendered in real-time WebGL. Students see the 3D model from any angle as they walk around it — no special glasses or equipment needed.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    soundManager.playClick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const tagColors: Record<string, string> = {
    Tech: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
    Account: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
    'AI Teachers': 'bg-pink-500/15 text-pink-400 border-pink-500/25',
    Culture: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    Rewards: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    AR: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c1a] to-[#07111f]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-700/4 rounded-full blur-3xl pointer-events-none" />

      <div className="section-glow-divider" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold mb-4">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-slate-400">
            Got questions about entering India's first 3D AR school metaverse? We have answers.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl glass border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-indigo-500/35 shadow-lg shadow-indigo-950/40' : 'border-slate-700/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Tag */}
                    <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagColors[faq.tag]}`}>
                      {faq.tag}
                    </span>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-indigo-500/25 rotate-180' : 'bg-slate-800/70'}`}>
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-indigo-300' : 'text-slate-400'}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 animate-fadeIn">
                    <div className="h-px bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent mb-4" />
                    <p className="text-sm text-slate-400 leading-relaxed pl-0">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help CTA */}
        <div className="mt-12 p-7 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40 border border-indigo-500/20 text-center">
          <MessageCircle className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-100 mb-2">Still have questions?</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
            Jump directly into the 3D campus — our AI teachers Miss Maya & Guru-Bot are available to assist you live in the classroom!
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Miss Maya is online right now</span>
          </div>
        </div>
      </div>
    </section>
  );
};
