import React from 'react';
import { Quote, Star, Verified } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  standard: string;
  stars: number;
  location: string;
  highlight: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'My son Aryan struggled with early counting until DigiGuru. Seeing numbers float as glowing 3D orbs and hearing Miss Maya speak aloud made mathematics feel like his favourite game. He now asks to go to "digital school" every morning!',
    name: 'Pooja Sharma',
    role: 'Parent of Nursery Student',
    avatar: '👩',
    standard: 'Nursery A',
    stars: 5,
    location: 'Pune, Maharashtra',
    highlight: '3D Number Orbs',
  },
  {
    quote:
      'The 3D campus layout is unbelievable! Walking past the Chhatrapati Shivaji Maharaj memorial every morning on my way to the Robotics Lab fills me with pride and inspiration. It feels like a real school — but better!',
    name: 'Ananya Deshmukh',
    role: 'Student Council Lead',
    avatar: '👧',
    standard: 'Grade 10-A',
    stars: 5,
    location: 'Nagpur, Maharashtra',
    highlight: 'Shivaji Memorial Walk',
  },
  {
    quote:
      'As an educator, having real-time speech synthesis, 3D AR holograms, and a complete school timetable in the browser without VR headsets is revolutionary. DigiGuru is the future of Indian digital education.',
    name: 'Dr. Rajesh Kulkarni',
    role: 'Senior Academic Director',
    avatar: '👨‍🏫',
    standard: 'Faculty Advisor',
    stars: 5,
    location: 'Mumbai, Maharashtra',
    highlight: 'No VR Headset Needed',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111f] via-[#060c1a] to-[#07111f]" />

      {/* Subtle background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-700/4 rounded-full blur-3xl pointer-events-none" />

      <div className="section-glow-divider" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-4">
            <Quote className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Community Voices</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
            Loved by Students,{' '}
            <span className="text-gradient-blue-pink">Parents & Teachers</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Thousands of students and families across Maharashtra are experiencing a new era of schooling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-3xl glass-bright border border-slate-700/40 shadow-xl flex flex-col justify-between hover:border-indigo-500/35 transition-all duration-400 hover:scale-[1.02] overflow-hidden"
            >
              {/* Background shimmer on hover */}
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Top glow line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-[10px] text-amber-400 font-bold">5.0</span>
                </div>

                {/* Quote icon */}
                <Quote className="w-7 h-7 text-indigo-500/40 mb-3" />

                {/* Quote text */}
                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>

                {/* Highlighted feature mention */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold mb-5">
                  <span>⚡</span>
                  <span>Loved: {t.highlight}</span>
                </div>
              </div>

              {/* Author */}
              <div className="relative flex items-center gap-3 pt-5 border-t border-slate-800/60">
                <div className="relative flex-shrink-0">
                  <span className="text-3xl block">{t.avatar}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                    <Verified className="w-2 h-2 text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-slate-100 flex items-center gap-1">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-indigo-400 font-semibold">{t.role}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {t.standard} • {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '24,780+', label: 'Students Enrolled', emoji: '👨‍🎓' },
            { value: '4.9 / 5.0', label: 'Average Rating', emoji: '⭐' },
            { value: '98%', label: 'Parent Satisfaction', emoji: '❤️' },
            { value: '120+', label: 'Schools Onboarded', emoji: '🏫' },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl glass border border-slate-700/30 text-center hover:border-indigo-500/25 transition-colors">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
