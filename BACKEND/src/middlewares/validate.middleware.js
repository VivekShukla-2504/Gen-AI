const AppError = require("../utils/app-error");

const validate = (schema, source = "body") => (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        return next(new AppError("Request validation failed", 400, "VALIDATION_ERROR"));
    }
    req[source] = result.data;
    return next();
};

module.exports = validate;
