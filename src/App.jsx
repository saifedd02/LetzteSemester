import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Todos from './components/Todos';
import ChronoTimer from './components/ChronoTimer';
import ModuleDetail from './components/ModuleDetail';
import { useStudyData } from './hooks/useStudyData';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { useTodos } from './hooks/useTodos';
import './App.css';

export default function App() {
  const {
    progress,
    streak,
    studySessions,
    updateModuleProgress,
    logStudySession,
    deleteSession,
    editSession,
    addManualSession,
    getNeglectedModules,
  } = useStudyData();

  const { events, addEvent, removeEvent, getEventsForDate } = useCalendarEvents();
  const { todos, addTodo, toggleTodo, removeTodo, editTodo } = useTodos();

  const [page, setPage] = useState('dashboard');
  const [showTimer, setShowTimer] = useState(() => {
    // Auto-open timer if one was running
    try {
      return !!localStorage.getItem('chrono-timer-state');
    } catch { return false; }
  });
  const [timerModule, setTimerModule] = useState(null);
  const [detailModule, setDetailModule] = useState(null);

  const startTimer = (mod) => {
    setTimerModule(mod);
    setShowTimer(true);
  };

  return (
    <div className="app">
      <nav className="nav-bar">
        <button className={`nav-tab ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>
          Module
        </button>
        <button className={`nav-tab ${page === 'calendar' ? 'active' : ''}`} onClick={() => setPage('calendar')}>
          Kalender
        </button>
        <button className={`nav-tab ${page === 'todos' ? 'active' : ''}`} onClick={() => setPage('todos')}>
          Aufgaben
          {todos.filter(t => !t.done).length > 0 && (
            <span className="nav-badge">{todos.filter(t => !t.done).length}</span>
          )}
        </button>
      </nav>

      {page === 'dashboard' && (
        <Dashboard
          progress={progress}
          streak={streak}
          todos={todos}
          studySessions={studySessions}
          onSelectModule={setDetailModule}
          getNeglectedModules={getNeglectedModules}
          onStartTimer={startTimer}
        />
      )}

      {page === 'calendar' && (
        <Calendar
          studySessions={studySessions}
          calendarEvents={events}
          getEventsForDate={getEventsForDate}
          onAddEvent={addEvent}
          onRemoveEvent={removeEvent}
          onAddTodo={addTodo}
        />
      )}

      {page === 'todos' && (
        <Todos
          todos={todos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onEdit={editTodo}
        />
      )}

      <button className="fab" onClick={() => setShowTimer(true)}>▶</button>

      {showTimer && (
        <ChronoTimer
          selectedModule={timerModule}
          onSessionComplete={logStudySession}
          onClose={() => { setShowTimer(false); setTimerModule(null); }}
        />
      )}

      {detailModule && (
        <ModuleDetail
          module={detailModule}
          progress={progress[detailModule.id]}
          onUpdate={updateModuleProgress}
          onDeleteSession={deleteSession}
          onEditSession={editSession}
          onAddManualSession={addManualSession}
          onStartTimer={startTimer}
          onClose={() => setDetailModule(null)}
        />
      )}
    </div>
  );
}
