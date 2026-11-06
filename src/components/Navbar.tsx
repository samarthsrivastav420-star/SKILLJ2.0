import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Smartphone,
  Menu,
  X,
  UserCheck,
  Sparkles,
  Award,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: 'home' | 'student' | 'teacher' | 'admin' | 'verify';
  onNavigate: (view: 'home' | 'student' | 'teacher' | 'admin' | 'verify') => void;
  activeRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
  onOpenMobileExport: () => void;
  studentName?: string;
  teacherName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeRole,
  onRoleSwitch,
  onOpenMobileExport,
  studentName = 'Rahul Sharma',
  teacherName = 'Dr. Rajesh Verma',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-red-100 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      {/* Top micro banner for UNIVERSE ownership & Tagline */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-4 py-1 text-center text-xs font-semibold tracking-wider text-white flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-red-100">Official Portal:</span>
          <span>UNIVERSE Educational Network</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-1.5 font-bold tracking-widest text-xs">
          <span>LEARN</span>
          <span className="text-red-200">•</span>
          <span>TEACH</span>
          <span className="text-red-200">•</span>
          <span>GROW</span>
        </div>
        <button
          onClick={onOpenMobileExport}
          className="hidden md:flex items-center gap-1 text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full transition cursor-pointer"
        >
          <Smartphone className="w-3 h-3" />
          <span>Android APK & iOS App</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl tracking-tighter">SJ</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  SKILL<span className="text-red-600">J</span>
                </span>
                <span className="rounded-md bg-red-100 px-1.5 py-0.2 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                  Universe
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider">
                BY UNIVERSE • GOVT REG.
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'home'
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onRoleSwitch('student');
                onNavigate('student');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'student'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => {
                onRoleSwitch('teacher');
                onNavigate('teacher');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'teacher'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Teacher Portal</span>
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'verify'
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Verify Certificate</span>
            </button>
            <button
              onClick={() => {
                onRoleSwitch('admin');
                onNavigate('admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>UNIVERSE Admin</span>
            </button>
          </nav>

          {/* Quick Identity Switcher Pill */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="px-2 font-medium text-slate-500 text-[11px]">Role:</span>
              <button
                onClick={() => {
                  onRoleSwitch('student');
                  onNavigate('student');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeRole === 'student' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Logged in as ${studentName}`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  onRoleSwitch('teacher');
                  onNavigate('teacher');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeRole === 'teacher' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Logged in as ${teacherName}`}
              >
                Teacher
              </button>
              <button
                onClick={() => {
                  onRoleSwitch('admin');
                  onNavigate('admin');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeRole === 'admin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="UNIVERSE Administrative Headquarters"
              >
                Admin
              </button>
            </div>

            <button
              onClick={onOpenMobileExport}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-bold transition shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-red-600" />
              <span>Get App</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenMobileExport}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Get Android / iOS App"
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Navigation</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 text-left rounded-xl text-sm font-semibold transition ${
                currentView === 'home' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700'
              }`}
            >
              Home Page
            </button>
            <button
              onClick={() => {
                onNavigate('verify');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 text-left rounded-xl text-sm font-semibold transition ${
                currentView === 'verify' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700'
              }`}
            >
              Verify Certificate
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 pt-2">Switch Active Portal</div>
          <div className="space-y-2">
            <button
              onClick={() => {
                onRoleSwitch('student');
                onNavigate('student');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                activeRole === 'student' && currentView === 'student'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="text-sm font-bold">Student Dashboard</div>
                  <div className="text-xs text-slate-500">{studentName}</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-red-600">Enter →</span>
            </button>

            <button
              onClick={() => {
                onRoleSwitch('teacher');
                onNavigate('teacher');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                activeRole === 'teacher' && currentView === 'teacher'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="text-sm font-bold">Teacher Dashboard</div>
                  <div className="text-xs text-slate-500">{teacherName}</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-red-600">Enter →</span>
            </button>

            <button
              onClick={() => {
                onRoleSwitch('admin');
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                activeRole === 'admin' && currentView === 'admin'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div className="text-left">
                  <div className="text-sm font-bold">UNIVERSE Administrator</div>
                  <div className="text-xs text-slate-500">HQ Platform Control</div>
                </div>
              </div>
              <span className="text-xs font-semibold">Enter →</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenMobileExport();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-bold py-2.5 text-sm shadow-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Mobile App (APK / iOS)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
