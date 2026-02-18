import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../../api/api.js";
import { useNavigate } from "react-router-dom";
import "./EMPSignIn.css";

export default function EMPSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

        setToast({
          show: true,
          message: "Employee Login Successful 🎉",
          type: "success",
        });

        setTimeout(() => {
          navigate("/empProduct");
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
        message:
          error.response?.data?.message ||
          "Server Error ❌ Try again",
        type: "error",
      });
    } finally {
      setLoading(false);
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
            Sign in to access your assigned tasks,
            stock updates and dashboard.
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
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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