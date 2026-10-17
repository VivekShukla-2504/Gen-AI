const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

/* ---------------- SCHEMA ---------------- */
const interviewReportSchema = z.object({
    title: z.string(),
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    )
});

/* ---------------- SAFE PARSER ---------------- */
function safeParse(jsonString) {
    try {
        if (!jsonString) return null;

        const cleaned = jsonString
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (err) {
        console.error("JSON Parse Error:", err.message);
        return null;
    }
}

/* ---------------- FALLBACK DATA ---------------- */
function buildFallbackData() {
    return {
        title: "Interview Report",
        matchScore: 72,

        technicalQuestions: [
            {
                question: "Explain React hooks with examples.",
                intention: "Check React fundamentals",
                answer: "Hooks like useState and useEffect manage state and lifecycle."
            },
            {
                question: "What is REST API?",
                intention: "Backend knowledge",
                answer: "REST APIs use HTTP methods for communication between client and server."
            },
            {
                question: "What is Node.js?",
                intention: "Backend understanding",
                answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine."
            }
        ],

        behavioralQuestions: [
            {
                question: "Tell me about yourself.",
                intention: "Communication skills",
                answer: "Talk about education, skills, and career goals."
            },
            {
                question: "Why should we hire you?",
                intention: "Confidence & fit",
                answer: "Explain skills, projects, and alignment with role."
            }
        ],

        skillGaps: [
            {
                skill: "System Design",
                severity: "medium"
            },
            {
                skill: "Testing (Jest)",
                severity: "high"
            }
        ],

        preparationPlan: [
            {
                day: 1,
                focus: "Frontend Fundamentals",
                tasks: ["HTML/CSS revision", "JavaScript ES6"]
            },
            {
                day: 2,
                focus: "React Deep Dive",
                tasks: ["Hooks", "State management", "Mini project"]
            },
            {
                day: 3,
                focus: "Backend Basics",
                tasks: ["Node.js", "Express APIs"]
            },
            {
                day: 4,
                focus: "Database",
                tasks: ["MongoDB CRUD", "Schema design"]
            },
            {
                day: 5,
                focus: "Full Stack Integration",
                tasks: ["Build small MERN project"]
            }
        ]
    };
}

/* ---------------- INTERVIEW REPORT ---------------- */
async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    try {
        const prompt = `
You are a SENIOR FAANG-level technical interviewer and recruiter.

TASK:
Generate a HIGH QUALITY, comprehensive interview report in strict JSON format.

JSON STRUCTURE REQUIRED:
{
  "title": "Interview Report Title (e.g. Senior Full-Stack Engineer Interview Plan)",
  "matchScore": 75,
  "technicalQuestions": [
    {
      "question": "Specific, practical technical question targeting JD and candidate profile",
      "intention": "What technical competency the interviewer is assessing",
      "answer": "Comprehensive, structured model answer covering principles and trade-offs"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Situational/behavioral question",
      "intention": "What cultural/soft-skill competency is being evaluated",
      "answer": "STAR framework model answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "Missing or weak skill name",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Topic focus for this day",
      "tasks": ["Actionable study/coding task 1", "Actionable study/coding task 2"]
    }
  ]
}

STRICT CONSTRAINTS:
- severity must be strictly one of: "low", "medium", "high"
- day must be an integer (1, 2, 3...)
- Every question MUST have all three fields: question, intention, and answer.
- 5 to 7 technical questions.
- 3 to 5 behavioral questions.
- 3 to 6 skill gaps.
- 5 to 7 day preparation plan.

Candidate Resume:
${resume || "None provided"}

Self Description:
${selfDescription || "None provided"}

Job Description:
${jobDescription}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        if (!response?.text) {
            throw new Error("Empty AI response");
        }

        const parsed = safeParse(response.text);

        if (!parsed || !parsed.technicalQuestions?.length) {
            console.warn(" AI fallback triggered");
            return buildFallbackData();
        }

        // Normalize data to guarantee 100% compliance with MongoDB schema
        return {
            title: parsed.title || "Interview Preparation Strategy",
            matchScore: typeof parsed.matchScore === "number" ? parsed.matchScore : 72,

            technicalQuestions: (parsed.technicalQuestions || []).map(q => ({
                question: q.question || "Core Technical Concept",
                intention: q.intention || "Evaluates practical implementation depth and problem-solving.",
                answer: q.answer || "Provide a structured, real-world explanation highlighting trade-offs and complexity."
            })),

            behavioralQuestions: (parsed.behavioralQuestions || []).map(q => ({
                question: q.question || "Behavioral Scenario",
                intention: q.intention || "Assesses team collaboration, communication, and adaptability.",
                answer: q.answer || "Apply the STAR method: Situation, Task, Action, and Result."
            })),

            skillGaps: (parsed.skillGaps || []).map(g => ({
                skill: g.skill || "Technical Skill",
                severity: ["low", "medium", "high"].includes(String(g.severity).toLowerCase())
                    ? String(g.severity).toLowerCase()
                    : "medium"
            })),

            preparationPlan: (parsed.preparationPlan || []).map((p, idx) => ({
                day: parseInt(String(p.day).replace(/\D/g, ""), 10) || (idx + 1),
                focus: p.focus || `Day ${idx + 1} Revision`,
                tasks: Array.isArray(p.tasks) && p.tasks.length ? p.tasks : ["Review key concepts and build small practice code"]
            }))
        };

    } catch (error) {
        console.error("generateInterviewReport Error:", error.message);
        return buildFallbackData();
    }
}

/* ---------------- BROWSER LAUNCH OPTIONS ---------------- */
async function getBrowserLaunchOptions() {
    const isWindows = process.platform === "win32";
    const isMac = process.platform === "darwin";

    // 1. Explicit environment path
    if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
        return {
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
            headless: true
        };
    }

    // 2. Windows local dev (detect installed Chrome or Edge)
    if (isWindows) {
        const winPaths = [
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
            "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
        ];
        for (const p of winPaths) {
            if (fs.existsSync(p)) {
                return {
                    executablePath: p,
                    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
                    headless: true
                };
            }
        }
    }

    // 3. MacOS local dev
    if (isMac) {
        const macPaths = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
        ];
        for (const p of macPaths) {
            if (fs.existsSync(p)) {
                return {
                    executablePath: p,
                    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
                    headless: true
                };
            }
        }
    }

    // 4. Linux / Production (Lambda / Render / Docker with @sparticuz/chromium)
    try {
        const execPath = await chromium.executablePath();
        if (execPath) {
            return {
                executablePath: execPath,
                args: chromium.args || ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
                headless: chromium.headless,
                defaultViewport: chromium.defaultViewport
            };
        }
    } catch (err) {
        console.warn("Sparticuz chromium path resolution skipped:", err.message);
    }

    // 5. Fallback standard Linux binaries
    const linuxPaths = [
        "/usr/bin/google-chrome-stable",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium"
    ];
    for (const p of linuxPaths) {
        if (fs.existsSync(p)) {
            return {
                executablePath: p,
                args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
                headless: true
            };
        }
    }

    throw new Error("No compatible Chrome or Chromium browser executable found on this system.");
}

/* ---------------- HTML STRING EXTRACTOR ---------------- */
function extractHtmlString(input) {
    if (!input) return null;
    if (typeof input === "string") {
        const trimmed = input.trim();
        if (trimmed.includes("<html") || trimmed.includes("<body") || trimmed.includes("<div") || trimmed.includes("<!DOCTYPE")) {
            return trimmed;
        }
        return null;
    }
    if (typeof input === "object" && input !== null) {
        if (input.html) {
            const nested = extractHtmlString(input.html);
            if (nested) return nested;
        }
        if (input.resumeHtml) {
            const nested = extractHtmlString(input.resumeHtml);
            if (nested) return nested;
        }
        if (input.content) {
            const nested = extractHtmlString(input.content);
            if (nested) return nested;
        }
        for (const key of Object.keys(input)) {
            if (typeof input[key] === "string" && (input[key].includes("<html") || input[key].includes("<!DOCTYPE"))) {
                return input[key].trim();
            }
            if (typeof input[key] === "object" && input[key] !== null) {
                const nested = extractHtmlString(input[key]);
                if (nested) return nested;
            }
        }
    }
    return null;
}

/* ---------------- SINGLE-PAGE ATS CSS ENFORCER ---------------- */
function injectSinglePageEnforcerCss(html) {
    if (!html || typeof html !== "string") return html;
    const enforcerStyle = `
<style id="ats-single-page-enforcer">
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
  *, *::before, *::after {
    box-sizing: border-box !important;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    font-family: Arial, Helvetica, "Segoe UI", Roboto, sans-serif !important;
    font-size: 8.8pt !important;
    line-height: 1.25 !important;
    color: #0f172a !important;
    background: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .container, .resume-container, .page, main {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  h1 {
    font-size: 15pt !important;
    line-height: 1.15 !important;
    margin: 0 0 2px 0 !important;
    text-align: center !important;
    font-weight: 700 !important;
    color: #0f172a !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
  }
  .header {
    text-align: center !important;
    margin-bottom: 5px !important;
    padding-bottom: 3px !important;
    border-bottom: 1.5px solid #0f172a !important;
  }
  .contact-info, .contact, .header p {
    font-size: 8.4pt !important;
    line-height: 1.2 !important;
    margin: 1px 0 !important;
    color: #334155 !important;
    text-align: center !important;
  }
  .contact a, .contact-info a {
    color: #0f172a !important;
    text-decoration: none !important;
  }
  h2, .section-title {
    font-size: 9.6pt !important;
    line-height: 1.2 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    font-weight: 700 !important;
    color: #0f172a !important;
    border-bottom: 1px solid #cbd5e1 !important;
    padding-bottom: 1px !important;
    margin: 5px 0 2px 0 !important;
  }
  h3, .item-title, .job-title, .project-title {
    font-size: 8.9pt !important;
    line-height: 1.2 !important;
    font-weight: 600 !important;
    margin: 2px 0 1px 0 !important;
    color: #0f172a !important;
  }
  .company, .dates, .subtext, .role-meta {
    font-size: 8.2pt !important;
    color: #475569 !important;
  }
  p {
    margin: 1.5px 0 2px 0 !important;
    font-size: 8.6pt !important;
    line-height: 1.25 !important;
  }
  ul {
    margin: 1px 0 2px 0 !important;
    padding-left: 14px !important;
  }
  li {
    margin-bottom: 1px !important;
    font-size: 8.4pt !important;
    line-height: 1.22 !important;
    color: #1e293b !important;
  }
  .card, .section {
    margin-bottom: 3px !important;
    padding: 0 !important;
  }
  section, .section, .experience-item, .project-item, .education-item {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
</style>
`;
    if (html.includes("</head>")) {
        return html.replace("</head>", `${enforcerStyle}</head>`);
    }
    return `${enforcerStyle}${html}`;
}

/* ---------------- PDF GENERATION (STRICT 1-PAGE GUARANTEE) ---------------- */
async function generatePdfFromHtml(htmlContent) {
    if (typeof htmlContent !== "string" || !htmlContent.trim()) {
        throw new Error("Invalid HTML content provided to PDF generator");
    }

    const finalHtml = injectSinglePageEnforcerCss(htmlContent);
    let browser;

    try {
        const launchOptions = await getBrowserLaunchOptions();
        browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

        await page.setContent(finalHtml, {
            waitUntil: "networkidle0"
        });

        // Measure rendered content height to ensure strict 1-page fit
        const scrollHeight = await page.evaluate(() => {
            return Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                document.documentElement.offsetHeight || 0
            );
        });

        const printableHeight = 1040; // Printable A4 height at 96 DPI with 8mm margins
        let scale = scrollHeight > printableHeight
            ? Math.min(1, Math.max(0.55, (printableHeight / scrollHeight) * 0.96))
            : 1;

        let pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            scale: Number(scale.toFixed(2)),
            margin: {
                top: "8mm",
                bottom: "8mm",
                left: "10mm",
                right: "10mm"
            }
        });

        // Strict 1-page verification and auto-correction
        try {
            let pdfMeta = await pdfParse(pdfBuffer);
            let attempts = 0;
            while (pdfMeta.numpages > 1 && attempts < 3 && scale > 0.50) {
                attempts++;
                scale = Number((scale * 0.90).toFixed(2));
                pdfBuffer = await page.pdf({
                    format: "A4",
                    printBackground: true,
                    scale: scale,
                    margin: {
                        top: "8mm",
                        bottom: "8mm",
                        left: "10mm",
                        right: "10mm"
                    }
                });
                pdfMeta = await pdfParse(pdfBuffer);
            }
        } catch (parseErr) {
            console.warn("PDF verification parsing notice:", parseErr.message);
        }

        return pdfBuffer;

    } finally {
        if (browser) {
            await browser.close().catch(() => {});
        }
    }
}

/* ---------------- FALLBACK RESUME TEMPLATE (STRICT 1-PAGE) ---------------- */
function buildFallbackResumeHtml({ resume, jobDescription, selfDescription, candidateName, candidateEmail }) {
    const displayName = candidateName || "Candidate";
    const displayEmail = candidateEmail ? `<a href="mailto:${candidateEmail}">${candidateEmail}</a>` : "";
    const cleanResume = resume || selfDescription || "Full-stack software development experience with modern web technologies.";
    const cleanJD = jobDescription || "Target Role Requirements";

    // Extract any lines or snippets for clean rendering
    const resumeLines = cleanResume.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const summaryText = selfDescription || (resumeLines.length > 0 ? resumeLines.slice(0, 3).join(" ") : "Results-driven Software Engineer with proven expertise in building scalable, high-performance web applications and REST APIs.");
    const experienceText = resumeLines.length > 3 ? resumeLines.slice(3, 14).join("\n") : cleanResume.slice(0, 1000);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${displayName} - ATS Resume</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            @page { size: A4 portrait; margin: 8mm 10mm; }
            body {
                font-family: Arial, Helvetica, "Segoe UI", sans-serif;
                color: #0f172a;
                line-height: 1.25;
                font-size: 8.8pt;
                background: #ffffff;
            }
            .header {
                text-align: center;
                border-bottom: 1.5px solid #0f172a;
                padding-bottom: 4px;
                margin-bottom: 6px;
            }
            h1 {
                font-size: 15pt;
                margin: 0 0 2px 0;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #0f172a;
                font-weight: 700;
            }
            .contact {
                font-size: 8.4pt;
                color: #334155;
            }
            .contact a {
                color: #0f172a;
                text-decoration: none;
            }
            h2 {
                font-size: 9.6pt;
                color: #0f172a;
                border-bottom: 1px solid #cbd5e1;
                padding-bottom: 1px;
                margin: 5px 0 2px 0;
                text-transform: uppercase;
                letter-spacing: 0.04em;
                font-weight: 700;
            }
            p { margin: 2px 0 3px 0; font-size: 8.6pt; line-height: 1.25; }
            .section-desc { font-size: 8.6pt; color: #334155; }
            .content-block {
                white-space: pre-line;
                font-size: 8.4pt;
                line-height: 1.25;
                color: #1e293b;
            }
            .highlight { font-weight: 600; color: #0f172a; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${displayName}</h1>
            <div class="contact">
                ${displayEmail} ${displayEmail ? " | " : ""} Target Role: ${cleanJD.slice(0, 60)}
            </div>
        </div>

        <h2>Professional Summary</h2>
        <p class="section-desc">
            ${summaryText.slice(0, 280)}
        </p>

        <h2>Experience & Technical Qualifications</h2>
        <div class="content-block">
            ${experienceText.slice(0, 1400)}
        </div>

        <h2>Target Role Alignment</h2>
        <p class="section-desc">
            <span class="highlight">Target Objectives:</span> ${cleanJD.slice(0, 300)}
        </p>
    </body>
    </html>
    `;
}

/* ---------------- RESUME PDF ---------------- */
async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription,
    candidateName,
    candidateEmail
}) {
    try {
        const hasResume = typeof resume === "string" && resume.trim().length > 20;

        const prompt = `
You are an expert Technical Resume Writer and ATS Optimization Specialist.

YOUR OBJECTIVE:
Refine and transform the candidate's actual background into a high-scoring, ATS-compliant, recruiter-ready EXACTLY ONE-PAGE HTML resume strictly tailored to the Target Job Description.

CRITICAL REQUIREMENT - STRICTLY ONE SINGLE A4 PAGE (NO SECOND PAGE):
- The final ATS resume MUST fit onto EXACTLY ONE SINGLE A4 PAGE.
- Recruiters and ATS screening engines prioritize concise, 1-page resumes. It MUST NOT spill over onto a second page under any circumstances.
- Limit content volume:
  * Header: Full Name, Contact info (Email, Phone, LinkedIn/GitHub, City) on 1-2 lines.
  * Professional Summary: EXACTLY 2-3 concise, impactful sentences (max 40-50 words) positioning the candidate for the target role.
  * Technical Skills: 3-4 categorized inline lines (e.g. Languages: ... | Frameworks & Libraries: ... | Databases: ... | Cloud & Tools: ...).
  * Work Experience: Top 2-3 most relevant roles. For each role, provide Title, Company, Dates, and EXACTLY 2-3 bullet points max (each bullet point 1-2 lines maximum) using the Google XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".
  * Key Projects: Top 1-2 projects with Tech Stack and 1-2 bullet points each.
  * Education: 1-2 compact lines (Degree, University, Graduation Year).
- Strictly avoid excessive verbosity, long paragraphs, or filler text.

STRICT IDENTITY & DATA ACCURACY RULES (DO NOT VIOLATE):
1. PRESERVE THE CANDIDATE'S REAL IDENTITY:
   ${hasResume
       ? "- Extract and use the candidate's REAL name from the provided Resume text. If no explicit name is found in the text, use: \"" + (candidateName || "Candidate") + "\"."
       : "- The candidate's name MUST be: \"" + (candidateName || "Candidate") + "\"."}
   ${candidateEmail ? "- Use candidate email: \"" + candidateEmail + "\"." : ""}
   - NEVER EVER use placeholder or generic dummy names like "John Doe", "Jane Doe", "Tech Innovators Inc.", or fake colleges.
   - Keep candidate's REAL companies, universities, degrees, and project names. Do NOT replace them with generic templates!

2. ATS REFINEMENT & KEYWORD OPTIMIZATION:
   - Analyze the Target Job Description for required skills, frameworks, libraries, and core responsibilities.
   - REWRITE and REFINE the candidate's existing achievements into high-impact bullet points using strong action verbs (Architected, Engineered, Spearheaded, Implemented, Streamlined, Scaled).
   - Naturally infuse relevant keywords from the Job Description into the skills and experience sections so that automated ATS scanners score it 90%+.

3. ATS FORMAT & STYLING (SINGLE-PAGE COMPACT CSS):
   - Include clean CSS:
     @page { size: A4 portrait; margin: 8mm 10mm; }
     body { font-family: Arial, Helvetica, "Segoe UI", sans-serif; font-size: 8.8pt; line-height: 1.25; color: #0f172a; margin: 0; padding: 0; }
     h1 { font-size: 15pt; margin: 0 0 2px 0; text-align: center; font-weight: 700; text-transform: uppercase; }
     .contact { font-size: 8.4pt; text-align: center; margin-bottom: 5px; color: #334155; }
     h2 { font-size: 9.6pt; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; margin: 5px 0 2px 0; padding-bottom: 1px; color: #0f172a; }
     h3 { font-size: 8.9pt; font-weight: 600; margin: 2px 0 1px 0; }
     ul { margin: 1px 0 2px 0; padding-left: 14px; }
     li { margin-bottom: 1px; font-size: 8.4pt; line-height: 1.22; color: #1e293b; }
     p { margin: 1.5px 0 2px 0; font-size: 8.6pt; }

OUTPUT FORMAT:
Return ONLY a valid JSON object with a single property "html":
{
  "html": "<!DOCTYPE html><html lang=\\"en\\"><head><meta charset=\\"UTF-8\\"><style>...</style></head><body>...</body></html>"
}

CANDIDATE INFORMATION:
Candidate Real Name: ${candidateName || "Candidate"}
Candidate Email: ${candidateEmail || ""}

Resume Text:
${resume && resume.trim().length > 0 ? resume : "(No resume uploaded - use self-description and profile details)"}

Self Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription || "Software Engineer"}
`;

        let htmlToRender = null;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json"
                }
            });

            if (response?.text) {
                const parsed = safeParse(response.text);
                htmlToRender = extractHtmlString(parsed);

                if (!htmlToRender) {
                    const raw = response.text.replace(/```html/gi, "").replace(/```/g, "").trim();
                    htmlToRender = extractHtmlString(raw);
                }
            }
        } catch (aiErr) {
            console.warn("AI resume generation failed, using structured template:", aiErr.message);
        }

        if (!htmlToRender || typeof htmlToRender !== "string") {
            htmlToRender = buildFallbackResumeHtml({
                resume,
                jobDescription,
                selfDescription,
                candidateName,
                candidateEmail
            });
        }

        return await generatePdfFromHtml(htmlToRender);

    } catch (error) {
        console.error("generateResumePdf Error:", error.message);
        throw new Error("Failed to generate resume PDF: " + error.message);
    }
}

module.exports = {
    generateInterviewReport,
    generateResumePdf,
    generatePdfFromHtml
};
