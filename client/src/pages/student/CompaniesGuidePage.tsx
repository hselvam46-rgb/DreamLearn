import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Company } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { 
  Building2, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  Search,
  BookOpen,
  CheckCircle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export const CompaniesGuidePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCompanySlug = searchParams.get('company')?.toLowerCase() || '';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Medium' | 'Hard' | 'Very Hard'>('All');

  useEffect(() => {
    api.companies.getAll()
      .then((res) => {
        if (res.companies && res.companies.length > 0) {
          setCompanies(res.companies);
          
          if (requestedCompanySlug) {
            const matched = res.companies.find((c: Company) => 
              c.slug?.toLowerCase() === requestedCompanySlug ||
              c.name.toLowerCase().includes(requestedCompanySlug)
            );
            if (matched) {
              setSelectedCompany(matched);
              return;
            }
          }
          setSelectedCompany(res.companies[0]);
        }
      })
      .catch((err) => console.error('Failed to load companies:', err))
      .finally(() => setLoading(false));
  }, [requestedCompanySlug]);

  const handleSelectCompany = (c: Company) => {
    setSelectedCompany(c);
    setSearchParams({ company: c.slug || c.name.toLowerCase() });
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.hiringRoles?.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-xs font-black uppercase tracking-wider border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Campus Recruitment Guides</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#102344] tracking-tight">
              Top Hiring Companies & Interview Blueprints
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mt-1">
              Detailed company recruitment workflows, indicative compensation ranges, online assessment patterns, and frequently tested questions.
            </p>
          </div>
          <Link
            to="/placement"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all shrink-0 self-start md:self-auto"
          >
            <span>Interview Preparation Playbook</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400">Loading company preparation profiles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Company Directory & Filter Column (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search company or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary"
                />
              </div>

              {/* Difficulty Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {(['All', 'Medium', 'Hard', 'Very Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                      difficultyFilter === diff
                        ? 'bg-primary text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Companies ({filteredCompanies.length})
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Select a company</span>
            </div>

            {/* Company Card Buttons */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredCompanies.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No companies matched your search criteria.
                </div>
              ) : (
                filteredCompanies.map((c) => {
                  const isSelected = selectedCompany?._id === c._id;
                  return (
                    <button
                      key={c._id}
                      onClick={() => handleSelectCompany(c)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                        isSelected
                          ? 'bg-blue-50/80 border-primary shadow-xs ring-1 ring-primary/20'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <CompanyLogo name={c.name} slug={c.slug} size="md" />
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-[#102344] truncate">{c.name}</h4>
                          <span className="text-xs text-emerald-700 font-bold block mt-0.5">
                            {c.salaryRange}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.difficulty === 'Very Hard'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : c.difficulty === 'Hard'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}
                        >
                          {c.difficulty}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-primary translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Selected Company Detail Pane (8 Columns) */}
          <div className="lg:col-span-8">
            {selectedCompany ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <CompanyLogo name={selectedCompany.name} slug={selectedCompany.slug} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-[#102344] tracking-tight">
                          {selectedCompany.name}
                        </h2>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selectedCompany.difficulty === 'Very Hard'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : selectedCompany.difficulty === 'Hard'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}
                        >
                          {selectedCompany.difficulty}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">
                        {selectedCompany.industry}
                      </span>
                    </div>
                  </div>

                  {/* Indicative CTC Tag */}
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedCompany.salaryRange}</span>
                      <span className="text-[10px] text-emerald-600 font-normal">· Indicative CTC</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Based on verified campus placement drives
                    </span>
                  </div>
                </div>

                {/* Honest Placement Data Disclaimer Note */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/80 flex items-start gap-2.5 text-xs text-slate-600">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Honest Data Notice:</strong> Compensation figures and interview rounds are compiled directly from student interview offers, official placement dossiers, and company recruitment updates. All packages are indicative of on-campus full-time hires.
                  </p>
                </div>

                {/* Overview Description */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Company Overview & Hiring Culture
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedCompany.description}
                  </p>
                </div>

                {/* Hiring Roles */}
                {selectedCompany.hiringRoles && selectedCompany.hiringRoles.length > 0 && (
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Primary Campus Hiring Roles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.hiringRoles.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interview Process Rounds */}
                {selectedCompany.interviewRounds && selectedCompany.interviewRounds.length > 0 && (
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                      Recruitment Process Rounds
                    </h3>
                    <div className="space-y-3">
                      {selectedCompany.interviewRounds.map((round) => (
                        <div
                          key={round.roundNumber}
                          className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#102344]">
                              Round {round.roundNumber}: {round.title}
                            </span>
                            <span className="text-[11px] text-primary-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {round.duration}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {round.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frequently Tested Topics */}
                {selectedCompany.frequentlyAskedTopics && selectedCompany.frequentlyAskedTopics.length > 0 && (
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Frequently Tested Technical Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.frequentlyAskedTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-blue-50/80 text-primary-700 border border-blue-100 text-xs font-bold"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <Link
                    to={isAuthenticated ? "/student/problems" : "/register"}
                    className="px-6 py-3 bg-[#165DCE] hover:bg-[#124cb0] text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <span>Practice {selectedCompany.name} Questions</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={isAuthenticated ? "/student/assessments" : "/login"}
                    className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Take Mock Assessment
                  </Link>

                  <Link
                    to="/placement"
                    className="px-5 py-3 text-primary hover:text-primary-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 ml-auto"
                  >
                    <span>HR & Technical Prep</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                Please select a company from the left directory to view full preparation details.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Bottom CTA Banner with Guaranteed High Contrast */}
      <div className="pt-6">
        <div className="bg-[#165DCE] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          {/* Subtle decorative background shapes */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ready to ace your upcoming interviews?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Start practicing real questions asked in Google, Microsoft, Amazon, TCS, Infosys, and Deloitte campus placement drives.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? "/student/dashboard" : "/register"}
                className="px-8 py-3.5 bg-white text-[#165DCE] font-extrabold rounded-xl text-sm shadow-md hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                Start Learning Free
              </Link>
              <Link
                to={isAuthenticated ? "/student/dashboard" : "/login"}
                className="px-8 py-3.5 bg-transparent border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-bold rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                {isAuthenticated ? "Go to Dashboard" : "Sign In to Account"}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
