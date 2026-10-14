import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Enrollment, Course } from '../../types';
import { BookOpen, Play, CheckCircle2, ArrowRight, Sparkles, Award, PlusCircle } from 'lucide-react';

export const MyLearningPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchData = () => {
    Promise.all([
      api.courses.getMyEnrollments().catch(() => ({ enrollments: [] })),
      api.courses.getPublished().catch(() => ({ courses: [] })),
    ])
      .then(([enrollRes, courseRes]) => {
        if (enrollRes.enrollments) setEnrollments(enrollRes.enrollments);
        if (courseRes.courses) setPublishedCourses(courseRes.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await api.courses.enroll(courseId);
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  // Safe filtering for enrolled courses
  const validEnrollments = enrollments.filter(
    (en) => en && en.courseId && typeof en.courseId === 'object' && en.courseId._id
  );
  const enrolledCourseIds = new Set(validEnrollments.map((en) => en.courseId._id));
  const availableCoursesToEnroll = publishedCourses.filter((c) => !enrolledCourseIds.has(c._id));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344]">My Learning</h1>
          <p className="text-sm text-slate-500 mt-1">Track your enrolled curriculum, progress, and certificates.</p>
        </div>
        <Link
          to="/student/courses"
          className="px-4 py-2 bg-[#165DCE] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#124cb0] transition-colors"
        >
          Explore All Courses ({publishedCourses.length})
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#165DCE] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading your courses...</p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Section 1: Enrolled Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#102344]">
                Enrolled Tracks ({validEnrollments.length})
              </h2>
            </div>

            {validEnrollments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-[#102344]">You haven't enrolled in any courses yet.</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Browse the newly added and available courses below to start learning immediately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {validEnrollments.map((en) => (
                  <div
                    key={en._id}
                    className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                        <img src={en.courseId.thumbnail} alt={en.courseId.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/95 text-[#165DCE]">
                          {en.courseId.category}
                        </span>
                        {en.progressPercentage >= 100 && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-[#102344] line-clamp-1">{en.courseId.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{en.courseId.shortDescription}</p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">Course Progress</span>
                          <span className="text-[#102344]">{en.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              en.progressPercentage >= 100 ? 'bg-emerald-500' : 'bg-[#165DCE]'
                            }`}
                            style={{ width: `${en.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={`/student/learn/${en.courseId._id}`}
                        className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-center bg-[#165DCE] hover:bg-[#124cb0] text-white transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{en.progressPercentage >= 100 ? 'Review Lessons' : 'Resume Learning'}</span>
                      </Link>

                      {en.progressPercentage >= 100 && (
                        <Link
                          to="/student/certificates"
                          className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors"
                          title="View Certificate"
                        >
                          <Award className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Newly Added & Available Courses */}
          {availableCoursesToEnroll.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-[#102344] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#165DCE]" />
                    <span>Available Courses to Explore & Enroll ({availableCoursesToEnroll.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Newly published courses ready for placement preparation.
                  </p>
                </div>
                <Link
                  to="/student/courses"
                  className="text-xs font-bold text-[#165DCE] hover:underline"
                >
                  View full catalog →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCoursesToEnroll.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/95 text-[#165DCE]">
                          {course.category}
                        </span>
                        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/70 text-white">
                          {course.duration}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-[#102344] line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                          {course.difficulty}
                        </span>
                        <span>•</span>
                        <span>{course.topic || 'General'}</span>
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleEnroll(course._id)}
                        disabled={enrollingId === course._id}
                        className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-center bg-[#165DCE] hover:bg-[#124cb0] disabled:opacity-50 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{enrollingId === course._id ? 'Enrolling...' : 'Enroll in Course'}</span>
                      </button>

                      <Link
                        to={`/courses/${course.slug || course._id}`}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
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
  );
};
