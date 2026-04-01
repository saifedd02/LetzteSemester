import { useLocalStorage } from './useLocalStorage';
import { MODULES } from '../data/modules';

const createInitialProgress = () => {
  const progress = {};
  MODULES.forEach((m) => {
    progress[m.id] = {
      percent: 0,
      lastStudied: null,
      totalMinutes: 0,
      sessions: [],
      notes: '',
      grade: null,
      completed: false,
    };
  });
  return progress;
};

export function useStudyData() {
  const [progress, setProgress] = useLocalStorage('study-progress', createInitialProgress());
  const [streak, setStreak] = useLocalStorage('study-streak', { current: 0, lastDate: null, best: 0 });
  const [studySessions, setStudySessions] = useLocalStorage('study-sessions', []);

  const updateModuleProgress = (moduleId, updates) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], ...updates },
    }));
  };

  const logStudySession = (moduleId, minutes) => {
    const now = new Date().toISOString();
    const today = new Date().toDateString();

    updateModuleProgress(moduleId, {
      lastStudied: now,
      totalMinutes: (progress[moduleId]?.totalMinutes || 0) + minutes,
      sessions: [...(progress[moduleId]?.sessions || []), { date: now, minutes }],
    });

    setStudySessions((prev) => [...prev, { moduleId, minutes, date: now }]);

    // Update streak
    setStreak((prev) => {
      const lastDate = prev.lastDate ? new Date(prev.lastDate).toDateString() : null;
      if (lastDate === today) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastDate === yesterday.toDateString();

      const newCurrent = isConsecutive ? prev.current + 1 : 1;
      return {
        current: newCurrent,
        lastDate: today,
        best: Math.max(prev.best, newCurrent),
      };
    });
  };

  const getNeglectedModules = (days = 5) => {
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    return MODULES.filter((m) => {
      const p = progress[m.id];
      if (!p || p.completed) return false;
      if (!p.lastStudied) return true;
      return new Date(p.lastStudied).getTime() < threshold;
    });
  };

  const getStudyTimeThisWeek = () => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return studySessions
      .filter((s) => new Date(s.date).getTime() > weekAgo)
      .reduce((sum, s) => sum + s.minutes, 0);
  };

  const getModuleStudyTimeThisWeek = (moduleId) => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return studySessions
      .filter((s) => s.moduleId === moduleId && new Date(s.date).getTime() > weekAgo)
      .reduce((sum, s) => sum + s.minutes, 0);
  };

  const deleteSession = (moduleId, sessionIndex) => {
    const sessions = progress[moduleId]?.sessions || [];
    const session = sessions[sessionIndex];
    if (!session) return;

    const newSessions = sessions.filter((_, i) => i !== sessionIndex);
    const newTotal = newSessions.reduce((sum, s) => sum + s.minutes, 0);

    updateModuleProgress(moduleId, {
      totalMinutes: newTotal,
      sessions: newSessions,
      lastStudied: newSessions.length > 0 ? newSessions[newSessions.length - 1].date : null,
    });

    // Also remove from global sessions list
    setStudySessions((prev) => {
      const idx = prev.findIndex(
        (s) => s.moduleId === moduleId && s.date === session.date && s.minutes === session.minutes
      );
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const editSession = (moduleId, sessionIndex, newMinutes) => {
    const sessions = progress[moduleId]?.sessions || [];
    const oldSession = sessions[sessionIndex];
    if (!oldSession) return;

    const newSessions = sessions.map((s, i) =>
      i === sessionIndex ? { ...s, minutes: newMinutes } : s
    );
    const newTotal = newSessions.reduce((sum, s) => sum + s.minutes, 0);

    updateModuleProgress(moduleId, {
      totalMinutes: newTotal,
      sessions: newSessions,
    });

    // Update global sessions list
    setStudySessions((prev) =>
      prev.map((s) =>
        s.moduleId === moduleId && s.date === oldSession.date && s.minutes === oldSession.minutes
          ? { ...s, minutes: newMinutes }
          : s
      )
    );
  };

  const addManualSession = (moduleId, minutes, date) => {
    const dateStr = date || new Date().toISOString();

    updateModuleProgress(moduleId, {
      lastStudied: dateStr,
      totalMinutes: (progress[moduleId]?.totalMinutes || 0) + minutes,
      sessions: [...(progress[moduleId]?.sessions || []), { date: dateStr, minutes }],
    });

    setStudySessions((prev) => [...prev, { moduleId, minutes, date: dateStr }]);
  };

  return {
    progress,
    streak,
    studySessions,
    updateModuleProgress,
    logStudySession,
    deleteSession,
    editSession,
    addManualSession,
    getNeglectedModules,
    getStudyTimeThisWeek,
    getModuleStudyTimeThisWeek,
  };
}
