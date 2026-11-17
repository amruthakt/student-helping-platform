import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  PlusCircle,
  Package,
  Inbox,
  UserCircle,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { SafeImage } from './SafeImage';

interface DashboardShellProps {
  breadcrumb: string;
  title: string;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  breadcrumb,
  title,
  children,
}) => {
  const { currentUser, requests, logout } = useCampus();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const pendingIncomingCount = currentUser
    ? requests.filter((r) => r.ownerId === currentUser.id && r.status === 'Pending').length
    : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/browse', label: 'Browse Resources', icon: Compass },
    { to: '/add-resource', label: 'Add Resource', icon: PlusCircle },
    { to: '/my-listings', label: 'My Listings', icon: Package },
    {
      to: '/my-requests',
      label: 'My Requests',
      icon: Inbox,
      count: pendingIncomingCount,
    },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const renderSidebarLinks = (onNavigate?: () => void) => (
    <div className="flex flex-col h-full">
      <div className="h-16 px-6 flex items-center border-b border-slate-200">
        <Link
          to="/"
          onClick={onNavigate}
          className="font-display text-lg font-bold tracking-tight text-[#172554] whitespace-nowrap"
        >
          CampusSwap
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#172554] text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#172554]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#2563EB]/10 text-[#2563EB]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 space-y-2">
        {currentUser && (
          <Link
            to="/profile"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <SafeImage
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#172554] truncate">
                {currentUser.fullName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser.department}
              </p>
            </div>
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen">
        {renderSidebarLinks()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#172554]/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-64 max-w-[80vw] bg-white h-full border-r border-slate-200">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="absolute top-4 right-3 p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            {renderSidebarLinks(() => setSidebarOpen(false))}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">
                CampusSwap <span aria-hidden="true">/</span> {breadcrumb}
              </p>
              <h1 className="font-display text-base sm:text-lg font-semibold text-[#172554] truncate">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/add-resource"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Resource</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
