export type UserRole = 'student' | 'teacher' | 'admin';

export type CategoryType = 'SKILL' | 'COURSE' | 'EDUCATION';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  firstName: string;
  surname: string;
  username: string; // begins with @
  photoUrl: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  username: string; // e.g. @rahul_sharma
  firstName: string;
  surname: string;
  dob: string;
  fatherName: string;
  motherName: string;
  country: string;
  address: string;
  mobileNumber: string;
  whatsAppNumber: string;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  currentClass: string;
  previouslyPassedClass: string;
  schoolOrCollege: string;
  preferredLanguage: string;
  maskedPaymentAccount: string;
  photoUrl: string;
  
  // Basic test & preferences
  basicTestCompleted: boolean;
  basicTestResult?: {
    totalMarks: number;
    marksObtained: number;
    completionStatus: 'COMPLETED' | 'INCOMPLETE';
    recommendedCategory: CategoryType;
    recommendedTopic: string;
    completedAt: string;
  };
  selectedCategory: CategoryType;
  selectedTeacherId?: string;

  // Subscription
  subscription: {
    plan: 'MONTHLY' | 'YEARLY' | 'NONE';
    status: 'ACTIVE' | 'EXPIRED' | 'NONE';
    validUntil?: string;
    amountPaid?: number;
    paymentId?: string;
    activatedAt?: string;
  };

  // Activity stats
  level: string;
  watchedVideosCount: number;
  learningTimeMinutes: number;
  completedCoursesCount: number;
  certificatesEarned: string[]; // Certificate IDs
}

export interface TeacherInterviewAttempt {
  attemptNumber: number;
  score: number;
  maxScore: number;
  breakdown: {
    ageMarks: number;
    nameMarks: number;
    teachMarks: number;
    cvMarks: number;
    aboutMarks: number;
  };
  status: 'SELECTED' | 'DESELECTED' | 'MANUAL_REVIEW';
  feedback: string;
  cvFileName: string;
  submittedAt: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  username: string; // e.g. @prof_anita
  firstName: string;
  surname: string;
  fatherName: string;
  motherName: string;
  gmail: string;
  mobileNumber: string;
  whatsAppNumber: string;
  country: string;
  preferredLanguage: string;
  address: string;
  degreeDiploma: string;
  teachingExperienceYears: number;
  teachingCategory: CategoryType;
  subCategoryOrSkills: string[];
  photoUrl: string;

  // Masked government IDs & payment
  maskedAadhaar: string;
  maskedPan: string;
  maskedPayoutAccount: string;
  payoutDetails: {
    upiId?: string;
    bankAccount?: string;
    ifsc?: string;
  };

  // Assessment & verification
  verificationStatus: 'PENDING' | 'SELECTED' | 'DESELECTED' | 'MANUAL_REVIEW';
  interviewAttempts: TeacherInterviewAttempt[];
  reviewNotes?: string;

  // Teaching stats
  studentCount: number;
  rating: number;
  reviewsCount: number;
  bio: string;

  // Financial balance
  earnings: {
    totalEarnings: number;
    availableBalance: number;
    pendingPayments: number;
    withdrawnAmount: number;
  };
}

export interface CourseContentItem {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherPhoto: string;
  title: string;
  description: string;
  category: CategoryType;
  type: 'VIDEO' | 'EBOOK' | 'LIVE' | 'POST' | 'HEADLINE';
  mediaUrl?: string;
  thumbnailUrl: string;
  duration?: string;
  viewsCount: number;
  tags: string[];
  language: string;
  publishedAt: string;
  isLocked: boolean; // locked before subscription payment
  ebookDownloadUrl?: string;
  ebookPages?: number;
}

export interface LiveSession {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherPhoto: string;
  title: string;
  description: string;
  category: CategoryType;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  startedAt?: string;
  scheduledFor: string;
  viewersCount: number;
  durationMinutes: number;
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  marks: number;
  options?: string[]; // for multiple choice
  correctAnswer?: string;
  type: 'MCQ' | 'DESCRIPTIVE';
}

export interface Exam {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  type: 'MONTHLY' | 'YEARLY';
  category: CategoryType;
  totalMarks: number; // 100 for Monthly, 550 for Yearly
  syllabus: string;
  instructions: string;
  examDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  durationMinutes: number;
  isPublished: boolean;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED';
  questions: ExamQuestion[];
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  examType: 'MONTHLY' | 'YEARLY';
  studentId: string;
  studentName: string;
  studentUsername: string;
  submittedAt: string;
  answers: Record<string, string>;
  marksObtained?: number;
  totalMarks: number;
  percentage?: number;
  status: 'SUBMITTED' | 'EVALUATED';
  teacherFeedback?: string;
  evaluatedAt?: string;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  studentId: string;
  studentName: string;
  courseTitle: string;
  category: CategoryType;
  teacherId: string;
  teacherName: string;
  issueDate: string;
  verificationQrCodeUrl: string;
  grade: 'Distinction' | 'First Class' | 'Excellence';
  marksPercentage: number;
  companyName: 'UNIVERSE';
  platformName: 'SKILLJ';
}

export interface TransactionLedgerEntry {
  id: string;
  timestamp: string;
  type: 'SUBSCRIPTION_PAYMENT' | 'TEACHER_SHARE' | 'PLATFORM_COMMISSION' | 'WITHDRAWAL' | 'TEACHER_TRANSFER_REALLOCATION';
  amount: number;
  studentId?: string;
  studentName?: string;
  teacherId?: string;
  teacherName?: string;
  plan?: 'MONTHLY' | 'YEARLY';
  paymentGatewayTxnId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  description: string;
}

export interface PlatformComplaint {
  id: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  teacherName?: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  createdAt: string;
  resolution?: string;
}
