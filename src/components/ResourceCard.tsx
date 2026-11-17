import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ResourceItem } from '../types/campus';
import { SafeImage } from './SafeImage';
import { StatusLabel } from './StatusLabel';

interface ResourceCardProps {
  resource: ResourceItem;
}

export function formatTransactionSummary(resource: ResourceItem): string {
  switch (resource.transactionType) {
    case 'Sell':
      return resource.price !== undefined ? `$${resource.price}` : 'For Sale';
    case 'Borrow':
      return resource.borrowingDuration ? `Borrow · ${resource.borrowingDuration}` : 'Borrow';
    case 'Exchange':
      return 'Exchange';
    case 'Donate':
      return 'Free';
  }
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const priceOrTerm = formatTransactionSummary(resource);

  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-150 hover:border-slate-300 hover:shadow-sm">
      <Link
        to={`/resources/${resource.id}`}
        className="block aspect-[4/3] w-full overflow-hidden bg-slate-100"
      >
        <SafeImage
          src={resource.imageUrl}
          alt={resource.title}
          fallbackLabel={resource.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-slate-600">{resource.category}</span>
            <span aria-hidden="true">·</span>
            <span>{resource.condition}</span>
          </div>
          <StatusLabel status={resource.availability} />
        </div>

        <Link to={`/resources/${resource.id}`} className="block mb-3">
          <h3 className="font-display text-base font-semibold text-[#172554] leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
            {resource.title}
          </h3>
        </Link>

        <div className="text-xs text-slate-500 mb-4 truncate">
          {resource.department} <span aria-hidden="true">·</span> {resource.semester}
        </div>

        <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400">
              {resource.transactionType}
            </div>
            <div
              className={`text-sm font-semibold tabular-nums truncate ${
                resource.transactionType === 'Donate'
                  ? 'text-[#16A34A]'
                  : 'text-[#172554]'
              }`}
            >
              {priceOrTerm}
            </div>
          </div>

          <Link
            to={`/resources/${resource.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2563EB] bg-[#2563EB]/8 hover:bg-[#2563EB] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
