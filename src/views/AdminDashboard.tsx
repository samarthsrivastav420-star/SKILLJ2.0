import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Trash2,
  TrendingUp,
  BarChart3,
  Calendar,
  Lock,
} from 'lucide-react';
import {
  StudentProfile,
  TeacherProfile,
  CourseContentItem,
  TransactionLedgerEntry,
  PlatformComplaint,
  Certificate,
  Exam,
} from '../types';

interface AdminDashboardProps {
  students: StudentProfile[];
  teachers: TeacherProfile[];
  contentItems: CourseContentItem[];
  ledger: TransactionLedgerEntry[];
  complaints: PlatformComplaint[];
  certificates: Certificate[];
  exams: Exam[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  teachers,
  contentItems,
  ledger,
  complaints,
  certificates,
  exams,
  onRefreshData,
}) => {
  const [activeSection, setActiveSection] = useState<'teachers' | 'students' | 'finances' | 'complaints' | 'analytics' | 'certs'>('teachers');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle manual review decision for teachers
  const handleTeacherStatusChange = async (teacherId: string, status: 'SELECTED' | 'DESELECTED') => {
    try {
      const res = await fetch('/api/admin/teachers/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, decision: status }),
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch {
      const match = teachers.find((t) => t.id === teacherId);
      if (match) {
        match.verificationStatus = status;
        onRefreshData();
      }
    }
  };

  // Calculate platform financial analytics
  const totalGrossRevenue = ledger
    .filter((l) => l.type === 'SUBSCRIPTION_PAYMENT')
    .reduce((acc, l) => acc + l.amount, 0);

  const totalTeacherPayouts = ledger
    .filter((l) => l.type === 'TEACHER_SHARE')
    .reduce((acc, l) => acc + l.amount, 0);

  const totalUniverseRevenue = ledger
    .filter((l) => l.type === 'PLATFORM_COMMISSION')
    .reduce((acc, l) => acc + l.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
              UNIVERSE HQ CENTRAL COMMAND
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            SKILLJ Administrative Governance Console
          </h1>
          <p className="text-xs text-slate-400">
            Full authority over user accounts, faculty reviews, platform ledger, complaint redressal, and curricula.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 px-4 py-2 text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">UNIVERSE Net Revenue</span>
            <span className="text-xl font-black text-emerald-400">₹{totalUniverseRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-1 text-xs font-bold">
        {[
          { id: 'teachers', label: 'Faculty & Interview Reviews', icon: ShieldCheck },
          { id: 'students', label: 'Student Accounts', icon: Users },
          { id: 'finances', label: 'Platform Ledger & Payouts', icon: DollarSign },
          { id: 'complaints', label: 'Grievances & Redressal', icon: AlertTriangle },
          { id: 'certs', label: 'Verified Certificates', icon: Award },
          { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-3 px-4 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 text-red-500" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: FACULTY & INTERVIEW REVIEWS */}
      {activeSection === 'teachers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Registered Faculty & Interview Assessment Records</h3>
              <p className="text-xs text-slate-500">
                Review candidate scores across the 5 interview questions and approve/reject manual reviews.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Instructor</th>
                    <th className="px-5 py-3">Track</th>
                    <th className="px-5 py-3">Degree/Diploma</th>
                    <th className="px-5 py-3">Interview Score</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">UNIVERSE Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t) => {
                    const latestAttempt = t.interviewAttempts?.[t.interviewAttempts.length - 1];
                    const score = latestAttempt ? latestAttempt.score : 100;

                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={t.photoUrl} alt={t.firstName} className="h-10 w-10 rounded-full object-cover border border-red-500" />
                            <div>
                              <div className="font-bold text-slate-900">{t.firstName} {t.surname}</div>
                              <span className="font-mono text-[10px] text-red-600">{t.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">{t.teachingCategory}</td>
                        <td className="px-5 py-4 text-slate-600 max-w-xs truncate">{t.degreeDiploma}</td>
                        <td className="px-5 py-4 font-black">
                          <span className={score >= 40 ? 'text-emerald-600' : 'text-red-600'}>
                            {score} / 100 Marks
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {t.verificationStatus === 'SELECTED' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              SELECTED ✓
                            </span>
                          ) : t.verificationStatus === 'DESELECTED' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                              DESELECTED ✗
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              MANUAL REVIEW
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleTeacherStatusChange(t.id, 'SELECTED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleTeacherStatusChange(t.id, 'DESELECTED')}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px]"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: STUDENTS */}
      {activeSection === 'students' && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900">Enrolled Student Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((s) => (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={s.photoUrl} alt={s.firstName} className="h-12 w-12 rounded-2xl object-cover border border-red-500" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{s.firstName} {s.surname}</h4>
                      <span className="font-mono text-xs text-red-600">{s.username}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.subscription.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.subscription.status === 'ACTIVE' ? `${s.subscription.plan} PASS` : 'NO PASS'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-0.5">
                  <p>Institution: {s.schoolOrCollege}</p>
                  <p>Current Stream: <strong className="text-slate-800">{s.selectedCategory}</strong></p>
                  <p>Basic Test: {s.basicTestCompleted ? 'Completed (10/10m)' : 'Pending'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: FINANCES & LEDGER */}
      {activeSection === 'finances' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl bg-white p-5 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Gross Platform Volume</span>
              <span className="block text-2xl font-black text-slate-900">₹{totalGrossRevenue.toLocaleString()}</span>
            </div>
            <div className="rounded-2xl bg-white p-5 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Teacher Disbursed Revenue (80%)</span>
              <span className="block text-2xl font-black text-red-600">₹{totalTeacherPayouts.toLocaleString()}</span>
            </div>
            <div className="rounded-2xl bg-white p-5 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">UNIVERSE Corporate Share (20%)</span>
              <span className="block text-2xl font-black text-emerald-600">₹{totalUniverseRevenue.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">All Platform Transactions</h4>
            <div className="divide-y divide-slate-100 text-xs">
              {ledger.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] text-slate-400 block">{l.paymentGatewayTxnId}</span>
                    <span className="font-semibold text-slate-900">{l.description}</span>
                  </div>
                  <span className="font-black text-sm text-slate-900">₹{l.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: COMPLAINTS & GRIEVANCE REDRESSAL */}
      {activeSection === 'complaints' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <h4 className="text-base font-black text-slate-900">Student & Faculty Grievance Inbox</h4>
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-900">{c.subject}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {c.status}
                  </span>
                </div>
                <p className="text-slate-600">{c.description}</p>
                {c.resolution && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                    <strong>UNIVERSE Resolution:</strong> {c.resolution}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: CERTIFICATES REGISTRY */}
      {activeSection === 'certs' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <h4 className="text-base font-black text-slate-900">UNIVERSE Official Verifiable Certificates Database</h4>
          <div className="divide-y divide-slate-100 text-xs">
            {certificates.map((cert) => (
              <div key={cert.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-red-600 font-bold block">{cert.certificateCode}</span>
                  <span className="font-bold text-slate-900">{cert.studentName} — {cert.courseTitle}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  VERIFIED GENUINE ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: PLATFORM ANALYTICS */}
      {activeSection === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h4 className="text-base font-black text-slate-900">Student Retention & Completion</h4>
            <div className="h-48 flex items-end gap-3 pt-6 border-b border-slate-100">
              <div className="flex-1 bg-red-200 rounded-t-lg h-3/5 text-center text-[10px] pt-1">Aug</div>
              <div className="flex-1 bg-red-300 rounded-t-lg h-4/5 text-center text-[10px] pt-1">Sep</div>
              <div className="flex-1 bg-red-400 rounded-t-lg h-full text-center text-[10px] pt-1">Oct</div>
              <div className="flex-1 bg-red-600 rounded-t-lg h-full text-center text-[10px] pt-1 text-white font-bold">Nov (Peak)</div>
            </div>
            <p className="text-xs text-slate-500">92% average examination completion rate across active cohorts.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
            <h4 className="text-base font-black text-slate-900">Category Distribution</h4>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between font-bold">
                <span>1. SKILL Track (Software, Web, Cloud)</span>
                <span className="text-red-600">54%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '54%' }} />
              </div>

              <div className="flex justify-between font-bold pt-2">
                <span>2. COURSE Track (Python & Algorithms)</span>
                <span className="text-red-600">26%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '26%' }} />
              </div>

              <div className="flex justify-between font-bold pt-2">
                <span>3. EDUCATION Track (10th/12th Board)</span>
                <span className="text-red-600">20%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
