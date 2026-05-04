export function ExpenseMovimientosTablaSkeleton() {
  return (
    <div className="hidden animate-pulse overflow-x-auto rounded-2xl border border-border/50 lg:block">
      <div className="min-w-[720px] space-y-0">
        <div className="flex gap-2 bg-primary/20 px-4 py-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`sk-h-${i}`}
              className="h-4 flex-1 rounded-md bg-primary/25"
            />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div
            key={`sk-r-${row}`}
            className="flex gap-2 border-b border-border/30 px-4 py-4"
          >
            {Array.from({ length: 7 }).map((_, col) => (
              <div
                key={`sk-c-${row}-${col}`}
                className="h-4 flex-1 rounded-md bg-muted/80"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ExpenseMovimientosCardsSkeleton() {
  return (
    <ul className="grid animate-pulse gap-4 lg:hidden" role="list">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={`sk-m-${i}`}>
          <div className="rounded-3xl border-2 border-border/60 bg-muted/40 p-5 shadow-md">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="mt-3 h-5 w-full max-w-sm rounded bg-muted" />
            <div className="mt-4 grid gap-2">
              <div className="h-4 w-full rounded bg-muted/80" />
              <div className="h-4 w-full rounded bg-muted/80" />
              <div className="h-8 w-28 rounded-lg bg-muted" />
            </div>
            <div className="mt-4 h-11 w-full rounded-2xl bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  )
}
