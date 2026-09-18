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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: 'Campus Overview', href: '#overview' },
    { label: '15 Standards', href: '#academics' },
    { label: 'Virtual Faculty', href: '#faculty' },
    { label: 'Key Landmarks', href: '#landmarks' },
    { label: 'Student Life', href: '#studentlife' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-indigo-500/20 py-3 shadow-xl shadow-slate-950/50'
          : 'bg-transparent py-5'
      }`}
    >
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent">
                DigiGuru
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                3D Metaverse
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              India's Premier Digital School
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => soundManager.playClick()}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-800/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Audio Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-md"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Blueprint map quick view */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenMap();
            }}
            title="View Campus Blueprint Map"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all shadow-md"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Map</span>
          </button>

          {isAuthenticated && user ? (
            /* Logged-In User Actions */
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-indigo-500/30 px-3 py-1.5 rounded-xl shadow-md">
                <span className="text-base">{user.avatar}</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-200 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-indigo-300 leading-tight">
                    {user.standard} • ⭐ {user.digiStars}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onEnterCampus();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Enter 3D Campus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  logout();
                }}
                title="Sign Out"
                className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 flex items-center justify-center text-slate-400 hover:text-rose-300 transition-all shadow-md"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Guest / Unauthenticated Actions */
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  openAuthModal('login');
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  openAuthModal('register');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enroll Free</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 mx-4 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl flex flex-col gap-2 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
              }}
              className="text-sm font-medium text-slate-300 hover:text-white py-2 px-3 rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
                onEnterCampus();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md text-center"
            >
              Launch 3D Campus Experience
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
