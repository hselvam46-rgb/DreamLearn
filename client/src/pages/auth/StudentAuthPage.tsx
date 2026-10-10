import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DLLogo } from '../../components/common/DLLogo';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, UserPlus, LogIn, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface StudentAuthPageProps {
  initialMode?: 'login' | 'register';
}

export const StudentAuthPage: React.FC<StudentAuthPageProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const location = useLocation();
  const navigate = useNavigate();
  const { loginStudent, registerStudent, isAuthenticated, isStudent, isAdmin } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) navigate('/admin/dashboard', { replace: true });
      else if (isStudent) navigate('/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isStudent, navigate]);

  // Sync mode with URL
  useEffect(() => {
    if (location.pathname === '/register') setMode('register');
    else if (location.pathname === '/login') setMode('login');
  }, [location.pathname]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & errors
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginStudent(email, password);
        navigate('/student/dashboard');
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await registerStudent(name, email, password);
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface relative overflow-hidden">
      
      {/* Background ambient halos */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[360px] bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-[420px] h-[420px] bg-primary-fixed/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Card (Matches Stitch UI Container) */}
      <div className="relative z-10 w-full max-w-[540px] bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-10 transition-all">
        
        {/* Brand Crest & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="mb-2 hover:scale-105 transition-transform">
            <DLLogo size="lg" textColor="text-[#102344]" taglineColor="text-[#64748B]" />
          </Link>
          <p className="text-xs text-slate-500 mt-2">Accelerate your campus placement & interview readiness</p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="relative bg-[#EFF4FF] p-1 rounded-xl flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-white text-[#102344] shadow-sm'
                : 'text-[#64748B] hover:text-[#102344]'
            }`}
          >
            <LogIn className="w-4 h-4 text-primary-container" />
            <span>Log in</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-white text-[#102344] shadow-sm'
                : 'text-[#64748B] hover:text-[#102344]'
            }`}
          >
            <UserPlus className="w-4 h-4 text-primary-container" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name for Register */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#102344]">Full name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-11 pl-10 pr-4 bg-white rounded-lg text-sm text-[#102344] border border-[#E2E8F0] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#102344]">Email address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 pl-10 pr-4 bg-white rounded-lg text-sm text-[#102344] border border-[#E2E8F0] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#102344]">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
                className="w-full h-11 pl-10 pr-11 bg-white rounded-lg text-sm text-[#102344] border border-[#E2E8F0] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-[#102344] p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password for Register */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#102344]">Confirm password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full h-11 pl-10 pr-11 bg-white rounded-lg text-sm text-[#102344] border border-[#E2E8F0] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-slate-400 hover:text-[#102344] p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember Me & Forgot Password (Login Only) */}
          {mode === 'login' && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-container accent-primary-container"
                />
                <span className="text-xs text-[#64748B] font-medium">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-xs font-bold text-primary-container hover:text-[#104AA8] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-primary-container hover:bg-[#104AA8] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <span>Log in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Continue Divider (Matching Stitch UI) */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full h-px bg-slate-200" />
          <span className="absolute bg-white px-3 text-xs text-slate-400">or continue with</span>
        </div>

        {/* Social Google Sign-In Button */}
        <button
          type="button"
          onClick={() => {
            alert('Single Sign-On (Google OAuth) is available for enterprise campus domains. Please sign in with your email and password.');
          }}
          className="w-full h-11 bg-white hover:bg-slate-50 text-[#102344] font-semibold text-xs border border-[#E2E8F0] rounded-lg shadow-2xs flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Switch */}
        <div className="mt-6 text-center text-xs text-[#64748B]">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-primary-container font-bold hover:underline ml-1"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary-container font-bold hover:underline ml-1"
              >
                Log in
              </button>
            </>
          )}
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#102344]">Reset Your Password</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Enter your registered student email address to receive password recovery instructions.
              </p>
            </div>
            <div className="space-y-1.5">
              <input
                type="email"
                placeholder="name@student.college.edu"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('If this email is registered in our student records, a secure password reset link has been dispatched.');
                  setForgotModalOpen(false);
                }}
                className="px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-lg hover:bg-[#104AA8] cursor-pointer"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
