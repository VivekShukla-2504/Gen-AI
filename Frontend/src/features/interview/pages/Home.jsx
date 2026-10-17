import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const SAMPLE_JD = `Role: Senior Full-Stack Engineer (MERN / GenAI)
Requirements:
- 3+ years of experience with React.js, modern state management, and responsive UI design.
- Strong proficiency in Node.js, Express.js RESTful API architecture, and asynchronous event loops.
- Hands-on expertise with MongoDB, schema optimization, aggregation pipelines, and indexing.
- Experience integrating LLM APIs (Google Gemini, OpenAI) and structured outputs.
- Familiarity with CI/CD, Docker, and cloud deployments (Vercel, Render/AWS).`;

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const { error: authError } = useAuth();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [loadingStep, setLoadingStep] = useState(0);

    const resumeInputRef = useRef();
    const navigate = useNavigate();

    // Dynamic loading status messages
    useEffect(() => {
        let interval;
        if (loading) {
            setLoadingStep(0);
            const steps = [
                "Extracting candidate resume & credentials...",
                "Analyzing job description requirements...",
                "Matching skills & identifying technical gaps...",
                "Formulating FAANG-level questions & model answers...",
                "Compiling your 5-day personalized preparation roadmap..."
            ];
            let current = 0;
            interval = setInterval(() => {
                current = (current + 1) % steps.length;
                setLoadingStep(current);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type && file.type !== "application/pdf") {
                setError("Only PDF files are allowed");
                setSelectedFile(null);
                return;
            }
            if (file.size > 3 * 1024 * 1024) {
                setError("File size exceeds 3MB limit");
                setSelectedFile(null);
                return;
            }
            setError(null);
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (resumeInputRef.current) {
            resumeInputRef.current.value = "";
        }
    };

    const fillSampleJD = () => {
        setJobDescription(SAMPLE_JD);
        if (!selfDescription) {
            setSelfDescription("Full-Stack JavaScript developer with strong experience in React 19, Node.js, Express, and MongoDB. Built full-stack apps with JWT authentication, RESTful APIs, and Generative AI integrations.");
        }
    };

    /* ---------------- GENERATE REPORT ---------------- */
    const handleGenerateReport = async () => {
        setError(null);

        // Client-side validations
        if (!jobDescription.trim()) {
            setError("Job description is required");
            return;
        }

        if (!selfDescription.trim() && !selectedFile) {
            setError("Please upload your resume PDF or write a self-description");
            return;
        }

        try {
            const res = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile: selectedFile
            });

            if (res?.success && res.data?._id) {
                navigate(`/interview/${res.data._id}`);
            } else {
                setError(res?.message || "Failed to generate interview report");
            }

        } catch (err) {
            console.log("Generate Report Error:", err);
            setError(err?.response?.data?.message || err?.message || "Something went wrong while generating report");
        }
    };

    // Calculate Dashboard Stats
    const totalReports = reports?.length || 0;
    const avgScore = totalReports > 0
        ? Math.round(reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalReports)
        : 0;
    const topScore = totalReports > 0
        ? Math.max(...reports.map(r => r.matchScore || 0))
        : 0;

    return (
        <div className="home-page">

            {/* ERROR BANNER */}
            {(error || authError) && (
                <div className="error-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{error || authError}</span>
                </div>
            )}

            {/* HERO SECTION */}
            <header className="page-header">
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    <span>AI Interview Copilot • Gemini 2.5 Flash</span>
                </div>

                <h1>
                    Prepare for Your Next Interview with <br />
                    <span className="gradient-text">Precision AI Strategy</span>
                </h1>

                <p>
                    Paste the target job description along with your profile. Our engine extracts critical skill gaps, creates tailored technical & behavioral questions, and generates a structured study roadmap.
                </p>
            </header>

            {/* DASHBOARD STATS BAR (Shown when reports exist) */}
            {totalReports > 0 && (
                <section className="stats-bar">
                    <div className="stat-card">
                        <div className="stat-icon stat-icon--blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                        </div>
                        <div>
                            <span className="stat-label">Interviews Prepared</span>
                            <span className="stat-value">{totalReports}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--purple">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                        </div>
                        <div>
                            <span className="stat-label">Avg. Match Score</span>
                            <span className="stat-value">{avgScore}%</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <div>
                            <span className="stat-label">Top Alignment</span>
                            <span className="stat-value">{topScore}%</span>
                        </div>
                    </div>
                </section>
            )}

            {/* MAIN INTERVIEW CREATION CARD */}
            <div className="interview-card">

                <div className="interview-card__body">

                    {/* LEFT PANEL: JOB DESCRIPTION */}
                    <div className="panel panel--left">
                        <div className="panel-header">
                            <div className="panel-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                                <h2>Job Description</h2>
                            </div>
                            <button
                                type="button"
                                onClick={fillSampleJD}
                                className="sample-btn"
                                title="Autofill sample job description for instant testing"
                            >
                                ✦ Load Sample JD
                            </button>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description or paste requirements here..."
                            maxLength={5000}
                            className="panel__textarea"
                        />

                        <div className="panel-footer-info">
                            <span className="char-counter">
                                {jobDescription.length} / 5000 characters
                            </span>
                        </div>
                    </div>

                    {/* RIGHT PANEL: CANDIDATE PROFILE */}
                    <div className="panel panel--right">
                        <div className="panel-header">
                            <div className="panel-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <h2>Your Profile / Resume</h2>
                            </div>
                        </div>

                        {/* CUSTOM DRAG & DROP UPLOAD BOX */}
                        <div
                            className={`upload-dropzone ${selectedFile ? "upload-dropzone--active" : ""}`}
                            onClick={() => resumeInputRef.current?.click()}
                        >
                            <input
                                ref={resumeInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />

                            {selectedFile ? (
                                <div className="file-info" onClick={(e) => e.stopPropagation()}>
                                    <div className="file-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                            <text x="7" y="17" fontSize="6" fontWeight="bold" fill="currentColor">PDF</text>
                                        </svg>
                                    </div>
                                    <div className="file-details">
                                        <span className="file-name">{selectedFile.name}</span>
                                        <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="remove-file-btn"
                                        title="Remove file"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="upload-prompt">
                                    <div className="upload-icon">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </div>
                                    <p className="upload-main-text">
                                        <strong>Click to upload Resume</strong> or drag & drop
                                    </p>
                                    <span className="upload-sub-text">PDF only (Max 3MB)</span>
                                </div>
                            )}
                        </div>

                        <div className="or-divider">
                            <span>OR DESCRIBE YOUR SKILLS</span>
                        </div>

                        <textarea
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            placeholder="Briefly describe your years of experience, core tech stack, and key project highlights..."
                            className="panel__textarea panel__textarea--short"
                        />
                    </div>

                </div>

                {/* CARD FOOTER */}
                <div className="interview-card__footer">
                    <div className="footer-status">
                        {loading ? (
                            <div className="loading-status">
                                <div className="pulse-dot"></div>
                                <span>{loadingStep === 0 && "Extracting candidate resume & credentials..."}
                                      {loadingStep === 1 && "Analyzing job requirements..."}
                                      {loadingStep === 2 && "Matching skills & identifying technical gaps..."}
                                      {loadingStep === 3 && "Formulating technical & behavioral questions..."}
                                      {loadingStep === 4 && "Building your personalized study roadmap..."}
                                </span>
                            </div>
                        ) : (
                            <span className="footer-info">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                Generated in ~5-8 seconds using Gemini 2.5 Flash
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleGenerateReport}
                        className="button primary-button generate-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="btn-spinner"></div>
                                <span>Generating Strategy...</span>
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                                <span>Generate Interview Plan</span>
                            </>
                        )}
                    </button>
                </div>

            </div>

            {/* RECENT REPORTS DASHBOARD GRID */}
            {reports?.length > 0 && (
                <section className="recent-reports">
                    <div className="section-header">
                        <div>
                            <h2>Recent Interview Plans</h2>
                            <p className="section-sub">Quickly revisit and prepare for your previous target roles</p>
                        </div>
                    </div>

                    <div className="reports-grid">
                        {reports.map((report) => {
                            const score = report.matchScore || 0;
                            const scoreClass = score >= 80 ? "score--high" : score >= 60 ? "score--mid" : "score--low";

                            return (
                                <div
                                    key={report._id}
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                    className="report-card"
                                >
                                    <div className="report-card__header">
                                        <h3 className="report-title">{report.title || "Interview Strategy"}</h3>
                                        <span className={`score-badge ${scoreClass}`}>
                                            {score}% Match
                                        </span>
                                    </div>

                                    <div className="report-card__footer">
                                        <span className="report-date">
                                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
                                        </span>
                                        <span className="view-link">
                                            View Report
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="9 18 15 12 9 6"/>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
