const required = ["MONGO_URI", "JWT_SECRET", "GOOGLE_GENAI_API_KEY"];

const validateEnvironment = () => {
    const missing = required.filter((name) => !process.env[name]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters long");
};

module.exports = { validateEnvironment };
