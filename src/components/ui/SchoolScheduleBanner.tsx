import React, { useState } from 'react';
import { Bell, Clock, Compass, BookOpen, ChevronUp, ChevronDown, UserCheck, Coffee } from 'lucide-react';
import type { SchoolPeriod, TeacherState } from '../../types/campus';

interface SchoolScheduleBannerProps {
  currentPeriod: SchoolPeriod;
  teacherState: TeacherState;
  onRingBell: () => void;
  isInsideClassroom: boolean;
}

export const SchoolScheduleBanner: React.FC<SchoolScheduleBannerProps> = ({
  currentPeriod,
  teacherState,
  onRingBell,
  isInsideClassroom,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isFreeCampus = currentPeriod.status === 'free_campus';

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-300">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl px-4 py-2 flex items-center gap-3 text-white text-xs select-none">
        {/* Period Icon & Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              isFreeCampus
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20'
                : 'bg-gradient-to-tr from-indigo-600 to-pink-600 shadow-indigo-500/20'
            }`}
          >
            {isFreeCampus ? <Compass className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
          </div>

          {!isCollapsed && (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-100 tracking-wide">
                  {currentPeriod.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isFreeCampus
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 animate-pulse'
                  }`}
                >
                  {isFreeCampus ? 'Free Campus' : 'In Session'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{currentPeriod.timeRange}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="truncate max-w-[200px] md:max-w-[320px] text-slate-300">
                  {currentPeriod.description}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Status Badge */}
        {!isCollapsed && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px]">
            {teacherState === 'in_lounge' && (
              <>
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-200">Teacher in Lounge</span>
              </>
            )}
            {teacherState === 'entering' && (
              <>
                <UserCheck className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
                <span className="text-pink-300 font-bold">Miss Maya Entering...</span>
              </>
            )}
            {teacherState === 'teaching' && (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Teaching at Podium</span>
              </>
            )}
            {teacherState === 'dismissed' && (
              <>
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Class Dismissed</span>
              </>
            )}
          </div>
        )}

        {/* Bell Action Button */}
        <button
          onClick={onRingBell}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
          title="Ring school bell to switch between Free Campus exploration and Class Session"
        >
          <Bell className="w-3.5 h-3.5 animate-wiggle" />
          <span>{isFreeCampus ? 'Ring Bell for Class' : 'Ring Bell for Recess'}</span>
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          title={isCollapsed ? 'Expand Schedule' : 'Collapse Schedule'}
        >
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Helper hint for classroom entry */}
      {!isCollapsed && isInsideClassroom && isFreeCampus && (
        <div className="text-center mt-1">
          <span className="text-[10px] bg-slate-900/80 backdrop-blur border border-amber-500/40 text-amber-300 px-3 py-0.5 rounded-full shadow">
            🔔 Recess time! Ring the bell above to call Miss Maya into the classroom.
          </span>
        </div>
      )}
    </div>
  );
};
