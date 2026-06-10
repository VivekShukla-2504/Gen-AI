const mongoose = require("mongoose");

/* ---------------- QUESTION SCHEMA ---------------- */
const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true
        },
        intention: {
            type: String,
            required: [true, "Intention is required"],
            trim: true
        },
        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true
        }
    },
    { _id: false }
);

/* ---------------- SKILL GAP ---------------- */
const skillGapSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: true,
            trim: true
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true
        }
    },
    { _id: false }
);

/* ---------------- PREPARATION PLAN ---------------- */
const preparationPlanSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true,
            min: 1
        },
        focus: {
            type: String,
            required: true,
            trim: true
        },
        tasks: {
            type: [String],
            default: []
        }
    },
    { _id: false }
);

/* ---------------- MAIN SCHEMA ---------------- */
const interviewReportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        jobDescription: {
            type: String,
            required: true,
            trim: true
        },

        resume: {
            type: String,
            default: ""
        },

        selfDescription: {
            type: String,
            default: ""
        },

        matchScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
            index: true
        },

        technicalQuestions: {
            type: [questionSchema],
            default: []
        },

        behavioralQuestions: {
            type: [questionSchema],
            default: []
        },

        skillGaps: {
            type: [skillGapSchema],
            default: []
        },

        preparationPlan: {
            type: [preparationPlanSchema],
            default: []
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",   //  fixed consistency
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

/* ---------------- INDEXES (IMPORTANT) ---------------- */
interviewReportSchema.index({ user: 1, createdAt: -1 });

/* ---------------- MODEL ---------------- */
const interviewReportModel = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);

module.exports = interviewReportModel;
