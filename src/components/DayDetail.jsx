import { useState } from 'react';
import { MODULES } from '../data/modules';

const EVENT_TYPES = [
  { value: 'vorlesung', label: 'Vorlesung' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'uebung', label: 'Übung' },
  { value: 'pruefung', label: 'Prüfung' },
  { value: 'abgabe', label: 'Abgabe' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

export default function DayDetail({ dateStr, info, onAddEvent, onRemoveEvent, onAddTodo, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('vorlesung');
  const [time, setTime] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [alsoTodo, setAlsoTodo] = useState(true);

  const dateLabel = new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const totalMins = info.sessions.reduce((sum, s) => sum + s.minutes, 0);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddEvent({
      date: dateStr,
      title: title.trim(),
      type,
      time: time || null,
      moduleId: moduleId || null,
      recurring: recurring ? 'weekly' : null,
    });
    if (alsoTodo && !recurring && onAddTodo) {
      const prio = (type === 'pruefung' || type === 'abgabe') ? 'hoch' : 'mittel';
      onAddTodo({
        text: title.trim(),
        moduleId: moduleId || null,
        priority: prio,
        dueDate: dateStr,
      });
    }
    setTitle('');
    setTime('');
    setModuleId('');
    setRecurring(false);
    setAlsoTodo(true);
    setShowForm(false);
  };

  // Sort events: by time, then by title
  const sortedEvents = [...info.events].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  return (
    <div className="day-detail">
      <div className="day-detail-header">
        <h3>{dateLabel}</h3>
        <button className="day-close" onClick={onClose}>✕</button>
      </div>

      {totalMins > 0 && (
        <div className="day-study-summary">
          <span className="day-total">{totalMins < 60 ? `${totalMins} min` : `${(totalMins / 60).toFixed(1)}h`} gelernt</span>
          <div className="day-sessions">
            {info.sessions.map((s, i) => {
              const mod = MODULES.find((m) => m.id === s.moduleId);
              return (
                <div key={i} className="day-session-row">
                  <span className="day-session-dot" style={{ background: mod?.color || '#666' }} />
                  <span className="day-session-name">{mod?.short || s.moduleId}</span>
                  <span className="day-session-time">
                    {new Date(s.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="day-session-dur">{s.minutes}min</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sortedEvents.length > 0 && (
        <div className="day-events">
          {sortedEvents.map((e) => {
            const isRecurring = e.recurring === 'weekly';
            return (
              <div key={e.id + dateStr} className="day-event-row">
                <div className="event-left">
                  <span className={`event-type-badge ${e.type}`}>
                    {EVENT_TYPES.find(t => t.value === e.type)?.label || e.type}
                  </span>
                  <span className="event-title">{e.title}</span>
                  {e.time && <span className="event-time">{e.time}</span>}
                  {e.moduleId && (
                    <span className="event-module" style={{ color: MODULES.find(m => m.id === e.moduleId)?.color }}>
                      {MODULES.find(m => m.id === e.moduleId)?.short}
                    </span>
                  )}
                  {isRecurring && <span className="event-recurring">↻</span>}
                </div>
                <button className="event-remove" onClick={() => onRemoveEvent(e.id)} title={isRecurring ? 'Wöchentlichen Termin löschen' : 'Löschen'}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {totalMins === 0 && sortedEvents.length === 0 && !showForm && (
        <p className="day-empty">Nichts an diesem Tag.</p>
      )}

      {!showForm ? (
        <button className="day-add-btn" onClick={() => setShowForm(true)}>+ Termin hinzufügen</button>
      ) : (
        <div className="day-form">
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. DB2 Vorlesung"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="form-row">
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <input
              className="form-input small"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <select className="form-select full" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            <option value="">Kein Modul</option>
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>{m.short} - {m.name}</option>
            ))}
          </select>
          <div className="form-checkboxes">
            <label className="form-checkbox">
              <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
              Wöchentlich wiederholen
            </label>
            {!recurring && (
              <label className="form-checkbox">
                <input type="checkbox" checked={alsoTodo} onChange={(e) => setAlsoTodo(e.target.checked)} />
                Auch als Aufgabe
              </label>
            )}
          </div>
          <div className="form-actions">
            <button className="btn-save" onClick={handleAdd}>Hinzufügen</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}
