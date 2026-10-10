import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DLLogo } from './DLLogo';
import {
  BarChart3,
  BookOpen,
  FileCheck,
  HelpCircle,
  Users,
  Code2,
  Building2,
  ShieldCheck,
  Sliders,
  LogOut,
  ExternalLink,
  UserPlus,
} from 'lucide-react';


interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview & Analytics', path: '/admin/dashboard', icon: BarChart3 },
    { label: 'Course Management', path: '/admin/courses', icon: BookOpen },
    { label: 'Assessment Manager', path: '/admin/assessments', icon: FileCheck },
    { label: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
    { label: 'Student Registry', path: '/admin/students', icon: Users },
    { label: 'Admin Team', path: '/admin/admins', icon: UserPlus },
    { label: 'Coding Problems', path: '/admin/problems', icon: Code2 },
    { label: 'Company Profiles', path: '/admin/companies', icon: Building2 },
    { label: 'Security & Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
    { label: 'Platform Settings', path: '/admin/settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-[#E1E8F2] text-slate-700 flex flex-col justify-between select-none shadow-xs">
      <div className="p-4 flex flex-col flex-1 overflow-y-auto">
        
        {/* Admin Header with DL Brand Logo */}
        <div className="px-2 py-2 mb-4 border-b border-[#E1E8F2] pb-4">
          <Link to="/" className="flex items-center">
            <DLLogo size="md" textColor="text-[#102344]" taglineColor="text-[#64748B]" />
          </Link>
        </div>

        {/* Current Administrator Chip */}
        <div className="p-3 mb-5 rounded-2xl bg-[#F8F9FE] border border-[#E1E8F2] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#165DCE] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0) || 'A'}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#102344] truncate">{user?.name}</span>
            <span className="text-[11px] text-slate-500 truncate font-mono">{user?.email}</span>
            <span className="mt-0.5 inline-block text-[9px] font-extrabold uppercase tracking-wider text-[#165DCE]">
              Administrator
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Governance Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  if (onCloseMobile) onCloseMobile();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-[#165DCE] shadow-2xs border-l-4 border-[#165DCE]'
                      : 'text-[#102344] hover:bg-slate-50 hover:text-[#165DCE]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Link back to public site */}
        <div className="mt-6 pt-4 border-t border-[#E1E8F2]">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-[#165DCE] hover:bg-slate-50 rounded-xl transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-[#E1E8F2]">
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </aside>
  );
};
