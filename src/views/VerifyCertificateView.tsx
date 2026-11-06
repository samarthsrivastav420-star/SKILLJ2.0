import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, XCircle, Search, Building } from 'lucide-react';
import { Certificate } from '../types';

interface VerifyCertificateViewProps {
  initialCode?: string;
  certificates: Certificate[];
}

export const VerifyCertificateView: React.FC<VerifyCertificateViewProps> = ({
  initialCode = 'SKILLJ-UNIV-WEBDEV-RSH-2026',
  certificates,
}) => {
  const [code, setCode] = useState(initialCode);
  const [searched, setSearched] = useState(true);
  const [matchedCert, setMatchedCert] = useState<Certificate | null>(
    certificates.find((c) => c.certificateCode.toLowerCase() === initialCode.toLowerCase()) || certificates[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const found = certificates.find(
      (c) => c.certificateCode.trim().toLowerCase() === code.trim().toLowerCase()
    );
    setMatchedCert(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>UNIVERSE Official Verification Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Verify SKILLJ Digital Credentials
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Enter any official Certificate ID printed on a student's certificate or scan its verification QR code to confirm legitimacy.
        </p>
      </div>

      {/* Verification Query Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SKILLJ-UNIV-WEBDEV-RSH-2026"
            required
            className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-xs font-mono font-bold focus:border-red-500 focus:outline-hidden shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs shadow-md shadow-red-600/25 transition cursor-pointer"
        >
          Verify Certificate
        </button>
      </form>

      {/* Results Display */}
      {searched && (
        <div className="max-w-2xl mx-auto">
          {matchedCert ? (
            <div className="rounded-3xl border-2 border-emerald-400 bg-emerald-50/40 p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-3 border-b border-emerald-200 pb-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block">
                    AUTHENTIC & VERIFIED CREDENTIAL
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Official SKILLJ Certificate Record
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Recipient Student</span>
                  <span className="font-black text-sm text-slate-900">{matchedCert.studentName}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Course / Qualification</span>
                  <span className="font-black text-sm text-slate-900">{matchedCert.courseTitle}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Master Faculty Examiner</span>
                  <span className="font-bold text-slate-800">{matchedCert.teacherName}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Academic Distinction</span>
                  <span className="font-bold text-emerald-700">{matchedCert.grade} ({matchedCert.marksPercentage}%)</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Issue Date</span>
                  <span className="font-medium text-slate-800">{matchedCert.issueDate}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Governing Organization</span>
                  <span className="font-bold text-slate-900">UNIVERSE Council</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 text-center">
                🔒 In adherence with UNIVERSE privacy protocols: Private student contact details, Aadhaar, and financial records remain permanently confidential and unexposed to public query.
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-8 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <XCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-red-900">Certificate Not Found</h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">
                No certificate with the code <code>"{code}"</code> was located in the UNIVERSE verification registry. Please double check the ID format.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
