const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const { sendPasswordResetEmail } = require("../services/email.service");

/* ---------------- UTIL ---------------- */
function validatePassword(password) {
    return /^(?=.*[0-9]).{6,}$/.test(password);
}

/* ---------------- REGISTER ---------------- */
async function registerUserController(req, res) {
    try {
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        username = username.trim();
        email = email.trim().toLowerCase();

        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters and include a number"
            });
        }

        /* CHECK EMAIL */
        const emailExists = await userModel.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        /* CHECK USERNAME */
        const usernameExists = await userModel.findOne({
            username: new RegExp(`^${username}$`, "i")
        });

        if (usernameExists) {
            return res.status(400).json({
                message: "Username already taken"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

      res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
    maxAge: 24 * 60 * 60 * 1000
});

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

/* ---------------- LOGIN ---------------- */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const user = await userModel.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
    maxAge: 24 * 60 * 60 * 1000
});

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

/* ---------------- LOGOUT ---------------- */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if (token) {
            await tokenBlacklistModel.create({ token });
        }

        res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax"
});

        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

/* ---------------- GET ME ---------------- */
async function getMeController(req, res) {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

/* ---------------- FORGOT PASSWORD ---------------- */
async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email address is required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = await userModel.findOne({ email: cleanEmail });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email address"
            });
        }

        // Security: Rate limit cooldown (60 seconds)
        if (user.lastOtpRequestedAt) {
            const timeDiff = Date.now() - new Date(user.lastOtpRequestedAt).getTime();
            if (timeDiff < 60 * 1000) {
                const secondsLeft = Math.ceil((60 * 1000 - timeDiff) / 1000);
                return res.status(429).json({
                    message: `Please wait ${secondsLeft} seconds before requesting a new verification code.`
                });
            }
        }

        // Generate cryptographically sound 6-digit OTP code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 10-minute strict expiration & reset attempt counter
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.resetPasswordOtpAttempts = 0;
        user.lastOtpRequestedAt = new Date();
        await user.save();

        // Dispatch real HTML email via SMTP
        await sendPasswordResetEmail({
            toEmail: cleanEmail,
            username: user.username,
            otp
        });

        return res.status(200).json({
            message: "A 6-digit password reset code has been sent to your email address."
        });

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({
            message: "Failed to process forgot password request",
            error: error.message
        });
    }
}

/* ---------------- RESET PASSWORD ---------------- */
async function resetPasswordController(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "Email, verification code, and new password are required"
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters and include at least one number"
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = await userModel.findOne({ email: cleanEmail });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if OTP was requested
        if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
            return res.status(400).json({
                message: "No active password reset request found. Please request a new code."
            });
        }

        // Check max attempt rate limiting (Prevent brute-force guessing)
        if (user.resetPasswordOtpAttempts >= 3) {
            user.resetPasswordOtp = null;
            user.resetPasswordOtpExpires = null;
            user.resetPasswordOtpAttempts = 0;
            await user.save();

            return res.status(400).json({
                message: "Too many incorrect attempts. For security, this code has been revoked. Please request a new one."
            });
        }

        // Check expiration
        if (new Date() > new Date(user.resetPasswordOtpExpires)) {
            user.resetPasswordOtp = null;
            user.resetPasswordOtpExpires = null;
            await user.save();

            return res.status(400).json({
                message: "Verification code has expired. Please request a new one."
            });
        }

        // Check OTP match
        if (user.resetPasswordOtp !== otp.trim()) {
            user.resetPasswordOtpAttempts = (user.resetPasswordOtpAttempts || 0) + 1;
            await user.save();

            const attemptsLeft = 3 - user.resetPasswordOtpAttempts;
            return res.status(400).json({
                message: `Invalid verification code. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining.` : "Code revoked."}`
            });
        }

        // Update password and revoke OTP
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpires = null;
        user.resetPasswordOtpAttempts = 0;
        await user.save();

        console.log(`✅ [PASSWORD RESET] Password successfully updated for user: ${cleanEmail}`);

        return res.status(200).json({
            message: "Password has been reset successfully. You can now log in with your new password."
        });

    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return res.status(500).json({
            message: "Failed to reset password",
            error: error.message
        });
    }
}

/* ---------------- GOOGLE AUTH ---------------- */
async function googleAuthController(req, res) {
    try {
        const { email, name, googleId, avatar } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Google email is required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        let user = await userModel.findOne({ email: cleanEmail });

        if (user) {
            let modified = false;
            if (!user.googleId && googleId) {
                user.googleId = googleId;
                modified = true;
            }
            if (!user.avatar && avatar) {
                user.avatar = avatar;
                modified = true;
            }
            if (modified) {
                await user.save();
            }
        } else {
            let baseUsername = (name || cleanEmail.split("@")[0])
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "_")
                .slice(0, 20);

            if (!baseUsername || baseUsername.length < 3) {
                baseUsername = "user_" + Math.floor(1000 + Math.random() * 9000);
            }

            let finalUsername = baseUsername;
            let counter = 1;
            while (await userModel.findOne({ username: finalUsername })) {
                finalUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
                counter++;
                if (counter > 10) break;
            }

            user = await userModel.create({
                username: finalUsername,
                email: cleanEmail,
                authProvider: "google",
                googleId: googleId || `google_${Date.now()}`,
                avatar: avatar || ""
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Google sign-in successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error);
        return res.status(500).json({
            message: "Google authentication failed",
            error: error.message
        });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController,
    googleAuthController
};