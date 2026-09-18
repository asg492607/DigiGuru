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
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed Navbar */}
      <LandingNavbar onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />

      {/* Hero Section */}
      <div id="overview">
        <LandingHero onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />
      </div>

      {/* 15 Academic Standards */}
      <AcademicWingsSection onEnterCampus={onEnterCampus} />

      {/* Iconic Campus Landmarks */}
      <CampusHighlightsSection onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />

      {/* AI Faculty & Classmates */}
      <AiFacultySection onEnterCampus={onEnterCampus} />

      {/* Student Life & Gamification */}
      <GamificationSection />

      {/* Community Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FaqSection />

      {/* Footer */}
      <LandingFooter onEnterCampus={onEnterCampus} onOpenMap={onOpenMap} />
    </div>
  );
};
