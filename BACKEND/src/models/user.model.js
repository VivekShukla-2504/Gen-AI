const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email"
            ]
        },

        password: {
            type: String,
            required: function () {
                return this.authProvider !== "google";
            },
            minlength: 6
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },

        googleId: {
            type: String,
            sparse: true,
            default: null
        },

        avatar: {
            type: String,
            default: ""
        },

        resetPasswordOtp: {
            type: String,
            default: null
        },

        resetPasswordOtpExpires: {
            type: Date,
            default: null
        },

        resetPasswordOtpAttempts: {
            type: Number,
            default: 0
        },

        lastOtpRequestedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

/* ---------------- INDEXES (optional but good) ---------------- */

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;