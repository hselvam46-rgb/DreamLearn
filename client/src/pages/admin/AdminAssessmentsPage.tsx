import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Assessment, Question } from '../../types';
import { PlusCircle, Trash2, Edit, FileCheck2, Clock, Award, CheckCircle2, Users } from 'lucide-react';

export const AdminAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editAssessment, setEditAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'DSA',
    difficulty: 'Intermediate',
    durationMinutes: 30,
    passingScore: 70,
    attemptsAllowed: 3,
    status: 'Published',
    selectedQuestionIds: [] as string[],
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.admin.getAssessments(),
      api.admin.getQuestions(),
    ])
      .then(([assessRes, qRes]) => {
        if (assessRes.assessments) setAssessments(assessRes.assessments);
        if (qRes.questions) setAvailableQuestions(qRes.questions);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditAssessment(null);
    setFormData({
      title: '',
      description: '',
      category: 'DSA',
      difficulty: 'Intermediate',
      durationMinutes: 30,
      passingScore: 70,
      attemptsAllowed: 3,
      status: 'Published',
      selectedQuestionIds: availableQuestions.slice(0, 5).map((q) => q._id),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (a: Assessment) => {
    setEditAssessment(a);
    setFormData({
      title: a.title,
      description: a.description,
      category: a.category,
      difficulty: a.difficulty,
      durationMinutes: a.durationMinutes,
      passingScore: a.passingScore,
      attemptsAllowed: a.attemptsAllowed,
      status: a.status,
      selectedQuestionIds: (a.questions || []).map((q: any) => q._id || q),
    });
    setModalOpen(true);
  };

  const handleToggleQuestion = (qId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedQuestionIds.includes(qId);
      return {
        ...prev,
        selectedQuestionIds: exists
          ? prev.selectedQuestionIds.filter((id) => id !== qId)
          : [...prev.selectedQuestionIds, qId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      questions: formData.selectedQuestionIds,
    };

    try {
      if (editAssessment) {
        await api.admin.updateAssessment(editAssessment._id, payload);
      } else {
        await api.admin.createAssessment(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await api.admin.deleteAssessment(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await api.admin.updateAssessment(id, { status: nextStatus });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assessment Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure assessments, set passing requirements, and assign questions without changing source code.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#165DCE] hover:bg-[#124cb0] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Assessment</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-6">Assessment Title</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Questions</th>
                  <th className="py-3.5 px-6">Passing Score</th>
                  <th className="py-3.5 px-6">Total Attempts</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {assessments.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {a.title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#165DCE] font-bold text-[11px] border border-blue-100">
                        {a.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">{a.durationMinutes} mins</td>
                    <td className="py-4 px-6 font-bold">{a.totalQuestions || 0}</td>
                    <td className="py-4 px-6 font-bold text-emerald-600">{a.passingScore}%</td>
                    <td className="py-4 px-6 text-slate-500">{a.totalAttempts || 0}</td>
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(a._id, a.status)}
                        title="Click to toggle status (Published / Draft)"
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] cursor-pointer transition-all hover:scale-105 ${
                          a.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {a.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-slate-900">
              {editAssessment ? 'Edit Assessment' : 'Create Assessment'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dynamic Programming Mock Test"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Core CS">Core CS</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Placement Mock">Placement Mock</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Duration (Mins)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Passing Score (%)</label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Attach Questions Selection list */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block">
                  Assign Questions from Question Bank ({formData.selectedQuestionIds.length} selected)
                </span>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {availableQuestions.map((q) => {
                    const isSelected = formData.selectedQuestionIds.includes(q._id);
                    return (
                      <div
                        key={q._id}
                        onClick={() => handleToggleQuestion(q._id)}
                        className={`p-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 ${
                          isSelected ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate max-w-lg">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            q.type === 'coding' ? 'bg-purple-100 text-purple-700' :
                            q.type === 'range' ? 'bg-amber-100 text-amber-700' :
                            q.type === 'case_based' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {q.type === 'coding' ? 'CODE' : q.type === 'range' ? 'RANGE' : q.type === 'case_based' ? 'CASE' : 'MCQ'}
                          </span>
                          <span className="truncate">{q.text}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#165DCE] hover:bg-[#124cb0] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
