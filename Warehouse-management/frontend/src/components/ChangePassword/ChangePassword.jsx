import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields required ❌");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    if (!email || !otp) {
      toast.error("Invalid request ❌");
      return;
    }

    try {
      const res = await axios.post(
        `${base_uri}/auth/changeForgotPassword`,
        {
          email,
          password,
          otp, // ⚠️ NO Number()
        }
      );

      if (res.data.status) {
        toast.success("Password changed successfully 🔐");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Server error ❌");
    }
  };

  return (
    <>
      <div className="forgot-card">
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleChangePassword}>
          Change Password
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}