import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const { handleLogout, error: authError } = useAuth();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [error, setError] = useState(null);

    const resumeInputRef = useRef();
    const navigate = useNavigate();

    /* ---------------- GENERATE REPORT ---------------- */
    const handleGenerateReport = async () => {
        setError(null);

        const resumeFile = resumeInputRef.current?.files?.[0];

        // validation
        if (!jobDescription && !selfDescription && !resumeFile) {
            setError("Please provide resume or self description");
            return;
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            // safe check
            if (!data || !data._id) {
                setError("Failed to generate interview report");
                return;
            }

            navigate(`/interview/${data._id}`);

        } catch (err) {
            console.log("Generate Report Error:", err);

            //  API LIMIT HANDLING 
            if (err?.response?.status === 429) {
                setError("API limit reached. Try again later");
                return;
            }

            setError("Something went wrong while generating report");
        }
    };

    /* ---------------- LOGOUT ---------------- */
    const logoutUser = async () => {
        try {
            const res = await handleLogout();

            if (res?.success) {
                navigate("/login");
            }
        } catch (err) {
            console.log("Logout Error:", err);

            // optional: API limit handling here too
            if (err?.response?.status === 429) {
                alert("API limit reached. Try again later");
            }
        }
    };

    return (
        <div className="home-page">

            {/* ERROR BANNER */}
            {(error || authError) && (
                <div className="error-banner">
                    {error || authError}
                </div>
            )}

            {/* HEADER */}
            <header className="page-header">
                <div className="header-row">
                    <div>
                        <h1>
                            Create Your Custom{" "}
                            <span className="highlight">
                                Interview Plan
                            </span>
                        </h1>

                        <p>
                            AI analyzes your profile and job description to
                            build a winning strategy.
                        </p>
                    </div>

                    <button
                        onClick={logoutUser}
                        className="generate-btn logout-btn"
                        disabled={loading}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* MAIN CARD */}
            <div className="interview-card">

                <div className="interview-card__body">

                    {/* LEFT PANEL */}
                    <div className="panel panel--left">
                        <h2>Job Description</h2>

                        <textarea
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                            placeholder="Paste job description..."
                            maxLength={5000}
                            className="panel__textarea"
                        />

                        <div className="char-counter">
                            {jobDescription.length} / 5000
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="panel panel--right">

                        <h2>Profile</h2>

                        <input
                            ref={resumeInputRef}
                            type="file"
                            accept=".pdf,.docx"
                        />

                        <textarea
                            value={selfDescription}
                            onChange={(e) =>
                                setSelfDescription(e.target.value)
                            }
                            placeholder="Or write self description..."
                            className="panel__textarea"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="interview-card__footer">

                    <span className="footer-info">
                        AI generates interview strategy (~30s)
                    </span>

                    <button
                        onClick={handleGenerateReport}
                        className="generate-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Generating..."
                            : "Generate Interview Plan"}
                    </button>
                </div>

            </div>

            {/* REPORT LIST */}
            {reports?.length > 0 && (
                <section className="recent-reports">
                    <h2>Recent Reports</h2>

                    <ul>
                        {reports.map((report) => (
                            <li
                                key={report._id}
                                onClick={() =>
                                    navigate(`/interview/${report._id}`)
                                }
                                className="report-item"
                            >
                                <h3>{report.title}</h3>

                                <p>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default Home;
