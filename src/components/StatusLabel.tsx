import React from 'react';
import { CheckCircle2, Clock, XCircle, BookmarkCheck, Repeat } from 'lucide-react';
import { AvailabilityStatus, RequestStatus } from '../types/campus';

interface StatusLabelProps {
  status: AvailabilityStatus | RequestStatus;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  switch (status) {
    case 'Available':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A] whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Available</span>
        </span>
      );
    case 'Reserved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap shrink-0">
          <BookmarkCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Reserved</span>
        </span>
      );
    case 'Borrowed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] whitespace-nowrap shrink-0">
          <Repeat className="w-3.5 h-3.5 shrink-0" />
          <span>Borrowed</span>
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap shrink-0">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case 'Accepted':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Accepted</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 whitespace-nowrap shrink-0">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Rejected</span>
        </span>
      );
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#16A34A]" />
          <span>Completed</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap shrink-0">
          <span>{status}</span>
        </span>
      );
  }
};
