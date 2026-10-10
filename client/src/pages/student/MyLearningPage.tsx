import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Enrollment } from '../../types';
import { BookOpen, Play, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';

export const MyLearningPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.courses.getMyEnrollments()
      .then((res) => {
        if (res.enrollments) setEnrollments(res.enrollments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344]">My Learning</h1>
          <p className="text-sm text-slate-500 mt-1">Track your enrolled curriculum, progress, and certificates.</p>
        </div>
        <Link
          to="/courses"
          className="px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#104AA8] transition-colors"
        >
          Explore More Courses
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#102344]">You haven't enrolled in any courses yet.</h3>
          <p className="text-xs text-slate-500">Explore our free placement preparation courses to get started.</p>
          <Link to="/courses" className="inline-block mt-2 px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-xl">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((en) => (
            <div
              key={en._id}
              className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img src={en.courseId.thumbnail} alt={en.courseId.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/95 text-primary-container">
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
                        en.progressPercentage >= 100 ? 'bg-emerald-500' : 'bg-primary-container'
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
  );
};
