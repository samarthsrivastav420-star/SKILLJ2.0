import React from 'react';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Award,
  Sparkles,
  Play,
  Lock,
  CheckCircle2,
  Users,
  Calendar,
  Smartphone,
  Star,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { TeacherProfile, CourseContentItem } from '../types';

interface HomeViewProps {
  onOpenStudentRegister: () => void;
  onOpenTeacherRegister: () => void;
  onNavigateToStudent: () => void;
  onNavigateToTeacher: () => void;
  onNavigateToVerify: () => void;
  onOpenMobileExport: () => void;
  teachers: TeacherProfile[];
  contentItems: CourseContentItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenStudentRegister,
  onOpenTeacherRegister,
  onNavigateToStudent,
  onNavigateToTeacher,
  onNavigateToVerify,
  onOpenMobileExport,
  teachers,
  contentItems,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          {/* Official badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-200 text-xs font-bold text-red-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <span>OWNED BY UNIVERSE • ONLINE EDUCATION PLATFORM</span>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              Transform Your Future with <span className="text-red-600">SKILLJ</span>
            </h1>
            <p className="text-xl sm:text-2xl font-black tracking-widest text-red-600 uppercase">
              LEARN • TEACH • GROW
            </p>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              India's premier verified learning ecosystem. Certified master teachers, scheduled monthly examinations, verifiable certifications, and complete curriculum for Skills, Professional Courses, and School Board Education.
            </p>
          </div>

          {/* MANDATORY TWO MAIN OPTIONS AS REQUESTED BY PROMPT (Item 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
            {/* OPTION 1: LOGIN / REGISTER AS A STUDENT */}
            <div className="group rounded-3xl bg-white border-2 border-red-600 p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                OPTION 1
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">LOGIN AS A STUDENT</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Access protected video lectures, interactive ebooks, live stream broadcasts, monthly tests (100 marks), and download verified digital certificates.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Personalized 5-Question Basic Test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Choose & Switch Certified Teachers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Scheduled Monthly & Yearly Exams</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  onClick={onNavigateToStudent}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  <span>Enter Student Dashboard →</span>
                </button>
                <button
                  onClick={onOpenStudentRegister}
                  className="w-full text-center text-xs font-bold text-red-600 hover:underline py-1"
                >
                  New Learner? Complete Student Registration
                </button>
              </div>
            </div>

            {/* OPTION 2: REGISTER AS A TEACHER */}
            <div className="group rounded-3xl bg-white border-2 border-slate-900 p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                OPTION 2
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">REGISTER AS A TEACHER</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Join UNIVERSE certified faculty. Take the 100-mark assessment interview, conduct live classes, author exams, and earn 80% direct subscription revenue.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Rigorous 5-Question Interview Assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>80% Platform Revenue Payout to UPI/Bank</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Live Broadcasting Studio & Exam Builder</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  onClick={onOpenTeacherRegister}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-lg transition cursor-pointer"
                >
                  <span>Apply & Start Interview (100m) →</span>
                </button>
                <button
                  onClick={onNavigateToTeacher}
                  className="w-full text-center text-xs font-bold text-slate-700 hover:underline py-1"
                >
                  Already Approved? Open Teaching Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-center">
            <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-xs">
              <span className="block text-2xl font-black text-slate-900">10,000+</span>
              <span className="text-xs text-slate-500 font-semibold">Active Students</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-xs">
              <span className="block text-2xl font-black text-red-600">100%</span>
              <span className="text-xs text-slate-500 font-semibold">Verified Faculty</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-xs">
              <span className="block text-2xl font-black text-slate-900">₹250/mo</span>
              <span className="text-xs text-slate-500 font-semibold">Affordable Access</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-xs">
              <span className="block text-2xl font-black text-emerald-600">ISO 9001</span>
              <span className="text-xs text-slate-500 font-semibold">Certified Curricula</span>
            </div>
          </div>
        </div>
      </section>

      {/* THREE MAIN PATHWAYS (Skill, Course, Education) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            ACADEMIC PATHWAYS
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Choose Your Dedicated Learning Stream
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            SKILLJ tailors curriculum, video materials, ebooks, and certified mentors to your exact educational goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. SKILL */}
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-md hover:border-red-500 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-lg">
              01
            </div>
            <div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">CATEGORY 1</span>
              <h3 className="text-xl font-black text-slate-900">SKILL TRACK</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Modern high-income professional competencies. Full-Stack Web Architecture, Cloud Computing, UI/UX Systems, and AI Prompt Engineering.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li>• React 19 & Node.js Production Architecture</li>
              <li>• System Security & Payment Ledger Integration</li>
              <li>• Verified Portfolio Project Reviews</li>
            </ul>
            <button
              onClick={onNavigateToStudent}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition cursor-pointer"
            >
              Explore Skill Classes →
            </button>
          </div>

          {/* 2. COURSE */}
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-md hover:border-red-500 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-lg">
              02
            </div>
            <div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">CATEGORY 2</span>
              <h3 className="text-xl font-black text-slate-900">COURSE TRACK</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Structured certification bootcamps. Python for Machine Learning, Data Analytics, Advanced Algorithms, and Software Engineering.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li>• Python for Real-World AI Automation</li>
              <li>• Data Structures & Complexity Analysis</li>
              <li>• Official UNIVERSE Certification Exam</li>
            </ul>
            <button
              onClick={onNavigateToStudent}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition cursor-pointer"
            >
              Explore Course Classes →
            </button>
          </div>

          {/* 3. EDUCATION */}
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-md hover:border-red-500 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-lg">
              03
            </div>
            <div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">CATEGORY 3</span>
              <h3 className="text-xl font-black text-slate-900">EDUCATION TRACK</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Academic excellence for Class 10th & 12th CBSE/ICSE Board examinations, Physics, Chemistry, and Mathematics distinction programs.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li>• Class 10th & 12th Board Numerical Mastery</li>
              <li>• 1st of Every Month Scheduled Tests (100m)</li>
              <li>• Senior Board Examiner Mentorship</li>
            </ul>
            <button
              onClick={onNavigateToStudent}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition cursor-pointer"
            >
              Explore Education Classes →
            </button>
          </div>
        </div>
      </section>

      {/* VERIFIED TEACHERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              CERTIFIED FACULTY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Learn Directly from Top-Rated Educators
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every mentor on SKILLJ is rigorously evaluated through a 5-question 100-mark academic interview.
            </p>
          </div>
          <button
            onClick={onNavigateToStudent}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Teachers in Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div key={t.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.photoUrl}
                    alt={t.firstName}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-red-500 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-base font-black text-slate-900">{t.firstName} {t.surname}</h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <span className="font-mono text-xs font-bold text-red-600">{t.username}</span>
                    <div className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                      {t.degreeDiploma}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold ml-1 text-slate-800">{t.rating}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{t.studentCount} Students</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold">{t.teachingExperienceYears} Yrs Exp</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {t.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.subCategoryOrSkills.map((sk, idx) => (
                    <span key={idx} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={onNavigateToStudent}
                className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition cursor-pointer"
              >
                Choose & Assign Mentor →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SUBSCRIPTION TRANSPARENCY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            ALL-INCLUSIVE PRICING
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Transparent Subscription Plans for Students
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            No hidden charges. 80% goes directly to your selected teacher via an auditable platform ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* MONTHLY */}
          <div className="rounded-3xl border-2 border-red-200 bg-white p-8 shadow-lg hover:shadow-xl transition space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">RECURRING PASS</span>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">Monthly</span>
              </div>
              <div>
                <span className="text-4xl font-black text-slate-900">₹250</span>
                <span className="text-xs text-slate-500 font-semibold ml-2">/ month</span>
              </div>
              <p className="text-xs text-slate-600">
                Full access to locked video lectures, verified ebooks, authorized live class broadcasts, and monthly scheduled exam on the 1st of every month.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>₹200 (80%) directly credited to assigned teacher</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prorated credit preserved if you switch teachers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100-Mark Monthly Test evaluation and feedback</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateToStudent}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              SEE DETAILS & ACTIVATE (₹250) →
            </button>
          </div>

          {/* YEARLY */}
          <div className="rounded-3xl border-2 border-red-600 bg-gradient-to-b from-red-50/50 to-white p-8 shadow-xl hover:shadow-2xl transition space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              RECOMMENDED
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">ALL-ACCESS ANNUAL PASS</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">Save 17%</span>
              </div>
              <div>
                <span className="text-4xl font-black text-slate-900">₹3,000</span>
                <span className="text-xs text-slate-500 font-semibold ml-2">/ full year (365 Days)</span>
              </div>
              <p className="text-xs text-slate-600">
                Unrestricted 365-day access across all Skill, Course, and Education modules, full live class entry, plus eligibility for the Grand Annual 550-mark examination.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Eligibility for 10 Jan - 25 Jan Grand Yearly Exam (550m)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official UNIVERSE Distinction Certificate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited mentor switches with automatic ledger proration</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateToStudent}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              SEE DETAILS & ACTIVATE (₹3,000) →
            </button>
          </div>
        </div>
      </section>

      {/* MOBILE APPLICATION & GOOGLE PLAY CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile-First Multi-Device Engineering</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Study Anywhere on Android, iPhone, Tablet & Laptop
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              SKILLJ delivers instant PWA home-screen installation, downloadable Android APK packages, and Google Play Store AAB bundles for seamless cross-platform learning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenMobileExport}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Get Android APK & iOS Guide</span>
            </button>
            <button
              onClick={onNavigateToVerify}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verify Certificate</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
