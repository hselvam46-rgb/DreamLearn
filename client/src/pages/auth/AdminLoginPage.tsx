import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DLLogo } from '../../components/common/DLLogo';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Access denied. Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F7F9FE] text-slate-800 relative selection:bg-blue-100">
      
      {/* Centered White Admin Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E1E8F2] p-8 sm:p-10 shadow-xl relative z-10">
        
        {/* Brand & Heading */}
        <div className="flex flex-col items-center text-center mb-7">
          <Link to="/" className="mb-4 hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE] rounded-xl">
            <DLLogo size="lg" textColor="text-[#102344]" taglineColor="text-[#64748B]" />
          </Link>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#165DCE] text-xs font-black uppercase tracking-wider mb-2 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Governance</span>
          </div>

          <h1 className="text-2xl font-black text-[#102344] tracking-tight">
            Administrator Login
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Authorized personnel and curriculum management only.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Administrator Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#102344]">Administrator Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dreamlearn.edu"
                className="w-full h-11 pl-10 pr-4 bg-[#F8F9FE] rounded-xl text-sm text-slate-900 border border-[#E1E8F2] placeholder:text-slate-400 focus:outline-none focus:border-[#165DCE] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#102344]">Password</label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-xs font-semibold text-[#165DCE] hover:underline cursor-pointer"
              >
                Need help?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-11 bg-[#F8F9FE] rounded-xl text-sm text-slate-900 border border-[#E1E8F2] placeholder:text-slate-400 focus:outline-none focus:border-[#165DCE] focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-4 bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-sm rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link back to main website */}
        <div className="mt-7 pt-4 border-t border-[#E1E8F2] text-center">
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-[#165DCE] transition-colors inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE] rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to DreamLearn Website</span>
          </Link>
        </div>

      </div>

      {/* Forgot / Help Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E1E8F2] rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl">
            <h3 className="text-lg font-black text-[#102344]">Administrator Access Protocol</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Public self-registration and automated password reset are restricted for enterprise platform governance.
            </p>
            <div className="my-4 p-3.5 rounded-xl bg-[#F8F9FE] border border-[#E1E8F2] text-xs text-slate-700 space-y-1 leading-relaxed">
              <p>To request credential rotation or administrative provisioning, please contact your organization's senior technical administrator.</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 bg-[#165DCE] hover:bg-[#124cb0] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
