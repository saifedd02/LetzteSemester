import { useState } from 'react';
import { MODULES } from '../data/modules';
import DayDetail from './DayDetail';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const days = [];
  for (let i = 0; i < startDay; i++) {
    const d = new Date(year, month, -(startDay - 1 - i));
    days.push({ date: d, outside: true });
  }
  for (let i = 1; i <= last.getDate(); i++) {
    days.push({ date: new Date(year, month, i), outside: false });
  }
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length - startDay - last.getDate() + 1);
    days.push({ date: d, outside: true });
  }
  return days;
}

export default function Calendar({ studySessions, calendarEvents, getEventsForDate, onAddEvent, onRemoveEvent, onAddTodo }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getMonthDays(year, month);
  const todayStr = toDateStr(new Date());

  const monthLabel = new Date(year, month).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Build sessions map
  const sessionsByDate = {};
  studySessions.forEach((s) => {
    const dStr = toDateStr(new Date(s.date));
    if (!sessionsByDate[dStr]) sessionsByDate[dStr] = [];
    sessionsByDate[dStr].push(s);
  });

  const getDayInfo = (dateStr) => ({
    sessions: sessionsByDate[dateStr] || [],
    events: getEventsForDate(dateStr),
  });

  const getDayMinutes = (dateStr) => {
    return (sessionsByDate[dateStr] || []).reduce((sum, s) => sum + s.minutes, 0);
  };

  const getIntensity = (mins) => {
    if (mins === 0) return 0;
    if (mins < 30) return 1;
    if (mins < 90) return 2;
    if (mins < 180) return 3;
    return 4;
  };

  return (
    <div className="calendar">
      <div className="cal-nav">
        <button className="cal-arrow" onClick={prevMonth}>&lt;</button>
        <span className="cal-month">{monthLabel}</span>
        <button className="cal-arrow" onClick={nextMonth}>&gt;</button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((d) => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}

        {days.map(({ date, outside }, i) => {
          const dStr = toDateStr(date);
          const info = getDayInfo(dStr);
          const mins = getDayMinutes(dStr);
          const intensity = getIntensity(mins);
          const hasEvents = info.events.length > 0;
          const isToday = dStr === todayStr;
          const isSelected = selectedDate === dStr;

          const moduleColors = [...new Set(info.sessions.map((s) => {
            const mod = MODULES.find((m) => m.id === s.moduleId);
            return mod?.color;
          }).filter(Boolean))].slice(0, 3);

          return (
            <div
              key={i}
              className={`cal-day ${outside ? 'outside' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} intensity-${intensity}`}
              onClick={() => setSelectedDate(dStr === selectedDate ? null : dStr)}
            >
              <span className="day-num">{date.getDate()}</span>
              {(moduleColors.length > 0 || hasEvents) && (
                <div className="day-dots">
                  {moduleColors.map((c, j) => (
                    <span key={j} className="day-dot" style={{ background: c }} />
                  ))}
                  {hasEvents && <span className="day-dot event-dot" />}
                </div>
              )}
              {mins > 0 && <span className="day-mins">{mins < 60 ? `${mins}m` : `${(mins / 60).toFixed(1)}h`}</span>}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <DayDetail
          dateStr={selectedDate}
          info={getDayInfo(selectedDate)}
          onAddEvent={onAddEvent}
          onRemoveEvent={onRemoveEvent}
          onAddTodo={onAddTodo}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
