import { Loader2 } from "lucide-react"

import type { ReactElement } from "react"

export function MenuAccountingModuleSkeleton(): ReactElement {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
      aria-label="Cargando módulos"
    >
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-border/40 bg-card/70 p-6 shadow-lg shadow-black/[0.04] ring-1 ring-border/25 transition-shadow duration-500 sm:p-7 dark:shadow-black/30"
        style={{
          animation: "travel-panel-fade-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
          animationDelay: "90ms",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <div className="absolute inset-y-0 left-0 w-[65%] min-w-40 bg-linear-to-r from-transparent via-violet-500/12 to-transparent opacity-90 animate-fin-auth-skeleton-shimmer dark:via-violet-400/18" />
        </div>
        <div className="relative animate-pulse">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted shadow-inner sm:h-16 sm:w-16" />
          <div className="space-y-3">
            <div className="h-5 w-3/4 max-w-[14rem] rounded-lg bg-muted shadow-sm" />
            <div className="h-3.5 w-full rounded-md bg-muted/85" />
            <div className="h-3.5 w-5/6 rounded-md bg-muted/75" />
          </div>
          <div className="mt-6 flex justify-end">
            <div className="h-10 w-10 rounded-xl bg-muted/90 shadow-sm" />
          </div>
        </div>
      </div>
      <p className="col-span-full flex items-center justify-center gap-2 pt-1 text-center text-xs font-medium text-muted-foreground">
        <Loader2
          className="size-3.5 shrink-0 animate-spin text-violet-600 dark:text-violet-400"
          aria-hidden
        />
        <span>Preparando accesos al módulo…</span>
      </p>
    </div>
  )
}
