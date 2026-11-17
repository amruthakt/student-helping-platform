import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          <div className="md:col-span-1">
            <Link
              to="/"
              className="font-display text-lg font-bold tracking-tight text-[#172554]"
            >
              CampusSwap
            </Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xs">
              Student-to-student academic resource sharing platform built to cut semester costs and keep useful study materials circulating on campus.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#172554] mb-3">Marketplace</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/browse" className="hover:text-[#2563EB] transition-colors">
                  Explore Resources
                </Link>
              </li>
              <li>
                <Link to="/browse?type=Borrow" className="hover:text-[#2563EB] transition-colors">
                  Borrow Equipment
                </Link>
              </li>
              <li>
                <Link to="/browse?type=Exchange" className="hover:text-[#2563EB] transition-colors">
                  Swap Textbooks
                </Link>
              </li>
              <li>
                <Link to="/browse?type=Donate" className="hover:text-[#2563EB] transition-colors">
                  Free Donations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#172554] mb-3">Student Workspace</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/dashboard" className="hover:text-[#2563EB] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/add-resource" className="hover:text-[#2563EB] transition-colors">
                  Post a Resource
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="hover:text-[#2563EB] transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link to="/my-requests" className="hover:text-[#2563EB] transition-colors">
                  My Requests
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#172554] mb-3">Campus Support</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>Main Library Atrium Exchange Desk</li>
              <li>Mon – Fri, 9:00 AM – 6:00 PM</li>
              <li>
                <a
                  href="mailto:support@campusswap.edu"
                  className="text-[#2563EB] hover:underline"
                >
                  support@campusswap.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusSwap. Built for verified college campuses.</p>
          <div className="flex items-center gap-6">
            <Link to="/browse" className="hover:text-[#172554] transition-colors">
              Campus Guidelines
            </Link>
            <Link to="/login" className="hover:text-[#172554] transition-colors">
              Student Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
