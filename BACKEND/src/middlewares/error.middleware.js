const AppError = require("../utils/app-error");

const notFound = (req, res, next) =>
    next(new AppError(`Route ${req.method} ${req.originalUrl} was not found`, 404, "NOT_FOUND"));

const errorHandler = (error, req, res, next) => { // eslint-disable-line no-unused-vars
    const statusCode = error.statusCode || (error.name === "CastError" ? 400 : 500);
    const message = error.name === "CastError"
        ? "The supplied resource identifier is invalid."
        : error.isOperational
            ? error.message
            : "Something went wrong. Please try again later.";

    if (statusCode >= 500) console.error(`[${req.id || "request"}]`, error);
    res.status(statusCode).json({
        success: false,
        message,
        error: { code: error.code || "INTERNAL_ERROR", message },
        requestId: req.id
    });
};

module.exports = { notFound, errorHandler };
