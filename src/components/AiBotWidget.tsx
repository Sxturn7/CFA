import React, { useState, useRef, useEffect } from "react";
import { UserProfile, Subject, ModuleProgress, ActivityLog, ModuleStatus } from "../types";
import { MessageSquare, X, Send, Sparkles, Brain, Bot, Zap, HelpCircle, BookOpen } from "lucide-react";
import { FLAT_MODULES } from "../curriculum";

interface AiBotWidgetProps {
  userProfile: UserProfile;
  subjects: Subject[];
  progress: Record<string, ModuleProgress>;
  activityLogs: ActivityLog[];
  activeTab: string;
  onUpdateProfile?: (updated: UserProfile) => void;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AiBotWidget({ userProfile, subjects, progress, activityLogs, activeTab, onUpdateProfile }: AiBotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `Hello Candidate **${userProfile.email.split("@")[0]}**! 👋 I am your interactive **CFA Level I study bot**. 

Ask me anything—whether it's explaining complex concepts (like *IFRS vs US GAAP adjustments*, *Lease Capitalization*, or *Duration*), reviewing formulas, or checking your prep metrics. 

How can I help you study right now?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Create user message
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Formulate curriculum metrics for stateful advice
    const completedCount = FLAT_MODULES.filter(m => progress[m.id]?.status === ModuleStatus.COMPLETED).length;
    const completedWithScores = FLAT_MODULES.filter(
      (m) => progress[m.id]?.status === ModuleStatus.COMPLETED && progress[m.id]?.quizScore !== null
    );
    const avgQuizScore =
      completedWithScores.length > 0
        ? Math.round(completedWithScores.reduce((acc, m) => acc + (progress[m.id].quizScore || 0), 0) / completedWithScores.length)
        : null;

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

    const payload = {
      email: userProfile.email,
      progressData: {
        dailyTargetHours: userProfile.dailyTargetHours,
        completedModulesCount: completedCount,
        avgQuizScore,
        weakSubjects
      },
      studyLogs: activityLogs,
      userQuestion: `[AI Bot Short Note Request] ${textToSend} (Context: Candidate is currently on the "${activeTab}" view of the CFA Study Prep app)`
    };

    try {
      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.advice) {
        setMessages(prev => [...prev, {
          sender: "bot",
          text: data.advice,
          timestamp: new Date()
        }]);
      } else {
        const errMsg = data.error || "Advising framework offline";
        const errDetails = data.details ? `\n\n*Technical Details:* ${data.details}` : "";
        setMessages(prev => [...prev, {
          sender: "bot",
          text: `⚠️ **Gemini Tutor Error:** ${errMsg}${errDetails}\n\n💡 **Troubleshooting Tip:** Make sure your **GEMINI_API_KEY** is correctly configured in **Settings > Secrets** (top right) in AI Studio.`,
          timestamp: new Date()
        }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: `📝 **Prep Engine Bot (Offline Mode):** \n\nCould not connect: ${err.message || err}. \n\nIf you want to unlock live intelligent chat, please make sure your **GEMINI_API_KEY** is set in **Settings > Secrets** in AI Studio!`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeShortcut = (label: string, prompt: string) => {
    handleSendMessage(prompt);
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

  const renderMessageContent = (text: string) => {
    const cleaned = cleanLatex(text);
    return cleaned.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-1" />;

      // Lists
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return (
          <div key={idx} className="pl-4 relative my-0.5 leading-relaxed text-xs text-slate-100">
            <span className="absolute left-1 text-slate-400">•</span>
            {formatBoldText(trimmed.substring(2))}
          </div>
        );
      }

      // Headers
      if (trimmed.startsWith("### ")) {
        return (
          <h5 key={idx} className="text-xs font-mono font-bold text-amber-300 mt-2 mb-1 uppercase">
            {trimmed.substring(4)}
          </h5>
        );
      }

      if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
        const titleText = trimmed.replace(/^#+\s/, "");
        return (
          <h4 key={idx} className="text-xs font-bold text-white mt-3 mb-1 border-b border-slate-800 pb-0.5">
            {titleText}
          </h4>
        );
      }

      return (
        <p key={idx} className="my-1.5 leading-relaxed text-xs text-slate-100">
          {formatBoldText(trimmed)}
        </p>
      );
    });
  };

  const formatBoldText = (str: string) => {
    const parts = str.split("**");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-amber-200 font-bold">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 1. Toggle Button */}
      <button
        id="ai-bot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-14 h-14 bg-[#5A6344] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#4a5137] active:scale-95 transition-all duration-300 border border-slate-700/50"
        title="Open AI Study Bot Assistant"
      >
        {isOpen ? (
          <X size={24} className="animate-pulse" />
        ) : (
          <>
            <Bot size={26} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
            </span>
          </>
        )}
      </button>

      {/* 2. Floating Chat Dialog */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-[360px] sm:w-[420px] max-h-[580px] h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn"
        >
          {/* Header Banner */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#5A6344]/25 border border-[#5A6344]/30 flex items-center justify-center text-[#5A6344]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  Gemini Tutor
                </h3>
                <span className="text-[10px] text-slate-400 block font-sans">Level I curriculum partner</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick study preset shortcuts */}
          <div className="bg-slate-900/60 px-3 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
            <span className="text-[9px] uppercase font-mono font-bold text-slate-450 mr-1 shrink-0">Shortcut Ask:</span>
            <button
              onClick={() => executeShortcut("Explain Topic", "Can you briefly explain the current topic of our syllabus in solid plain terms?")}
              className="px-2 py-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-slate-350 transition flex items-center gap-1 shrink-0"
            >
              <Brain size={11} className="text-[#5A6344]" /> Explain Topic
            </button>
            <button
              onClick={() => executeShortcut("Formula Hack", "Give me a quick formula review card about the DuPont analysis or Gordon Growth model.")}
              className="px-2 py-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-slate-350 transition flex items-center gap-1 shrink-0"
            >
              <Zap size={11} className="text-amber-500" /> Formula Cheat
            </button>
            <button
              onClick={() => executeShortcut("Ethics Rule", "Give me a fast study tip or memory shortcut for the CFA Institute Standards of Conduct (Ethics).")}
              className="px-2 py-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-slate-350 transition flex items-center gap-1 shrink-0"
            >
              <BookOpen size={11} className="text-emerald-500" /> Ethics Cheat
            </button>
          </div>

          {/* Messages stream pane */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
            {messages.map((m, index) => {
              const isBot = m.sender === "bot";
              return (
                <div key={index} className={`flex ${isBot ? "justify-start" : "justify-end"} items-start gap-2.5`}>
                  {isBot && (
                    <div className="w-6 h-6 rounded bg-[#5A6344]/10 border border-[#5A6344]/25 text-[#5A6344] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      C
                    </div>
                  )}
                  <div 
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm leading-relaxed ${
                      isBot 
                        ? "bg-slate-950 border border-slate-800/80 text-slate-50 rounded-tl-none font-sans" 
                        : "bg-[#5A6344] text-white rounded-tr-none font-medium"
                    }`}
                  >
                    {isBot ? (
                      <div className="space-y-1">{renderMessageContent(m.text)}</div>
                    ) : (
                      <p>{m.text}</p>
                    )}
                    <span 
                      className={`block text-[9px] mt-1 text-right  ${
                        isBot ? "text-slate-500 font-mono" : "text-white/60 font-medium"
                      }`}
                    >
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#5A6344]/10 border border-[#5A6344]/25 text-[#5A6344] flex items-center justify-center shrink-0 text-[10px] font-bold animate-spin">
                  C
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-tl-none px-4 py-2.5 flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A6344] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A6344] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A6344] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-slate-500 block font-mono">Tutor is compiling details...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* User inputs bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                handleSendMessage(input);
              }
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input 
              type="text"
              placeholder="Ask formula, rules, or query progress..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#5A6344] placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-[#5A6344] hover:bg-[#4a5137] text-white disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition shrink-0"
              title="Send advice request"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
