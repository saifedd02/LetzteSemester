import { useLocalStorage } from './useLocalStorage';

function getWeekday(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay(); // 0=Sun, 1=Mon, ...
}

export function useCalendarEvents() {
  const [events, setEvents] = useLocalStorage('calendar-events', []);

  const addEvent = (event) => {
    setEvents((prev) => [...prev, { ...event, id: Date.now().toString() }]);
  };

  const removeEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEvent = (id, updates) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, ...updates } : e));
  };

  // Returns all events for a given date, including weekly recurring ones
  const getEventsForDate = (dateStr) => {
    const weekday = getWeekday(dateStr);
    return events.filter((e) => {
      // Exact date match
      if (e.date === dateStr) return true;
      // Weekly recurring: same weekday AND dateStr >= original date
      if (e.recurring === 'weekly' && getWeekday(e.date) === weekday && dateStr >= e.date) return true;
      return false;
    });
  };

  return { events, addEvent, removeEvent, updateEvent, getEventsForDate };
}
