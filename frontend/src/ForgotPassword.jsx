import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const sendCode = async () => {
    // Manual validation
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    // Optional: validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) setCodeSent(true);
    } catch (error) {
      setMessage("check your connection. Please try again.");
    }
  };

  const verifyCode = async () => {
    if (!code) {
      setMessage("Please enter the 4-digit code.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) setCodeVerified(true);
    } catch (error) {
      setMessage("Verification failed. Try again.");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage("Please enter your new password.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setEmail("");
        setCode("");
        setNewPassword("");
        setCodeSent(false);
        setCodeVerified(false);
      }
    } catch (error) {
      setMessage("Password reset failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Reset Your Password</h2>
        <form onSubmit={resetPassword} className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={sendCode}
              className="bg-sky-800 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>

          {codeSent && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter 4-digit code"
                className="w-full px-4 py-2 border rounded-lg"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={verifyCode}
                className="bg-green-600 text-white px-4 rounded-lg"
              >
                Verify
              </button>
            </div>
          )}

          {codeVerified && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-sky-800 text-white py-2 rounded-lg"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
