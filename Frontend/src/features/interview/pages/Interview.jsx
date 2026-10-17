import React, { useState } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useParams, Link } from 'react-router';

/* ---------------- NAV ITEMS ---------------- */
const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Preparation Roadmap',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
];

/* ---------------- QUESTION CARD ---------------- */
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        if (item?.answer) {
            navigator.clipboard.writeText(item.answer);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(!open)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item?.question || "No question"}</p>

                <div className='q-card__header-right'>
                    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>

            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section q-card__section--intention'>
                        <div className='section-tag-row'>
                            <span className='q-card__tag q-card__tag--intention'>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Interviewer Intention
                            </span>
                        </div>
                        <p className='q-card__text'>{item?.intention || "Evaluates core principles and real-world implementation competency."}</p>
                    </div>

                    <div className='q-card__section q-card__section--answer'>
                        <div className='section-tag-row'>
                            <span className='q-card__tag q-card__tag--answer'>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Model Answer (FAANG Standard)
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
                                title="Copy answer to clipboard"
                            >
                                {copied ? (
                                    <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <p className='q-card__text'>{item?.answer || "N/A"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ---------------- ROADMAP DAY ---------------- */
const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__timeline'>
            <div className='timeline-dot'></div>
            <div className='timeline-line'></div>
        </div>

        <div className='roadmap-day__card'>
            <div className='roadmap-day__header'>
                <span className='roadmap-day__badge'>Day {day?.day}</span>
                <h3 className='roadmap-day__focus'>{day?.focus}</h3>
            </div>

            <ul className='roadmap-day__tasks'>
                {(day?.tasks || []).map((task, i) => (
                    <li key={i}>
                        <span className='task-checkbox'>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </span>
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

/* ---------------- MAIN COMPONENT ---------------- */
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical');

    const {
        report,
        loading,
        pdfLoading,
        getResumePdf
    } = useInterview();

    const { interviewId } = useParams();

    /* ---------------- LOADING STATE ---------------- */
    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <div className='loading-spinner'></div>
                <h2>Loading Your Interview Strategy...</h2>
                <p>Retrieving questions, roadmap, and diagnostics</p>
            </main>
        );
    }

    const score = report?.matchScore || 0;
    const scoreColor =
        score >= 80 ? 'score--high' :
        score >= 60 ? 'score--mid' :
        'score--low';

    // SVG Circular Gauge calculation
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className='interview-page'>

            {/* TOP HEADER BAR */}
            <div className='top-action-bar'>
                <Link to="/" className='back-btn'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Back to Dashboard</span>
                </Link>

                <div className='report-badge-info'>
                    <span className='role-badge'>{report?.title || "Interview Plan"}</span>
                    <span className='meta-dot'>•</span>
                    <span className='meta-text'>Generated via Gemini 2.5 Flash</span>
                </div>

                <button
                    onClick={() => getResumePdf(interviewId)}
                    className='button primary-button download-top-btn'
                    disabled={pdfLoading}
                >
                    {pdfLoading ? (
                        <>
                            <div className='btn-spinner'></div>
                            <span>Compiling PDF...</span>
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download ATS Resume</span>
                        </>
                    )}
                </button>
            </div>

            {/* 3-COLUMN MAIN ARENA */}
            <div className='interview-layout'>

                {/* ── LEFT NAV ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Report Sections</p>

                        {NAV_ITEMS.map(item => {
                            const count =
                                item.id === 'technical' ? (report?.technicalQuestions?.length || 0) :
                                item.id === 'behavioral' ? (report?.behavioralQuestions?.length || 0) :
                                (report?.preparationPlan?.length || 0);

                            return (
                                <button
                                    key={item.id}
                                    className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className='interview-nav__icon'>{item.icon}</span>
                                    <span className='interview-nav__title'>{item.label}</span>
                                    <span className='nav-counter'>{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className='nav-bottom-card'>
                        <span className='mini-badge'>Pro Tip</span>
                        <p>Model answers follow the STAR framework & best system design principles.</p>
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── CENTER CONTENT ── */}
                <main className='interview-content'>

                    {/* TECHNICAL QUESTIONS */}
                    {activeNav === 'technical' && (
                        <section className='fade-in'>
                            <div className='content-header'>
                                <div>
                                    <h2>Technical Questions</h2>
                                    <p className='content-sub'>Tailored deep-dive questions targeting core architecture and coding fundamentals</p>
                                </div>
                                <span className='content-header__count'>
                                    {report?.technicalQuestions?.length || 0} Questions
                                </span>
                            </div>

                            <div className='q-list'>
                                {(report?.technicalQuestions || []).map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* BEHAVIORAL QUESTIONS */}
                    {activeNav === 'behavioral' && (
                        <section className='fade-in'>
                            <div className='content-header'>
                                <div>
                                    <h2>Behavioral Questions</h2>
                                    <p className='content-sub'>Scenario-based questions assessing leadership, conflict resolution, and teamwork</p>
                                </div>
                                <span className='content-header__count'>
                                    {report?.behavioralQuestions?.length || 0} Questions
                                </span>
                            </div>

                            <div className='q-list'>
                                {(report?.behavioralQuestions || []).map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ROADMAP */}
                    {activeNav === 'roadmap' && (
                        <section className='fade-in'>
                            <div className='content-header'>
                                <div>
                                    <h2>Personalized Study Roadmap</h2>
                                    <p className='content-sub'>Actionable day-by-day revision path to eliminate skill gaps prior to your interview</p>
                                </div>
                                <span className='content-header__count'>
                                    {report?.preparationPlan?.length || 0}-Day Plan
                                </span>
                            </div>

                            <div className='roadmap-list'>
                                {(report?.preparationPlan || []).map((day) => (
                                    <RoadMapDay key={day?.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                </main>

                <div className='interview-divider' />

                {/* ── RIGHT SIDEBAR (DIAGNOSTICS) ── */}
                <aside className='interview-sidebar'>

                    {/* MATCH SCORE SVG GAUGE */}
                    <div className='match-score'>
                        <p className='match-score__label'>Profile Match</p>

                        <div className={`gauge-container ${scoreColor}`}>
                            <svg className='gauge-svg' width="100" height="100" viewBox="0 0 100 100">
                                <circle
                                    className='gauge-track'
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                />
                                <circle
                                    className='gauge-bar'
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className='gauge-center-text'>
                                <span className='gauge-score'>{score}</span>
                                <span className='gauge-percent'>%</span>
                            </div>
                        </div>

                        <p className='match-score__sub'>
                            {score >= 80 ? "High Alignment with Job Description" :
                             score >= 60 ? "Moderate Alignment — Address Gaps" :
                             "Significant Preparation Needed"}
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* SKILL GAPS MATRIX */}
                    <div className='skill-gaps'>
                        <div className='skill-gaps__header'>
                            <p className='skill-gaps__label'>Identified Skill Gaps</p>
                            <span className='skill-count'>{(report?.skillGaps || []).length} Detected</span>
                        </div>

                        <div className='skill-gaps__list'>
                            {(report?.skillGaps || []).map((gap, i) => (
                                <div
                                    key={i}
                                    className={`skill-tag skill-tag--${gap?.severity}`}
                                >
                                    <span className='severity-indicator'></span>
                                    <span className='skill-name'>{gap?.skill}</span>
                                    <span className='severity-text'>{gap?.severity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    {/* QUICK TIPS WIDGET */}
                    <div className='interview-tips-card'>
                        <div className='tips-header'>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            <span>Interview Strategy</span>
                        </div>
                        <p>Explain trade-offs clearly when answering technical questions. Mention time/space complexities upfront.</p>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default Interview;