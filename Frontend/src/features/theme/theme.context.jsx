import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem("prepai-theme") || "system";
    });

    const getSystemTheme = () => {
        if (typeof window !== "undefined" && window.matchMedia) {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "dark";
    };

    const [resolvedTheme, setResolvedTheme] = useState(() => {
        const initial = localStorage.getItem("prepai-theme") || "system";
        return initial === "system" ? getSystemTheme() : initial;
    });

    // Apply theme changes to documentElement
    useEffect(() => {
        const effective = theme === "system" ? getSystemTheme() : theme;
        setResolvedTheme(effective);

        document.documentElement.setAttribute("data-theme", effective);
        document.documentElement.style.colorScheme = effective;
        localStorage.setItem("prepai-theme", theme);
    }, [theme]);

    // Listen to OS system preference changes in real-time
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemChange = (e) => {
            if (theme === "system") {
                const newEffective = e.matches ? "dark" : "light";
                setResolvedTheme(newEffective);
                document.documentElement.setAttribute("data-theme", newEffective);
                document.documentElement.style.colorScheme = newEffective;
            }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, [theme]);

    const setTheme = (mode) => {
        if (["dark", "light", "system"].includes(mode)) {
            setThemeState(mode);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

