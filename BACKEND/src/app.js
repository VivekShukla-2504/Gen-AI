const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

/* ---------------- TRUST PROXY (Required for Render, Railway, AWS Proxies) ---------------- */
app.set("trust proxy", 1);

/* ---------------- SECURITY HEADERS & COMPRESSION ---------------- */
app.use(helmet());
app.use(compression());

/* ---------------- RATE LIMITING ---------------- */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    }
});
app.use("/api", apiLimiter);

// Strict Rate Limiting on Sensitive Auth Endpoints (Brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Max 20 attempts per 15 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts from this IP. Please try again after 15 minutes."
    }
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);

/* ---------------- LOGGING ---------------- */
app.use(morgan("dev"));

/* ---------------- BODY PARSERS ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- DATA SANITIZATION (Express 5 Compatible) ---------------- */
app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query && typeof req.query === "object") {
        mongoSanitize.sanitize(req.query);
    }
    next();
});

/* ---------------- COOKIE ---------------- */
app.use(cookieParser());

/* ---------------- CORS (Production & Development) ---------------- */
const configuredClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/+$/, "") : "";

const allowedOrigins = [
    configuredClientUrl,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://gen-ai-theta-roan.vercel.app"
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            const cleanOrigin = origin.trim().replace(/\/+$/, "");
            if (
                allowedOrigins.includes(cleanOrigin) ||
                cleanOrigin.endsWith(".vercel.app") ||
                cleanOrigin.includes("localhost") ||
                cleanOrigin.includes("127.0.0.1")
            ) {
                return callback(null, true);
            }
            return callback(new Error(`Blocked by CORS policy for origin: ${origin}`));
        },
        credentials: true
    })
);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running"
    });
});

/* ---------------- ROUTES ---------------- */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

/* ---------------- 404 & GLOBAL ERROR HANDLERS ---------------- */
app.use(notFound);
app.use(errorHandler);

module.exports = app;
