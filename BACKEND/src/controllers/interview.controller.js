const pdfParse = require("pdf-parse");
const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");
const userModel = require("../models/user.model");

/* ---------------- INPUT VALIDATION ---------------- */
function validateInput(selfDescription, jobDescription) {
    return (
        typeof jobDescription === "string" &&
        jobDescription.trim().length > 0 &&
        typeof selfDescription === "string" &&
        selfDescription.trim().length > 0
    );
}

/* ---------------- CREATE REPORT ---------------- */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        //  no file + no selfDescription fallback safety handled
        let resumeText = "";

        if (req.file) {
            try {
                const pdfData = await pdfParse(req.file.buffer);
                resumeText = pdfData.text || "";
            } catch (err) {
                return res.status(400).json({
                    message: "Invalid or unreadable PDF file"
                });
            }
        }

        //  IMPORTANT VALIDATION (your requested fix included)
        if (!resumeText && !selfDescription?.trim()) {
            return res.status(400).json({
                message: "Either resume file or self description is required"
            });
        }

        if (!jobDescription?.trim()) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        //  AI CALL
        let aiResponse;
        try {
            aiResponse = await generateInterviewReport({
                resume: resumeText,
                selfDescription,
                jobDescription
            });
        } catch (err) {
            return res.status(500).json({
                message: "AI service failed",
                error: err.message
            });
        }

        if (!aiResponse) {
            return res.status(500).json({
                message: "AI returned empty response"
            });
        }

        //  SAVE DB
        const interviewReport = await interviewReportModel.create({
            title: aiResponse.title || "Interview Report",
            matchScore: aiResponse.matchScore ?? 0,

            technicalQuestions: aiResponse.technicalQuestions || [],
            behavioralQuestions: aiResponse.behavioralQuestions || [],
            skillGaps: aiResponse.skillGaps || [],
            preparationPlan: aiResponse.preparationPlan || [],

            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("REPORT GENERATION ERROR:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

/* ---------------- GET BY ID ---------------- */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

/* ---------------- GET ALL ---------------- */
async function getAllInterviewReportsController(req, res) {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        const skip = (page - 1) * limit;

        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-resume -selfDescription -jobDescription -__v");

        return res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

/* ---------------- PDF GENERATION ---------------- */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        // Fetch user's real account name and email for accurate identity
        let candidateName = req.user?.username || "Candidate";
        let candidateEmail = "";
        try {
            const user = await userModel.findById(req.user.id).select("username email");
            if (user) {
                candidateName = user.username || candidateName;
                candidateEmail = user.email || "";
            }
        } catch (e) {
            // fallback gracefully
        }

        let pdfBuffer;
        try {
            pdfBuffer = await generateResumePdf({
                resume,
                jobDescription,
                selfDescription,
                candidateName,
                candidateEmail
            });
        } catch (err) {
            return res.status(500).json({
                message: "PDF generation failed",
                error: err.message
            });
        }

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};
