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

  return {
    progress,
    streak,
    studySessions,
    updateModuleProgress,
    logStudySession,
    getNeglectedModules,
    getStudyTimeThisWeek,
    getModuleStudyTimeThisWeek,
  };
}
