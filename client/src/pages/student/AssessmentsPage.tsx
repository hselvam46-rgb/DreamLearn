import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Assessment } from '../../types';
import { FileCheck, Clock, Award, CheckCircle2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  const standardCategories = ['All', 'DSA', 'Core CS', 'Aptitude', 'Web Development', 'Placement Mock', 'General'];
  const [allCategories, setAllCategories] = useState<string[]>(standardCategories);

  useEffect(() => {
    setLoading(true);
    api.assessments.getPublished({
      category: category !== 'All' ? category : undefined,
    })
      .then((res) => {
        if (res.assessments) {
          setAssessments(res.assessments);
          // Dynamically collect any other categories that exist
          const discovered = new Set(standardCategories);
          res.assessments.forEach((a: Assessment) => {
            if (a.category) discovered.add(a.category);
          });
          setAllCategories(Array.from(discovered));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-container text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standardized Technical Screenings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344] tracking-tight">
            Assessments & Mock Tests
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Test your problem solving speed and algorithmic understanding with authoritative, company-grade assessments.
          </p>
        </div>

        {/* Quick Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface p-1 rounded-xl border border-slate-200">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-[#165DCE] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading assessments...</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <p className="text-base font-bold text-[#102344]">No assessments found in this category ({category}).</p>
          <p className="text-xs text-slate-500">Try switching to "All" to see all published assessments and mock tests.</p>
          {category !== 'All' && (
            <button
              onClick={() => setCategory('All')}
              className="px-4 py-2 bg-[#165DCE] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#124cb0]"
            >
              Show All Assessments
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-primary-container">
                    {a.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary-container" />
                    {a.durationMinutes} mins
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#102344] group-hover:text-primary-container transition-colors line-clamp-1">
                    {a.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {a.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-surface rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                    <span className="font-extrabold text-[#102344]">{a.totalQuestions || 5} Questions</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Passing Score</span>
                    <span className="font-extrabold text-[#102344]">{a.passingScore}%</span>
                  </div>
                </div>

                {a.bestPercentage !== null && a.bestPercentage !== undefined && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Best Score: {a.bestPercentage}%</span>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  to={`/student/assessments/${a._id}/take`}
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#165DCE] hover:bg-[#124cb0] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <span>{a.userAttemptsCount ? 'Retake Assessment' : 'Start Assessment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
