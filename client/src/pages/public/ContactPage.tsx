import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MessageSquare, 
  Building2, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  ArrowRight,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Student Course Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending inquiry
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-[#F7F9FE] min-h-screen py-12 md:py-16 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#165DCE] text-xs font-black uppercase tracking-wider border border-blue-100">
            <Mail className="w-3.5 h-3.5 text-[#165DCE]" />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#102344] tracking-tight">
            Contact DreamLearn
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Have questions about courses, campus placement preparation, or college partnerships? Reach out to our dedicated support team.
          </p>
        </div>

        {/* Grid: Contact Information & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Card 1: Student Support */}
            <div className="bg-white rounded-3xl p-6 border border-[#E1E8F2] shadow-xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#165DCE] flex items-center justify-center font-bold mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#102344] mb-1">
                Student & Academic Support
              </h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                For course queries, coding sandbox help, and assessment troubleshooting.
              </p>
              <a 
                href="mailto:support@dreamlearn.edu" 
                className="text-xs font-bold text-[#165DCE] hover:underline inline-flex items-center gap-1.5"
              >
                <span>support@dreamlearn.edu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: Campus Partnerships & TPO */}
            <div className="bg-white rounded-3xl p-6 border border-[#E1E8F2] shadow-xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#102344] mb-1">
                College & Placement Drives
              </h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                For college TPOs, training cells, and campus recruitment mock test setups.
              </p>
              <a 
                href="mailto:partnerships@dreamlearn.edu" 
                className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1.5"
              >
                <span>partnerships@dreamlearn.edu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3: Social & Instagram */}
            <div className="bg-white rounded-3xl p-6 border border-[#E1E8F2] shadow-xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#102344] mb-1">
                Social & Community
              </h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Follow our daily placement tips, interview problems, and announcements.
              </p>
              <a 
                href="https://www.instagram.com/dreamlearn._/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1.5"
              >
                <span>Follow @dreamlearn._ on Instagram</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 4: Operating Hours */}
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 flex items-center gap-3 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-[#165DCE] shrink-0" />
              <span>Support Desk Hours: Monday – Saturday, 9:00 AM to 7:00 PM IST</span>
            </div>

          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E1E8F2] shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xs border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#102344]">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to DreamLearn. Our team has received your inquiry and will respond to <strong className="text-[#102344]">{formData.email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'Student Course Inquiry', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#165DCE] hover:bg-[#124cb0] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-[#102344] tracking-tight">
                    Send Us a Direct Message
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below and an education advisor will get in touch shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#102344]">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-11 px-4 bg-[#F8F9FE] rounded-xl text-sm text-slate-900 border border-[#E1E8F2] placeholder:text-slate-400 focus:outline-none focus:border-[#165DCE] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#102344]">Your Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full h-11 px-4 bg-[#F8F9FE] rounded-xl text-sm text-slate-900 border border-[#E1E8F2] placeholder:text-slate-400 focus:outline-none focus:border-[#165DCE] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Inquiry Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#102344]">Subject / Purpose</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 px-3.5 bg-[#F8F9FE] rounded-xl text-sm text-slate-900 border border-[#E1E8F2] focus:outline-none focus:border-[#165DCE] focus:ring-2 focus:ring-blue-100 transition-all font-semibold"
                    >
                      <option value="Student Course Inquiry">Student Course & Curriculum Inquiry</option>
                      <option value="Placement Drives & TPO">College TPO / Placement Cell Partnership</option>
                      <option value="Coding Sandbox Issue">Online Compiler & Practice Sandbox Issue</option>
                      <option value="Assessment Test Question">Technical Assessment Question</option>
                      <option value="Other Feedback">Other Feedback / Suggestions</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#102344]">Your Message</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe what you need help with or how we can collaborate..."
                      className="w-full p-4 bg-[#F8F9FE] rounded-xl text-sm text-slate-900 border border-[#E1E8F2] placeholder:text-slate-400 focus:outline-none focus:border-[#165DCE] focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 mt-2 bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-sm rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

        {/* Quick FAQs Strip */}
        <div className="bg-white rounded-3xl p-8 border border-[#E1E8F2] shadow-xs">
          <h3 className="text-lg font-black text-[#102344] mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#165DCE]" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-600">
            <div>
              <h4 className="font-bold text-[#102344] mb-1">Can our college conduct mock test drives?</h4>
              <p>Yes. We partner with universities to host custom timed campus mock tests with negative marking and instant leaderboards.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#102344] mb-1">How can students get technical doubt assistance?</h4>
              <p>Registered students can post in course discussion forums or email our academic mentors directly with problem codes.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#102344] mb-1">Where do I find certificate credentials?</h4>
              <p>Upon scoring 100% on course lessons and passing the final assessment, verified certificates appear in your student platform.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
