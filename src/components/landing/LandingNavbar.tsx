import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  LogIn,
  UserPlus,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Volume2,
  VolumeX,
  Scan,
  Bell,
  Play,
} from 'lucide-react';
import { useAuth } from '../../context';
import { soundManager } from '../../utils/audio';

interface LandingNavbarProps {
  onEnterCampus: () => void;
  onOpenMap: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onEnterCampus, onOpenMap }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live school clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: 'Campus', href: '#overview', emoji: '🏛️' },
    { label: 'Academics', href: '#academics', emoji: '📚' },
    { label: 'AI Faculty', href: '#faculty', emoji: '🤖' },
    { label: 'Landmarks', href: '#landmarks', emoji: '🚩' },
    { label: 'Student Life', href: '#studentlife', emoji: '⭐' },
    { label: 'FAQ', href: '#faq', emoji: '❓' },
  ];

  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#060c1a]/95 backdrop-blur-2xl border-b border-indigo-500/15 py-2.5 shadow-2xl shadow-slate-950/70'
          : 'bg-transparent py-4'
      }`}
    >
      {/* Top school ticker bar */}
      {!isScrolled && (
        <div className="hidden lg:block bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-indigo-900/60 border-b border-indigo-500/10 text-[10px] text-slate-400 py-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-amber-400/80">
                <Bell className="w-3 h-3" />
                <span>Morning Assembly — 8:00 AM</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Period 1: Counting & Numbers (Nursery A)</span>
              </span>
              <span className="text-slate-600">|</span>
              <span>🚩 Chhatrapati Shivaji Maharaj Campus, Digital India</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-indigo-300">
              <span className="text-slate-500">School Clock:</span>
              <span className="font-bold text-indigo-200">{timeStr}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* DigiGuru Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundManager.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group"
        >
          {/* Logo icon */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:shadow-indigo-500/60 group-hover:scale-110 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
            {/* Subtle ring */}
            <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-gradient-blue-pink">
                DigiGuru
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                3D Metaverse
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
              India's Premier Digital School Campus
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-0.5 bg-slate-900/50 backdrop-blur-xl px-3 py-1.5 rounded-full border border-slate-700/40">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => soundManager.playClick()}
              className="group flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-indigo-500/10 transition-all duration-200"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">{link.emoji}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* AR scan indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold">
            <Scan className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden xl:inline">AR Ready</span>
          </div>

          {/* Audio toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-9 h-9 rounded-xl glass border border-slate-700/40 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-md hover:border-slate-600/60 hover:scale-105"
          >
            {isMuted
              ? <VolumeX className="w-4 h-4 text-red-400" />
              : <Volume2 className="w-4 h-4 text-emerald-400" />
            }
          </button>

          {/* Blueprint map */}
          <button
            onClick={() => { soundManager.playClick(); onOpenMap(); }}
            title="View Campus Blueprint"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl glass border border-slate-700/40 transition-all shadow-md hover:border-indigo-500/30 hover:scale-105"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Map</span>
          </button>

          {isAuthenticated && user ? (
            /* Logged-in user */
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2.5 glass border border-indigo-500/25 px-3 py-2 rounded-xl shadow-md">
                <span className="text-xl leading-none">{user.avatar}</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-100 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-indigo-300 leading-tight flex items-center gap-1">
                    <span>{user.standard}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-400">⭐ {user.digiStars}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { soundManager.playClick(); onEnterCampus(); }}
                className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 border border-indigo-400/20"
              >
                <span>Enter Campus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => { soundManager.playClick(); logout(); }}
                title="Sign Out"
                className="w-9 h-9 rounded-xl glass border border-slate-700/40 hover:border-rose-500/40 flex items-center justify-center text-slate-400 hover:text-rose-300 transition-all shadow-md hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Guest actions */
            <div className="flex items-center gap-2">
              <button
                onClick={() => { soundManager.playClick(); openAuthModal('login'); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl glass border border-slate-700/40 hover:border-slate-600/60 transition-all hover:scale-105"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => { soundManager.playClick(); openAuthModal('register'); }}
                className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 border border-indigo-400/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enroll Free</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl glass border border-slate-700/40 flex items-center justify-center text-slate-300 hover:text-white transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-2 mx-4 p-5 rounded-2xl bg-[#080d22]/97 backdrop-blur-2xl border border-indigo-500/25 shadow-2xl flex flex-col gap-1 animate-fadeIn">
          {/* School info banner */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
            <span>🚩</span>
            <span className="text-[11px] text-amber-300 font-semibold">Chhatrapati Shivaji Maharaj Digital Campus</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => { soundManager.playClick(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white py-2.5 px-3 rounded-xl hover:bg-indigo-500/10 transition-all"
            >
              <span className="text-base">{link.emoji}</span>
              <span>{link.label}</span>
            </a>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => { soundManager.playClick(); setMobileMenuOpen(false); onEnterCampus(); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-700/30 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch 3D Campus Experience</span>
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => { soundManager.playClick(); setMobileMenuOpen(false); openAuthModal('register'); }}
                className="w-full py-3 rounded-xl glass border border-indigo-500/30 text-indigo-300 font-bold text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Enroll Free (+50 DigiStars)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


