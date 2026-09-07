import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { TaskProvider } from "./context/TaskContext";

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <AppRoutes />
      </TaskProvider>
    </BrowserRouter>
  );
}