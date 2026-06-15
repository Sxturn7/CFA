import React, { useState } from "react";
import { Subject, ModuleStatus, ModuleProgress, LearningModule } from "../types";
import { Search, ChevronDown, ChevronRight, CheckCircle, BookOpen, Clock, FileText, Calendar, RotateCw } from "lucide-react";

interface ModuleListProps {
  subjects: Subject[];
  progress: Record<string, ModuleProgress>;
  onChangeModuleStatus: (moduleId: string, status: ModuleStatus) => void;
  onChangeModuleNotes: (moduleId: string, notes: string) => void;
  onRecordQuizScore: (moduleId: string, score: number) => void;
  onProgressRevisionCycle: (moduleId: string) => void;
}

export default function ModuleList({
  subjects,
  progress,
  onChangeModuleStatus,
  onChangeModuleNotes,
  onRecordQuizScore,
  onProgressRevisionCycle,
}: ModuleListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ModuleStatus>("all");
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    quant: true, // Expand quant by default
  });
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Score temp state to prevent complete rerenders
  const [tempScores, setTempScores] = useState<Record<string, string>>({});

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  const getStatusIcon = (status?: ModuleStatus) => {
    switch (status) {
      case ModuleStatus.COMPLETED:
        return <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />;
      case ModuleStatus.IN_PROGRESS:
        return <BookOpen className="text-blue-400 w-5 h-5 flex-shrink-0 animate-pulse" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex-shrink-0" />;
    }
  };

  const currentProgress = (moduleId: string): ModuleProgress => {
    return (
      progress[moduleId] || {
        status: ModuleStatus.NOT_STARTED,
        studyTimeMinutes: 0,
        quizScore: null,
        notes: "",
        lastStudiedAt: null,
        revisionCycle: 0,
      }
    );
  };

  // Filter modules based on search & status
  const matchesFilter = (mod: LearningModule, subjectId: string) => {
    const prog = currentProgress(mod.id);
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || prog.status === statusFilter;
    return matchesSearch && matchesStatus;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search all 93 learning modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-4 py-2 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-mono">Filter Status:</span>
          <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 w-full md:w-auto">
            {(["all", ModuleStatus.NOT_STARTED, ModuleStatus.IN_PROGRESS, ModuleStatus.COMPLETED] as const).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`text-[10px] uppercase font-semibold py-1 px-2.5 rounded-md transition ${
                    statusFilter === f
                      ? "bg-slate-800 text-slate-200 shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {f === "all" ? "All" : f.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Accordion list of subjects */}
      <div className="space-y-4">
        {subjects.map((subj) => {
          const matchingMods = subj.modules.filter((m) => matchesFilter(m, subj.id));
          if (matchingMods.length === 0 && searchTerm) return null; // hide empty search subject

          const isExpanded = expandedSubjects[subj.id];
          const completedCount = subj.modules.filter(
            (m) => progress[m.id]?.status === ModuleStatus.COMPLETED
          ).length;
          const progressPercent = Math.round((completedCount / subj.modules.length) * 100);

          return (
            <div
              key={subj.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all"
            >
              {/* Subject Banner Header */}
              <button
                type="button"
                onClick={() => toggleSubject(subj.id)}
                className="w-full text-left px-5 py-4 bg-slate-900 flex items-center justify-between hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="text-slate-400 w-5 h-5" /> : <ChevronRight className="text-slate-400 w-5 h-5" />}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                      {subj.name}
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        Weight: {subj.weight}
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {completedCount} of {subj.modules.length} modules complete ({progressPercent}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-36 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: `var(--${subj.id}-color, #38bdf8)`,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-mono font-bold px-2 py-1 rounded"
                    style={{
                      color: `var(--${subj.id}-color, #f8fafc)`,
                      backgroundColor: `#0f172a`,
                      border: `1.5px solid var(--${subj.id}-color, #334155)`,
                    }}
                  >
                    {progressPercent}%
                  </span>
                </div>
              </button>

              {/* Collapsed Modules listing */}
              {isExpanded && (
                <div className="border-t border-slate-800 p-3 bg-slate-950/20 divide-y divide-slate-800/80">
                  {matchingMods.map((mod) => {
                    const isModExpanded = expandedModuleId === mod.id;
                    const p = currentProgress(mod.id);

                    return (
                      <div
                        key={mod.id}
                        className={`transition-colors py-2 px-3 ${
                          isModExpanded ? "bg-slate-900/65 rounded-lg border border-slate-850" : ""
                        }`}
                      >
                        {/* List Row compact view */}
                        <div
                          onClick={() => setExpandedModuleId(isModExpanded ? null : mod.id)}
                          className="flex items-center justify-between cursor-pointer group hover:bg-slate-800/20 rounded py-1 px-1.5 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {getStatusIcon(p.status)}
                            <div className="min-w-0">
                              <span className="text-xs text-slate-400 font-mono pr-1.5">
                                Mod {mod.order}.
                              </span>
                              <span className="text-xs font-medium text-slate-200 group-hover:text-blue-400">
                                {mod.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Summary indicators */}
                            <span className="text-[10px] text-slate-500 font-mono hidden sm:flex items-center gap-1">
                              <Clock size={11} /> {p.studyTimeMinutes} min studied
                            </span>
                            {p.quizScore !== null && (
                              <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                                Quiz: {p.quizScore}%
                              </span>
                            )}
                            {p.revisionCycle > 0 && (
                              <span className="text-[10px] font-mono bg-amber-950/30 text-amber-500 border border-amber-900/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <RotateCw size={10} /> Cycle {p.revisionCycle}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expandable modules edit workspace */}
                        {isModExpanded && (
                          <div className="mt-4 pt-3 border-t border-slate-800 text-slate-300 text-xs grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                            {/* Status, Timers and cycle level */}
                            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                              <h5 className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 font-mono text-[10px] uppercase">
                                PROGRESS MANAGEMENT
                              </h5>

                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">Set Module Status</label>
                                <select
                                  value={p.status}
                                  onChange={(e) => onChangeModuleStatus(mod.id, e.target.value as ModuleStatus)}
                                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded outline-none focus:border-blue-500"
                                >
                                  <option value={ModuleStatus.NOT_STARTED}>Not Started</option>
                                  <option value={ModuleStatus.IN_PROGRESS}>In Progress</option>
                                  <option value={ModuleStatus.COMPLETED}>Completed</option>
                                </select>
                              </div>

                              <div className="pt-1">
                                {p.status !== ModuleStatus.COMPLETED ? (
                                  <button
                                    type="button"
                                    onClick={() => onChangeModuleStatus(mod.id, ModuleStatus.COMPLETED)}
                                    className="w-full bg-[#5A6344] hover:bg-[#484f36] text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow"
                                  >
                                    ✓ Mark as Completed
                                  </button>
                                ) : (
                                  <div className="py-2 px-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold">
                                    <CheckCircle size={14} /> Completed
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <RotateCw size={11} /> Spaced Repetition Block
                                  </label>
                                  <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-950/20 px-1.5 py-0.2 rounded border border-amber-900/60">
                                    Cycle {p.revisionCycle}/3
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onProgressRevisionCycle(mod.id)}
                                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs py-1.5 px-2 rounded font-semibold text-center mt-1"
                                >
                                  {p.revisionCycle >= 3 ? "Reset study chain" : "Confirm Revision Session"}
                                </button>
                              </div>
                            </div>

                            {/* Study Notes Workspace */}
                            <div className="md:col-span-2 space-y-2 flex flex-col">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                <h5 className="font-semibold text-slate-200 font-mono text-[10px] uppercase flex items-center gap-1">
                                  <FileText size={12} className="text-blue-400" /> Executive study notes
                                </h5>
                                <span className="text-[10px] text-slate-500 font-mono">Saves automatically</span>
                              </div>
                              <textarea
                                value={p.notes}
                                onChange={(e) => onChangeModuleNotes(mod.id, e.target.value)}
                                placeholder="Type or paste active learning equations, definitions, or notes here for fast lookup... Standard CFA formulas such as Gordon Growth, EAR, and Du Pont decomposition look beautiful written here!"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans flex-1 h-[140px] resize-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
