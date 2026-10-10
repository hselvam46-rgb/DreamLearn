import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, 
  BookOpen, 
  FileCheck2, 
  CheckCircle2, 
  PlusCircle, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.admin.getAnalyticsOverview()
      .then((res) => {
        if (res.stats) setStats(res.stats);
        if (res.recentStudents) setRecentStudents(res.recentStudents);
        if (res.recentAttempts) setRecentAttempts(res.recentAttempts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#165DCE] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading administrative platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome & Quick Actions */}
      <div className="bg-white rounded-3xl border border-[#E1E8F2] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#165DCE] text-xs font-black uppercase tracking-wider mb-2 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102344] tracking-tight">
            Governance & Analytics Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Real-time metrics across student enrollments, curriculum publication, and assessment pass rates.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/courses"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#165DCE] hover:bg-[#124cb0] shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Courses</span>
          </Link>

          <Link
            to="/admin/questions"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#102344] bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-[#165DCE]" />
            <span>Question Bank</span>
          </Link>

          <Link
            to="/admin/students"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#102344] bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#165DCE]" />
            <span>Student Registry</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#165DCE] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#102344]">{stats?.totalStudents || 0}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {stats?.activeStudents || 0} Active
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Registered student learner accounts
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Course Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#165DCE] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#102344]">{stats?.totalCourses || 0}</span>
            <span className="text-xs font-bold text-[#165DCE] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              {stats?.publishedCourses || 0} Published
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            {stats?.draftCourses || 0} currently in Draft state
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Enrollments</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#102344]">{stats?.totalEnrollments || 0}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {stats?.courseCompletionRate || 0}% Completion
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Active curriculum enrollments
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Assessments Taken</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#102344]">{stats?.totalAttempts || 0}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              {stats?.assessmentPassRate || 0}% Pass Rate
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Verified candidate test submissions
          </span>
        </div>

      </div>

      {/* Tables Row: Recent Students & Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Students Table (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E1E8F2] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#102344]">Recently Registered Students</h3>
            <Link to="/admin/students" className="text-xs font-bold text-[#165DCE] hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#E1E8F2]">
            {recentStudents.map((st) => (
              <div key={st._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#102344] block">{st.name}</span>
                  <span className="text-slate-500 text-[11px] font-mono">{st.email}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      st.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    {st.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(st.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assessment Attempts Table (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E1E8F2] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#102344]">Recent Assessment Submissions</h3>
            <Link to="/admin/assessments" className="text-xs font-bold text-[#165DCE] hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#E1E8F2]">
            {recentAttempts.map((att) => (
              <div key={att._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#102344] block">{att.studentId?.name || 'Student'}</span>
                  <span className="text-slate-500 text-[11px]">{att.assessmentId?.title || 'Mock Test'}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black text-sm block ${
                      att.passed ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {att.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {att.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
