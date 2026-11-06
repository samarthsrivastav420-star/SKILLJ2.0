import React, { useState } from 'react';
import { Award, Plus, Trash2, Calendar, Clock, CheckCircle2, X } from 'lucide-react';
import { TeacherProfile, Exam, ExamQuestion } from '../types';

interface TeacherCreateExamModalProps {
  isOpen: boolean;
  teacher: TeacherProfile;
  onClose: () => void;
  onExamCreated: (exam: Exam) => void;
}

export const TeacherCreateExamModal: React.FC<TeacherCreateExamModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onExamCreated,
}) => {
  const [examType, setExamType] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [title, setTitle] = useState('');
  const [examDate, setExamDate] = useState('2026-12-01');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [syllabus, setSyllabus] = useState('Comprehensive modules, architecture, code implementations, and problem solving.');
  const [instructions, setInstructions] = useState('1. All questions are compulsory.\n2. Prevent tab switching during test.\n3. Automatic submission on timer expiration.');
  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 'q1',
      questionNumber: 1,
      questionText: 'Define the architectural lifecycle of scalable microservices in Node.js and Express.',
      marks: 20,
      type: 'DESCRIPTIVE',
    },
    {
      id: 'q2',
      questionNumber: 2,
      questionText: 'Which data structure offers O(1) average time complexity for key lookups?',
      marks: 20,
      type: 'MCQ',
      options: ['Array', 'Hash Map / Hash Table', 'Binary Search Tree', 'Linked List'],
      correctAnswer: 'Hash Map / Hash Table',
    },
    {
      id: 'q3',
      questionNumber: 3,
      questionText: 'Explain the principles of server-side financial ledger reconciliation.',
      marks: 20,
      type: 'DESCRIPTIVE',
    },
    {
      id: 'q4',
      questionNumber: 4,
      questionText: 'Explain how service workers intercept offline fetch requests.',
      marks: 20,
      type: 'DESCRIPTIVE',
    },
    {
      id: 'q5',
      questionNumber: 5,
      questionText: 'What HTTP status code is used for successful resource creation?',
      marks: 20,
      type: 'MCQ',
      options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
      correctAnswer: '201 Created',
    },
  ]);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalMarks = examType === 'YEARLY' ? 550 : 100;

  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    const marksPerQ = examType === 'YEARLY' ? 110 : 20;
    setQuestions([
      ...questions,
      {
        id: `q${Date.now()}`,
        questionNumber: nextNum,
        questionText: '',
        marks: marksPerQ,
        type: 'DESCRIPTIVE',
      },
    ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handlePublishExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const examPayload = {
      teacherId: teacher.id,
      title: title || `${examType === 'MONTHLY' ? 'Monthly Assessment' : 'Grand Annual Examination'} — ${teacher.teachingCategory}`,
      type: examType,
      category: teacher.teachingCategory,
      totalMarks,
      syllabus,
      instructions,
      examDate,
      startTime,
      endTime,
      questions,
    };

    try {
      const res = await fetch('/api/teacher/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examPayload),
      });

      if (res.ok) {
        const json = await res.json();
        onExamCreated(json.exam);
      } else {
        const newExam: any = {
          id: `exam-${Date.now()}`,
          ...examPayload,
          teacherName: `${teacher.firstName} ${teacher.surname}`,
          isPublished: true,
          status: 'SCHEDULED',
          durationMinutes: examType === 'YEARLY' ? 180 : 60,
        };
        onExamCreated(newExam);
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-red-200 overflow-hidden my-6">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-black">Author & Schedule Examination</h3>
              <p className="text-[11px] text-red-100 font-medium">
                Examiner: {teacher.firstName} {teacher.surname} • Only your selected students will receive this exam
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
        </div>

        <form onSubmit={handlePublishExam} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Exam Type Selector as per Prompt 18 */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => {
                setExamType('MONTHLY');
                setExamDate('2026-12-01'); // 1st day of month rule
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                examType === 'MONTHLY'
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-emerald-800">MONTHLY EXAM</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase">
                  100 MARKS
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Conducted on the 1st day of every month.</p>
            </div>

            <div
              onClick={() => {
                setExamType('YEARLY');
                setExamDate('2027-01-15'); // 10 Jan - 25 Jan rule
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                examType === 'YEARLY'
                  ? 'border-red-600 bg-red-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-red-800">YEARLY EXAM</span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                  550 MARKS
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Conducted from 10 January to 25 January every year.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exam Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. November Term Assessment"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exam Date *</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prescribed Syllabus *</label>
            <textarea
              rows={2}
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
            />
          </div>

          {/* Question Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 block">Questions & Marking Scheme</span>
                <span className="text-[10px] text-slate-500">Total Marks must equal {totalMarks}.</span>
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Q{idx + 1} ({q.type})</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {q.marks} Marks
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].questionText = e.target.value;
                      setQuestions(updated);
                    }}
                    placeholder="Enter question statement..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs shadow-lg shadow-red-600/25 transition cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Publishing Exam...' : `Schedule & Publish ${examType} Exam (${totalMarks}m) →`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
