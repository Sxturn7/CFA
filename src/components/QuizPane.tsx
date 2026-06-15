import React, { useState, useEffect } from "react";
import { Subject, ModuleProgress } from "../types";
import { Question } from "../curriculum";
import { getProceduralQuestion } from "../utils/proceduralQuiz";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, HelpCircle, BookMarked, Award, ChevronRight, Zap, ArrowUp, ArrowDown } from "lucide-react";

interface QuizPaneProps {
  subjects: Subject[];
  progress: Record<string, ModuleProgress>;
  onRecordQuizScore: (moduleId: string, score: number) => void;
}

const DIFFICULTIES = ["easy", "medium", "hard", "expert", "superhuman"] as const;
type Difficulty = typeof DIFFICULTIES[number];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy (Fundamentals)",
  medium: "Medium (Conceptual AP)",
  hard: "Hard (Exam Vignette)",
  expert: "Expert (Curriculum Traps)",
  superhuman: "Superhuman (Quantitative Master)"
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-emerald-50 text-[#5A6344] border-emerald-200",
  medium: "bg-blue-50 text-[#5A6344] border-blue-200",
  hard: "bg-amber-50 text-[#7D7859] border-amber-200",
  expert: "bg-orange-50 text-[#94625A] border-orange-200",
  superhuman: "bg-rose-50 text-[#94625A] border-rose-300 animate-pulse"
};

export default function QuizPane({ subjects, progress, onRecordQuizScore }: QuizPaneProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  // Selection states
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  
  // Quiz progress stats
  const [streak, setStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  
  // System states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUsingAi, setIsUsingAi] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [errorLog, setErrorLog] = useState<string | null>(null);
 
  // Load a question immediately upon choosing/starting
  const fetchQuestion = async (subjId: string, diff: Difficulty) => {
    setIsLoading(true);
    setErrorLog(null);
    setSelectedAnswer(null);
    setAnswered(false);
 
    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId: subjId, difficulty: diff })
      });

      if (!response.ok) {
        throw new Error("Failed to contact quiz generator backend");
      }

      const data = await response.json();

      if (data.isSimulated || !data.question) {
        // Fallback to high-quality local procedural question
        const fallbackQuest = getProceduralQuestion(subjId, diff);
        setCurrentQuestion(fallbackQuest);
        setIsUsingAi(false);
      } else {
        // Successful real-time Gemini question
        setCurrentQuestion(data.question);
        setIsUsingAi(true);
      }
    } catch (err: any) {
      console.warn("Quiz API issue, triggering fallback generator:", err);
      const fallbackQuest = getProceduralQuestion(subjId, diff);
      setCurrentQuestion(fallbackQuest);
      setIsUsingAi(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger initial question on first load
  useEffect(() => {
    fetchQuestion(selectedSubjectId, difficulty);
  }, []);

  const handleSelectAnswer = (optionIdx: number) => {
    if (answered || isLoading) return;
    setSelectedAnswer(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.correctAnswerIndex;
    setIsCorrect(correct);
    setAnswered(true);

    // Update running counts
    setTotalAnswered(prev => prev + 1);
    if (correct) {
      setTotalCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Log the score back to curriculum modules! (This makes sure the curriculum progress state is reactive)
    const scoreVal = correct ? 100 : 0;
    // We update module average scores in root
    onRecordQuizScore(currentQuestion.moduleId, scoreVal);
  };

  // Adjust difficulty and fetch next
  const handleDifficultyAdjust = (direction: "up" | "down") => {
    const currentIdx = DIFFICULTIES.indexOf(difficulty);
    let nextIdx = currentIdx;

    if (direction === "up" && currentIdx < DIFFICULTIES.length - 1) {
      nextIdx = currentIdx + 1;
    } else if (direction === "down" && currentIdx > 0) {
      nextIdx = currentIdx - 1;
    }

    const nextDiff = DIFFICULTIES[nextIdx];
    setDifficulty(nextDiff);
    fetchQuestion(selectedSubjectId, nextDiff);
  };

  const handleNextQuestion = () => {
    fetchQuestion(selectedSubjectId, difficulty);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quiz Top Control Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#4A3728] flex items-center gap-2">
              🧠 Continuous AI Practice Center
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select any topic collection to prompt infinite, dynamically simulated or live AI-generated assessment vignettes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-3 py-1 font-mono rounded-full border ${DIFFICULTY_COLORS[difficulty]}`}>
              {DIFFICULTY_LABELS[difficulty]}
            </span>
            <span className="text-xs bg-white border border-[#E5E2D0] text-[#4A3728] font-mono px-2.5 py-1 rounded-full">
              {isUsingAi ? "✨ Live Gemini Generated" : "🌱 Dynamic Procedural"}
            </span>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/50 p-4 rounded-xl border border-[#E5E2D0]">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1.5">
              Target Curriculum Topic
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                fetchQuestion(e.target.value, difficulty);
              }}
              className="w-full bg-white text-[#3D3B30] text-xs font-mono font-medium outline-none"
            >
              <option value="all">Mixed Levels (Comprehensive Review)</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.weight})
                </option>
              ))}
            </select>
          </div>

          {/* Micro Stats Grid */}
          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-[#E5E2D0] pt-3 sm:pt-0 sm:pl-6">
            <div className="text-center px-2">
              <span className="block text-lg font-mono font-bold text-[#4A3728]">{accuracy}%</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Accuracy</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-lg font-mono font-bold text-[#5A6344]">{streak}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Streak 🔥</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-lg font-mono font-bold text-slate-600">{totalAnswered}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Active Question panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2 relative min-h-[400px] flex flex-col justify-between">
          
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-16">
              <RefreshCw size={36} className="text-[#5A6344] animate-spin" />
              <p className="text-xs text-[#7D7859] font-mono animate-pulse">
                Assembling curriculum vignette & formulating correct ratios...
              </p>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Meta Row */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono border-b border-slate-100 pb-3 mb-4">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Topic: {subjects.find(s => s.id === currentQuestion.subjectId)?.name || "Mixed Levels"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(currentQuestion.id)}
                    className="flex items-center gap-1.5 hover:text-amber-600 font-sans transition"
                  >
                    <BookMarked size={14} className={bookmarkedIds.includes(currentQuestion.id) ? "text-amber-500 fill-amber-500" : "text-slate-450"} />
                    <span className="text-[10px]">{bookmarkedIds.includes(currentQuestion.id) ? "Flagged" : "Flag Question"}</span>
                  </button>
                </div>

                {/* Vignette Statement */}
                <div className="bg-[#FDFCF8] border border-[#E5E2D0] p-5 rounded-xl text-sm leading-relaxed text-[#4A3728] font-serif mb-5 shadow-inner">
                  <HelpCircle size={16} className="inline text-[#5A6344] mr-2 -mt-1.5" />
                  {currentQuestion.question}
                </div>

                {/* Question Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isOptSelected = selectedAnswer === oIdx;
                    const isCorr = oIdx === currentQuestion.correctAnswerIndex;
                    const wasThisChosen = answered && isOptSelected;

                    // Option color scheme variables
                    let optionStyles = "bg-white border-[#D9D5C3] hover:bg-[#FDFCF8] text-[#3D3B30]";
                    if (isOptSelected && !answered) {
                      optionStyles = "bg-[#F1EFE0] border-[#5A6344] text-[#4A3728] ring-1 ring-[#5A6344]/10";
                    } else if (answered) {
                      if (isCorr) {
                        optionStyles = "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold ring-1 ring-emerald-500/25";
                      } else if (wasThisChosen) {
                        optionStyles = "bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500/30";
                      } else {
                        optionStyles = "bg-slate-50/50 border-[#E5E2D0]/50 text-slate-400 opacity-60 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={answered}
                        onClick={() => handleSelectAnswer(oIdx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition duration-150 flex justify-between items-center ${optionStyles}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">
                            {["A", "B", "C", "D"][oIdx]}.
                          </span>
                          <span>{opt}</span>
                        </span>

                        {answered && isCorr && <CheckCircle2 className="text-emerald-600 w-4 h-4 shrink-0" />}
                        {answered && wasThisChosen && !isCorr && <XCircle className="text-red-500 w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action operations bar */}
              <div className="flex items-center justify-between border-t border-[#E5E2D0] pt-4 mt-6">
                <div className="text-[10px] text-slate-400 font-mono">
                  {answered ? (
                    isCorrect ? (
                      <span className="text-[#5A6344] font-bold">✨ Correct! +100xp logged.</span>
                    ) : (
                      <span className="text-[#94625A] font-bold">❌ Incorrect. Review analysis below.</span>
                    )
                  ) : (
                    <span>⚠️ Select an option above to submit.</span>
                  )}
                </div>

                {!answered ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-[#5A6344] hover:bg-[#4a5137] text-white disabled:bg-slate-205 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed text-xs font-bold px-6 py-2.5 rounded-xl tracking-wider uppercase transition active:scale-95 border-none shadow-sm"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="bg-[#5A6344] hover:bg-[#4a5137] text-white text-xs font-bold px-6 py-2.5 rounded-xl tracking-wider uppercase transition flex items-center gap-1"
                  >
                    Next Question <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="text-amber-500 w-8 h-8 mb-2 animate-bounce" />
              <p className="text-xs text-slate-500">Failed to load active study card.</p>
              <button onClick={handleNextQuestion} className="mt-4 bg-[#5A6344] text-white text-xs px-4 py-2 rounded-xl">
                Reset & Retry
              </button>
            </div>
          )}

        </div>

        {/* Right column: Explanations AND Difficulty Controllers */}
        <div className="space-y-4">
          
          {/* Real-time Adaptive controllers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-[#4A3728] uppercase font-mono tracking-wider mb-2.5 flex items-center gap-1.5">
              <Zap size={14} className="text-slate-500" />
              Cognitive Adapter Controls
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Feeling the pressure too low, or getting stumped? Shift the quantitative cognitive weight instantly:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDifficultyAdjust("down")}
                disabled={difficulty === "easy" || isLoading}
                className="flex items-center justify-center gap-1.5 bg-[#FDFCF8] hover:bg-[#F1EFE0] disabled:opacity-40 disabled:hover:bg-[#FDFCF8] disabled:cursor-not-allowed text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#D9D5C3] text-slate-700 transition"
                title="Shift to simpler core formulations"
              >
                <ArrowDown size={14} className="text-[#7D7859]" />
                Go Easier
              </button>
              <button
                type="button"
                onClick={() => handleDifficultyAdjust("up")}
                disabled={difficulty === "superhuman" || isLoading}
                className="flex items-center justify-center gap-1.5 bg-[#5A6344]/10 hover:bg-[#5A6344]/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold px-3 py-2.5 rounded-xl border border-[#5A6344]/20 text-[#4A3728] transition"
                title="Shift to complex vignettes and obscure exceptions"
              >
                <ArrowUp size={14} className="text-[#5A6344]" />
                Go Harder ⚡
              </button>
            </div>

            <div className="text-[10px] text-slate-400 mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span>Current Scale:</span>
              <span className="font-mono text-[#5A6344] font-bold">{difficulty.toUpperCase()}</span>
            </div>
          </div>

          {/* Active Question Explanatory breakdown */}
          {answered && currentQuestion && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm animate-fadeIn max-h-[340px] overflow-y-auto scrollbar-thin">
              <div className="text-xs font-bold text-[#5A6344] uppercase font-mono tracking-wider mb-2.5 flex items-center gap-1 border-b border-slate-100 pb-2">
                <AlertCircle size={13} className="text-[#5A6344]" />
                CFA Analysis & Explanations
              </div>
              <p className="text-xs text-[#3D3B30] leading-relaxed whitespace-pre-line font-sans">
                {currentQuestion.explanation}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
                Citing Module ID: {currentQuestion.moduleId.toUpperCase()}
              </div>
            </div>
          )}

          {/* Instruction helper */}
          {!answered && (
            <div className="bg-slate-900 border border-[#E5E2D0] rounded-2xl p-5 text-center text-xs text-slate-500 py-8 shadow-sm">
              <Award size={28} className="mx-auto mb-2 text-[#7D7859] opacity-75" />
              <p className="font-medium text-[#4A3728]">Ready to validate?</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
                Carefully retrieve necessary formulas, select the appropriate option A, B, C, or D, and evaluate accuracy.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
