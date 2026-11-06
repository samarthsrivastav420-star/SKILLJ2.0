import {
  StudentProfile,
  TeacherProfile,
  CourseContentItem,
  LiveSession,
  Exam,
  ExamSubmission,
  Certificate,
  TransactionLedgerEntry,
  PlatformComplaint,
} from '../types';
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
} from '../data/mockData';

export interface BootstrapData {
  students: StudentProfile[];
  teachers: TeacherProfile[];
  contentItems: CourseContentItem[];
  liveSessions: LiveSession[];
  exams: Exam[];
  submissions: ExamSubmission[];
  certificates: Certificate[];
  ledger: TransactionLedgerEntry[];
  complaints: PlatformComplaint[];
}

// Fallback in-memory state on client
let cachedState: BootstrapData = {
  students: [...INITIAL_STUDENTS],
  teachers: [...INITIAL_TEACHERS],
  contentItems: [...INITIAL_CONTENT],
  liveSessions: [...INITIAL_LIVE_SESSIONS],
  exams: [...INITIAL_EXAMS],
  submissions: [...INITIAL_SUBMISSIONS],
  certificates: [...INITIAL_CERTIFICATES],
  ledger: [...INITIAL_LEDGER],
  complaints: [...INITIAL_COMPLAINTS],
};

export const api = {
  async fetchBootstrap(): Promise<BootstrapData> {
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        cachedState = data;
        return data;
      }
    } catch {
      // fallback to cachedState
    }
    return cachedState;
  },

  async registerStudent(studentData: any): Promise<{ student: StudentProfile; message: string }> {
    try {
      const res = await fetch('/api/auth/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (res.ok) {
        const json = await res.json();
        cachedState.students.push(json.student);
        return json;
      }
      const err = await res.json();
      throw new Error(err.error || 'Failed to register student');
    } catch (e: any) {
      // Local fallback
      const cleanUsername = studentData.username.startsWith('@') ? studentData.username : `@${studentData.username}`;
      const newStudent: StudentProfile = {
        id: `stud-${Date.now()}`,
        userId: `user-stud-${Date.now()}`,
        username: cleanUsername,
        firstName: studentData.firstName,
        surname: studentData.surname,
        dob: studentData.dob || '2005-01-01',
        fatherName: studentData.fatherName || '',
        motherName: studentData.motherName || '',
        country: studentData.country || 'India',
        address: studentData.address || '',
        mobileNumber: studentData.mobileNumber,
        whatsAppNumber: studentData.whatsAppNumber || studentData.mobileNumber,
        gender: studentData.gender || 'Prefer not to say',
        currentClass: studentData.currentClass || 'Class 10th',
        previouslyPassedClass: studentData.previouslyPassedClass || 'Class 9th',
        schoolOrCollege: studentData.schoolOrCollege || '',
        preferredLanguage: studentData.preferredLanguage || 'English',
        maskedPaymentAccount: 'UPI ••' + studentData.mobileNumber.slice(-2) + '@upi',
        photoUrl: studentData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        basicTestCompleted: false,
        selectedCategory: 'SKILL',
        subscription: { plan: 'NONE', status: 'NONE' },
        level: 'Beginner (Level 1)',
        watchedVideosCount: 0,
        learningTimeMinutes: 0,
        completedCoursesCount: 0,
        certificatesEarned: [],
      };
      cachedState.students.push(newStudent);
      return { student: newStudent, message: 'Student registered successfully (Local Sync).' };
    }
  },

  async submitStudentBasicTest(studentId: string, answers: any): Promise<any> {
    try {
      const res = await fetch('/api/student/basic-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, answers }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    // fallback logic
    const student = cachedState.students.find((s) => s.id === studentId);
    if (student) {
      student.basicTestCompleted = true;
      student.basicTestResult = {
        totalMarks: 10,
        marksObtained: 10,
        completionStatus: 'COMPLETED',
        recommendedCategory: 'SKILL',
        recommendedTopic: 'Full-Stack Software Engineering',
        completedAt: new Date().toISOString(),
      };
      student.selectedCategory = 'SKILL';
      return { student, testResult: student.basicTestResult };
    }
    throw new Error('Student not found');
  },

  async selectTeacher(studentId: string, teacherId: string): Promise<any> {
    try {
      const res = await fetch('/api/student/select-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, teacherId }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const student = cachedState.students.find((s) => s.id === studentId);
    const teacher = cachedState.teachers.find((t) => t.id === teacherId);
    if (student && teacher) {
      student.selectedTeacherId = teacher.id;
      return { student, teacher };
    }
    throw new Error('Teacher or student not found');
  },

  async subscribePlan(studentId: string, planId: 'MONTHLY' | 'YEARLY', paymentMethod: string): Promise<any> {
    try {
      const res = await fetch('/api/student/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, planId, paymentMethod }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const student = cachedState.students.find((s) => s.id === studentId);
    if (student) {
      const planPrice = planId === 'YEARLY' ? 3000 : 250;
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + (planId === 'YEARLY' ? 365 : 30));
      student.subscription = {
        plan: planId,
        status: 'ACTIVE',
        validUntil: validUntil.toISOString(),
        amountPaid: planPrice,
        paymentId: `PAY-SKJ-LOCAL-${Date.now()}`,
        activatedAt: new Date().toISOString(),
      };
      return { success: true, student, txnId: student.subscription.paymentId };
    }
    throw new Error('Student not found');
  },

  async registerTeacher(teacherData: any): Promise<any> {
    try {
      const res = await fetch('/api/auth/register-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData),
      });
      if (res.ok) {
        const json = await res.json();
        cachedState.teachers.push(json.teacher);
        return json;
      }
    } catch {
      // fallback
    }
    const generatedUsername = `@prof_${teacherData.firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-3)}`;
    const newTeacher: TeacherProfile = {
      id: `teach-${Date.now()}`,
      userId: `user-teach-${Date.now()}`,
      username: generatedUsername,
      firstName: teacherData.firstName,
      surname: teacherData.surname,
      fatherName: teacherData.fatherName || '',
      motherName: teacherData.motherName || '',
      gmail: teacherData.gmail,
      mobileNumber: teacherData.mobileNumber || '9876543210',
      whatsAppNumber: teacherData.whatsAppNumber || teacherData.mobileNumber || '9876543210',
      country: teacherData.country || 'India',
      preferredLanguage: teacherData.preferredLanguage || 'English',
      address: teacherData.address || '',
      degreeDiploma: teacherData.degreeDiploma,
      teachingExperienceYears: 3,
      teachingCategory: teacherData.teachingCategory || 'SKILL',
      subCategoryOrSkills: [teacherData.teachingCategory || 'SKILL'],
      photoUrl: teacherData.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      maskedAadhaar: 'XXXX-XXXX-' + (teacherData.lastFourAadhaar || '0000'),
      maskedPan: 'XXXXXX' + (teacherData.lastFourPan || '0000'),
      maskedPayoutAccount: 'UPI ••@upi',
      payoutDetails: { upiId: teacherData.payoutUpi },
      verificationStatus: 'PENDING',
      interviewAttempts: [],
      studentCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      bio: `${teacherData.degreeDiploma} educator on SKILLJ.`,
      earnings: { totalEarnings: 0, availableBalance: 0, pendingPayments: 0, withdrawnAmount: 0 },
    };
    cachedState.teachers.push(newTeacher);
    return { teacher: newTeacher };
  },

  async submitTeacherInterview(teacherId: string, submission: any): Promise<any> {
    try {
      const res = await fetch('/api/teacher/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, submission }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const teacher = cachedState.teachers.find((t) => t.id === teacherId);
    if (teacher) {
      teacher.verificationStatus = 'SELECTED';
      return { teacher, status: 'SELECTED' };
    }
    throw new Error('Teacher not found');
  },

  async createContent(contentData: any): Promise<any> {
    try {
      const res = await fetch('/api/teacher/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });
      if (res.ok) {
        const json = await res.json();
        cachedState.contentItems.unshift(json.item);
        return json;
      }
    } catch {
      // fallback
    }
    const newItem: any = {
      id: `cnt-${Date.now()}`,
      ...contentData,
      viewsCount: 0,
      publishedAt: new Date().toISOString(),
      isLocked: contentData.type === 'VIDEO' || contentData.type === 'EBOOK',
    };
    cachedState.contentItems.unshift(newItem);
    return { item: newItem };
  },

  async createExam(examData: any): Promise<any> {
    try {
      const res = await fetch('/api/teacher/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData),
      });
      if (res.ok) {
        const json = await res.json();
        cachedState.exams.unshift(json.exam);
        return json;
      }
    } catch {
      // fallback
    }
    const newExam: any = {
      id: `exam-${Date.now()}`,
      ...examData,
      isPublished: true,
      status: 'SCHEDULED',
    };
    cachedState.exams.unshift(newExam);
    return { exam: newExam };
  },

  async withdrawTeacherBalance(teacherId: string, amount: number): Promise<any> {
    try {
      const res = await fetch('/api/teacher/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, amount }),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Withdrawal failed');
    } catch (e: any) {
      const teacher = cachedState.teachers.find((t) => t.id === teacherId);
      if (teacher) {
        if (amount > teacher.earnings.availableBalance) {
          throw new Error('Insufficient balance');
        }
        teacher.earnings.availableBalance -= amount;
        teacher.earnings.withdrawnAmount += amount;
        return { success: true, teacher, txnId: `WDL-LOCAL-${Date.now()}` };
      }
      throw e;
    }
  },

  async verifyCertificate(code: string): Promise<any> {
    try {
      const res = await fetch(`/api/verify/${code}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const cert = cachedState.certificates.find((c) => c.certificateCode.toLowerCase() === code.toLowerCase());
    if (cert) {
      return {
        valid: true,
        certificate: {
          code: cert.certificateCode,
          studentName: cert.studentName,
          courseTitle: cert.courseTitle,
          category: cert.category,
          teacherName: cert.teacherName,
          issueDate: cert.issueDate,
          grade: cert.grade,
          company: 'UNIVERSE',
          platform: 'SKILLJ',
        },
      };
    }
    return { valid: false, error: 'Certificate code not found in UNIVERSE registry.' };
  },
};
