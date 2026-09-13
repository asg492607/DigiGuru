import React from 'react';
import {
  Compass,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  MapPin,
  Backpack,
} from 'lucide-react';
import type { CampusZone, Classmate } from '../../types/campus';
import { CAMPUS_ZONES } from '../../data/campusData';
import { soundManager } from '../../utils/audio';

interface CampusHUDProps {
  currentZone: CampusZone;
  playerPos: [number, number, number];
  isInsideNursery: boolean;
  digiStars: number;
  onOpenMap: () => void;
  onOpenBackpack: () => void;
  onSelectZone: (zoneId: string) => void;
  onTriggerEmote: (emote: 'wave' | 'cheer' | 'sit') => void;
  classmates: Classmate[];
}

export const CampusHUD: React.FC<CampusHUDProps> = ({
  currentZone,
  playerPos,
  isInsideNursery,
  digiStars,
  onOpenMap,
  onOpenBackpack,
  onSelectZone,
  onTriggerEmote,
  classmates,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getIsMuted());

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleRingBell = () => {
    soundManager.playSchoolBell();
  };

  // Convert 3D world coords [x, y, z] to 2D radar coordinates (scaled to 140px minimap)
  // Campus range is roughly -55 to 55 in X, -65 to 55 in Z
  const radarScale = 0.88;
  const radarCenterX = 70;
  const radarCenterY = 70;

  const playerRadarX = radarCenterX + playerPos[0] * radarScale;
  const playerRadarY = radarCenterY + playerPos[2] * radarScale;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none">
      {/* ============================================================== */}
      {/* TOP HEADER BAR */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between w-full">
        {/* DigiGuru Campus Brand & Zone Status */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-indigo-500/30 shadow-xl pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                DigiGuru
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {isInsideNursery ? 'Nursery Classroom' : 'Main Campus'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span>{currentZone.name}</span>
            </div>
          </div>
        </div>

        {/* Top Right Stats, Controls & Minimap */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* DigiStars Counter */}
          <div className="flex items-center gap-2 bg-amber-500/15 backdrop-blur-md border border-amber-500/30 px-3.5 py-2 rounded-2xl shadow-lg">
            <span className="text-lg">⭐</span>
            <div className="text-right">
              <div className="text-xs text-amber-300/80 font-medium leading-tight">DigiStars</div>
              <div className="text-sm font-bold text-amber-200 leading-tight">{digiStars}</div>
            </div>
          </div>

          {/* School Bell Button */}
          <button
            onClick={handleRingBell}
            title="Ring School Bell"
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Student Backpack */}
          <button
            onClick={onOpenBackpack}
            title="Open Student Backpack"
            className="w-10 h-10 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 backdrop-blur-md border border-indigo-400/40 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            <Backpack className="w-5 h-5" />
          </button>

          {/* Campus Blueprint Map Button */}
          <button
            onClick={onOpenMap}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 border border-blue-400/30"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Campus Blueprint</span>
          </button>

          {/* LIVE MINIMAP RADAR */}
          <div
            onClick={onOpenMap}
            className="hidden lg:block w-[140px] h-[140px] rounded-2xl bg-slate-950/85 backdrop-blur-md border-2 border-indigo-500/40 relative overflow-hidden shadow-2xl cursor-pointer hover:border-indigo-400 transition-all"
            title="Click to open full Campus Blueprint Map"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:14px_14px] opacity-25" />
            {/* Radar Sweep Rings */}
            <div className="absolute inset-2 rounded-full border border-indigo-500/20" />
            <div className="absolute inset-8 rounded-full border border-indigo-500/20" />
            <div className="absolute inset-14 rounded-full border border-indigo-500/20" />

            {/* Central Shivaji Maharaj Quad Indicator (Prominent Crown) */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full -translate-x-1/2 -translate-y-1/2 bg-amber-500 border-2 border-orange-400 shadow-lg shadow-orange-500/50 flex items-center justify-center text-[8px] text-white font-bold"
              style={{ left: `${radarCenterX}px`, top: `${radarCenterY}px` }}
              title="Chhatrapati Shivaji Maharaj Memorial Plaza (Campus Center)"
            >
              👑
            </div>

            {/* Campus Landmark Dots */}
            {CAMPUS_ZONES.map((z) => {
              if (z.id === 'shivaji_statue') return null; // rendered specially above
              const rx = radarCenterX + z.position[0] * radarScale;
              const ry = radarCenterY + z.position[2] * radarScale;
              return (
                <div
                  key={z.id}
                  className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${rx}px`,
                    top: `${ry}px`,
                    backgroundColor: z.color,
                    boxShadow: `0 0 5px ${z.color}`,
                  }}
                  title={z.name}
                />
              );
            })}

            {/* Classmate Dots */}
            {classmates.map((c) => {
              const cx = radarCenterX + c.position[0] * radarScale;
              const cy = radarCenterY + c.position[2] * radarScale;
              return (
                <div
                  key={c.id}
                  className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 bg-yellow-300 shadow-sm"
                  style={{ left: `${cx}px`, top: `${cy}px` }}
                />
              );
            })}

            {/* Player Indicator (Pulsing Cyan Arrow) */}
            <div
              className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{ left: `${playerRadarX}px`, top: `${playerRadarY}px` }}
            >
              <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white animate-ping absolute" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white z-10 shadow-lg" />
            </div>

            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-indigo-300/70">
              CAMPUS RADAR
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM CONTROLS & FAST TRAVEL BAR */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
        {/* Movement Controls Guidance pill */}
        <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/50 text-slate-300 text-xs flex items-center gap-3 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1 font-mono font-bold text-indigo-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            WASD
          </div>
          <span>or Click to Walk</span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 font-mono font-bold text-indigo-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            SPACE
          </div>
          <span>Jump</span>
        </div>

        {/* Emote Actions */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-indigo-500/30 shadow-lg pointer-events-auto">
          <button
            onClick={() => onTriggerEmote('wave')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all hover:scale-105 active:scale-95"
          >
            <span>Wave</span>
            <span>👋</span>
          </button>
          <button
            onClick={() => onTriggerEmote('cheer')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all hover:scale-105 active:scale-95"
          >
            <span>Cheer</span>
            <span>✨</span>
          </button>
          <button
            onClick={() => onTriggerEmote('sit')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all hover:scale-105 active:scale-95"
          >
            <span>Sit</span>
            <span>🪑</span>
          </button>
        </div>

        {/* Quick Fast-Travel shortcuts */}
        <div className="flex items-center gap-2 pointer-events-auto overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => onSelectZone('shivaji_statue')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/85 hover:bg-slate-800 text-orange-300 border border-orange-500/40 transition-all shadow-md shrink-0"
          >
            <span>👑</span>
            <span>Shivaji Quad</span>
          </button>

          <button
            onClick={() => onSelectZone('bldg_nursery')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shrink-0 ${
              isInsideNursery
                ? 'bg-pink-600 text-white shadow-pink-600/30'
                : 'bg-slate-900/85 hover:bg-slate-800 text-pink-300 border border-pink-500/30'
            }`}
          >
            <span>🏫</span>
            <span>Nursery Wing</span>
          </button>

          <button
            onClick={() => onSelectZone('library')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/85 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition-all shadow-md shrink-0"
          >
            <span>📚</span>
            <span>Wonder Library</span>
          </button>

          <button
            onClick={() => onSelectZone('bldg_g8')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/85 hover:bg-slate-800 text-purple-300 border border-purple-500/30 transition-all shadow-md shrink-0"
          >
            <span>🔬</span>
            <span>Grade 8 Secondary</span>
          </button>

          <button
            onClick={() => onSelectZone('sports_complex')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/85 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 transition-all shadow-md shrink-0"
          >
            <span>🏃</span>
            <span>Sports Stadium</span>
          </button>
        </div>
      </div>
    </div>
  );
};
