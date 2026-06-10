require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

/* ---------------- START SERVER ONLY AFTER DB CONNECT ---------------- */
const startServer = async () => {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
            console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
        });

    } catch (error) {
        console.error(" Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
