function CardSkeleton() {
  return (
    <div className="wg-glass-card rounded-2xl p-5 md:p-6 animate-pulse">
      <div className="h-5 w-3/4 rounded-lg bg-black/8 dark:bg-white/8 mb-3" />
      <div className="h-3.5 w-full rounded bg-black/5 dark:bg-white/5 mb-2" />
      <div className="h-3.5 w-2/3 rounded bg-black/5 dark:bg-white/5 mb-4" />
      <div className="flex gap-4">
        <div className="h-3 w-16 rounded bg-black/5 dark:bg-white/5" />
        <div className="h-3 w-12 rounded bg-black/5 dark:bg-white/5" />
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="windglass-theme min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="h-3 w-24 rounded bg-black/8 dark:bg-white/8 mb-1 animate-pulse" />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
