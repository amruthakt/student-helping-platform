import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useCampus } from '../context/CampusContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCampus();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : Info;
        const iconColor =
          toast.type === 'success'
            ? 'text-[#16A34A]'
            : toast.type === 'error'
            ? 'text-red-600'
            : 'text-[#2563EB]';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-white border border-slate-200 rounded-xl shadow-md px-4 py-3.5 transition-all"
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#172554]">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
