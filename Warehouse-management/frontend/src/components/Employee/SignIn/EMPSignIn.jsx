import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_uri } from "../../../api/api.js";
import { useNavigate } from "react-router-dom";
import "./EMPSignIn.css";

export default function EMPSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();

  // 🔁 Remember Email
  useEffect(() => {
    const savedEmail = localStorage.getItem("emp_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      return showToast("Please fill all fields ❌", "error");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${base_uri}/employee/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.status === true) {
        // ✅ Save employee data
        localStorage.setItem(
          "employee",
          JSON.stringify(res.data.employee)
        );

        // Remember email
        remember
          ? localStorage.setItem("emp_email", email)
          : localStorage.removeItem("emp_email");

        showToast("Employee Login Successful 🎉", "success");

        setTimeout(() => {
          navigate("/empProfile");
        }, 1200);
      } else {
        showToast(res.data.message || "Invalid Credentials ❌", "error");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Server Error ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
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
            Login to manage tasks, stock updates
            and view your profile dashboard.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="form-panel">
          <h2>Employee Sign In</h2>

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="employee@warehouse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div className="remember-box">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <label>Remember Email</label>
          </div>

          <button
            className="signin-btn"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}