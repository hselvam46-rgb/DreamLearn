import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CodingProblem } from '../../types';
import { Code2, CheckCircle2, Search, Filter, ArrowRight, Sparkles } from 'lucide-react';

export const PracticeProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const fetchProblems = () => {
    setLoading(true);
    api.code.getProblems({
      category: category !== 'All' ? category : undefined,
      difficulty: difficulty !== 'All' ? difficulty : undefined,
      search: search || undefined,
    })
      .then((res) => {
        if (res.problems) setProblems(res.problems);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProblems();
  }, [category, difficulty]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-container text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LeetCode & Campus Curated</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344] tracking-tight">
            Practice Coding Problems
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Solve curated interview problems in C, C++, Java, Python, and JavaScript with instant feedback.
          </p>
        </div>

        <Link
          to="/student/compiler"
          className="px-5 py-2.5 bg-[#165DCE] text-white text-xs font-extrabold rounded-xl shadow-sm hover:bg-[#124cb0] hover:shadow-md transition-all flex items-center gap-2 shrink-0 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <Code2 className="w-4 h-4" />
          <span>Launch Blank IDE</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-primary-container text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Dropdown & Search */}
        <div className="flex items-center gap-3">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="text-xs font-semibold bg-surface border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff} Difficulty
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Problems Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading problem set...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Difficulty</th>
                  <th className="py-3.5 px-6">Acceptance</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {problems.map((problem) => (
                  <tr key={problem._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      {problem.solved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#102344]">
                      <Link to={`/student/problems/${problem.slug}`} className="hover:text-primary-container">
                        {problem.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-primary-container font-semibold">
                        {problem.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          problem.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : problem.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-500">
                      {problem.acceptanceRate || 80}%
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/student/problems/${problem.slug}`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-white bg-[#165DCE] hover:bg-[#124cb0] shadow-2xs hover:shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        <span>Solve</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
