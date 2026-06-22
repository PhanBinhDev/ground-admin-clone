import { Skeleton } from '@/components/ui/skeleton'

export default function FleetLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-56" />
      </div>

      {/* Toolbar: search + band filter + CSV */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-16" />
        </div>

        {/* Table */}
        <div className="rounded-md border border-line2 overflow-hidden">
          <div className="flex gap-3 border-b border-line2 bg-panel2 px-3 py-2.5">
            {[200, 140, 60, 50, 50, 90].map((w, i) => (
              <Skeleton key={i} className="h-3" style={{ width: w }} />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-line last:border-0 px-3 py-3">
              <div className="space-y-1.5" style={{ width: 200 }}>
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-2.5 w-28" />
              </div>
              <div className="space-y-1.5" style={{ width: 140 }}>
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <Skeleton className="h-4 w-14 rounded" />
              <Skeleton className="h-3 w-8 ml-auto" />
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
