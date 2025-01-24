import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/register`, {
        email,
        password,
      });
      setMessage(response.data.message);
      setIsVerificationSent(true);
    } catch (error) {
      setMessage(error.response.data.error || "Registration failed.");
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/verify-email`, {
        email,
        verificationCode,
      });
      setMessage(response.data.message);
      setIsVerified(true);
    } catch (error) {
      setMessage(error.response.data.error || "Verification failed.");
    }
  };

  const handleResendVerificationCode = async () => {
    setIsResending(true);
    setMessage("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/resend-verification`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error || "Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>

      <div>
        <h2>Register</h2>
        {!isVerified && (
          <form onSubmit={isVerificationSent ? handleVerifyEmail : handleRegister}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isVerificationSent}
            />
            <div></div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isVerificationSent}
            />
            <div></div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isVerificationSent}
            />
            <div></div>
            {!isVerificationSent && <button type="submit">Register</button>}
            {isVerificationSent && (
              <>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <button type="submit">Verify Email</button>
                <button type="button" onClick={handleResendVerificationCode} disabled={isResending}>
                  {isResending ? "Resending..." : "Resend Verification Code"}
                </button>
              </>
            )}
          </form>
        )}
        {isVerified && <h3>Registration complete! You can now log in.</h3>}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Register;
