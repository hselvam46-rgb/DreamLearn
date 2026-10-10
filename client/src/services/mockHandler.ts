import {
  DEMO_ADMIN,
  DEMO_STUDENT,
  DEMO_COURSES,
  DEMO_CURRICULUM,
  DEMO_ASSESSMENTS,
  DEMO_PROBLEMS,
  DEMO_COMPANIES,
} from './mockData';

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

  // Strip query string for route matching
  const [routePath] = endpoint.split('?');

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

  // 2. Courses
  if (routePath === '/courses') {
    return {
      success: true,
      courses: DEMO_COURSES,
      total: DEMO_COURSES.length,
    } as T;
  }

  if (routePath === '/courses/user/my-enrollments') {
    const enrollments = [
      {
        _id: 'enr_001',
        studentId: DEMO_STUDENT._id,
        courseId: DEMO_COURSES[0],
        enrolledAt: '2026-01-20T00:00:00.000Z',
        status: 'active',
        progressPercentage: 65,
        completedLessons: ['les_001'],
      },
      {
        _id: 'enr_002',
        studentId: DEMO_STUDENT._id,
        courseId: DEMO_COURSES[1],
        enrolledAt: '2026-02-01T00:00:00.000Z',
        status: 'active',
        progressPercentage: 25,
        completedLessons: [],
      },
    ];
    return { success: true, enrollments } as T;
  }

  if (routePath.startsWith('/courses/') && routePath.endsWith('/curriculum')) {
    const modules = DEMO_CURRICULUM['crs_001'] || [];
    return { success: true, modules } as T;
  }

  if (routePath.startsWith('/courses/lessons/') && routePath.endsWith('/content')) {
    const lesson = DEMO_CURRICULUM['crs_001'][0].lessons[0];
    return { success: true, lesson } as T;
  }

  if (routePath.startsWith('/courses/') && routePath.endsWith('/enroll')) {
    return { success: true, message: 'Successfully enrolled in course!' } as T;
  }

  if (routePath === '/courses/progress/toggle-lesson') {
    return { success: true, isCompleted: true, message: 'Lesson progress updated' } as T;
  }

  if (routePath.startsWith('/courses/') && routePath.endsWith('/user-progress')) {
    return {
      success: true,
      progress: {
        progressPercentage: 65,
        completedLessons: ['les_001'],
      },
    } as T;
  }

  if (routePath.startsWith('/courses/')) {
    const slugOrId = routePath.replace('/courses/', '');
    const course =
      DEMO_COURSES.find((c) => c.slug === slugOrId || c._id === slugOrId) ||
      DEMO_COURSES[0];
    return { success: true, course } as T;
  }

  // 3. Assessments
  if (routePath === '/assessments') {
    return {
      success: true,
      assessments: DEMO_ASSESSMENTS,
      total: DEMO_ASSESSMENTS.length,
    } as T;
  }

  if (routePath.startsWith('/assessments/') && routePath.endsWith('/start')) {
    return {
      success: true,
      assessment: DEMO_ASSESSMENTS[0],
      attemptId: 'att_demo_' + Date.now(),
    } as T;
  }

  if (routePath.startsWith('/assessments/') && routePath.endsWith('/submit')) {
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
      },
    } as T;
  }

  if (routePath.startsWith('/assessments/attempts/')) {
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
        assessment: DEMO_ASSESSMENTS[0],
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

    // If batch test cases provided (assessment / problem submission)
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

    // Extract print/log outputs from common languages
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

    // If template code was run or general code
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
    const enrollments = [
      {
        _id: 'enr_001',
        studentId: DEMO_STUDENT._id,
        courseId: DEMO_COURSES[0],
        enrolledAt: '2026-01-20T00:00:00.000Z',
        status: 'active',
        progressPercentage: 65,
        completedLessons: ['les_001'],
      },
      {
        _id: 'enr_002',
        studentId: DEMO_STUDENT._id,
        courseId: DEMO_COURSES[1],
        enrolledAt: '2026-02-01T00:00:00.000Z',
        status: 'active',
        progressPercentage: 25,
        completedLessons: [],
      },
    ];

    return {
      success: true,
      enrollments,
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
        enrolledCoursesCount: 2,
        completedLessonsCount: 14,
        solvedProblemsCount: 104,
        completedAssessmentsCount: 8,
        averageAssessmentScore: 82,
        streak: { current: 7, longest: 14 },
      },
    } as T;
  }

  // 8. Admin APIs
  if (routePath === '/admin/analytics/overview') {
    return {
      success: true,
      stats: {
        totalStudents: 148,
        activeStudents: 142,
        totalCourses: 3,
        publishedCourses: 3,
        draftCourses: 0,
        totalEnrollments: 285,
        completedEnrollments: 142,
        courseCompletionRate: 74,
        totalAssessments: 4,
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

  if (routePath === '/admin/courses') {
    return { success: true, courses: DEMO_COURSES } as T;
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

  if (routePath === '/admin/assessments') {
    return { success: true, assessments: DEMO_ASSESSMENTS } as T;
  }

  if (routePath === '/admin/questions') {
    return { success: true, questions: DEMO_ASSESSMENTS[0].questions } as T;
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
