// ResendVerificationCodeButton.js (React component example)
import React, { useState } from "react";

const ResendVerificationCodeButton = ({ email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resendVerificationCode = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // Make the API request to resend the code
      const response = await fetch("http://localhost:5000/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Verification code sent successfully!");
      } else {
        const data = await response.json();
        setMessage(data.error || "An error occurred while resending the code.");
      }
    } catch (error) {
      setMessage("Failed to resend verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={resendVerificationCode} disabled={isLoading}>
        {isLoading ? "Resending..." : "Resend Verification Code"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResendVerificationCodeButton;