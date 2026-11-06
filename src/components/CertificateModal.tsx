import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Award, Download, Printer, ShieldCheck, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  certificate: Certificate | null;
  onClose: () => void;
  onNavigateToVerify?: (code: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  certificate,
  onClose,
  onNavigateToVerify,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (certificate) {
      QRCode.toDataURL(
        `https://skillj.universe.app/verify/${certificate.certificateCode}`,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#111827',
            light: '#FFFFFF',
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [certificate]);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-red-200 overflow-hidden my-6">
        {/* Modal Top Control Bar */}
        <div className="bg-slate-900 px-6 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Official UNIVERSE Certificate Credentials
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CARD */}
        <div ref={printRef} className="p-8 sm:p-12 bg-radial from-white via-red-50/20 to-slate-50 relative select-none">
          {/* Ornate Certificate Border */}
          <div className="border-4 border-double border-red-600 rounded-2xl p-6 sm:p-8 bg-white/90 shadow-sm relative overflow-hidden">
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <span className="text-[180px] font-black text-red-900 tracking-tighter">SKILLJ</span>
            </div>

            {/* Top Branding */}
            <div className="text-center space-y-2 border-b-2 border-red-100 pb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-black text-red-700 tracking-widest uppercase">
                <span>UNIVERSE EDUCATIONAL COUNCIL</span>
              </div>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md font-black text-2xl">
                  SJ
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    SKILL<span className="text-red-600">J</span>
                  </h1>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    A SUBSIDIARY OF UNIVERSE • LEARN • TEACH • GROW
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Heading */}
            <div className="text-center my-6 space-y-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                Official Certificate of Academic Excellence
              </h2>
              <p className="text-xs text-slate-600 italic">This is to proudly certify that</p>
              <div className="text-3xl sm:text-4xl font-serif font-black text-slate-900 py-1 text-red-700">
                {certificate.studentName}
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                has successfully completed all required syllabus modules, class attendance, and scheduled examinations in
              </p>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {certificate.courseTitle}
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                Grade: {certificate.grade} ({certificate.marksPercentage}% Distinction)
              </div>
            </div>

            {/* Bottom Signatures & Verification QR */}
            <div className="pt-6 border-t-2 border-red-100 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {/* Teacher Signature */}
              <div className="text-center sm:text-left space-y-1">
                <div className="font-serif italic text-lg text-slate-800">
                  {certificate.teacherName}
                </div>
                <div className="h-0.5 w-32 bg-slate-400 mx-auto sm:mx-0" />
                <div className="text-[10px] font-bold uppercase text-slate-500">Authorized Master Instructor</div>
                <div className="text-[10px] text-slate-400">SKILLJ Faculty Board</div>
              </div>

              {/* QR Verification Code */}
              <div className="flex flex-col items-center justify-center text-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Verification QR" className="h-24 w-24 border border-slate-200 rounded-lg p-1 bg-white shadow-2xs" />
                ) : (
                  <div className="h-24 w-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                    QR Code
                  </div>
                )}
                <div className="mt-1 text-[9px] font-mono font-bold text-slate-600 tracking-wider">
                  SCAN TO VERIFY
                </div>
              </div>

              {/* Director Signature & ID */}
              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic text-lg text-slate-800">
                  Academic Registrar
                </div>
                <div className="h-0.5 w-32 bg-slate-400 mx-auto sm:ml-auto" />
                <div className="text-[10px] font-bold uppercase text-slate-500">UNIVERSE Council</div>
                <div className="text-[10px] text-slate-400">Issue Date: {certificate.issueDate}</div>
              </div>
            </div>

            {/* Certificate ID footer */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400">
              <span className="font-mono">Certificate ID: <strong className="text-slate-700">{certificate.certificateCode}</strong></span>
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cryptographically Signed by UNIVERSE
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Public verification URL: <code className="font-mono text-red-600 bg-red-50 px-1 py-0.5 rounded">skillj.universe.app/verify/{certificate.certificateCode}</code>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onNavigateToVerify) onNavigateToVerify(certificate.certificateCode);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Open Public Verifier</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
