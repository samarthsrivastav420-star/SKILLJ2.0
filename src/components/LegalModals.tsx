import React from 'react';
import { ShieldCheck, Lock, X, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-red-200 overflow-hidden my-6">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white" />
            <h3 className="text-base font-black">
              {type === 'terms' ? 'SKILLJ Terms & Conditions of Service' : 'SKILLJ & UNIVERSE Privacy Policy'}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-600 leading-relaxed">
          {type === 'terms' ? (
            <>
              <h4 className="font-bold text-slate-900 text-sm">1. Platform Ownership & Structure</h4>
              <p>
                SKILLJ is an online learning and teaching platform wholly owned and operated by <strong>UNIVERSE</strong>. By accessing or using this website or application, students, teachers, and visitors agree to be bound by these Terms and Conditions.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Transparent Teacher Revenue Allocation</h4>
              <p>
                Platform subscriptions (Monthly ₹250, Yearly ₹3,000) are disbursed according to transparent platform ledger rules: <strong>80% is directly credited to the student's assigned teacher</strong>, while 20% covers UNIVERSE video streaming infrastructure, live servers, and governance.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Switching Teachers & Proration</h4>
              <p>
                When a student switches teachers mid-subscription, past services delivered by the previous teacher remain non-reversible and rightfully credited to that teacher. Unspent prorated days are mathematically transferred to the newly selected teacher in the platform wallet ledger.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">4. Examination & Certification Conduct</h4>
              <p>
                Examinations are conducted under the authority of the selected instructor. Duplicate submissions are strictly prohibited. Certificates issued by UNIVERSE require a minimum 75% distinction grade on scheduled assessments.
              </p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-slate-900 text-sm">1. Commitment to Data Security</h4>
              <p>
                UNIVERSE and SKILLJ treat data protection as a fundamental tenet. We do not sell, rent, or publicly expose personal data, contact phone numbers, or government identification documents.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Sensitive Identification Masking</h4>
              <p>
                Aadhaar and PAN details provided during teacher verification are strictly masked (showing only the last 4 digits) and never rendered in public directories or accessible to unauthorized users.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Payment & Banking Privacy</h4>
              <p>
                No raw credit/debit card numbers, CVVs, or UPI PINs are stored on SKILLJ servers. All checkout verification takes place via PCI-DSS compliant Indian payment gateways.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">4. Public Certificate Verification</h4>
              <p>
                Public verification via QR codes or certificate IDs exposes only academic achievement and instructor credentials; private student contact info is strictly excluded.
              </p>
            </>
          )}
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
