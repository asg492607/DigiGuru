import React, { useState } from 'react';
import {
  X,
  MapPin,
  Compass,
  Sparkles,
  BookOpen,
  FlaskConical,
  Palette,
  Tv,
  Gamepad2,
  Building2,
  DoorOpen,
  Sun,
  ArrowRight,
  Layers,
  Map as MapIcon,
  Navigation,
} from 'lucide-react';
import { CAMPUS_ZONES } from '../../data/campusData';
import type { CampusZone, CampusZoneId } from '../../types/campus';
import { soundManager } from '../../utils/audio';

interface CampusBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTravelToZone: (zoneId: CampusZoneId) => void;
  currentZoneId: CampusZoneId;
}

const ZoneIcon: React.FC<{ iconName: string; className?: string; style?: React.CSSProperties }> = ({
  iconName,
  className,
  style,
}) => {
  switch (iconName) {
    case 'DoorOpen': return <DoorOpen className={className} style={style} />;
    case 'Building2': return <Building2 className={className} style={style} />;
    case 'Sparkles': return <Sparkles className={className} style={style} />;
    case 'Sun': return <Sun className={className} style={style} />;
    case 'Gamepad2': return <Gamepad2 className={className} style={style} />;
    case 'BookOpen': return <BookOpen className={className} style={style} />;
    case 'FlaskConical': return <FlaskConical className={className} style={style} />;
    case 'Palette': return <Palette className={className} style={style} />;
    case 'Tv': return <Tv className={className} style={style} />;
    default: return <MapPin className={className} style={style} />;
  }
};

type SectorFilter = 'all' | 'early_years' | 'primary' | 'secondary' | 'senior_secondary' | 'facilities';

export const CampusBlueprintModal: React.FC<CampusBlueprintModalProps> = ({
  isOpen,
  onClose,
  onTravelToZone,
  currentZoneId,
}) => {
  const [selectedZone, setSelectedZone] = useState<CampusZone>(
    CAMPUS_ZONES.find((z) => z.id === currentZoneId) || CAMPUS_ZONES[0]
  );
  const [activeTab, setActiveTab] = useState<'master_map' | 'blueprint' | 'hierarchy'>('master_map');
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>('all');
  const [activeFloorIndex, setActiveFloorIndex] = useState<number>(0);

  if (!isOpen) return null;

  const filteredZones = CAMPUS_ZONES.filter((zone) => {
    if (sectorFilter === 'all') return true;
    if (sectorFilter === 'early_years') return zone.category === 'early_years';
    if (sectorFilter === 'primary') return zone.category === 'primary';
    if (sectorFilter === 'secondary') return zone.category === 'secondary';
    if (sectorFilter === 'senior_secondary') return zone.category === 'senior_secondary';
    if (sectorFilter === 'facilities') return zone.category === 'facility' || zone.category === 'landmark' || zone.category === 'social';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">DigiGuru Campus Blueprint & Master Plan</h2>
              <p className="text-xs text-slate-400">
                15 Academic Standards (Nursery to 12th) • Chhatrapati Shivaji Maharaj Quad • Perimeter Gates & Facilities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Tabs */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('master_map');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'master_map'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Master Campus Map</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('blueprint');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'blueprint'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Building Directory</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('hierarchy');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'hierarchy'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>School Hierarchy</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'master_map' ? (
          /* Master Campus Map Tab */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* 2D Schematic Grid Canvas */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-950/60 flex flex-col items-center">
              {/* Compass / Orientation indicator */}
              <div className="w-full max-w-4xl flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-slate-200 font-bold">DIGIGURU MASTER CAMPUS SCHEMATIC (500,000 SQ FT)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>NORTH ▲</span>
                  <span className="text-slate-600">•</span>
                  <span>15 BLOCKS + QUAD</span>
                </div>
              </div>

              {/* Master Map Architectural Card */}
              <div className="w-full max-w-4xl bg-slate-900/90 border-2 border-indigo-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Sector Blocks Layout */}
                <div className="relative space-y-4">
                  {/* NORTH SECTION: Senior Secondary & Admin */}
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2 flex items-center justify-between">
                      <span>NORTH COLLEGE QUAD & ACADEMIC ADMIN</span>
                      <span>GRADES 11 & 12</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {(['bldg_g11', 'administration_health', 'science_complex', 'bldg_g12'] as CampusZoneId[]).map((id) => {
                        const z = CAMPUS_ZONES.find((item) => item.id === id);
                        if (!z) return null;
                        const isCur = z.id === currentZoneId;
                        const isSel = z.id === selectedZone.id;
                        return (
                          <button
                            key={z.id}
                            onClick={() => {
                              soundManager.playClick();
                              setSelectedZone(z);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSel
                                ? 'bg-indigo-600/30 border-indigo-400 shadow-md'
                                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate">{z.name}</span>
                              {isCur && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                              {z.subtitle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* MID SECTION: Primary (West), Central Quad, Secondary (East) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Primary School Wing (West) */}
                    <div className="md:col-span-4 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2 flex items-center justify-between">
                        <span>WEST: PRIMARY SCHOOL</span>
                        <span>GRADES 1-5</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['bldg_g1', 'bldg_g2', 'bldg_g3', 'bldg_g4', 'bldg_g5', 'library'] as CampusZoneId[]).map((id) => {
                          const z = CAMPUS_ZONES.find((item) => item.id === id);
                          if (!z) return null;
                          const isCur = z.id === currentZoneId;
                          const isSel = z.id === selectedZone.id;
                          return (
                            <button
                              key={z.id}
                              onClick={() => {
                                soundManager.playClick();
                                setSelectedZone(z);
                              }}
                              className={`p-2 rounded-xl border text-left transition-all ${
                                isSel
                                  ? 'bg-cyan-600/30 border-cyan-400 shadow'
                                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate">{z.name}</span>
                                {isCur && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                              </div>
                              <span className="text-[9px] text-slate-400 truncate block">{z.subtitle}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Central Quad Landmark */}
                    <div className="md:col-span-4 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shadow-lg mb-2">
                        🚩
                      </div>
                      <h4 className="text-sm font-extrabold text-amber-300">
                        Chhatrapati Shivaji Maharaj Quad
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Central Memorial Plaza, Grand Fountains & Radial School Boulevards
                      </p>
                      <button
                        onClick={() => {
                          const z = CAMPUS_ZONES.find((item) => item.id === 'shivaji_statue');
                          if (z) {
                            soundManager.playClick();
                            setSelectedZone(z);
                          }
                        }}
                        className="mt-3 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all"
                      >
                        Inspect Central Quad
                      </button>
                    </div>

                    {/* Secondary School Wing (East) */}
                    <div className="md:col-span-4 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2 flex items-center justify-between">
                        <span>EAST: SECONDARY SCHOOL</span>
                        <span>GRADES 6-10</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['bldg_g6', 'bldg_g7', 'bldg_g8', 'bldg_g9', 'bldg_g10', 'auditorium'] as CampusZoneId[]).map((id) => {
                          const z = CAMPUS_ZONES.find((item) => item.id === id);
                          if (!z) return null;
                          const isCur = z.id === currentZoneId;
                          const isSel = z.id === selectedZone.id;
                          return (
                            <button
                              key={z.id}
                              onClick={() => {
                                soundManager.playClick();
                                setSelectedZone(z);
                              }}
                              className={`p-2 rounded-xl border text-left transition-all ${
                                isSel
                                  ? 'bg-indigo-600/30 border-indigo-400 shadow'
                                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate">{z.name}</span>
                                {isCur && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                              </div>
                              <span className="text-[9px] text-slate-400 truncate block">{z.subtitle}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SOUTH SECTION: Early Years (Nursery, LKG, UKG), Cafeteria, Sports & Main Gates */}
                  <div className="p-3 rounded-2xl bg-pink-950/30 border border-pink-500/20">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-2 flex items-center justify-between">
                      <span>SOUTH: EARLY YEARS (NURSERY, KG) & CAMPUS ENTRANCE</span>
                      <span>AGES 3-5 & SECURITY</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {(['bldg_nursery', 'bldg_jkg', 'bldg_skg', 'cafeteria_commons', 'sports_complex'] as CampusZoneId[]).map((id) => {
                        const z = CAMPUS_ZONES.find((item) => item.id === id);
                        if (!z) return null;
                        const isCur = z.id === currentZoneId;
                        const isSel = z.id === selectedZone.id;
                        return (
                          <button
                            key={z.id}
                            onClick={() => {
                              soundManager.playClick();
                              setSelectedZone(z);
                            }}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              isSel
                                ? 'bg-pink-600/30 border-pink-400 shadow'
                                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate">{z.name}</span>
                              {isCur && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                            </div>
                            <span className="text-[9px] text-slate-400 truncate block">{z.subtitle}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Perimeter Gate Bar */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-base">⛩️</span>
                        <div>
                          <strong className="text-white">Main Security Gate & Perimeter Wall</strong>
                          <span className="text-[10px] text-slate-400 block">
                            Wrought-iron automated sliding gates, security cabin, bus terminal
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const z = CAMPUS_ZONES.find((item) => item.id === 'entrance');
                          if (z) {
                            soundManager.playClick();
                            setSelectedZone(z);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-semibold border border-slate-600"
                      >
                        Main Gate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Inspector & Quick Teleport */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 p-5 bg-slate-900/90 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 border"
                    style={{ backgroundColor: `${selectedZone.color}25`, borderColor: selectedZone.color }}
                  >
                    <ZoneIcon iconName={selectedZone.iconName} className="w-6 h-6" style={{ color: selectedZone.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {selectedZone.name}
                    </h3>
                    <p className="text-xs text-slate-400">{selectedZone.subtitle}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sector</span>
                    <span className="font-bold text-slate-200 capitalize">
                      {selectedZone.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Floors</span>
                    <span className="font-bold text-slate-200">{selectedZone.floorsCount} Floors</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Capacity</span>
                    <span className="font-bold text-slate-200">{selectedZone.capacity}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedZone.description}
                </p>

                {/* Digital features list */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Facilities</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedZone.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md text-indigo-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onTravelToZone(selectedZone.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Travel to {selectedZone.name}</span>
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'blueprint' ? (
          /* Directory List View */
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Zone & Sector List (5 cols) */}
            <div className="md:col-span-5 border-r border-slate-800/80 overflow-y-auto p-4 flex flex-col">
              {/* Sector Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[
                  { id: 'all', label: 'All (25)' },
                  { id: 'early_years', label: 'Early Years (3)' },
                  { id: 'primary', label: 'Primary 1-5 (5)' },
                  { id: 'secondary', label: 'Secondary 6-10 (5)' },
                  { id: 'senior_secondary', label: 'College 11-12 (2)' },
                  { id: 'facilities', label: 'Facilities & Quad (10)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSectorFilter(f.id as SectorFilter);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      sectorFilter === f.id
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Scrollable list of buildings */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {filteredZones.map((zone) => {
                  const isCurrent = zone.id === currentZoneId;
                  const isSelected = zone.id === selectedZone.id;

                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedZone(zone);
                        setActiveFloorIndex(0);
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/25 border-indigo-500/70 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 border"
                          style={{ backgroundColor: `${zone.color}33`, borderColor: zone.color }}
                        >
                          <ZoneIcon iconName={zone.iconName} className="w-5 h-5" style={{ color: zone.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white truncate">{zone.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold border border-emerald-500/40 shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate">{zone.subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0 ml-2">
                        {zone.floorsCount} Fl
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Detailed Inspector (7 cols) */}
            <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col justify-between bg-slate-950/40">
              <div className="space-y-6">
                {/* Zone Header Banner */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border shrink-0"
                      style={{
                        backgroundColor: `${selectedZone.color}25`,
                        borderColor: selectedZone.color,
                      }}
                    >
                      <ZoneIcon iconName={selectedZone.iconName} className="w-7 h-7" style={{ color: selectedZone.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                          style={{
                            color: selectedZone.color,
                            backgroundColor: `${selectedZone.color}15`,
                            borderColor: `${selectedZone.color}40`,
                          }}
                        >
                          {selectedZone.category.replace('_', ' ').toUpperCase()} SECTOR
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          Ground + {selectedZone.floorsCount - 1} Floors
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-white mt-1">
                        {selectedZone.name}
                      </h3>
                      <p className="text-xs text-slate-400">{selectedZone.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-400">Capacity</div>
                    <div className="text-sm font-bold text-slate-200">{selectedZone.capacity}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedZone.description}
                  </p>
                </div>

                {/* Floor-by-Floor Blueprint Explorer */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Floor Architecture Layout</span>
                    </h4>
                    <span className="text-xs text-indigo-400 font-medium">
                      Select floor to view facilities
                    </span>
                  </div>

                  {selectedZone.floorsDetail && selectedZone.floorsDetail.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {selectedZone.floorsDetail.map((fl, idx) => (
                          <button
                            key={fl.floorNumber}
                            onClick={() => {
                              soundManager.playClick();
                              setActiveFloorIndex(idx);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              activeFloorIndex === idx
                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/25'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">
                              {fl.floorNumber === 0 ? 'Ground Floor' : `Floor ${fl.floorNumber}`}
                            </div>
                            <div className="text-[10px] opacity-75 truncate">{fl.name}</div>
                          </button>
                        ))}
                      </div>

                      {selectedZone.floorsDetail[activeFloorIndex] && (
                        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">
                              {selectedZone.floorsDetail[activeFloorIndex].name} Rooms & Facilities:
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {selectedZone.floorsDetail[activeFloorIndex].rooms.length} Dedicated Spaces
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedZone.floorsDetail[activeFloorIndex].rooms.map((rm, i) => (
                              <div
                                key={i}
                                className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2 text-xs text-slate-200"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                <span>{rm}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400">
                      Standardized open-plan ground floor pavilion with outdoor connection.
                    </div>
                  )}
                </div>

                {/* Architectural & Digital Features */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Architectural & Digital Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedZone.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-indigo-300 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Travel Action */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-6">
                <div className="text-xs text-slate-400">
                  Campus Coordinates: [{selectedZone.position.join(', ')}]
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onTravelToZone(selectedZone.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Walk to {selectedZone.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Hierarchy View */
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/40">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-indigo-600/10 border border-indigo-500/30 p-4 rounded-2xl text-slate-300 text-sm leading-relaxed">
                <strong className="text-indigo-300">The DigiGuru Institutional Vision:</strong> DigiGuru is constructed as a prestigious, real school campus from Nursery to Grade 12. At the center of the campus quad stands the **Chhatrapati Shivaji Maharaj Memorial Plaza**, from which radial boulevards branch out to all 15 academic grade blocks, laboratories, sports stadium, library, and grand auditorium.
              </div>

              <div className="space-y-3">
                {[
                  { level: '1. DigiGuru Campus', desc: 'The entire 3D school world centered on the Shivaji Maharaj Quad', color: '#ea580c' },
                  { level: '2. Academic Standards (15 Blocks)', desc: 'Nursery, Jr KG, Sr KG, Grades 1-5 (Primary), Grades 6-10 (Secondary), Grades 11-12 (College)', color: '#3b82f6' },
                  { level: '3. Common Facilities', desc: 'Central Wonder Library, Unified Science Dome, Tech AI Hub, Arts Center, Stadium, Auditorium', color: '#10b981' },
                  { level: '4. Dedicated Floors & Classrooms', desc: 'Structured rows of student benches, smart boards, teacher podiums, subject labs', color: '#ec4899' },
                  { level: '5. Embodied AI Teachers', desc: 'Miss Maya (Humanoid AI Educator) & Guru-Bot with voice synthesis and gestures', color: '#f59e0b' },
                  { level: '6. Immersive AR Lessons', desc: '3D holograms (e.g. Life-size 3D Elephant Safari, Floating Counting Orbs)', color: '#8b5cf6' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-extrabold text-base text-white">{item.level}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium text-right max-w-sm">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
