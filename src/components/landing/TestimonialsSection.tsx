import React from 'react';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  standard: string;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'My son Aryan used to struggle with early counting until we tried DigiGuru. Seeing the numbers float as 3D orbs and having Miss Maya speak aloud made math feel like his favorite game.',
    name: 'Pooja Sharma',
    role: 'Parent of Nursery Student',
    avatar: '👩',
    standard: 'Nursery A',
    stars: 5,
  },
  {
    quote:
      'The 3D campus layout is unbelievable! Walking past the Chhatrapati Shivaji Maharaj statue to get to the Robotics Lab makes school feel heroic and inspiring every single morning.',
    name: 'Ananya Deshmukh',
    role: 'Student Council Lead',
    avatar: '👧',
    standard: 'Grade 10-A',
    stars: 5,
  },
  {
    quote:
      'As an educator, having real-time speech synthesis and 3D AR holograms inside the browser without needing heavy VR headsets is revolutionary for Indian digital education.',
    name: 'Dr. Rajesh Kulkarni',
    role: 'Senior Academic Director',
    avatar: '👨‍🏫',
    standard: 'Faculty Advisor',
    stars: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 relative bg-slate-950/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Quote className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Community Voice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Loved by Students, Parents &{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              Teachers
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            See how DigiGuru’s 3D spatial metaverse is redefining distance learning across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all hover:scale-[1.02]"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <div className="text-sm font-bold text-slate-100">{t.name}</div>
                  <div className="text-xs text-indigo-400">{t.role}</div>
                  <div className="text-[10px] text-slate-500">{t.standard}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
