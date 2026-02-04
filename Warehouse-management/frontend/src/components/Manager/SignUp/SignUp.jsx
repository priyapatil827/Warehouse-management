import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../../api/api.js";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${base_uri}/auth/signup`, {
        email,
        password
      });

      if (res.data.status === true || res.data.message) {
        setToast({
          show: true,
          message: res.data.message || "Signup Successful 🎉",
          type: "success"
        });

        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setToast({
          show: true,
          message: res.data.message || "Signup Failed ❌",
          type: "error"
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message: "Server error ❌ Try again",
        type: "error"
      });
    }

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        {/* LEFT PANEL */}
        <div className="welcome-panel">
          <div className="logo">WH</div>

          <h1>Create Warehouse Account</h1>
          <p>
            Register to manage inventory, control stock, and monitor warehouse
            operations from one powerful dashboard.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="form-panel">
          <h2>Warehouse Sign Up</h2>
          <p className="subtext">
            Already have an account?{" "}
            <span onClick={() => navigate("/signin")}>Sign In</span>
          </p>

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@warehouse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="signin-btn" onClick={handleSignup}>
            Create Account
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
