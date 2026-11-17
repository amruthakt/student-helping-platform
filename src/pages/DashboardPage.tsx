import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Package, Inbox, CheckCircle2 } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { ResourceCard } from '../components/ResourceCard';
import { useCampus } from '../context/CampusContext';
import { DEMO_STUDENT_USER } from '../data/seedData';

export const DashboardPage: React.FC = () => {
  const { currentUser, resources, requests } = useCampus();
  const activeUser = currentUser || DEMO_STUDENT_USER;
  const firstName = activeUser.fullName.split(' ')[0];

  const myListings = resources.filter((r) => r.ownerId === activeUser.id);
  const activeRequestsCount = requests.filter(
    (req) =>
      (req.ownerId === activeUser.id || req.requesterId === activeUser.id) &&
      (req.status === 'Pending' || req.status === 'Accepted')
  ).length;
  const completedCount = activeUser.completedExchanges;

  const recentlyAdded = resources
    .filter((r) => r.availability === 'Available')
    .slice(0, 3);

  const recommendedMaterials = resources
    .filter(
      (r) =>
        r.availability === 'Available' &&
        r.ownerId !== activeUser.id &&
        (r.department === activeUser.department ||
          r.category === 'Calculators' ||
          r.category === 'Reference Books')
    )
    .slice(0, 3);

  return (
    <DashboardShell breadcrumb="Dashboard" title="Student Overview">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-medium text-[#2563EB] mb-1">
              {activeUser.department} · {activeUser.semester}
            </p>
            <h2 className="font-display text-2xl font-bold text-[#172554]">
              Welcome back, {firstName}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Track your campus listings, review incoming requests, or discover materials for this semester.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/browse"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#172554] border border-slate-200 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Browse Marketplace
            </Link>
            <Link
              to="/add-resource"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </Link>
          </div>
        </section>

        {/* Metrics Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            to="/my-listings"
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#2563EB] transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold">Total Listings</span>
              <Package className="w-4 h-4 text-[#172554]" />
            </div>
            <p className="font-display text-3xl font-bold text-[#172554] tabular-nums">
              {myListings.length}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Manage your active campus posts
            </p>
          </Link>

          <Link
            to="/my-requests"
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#2563EB] transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold">Active Requests</span>
              <Inbox className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="font-display text-3xl font-bold text-[#172554] tabular-nums">
              {activeRequestsCount}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Pending & accepted coordination items
            </p>
          </Link>

          <Link
            to="/profile"
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#16A34A] transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold">Completed Exchanges</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            </div>
            <p className="font-display text-3xl font-bold text-[#172554] tabular-nums">
              {Math.max(0, completedCount)}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Verified handoffs completed
            </p>
          </Link>
        </section>

        {/* Recently Added Resources */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h3 className="font-display text-lg font-bold text-[#172554]">
                Recently Added Resources
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Freshly posted items across all campus departments.
              </p>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentlyAdded.map((item) => (
              <ResourceCard key={item.id} resource={item} />
            ))}
          </div>
        </section>

        {/* Recommended Academic Materials */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h3 className="font-display text-lg font-bold text-[#172554]">
                Recommended Academic Materials
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Matched to {activeUser.department} and core STEM coursework.
              </p>
            </div>
            <Link
              to={`/browse?department=${encodeURIComponent(activeUser.department)}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
            >
              <span>Filter my department</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedMaterials.map((item) => (
              <ResourceCard key={item.id} resource={item} />
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};
