import { Routes, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/Landing.tsx";
import Login from './components/Login.tsx'
import React from "react";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
