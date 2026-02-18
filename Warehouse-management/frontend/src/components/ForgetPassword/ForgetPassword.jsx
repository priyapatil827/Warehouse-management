import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgetPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // SEND OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.warning("Please enter email ❗");
      return;
    }

    try {
      const response = await axios.post(
        `${base_uri}/auth/forgetPassword`,
        { email }
      );

      if (response.data.status === true) {
        toast.success("OTP sent successfully! 📩");

        // ⏳ little delay so user can see toast
        setTimeout(() => {
          navigate("/forget-verify-otp", { state: { email } });
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to send OTP ❌");
      }
    } catch (error) {
      toast.error("Error sending OTP. Please try again ❌");
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

        <button onClick={handleSendOtp}>
          Send OTP
        </button>

        <span className="back-link" onClick={() => navigate("/")}>
          ← Back to Sign In
        </span>
      </div>

      {/* 🔔 Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}