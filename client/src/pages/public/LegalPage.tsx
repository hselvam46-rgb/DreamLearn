import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Eye, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'accessibility';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    accessibility: 'Accessibility Statement',
  };

  const subtitles = {
    privacy: 'How DreamLearn safeguards student data, coding submissions, and academic records.',
    terms: 'Conditions of use for the DreamLearn LMS platform, online compiler, and assessments.',
    accessibility: 'Our commitment to ensuring DreamLearn is accessible to all learners worldwide.',
  };

  return (
    <div className="min-h-screen bg-[#F7F9FE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb / Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-3xl border border-[#E1E8F2] p-8 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-xs font-black uppercase tracking-wider border border-blue-100 mb-3">
            {type === 'privacy' && <ShieldCheck className="w-3.5 h-3.5" />}
            {type === 'terms' && <FileText className="w-3.5 h-3.5" />}
            {type === 'accessibility' && <Eye className="w-3.5 h-3.5" />}
            <span>DreamLearn Official Policy</span>
          </div>
          <h1 className="text-3xl font-black text-[#102344] tracking-tight">
            {titles[type]}
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {subtitles[type]}
          </p>
          <div className="text-xs font-semibold text-slate-400 mt-4 pt-4 border-t border-slate-100">
            Last Updated: October 2026 · Version 1.0
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl border border-[#E1E8F2] p-8 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          {type === 'privacy' && (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">1. Information We Collect</h2>
                <p>
                  DreamLearn collects student registration information (name, institutional email, college, graduation year, target company) to personalize DSA learning roadmaps, track assessment outcomes, and generate verifiable course completion certificates.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">2. Code Execution & Submissions</h2>
                <p>
                  Source code submitted to the online compiler is executed in temporary, isolated sandboxes. We analyze execution logs exclusively to verify test case pass rates, runtime efficiency, and memory consumption. We do not sell or monetize student source code.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">3. Data Security & Retention</h2>
                <p>
                  Passwords are encrypted with bcrypt salt hashing. Assessment tokens and JWT sessions are secured over TLS. Students can request data removal or export their learning analytics at any time via account settings.
                </p>
              </section>
            </>
          )}

          {type === 'terms' && (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">1. Platform Access & Code of Conduct</h2>
                <p>
                  By accessing DreamLearn, you agree to maintain academic integrity during timed mock assessments and coding evaluations. Automated scraping or reverse engineering of assessment questions is strictly prohibited.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">2. Certification Authenticity</h2>
                <p>
                  Course completion certificates are tied to unique tamper-proof identifier hashes. Verification is accessible via our public certificate lookup tool. Misrepresentation of certificates is grounds for account suspension.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">3. Indicative Placement Data</h2>
                <p>
                  Company salary bands and recruitment blueprints are compiled from historical campus drives and student interview submissions. They serve as indicative benchmarks and do not constitute an explicit hiring guarantee by DreamLearn.
                </p>
              </section>
            </>
          )}

          {type === 'accessibility' && (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">1. WCAG 2.1 AA Compliance</h2>
                <p>
                  DreamLearn adheres to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards across all user interfaces, ensuring high text contrast, scalable typography, and keyboard navigable controls.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">2. Screen Readers & Code Editors</h2>
                <p>
                  Our code workspace includes ARIA live regions for compilation output and execution diagnostics, enabling screen reader compatibility for visually impaired engineering students.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-extrabold text-[#102344]">3. Assistance & Feedback</h2>
                <p>
                  If you encounter accessibility hurdles while navigating our curriculum or assessments, please reach out to our team at support@dreamlearn.edu for prompt remediation.
                </p>
              </section>
            </>
          )}

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Questions regarding these policies?</span>
            <Link
              to="/"
              className="text-xs font-bold text-primary hover:underline"
            >
              Contact DreamLearn Team
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
