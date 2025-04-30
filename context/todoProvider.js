import React, { useEffect, useState, createContext } from "react";
import TodoService from "../service/todoService";

// Create the context
export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  refreshTodos: () => {},
  createTodo: async (data) => {},
  updateTodo: async (data) => {},
  deleteTodo: async (id) => {}
});

// Provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await TodoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch todos.");
      console.error("Failed to fetch todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create a new todo
  const createTodo = async (todoData) => {
    setLoading(true);
    
    try {
      await TodoService.addTodo(todoData);
      fetchTodos();
    } catch (err) {
      setError("Failed to create todo.");
      console.error("Create todo failed:", err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Update an existing todo
  const updateTodo = async (todo) => {
    setLoading(true);
    try {
      //const payload = { id, ...todoData };
      await TodoService.updateTodo(todo);
      await fetchTodos();
      //   if (success) {
      //     setTodos((prev) =>
      //       prev.map((p) => (p.id === id ? { id, ...todoData } : p))
      //     );
      //     return true;
    } catch (err) {
      setError("Failed to update todo.");
      console.error("Update todo failed:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Delete a todo by id
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const success = await TodoService.deleteTodo(id);
      if (success) {
        setTodos((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Delete todo failed:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        refreshTodos: fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};