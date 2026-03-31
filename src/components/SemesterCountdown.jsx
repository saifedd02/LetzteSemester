import { useState, useEffect } from 'react';
import { SEMESTER_DATES } from '../data/modules';

export default function SemesterCountdown() {
  const [now, setNow] = useState(new Date());
  const [showHours, setShowHours] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const vorlesungEnd = new Date(SEMESTER_DATES.vorlesungEnd);
  const diff = Math.max(0, vorlesungEnd - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const totalDays = Math.ceil((vorlesungEnd - new Date(SEMESTER_DATES.vorlesungStart)) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.max(0, Math.ceil((now - new Date(SEMESTER_DATES.vorlesungStart)) / (1000 * 60 * 60 * 24)));
  const pct = Math.min(100, (daysPassed / totalDays) * 100);

  return (
    <div className="countdown" onClick={() => setShowHours(!showHours)} title="Klick zum Umschalten">
      <div className="countdown-main">
        <span className="countdown-num">{showHours ? hours : days}</span>
        <span className="countdown-unit">{showHours ? 'Stunden' : 'Tage'} bis Vorlesungsende</span>
        <span className="countdown-tick">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
      </div>
      <div className="countdown-bar">
        <div className="countdown-fill" style={{ width: `${pct}%` }}>
          <span className="countdown-dot" />
        </div>
      </div>
    </div>
  );
}
