export function PostsPageSkeleton() {
  return (
    <div className="wg-shell">
      <div className="h-4 w-24 rounded bg-black/8 dark:bg-white/8 animate-pulse mb-5" />
      <div className="h-12 w-2/3 rounded-2xl bg-black/8 dark:bg-white/8 animate-pulse mb-5" />
      <div className="wg-glass-card rounded-3xl p-5 mb-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-20 rounded-full bg-black/6 dark:bg-white/8 animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="wg-glass-card rounded-3xl p-6 animate-pulse">
            <div className="h-5 w-3/4 rounded bg-black/8 dark:bg-white/8 mb-4" />
            <div className="h-3.5 w-full rounded bg-black/6 dark:bg-white/6 mb-2" />
            <div className="h-3.5 w-2/3 rounded bg-black/6 dark:bg-white/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
