import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Company } from '../../types';
import { CompanyLogo } from '../../components/common/CompanyLogo';

export const AdminCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Technology & Cloud',
    description: '',
    logo: '',
    salaryRange: '₹14 - 38 LPA',
    difficulty: 'Hard',
    hiringRoles: 'Software Development Engineer I, Systems Engineer, Cloud Specialist',
    frequentlyAskedTopics: 'Dynamic Programming, Binary Trees, System Design, Graph Algorithms',
    roundsText: 'Online Assessment: 2 Coding Problems + Aptitude (90 mins)\nTechnical Round 1: Data Structures & Core CS\nTechnical Round 2: System Design & Project Architecture\nHR & Leadership: Cultural Fit & Behavioral Questions',
  });

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getCompanies();
      if (res.success) {
        setCompanies(res.companies || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openCreateModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      industry: 'Technology & Cloud',
      description: '',
      logo: '',
      salaryRange: '₹14 - 38 LPA',
      difficulty: 'Hard',
      hiringRoles: 'Software Development Engineer I, Systems Engineer, Cloud Specialist',
      frequentlyAskedTopics: 'Dynamic Programming, Binary Trees, System Design, Graph Algorithms',
      roundsText: 'Online Assessment: 2 Coding Problems + Aptitude (90 mins)\nTechnical Round 1: Data Structures & Core CS\nTechnical Round 2: System Design & Project Architecture\nHR & Leadership: Cultural Fit & Behavioral Questions',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      industry: comp.industry || 'Technology',
      description: comp.description,
      logo: comp.logo || '',
      salaryRange: comp.salaryRange || '₹10 - 25 LPA',
      difficulty: comp.difficulty,
      hiringRoles: (comp.hiringRoles || []).join(', '),
      frequentlyAskedTopics: (comp.frequentlyAskedTopics || []).join(', '),
      roundsText: (comp.interviewRounds || [])
        .map((r: any) => `${r.title || r.name}: ${r.description}`)
        .join('\n'),
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setErrorMsg('Company name and description are required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');

      const parsedRounds = formData.roundsText
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line, idx) => {
          const parts = line.split(':');
          const name = parts[0]?.trim() || `Round ${idx + 1}`;
          const description = parts.slice(1).join(':').trim() || 'Interview round details';
          return {
            roundNumber: idx + 1,
            name,
            roundType: name.toLowerCase().includes('hr') ? 'HR' : 'Technical',
            description,
          };
        });

      const payload = {
        name: formData.name,
        industry: formData.industry,
        description: formData.description,
        logo: formData.logo,
        salaryRange: formData.salaryRange,
        difficulty: formData.difficulty,
        hiringRoles: formData.hiringRoles.split(',').map((s) => s.trim()).filter(Boolean),
        frequentlyAskedTopics: formData.frequentlyAskedTopics.split(',').map((s) => s.trim()).filter(Boolean),
        interviewRounds: parsedRounds,
      };

      if (editingCompany) {
        await api.admin.updateCompany(editingCompany._id, payload);
      } else {
        await api.admin.createCompany(payload);
      }

      setShowModal(false);
      fetchCompanies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save company profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteCompany(id);
      setDeleteConfirmId(null);
      fetchCompanies();
    } catch (err: any) {
      alert(err.message || 'Failed to delete company profile.');
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hiring Companies & Placement Portfolios</h1>
          <p className="text-slate-500 text-sm mt-1">
            Maintain top tech recruiter profiles, hiring packages, interview round breakdowns, and placement guidance.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md hover:shadow-primary-500/20 transition-all text-sm shrink-0"
        >
          <span className="material-symbols-outlined text-lg">domain_add</span>
          Add Company
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company name, industry..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          Showing {filteredCompanies.length} companies
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined animate-spin text-primary-600 text-3xl">sync</span>
          <p className="text-slate-500 text-sm mt-2">Loading company directory...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
            <span className="material-symbols-outlined text-2xl">apartment</span>
          </div>
          <h3 className="text-base font-bold text-slate-800">No companies found</h3>
          <p className="text-slate-500 text-xs mt-1">Add a company to begin curating recruitment materials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <CompanyLogo name={c.name} slug={c.slug} size="md" />
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{c.name}</h3>
                      <span className="text-xs text-slate-500">{c.industry}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                      (c.difficulty as string) === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700'
                        : c.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {c.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {c.description}
                </p>

                <div className="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compensation:</span>
                    <span className="font-bold text-slate-800">{c.salaryRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interview Rounds:</span>
                    <span className="font-bold text-slate-800">{c.interviewRounds?.length || 0} Stages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hiring Roles:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">
                      {c.hiringRoles?.slice(0, 2).join(', ') || 'Software Engineer'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(c)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(c._id)}
                  className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                  title="Delete Company"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Company Profile?</h3>
            <p className="text-slate-500 text-sm mt-2">
              Are you sure you want to remove this hiring company profile from the placement directory?
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">
                {editingCompany ? 'Edit Company Profile' : 'Add New Hiring Company'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Google, Microsoft, Infosys"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Cloud, FinTech, E-Commerce"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of company culture, engineering ethos, and interview process..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    placeholder="e.g. ₹12 - 28 LPA"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Hiring Roles (comma-separated)</label>
                <input
                  type="text"
                  value={formData.hiringRoles}
                  onChange={(e) => setFormData({ ...formData, hiringRoles: e.target.value })}
                  placeholder="e.g. SDE-1, Cloud Engineer, Data Analyst"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Frequently Asked Topics (comma-separated)</label>
                <input
                  type="text"
                  value={formData.frequentlyAskedTopics}
                  onChange={(e) => setFormData({ ...formData, frequentlyAskedTopics: e.target.value })}
                  placeholder="e.g. Trees, Dynamic Programming, SQL, OOP"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Interview Rounds (Format: `Round Name: Details` on each line)
                </label>
                <textarea
                  rows={4}
                  value={formData.roundsText}
                  onChange={(e) => setFormData({ ...formData, roundsText: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                  {saving && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
                  {editingCompany ? 'Save Changes' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
