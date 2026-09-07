import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  ListTodo,
  Sparkles,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  Gauge,
  ListChecks,
  CheckCircle2,
  CalendarClock,
  Circle,
  Clock,
  Zap,
  Flag,
  Play,
} from "lucide-react";

import { useTasks } from "../../context/TaskContext";

import "./Dashboard.css";

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

function getFormattedUserName() {
  const savedName = localStorage.getItem("zentask_user_name");

  if (savedName && savedName.trim()) {
    return savedName.trim();
  }

  const userEmail =
    localStorage.getItem("zentask_user_email") || "User";

  const emailName = userEmail
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .replace(/[._-]/g, " ")
    .trim();

  if (!emailName) return "User";

  return emailName
    .split(" ")
    .filter(Boolean)
    .map(
      (name) =>
        name.charAt(0).toUpperCase() +
        name.slice(1).toLowerCase()
    )
    .join(" ");
}

function getInitials(name) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "U"
  );
}

function isToday(dateString) {
  if (!dateString) return false;

  const taskDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();

  taskDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return taskDate.getTime() === today.getTime();
}

function formatDueDate(dateString) {
  if (!dateString) return "No due date";

  const dueDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference =
    (dueDate.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);

  if (difference === 0) return "Today";

  if (difference === 1) return "Tomorrow";

  if (difference === -1) return "Yesterday";

  return dueDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const {
    tasks,
    toggleTask,
  } = useTasks();

  const formattedName = getFormattedUserName();

  const initials = getInitials(formattedName);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";

    if (hour < 18) return "Good afternoon";

    return "Good evening";
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const activeTasks = tasks.filter(
    (task) => !task.completed
  );

  const dueTodayTasks = activeTasks.filter((task) =>
    isToday(task.dueDate)
  );

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const zenScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        completionPercentage * 0.7 +
          (activeTasks.length === 0 ? 30 : 15)
      )
    )
  );

  const stats = [
    {
      key: "zen",
      label: "Zen Score",
      value: zenScore,
      suffix: "/100",
      icon: Gauge,
    },
    {
      key: "total",
      label: "Total Tasks",
      value: totalTasks,
      suffix: "",
      icon: ListChecks,
    },
    {
      key: "completed",
      label: "Completed",
      value: completedTasks,
      suffix: "",
      icon: CheckCircle2,
    },
    {
      key: "due",
      label: "Due Today",
      value: dueTodayTasks.length,
      suffix: "",
      icon: CalendarClock,
    },
  ];

  const nextBestTask = useMemo(() => {
    if (activeTasks.length === 0) return null;

    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    return [...activeTasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) {
        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );
      }

      if (!a.dueDate) return 1;

      if (!b.dueDate) return -1;

      const dateDifference =
        new Date(`${a.dueDate}T00:00:00`) -
        new Date(`${b.dueDate}T00:00:00`);

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return (
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
      );
    })[0];
  }, [activeTasks]);

  const todayTasks = useMemo(() => {
    const tasksForToday = tasks.filter(
      (task) =>
        isToday(task.dueDate) || !task.completed
    );

    return tasksForToday.slice(0, 5);
  }, [tasks]);

  const remainingTasks = todayTasks.filter(
    (task) => !task.completed
  ).length;

  const RING_RADIUS = 54;

  const RING_CIRCUMFERENCE =
    2 * Math.PI * RING_RADIUS;

  const ringOffset =
    RING_CIRCUMFERENCE -
    (zenScore / 100) * RING_CIRCUMFERENCE;

  const handleStartFocus = () => {
    navigate("/focus");
  };

  const handleSearch = () => {
    navigate("/tasks");
  };

  const handleNotifications = () => {
    alert("No new notifications right now.");
  };

  return (
    <div className="dashboard-page">

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
            onClick={() =>
              alert(
                "Settings will be added in a future update."
              )
            }
          >
            <Settings
              size={18}
              strokeWidth={1.8}
            />

            Settings
          </button>
        </div>
      </aside>

      <div className="dashboard-main">

        <header className="dashboard-header">

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu
              size={22}
              strokeWidth={1.8}
            />
          </button>

          <div className="header-welcome">
            <h1>
              {greeting}, {formattedName}
            </h1>

            <p>{today}</p>
          </div>

          <div className="header-actions">

            <button
              type="button"
              className="icon-button"
              aria-label="Search"
              onClick={handleSearch}
            >
              <Search
                size={19}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
              onClick={handleNotifications}
            >
              <Bell
                size={19}
                strokeWidth={1.8}
              />

              <span className="notification-dot" />
            </button>

            <div
              className="user-avatar"
              aria-label={formattedName}
              title={formattedName}
            >
              {initials}
            </div>

          </div>

        </header>

        <main className="dashboard-content">

          <section className="stats-grid">

            {stats.map(
              ({
                key,
                label,
                value,
                suffix,
                icon: Icon,
              }) => (
                <div
                  className="stat-card"
                  key={key}
                >
                  <div className="stat-icon">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="stat-body">

                    <span className="stat-value">
                      {value}

                      {suffix && (
                        <span className="stat-suffix">
                          {suffix}
                        </span>
                      )}
                    </span>

                    <span className="stat-label">
                      {label}
                    </span>

                  </div>
                </div>
              )
            )}

          </section>

          <section className="insight-grid">

            <div className="panel zen-score-panel">

              <div className="panel-heading">
                <h2>Zen Score</h2>
              </div>

              <div className="zen-score-body">

                <div className="score-ring-wrapper">

                  <svg
                    viewBox="0 0 128 128"
                    className="score-ring"
                  >
                    <circle
                      cx="64"
                      cy="64"
                      r={RING_RADIUS}
                      className="score-ring-track"
                      fill="none"
                      strokeWidth="10"
                    />

                    <circle
                      cx="64"
                      cy="64"
                      r={RING_RADIUS}
                      className="score-ring-progress"
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={
                        RING_CIRCUMFERENCE
                      }
                      strokeDashoffset={
                        ringOffset
                      }
                    />
                  </svg>

                  <div className="score-ring-label">

                    <span className="score-number">
                      {zenScore}
                    </span>

                    <span className="score-denominator">
                      / 100
                    </span>

                  </div>

                </div>

                <p className="score-status">
                  {activeTasks.length === 0
                    ? "Amazing work! You have completed all your tasks."
                    : completedTasks === 0
                    ? "Start with your most important task and build your focus rhythm."
                    : "You're making good progress. Keep focusing on your highest priority tasks."}
                </p>

              </div>

            </div>

            <div className="panel next-task-panel">

              <div className="panel-heading">

                <h2>Next Best Task</h2>

                <span className="badge-soft">
                  Recommended
                </span>

              </div>

              {nextBestTask ? (
                <>
                  <h3 className="next-task-title">
                    {nextBestTask.title}
                  </h3>

                  <div className="next-task-meta">

                    <span
                      className={`priority-pill ${
                        PRIORITY_STYLES[
                          nextBestTask.priority
                        ]
                      }`}
                    >
                      <Flag
                        size={13}
                        strokeWidth={2}
                      />

                      {nextBestTask.priority} priority
                    </span>

                    <span className="meta-item">
                      <Clock
                        size={14}
                        strokeWidth={1.8}
                      />

                      {nextBestTask.duration ||
                        30}{" "}
                      min
                    </span>

                    <span className="meta-item">
                      <Zap
                        size={14}
                        strokeWidth={1.8}
                      />

                      {nextBestTask.energy ||
                        "Medium"}{" "}
                      energy
                    </span>

                  </div>

                  <p className="next-task-reason">
                    This task is recommended based on
                    its priority and due date. Completing
                    it now can help you stay focused.
                  </p>

                  <button
                    type="button"
                    className="start-focus-button"
                    onClick={handleStartFocus}
                  >
                    <Play
                      size={16}
                      strokeWidth={2}
                      fill="currentColor"
                    />

                    Start Focus
                  </button>
                </>
              ) : (
                <>
                  <h3 className="next-task-title">
                    No tasks remaining
                  </h3>

                  <p className="next-task-reason">
                    Great job! You have completed all
                    your tasks.
                  </p>

                  <button
                    type="button"
                    className="start-focus-button"
                    onClick={() =>
                      navigate("/tasks")
                    }
                  >
                    <ListTodo
                      size={16}
                      strokeWidth={2}
                    />

                    Add New Task
                  </button>
                </>
              )}

            </div>

          </section>

          <section className="panel today-tasks-panel">

            <div className="panel-heading">

              <h2>Today's Tasks</h2>

              <span className="badge-soft">
                {remainingTasks} remaining
              </span>

            </div>

            {todayTasks.length > 0 ? (
              <ul className="task-list">

                {todayTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`task-row ${
                      task.completed
                        ? "task-row-done"
                        : ""
                    }`}
                  >

                    <button
                      type="button"
                      className="task-status-icon"
                      onClick={() =>
                        toggleTask(task.id)
                      }
                      aria-label={
                        task.completed
                          ? "Mark task incomplete"
                          : "Mark task completed"
                      }
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      {task.completed ? (
                        <CheckCircle2
                          size={19}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Circle
                          size={19}
                          strokeWidth={1.8}
                        />
                      )}
                    </button>

                    <span className="task-title">
                      {task.title}
                    </span>

                    <span
                      className={`priority-pill ${
                        PRIORITY_STYLES[
                          task.priority
                        ]
                      }`}
                    >
                      <Flag
                        size={12}
                        strokeWidth={2}
                      />

                      {task.priority}
                    </span>

                    <span className="task-due">
                      <Clock
                        size={14}
                        strokeWidth={1.8}
                      />

                      {formatDueDate(
                        task.dueDate
                      )}
                    </span>

                  </li>
                ))}

              </ul>
            ) : (
              <p className="next-task-reason">
                No tasks yet. Go to My Tasks and create
                your first task.
              </p>
            )}

          </section>

        </main>

      </div>

    </div>
  );
}