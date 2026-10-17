import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { Users, Search, CheckCircle2, XCircle, ShieldAlert, Award, BookOpen, Clock, RotateCcw } from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any | null>(null);

  const fetchStudents = () => {
    setLoading(true);
    api.admin.getStudents({
      search: search || undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
    })
      .then((res) => {
        if (res.students) setStudents(res.students);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, [statusFilter]);

  const handleStatusToggle = async (studentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!confirm(`Are you sure you want to mark this student as ${nextStatus}?`)) return;

    try {
      await api.admin.setStudentStatus(studentId, nextStatus);
      fetchStudents();
    } catch (err: any) {
      alert(err.message || 'Status change failed');
    }
  };

  const handleViewDetails = async (studentId: string) => {
    try {
      const res = await api.admin.getStudentDetails(studentId);
      setStudentDetails(res);
      setDetailsModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load student details');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex items-center justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Registry</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-[#165DCE] border border-blue-100">
              {students.length} Learners Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative registered student directory. All learner registrations appear here automatically in real time.
          </p>
        </div>

        <button
          onClick={fetchStudents}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Refresh Registry"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchStudents();
          }}
          className="relative flex-1 min-w-[280px]"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!e.target.value) {
                setTimeout(fetchStudents, 50);
              }
            }}
            placeholder="Search students by name, email, or college (press Enter)..."
            className="w-full h-10 pl-10 pr-20 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </form>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Account Status:</span>
          {['All', 'active', 'suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Students Data Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#165DCE] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#165DCE] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No Students Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {search || statusFilter !== 'All' 
              ? 'No registered learners match your current search and status filters. Try clearing your filters.'
              : 'No students have registered yet. Any student who registers via the student portal will instantly appear in this registry.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">College / Target</th>
                  <th className="py-3.5 px-6">Enrollments</th>
                  <th className="py-3.5 px-6">Readiness</th>
                  <th className="py-3.5 px-6">Streak</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#165DCE] font-extrabold flex items-center justify-center text-xs shrink-0">
                          {st.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <span className="font-extrabold text-[#102344] block">{st.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{st.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 block">{st.college || 'Not specified'}</span>
                      <span className="text-[11px] text-[#165DCE] font-semibold">
                        Goal: {st.targetCompany || 'Tier-1'}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900">
                      {st.enrollmentsCount || 0} Courses
                    </td>

                    <td className="py-4 px-6 font-bold text-emerald-600">
                      {st.placementReadiness?.score ?? 0}%
                    </td>

                    <td className="py-4 px-6 text-amber-600 font-bold">
                      {st.streak?.current ?? 0} Days
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          st.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {st.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(st._id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                        >
                          View Activity
                        </button>

                        <button
                          onClick={() => handleStatusToggle(st._id, st.status)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            st.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {st.status === 'active' ? 'Suspend' : 'Activate'}
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

      {/* Details Modal */}
      {detailsModalOpen && studentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Student Learning Records: {studentDetails.student?.name}
              </h3>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Enrolled courses list */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Course Enrollments</h4>
              <div className="space-y-2">
                {studentDetails.enrollments?.map((en: any) => (
                  <div key={en._id} className="p-3 rounded-xl bg-slate-50 border border-[#E1E8F2] flex items-center justify-between">
                    <span className="font-bold text-[#102344]">{en.courseId?.title}</span>
                    <span className="font-bold text-[#165DCE]">{en.progressPercentage}% Completed</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment records */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900">Assessment History</h4>
              <div className="space-y-2">
                {studentDetails.attempts?.map((att: any) => (
                  <div key={att._id} className="p-3 rounded-xl bg-surface border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">{att.assessmentId?.title}</span>
                      <span className="text-[10px] text-slate-400">{new Date(att.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`font-bold ${att.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {att.percentage}% ({att.passed ? 'PASSED' : 'FAILED'})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
