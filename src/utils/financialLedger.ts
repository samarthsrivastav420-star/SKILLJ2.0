export interface PlanConfig {
  id: 'MONTHLY' | 'YEARLY';
  name: string;
  priceInRupees: number;
  durationDays: number;
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<'MONTHLY' | 'YEARLY', PlanConfig> = {
  MONTHLY: {
    id: 'MONTHLY',
    name: 'SKILLJ Monthly Access',
    priceInRupees: 250,
    durationDays: 30,
    description: 'Full 30-day access to locked lectures, ebooks, live sessions, and monthly tests.',
  },
  YEARLY: {
    id: 'YEARLY',
    name: 'SKILLJ Yearly All-Access',
    priceInRupees: 3000,
    durationDays: 365,
    description: 'Full 365-day access to all courses, live masterclasses, monthly exams, and the Grand Yearly Exam.',
  },
};

export const PLATFORM_TEACHER_COMMISSION_PERCENT = 80; // 80% to teacher, 20% to UNIVERSE platform

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: 'STUDENT_SUBSCRIPTION' | 'TEACHER_CREDIT' | 'PLATFORM_FEE' | 'TEACHER_WITHDRAWAL' | 'TEACHER_REALLOCATION';
  amount: number;
  studentId?: string;
  teacherId?: string;
  description: string;
}

export function calculateTeacherPayout(planPrice: number): {
  teacherShare: number;
  platformShare: number;
} {
  const teacherShare = Math.round((planPrice * PLATFORM_TEACHER_COMMISSION_PERCENT) / 100);
  const platformShare = planPrice - teacherShare;
  return { teacherShare, platformShare };
}

export function validateTeacherWithdrawal(
  requestedAmount: number,
  availableBalance: number,
  payoutAccount: { upiId?: string; bankAccount?: string; ifsc?: string }
): { isValid: boolean; error?: string } {
  if (!requestedAmount || requestedAmount <= 0) {
    return { isValid: false, error: 'Withdrawal amount must be greater than ₹0.' };
  }
  if (requestedAmount < 100) {
    return { isValid: false, error: 'Minimum withdrawal amount on SKILLJ is ₹100.' };
  }
  if (requestedAmount > availableBalance) {
    return {
      isValid: false,
      error: `Insufficient balance. You requested ₹${requestedAmount}, but only ₹${availableBalance} is currently available.`,
    };
  }
  const hasUpi = Boolean(payoutAccount.upiId && payoutAccount.upiId.includes('@'));
  const hasBank = Boolean(payoutAccount.bankAccount && payoutAccount.ifsc);
  if (!hasUpi && !hasBank) {
    return {
      isValid: false,
      error: 'Please configure a verified UPI ID or Bank Account & IFSC before requesting withdrawal.',
    };
  }
  return { isValid: true };
}

/**
 * Calculates fair transfer ledger allocation when a student switches their selected teacher.
 * Previous teacher retains earnings for past days; remaining prorated share transfers to the new teacher.
 */
export function reallocateTeacherSubscription(
  totalSubscriptionAmount: number,
  daysElapsed: number,
  totalDays: number
): {
  retainedByOldTeacher: number;
  transferredToNewTeacher: number;
} {
  const totalTeacherShare = Math.round((totalSubscriptionAmount * PLATFORM_TEACHER_COMMISSION_PERCENT) / 100);
  const fractionElapsed = Math.min(1, Math.max(0, daysElapsed / totalDays));
  const retainedByOldTeacher = Math.round(totalTeacherShare * fractionElapsed);
  const transferredToNewTeacher = totalTeacherShare - retainedByOldTeacher;

  return {
    retainedByOldTeacher,
    transferredToNewTeacher,
  };
}
