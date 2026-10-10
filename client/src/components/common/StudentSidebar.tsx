import React from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DLLogo } from './DLLogo';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FileCheck2,
  Terminal,
  Code2,
  Building,
  GraduationCap,
  Award,
  User,
  Settings,
  LogOut,
  Flame,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface StudentSidebarProps {
  onCloseMobile?: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Learning', path: '/student/learning', alias: '/student/my-learning', icon: BookOpen },
    { label: 'Explore Courses', path: '/student/courses', alias: '/courses', icon: Compass },
    { label: 'Assessments', path: '/student/assessments', icon: FileCheck2 },
    { label: 'Online Compiler', path: '/student/compiler', icon: Terminal },
    { label: 'Practice Problems', path: '/student/practice', alias: '/student/problems', icon: Code2 },
    { label: 'Companies', path: '/student/companies', icon: Building },
    { label: 'Placement Prep', path: '/student/placement-prep', alias: '/student/placement', icon: GraduationCap },
    { label: 'Certificates', path: '/student/certificates', icon: Award },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  // Check active state supporting route aliases
  const isItemActive = (path: string, alias?: string) => {
    const current = location.pathname;
    if (current === path) return true;
    if (alias && current === alias) return true;
    if (path === '/student/practice' && (current.startsWith('/student/problems') || current.startsWith('/student/practice'))) return true;
    if (path === '/student/assessments' && current.startsWith('/student/assessments')) return true;
    if (path === '/student/learning' && (current.startsWith('/student/learning') || current.startsWith('/student/my-learning') || current.startsWith('/student/learn/'))) return true;
    if (path === '/student/placement-prep' && (current === '/student/placement' || current === '/student/placement-prep')) return true;
    return false;
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-[#E1E8F2] flex flex-col justify-between select-none shadow-xs">
      <div className="p-4 flex flex-col flex-1 overflow-y-auto">
        
        {/* Brand Header */}
        <div className="px-2 py-2 mb-4 border-b border-slate-100 pb-4">
          <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#165DCE] rounded-xl">
            <DLLogo size="md" textColor="text-[#102344]" taglineColor="text-[#64748B]" />
          </Link>
        </div>

        {/* User Card */}
        <div className="p-3.5 mb-5 rounded-2xl bg-[#F8F9FE] border border-[#E1E8F2] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#165DCE] text-white font-extrabold flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0) || 'S'}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-extrabold text-[#102344] truncate">{user?.name}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {user?.streak?.current || 7}d
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {user?.placementReadiness?.score || 82}%
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Student Platform Navigation">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path, item.alias);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:ring-offset-2 ${
                  active
                    ? 'bg-blue-50 text-[#165DCE] font-extrabold border-l-4 border-[#165DCE] pl-2.5 shadow-2xs'
                    : 'text-slate-600 hover:text-[#102344] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? 'text-[#165DCE]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
              </NavLink>
            );
          })}
        </nav>

        {/* Public Homepage Link */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-[#165DCE] hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#165DCE]"
          >
            <span>Public Home</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
