import { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './context';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { CampusCanvas } from './components/3d/CampusCanvas';
import { CampusHUD } from './components/ui/CampusHUD';
import { CampusBlueprintModal } from './components/ui/CampusBlueprintModal';
import { TeacherDialogueOverlay } from './components/ui/TeacherDialogueOverlay';
import { SchoolScheduleBanner } from './components/ui/SchoolScheduleBanner';
import { StudentControlsJoy } from './components/ui/StudentControlsJoy';
import { BackpackModal } from './components/ui/BackpackModal';
import { CAMPUS_SCHEDULE, CAMPUS_ZONES, INITIAL_CLASSMATES, NURSERY_LESSONS } from './data/campusData';
import type { CampusZoneId, Classmate, NurseryLesson, StudentProfile, TeacherState } from './types/campus';
import { soundManager } from './utils/audio';

function DigiGuruApp() {
  const { user, logout, updateUserStarsAndBadges } = useAuth();

  // Active View: 'landing' (Metaverse landing page) | 'campus' (3D Interactive WebGL)
  const [viewMode, setViewMode] = useState<'landing' | 'campus'>('landing');

  const [bonusStars, setBonusStars] = useState<number>(0);

  // Derive student profile dynamically from authenticated user
  const student: StudentProfile = useMemo(() => {
    if (user) {
      return {
        name: `${user.name} ${user.avatar || '👦'}`,
        standard: user.standard || 'Nursery A',
        digiStars: (user.digiStars ?? 50) + bonusStars,
        currentZone: 'shivaji_statue',
        badges: user.badges && user.badges.length > 0 ? user.badges : [
          {
            id: 'b1',
            name: 'Campus Citizen',
            icon: '🎒',
            description: 'Enrolled in DigiGuru Digital Campus',
            unlockedAt: 'Today',
          },
        ],
      };
    }
    return {
      name: 'Aryan 👦',
      standard: 'Nursery A',
      digiStars: 60 + bonusStars,
      currentZone: 'shivaji_statue',
      badges: [
        {
          id: 'b1',
          name: 'First Day at School',
          icon: '🎒',
          description: 'Stepped onto the DigiGuru Campus',
          unlockedAt: 'Today',
        },
        {
          id: 'b2',
          name: 'Counting Star',
          icon: '⭐',
          description: 'Learned numbers 1 to 5 with Guru-Bot',
          unlockedAt: 'Today',
        },
        {
          id: 'b3',
          name: 'Junior Safari Ranger',
          icon: '🐘',
          description: 'Summoned the 3D Elephant AR Hologram',
          unlockedAt: 'Today',
        },
      ],
    };
  }, [user, bonusStars]);

  // Current Player 3D Position
  // Initial position: on Grand Boulevard facing the Central Quad & Shivaji Statue
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 14]);

  // Click-to-walk destination coordinates
  const [clickTarget, setClickTarget] = useState<[number, number, number] | null>(null);

  // Virtual Joystick state for touch/mouse
  const [virtualJoystick, setVirtualJoystick] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Active emote ('wave' | 'cheer' | 'sit' | 'none')
  const [activeEmote, setActiveEmote] = useState<'none' | 'wave' | 'cheer' | 'sit'>('none');

  // Active Classmates
  const [classmates] = useState<Classmate[]>(INITIAL_CLASSMATES);
  const [classmateToast, setClassmateToast] = useState<string | null>(null);

  // School Schedule & Period State
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState<number>(0);
  const currentPeriod = CAMPUS_SCHEDULE[currentPeriodIndex] || CAMPUS_SCHEDULE[0];

  // AI Teacher State: 'in_lounge' | 'entering' | 'teaching' | 'dismissed'
  const [teacherState, setTeacherState] = useState<TeacherState>('in_lounge');

  // Nursery Lesson Progression
  const [currentLesson, setCurrentLesson] = useState<NurseryLesson>(NURSERY_LESSONS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // AI Teacher Presentation State
  const [teacherSpeaking, setTeacherSpeaking] = useState<boolean>(false);
  const [teacherGesture, setTeacherGesture] = useState<'welcome' | 'point_board' | 'summon_ar' | 'celebrate'>('welcome');
  const [teacherModel, setTeacherModel] = useState<'human' | 'robot'>('human');

  // Modals
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isBackpackOpen, setIsBackpackOpen] = useState<boolean>(false);

  // Active Building & Floor State for full multi-floor interiors
  const [activeBuildingId, setActiveBuildingId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<number>(0);

  // Check if player is currently inside the Nursery Wing classroom
  const isInsideNursery = useMemo(() => {
    return activeBuildingId === 'bldg_nursery' || (playerPos[0] < -14 && playerPos[0] > -30 && playerPos[2] > -2 && playerPos[2] < 12);
  }, [activeBuildingId, playerPos]);

  // If inside classroom and a class session is active, start teacher entering if still in lounge
  useEffect(() => {
    if (isInsideNursery && currentPeriod.status === 'class_in_session' && teacherState === 'in_lounge') {
      const timer = setTimeout(() => {
        setTeacherState('entering');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isInsideNursery, currentPeriod.status, teacherState]);

  // Callback when Miss Maya reaches podium
  const handleTeacherArrival = useCallback(() => {
    setTeacherState('teaching');
    soundManager.speakTeacher("Welcome students! Please be seated. Let us begin today's lesson!");
  }, []);

  // School Bell Chime Handler
  const handleRingBell = useCallback(() => {
    soundManager.playSchoolBell();
    setCurrentPeriodIndex((prev) => {
      const nextIndex = (prev + 1) % CAMPUS_SCHEDULE.length;
      const nextPeriod = CAMPUS_SCHEDULE[nextIndex];

      if (nextPeriod.status === 'class_in_session') {
        setClassmateToast(`🔔 School Bell: ${nextPeriod.name} is now in session!`);
        if (isInsideNursery) {
          setTeacherState('entering');
        } else {
          setTeacherState('teaching');
        }
      } else {
        setClassmateToast(`🔔 School Bell: Recess & Free Exploration! Enjoy the campus grounds.`);
        setTeacherState('in_lounge');
      }
      return nextIndex;
    });

    setTimeout(() => {
      setClassmateToast(null);
    }, 4500);
  }, [isInsideNursery]);

  // Enter a building interior
  const handleEnterBuilding = useCallback((buildingId: string, floor = 0) => {
    soundManager.playDoorSlide();
    setActiveBuildingId(buildingId);
    setActiveFloor(floor);
    setPlayerPos([0, 0, 7.5]); // Positioned safely inside near the exit door
    setClickTarget(null);

    const targetZone = CAMPUS_ZONES.find((z) => z.id === buildingId);
    if (targetZone) {
      setClassmateToast(`🚪 Entered ${targetZone.name} • Level ${floor}`);
      setTimeout(() => setClassmateToast(null), 3000);
    }
  }, []);

  // Change floor via elevator or stairs
  const handleChangeFloor = useCallback((floor: number) => {
    setActiveFloor(floor);
    setPlayerPos([0, 0, -4.5]); // Positioned near lift and stairs lobby
    setClickTarget(null);

    if (activeBuildingId) {
      const bldg = CAMPUS_ZONES.find((z) => z.id === activeBuildingId);
      const floorName =
        bldg?.floorsDetail?.[floor]?.name || (floor === 0 ? 'Ground Floor' : `Floor ${floor}`);
      setClassmateToast(`🛗 Level ${floor}: ${floorName}`);
      setTimeout(() => setClassmateToast(null), 2500);
    }
  }, [activeBuildingId]);

  // Exit building interior back to campus grounds
  const handleExitToCampus = useCallback(() => {
    soundManager.playDoorSlide();
    const currentBldg = activeBuildingId
      ? CAMPUS_ZONES.find((z) => z.id === activeBuildingId)
      : null;

    setActiveBuildingId(null);
    setActiveFloor(0);

    if (currentBldg) {
      // Place player directly in front of the building exterior entrance steps
      setPlayerPos([currentBldg.position[0], 0, currentBldg.position[2] + 9.5]);
    } else {
      setPlayerPos([-22, 0, 14]);
    }
    setClickTarget(null);
    setClassmateToast(`🚶 Exited to Main Campus Quad`);
    setTimeout(() => setClassmateToast(null), 2000);
  }, [activeBuildingId]);

  // Determine current zone based on proximity or current active building
  const currentZone = useMemo(() => {
    if (activeBuildingId) {
      return CAMPUS_ZONES.find((z) => z.id === activeBuildingId) || CAMPUS_ZONES[0];
    }
    let closest = CAMPUS_ZONES[0];
    let minDist = Infinity;
    CAMPUS_ZONES.forEach((z) => {
      const d = Math.hypot(playerPos[0] - z.position[0], playerPos[2] - z.position[2]);
      if (d < minDist) {
        minDist = d;
        closest = z;
      }
    });
    return closest;
  }, [playerPos, activeBuildingId]);

  // Teleport to a zone or enter building
  const handleTravelToZone = useCallback((zoneId: CampusZoneId | string) => {
    const targetZone = CAMPUS_ZONES.find((z) => z.id === zoneId);
    if (!targetZone) return;

    soundManager.playClick();
    if (zoneId === 'shivaji_statue') {
      setActiveBuildingId(null);
      setPlayerPos([0, 0, 5]);
    } else if (zoneId === 'entrance') {
      setActiveBuildingId(null);
      setPlayerPos([0, 0, 50]);
    } else if (targetZone.floorsCount && targetZone.floorsCount > 1) {
      // Enter building interior directly
      handleEnterBuilding(zoneId, 0);
      return;
    } else {
      setActiveBuildingId(null);
      setPlayerPos([targetZone.position[0], 0, targetZone.position[2] + 8]);
    }
    setClickTarget(null);
  }, [handleEnterBuilding]);

  // Lesson Step Navigation
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      soundManager.playStarJingle();
      if (currentLesson.id === 'counting') {
        setCurrentLesson(NURSERY_LESSONS[1]); // Safari
      } else {
        setCurrentLesson(NURSERY_LESSONS[0]); // Math
      }
      setCurrentStepIndex(0);
    }
  }, [currentStepIndex, currentLesson]);

  // Award stars with persistent sync
  const handleRewardStars = useCallback((amount: number) => {
    setBonusStars((prev) => {
      const updated = prev + amount;
      const base = user?.digiStars ?? 60;
      updateUserStarsAndBadges(base + updated);
      return updated;
    });
  }, [user, updateUserStarsAndBadges]);

  // Classmate interaction
  const handleSelectClassmate = useCallback((c: Classmate) => {
    soundManager.playClick();
    setClassmateToast(`${c.name}: "${c.activity}! Let's learn together in DigiGuru!"`);
    setTimeout(() => {
      setClassmateToast(null);
    }, 4000);
  }, []);

  // Emotes
  const handleTriggerEmote = useCallback((emote: 'wave' | 'cheer' | 'sit') => {
    soundManager.playClick();
    setActiveEmote(emote);
    setTimeout(() => {
      setActiveEmote('none');
    }, 2500);
  }, []);

  // Handle Logout
  const handleLogout = useCallback(() => {
    logout();
    setViewMode('landing');
    setClassmateToast('You have signed out. Hope to see you again soon!');
    setTimeout(() => setClassmateToast(null), 3000);
  }, [logout]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 font-sans">
      {/* View Switcher: Landing Page or 3D Campus */}
      {viewMode === 'landing' ? (
        <LandingPage
          onEnterCampus={() => {
            soundManager.playClick();
            setViewMode('campus');
          }}
          onOpenMap={() => setIsMapOpen(true)}
        />
      ) : (
        <>
          {/* 3D WebGL Canvas */}
          <CampusCanvas
            playerPos={playerPos}
            onPlayerPosChange={setPlayerPos}
            activeBuildingId={activeBuildingId}
            activeFloor={activeFloor}
            onEnterBuilding={handleEnterBuilding}
            onChangeFloor={handleChangeFloor}
            onEnterZone={(id) => handleTravelToZone(id as CampusZoneId)}
            onExitToCampus={handleExitToCampus}
            classmates={classmates}
            onSelectClassmate={handleSelectClassmate}
            currentStep={currentLesson.steps[currentStepIndex]}
            teacherSpeaking={teacherSpeaking}
            teacherGesture={teacherGesture}
            teacherModel={teacherModel}
            teacherState={teacherState}
            onTeacherArrival={handleTeacherArrival}
            virtualJoystick={virtualJoystick}
            clickTarget={clickTarget}
            onGroundClick={(coords) => setClickTarget(coords)}
            onClearClickTarget={() => setClickTarget(null)}
            emote={activeEmote}
          />

          {/* Main Campus HUD Overlay with Lift & Stairs Navigator */}
          <CampusHUD
            currentZone={currentZone}
            playerPos={playerPos}
            isInsideNursery={isInsideNursery}
            activeBuildingId={activeBuildingId}
            activeFloor={activeFloor}
            onEnterBuilding={handleEnterBuilding}
            onChangeFloor={handleChangeFloor}
            onExitToCampus={handleExitToCampus}
            digiStars={student.digiStars}
            studentName={user?.name || student.name.replace(/[^a-zA-Z\s]/g, '').trim()}
            studentAvatar={user?.avatar || '👦'}
            studentStandard={user?.standard || student.standard}
            onOpenMap={() => setIsMapOpen(true)}
            onOpenBackpack={() => setIsBackpackOpen(true)}
            onSelectZone={(id) => handleTravelToZone(id as CampusZoneId)}
            onTriggerEmote={handleTriggerEmote}
            onReturnToLanding={() => setViewMode('landing')}
            onLogout={handleLogout}
            classmates={classmates}
          />

          {/* School Schedule & Bell Chime Banner */}
          <SchoolScheduleBanner
            currentPeriod={currentPeriod}
            teacherState={teacherState}
            onRingBell={handleRingBell}
            isInsideClassroom={isInsideNursery}
          />

          {/* On-Screen Virtual Joystick for Touch & Mouse */}
          <StudentControlsJoy onMove={setVirtualJoystick} />

          {/* Nursery AI Teacher Interactive Dialogue Balloon (when inside classroom) */}
          {isInsideNursery && (
            <TeacherDialogueOverlay
              currentLesson={currentLesson}
              currentStepIndex={currentStepIndex}
              onNextStep={handleNextStep}
              onSelectLesson={(les) => {
                setCurrentLesson(les);
                setCurrentStepIndex(0);
              }}
              onRewardStars={handleRewardStars}
              onSetTeacherSpeaking={setTeacherSpeaking}
              onSetTeacherGesture={setTeacherGesture}
              teacherModel={teacherModel}
              onToggleTeacherModel={() =>
                setTeacherModel((prev) => (prev === 'human' ? 'robot' : 'human'))
              }
              schoolPeriod={currentPeriod}
              teacherState={teacherState}
              onRingBell={handleRingBell}
            />
          )}

          {/* Classmate / School Announcement Toast */}
          {classmateToast && (
            <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md border border-indigo-500/50 px-5 py-3 rounded-2xl text-slate-100 text-xs md:text-sm font-semibold shadow-2xl animate-bounce text-center max-w-lg">
              {classmateToast}
            </div>
          )}

          {/* Student Backpack Modal */}
          <BackpackModal
            isOpen={isBackpackOpen}
            onClose={() => setIsBackpackOpen(false)}
            student={student}
          />
        </>
      )}

      {/* Global Auth Modal (Login & Registration) */}
      <AuthModal
        onSuccessLogin={() => {
          setViewMode('campus');
        }}
      />

      {/* Global Campus Blueprint Map Modal (accessible from landing & campus) */}
      <CampusBlueprintModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onTravelToZone={(id) => {
          handleTravelToZone(id);
          setViewMode('campus');
        }}
        onEnterBuilding={(bldgId, floor) => {
          handleEnterBuilding(bldgId, floor);
          setViewMode('campus');
        }}
        currentZoneId={currentZone.id}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <DigiGuruApp />
    </AuthProvider>
  );
}

export default App;
