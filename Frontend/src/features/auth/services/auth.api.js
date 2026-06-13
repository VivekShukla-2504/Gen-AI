import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

/* ---------------- ERROR EXTRACTOR ---------------- */
const getErrorMessage = (err) => {
    if (err?.response?.status === 429) {
        return "API limit reached. Please try again later.";
    }

    if (err?.response?.status === 401) {
        return "Unauthorized. Please login again.";
    }

    return (
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
    );
};

/* ---------------- REGISTER ---------------- */
export async function register(data) {
    try {
        const res = await api.post("/api/auth/register", data);

        return {
            success: true,
            user: res.data?.user,
            message: res.data?.message
        };

    } catch (err) {
        return {
            success: false,
            message: getErrorMessage(err)
        };
    }
}

/* ---------------- LOGIN ---------------- */
export async function login(data) {
    try {
        const res = await api.post("/api/auth/login", data);

        return {
            success: true,
            user: res.data?.user,
            message: res.data?.message
        };

    } catch (err) {
        return {
            success: false,
            message: getErrorMessage(err)
        };
    }
}

/* ---------------- LOGOUT ---------------- */
export async function logout() {
    try {
        const res = await api.post("/api/auth/logout");

        return {
            success: true,
            message: res.data?.message
        };

    } catch (err) {
        return {
            success: false,
            message: getErrorMessage(err)
        };
    }
}

/* ---------------- GET ME ---------------- */
export async function getMe() {
    try {
        const res = await api.get("/api/auth/get-me");

        return {
            success: true,
            user: res.data?.user
        };

    } catch (err) {
        return {
            success: false,
            message: getErrorMessage(err)
        };
    }
}