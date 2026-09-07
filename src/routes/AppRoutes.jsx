import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyTasks from "../pages/MyTasks/MyTasks";
import FocusIntelligence from "../pages/FocusIntelligence/FocusIntelligence";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<MyTasks />} />
      <Route path="/focus" element={<FocusIntelligence />} />
    </Routes>
  );
}