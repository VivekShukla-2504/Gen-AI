import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
    const { handleForgotPassword, handleResetPassword, loading, error, setError } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password, 3: Success
    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [cooldown, setCooldown] = useState(0);

    const digitRefs = useRef([]);

    // 60-second cooldown timer
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    /* ---------------- STEP 1: REQUEST OTP ---------------- */
    const handleRequestOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim() || cooldown > 0) return;

        setError(null);
        const res = await handleForgotPassword(email.trim());

        if (res?.success) {
            setStep(2);
            setCooldown(60);
            setOtpDigits(["", "", "", "", "", ""]);
            setTimeout(() => {
                if (digitRefs.current[0]) {
                    digitRefs.current[0].focus();
                }
            }, 100);
        }
    };

    /* ---------------- 6-DIGIT INPUT HANDLERS ---------------- */
    const handleDigitChange = (index, value) => {
        const cleanVal = value.replace(/\D/g, "");
        if (!cleanVal) {
            const next = [...otpDigits];
            next[index] = "";
            setOtpDigits(next);
            return;
        }

        const next = [...otpDigits];
        next[index] = cleanVal.slice(-1);
        setOtpDigits(next);

        // Move to next input if available
        if (index < 5 && cleanVal) {
            digitRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            digitRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted) {
            const next = ["", "", "", "", "", ""];
            for (let i = 0; i < pasted.length; i++) {
                next[i] = pasted[i];
            }
            setOtpDigits(next);
            const focusIndex = Math.min(pasted.length, 5);
            digitRefs.current[focusIndex]?.focus();
        }
    };

    const otp = otpDigits.join("");
    const hasMinLength = newPassword.length >= 6;
    const hasNumber = /\d/.test(newPassword);
    const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

    /* ---------------- STEP 2: VERIFY & RESET ---------------- */
    const handleResetSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError("Please enter the complete 6-digit verification code");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!hasMinLength || !hasNumber) {
            setError("Password must be at least 6 characters and contain a number");
            return;
        }

        setError(null);
        const res = await handleResetPassword({
            email: email.trim(),
            otp: otp.trim(),
            newPassword
        });

        if (res?.success) {
            setSuccessMessage(res.message || "Password reset successfully!");
            setStep(3);
        }
    };

    return (
        <div className="auth-page">
            <Link to="/login" className="brand-badge">
                <div className="logo-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                </div>
                <span className="logo-title">Prep<span className="gradient-text">AI</span></span>
            </Link>

            <div className="form-container">
                {step === 1 && (
                    <>
                        <div className="form-heading">
                            <h1>Reset Password</h1>
                            <p>Enter your registered email address to receive a secure 6-digit verification code.</p>
                        </div>

                        {error && (
                            <div className="error-box">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleRequestOtp}>
                            <div className="input-group">
                                <label>Registered Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="button primary-button"
                                disabled={loading || !email.trim()}
                            >
                                {loading ? "Sending Code..." : "Send Verification Code"}
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            Remember your password? <Link to="/login">Sign in here</Link>
                        </p>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="form-heading">
                            <h1>Enter 6-Digit Code</h1>
                            <p>We've sent a 6-digit verification code to <strong>{email}</strong>.</p>
                        </div>

                        <div className="info-note">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="16" x2="12" y2="12"/>
                                <line x1="12" y1="8" x2="12.01" y2="8"/>
                            </svg>
                            <span>Code expires in 10 minutes. Check your spam/junk folder if not found.</span>
                        </div>

                        {error && (
                            <div className="error-box">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleResetSubmit}>
                            <div className="input-group">
                                <label style={{ textAlign: "center", display: "block" }}>Verification Code</label>
                                <div className="otp-digit-group" onPaste={handlePaste}>
                                    {otpDigits.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={(el) => (digitRefs.current[idx] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            className={`otp-digit-input ${digit ? "filled" : ""}`}
                                            onChange={(e) => handleDigitChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(idx, e)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label>New Password</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 characters & a number"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Repeat your new password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Live Validation Hints */}
                            {newPassword.length > 0 && (
                                <div className="password-hints">
                                    <div className={`hint-item ${hasMinLength ? "valid" : ""}`}>
                                        <span>{hasMinLength ? "✓" : "○"}</span>
                                        <span>At least 6 characters</span>
                                    </div>
                                    <div className={`hint-item ${hasNumber ? "valid" : ""}`}>
                                        <span>{hasNumber ? "✓" : "○"}</span>
                                        <span>Contains at least one number</span>
                                    </div>
                                    {confirmPassword.length > 0 && (
                                        <div className={`hint-item ${passwordsMatch ? "valid" : ""}`}>
                                            <span>{passwordsMatch ? "✓" : "✕"}</span>
                                            <span>{passwordsMatch ? "Passwords match" : "Passwords do not match"}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="button primary-button"
                                disabled={loading || otp.length !== 6 || !hasMinLength || !hasNumber || !passwordsMatch}
                            >
                                {loading ? "Updating Password..." : "Reset Password & Login"}
                            </button>
                        </form>

                        <div className="resend-box">
                            <span>Didn't get the code?</span>
                            {cooldown > 0 ? (
                                <span>Resend in <span className="countdown">{cooldown}s</span></span>
                            ) : (
                                <button
                                    type="button"
                                    className="resend-btn"
                                    onClick={handleRequestOtp}
                                    disabled={loading}
                                >
                                    Resend Code
                                </button>
                            )}
                        </div>

                        <p className="auth-footer-text">
                            <Link to="/login">← Back to Login</Link>
                        </p>
                    </>
                )}

                {step === 3 && (
                    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center" }}>
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid rgba(16, 185, 129, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#34d399"
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <div className="form-heading">
                            <h1>Password Reset Complete!</h1>
                            <p>{successMessage || "Your password has been securely updated. You can now log in with your new credentials."}</p>
                        </div>
                        <button
                            type="button"
                            className="button primary-button"
                            onClick={() => navigate("/login")}
                        >
                            Proceed to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
