type IamUsersLoadingSkeletonProps = {
  tamanoPagina: number
}

export function IamUsersLoadingSkeleton({
  tamanoPagina,
}: IamUsersLoadingSkeletonProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: tamanoPagina }).map((_, i) => (
        <div
          key={`sk-${String(i)}`}
          className="animate-pulse rounded-2xl border border-border/40 bg-card/40 p-5 shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted/80" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-9 rounded-lg bg-muted/70" />
            <div className="h-9 rounded-lg bg-muted/70" />
            <div className="h-20 rounded-lg bg-muted/60" />
          </div>
        </div>
      ))}
    </div>
  )
}
