import React, { useState, useEffect } from "react";
import { UserProfile, Subject, ModuleProgress, ActivityLog, ModuleStatus } from "../types";
import { FLAT_MODULES } from "../curriculum";
import { Play, Pause, RotateCcw, Save, Calendar, Clock, BookOpen, AlertTriangle, CheckCircle, Settings, X, GraduationCap } from "lucide-react";
import GrowthTree from "./GrowthTree";

interface DashboardProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  subjects: Subject[];
  progress: Record<string, ModuleProgress>;
  activityLogs: ActivityLog[];
  onLogStudySession: (moduleId: string, durationMinutes: number, type: "study" | "quiz", score?: number) => void;
}

export default function Dashboard({
  userProfile,
  setUserProfile,
  subjects,
  progress,
  activityLogs,
  onLogStudySession
}: DashboardProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 1. Countdown calculations
  const calculateDaysRemaining = () => {
    const today = new Date();
    const examDate = new Date(userProfile.targetExamDate);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateDaysTotal = () => {
    const start = new Date(userProfile.studyStartDate);
    const end = new Date(userProfile.targetExamDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const daysRemaining = calculateDaysRemaining();
  const totalDays = calculateDaysTotal();
  const elapsedDays = Math.max(0, totalDays - daysRemaining);
  const timeProgressPct = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

  // 2. Studies Statistics
  const totalStudyMinutes = activityLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
  const totalStudyHrs = (totalStudyMinutes / 60).toFixed(1);

  // Daily calculations
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const dailyMinutes = activityLogs
    .filter(log => new Date(log.timestamp) >= todayStart)
    .reduce((sum, log) => sum + log.durationMinutes, 0);
  const dailyHrs = (dailyMinutes / 60).toFixed(1);
  const dailyHrsNum = parseFloat(dailyHrs);
  const dailyTargetVal = Math.max(0.5, userProfile.dailyTargetHours || 2);
  const dailyProgressPct = Math.min(
    100,
    (dailyHrsNum / dailyTargetVal) * 100
  );

  // Module completion stats
  const totalModules = 93;
  const completedModules = FLAT_MODULES.filter(
    (m) => progress[m.id]?.status === ModuleStatus.COMPLETED
  ).length;
  const inProgressModules = FLAT_MODULES.filter(
    (m) => progress[m.id]?.status === ModuleStatus.IN_PROGRESS
  ).length;
  const curriculumPercentage = Math.round((completedModules / totalModules) * 100);

  // Subject-level analysis
  const subjectScores = subjects.map(subj => {
    const mods = subj.modules;
    const completed = mods.filter(m => progress[m.id]?.status === ModuleStatus.COMPLETED);
    const scores = completed
      .map(m => progress[m.id]?.quizScore)
      .filter((s): s is number => s !== null);
    
    return {
      id: subj.id,
      name: subj.name,
      completed: completed.length,
      total: mods.length,
      avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      color: subj.color
    };
  });

  const weakSubjects = subjectScores.filter(s => s.avgScore !== null && s.avgScore < 70);

  // 3. Studying Stopwatch Timer State
  const [selectedModuleId, setSelectedModuleId] = useState(FLAT_MODULES[0]?.id || "");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [manualMinutes, setManualMinutes] = useState("30");
  const [loggedScore, setLoggedScore] = useState("");
  const [sessionType, setSessionType] = useState<"study" | "quiz">("study");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Dynamically sync active stopwatch duration to Minutes state
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      const minsVal = Math.round(timerSeconds / 60) || 1;
      setManualMinutes(minsVal.toString());
    }
  }, [timerSeconds, isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleSaveUnifiedSession = () => {
    const duration = parseInt(manualMinutes, 10);
    if (!duration || duration <= 0) {
      alert("Please enter a valid study duration in minutes.");
      return;
    }
    const parsedScore = loggedScore ? parseInt(loggedScore, 10) : undefined;
    onLogStudySession(selectedModuleId, duration, sessionType, parsedScore);
    
    // Clear & reset inputs safely, preserving default minutes block
    setManualMinutes("30");
    setLoggedScore("");
    resetTimer();
  };

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Title with Settings Button */}
      <div className="flex justify-between items-center bg-[#F9F8F0] border border-[#E5E2D0] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-[#5A6344]" size={28} />
          <div>
            <h2 className="text-lg font-serif font-bold text-[#4A3728] leading-none">CFA Level I Study Runway</h2>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Dynamic tracking and organic knowledge growth tree calibrated to your target exam date.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1.5 bg-white border border-[#D9D5C3] hover:bg-[#FDFCF8] text-[#4A3728] text-xs font-semibold px-3 py-2 rounded-lg transition"
        >
          <Settings size={14} className="text-[#7D7859] animate-spin-slow" />
          Plan Settings
        </button>
      </div>

      {/* 1. Upper Metrics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Countdown card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 text-slate-800 opacity-20 pointer-events-none">
            <Calendar size={120} />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">Exam Countdown</p>
          <h3 className="text-3xl font-extrabold text-[#4A3728] mt-2 font-sans tracking-tight">
            {daysRemaining} <span className="text-base font-medium text-slate-400">Days Left</span>
          </h3>
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
              <span>Time Elapsed: {elapsedDays} days</span>
              <span>{Math.round(timeProgressPct)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#5A6344] h-full rounded-full transition-all duration-700" 
                style={{ width: `${timeProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Study Hours Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 text-slate-800 opacity-20 pointer-events-none">
            <Clock size={120} />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">Total Duration</p>
          <h3 className="text-3xl font-extrabold text-[#4A3728] mt-2 font-sans tracking-tight">
            {totalStudyHrs} <span className="text-base font-medium text-slate-400">Hours</span>
          </h3>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Target rate: <strong className="text-[#5A6344] font-mono">{userProfile.dailyTargetHours} hrs/day</strong>
          </p>
        </div>

        {/* Daily study progression */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 text-slate-800 opacity-20 pointer-events-none">
            <CheckCircle size={120} />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">Today's Effort</p>
          <h3 className="text-3xl font-extrabold text-[#4A3728] mt-2 font-sans tracking-tight">
            {dailyHrs} / {userProfile.dailyTargetHours} <span className="text-xs text-slate-400 font-medium">hrs</span>
          </h3>
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
              <span>Daily Goal progress</span>
              <span>{Math.round(dailyProgressPct)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${dailyProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Curriculum Coverage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 text-slate-800 opacity-20 pointer-events-none">
            <BookOpen size={120} />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">L1 Syllabus coverage</p>
          <h3 className="text-3xl font-extrabold text-[#4A3728] mt-2 font-sans tracking-tight">
            {curriculumPercentage}% <span className="text-base font-normal text-slate-400">Completed</span>
          </h3>
          <p className="text-xs text-slate-500 mt-4 font-mono leading-relaxed">
            <span className="text-emerald-600 font-bold">{completedModules}</span> Done • <span className="text-amber-600 font-bold">{inProgressModules}</span> Active
          </p>
        </div>
      </div>

      {/* 2. Bento Grid: Compact Stopwatch and the Prominent Interactive Growth Tree (Visually Pleasing Place!) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Unified Interactive Study Logger - Occupies 1 column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#4A3728] flex items-center gap-2 mb-3.5 tracking-wider uppercase font-mono border-b border-slate-100 pb-2">
              ⏱️ study logger
            </h3>

            <div className="space-y-4">
              {/* CFA Curriculum Module */}
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1">
                  CFA Curriculum Module
                </label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full bg-white text-[#3D3B30] text-xs outline-none focus:border-[#5A6344] font-sans"
                >
                  {subjects.map((subj) => (
                    <optgroup key={subj.id} label={`${subj.name} (${subj.weight})`}>
                      {subj.modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          M{m.order}: {m.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Mode & Quiz Score Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1">
                    Study Mode
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setSessionType("study")}
                      className={`text-[10px] py-1 px-1 rounded-lg font-semibold transition ${
                        sessionType === "study"
                          ? "bg-[var(--theme-accent)] text-white"
                          : "bg-white text-slate-500 border border-[#D9D5C3]"
                      }`}
                    >
                      Read
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionType("quiz")}
                      className={`text-[10px] py-1 px-1 rounded-lg font-semibold transition ${
                        sessionType === "quiz"
                          ? "bg-[var(--theme-accent-rose)] text-white"
                          : "bg-white text-slate-500 border border-[#D9D5C3]"
                      }`}
                    >
                      Quiz
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1">
                    {sessionType === "quiz" ? "Quiz Score (%)" : "Score (%)"}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 80"
                    min="0"
                    max="100"
                    value={loggedScore}
                    onChange={(e) => setLoggedScore(e.target.value)}
                    className="w-full bg-white border border-[#D9D5C3] rounded-lg px-2 py-1 text-xs text-[#3D3B30] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Session Duration Selector and Quick Presets */}
              <div className="bg-[#F1EFE0]/40 p-3 rounded-xl border border-[#E5E2D0]/60 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">
                    Duration (Minutes)
                  </span>
                  {isTimerRunning && (
                    <span className="text-[9px] text-[#5A6344] font-mono animate-pulse flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                      Live: {formatTimer(timerSeconds)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Minutes"
                    min="1"
                    value={manualMinutes}
                    onChange={(e) => {
                      setManualMinutes(e.target.value);
                      if (isTimerRunning) {
                        setIsTimerRunning(false);
                      }
                    }}
                    className="w-20 bg-white border border-[#D9D5C3] rounded-lg px-2 py-1 text-xs text-[#3D3B30] font-mono outline-none"
                  />
                  
                  {/* Quick Preset Buttons */}
                  <div className="flex-1 grid grid-cols-4 gap-1">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => {
                          setManualMinutes(mins.toString());
                          if (isTimerRunning) {
                            setIsTimerRunning(false);
                          }
                        }}
                        className={`text-[10px] font-mono py-1 rounded-md border transition ${
                          manualMinutes === mins.toString()
                            ? "bg-[var(--theme-accent)]/10 border-[var(--theme-accent)] text-[var(--theme-accent)] font-bold"
                            : "bg-white border-[#D9D5C3] hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Built-in Stopwatch controls */}
                <div className="flex items-center justify-between border-t border-[#E5E2D0]/40 pt-2.5">
                  <span className="text-[9px] uppercase font-mono text-slate-400">Stopwatch Tracker</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleTimer}
                      className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded transition-all border-none ${
                        isTimerRunning
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      }`}
                    >
                      {isTimerRunning ? <Pause size={9} /> : <Play size={9} />}
                      {isTimerRunning ? "Stop" : "Live track"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetTimer}
                      className="bg-slate-100 hover:bg-slate-250 text-slate-500 p-1 rounded text-[9px] transition"
                      title="Reset Stopwatch"
                    >
                      <RotateCcw size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-150 pt-3 mt-3">
            <button
              type="button"
              onClick={handleSaveUnifiedSession}
              className="w-full bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white font-bold text-xs py-2.5 rounded-lg border-none shadow-sm flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
              <CheckCircle size={14} className="text-white" />
              Log Study Session
            </button>
          </div>
        </div>

        {/* Growth Tree - Occupies 2 columns (Visually stunning interactive epicenter) */}
        <div className="lg:col-span-2">
          <GrowthTree subjects={subjects} progress={progress} totalStudyTime={totalStudyMinutes} />
        </div>
      </div>

      {/* 3. Analytics on Weak Subjects & Logs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weak Areas Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm md:col-span-1">
          <h3 className="text-xs font-bold text-[#4A3728] flex items-center gap-2 mb-3.5 tracking-wider uppercase font-mono text-rose-500 border-b border-slate-100 pb-2">
            ⚠️ Attention Areas (&lt;70%)
          </h3>

          {weakSubjects.length === 0 ? (
            <div className="bg-emerald-55/40 border border-emerald-100 p-5 rounded-xl text-center text-emerald-800">
              <CheckCircle size={28} className="mx-auto mb-2 text-[#5A6344]" />
              <p className="text-xs font-semibold">Exemplary scores maintained!</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">No subject averages have slumped behind the 70% threshold yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
                The mock engine highlights subject collections with running review scores falling below average benchmarks:
              </p>
              {weakSubjects.map((s) => (
                <div key={s.id} className="bg-white border border-[#E5E2D0] p-3 rounded-lg flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-[#4A3728] font-bold block">{s.name}</span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {s.completed} of {s.total} complete
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#94625A] bg-rose-50 border border-rose-100 px-2 py-1 rounded">
                    {s.avgScore}% avg
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Logs history table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm md:col-span-2">
          <h3 className="text-xs font-bold text-[#4A3728] flex items-center gap-1.5 mb-3.5 tracking-wider uppercase font-mono border-b border-slate-100 pb-2">
            📝 session activity registers
          </h3>

          {activityLogs.length === 0 ? (
            <div className="p-8 text-center bg-[#FDFCF8] border border-[#E5E2D0] rounded-lg text-slate-400 font-mono text-xs">
              No sessions registered. Use the stopwatch or manual drawer to file data.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[220px] scrollbar-thin">
              <table className="w-full text-left text-xs text-[#3D3B30]">
                <thead className="bg-[#F1EFE0] text-slate-500 uppercase font-mono text-[9px]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Module Topic</th>
                    <th className="py-2.5 px-3">Spent</th>
                    <th className="py-2.5 px-3">Logged Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {activityLogs.slice(0, 8).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-100/50">
                      <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-mono font-bold uppercase" style={{ color: `var(--${log.subjectId}-color)` }}>
                          {log.subjectName}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#4A3728] font-medium max-w-[200px] truncate">
                        {log.moduleName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{log.durationMinutes}m</td>
                      <td className="py-2.5 px-3 font-mono">
                        {log.score !== undefined ? (
                          <span className={`font-semibold ${log.score >= 70 ? "text-[#5A6344]" : "text-[#94625A]"}`}>
                            {log.score}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Floating Settings Modal Triggered from Title Header - Changes ONLY allowed here! */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E5E2D0] rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fadeIn space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-serif font-bold text-[#4A3728] flex items-center gap-1.5">
                ⚙️ Adjust Syllabus Runway Goals
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-450 hover:text-slate-700 bg-slate-100 p-1 rounded-full text-xs"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1">
                  Candidate Email
                </label>
                <input
                  type="email"
                  disabled
                  value={userProfile.email}
                  className="w-full bg-[#F9F8F0] border border-[#D9D5C3] text-slate-400 text-xs px-3 py-2 rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1">
                  Planned Daily Study Goal Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={userProfile.dailyTargetHours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 2;
                    setUserProfile({ ...userProfile, dailyTargetHours: val });
                    localStorage.setItem(`cfa_profile_${userProfile.email}`, JSON.stringify({
                      ...userProfile,
                      dailyTargetHours: val
                    }));
                  }}
                  className="w-full bg-white border border-[#D9D5C3] text-sm px-3 py-2 rounded-lg font-mono outline-none focus:border-[#5A6344]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 mb-1">
                  CFA Target Exam Date
                </label>
                <input
                  type="date"
                  value={userProfile.targetExamDate}
                  onChange={(e) => {
                    const chosen = e.target.value;
                    setUserProfile({ ...userProfile, targetExamDate: chosen });
                    // Also store inside local storage to match persistence constraints
                    localStorage.setItem(`cfa_profile_${userProfile.email}`, JSON.stringify({
                      ...userProfile,
                      targetExamDate: chosen
                    }));
                  }}
                  className="w-full bg-white border border-[#D9D5C3] text-[#3D3B30] text-sm px-3 py-2 rounded-lg font-mono outline-none focus:border-[#5A6344]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  // Trigger alert confirmation
                }}
                className="bg-[#5A6344] hover:bg-[#4a5137] text-white text-xs font-bold px-4 py-2 rounded-lg transition border-none shadow-sm"
              >
                Save & Lock Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
