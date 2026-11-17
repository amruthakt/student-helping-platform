import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DashboardShell } from '../components/DashboardShell';
import { ResourceCard } from '../components/ResourceCard';
import { EmptyState } from '../components/EmptyState';
import { useCampus } from '../context/CampusContext';
import {
  DEPARTMENTS,
  RESOURCE_CATEGORIES,
  SEMESTERS,
} from '../data/seedData';
import { AvailabilityStatus, TransactionType } from '../types/campus';

const TRANSACTION_OPTIONS: ('All' | TransactionType)[] = [
  'All',
  'Sell',
  'Borrow',
  'Exchange',
  'Donate',
];

const AVAILABILITY_OPTIONS: ('All' | AvailabilityStatus)[] = [
  'All',
  'Available',
  'Reserved',
  'Borrowed',
];

export const BrowsePage: React.FC = () => {
  const { currentUser, resources } = useCampus();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [semester, setSemester] = useState('All');
  const [txType, setTxType] = useState<'All' | TransactionType>(
    (searchParams.get('type') as TransactionType) || 'All'
  );
  const [availability, setAvailability] = useState<'All' | AvailabilityStatus>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'price_asc' | 'price_desc'>('latest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const qParam = searchParams.get('q');
    const catParam = searchParams.get('category');
    const deptParam = searchParams.get('department');
    const typeParam = searchParams.get('type');
    if (qParam !== null) setQuery(qParam);
    if (catParam !== null) setCategory(catParam);
    if (deptParam !== null) setDepartment(deptParam);
    if (typeParam !== null && ['Sell', 'Borrow', 'Exchange', 'Donate'].includes(typeParam)) {
      setTxType(typeParam as TransactionType);
    }
  }, [searchParams]);

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matches = resources.filter((item) => {
      if (item.availability === 'Completed') return false;
      if (q) {
        const hay = `${item.title} ${item.description} ${item.category} ${item.department} ${item.ownerName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category !== 'All' && item.category !== category) return false;
      if (department !== 'All' && item.department !== department) return false;
      if (semester !== 'All' && item.semester !== semester) return false;
      if (txType !== 'All' && item.transactionType !== txType) return false;
      if (availability !== 'All' && item.availability !== availability) return false;
      return true;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'price_asc') {
        return (a.price ?? 0) - (b.price ?? 0);
      }
      if (sortBy === 'price_desc') {
        return (b.price ?? 0) - (a.price ?? 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [resources, query, category, department, semester, txType, availability, sortBy]);

  const hasActiveFilters =
    query !== '' ||
    category !== 'All' ||
    department !== 'All' ||
    semester !== 'All' ||
    txType !== 'All' ||
    availability !== 'All';

  const resetFilters = () => {
    setQuery('');
    setCategory('All');
    setDepartment('All');
    setSemester('All');
    setTxType('All');
    setAvailability('All');
    setSortBy('latest');
    setSearchParams({});
  };

  const content = (
    <div className="space-y-6">
      {/* Search + Transaction Type Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search textbooks, calculators, lab equipment, courses..."
              aria-label="Search marketplace resources"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'latest' | 'price_asc' | 'price_desc')
              }
              aria-label="Sort resources"
              className="px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
            >
              <option value="latest">Sort: Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-[#172554] bg-white hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Transaction Type Segmented Control */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {TRANSACTION_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTxType(option)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  txType === option
                    ? 'bg-white text-[#172554] shadow-sm'
                    : 'text-slate-600 hover:text-[#172554]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="tabular-nums">
              Showing <strong className="text-[#172554]">{filteredResources.length}</strong>{' '}
              {filteredResources.length === 1 ? 'resource' : 'resources'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-semibold text-[#2563EB] hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Filter Panel + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside
          className={`${
            mobileFiltersOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 space-y-5`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-[#172554]">Filters</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-[#2563EB] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div>
            <label
              htmlFor="filter-category"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
            >
              <option value="All">All Categories</option>
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-department"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Department
            </label>
            <select
              id="filter-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-semester"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Semester
            </label>
            <select
              id="filter-semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
            >
              <option value="All">All Semesters</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-availability"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Availability
            </label>
            <select
              id="filter-availability"
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value as 'All' | AvailabilityStatus)
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
            >
              {AVAILABILITY_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a === 'All' ? 'All Statuses' : a}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {filteredResources.length === 0 ? (
            <EmptyState
              title="No matching campus resources found"
              description="Try clearing a department or semester filter, or search for a broader textbook or equipment keyword."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredResources.map((item) => (
                <ResourceCard key={item.id} resource={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (currentUser) {
    return (
      <DashboardShell breadcrumb="Browse Resources" title="Campus Marketplace">
        {content}
      </DashboardShell>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#172554] tracking-tight">
            Explore Campus Resources
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse textbooks, calculators, lab kits, and study materials shared by students.
          </p>
        </div>
        {content}
      </main>
      <Footer />
    </div>
  );
};
