export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-800/40 rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${className}`}
    />
  );
}

export function MatchSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4 border border-white/5">
      <div className="flex justify-between items-center">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 w-5/12">
          <Shimmer className="w-8 h-8 rounded-full" />
          <Shimmer className="h-5 w-20" />
        </div>
        <Shimmer className="h-8 w-12 rounded-lg" />
        <div className="flex items-center gap-3 w-5/12 justify-end">
          <Shimmer className="h-5 w-20" />
          <Shimmer className="w-8 h-8 rounded-full" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-4 w-16" />
      </div>
    </div>
  );
}

export function CuriositySkeleton() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
      <div className="flex items-center gap-3">
        <Shimmer className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-grow">
          <Shimmer className="h-5 w-1/2" />
          <Shimmer className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-11/12" />
        <Shimmer className="h-4 w-4/5" />
      </div>
      <div className="pt-4">
        <Shimmer className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function GroupSkeleton() {
  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5">
        <Shimmer className="h-6 w-24" />
      </div>
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shimmer className="w-6 h-6 rounded-full" />
              <Shimmer className="h-5 w-24" />
            </div>
            <Shimmer className="h-6 w-12 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatchDetailSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="glass rounded-3xl p-8 border border-white/5 text-center space-y-6">
        <Shimmer className="h-4 w-32 mx-auto" />
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-4">
          <div className="flex flex-col items-center gap-3 w-32">
            <Shimmer className="w-20 h-20 rounded-full" />
            <Shimmer className="h-6 w-24" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Shimmer className="h-14 w-28 rounded-2xl" />
            <Shimmer className="h-4 w-20" />
          </div>
          
          <div className="flex flex-col items-center gap-3 w-32">
            <Shimmer className="w-20 h-20 rounded-full" />
            <Shimmer className="h-6 w-24" />
          </div>
        </div>
        
        <Shimmer className="h-4 w-48 mx-auto" />
      </div>

      {/* Grid skeleton for details and curiosities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Shimmer className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CuriositySkeleton />
            <CuriositySkeleton />
            <CuriositySkeleton />
          </div>
        </div>
        
        <div className="space-y-6">
          <Shimmer className="h-8 w-48" />
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between py-2 border-b border-white/5">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
