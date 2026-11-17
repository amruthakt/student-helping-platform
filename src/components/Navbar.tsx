import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCampus } from '../context/CampusContext';

export const Navbar: React.FC = () => {
  const { currentUser } = useCampus();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#how-it-works');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-[#172554] whitespace-nowrap shrink-0"
        >
          CampusSwap
        </Link>

        {/* Zone 2: 4 Single-line Text Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link
            to="/"
            className={`hover:text-[#172554] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              location.pathname === '/' ? 'text-[#172554] font-semibold' : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/browse"
            className={`hover:text-[#172554] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              location.pathname === '/browse' ? 'text-[#172554] font-semibold' : ''
            }`}
          >
            Explore Resources
          </Link>
          <a
            href="#how-it-works"
            onClick={handleHowItWorks}
            className="hover:text-[#172554] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </a>
          {currentUser ? (
            <Link
              to="/dashboard"
              className="hover:text-[#172554] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className={`hover:text-[#172554] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                location.pathname === '/login' ? 'text-[#172554] font-semibold' : ''
              }`}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="hidden md:flex items-center shrink-0">
          {currentUser ? (
            <Link
              to="/add-resource"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors whitespace-nowrap shrink-0"
            >
              Add Resource
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap shrink-0"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/browse"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Resources
          </Link>
          <a
            href="#how-it-works"
            onClick={handleHowItWorks}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </a>
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link
                to="/add-resource"
                onClick={() => setMobileOpen(false)}
                className="block mt-2 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#172554]"
              >
                Add Resource
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block mt-2 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#2563EB]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
