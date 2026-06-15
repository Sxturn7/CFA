import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Study Advisor
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const { progressData, studyLogs, userQuestion, email } = req.body;

      const systemPrompt = `You are an elite, professional Chartered Financial Analyst (CFA®) study mentor and curriculum analyst assisting candidates preparing for the CFA Level I exam.
Your advice must be precise, highly technical but educational, warm, and structured. 
Acknowledge the candidate by their email prefix if appropriate, and maintain a focus on exam strategies, weights, and standard CFA formulas.
Use clean Markdown with bolding, bullet points, and concise study actions.

CRITICAL FORMATTING INSTRUCTIONS:
- Do NOT use raw LaTeX, mathematical formatting symbols, or LaTeX syntax structures anywhere (e.g. do NOT write $$, $, \\frac, \\times, \\Delta, \\ge, \\le, or \\mu).
- Write all mathematical, financial, or valuation formulas in plain-text keyboard style (e.g. write "P_0 = D_1 / (r - g)" instead of standard LaTeX, or "Approx. Mod. Duration = (V_minus - V_plus) / (2 * V_0 * Delta_y)").
- Use normal text operators like "and", "or", ">=", "<=", or "*" instead of escaping mathematical symbols.`;

      const curriculumContext = `
The CFA Level I exam values 10 subjects. High-weight areas include Ethics (15-20%), FSA (11-14%), Fixed Income (11-14%), and Equity Investments (11-14%).
Candidate email: ${email || "Guest Student"}
Daily Study Target: ${progressData?.dailyTargetHours || 2} hours.
Modules completed: ${progressData?.completedModulesCount || 0} / 93 modules.
Average Quiz Score: ${progressData?.avgQuizScore ? progressData.avgQuizScore + '%' : 'No quizzes completed yet'}.
Subjects needing attention (score < 70%): ${progressData?.weakSubjects?.join(", ") || "None yet"}.
Recent Study Activities: ${studyLogs?.slice(0, 5).map((l: any) => `${l.moduleName} (${l.durationMinutes} mins, score: ${l.score ?? 'N/A'})`).join("; ") || "None logged yet"}.
`;

      const prompt = `
Candidate Context:
${curriculumContext}

Candidate's current message/request:
"${userQuestion || "Can you analyze my study habits and formulate a path forward based on my weights?"}"

Provide a detailed, encouraging, and actionable response outlining standard Level I principles (e.g. emphasize Ethics standard practices, the FSA inventory valuation impact on current ratios, or Fixed Income yield curves) to keep them on track towards their targets. Keep response within 350-500 words.`;

      // Gracefully check key presence for Gemini option
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("MY_GEMINI_API_KEY")) {
        return res.json({
          advice: "📝 **Note from CFA Prep Engine:** Currently running Gemini in simulation mode (offline). \n\n" +
            `Hello candidate **${email || "Guest"}**! To fully unlock your personal AI-powered Analyst study guidance, go to **Settings > Secrets** in AI Studio and configure your real **GEMINI_API_KEY**.\n\n` +
            "💡 **Study Tracker Insights (simulated):** Based on your logged progress, you should prioritize completing modules in **Financial Statement Analysis (FSA)** and **Fixed Income** to maximize index weights! Ensure your daily target study hours are consistent to allow the visual Growth Tree to mature.",
          isSimulated: true
        });
      }

      const client = getGeminiClient();

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return res.json({
        advice: response.text || "Your AI Advisor is crafting feedback...",
        isSimulated: false
      });
    } catch (err: any) {
      console.error("AI Advisor API error:", err);
      return res.status(500).json({
        error: "Advising system experienced a temporary interruption.",
        details: err.message
      });
    }
  });

  // API Route: Dynamic Quiz Question Generator
  app.post("/api/gemini/quiz", async (req, res) => {
    try {
      const { subjectId, difficulty } = req.body;

      const subjectNameMap: Record<string, string> = {
        quant: "Quantitative Methods",
        econ: "Economics",
        portfolio: "Portfolio Management",
        corporate: "Corporate Issuers",
        fsa: "Financial Statement Analysis (FSA)",
        equity: "Equity Investments",
        fixed: "Fixed Income",
        derivatives: "Derivatives",
        alt: "Alternative Investments",
        ethics: "Ethical and Professional Standards"
      };

      const subjectName = subjectNameMap[subjectId] || "CFA Level I mixed curriculum";

      const prompt = `Generate a high-quality, professional CFA® Level I multiple-choice practice question for the subject: "${subjectName}".
The question MUST target the difficulty level: "${difficulty || "medium"}".

Follow these difficulty specifications strictly:
- "easy": Straightforward concept definition or direct memory check.
- "medium": Basic application, minor formula calculation, or simple interpretation.
- "hard": Realistic exam vignette, multi-step calculation, or standard tricky conceptual scenarios.
- "expert": Obscure curriculum exception, intricate analysis of standards, or deep formula reasoning.
- "superhuman": Masterclass quantitative problem requiring multi-layered calculations, extensive financial formulas, or high logical deduction.

CRITICAL FORMATTING INSTRUCTIONS:
- Do NOT use raw LaTeX, mathematical formula syntax, or LaTeX symbols anywhere (e.g., do NOT write $$, $, \\frac, \\times, \\Delta, \\ge, \\le).
- Write all formulas or math elements in clean keyboard style (e.g., write "P_0 = D_1 / (r - g)" or "Approx. Mod. Duration = (V_minus - V_plus) / (2 * V_0 * Delta_y)" instead of standard LaTeX).
- Return standard characters like ">=", "<=", or "*" instead of special escaping backslashes.

Keep the text question, options, and explanation highly professional but concise. Keep instructions direct to make response delivery lightning-fast.
Return your response in strict JSON format. Do NOT wrap it in Markdown code blocks. Do not add any backticks. Output only the pure JSON matching this structure:
{
  "id": "generated-\${subjectId}-\${Date.now()}",
  "subjectId": "\${subjectId}",
  "moduleId": "gen-\${subjectId}",
  "question": "The question statement here...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0, // 0, 1, 2, or 3
  "explanation": "Clear, direct, and concise explanation of why this option is correct and others are wrong."
}`;

      // Check key presence for Gemini
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("MY_GEMINI_API_KEY")) {
        return res.json({ isSimulated: true });
      }

      const client = getGeminiClient();

      const response = await client.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.75,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from model");
      }

      const questionData = JSON.parse(text.trim());
      return res.json({
        question: questionData,
        isSimulated: false
      });
    } catch (err: any) {
      console.error("Quiz API error:", err);
      // Return simulated: true so client falls back beautifully
      return res.json({ isSimulated: true, error: err.message });
    }
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CFA Study Prep server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
