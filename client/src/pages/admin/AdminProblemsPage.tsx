import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CodingProblem } from '../../types';

export const AdminProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<CodingProblem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Arrays',
    difficulty: 'Easy',
    description: '',
    constraints: '1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
    pyStarter: 'def solution(nums, target):\n    # Write your solution here\n    pass',
    jsStarter: 'function solution(nums, target) {\n    // Write your solution here\n}',
    cppStarter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Solution\n    return 0;\n}',
    testCasesInput: '[2, 7, 11, 15]\n9',
    testCasesOutput: '[0, 1]',
    testCase2Input: '[3, 2, 4]\n6',
    testCase2Output: '[1, 2]',
  });

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getProblems();
      if (res.success) {
        setProblems(res.problems || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const openCreateModal = () => {
    setEditingProblem(null);
    setFormData({
      title: '',
      category: 'Arrays',
      difficulty: 'Easy',
      description: '',
      constraints: '1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
      pyStarter: 'def solution(nums, target):\n    # Write your solution here\n    pass',
      jsStarter: 'function solution(nums, target) {\n    // Write your solution here\n}',
      cppStarter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}',
      testCasesInput: '[2, 7, 11, 15]\n9',
      testCasesOutput: '[0, 1]',
      testCase2Input: '[3, 2, 4]\n6',
      testCase2Output: '[1, 2]',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (problem: CodingProblem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      category: problem.category || 'General',
      difficulty: problem.difficulty,
      description: problem.description,
      constraints: (problem.constraints || []).join('\n'),
      pyStarter: problem.starterCode?.python || '',
      jsStarter: problem.starterCode?.javascript || '',
      cppStarter: problem.starterCode?.cpp || '',
      testCasesInput: problem.testCases?.[0]?.input || '',
      testCasesOutput: problem.testCases?.[0]?.expectedOutput || '',
      testCase2Input: problem.testCases?.[1]?.input || '',
      testCase2Output: problem.testCases?.[1]?.expectedOutput || '',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setErrorMsg('Title and problem description are required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');

      const payload = {
        title: formData.title,
        category: formData.category,
        difficulty: formData.difficulty,
        description: formData.description,
        constraints: formData.constraints.split('\n').filter((c) => c.trim().length > 0),
        starterCode: {
          python: formData.pyStarter,
          javascript: formData.jsStarter,
          cpp: formData.cppStarter,
        },
        testCases: [
          { input: formData.testCasesInput, expectedOutput: formData.testCasesOutput, isHidden: false },
          { input: formData.testCase2Input, expectedOutput: formData.testCase2Output, isHidden: true },
        ].filter((t) => t.input.trim() || t.expectedOutput.trim()),
      };

      if (editingProblem) {
        await api.admin.updateProblem(editingProblem._id, payload);
      } else {
        await api.admin.createProblem(payload);
      }

      setShowModal(false);
      fetchProblems();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save coding problem.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteProblem(id);
      setDeleteConfirmId(null);
      fetchProblems();
    } catch (err: any) {
      alert(err.message || 'Failed to delete problem');
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Coding Problems Repository</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage Data Structures & Algorithms challenges, test cases, and starter code for student compiler practice.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md hover:shadow-primary-500/20 transition-all text-sm shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_code</span>
          Create Problem
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems, categories..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined animate-spin text-primary-600 text-3xl">sync</span>
            <p className="text-slate-500 text-sm mt-2">Loading problems repository...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
              <span className="material-symbols-outlined text-2xl">code_off</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">No problems found</h3>
            <p className="text-slate-500 text-xs mt-1">Create a new problem to expand student practice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-black text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Problem</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Languages</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProblems.map((prob) => (
                  <tr key={prob._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{prob.title}</div>
                      <div className="text-slate-400 text-xs mt-0.5 truncate max-w-md">
                        {prob.description.substring(0, 80)}...
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-md">
                        {prob.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 font-bold text-xs rounded-md ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1.5 text-xs text-slate-500">
                        {prob.starterCode?.python && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">py</span>}
                        {prob.starterCode?.javascript && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">js</span>}
                        {prob.starterCode?.cpp && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">c++</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prob)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                          title="Edit Problem"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prob._id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                          title="Delete Problem"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Coding Problem?</h3>
            <p className="text-slate-500 text-sm mt-2">
              Are you sure you want to permanently remove this problem? Existing student submissions will still be retained in history.
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
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">
                {editingProblem ? 'Edit Coding Problem' : 'Create New Coding Problem'}
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

            <form onSubmit={handleSave} className="space-y-5 mt-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Problem Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Valid Parentheses"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Arrays, Strings, Dynamic Programming"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Problem Description (Markdown) *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain problem requirements, inputs and expected outputs clearly..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Constraints (one per line)</label>
                <textarea
                  rows={2}
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              {/* Starter Code */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-700">Starter Code Templates</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">Python Template</span>
                    <textarea
                      rows={3}
                      value={formData.pyStarter}
                      onChange={(e) => setFormData({ ...formData, pyStarter: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">JavaScript Template</span>
                    <textarea
                      rows={3}
                      value={formData.jsStarter}
                      onChange={(e) => setFormData({ ...formData, jsStarter: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Test Cases */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase text-slate-700">Test Cases for Sandbox Verification</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-700 block mb-2">Public Test Case 1</span>
                    <input
                      type="text"
                      placeholder="Input (e.g. [2,7,11,15]\n9)"
                      value={formData.testCasesInput}
                      onChange={(e) => setFormData({ ...formData, testCasesInput: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Expected Output (e.g. [0,1])"
                      value={formData.testCasesOutput}
                      onChange={(e) => setFormData({ ...formData, testCasesOutput: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-700 block mb-2">Hidden Test Case 2 (Evaluation)</span>
                    <input
                      type="text"
                      placeholder="Input (e.g. [3,2,4]\n6)"
                      value={formData.testCase2Input}
                      onChange={(e) => setFormData({ ...formData, testCase2Input: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Expected Output (e.g. [1,2])"
                      value={formData.testCase2Output}
                      onChange={(e) => setFormData({ ...formData, testCase2Output: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
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
                  {editingProblem ? 'Save Changes' : 'Create Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
