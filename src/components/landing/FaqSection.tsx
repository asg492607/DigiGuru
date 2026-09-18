import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Do I need a VR headset or high-end gaming PC to use DigiGuru?',
    answer:
      'No! DigiGuru runs entirely in standard modern web browsers (Chrome, Edge, Safari, Firefox) on laptops, desktops, tablets, and phones using lightweight WebGL and Three.js. You can walk around using touch controls, on-screen joystick, arrow keys, or click-to-walk without any plugins or downloads.',
  },
  {
    question: 'How does student registration and account persistence work?',
    answer:
      'When you enroll, your account is registered into DigiGuru’s persistent client database. Your custom avatar, selected academic standard (Nursery to Grade 12), earned DigiStars, unlocked backpack badges, and lesson progress are all permanently preserved between visits.',
  },
  {
    question: 'How do the AI Teachers Miss Maya and Guru-Bot teach classes?',
    answer:
      'Our AI teachers use real-time Web Speech Synthesis to articulate lessons aloud, accompanied by animated physical gestures (waving, pointing to the blackboard, and summoning 3D AR holograms like safari elephants and counting stars). Students can answer interactive prompts to test their understanding.',
  },
  {
    question: 'What is the significance of the Chhatrapati Shivaji Maharaj Memorial Plaza?',
    answer:
      'DigiGuru proudly anchors its campus around Indian cultural heritage. The central quad honors Chhatrapati Shivaji Maharaj with a detailed monument, saffron flags, and stone plazas, instilling courage, leadership, and ethical values in every student.',
  },
  {
    question: 'How are DigiStars earned and used?',
    answer:
      'Students earn DigiStars by answering lesson questions correctly, exploring various campus sectors, attending scheduled timetable periods, and engaging with classmates. Stars are displayed in your live HUD and stored safely in your student backpack.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    soundManager.playClick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 relative bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-3">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-slate-400">
            Got questions about entering the DigiGuru 3D Metaverse? We’ve got answers.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-200 hover:text-white transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
