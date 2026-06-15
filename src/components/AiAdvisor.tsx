import React, { useState } from "react";
import { UserProfile, Subject, ModuleProgress, ActivityLog, ModuleStatus } from "../types";
import { FLAT_MODULES } from "../curriculum";
import { Send, Sparkles, BookOpen, Brain, ShieldAlert, Award, AlertCircle } from "lucide-react";

interface AiAdvisorProps {
  userProfile: UserProfile;
  subjects: Subject[];
  progress: Record<string, ModuleProgress>;
  activityLogs: ActivityLog[];
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function AiAdvisor({ userProfile, subjects, progress, activityLogs, onUpdateProfile }: AiAdvisorProps) {
  const [userQuestion, setUserQuestion] = useState("");
  const [adviceResponse, setAdviceResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  // Ready stats for payload
  const completedCount = FLAT_MODULES.filter(m => progress[m.id]?.status === ModuleStatus.COMPLETED).length;
  
  const completedWithScores = FLAT_MODULES.filter(
    (m) => progress[m.id]?.status === ModuleStatus.COMPLETED && progress[m.id]?.quizScore !== null
  );
  const avgQuizScore =
    completedWithScores.length > 0
      ? Math.round(completedWithScores.reduce((acc, m) => acc + (progress[m.id].quizScore || 0), 0) / completedWithScores.length)
      : null;

  // Weak area tags
  const weakSubjects = subjects
    .map(subj => {
      const scores = subj.modules
        .filter(m => progress[m.id]?.status === ModuleStatus.COMPLETED && progress[m.id]?.quizScore !== null)
        .map(m => progress[m.id]?.quizScore as number);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
      return { name: subj.name, avg };
    })
    .filter(subj => subj.avg !== null && subj.avg < 70)
    .map(subj => subj.name);

  // Preset query list
  const presets = [
    { label: "Analyze study habits & path forward", val: "Please analyze my curriculum progress and logs, and propose a study route." },
    { label: "Explain Gordon Growth Model", val: "Can you provide an intuitive explanation of the Gordon Growth Model with an example?" },
    { label: "Mastering FSA Inventories", val: "What are the core differences between LIFO and FIFO valuation methods under IFRS vs. US GAAP?" },
    { label: "Ethics Guidance tips (Standards I-VII)", val: "Give me key study strategies to pass the Ethical and Professional Standards topic with high marks." }
  ];

  const handleAskAdvisor = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsLoading(true);
    setAdviceResponse(null);

    const payload = {
      email: userProfile.email,
      progressData: {
        dailyTargetHours: userProfile.dailyTargetHours,
        completedModulesCount: completedCount,
        avgQuizScore,
        weakSubjects
      },
      studyLogs: activityLogs,
      userQuestion: questionText
    };

    try {
      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok) {
        setAdviceResponse(data.advice);
        setIsSimulated(!!data.isSimulated);
      } else {
        setAdviceResponse(
          `⚠️ **AI Advisor Error Details:** ${data.error || "The server could not process the request."}\n\n` +
          `*Technical Details:* ${data.details || "None reported."}\n\n` +
          `💡 **Action:** Please make sure your **GEMINI_API_KEY** is added to **Settings > Secrets** (top right) in AI Studio.`
        );
        setIsSimulated(true);
      }
    } catch (err: any) {
      console.error(err);
      setAdviceResponse(
        `📝 **Note from CFA Prep Engine:** Network or connection issue.\n\n` +
        `Could not retrieve response from server. If you configured your **GEMINI_API_KEY** in **Settings > Secrets**, please check your network or token legitimacy.\n\n` +
        `*Connection Error:* ${err.message || err}`
      );
      setIsSimulated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanLatex = (txt: string): string => {
    if (!txt) return "";
    let clean = txt;

    // 1. Replace fractions \frac{num}{den} with (num) / (den)
    const fracRegex = /\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/g;
    while (clean.match(fracRegex)) {
      clean = clean.replace(fracRegex, "($1) / ($2)");
    }

    // 2. Remove \text{...} wrappers keeping the inner content
    clean = clean.replace(/\\text\s*\{([^}]+)\}/g, "$1");

    // 3. Replace common LaTeX math symbols with readable plain-text equivalents
    clean = clean.replace(/\\times/g, " * ");
    clean = clean.replace(/\\div/g, " / ");
    clean = clean.replace(/\\ge/g, " >= ");
    clean = clean.replace(/\\le/g, " <= ");
    clean = clean.replace(/\\Delta/g, "Delta");
    clean = clean.replace(/\\alpha/g, "alpha");
    clean = clean.replace(/\\beta/g, "beta");
    clean = clean.replace(/\\sigma/g, "sigma");
    clean = clean.replace(/\\mu/g, "mu");
    clean = clean.replace(/\\approx/g, " ≈ ");
    clean = clean.replace(/\\cdot/g, " • ");
    clean = clean.replace(/\\pm/g, " ± ");
    
    // 4. Remove leftover escape backslashes
    clean = clean.replace(/\\([\{\}_^])/g, "$1");

    // 5. Demolish dollar sign blocks
    clean = clean.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, "$1");
    clean = clean.replace(/\$\s*([\s\S]*?)\s*\$/g, "$1");

    return clean;
  };

  // Basic custom formatter to render Markdown nicely
  const renderFormattedMarkdown = (text: string) => {
    const cleaned = cleanLatex(text);
    return cleaned.split("\n").map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Match bullets
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        let content = trimmed.substring(2);
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-slate-100 my-1 leading-relaxed">
            {formatBoldText(content)}
          </li>
        );
      }

      // Match numbered points
      if (/^\d+\.\s/.test(trimmed)) {
        const dotIndex = trimmed.indexOf(".");
        const content = trimmed.substring(dotIndex + 1).trim();
        return (
          <li key={idx} className="ml-5 list-decimal text-sm text-slate-100 my-1 leading-relaxed">
            {formatBoldText(content)}
          </li>
        );
      }

      // Check header matches
      if (trimmed.startsWith("### ")) {
        return (
          <h5 key={idx} className="text-xs font-mono font-bold text-amber-300 mt-4 mb-2 uppercase tracking-wide">
            {trimmed.substring(4)}
          </h5>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-100 mt-5 border-b border-slate-700 pb-1.5 mb-2">
            {trimmed.substring(3)}
          </h4>
        );
      }

      return (
        <p key={idx} className="text-[13px] text-slate-200 mb-2.5 leading-relaxed">
          {formatBoldText(trimmed)}
        </p>
      );
    });
  };

  const formatBoldText = (str: string) => {
    // splits by **
    const parts = str.split("**");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-amber-200 font-semibold">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
      {/* background glow effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#5A6344]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles size={18} className="text-[#5A6344]" /> Executive AI Study Advisor
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Query standard formulas, study models, accounting methods, or get personalized progress diagnostics.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono bg-slate-950 text-[#A3B18A] px-3 py-1.5 rounded-lg border border-slate-800 font-extrabold shadow-inner">
          ✦ Gemini 3.5 Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preset list & prompt */}
        <div className="space-y-4 lg:col-span-1">
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase font-mono mb-2">
              Advisor Prompts
            </span>
            <div className="space-y-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUserQuestion(p.val);
                    handleAskAdvisor(p.val);
                  }}
                  className="w-full text-left bg-slate-800 border border-slate-800/80 hover:bg-slate-850 text-slate-300 text-xs p-3 rounded-lg hover:border-[#5A6344]/50 transition flex items-start gap-2.5 leading-relaxed"
                >
                  <Brain size={14} className="text-[#5A6344] flex-shrink-0 mt-0.5" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAdvisor(userQuestion);
            }}
            className="border-t border-slate-800 pt-4"
          >
            <label className="block text-[11px] font-semibold text-slate-500 uppercase font-mono mb-2">
              Custom Advisory Query
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask e.g. What is the DuPont equation Formula?"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="flex-1 bg-white border border-[#D9D5C3] rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#5A6344] font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !userQuestion.trim()}
                className="bg-[#5A6344] hover:bg-[#4a5137] disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>

        {/* Responses window pane */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800/80 shadow-inner flex flex-col justify-between min-h-[320px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 space-y-3 py-12">
              <div className="w-8 h-8 rounded-full border-2 border-[#5A6344]/30 border-t-[#5A6344] animate-spin" />
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-100 block font-mono">
                  Loading Advice...
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  CFA Tutor engine parsing curriculum weights & scores
                </span>
              </div>
            </div>
          ) : adviceResponse ? (
            <div className="flex-1 flex flex-col justify-between">
              <div className="scrollbar-thin max-h-[360px] overflow-y-auto pr-2">
                {renderFormattedMarkdown(adviceResponse)}
              </div>

              {isSimulated && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-rose-300 bg-rose-950/20 p-2.5 rounded border border-rose-900/35">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  <div>
                    Currently running with offline study benchmarks. Configure your <strong>GEMINI_API_KEY</strong> secrets key in order to connect your custom live interactive study tutor!
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
              <Sparkles size={32} className="text-[#A3B18A] mx-auto animate-pulse" />
              <p className="text-xs font-mono text-[#A3B18A] font-bold">My CFA Level I AI study advisor is ready.</p>
              <p className="text-[11px] max-w-sm text-slate-300">
                Choose an expert prompt preset on the left or write your own study query to formulate curriculum plans and explain formulaic structures.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
