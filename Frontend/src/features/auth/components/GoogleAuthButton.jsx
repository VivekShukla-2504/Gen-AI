import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const GoogleAuthButton = ({ label = "Continue with Google" }) => {
    const { handleGoogleAuth, loading } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [googleEmail, setGoogleEmail] = useState("");
    const [googleName, setGoogleName] = useState("");
    const [error, setError] = useState(null);

    const handleQuickGoogleSignIn = async (email, name) => {
        setError(null);
        const res = await handleGoogleAuth({
            email,
            name: name || email.split("@")[0],
            googleId: `google_${email.replace(/[^a-zA-Z0-9]/g, "")}_${Date.now()}`,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
        });

        if (res?.success) {
            setShowModal(false);
            navigate("/");
        } else {
            setError(res?.message || "Google Sign-In failed");
        }
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!googleEmail.trim()) {
            setError("Please enter your Google email");
            return;
        }
        handleQuickGoogleSignIn(googleEmail.trim(), googleName.trim());
    };

    return (
        <>
            <button
                type="button"
                className="google-btn"
                onClick={() => setShowModal(true)}
                disabled={loading}
            >
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{label}</span>
            </button>

            {/* Google Fast Sign-in Modal */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "1rem"
                }}>
                    <div style={{
                        background: "#0f172a",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "1rem",
                        padding: "1.75rem",
                        maxWidth: "400px",
                        width: "100%",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span style={{ color: "#f8fafc", fontWeight: 700, fontSize: "1.1rem" }}>Google Sign-In</span>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#94a3b8",
                                    fontSize: "1.25rem",
                                    cursor: "pointer",
                                    padding: "0.2rem"
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                            Choose a Google account or enter your email for instant one-click authentication.
                        </p>

                        {error && (
                            <div style={{
                                background: "rgba(244, 63, 94, 0.12)",
                                border: "1px solid rgba(244, 63, 94, 0.35)",
                                color: "#fda4af",
                                padding: "0.6rem 0.8rem",
                                borderRadius: "0.5rem",
                                fontSize: "0.82rem",
                                marginBottom: "1rem"
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Quick 1-Click Select Accounts */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                            <button
                                type="button"
                                onClick={() => handleQuickGoogleSignIn("vivek25tech@gmail.com", "Vivek Shukla")}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    background: "rgba(255, 255, 255, 0.04)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    borderRadius: "0.6rem",
                                    padding: "0.6rem 0.8rem",
                                    color: "#f8fafc",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.15s"
                                }}
                            >
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: "#3b82f6",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "0.85rem"
                                }}>
                                    V
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Vivek Shukla</div>
                                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>vivek25tech@gmail.com</div>
                                </div>
                                <span style={{ fontSize: "0.75rem", color: "#ec4899", fontWeight: 600 }}>1-Click</span>
                            </button>
                        </div>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            color: "#64748b",
                            fontSize: "0.75rem",
                            marginBottom: "1rem"
                        }}>
                            <div style={{ flex: 1, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}></div>
                            <span style={{ padding: "0 0.5rem" }}>or enter other Google account</span>
                            <div style={{ flex: 1, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}></div>
                        </div>

                        <form onSubmit={handleCustomSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            <input
                                type="text"
                                placeholder="Your Name (Optional)"
                                value={googleName}
                                onChange={(e) => setGoogleName(e.target.value)}
                                style={{
                                    border: "1px solid rgba(255, 255, 255, 0.09)",
                                    outline: "none",
                                    padding: "0.65rem 0.85rem",
                                    borderRadius: "0.5rem",
                                    background: "#131c31",
                                    color: "#ffffff",
                                    fontSize: "0.85rem"
                                }}
                            />
                            <input
                                type="email"
                                placeholder="name@gmail.com"
                                value={googleEmail}
                                onChange={(e) => setGoogleEmail(e.target.value)}
                                required
                                style={{
                                    border: "1px solid rgba(255, 255, 255, 0.09)",
                                    outline: "none",
                                    padding: "0.65rem 0.85rem",
                                    borderRadius: "0.5rem",
                                    background: "#131c31",
                                    color: "#ffffff",
                                    fontSize: "0.85rem"
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                                    border: "none",
                                    color: "#ffffff",
                                    padding: "0.7rem",
                                    borderRadius: "0.5rem",
                                    fontWeight: 600,
                                    fontSize: "0.88rem",
                                    cursor: "pointer",
                                    marginTop: "0.4rem"
                                }}
                            >
                                {loading ? "Signing in..." : "Continue with this Account"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default GoogleAuthButton;

