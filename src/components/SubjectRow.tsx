"use client";

export interface SubjectInput {
  id: string;
  course: string;
  credit: string;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  "a+": 4.00,
  a: 4.00,
  "a-": 3.75,
  "b+": 3.50,
  b: 3.25,
  "b-": 3.00,
  "c+": 2.75,
  c: 2.50,
  d: 2.00,
  f: 0.00,
};

function gradePointFromMarks(mark: number): number {
  if (mark >= 80) return 4.00;
  if (mark >= 75) return 3.75;
  if (mark >= 70) return 3.50;
  if (mark >= 65) return 3.25;
  if (mark >= 60) return 3.00;
  if (mark >= 55) return 2.75;
  if (mark >= 50) return 2.50;
  if (mark >= 45) return 2.25;
  if (mark >= 40) return 2.00;
  return 0.00;
}

export function gradePointFromValue(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const key = v.toLowerCase();
  if (key in GRADE_POINTS) return GRADE_POINTS[key];
  const n = Number(v);
  if (!Number.isNaN(n)) {
    if (n > 4) return gradePointFromMarks(n);
    return Math.min(4, Math.max(0, n));
  }
  return null;
}

interface SubjectRowProps {
  subject: SubjectInput;
  onChange: (id: string, field: keyof SubjectInput, value: string) => void;
  onRemove: (id: string) => void;
}

export default function SubjectRow({ subject, onChange, onRemove }: SubjectRowProps) {
  const gradePoint = gradePointFromValue(subject.grade);
  return (
    <div className="card p-3 sm:p-4 shadow-sm space-y-2">
      <div className="grid grid-cols-4 gap-2 items-end">
        <input
          className="input-compact col-span-3"
          placeholder="Course name"
          value={subject.course}
          onChange={(e) => onChange(subject.id, "course", e.target.value)}
        />
        <button
          className="delete-button flex justify-center items-center"
          aria-label="Delete subject"
          onClick={() => onRemove(subject.id)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <input
        className="input-compact"
        type="number"
        step="0.01"
        min="0"
        placeholder="Credit hours"
        value={subject.credit}
        onChange={(e) => onChange(subject.id, "credit", e.target.value)}
      />
      <input
        className="input-compact"
        placeholder="Grade / GPA / Marks"
        value={subject.grade}
        onChange={(e) => onChange(subject.id, "grade", e.target.value)}
      />
      <p className="text-[10px] text-indigo-300 mt-1">
        Grade point: {gradePoint?.toFixed(2) ?? "–"}
      </p>
    </div>
  );
}
