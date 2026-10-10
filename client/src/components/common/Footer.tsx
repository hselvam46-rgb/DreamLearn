import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';
import { DLLogo } from './DLLogo';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#102344] border-t border-[#1C355E] pt-12 pb-8 text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Brand Column (4 Cols on md) */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg">
              <DLLogo size="md" textColor="text-white" taglineColor="text-blue-300" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
              Empowering engineering students and early-career software developers to master Data Structures & Algorithms, practice real interview code, and clear top campus placements.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Placement Preparation & Learning Ecosystem</span>
            </div>
          </div>

          {/* Col 1: Curriculum (2 Cols) */}
          <div className="md:col-span-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3.5">
              Curriculum
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/courses" className="text-slate-300 hover:text-white transition-colors">All Courses</Link></li>
              <li><Link to="/courses" className="text-slate-300 hover:text-white transition-colors">Data Structures (C++)</Link></li>
              <li><Link to="/courses" className="text-slate-300 hover:text-white transition-colors">Full-Stack Development</Link></li>
              <li><Link to="/courses" className="text-slate-300 hover:text-white transition-colors">Python for Placement</Link></li>
              <li><Link to="/placement" className="text-slate-300 hover:text-white transition-colors">Interview Playbook</Link></li>
            </ul>
          </div>

          {/* Col 2: Practice & Prep (2 Cols) */}
          <div className="md:col-span-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3.5">
              Practice & Prep
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/compiler" className="text-slate-300 hover:text-white transition-colors">Online Compiler & IDE</Link></li>
              <li><Link to="/problems" className="text-slate-300 hover:text-white transition-colors">Coding Problem Bank</Link></li>
              <li><Link to="/assessments" className="text-slate-300 hover:text-white transition-colors">Technical Assessments</Link></li>
              <li><Link to="/companies" className="text-slate-300 hover:text-white transition-colors">Top Hiring Companies</Link></li>
            </ul>
          </div>

          {/* Col 3: Student Platform (2 Cols) */}
          <div className="md:col-span-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3.5">
              Student Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/login" className="text-slate-300 hover:text-white transition-colors">Student Login</Link></li>
              <li><Link to="/register" className="text-slate-300 hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/student/dashboard" className="text-slate-300 hover:text-white transition-colors">Learning Dashboard</Link></li>
              <li><Link to="/student/certificates" className="text-slate-300 hover:text-white transition-colors">Certificates</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal (2 Cols) */}
          <div className="md:col-span-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3.5">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="text-slate-300 hover:text-white transition-colors">Accessibility</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li className="pt-1">
                <a
                  href="https://www.instagram.com/dreamlearn._/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow DreamLearn on Instagram"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors group"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-blue-300 group-hover:text-white transition-colors shrink-0" />
                  <span>Instagram</span>
                  <span className="text-[10px] text-blue-200/80 group-hover:text-white font-normal">@dreamlearn._</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Student note, social icon, and secondary Administrator login */}
        <div className="pt-6 border-t border-[#1C355E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DreamLearn Inc. All rights reserved. Version 1.0</p>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-medium text-slate-300">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for future engineering graduates</span>
            </div>

            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">•</span>

            {/* Compact bottom-row social link */}
            <a
              href="https://www.instagram.com/dreamlearn._/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow DreamLearn on Instagram"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title="Follow @dreamlearn._ on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-blue-300 hover:text-white" />
              <span className="text-[11px] hidden md:inline">@dreamlearn._</span>
            </a>
          </div>

          {/* Visually secondary administrator login */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Faculty & Staff:</span>
            <Link
              to="/admin/login"
              className="text-[11px] text-blue-300 hover:text-white transition-colors underline decoration-blue-500/40 hover:decoration-white"
            >
              Administrator Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
