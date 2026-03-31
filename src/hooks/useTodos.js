import { useLocalStorage } from './useLocalStorage';

export function useTodos() {
  const [todos, setTodos] = useLocalStorage('study-todos', []);

  const addTodo = (todo) => {
    setTodos((prev) => [...prev, {
      id: Date.now().toString(),
      text: todo.text,
      moduleId: todo.moduleId || null,
      priority: todo.priority || 'mittel',
      dueDate: todo.dueDate || null,
      done: false,
      createdAt: new Date().toISOString(),
    }]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id, text) => {
    setTodos((prev) => prev.map((t) =>
      t.id === id ? { ...t, text } : t
    ));
  };

  return { todos, addTodo, toggleTodo, removeTodo, editTodo };
}
