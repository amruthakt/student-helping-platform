import React from 'react';
import { LucideIcon, SearchX } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-xl py-14 px-6">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#172554] mb-4">
        <Icon className="w-6 h-6" strokeWidth={1.7} />
      </div>
      <h3 className="font-display text-base font-semibold text-[#172554] mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
