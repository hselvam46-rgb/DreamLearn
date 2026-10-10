export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  avatar?: string;
  phone?: string;
  college?: string;
  graduationYear?: number;
  targetCompany?: string;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  placementReadiness: {
    score: number;
    solvedCount: number;
    assessmentsCompleted: number;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface CoursePdfNote {
  _id?: string;
  title: string;
  url: string;
  description?: string;
  fileSize?: string;
}

export interface Lesson {
  _id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  contentType: 'video' | 'article' | 'code' | 'quiz' | 'pdf';
  contentText?: string;
  videoUrl?: string;
  pdfUrl?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  durationMinutes: number;
  isPreview: boolean;
  isPublished: boolean;
  attachments?: { title: string; url: string }[];
}

export interface Module {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  lessons: Lesson[];
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  pdfNotes?: CoursePdfNote[];
  syllabusUrl?: string;
  category: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Advanced';
  duration: string;
  learningOutcomes: string[];
  prerequisites: string[];
  instructor: {
    name: string;
    title: string;
    avatar?: string;
    bio?: string;
  };
  status: 'Draft' | 'Published' | 'Unpublished' | 'Archived';
  rating: number;
  ratingCount: number;
  enrolledCount: number;
  featured: boolean;
  modulesCount?: number;
  lessonsCount?: number;
  enrollmentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: Course;
  enrolledAt: string;
  progressPercentage: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  lastAccessedLessonId?: string;
  status: 'active' | 'completed' | 'dropped';
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  _id: string;
  text: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'mcq' | 'coding' | 'range' | 'case_based' | 'boolean';
  options: QuestionOption[];
  correctAnswerId?: string; // only returned in admin or post-submission review
  explanation?: string;
  points: number;
  // Custom numeric range fields
  rangeMin?: number;
  rangeMax?: number;
  exactAnswer?: number;
  tolerance?: number;
  // Code test fields with language restrictions
  allowedLanguages?: string[];
  defaultLanguage?: string;
  starterCode?: string;
  testCases?: Array<{ input: string; expectedOutput: string; isHidden?: boolean }>;
  // Case study fields
  caseStudyText?: string;
  scenarioTitle?: string;
}

export interface Assessment {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  courseId?: string;
  durationMinutes: number;
  passingScore: number;
  attemptsAllowed: number;
  status: 'Draft' | 'Published' | 'Archived';
  questions: Question[];
  totalQuestions: number;
  userAttemptsCount?: number;
  bestPercentage?: number | null;
  totalAttempts?: number;
  averagePercentage?: number;
}

export interface AssessmentAttempt {
  _id: string;
  studentId: string | User;
  assessmentId: string | Assessment;
  answers: {
    questionId: Question;
    selectedOptionId: string;
    isCorrect: boolean;
  }[];
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  startedAt: string;
  submittedAt?: string;
  status: 'in_progress' | 'completed' | 'timed_out';
}

export interface CodingProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python?: string;
    cpp?: string;
    c?: string;
    java?: string;
    javascript?: string;
  };
  sampleTestCases?: {
    input: string;
    expectedOutput: string;
  }[];
  testCases?: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }[];
  acceptanceRate: number;
  submissionsCount?: number;
  solved?: boolean;
}

export interface CodeSubmission {
  _id: string;
  studentId: string;
  problemId: string | CodingProblem;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  passedTestCases: number;
  totalTestCases: number;
  runtimeMs: number;
  outputLog?: string;
  submittedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  industry: string;
  description: string;
  hiringRoles: string[];
  salaryRange: string;
  difficulty: 'Medium' | 'Hard' | 'Very Hard';
  interviewRounds: {
    roundNumber: number;
    title: string;
    description: string;
    duration: string;
  }[];
  frequentlyAskedTopics: string[];
  preparationResources: {
    title: string;
    category: string;
    link: string;
    description?: string;
  }[];
  featured: boolean;
}

export interface Certificate {
  _id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseId: Course | string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
  grade: string;
}

export interface AuditLog {
  _id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
