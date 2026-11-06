import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  Lock,
  Unlock,
  BookOpen,
  Radio,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  StudentProfile,
  TeacherProfile,
  CourseContentItem,
  LiveSession,
  Exam,
  ExamSubmission,
  Certificate,
  CategoryType,
} from '../types';
import { computeMonthlyAttendance } from '../utils/attendance';
import { maskMobile } from '../utils/security';

interface StudentDashboardProps {
  student: StudentProfile;
  teachers: TeacherProfile[];
  contentItems: CourseContentItem[];
  liveSessions: LiveSession[];
  exams: Exam[];
  submissions: ExamSubmission[];
  certificates: Certificate[];
  onOpenBasicTest: () => void;
  onOpenPaymentModal: (plan?: 'MONTHLY' | 'YEARLY') => void;
  onSelectTeacher: (teacherId: string) => void;
  onOpenLiveSession: (session: LiveSession) => void;
  onOpenExam: (exam: Exam) => void;
  onOpenCertificate: (certificate: Certificate) => void;
  onUpdateCategoryPreference: (category: CategoryType) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  teachers,
  contentItems,
  liveSessions,
  exams,
  submissions,
  certificates,
  onOpenBasicTest,
  onOpenPaymentModal,
  onSelectTeacher,
  onOpenLiveSession,
  onOpenExam,
  onOpenCertificate,
  onUpdateCategoryPreference,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'teachers' | 'attendance' | 'activity' | 'chooseCategory' | 'exams'>('classes');
  const [classesSubTab, setClassesSubTab] = useState<'VIDEO' | 'EBOOK' | 'LIVE'>('VIDEO');
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<CourseContentItem | null>(null);

  const isSubscribed = student.subscription.status === 'ACTIVE';

  // Selected teacher
  const selectedTeacher = teachers.find((t) => t.id === student.selectedTeacherId) || teachers[0];

  // Filter teachers matching student's selected category as required:
  // "IMPORTANT: Students should only see teachers who match their selected Skill, Course, or Education category."
  const matchingTeachers = teachers.filter((t) => {
    const matchesCategory = t.teachingCategory === student.selectedCategory;
    const matchesSearch =
      t.firstName.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
      t.surname.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
      t.username.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
      t.subCategoryOrSkills.some((s) => s.toLowerCase().includes(teacherSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered course content for student's category
  const categoryContent = contentItems.filter((c) => c.category === student.selectedCategory);
  const activeContentTypeList = categoryContent.filter((c) => c.type === classesSubTab);

  // Compute attendance stats
  const attendanceRecords = [
    { date: '2026-11-01', status: 'PRESENT' as const },
    { date: '2026-11-02', status: 'PRESENT' as const },
    { date: '2026-11-03', status: 'PRESENT' as const },
    { date: '2026-11-04', status: 'PRESENT' as const },
    { date: '2026-11-05', status: 'PRESENT' as const },
    { date: '2026-11-06', status: 'PRESENT' as const },
  ];
  const attendanceStats = computeMonthlyAttendance(2026, 10, attendanceRecords);

  // Student's exams
  const relevantExams = exams.filter((e) => e.category === student.selectedCategory);
  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);
  const studentCerts = certificates.filter((c) => c.studentId === student.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 5. STUDENT PROFILE HEADER CARD */}
      <div className="rounded-3xl bg-white border border-red-100 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Profile Photo & Primary Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={student.photoUrl}
                alt={student.firstName}
                className="h-24 w-24 rounded-3xl object-cover border-4 border-red-500 shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Verified Student">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  {student.firstName} {student.surname}
                </h1>
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                  {student.username}
                </span>
                <span className="rounded-full bg-slate-900 text-white text-[10px] font-bold px-2.5 py-0.5">
                  {student.level}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                {student.schoolOrCollege} • {student.currentClass}
              </p>

              {/* Masked Data Display as Required */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 pt-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Father's Name</span>
                  <span className="font-medium">{student.fatherName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Mother's Name</span>
                  <span className="font-medium">{student.motherName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Masked Mobile</span>
                  <span className="font-medium font-mono">{maskMobile(student.mobileNumber)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Country & Lang</span>
                  <span className="font-medium">{student.country} ({student.preferredLanguage})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status & Basic Test Pill */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 w-full lg:w-auto">
            {isSubscribed ? (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-3.5 text-right space-y-1">
                <div className="flex items-center justify-end gap-1.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{student.subscription.plan} PASS ACTIVE</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Valid until: <strong className="text-slate-900">{new Date(student.subscription.validUntil || '').toLocaleDateString('en-IN')}</strong>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Txn ID: {student.subscription.paymentId}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-right space-y-2">
                <div className="flex items-center justify-end gap-1.5 text-xs font-black text-red-700">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span>SUBSCRIPTION REQUIRED</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Course materials are locked until plan activation.
                </p>
                <button
                  onClick={() => onOpenPaymentModal('MONTHLY')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                >
                  Activate Pass (₹250/mo) →
                </button>
              </div>
            )}

            {!student.basicTestCompleted && (
              <button
                onClick={onOpenBasicTest}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Take 5-Question Basic Test (10m)</span>
              </button>
            )}
          </div>
        </div>

        {/* Micro Stats Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div>
            <span className="block text-xl font-black text-slate-900">{attendanceStats.percentage}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
          </div>
          <div>
            <span className="block text-xl font-black text-red-600">{student.watchedVideosCount}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Videos Watched</span>
          </div>
          <div>
            <span className="block text-xl font-black text-slate-900">{student.learningTimeMinutes}m</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Learning Time</span>
          </div>
          <div>
            <span className="block text-xl font-black text-slate-900">{studentCerts.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-base font-black text-red-600 truncate">
              {student.selectedCategory}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Stream</span>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION CARDS AS REQUIRED BY PROMPT SECTION 5 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Subscription Plans</h3>
            <p className="text-xs text-slate-500">Choose Monthly or Yearly pass with transparent teacher revenue split.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MONTHLY PLAN CARD */}
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">MONTHLY PLAN</span>
                <span className="text-xs font-bold text-slate-500">30 Days</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">₹250</span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <p className="text-xs text-slate-600">
                Unlock all videos, ebooks, and interactive live classes for your category with monthly examination eligibility.
              </p>
            </div>
            <button
              onClick={() => onOpenPaymentModal('MONTHLY')}
              className="w-full py-2.5 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs transition cursor-pointer"
            >
              SEE DETAILS & SUBSCRIBE (₹250)
            </button>
          </div>

          {/* YEARLY PLAN CARD */}
          <div className="rounded-2xl border-2 border-red-600 bg-gradient-to-br from-red-50/40 via-white to-red-50/20 p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-lg">
              BEST VALUE
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">YEARLY PLAN</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Save 17%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">₹3,000</span>
                <span className="text-xs text-slate-400 font-medium">/ year</span>
              </div>
              <p className="text-xs text-slate-600">
                Full 365-day access across all Skill, Course, and Education pathways plus entry to the Grand 550-mark annual exam.
              </p>
            </div>
            <button
              onClick={() => onOpenPaymentModal('YEARLY')}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              SEE DETAILS & SUBSCRIBE (₹3,000)
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTIONS TABS AS REQUIRED BY PROMPT SECTION 5 */}
      {/* 1. CLASSES  2. CHOOSE TEACHERS  3. ATTENDANCE  4. MY ACTIVITY  5. CHOOSE YOUR SKILL/COURSE/EDUCATION + EXAMS */}
      <div className="space-y-6">
        <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('classes')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'classes' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. CLASSES</span>
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'teachers' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. CHOOSE TEACHERS</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'attendance' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. ATTENDANCE</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'activity' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>4. MY ACTIVITY</span>
          </button>
          <button
            onClick={() => setActiveTab('chooseCategory')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'chooseCategory' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>5. CHOOSE YOUR SKILL/COURSE/EDUCATION</span>
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'exams' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>EXAMS & RESULTS</span>
          </button>
        </div>

        {/* ---------------- SECTION 1: CLASSES WITH PAYMENT LOCK SYSTEM ---------------- */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            {/* Sub-tabs: VIDEO, EBOOK, LIVE */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['VIDEO', 'EBOOK', 'LIVE'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setClassesSubTab(type)}
                    className={`py-1.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                      classesSubTab === type
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'VIDEO' && '▶ VIDEO'}
                    {type === 'EBOOK' && '📖 EBOOK'}
                    {type === 'LIVE' && '🔴 LIVE'}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                Track: <strong className="text-red-600">{student.selectedCategory}</strong>
              </div>
            </div>

            {/* Content Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeContentTypeList.map((item) => {
                const isItemLocked = !isSubscribed && item.isLocked;

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail with Lock Overlay */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className={`w-full h-full object-cover ${isItemLocked ? 'filter blur-xs opacity-60' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-slate-900 text-white font-bold">
                            SKILLJ LIVE
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5">
                            {item.type}
                          </span>
                          {item.duration && (
                            <span className="rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5">
                              {item.duration}
                            </span>
                          )}
                        </div>

                        {/* Payment Lock Overlay */}
                        {isItemLocked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xs text-white p-4 text-center">
                            <div className="h-12 w-12 rounded-2xl bg-red-600/90 flex items-center justify-center mb-2 shadow-lg animate-bounce">
                              <Lock className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-wider text-red-200">
                              🔒 CONTENT LOCKED
                            </span>
                            <span className="text-[11px] text-slate-200 mt-1">
                              Subscription Required (₹250/mo)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.teacherPhoto}
                            alt={item.teacherName}
                            className="h-6 w-6 rounded-full object-cover border border-red-500"
                          />
                          <span className="text-xs font-bold text-slate-700">{item.teacherName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-400">{item.viewsCount} Views</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-5 pt-0">
                      {isItemLocked ? (
                        <button
                          onClick={() => onOpenPaymentModal('MONTHLY')}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock Course Content →</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (item.type === 'VIDEO') {
                              setActiveVideoModal(item);
                            } else if (item.type === 'LIVE') {
                              const match = liveSessions.find((l) => l.teacherId === item.teacherId) || liveSessions[0];
                              onOpenLiveSession(match);
                            } else {
                              alert(`Opening "${item.title}" (${item.ebookPages || 140} pages) in SKILLJ Ebook Reader.`);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                        >
                          {item.type === 'VIDEO' && <Play className="w-3.5 h-3.5 fill-white" />}
                          {item.type === 'EBOOK' && <BookOpen className="w-3.5 h-3.5" />}
                          {item.type === 'LIVE' && <Radio className="w-3.5 h-3.5 text-red-500" />}
                          <span>
                            {item.type === 'VIDEO' && 'PLAY VIDEO'}
                            {item.type === 'EBOOK' && 'READ EBOOK'}
                            {item.type === 'LIVE' && 'JOIN LIVE CLASS'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Video Player Modal when student clicks Play Video */}
            {activeVideoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
                <div className="relative w-full max-w-3xl rounded-2xl bg-slate-950 overflow-hidden shadow-2xl border border-red-900/50">
                  <div className="p-4 bg-slate-900 flex items-center justify-between text-white border-b border-slate-800">
                    <h4 className="text-sm font-bold truncate max-w-lg">{activeVideoModal.title}</h4>
                    <button onClick={() => setActiveVideoModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                      ✕
                    </button>
                  </div>
                  <div className="aspect-video bg-black">
                    <video
                      controls
                      autoPlay
                      src={activeVideoModal.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 bg-slate-900 text-white text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Instructor: {activeVideoModal.teacherName}</span>
                      <span>Verified UNIVERSE Video Stream</span>
                    </div>
                    <p className="text-slate-300">{activeVideoModal.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- SECTION 2: CHOOSE TEACHERS & DISCOVERY ---------------- */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            {/* Currently selected teacher notice */}
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTeacher.photoUrl}
                  alt={selectedTeacher.firstName}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                    CURRENTLY ASSIGNED MENTOR
                  </span>
                  <h4 className="text-base font-black text-slate-900">
                    {selectedTeacher.firstName} {selectedTeacher.surname}
                  </h4>
                  <span className="text-xs font-mono font-bold text-red-600">{selectedTeacher.username}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedTeacher.degreeDiploma}</p>
                </div>
              </div>

              <div className="text-right text-xs space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px]">
                  Assigned Teacher ✓
                </span>
                <p className="text-[10px] text-slate-500">
                  Conducts your scheduled Monthly & Yearly Examinations.
                </p>
              </div>
            </div>

            {/* Discovery search & category guidance */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={teacherSearchQuery}
                  onChange={(e) => setTeacherSearchQuery(e.target.value)}
                  placeholder="Search verified teachers..."
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="text-xs text-slate-500">
                Displaying certified faculty matching track: <strong className="text-red-600">{student.selectedCategory}</strong>
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingTeachers.map((t) => {
                const isAssigned = student.selectedTeacherId === t.id;

                return (
                  <div
                    key={t.id}
                    className={`rounded-3xl border p-6 bg-white shadow-sm flex flex-col justify-between space-y-4 transition ${
                      isAssigned ? 'border-2 border-emerald-500 shadow-md' : 'border-slate-200 hover:border-red-300'
                    }`}
                  >
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
                          <span className="font-bold text-slate-900">★ {t.rating}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{t.studentCount} Students</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-700 font-semibold">{t.teachingExperienceYears} Yrs Exp</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
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

                    <div>
                      {isAssigned ? (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs text-center border border-emerald-300">
                          Selected Mentor ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (window.confirm(`Switch your assigned mentor to ${t.firstName} ${t.surname}? Transparent ledger rules will preserve past earnings for your previous mentor and transfer future prorated revenue.`)) {
                              onSelectTeacher(t.id);
                            }
                          }}
                          className="w-full py-2.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Change to this Teacher</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 3: STUDENT ATTENDANCE DASHBOARD ---------------- */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Monthly Calendar Attendance</h3>
                  <p className="text-xs text-slate-500">
                    Recorded based on verified class participation and live session participation.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-slate-300" />
                    <span>Not Recorded</span>
                  </div>
                </div>
              </div>

              {/* Attendance metrics bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Month</span>
                  <span className="block text-xl font-black text-slate-900">{attendanceStats.monthName} 2026</span>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">Total Present Days</span>
                  <span className="block text-xl font-black text-emerald-700">{attendanceStats.totalPresent} Days</span>
                </div>
                <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                  <span className="text-[11px] font-bold text-red-700 uppercase">Total Absent Days</span>
                  <span className="block text-xl font-black text-red-700">{attendanceStats.totalAbsent} Days</span>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Attendance Rate</span>
                  <span className="block text-xl font-black text-emerald-400">{attendanceStats.percentage}%</span>
                </div>
              </div>

              {/* S M T W T F S Monthly Calendar */}
              <div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 pb-2">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {attendanceStats.calendarDays.map((day) => (
                    <div
                      key={day.dayOfMonth}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-between p-1.5 text-xs font-semibold transition ${
                        day.status === 'PRESENT'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                          : day.status === 'ABSENT'
                          ? 'border-red-300 bg-red-50 text-red-900'
                          : 'border-slate-100 bg-slate-50/50 text-slate-400'
                      }`}
                    >
                      <span className="text-[11px]">{day.dayOfMonth}</span>
                      {day.status === 'PRESENT' && (
                        <span className="text-[11px] font-black text-emerald-600">✓</span>
                      )}
                      {day.status === 'ABSENT' && (
                        <span className="text-[11px] font-black text-red-600">✗</span>
                      )}
                      {day.status === 'NOT_RECORDED' && (
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 4: MY ACTIVITY (LEARN & Q&A) ---------------- */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEARN TIMELINE */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                    <h4 className="text-base font-black text-slate-900">LEARN Activity Timeline</h4>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    {student.learningTimeMinutes} Mins Total
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">Videos Watched</span>
                      <span className="text-slate-500">Lectures completed across current curriculum</span>
                    </div>
                    <span className="text-lg font-black text-red-600">{student.watchedVideosCount}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">Interactive Ebooks Read</span>
                      <span className="text-slate-500">Handbooks and formula codices referenced</span>
                    </div>
                    <span className="text-lg font-black text-slate-900">4 Modules</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">Live Broadcasts Joined</span>
                      <span className="text-slate-500">Real-time sessions with verified instructor</span>
                    </div>
                    <span className="text-lg font-black text-emerald-600">6 Sessions</span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Curriculum Completion Progress</span>
                    <span className="text-red-600">68% Complete</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              {/* Q&A & EXAM METRICS */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h4 className="text-base font-black text-slate-900">Q&A & Examination Record</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Avg: 94% Marks
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tests Attempted</span>
                    <span className="block text-2xl font-black text-slate-900">
                      {student.basicTestCompleted ? 1 : 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Exams Attempted</span>
                    <span className="block text-2xl font-black text-red-600">
                      {studentSubmissions.length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Highest Marks</span>
                    <span className="block text-2xl font-black text-emerald-600">94 / 100</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Certificates Earned</span>
                    <span className="block text-2xl font-black text-amber-500">{studentCerts.length}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('exams')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                  >
                    View Official Exam Marksheets & Download PDF →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 5: CHOOSE SKILL / COURSE / EDUCATION ---------------- */}
        {activeTab === 'chooseCategory' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Select or Switch Learning Path</h3>
              <p className="text-xs text-slate-500">
                You can change your learning path at any time. Recommended teachers and materials update immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'SKILL' as CategoryType,
                  title: '1. SKILL',
                  subtitle: 'Web, AI, Cloud, Design',
                  desc: 'High-income professional software and digital engineering skills.',
                },
                {
                  id: 'COURSE' as CategoryType,
                  title: '2. COURSE',
                  subtitle: 'Python, Math & ML',
                  desc: 'Structured career bootcamps and algorithmic certifications.',
                },
                {
                  id: 'EDUCATION' as CategoryType,
                  title: '3. EDUCATION',
                  subtitle: '10th & 12th Board Exams',
                  desc: 'Senior faculty preparation for Class 10th & 12th Board examinations.',
                },
              ].map((cat) => {
                const isSelected = student.selectedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`rounded-3xl border-2 p-6 transition flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-red-600 bg-red-50/40 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-500">{cat.subtitle}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                            CURRENT ACTIVE
                          </span>
                        )}
                      </div>
                      <h4 className="text-2xl font-black text-slate-900">{cat.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
                    </div>

                    <button
                      onClick={() => onUpdateCategoryPreference(cat.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Currently Selected Track ✓' : 'Switch to this Category'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 6: EXAMS & RESULTS VIEW ---------------- */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-900">Scheduled Examinations</h3>
                <p className="text-xs text-slate-500">
                  Only your selected teacher prepares and conducts your examinations.
                </p>
              </div>

              {/* Monthly and Yearly exam cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relevantExams.map((exam) => {
                  const existingSub = studentSubmissions.find((s) => s.examId === exam.id);

                  return (
                    <div
                      key={exam.id}
                      className="rounded-2xl border border-slate-200 p-5 space-y-3 bg-slate-50/50 hover:border-red-300 transition flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                            {exam.type} EXAM • {exam.totalMarks} MARKS
                          </span>
                          <span className="text-xs font-semibold text-slate-500">Date: {exam.examDate}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-900">{exam.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{exam.syllabus}</p>
                      </div>

                      <div className="pt-2">
                        {existingSub ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                              <span>Score: {existingSub.marksObtained} / {existingSub.totalMarks} ({existingSub.percentage}%)</span>
                              <span>EVALUATED ✓</span>
                            </div>
                            <button
                              onClick={() => onOpenExam(exam)}
                              className="w-full py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white transition cursor-pointer"
                            >
                              View Marksheet & Teacher Feedback
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenExam(exam)}
                            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                          >
                            Open Examination Portal →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Earned Certificates Registry */}
              {studentCerts.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900">Earned Digital Certificates</h4>
                    <span className="text-xs text-slate-500">Official UNIVERSE Registry</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {studentCerts.map((cert) => (
                      <div
                        key={cert.id}
                        className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-900 truncate max-w-[200px]">{cert.courseTitle}</h5>
                            <span className="font-mono text-[10px] text-slate-500">{cert.certificateCode}</span>
                            <div className="text-[10px] text-emerald-700 font-bold">Grade: {cert.grade}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenCertificate(cert)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-amber-400 text-xs font-bold text-slate-800 transition cursor-pointer"
                        >
                          View & Print
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
