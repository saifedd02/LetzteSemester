import { useState } from 'react';
import { MODULES } from '../data/modules';

const PRIO_COLORS = { hoch: '#EF4444', mittel: '#F59E0B', niedrig: '#475569' };
const PRIO_ORDER = { hoch: 0, mittel: 1, niedrig: 2 };

function getDueDateLabel(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: `${Math.abs(diff)}d überfällig`, color: '#EF4444' };
  if (diff === 0) return { text: 'Heute fällig', color: '#F59E0B' };
  if (diff === 1) return { text: 'Morgen', color: '#F59E0B' };
  if (diff <= 7) return { text: `in ${diff}d`, color: '#94A3B8' };
  return { text: `in ${diff}d`, color: '#64748B' };
}

export default function Todos({ todos, onAdd, onToggle, onRemove, onEdit }) {
  const [text, setText] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [priority, setPriority] = useState('mittel');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), moduleId: moduleId || null, priority, dueDate: dueDate || null });
    setText('');
    setDueDate('');
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) onEdit(id, editText.trim());
    setEditingId(null);
  };

  const filtered = todos
    .filter((t) => {
      if (filter === 'open') return !t.done;
      if (filter === 'done') return t.done;
      return true;
    })
    .sort((a, b) => {
      if (a.done && !b.done) return 1;
      if (!a.done && b.done) return -1;
      const aOv = a.dueDate && a.dueDate < today ? 0 : 1;
      const bOv = b.dueDate && b.dueDate < today ? 0 : 1;
      if (aOv !== bOv) return aOv - bOv;
      return PRIO_ORDER[a.priority || 'mittel'] - PRIO_ORDER[b.priority || 'mittel'];
    });

  const openCount = todos.filter((t) => !t.done).length;
  const doneCount = todos.filter((t) => t.done).length;
  const overdueCount = todos.filter((t) => !t.done && t.dueDate && t.dueDate < today).length;

  const grouped = {};
  const noModule = [];
  filtered.forEach((t) => {
    if (t.moduleId) {
      if (!grouped[t.moduleId]) grouped[t.moduleId] = [];
      grouped[t.moduleId].push(t);
    } else {
      noModule.push(t);
    }
  });

  const renderTodo = (t) => {
    const mod = t.moduleId ? MODULES.find((m) => m.id === t.moduleId) : null;
    const isEditing = editingId === t.id;
    const prioColor = PRIO_COLORS[t.priority || 'mittel'];
    const dueLabel = getDueDateLabel(t.dueDate);

    return (
      <div key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
        <span className="todo-prio-dot" style={{ background: t.done ? '#334155' : prioColor }} />
        <button className="todo-check" onClick={() => onToggle(t.id)}>
          {t.done ? '✓' : ''}
        </button>
        <div className="todo-content">
          {isEditing ? (
            <input
              className="todo-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(t.id); if (e.key === 'Escape') setEditingId(null); }}
              autoFocus
              onBlur={() => saveEdit(t.id)}
            />
          ) : (
            <span className="todo-text" onDoubleClick={() => startEdit(t)}>{t.text}</span>
          )}
          {mod && !t.moduleId?.startsWith('_group_') && (
            <span className="todo-module" style={{ color: mod.color }}>{mod.short}</span>
          )}
          {dueLabel && !t.done && (
            <span className="todo-due" style={{ color: dueLabel.color }}>{dueLabel.text}</span>
          )}
        </div>
        <button className="todo-remove" onClick={() => onRemove(t.id)}>✕</button>
      </div>
    );
  };

  return (
    <div className="todos">
      <div className="todos-header">
        <h2>Aufgaben</h2>
        <span className="todos-count">
          {openCount} offen{overdueCount > 0 && <span className="todos-overdue"> · {overdueCount} überfällig</span>}, {doneCount} erledigt
        </span>
      </div>

      <div className="todo-add">
        <div className="todo-add-row1">
          <input
            className="todo-add-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Neue Aufgabe..."
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="todo-add-btn" onClick={handleAdd}>+</button>
        </div>
        <div className="todo-add-row2">
          <select className="todo-add-module" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            <option value="">Kein Modul</option>
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>{m.short}</option>
            ))}
          </select>
          <select className="todo-add-prio" value={priority} onChange={(e) => setPriority(e.target.value)}
            style={{ color: PRIO_COLORS[priority] }}>
            <option value="hoch">! Hoch</option>
            <option value="mittel">Mittel</option>
            <option value="niedrig">Niedrig</option>
          </select>
          <input
            type="date"
            className="todo-add-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="todo-filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Alle ({todos.length})</button>
        <button className={filter === 'open' ? 'active' : ''} onClick={() => setFilter('open')}>Offen ({openCount})</button>
        <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>Erledigt ({doneCount})</button>
      </div>

      <div className="todo-list">
        {Object.entries(grouped).map(([modId, items]) => {
          const mod = MODULES.find((m) => m.id === modId);
          return (
            <div key={modId} className="todo-group">
              <div className="todo-group-header">
                <span className="todo-group-dot" style={{ background: mod?.color }} />
                <span className="todo-group-name">{mod?.short || modId}</span>
                <span className="todo-group-count">{items.filter(t => !t.done).length}</span>
              </div>
              {items.map(renderTodo)}
            </div>
          );
        })}
        {noModule.length > 0 && (
          <div className="todo-group">
            {Object.keys(grouped).length > 0 && (
              <div className="todo-group-header">
                <span className="todo-group-dot" style={{ background: '#64748B' }} />
                <span className="todo-group-name">Allgemein</span>
              </div>
            )}
            {noModule.map(renderTodo)}
          </div>
        )}
        {filtered.length === 0 && (
          <p className="todo-empty">{filter === 'done' ? 'Noch nichts erledigt.' : filter === 'open' ? 'Alles erledigt!' : 'Keine Aufgaben.'}</p>
        )}
      </div>
    </div>
  );
}
