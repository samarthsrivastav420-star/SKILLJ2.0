export type TeacherSelectionStatus = 'SELECTED' | 'DESELECTED' | 'MANUAL_REVIEW';

export interface TeacherInterviewSubmission {
  ageAnswer: string;
  nameAnswer: string;
  teachAnswer: string;
  cvFileName: string;
  aboutAnswer: string;
}

export interface TeacherInterviewResult {
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
  status: TeacherSelectionStatus;
  feedback: string;
}

/**
 * Calculates teacher interview marks based on prompt rubric:
 * 1. What is your age? — 20 marks
 * 2. What is your name? — 20 marks
 * 3. What do you teach? — 20 marks
 * 4. Upload your CV. — 20 marks
 * 5. Tell us about yourself. — 20 marks
 * Total: 100 marks.
 * 
 * Selection rules:
 * - 40 marks or above: SELECTED
 * - Below 35 marks: DESELECTED
 * - 35–39 marks: MANUAL REVIEW
 * Maximum 3 attempts allowed.
 */
export function evaluateTeacherInterview(
  submission: TeacherInterviewSubmission,
  currentAttemptsCount: number
): TeacherInterviewResult {
  if (currentAttemptsCount >= 3) {
    throw new Error('Maximum of 3 interview attempts reached. No further attempts permitted.');
  }

  let ageMarks = 0;
  const ageNum = parseInt(submission.ageAnswer.trim(), 10);
  if (!isNaN(ageNum) && ageNum >= 18 && ageNum <= 80) {
    ageMarks = 20;
  } else if (submission.ageAnswer.trim().length > 0) {
    ageMarks = 5;
  }

  let nameMarks = 0;
  const nameLen = submission.nameAnswer.trim().length;
  if (nameLen >= 5) {
    nameMarks = 20;
  } else if (nameLen >= 2) {
    nameMarks = 10;
  }

  let teachMarks = 0;
  const teachLen = submission.teachAnswer.trim().length;
  if (teachLen >= 15) {
    teachMarks = 20;
  } else if (teachLen >= 5) {
    teachMarks = 10;
  }

  let cvMarks = 0;
  if (submission.cvFileName && submission.cvFileName.trim().length > 0) {
    cvMarks = 20;
  }

  let aboutMarks = 0;
  const aboutLen = submission.aboutAnswer.trim().length;
  if (aboutLen >= 30) {
    aboutMarks = 20;
  } else if (aboutLen >= 15) {
    aboutMarks = 10;
  } else if (aboutLen > 0) {
    aboutMarks = 5;
  }

  const score = ageMarks + nameMarks + teachMarks + cvMarks + aboutMarks;

  let status: TeacherSelectionStatus;
  let feedback = '';

  if (score >= 40) {
    status = 'SELECTED';
    feedback = 'Congratulations! You met the qualification threshold and have been APPROVED as a verified teacher on SKILLJ.';
  } else if (score < 35) {
    status = 'DESELECTED';
    feedback = 'Your interview score fell below the 35-mark qualification standard. You may re-attempt up to 3 times.';
  } else {
    // 35 to 39
    status = 'MANUAL_REVIEW';
    feedback = 'Your application scored 35–39 marks. It has been routed to the UNIVERSE academic board for manual review.';
  }

  return {
    attemptNumber: currentAttemptsCount + 1,
    score,
    maxScore: 100,
    breakdown: {
      ageMarks,
      nameMarks,
      teachMarks,
      cvMarks,
      aboutMarks,
    },
    status,
    feedback,
  };
}
