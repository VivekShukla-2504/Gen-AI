import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import React from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, handleLogout, loading } = useAuth();

    const logoutUser = async () => {
        const result = await handleLogout();
        if (result) {
            navigate("/login", { replace: true });
        }
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                {/* BRAND LOGO */}
                <Link to="/" style={styles.brand}>
                    <div style={styles.logoIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                    </div>
                    <span style={styles.logoText}>Prep<span className="gradient-text">AI</span></span>
                    <span style={styles.aiBadge}>Gemini 2.5</span>
                </Link>

                {/* NAVIGATION LINKS & USER PROFILE */}
                <div style={styles.right}>
                    {user ? (
                        <>
                            <Link 
                                to="/" 
                                style={{
                                    ...styles.navLink,
                                    ...(location.pathname === "/" ? styles.navLinkActive : {})
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                Dashboard
                            </Link>

                            <div style={styles.userProfile}>
                                <div style={styles.avatar}>
                                    {(user.username || "U")[0].toUpperCase()}
                                </div>
                                <span style={styles.username}>{user.username}</span>
                            </div>

                            <button
                                onClick={logoutUser}
                                className="button secondary-button"
                                disabled={loading}
                                style={styles.logoutBtn}
                                title="Sign out"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                <span>{loading ? "..." : "Logout"}</span>
                            </button>
                        </>
                    ) : (
                        <div style={styles.authLinks}>
                            <Link to="/login" className="button secondary-button" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                                Sign In
                            </Link>
                            <Link to="/register" className="button primary-button" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        width: "100%",
        height: "64px",
        backgroundColor: "rgba(9, 13, 22, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center"
    },
    container: {
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        textDecoration: "none"
    },
    logoIcon: {
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))",
        border: "1px solid rgba(236, 72, 153, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ec4899"
    },
    logoText: {
        fontSize: "1.25rem",
        fontWeight: "800",
        letterSpacing: "-0.03em",
        color: "#f8fafc"
    },
    aiBadge: {
        fontSize: "0.68rem",
        fontWeight: "700",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "0.2rem 0.55rem",
        borderRadius: "999px",
        background: "rgba(139, 92, 246, 0.15)",
        border: "1px solid rgba(139, 92, 246, 0.35)",
        color: "#c084fc"
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: "1rem"
    },
    navLink: {
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        color: "#94a3b8",
        textDecoration: "none",
        fontSize: "0.88rem",
        fontWeight: "500",
        padding: "0.4rem 0.75rem",
        borderRadius: "0.5rem",
        transition: "all 0.15s ease"
    },
    navLinkActive: {
        color: "#f8fafc",
        backgroundColor: "rgba(255, 255, 255, 0.06)"
    },
    userProfile: {
        display: "flex",
        alignItems: "center",
        gap: "0.55rem",
        padding: "0.3rem 0.7rem",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "999px"
    },
    avatar: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
        color: "#ffffff",
        fontSize: "0.75rem",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    username: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#e2e8f0"
    },
    logoutBtn: {
        padding: "0.45rem 0.85rem",
        fontSize: "0.82rem",
        borderRadius: "0.5rem"
    },
    authLinks: {
        display: "flex",
        gap: "0.75rem"
    }
};

export default Navbar;