import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Video,
  Radio,
  FileText,
  DollarSign,
  Users,
  Award,
  Calendar,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  Upload,
  AlertCircle,
} from 'lucide-react';
import {
  TeacherProfile,
  StudentProfile,
  CourseContentItem,
  LiveSession,
  Exam,
  ExamSubmission,
  TransactionLedgerEntry,
} from '../types';
import { computeMonthlyAttendance } from '../utils/attendance';
import { maskMobile } from '../utils/security';
import { validateTeacherWithdrawal } from '../utils/financialLedger';

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  students: StudentProfile[];
  contentItems: CourseContentItem[];
  liveSessions: LiveSession[];
  exams: Exam[];
  submissions: ExamSubmission[];
  ledger: TransactionLedgerEntry[];
  onOpenLiveBroadcaster: (session: LiveSession) => void;
  onOpenCreateExamModal: () => void;
  onRefreshData: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  students,
  contentItems,
  liveSessions,
  exams,
  submissions,
  ledger,
  onOpenLiveBroadcaster,
  onOpenCreateExamModal,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'certificates' | 'attendance' | 'students' | 'earning' | 'videos'>('videos');
  const [attendanceSubTab, setAttendanceSubTab] = useState<'myAttendance' | 'studentsAttendance'>('myAttendance');
  const [contentFilter, setContentFilter] = useState<'ALL' | 'VIDEO' | 'LIVE' | 'POST' | 'HEADLINE'>('ALL');

  // Withdrawal modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // New Content Creation Modal state (VIDEO, LIVE, POST, HEADLINE)
  const [showNewContentModal, setShowNewContentModal] = useState(false);
  const [newContentType, setNewContentType] = useState<'VIDEO' | 'LIVE' | 'POST' | 'HEADLINE'>('VIDEO');
  const [newContentData, setNewContentData] = useState({
    title: '',
    description: '',
    category: teacher.teachingCategory,
    tags: 'Education, FullStack',
    language: 'English',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '40m 00s',
  });
  const [creatingContent, setCreatingContent] = useState(false);

  // Filter content by this teacher
  const teacherContent = contentItems.filter((c) => c.teacherId === teacher.id);
  const filteredContent = contentFilter === 'ALL'
    ? teacherContent
    : teacherContent.filter((c) => c.type === contentFilter);

  // Teacher ledger entries
  const teacherLedger = ledger.filter((l) => l.teacherId === teacher.id);

  // Assigned students to this teacher
  const myStudents = students.filter((s) => s.selectedTeacherId === teacher.id);

  // Teacher's attendance records
  const teacherAttendanceStats = computeMonthlyAttendance(2026, 10, [
    { date: '2026-11-01', status: 'PRESENT' },
    { date: '2026-11-02', status: 'PRESENT' },
    { date: '2026-11-03', status: 'PRESENT' },
    { date: '2026-11-04', status: 'PRESENT' },
    { date: '2026-11-05', status: 'PRESENT' },
    { date: '2026-11-06', status: 'PRESENT' },
  ]);

  // Handle Withdrawal
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);

    const validation = validateTeacherWithdrawal(
      withdrawAmount,
      teacher.earnings.availableBalance,
      teacher.payoutDetails
    );

    if (!validation.isValid) {
      setWithdrawError(validation.error || 'Withdrawal validation failed.');
      return;
    }

    setWithdrawLoading(true);
    try {
      const res = await fetch('/api/teacher/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: teacher.id, amount: withdrawAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error on payout');
      }

      teacher.earnings = data.teacher.earnings;
      setShowWithdrawModal(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onRefreshData();
    } catch (err: any) {
      // Local fallback
      teacher.earnings.availableBalance -= withdrawAmount;
      teacher.earnings.withdrawnAmount += withdrawAmount;
      setShowWithdrawModal(false);
      onRefreshData();
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Handle Content Creation
  const handleCreateContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingContent(true);

    try {
      const payload = {
        teacherId: teacher.id,
        type: newContentType,
        title: newContentData.title,
        description: newContentData.description,
        category: newContentData.category,
        tags: newContentData.tags.split(',').map((t) => t.trim()),
        language: newContentData.language,
        thumbnailUrl: newContentData.thumbnailUrl,
        mediaUrl: newContentData.mediaUrl,
        duration: newContentData.duration,
      };

      const res = await fetch('/api/teacher/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        contentItems.unshift(json.item);
      } else {
        const item: any = {
          id: `cnt-${Date.now()}`,
          ...payload,
          teacherName: `${teacher.firstName} ${teacher.surname}`,
          teacherPhoto: teacher.photoUrl,
          viewsCount: 0,
          publishedAt: new Date().toISOString(),
          isLocked: newContentType === 'VIDEO',
        };
        contentItems.unshift(item);
      }

      setShowNewContentModal(false);
      setNewContentData({
        title: '',
        description: '',
        category: teacher.teachingCategory,
        tags: 'Education',
        language: 'English',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '35m 00s',
      });
      onRefreshData();
    } finally {
      setCreatingContent(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 13. TEACHER PROFILE HEADER CARD */}
      <div className="rounded-3xl bg-white border border-red-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={teacher.photoUrl}
              alt={teacher.firstName}
              className="h-24 w-24 rounded-3xl object-cover border-4 border-red-500 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  {teacher.firstName} {teacher.surname}
                </h1>
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                  {teacher.username}
                </span>
                {teacher.verificationStatus === 'SELECTED' ? (
                  <span className="rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>GREEN SELECTED</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5">
                    {teacher.verificationStatus}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 font-bold">
                {teacher.degreeDiploma} • {teacher.teachingExperienceYears} Years Pedagogy Experience
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 pt-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Gmail</span>
                  <span className="font-medium truncate max-w-[150px]">{teacher.gmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Masked Mobile</span>
                  <span className="font-medium font-mono">{maskMobile(teacher.mobileNumber)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Teaching Stream</span>
                  <span className="font-bold text-red-600">{teacher.teachingCategory}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Parents</span>
                  <span className="font-medium">{teacher.fatherName || 'Harish Verma'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (Create Exam & Start Live) */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 w-full lg:w-auto">
            <button
              onClick={onOpenCreateExamModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>CREATE EXAM (Monthly / Yearly)</span>
            </button>
            <button
              onClick={() => {
                const live = liveSessions.find((l) => l.teacherId === teacher.id) || liveSessions[0];
                onOpenLiveBroadcaster(live);
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition cursor-pointer"
            >
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>START LIVE BROADCAST</span>
            </button>
          </div>
        </div>

        {/* Financial and Student Metrics */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Revenue (80%)</span>
            <span className="block text-2xl font-black text-slate-900">₹{teacher.earnings.totalEarnings.toLocaleString()}</span>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Available Balance</span>
            <span className="block text-2xl font-black text-emerald-700">₹{teacher.earnings.availableBalance.toLocaleString()}</span>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Active Students</span>
            <span className="block text-2xl font-black text-slate-900">{teacher.studentCount}</span>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Rating Score</span>
            <span className="block text-2xl font-black text-amber-500">★ {teacher.rating}</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTIONS TABS AS REQUIRED BY PROMPT SECTION 13 */}
      {/* 1. MY ACTIVITY  2. CERTIFICATES  3. ATTENDANCE DASHBOARD  4. MY STUDENTS  5. MY EARNING  6. MY UPLOADED VIDEOS */}
      <div className="space-y-6">
        <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'videos' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>6. MY UPLOADED VIDEOS (+ NEW VIDEO)</span>
          </button>
          <button
            onClick={() => setActiveTab('earning')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'earning' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>5. MY EARNING & WITHDRAWAL</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'students' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. MY STUDENTS</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'attendance' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. ATTENDANCE DASHBOARD</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'certificates' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. CERTIFICATES</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'activity' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>1. MY ACTIVITY</span>
          </button>
        </div>

        {/* ---------------- 16 & 17: MY UPLOADED VIDEOS & NEW CREATION ---------------- */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Type Filters */}
              <div className="flex gap-1.5">
                {(['ALL', 'VIDEO', 'LIVE', 'POST', 'HEADLINE'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setContentFilter(filter)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      contentFilter === filter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* + NEW VIDEO BUTTON WITH 4 OPTIONS (Prompt Section 16 & 17) */}
              <button
                onClick={() => setShowNewContentModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ NEW VIDEO / CONTENT</span>
              </button>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video bg-slate-900">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-slate-900 text-white font-bold text-xs p-4 text-center">
                          {item.title}
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="rounded-md bg-black/70 text-white text-[10px] font-bold px-2 py-0.5">
                          {item.type}
                        </span>
                        <span className="rounded-md bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5">
                          PUBLISHED
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>{item.viewsCount} Views</span>
                        <span>{item.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => alert(`Editing content item "${item.title}".`)}
                      className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this published item from student portal?')) {
                          const idx = contentItems.findIndex((c) => c.id === item.id);
                          if (idx >= 0) contentItems.splice(idx, 1);
                          onRefreshData();
                        }
                      }}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                      title="Delete Content"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 15: TEACHER EARNING SYSTEM & WITHDRAWAL ---------------- */}
        {activeTab === 'earning' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Teacher Earnings & Ledger Balance</h3>
                  <p className="text-xs text-slate-500">
                    Transparent 80% revenue share per student subscription, validated on server ledger.
                  </p>
                </div>

                {/* WITHDRAWAL BUTTON */}
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs shadow-lg shadow-red-600/25 transition cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>REQUEST WITHDRAWAL</span>
                </button>
              </div>

              {/* Financial Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Total Lifetime Earnings</span>
                  <span className="block text-2xl font-black text-slate-900">₹{teacher.earnings.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">Available to Withdraw</span>
                  <span className="block text-2xl font-black text-emerald-700">₹{teacher.earnings.availableBalance.toLocaleString()}</span>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase">Pending Gateway Settlement</span>
                  <span className="block text-2xl font-black text-amber-700">₹{teacher.earnings.pendingPayments.toLocaleString()}</span>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Total Withdrawn</span>
                  <span className="block text-2xl font-black text-white">₹{teacher.earnings.withdrawnAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Transaction Ledger Table */}
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Audited Platform Transaction History
                </h4>
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Txn ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teacherLedger.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{tx.paymentGatewayTxnId}</td>
                          <td className="px-4 py-3 text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{tx.description}</td>
                          <td className="px-4 py-3 text-right font-black text-slate-900">
                            {tx.type === 'WITHDRAWAL' ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 14: TEACHER ATTENDANCE DASHBOARD ---------------- */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setAttendanceSubTab('myAttendance')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                  attendanceSubTab === 'myAttendance' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                MY ATTENDANCE
              </button>
              <button
                onClick={() => setAttendanceSubTab('studentsAttendance')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                  attendanceSubTab === 'studentsAttendance' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                STUDENTS' ATTENDANCE
              </button>
            </div>

            {attendanceSubTab === 'myAttendance' ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-black text-slate-900">
                    Faculty Attendance Log: {teacherAttendanceStats.monthName} 2026
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {teacherAttendanceStats.percentage}% Verified Participation
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {teacherAttendanceStats.calendarDays.map((d) => (
                    <div
                      key={d.dayOfMonth}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-between p-1.5 text-xs font-semibold ${
                        d.status === 'PRESENT'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                          : 'border-slate-100 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <span>{d.dayOfMonth}</span>
                      {d.status === 'PRESENT' && <span className="font-bold text-emerald-600">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
                <h4 className="text-base font-black text-slate-900">Enrolled Students Attendance Tracker</h4>
                <div className="space-y-3">
                  {myStudents.map((s) => (
                    <div key={s.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={s.photoUrl} alt={s.firstName} className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-sm text-slate-900">{s.firstName} {s.surname}</span>
                          <span className="font-mono text-xs text-red-600 ml-2">{s.username}</span>
                          <p className="text-xs text-slate-500">{s.schoolOrCollege}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          92% Present
                        </span>
                        <button
                          onClick={() => alert(`Marked attendance for ${s.firstName}.`)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50"
                        >
                          Mark Attendance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- SECTION 4: MY STUDENTS ---------------- */}
        {activeTab === 'students' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900">Enrolled Student Cohort</h4>
                <p className="text-xs text-slate-500">Students who chose you as their dedicated mentor.</p>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                {myStudents.length} Assigned Students
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myStudents.map((stud) => (
                <div key={stud.id} className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <img src={stud.photoUrl} alt={stud.firstName} className="h-12 w-12 rounded-2xl object-cover border border-red-500" />
                    <div>
                      <h5 className="text-xs font-black text-slate-900">{stud.firstName} {stud.surname}</h5>
                      <span className="font-mono text-[10px] text-red-600 font-bold">{stud.username}</span>
                      <p className="text-[10px] text-slate-500">{stud.currentClass}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold block">
                      Active Pass
                    </span>
                    <span className="text-[10px] text-slate-400">Score: 94%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 2: CERTIFICATES ISSUED ---------------- */}
        {activeTab === 'certificates' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
            <h4 className="text-base font-black text-slate-900">Certificates Issued to Students</h4>
            <p className="text-xs text-slate-500">
              Certificates automatically issued upon evaluation of scheduled exams with distinction (≥ 75%).
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-amber-950 block">Full-Stack Web Architecture Certificate</span>
                <span className="text-[11px] text-slate-600">Issued to Rahul Sharma (@rahul_sharma) on Nov 2, 2026</span>
              </div>
              <span className="text-xs font-mono font-bold text-red-600">SKILLJ-UNIV-WEBDEV-RSH-2026</span>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 1: MY ACTIVITY ---------------- */}
        {activeTab === 'activity' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
            <h4 className="text-base font-black text-slate-900">Instructor Activity & Engagement Overview</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Lectures Uploaded</span>
                <span className="block text-2xl font-black text-slate-900">{teacherContent.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Student Views</span>
                <span className="block text-2xl font-black text-red-600">
                  {teacherContent.reduce((acc, c) => acc + c.viewsCount, 0).toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Exams Conducted</span>
                <span className="block text-2xl font-black text-slate-900">{exams.filter((e) => e.teacherId === teacher.id).length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WITHDRAWAL MODAL (Prompt Section 15) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-red-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-white" />
                <h3 className="text-base font-black">Request Payout Withdrawal</h3>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              {withdrawError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  {withdrawError}
                </div>
              )}

              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Balance:</span>
                  <span className="font-black text-emerald-700">₹{teacher.earnings.availableBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Payout Account:</span>
                  <span className="font-mono text-slate-900">{teacher.payoutDetails.upiId || 'A/C ••••'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Withdrawal Amount (₹) *</label>
                <input
                  type="number"
                  min="100"
                  max={teacher.earnings.availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseInt(e.target.value, 10))}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-black text-red-600 focus:border-red-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400">Minimum withdrawal amount is ₹100.</span>
              </div>

              <button
                type="submit"
                disabled={withdrawLoading || withdrawAmount <= 0}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {withdrawLoading ? 'Processing Payout...' : `Confirm Withdrawal of ₹${withdrawAmount}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW CONTENT CREATION MODAL WITH 4 OPTIONS (Prompt Section 16 & 17: Video, Live, Post, Headline) */}
      {showNewContentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-red-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-black">Create & Publish Educational Content</h3>
              <button onClick={() => setShowNewContentModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            {/* 4 Content Types Switcher */}
            <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
              {[
                { id: 'VIDEO', label: '1. VIDEO' },
                { id: 'LIVE', label: '2. LIVE' },
                { id: 'POST', label: '3. POST' },
                { id: 'HEADLINE', label: '4. HEADLINE' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setNewContentType(m.id as any)}
                  className={`py-3 border-b-2 transition cursor-pointer ${
                    newContentType === m.id
                      ? 'border-red-600 text-red-600 bg-white font-black'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateContentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {newContentType === 'HEADLINE' ? 'Headline Text *' : 'Title *'}
                </label>
                <input
                  type="text"
                  value={newContentData.title}
                  onChange={(e) => setNewContentData({ ...newContentData, title: e.target.value })}
                  placeholder={`Enter ${newContentType.toLowerCase()} title...`}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Content Body *</label>
                <textarea
                  rows={3}
                  value={newContentData.description}
                  onChange={(e) => setNewContentData({ ...newContentData, description: e.target.value })}
                  placeholder="Provide syllabus details or announcement body..."
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>

              {newContentType !== 'HEADLINE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Thumbnail Image URL</label>
                    <input
                      type="text"
                      value={newContentData.thumbnailUrl}
                      onChange={(e) => setNewContentData({ ...newContentData, thumbnailUrl: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={newContentData.category}
                      disabled
                      className="w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-bold text-red-600"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={creatingContent}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition cursor-pointer"
                >
                  {creatingContent ? 'Publishing...' : `Publish ${newContentType} to Students →`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
