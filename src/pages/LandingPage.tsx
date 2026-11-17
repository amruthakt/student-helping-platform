import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Calculator,
  FlaskConical,
  NotebookPen,
  Ruler,
  Layers,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Wallet,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ResourceCard } from '../components/ResourceCard';
import { SafeImage } from '../components/SafeImage';
import { useCampus } from '../context/CampusContext';
import { ASSET_IMAGES } from '../data/seedData';
import { ResourceCategory } from '../types/campus';

const CATEGORY_CARDS: {
  name: ResourceCategory;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { name: 'Textbooks', subtitle: 'Course editions & manuals', icon: BookOpen },
  { name: 'Calculators', subtitle: 'Graphing & scientific models', icon: Calculator },
  { name: 'Lab Equipment', subtitle: 'Coats, goggles & glassware', icon: FlaskConical },
  { name: 'Record Books', subtitle: 'Grid logs & lab journals', icon: NotebookPen },
  { name: 'Reference Books', subtitle: 'Exam prep & handbooks', icon: Layers },
  { name: 'Stationery', subtitle: 'Drafting rulers & kits', icon: Ruler },
];

export const LandingPage: React.FC = () => {
  const { resources, currentUser } = useCampus();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const featuredResources = resources
    .filter((r) => r.availability === 'Available')
    .slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : '/browse');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-[#2563EB] mb-3">
                  Campus Student Marketplace
                </p>
                <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#172554] leading-[1.1] text-balance mb-5">
                  Give Your Resources a Second Life.
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                  Buy, borrow, exchange and share academic resources with students on your campus.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 mb-8">
                  <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Explore Resources</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={currentUser ? '/add-resource' : '/register'}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-[#172554] bg-white border border-slate-300 hover:border-[#172554] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Start Sharing</span>
                  </Link>
                </div>

                {/* Search Bar */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 p-1.5 bg-[#F8FAFC] border border-slate-200 rounded-xl max-w-xl focus-within:border-[#2563EB] focus-within:bg-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 pl-3 flex-1 min-w-0">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search textbooks, calculators, lab coats, or courses..."
                      aria-label="Search academic resources"
                      className="w-full bg-transparent text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors whitespace-nowrap shrink-0"
                  >
                    Search
                  </button>
                </form>
              </div>

              <div className="lg:col-span-6">
                <div className="h-full min-h-[280px] sm:min-h-[360px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <SafeImage
                    src={ASSET_IMAGES.heroDesk}
                    alt="University textbooks, graphing calculator, notebooks, and stationery on a sunlit library desk"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#172554] tracking-tight">
                Popular Categories
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Find course materials shared by upperclassmen in your department.
              </p>
            </div>
            <Link
              to="/browse"
              className="text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
            >
              View all categories
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORY_CARDS.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/browse?category=${encodeURIComponent(cat.name)}`}
                  className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-[#2563EB] transition-colors flex flex-col"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#172554]/5 text-[#172554] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-[#172554]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {cat.subtitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Resources */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#172554] tracking-tight">
                Featured Campus Listings
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Recently posted textbooks, lab gear, and calculators ready for pickup.
              </p>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
            >
              <span>Browse marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((item) => (
              <ResourceCard key={item.id} resource={item} />
            ))}
          </div>
        </section>

        {/* How CampusSwap Works */}
        <section id="how-it-works" className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#172554] tracking-tight">
                How CampusSwap Works
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Built around campus life—no shipping boxes, no payment surprises, just direct student handoffs between classes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
              <div>
                <p className="font-mono text-sm font-semibold text-[#2563EB] mb-2">
                  01. List or Discover
                </p>
                <h3 className="font-display text-lg font-semibold text-[#172554] mb-2">
                  Filter by department and term
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Post textbooks, calculators, or lab coats in under a minute—or search listings matched to your exact semester courses.
                </p>
              </div>

              <div>
                <p className="font-mono text-sm font-semibold text-[#2563EB] mb-2">
                  02. Send a Request
                </p>
                <h3 className="font-display text-lg font-semibold text-[#172554] mb-2">
                  Buy, borrow, swap, or claim
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Propose a campus meetup spot like the Main Library Atrium. Owners review incoming requests and accept with one click.
                </p>
              </div>

              <div>
                <p className="font-mono text-sm font-semibold text-[#16A34A] mb-2">
                  03. Meet & Complete
                </p>
                <h3 className="font-display text-lg font-semibold text-[#172554] mb-2">
                  Hand off on campus and track
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Meet between lectures to complete the handoff, then mark the exchange completed so your campus record stays up to date.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Student Community */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#172554] tracking-tight text-balance">
                Designed for campus budgets and circular reuse
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Most engineering and science materials sit unused after one semester. CampusSwap keeps high-cost equipment circulating inside your university community.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-[#2563EB] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#172554]">
                      Save up to $420 per semester
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Borrow graphing calculators for exam blocks or pick up peer-owned editions at student prices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#172554] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#172554]">
                      Verified college email network
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Every listing and request is tied to a student department, semester, and campus email.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-[#16A34A] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#172554]">
                      Zero-waste academic lifecycle
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Pass along unused record books, lab coats, and drafting sets instead of throwing them out at move-out.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="font-mono text-2xl font-bold text-[#172554] tabular-nums">
                  4 modes
                </p>
                <p className="text-xs font-medium text-slate-500 mt-1 mb-4">
                  Sell · Borrow · Exchange · Donate
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  "Borrowed a NumWorks graphing calculator for my Numerical Methods block without spending $110 for a single course. Met Elena outside the library between classes."
                </p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <SafeImage
                    src={ASSET_IMAGES.avatar}
                    alt="Maya Patel"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#172554]">Maya Patel</p>
                    <p className="text-[11px] text-slate-500">Computer Science · Semester 5</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <p className="font-mono text-2xl font-bold text-[#16A34A] tabular-nums">
                    $0 fees
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1 mb-4">
                    Direct campus handoffs with zero platform cut
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "Passed down my thermodynamics volumes and drafting record books before graduation. Two freshmen claimed them within the same afternoon."
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-[#172554]">Liam Chen</p>
                  <p className="text-[11px] text-slate-500">Mechanical Engineering · Semester 8</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[#172554] rounded-2xl px-6 py-10 sm:px-10 sm:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Ready for next semester?
              </h2>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                Join students across Engineering, Sciences, and Humanities sharing textbooks and lab equipment on CampusSwap.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/browse"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#172554] bg-white hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Explore Resources
              </Link>
              <Link
                to={currentUser ? '/dashboard' : '/register'}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap"
              >
                {currentUser ? 'Open Dashboard' : 'Create Student Account'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
