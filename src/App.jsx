import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import DataManagement from "./pages/DataManagement";
import SalesHistory from "./pages/SalesHistory";
import Forecasting from "./pages/Forecasting";
import PrintPlanning from "./pages/PrintPlanning";
import DistributionReport from "./pages/DistributionReport";

export default function App() {
  return (
    <Router>
      <Sidebar />

      <div className="ml-16 md:ml-64 transition-all duration-300 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/data" element={<DataManagement />} />
          <Route path="/sales" element={<SalesHistory />} />
          <Route path="/forecast" element={<Forecasting />} />
          <Route path="/print" element={<PrintPlanning />} />
          <Route path="/distribution" element={<DistributionReport />} />
        </Routes>
      </div>
    </Router>
  );
}
