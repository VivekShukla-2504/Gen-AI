const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

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
Generate a HIGH QUALITY interview report.

STRICT REQUIREMENTS:
- Return ONLY valid JSON
- No markdown, no explanation
- DO NOT leave arrays empty
- Generate realistic FAANG-level interview content
- Be strict and detailed like a real interviewer

Make sure:
- Output is diverse
- No repeated questions
- At least 3 technical + 3 behavioral questions
- At least 4 skill gaps
- At least 5-day preparation plan

MUST INCLUDE:
- 5-7 technical questions
- 3-5 behavioral questions
- 3-6 skill gaps
- 4-7 day preparation plan

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "text/plain"
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

        return {
            title: parsed.title || "Interview Report",
            matchScore: parsed.matchScore || 70,
            technicalQuestions: parsed.technicalQuestions || [],
            behavioralQuestions: parsed.behavioralQuestions || [],
            skillGaps: parsed.skillGaps || [],
            preparationPlan: parsed.preparationPlan || []
        };

    } catch (error) {
        console.error("generateInterviewReport Error:", error.message);
        return buildFallbackData();
    }
}

/* ---------------- PDF GENERATION ---------------- */
/* ---------------- PDF GENERATION ---------------- */
async function generatePdfFromHtml(htmlContent) {
    let browser;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

/* ---------------- RESUME PDF ---------------- */
async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {
    try {
        const prompt = `
You are a professional resume generator.

RULES:
- Return ONLY JSON
- Must contain "html"
- HTML must be ATS friendly
- Keep resume 1-2 pages max
- Make it human-like, not AI-like

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "text/plain"
            }
        });

        if (!response?.text) {
            throw new Error("Empty AI response");
        }

        const parsed = safeParse(response.text);

        if (!parsed?.html) {
            throw new Error("Invalid resume HTML from AI");
        }

        return await generatePdfFromHtml(parsed.html);

    } catch (error) {
        console.error("generateResumePdf Error:", error.message);
        throw new Error("Failed to generate resume PDF");
    }
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
};
