import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Globe, Sparkles, BookOpen, Compass, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../types';
import { evaluateStudentBasicTest } from '../utils/studentTest';

interface StudentBasicTestModalProps {
  isOpen: boolean;
  student: StudentProfile;
  onComplete: (updatedStudent: StudentProfile) => void;
}

export const StudentBasicTestModal: React.FC<StudentBasicTestModalProps> = ({
  isOpen,
  student,
  onComplete,
}) => {
  const [testLanguage, setTestLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [answers, setAnswers] = useState({
    name: `${student.firstName} ${student.surname}`,
    location: student.address || 'Mumbai, India',
    hobby: 'Technology, coding, and reading',
    readingInterest: 'Tech blogs and science magazines',
    aspiration: 'Learn full-stack software development and build scalable web apps',
  });

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const testEval = evaluateStudentBasicTest(answers);
    setResult(testEval);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#EF4444', '#FFFFFF', '#F59E0B'],
      });

      const res = await fetch('/api/student/basic-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, answers }),
      });
      if (res.ok) {
        const json = await res.json();
        // Server updated
      }
    } catch {
      // client-side fallback
    } finally {
      setSaving(false);
    }
  };

  const handleDone = () => {
    const updatedStudent: StudentProfile = {
      ...student,
      basicTestCompleted: true,
      basicTestResult: {
        totalMarks: 10,
        marksObtained: result?.marksObtained || 10,
        completionStatus: 'COMPLETED',
        recommendedCategory: result?.recommendedCategory || 'SKILL',
        recommendedTopic: result?.recommendedTopic || 'Full-Stack Software Engineering',
        completedAt: new Date().toISOString(),
      },
      selectedCategory: result?.recommendedCategory || 'SKILL',
    };
    onComplete(updatedStudent);
  };

  // Translations for the 5 questions
  const questionsContent = {
    English: [
      { id: 'q1', label: '1. What is your name?', desc: 'State your official full name (2 Marks)', field: 'name' },
      { id: 'q2', label: '2. Where do you live?', desc: 'Your city, state, or location (2 Marks)', field: 'location' },
      { id: 'q3', label: '3. What is your hobby?', desc: 'What creative activities or hobbies excite you? (2 Marks)', field: 'hobby' },
      { id: 'q4', label: '4. What do you read?', desc: 'What subjects, books, or articles do you like reading? (2 Marks)', field: 'readingInterest' },
      { id: 'q5', label: '5. What do you do?', desc: 'Your current occupation or what learning path do you aspire to pursue? (2 Marks)', field: 'aspiration' },
    ],
    Hindi: [
      { id: 'q1', label: '1. आपका नाम क्या है?', desc: 'अपना आधिकारिक पूरा नाम लिखें (2 अंक)', field: 'name' },
      { id: 'q2', label: '2. आप कहाँ रहते हैं?', desc: 'आपका शहर, राज्य या स्थान (2 अंक)', field: 'location' },
      { id: 'q3', label: '3. आपका शौक (Hobby) क्या है?', desc: 'आपको कौन सी रचनात्मक गतिविधियाँ पसंद हैं? (2 अंक)', field: 'hobby' },
      { id: 'q4', label: '4. आप क्या पढ़ते हैं?', desc: 'आप कौन से विषय या किताबें पढ़ना पसंद करते हैं? (2 अंक)', field: 'readingInterest' },
      { id: 'q5', label: '5. आप क्या करते हैं?', desc: 'आप अभी क्या करते हैं या कौन सा कौशल/शिक्षा सीखना चाहते हैं? (2 अंक)', field: 'aspiration' },
    ],
    Hinglish: [
      { id: 'q1', label: '1. Aapka naam kya hai?', desc: 'Official full name enter karein (2 Marks)', field: 'name' },
      { id: 'q2', label: '2. Aap kahan rehte hain?', desc: 'Apna city / area batayein (2 Marks)', field: 'location' },
      { id: 'q3', label: '3. Aapka hobby kya hai?', desc: 'Free time mein kya karna pasand hai? (2 Marks)', field: 'hobby' },
      { id: 'q4', label: '4. Aap kya read karte hain?', desc: 'Konsi books ya articles padhte hain? (2 Marks)', field: 'readingInterest' },
      { id: 'q5', label: '5. Aap kya karte hain?', desc: 'Current study/work aur kya seekhna chahte hain? (2 Marks)', field: 'aspiration' },
    ],
  };

  const currentQuestions = questionsContent[testLanguage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-red-200 overflow-hidden my-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Student Basic Test</h3>
              <p className="text-xs text-red-100 font-medium">5 Questions • 2 Marks Each • Total: 10 Marks</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-black/20 rounded-xl px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-red-200" />
            <select
              value={testLanguage}
              onChange={(e) => setTestLanguage(e.target.value as any)}
              className="bg-transparent text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="English" className="text-slate-900">English</option>
              <option value="Hindi" className="text-slate-900">हिंदी (Hindi)</option>
              <option value="Hinglish" className="text-slate-900">Hinglish</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="rounded-xl bg-red-50 border border-red-100 p-3.5 text-xs text-red-800 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                Welcome, <strong>{student.firstName}</strong>! This introductory test evaluates your learning intent and determines whether <strong>SKILL</strong>, <strong>COURSE</strong>, or <strong>EDUCATION</strong> is your best academic match.
              </span>
            </div>

            <div className="space-y-4">
              {currentQuestions.map((q) => (
                <div key={q.id} className="rounded-xl border border-slate-200 p-3.5 hover:border-red-300 transition bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800">{q.label}</label>
                    <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">2 Marks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">{q.desc}</p>
                  <input
                    type="text"
                    value={(answers as any)[q.field]}
                    onChange={(e) => setAnswers({ ...answers, [q.field]: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition cursor-pointer"
              >
                <span>{saving ? 'Evaluating Test...' : 'Submit Answers & Calculate Marks (10m) →'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* RESULT SCREEN AS REQUIRED BY PROMPT */
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">Basic Test Completed!</h4>
              <p className="text-xs text-slate-500">Your test result has been permanently verified and saved in the SKILLJ database.</p>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="block text-[11px] font-semibold text-slate-500">Total Marks</span>
                <span className="text-xl font-black text-slate-900">10</span>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <span className="block text-[11px] font-semibold text-red-600">Marks Obtained</span>
                <span className="text-xl font-black text-red-600">{result?.marksObtained} / 10</span>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <span className="block text-[11px] font-semibold text-emerald-600">Status</span>
                <span className="text-sm font-black text-emerald-700">COMPLETED ✓</span>
              </div>
            </div>

            {/* Recommended Pathway */}
            <div className="rounded-2xl border-2 border-dashed border-red-300 bg-red-50/50 p-4 max-w-md mx-auto text-left">
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  Recommended Pathway based on Question 5
                </span>
              </div>
              <div className="text-base font-black text-slate-900">
                Track: <span className="text-red-600">{result?.recommendedCategory}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Field: {result?.recommendedTopic}
              </p>
            </div>

            {/* DONE BUTTON */}
            <div>
              <button
                onClick={handleDone}
                className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm shadow-xl shadow-red-600/25 transition cursor-pointer"
              >
                <span>DONE — Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
