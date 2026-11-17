import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, CheckCircle2, Edit3 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DashboardShell } from '../components/DashboardShell';
import { SafeImage } from '../components/SafeImage';
import { StatusLabel } from '../components/StatusLabel';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { useCampus } from '../context/CampusContext';
import { TransactionType } from '../types/campus';

function getActionLabel(type: TransactionType): string {
  switch (type) {
    case 'Borrow':
      return 'Request to Borrow';
    case 'Sell':
      return 'Request to Buy';
    case 'Exchange':
      return 'Request Exchange';
    case 'Donate':
      return 'Request Donation';
  }
}

const MEETUP_SPOTS = [
  'Main Library Atrium',
  'Student Union Coffee Bar',
  'Engineering Hall Lobby',
  'Science Quad Commons',
];

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, resources, requests, sendRequest, demoLogin } = useCampus();

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [meetupSpot, setMeetupSpot] = useState(MEETUP_SPOTS[0]);
  const [message, setMessage] = useState('');

  const resource = resources.find((r) => r.id === id);

  if (!resource) {
    const notFound = (
      <EmptyState
        title="Resource not found"
        description="This listing may have been removed or completed by its owner."
        actionLabel="Back to Browse Resources"
        onAction={() => navigate('/browse')}
      />
    );
    return currentUser ? (
      <DashboardShell breadcrumb="Resource Details" title="Not Found">
        {notFound}
      </DashboardShell>
    ) : (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">{notFound}</main>
        <Footer />
      </div>
    );
  }

  const isOwner = currentUser?.id === resource.ownerId;
  const existingRequest = currentUser
    ? requests.find(
        (req) =>
          req.resourceId === resource.id &&
          req.requesterId === currentUser.id &&
          req.status !== 'Rejected'
      )
    : undefined;

  const actionButtonLabel = getActionLabel(resource.transactionType);

  const handleOpenRequest = () => {
    setMessage(
      `Hi ${resource.ownerName.split(' ')[0]}, I would like to ${
        resource.transactionType === 'Sell'
          ? 'buy'
          : resource.transactionType === 'Borrow'
          ? 'borrow'
          : resource.transactionType === 'Exchange'
          ? 'exchange for'
          : 'claim'
      } "${resource.title}". I can meet between classes on campus.`
    );
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      demoLogin();
    }
    sendRequest(resource, message, meetupSpot);
    setRequestModalOpen(false);
  };

  const detailContent = (
    <div className="space-y-6">
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#172554] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Resources</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Image */}
          <div className="lg:col-span-6 bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200">
            <div className="aspect-[4/3] w-full h-full">
              <SafeImage
                src={resource.imageUrl}
                alt={resource.title}
                fallbackLabel={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Info & Action Module */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#2563EB]">{resource.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Condition: {resource.condition}</span>
                </div>
                <StatusLabel status={resource.availability} />
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#172554] leading-tight text-balance">
                {resource.title}
              </h1>

              {/* Key Pricing / Terms Box */}
              <div className="mt-5 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Transaction Type</p>
                  <p className="text-sm font-semibold text-[#172554] mt-0.5">
                    {resource.transactionType}
                  </p>
                </div>

                {resource.transactionType === 'Sell' && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">Student Price</p>
                    <p className="font-display text-2xl font-bold text-[#172554] tabular-nums">
                      ${resource.price ?? 0}
                    </p>
                  </div>
                )}

                {resource.transactionType === 'Borrow' && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">Borrowing Duration</p>
                    <p className="text-sm font-semibold text-[#2563EB]">
                      {resource.borrowingDuration || 'Flexible term'}
                    </p>
                  </div>
                )}

                {resource.transactionType === 'Donate' && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">Cost</p>
                    <p className="font-display text-xl font-bold text-[#16A34A]">Free</p>
                  </div>
                )}

                {resource.transactionType === 'Exchange' && (
                  <div className="text-right max-w-xs">
                    <p className="text-xs font-medium text-slate-500">Preferred Exchange</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#172554] mt-0.5">
                      {resource.preferredExchangeItem || 'Open to academic swap'}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xs font-semibold text-slate-500 mb-2">Description</h2>
                <p className="text-sm text-slate-700 leading-relaxed">{resource.description}</p>
              </div>

              {/* Academic Metadata */}
              <div className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-slate-100 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="font-medium text-[#172554] mt-0.5">{resource.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Recommended Semester</p>
                  <p className="font-medium text-[#172554] mt-0.5">{resource.semester}</p>
                </div>
              </div>
            </div>

            {/* Owner + Action CTA */}
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <SafeImage
                    src={resource.ownerAvatarUrl}
                    alt={resource.ownerName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#172554] truncate">
                      {resource.ownerName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {resource.ownerDepartment} · {resource.ownerSemester}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-[#16A34A] inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Student</span>
                  </p>
                  <p className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                    {resource.ownerCompletedExchanges} completed swaps
                  </p>
                </div>
              </div>

              {isOwner ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/edit-resource/${resource.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit This Listing</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    className="py-3 px-5 rounded-lg text-sm font-semibold text-[#172554] border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    My Listings
                  </Link>
                </div>
              ) : existingRequest ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#16A34A]/8 border border-[#16A34A]/20">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-[#172554]">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                    <span>
                      Request status: <strong>{existingRequest.status}</strong>
                    </span>
                  </div>
                  <Link
                    to="/my-requests"
                    className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
                  >
                    Manage in My Requests
                  </Link>
                </div>
              ) : resource.availability !== 'Available' ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-5 rounded-lg text-sm font-semibold text-slate-500 bg-slate-100 cursor-not-allowed"
                >
                  Currently {resource.availability}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenRequest}
                  className={`w-full py-3 px-5 rounded-lg text-sm font-semibold text-white transition-colors ${
                    resource.transactionType === 'Donate'
                      ? 'bg-[#16A34A] hover:bg-[#15803d]'
                      : 'bg-[#2563EB] hover:bg-[#1d4ed8]'
                  }`}
                >
                  {actionButtonLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={actionButtonLabel}
        subtitle={`Send a campus request to ${resource.ownerName} for "${resource.title}".`}
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          {!currentUser && (
            <div className="p-3 rounded-lg bg-[#2563EB]/8 border border-[#2563EB]/20 text-xs text-[#172554]">
              Submitting will sign you in with the Demo Student profile (Maya Patel) so you can track this request in My Requests.
            </div>
          )}

          <div>
            <label
              htmlFor="meetupSpot"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Preferred Campus Meetup Spot
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="meetupSpot"
                value={meetupSpot}
                onChange={(e) => setMeetupSpot(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-[#2563EB] focus:outline-none"
              >
                {MEETUP_SPOTS.map((spot) => (
                  <option key={spot} value={spot}>
                    {spot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="requestMessage"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Note to {resource.ownerName.split(' ')[0]}
            </label>
            <textarea
              id="requestMessage"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share when you are free between classes to meet up..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors"
            >
              Confirm Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

  if (currentUser) {
    return (
      <DashboardShell breadcrumb="Browse / Resource Details" title={resource.category}>
        {detailContent}
      </DashboardShell>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {detailContent}
      </main>
      <Footer />
    </div>
  );
};
