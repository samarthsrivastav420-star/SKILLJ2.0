export interface StudentBasicTestAnswers {
  name: string;
  location: string;
  hobby: string;
  readingInterest: string;
  aspiration: string; // Question 5: What do you do / aspire to do
}

export interface StudentBasicTestResult {
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  completionStatus: 'COMPLETED' | 'INCOMPLETE';
  recommendedCategory: 'SKILL' | 'COURSE' | 'EDUCATION';
  recommendedTopic: string;
}

export function evaluateStudentBasicTest(answers: StudentBasicTestAnswers): StudentBasicTestResult {
  let marksObtained = 0;

  // Q1: What is your name? (2 marks)
  if (answers.name && answers.name.trim().length >= 2) {
    marksObtained += 2;
  }

  // Q2: Where do you live? (2 marks)
  if (answers.location && answers.location.trim().length >= 2) {
    marksObtained += 2;
  }

  // Q3: What is your hobby? (2 marks)
  if (answers.hobby && answers.hobby.trim().length >= 2) {
    marksObtained += 2;
  }

  // Q4: What do you read? (2 marks)
  if (answers.readingInterest && answers.readingInterest.trim().length >= 2) {
    marksObtained += 2;
  }

  // Q5: What do you do? (2 marks) + determines path
  if (answers.aspiration && answers.aspiration.trim().length >= 2) {
    marksObtained += 2;
  }

  const asp = (answers.aspiration || '').toLowerCase();
  let recommendedCategory: 'SKILL' | 'COURSE' | 'EDUCATION' = 'SKILL';
  let recommendedTopic = 'Full-Stack Web & Software Engineering';

  if (asp.includes('school') || asp.includes('class') || asp.includes('10th') || asp.includes('12th') || asp.includes('board') || asp.includes('college') || asp.includes('degree')) {
    recommendedCategory = 'EDUCATION';
    recommendedTopic = 'Class 10th & 12th Board Academic Excellence';
  } else if (asp.includes('code') || asp.includes('python') || asp.includes('react') || asp.includes('course') || asp.includes('certificate')) {
    recommendedCategory = 'COURSE';
    recommendedTopic = 'Python & Full-Stack Development Bootcamp';
  } else {
    recommendedCategory = 'SKILL';
    recommendedTopic = 'Modern High-Income Digital & Tech Skills';
  }

  return {
    totalMarks: 10,
    marksObtained,
    percentage: (marksObtained / 10) * 100,
    completionStatus: marksObtained >= 6 ? 'COMPLETED' : 'INCOMPLETE',
    recommendedCategory,
    recommendedTopic,
  };
}
