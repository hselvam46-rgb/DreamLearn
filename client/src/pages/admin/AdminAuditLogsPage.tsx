import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface IAuditLog {
  _id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('All');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getAuditLogs();
      if (res.success) {
        setLogs(res.logs || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('UPDATE')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (action.includes('DELETE') || action.includes('SUSPEND')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(search.toLowerCase());
    const matchesTarget = selectedTarget === 'All' || log.targetType === selectedTarget;
    return matchesSearch && matchesTarget;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security & Audit Logs</h1>
          <p className="text-slate-500 text-sm mt-1">
            Authoritative immutable record of all administrative operations, course modifications, and student status changes.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh Logs
        </button>
      </div>

      {/* Security Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-600/30 rounded-xl flex items-center justify-center text-primary-400">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">Role-Based Access Control Auditing Active</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Every content creation, deletion, and student permission change is timestamped and stored in MongoDB.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Audit System Online
        </div>
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
            placeholder="Search by action, details, admin..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Course', 'Lesson', 'Assessment', 'User', 'CodingProblem', 'Company'].map((target) => (
            <button
              key={target}
              onClick={() => setSelectedTarget(target)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedTarget === target
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {target}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined animate-spin text-primary-600 text-3xl">sync</span>
            <p className="text-slate-500 text-sm mt-2">Reading system audit stream...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
              <span className="material-symbols-outlined text-2xl">history_edu</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">No logs recorded yet</h3>
            <p className="text-slate-500 text-xs mt-1">Actions taken by administrators will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-black text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-6">Details</th>
                  <th className="py-3.5 px-4">Admin Email</th>
                  <th className="py-3.5 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors font-sans">
                    <td className="py-4 px-6 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-bold rounded border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[11px]">
                        {log.targetType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 text-xs">
                      {log.details || '—'}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {log.adminEmail}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
