import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_uri } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgetVerifyOtp.css";

export default function ForgetVerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // ⏱️ TIMER
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("OTP required ❌");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("OTP expired ❌");
      return;
    }

    try {
      const res = await axios.post(`${base_uri}/auth/verifyOtp`, {
        email,
        otp,
      });

      if (res.data.status) {
        toast.success("OTP verified ✅");

        setTimeout(() => {
          navigate("/change-password", { state: { email } });
        }, 1200);
      } else {
        toast.error(res.data.message || "Invalid OTP ❌");
      }
    } catch (err) {
      toast.error("Server error ❌");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      <div className="forgot-card">
        <h2>Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="otp-timer">
          OTP expires in <span>{formatTime(timeLeft)}</span>
        </div>

        <button onClick={handleVerifyOtp} disabled={timeLeft <= 0}>
          Verify OTP
        </button>
      </div>

      {/* 🔔 TOAST CONTAINER (IMPORTANT) */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}