import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ListTodo,
  Sparkles,
  Settings,
  Menu,
  X,
  Search,
  SlidersHorizontal,
  Plus,
  Circle,
  CheckCircle2,
  Flag,
  CalendarClock,
  Clock,
  Zap,
  MoreVertical,
  Edit3,
  Trash2,
  Inbox,
  ChevronDown,
} from "lucide-react";

import { useTasks } from "../../context/TaskContext";
import "./MyTasks.css";

function FocusMark() {
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 32 32"
      width="26"
      height="26"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.5"
      />
      <circle
        cx="16"
        cy="16"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "My Tasks",
    icon: ListTodo,
    path: "/tasks",
  },
  {
    label: "Focus Intelligence",
    icon: Sparkles,
    path: "/focus",
  },
];

const PRIORITY_STYLES = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

const STATUS_TABS = ["All", "Active", "Completed"];

function formatDueDate(date) {
  if (!date) return "No due date";

  const dueDate = new Date(`${date}T00:00:00`);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference =
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (difference === 0) return "Today";

  if (difference === 1) return "Tomorrow";

  if (difference === -1) return "Yesterday";

  return dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: dueDate.getFullYear() !== today.getFullYear()
      ? "numeric"
      : undefined,
  });
}

function getTaskGroup(task) {
  if (task.completed) return "completed";

  if (!task.dueDate) return "upcoming";

  const dueDate = new Date(`${task.dueDate}T00:00:00`);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (dueDate <= today) {
    return "today";
  }

  return "upcoming";
}

function TaskRow({
  task,
  menuOpen,
  onToggleMenu,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}) {
  return (
    <li className={`task-row ${task.completed ? "task-row-done" : ""}`}>
      <button
        type="button"
        className="task-checkbox"
        onClick={() => onToggleTask(task.id)}
        aria-label={
          task.completed
            ? "Mark task as incomplete"
            : "Mark task as completed"
        }
      >
        {task.completed ? (
          <CheckCircle2 size={20} strokeWidth={1.8} />
        ) : (
          <Circle size={20} strokeWidth={1.8} />
        )}
      </button>

      <div className="task-main">
        <span className="task-title">{task.title}</span>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta-mobile">
          <span
            className={`priority-pill ${
              PRIORITY_STYLES[task.priority]
            }`}
          >
            <Flag size={11} strokeWidth={2} />
            {task.priority}
          </span>

          <span className="meta-item">
            <CalendarClock size={13} strokeWidth={1.8} />
            {formatDueDate(task.dueDate)}
          </span>
        </div>
      </div>

      <span
        className={`priority-pill priority-pill-desktop ${
          PRIORITY_STYLES[task.priority]
        }`}
      >
        <Flag size={12} strokeWidth={2} />
        {task.priority}
      </span>

      <span className="meta-item meta-desktop">
        <CalendarClock size={14} strokeWidth={1.8} />
        {formatDueDate(task.dueDate)}
      </span>

      <span className="meta-item meta-desktop">
        <Clock size={14} strokeWidth={1.8} />
        {task.duration} min
      </span>

      <span className="meta-item meta-desktop">
        <Zap size={14} strokeWidth={1.8} />
        {task.energy}
      </span>

      <div className="task-options">
        <button
          type="button"
          className="icon-button-ghost"
          aria-label="More options"
          onClick={() => onToggleMenu(task.id)}
        >
          <MoreVertical size={17} strokeWidth={1.8} />
        </button>

        {menuOpen && (
          <div className="options-menu">
            <button
              type="button"
              onClick={() => onEditTask(task)}
            >
              <Edit3 size={14} strokeWidth={1.8} />
              Edit task
            </button>

            <button
              type="button"
              className="options-menu-danger"
              onClick={() => onDeleteTask(task.id)}
            >
              <Trash2 size={14} strokeWidth={1.8} />
              Delete task
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function TaskModal({
  isOpen,
  onClose,
  onSave,
  editingTask,
}) {
  const [formData, setFormData] = useState(() => ({
    title: editingTask?.title || "",
    description: editingTask?.description || "",
    priority: editingTask?.priority || "Medium",
    dueDate: editingTask?.dueDate || "",
    duration: editingTask?.duration || 30,
    energy: editingTask?.energy || "Medium",
  }));

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    onSave({
      ...formData,
      title: formData.title.trim(),
      duration: Number(formData.duration),
    });
  };

  return (
    <div className="task-modal-backdrop">
      <div className="task-modal">
        <div className="task-modal-header">
          <div>
            <h2>
              {editingTask
                ? "Edit Task"
                : "Create New Task"}
            </h2>

            <p>
              {editingTask
                ? "Update your task details."
                : "Add something important to your workspace."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="task-form"
          onSubmit={handleSubmit}
        >
          <div className="modal-field">
            <label>Task Title</label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What do you need to do?"
            />
          </div>

          <div className="modal-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details..."
              rows="3"
            />
          </div>

          <div className="task-form-grid">
            <div className="modal-field">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="modal-field">
              <label>Energy Level</label>

              <select
                name="energy"
                value={formData.energy}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="task-form-grid">
            <div className="modal-field">
              <label>Due Date</label>

              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="modal-field">
              <label>Duration (minutes)</label>

              <input
                name="duration"
                type="number"
                min="5"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <p className="task-form-error">
              {error}
            </p>
          )}

          <div className="task-modal-actions">
            <button
              type="button"
              className="modal-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-save-button"
            >
              {editingTask
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MyTasks() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [selectedPriorities, setSelectedPriorities] = useState({
    High: false,
    Medium: false,
    Low: false,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchMatches =
        task.title
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      const statusMatches =
        activeTab === "All" ||
        (activeTab === "Active" && !task.completed) ||
        (activeTab === "Completed" && task.completed);

      const activePriorityFilters =
        Object.values(selectedPriorities).some(Boolean);

      const priorityMatches =
        !activePriorityFilters ||
        selectedPriorities[task.priority];

      return (
        searchMatches &&
        statusMatches &&
        priorityMatches
      );
    });
  }, [
    tasks,
    searchValue,
    activeTab,
    selectedPriorities,
  ]);

  const taskGroups = useMemo(() => {
    const groups = {
      today: [],
      upcoming: [],
      completed: [],
    };

    filteredTasks.forEach((task) => {
      groups[getTaskGroup(task)].push(task);
    });

    return [
      {
        id: "today",
        label: "Today",
        tasks: groups.today,
      },
      {
        id: "upcoming",
        label: "Upcoming",
        tasks: groups.upcoming,
      },
      {
        id: "completed",
        label: "Completed",
        tasks: groups.completed,
      },
    ];
  }, [filteredTasks]);

  const handleToggleMenu = (taskId) => {
    setOpenMenuId((current) =>
      current === taskId ? null : taskId
    );
  };

  const handlePriorityFilter = (priority) => {
    setSelectedPriorities((previous) => ({
      ...previous,
      [priority]: !previous[priority],
    }));
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setOpenMenuId(null);
    setModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      deleteTask(id);
    }

    setOpenMenuId(null);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    setModalOpen(false);
    setEditingTask(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="mytasks-page">
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="brand-lockup">
            <FocusMark />
            <span className="brand-name">
              ZenTask
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(
            ({ label, icon: Icon, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `nav-item ${
                    isActive
                      ? "nav-item-active"
                      : ""
                  }`
                }
                style={{
                  textDecoration: "none",
                }}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                />
                {label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="nav-item"
          >
            <Settings
              size={18}
              strokeWidth={1.8}
            />
            Settings
          </button>
        </div>
      </aside>

      <div className="mytasks-main">
        <header className="mobile-header">
          <button
            type="button"
            className="menu-toggle"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open menu"
          >
            <Menu
              size={22}
              strokeWidth={1.8}
            />
          </button>

          <div className="brand-lockup mobile-brand">
            <FocusMark />
            <span className="brand-name">
              ZenTask
            </span>
          </div>
        </header>

        <main className="mytasks-content">
          <div className="page-header">
            <div>
              <h1>My Tasks</h1>
              <p>
                Everything you need to focus on,
                organized by when it matters.
              </p>
            </div>

            <button
              type="button"
              className="new-task-button"
              onClick={openNewTaskModal}
            >
              <Plus
                size={17}
                strokeWidth={2}
              />
              New Task
            </button>
          </div>

          <div className="task-controls">
            <div className="search-field">
              <Search
                size={17}
                strokeWidth={1.8}
                className="search-icon"
              />

              <input
                type="text"
                placeholder="Search tasks"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
              />
            </div>

            <div className="status-tabs">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`status-tab ${
                    activeTab === tab
                      ? "status-tab-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab(tab)
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="filter-dropdown">
              <button
                type="button"
                className="filter-button"
                onClick={() =>
                  setFiltersOpen((previous) =>
                    !previous
                  )
                }
              >
                <SlidersHorizontal
                  size={16}
                  strokeWidth={1.8}
                />
                Filters
                <ChevronDown
                  size={15}
                  strokeWidth={1.8}
                />
              </button>

              {filtersOpen && (
                <div className="filter-panel">
                  <span className="filter-panel-label">
                    Priority
                  </span>

                  {["High", "Medium", "Low"].map(
                    (priority) => (
                      <label
                        className="filter-checkbox"
                        key={priority}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedPriorities[
                              priority
                            ]
                          }
                          onChange={() =>
                            handlePriorityFilter(
                              priority
                            )
                          }
                        />

                        {priority}
                      </label>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox
                  size={26}
                  strokeWidth={1.6}
                />
              </div>

              <h3>No tasks found</h3>

              <p>
                Try changing your filters or
                create a new task.
              </p>

              <button
                type="button"
                className="new-task-button"
                onClick={openNewTaskModal}
              >
                <Plus
                  size={17}
                  strokeWidth={2}
                />
                New Task
              </button>
            </div>
          ) : (
            <div className="task-groups">
              {taskGroups.map((group) => (
                <section
                  className="task-group"
                  key={group.id}
                >
                  <div className="task-group-header">
                    <h2>{group.label}</h2>

                    <span className="task-count">
                      {group.tasks.length} tasks
                    </span>
                  </div>

                  {group.tasks.length === 0 ? (
                    <p className="group-empty-note">
                      Nothing here right now.
                    </p>
                  ) : (
                    <ul className="task-list">
                      {group.tasks.map(
                        (task) => (
                          <TaskRow
                            key={task.id}
                            task={task}
                            menuOpen={
                              openMenuId === task.id
                            }
                            onToggleMenu={
                              handleToggleMenu
                            }
                            onToggleTask={
                              toggleTask
                            }
                            onEditTask={
                              handleEditTask
                            }
                            onDeleteTask={
                              handleDeleteTask
                            }
                          />
                        )
                      )}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          key={
            editingTask
              ? editingTask.id
              : "new-task"
          }
          isOpen={modalOpen}
          editingTask={editingTask}
          onClose={closeModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}