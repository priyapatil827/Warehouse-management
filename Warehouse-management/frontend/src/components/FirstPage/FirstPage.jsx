import React from "react";
import { useNavigate } from "react-router-dom";
import "./FirstPage.css";

export default function FirstPage() {
  const navigate = useNavigate();

  return (
    <div className="firstpage">
      {/* Animated Grid Background */}
      <div className="grid-bg"></div>

      {/* Floating Boxes */}
      <div className="box b1"></div>
      <div className="box b2"></div>
      <div className="box b3"></div>

      {/* Main Card */}
      <div className="firstpage-card">
        <div className="logo-box">WH</div>

        <h1>Smart Warehouse Hub</h1>
        <p className="para">
          Real-time stock tracking, supplier flow automation, and AI-powered
          warehouse insights — all in one futuristic platform.
        </p>

        <div className="feature-row">
          <div className="feature">📦 Live Inventory</div>
          <div className="feature">🚚 Smart Logistics</div>
          <div className="feature">📊 AI Reports</div>
          <div className="feature">🔔 Auto Alerts</div>
        </div>

        <button className="start-btn" onClick={() => navigate("/select-page")}>
          Enter Control Panel
        </button>
      </div>
    </div>
  );
}
