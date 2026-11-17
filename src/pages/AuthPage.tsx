import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { ASSET_IMAGES, DEPARTMENTS, SEMESTERS } from '../data/seedData';
import { SafeImage } from '../components/SafeImage';
import { Modal } from '../components/Modal';

export const AuthPage: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { login, register, demoLogin, addToast } = useCampus();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard';

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register extra fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [semester, setSemester] = useState(SEMESTERS[2]);

  const [error, setError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const isValidCollegeEmail = (value: string) => {
    const trimmed = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidCollegeEmail(email)) {
      setError('Please enter a valid college email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'register') {
      if (fullName.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      register({ fullName, email, department, semester });
      navigate(redirectTo);
    } else {
      login(email);
      navigate(redirectTo);
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    navigate(redirectTo);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCollegeEmail(resetEmail)) return;
    setResetSent(true);
    addToast({
      type: 'info',
      title: 'Reset link sent',
      description: `Check ${resetEmail} for password recovery instructions.`,
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      {/* Left Split Visual Panel */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#172554] text-white flex-col justify-between p-10 overflow-hidden">
        <SafeImage
          src={ASSET_IMAGES.heroDesk}
          alt="Academic desk with textbooks and study supplies"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172554] via-[#172554]/85 to-[#172554]/70" />

        <div className="relative z-10">
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-tight text-white"
          >
            CampusSwap
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-3xl font-bold leading-tight text-balance mb-4">
            Share textbooks, lab gear, and calculators across your campus.
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed mb-8">
            Connect directly with verified students in your department to buy at fair student rates, borrow for a term, or donate materials you no longer need.
          </p>

          <div className="space-y-3 pt-6 border-t border-white/15 text-sm text-slate-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>College email verified student directory</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Zero platform fees on campus pickups</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Track outgoing & incoming requests in one dashboard</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-300">
          Main Library Atrium Exchange Desk · Student Resource Network
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#172554] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/"
              className="lg:hidden font-display text-lg font-bold text-[#172554]"
            >
              CampusSwap
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-[#172554]">
              {mode === 'login' ? 'Sign in to CampusSwap' : 'Create your student account'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {mode === 'login'
                ? 'Use your college email to manage listings and requests.'
                : 'Join with your college email to start buying, borrowing, or sharing.'}
            </p>

            {error && (
              <div
                role="alert"
                className="mt-5 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Maya Patel"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  College Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya.patel@northbridge.edu"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="semester"
                      className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                    >
                      Semester
                    </label>
                    <select
                      id="semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
                    >
                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetSent(false);
                      setResetEmail(email);
                      setForgotOpen(true);
                    }}
                    className="font-medium text-[#2563EB] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors"
              >
                {mode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-[#2563EB] bg-[#2563EB]/8 hover:bg-[#2563EB]/15 transition-colors"
              >
                Quick Demo Sign-In (Maya Patel)
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-slate-600">
              {mode === 'login' ? (
                <>
                  New to CampusSwap?{' '}
                  <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already have a student account?{' '}
                  <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset your password"
        subtitle="Enter your college email address and we will send a password reset link."
      >
        {resetSent ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Recovery instructions have been queued for{' '}
              <span className="font-semibold text-[#172554]">{resetEmail}</span>.
            </p>
            <button
              type="button"
              onClick={() => setForgotOpen(false)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#172554]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="resetEmail"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                College Email
              </label>
              <input
                id="resetEmail"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8]"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
