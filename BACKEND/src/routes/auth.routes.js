const { Router } = require("express");
const {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController,
    googleAuthController
} = require("../controllers/auth.controller");

const { authUser } = require("../middlewares/auth.middleware");

const authRouter = Router();

/* ---------------- REGISTER ---------------- */
authRouter.post("/register", registerUserController);

/* ---------------- LOGIN ---------------- */
authRouter.post("/login", loginUserController);

/* ---------------- FORGOT & RESET PASSWORD ---------------- */
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);

/* ---------------- GOOGLE AUTH ---------------- */
authRouter.post("/google", googleAuthController);

/* ---------------- LOGOUT ---------------- */
authRouter.post("/logout", authUser, logoutUserController);

/* ---------------- GET CURRENT USER ---------------- */
authRouter.get("/get-me", authUser, getMeController);

module.exports = authRouter;