import React from "react";
import { Link } from "react-router";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import ThemeToggle from "../theme/ThemeToggle";

const NotFound = () => {
    useDocumentTitle("404 — Page Not Found");

    return (
        <div style={styles.wrapper}>
            {/* Top Bar with Theme Toggle */}
            <header style={styles.topBar}>
                <Link to="/" style={styles.brand}>
                    <div style={styles.logoBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                    </div>
                    <span style={styles.brandText}>
                        Prep<span className="gradient-text">AI</span>
                    </span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Main 404 Card */}
            <main style={styles.main}>
                <div style={styles.card}>
                    <div style={styles.codeBadge}>ERROR 404</div>
                    <h1 style={styles.title}>
                        <span className="gradient-text">Page Not Found</span>
                    </h1>
                    <p style={styles.desc}>
                        The page you are looking for doesn&apos;t exist, has been removed, or the link might be broken.
                    </p>

                    <div style={styles.actions}>
                        <Link to="/" className="button primary-button" style={styles.btn}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            <span>Back to Dashboard</span>
                        </Link>
                        <Link to="/login" className="button secondary-button" style={styles.btn}>
                            <span>Sign In</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg, #090d16)",
        color: "var(--text, #f8fafc)",
        position: "relative",
        overflow: "hidden"
    },
    topBar: {
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        borderBottom: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
        backgroundColor: "var(--nav-bg, rgba(9, 13, 22, 0.8))",
        backdropFilter: "blur(12px)"
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        textDecoration: "none"
    },
    logoBox: {
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
    brandText: {
        fontSize: "1.25rem",
        fontWeight: "800",
        letterSpacing: "-0.03em",
        color: "var(--text, #f8fafc)"
    },
    main: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
    },
    card: {
        maxWidth: "480px",
        width: "100%",
        textAlign: "center",
        padding: "3rem 2rem",
        borderRadius: "20px",
        backgroundColor: "var(--bg-card, #0f172a)",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
    },
    codeBadge: {
        display: "inline-block",
        fontSize: "0.75rem",
        fontWeight: "800",
        letterSpacing: "0.1em",
        padding: "0.3rem 0.8rem",
        borderRadius: "999px",
        backgroundColor: "rgba(236, 72, 153, 0.15)",
        border: "1px solid rgba(236, 72, 153, 0.35)",
        color: "#f472b6",
        marginBottom: "1rem"
    },
    title: {
        fontSize: "2rem",
        fontWeight: "800",
        letterSpacing: "-0.03em",
        margin: "0 0 1rem 0"
    },
    desc: {
        color: "var(--text-muted, #94a3b8)",
        fontSize: "0.95rem",
        lineHeight: "1.6",
        marginBottom: "2rem"
    },
    actions: {
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        flexWrap: "wrap"
    },
    btn: {
        padding: "0.7rem 1.4rem",
        fontSize: "0.9rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none"
    }
};

export default NotFound;

