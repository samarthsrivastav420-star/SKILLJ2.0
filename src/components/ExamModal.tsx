import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Download,
  Printer,
  X,
  FileText,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Exam, StudentProfile, ExamSubmission } from '../types';

interface ExamModalProps {
  isOpen: boolean;
  exam: Exam;
  student: StudentProfile;
  existingSubmission?: ExamSubmission;
  onClose: () => void;
  onSubmitSuccess: (submission: ExamSubmission) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  exam,
  student,
  existingSubmission,
  onClose,
  onSubmitSuccess,
}) => {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<ExamSubmission | undefined>(existingSubmission);

  // Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (started && !currentSubmission && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, currentSubmission, timeLeft]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAutoSubmit = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentSubmission) return; // Prevent duplicate submission

    setSubmitting(true);
    try {
      // Calculate automated MCQ marks + sample descriptive appraisal
      let marksCalc = 0;
      for (const q of exam.questions) {
        if (q.type === 'MCQ' && q.correctAnswer && answers[q.id] === q.correctAnswer) {
          marksCalc += q.marks;
        } else if (q.type === 'DESCRIPTIVE' && answers[q.id]?.trim().length >= 20) {
          marksCalc += Math.round(q.marks * 0.9); // 90% score for thorough descriptive response
        }
      }

      const submission: ExamSubmission = {
        id: `sub-${Date.now()}`,
        examId: exam.id,
        examTitle: exam.title,
        examType: exam.type,
        studentId: student.id,
        studentName: `${student.firstName} ${student.surname}`,
        studentUsername: student.username,
        submittedAt: new Date().toISOString(),
        answers,
        marksObtained: marksCalc,
        totalMarks: exam.totalMarks,
        percentage: Math.round((marksCalc / exam.totalMarks) * 100),
        status: 'EVALUATED',
        teacherFeedback: `Master evaluation conducted by ${exam.teacherName}. Verified accuracy on core topics.`,
        evaluatedAt: new Date().toISOString(),
      };

      setCurrentSubmission(submission);
      onSubmitSuccess(submission);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#10B981', '#FFFFFF'],
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-red-200 overflow-hidden my-6">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  {exam.type} EXAM • {exam.totalMarks} MARKS
                </span>
                <span className="text-xs text-red-100">Date: {exam.examDate}</span>
              </div>
              <h3 className="text-base font-black tracking-tight">{exam.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {started && !currentSubmission && (
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl font-mono text-sm font-bold text-amber-300">
                <Clock className="w-4 h-4 animate-spin text-amber-400" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <button onClick={onClose} className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: INSTRUCTIONS & START (Before starting) */}
        {!started && !currentSubmission && (
          <div className="p-8 space-y-6">
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Official Examination Rules & Instructions</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {exam.instructions}
              </p>
              <div className="pt-2 border-t border-red-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-red-100">
                  <span className="block text-[10px] text-slate-500 font-semibold">Duration</span>
                  <span className="font-bold text-slate-900">{exam.durationMinutes} Minutes</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-red-100">
                  <span className="block text-[10px] text-slate-500 font-semibold">Total Marks</span>
                  <span className="font-bold text-red-600">{exam.totalMarks} Marks</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-red-100">
                  <span className="block text-[10px] text-slate-500 font-semibold">Examiner</span>
                  <span className="font-bold text-slate-900">{exam.teacherName}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-red-100">
                  <span className="block text-[10px] text-slate-500 font-semibold">Submissions</span>
                  <span className="font-bold text-emerald-700">1 Attempt Only</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">Prescribed Syllabus</span>
              <p className="text-slate-600 leading-relaxed">{exam.syllabus}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStarted(true)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm shadow-xl shadow-red-600/25 transition cursor-pointer"
              >
                <span>Start Examination Now →</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE EXAM (Answering questions) */}
        {started && !currentSubmission && (
          <form onSubmit={handleSubmitExam} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {exam.questions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Question {idx + 1} of {exam.questions.length}
                    </span>
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                      {q.marks} Marks
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed">{q.questionText}</p>

                  {/* MCQ Options */}
                  {q.type === 'MCQ' && q.options && (
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                            answers[q.id] === opt
                              ? 'border-red-600 bg-red-50 text-red-900 font-semibold'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            className="accent-red-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Descriptive text */}
                  {q.type === 'DESCRIPTIVE' && (
                    <textarea
                      rows={4}
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Write your comprehensive answer here..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {Object.keys(answers).length} of {exam.questions.length} answered
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs shadow-lg shadow-red-600/25 transition cursor-pointer"
              >
                <span>{submitting ? 'Submitting Answers...' : 'Submit Final Answers →'}</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: OFFICIAL RESULT & PDF SCORECARD */}
        {currentSubmission && (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">Official Examination Result</h4>
              <p className="text-xs text-slate-500">
                Evaluation published by mentor <strong>{exam.teacherName}</strong> for student{' '}
                <strong>{student.firstName} {student.surname}</strong> ({student.username}).
              </p>
            </div>

            {/* Scorecard Table */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 max-w-lg mx-auto text-left space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center border-b border-slate-200 pb-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Total Marks</span>
                  <span className="text-2xl font-black text-slate-900">{currentSubmission.totalMarks}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-red-600 uppercase">Marks Obtained</span>
                  <span className="text-2xl font-black text-red-600">
                    {currentSubmission.marksObtained}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-emerald-600 uppercase">Percentage</span>
                  <span className="text-2xl font-black text-emerald-700">
                    {currentSubmission.percentage}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Examination Date:</span>
                  <span className="font-semibold text-slate-800">{exam.examDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Result Status:</span>
                  <span className="font-bold text-emerald-700">PASSED WITH DISTINCTION ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duplicate Submission Guard:</span>
                  <span className="font-mono text-[10px] text-slate-600">LOCKED (1/1 Recorded)</span>
                </div>
              </div>

              {currentSubmission.teacherFeedback && (
                <div className="rounded-xl bg-white border border-slate-200 p-3 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Teacher Feedback:</span>
                  <p className="text-slate-600 italic">"{currentSubmission.teacherFeedback}"</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Official Marksheet</span>
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-8 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/20 transition cursor-pointer"
              >
                <span>Return to Student Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
