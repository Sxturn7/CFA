import React from "react";
import { Subject, ModuleProgress } from "../types";

interface GrowthTreeProps {
  subjects: Subject[];
  progress: Record<string, ModuleProgress>;
  totalStudyTime: number;
}

export default function GrowthTree({ subjects, progress }: GrowthTreeProps) {
  // Let's calculate completion stats for each subject
  const subjectStats = subjects.map((subj) => {
    const mods = subj.modules;
    const completedCount = mods.filter(
      (m) => progress[m.id]?.status === "completed"
    ).length;
    const inProgressCount = mods.filter(
      (m) => progress[m.id]?.status === "in_progress"
    ).length;
    const pct = mods.length > 0 ? (completedCount / mods.length) * 100 : 0;
    
    // Calculate average quiz score
    const completedWithScores = mods.filter(
      (m) => progress[m.id]?.status === "completed" && progress[m.id]?.quizScore !== null
    );
    const avgScore =
      completedWithScores.length > 0
        ? completedWithScores.reduce((acc, m) => acc + (progress[m.id].quizScore || 0), 0) /
          completedWithScores.length
        : null;

    return {
      ...subj,
      completedCount,
      inProgressCount,
      percent: pct,
      avgScore,
    };
  });

  // Total overall completed metrics
  const totalModules = subjects.reduce((sum, s) => sum + s.modules.length, 0);
  const totalCompleted = subjects.reduce(
    (sum, s) =>
      sum + s.modules.filter((m) => progress[m.id]?.status === "completed").length,
    0
  );
  const overallPct = totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0;

  // Let's render a beautiful SVG representation of the Tree of Knowledge.
  // The Tree's trunk is the CFA Foundation.
  // The 10 branches are the 10 subjects.
  // The size and leaf count on each branch depend on the actual percent execution of that subject!
  // The blossoms (flower nodes) bloom on branches that have high quiz averages (>= 75%).
  
  // Angle structures for the 10 branches radiating outwards
  const branches = [
    { name: "Quant Methods", x: 260, y: 350, tx: 100, ty: 280, color: "#5A6344", subjectId: "quant" },
    { name: "Economics", x: 280, y: 330, tx: 140, ty: 240, color: "#7D7859", subjectId: "econ" },
    { name: "Port. Management", x: 290, y: 310, tx: 160, ty: 170, color: "#A3B18A", subjectId: "portfolio" },
    { name: "Corp. Issuers", x: 300, y: 290, tx: 220, ty: 120, color: "#8C8665", subjectId: "corporate" },
    { name: "FSA", x: 315, y: 280, tx: 300, ty: 80, color: "#4A3728", subjectId: "fsa" },
    { name: "Equity Inv.", x: 340, y: 280, tx: 400, ty: 80, color: "#B08968", subjectId: "equity" },
    { name: "Fixed Income", x: 360, y: 290, tx: 480, ty: 120, color: "#94625A", subjectId: "fixed" },
    { name: "Derivatives", x: 370, y: 310, tx: 540, ty: 170, color: "#8D7B68", subjectId: "derivatives" },
    { name: "Alt. Investments", x: 380, y: 330, tx: 560, ty: 240, color: "#BDB9A2", subjectId: "alt" },
    { name: "Ethics", x: 400, y: 350, tx: 600, ty: 280, color: "#6E735B", subjectId: "ethics" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <span className="text bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full font-mono">
          Interactive Growth Tree
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          🌳 Curriculum Growth Tree
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Visual representation of your study coverage. Your knowledge tree grows leaves as you complete modules, and blooms with golden blossoms when you score above 75% on quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
        {/* The SVG tree canvas */}
        <div className="lg:col-span-3 flex justify-center bg-slate-950/50 rounded-xl border border-slate-800/80 p-4 relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
          
          <svg
            viewBox="0 0 700 500"
            className="w-full max-w-[620px] h-auto drop-shadow-[0_0_15px_rgba(15,23,42,0.8)]"
          >
            {/* Defs for gradients, glowing filters */}
            <defs>
              <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7D7859" />
                <stop offset="100%" stopColor="#4A3728" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <stop offset="0%" stopColor="#5A6344" stopOpacity="0.8" />
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ground / root base */}
            <ellipse cx="330" cy="460" rx="200" ry="25" fill="#E5E2D0" opacity="0.4" />
            <ellipse cx="330" cy="455" rx="140" ry="15" fill="#D9D5C3" opacity="0.6" />

            {/* Tree Trunk */}
            {/* Beautiful, organic branching curves */}
            <path
              d="M305 460 C310 400, 270 370, 290 320 C300 290, 310 270, 310 250 L340 250 C340 270, 350 290, 360 320 C370 360, 335 400, 345 460 Z"
              fill="url(#trunkGrad)"
            />
            <path
              d="M312 400 C317 380, 320 340, 328 310 L332 310 C322 340, 319 380, 314 400"
              stroke="#475569"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />

            {/* Render 10 Branches */}
            {branches.map((b, index) => {
              const stat = subjectStats.find((s) => s.id === b.subjectId)!;
              const hasCompletedModules = stat.completedCount > 0;
              const hasInProgress = stat.inProgressCount > 0;
              const completionPercent = stat.percent;
              
              // Thickness based on subject's curriculum weight value
              const weightValue = parseFloat(stat.weight) || 8;
              const branchThickness = 2 + weightValue * 0.4;

              // Color of the branch glows slightly if active/completed
              const strokeColor = hasCompletedModules ? b.color : "#475569";
              const isGlowing = completionPercent >= 80;

              // Generate foliage/leaves based on subject completion
              const leafCount = Math.ceil((stat.completedCount / stat.modules.length) * 12);
              const leafArray = Array.from({ length: leafCount });

              // Golden blossom if average quiz is >= 75%
              const offersBlossom = stat.avgScore !== null && stat.avgScore >= 75;

              return (
                <g key={b.name} className="transition-all duration-700 ease-in-out cursor-pointer hover:opacity-95">
                  {/* Branch curve */}
                  <path
                    d={`M${b.x} ${b.y} Q${(b.x + b.tx) / 2 + 10} ${(b.y + b.ty) / 2 - 20}, ${b.tx} ${b.ty}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={branchThickness}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                    style={{ filter: isGlowing ? "drop-shadow(0 0 4px " + b.color + ")" : "none" }}
                  />

                  {/* Branch label text (tiny, beautifully matched to color code) */}
                  <g transform={`translate(${b.tx}, ${b.ty - 12})`}>
                    <rect
                      x="-45"
                      y="-10"
                      width="90"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      stroke={hasCompletedModules ? b.color : "#334155"}
                      strokeWidth="1"
                      fillOpacity="0.8"
                    />
                    <text
                      textAnchor="middle"
                      fill={hasCompletedModules ? "#f8fafc" : "#94a3b8"}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="600"
                      y="1"
                    >
                      {stat.name.length > 14 ? stat.name.substring(0, 11) + "..." : stat.name}
                    </text>
                  </g>

                  {/* Leaves along the branch path */}
                  {leafArray.map((_, leafIndex) => {
                    // interpolate nodes along the bezier path
                    const t = (leafIndex + 1) / (leafCount + 1);
                    // Q(t) point
                    // P0 = (b.x, b.y)
                    // P1 = ( (bx+tx)/2 + 10, (by+ty)/2 - 20 )
                    // P2 = (b.tx, b.ty)
                    const bxControl = (b.x + b.tx) / 2 + 10;
                    const byControl = (b.y + b.ty) / 2 - 20;

                    const mt = 1 - t;
                    const lx = mt * mt * b.x + 2 * mt * t * bxControl + t * t * b.tx;
                    const ly = mt * mt * b.y + 2 * mt * t * byControl + t * t * b.ty;

                    // alternate leaf sides
                    const leafAngle = (leafIndex % 2 === 0 ? 35 : -35) + (t * 20);
                    const leafFill = offersBlossom && leafIndex < 2 ? "#fbbf24" : b.color;

                    return (
                      <g key={leafIndex} transform={`translate(${lx}, ${ly}) rotate(${leafAngle})`}>
                        {/* Elegant leaf shape */}
                        <path
                          d="M0 0 Q-6 -10, 0 -18 Q6 -10, 0 0"
                          fill={leafFill}
                          fillOpacity={0.85}
                          stroke="#1e293b"
                          strokeWidth="0.5"
                          className="animate-pulse"
                          style={{ animationDelay: `${leafIndex * 0.15}s` }}
                        />
                      </g>
                    );
                  })}

                  {/* Golden blossom flower positioned at the branch tip */}
                  {offersBlossom && (
                    <g transform={`translate(${b.tx}, ${b.ty})`}>
                      {/* Outer bloom aura */}
                      <circle cx="0" cy="0" r="10" fill="#fbbf24" opacity="0.3" className="animate-ping" />
                      {/* Real blossom visual */}
                      <path
                        d="M0 -6 C-3 -3, -6 0, 0 8 C6 0, 3 -3, 0 -6 Z"
                        fill="#f59e0b"
                        stroke="#fef08a"
                        strokeWidth="1"
                      />
                      <circle cx="0" cy="0" r="3.5" fill="#fef08a" />
                    </g>
                  )}
                  
                  {/* Spot highlight if there are in-progress modules */}
                  {hasInProgress && !hasCompletedModules && (
                    <circle cx={b.tx} cy={b.ty} r="4" fill="#38bdf8" className="animate-bounce" />
                  )}
                </g>
              );
            })}

            {/* Root/curriculum center label */}
            <g transform="translate(330, 420)">
              <rect x="-70" y="-14" width="140" height="28" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="sans-serif" fontWeight="800" y="4" letterSpacing="0.5">
                CFA LEVEL I ENGINE
              </text>
            </g>
          </svg>
        </div>

        {/* Informative Side Card */}
        <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 h-full flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase letter tracking-wider font-mono mb-3">
              Growth Diagnostics
            </h4>
            
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Grand Completion</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {overallPct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-slate-800/80 my-3 pt-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  🌳 <strong className="text-slate-200">Active Buds:</strong>{" "}
                  {subjectStats.filter((s) => s.completedCount > 0).length} of 10 subjects sprouted.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                  🌸 <strong className="text-slate-200">High Score Blossoms:</strong>{" "}
                  {subjectStats.filter((s) => s.avgScore !== null && s.avgScore >= 75).length} subjects blooming (avg &ge;75%).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {subjectStats.map((s) => (
                <div
                  key={s.id}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 tooltips`}
                  style={{
                    backgroundColor: s.completedCount === s.modules.length ? s.color : "#1e293b",
                    border: `1.5px solid ${s.completedCount > 0 ? s.color : "#475569"}`,
                  }}
                  title={`${s.name}: ${s.completedCount}/${s.modules.length} modules`}
                />
              ))}
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-2 font-mono">
              Leaf Indicators correspond to weights (6-20%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
