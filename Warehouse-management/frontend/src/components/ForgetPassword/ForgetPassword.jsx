import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // SEND OTP
  const handleSendOtp = async () => {
    try {
      const res = await axios.post(
        `${base_uri}/auth/forgetPassword`,
        { email }
      );

      if (res.data.status === true) {
        setMessage("OTP sent successfully 📩");
        setShowOtpBox(true);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(
        `${base_uri}/auth/verifyOtp`,
        { email, otp }
      );

      if (res.data.status === true) {
        setMessage("OTP Verified ✅");

        // Redirect to Change Password page
        navigate("/change-password", { state: { email } });
      } else {
        setMessage(res.data.message || "Invalid OTP ❌");
      }
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSendOtp}>Send OTP</button>

        {showOtpBox && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}

        {message && <div className="message">{message}</div>}

        <span className="back-link" onClick={() => navigate("/")}>
          ← Back to Sign In
        </span>
      </div>
    </div>
  );
}