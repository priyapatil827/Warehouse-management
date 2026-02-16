import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [active, setActive] = useState("Dashboard");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li
          className={`nav-item ${active === "Dashboard" ? "active" : ""}`}
          onClick={() => setActive("Dashboard")}
        >
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li
          className={`nav-item ${active === "Products" ? "active" : ""}`}
          onClick={() => setActive("Products")}
        >
          <Link to="/product">Products</Link>
        </li>

        <li
          className={`nav-item ${active === "Stock Control" ? "active" : ""}`}
          onClick={() => setActive("Stock Control")}
        >
          <Link to="/stock-control">Stock Control</Link>
        </li>


        <li
          className={`nav-item ${active === "Suppliers" ? "active" : ""}`}
          onClick={() => setActive("Suppliers")}
        >
          <Link to="/supplier">Suppliers</Link>
        </li>

        <li
          className={`nav-item ${active === "Employees" ? "active" : ""}`}
          onClick={() => setActive("Employees")}
        >
          <Link to="/employees">Employees</Link>
        </li>

        <li
          className={`nav-item ${active === "Reports" ? "active" : ""}`}
          onClick={() => setActive("Reports")}
        >
          <Link to="/report">Reports</Link>
        </li>

        {/* Setting with Dropdown */}
        <li
          className={`nav-item ${active === "Setting" ? "active" : ""}`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Setting
          {showDropdown && (
            <ul className="dropdown">
              <li
                className={`dropdown-item ${active === "Profile" ? "active" : ""}`}
                onClick={() => setActive("Profile")}
              >
                <Link to="/profile">Profile</Link>
              </li>
              <li
                className={`dropdown-item ${active === "Preferences" ? "active" : ""}`}
                onClick={() => setActive("Preferences")}
              >
                <Link to="/preferences">Preferences</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
