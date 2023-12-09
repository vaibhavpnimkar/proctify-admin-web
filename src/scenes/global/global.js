import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";
import "../../index.css";; // Add a CSS file for styling

export default function Global() {
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <div className="globalapp">
      <Sidebar isSidebar={isSidebar} isSticky={true} /> {/* Make the sidebar sticky */}
      <main className="globalcontent">
        <Topbar setIsSidebar={setIsSidebar} />
        <Outlet />
      </main>
    </div>
  );
}
