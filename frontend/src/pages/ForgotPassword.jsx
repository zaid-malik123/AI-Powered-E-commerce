import React, { useState } from "react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // API call yaha lagegi
    console.log("Email:", email);
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // OTP verify API yaha lagegi
    console.log("OTP:", otp);
    setStep(3);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Reset password API yaha lagegi
    console.log("New Password:", password);
    alert("Password reset successful!");
  };

  return (
    <div className="mt-50 flex items-center justify-center  px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Set New Password"}
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          {step === 1 && "Enter your registered email to receive an OTP."}
          {step === 2 && "Enter the OTP sent to your email."}
          {step === 3 && "Create a new password for your account."}
        </p>

        {/* STEP 1 - Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <input
              type="text"
              maxLength="6"
              required
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-xl tracking-widest px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              Verify OTP
            </button>

            <p
              className="text-sm text-center cursor-pointer hover:underline"
              onClick={() => setStep(1)}
            >
              Change Email
            </p>
          </form>
        )}

        {/* STEP 3 - Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <input
              type="password"
              required
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              Reset Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;