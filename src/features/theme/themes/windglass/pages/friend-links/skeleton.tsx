export function FriendLinksPageSkeleton() {
  return (
    <div className="wg-shell">
      <div className="h-4 w-28 rounded bg-black/8 dark:bg-white/8 animate-pulse mb-5" />
      <div className="h-12 w-2/3 rounded-2xl bg-black/8 dark:bg-white/8 animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="wg-glass-card rounded-3xl p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-black/8 dark:bg-white/8" />
              <div className="flex-1">
                <div className="h-4 w-2/3 rounded bg-black/8 dark:bg-white/8 mb-3" />
                <div className="h-3 w-full rounded bg-black/6 dark:bg-white/6 mb-2" />
                <div className="h-3 w-4/5 rounded bg-black/6 dark:bg-white/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
