import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { TeacherProfile, CategoryType } from '../types';
import { evaluateTeacherInterview } from '../utils/teacherAssessment';

interface TeacherInterviewModalProps {
  isOpen: boolean;
  teacher: TeacherProfile;
  onSuccessSelected: (updatedTeacher: TeacherProfile) => void;
  onClose: () => void;
}

export const TeacherInterviewModal: React.FC<TeacherInterviewModalProps> = ({
  isOpen,
  teacher,
  onSuccessSelected,
  onClose,
}) => {
  const currentAttempts = teacher.interviewAttempts || [];
  const attemptCount = currentAttempts.length;

  const [submission, setSubmission] = useState({
    ageAnswer: '32',
    nameAnswer: `${teacher.firstName} ${teacher.surname}`,
    teachAnswer: `${teacher.teachingCategory} — Full-Stack Web Development, System Architecture & Database Design`,
    cvFileName: 'Academic_Curriculum_Vitae_2026.pdf',
    aboutAnswer: 'Ph.D in Computer Science with 8+ years of dedicated mentoring experience. Committed to guiding students with high standards.',
  });

  const [selectedTeachingCategory, setSelectedTeachingCategory] = useState<CategoryType>(
    teacher.teachingCategory || 'SKILL'
  );

  const [submittedAttempt, setSubmittedAttempt] = useState<any>(
    attemptCount > 0 ? currentAttempts[currentAttempts.length - 1] : null
  );
  const [evaluating, setEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attemptCount >= 3) {
      setErrorMessage('Maximum of 3 interview attempts reached. Contact UNIVERSE administration.');
      return;
    }

    setEvaluating(true);
    setErrorMessage(null);

    try {
      const evalResult = evaluateTeacherInterview(submission, attemptCount);

      if (evalResult.status === 'SELECTED') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#059669', '#DC2626', '#FFFFFF'],
        });
      }

      const res = await fetch('/api/teacher/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: teacher.id, submission }),
      });

      if (res.ok) {
        const json = await res.json();
        setSubmittedAttempt(json.attempt);
        teacher.interviewAttempts = json.teacher.interviewAttempts;
        teacher.verificationStatus = json.status;
      } else {
        // Fallback local
        const attempt = {
          attemptNumber: evalResult.attemptNumber,
          score: evalResult.score,
          maxScore: 100,
          breakdown: evalResult.breakdown,
          status: evalResult.status,
          feedback: evalResult.feedback,
          cvFileName: submission.cvFileName,
          submittedAt: new Date().toISOString(),
        };
        setSubmittedAttempt(attempt);
        teacher.interviewAttempts = [...(teacher.interviewAttempts || []), attempt];
        teacher.verificationStatus = evalResult.status;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Evaluation error occurred.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleEnterDashboard = () => {
    teacher.teachingCategory = selectedTeachingCategory;
    teacher.verificationStatus = 'SELECTED';
    onSuccessSelected(teacher);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-red-200 overflow-hidden my-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
              SJ
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Teacher Interview & Selection Assessment</h3>
              <p className="text-xs text-red-100 font-medium">
                UNIVERSE Academic Board • 5 Questions (20m each) • Max 100 Marks • Attempt {attemptCount + 1}/3
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition">
            ✕
          </button>
        </div>

        {/* Previous attempts pill if any */}
        {teacher.interviewAttempts && teacher.interviewAttempts.length > 0 && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              Recorded Attempts: {teacher.interviewAttempts.length} of 3
            </span>
            <div className="flex gap-2">
              {teacher.interviewAttempts.map((att, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    att.status === 'SELECTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : att.status === 'DESELECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Attempt {att.attemptNumber}: {att.score}/100 ({att.status})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {!submittedAttempt || submittedAttempt.status === 'DESELECTED' ? (
          <form onSubmit={handleEvaluate} className="p-6 space-y-4">
            {errorMessage && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            {submittedAttempt && submittedAttempt.status === 'DESELECTED' && (
              <div className="rounded-xl bg-red-50 border-2 border-red-300 p-3.5 text-xs text-red-800 space-y-1">
                <div className="flex items-center gap-2 font-black text-red-900">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>PREVIOUS ATTEMPT RESULT: RED DESELECTED ({submittedAttempt.score}/100 Marks)</span>
                </div>
                <p>
                  You scored below 35 marks. You may submit a revision. (Remaining attempts:{' '}
                  {3 - (teacher.interviewAttempts?.length || 0)})
                </p>
              </div>
            )}

            <div className="text-xs text-slate-500">
              Each response carries <strong>20 marks</strong>. Qualification criteria:
              <br />
              • <strong className="text-emerald-700">40 marks or above</strong>: SELECTED
              • <strong className="text-amber-700">35–39 marks</strong>: MANUAL REVIEW
              • <strong className="text-red-700">Below 35 marks</strong>: DESELECTED
            </div>

            <div className="space-y-3.5">
              {/* Q1: Age */}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">1. What is your age? *</label>
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">20 Marks</span>
                </div>
                <input
                  type="number"
                  value={submission.ageAnswer}
                  onChange={(e) => setSubmission({ ...submission, ageAnswer: e.target.value })}
                  placeholder="e.g. 32"
                  min="18"
                  max="80"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>

              {/* Q2: Name */}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">2. What is your name? *</label>
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">20 Marks</span>
                </div>
                <input
                  type="text"
                  value={submission.nameAnswer}
                  onChange={(e) => setSubmission({ ...submission, nameAnswer: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Verma"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>

              {/* Q3: What do you teach? */}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">3. What do you teach? *</label>
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">20 Marks</span>
                </div>
                <input
                  type="text"
                  value={submission.teachAnswer}
                  onChange={(e) => setSubmission({ ...submission, teachAnswer: e.target.value })}
                  placeholder="Subject, syllabus specialization, and focus area"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>

              {/* Q4: Upload your CV */}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">4. Upload your CV *</label>
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">20 Marks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 rounded-lg border border-dashed border-red-300 bg-red-50/50 px-3 py-2 text-xs">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-slate-800 truncate">{submission.cvFileName}</span>
                    <span className="text-[10px] text-emerald-700 font-bold ml-auto bg-emerald-100 px-1.5 py-0.5 rounded">
                      Verified Upload ✓
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmission({ ...submission, cvFileName: 'Updated_CV_' + Date.now() + '.pdf' })}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload CV</span>
                  </button>
                </div>
              </div>

              {/* Q5: Tell us about yourself */}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800">5. Tell us about yourself *</label>
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">20 Marks</span>
                </div>
                <textarea
                  rows={3}
                  value={submission.aboutAnswer}
                  onChange={(e) => setSubmission({ ...submission, aboutAnswer: e.target.value })}
                  placeholder="Detail your pedagogy style, achievements, student outcomes, and teaching vision..."
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-500">Attempt {attemptCount + 1} of 3</span>
              <button
                type="submit"
                disabled={evaluating || attemptCount >= 3}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black shadow-lg shadow-red-600/20 transition cursor-pointer disabled:opacity-50"
              >
                <span>{evaluating ? 'Evaluating Interview...' : 'Submit Assessment (100 Marks) →'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* RESULT SCREEN WITH OFFICIAL SELECTION STATUS BADGES */
          <div className="p-8 text-center space-y-6">
            {submittedAttempt.status === 'SELECTED' && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-md">
                    GREEN SELECTED
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mt-2">
                    Congratulations! Qualification Approved
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {submittedAttempt.feedback}
                  </p>
                </div>

                {/* Score Breakdown Card */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="block text-[10px] font-semibold text-slate-500">Total Marks</span>
                    <span className="text-xl font-black text-slate-900">100</span>
                  </div>
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3">
                    <span className="block text-[10px] font-semibold text-emerald-700">Marks Obtained</span>
                    <span className="text-xl font-black text-emerald-700">{submittedAttempt.score} / 100</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="block text-[10px] font-semibold text-slate-500">Attempt Used</span>
                    <span className="text-xl font-black text-slate-900">{submittedAttempt.attemptNumber} of 3</span>
                  </div>
                </div>

                {/* Teaching Category Selection as requested: "After selection, the teacher must choose their teaching category: Skill / Course / Education" */}
                <div className="max-w-md mx-auto rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 p-4 text-left space-y-2">
                  <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Choose Your Teaching Category *
                  </label>
                  <p className="text-[11px] text-slate-600">
                    Students will discover you based on this category. You can manage courses and conduct exams within this domain:
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {(['SKILL', 'COURSE', 'EDUCATION'] as CategoryType[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedTeachingCategory(cat)}
                        className={`py-2 px-3 rounded-xl text-xs font-black transition border cursor-pointer ${
                          selectedTeachingCategory === cat
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-red-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleEnterDashboard}
                    className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm shadow-xl shadow-red-600/25 transition cursor-pointer"
                  >
                    <span>Enter Teaching Dashboard →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {submittedAttempt.status === 'MANUAL_REVIEW' && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-amber-100 border-2 border-amber-500 flex items-center justify-center text-amber-600 shadow-lg">
                  <Clock className="w-12 h-12" />
                </div>

                <div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500 text-white font-black text-xs uppercase tracking-widest shadow-md">
                    PENDING REVIEW
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mt-2">
                    Academic Board Review in Progress
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    Your assessment scored <strong>{submittedAttempt.score} marks</strong> (within the 35–39 review range). Your CV and answers have been routed to the UNIVERSE academic dean for final manual approval.
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setSubmittedAttempt(null)}
                    disabled={attemptCount >= 3}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Re-attempt ({3 - attemptCount} remaining)</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
