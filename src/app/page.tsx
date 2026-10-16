"use client";

import OverallCgpa from "@/components/OverallCgpa";
import SubjectRow, {
  gradePointFromValue,
  type SubjectInput,
} from "@/components/SubjectRow";
import { useCallback, useState } from "react";

const MAX_SEMESTERS = 4 * 2; // 4 years × 2 semesters

export default function Home() {
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    { id: "subject-0", course: "", credit: "", grade: "" },
  ]);
  const [nextSubjectId, setNextSubjectId] = useState(1);
  const [tgpaResult, setTgpaResult] = useState<string | null>(null);

  const [showHow, setShowHow] = useState(false);
  const [showOverall, setShowOverall] = useState(false);

  const [semesters, setSemesters] = useState([
    { id: "sem-0", tgpa: "", credits: "" },
  ]);
  const [cgpaResult, setCgpaResult] = useState<string | null>(null);

  const addSubject = useCallback(() => {
    setSubjects((prev) => [
      ...prev,
      { id: `subject-${nextSubjectId}`, course: "", credit: "", grade: "" },
    ]);
    setNextSubjectId((prev) => prev + 1);
    setTgpaResult(null);
  }, [nextSubjectId]);

  const removeSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTgpaResult(null);
  }, []);

  const updateSubject = useCallback(
    (id: string, field: keyof SubjectInput, value: string) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      );
      setTgpaResult(null);
    },
    [],
  );

  const calculateTgpa = useCallback(() => {
    let totalCredits = 0;
    let weightedSum = 0;
    let valid = false;

    for (const s of subjects) {
      const credit = parseFloat(s.credit);
      const gradePoint = gradePointFromValue(s.grade);
      if (!isNaN(credit) && credit > 0 && gradePoint !== null) {
        weightedSum += gradePoint * credit;
        totalCredits += credit;
        valid = true;
      }
    }

    setTgpaResult(valid ? (weightedSum / totalCredits).toFixed(2) : null);
  }, [subjects]);

  const updateSemester = useCallback(
    (id: string, field: "tgpa" | "credits", value: string) => {
      setSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      );
      setCgpaResult(null);
    },
    [],
  );

  const addSemester = useCallback(() => {
    setSemesters((prev) => {
      if (prev.length >= MAX_SEMESTERS) return prev;
      return [...prev, { id: `sem-${prev.length}`, tgpa: "", credits: "" }];
    });
    setCgpaResult(null);
  }, []);

  const calculateCgpa = useCallback(() => {
    let totalWeight = 0;
    let weightedSum = 0;
    let valid = false;

    for (const s of semesters) {
      const tgpa = parseFloat(s.tgpa);
      const weight = s.credits ? parseFloat(s.credits) : 1;
      if (
        !isNaN(tgpa) &&
        tgpa >= 0 &&
        tgpa <= 4 &&
        !isNaN(weight) &&
        weight > 0
      ) {
        weightedSum += tgpa * weight;
        totalWeight += weight;
        valid = true;
      }
    }

    setCgpaResult(valid ? (weightedSum / totalWeight).toFixed(2) : null);
  }, [semesters]);

  return (
    <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-sm sm:max-w-md mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-lg">
            University GPA Calculator
          </h1>
          <p className="mt-1 text-sm text-indigo-200">
            Estimate your term GPA and overall 4-year CGPA from expected marks
          </p>
        </header>

        {/* Instructions */}
        <section className="card mb-6 p-2 sm:p-6">
          <h2 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3">
            How to use
          </h2>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li>
              Enter each subject: <strong>course name</strong>,{" "}
              <strong>credit hours</strong>, and grade / GPA / marks
            </li>
            <li>
              The last field accepts letter grades (A, B+, C…), GPA (0–4), or
              expected marks (0–100)
            </li>
            <li>
              Tap <span className="font-semibold text-white">+</span> to add
              more subjects, then calculate your TGPA
            </li>
          </ul>
        </section>

        {/* Term GPA Calculator */}
        <section className="card mb-6 p-2 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Term GPA Calculator
          </h2>
          <div className="space-y-3">
            {subjects.map((s) => (
              <SubjectRow
                key={s.id}
                subject={s}
                onChange={updateSubject}
                onRemove={removeSubject}
              />
            ))}
          </div>
          <button
            className="add-button mx-auto mt-4"
            onClick={addSubject}
            aria-label="Add subject"
          >
            +
          </button>
          <button className="mt-3 w-full btn-primary" onClick={calculateTgpa}>
            Calculate TGPA
          </button>
          {tgpaResult !== null && (
            <p className="result-badge mt-4">Estimated TGPA: {tgpaResult}</p>
          )}
        </section>

        {/* Action buttons */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            className="btn-outline"
            onClick={() => setShowHow((prev) => !prev)}
          >
            How it works
          </button>
          <button
            className="btn-outline"
            onClick={() => setShowOverall((prev) => !prev)}
          >
            Calculate Overall 4-Year CGPA
          </button>
          <button
            className="btn-outline"
            onClick={() => alert("YouTube guide not available right now")}
          >
            YouTube guide
          </button>
        </section>

        {/* How it works */}
        {showHow && (
          <section className="card mb-6 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-3">
              How do we calculate?
            </h2>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 mb-4">
              <li>
                For every subject, enter the course name, credit hours, and{" "}
                <strong>one of</strong> in the last field:
              </li>
              <ul className="list-disc list-inside ml-4 text-sm text-slate-300 space-y-1">
                <li>a letter grade (A, A-, B+, B, C, D, F)</li>
                <li>a GPA value (0 to 4)</li>
                <li>expected marks (0 to 100)</li>
              </ul>
              <li>TGPA = Σ(grade point × credit) / Σ credits</li>
              <li>
                Marks are converted to grade points (80+ = 4.00, 75 = 3.75, 70 =
                3.50, 65 = 3.25, 60 = 3.00, 55 = 2.75, 50 = 2.50, 45 = 2.25, 40
                = 2.00, below 40 = 0.00).
              </li>
              <li>
                Letters map to grade points (A/A+ = 4.00, A- = 3.75, B+ = 3.50,
                B = 3.25, B- = 3.00, C+ = 2.75, C = 2.50, D = 2.00, F = 0.00).
              </li>
            </ul>
          </section>
        )}

        {/* Overall 4-Year CGPA */}
        {showOverall && (
          <OverallCgpa
            semesters={semesters}
            onChange={updateSemester}
            onAdd={addSemester}
            canAdd={semesters.length < MAX_SEMESTERS}
            onCalculate={calculateCgpa}
            result={cgpaResult}
          />
        )}
      </div>
    </div>
  );
}
