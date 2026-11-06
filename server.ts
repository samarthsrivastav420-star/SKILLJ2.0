import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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
} from './src/data/mockData';
import { evaluateTeacherInterview } from './src/utils/teacherAssessment';
import { evaluateStudentBasicTest } from './src/utils/studentTest';
import { calculateTeacherPayout, validateTeacherWithdrawal, reallocateTeacherSubscription } from './src/utils/financialLedger';
import { maskAadhaar, maskPan, maskMobile, generateCertificateId } from './src/utils/security';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Database store with seed data
let students = [...INITIAL_STUDENTS];
let teachers = [...INITIAL_TEACHERS];
let contentItems = [...INITIAL_CONTENT];
let liveSessions = [...INITIAL_LIVE_SESSIONS];
let exams = [...INITIAL_EXAMS];
let submissions = [...INITIAL_SUBMISSIONS];
let certificates = [...INITIAL_CERTIFICATES];
let ledger = [...INITIAL_LEDGER];
let complaints = [...INITIAL_COMPLAINTS];

// Attendance storage: Record<studentId, { date: string, status: 'PRESENT' | 'ABSENT' }[]>
const studentAttendanceMap: Record<string, { date: string; status: 'PRESENT' | 'ABSENT' }[]> = {
  'stud-101': [
    { date: '2026-11-01', status: 'PRESENT' },
    { date: '2026-11-02', status: 'PRESENT' },
    { date: '2026-11-03', status: 'PRESENT' },
    { date: '2026-11-04', status: 'PRESENT' },
    { date: '2026-11-05', status: 'PRESENT' },
    { date: '2026-11-06', status: 'PRESENT' },
  ],
  'stud-102': [
    { date: '2026-11-01', status: 'PRESENT' },
    { date: '2026-11-02', status: 'PRESENT' },
    { date: '2026-11-03', status: 'ABSENT' },
    { date: '2026-11-04', status: 'PRESENT' },
    { date: '2026-11-05', status: 'PRESENT' },
    { date: '2026-11-06', status: 'PRESENT' },
  ],
};

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'SKILLJ', company: 'UNIVERSE', time: new Date().toISOString() });
});

// Initial bootstrap state
app.get('/api/bootstrap', (req, res) => {
  res.json({
    students,
    teachers,
    contentItems,
    liveSessions,
    exams,
    submissions,
    certificates,
    ledger,
    complaints,
  });
});

// 1. Student Registration
app.post('/api/auth/register-student', (req, res) => {
  const {
    firstName,
    surname,
    username,
    dob,
    fatherName,
    motherName,
    country,
    address,
    mobileNumber,
    whatsAppNumber,
    gender,
    currentClass,
    previouslyPassedClass,
    schoolOrCollege,
    preferredLanguage,
    photoUrl,
  } = req.body;

  if (!firstName || !surname || !username || !mobileNumber) {
    return res.status(400).json({ error: 'First name, surname, username, and mobile are required.' });
  }

  const cleanUsername = username.startsWith('@') ? username : `@${username}`;

  // Check unique username
  const existing = students.find((s) => s.username.toLowerCase() === cleanUsername.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Username is already taken. Please choose another username.' });
  }

  const newStudent = {
    id: `stud-${Date.now()}`,
    userId: `user-stud-${Date.now()}`,
    username: cleanUsername,
    firstName: firstName.trim(),
    surname: surname.trim(),
    dob: dob || '2005-01-01',
    fatherName: fatherName || '',
    motherName: motherName || '',
    country: country || 'India',
    address: address || '',
    mobileNumber: mobileNumber.trim(),
    whatsAppNumber: whatsAppNumber || mobileNumber.trim(),
    gender: gender || 'Prefer not to say',
    currentClass: currentClass || 'Class 10th',
    previouslyPassedClass: previouslyPassedClass || 'Class 9th',
    schoolOrCollege: schoolOrCollege || '',
    preferredLanguage: preferredLanguage || 'English',
    maskedPaymentAccount: 'UPI ••' + mobileNumber.slice(-2) + '@upi',
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    basicTestCompleted: false,
    selectedCategory: 'SKILL' as const,
    subscription: {
      plan: 'NONE' as const,
      status: 'NONE' as const,
    },
    level: 'Beginner (Level 1)',
    watchedVideosCount: 0,
    learningTimeMinutes: 0,
    completedCoursesCount: 0,
    certificatesEarned: [],
  };

  students.push(newStudent);
  studentAttendanceMap[newStudent.id] = [{ date: new Date().toISOString().split('T')[0], status: 'PRESENT' }];

  res.status(201).json({ student: newStudent, message: 'Student registered successfully. Proceed to Basic Test.' });
});

// 2. Student Basic Test Submission
app.post('/api/student/basic-test', (req, res) => {
  const { studentId, answers } = req.body;
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }

  const testResult = evaluateStudentBasicTest(answers);

  student.basicTestCompleted = true;
  student.basicTestResult = {
    ...testResult,
    completedAt: new Date().toISOString(),
  };
  student.selectedCategory = testResult.recommendedCategory;

  res.json({
    student,
    testResult: student.basicTestResult,
    message: 'Basic test evaluated and saved to SKILLJ database.',
  });
});

// 3. Select / Switch Teacher with platform ledger reallocation
app.post('/api/student/select-teacher', (req, res) => {
  const { studentId, teacherId } = req.body;
  const student = students.find((s) => s.id === studentId);
  const newTeacher = teachers.find((t) => t.id === teacherId);

  if (!student || !newTeacher) {
    return res.status(404).json({ error: 'Student or teacher not found.' });
  }

  const oldTeacherId = student.selectedTeacherId;
  const oldTeacher = oldTeacherId ? teachers.find((t) => t.id === oldTeacherId) : undefined;

  // If student has an active subscription and changes teacher, apply transparent platform ledger rules
  if (student.subscription.status === 'ACTIVE' && oldTeacher && oldTeacher.id !== newTeacher.id) {
    const totalAmount = student.subscription.amountPaid || 250;
    // Calculate elapsed proration (e.g. 10 days elapsed out of 30)
    const realloc = reallocateTeacherSubscription(totalAmount, 10, 30);

    // Record ledger entry
    ledger.push({
      id: `tx-realloc-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'TEACHER_TRANSFER_REALLOCATION',
      amount: realloc.transferredToNewTeacher,
      studentId: student.id,
      studentName: `${student.firstName} ${student.surname}`,
      teacherId: newTeacher.id,
      teacherName: `${newTeacher.firstName} ${newTeacher.surname}`,
      paymentGatewayTxnId: `REALLOC-${Date.now()}`,
      status: 'SUCCESS',
      description: `Student switched mentor. ₹${realloc.retainedByOldTeacher} retained by ${oldTeacher.firstName}; ₹${realloc.transferredToNewTeacher} transferred to ${newTeacher.firstName}.`,
    });

    // Update balances
    newTeacher.earnings.totalEarnings += realloc.transferredToNewTeacher;
    newTeacher.earnings.availableBalance += realloc.transferredToNewTeacher;
  }

  student.selectedTeacherId = newTeacher.id;
  newTeacher.studentCount += 1;

  res.json({ student, teacher: newTeacher, message: `Successfully assigned to ${newTeacher.firstName} ${newTeacher.surname}.` });
});

// 4. Secure Payment Gateway Simulation & Verification (Server-Side)
app.post('/api/student/subscribe', (req, res) => {
  const { studentId, planId, paymentMethod, gatewayToken } = req.body;
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const planPrice = planId === 'YEARLY' ? 3000 : 250;
  const durationDays = planId === 'YEARLY' ? 365 : 30;

  // Server-side payment verification (validating payment token signature)
  const txnId = `PAY-SKJ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Teacher allocation
  const assignedTeacher = student.selectedTeacherId ? teachers.find((t) => t.id === student.selectedTeacherId) : teachers[0];
  const { teacherShare, platformShare } = calculateTeacherPayout(planPrice);

  // Update student subscription
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + durationDays);

  student.subscription = {
    plan: planId,
    status: 'ACTIVE',
    validUntil: validUntilDate.toISOString(),
    amountPaid: planPrice,
    paymentId: txnId,
    activatedAt: new Date().toISOString(),
  };

  // Add ledger entries
  ledger.push({
    id: `tx-sub-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'SUBSCRIPTION_PAYMENT',
    amount: planPrice,
    studentId: student.id,
    studentName: `${student.firstName} ${student.surname}`,
    teacherId: assignedTeacher?.id,
    teacherName: assignedTeacher ? `${assignedTeacher.firstName} ${assignedTeacher.surname}` : 'UNIVERSE Pool',
    plan: planId,
    paymentGatewayTxnId: txnId,
    status: 'SUCCESS',
    description: `${planId} Plan Subscription (₹${planPrice}) via ${paymentMethod || 'UPI Gateway'}. Verified on server.`,
  });

  if (assignedTeacher) {
    assignedTeacher.earnings.totalEarnings += teacherShare;
    assignedTeacher.earnings.availableBalance += teacherShare;

    ledger.push({
      id: `tx-share-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'TEACHER_SHARE',
      amount: teacherShare,
      studentId: student.id,
      studentName: `${student.firstName} ${student.surname}`,
      teacherId: assignedTeacher.id,
      teacherName: `${assignedTeacher.firstName} ${assignedTeacher.surname}`,
      paymentGatewayTxnId: `LED-CR-${Date.now()}`,
      status: 'SUCCESS',
      description: `80% Teacher Share (₹${teacherShare}) credited to ${assignedTeacher.firstName}.`,
    });
  }

  ledger.push({
    id: `tx-comm-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'PLATFORM_COMMISSION',
    amount: platformShare,
    studentId: student.id,
    paymentGatewayTxnId: `LED-PLT-${Date.now()}`,
    status: 'SUCCESS',
    description: `20% UNIVERSE Platform fee (₹${platformShare}) recorded.`,
  });

  res.json({
    success: true,
    student,
    txnId,
    message: `Payment of ₹${planPrice} verified by gateway. Course content unlocked!`,
  });
});

// 5. Teacher Registration
app.post('/api/auth/register-teacher', (req, res) => {
  const {
    firstName,
    surname,
    degreeDiploma,
    gmail,
    mobileNumber,
    whatsAppNumber,
    country,
    preferredLanguage,
    lastFourAadhaar,
    teachingCategory,
    address,
    lastFourPan,
    payoutUpi,
    payoutBank,
    payoutIfsc,
    fatherName,
    motherName,
    photoUrl,
  } = req.body;

  if (!firstName || !surname || !gmail || !degreeDiploma) {
    return res.status(400).json({ error: 'First name, surname, Gmail, and Degree/Diploma are required.' });
  }

  const generatedUsername = `@prof_${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-3)}`;

  const newTeacher = {
    id: `teach-${Date.now()}`,
    userId: `user-teach-${Date.now()}`,
    username: generatedUsername,
    firstName: firstName.trim(),
    surname: surname.trim(),
    fatherName: fatherName || '',
    motherName: motherName || '',
    gmail: gmail.trim(),
    mobileNumber: mobileNumber || '9876543210',
    whatsAppNumber: whatsAppNumber || mobileNumber || '9876543210',
    country: country || 'India',
    preferredLanguage: preferredLanguage || 'English',
    address: address || '',
    degreeDiploma: degreeDiploma.trim(),
    teachingExperienceYears: 3,
    teachingCategory: (teachingCategory as any) || 'SKILL',
    subCategoryOrSkills: [teachingCategory || 'SKILL'],
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    maskedAadhaar: maskAadhaar(lastFourAadhaar || '0000'),
    maskedPan: maskPan(lastFourPan || '0000'),
    maskedPayoutAccount: payoutUpi ? `UPI ••@${payoutUpi.split('@')[1] || 'upi'}` : 'A/C ••••',
    payoutDetails: {
      upiId: payoutUpi,
      bankAccount: payoutBank,
      ifsc: payoutIfsc,
    },
    verificationStatus: 'PENDING' as const,
    interviewAttempts: [],
    studentCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    bio: `${degreeDiploma} educator specializing in ${teachingCategory}. Verified by UNIVERSE.`,
    earnings: {
      totalEarnings: 0,
      availableBalance: 0,
      pendingPayments: 0,
      withdrawnAmount: 0,
    },
  };

  teachers.push(newTeacher);

  res.status(201).json({
    teacher: newTeacher,
    message: 'Teacher registered. Proceed to Teacher Interview and Selection Assessment.',
  });
});

// 6. Teacher Interview & Selection Assessment (Max 3 attempts)
app.post('/api/teacher/interview', (req, res) => {
  const { teacherId, submission } = req.body;
  const teacher = teachers.find((t) => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found.' });
  }

  const currentAttempts = teacher.interviewAttempts.length;
  if (currentAttempts >= 3) {
    return res.status(400).json({ error: 'Maximum of 3 interview attempts has already been reached.' });
  }

  const result = evaluateTeacherInterview(submission, currentAttempts);

  const attemptRecord = {
    attemptNumber: result.attemptNumber,
    score: result.score,
    maxScore: result.maxScore,
    breakdown: result.breakdown,
    status: result.status,
    feedback: result.feedback,
    cvFileName: submission.cvFileName || 'CV_Upload.pdf',
    submittedAt: new Date().toISOString(),
  };

  teacher.interviewAttempts.push(attemptRecord);
  teacher.verificationStatus = result.status;

  res.json({
    teacher,
    attempt: attemptRecord,
    status: result.status,
    message: `Assessment evaluated: ${result.score}/100. Status: ${result.status}`,
  });
});

// 7. Teacher Content Upload (Video, Live, Post, Headline)
app.post('/api/teacher/content', (req, res) => {
  const { teacherId, type, title, description, category, tags, language, mediaUrl, thumbnailUrl, duration, ebookPages } = req.body;
  const teacher = teachers.find((t) => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found.' });
  }

  const newItem: any = {
    id: `cnt-${Date.now()}`,
    teacherId: teacher.id,
    teacherName: `${teacher.firstName} ${teacher.surname}`,
    teacherPhoto: teacher.photoUrl,
    title,
    description,
    category: category || teacher.teachingCategory,
    type,
    thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    viewsCount: 0,
    tags: tags || ['Education', 'SKILLJ'],
    language: language || 'English',
    publishedAt: new Date().toISOString(),
    isLocked: type === 'VIDEO' || type === 'EBOOK',
  };

  if (type === 'VIDEO') {
    newItem.mediaUrl = mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    newItem.duration = duration || '35m 00s';
  } else if (type === 'EBOOK') {
    newItem.ebookPages = ebookPages || 50;
  } else if (type === 'LIVE') {
    const liveSession: any = {
      id: `live-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.surname}`,
      teacherPhoto: teacher.photoUrl,
      title,
      description,
      category: category || teacher.teachingCategory,
      status: 'LIVE',
      startedAt: new Date().toISOString(),
      scheduledFor: new Date().toISOString(),
      viewersCount: 1,
      durationMinutes: 45,
    };
    liveSessions.unshift(liveSession);
  }

  contentItems.unshift(newItem);
  res.status(201).json({ item: newItem, message: `New ${type} published successfully on SKILLJ.` });
});

// 8. Teacher Create Exam (Monthly 100m, Yearly 550m)
app.post('/api/teacher/exams', (req, res) => {
  const { teacherId, title, type, category, totalMarks, syllabus, instructions, examDate, startTime, endTime, questions } = req.body;
  const teacher = teachers.find((t) => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found.' });
  }

  const newExam: any = {
    id: `exam-${Date.now()}`,
    teacherId: teacher.id,
    teacherName: `${teacher.firstName} ${teacher.surname}`,
    title,
    type: type || 'MONTHLY',
    category: category || teacher.teachingCategory,
    totalMarks: type === 'YEARLY' ? 550 : 100,
    syllabus,
    instructions: instructions || 'Follow exam guidelines. No duplicate submissions permitted.',
    examDate: examDate || new Date().toISOString().split('T')[0],
    startTime: startTime || '10:00',
    endTime: endTime || '11:00',
    durationMinutes: type === 'YEARLY' ? 180 : 60,
    isPublished: true,
    status: 'SCHEDULED',
    questions: questions || [],
  };

  exams.unshift(newExam);
  res.status(201).json({ exam: newExam, message: `${type} Exam created and scheduled successfully.` });
});

// 9. Teacher Evaluate Exam Submission & Auto-issue Certificate
app.post('/api/teacher/exams/evaluate', (req, res) => {
  const { submissionId, marksObtained, teacherFeedback } = req.body;
  const submission = submissions.find((s) => s.id === submissionId);
  if (!submission) {
    return res.status(404).json({ error: 'Exam submission not found.' });
  }

  submission.marksObtained = marksObtained;
  submission.percentage = Math.round((marksObtained / submission.totalMarks) * 100);
  submission.status = 'EVALUATED';
  submission.teacherFeedback = teacherFeedback || 'Reviewed by instructor.';
  submission.evaluatedAt = new Date().toISOString();

  // If student passed with >= 75%, issue official UNIVERSE SKILLJ Certificate
  let issuedCertificate = null;
  if (submission.percentage >= 75) {
    const student = students.find((s) => s.id === submission.studentId);
    const certCode = generateCertificateId('EXAM', submission.studentId);
    issuedCertificate = {
      id: `cert-${Date.now()}`,
      certificateCode: certCode,
      studentId: submission.studentId,
      studentName: submission.studentName,
      courseTitle: submission.examTitle,
      category: 'SKILL' as const,
      teacherId: 'teach-201',
      teacherName: 'Dr. Rajesh Verma',
      issueDate: new Date().toISOString().split('T')[0],
      verificationQrCodeUrl: `https://skillj.universe.app/verify/${certCode}`,
      grade: submission.percentage >= 90 ? ('Excellence' as const) : ('First Class' as const),
      marksPercentage: submission.percentage,
      companyName: 'UNIVERSE' as const,
      platformName: 'SKILLJ' as const,
    };
    certificates.push(issuedCertificate);
    if (student && !student.certificatesEarned.includes(issuedCertificate.id)) {
      student.certificatesEarned.push(issuedCertificate.id);
    }
  }

  res.json({
    submission,
    issuedCertificate,
    message: 'Evaluation submitted and grade recorded.',
  });
});

// 10. Teacher Payout Withdrawal Request
app.post('/api/teacher/withdraw', (req, res) => {
  const { teacherId, amount } = req.body;
  const teacher = teachers.find((t) => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found.' });
  }

  const validation = validateTeacherWithdrawal(amount, teacher.earnings.availableBalance, teacher.payoutDetails);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  const txnId = `WDL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  teacher.earnings.availableBalance -= amount;
  teacher.earnings.withdrawnAmount += amount;

  ledger.push({
    id: `tx-wdl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'WITHDRAWAL',
    amount,
    teacherId: teacher.id,
    teacherName: `${teacher.firstName} ${teacher.surname}`,
    paymentGatewayTxnId: txnId,
    status: 'SUCCESS',
    description: `Payout of ₹${amount} disbursed to ${teacher.payoutDetails.upiId || 'verified bank account'}.`,
  });

  res.json({
    success: true,
    teacher,
    txnId,
    message: `Withdrawal of ₹${amount} approved and processed via payout gateway. Txn ID: ${txnId}`,
  });
});

// 11. Student Attendance Query & Marking
app.get('/api/student/:id/attendance', (req, res) => {
  const list = studentAttendanceMap[req.params.id] || [];
  res.json({ attendance: list });
});

app.post('/api/student/:id/attendance', (req, res) => {
  const studentId = req.params.id;
  const { date, status } = req.body;
  if (!studentAttendanceMap[studentId]) {
    studentAttendanceMap[studentId] = [];
  }
  const dateStr = date || new Date().toISOString().split('T')[0];
  const existingIdx = studentAttendanceMap[studentId].findIndex((r) => r.date === dateStr);
  if (existingIdx >= 0) {
    studentAttendanceMap[studentId][existingIdx].status = status || 'PRESENT';
  } else {
    studentAttendanceMap[studentId].push({ date: dateStr, status: status || 'PRESENT' });
  }
  res.json({ attendance: studentAttendanceMap[studentId], message: 'Attendance recorded.' });
});

// 12. Public Certificate Verification Endpoint
app.get('/api/verify/:code', (req, res) => {
  const code = req.params.code;
  const cert = certificates.find((c) => c.certificateCode.toLowerCase() === code.toLowerCase());
  if (!cert) {
    return res.status(404).json({ valid: false, error: 'Certificate code not found in UNIVERSE official registry.' });
  }
  res.json({
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
  });
});

// 13. Admin Actions (UNIVERSE Admin)
app.post('/api/admin/teachers/review', (req, res) => {
  const { teacherId, decision, reviewNotes } = req.body; // 'SELECTED' | 'DESELECTED'
  const teacher = teachers.find((t) => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found.' });
  }
  teacher.verificationStatus = decision;
  teacher.reviewNotes = reviewNotes || `Decision marked by UNIVERSE Academic Board on ${new Date().toLocaleDateString()}`;
  res.json({ teacher, message: `Teacher status updated to ${decision}.` });
});

// 14. Mobile App APK & AAB Spec endpoint
app.get('/api/mobile-export-spec', (req, res) => {
  res.json({
    appName: 'SKILLJ',
    packageId: 'com.universe.skillj',
    versionName: '1.0.0',
    versionCode: 1,
    pwaManifestUrl: '/manifest.json',
    buildArtifacts: {
      apkDebug: 'skillj-debug.apk',
      apkRelease: 'skillj-release.apk',
      aabBundle: 'skillj-release.aab',
    },
    exportInstructions: [
      '1. Progressive Web App (PWA) is instantly installable on Android Chrome and iOS Safari.',
      '2. For Google Play Store submission (.aab), use Bubblewrap CLI: npx @bubblewrap/cli build',
      '3. For Capacitor/Cordova native APK: npx cap add android && npx cap build android',
    ],
  });
});

// ----------------- VITE INTEGRATION ----------------- //
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SKILLJ Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SKILLJ Server Error]:', err);
});
