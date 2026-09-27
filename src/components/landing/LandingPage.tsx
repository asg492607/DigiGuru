import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { AcademicWingsSection } from './AcademicWingsSection';
import { CampusHighlightsSection } from './CampusHighlightsSection';
import { AiFacultySection } from './AiFacultySection';
import { GamificationSection } from './GamificationSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onEnterCampus: () => void;
  onOpenMap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterCampus, onOpenMap }) => {
  return (
    <div className="landing-scroll w-full h-full bg-[#060c1a] text-slate-100 font-sans selection:bg-indigo-500/40 selection:text-white">
      {/* Top Fixed Navbar */}
      <LandingNavbar onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />

      {/* Hero Section */}
      <div id="overview">
        <LandingHero onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />
      </div>

      {/* 15 Academic Standards */}
      <AcademicWingsSection onEnterCampus={onEnterCampus} />

      {/* AI Faculty & Classmates */}
      <AiFacultySection onEnterCampus={onEnterCampus} />

      {/* Iconic Campus Landmarks */}
      <CampusHighlightsSection onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />

      {/* Student Life & Gamification */}
      <GamificationSection onEnterCampus={onEnterCampus} />

      {/* Community Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FaqSection />

      {/* Footer */}
      <LandingFooter onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />
    </div>
  );
};
