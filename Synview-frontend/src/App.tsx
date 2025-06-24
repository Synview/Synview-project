import { Routes, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/Landing.tsx";
import React from "react";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
