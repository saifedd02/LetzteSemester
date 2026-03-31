import { MODULES, CATEGORY_LABELS, TOTAL_CREDITS_DONE, TOTAL_CREDITS_NEEDED } from '../data/modules';
import { getQuoteOfDay } from '../data/quotes';
import SemesterCountdown from './SemesterCountdown';

export default function Dashboard({ progress, streak, todos, onSelectModule, getNeglectedModules, onStartTimer }) {
  const neglected = getNeglectedModules();
  const quote = getQuoteOfDay();

  const completedCredits = MODULES.filter((m) => progress[m.id]?.completed)
    .reduce((sum, m) => sum + m.credits, 0);

  // Find max hours for scaling the bars
  const maxMinutes = Math.max(1, ...MODULES.map((m) => progress[m.id]?.totalMinutes || 0));

  const categories = ['pflicht', 'semester5', 'wahl1', 'wahl2', 'projekt'];

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>SS 2026</h1>
          <span className="credits-count">{TOTAL_CREDITS_DONE + completedCredits}/{TOTAL_CREDITS_NEEDED} CP</span>
        </div>
        {streak.current > 0 && (
          <div className="streak">🔥 {streak.current}d</div>
        )}
      </header>

      <SemesterCountdown />

      <div className="daily-quote" dir={quote.lang === 'ar' ? 'rtl' : 'ltr'}>
        <p className="quote-text">{quote.text}</p>
        <span className="quote-lang">{quote.lang === 'de' ? 'Deutsch' : quote.lang === 'fr' ? 'Français' : 'عربي'}</span>
      </div>

      {neglected.length > 0 && (
        <div className="neglect-bar">
          <span className="neglect-label">Nicht gelernt seit 5+ Tagen:</span>
          <div className="neglect-chips">
            {neglected.map((m) => (
              <button key={m.id} className="chip" style={{ borderColor: m.color }} onClick={() => onStartTimer(m)}>
                {m.short}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="module-list">
        {categories.map((cat) => {
          const mods = MODULES.filter((m) => m.category === cat);
          return (
            <div key={cat} className="category-section">
              <h2 className="cat-title">{CATEGORY_LABELS[cat]}</h2>
              {mods.map((mod) => {
                const p = progress[mod.id] || {};
                const totalMins = p.totalMinutes || 0;
                const hours = (totalMins / 60).toFixed(1);
                const barWidth = (totalMins / maxMinutes) * 100;
                const daysSince = p.lastStudied
                  ? Math.floor((Date.now() - new Date(p.lastStudied).getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                const isNeglected = !p.completed && (daysSince === null || daysSince > 5);
                const today = new Date().toISOString().split('T')[0];
                const openTodos = (todos || []).filter((t) => t.moduleId === mod.id && !t.done);
                const hasOverdue = openTodos.some((t) => t.dueDate && t.dueDate < today);
                const hasHoch = openTodos.some((t) => t.priority === 'hoch');
                const hasMittel = openTodos.some((t) => !t.priority || t.priority === 'mittel');
                const badgeBg = openTodos.length === 0 ? null
                  : (hasOverdue || hasHoch) ? '#EF4444'
                  : hasMittel ? '#F59E0B'
                  : '#4F46E5';

                return (
                  <div
                    key={mod.id}
                    className={`module-row ${p.completed ? 'done' : ''} ${isNeglected ? 'warn' : ''}`}
                    onClick={() => onSelectModule(mod)}
                  >
                    <div className="row-left">
                      <span className="mod-dot" style={{ background: mod.color }} />
                      <span className="mod-name">{mod.short}</span>
                      {openTodos.length > 0 && (
                        <span className="mod-todo-badge" style={{ background: badgeBg }}>
                          {hasOverdue ? '!' : openTodos.length}
                        </span>
                      )}
                      <span className="mod-cp">{mod.credits}CP</span>
                      {p.completed && <span className="mod-check">✓</span>}
                    </div>
                    <div className="row-right">
                      <div className="hour-bar">
                        <div className="hour-fill" style={{ width: `${barWidth}%`, background: mod.color }} />
                      </div>
                      <span className="hour-label">{hours}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
