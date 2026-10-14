import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Course, Enrollment, Assessment, CodeSubmission } from '../../types';
import { 
  Play, 
  Flame, 
  CheckCircle2, 
  Code, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  BarChart3,
  Award
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<CodeSubmission[]>([]);
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = () => {
    Promise.all([
      api.student.getDashboard().catch(() => null),
      api.courses.getMyEnrollments().catch(() => ({ enrollments: [] })),
      api.assessments.getPublished().catch(() => ({ assessments: [] })),
      api.courses.getPublished().catch(() => ({ courses: [] })),
    ])
      .then(([dashRes, enrollRes, assessRes, courseRes]) => {
        if (dashRes?.enrollments && dashRes.enrollments.length > 0) {
          setEnrollments(dashRes.enrollments);
        } else if (enrollRes?.enrollments) {
          setEnrollments(enrollRes.enrollments);
        }

        if (dashRes?.recentSubmissions) {
          setRecentSubmissions(dashRes.recentSubmissions);
        }

        if (assessRes?.assessments) {
          setAssessments(assessRes.assessments);
        }

        if (courseRes?.courses) {
          setPublishedCourses(courseRes.courses);
        }
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await api.courses.enroll(courseId);
      fetchDashboardData();
    } catch (err: any) {
      console.error('Quick enrollment failed:', err);
    } finally {
      setEnrollingId(null);
    }
  };

  // Safe filtering: exclude corrupt or deleted course references
  const validEnrollments = enrollments.filter(
    (en) => en && en.courseId && typeof en.courseId === 'object' && en.courseId._id
  );
  const primaryEnrollment = validEnrollments[0];

  const enrolledCourseIdSet = new Set(validEnrollments.map((en) => en.courseId._id));
  const availableCoursesToEnroll = publishedCourses.filter(
    (c) => !enrolledCourseIdSet.has(c._id)
  );

  // Weekly activity mockup visualization data
  const weeklyDays = [
    { day: 'Mon', hours: 1.5, active: true },
    { day: 'Tue', hours: 2.0, active: true },
    { day: 'Wed', hours: 0.8, active: true },
    { day: 'Thu', hours: 2.5, active: true },
    { day: 'Fri', hours: 1.2, active: true },
    { day: 'Sat', hours: 3.0, active: true },
    { day: 'Sun', hours: 1.0, active: true, isToday: true },
  ];
  const maxHours = 3.5;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* 1. Header Greeting & Hero Continue-Learning Banner */}
      <div className="bg-gradient-to-r from-[#102344] via-[#143265] to-[#165DCE] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Placement Preparation Track • 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
            You're making steady progress toward technical campus placements. Continue your enrolled curriculum or practice coding problems to level up your readiness.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {primaryEnrollment ? (
              <Link
                to={`/student/learn/${primaryEnrollment.courseId._id}`}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-[#102344] bg-white hover:bg-blue-50 shadow-md transition-all flex items-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-[#165DCE] text-[#165DCE] group-hover:scale-110 transition-transform" />
                <span>Resume: {primaryEnrollment.courseId.title}</span>
              </Link>
            ) : (
              <Link
                to="/courses"
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-[#102344] bg-white hover:bg-blue-50 shadow-md transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#165DCE]" />
                <span>Explore Technical Courses</span>
              </Link>
            )}

            <Link
              to="/student/compiler"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <Code className="w-4 h-4" />
              <span>Launch Online IDE</span>
            </Link>
          </div>
        </div>

        {/* Hero student photo thumbnail badge */}
        <div className="relative shrink-0 hidden md:block">
          <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl relative">
            <img
              src="/student_hero.jpg"
              alt="Student Progress"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-center border border-white/10">
              <span className="text-[10px] font-extrabold text-emerald-400">
                {user?.placementReadiness?.score || 82}% Placement Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Quad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Placement Ready Gauge */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 -rotate-90 transform">
              <circle cx="28" cy="28" r="22" stroke="#E2E8F0" strokeWidth="4.5" fill="none" />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="#165DCE"
                strokeWidth="4.5"
                fill="none"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * (user?.placementReadiness?.score || 82)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-black text-[#102344]">
              {user?.placementReadiness?.score || 82}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Readiness</span>
            <span className="text-base font-extrabold text-[#102344] block">Placement Ready</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Top 15% in cohort
            </span>
          </div>
        </div>

        {/* Metric 2: Day Streak */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Consistency</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#102344]">{user?.streak?.current || 7}</span>
              <span className="text-xs font-bold text-slate-500">Day Streak</span>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
              Longest: {user?.streak?.longest || 14} days
            </span>
          </div>
        </div>

        {/* Metric 3: Daily Learning Goal */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#165DCE] flex items-center justify-center shrink-0 border border-blue-100">
            <Target className="w-6 h-6 text-[#165DCE]" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Daily Target</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-extrabold text-[#102344]">35 / 45 mins</span>
              <span className="text-[11px] font-bold text-[#165DCE]">78%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5">
              <div className="h-full bg-[#165DCE] rounded-full" style={{ width: '78%' }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Goal met 5/7 days this week</span>
          </div>
        </div>

        {/* Metric 4: Problems Solved */}
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Practice Bank</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#102344]">{user?.placementReadiness?.solvedCount || 104}</span>
              <span className="text-xs font-bold text-slate-500">Solved</span>
            </div>
            <Link to="/student/problems" className="text-[11px] text-[#165DCE] font-bold hover:underline block mt-0.5">
              Solve problem bank →
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Continue Learning Card (Prominent Coursera-style Hero Card if enrolled) */}
      {primaryEnrollment && (
        <div className="bg-white rounded-2xl border border-[#E1E8F2] p-6 shadow-xs hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                <img
                  src={primaryEnrollment.courseId.thumbnail}
                  alt={primaryEnrollment.courseId.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-black/75 text-white">
                  {primaryEnrollment.courseId.duration}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#165DCE] border border-blue-100">
                    {primaryEnrollment.courseId.category}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500">In Progress</span>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-[#102344] leading-snug">
                  {primaryEnrollment.courseId.title}
                </h2>

                <p className="text-xs text-slate-500 max-w-lg line-clamp-1">
                  {primaryEnrollment.courseId.shortDescription}
                </p>

                <div className="flex items-center gap-3 pt-1 text-xs text-slate-600">
                  <span className="font-bold text-[#102344]">
                    {primaryEnrollment.completedLessonsCount || 0} of {primaryEnrollment.totalLessonsCount || 10} lessons
                  </span>
                  <span>•</span>
                  <span className="font-extrabold text-[#165DCE]">
                    {primaryEnrollment.progressPercentage}% Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar & Continue CTA */}
            <div className="w-full md:w-64 space-y-3 shrink-0">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Course Progress</span>
                  <span>{primaryEnrollment.progressPercentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#165DCE] rounded-full transition-all duration-500"
                    style={{ width: `${primaryEnrollment.progressPercentage}%` }}
                  />
                </div>
              </div>

              <Link
                to={`/student/learn/${primaryEnrollment.courseId._id}`}
                className="w-full py-3 px-5 bg-[#165DCE] hover:bg-[#124cb0] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Lesson</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Enrolled Courses + Weekly Activity + Recent Coding Activity */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Weekly Learning Activity Visualization */}
          <div className="bg-white rounded-2xl border border-[#E1E8F2] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#102344] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#165DCE]" />
                  <span>Weekly Study Activity</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily hours spent learning algorithms, watching lessons, and practicing code.
                </p>
              </div>
              <span className="text-xs font-black text-[#165DCE] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                12.0 Hours Total
              </span>
            </div>

            {/* Activity Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-32 px-2">
                {weeklyDays.map((d) => {
                  const barHeight = Math.round((d.hours / maxHours) * 100);
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.hours}h
                      </span>
                      <div className="w-full max-w-[32px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            d.isToday 
                              ? 'bg-[#165DCE] shadow-xs' 
                              : 'bg-blue-300 hover:bg-[#165DCE]'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <span className={`text-[11px] font-bold ${d.isToday ? 'text-[#165DCE]' : 'text-slate-500'}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#165DCE]" />
                <span>Today's active session</span>
              </span>
              <span>Consistent 7 days this cycle 🔥</span>
            </div>
          </div>

          {/* Enrolled Courses Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#102344]">Enrolled Courses</h3>
              <Link to="/student/my-learning" className="text-xs font-bold text-[#165DCE] hover:underline">
                View all ({validEnrollments.length})
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <div className="w-8 h-8 border-3 border-[#165DCE] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : validEnrollments.length === 0 ? (
              <div className="space-y-4">
                <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <p className="text-sm font-bold text-[#102344]">No enrolled courses active yet.</p>
                  <p className="text-xs text-slate-500">Choose from newly added technical tracks below or explore the full course catalog.</p>
                  <Link to="/student/courses" className="inline-block px-4 py-2 bg-[#165DCE] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#124cb0] transition-colors">
                    Browse All Courses ({publishedCourses.length})
                  </Link>
                </div>

                {publishedCourses.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                      Newly Added & Available Courses ({publishedCourses.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {publishedCourses.map((c) => (
                        <div key={c._id} className="bg-white rounded-2xl border border-[#E1E8F2] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={c.thumbnail}
                              alt={c.title}
                              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                            />
                            <div className="space-y-1 min-w-0">
                              <span className="text-[10px] font-black text-[#165DCE] uppercase tracking-wider block truncate">
                                {c.category}
                              </span>
                              <h4 className="text-xs font-extrabold text-[#102344] leading-snug line-clamp-2">
                                {c.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 block">{c.duration} • {c.difficulty}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
                            <button
                              onClick={() => handleQuickEnroll(c._id)}
                              disabled={enrollingId === c._id}
                              className="flex-1 py-1.5 px-3 bg-[#165DCE] hover:bg-[#124cb0] disabled:opacity-50 text-white rounded-lg font-bold transition-colors cursor-pointer text-center"
                            >
                              {enrollingId === c._id ? 'Enrolling...' : 'Enroll in Course'}
                            </button>
                            <Link
                              to={`/courses/${c.slug || c._id}`}
                              className="px-3 py-1.5 bg-blue-50 text-[#165DCE] hover:bg-[#165DCE] hover:text-white rounded-lg font-bold transition-colors"
                            >
                              Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {validEnrollments.map((en) => (
                    <div
                      key={en._id}
                      className="bg-white rounded-2xl border border-[#E1E8F2] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={en.courseId.thumbnail}
                          alt={en.courseId.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-[#165DCE] uppercase tracking-wider">
                            {en.courseId.category}
                          </span>
                          <h4 className="text-sm font-extrabold text-[#102344] leading-tight line-clamp-1">
                            {en.courseId.title}
                          </h4>
                          <div className="flex items-center gap-2.5 text-xs text-slate-500">
                            <span>{en.completedLessonsCount || 0} / {en.totalLessonsCount || 10} lessons</span>
                            <span>•</span>
                            <span className="font-bold text-[#102344]">{en.progressPercentage}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full sm:w-44 space-y-2 shrink-0">
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#165DCE] rounded-full"
                            style={{ width: `${en.progressPercentage}%` }}
                          />
                        </div>
                        <Link
                          to={`/student/learn/${en.courseId._id}`}
                          className="w-full py-2 bg-blue-50 hover:bg-[#165DCE] hover:text-white text-[#165DCE] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Resume</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Available Courses & Newly Added Tracks to Enroll */}
                {availableCoursesToEnroll.length > 0 && (
                  <div className="pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                          Newly Added & Available Courses ({availableCoursesToEnroll.length})
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Discover newly added curriculum tracks and enroll with 1-click.
                        </p>
                      </div>
                      <Link to="/student/courses" className="text-xs font-bold text-[#165DCE] hover:underline shrink-0">
                        Explore all catalog →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {availableCoursesToEnroll.map((c) => (
                        <div key={c._id} className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between gap-3 hover:border-blue-300 transition-all">
                          <div className="flex items-start gap-3">
                            <img src={c.thumbnail} alt={c.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200" />
                            <div className="min-w-0 space-y-1">
                              <span className="text-[10px] font-black text-[#165DCE] uppercase tracking-wider block truncate">
                                {c.category}
                              </span>
                              <h5 className="text-xs font-extrabold text-[#102344] leading-snug line-clamp-2">{c.title}</h5>
                              <span className="text-[10px] text-slate-500 block">{c.duration} • {c.difficulty}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                            <button
                              onClick={() => handleQuickEnroll(c._id)}
                              disabled={enrollingId === c._id}
                              className="flex-1 py-1.5 px-3 bg-[#165DCE] hover:bg-[#124cb0] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                            >
                              {enrollingId === c._id ? 'Enrolling...' : 'Enroll in Course'}
                            </button>
                            <Link
                              to={`/courses/${c.slug || c._id}`}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-bold text-slate-700 hover:text-[#165DCE] transition-colors"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Coding Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#102344] flex items-center gap-2">
                <Code className="w-4 h-4 text-[#165DCE]" />
                <span>Recent Coding Practice</span>
              </h3>
              <Link to="/student/problems" className="text-xs font-bold text-[#165DCE] hover:underline">
                Problem Bank →
              </Link>
            </div>

            {recentSubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E1E8F2] p-6 text-center space-y-2 shadow-xs">
                <p className="text-xs font-bold text-slate-700">No recent submissions recorded yet.</p>
                <p className="text-xs text-slate-400">Write code in our Online IDE or solve interview questions.</p>
                <Link
                  to="/student/problems"
                  className="inline-block mt-2 px-4 py-2 bg-blue-50 text-[#165DCE] hover:bg-[#165DCE] hover:text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Solve First Problem
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E1E8F2] overflow-hidden shadow-xs divide-y divide-slate-100">
                {recentSubmissions.map((sub: any) => {
                  const isAccepted = sub.status === 'Accepted';
                  const prob = sub.problemId || {};
                  return (
                    <div
                      key={sub._id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isAccepted ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {isAccepted ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#102344]">
                              {prob.title || 'Coding Exercise'}
                            </span>
                            {prob.difficulty && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                                prob.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                                'bg-rose-50 text-rose-700'
                              }`}>
                                {prob.difficulty}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="uppercase font-mono text-[10px] font-semibold text-slate-600">
                              {sub.language}
                            </span>
                            <span>•</span>
                            <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isAccepted ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {sub.status}
                        </span>
                        {prob.slug && (
                          <Link
                            to={`/student/problems/${prob.slug}`}
                            className="text-xs font-bold text-[#165DCE] hover:underline"
                          >
                            Open →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Target Goal & Upcoming Assessments */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Target Company Box */}
          <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Goal</span>
              <Target className="w-4 h-4 text-[#165DCE]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg border border-amber-100">
                🎯
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#102344]">
                  {user?.targetCompany || 'Tier-1 Product Companies'}
                </span>
                <span className="text-xs text-slate-500 block">
                  Class of {user?.graduationYear || 2026} • Engineering
                </span>
              </div>
            </div>
            <Link
              to="/student/companies"
              className="text-xs font-bold text-[#165DCE] hover:underline block pt-1"
            >
              Explore company interview blueprints →
            </Link>
          </div>

          {/* Upcoming Assessments */}
          <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#102344]">Upcoming Mock Tests</h3>
                {assessments.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#165DCE]">
                    {assessments.length}
                  </span>
                )}
              </div>
              <Link to="/student/assessments" className="text-xs font-bold text-[#165DCE] hover:underline">
                View all
              </Link>
            </div>

            {assessments.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1.5">
                <p className="text-xs font-bold text-slate-700">No mock tests available yet.</p>
                <Link to="/student/assessments" className="text-[11px] text-[#165DCE] font-bold hover:underline block">
                  Check Assessments Hub →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 5).map((a) => (
                  <div
                    key={a._id}
                    className="p-3.5 rounded-xl bg-[#F8F9FE] border border-slate-200/80 hover:border-blue-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#165DCE] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {a.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {a.durationMinutes}m
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-[#102344] line-clamp-1">{a.title}</h4>

                    <Link
                      to={`/student/assessments/${a._id}/take`}
                      className="w-full py-2 rounded-xl text-xs font-extrabold text-center bg-white border border-[#E1E8F2] hover:bg-[#165DCE] hover:text-white hover:border-[#165DCE] transition-all block text-slate-700 shadow-2xs"
                    >
                      Start Assessment
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Support / Preparation Note */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-5 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#165DCE]">
              <Award className="w-4 h-4" />
              <span>Campus Readiness Tip</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Top recruiters test for both clean time complexity (O(N) / O(log N)) and behavioral communication. Make sure to review our STAR method guide before interviews.
            </p>
            <Link
              to="/student/placement"
              className="text-xs font-extrabold text-[#165DCE] hover:underline block pt-1"
            >
              Read Interview Playbook →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
