import React from "react";
import { Link } from "react-router";
import ThemeToggle from "../../theme/ThemeToggle";

const AuthShowcase = () => {
    return (
        <aside className="auth-showcase">
            {/* Top Glow Orb */}
            <div className="showcase-glow-orb showcase-glow-orb--top"></div>
            <div className="showcase-glow-orb showcase-glow-orb--bottom"></div>

            <div className="showcase-content">
                {/* Brand Header with Theme Toggle */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Link to="/" className="showcase-brand">
                        <div className="logo-box">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        </div>
                        <span className="logo-title">
                            Prep<span className="gradient-text">AI</span>
                        </span>
                        <span className="version-pill">
                            <span className="live-dot"></span>
                            Gemini 2.5 Flash
                        </span>
                    </Link>

                    <ThemeToggle compact={true} />
                </div>

                {/* Hero Pitch */}
                <div className="showcase-hero">
                    <div className="hero-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>AI-Powered Career Intelligence</span>
                    </div>
                    <h1>
                        Crush Your Next Tech Interview with <span className="gradient-text">AI Precision.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Stop practicing blindly. PrepAI analyzes any Job Description, diagnoses your skill gaps, and prepares FAANG-level answers tailored to your real background.
                    </p>
                </div>

                {/* Visual Glassmorphic Preview Card */}
                <div className="showcase-preview-card">
                    <div className="preview-card-header">
                        <div className="target-role-badge">
                            <span className="role-dot"></span>
                            <span>Target: Full-Stack MERN / GenAI</span>
                        </div>
                        <span className="match-pill">94% Match</span>
                    </div>

                    <div className="preview-card-metrics">
                        <div className="metric-item">
                            <div className="metric-icon-box metric-icon-box--purple">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            </div>
                            <div className="metric-text">
                                <p className="metric-label">Technical & Behavioral</p>
                                <p className="metric-value">FAANG Model Answers + Intent</p>
                            </div>
                        </div>

                        <div className="metric-item">
                            <div className="metric-icon-box metric-icon-box--green">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                            <div className="metric-text">
                                <p className="metric-label">ATS Resume Compiler</p>
                                <p className="metric-value">Strictly 1-Page A4 Verified</p>
                            </div>
                        </div>

                        <div className="metric-item">
                            <div className="metric-icon-box metric-icon-box--blue">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                                </svg>
                            </div>
                            <div className="metric-text">
                                <p className="metric-label">Preparation Roadmap</p>
                                <p className="metric-value">5-Day Structured Strategy</p>
                            </div>
                        </div>
                    </div>

                    <div className="preview-card-footer">
                        <span className="guarantee-text">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            100% Zero-Hallucination Factual Grounding
                        </span>
                    </div>
                </div>

                {/* Social Proof & Trust Footer */}
                <div className="showcase-trust-footer">
                    <div className="avatar-stack">
                        <div className="avatar avatar--1">VS</div>
                        <div className="avatar avatar--2">AK</div>
                        <div className="avatar avatar--3">RD</div>
                        <div className="avatar avatar--4">PS</div>
                    </div>
                    <div className="trust-text">
                        <div className="stars-row">
                            <span>★★★★★</span>
                            <span className="score-label">4.9/5 Rating</span>
                        </div>
                        <p className="trust-sub">Trusted by candidates cracking top engineering roles</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AuthShowcase;

