import { Loader2 } from "lucide-react"

export function ProfilePerfilSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative">
            <div className="flex h-28 w-28 animate-pulse rounded-full bg-muted sm:h-32 sm:w-32" />
            <div className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-muted/80 shadow-md">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
          <div className="w-full flex-1 space-y-4">
            <div className="mx-auto h-7 max-w-xs animate-pulse rounded-lg bg-muted sm:mx-0" />
            <div className="mx-auto h-4 max-w-sm animate-pulse rounded-md bg-muted/80 sm:mx-0" />
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="h-8 w-24 animate-pulse rounded-full bg-muted/70" />
              <span className="h-8 w-28 animate-pulse rounded-full bg-muted/70" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`sk-${index}`}
            className="rounded-2xl border border-border/50 bg-card/60 p-5 shadow-md backdrop-blur-sm"
          >
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-full max-w-56 animate-pulse rounded bg-muted/80" />
          </div>
        ))}
      </div>

      <div className="h-24 animate-pulse rounded-2xl border border-dashed border-border/60 bg-muted/30" />
    </div>
  )
}
