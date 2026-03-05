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
          className={`nav-item ${active === "Products" ? "active" : ""}`}
          onClick={() => setActive("Products")}
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
          <Link to="/empBilling">Biling</Link>
        </li>

        <li
          className={`nav-item ${active === "Employee bill history" ? "active" : ""}`}
          onClick={() => setActive("Employee bill history")}
        >
          <Link to="/empBillHistory">Employee Bill History</Link>
        </li>

        <li
          className={`nav-item ${active === "Order" ? "active" : ""}`}
          onClick={() => setActive("Order")}
        >
          <Link to="/empProfile">Profile</Link>
        </li>


      </ul>
    </nav>
  );
}
