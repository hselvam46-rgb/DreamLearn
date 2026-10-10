import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AvatarUploadModal } from '../../components/common/AvatarUploadModal';
import { Camera, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  // Platform configs (display only)
  const [systemInfo] = useState({
    platformName: 'DreamLearn (DL)',
    version: '1.0 · October 2026',
    architecture: 'MERN Stack (MongoDB, Express, React, Node.js)',
    environment: 'Development / Sandboxed',
    database: 'MongoDB In-Memory Engine Active',
    codeSandbox: 'Native Compiler Runtime (C, C++, Java, Python, JS)',
    authSecurity: 'JWT + bcrypt (Salt rounds 10)',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    try {
      setUpdating(true);
      setStatusMsg(null);
      await api.auth.changePassword({
        currentPassword: currentPassword || undefined,
        newPassword,
      });
      setStatusMsg({ type: 'success', text: 'Administrator password updated securely. Next login requires this new password.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update administrator password. Please verify current credentials.' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Account & Platform Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage administrator profile credentials, profile avatar, security policies, and inspect system operational status.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {avatarSuccess && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Administrator avatar updated successfully!</span>
        </div>
      )}

      {/* Account Info & Avatar Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <div 
                onClick={() => setShowAvatarModal(true)}
                className="w-16 h-16 rounded-2xl bg-primary-container text-white font-extrabold text-2xl flex items-center justify-center overflow-hidden shadow-md cursor-pointer border-2 border-white ring-2 ring-blue-100 hover:ring-primary-container transition-all"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0) || 'A'}</span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                title="Change admin photo"
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-container hover:bg-[#104AA8] text-white rounded-lg flex items-center justify-center shadow-md border border-white cursor-pointer transition-transform hover:scale-110"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="text-base font-extrabold text-[#102344]">{user?.name || 'Administrator'}</div>
              <div className="text-xs text-slate-500 font-mono">{user?.email || 'admin@dreamlearn.edu'}</div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="mt-2 text-xs text-primary-container hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>Change Profile Picture</span>
              </button>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg self-start sm:self-center">
            <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
            Super Administrator
          </span>
        </div>

        <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-600 text-base">manage_accounts</span>
          Administrator Details & Privileges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Full Name</span>
            <div className="text-sm font-bold text-slate-800">{user?.name || 'DreamLearn Administrator'}</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Email Address</span>
            <div className="text-sm font-bold text-slate-800 font-mono">{user?.email || 'admin@dreamlearn.edu'}</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Assigned Role</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-md">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              Super Administrator
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Permissions</span>
            <div className="text-xs text-slate-600 font-bold">Unrestricted Course, Assessment, Code & User Governance</div>
          </div>
        </div>
      </div>

      {/* Administrator Team Governance Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-600">group_add</span>
            Administrator Team Management
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Authorize faculty members, provision new administrators, and manage staff permissions.
          </p>
        </div>
        <Link
          to="/admin/admins"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Manage & Add Admins</span>
        </Link>
      </div>

      {/* Password Change Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-600">lock_reset</span>
          Security & Password Change
        </h2>
        <p className="text-slate-500 text-xs mb-5">
          Regularly update your credentials to preserve administrative security. Passwords must be at least 6 characters.
        </p>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {showCurrentPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-primary-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {updating && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
            <span>{updating ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* System Status Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-600">info</span>
          Platform Architecture & Specifications
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          {Object.entries(systemInfo).map(([key, val]) => (
            <div key={key} className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-bold text-slate-800 font-mono">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reusable Avatar Upload Modal for Admin */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onAvatarUpdated={() => {
          setAvatarSuccess(true);
          setTimeout(() => setAvatarSuccess(false), 3000);
        }}
      />
    </div>
  );
};
