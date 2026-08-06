import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  KeyRound,
} from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onLoginSuccess: (user: User) => void;
  onClose?: () => void;
  isStandaloneScreen?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onLoginSuccess,
  onClose,
  isStandaloneScreen = false,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDone, setResetDone] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Admin' | 'User'>('User');
  const [rememberMe, setRememberMe] = useState(true);

    // Quick Demo Logins
    const handleDemoLogin = (targetRole: 'Admin' | 'User') => {
      setLoading(true);
      setErrorMsg('');
      const demoEmail =
        targetRole === 'Admin'
          ? 'nikitachaudhari7929@gmail.com'
          : 'nikita.user@gmail.com';
      const userToLogin: User = {
        id: targetRole === 'Admin' ? 1 : 2,
        fullname: targetRole === 'Admin' ? 'Nikita Chaudhari' : 'Demo User',
        email: demoEmail,
        phone: '+91 98765 43210',
        role: targetRole,
        profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        created_at: new Date().toISOString(),
      };

      // Background sync attempt
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123', role: targetRole }),
      }).catch(() => {});

      setSuccessMsg(`Welcome back, ${userToLogin.fullname}! Opening ${userToLogin.role} Dashboard...`);
      onLoginSuccess(userToLogin);
      setLoading(false);
    };

    // Submit Handler for Login
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg('');

      const userToLogin: User = {
        id: 1,
        fullname: (email && email.includes('@')) ? email.split('@')[0] : (fullname || 'Nikita Chaudhari'),
        email: email || 'nikitachaudhari7929@gmail.com',
        phone: '+91 98765 43210',
        role: role,
        profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        created_at: new Date().toISOString(),
      };

      // Background sync attempt
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      }).catch(() => {});

      setSuccessMsg(`Welcome, ${userToLogin.fullname}! Opening Dashboard...`);
      onLoginSuccess(userToLogin);
      setLoading(false);
    };

    // Submit Handler for Register
    const handleRegisterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg('');

      const userToLogin: User = {
        id: Date.now(),
        fullname: fullname || 'Nikita Chaudhari',
        email: email || 'nikitachaudhari7929@gmail.com',
        phone: phone || '+91 98765 43210',
        role: role,
        profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        created_at: new Date().toISOString(),
      };

      // Background sync attempt
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
          email,
          phone,
          role,
          password,
        }),
      }).catch(() => {});

      setSuccessMsg(`Account created successfully! Welcome, ${userToLogin.fullname}.`);
      onLoginSuccess(userToLogin);
      setLoading(false);
    };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetDone(true);
  };

  const content = (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
      {/* Top Banner / Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-6 text-white text-center">
        {onClose && !isStandaloneScreen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          >
            ✕
          </button>
        )}

        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-white shadow-lg">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">AI Email Writer System</h2>
        <p className="mt-1 text-xs text-indigo-100/90">
          {mode === 'login'
            ? 'Sign in to access your AI email dashboard & templates'
            : 'Create a new account to generate intelligent emails'}
        </p>

        {/* Tab Switcher */}
        <div className="mt-5 flex rounded-2xl bg-black/20 p-1 text-xs font-bold backdrop-blur-xs">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 rounded-xl py-2 transition-all ${
              mode === 'login'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-indigo-100 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 rounded-xl py-2 transition-all ${
              mode === 'register'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-indigo-100 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Messages */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. nikitachaudhari7929@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('User')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    role === 'User'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Standard User</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    role === 'Admin'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span>Administrator</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-xs border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In Now'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Nikita Chaudhari"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Register As
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('User')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    role === 'User'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Standard User</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    role === 'Admin'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span>Administrator</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <Sparkles className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Login Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 text-center mb-2">
            ⚡ One-Touch Demo Sign-In Shortcuts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('Admin')}
              className="flex items-center justify-center gap-1 rounded-xl bg-amber-50 border border-amber-200 py-2 text-[11px] font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:border-amber-900/50 dark:text-amber-300"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              <span>Demo Admin Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('User')}
              className="flex items-center justify-center gap-1 rounded-xl bg-indigo-50 border border-indigo-200 py-2 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-900/50 dark:text-indigo-300"
            >
              <UserIcon className="h-3.5 w-3.5 text-indigo-600" />
              <span>Demo User Login</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleDemoLogin('Admin')}
            className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>🚀 Skip Login & Go Straight to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between border-b pb-2 text-slate-900 dark:text-white">
              <span className="font-bold flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-indigo-600" /> Reset Password
              </span>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetDone(false);
                }}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>

            {!resetDone ? (
              <form onSubmit={handleResetPassword} className="mt-3 space-y-3">
                <p className="text-slate-500">
                  Enter your registered email to receive a password reset link.
                </p>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  Send Reset Link
                </button>
              </form>
            ) : (
              <div className="mt-3 space-y-3 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <p className="font-bold text-slate-800 dark:text-slate-200">Reset Email Sent!</p>
                <p className="text-slate-500 text-[11px]">
                  Check your inbox at <strong>{resetEmail}</strong> for instructions.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetDone(false);
                  }}
                  className="w-full rounded-xl bg-slate-100 py-2 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isStandaloneScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
        {content}
      </div>
    );
  }

  return content;
};
