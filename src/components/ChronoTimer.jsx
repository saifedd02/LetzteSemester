import { useState, useEffect, useRef, useCallback } from 'react';
import { MODULES } from '../data/modules';

const STORAGE_KEY = 'chrono-timer-state';

function loadTimerState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    // Validate it has required fields
    if (state && state.moduleId && typeof state.startedAt === 'number') {
      return state;
    }
  } catch { /* ignore */ }
  return null;
}

function saveTimerState(state) {
  if (state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export default function ChronoTimer({ selectedModule, onSessionComplete, onClose }) {
  // Restore from localStorage if a timer was running
  const saved = useRef(loadTimerState());

  const [moduleId, setModuleId] = useState(() => {
    if (saved.current) return saved.current.moduleId;
    return selectedModule?.id || MODULES[0].id;
  });

  // startedAt: timestamp when current run segment started (null if not running or paused)
  // accumulated: seconds accumulated from previous run segments (before pauses)
  const [startedAt, setStartedAt] = useState(() => saved.current?.startedAt || null);
  const [accumulated, setAccumulated] = useState(() => saved.current?.accumulated || 0);
  const [isRunning, setIsRunning] = useState(() => saved.current?.isRunning || false);
  const [isPaused, setIsPaused] = useState(() => saved.current?.isPaused || false);

  const [displayElapsed, setDisplayElapsed] = useState(0);
  const rafRef = useRef(null);

  const currentModule = MODULES.find((m) => m.id === moduleId);

  useEffect(() => {
    if (!saved.current && selectedModule) setModuleId(selectedModule.id);
  }, [selectedModule]);

  // Calculate current elapsed time
  const getElapsed = useCallback(() => {
    if (startedAt && isRunning && !isPaused) {
      return accumulated + Math.floor((Date.now() - startedAt) / 1000);
    }
    return accumulated;
  }, [startedAt, accumulated, isRunning, isPaused]);

  // Update display using requestAnimationFrame for smooth updates
  useEffect(() => {
    if (isRunning && !isPaused) {
      const tick = () => {
        setDisplayElapsed(getElapsed());
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    } else {
      setDisplayElapsed(getElapsed());
    }
  }, [isRunning, isPaused, getElapsed]);

  // Persist timer state to localStorage
  useEffect(() => {
    if (isRunning) {
      saveTimerState({
        moduleId,
        startedAt,
        accumulated,
        isRunning,
        isPaused,
      });
    } else {
      saveTimerState(null);
    }
  }, [moduleId, startedAt, accumulated, isRunning, isPaused]);

  // On visibility change, recalculate (handles tab switching)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && isRunning && !isPaused) {
        setDisplayElapsed(getElapsed());
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [isRunning, isPaused, getElapsed]);

  const start = () => {
    setStartedAt(Date.now());
    setAccumulated(0);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    // Save elapsed so far into accumulated, clear startedAt
    const now = Date.now();
    const elapsed = accumulated + Math.floor((now - startedAt) / 1000);
    setAccumulated(elapsed);
    setStartedAt(null);
    setIsPaused(true);
  };

  const resume = () => {
    setStartedAt(Date.now());
    setIsPaused(false);
  };

  const finish = () => {
    const totalSeconds = getElapsed();
    const minutes = Math.max(1, Math.round(totalSeconds / 60));
    onSessionComplete(moduleId, minutes);
    setIsRunning(false);
    setIsPaused(false);
    setAccumulated(0);
    setStartedAt(null);
    saveTimerState(null);
    onClose();
  };

  const discard = () => {
    setIsRunning(false);
    setIsPaused(false);
    setAccumulated(0);
    setStartedAt(null);
    saveTimerState(null);
    onClose();
  };

  const elapsed = displayElapsed;
  const hrs = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="chrono-overlay" onClick={(e) => { if (e.target === e.currentTarget && !isRunning) onClose(); }}>
      <div className="chrono-modal">
        <div className="chrono-module-select">
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            disabled={isRunning}
          >
            {MODULES.filter(m => m.id !== 'projekt').map((m) => (
              <option key={m.id} value={m.id}>{m.short}</option>
            ))}
            <option value="projekt">Projektarbeit</option>
          </select>
        </div>

        <div className="chrono-display" style={{ color: currentModule?.color }}>
          {hrs > 0 && <>{pad(hrs)}:</>}{pad(mins)}:{pad(secs)}
        </div>

        {isPaused && <div className="chrono-paused">Pausiert</div>}

        <div className="chrono-controls">
          {!isRunning && (
            <button className="chrono-btn start" onClick={start}>Start</button>
          )}
          {isRunning && !isPaused && (
            <button className="chrono-btn pause" onClick={pause}>Pause</button>
          )}
          {isRunning && isPaused && (
            <>
              <button className="chrono-btn start" onClick={resume}>Weiter</button>
              <button className="chrono-btn finish" onClick={finish}>Speichern</button>
              <button className="chrono-btn discard" onClick={discard}>Verwerfen</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
