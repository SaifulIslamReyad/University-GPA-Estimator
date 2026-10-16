"use client";

interface SemesterInput {
  id: string;
  tgpa: string;
  credits: string;
}

interface OverallCgpaProps {
  semesters: SemesterInput[];
  onChange: (id: string, field: "tgpa" | "credits", value: string) => void;
  onCalculate: () => void;
  result: string | null;
}

export default function OverallCgpa({
  semesters,
  onChange,
  onCalculate,
  result,
}: OverallCgpaProps) {
  return (
    <section className="card p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-white mb-3">
        Overall 4-Year CGPA
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Enter your TGPA for each of the 16 semesters (4 years × 4 semesters).{" "}
        <br />
        CGPA = Σ(TGPA × credits) / Σ credits — the same weighted formula.
      </p>
      <div className="space-y-2">
        {semesters.map((s, i) => {
          const year = Math.floor(i / 4) + 1;
          const semester = (i % 4) + 1;
          return (
            <div
              key={s.id}
              className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center bg-white/5 p-2 rounded-xl border border-white/10"
            >
              <label className="text-xs font-medium text-slate-300">
                {year}.{semester}
              </label>
              <input
                className="input-field"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="TGPA"
                value={s.tgpa}
                onChange={(e) => onChange(s.id, "tgpa", e.target.value)}
              />
              <input
                className="input-field"
                type="number"
                step="0.01"
                min="0"
                placeholder="Credits"
                value={s.credits}
                onChange={(e) => onChange(s.id, "credits", e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <button className="mt-4 w-full btn-primary btn-gradient" onClick={onCalculate}>
        Calculate Overall CGPA
      </button>
      {result !== null && (
        <p className="result-badge mt-3">
          Overall 4-Year CGPA: {result}
        </p>
      )}
    </section>
  );
}
