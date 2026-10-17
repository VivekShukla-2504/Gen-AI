import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import Navbar from "../pages/Navbar";
import React from "react";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div style={styles.center}>
                <div style={styles.spinnerWrapper}>
                    <div style={styles.loader}></div>
                </div>
                <h3 style={styles.loadingTitle}>Authenticating Session...</h3>
                <p style={styles.loadingSub}>Verifying your secure token</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={styles.shell}>
            <Navbar />
            <main style={styles.content}>
                {children}
            </main>
        </div>
    );
};

const styles = {
    shell: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg)"
    },
    content: {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    center: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#090d16",
        color: "#f8fafc",
        fontFamily: "system-ui, sans-serif"
    },
    spinnerWrapper: {
        marginBottom: "1.25rem",
        position: "relative"
    },
    loader: {
        width: "48px",
        height: "48px",
        border: "3px solid rgba(255, 255, 255, 0.08)",
        borderTop: "3px solid #ec4899",
        borderRight: "3px solid #8b5cf6",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
    },
    loadingTitle: {
        fontSize: "1.1rem",
        fontWeight: "600",
        margin: "0 0 0.25rem 0",
        color: "#f1f5f9"
    },
    loadingSub: {
        fontSize: "0.85rem",
        color: "#64748b",
        margin: 0
    }
};

export default Protected;