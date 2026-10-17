import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    googleAuth
} from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "AuthContext is not available. Wrap App with AuthProvider."
        );
    }

    const { user, setUser, loading, setLoading } = context;

    const [error, setError] = useState(null);

    /* ---------------- LOGIN ---------------- */
    const handleLogin = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await login(payload);

            if (!res.success) {
                setError(res.message);
                return res;
            }

            setUser(res.user);

            return {
                success: true
            };

        } catch (err) {
            const message = err.message || "Login failed";
            setError(message);
            return {
                success: false,
                message
            };
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- REGISTER ---------------- */
    const handleRegister = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await register(payload);

            if (!res.success) {
                setError(res.message);
                return res;
            }

            setUser(res.user);

            return {
                success: true
            };

        } catch (err) {
            const message = err.message || "Register failed";
            setError(message);
            return {
                success: false,
                message
            };
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- GOOGLE AUTH ---------------- */
    const handleGoogleAuth = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await googleAuth(payload);

            if (!res.success) {
                setError(res.message);
                return res;
            }

            setUser(res.user);

            return {
                success: true
            };

        } catch (err) {
            const message = err.message || "Google authentication failed";
            setError(message);
            return {
                success: false,
                message
            };
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- FORGOT PASSWORD ---------------- */
    const handleForgotPassword = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const res = await forgotPassword({ email });

            if (!res.success) {
                setError(res.message);
                return res;
            }

            return res;

        } catch (err) {
            const message = err.message || "Failed to process forgot password";
            setError(message);
            return {
                success: false,
                message
            };
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- RESET PASSWORD ---------------- */
    const handleResetPassword = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await resetPassword(payload);

            if (!res.success) {
                setError(res.message);
                return res;
            }

            return res;

        } catch (err) {
            const message = err.message || "Failed to reset password";
            setError(message);
            return {
                success: false,
                message
            };
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- LOGOUT ---------------- */
    const handleLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await logout();

            if (!res.success) {
                setError(res.message);
                return res;
            }

            setUser(null);

            return {
                success: true
            };

        } catch (err) {
            const message = err.message || "Logout failed";
            setError(message);
            return {
                success: false,
                message
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        setError,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGoogleAuth,
        handleForgotPassword,
        handleResetPassword
    };
};