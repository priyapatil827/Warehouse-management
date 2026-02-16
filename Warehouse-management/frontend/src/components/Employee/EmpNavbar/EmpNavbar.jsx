import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./EmpNavbar.css";

export default function EmpNavbar() {
  const [active, setActive] = useState("Dashboard");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li
          className={`nav-item ${active === "Dashboard" ? "active" : ""}`}
          onClick={() => setActive("Dashboard")}
        >
          <Link to="/empDashboard">Dashboard</Link>
        </li>

        <li
          className={`nav-item ${active === "Products" ? "active" : ""}`}
          onClick={() => setActive("Products")}
        >
          <Link to="/empProduct">Products</Link>
        </li>

        <li
          className={`nav-item ${active === "Stock Control" ? "active" : ""}`}
          onClick={() => setActive("Stock Control")}
        >
          <Link to="/empBilling">Biiling</Link>
        </li>

        <li
          className={`nav-item ${active === "Order" ? "active" : ""}`}
          onClick={() => setActive("Order")}
        >
          <Link to="/profile">Profile</Link>
        </li>

        <li
          className={`nav-item ${active === "Suppliers" ? "active" : ""}`}
          onClick={() => setActive("Suppliers")}
        >
          <Link to="/task-mang">Task Management</Link>
        </li>

        <li
          className={`nav-item ${active === "Employees" ? "active" : ""}`}
          onClick={() => setActive("Employees")}
        >
          <Link to="/report">Report</Link>
        </li>


      </ul>
    </nav>
  );
}
