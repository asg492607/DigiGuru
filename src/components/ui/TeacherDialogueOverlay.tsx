import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Eye,
  EyeOff,
  Bell,
  Footprints,
} from 'lucide-react';
import type { NurseryLesson, LessonStep, SchoolPeriod, TeacherState } from '../../types/campus';
import { NURSERY_LESSONS } from '../../data/campusData';
import { soundManager } from '../../utils/audio';

interface TeacherDialogueOverlayProps {
  currentLesson: NurseryLesson;
  currentStepIndex: number;
  onNextStep: () => void;
  onSelectLesson: (lesson: NurseryLesson) => void;
  onRewardStars: (amount: number) => void;
  onSetTeacherSpeaking: (speaking: boolean) => void;
  onSetTeacherGesture: (gesture: 'welcome' | 'point_board' | 'summon_ar' | 'celebrate') => void;
  teacherModel?: 'human' | 'robot';
  onToggleTeacherModel?: () => void;
  schoolPeriod?: SchoolPeriod;
  teacherState?: TeacherState;
  onRingBell?: () => void;
}

export const TeacherDialogueOverlay: React.FC<TeacherDialogueOverlayProps> = ({
  currentLesson,
  currentStepIndex,
  onNextStep,
  onSelectLesson,
  onRewardStars,
  onSetTeacherSpeaking,
  onSetTeacherGesture,
  teacherModel = 'human',
  onToggleTeacherModel,
  schoolPeriod,
  teacherState = 'teaching',
  onRingBell,
}) => {
  const [voiceMuted, setVoiceMuted] = useState(soundManager.getIsVoiceMuted());
  const [isMinimized, setIsMinimized] = useState(false);
  const [answeredStep, setAnsweredStep] = useState<{
    lessonId: string;
    stepIndex: number;
    choice: number | null;
    isCorrect: boolean;
  } | null>(null);

  const step: LessonStep = currentLesson.steps[currentStepIndex] || currentLesson.steps[0];

  const hasAnswered =
    answeredStep !== null &&
    answeredStep.lessonId === currentLesson.id &&
    answeredStep.stepIndex === step.stepIndex;
  const selectedChoice = hasAnswered ? answeredStep.choice : null;
  const isCorrect = hasAnswered ? answeredStep.isCorrect : false;

  // Whenever step changes and teacher is actually teaching, AI Teacher speaks and gestures
  useEffect(() => {
    if (teacherState !== 'teaching') {
      return;
    }

    if (step.arObject && step.arObject !== 'none') {
      onSetTeacherGesture('summon_ar');
      if (step.arObject === 'elephant') {
        soundManager.playElephantTrumpet();
      }
    } else if (step.stepIndex === 0) {
      onSetTeacherGesture('welcome');
    } else {
      onSetTeacherGesture('point_board');
    }

    onSetTeacherSpeaking(true);
    soundManager.speakTeacher(step.teacherSpeech, () => {
      onSetTeacherSpeaking(false);
    });

    return () => {
      soundManager.stopSpeaking();
      onSetTeacherSpeaking(false);
    };
  }, [step, currentLesson.id, teacherState, onSetTeacherSpeaking, onSetTeacherGesture]);

  const handleToggleVoice = () => {
    const muted = soundManager.toggleVoiceMute();
    setVoiceMuted(muted);
    if (!muted && teacherState === 'teaching') {
      soundManager.speakTeacher(step.teacherSpeech);
    }
  };

  const handleChooseOption = (index: number) => {
    if (hasAnswered) return;
    const isAnswerCorrect =
      step.correctChoiceIndex !== undefined ? index === step.correctChoiceIndex : true;

    setAnsweredStep({
      lessonId: currentLesson.id,
      stepIndex: step.stepIndex,
      choice: index,
      isCorrect: isAnswerCorrect,
    });

    if (isAnswerCorrect) {
      soundManager.playStarJingle();
      onSetTeacherGesture('celebrate');
      const stars = step.rewardStars || 10;
      onRewardStars(stars);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#ec4899', '#fbbf24', '#4ade80'],
        });
      } catch {}
    } else {
      soundManager.playClick();
    }
  };

  // Minimized Compact Pill
  if (isMinimized) {
    return (
      <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto select-none z-30 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            soundManager.playClick();
            setIsMinimized(false);
          }}
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border-2 border-indigo-500/50 shadow-2xl hover:scale-105 transition-all text-white"
        >
          <div className="w-7 h-7 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-sm">
            {teacherModel === 'human' ? '👩‍🏫' : '🤖'}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{teacherState === 'teaching' ? currentLesson.title : 'DigiGuru Classroom'}</span>
              <span className="text-[10px] text-pink-400 bg-pink-500/15 px-1.5 py-0.2 rounded border border-pink-500/30">
                {teacherState === 'teaching' ? 'In Session' : 'Free Time'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Click to expand teacher dialogue</div>
          </div>
          <Eye className="w-4 h-4 text-cyan-400 ml-1" />
        </button>
      </div>
    );
  }

  // Teacher Still in Lounge (Free Campus Recess Mode)
  if (teacherState === 'in_lounge') {
    return (
      <div className="absolute bottom-16 md:bottom-20 left-4 right-4 max-w-3xl mx-auto pointer-events-auto select-none z-30">
        <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg">
                ☕
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white text-sm">Recess / Campus Free Exploration</h4>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                    Faculty in Lounge
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Miss Maya is currently in the Faculty Lounge. You can explore the Central Quad, playground, library, or relax with classmates!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onRingBell && (
                <button
                  onClick={() => {
                    soundManager.playSchoolBell();
                    onRingBell();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Bell className="w-4 h-4" />
                  <span>Call Teacher & Start Class</span>
                </button>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                title="Hide Dialogue"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Entering Classroom
  if (teacherState === 'entering') {
    return (
      <div className="absolute bottom-16 md:bottom-20 left-4 right-4 max-w-2xl mx-auto pointer-events-auto select-none z-30">
        <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-pink-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500 animate-pulse" />
          <div className="flex items-center justify-center gap-3 mb-2">
            <Footprints className="w-5 h-5 text-pink-400 animate-bounce" />
            <span className="font-extrabold text-white text-base">Miss Maya is Entering the Classroom</span>
            <Footprints className="w-5 h-5 text-pink-400 animate-bounce" />
          </div>
          <p className="text-xs text-slate-300">
            Miss Maya has entered through the doorway and is walking down the central aisle to the podium. Please take your seats!
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span className="text-[11px] text-pink-300 font-mono">Arriving at podium...</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Interactive Teaching Dialogue Mode
  return (
    <div className="absolute bottom-16 md:bottom-20 left-4 right-4 max-w-4xl mx-auto pointer-events-auto select-none z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900/90 backdrop-blur-xl border-2 border-indigo-500/40 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {/* Top Right Controls (Hide button) */}
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsMinimized(true);
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            title="Hide teaching overlay to look around the room"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold">Hide Panel</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* AI Teacher Avatar Card */}
          <div className="flex items-center gap-3 md:flex-col md:items-center min-w-[120px]">
            <div className="relative">
              {teacherModel === 'human' ? (
                /* Miss Maya Humanoid Card */
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-cyan-400 flex items-center justify-center p-0.5 shadow-xl shadow-pink-500/25">
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="text-3xl">👩‍🏫</span>
                    <div className="text-[10px] text-pink-300 font-mono mt-0.5 font-bold">
                      MISS MAYA
                    </div>
                  </div>
                </div>
              ) : (
                /* Guru-Bot Card */
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-0.5 shadow-xl shadow-cyan-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-10 h-5 rounded-full bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-around px-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-cyan-300 font-mono mt-1 font-bold">
                      GURU-BOT
                    </div>
                  </div>
                </div>
              )}
              {/* Online Indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="md:text-center">
              <div className="text-xs font-extrabold text-white">
                {teacherModel === 'human' ? 'Miss Maya' : 'Guru-Bot'}
              </div>
              <div className="text-[11px] text-pink-400 font-medium">AI Educator</div>
            </div>

            {/* Teacher Model Toggle & Voice Buttons */}
            <div className="flex flex-col gap-1 w-full">
              <button
                onClick={handleToggleVoice}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center justify-center gap-1 transition-all"
                title="Toggle AI Voice"
              >
                {voiceMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="text-[10px]">{voiceMuted ? 'Muted' : 'Speaking'}</span>
              </button>

              {onToggleTeacherModel && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onToggleTeacherModel();
                  }}
                  className="px-2 py-0.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-[10px] text-indigo-200 font-semibold transition-all"
                  title="Switch between Human AI Teacher & Companion Bot"
                >
                  {teacherModel === 'human' ? '🤖 Switch Bot' : '👩‍🏫 Switch Human'}
                </button>
              )}
            </div>
          </div>

          {/* Dialogue & Lesson Content */}
          <div className="flex-1 space-y-4">
            {/* Top Lesson Selector & Step Dots */}
            <div className="flex items-center justify-between flex-wrap gap-2 pr-24">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/15 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                  {currentLesson.title}
                </span>
                {schoolPeriod && (
                  <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 hidden sm:inline-block">
                    {schoolPeriod.name}
                  </span>
                )}
                {step.arObject && step.arObject !== 'none' && (
                  <span className="text-xs font-bold text-pink-400 bg-pink-500/15 px-2.5 py-1 rounded-lg border border-pink-500/30 flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>3D AR Active</span>
                  </span>
                )}
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-1.5">
                {currentLesson.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === currentStepIndex
                        ? 'w-6 bg-pink-500 shadow-md shadow-pink-500/40'
                        : i < currentStepIndex
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Teacher Speech Bubble */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 relative">
              <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
                "{step.teacherSpeech}"
              </p>
            </div>

            {/* Interactive Prompt & Choices */}
            {step.interactionPrompt && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{step.interactionPrompt}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {step.interactiveChoices?.map((choice, idx) => {
                    const isSelected = selectedChoice === idx;
                    let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';

                    if (hasAnswered && isSelected) {
                      btnStyle = isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                        : 'bg-rose-600 text-white border-rose-400';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleChooseOption(idx)}
                        disabled={hasAnswered}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${btnStyle} hover:scale-[1.02] active:scale-98`}
                      >
                        <span>{choice}</span>
                        {hasAnswered && isSelected && (
                          <span>{isCorrect ? '🌟' : '❌'}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Bar (Next Step or Switch Lesson) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {/* Lesson Switcher Dropdown / Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Switch:</span>
                {NURSERY_LESSONS.map((les) => (
                  <button
                    key={les.id}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectLesson(les);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      les.id === currentLesson.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {les.id === 'counting' ? '🔢 Math 1-5' : '🐘 3D Safari'}
                  </button>
                ))}
              </div>

              {/* Next Step Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNextStep();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>
                  {currentStepIndex < currentLesson.steps.length - 1 ? 'Next Step' : 'Finish Lesson'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
