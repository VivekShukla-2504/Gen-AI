import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf
} from "../services/interview.api";

import { useContext, useEffect, useState } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } =
        context;

    const [error, setError] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);

    /* ---------------- GENERATE ---------------- */
    const generateReport = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const res = await generateInterviewReport(payload);

            if (!res.success) {
                const message = res.message || "Failed to generate report";
                setError(message);
                return { success: false, message };
            }

            const interview = res.data.interviewReport;
            setReport(interview);

            return { success: true, data: interview };
        } catch (err) {
            const message = err.message || "Something went wrong while generating report";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- GET BY ID ---------------- */
    const getReportById = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const res = await getInterviewReportById(id);

            if (!res.success) {
                setError(res.message);
                return null;
            }

            setReport(res.data.interviewReport);
            return res.data.interviewReport;
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- GET ALL ---------------- */
    const getReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await getAllInterviewReports();

            if (!res.success) {
                setError(res.message);
                return [];
            }

            setReports(res.data.interviewReports);
            return res.data.interviewReports;
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- PDF ---------------- */
    const getResumePdf = async (interviewReportId) => {
        setPdfLoading(true);
        setError(null);

        try {
            const res = await generateResumePdf({ interviewReportId });

            if (!res.success) {
                setError(res.message || "Failed to download resume PDF");
                return { success: false, message: res.message };
            }

            const url = window.URL.createObjectURL(
                new Blob([res.data], { type: "application/pdf" })
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `resume_${interviewReportId}.pdf`
            );

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (err) {
            const message = err.message || "Failed to download PDF";
            setError(message);
            return { success: false, message };
        } finally {
            setPdfLoading(false);
        }
    };

    /* ---------------- AUTO LOAD ---------------- */
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId]);

    return {
        loading,
        pdfLoading,
        error,
        setError,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    };
};