/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { StudentDashboard } from './views/StudentDashboard';
import { TeacherDashboard } from './views/TeacherDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { VerifyCertificateView } from './views/VerifyCertificateView';
import { StudentRegisterModal } from './components/StudentRegisterModal';
import { StudentBasicTestModal } from './components/StudentBasicTestModal';
import { TeacherRegisterModal } from './components/TeacherRegisterModal';
import { TeacherInterviewModal } from './components/TeacherInterviewModal';
import { PaymentModal } from './components/PaymentModal';
import { CertificateModal } from './components/CertificateModal';
import { ExamModal } from './components/ExamModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { MobileAppExportModal } from './views/MobileAppExportModal';
import { LegalModal } from './components/LegalModals';
import { TeacherCreateExamModal } from './components/TeacherCreateExamModal';
import {
  UserRole,
  StudentProfile,
  TeacherProfile,
  CourseContentItem,
  LiveSession,
  Exam,
  ExamSubmission,
  Certificate,
  TransactionLedgerEntry,
  PlatformComplaint,
  CategoryType,
} from './types';
import { api, BootstrapData } from './services/api';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CONTENT,
  INITIAL_LIVE_SESSIONS,
  INITIAL_EXAMS,
  INITIAL_SUBMISSIONS,
  INITIAL_CERTIFICATES,
  INITIAL_LEDGER,
  INITIAL_COMPLAINTS,
} from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'student' | 'teacher' | 'admin' | 'verify'>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Application Data State
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<TeacherProfile[]>(INITIAL_TEACHERS);
  const [contentItems, setContentItems] = useState<CourseContentItem[]>(INITIAL_CONTENT);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(INITIAL_LIVE_SESSIONS);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(INITIAL_SUBMISSIONS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [ledger, setLedger] = useState<TransactionLedgerEntry[]>(INITIAL_LEDGER);
  const [complaints, setComplaints] = useState<PlatformComplaint[]>(INITIAL_COMPLAINTS);

  // Active User References
  const [activeStudentId, setActiveStudentId] = useState<string>('stud-101');
  const [activeTeacherId, setActiveTeacherId] = useState<string>('teach-201');

  // Modal Visibility States
  const [showStudentRegister, setShowStudentRegister] = useState(false);
  const [showStudentBasicTest, setShowStudentBasicTest] = useState(false);
  const [showTeacherRegister, setShowTeacherRegister] = useState(false);
  const [showTeacherInterview, setShowTeacherInterview] = useState(false);
  const [pendingInterviewTeacher, setPendingInterviewTeacher] = useState<TeacherProfile | null>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInitialPlan, setPaymentInitialPlan] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveSession | null>(null);
  const [isLiveTeacherMode, setIsLiveTeacherMode] = useState(false);

  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showMobileExport, setShowMobileExport] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  // Verification query param
  const [verifyTargetCode, setVerifyTargetCode] = useState<string>('SKILLJ-UNIV-WEBDEV-RSH-2026');

  // Fetch initial bootstrap state from full-stack server
  const refreshBootstrap = async () => {
    try {
      const data: BootstrapData = await api.fetchBootstrap();
      if (data) {
        setStudents(data.students);
        setTeachers(data.teachers);
        setContentItems(data.contentItems);
        setLiveSessions(data.liveSessions);
        setExams(data.exams);
        setSubmissions(data.submissions);
        setCertificates(data.certificates);
        setLedger(data.ledger);
        setComplaints(data.complaints);
      }
    } catch {
      // maintain local state
    }
  };

  useEffect(() => {
    refreshBootstrap();
  }, []);

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const currentTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];

  // Role Switching Handler
  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'student') setCurrentView('student');
    else if (role === 'teacher') setCurrentView('teacher');
    else if (role === 'admin') setCurrentView('admin');
  };

  // Student Registration Success Handler
  const handleStudentRegisterSuccess = (newStudent: StudentProfile) => {
    setStudents((prev) => [newStudent, ...prev.filter((s) => s.id !== newStudent.id)]);
    setActiveStudentId(newStudent.id);
    setShowStudentRegister(false);
    // Take directly to basic test as requested by prompt
    setShowStudentBasicTest(true);
  };

  // Student Basic Test Completion Handler
  const handleStudentBasicTestComplete = (updatedStudent: StudentProfile) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    setShowStudentBasicTest(false);
    setCurrentView('student');
  };

  // Teacher Registration leading to Interview
  const handleProceedToTeacherInterview = (newTeacher: TeacherProfile) => {
    setTeachers((prev) => [newTeacher, ...prev.filter((t) => t.id !== newTeacher.id)]);
    setPendingInterviewTeacher(newTeacher);
    setShowTeacherRegister(false);
    setShowTeacherInterview(true);
  };

  // Teacher Interview Selection Success
  const handleTeacherInterviewSuccess = (approvedTeacher: TeacherProfile) => {
    setTeachers((prev) => prev.map((t) => (t.id === approvedTeacher.id ? approvedTeacher : t)));
    setActiveTeacherId(approvedTeacher.id);
    setShowTeacherInterview(false);
    setActiveRole('teacher');
    setCurrentView('teacher');
  };

  // Student Teacher Selection Handler
  const handleSelectTeacher = async (teacherId: string) => {
    try {
      const res = await api.selectTeacher(currentStudent.id, teacherId);
      if (res.student) {
        setStudents((prev) => prev.map((s) => (s.id === res.student.id ? res.student : s)));
      }
      refreshBootstrap();
    } catch {
      setStudents((prev) =>
        prev.map((s) => (s.id === currentStudent.id ? { ...s, selectedTeacherId: teacherId } : s))
      );
    }
  };

  // Category Preference Switcher
  const handleUpdateCategoryPreference = (newCategory: CategoryType) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? { ...s, selectedCategory: newCategory } : s))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeRole={activeRole}
        onRoleSwitch={handleRoleSwitch}
        onOpenMobileExport={() => setShowMobileExport(true)}
        studentName={`${currentStudent?.firstName} ${currentStudent?.surname}`}
        teacherName={`${currentTeacher?.firstName} ${currentTeacher?.surname}`}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onOpenStudentRegister={() => setShowStudentRegister(true)}
            onOpenTeacherRegister={() => setShowTeacherRegister(true)}
            onNavigateToStudent={() => {
              setActiveRole('student');
              setCurrentView('student');
            }}
            onNavigateToTeacher={() => {
              setActiveRole('teacher');
              setCurrentView('teacher');
            }}
            onNavigateToVerify={() => setCurrentView('verify')}
            onOpenMobileExport={() => setShowMobileExport(true)}
            teachers={teachers}
            contentItems={contentItems}
          />
        )}

        {currentView === 'student' && (
          <StudentDashboard
            student={currentStudent}
            teachers={teachers}
            contentItems={contentItems}
            liveSessions={liveSessions}
            exams={exams}
            submissions={submissions}
            certificates={certificates}
            onOpenBasicTest={() => setShowStudentBasicTest(true)}
            onOpenPaymentModal={(plan) => {
              setPaymentInitialPlan(plan || 'MONTHLY');
              setShowPaymentModal(true);
            }}
            onSelectTeacher={handleSelectTeacher}
            onOpenLiveSession={(session) => {
              setActiveLiveSession(session);
              setIsLiveTeacherMode(false);
            }}
            onOpenExam={(exam) => setActiveExam(exam)}
            onOpenCertificate={(cert) => setActiveCertificate(cert)}
            onUpdateCategoryPreference={handleUpdateCategoryPreference}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard
            teacher={currentTeacher}
            students={students}
            contentItems={contentItems}
            liveSessions={liveSessions}
            exams={exams}
            submissions={submissions}
            ledger={ledger}
            onOpenLiveBroadcaster={(session) => {
              setActiveLiveSession(session);
              setIsLiveTeacherMode(true);
            }}
            onOpenCreateExamModal={() => setShowCreateExamModal(true)}
            onRefreshData={refreshBootstrap}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            students={students}
            teachers={teachers}
            contentItems={contentItems}
            ledger={ledger}
            complaints={complaints}
            certificates={certificates}
            exams={exams}
            onRefreshData={refreshBootstrap}
          />
        )}

        {currentView === 'verify' && (
          <VerifyCertificateView
            initialCode={verifyTargetCode}
            certificates={certificates}
          />
        )}
      </main>

      {/* Official UNIVERSE Educational Footer */}
      <Footer
        onOpenMobileExport={() => setShowMobileExport(true)}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* ---------------- MODALS & OVERLAYS ---------------- */}

      {/* 1. Student Registration Multi-Step Modal */}
      <StudentRegisterModal
        isOpen={showStudentRegister}
        onClose={() => setShowStudentRegister(false)}
        onRegisterSuccess={handleStudentRegisterSuccess}
        onSwitchToLogin={() => {
          setShowStudentRegister(false);
          setActiveRole('student');
          setCurrentView('student');
        }}
      />

      {/* 2. Student 5-Question Basic Test Modal */}
      <StudentBasicTestModal
        isOpen={showStudentBasicTest}
        student={currentStudent}
        onComplete={handleStudentBasicTestComplete}
      />

      {/* 3. Teacher Registration Modal */}
      <TeacherRegisterModal
        isOpen={showTeacherRegister}
        onClose={() => setShowTeacherRegister(false)}
        onProceedToInterview={handleProceedToTeacherInterview}
        onSwitchToLogin={() => {
          setShowTeacherRegister(false);
          setActiveRole('teacher');
          setCurrentView('teacher');
        }}
      />

      {/* 4. Teacher Interview & 100-Mark Assessment Modal */}
      {pendingInterviewTeacher && (
        <TeacherInterviewModal
          isOpen={showTeacherInterview}
          teacher={pendingInterviewTeacher}
          onSuccessSelected={handleTeacherInterviewSuccess}
          onClose={() => setShowTeacherInterview(false)}
        />
      )}

      {/* 5. Payment Gateway Simulation Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        student={currentStudent}
        initialPlan={paymentInitialPlan}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={(updatedStudent) => {
          setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
          refreshBootstrap();
        }}
      />

      {/* 6. Official Certificate Viewer & PDF Printer Modal */}
      <CertificateModal
        isOpen={Boolean(activeCertificate)}
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
        onNavigateToVerify={(code) => {
          setVerifyTargetCode(code);
          setCurrentView('verify');
        }}
      />

      {/* 7. Student Examination Modal (Monthly 100m / Yearly 550m) */}
      {activeExam && (
        <ExamModal
          isOpen={Boolean(activeExam)}
          exam={activeExam}
          student={currentStudent}
          existingSubmission={submissions.find((s) => s.examId === activeExam.id && s.studentId === currentStudent.id)}
          onClose={() => setActiveExam(null)}
          onSubmitSuccess={(newSubmission) => {
            setSubmissions((prev) => [newSubmission, ...prev.filter((s) => s.id !== newSubmission.id)]);
            refreshBootstrap();
          }}
        />
      )}

      {/* 8. Live Broadcast & Live Classroom Modal */}
      {activeLiveSession && (
        <LiveStreamModal
          isOpen={Boolean(activeLiveSession)}
          session={activeLiveSession}
          isTeacher={isLiveTeacherMode}
          student={currentStudent}
          onClose={() => setActiveLiveSession(null)}
          onEndLiveSession={(sessionId) => {
            setLiveSessions((prev) =>
              prev.map((s) => (s.id === sessionId ? { ...s, status: 'ENDED' } : s))
            );
          }}
        />
      )}

      {/* 9. Teacher Create Exam Modal */}
      <TeacherCreateExamModal
        isOpen={showCreateExamModal}
        teacher={currentTeacher}
        onClose={() => setShowCreateExamModal(false)}
        onExamCreated={(newExam) => {
          setExams((prev) => [newExam, ...prev]);
          refreshBootstrap();
        }}
      />

      {/* 10. Mobile App, APK & AAB Bundle Hub */}
      <MobileAppExportModal
        isOpen={showMobileExport}
        onClose={() => setShowMobileExport(false)}
      />

      {/* 11. Terms & Privacy Legal Modals */}
      <LegalModal
        isOpen={Boolean(legalModalType)}
        type={legalModalType || 'terms'}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
