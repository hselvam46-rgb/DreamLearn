import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DLLogo } from './DLLogo';
import { 
  BookOpen, 
  Code, 
  FileCheck, 
  Building2, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck,
  Mail
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  guestHref: string;
  studentHref: string;
  icon?: React.FC<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'courses', label: 'Courses', guestHref: '/courses', studentHref: '/student/learning', icon: BookOpen },
  { id: 'compiler', label: 'Compiler', guestHref: '/#compiler', studentHref: '/student/compiler', icon: Code },
  { id: 'practice', label: 'Practice', guestHref: '/#practice', studentHref: '/student/practice' },
  { id: 'assessments', label: 'Assessments', guestHref: '/#assessments', studentHref: '/student/assessments', icon: FileCheck },
  { id: 'companies', label: 'Companies', guestHref: '/companies', studentHref: '/student/companies', icon: Building2 },
  { id: 'contact', label: 'Contact', guestHref: '/contact', studentHref: '/contact', icon: Mail },
];

export const Navbar: React.FC = () => {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change or ESC
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    setMobileMenuOpen(false);

    if (location.pathname === '/' && (item.id === 'contact' || !isAuthenticated)) {
      const element = document.getElementById(item.id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${item.id}`);
        return;
      }
    }

    const target = isAuthenticated && isStudent ? item.studentHref : item.guestHref;
    if (target.startsWith('/#')) {
      if (location.pathname === '/') {
        const id = target.replace('/#', '');
        const elem = document.getElementById(id);
        if (elem) {
          e.preventDefault();
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.replaceState(null, '', `#${id}`);
          return;
        }
      }
    }
    navigate(target);
  };

  const isItemActive = (item: NavItem) => {
    if (item.id === 'contact' && (location.pathname === '/contact' || (location.pathname === '/' && location.hash === '#contact'))) return true;
    if (isAuthenticated && isStudent) {
      if (location.pathname === item.studentHref) return true;
      if (item.id === 'courses' && (location.pathname.startsWith('/student/learning') || location.pathname.startsWith('/courses'))) return true;
      if (item.id === 'compiler' && location.pathname.startsWith('/student/compiler')) return true;
      if (item.id === 'practice' && (location.pathname.startsWith('/student/practice') || location.pathname.startsWith('/student/problems'))) return true;
      if (item.id === 'assessments' && location.pathname.startsWith('/student/assessments')) return true;
      if (item.id === 'companies' && (location.pathname.startsWith('/student/companies') || location.pathname.startsWith('/companies'))) return true;
      return false;
    }
    if (item.guestHref === '/courses' && location.pathname === '/courses') return true;
    if (item.guestHref === '/companies' && location.pathname === '/companies') return true;
    if (location.pathname === '/' && location.hash === `#${item.id}`) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E1E8F2] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ============================================================ */}
          {/* 1. LEFT: DreamLearn DL Logo and Tagline                     */}
          {/* ============================================================ */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE] focus-visible:ring-offset-2 py-1"
              aria-label="DreamLearn Home"
            >
              <DLLogo size="md" textColor="text-[#102344]" taglineColor="text-[#64748B]" />
            </Link>
          </div>

          {/* ============================================================ */}
          {/* 2. CENTER: Clean Navigation Links with Exact Spacing        */}
          {/* ============================================================ */}
          <nav 
            className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 flex-1 px-4"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              const destination = isAuthenticated && isStudent ? item.studentHref : item.guestHref;
              return (
                <Link
                  key={item.id}
                  to={destination}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-sm font-bold tracking-tight transition-colors duration-150 flex items-center gap-2 py-1.5 px-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE] focus-visible:ring-offset-2 ${
                    active
                      ? 'text-[#165DCE]'
                      : 'text-[#102344] hover:text-[#165DCE]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-4 h-4 text-[#165DCE] shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ============================================================ */}
          {/* 3. RIGHT: Actions (Sign In / Get Started or Student Learning)*/}
          {/* ============================================================ */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAuthenticated && isStudent ? (
              /* Authenticated student: dedicated "My Learning" action (no "Dashboard" label, no streak/avatar) */
              <Link
                to="/student/learning"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#165DCE] hover:bg-[#124cb0] rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE] focus-visible:ring-offset-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>My Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              /* Public Navbar: Replaced Admin Console with clean Log In / Create Account */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-bold text-[#165DCE] bg-white border border-[#165DCE]/35 hover:border-[#165DCE] hover:bg-blue-50/50 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE] focus-visible:ring-offset-2"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#165DCE] hover:bg-[#124cb0] rounded-xl shadow-xs hover:shadow-md transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE] focus-visible:ring-offset-2"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 4. MOBILE: Hamburger Menu Button                            */}
          {/* ============================================================ */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#102344] hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DCE]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. RESPONSIVE MOBILE MENU DRAWER                            */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E1E8F2] bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              const destination = isAuthenticated && isStudent ? item.studentHref : item.guestHref;
              return (
                <Link
                  key={item.id}
                  to={destination}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                    active
                      ? 'bg-blue-50 text-[#165DCE]'
                      : 'text-[#102344] hover:bg-slate-50 hover:text-[#165DCE]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-4 h-4 text-[#165DCE] shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-3 border-t border-[#E1E8F2] flex flex-col gap-2.5">
            {isAuthenticated && isStudent ? (
              <Link
                to="/student/learning"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 text-center rounded-xl bg-[#165DCE] hover:bg-[#124cb0] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>My Learning Workspace</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold text-[#165DCE] bg-white border border-[#165DCE]/35 hover:bg-blue-50/50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold text-white bg-[#165DCE] hover:bg-[#124cb0] shadow-xs transition-colors"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
