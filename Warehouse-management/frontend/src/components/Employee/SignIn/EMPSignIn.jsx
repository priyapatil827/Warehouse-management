import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../../api/api.js";
import { useNavigate } from "react-router-dom";
import "./EMPSignIn.css";

export default function EMPSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      setToast({
        show: true,
        message: "Please fill all fields ❌",
        type: "error",
      });
      return;
    }

    try {
      const res = await axios.post(`${base_uri}/employee/login`, {
        email,
        password,
      });

      if (res.data.status === true) {
        localStorage.setItem("employee", JSON.stringify(res.data.employee));

        setToast({
          show: true,
          message: "Employee Login Successful 🎉",
          type: "success",
        });

        setTimeout(() => {
          navigate("/employee-dashboard");
        }, 1500);
      } else {
        setToast({
          show: true,
          message: res.data.message || "Invalid Credentials ❌",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Server Error ❌ Try again",
        type: "error",
      });
    }

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="signin-page">
      <div className="signin-wrapper">

        {/* LEFT PANEL */}
        <div className="welcome-panel">
          <div className="logo">EMP</div>

          <h1>Employee Portal</h1>
          <p>
            Sign in to access your assigned tasks, stock updates,
            and warehouse operations dashboard.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="form-panel">
          <h2>Employee Sign In</h2>
          <p className="subtext">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/employee-signup")}>
              Create Account
            </span>
          </p>

          {/* Email */}
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="employee@warehouse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="signin-btn" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}