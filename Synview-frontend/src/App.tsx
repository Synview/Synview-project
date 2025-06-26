import { Routes, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/Landing.tsx";
import Login from "./components/Login.tsx";
import NotFound from "./components/NotFound.tsx";
import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard.tsx";
import DashboardStart from "./components/DashboardStart.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/" element={<DashboardStart />}></Route>
        </Route>
        <Route path="*" element={<NotFound/>}> </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
