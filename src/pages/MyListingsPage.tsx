import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Inbox, Plus, PackageOpen } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { SafeImage } from '../components/SafeImage';
import { StatusLabel } from '../components/StatusLabel';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { formatTransactionSummary } from '../components/ResourceCard';
import { useCampus } from '../context/CampusContext';
import { DEMO_STUDENT_USER } from '../data/seedData';
import { AvailabilityStatus, ResourceItem } from '../types/campus';

const STATUS_TABS: ('All' | AvailabilityStatus)[] = [
  'All',
  'Available',
  'Reserved',
  'Borrowed',
  'Completed',
];

export const MyListingsPage: React.FC = () => {
  const { currentUser, resources, requests, deleteResource, setResourceStatus } = useCampus();
  const navigate = useNavigate();
  const activeUser = currentUser || DEMO_STUDENT_USER;

  const [statusFilter, setStatusFilter] = useState<'All' | AvailabilityStatus>('All');
  const [deleteTarget, setDeleteTarget] = useState<ResourceItem | null>(null);

  const myListings = useMemo(
    () => resources.filter((r) => r.ownerId === activeUser.id),
    [resources, activeUser.id]
  );

  const filteredListings = useMemo(() => {
    if (statusFilter === 'All') return myListings;
    return myListings.filter((item) => item.availability === statusFilter);
  }, [myListings, statusFilter]);

  const getRequestCount = (resourceId: string) =>
    requests.filter((req) => req.resourceId === resourceId && req.status !== 'Rejected').length;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteResource(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <DashboardShell breadcrumb="My Listings" title="My Resource Listings">
      <div className="space-y-6">
        {/* Top Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {STATUS_TABS.map((tab) => {
              const count =
                tab === 'All'
                  ? myListings.length
                  : myListings.filter((r) => r.availability === tab).length;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    statusFilter === tab
                      ? 'bg-white text-[#172554] shadow-sm'
                      : 'text-slate-600 hover:text-[#172554]'
                  }`}
                >
                  {tab}{' '}
                  <span className="font-mono tabular-nums text-slate-400 ml-1">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <Link
            to="/add-resource"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Listing</span>
          </Link>
        </div>

        {/* Listings Table / Card List */}
        {filteredListings.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title={
              statusFilter === 'All'
                ? 'You have not posted any resources yet'
                : `No ${statusFilter.toLowerCase()} listings`
            }
            description="Share textbooks, calculators, or lab gear with students on your campus."
            actionLabel={statusFilter === 'All' ? 'Add First Resource' : 'Show All Listings'}
            onAction={() =>
              statusFilter === 'All' ? navigate('/add-resource') : setStatusFilter('All')
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredListings.map((item) => {
              const reqCount = getRequestCount(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <Link
                      to={`/resources/${item.id}`}
                      className="w-24 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                    >
                      <SafeImage
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-medium text-slate-700">{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.transactionType}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums font-semibold text-[#172554]">
                          {formatTransactionSummary(item)}
                        </span>
                      </div>

                      <Link
                        to={`/resources/${item.id}`}
                        className="font-display text-base font-semibold text-[#172554] hover:text-[#2563EB] transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                        <StatusLabel status={item.availability} />
                        <Link
                          to="/my-requests"
                          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#2563EB] transition-colors tabular-nums"
                        >
                          <Inbox className="w-3.5 h-3.5" />
                          <span>
                            <strong>{reqCount}</strong>{' '}
                            {reqCount === 1 ? 'request' : 'requests'}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <select
                      aria-label={`Change availability for ${item.title}`}
                      value={item.availability}
                      onChange={(e) =>
                        setResourceStatus(item.id, e.target.value as AvailabilityStatus)
                      }
                      className="px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-[#1E293B] bg-white focus:border-[#2563EB] focus:outline-none"
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Borrowed">Borrowed</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <Link
                      to={`/edit-resource/${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-[#172554] hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete listing?"
        subtitle="This will permanently remove the listing and its pending requests."
      >
        {deleteTarget && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{' '}
              <strong className="text-[#172554]">{deleteTarget.title}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete Listing
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
};
