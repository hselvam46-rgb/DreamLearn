import {
  DEMO_ADMIN,
  DEMO_STUDENT,
  DEMO_COURSES,
  DEMO_CURRICULUM,
  DEMO_ASSESSMENTS,
  DEMO_PROBLEMS,
  DEMO_COMPANIES,
  DEMO_QUESTIONS,
} from './mockData';

const STORAGE_COURSES = 'dreamlearn_demo_courses_v2';
const STORAGE_ASSESSMENTS = 'dreamlearn_demo_assessments_v2';
const STORAGE_ENROLLMENTS = 'dreamlearn_demo_enrollments_v2';
const STORAGE_CURRICULUM = 'dreamlearn_demo_curriculum_v2';
const STORAGE_QUESTIONS = 'dreamlearn_demo_questions_v3';

export function getStoredCourses(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_COURSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  try {
    localStorage.setItem(STORAGE_COURSES, JSON.stringify(DEMO_COURSES));
  } catch (e) { }
  return [...DEMO_COURSES];
}

export function saveStoredCourses(courses: any[]) {
  try {
    localStorage.setItem(STORAGE_COURSES, JSON.stringify(courses));
  } catch (e) { }
}

export function getStoredAssessments(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_ASSESSMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  try {
    localStorage.setItem(STORAGE_ASSESSMENTS, JSON.stringify(DEMO_ASSESSMENTS));
  } catch (e) { }
  return [...DEMO_ASSESSMENTS];
}

export function saveStoredAssessments(assessments: any[]) {
  try {
    localStorage.setItem(STORAGE_ASSESSMENTS, JSON.stringify(assessments));
  } catch (e) { }
}

export function getStoredEnrollments(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_ENROLLMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) { }
  const courses = getStoredCourses();
  const initial = [
    {
      _id: 'enr_001',
      studentId: DEMO_STUDENT._id,
      courseId: courses[0] || DEMO_COURSES[0],
      enrolledAt: '2026-01-20T00:00:00.000Z',
      status: 'active',
      progressPercentage: 65,
      completedLessons: ['les_001'],
      totalLessonsCount: 12,
      completedLessonsCount: 8,
    },
    {
      _id: 'enr_002',
      studentId: DEMO_STUDENT._id,
      courseId: courses[1] || DEMO_COURSES[1],
      enrolledAt: '2026-02-01T00:00:00.000Z',
      status: 'active',
      progressPercentage: 25,
      completedLessons: [],
      totalLessonsCount: 14,
      completedLessonsCount: 3,
    },
  ];
  try {
    localStorage.setItem(STORAGE_ENROLLMENTS, JSON.stringify(initial));
  } catch (e) { }
  return initial;
}

export function saveStoredEnrollments(enrollments: any[]) {
  try {
    localStorage.setItem(STORAGE_ENROLLMENTS, JSON.stringify(enrollments));
  } catch (e) { }
}

export function getStoredCurriculum(): Record<string, any[]> {
  try {
    const raw = localStorage.getItem(STORAGE_CURRICULUM);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  try {
    localStorage.setItem(STORAGE_CURRICULUM, JSON.stringify(DEMO_CURRICULUM));
  } catch (e) { }
  return { ...DEMO_CURRICULUM };
}

export function saveStoredCurriculum(curr: Record<string, any[]>) {
  try {
    localStorage.setItem(STORAGE_CURRICULUM, JSON.stringify(curr));
  } catch (e) { }
}

export function getStoredQuestions(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_QUESTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  try {
    localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(DEMO_QUESTIONS));
  } catch (e) { }
  return [...DEMO_QUESTIONS];
}

export function saveStoredQuestions(questions: any[]) {
  try {
    localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(questions));
  } catch (e) { }
}

export function handleMockRequest<T = any>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  let body: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch (e) {
      body = {};
    }
  }

  // Strip query string for route matching and extract params
  const [routePath, queryString] = endpoint.split('?');
  const searchParams = new URLSearchParams(queryString || '');
  const categoryParam = searchParams.get('category');
  const difficultyParam = searchParams.get('difficulty');
  const searchParam = searchParams.get('search');
  const statusParam = searchParams.get('status');

  // 1. Auth routes
  if (routePath === '/auth/login' || routePath === '/auth/admin/login') {
    const isAdmin =
      routePath.includes('admin') ||
      (body.email && body.email.toLowerCase().includes('admin'));

    const user = isAdmin ? DEMO_ADMIN : DEMO_STUDENT;
    const token = isAdmin ? 'demo_jwt_token_admin_2026' : 'demo_jwt_token_student_2026';

    localStorage.setItem('dreamlearn_token', token);
    localStorage.setItem('dreamlearn_user', JSON.stringify(user));

    return {
      success: true,
      message: isAdmin ? 'Admin authorization granted.' : 'Login successful.',
      token,
      user,
    } as T;
  }

  if (routePath === '/auth/register') {
    const newUser = {
      ...DEMO_STUDENT,
      _id: 'usr_' + Date.now(),
      name: body.name || 'New Learner',
      email: body.email || 'learner@dreamlearn.edu',
    };
    const token = 'demo_jwt_token_student_2026';
    localStorage.setItem('dreamlearn_token', token);
    localStorage.setItem('dreamlearn_user', JSON.stringify(newUser));

    return {
      success: true,
      message: 'Registration successful! Welcome to DreamLearn.',
      token,
      user: newUser,
    } as T;
  }

  if (routePath === '/auth/me') {
    const saved = localStorage.getItem('dreamlearn_user');
    const user = saved ? JSON.parse(saved) : DEMO_STUDENT;
    return {
      success: true,
      user,
    } as T;
  }

  if (routePath === '/auth/change-password') {
    return { success: true, message: 'Password updated successfully.' } as T;
  }

  // 2. Courses (Student & Public)
  if (routePath === '/courses' && method === 'GET') {
    const allCourses = getStoredCourses();
    let filtered = allCourses.filter((c) => c.status === 'Published');

    if (categoryParam && categoryParam !== 'All') {
      filtered = filtered.filter(
        (c) => c.category && c.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }
    if (difficultyParam && difficultyParam !== 'All') {
      filtered = filtered.filter(
        (c) => c.difficulty && c.difficulty.toLowerCase() === difficultyParam.toLowerCase()
      );
    }
    if (searchParam && searchParam.trim()) {
      const q = searchParam.trim().toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.shortDescription?.toLowerCase().includes(q) ||
          c.topic?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      courses: filtered,
      total: filtered.length,
      count: filtered.length,
    } as T;
  }

  // Admin Courses API
  if (routePath === '/admin/courses' && method === 'GET') {
    let courses = getStoredCourses();
    if (statusParam && statusParam !== 'All') {
      courses = courses.filter((c) => c.status === statusParam);
    }
    if (searchParam && searchParam.trim()) {
      const q = searchParam.trim().toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.shortDescription?.toLowerCase().includes(q)
      );
    }
    return { success: true, courses, total: courses.length } as T;
  }

  // Admin Create Course
  if ((routePath === '/admin/courses' || routePath === '/courses') && method === 'POST') {
    const title = body.title || 'Untitled Course';
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newCourse = {
      _id: 'crs_' + Date.now(),
      title,
      slug,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      category: body.category || 'Data Structures',
      topic: body.topic || 'General',
      difficulty: body.difficulty || 'Beginner to Advanced',
      duration: body.duration || '8 weeks',
      thumbnail:
        body.thumbnail ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      videoUrl: body.videoUrl || '',
      pdfNotes: Array.isArray(body.pdfNotes) ? body.pdfNotes : [],
      learningOutcomes: Array.isArray(body.learningOutcomes) ? body.learningOutcomes : [],
      prerequisites: Array.isArray(body.prerequisites) ? body.prerequisites : [],
      instructor: body.instructor || {
        name: 'DreamLearn Faculty',
        title: 'Lead Technical Educator',
      },
      status: body.status || 'Published',
      rating: 4.9,
      ratingCount: 12,
      enrolledCount: 0,
      modulesCount: 1,
      lessonsCount: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentCourses = getStoredCourses();
    saveStoredCourses([newCourse, ...currentCourses]);

    // Create starter module & lessons in curriculum for this new course
    const curr = getStoredCurriculum();
    curr[newCourse._id] = [
      {
        _id: 'mod_' + Date.now(),
        courseId: newCourse._id,
        title: 'Module 1: Orientation & Foundations',
        description: 'Comprehensive introduction and foundational concepts.',
        order: 1,
        lessons: [
          {
            _id: 'les_' + Date.now(),
            moduleId: 'mod_' + Date.now(),
            courseId: newCourse._id,
            title: 'Welcome & Curriculum Roadmap',
            description: newCourse.shortDescription,
            order: 1,
            contentType: 'video',
            durationMinutes: 15,
            videoUrl: newCourse.videoUrl || 'https://www.youtube.com/watch?v=0IAPZzGSbME',
            pdfNotesUrl: newCourse.pdfNotes[0]?.url || '',
            isPreview: true,
            isPublished: true,
          },
        ],
      },
    ];
    saveStoredCurriculum(curr);

    return {
      success: true,
      message: 'Course created successfully.',
      course: newCourse,
    } as T;
  }

  // Admin Update Course
  if (routePath.startsWith('/admin/courses/') && method === 'PATCH') {
    const courseId = routePath.replace('/admin/courses/', '').replace('/status', '');
    const currentCourses = getStoredCourses();
    let updatedCourse: any = null;

    const nextCourses = currentCourses.map((c) => {
      if (c._id === courseId || c.slug === courseId) {
        updatedCourse = {
          ...c,
          ...body,
          updatedAt: new Date().toISOString(),
        };
        return updatedCourse;
      }
      return c;
    });

    saveStoredCourses(nextCourses);
    return {
      success: true,
      message: 'Course updated successfully.',
      course: updatedCourse || currentCourses[0],
    } as T;
  }

  // Admin Delete Course
  if (routePath.startsWith('/admin/courses/') && method === 'DELETE') {
    const courseId = routePath.replace('/admin/courses/', '');
    const currentCourses = getStoredCourses();
    const nextCourses = currentCourses.filter((c) => c._id !== courseId && c.slug !== courseId);
    saveStoredCourses(nextCourses);

    // Also remove from enrollments
    const enrollments = getStoredEnrollments().filter(
      (e) => e.courseId && e.courseId._id !== courseId && e.courseId !== courseId
    );
    saveStoredEnrollments(enrollments);

    return {
      success: true,
      message: 'Course and associated curriculum deleted successfully.',
    } as T;
  }

  // Student Enroll in Course
  if (routePath.startsWith('/courses/') && routePath.endsWith('/enroll') && method === 'POST') {
    const courseId = routePath.replace('/courses/', '').replace('/enroll', '');
    const courses = getStoredCourses();
    const targetCourse = courses.find((c) => c._id === courseId || c.slug === courseId) || courses[0];

    const enrollments = getStoredEnrollments();
    const existing = enrollments.find(
      (e) => e.courseId && (e.courseId._id === targetCourse._id || e.courseId === targetCourse._id)
    );

    if (!existing) {
      const newEnrollment = {
        _id: 'enr_' + Date.now(),
        studentId: DEMO_STUDENT._id,
        courseId: targetCourse,
        enrolledAt: new Date().toISOString(),
        status: 'active',
        progressPercentage: 0,
        completedLessons: [],
        totalLessonsCount: targetCourse.lessonsCount || 8,
        completedLessonsCount: 0,
      };
      saveStoredEnrollments([newEnrollment, ...enrollments]);

      // Increment course enrolled count
      const updatedCourses = courses.map((c) =>
        c._id === targetCourse._id ? { ...c, enrolledCount: (c.enrolledCount || 0) + 1 } : c
      );
      saveStoredCourses(updatedCourses);

      return {
        success: true,
        message: `Successfully enrolled in ${targetCourse.title}!`,
        enrollment: newEnrollment,
      } as T;
    }

    return {
      success: true,
      message: 'Already enrolled in this course.',
      enrollment: existing,
    } as T;
  }

  // Student Enrollments list
  if (routePath === '/courses/user/my-enrollments') {
    const enrollments = getStoredEnrollments();
    return { success: true, enrollments } as T;
  }

  // Curriculum & Lesson content
  if (routePath.startsWith('/courses/') && routePath.endsWith('/curriculum')) {
    const courseId = routePath.replace('/courses/', '').replace('/curriculum', '');
    const curr = getStoredCurriculum();
    const modules = curr[courseId] || curr['crs_001'] || [];
    return { success: true, modules, curriculum: modules } as T;
  }

  if (routePath.startsWith('/courses/lessons/') && routePath.endsWith('/content')) {
    const lessonId = routePath.replace('/courses/lessons/', '').replace('/content', '');
    const curr = getStoredCurriculum();
    let foundLesson: any = null;

    for (const key of Object.keys(curr)) {
      for (const mod of curr[key]) {
        for (const les of mod.lessons || []) {
          if (les._id === lessonId) {
            foundLesson = les;
            break;
          }
        }
      }
    }

    const fallbackLesson = DEMO_CURRICULUM['crs_001'][0].lessons[0];
    return { success: true, lesson: foundLesson || fallbackLesson } as T;
  }

  if (routePath === '/courses/progress/toggle-lesson') {
    const enrollments = getStoredEnrollments();
    if (enrollments.length > 0) {
      enrollments[0].progressPercentage = Math.min(100, (enrollments[0].progressPercentage || 0) + 10);
      saveStoredEnrollments(enrollments);
    }
    return { success: true, isCompleted: true, message: 'Lesson progress updated' } as T;
  }

  if (routePath.startsWith('/courses/') && routePath.endsWith('/user-progress')) {
    return {
      success: true,
      completedLessonIds: ['les_001'],
      progress: {
        progressPercentage: 65,
        completedLessons: ['les_001'],
      },
    } as T;
  }

  // Single Course Details
  if (routePath.startsWith('/courses/')) {
    const slugOrId = routePath.replace('/courses/', '');
    const courses = getStoredCourses();
    const course =
      courses.find((c) => c.slug === slugOrId || c._id === slugOrId) ||
      courses[0] ||
      DEMO_COURSES[0];

    const enrollments = getStoredEnrollments();
    const isEnrolled = enrollments.some(
      (e) => e.courseId && (e.courseId._id === course._id || e.courseId === course._id)
    );

    const curr = getStoredCurriculum();
    const curriculum = curr[course._id] || curr['crs_001'] || [];

    return {
      success: true,
      course,
      curriculum,
      isEnrolled,
      studentProgress: isEnrolled ? enrollments[0] : null,
    } as T;
  }

  // 3. Assessments & Assignments
  if (routePath === '/assessments' && method === 'GET') {
    const allAssessments = getStoredAssessments();
    let filtered = allAssessments.filter((a) => a.status === 'Published');

    if (categoryParam && categoryParam !== 'All') {
      filtered = filtered.filter(
        (a) => a.category && a.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }
    if (difficultyParam && difficultyParam !== 'All') {
      filtered = filtered.filter(
        (a) => a.difficulty && a.difficulty.toLowerCase() === difficultyParam.toLowerCase()
      );
    }

    return {
      success: true,
      assessments: filtered,
      total: filtered.length,
      count: filtered.length,
    } as T;
  }

  // Admin Assessments API
  if (routePath === '/admin/assessments' && method === 'GET') {
    const assessments = getStoredAssessments();
    return { success: true, assessments, total: assessments.length } as T;
  }

  // Admin Create Assessment
  if ((routePath === '/admin/assessments' || routePath === '/assessments') && method === 'POST') {
    const title = body.title || 'Technical Assessment';
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const questionsList = Array.isArray(body.questions) ? body.questions : [];
    const questionsBank = getStoredQuestions();
    const attachedQuestions = questionsList.map((qId: string) => {
      const found = questionsBank.find((q) => q._id === qId);
      return found || { _id: qId, text: 'Question Item', points: 5, difficulty: 'Medium', type: 'mcq' };
    });

    const newAssessment = {
      _id: 'asm_' + Date.now(),
      title,
      slug,
      description: body.description || '',
      category: body.category || 'DSA',
      difficulty: body.difficulty || 'Intermediate',
      durationMinutes: Number(body.durationMinutes) || 30,
      passingScore: Number(body.passingScore) || 70,
      attemptsAllowed: Number(body.attemptsAllowed) || 3,
      status: body.status || 'Published',
      questions: attachedQuestions.length > 0 ? attachedQuestions : questionsBank.slice(0, 3),
      totalQuestions: attachedQuestions.length > 0 ? attachedQuestions.length : 3,
      totalAttempts: 0,
      averagePercentage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentAssessments = getStoredAssessments();
    saveStoredAssessments([newAssessment, ...currentAssessments]);

    return {
      success: true,
      message: 'Assessment created successfully.',
      assessment: newAssessment,
    } as T;
  }

  // Admin Update Assessment
  if (routePath.startsWith('/admin/assessments/') && method === 'PATCH') {
    const assessId = routePath.replace('/admin/assessments/', '');
    const currentAssessments = getStoredAssessments();
    let updated: any = null;

    const nextAssessments = currentAssessments.map((a) => {
      if (a._id === assessId) {
        updated = {
          ...a,
          ...body,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }
      return a;
    });

    saveStoredAssessments(nextAssessments);
    return {
      success: true,
      message: 'Assessment updated successfully.',
      assessment: updated || currentAssessments[0],
    } as T;
  }

  // Admin Delete Assessment
  if (routePath.startsWith('/admin/assessments/') && method === 'DELETE') {
    const assessId = routePath.replace('/admin/assessments/', '');
    const currentAssessments = getStoredAssessments();
    const nextAssessments = currentAssessments.filter((a) => a._id !== assessId);
    saveStoredAssessments(nextAssessments);

    return {
      success: true,
      message: 'Assessment deleted successfully.',
    } as T;
  }

  // Assessment Start
  if (routePath.startsWith('/assessments/') && routePath.endsWith('/start')) {
    const assessId = routePath.replace('/assessments/', '').replace('/start', '');
    const assessments = getStoredAssessments();
    const assessment = assessments.find((a) => a._id === assessId || a.slug === assessId) || assessments[0] || DEMO_ASSESSMENTS[0];

    return {
      success: true,
      assessment,
      attemptId: 'att_demo_' + Date.now(),
    } as T;
  }

  if (routePath.startsWith('/assessments/') && routePath.endsWith('/submit')) {
    return {
      success: true,
      attempt: {
        _id: 'att_demo_result_' + Date.now(),
        score: 15,
        totalPoints: 15,
        percentage: 100,
        passed: true,
        correctCount: 3,
        totalQuestions: 3,
        timeSpentSeconds: 420,
        status: 'completed',
        submittedAt: new Date().toISOString(),
      },
    } as T;
  }

  if (routePath.startsWith('/assessments/attempts/')) {
    const assessments = getStoredAssessments();
    return {
      success: true,
      attempt: {
        _id: 'att_demo_result',
        score: 15,
        totalPoints: 15,
        percentage: 100,
        passed: true,
        correctCount: 3,
        totalQuestions: 3,
        timeSpentSeconds: 420,
        status: 'completed',
        submittedAt: new Date().toISOString(),
        assessment: assessments[0] || DEMO_ASSESSMENTS[0],
      },
    } as T;
  }

  if (routePath === '/assessments/user/my-attempts') {
    return { success: true, attempts: [] } as T;
  }

  // 4. Code & Compiler
  if (routePath === '/code/problems') {
    return {
      success: true,
      problems: DEMO_PROBLEMS,
      total: DEMO_PROBLEMS.length,
    } as T;
  }

  if (routePath.startsWith('/code/problems/') && routePath.endsWith('/submit')) {
    return {
      success: true,
      status: 'Accepted',
      message: 'All 3 test cases passed successfully!',
      runtime: 42,
      memory: 14.2,
      score: 100,
      testResults: [
        { passed: true, input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]', actual: '[0, 1]' },
        { passed: true, input: 'nums = [3,2,4], target = 6', expected: '[1, 2]', actual: '[1, 2]' },
        { passed: true, input: 'nums = [3,3], target = 6', expected: '[0, 1]', actual: '[0, 1]' },
      ],
    } as T;
  }

  if (routePath.startsWith('/code/problems/')) {
    const slug = routePath.replace('/code/problems/', '');
    const problem = DEMO_PROBLEMS.find((p) => p.slug === slug) || DEMO_PROBLEMS[0];
    return { success: true, problem } as T;
  }

  if (routePath === '/code/run') {
    const rawCode = body.code || '';
    const lang = (body.language || 'python').toLowerCase();
    const customIn = body.customInput || '';
    let simOutput = '';

    if (Array.isArray(body.testCases) && body.testCases.length > 0) {
      const results = body.testCases.map((tc: any, idx: number) => ({
        testCaseIndex: idx + 1,
        input: tc.input || '',
        expectedOutput: tc.expectedOutput || '',
        actualOutput: tc.expectedOutput || 'Output',
        passed: true,
        executionTime: 24,
      }));
      return {
        success: true,
        overallStatus: 'Accepted',
        passedTestCases: body.testCases.length,
        totalTestCases: body.testCases.length,
        averageRuntimeMs: 25,
        results,
      } as T;
    }

    const pythonPrints = [...rawCode.matchAll(/print\s*\(\s*(?:f?["'](.*?)["']|(.*?))\s*\)/gi)];
    const jsLogs = [...rawCode.matchAll(/console\.log\s*\(\s*(?:["'](.*?)["']|(.*?))\s*\)/gi)];
    const cppCouts = [...rawCode.matchAll(/cout\s*<<\s*["'](.*?)["']/gi)];
    const cPrintfs = [...rawCode.matchAll(/printf\s*\(\s*["']([^"']+)["']/gi)];
    const javaPrints = [...rawCode.matchAll(/System\.out\.println\s*\(\s*["'](.*?)["']/gi)];

    if (pythonPrints.length > 0 && (lang.includes('py') || !lang.includes('script'))) {
      simOutput = pythonPrints
        .map((m) => (m[1] !== undefined ? m[1] : (m[2] || '').trim()))
        .filter(Boolean)
        .join('\n');
    } else if (jsLogs.length > 0 && (lang.includes('js') || lang.includes('script'))) {
      simOutput = jsLogs
        .map((m) => (m[1] !== undefined ? m[1] : (m[2] || '').trim()))
        .filter(Boolean)
        .join('\n');
    } else if (cppCouts.length > 0) {
      simOutput = cppCouts.map((m) => m[1]).join('\n');
    } else if (cPrintfs.length > 0) {
      simOutput = cPrintfs.map((m) => m[1].replace(/\\n/g, '')).join('\n');
    } else if (javaPrints.length > 0) {
      simOutput = javaPrints.map((m) => m[1]).join('\n');
    }

    if (!simOutput.trim()) {
      if (rawCode.includes('Sum of numbers')) {
        simOutput = 'Welcome to DreamLearn Online Compiler!\nSum of numbers: 15';
      } else if (rawCode.includes('Accumulated Total')) {
        simOutput = 'Welcome to DreamLearn C++ Online Compiler!\nAccumulated Total: 150';
      } else if (rawCode.includes('Result of 15 + 27')) {
        simOutput = 'Welcome to DreamLearn C Online Compiler!\nResult of 15 + 27 = 42';
      } else if (rawCode.includes('DSA Topics')) {
        simOutput = 'Welcome to DreamLearn Java Online Compiler!\nDSA Topics: [Arrays, LinkedLists, Trees, Graphs]';
      } else if (customIn.trim()) {
        simOutput = `Input received: ${customIn.trim()}\nExecution successful.`;
      } else {
        simOutput = 'hello world';
      }
    }

    return {
      success: true,
      output: simOutput,
      stdout: simOutput,
      stderr: '',
      status: 'Success',
      executionTime: 32,
      runtime: 32,
      memory: 14100,
      isError: false,
      testResults: [
        { passed: true, input: customIn || 'sample', expected: simOutput, actual: simOutput },
      ],
    } as T;
  }

  // 5. Companies
  if (routePath === '/companies') {
    return {
      success: true,
      companies: DEMO_COMPANIES,
      total: DEMO_COMPANIES.length,
    } as T;
  }

  if (routePath.startsWith('/companies/')) {
    const slug = routePath.replace('/companies/', '');
    const company = DEMO_COMPANIES.find((c) => c.slug === slug) || DEMO_COMPANIES[0];
    return { success: true, company } as T;
  }

  // 6. Certificates
  if (routePath === '/certificates/my-certificates') {
    return {
      success: true,
      certificates: [
        {
          _id: 'cert_001',
          certificateId: 'DL-2026-CERT-9482',
          courseTitle: 'Data Structures & Algorithms in C++',
          studentName: 'Hari Selvam',
          issueDate: '2026-02-15T00:00:00.000Z',
          qrCodeUrl: '',
        },
      ],
    } as T;
  }

  if (routePath.startsWith('/certificates/verify/')) {
    return {
      success: true,
      valid: true,
      certificate: {
        certificateId: 'DL-2026-CERT-9482',
        courseTitle: 'Data Structures & Algorithms in C++',
        studentName: 'Hari Selvam',
        issueDate: '2026-02-15T00:00:00.000Z',
      },
    } as T;
  }

  // 7. Student Dashboard
  if (routePath === '/student/dashboard') {
    const enrollments = getStoredEnrollments();
    const allCourses = getStoredCourses().filter((c) => c.status === 'Published');
    const allAssessments = getStoredAssessments().filter((a) => a.status === 'Published');

    return {
      success: true,
      enrollments,
      publishedCourses: allCourses,
      recentAssessments: allAssessments.slice(0, 5),
      recentSubmissions: [
        {
          _id: 'sub_001',
          problemTitle: 'Two Sum',
          problemSlug: 'two-sum',
          language: 'cpp',
          status: 'Accepted',
          submittedAt: '2026-02-14T10:30:00.000Z',
        },
      ],
      stats: {
        enrolledCoursesCount: enrollments.length,
        completedLessonsCount: 14,
        solvedProblemsCount: 104,
        completedAssessmentsCount: 8,
        averageAssessmentScore: 82,
        streak: { current: 7, longest: 14 },
      },
    } as T;
  }

  // 8. Admin Analytics & Oversight
  if (routePath === '/admin/analytics/overview') {
    const courses = getStoredCourses();
    const assessments = getStoredAssessments();
    const enrollments = getStoredEnrollments();

    return {
      success: true,
      stats: {
        totalStudents: 148,
        activeStudents: 142,
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.status === 'Published').length,
        draftCourses: courses.filter((c) => c.status === 'Draft').length,
        totalEnrollments: enrollments.length + 280,
        completedEnrollments: 142,
        courseCompletionRate: 74,
        totalAssessments: assessments.length,
        totalAttempts: 128,
        passedAttempts: 98,
        assessmentPassRate: 76,
        totalProblems: 24,
        totalSubmissions: 540,
        codeAcceptanceRate: 68,
      },
      recentStudents: [
        {
          name: 'Hari Selvam',
          email: 'student@dreamlearn.edu',
          college: 'National Institute of Technology',
          status: 'active',
          createdAt: '2026-01-15T00:00:00.000Z',
        },
        {
          name: 'Priya Sharma',
          email: 'priya.s@dreamlearn.edu',
          college: 'IIT Madras',
          status: 'active',
          createdAt: '2026-01-20T00:00:00.000Z',
        },
      ],
      recentAttempts: [
        {
          studentId: { name: 'Hari Selvam', email: 'student@dreamlearn.edu' },
          assessmentId: { title: 'DSA Diagnostic Exam' },
          score: 15,
          totalPoints: 15,
          passed: true,
          submittedAt: '2026-02-12T14:20:00.000Z',
        },
      ],
    } as T;
  }

  if (routePath === '/admin/students') {
    return {
      success: true,
      students: [
        DEMO_STUDENT,
        {
          ...DEMO_STUDENT,
          _id: 'usr_002',
          name: 'Priya Sharma',
          email: 'priya.s@dreamlearn.edu',
          college: 'IIT Madras',
          placementReadiness: { score: 91, solvedCount: 148, assessmentsCompleted: 11 },
        },
        {
          ...DEMO_STUDENT,
          _id: 'usr_003',
          name: 'Rohan Varma',
          email: 'rohan.v@dreamlearn.edu',
          college: 'BITS Pilani',
          placementReadiness: { score: 76, solvedCount: 88, assessmentsCompleted: 6 },
        },
      ],
      total: 3,
    } as T;
  }

  if (routePath.startsWith('/admin/students/')) {
    return { success: true, student: DEMO_STUDENT } as T;
  }

  if (routePath === '/admin/questions' && method === 'GET') {
    return { success: true, questions: getStoredQuestions() } as T;
  }

  if (routePath === '/admin/questions' && method === 'POST') {
    const questions = getStoredQuestions();
    const newQ = {
      _id: 'q_' + Date.now(),
      text: body.text || 'New Question',
      topic: body.topic || 'DSA',
      difficulty: body.difficulty || 'Medium',
      type: body.type || 'mcq',
      points: Number(body.points) || 5,
      options: body.options || [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
      ],
      correctAnswerId: body.correctAnswerId || 'a',
      explanation: body.explanation || '',
    };
    saveStoredQuestions([newQ, ...questions]);
    return { success: true, message: 'Question created successfully.', question: newQ } as T;
  }

  if (routePath === '/admin/problems') {
    return { success: true, problems: DEMO_PROBLEMS } as T;
  }

  if (routePath === '/admin/companies') {
    return { success: true, companies: DEMO_COMPANIES } as T;
  }

  if (routePath === '/admin/admins') {
    return { success: true, admins: [DEMO_ADMIN] } as T;
  }

  if (routePath === '/admin/audit-logs') {
    return { success: true, logs: [] } as T;
  }

  // Fallback default for any mutations
  if (method !== 'GET') {
    return {
      success: true,
      message: 'Operation performed successfully in Demo Mode.',
      data: body,
    } as T;
  }

  // Generic fallback
  return {
    success: true,
    data: [],
  } as T;
}
