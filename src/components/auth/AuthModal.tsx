import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { soundManager } from '../../utils/audio';

interface AuthModalProps {
  onSuccessLogin?: () => void;
}

const AVATAR_OPTIONS = ['👦', '👧', '🧒', '🤖', '🎓', '🚀', '⭐', '🦁', '🎨', '🔬'];

const STANDARDS_LIST = [
  'Nursery A',
  'Junior KG',
  'Senior KG',
  'Grade 1-A',
  'Grade 2-A',
  'Grade 3-B',
  'Grade 4-A',
  'Grade 5-A',
  'Grade 6-C',
  'Grade 7-A',
  'Grade 8-B',
  'Grade 9-A',
  'Grade 10-A',
  'Grade 11 (Science & AI)',
  'Grade 12 (STEM Advanced)',
];

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessLogin }) => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  // Mode state
  const isLogin = authModalMode === 'login';

  // Login Form fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regStandard, setRegStandard] = useState('Nursery A');
  const [regRole, setRegRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [regAvatar, setRegAvatar] = useState('👦');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (username: string, pass: string) => {
    soundManager.playClick();
    setLoginIdentifier(username);
    setLoginPassword(pass);
    setErrorMessage(null);

    const res = login({ usernameOrEmail: username, password: pass, rememberMe: true });
    if (res.success) {
      soundManager.playStarJingle();
      setSuccessMessage(`Welcome back, ${res.user?.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        if (onSuccessLogin) onSuccessLogin();
      }, 900);
    } else {
      setErrorMessage(res.message || 'Login failed.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    soundManager.playClick();

    const res = login({
      usernameOrEmail: loginIdentifier,
      password: loginPassword,
      rememberMe,
    });

    setIsSubmitting(false);

    if (res.success) {
      soundManager.playStarJingle();
      setSuccessMessage(`Welcome back to DigiGuru, ${res.user?.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        if (onSuccessLogin) onSuccessLogin();
      }, 900);
    } else {
      setErrorMessage(res.message || 'Invalid username or password.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    soundManager.playClick();

    if (regPassword !== regConfirmPassword) {
      setIsSubmitting(false);
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    const res = register({
      name: regName,
      username: regUsername,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      role: regRole,
      standard: regRole === 'teacher' ? 'Faculty Member' : regStandard,
      avatar: regAvatar,
    });

    setIsSubmitting(false);

    if (res.success) {
      soundManager.playStarJingle();
      setSuccessMessage(`Congratulations ${res.user?.name}! You earned 50 DigiStars welcome bonus.`);
      setTimeout(() => {
        setSuccessMessage(null);
        if (onSuccessLogin) onSuccessLogin();
      }, 1100);
    } else {
      setErrorMessage(res.message || 'Failed to complete registration.');
    }
  };

  const seedAccounts = authService.getSeedAccounts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-950/60 p-6 md:p-8 my-8 text-slate-100 backdrop-blur-xl">
        {/* Glow Accent */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            closeAuthModal();
          }}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-slate-700/50 shadow-md hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>DigiGuru Auth Portal</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back, Learner!' : 'Enroll at DigiGuru Campus'}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {isLogin
              ? 'Sign in to access your 3D classrooms, stars, and AI tutors.'
              : 'Join thousands of students in India’s premier 3D digital school.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-slate-800/80 border border-slate-700/50 mb-6">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setErrorMessage(null);
              openAuthModal('login');
            }}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
              isLogin
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setErrorMessage(null);
              openAuthModal('register');
            }}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
              !isLogin
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Enroll / Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 shadow-md animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* LOGIN FORM */}
        {/* ============================================================== */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username or Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. aryan or aryan@digiguru.edu"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all select-text"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all select-text"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                onClick={() => setErrorMessage('Demo password for Aryan / Ananya is "password123", and Miss Maya is "teacher123".')}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Campus'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Credentials Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Login (One-Click)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {seedAccounts.map((seed) => (
                  <button
                    key={seed.username}
                    type="button"
                    onClick={() =>
                      handleQuickLogin(
                        seed.username,
                        seed.role === 'teacher' ? 'teacher123' : 'password123'
                      )
                    }
                    className="flex flex-col items-start p-2.5 rounded-xl bg-slate-800/60 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 text-left transition-all hover:scale-105 group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                      <span>{seed.avatar}</span>
                      <span className="truncate">{seed.name.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate w-full">{seed.standard}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* ============================================================== */
          /* REGISTRATION FORM */
          /* ============================================================== */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Campus Avatar
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setRegAvatar(emoji);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all flex-shrink-0 ${
                      regAvatar === emoji
                        ? 'bg-indigo-600 border-2 border-pink-400 shadow-md scale-110'
                        : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rohan Patil"
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 outline-none select-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <span className="text-xs">@</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="rohan26"
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 outline-none select-text"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@school.edu"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 outline-none select-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-slate-100 outline-none"
                >
                  <option value="student">Student 🎒</option>
                  <option value="teacher">Teacher / Faculty 👩‍🏫</option>
                  <option value="parent">Parent / Guardian 👨‍👩‍👦</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {regRole === 'teacher' ? 'Department' : 'Standard / Grade'}
                </label>
                {regRole === 'teacher' ? (
                  <input
                    type="text"
                    disabled
                    value="Faculty - Digital Wing"
                    className="w-full bg-slate-800/40 border border-slate-700 rounded-xl py-2 px-3 text-xs text-indigo-300"
                  />
                ) : (
                  <select
                    value={regStandard}
                    onChange={(e) => setRegStandard(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-slate-100 outline-none"
                  >
                    {STANDARDS_LIST.map((std) => (
                      <option key={std} value={std}>
                        {std}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 outline-none select-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 outline-none select-text"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 flex-shrink-0 text-pink-400" />
              <span>
                New admissions automatically receive <strong>50 DigiStars</strong> and a{' '}
                <strong>Campus Citizen</strong> backpack badge!
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Registering...' : 'Complete Enrollment & Enter Campus'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
