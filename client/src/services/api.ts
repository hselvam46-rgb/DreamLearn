import { handleMockRequest } from './mockHandler';
import { executeCodeInSandbox, executeTestCasesInSandbox } from './compilerEngine';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api/v1';

export const getStoredToken = (): string | null => {
  return localStorage.getItem('dreamlearn_token');
};

export const setStoredToken = (token: string) => {
  localStorage.setItem('dreamlearn_token', token);
};

export const removeStoredToken = () => {
  localStorage.removeItem('dreamlearn_token');
  localStorage.removeItem('dreamlearn_user');
};

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      console.warn(`[Demo Mode Fallback] Backend not running for ${endpoint} (received HTML SPA rewrite). Serving interactive mock data.`);
      return handleMockRequest<T>(endpoint, options);
    }

    if (!response.ok) {
      if (
        response.status === 405 ||
        response.status === 404 ||
        response.status === 502 ||
        response.status === 503 ||
        (response.status === 401 && token?.startsWith('demo_'))
      ) {
        console.warn(`[Demo Mode Fallback] Backend returned ${response.status} for ${endpoint}. Serving interactive demo data.`);
        return handleMockRequest<T>(endpoint, options);
      }

      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    try {
      const data = await response.json();
      return data;
    } catch {
      console.warn(`[Demo Mode Fallback] Failed to parse JSON for ${endpoint}. Serving interactive mock data.`);
      return handleMockRequest<T>(endpoint, options);
    }
  } catch (err: any) {
    // If network failed entirely (e.g. offline, refused connection)
    console.warn(`[Demo Mode Fallback] Network request failed for ${endpoint}:`, err?.message);
    try {
      return handleMockRequest<T>(endpoint, options);
    } catch {
      throw err;
    }
  }
}

export function toQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'All' &&
      value !== 'undefined' &&
      value !== 'null'
    ) {
      searchParams.append(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  // Auth
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    adminLogin: (body: { email: string; password: string }) =>
      request('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => request('/auth/me'),
    updateProfile: (data: any) =>
      request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
    changePassword: (body: { currentPassword?: string; newPassword: string }) =>
      request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
  },

  // Courses
  courses: {
    getPublished: (params?: { category?: string; difficulty?: string; search?: string }) =>
      request(`/courses${toQueryString(params)}`),
    getDetails: (idOrSlug: string) => request(`/courses/${idOrSlug}`),
    getCurriculum: (courseId: string) => request(`/courses/${courseId}/curriculum`),
    getLessonContent: (lessonId: string) => request(`/courses/lessons/${lessonId}/content`),
    enroll: (courseId: string) => request(`/courses/${courseId}/enroll`, { method: 'POST' }),
    getMyEnrollments: () => request('/courses/user/my-enrollments'),
    toggleLesson: (lessonId: string, isCompleted: boolean) =>
      request('/courses/progress/toggle-lesson', {
        method: 'POST',
        body: JSON.stringify({ lessonId, isCompleted }),
      }),
    getCourseProgress: (courseId: string) => request(`/courses/${courseId}/user-progress`),
  },

  // Assessments
  assessments: {
    getPublished: (params?: { category?: string; difficulty?: string }) =>
      request(`/assessments${toQueryString(params)}`),
    start: (id: string) => request(`/assessments/${id}/start`, { method: 'POST' }),
    submit: (id: string, body: { attemptId?: string; answers: any[]; timeSpentSeconds: number }) =>
      request(`/assessments/${id}/submit`, { method: 'POST', body: JSON.stringify(body) }),
    getAttemptDetails: (attemptId: string) => request(`/assessments/attempts/${attemptId}`),
    getMyAttempts: () => request('/assessments/user/my-attempts'),
  },

  // Coding & Compiler
  code: {
    run: async (body: { language: string; code: string; customInput?: string; testCases?: any[] }): Promise<any> => {
      if (Array.isArray(body.testCases) && body.testCases.length > 0) {
        return executeTestCasesInSandbox(body.language, body.code, body.testCases);
      }
      return executeCodeInSandbox(body.language, body.code, body.customInput || '');
    },
    getProblems: (params?: { category?: string; difficulty?: string; search?: string }) =>
      request(`/code/problems${toQueryString(params)}`),
    getProblemDetails: (slug: string) => request(`/code/problems/${slug}`),
    submitProblem: async (slug: string, body: { language: string; code: string }): Promise<any> => {
      try {
        const res = await request(`/code/problems/${slug}/submit`, { method: 'POST', body: JSON.stringify(body) });
        if (res && res.evalResult && !res.message?.includes('Demo Mode')) {
          return res;
        }
      } catch (e) {}

      // Evaluate against real problem test cases via sandbox
      let problemTestCases = [
        { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      ];
      try {
        const probRes = await request(`/code/problems/${slug}`);
        if (probRes?.problem?.testCases && probRes.problem.testCases.length > 0) {
          problemTestCases = probRes.problem.testCases;
        } else if (probRes?.problem?.sampleTestCases && probRes.problem.sampleTestCases.length > 0) {
          problemTestCases = probRes.problem.sampleTestCases;
        }
      } catch (e) {}

      const batchResult = await executeTestCasesInSandbox(body.language, body.code, problemTestCases);
      return {
        success: true,
        evalResult: batchResult,
        submission: {
          _id: 'sub_' + Date.now(),
          problemSlug: slug,
          language: body.language,
          code: body.code,
          status: batchResult.overallStatus,
          runtime: batchResult.averageRuntimeMs,
          submittedAt: new Date().toISOString(),
        },
      };
    },
  },

  // Companies
  companies: {
    getAll: (params?: { search?: string; difficulty?: string }) =>
      request(`/companies${toQueryString(params)}`),
    getDetails: (slug: string) => request(`/companies/${slug}`),
  },

  // Certificates
  certificates: {
    getMy: () => request('/certificates/my-certificates'),
    verify: (identifier: string) => request(`/certificates/verify/${identifier}`),
  },

  // Student specific
  student: {
    getDashboard: () => request('/student/dashboard'),
  },

  // Admin APIs
  admin: {
    getAnalyticsOverview: () => request('/admin/analytics/overview'),
    // Courses
    getCourses: (params?: { status?: string; search?: string }) =>
      request(`/admin/courses${toQueryString(params)}`),
    createCourse: (data: any) =>
      request('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
    updateCourse: (id: string, data: any) =>
      request(`/admin/courses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    setCourseStatus: (id: string, status: string) =>
      request(`/admin/courses/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteCourse: (id: string) => request(`/admin/courses/${id}`, { method: 'DELETE' }),

    // Curriculum
    createModule: (courseId: string, data: any) =>
      request(`/admin/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) }),
    updateModule: (moduleId: string, data: any) =>
      request(`/admin/modules/${moduleId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteModule: (moduleId: string) =>
      request(`/admin/modules/${moduleId}`, { method: 'DELETE' }),

    createLesson: (courseId: string, moduleId: string, data: any) =>
      request(`/admin/courses/${courseId}/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
    updateLesson: (lessonId: string, data: any) =>
      request(`/admin/lessons/${lessonId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteLesson: (lessonId: string) =>
      request(`/admin/lessons/${lessonId}`, { method: 'DELETE' }),

    // Assessments
    getAssessments: () => request('/admin/assessments'),
    createAssessment: (data: any) =>
      request('/admin/assessments', { method: 'POST', body: JSON.stringify(data) }),
    updateAssessment: (id: string, data: any) =>
      request(`/admin/assessments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteAssessment: (id: string) => request(`/admin/assessments/${id}`, { method: 'DELETE' }),

    // Question bank
    getQuestions: (params?: { topic?: string; difficulty?: string; search?: string }) =>
      request(`/admin/questions${toQueryString(params)}`),
    createQuestion: (data: any) =>
      request('/admin/questions', { method: 'POST', body: JSON.stringify(data) }),
    updateQuestion: (id: string, data: any) =>
      request(`/admin/questions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteQuestion: (id: string) => request(`/admin/questions/${id}`, { method: 'DELETE' }),

    // Students
    getStudents: (params?: { search?: string; status?: string }) =>
      request(`/admin/students${toQueryString(params)}`),
    getStudentDetails: (id: string) => request(`/admin/students/${id}`),
    setStudentStatus: (id: string, status: string) =>
      request(`/admin/students/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getAuditLogs: () => request('/admin/audit-logs'),

    // Problems
    getProblems: () => request('/admin/problems'),
    createProblem: (data: any) =>
      request('/admin/problems', { method: 'POST', body: JSON.stringify(data) }),
    updateProblem: (id: string, data: any) =>
      request(`/admin/problems/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteProblem: (id: string) => request(`/admin/problems/${id}`, { method: 'DELETE' }),

    // Companies
    getCompanies: () => request('/admin/companies'),
    createCompany: (data: any) =>
      request('/admin/companies', { method: 'POST', body: JSON.stringify(data) }),
    updateCompany: (id: string, data: any) =>
      request(`/admin/companies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteCompany: (id: string) => request(`/admin/companies/${id}`, { method: 'DELETE' }),

    // Administrator Team Management
    getAdmins: () => request('/admin/admins'),
    createAdmin: (data: { name: string; email: string; password: string; phone?: string }) =>
      request('/admin/admins', { method: 'POST', body: JSON.stringify(data) }),
    setAdminStatus: (id: string, status: string) =>
      request(`/admin/admins/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteAdmin: (id: string) => request(`/admin/admins/${id}`, { method: 'DELETE' }),
  },
};
