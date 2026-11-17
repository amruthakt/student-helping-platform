import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, MapPin, Mail, CheckCircle2, Inbox, Send } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { SafeImage } from '../components/SafeImage';
import { StatusLabel } from '../components/StatusLabel';
import { EmptyState } from '../components/EmptyState';
import { useCampus } from '../context/CampusContext';
import { DEMO_STUDENT_USER } from '../data/seedData';

export const MyRequestsPage: React.FC = () => {
  const {
    currentUser,
    requests,
    acceptRequest,
    rejectRequest,
    completeTransaction,
    cancelRequest,
  } = useCampus();
  const activeUser = currentUser || DEMO_STUDENT_USER;
  const navigate = useNavigate();

  const incomingRequests = requests.filter((r) => r.ownerId === activeUser.id);
  const outgoingRequests = requests.filter((r) => r.requesterId === activeUser.id);

  return (
    <DashboardShell breadcrumb="My Requests" title="Requests & Exchanges">
      <div className="space-y-10">
        {/* Section 1: Incoming Requests */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#172554]">
                Incoming Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Requests received from fellow students for your posted resources.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {incomingRequests.length} total
            </span>
          </div>

          {incomingRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No incoming requests yet"
              description="When another student requests to buy, borrow, exchange, or claim your items, you can review and accept them here."
            />
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <Link
                      to={`/resources/${req.resourceId}`}
                      className="w-20 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                    >
                      <SafeImage
                        src={req.resourceImageUrl}
                        alt={req.resourceTitle}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                        <span className="font-semibold text-[#2563EB]">
                          {req.transactionType}
                        </span>
                        <span aria-hidden="true">·</span>
                        <StatusLabel status={req.status} />
                      </div>

                      <Link
                        to={`/resources/${req.resourceId}`}
                        className="block font-display text-base font-semibold text-[#172554] hover:text-[#2563EB] transition-colors"
                      >
                        {req.resourceTitle}
                      </Link>

                      <p className="text-xs text-slate-600">
                        Requested by{' '}
                        <strong className="text-[#172554]">{req.requesterName}</strong> (
                        {req.requesterDepartment} · {req.requesterSemester})
                      </p>

                      <p className="text-sm text-slate-700 bg-[#F8FAFC] border border-slate-100 rounded-lg px-3 py-2">
                        "{req.message}"
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.meetupSpot}</span>
                        </span>
                        {req.status === 'Accepted' && (
                          <a
                            href={`mailto:${req.requesterEmail}`}
                            className="inline-flex items-center gap-1 text-[#2563EB] hover:underline"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{req.requesterEmail}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => acceptRequest(req.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectRequest(req.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        type="button"
                        onClick={() => completeTransaction(req.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Outgoing Requests */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#172554]">
                Outgoing Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Requests you have sent to other students across campus.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {outgoingRequests.length} total
            </span>
          </div>

          {outgoingRequests.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No outgoing requests"
              description="Explore textbooks, calculators, and lab equipment to send your first campus request."
              actionLabel="Browse Resources"
              onAction={() => navigate('/browse')}
            />
          ) : (
            <div className="space-y-3">
              {outgoingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <Link
                      to={`/resources/${req.resourceId}`}
                      className="w-20 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                    >
                      <SafeImage
                        src={req.resourceImageUrl}
                        alt={req.resourceTitle}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                        <span className="font-semibold text-[#2563EB]">
                          {req.transactionType}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{req.resourceCategory}</span>
                        <span aria-hidden="true">·</span>
                        <StatusLabel status={req.status} />
                      </div>

                      <Link
                        to={`/resources/${req.resourceId}`}
                        className="block font-display text-base font-semibold text-[#172554] hover:text-[#2563EB] transition-colors"
                      >
                        {req.resourceTitle}
                      </Link>

                      <p className="text-xs text-slate-600">
                        Listed by <strong className="text-[#172554]">{req.ownerName}</strong> (
                        {req.ownerDepartment})
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Meetup: {req.meetupSpot}</span>
                        </span>
                        {req.status === 'Accepted' && (
                          <a
                            href={`mailto:${req.ownerEmail}`}
                            className="inline-flex items-center gap-1 text-[#2563EB] hover:underline"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Coordinate: {req.ownerEmail}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {req.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => cancelRequest(req.id)}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        Withdraw Request
                      </button>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        type="button"
                        onClick={() => completeTransaction(req.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}

                    <Link
                      to={`/resources/${req.resourceId}`}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors"
                    >
                      View Resource
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
};
