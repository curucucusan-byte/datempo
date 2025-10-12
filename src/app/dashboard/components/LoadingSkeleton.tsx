// Dashboard Components - Loading Skeletons

export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-32 mb-3"></div>
          <div className="h-10 bg-slate-200 rounded w-20 mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-28"></div>
        </div>
        <div className="h-12 w-12 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}

export function AppointmentListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-48"></div>
              </div>
              <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SetupProgressSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-slate-200 rounded w-40"></div>
        <div className="h-5 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
            <div className="h-4 bg-slate-200 rounded w-48"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
