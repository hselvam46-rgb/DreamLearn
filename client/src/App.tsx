import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public & Auth Pages
import { HomePage } from './pages/public/HomePage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { StudentAuthPage } from './pages/auth/StudentAuthPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { LegalPage } from './pages/public/LegalPage';
import { ContactPage } from './pages/public/ContactPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyLearningPage } from './pages/student/MyLearningPage';
import { CoursePlayerPage } from './pages/student/CoursePlayerPage';
import { AssessmentsPage } from './pages/student/AssessmentsPage';
import { AssessmentExamPage } from './pages/student/AssessmentExamPage';
import { AssessmentResultPage } from './pages/student/AssessmentResultPage';
import { CompilerPage } from './pages/student/CompilerPage';
import { PracticeProblemsPage } from './pages/student/PracticeProblemsPage';
import { ProblemWorkspacePage } from './pages/student/ProblemWorkspacePage';
import { CompaniesGuidePage } from './pages/student/CompaniesGuidePage';
import { PlacementPrepPage } from './pages/student/PlacementPrepPage';
import { CertificatesPage } from './pages/student/CertificatesPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminCurriculumPage } from './pages/admin/AdminCurriculumPage';
import { AdminAssessmentsPage } from './pages/admin/AdminAssessmentsPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminProblemsPage } from './pages/admin/AdminProblemsPage';
import { AdminCompaniesPage } from './pages/admin/AdminCompaniesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAdminsPage } from './pages/admin/AdminAdminsPage';


import { ScrollToTop } from './components/common/ScrollToTop';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/companies" element={<CompaniesGuidePage />} />
            <Route path="/placement" element={<PlacementPrepPage />} />
            <Route path="/compiler" element={<Navigate to="/student/compiler" replace />} />
            <Route path="/problems" element={<Navigate to="/student/problems" replace />} />
            <Route path="/assessments" element={<Navigate to="/student/assessments" replace />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/accessibility" element={<LegalPage type="accessibility" />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Standalone Authentication Routes */}
          <Route path="/login" element={<StudentAuthPage initialMode="login" />} />
          <Route path="/register" element={<StudentAuthPage initialMode="register" />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Student Platform Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="my-learning" element={<MyLearningPage />} />
            <Route path="learning" element={<MyLearningPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="learn/:courseId" element={<CoursePlayerPage />} />
            <Route path="learn/:courseId/lesson/:lessonId" element={<CoursePlayerPage />} />
            <Route path="courses/:courseId/learn" element={<CoursePlayerPage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="assessments/:id/take" element={<AssessmentExamPage />} />
            <Route path="assessments/:id/results/:attemptId" element={<AssessmentResultPage />} />
            <Route path="assessments/attempts/:attemptId/result" element={<AssessmentResultPage />} />
            <Route path="assessments/attempts/:attemptId" element={<AssessmentResultPage />} />
            <Route path="compiler" element={<CompilerPage />} />
            <Route path="problems" element={<PracticeProblemsPage />} />
            <Route path="practice" element={<PracticeProblemsPage />} />
            <Route path="problems/:slug" element={<ProblemWorkspacePage />} />
            <Route path="companies" element={<CompaniesGuidePage />} />
            <Route path="placement" element={<PlacementPrepPage />} />
            <Route path="placement-prep" element={<PlacementPrepPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="settings" element={<StudentProfilePage />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="courses/:courseId/curriculum" element={<AdminCurriculumPage />} />
            <Route path="assessments" element={<AdminAssessmentsPage />} />
            <Route path="questions" element={<AdminQuestionsPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="problems" element={<AdminProblemsPage />} />
            <Route path="companies" element={<AdminCompaniesPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="admins" element={<AdminAdminsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
