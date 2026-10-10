import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StudentSidebar } from '../components/common/StudentSidebar';
import { Menu, X, Flame } from 'lucide-react';
import { DLLogo } from '../components/common/DLLogo';

export const StudentLayout: React.FC = () => {
  const { user, isAuthenticated, isStudent, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#165DCE] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading student platform...</p>
        </div>
      </div>
    );
  }

  // Route protection
  if (!isAuthenticated || !isStudent) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#F8F9FE] text-slate-800">
      
      {/* Desktop Sidebar (Fixed left, 64 = 256px) */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <StudentSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <div className="relative z-10 w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#102344] uppercase tracking-wider pl-2">
                DreamLearn Navigation
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <StudentSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E1E8F2] px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-[#102344] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden">
              <Link to="/student/dashboard" className="flex items-center">
                <DLLogo size="sm" showText={false} />
              </Link>
            </div>
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              Student Platform • Placement Prep Track
            </span>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-3">
            {user?.streak && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 text-amber-700 rounded-full text-xs font-extrabold shadow-2xs">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{user.streak.current} Day Streak</span>
              </div>
            )}

            <Link
              to="/student/profile"
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#165DCE]"
              title="View Profile Settings"
            >
              <div className="w-8 h-8 rounded-full bg-[#165DCE] text-white font-extrabold flex items-center justify-center text-xs overflow-hidden shadow-2xs">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0) || 'S'}</span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-extrabold text-[#102344]">
                {user?.name?.split(' ')[0] || user?.name}
              </span>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
