import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    try {
      const res = await axios.post(
        `${base_uri}/auth/changeForgetPassword`,
        { email, newPassword }
      );

      if (res.data.status === true) {
        setMessage("Password changed successfully ✅");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={handleChangePassword}>
          Change Password
        </button>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}