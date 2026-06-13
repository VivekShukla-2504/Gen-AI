import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

/* ---------------- ERROR HANDLING ---------------- */
const handleError = (err) => {
    if (err?.response?.status === 429) {
        return {
            success: false,
            message: "API limit reached. Please try again later."
        };
    }

    return {
        success: false,
        message:
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong"
    };
};

/* ---------------- GENERATE REPORT ---------------- */
export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {
    try {
        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);
        formData.append("resume", resumeFile);

        const response = await api.post("/api/interview/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (err) {
        return handleError(err);
    }
};

/* ---------------- GET BY ID ---------------- */
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`);

        return {
            success: true,
            data: response.data
        };
    } catch (err) {
        return handleError(err);
    }
};

/* ---------------- GET ALL ---------------- */
export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview/");

        return {
            success: true,
            data: response.data
        };
    } catch (err) {
        return handleError(err);
    }
};

/* ---------------- PDF ---------------- */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.get(
            `/api/interview/resume/pdf/${interviewReportId}`,
            {
                responseType: "blob"
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (err) {
        console.log("PDF Error:", err);
        return handleError(err);
    }
};