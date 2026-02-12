import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../api/api.js";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";
import OTPInput from "otp-input-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    const data = { email, otp };

    try {
      const res = await axios.post(`${base_uri}/auth/verifyOtp`, data, {
        withCredentials: true
      });

      // ✅ Only success = true + verified = true
      if (res.data.status === true) {
        setToast({
          show: true,
          message: res.data.message || "OTP Verified! 🎉",
          type: "success"
        });

        // 🔒 Redirect ONLY after verified
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setToast({
          show: true,
          message: res.data.message || "Invalid OTP ❌",
          type: "error"
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message:
          err.response?.data?.message || "OTP Verification Failed ❌",
        type: "error"
      });
    }

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-header">
          <h1>Verify OTP</h1>
          <p>Enter your email and the OTP sent to you</p>
        </div>

        <div className="verify-field">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="verify-field">
          <label>OTP Code</label>
          <OTPInput
            value={otp}
            onChange={setOtp}
            autoFocus
            OTPLength={6}
            otpType="number"
            disabled={false}
            secure
          />

        </div>

        <button className="verify-btn" onClick={handleVerifyOtp}>
          Verify & Login
        </button>
      </div>

      {/* Toast Popup */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
