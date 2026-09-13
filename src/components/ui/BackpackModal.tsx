import React from 'react';
import { X, Award, Sparkles } from 'lucide-react';
import type { StudentProfile } from '../../types/campus';
import { soundManager } from '../../utils/audio';

interface BackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const BackpackModal: React.FC<BackpackModalProps> = ({ isOpen, onClose, student }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              🎒
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Student DigiBackpack</h3>
              <p className="text-xs text-slate-400">Badges, inventory & school identity</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Student ID Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">
              👦
            </div>
            <div>
              <div className="font-extrabold text-white text-base">{student.name}</div>
              <div className="text-xs text-indigo-300">{student.standard} • DigiGuru Campus</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Stars</div>
            <div className="text-lg font-black text-amber-300 flex items-center gap-1 justify-end">
              <span>⭐</span>
              <span>{student.digiStars}</span>
            </div>
          </div>
        </div>

        {/* Earned Badges */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>School Badges Earned ({student.badges.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {student.badges.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                  {b.icon}
                </div>
                <div>
                  <div className="font-bold text-xs text-white">{b.name}</div>
                  <div className="text-[11px] text-slate-400">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Items */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Backpack Items</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
              <div className="text-2xl mb-1">📘</div>
              <div className="text-[11px] font-semibold text-slate-300">Nursery Math Book</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
              <div className="text-2xl mb-1">🎨</div>
              <div className="text-[11px] font-semibold text-slate-300">Magic Crayons</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
              <div className="text-2xl mb-1">🔍</div>
              <div className="text-[11px] font-semibold text-slate-300">AR Safari Lens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
