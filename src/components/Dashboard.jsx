import { useState } from 'react';
import { MODULES, CATEGORY_LABELS, TOTAL_CREDITS_DONE, TOTAL_CREDITS_NEEDED } from '../data/modules';
import { getQuoteOfDay } from '../data/quotes';
import SemesterCountdown from './SemesterCountdown';

const CHART_TYPES = [
  { id: 'bars', label: 'Balken' },
  { id: 'columns', label: 'Säulen' },
  { id: 'pie', label: 'Kreis' },
];

function formatTime(totalMins) {
  const h = Math.floor(totalMins / 60);
  const m = Math.round(totalMins % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ===== PIE / DONUT CHART =====
function PieChart({ progress }) {
  const data = MODULES.map((m) => ({
    ...m,
    minutes: progress[m.id]?.totalMinutes || 0,
  })).filter((d) => d.minutes > 0);

  const total = data.reduce((sum, d) => sum + d.minutes, 0);
  if (total === 0) {
    return <div className="chart-empty">Noch keine Lernzeit erfasst</div>;
  }

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 95;
  const innerR = 55;

  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.minutes / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;

    const x1o = cx + outerR * Math.cos(startAngle);
    const y1o = cy + outerR * Math.sin(startAngle);
    const x2o = cx + outerR * Math.cos(endAngle);
    const y2o = cy + outerR * Math.sin(endAngle);
    const x1i = cx + innerR * Math.cos(endAngle);
    const y1i = cy + innerR * Math.sin(endAngle);
    const x2i = cx + innerR * Math.cos(startAngle);
    const y2i = cy + innerR * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i}`,
      'Z',
    ].join(' ');

    const midAngle = startAngle + angle / 2;
    const labelR = (outerR + innerR) / 2;
    const pct = Math.round((d.minutes / total) * 100);

    return { ...d, path, midAngle, labelR, pct, angle };
  });

  return (
    <div className="pie-chart-container">
      <svg viewBox={`0 0 ${size} ${size}`} className="pie-chart-svg">
        {slices.map((s) => (
          <path key={s.id} d={s.path} fill={s.color} stroke="var(--bg)" strokeWidth="2" />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" className="pie-center-total">
          {formatTime(total)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="pie-center-label">
          Gesamt
        </text>
      </svg>
      <div className="pie-legend">
        {slices.map((s) => (
          <div key={s.id} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: s.color }} />
            <span className="pie-legend-name">{s.short}</span>
            <span className="pie-legend-value">{formatTime(s.minutes)}</span>
            <span className="pie-legend-pct">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== COLUMN CHART =====
function ColumnChart({ progress, onSelectModule }) {
  const data = MODULES.map((m) => ({
    ...m,
    minutes: progress[m.id]?.totalMinutes || 0,
  }));

  const maxMinutes = Math.max(1, ...data.map((d) => d.minutes));
  const total = data.reduce((sum, d) => sum + d.minutes, 0);

  if (total === 0) {
    return <div className="chart-empty">Noch keine Lernzeit erfasst</div>;
  }

  return (
    <div className="column-chart">
      <div className="column-chart-bars">
        {data.map((d) => {
          const heightPct = (d.minutes / maxMinutes) * 100;
          const mod = MODULES.find((m) => m.id === d.id);
          return (
            <div
              key={d.id}
              className="column-item"
              onClick={() => onSelectModule(mod)}
            >
              <div className="column-value">{d.minutes > 0 ? formatTime(d.minutes) : ''}</div>
              <div className="column-bar-wrapper">
                <div
                  className="column-bar"
                  style={{
                    height: `${Math.max(heightPct, d.minutes > 0 ? 4 : 0)}%`,
                    background: d.color,
                  }}
                />
              </div>
              <div className="column-label">{d.short}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== MAIN DASHBOARD =====
export default function Dashboard({ progress, streak, todos, studySessions, onSelectModule, getNeglectedModules, onStartTimer }) {
  const [chartType, setChartType] = useState('bars');
  const neglected = getNeglectedModules();
  const quote = getQuoteOfDay();

  const completedCredits = MODULES.filter((m) => progress[m.id]?.completed)
    .reduce((sum, m) => sum + m.credits, 0);

  const maxMinutes = Math.max(1, ...MODULES.map((m) => progress[m.id]?.totalMinutes || 0));
  const totalStudyMinutes = MODULES.reduce((sum, m) => sum + (progress[m.id]?.totalMinutes || 0), 0);

  const categories = ['pflicht', 'semester5', 'wahl1', 'wahl2', 'projekt'];

  // Weekly summary
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekMinutes = (studySessions || [])
    .filter((s) => new Date(s.date).getTime() > weekAgo)
    .reduce((sum, s) => sum + s.minutes, 0);

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

      {/* Study stats summary */}
      <div className="study-stats-row">
        <div className="stat-card">
          <span className="stat-value">{formatTime(totalStudyMinutes)}</span>
          <span className="stat-label">Gesamt</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatTime(weekMinutes)}</span>
          <span className="stat-label">Diese Woche</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{MODULES.filter((m) => (progress[m.id]?.totalMinutes || 0) > 0).length}/{MODULES.length}</span>
          <span className="stat-label">Module aktiv</span>
        </div>
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

      {/* Chart type selector */}
      <div className="chart-section">
        <div className="chart-header">
          <h2 className="chart-title">Lernzeit pro Modul</h2>
          <select
            className="chart-select"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {CHART_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {chartType === 'pie' && (
          <PieChart progress={progress} />
        )}

        {chartType === 'columns' && (
          <ColumnChart progress={progress} onSelectModule={onSelectModule} />
        )}

        {chartType === 'bars' && (
          <div className="module-list">
            {categories.map((cat) => {
              const mods = MODULES.filter((m) => m.category === cat);
              return (
                <div key={cat} className="category-section">
                  <h2 className="cat-title">{CATEGORY_LABELS[cat]}</h2>
                  {mods.map((mod) => {
                    const p = progress[mod.id] || {};
                    const totalMins = p.totalMinutes || 0;
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
                            <div className="hour-fill" style={{ width: `${Math.max(barWidth, totalMins > 0 ? 3 : 0)}%`, background: mod.color }} />
                          </div>
                          <span className="hour-label">{formatTime(totalMins)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
