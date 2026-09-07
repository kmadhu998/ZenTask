import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ListTodo,
  Sparkles,
  Settings,
  Menu,
  X,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Flag,
  Clock,
  Zap,
  RefreshCw,
  Play,
  Workflow,
  ArrowDown,
  AlertTriangle,
  ListChecks,
  CalendarClock,
  Ban,
} from "lucide-react";

import { useTasks } from "../../context/TaskContext";
import "./FocusIntelligence.css";

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

const PAGE_TABS = [
  { id: "focus", label: "Focus Mode", icon: Sparkles },
  { id: "ripple", label: "Ripple Analysis", icon: Workflow },
];

const PRIORITY_STYLES = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

const PRIORITY_SCORE = {
  High: 30,
  Medium: 20,
  Low: 10,
};

const ENERGY_LEVELS = [
  {
    id: "Low",
    label: "Low Energy",
    icon: BatteryLow,
    hint: "Light, low-effort work",
  },
  {
    id: "Medium",
    label: "Medium Energy",
    icon: BatteryMedium,
    hint: "Steady, focused work",
  },
  {
    id: "High",
    label: "High Energy",
    icon: BatteryFull,
    hint: "Deep, demanding work",
  },
];

const SIMULATION_OPTIONS = [
  {
    id: "delay1",
    label: "Delay by 1 Day",
    icon: CalendarClock,
  },
  {
    id: "delay3",
    label: "Delay by 3 Days",
    icon: CalendarClock,
  },
  {
    id: "skip",
    label: "Skip Task",
    icon: Ban,
  },
];

function getDaysUntilDue(dueDate) {
  if (!dueDate) return null;

  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date();

  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function getTaskScore(task, selectedEnergy) {
  let score = PRIORITY_SCORE[task.priority] || 10;

  const daysUntilDue = getDaysUntilDue(task.dueDate);

  // Energy match
  if (task.energy === selectedEnergy) {
    score += 35;
  } else if (
    selectedEnergy === "High" &&
    task.energy === "Medium"
  ) {
    score += 15;
  } else if (
    selectedEnergy === "Medium" &&
    task.energy === "Low"
  ) {
    score += 10;
  }

  // Due date urgency
  if (daysUntilDue !== null) {
    if (daysUntilDue < 0) {
      score += 40;
    } else if (daysUntilDue === 0) {
      score += 35;
    } else if (daysUntilDue === 1) {
      score += 25;
    } else if (daysUntilDue <= 3) {
      score += 15;
    }
  }

  // Slight preference for shorter tasks
  if (task.duration <= 30) {
    score += 5;
  }

  return score;
}

function getRecommendationReason(task, selectedEnergy) {
  const daysUntilDue = getDaysUntilDue(task.dueDate);

  if (daysUntilDue !== null && daysUntilDue < 0) {
    return "This task is overdue and should be addressed before less urgent work.";
  }

  if (daysUntilDue === 0) {
    return "This task is due today, making it an important focus for your current work session.";
  }

  if (task.energy === selectedEnergy) {
    return `This task matches your current ${selectedEnergy.toLowerCase()} energy level and is a strong fit for your focus right now.`;
  }

  if (task.priority === "High") {
    return "This is a high-priority task with strong overall importance, making it a valuable next focus.";
  }

  return "Based on priority, workload, deadline, and your current energy level, this is one of your best next tasks.";
}

export default function FocusIntelligence() {
  const { tasks } = useTasks();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("focus");
  const [selectedEnergy, setSelectedEnergy] = useState("Medium");
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const recommendedTasks = useMemo(() => {
    return [...activeTasks]
      .map((task) => ({
        ...task,
        recommendationScore: getTaskScore(task, selectedEnergy),
      }))
      .sort(
        (a, b) =>
          b.recommendationScore - a.recommendationScore
      );
  }, [activeTasks, selectedEnergy]);

  const currentRecommendation =
    recommendedTasks.length > 0
      ? recommendedTasks[
          recommendationIndex % recommendedTasks.length
        ]
      : null;

  const recommendationMatch = currentRecommendation
    ? Math.min(
        98,
        Math.max(
          55,
          currentRecommendation.recommendationScore
        )
      )
    : 0;

  const workloadStats = useMemo(() => {
    const completed = tasks.filter(
      (task) => task.completed
    ).length;

    const overdue = activeTasks.filter((task) => {
      const days = getDaysUntilDue(task.dueDate);
      return days !== null && days < 0;
    }).length;

    const highPriority = activeTasks.filter(
      (task) => task.priority === "High"
    ).length;

    const totalDuration = activeTasks.reduce(
      (total, task) => total + (Number(task.duration) || 0),
      0
    );

    return {
      total: tasks.length,
      completed,
      pending: activeTasks.length,
      overdue,
      highPriority,
      totalDuration,
    };
  }, [tasks, activeTasks]);

  const dependencyTasks = useMemo(() => {
    return [...activeTasks]
      .sort((a, b) => {
        const priorityDifference =
          (PRIORITY_SCORE[b.priority] || 0) -
          (PRIORITY_SCORE[a.priority] || 0);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        const aDate = a.dueDate
          ? new Date(a.dueDate).getTime()
          : Infinity;

        const bDate = b.dueDate
          ? new Date(b.dueDate).getTime()
          : Infinity;

        return aDate - bDate;
      })
      .slice(0, 5);
  }, [activeTasks]);

  const impact = useMemo(() => {
    if (!selectedSimulation || !dependencyTasks.length) {
      return null;
    }

    let affectedTasks = [];
    let risk = "Low";
    let explanation = "";

    if (selectedSimulation === "delay1") {
      affectedTasks = dependencyTasks.slice(1, 3);
      risk =
        workloadStats.overdue > 0 ||
        workloadStats.highPriority > 2
          ? "High"
          : "Medium";

      explanation =
        "A one-day delay may compress the time available for upcoming tasks with higher priority or closer deadlines.";
    }

    if (selectedSimulation === "delay3") {
      affectedTasks = dependencyTasks.slice(1);

      risk =
        affectedTasks.length >= 3
          ? "High"
          : "Medium";

      explanation =
        "A three-day delay could create a noticeable backlog and increase pressure on your remaining scheduled work.";
    }

    if (selectedSimulation === "skip") {
      affectedTasks = dependencyTasks.slice(1);

      risk = "High";

      explanation =
        "Skipping your current priority task may leave important work unfinished and increase the workload of tasks that follow.";
    }

    return {
      risk,
      affected: affectedTasks,
      explanation,
    };
  }, [
    selectedSimulation,
    dependencyTasks,
    workloadStats,
  ]);

  const handleEnergySelect = (energyId) => {
    setSelectedEnergy(energyId);
    setRecommendationIndex(0);
  };

  const handleShowAnother = () => {
    if (recommendedTasks.length > 1) {
      setRecommendationIndex(
        (previous) =>
          (previous + 1) % recommendedTasks.length
      );
    }
  };

  const handleStartFocus = () => {
    if (!currentRecommendation) return;

    alert(
      `Focus session started for: ${currentRecommendation.title}\n\nRecommended duration: ${currentRecommendation.duration} minutes`
    );
  };

  return (
    <div className="focus-page">
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
            <span className="brand-name">ZenTask</span>
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
                style={{ textDecoration: "none" }}
                onClick={() => setSidebarOpen(false)}
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

      <div className="focus-main">
        <header className="mobile-header">
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

          <div className="brand-lockup mobile-brand">
            <FocusMark />
            <span className="brand-name">
              ZenTask
            </span>
          </div>
        </header>

        <main className="focus-content">
          <div className="page-header">
            <h1>Focus Intelligence</h1>

            <p>
              Energy-aware recommendations and
              workload analysis based on your real
              tasks.
            </p>
          </div>

          <div className="page-tabs">
            {PAGE_TABS.map(
              ({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`page-tab ${
                    activeTab === id
                      ? "page-tab-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab(id)
                  }
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                  />
                  {label}
                </button>
              )
            )}
          </div>

          {activeTab === "focus" ? (
            <div className="tab-panel">
              <section className="panel energy-panel">
                <div className="panel-heading">
                  <h2>
                    How is your energy right now?
                  </h2>
                </div>

                <div className="energy-options">
                  {ENERGY_LEVELS.map(
                    ({
                      id,
                      label,
                      icon: Icon,
                      hint,
                    }) => (
                      <button
                        key={id}
                        type="button"
                        className={`energy-card ${
                          selectedEnergy === id
                            ? "energy-card-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleEnergySelect(id)
                        }
                      >
                        <Icon
                          size={22}
                          strokeWidth={1.7}
                        />

                        <span className="energy-label">
                          {label}
                        </span>

                        <span className="energy-hint">
                          {hint}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </section>

              <section className="panel next-task-panel">
                <div className="panel-heading">
                  <h2>Next Best Task</h2>

                  <span className="badge-soft">
                    Real task analysis
                  </span>
                </div>

                {!currentRecommendation ? (
                  <div className="impact-placeholder">
                    <ListChecks
                      size={20}
                      strokeWidth={1.6}
                    />

                    <p>
                      No active tasks available.
                      Create a task in My Tasks to
                      receive intelligent
                      recommendations.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="task-title-large">
                      {currentRecommendation.title}
                    </h3>

                    <p className="task-description">
                      {currentRecommendation.description ||
                        "No description provided for this task."}
                    </p>

                    <div className="task-meta-row">
                      <span
                        className={`priority-pill ${
                          PRIORITY_STYLES[
                            currentRecommendation
                              .priority
                          ]
                        }`}
                      >
                        <Flag
                          size={12}
                          strokeWidth={2}
                        />

                        {
                          currentRecommendation
                            .priority
                        }
                      </span>

                      <span className="meta-item">
                        <Clock
                          size={14}
                          strokeWidth={1.8}
                        />

                        {
                          currentRecommendation
                            .duration
                        }{" "}
                        min
                      </span>

                      <span className="meta-item">
                        <Zap
                          size={14}
                          strokeWidth={1.8}
                        />

                        {
                          currentRecommendation
                            .energy
                        }{" "}
                        energy
                      </span>
                    </div>

                    <div className="match-block">
                      <div className="match-label-row">
                        <span>
                          Focus match
                        </span>

                        <span className="match-percent">
                          {
                            recommendationMatch
                          }
                          %
                        </span>
                      </div>

                      <div className="match-bar">
                        <div
                          className="match-bar-fill"
                          style={{
                            width: `${recommendationMatch}%`,
                          }}
                        />
                      </div>
                    </div>

                    <p className="task-reason">
                      <Sparkles
                        size={15}
                        strokeWidth={1.8}
                      />

                      {getRecommendationReason(
                        currentRecommendation,
                        selectedEnergy
                      )}
                    </p>

                    <div className="task-actions">
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

                        Start Focus Session
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={
                          handleShowAnother
                        }
                      >
                        <RefreshCw
                          size={15}
                          strokeWidth={1.8}
                        />

                        Show Another Recommendation
                      </button>
                    </div>
                  </>
                )}
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <h2>Workload Snapshot</h2>

                  <span className="badge-soft">
                    Live data
                  </span>
                </div>

                <p className="task-description">
                  Total tasks:{" "}
                  <strong>
                    {workloadStats.total}
                  </strong>
                  {" · "}
                  Completed:{" "}
                  <strong>
                    {workloadStats.completed}
                  </strong>
                  {" · "}
                  Pending:{" "}
                  <strong>
                    {workloadStats.pending}
                  </strong>
                  {" · "}
                  Overdue:{" "}
                  <strong>
                    {workloadStats.overdue}
                  </strong>
                  {" · "}
                  Remaining work:{" "}
                  <strong>
                    {
                      workloadStats.totalDuration
                    }{" "}
                    min
                  </strong>
                </p>
              </section>
            </div>
          ) : (
            <div className="tab-panel">
              <section className="panel chain-panel">
                <div className="panel-heading">
                  <h2>Priority Chain</h2>

                  <span className="badge-soft">
                    Based on your tasks
                  </span>
                </div>

                {!dependencyTasks.length ? (
                  <div className="impact-placeholder">
                    <ListChecks
                      size={20}
                      strokeWidth={1.6}
                    />

                    <p>
                      No active tasks available for
                      analysis.
                    </p>
                  </div>
                ) : (
                  <div className="chain-list">
                    {dependencyTasks.map(
                      (task, index) => (
                        <div
                          className="chain-item"
                          key={task.id}
                        >
                          <div className="chain-node">
                            {task.title}
                          </div>

                          {index <
                            dependencyTasks.length -
                              1 && (
                            <ArrowDown
                              size={18}
                              strokeWidth={1.8}
                              className="chain-arrow"
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              <section className="panel simulation-panel">
                <div className="panel-heading">
                  <h2>Simulate a Delay</h2>
                </div>

                <div className="simulation-options">
                  {SIMULATION_OPTIONS.map(
                    ({
                      id,
                      label,
                      icon: Icon,
                    }) => (
                      <button
                        key={id}
                        type="button"
                        className={`simulation-button ${
                          selectedSimulation ===
                          id
                            ? "simulation-button-active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedSimulation(
                            id
                          )
                        }
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                        />

                        {label}
                      </button>
                    )
                  )}
                </div>
              </section>

              <section className="panel impact-panel">
                <div className="panel-heading">
                  <h2>Impact Analysis</h2>
                </div>

                {!impact ? (
                  <div className="impact-placeholder">
                    <AlertTriangle
                      size={20}
                      strokeWidth={1.6}
                    />

                    <p>
                      Select a simulation option
                      above to see the possible
                      impact on your current task
                      workload.
                    </p>
                  </div>
                ) : (
                  <div className="impact-body">
                    <div className="impact-risk-row">
                      <span className="impact-risk-label">
                        Risk Level
                      </span>

                      <span
                        className={`priority-pill ${
                          PRIORITY_STYLES[
                            impact.risk
                          ]
                        }`}
                      >
                        <AlertTriangle
                          size={12}
                          strokeWidth={2}
                        />

                        {impact.risk}
                      </span>
                    </div>

                    <p className="impact-count">
                      {impact.affected.length}{" "}
                      tasks may be affected
                    </p>

                    <ul className="affected-list">
                      {impact.affected.map(
                        (task) => (
                          <li key={task.id}>
                            <ListChecks
                              size={14}
                              strokeWidth={1.8}
                            />

                            {task.title}
                          </li>
                        )
                      )}
                    </ul>

                    <p className="impact-explanation">
                      {impact.explanation}
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}