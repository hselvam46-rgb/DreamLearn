import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Mail,
  Phone,
  Calendar,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

interface AdminAccount {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  status: 'active' | 'suspended';
  phone?: string;
  createdAt: string;
}

export const AdminAdminsPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'suspended'>('All');
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Status message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getAdmins();
      if (res.admins) {
        setAdmins(res.admins);
      }
    } catch (err: any) {
      console.error('Failed to load administrators:', err);
      setFeedback({ type: 'error', text: err.message || 'Failed to load administrator accounts.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!name.trim() || !email.trim() || !password) {
      setModalError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setModalError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.admin.createAdmin({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      });

      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setFeedback({
        type: 'success',
        text: `Administrator account for ${res.admin?.name || email} created successfully.`,
      });
      fetchAdmins();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create administrator account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin: AdminAccount) => {
    const newStatus = admin.status === 'active' ? 'suspended' : 'active';
    try {
      await api.admin.setAdminStatus(admin._id, newStatus);
      setFeedback({
        type: 'success',
        text: `Administrator ${admin.name} is now ${newStatus}.`,
      });
      fetchAdmins();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update administrator status.' });
    }
  };

  const handleDeleteAdmin = async (admin: AdminAccount) => {
    if (!window.confirm(`Are you sure you want to permanently delete administrator "${admin.name}" (${admin.email})?`)) {
      return;
    }

    try {
      await api.admin.deleteAdmin(admin._id);
      setFeedback({
        type: 'success',
        text: `Administrator ${admin.name} removed successfully.`,
      });
      fetchAdmins();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete administrator.' });
    }
  };

  const filteredAdmins = admins.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.phone && a.phone.includes(searchQuery));
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#165DCE] text-xs font-bold uppercase mb-2 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Access Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Team Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Provision administrative accounts, manage access controls, and govern staff authorizations.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#165DCE] flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Administrators
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {admins.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Active Authorized
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {admins.filter((a) => a.status === 'active').length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Current Session
            </span>
            <span className="text-sm font-black text-slate-900 truncate block max-w-[180px]">
              {currentAdmin?.name || 'Administrator'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Status:</span>
          {(['All', 'active', 'suspended'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#165DCE] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Administrator Cards / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            <div className="w-8 h-8 border-3 border-[#165DCE] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading administrator accounts...
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No administrators match the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Administrator</th>
                  <th className="py-3.5 px-4">Contact & Credentials</th>
                  <th className="py-3.5 px-4">Role & Authority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Provisioned</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.map((admin) => {
                  const isCurrent = currentAdmin?._id === admin._id;
                  const isPrimaryRoot = admin.email === 'admin@dreamlearn.edu';

                  return (
                    <tr key={admin._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#165DCE] to-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{admin.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold bg-blue-100 text-[#165DCE] px-1.5 py-0.2 rounded-md">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              ID: {admin._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Email */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-mono text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{admin.email}</span>
                          </div>
                          {admin.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{admin.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{isPrimaryRoot ? 'Super Administrator' : 'Platform Administrator'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            admin.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              admin.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span>{admin.status}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle Status */}
                          <button
                            onClick={() => handleToggleStatus(admin)}
                            disabled={isCurrent || isPrimaryRoot}
                            title={
                              isCurrent
                                ? 'You cannot alter your own status'
                                : isPrimaryRoot
                                ? 'Root administrator cannot be suspended'
                                : admin.status === 'active'
                                ? 'Suspend Administrator'
                                : 'Activate Administrator'
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                              isCurrent || isPrimaryRoot
                                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                                : admin.status === 'active'
                                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                            }`}
                          >
                            {admin.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>

                          {/* Delete Admin */}
                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            disabled={isCurrent || isPrimaryRoot}
                            title={
                              isCurrent
                                ? 'You cannot delete your own account'
                                : isPrimaryRoot
                                ? 'Root administrator cannot be deleted'
                                : 'Delete Administrator'
                            }
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isCurrent || isPrimaryRoot
                                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                                : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add New Administrator */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="px-6 py-5 bg-[#102344] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Add New Platform Administrator</h3>
                  <p className="text-[11px] text-blue-200">Provision authorized access credentials</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              
              {modalError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. Ananya Iyer"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Administrator Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya@dreamlearn.edu"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  This email will be used for administrator portal authentication.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Temporary Access Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters..."
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-[#102344] block mb-0.5">Security Notice:</strong>
                Newly created administrators gain full access to course authoring, question banks, student moderation, and assessment evaluation.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Admin...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Administrator</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
