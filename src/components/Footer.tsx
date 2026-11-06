import React from 'react';
import { ShieldCheck, Heart, Smartphone, Globe, Mail, Phone, Lock } from 'lucide-react';

interface FooterProps {
  onOpenMobileExport: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onNavigate: (view: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMobileExport,
  onOpenTerms,
  onOpenPrivacy,
  onNavigate,
}) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-xs">
                <span className="font-black text-lg">SJ</span>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900">
                  SKILL<span className="text-red-600">J</span>
                </span>
                <span className="ml-1.5 rounded-sm bg-red-50 px-1 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                  UNIVERSE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official learning & teaching platform owned and operated by <strong className="text-slate-700">UNIVERSE</strong>. 
              Empowering learners with verified educators, scheduled monthly examinations, and verifiable career credentials.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>PCI-DSS & RBI Compliant Processing</span>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Academic Paths</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('student')} className="hover:text-red-600 transition text-left">
                  1. Skill Track (Web, AI, Cloud, Design)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('student')} className="hover:text-red-600 transition text-left">
                  2. Course Track (Python, ML, Data Science)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('student')} className="hover:text-red-600 transition text-left">
                  3. Education Track (10th & 12th Board Exams)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-red-600 transition text-left">
                  Official Certificate Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('student')} className="hover:text-red-600 transition text-left">
                  Monthly & Grand Yearly Exams
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Trust */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Portals & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('student')} className="hover:text-red-600 transition text-left">
                  Student Portal & Basic Test
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('teacher')} className="hover:text-red-600 transition text-left">
                  Teacher Interview & Selection System
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-red-600 transition text-left">
                  UNIVERSE Platform Governance
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-red-600 transition text-left">
                  Privacy Policy & Data Masking
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-red-600 transition text-left">
                  Terms & Conditions (Teacher Payout Rules)
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Apps & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Mobile & Apps</h4>
            <p className="text-xs text-slate-500 mb-3">
              SKILLJ works seamlessly on Android smartphones, iPhones, iPads, tablets, and desktop workstations.
            </p>
            <button
              onClick={onOpenMobileExport}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 text-xs shadow-xs transition"
            >
              <Smartphone className="w-4 h-4 text-red-400" />
              <span>Install App / APK & AAB Hub</span>
            </button>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Pan-India Coverage</span>
              </div>
              <span className="font-semibold text-red-600">₹250/mo • ₹3,000/yr</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong>UNIVERSE</strong>. SKILLJ is a trademark of UNIVERSE Educational Systems Pvt Ltd.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={onOpenTerms} className="hover:underline">Terms of Service</button>
            <span>•</span>
            <button onClick={onOpenPrivacy} className="hover:underline">Privacy & Security</button>
            <span>•</span>
            <span className="text-red-600 font-bold">TAGLINE: LEARN • TEACH • GROW</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
