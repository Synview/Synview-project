import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";
export default function Dashboard() {
  return (
    <div className="flex flex-col w-full h-full bg-stone-900">
        <Navbar/>
        <Outlet />
    </div>
  );
}
