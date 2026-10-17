import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthShowcase from "../components/AuthShowcase";
import ThemeToggle from "../../theme/ThemeToggle";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const Register = () => {
    useDocumentTitle("Create Account");
    const navigate = useNavigate();
    const { loading, handleRegister, error, setError } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!hasMinLength || !hasNumber) {
            setError("Password must be at least 6 characters and include a number");
            return;
        }

        try {
            const result = await handleRegister({
                username: username.trim(),
                email: email.trim(),
                password: password.trim()
            });

            if (result?.success) {
                navigate("/");
            }
        } catch (err) {
            console.log("Register Page Error:", err);
        }
    };

    const isDisabled =
        !username.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim() ||
        !hasMinLength ||
        !hasNumber ||
        password !== confirmPassword ||
        loading;

    return (
        <div className="auth-page">
            <div className="auth-layout-wrapper">
                <AuthShowcase />

                <div className="auth-card-panel">
                    <div className="form-container">
                        <div className="mobile-brand-header" style={{ justifyContent: "space-between", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                <div className="logo-box">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                    </svg>
                                </div>
                                <span className="logo-title">Prep<span className="gradient-text">AI</span></span>
                            </div>
                            <ThemeToggle compact={true} />
                        </div>

                        <div className="form-heading">
                            <h1>Create Your Account</h1>
                            <p>Start generating tailored AI interview strategies</p>
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

                <GoogleAuthButton label="Sign up with Google" />

                <div className="auth-divider">
                    <span>OR SIGN UP WITH EMAIL</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (error) setError(null);
                            }}
                            type="text"
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError(null);
                            }}
                            type="email"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError(null);
                                }}
                                type={showPassword ? "text" : "password"}
                                minLength={6}
                                placeholder="••••••••"
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
                        <label>Confirm Password</label>
                        <div className="password-wrapper">
                            <input
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (error) setError(null);
                                }}
                                type={showConfirmPassword ? "text" : "password"}
                                minLength={6}
                                placeholder="Repeat your password"
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

                    {/* Live validation feedback */}
                    {password.length > 0 && (
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
                        disabled={isDisabled}
                    >
                        {loading ? "Creating account..." : "Get Started Free"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;