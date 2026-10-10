import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/common/AdminSidebar';
import { Menu, Database, ShieldCheck, X } from 'lucide-react';
import { DLLogo } from '../components/common/DLLogo';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FE]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#165DCE] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  // Strict Admin Barrier: unauthorized or students are bounced to /admin/login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#F7F9FE] text-slate-800">
      
      {/* Desktop Admin Sidebar (Fixed left, 64 = 256px) */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <AdminSidebar />
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
            <div className="p-3 border-b border-[#E1E8F2] flex items-center justify-between">
              <span className="text-xs font-black text-[#102344] uppercase tracking-wider pl-2">
                Governance Navigation
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
              <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E1E8F2] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-[#102344] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Open governance sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Workspace:
              </span>
              <span className="text-xs font-bold text-[#102344] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                Platform Administration
              </span>
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 rounded-full text-xs font-bold shadow-2xs">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>MongoDB Connected</span>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E1E8F2]">
              <div className="w-8 h-8 rounded-full bg-[#165DCE] text-white font-black flex items-center justify-center text-xs shadow-2xs overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0) || 'A'}</span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-extrabold text-[#102344] leading-none">{user?.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Master Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F7F9FE]">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
