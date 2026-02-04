import React from "react";
import { FaUserTie, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SelectPage.css";

export default function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="select-page">
      <div className="overlay">
        <h1 className="title">Warehouse Portal</h1>

        <div className="cards-container">
          {/* Manager */}
          <div
            className="role-card"
            onClick={() => navigate("/signin")}
          >
            <div className="role-icon">
              <FaUserTie />
            </div>
            <h3 className="role-name">Manager</h3>
          </div>

          {/* Employee */}
          <div
            className="role-card"
            onClick={() => navigate("/employee-login")}
          >
            <div className="role-icon">
              <FaUsers />
            </div>
            <h3 className="role-name">Employee</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
