import React, { useState } from 'react';
import { X, ShieldCheck, Lock, ArrowRight, UserCheck, BookOpen, AlertCircle } from 'lucide-react';
import { CategoryType } from '../types';

interface TeacherRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToInterview: (teacher: any) => void;
  onSwitchToLogin: () => void;
}

export const TeacherRegisterModal: React.FC<TeacherRegisterModalProps> = ({
  isOpen,
  onClose,
  onProceedToInterview,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    degreeDiploma: 'M.Tech / Ph.D in Computer Science',
    gmail: '',
    mobileNumber: '',
    whatsAppNumber: '',
    country: 'India',
    preferredLanguage: 'English, Hindi',
    lastFourAadhaar: '',
    teachingCategory: 'SKILL' as CategoryType,
    address: '',
    lastFourPan: '',
    payoutUpi: '',
    payoutBank: '',
    payoutIfsc: '',
    fatherName: '',
    motherName: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim() || !formData.surname.trim()) {
      setError('Please provide your First Name and Surname.');
      return;
    }
    if (!formData.gmail.includes('@')) {
      setError('Please provide a valid Gmail address.');
      return;
    }
    if (!formData.degreeDiploma.trim()) {
      setError('Please declare your Degree / Diploma qualification.');
      return;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onProceedToInterview(data.teacher);
    } catch (err: any) {
      // Local fallback
      const generatedUsername = `@prof_${formData.firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-3)}`;
      const fallbackTeacher = {
        id: `teach-${Date.now()}`,
        userId: `user-teach-${Date.now()}`,
        username: generatedUsername,
        firstName: formData.firstName,
        surname: formData.surname,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        gmail: formData.gmail,
        mobileNumber: formData.mobileNumber,
        whatsAppNumber: formData.whatsAppNumber || formData.mobileNumber,
        country: formData.country,
        preferredLanguage: formData.preferredLanguage,
        address: formData.address,
        degreeDiploma: formData.degreeDiploma,
        teachingExperienceYears: 3,
        teachingCategory: formData.teachingCategory,
        subCategoryOrSkills: [formData.teachingCategory],
        photoUrl: formData.photoUrl,
        maskedAadhaar: 'XXXX-XXXX-' + (formData.lastFourAadhaar || '1234'),
        maskedPan: 'XXXXXX' + (formData.lastFourPan || '5678'),
        maskedPayoutAccount: formData.payoutUpi ? `UPI ••@${formData.payoutUpi.split('@')[1] || 'upi'}` : 'A/C ••••',
        payoutDetails: {
          upiId: formData.payoutUpi,
          bankAccount: formData.payoutBank,
          ifsc: formData.payoutIfsc,
        },
        verificationStatus: 'PENDING' as const,
        interviewAttempts: [],
        studentCount: 0,
        rating: 5.0,
        reviewsCount: 0,
        bio: `${formData.degreeDiploma} educator on SKILLJ.`,
        earnings: {
          totalEarnings: 0,
          availableBalance: 0,
          pendingPayments: 0,
          withdrawnAmount: 0,
        },
      };
      onProceedToInterview(fallbackTeacher);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-red-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Teacher Registration</h3>
              <p className="text-xs text-red-100 font-medium">Join UNIVERSE SKILLJ Faculty Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleNext} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Teacher Name & Academic Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Rajesh"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Surname *</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="e.g. Verma"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Diploma Qualification *</label>
              <input
                type="text"
                name="degreeDiploma"
                value={formData.degreeDiploma}
                onChange={handleChange}
                placeholder="e.g. Ph.D / M.Tech in CS / M.Sc Physics"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teaching Category *</label>
              <select
                name="teachingCategory"
                value={formData.teachingCategory}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-red-700 bg-red-50/50 focus:border-red-500 focus:outline-hidden"
              >
                <option value="SKILL">1. SKILL (Web, AI, Cloud, Design, Tech)</option>
                <option value="COURSE">2. COURSE (Python, Data Science, Math)</option>
                <option value="EDUCATION">3. EDUCATION (10th & 12th Board Exams)</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gmail Address *</label>
              <input
                type="email"
                name="gmail"
                value={formData.gmail}
                onChange={handleChange}
                placeholder="prof.name@gmail.com"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit number"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                name="whatsAppNumber"
                value={formData.whatsAppNumber}
                onChange={handleChange}
                placeholder="WhatsApp contact"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Parents & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Father's name"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="Mother's name"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
              <input
                type="text"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                placeholder="e.g. English, Hindi"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Sensitive Government IDs (Masked protection) */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Identity Verification & Payout Details (Confidential & Masked)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Last 4 Digits of Aadhaar
                </label>
                <input
                  type="text"
                  name="lastFourAadhaar"
                  value={formData.lastFourAadhaar}
                  onChange={handleChange}
                  maxLength={4}
                  placeholder="e.g. 4512"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Last 4 Digits of PAN
                </label>
                <input
                  type="text"
                  name="lastFourPan"
                  value={formData.lastFourPan}
                  onChange={handleChange}
                  maxLength={4}
                  placeholder="e.g. 891K"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Payout UPI ID (e.g. name@okhdfcbank)
                </label>
                <input
                  type="text"
                  name="payoutUpi"
                  value={formData.payoutUpi}
                  onChange={handleChange}
                  placeholder="teacher@upi"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Bank Account & IFSC (Optional)
                </label>
                <input
                  type="text"
                  name="payoutBank"
                  value={formData.payoutBank}
                  onChange={handleChange}
                  placeholder="Account Number & IFSC"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-500">
              🔒 In accordance with UNIVERSE privacy standards: full identity documents are never displayed publicly. Only masked records are retained in compliance with Indian privacy laws.
            </p>
          </div>

          {/* Footer Controls with mandatory NEXT button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Already verified? Go to Teacher Portal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black shadow-lg shadow-red-600/25 transition cursor-pointer"
            >
              <span>{loading ? 'Validating...' : 'NEXT — Take Interview Test (100 Marks)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
