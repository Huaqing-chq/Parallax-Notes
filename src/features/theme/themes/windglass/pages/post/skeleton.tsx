export function PostPageSkeleton() {
  return (
    <div className="wg-shell max-w-3xl">
      <div className="wg-glass-card rounded-[2rem] p-6 md:p-9 animate-pulse mb-8">
        <div className="h-4 w-48 rounded bg-black/8 dark:bg-white/8 mb-7" />
        <div className="h-12 w-5/6 rounded-2xl bg-black/8 dark:bg-white/8 mb-4" />
        <div className="h-12 w-2/3 rounded-2xl bg-black/8 dark:bg-white/8" />
      </div>
      <div className="wg-glass-card rounded-[2rem] p-6 md:p-9 animate-pulse space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-4 rounded bg-black/6 dark:bg-white/6"
            style={{ width: `${index % 3 === 0 ? 92 : index % 3 === 1 ? 78 : 64}%` }}
          />
        ))}
      </div>
    </div>
  );
}
