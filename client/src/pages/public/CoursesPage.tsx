import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Course } from '../../types';
import { Search, Filter, BookOpen, Layers, Star, ArrowRight, Sparkles } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = ['All', 'Data Structures', 'Programming Languages', 'Placement Preparation'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'];

  const fetchCourses = () => {
    setLoading(true);
    api.courses.getPublished({
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      search: search || undefined,
    })
      .then((res) => {
        setCourses(res.courses || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-container text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Tech Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102344] tracking-tight">
          Explore Technical Courses
        </h1>
        <p className="text-sm text-[#64748B] mt-2">
          From fundamental algorithms to cloud architectures and technical campus hiring prep.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by topic, skill, or title (e.g. C++, React, Trees)..."
            className="w-full h-11 pl-10 pr-24 bg-surface rounded-xl text-sm text-[#102344] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-bold text-white bg-primary-container hover:bg-[#104AA8] rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-surface text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs font-semibold bg-surface border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-container"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <p className="text-base font-bold text-[#102344]">No courses matched your filters.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching for another topic.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSearch('');
            }}
            className="mt-4 px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-primary-container shadow-xs">
                    {course.category}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/70 text-white">
                    {course.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {course.rating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{course.enrolledCount.toLocaleString()} students</span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#102344] group-hover:text-primary-container transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary-container" />
                      {course.difficulty}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-primary-container" />
                      {course.modulesCount || 10} Modules
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                <Link
                  to={`/courses/${course.slug || course._id}`}
                  className="w-full py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#165DCE] hover:bg-[#124cb0] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <span>View Syllabus & Enroll</span>
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
