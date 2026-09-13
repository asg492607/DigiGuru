import React, { useRef, useState, useEffect } from 'react';

interface StudentControlsJoyProps {
  onMove: (input: { x: number; y: number; active: boolean }) => void;
}

export const StudentControlsJoy: React.FC<StudentControlsJoyProps> = ({ onMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const radius = 45; // max joystick deflection in pixels

  const onMoveRef = useRef(onMove);
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  const updateKnobPosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    let normX = dx;
    let normY = dy;

    if (dist > radius) {
      normX = (dx / dist) * radius;
      normY = (dy / dist) * radius;
    }

    setKnobPos({ x: normX, y: normY });
    onMoveRef.current({
      x: normX / radius,
      y: normY / radius,
      active: true,
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateKnobPosition(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      updateKnobPosition(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      setKnobPos({ x: 0, y: 0 });
      onMoveRef.current({ x: 0, y: 0, active: false });
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="absolute bottom-20 left-6 pointer-events-auto select-none hidden md:block">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="w-28 h-28 rounded-full bg-slate-900/80 backdrop-blur-md border-2 border-indigo-500/40 relative flex items-center justify-center shadow-2xl cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-colors"
      >
        {/* Inner concentric ring */}
        <div className="w-14 h-14 rounded-full border border-indigo-500/20 pointer-events-none" />

        {/* Movable Knob */}
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 border border-white/40 shadow-lg pointer-events-none absolute"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        />
        <div className="absolute bottom-1 text-[9px] font-mono text-indigo-300/60 pointer-events-none">
          JOYSTICK
        </div>
      </div>
    </div>
  );
};
