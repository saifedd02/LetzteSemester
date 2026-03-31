import { useState, useEffect, useRef } from 'react';
import { MODULES } from '../data/modules';

export default function ChronoTimer({ selectedModule, onSessionComplete, onClose }) {
  const [moduleId, setModuleId] = useState(selectedModule?.id || MODULES[0].id);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const currentModule = MODULES.find((m) => m.id === moduleId);

  useEffect(() => {
    if (selectedModule) setModuleId(selectedModule.id);
  }, [selectedModule]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  const finish = () => {
    const minutes = Math.max(1, Math.round(elapsed / 60));
    onSessionComplete(moduleId, minutes);
    setIsRunning(false);
    setIsPaused(false);
    setElapsed(0);
    onClose();
  };

  const discard = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsed(0);
    onClose();
  };

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
