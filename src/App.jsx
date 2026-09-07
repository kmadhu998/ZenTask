import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "")}
    >
      <TaskProvider>
        <AppRoutes />
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;