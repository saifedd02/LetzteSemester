import { useState } from 'react';

export default function ModuleDetail({ module, progress, onUpdate, onStartTimer, onClose }) {
  const p = progress || { percent: 0, totalMinutes: 0, notes: '', completed: false, grade: null, sessions: [] };
  const [notes, setNotes] = useState(p.notes || '');
  const [completed, setCompleted] = useState(p.completed);
  const [grade, setGrade] = useState(p.grade || '');

  const handleSave = () => {
    onUpdate(module.id, { notes, completed, grade: grade || null });
    onClose();
  };

  const totalH = (p.totalMinutes / 60).toFixed(1);
  const sessions = (p.sessions || []).slice(-10).reverse();

  return (
    <div className="detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-modal">
        <div className="detail-top" style={{ borderColor: module.color }}>
          <span className="detail-dot" style={{ background: module.color }} />
          <h2>{module.name}</h2>
          <span className="detail-cp">{module.credits} CP</span>
        </div>

        <div className="detail-hours">{totalH}h gelernt</div>

        <div className="detail-field">
          <label><input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} /> Bestanden</label>
          {completed && (
            <input className="grade-input" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Note" />
          )}
        </div>

        <div className="detail-field">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notizen..." rows={3} />
        </div>

        {sessions.length > 0 && (
          <div className="detail-sessions">
            <h3>Letzte Sessions</h3>
            {sessions.map((s, i) => (
              <div key={i} className="session-row">
                <span>{new Date(s.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
                <span>{Math.round(s.minutes)} min</span>
              </div>
            ))}
          </div>
        )}

        <div className="detail-actions">
          <button className="btn-save" onClick={handleSave}>Speichern</button>
          <button className="btn-learn" style={{ background: module.color }} onClick={() => { onStartTimer(module); onClose(); }}>
            Lernen starten
          </button>
        </div>
      </div>
    </div>
  );
}
