import React from "react";
import { X, Calendar, Sparkles, BookOpen, Clock, CheckCircle } from "lucide-react";

interface RevisionReminderModalProps {
  isOpen: boolean;
  moduleName: string;
  onClose: () => void;
  onScheduleRevision: () => void;
}

export default function RevisionReminderModal({
  isOpen,
  moduleName,
  onClose,
  onScheduleRevision,
}: RevisionReminderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Banner header decoration */}
        <div className="h-2 bg-[#5A6344]" />
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <X size={16} />
        </button>

        <div className="p-6 space-y-5">
          {/* Banner Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5A6344]/20 border border-[#5A6344]/40 flex items-center justify-center text-xl">
              🌿
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-wider">
                Reading Mastery Spurred
              </span>
              <h3 className="text-base font-bold text-slate-100 font-serif">
                Schedule Spaced Repetition Revision
              </h3>
            </div>
          </div>

          {/* Module description */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">COMPLETED TARGET</span>
            <p className="text-xs font-semibold text-slate-200">
              {moduleName}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Congratulations! This module has been marked complete. To cement these formulas, definitions, and theories, let's secure them via <strong>Spaced repetition</strong>.
            </p>
          </div>

          {/* Schedule description */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wide">
              Level I Optimized Study Chain
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-start gap-2.5 p-2 bg-slate-950/20 rounded border border-slate-850/60">
                <div className="text-xs font-mono bg-[#5A6344]/30 text-[#8E9B64] font-bold px-1.5 py-0.5 rounded mt-0.5">
                  1d
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-slate-300">Cycle 1: Active Recall</h5>
                  <p className="text-[10px] text-slate-500">Fast review of qualitative definitions & core equations.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-slate-950/20 rounded border border-slate-850/60">
                <div className="text-xs font-mono bg-[#5A6344]/30 text-[#8E9B64] font-bold px-1.5 py-0.5 rounded mt-0.5">
                  7d
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-slate-300">Cycle 2: Practice Drill</h5>
                  <p className="text-[10px] text-slate-500">Runway concept check & revision quiz to solidify mastery.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-slate-950/20 rounded border border-slate-850/60">
                <div className="text-xs font-mono bg-[#5A6344]/30 text-[#8E9B64] font-bold px-1.5 py-0.5 rounded mt-0.5">
                  16d
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-slate-300">Cycle 3: Permanent Memory</h5>
                  <p className="text-[10px] text-slate-500">Comprehensive custom check. This grows your interactive tree to permanent bloom.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1 font-sans">
            <button
              type="button"
              onClick={onScheduleRevision}
              className="flex-1 bg-[#5A6344] hover:bg-[#484f36] text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <Calendar size={13} />
              Set Spaced Repetition Reminders
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg transition"
            >
              I will revise later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
