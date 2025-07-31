import { Routes, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/Landing.tsx";
import Login from "./components/Login.tsx";
import NotFound from "./components/NotFound.tsx";

import "./App.css";
import Dashboard from "./components/Dashboard.tsx";
import DashboardStart from "./components/DashboardStart.tsx";
import ProjectView from "./components/ProjectView.tsx";
import WithRole from "./components/WithRole.tsx";
import WithLogin from "./components/WithLogin.tsx";

function App() {
  return (
    <div className="hidden lg:block h-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/dashboard"
            element={
              <WithLogin>
                <Dashboard />
              </WithLogin>
            }
          >
            <Route path="/dashboard/" element={<DashboardStart />} />
            <Route
              path="/dashboard/project/:id"
            element={
                <WithRole>
                  <ProjectView />
                </WithRole>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />}>
            {" "}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
