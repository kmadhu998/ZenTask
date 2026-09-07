import { createContext, useContext, useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../utils/localStorage";

const TaskContext = createContext();

const STORAGE_KEY = "zentask_tasks";

const INITIAL_TASKS = [
  {
    id: crypto.randomUUID(),
    title: "Complete React project",
    description: "Finish the ZenTask project implementation.",
    priority: "High",
    dueDate: "2026-09-10",
    duration: 90,
    energy: "High",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Review project documentation",
    description: "Review the README and project structure.",
    priority: "Medium",
    dueDate: "2026-09-08",
    duration: 30,
    energy: "Medium",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Organize project files",
    description: "Clean up unused files and folders.",
    priority: "Low",
    dueDate: "2026-09-12",
    duration: 20,
    energy: "Low",
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() =>
    getFromStorage(STORAGE_KEY, INITIAL_TASKS)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEY, tasks);
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "",
      duration: Number(task.duration) || 30,
      energy: task.energy || "Medium",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }

  return context;
}