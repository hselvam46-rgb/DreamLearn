import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  User, Mail, Phone, School, Calendar, Target, CheckCircle2, 
  Flame, Award, Save, Camera, Lock, Eye, EyeOff, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { AvatarUploadModal } from '../../components/common/AvatarUploadModal';

export const StudentProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  // Profile Information State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [college, setCollege] = useState(user?.college || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || 2026);
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Handle saving general profile info
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setError(null);

    try {
      await api.auth.updateProfile({
        name,
        phone,
        college,
        graduationYear: Number(graduationYear),
        targetCompany,
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Handle changing password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await api.auth.changePassword({
        currentPassword: currentPassword || undefined,
        newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header with Avatar & Details */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-5">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div 
              onClick={() => setShowAvatarModal(true)}
              className="w-20 h-20 rounded-2xl bg-primary-container text-white font-extrabold text-2xl flex items-center justify-center overflow-hidden shadow-md cursor-pointer border-2 border-white ring-2 ring-blue-100 hover:ring-primary-container transition-all"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0) || 'S'}</span>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              title="Change profile picture"
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-container hover:bg-[#104AA8] text-white rounded-xl flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#102344]">{user?.name}</h1>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-primary-container text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>Change Photo</span>
              </button>
            </div>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">{user?.email}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-primary-container text-[11px] font-bold">
                Student Account
              </span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Change Photo Button */}
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setShowAvatarModal(true)}
            className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-primary-container text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change Profile Picture</span>
          </button>
        </div>
      </div>

      {avatarSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile picture updated and saved successfully!</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
          <Flame className="w-8 h-8 text-amber-500 fill-amber-500" />
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Current Streak</span>
            <span className="text-lg font-black text-[#102344]">{user?.streak?.current || 7} Days</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
          <Target className="w-8 h-8 text-primary-container" />
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Readiness Score</span>
            <span className="text-lg font-black text-[#102344]">{user?.placementReadiness?.score || 82}%</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
          <Award className="w-8 h-8 text-emerald-500" />
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Solved Problems</span>
            <span className="text-lg font-black text-[#102344]">{user?.placementReadiness?.solvedCount || 104}</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-extrabold text-[#102344] mb-6">Profile Settings & Target Goals</h2>

        {savedSuccess && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#102344]">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#102344]">Email Address (Permanent)</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 text-slate-400 rounded-xl text-sm border border-slate-200 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#102344]">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 pl-10 pr-4 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#102344]">College / University</label>
              <div className="relative flex items-center">
                <School className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full h-11 pl-10 pr-4 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#102344]">Graduation Year</label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  placeholder="2026"
                  className="w-full h-11 pl-10 pr-4 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#102344]">Target Company</label>
              <div className="relative flex items-center">
                <Target className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Amazon"
                  className="w-full h-11 pl-10 pr-4 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary-container hover:bg-[#104AA8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Change Card */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-container flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#102344]">Password & Security</h2>
            <p className="text-xs text-slate-500">Ensure your student account is guarded with a strong password</p>
          </div>
        </div>

        <div className="mt-6">
          {passwordSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Password updated successfully! Next time you sign in, use your new password.</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#102344]">Current Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-11 pl-10 pr-10 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#102344]">New Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full h-11 pl-10 pr-10 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#102344]">Confirm New Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full h-11 pl-10 pr-10 bg-white rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="submit"
                disabled={updatingPassword}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{updatingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Reusable Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onAvatarUpdated={() => {
          setAvatarSuccessMsg(true);
          setTimeout(() => setAvatarSuccessMsg(false), 3000);
        }}
      />

    </div>
  );
};
