import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTeacherInterview } from './teacherAssessment';
import { evaluateStudentBasicTest } from './studentTest';
import { calculateTeacherPayout, validateTeacherWithdrawal, reallocateTeacherSubscription } from './financialLedger';
import { maskAadhaar, maskPan, maskMobile, maskUpiId } from './security';
import { computeMonthlyAttendance } from './attendance';

test('Teacher interview evaluation selects candidate scoring >= 40', () => {
  const result = evaluateTeacherInterview(
    {
      ageAnswer: '32',
      nameAnswer: 'Dr. Priya Sharma',
      teachAnswer: 'Data Science, Machine Learning, and Python',
      cvFileName: 'priya_sharma_cv.pdf',
      aboutAnswer: 'PhD in Computer Science with 8 years of teaching experience across premier institutes.',
    },
    0
  );

  assert.equal(result.attemptNumber, 1);
  assert.equal(result.score, 100);
  assert.equal(result.status, 'SELECTED');
  assert.ok(result.feedback.includes('APPROVED'));
});

test('Teacher interview handles DESELECTED under 35 and MANUAL_REVIEW between 35 and 39', () => {
  // Below 35
  const lowResult = evaluateTeacherInterview(
    {
      ageAnswer: '',
      nameAnswer: 'A',
      teachAnswer: 'Hi',
      cvFileName: '',
      aboutAnswer: 'Short',
    },
    0
  );
  assert.ok(lowResult.score < 35);
  assert.equal(lowResult.status, 'DESELECTED');

  // Manual review candidate (score 35 or between 35 and 39)
  // age valid (20), name short (10), about short (5) = 35 marks
  const reviewResult = evaluateTeacherInterview(
    {
      ageAnswer: '28',
      nameAnswer: 'Sam',
      teachAnswer: '',
      cvFileName: '',
      aboutAnswer: 'Hi teacher',
    },
    1
  );
  assert.equal(reviewResult.score, 35);
  assert.equal(reviewResult.status, 'MANUAL_REVIEW');
});

test('Teacher interview enforces maximum 3 attempts', () => {
  assert.throws(() => {
    evaluateTeacherInterview(
      {
        ageAnswer: '30',
        nameAnswer: 'Vikram',
        teachAnswer: 'Physics',
        cvFileName: 'cv.pdf',
        aboutAnswer: 'Physics tutor with passion',
      },
      3
    );
  }, /Maximum of 3 interview attempts reached/);
});

test('Student basic test calculates 10 marks and recommends appropriate pathway', () => {
  const result = evaluateStudentBasicTest({
    name: 'Aarav Patel',
    location: 'Mumbai, India',
    hobby: 'Robotics and Cricket',
    readingInterest: 'Science Fiction and Tech Blogs',
    aspiration: 'Class 10th CBSE Board Exam Preparation',
  });

  assert.equal(result.totalMarks, 10);
  assert.equal(result.marksObtained, 10);
  assert.equal(result.completionStatus, 'COMPLETED');
  assert.equal(result.recommendedCategory, 'EDUCATION');
});

test('Financial ledger verifies 80/20 teacher payout split and withdrawal guardrails', () => {
  const monthlySplit = calculateTeacherPayout(250);
  assert.equal(monthlySplit.teacherShare, 200);
  assert.equal(monthlySplit.platformShare, 50);

  const yearlySplit = calculateTeacherPayout(3000);
  assert.equal(yearlySplit.teacherShare, 2400);
  assert.equal(yearlySplit.platformShare, 600);

  // Withdrawal validation
  const invalidAmount = validateTeacherWithdrawal(50, 500, { upiId: 'teacher@upi' });
  assert.equal(invalidAmount.isValid, false);
  assert.ok(invalidAmount.error?.includes('Minimum withdrawal amount'));

  const insufficient = validateTeacherWithdrawal(2000, 500, { upiId: 'teacher@upi' });
  assert.equal(insufficient.isValid, false);
  assert.ok(insufficient.error?.includes('Insufficient balance'));

  const valid = validateTeacherWithdrawal(500, 1000, { upiId: 'teacher@okhdfcbank' });
  assert.equal(valid.isValid, true);
});

test('Teacher transfer ledger proration is transparent and correct', () => {
  // ₹250 monthly plan (teacher share = ₹200). Switched after 15 days out of 30 days.
  const realloc = reallocateTeacherSubscription(250, 15, 30);
  assert.equal(realloc.retainedByOldTeacher, 100);
  assert.equal(realloc.transferredToNewTeacher, 100);
});

test('Sensitive information masking conceals confidential numbers', () => {
  assert.equal(maskAadhaar('7890'), 'XXXX-XXXX-7890');
  assert.equal(maskPan('123A'), 'XXXXXX123A');
  assert.equal(maskMobile('9876543210'), '+91 98•••• •210');
  assert.equal(maskUpiId('priya123@okhdfcbank'), 'pr••••@okhdfcbank');
});

test('Attendance calculation computes correct counts and percentage', () => {
  const stats = computeMonthlyAttendance(2026, 10, [
    { date: '2026-11-01', status: 'PRESENT' },
    { date: '2026-11-02', status: 'PRESENT' },
    { date: '2026-11-03', status: 'ABSENT' },
    { date: '2026-11-04', status: 'PRESENT' },
  ]);

  assert.equal(stats.totalPresent, 3);
  assert.equal(stats.totalAbsent, 1);
  assert.equal(stats.percentage, 75);
  assert.equal(stats.calendarDays.length, 30); // November has 30 days
});
