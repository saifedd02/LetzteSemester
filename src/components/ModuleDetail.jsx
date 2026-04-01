import { useState } from 'react';
import { MODULES } from '../data/modules';

export default function ModuleDetail({ module, progress, onUpdate, onDeleteSession, onEditSession, onAddManualSession, onStartTimer, onClose }) {
  const p = progress || { percent: 0, totalMinutes: 0, notes: '', completed: false, grade: null, sessions: [] };
  const [notes, setNotes] = useState(p.notes || '');
  const [completed, setCompleted] = useState(p.completed);
  const [grade, setGrade] = useState(p.grade || '');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editMinutes, setEditMinutes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMinutes, setAddMinutes] = useState('');
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = () => {
    onUpdate(module.id, { notes, completed, grade: grade || null });
    onClose();
  };

  const handleEditStart = (idx, currentMinutes) => {
    setEditingIdx(idx);
    setEditMinutes(String(currentMinutes));
  };

  const handleEditSave = (realIdx) => {
    const mins = parseInt(editMinutes);
    if (mins > 0) {
      onEditSession(module.id, realIdx, mins);
    }
    setEditingIdx(null);
    setEditMinutes('');
  };

  const handleDelete = (realIdx) => {
    onDeleteSession(module.id, realIdx);
    setConfirmDelete(null);
  };

  const handleAddManual = () => {
    const mins = parseInt(addMinutes);
    if (mins > 0) {
      const dateStr = new Date(addDate + 'T12:00:00').toISOString();
      onAddManualSession(module.id, mins, dateStr);
      setAddMinutes('');
      setAddDate(new Date().toISOString().split('T')[0]);
      setShowAddForm(false);
    }
  };

  const formatTime = (totalMins) => {
    const h = Math.floor(totalMins / 60);
    const m = Math.round(totalMins % 60);
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const totalH = formatTime(p.totalMinutes);
  const allSessions = p.sessions || [];
  const sessions = allSessions.slice().reverse();

  return (
    <div className="detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-modal">
        <div className="detail-top" style={{ borderColor: module.color }}>
          <span className="detail-dot" style={{ background: module.color }} />
          <h2>{module.name}</h2>
          <span className="detail-cp">{module.credits} CP</span>
        </div>

        <div className="detail-hours">{totalH} gelernt</div>

        <div className="detail-field">
          <label><input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} /> Bestanden</label>
          {completed && (
            <input className="grade-input" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Note" />
          )}
        </div>

        <div className="detail-field">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notizen..." rows={3} />
        </div>

        <div className="detail-sessions">
          <div className="sessions-header">
            <h3>Sessions ({allSessions.length})</h3>
            <button className="sessions-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? '×' : '+ Manuell'}
            </button>
          </div>

          {showAddForm && (
            <div className="session-add-form">
              <div className="session-add-row">
                <input
                  type="date"
                  className="session-add-date"
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                />
                <div className="session-add-minutes-wrap">
                  <input
                    type="number"
                    className="session-add-minutes"
                    value={addMinutes}
                    onChange={(e) => setAddMinutes(e.target.value)}
                    placeholder="Min"
                    min="1"
                  />
                  <span className="session-add-unit">min</span>
                </div>
                <button className="session-add-confirm" onClick={handleAddManual}>+</button>
              </div>
            </div>
          )}

          {sessions.length > 0 ? (
            <div className="sessions-list">
              {sessions.map((s, displayIdx) => {
                const realIdx = allSessions.length - 1 - displayIdx;
                const isEditing = editingIdx === displayIdx;
                const isConfirming = confirmDelete === displayIdx;

                return (
                  <div key={displayIdx} className="session-row-enhanced">
                    <span className="session-date">
                      {new Date(s.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </span>

                    {isEditing ? (
                      <div className="session-edit-wrap">
                        <input
                          type="number"
                          className="session-edit-input"
                          value={editMinutes}
                          onChange={(e) => setEditMinutes(e.target.value)}
                          min="1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(realIdx);
                            if (e.key === 'Escape') setEditingIdx(null);
                          }}
                        />
                        <span className="session-edit-unit">min</span>
                        <button className="session-action-btn save" onClick={() => handleEditSave(realIdx)}>✓</button>
                        <button className="session-action-btn cancel" onClick={() => setEditingIdx(null)}>×</button>
                      </div>
                    ) : (
                      <>
                        <span className="session-minutes">{Math.round(s.minutes)} min</span>
                        <div className="session-actions">
                          <button
                            className="session-action-btn edit"
                            onClick={() => handleEditStart(displayIdx, Math.round(s.minutes))}
                            title="Bearbeiten"
                          >✎</button>
                          {isConfirming ? (
                            <>
                              <button className="session-action-btn delete-confirm" onClick={() => handleDelete(realIdx)}>Ja</button>
                              <button className="session-action-btn cancel" onClick={() => setConfirmDelete(null)}>Nein</button>
                            </>
                          ) : (
                            <button
                              className="session-action-btn delete"
                              onClick={() => setConfirmDelete(displayIdx)}
                              title="Löschen"
                            >✕</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="sessions-empty">Noch keine Sessions</p>
          )}
        </div>

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
