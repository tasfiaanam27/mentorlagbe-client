
function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[#EDE8F3] ${className}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      <div className="mx-auto w-full max-w-7xl space-y-8 p-5 md:p-8">
        {/* Dashboard heading */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E8E1EF] bg-white p-6 shadow-sm"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-5 h-9 w-20" />
              <Skeleton className="mt-4 h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="rounded-2xl border border-[#E8E1EF] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
