import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Certificate } from '../../types';
import { Award, CheckCircle, Printer, ExternalLink, ShieldCheck, Download } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  useEffect(() => {
    api.certificates.getMy()
      .then((res) => {
        if (res.certificates) {
          setCertificates(res.certificates);
          if (res.certificates.length > 0) setActiveCert(res.certificates[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344]">Course Certificates</h1>
          <p className="text-sm text-slate-500 mt-1">Official credentials awarded for completing 100% of course curriculum.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#102344]">No certificates earned yet</h3>
          <p className="text-xs text-slate-500">Complete all lessons in an enrolled course to receive your verified certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Certificates List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 block">
              Issued Credentials ({certificates.length})
            </span>

            <div className="space-y-3">
              {certificates.map((cert) => {
                const isSelected = activeCert?._id === cert._id;
                return (
                  <button
                    key={cert._id}
                    onClick={() => setActiveCert(cert)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-primary-container shadow-xs'
                        : 'bg-white border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        {cert.grade || 'Distinction'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#102344] line-clamp-1">{cert.courseTitle}</h4>
                    <span className="text-[11px] text-slate-500 font-mono block mt-1">ID: {cert.certificateNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certificate Formal Document Viewer (8 Cols) */}
          <div className="lg:col-span-8">
            {activeCert && (
              <div className="space-y-4">
                
                <div className="flex justify-end gap-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#104AA8] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save as PDF</span>
                  </button>
                </div>

                {/* Printable Document Frame */}
                <div className="bg-white rounded-3xl border-8 border-slate-100 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
                  
                  {/* Outer decorative border */}
                  <div className="absolute inset-2 border-2 border-amber-500/20 rounded-2xl pointer-events-none" />

                  {/* Logo */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary-container text-white flex items-center justify-center font-extrabold text-2xl shadow-md mb-2">
                      DL
                    </div>
                    <span className="text-xl font-extrabold text-[#102344] tracking-tight">DreamLearn</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">
                      Accredited Online Certification
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary-container">
                      Certificate of Achievement
                    </span>
                    <p className="text-xs text-slate-400">This credential is proudly conferred upon</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102344] pt-2 pb-1 font-serif">
                      {activeCert.studentName}
                    </h2>
                    <div className="w-24 h-0.5 bg-amber-400 mx-auto" />
                  </div>

                  <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                    for successfully fulfilling all rigorous curriculum requirements, practical programming challenges, and demonstrating mastery in
                  </p>

                  <h3 className="text-lg sm:text-xl font-black text-[#102344]">
                    {activeCert.courseTitle}
                  </h3>

                  <div className="pt-6 grid grid-cols-2 gap-8 max-w-md mx-auto text-xs text-slate-500 border-t border-slate-200">
                    <div>
                      <span className="font-bold text-[#102344] block">Raghav Sharma</span>
                      <span className="text-[11px] block">Lead Technical Director</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#102344] block">DreamLearn Board</span>
                      <span className="text-[11px] block">Verification Authority</span>
                    </div>
                  </div>

                  <div className="pt-4 text-[10px] text-slate-400 font-mono flex flex-wrap justify-between items-center gap-2">
                    <span>Credential: {activeCert.certificateNumber}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Digitally Verified
                    </span>
                    <span>Issued: {new Date(activeCert.issueDate).toLocaleDateString()}</span>
                  </div>

                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
