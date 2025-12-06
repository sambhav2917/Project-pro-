import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass =
    "flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition text-sm";

  return (
    <div
      className={`bg-gray-900 text-white h-full fixed shadow-xl
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* TOP SECTION */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold">ForecastPro</h1>}

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* MENU LINKS */}
      <nav className="flex flex-col gap-2 mt-4">
        <NavLink to="/" end className={linkClass}>
          <span>📊</span>
          {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink to="/data" className={linkClass}>
          <span>📁</span>
          {!collapsed && "Data Management"}
        </NavLink>

        <NavLink to="/sales" className={linkClass}>
          <span>📜</span>
          {!collapsed && "Sales History"}
        </NavLink>

        <NavLink to="/forecast" className={linkClass}>
          <span>📈</span>
          {!collapsed && "Forecasting"}
        </NavLink>

        <NavLink to="/print" className={linkClass}>
          <span>🖨️</span>
          {!collapsed && "Print Planning"}
        </NavLink>

        <NavLink to="/distribution" className={linkClass}>
          <span>🚚</span>
          {!collapsed && "Distribution Report"}
        </NavLink>
      </nav>
    </div>
  );
}
