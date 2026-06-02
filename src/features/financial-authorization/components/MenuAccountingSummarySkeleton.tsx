import type { ReactElement } from "react"
import { Loader2 } from "lucide-react"

import type { AccountingScope } from "@/features/financial-authorization/interfaces/accounting-menu-mock.interface"

interface MenuAccountingSummarySkeletonProps {
  alcance: AccountingScope
}

function SkeletonMetrica(): ReactElement {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-4 shadow-inner ring-1 ring-border/20 sm:p-5">
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
        aria-hidden
      >
        <div className="absolute inset-y-0 left-0 w-[70%] min-w-40 bg-linear-to-r from-transparent via-foreground/10 to-transparent opacity-70 animate-fin-auth-skeleton-shimmer dark:via-foreground/15" />
      </div>
      <div className="relative space-y-3 animate-pulse">
        <div className="h-2.5 w-24 rounded-md bg-muted shadow-sm" />
        <div className="h-7 w-[min(100%,12rem)] rounded-lg bg-muted/90 shadow-inner" />
        <div className="h-2 w-16 rounded bg-muted/70" />
      </div>
    </div>
  )
}

function SkeletonBloqueEmpresa(props: { indice: number }): ReactElement {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-primary/[0.04] p-4 shadow-md ring-1 ring-border/25 sm:p-5"
      style={{
        animationDelay: `${120 + props.indice * 100}ms`,
        animation: "travel-panel-fade-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
        aria-hidden
      >
        <div className="absolute inset-y-0 left-0 w-[70%] min-w-40 bg-linear-to-r from-transparent via-violet-500/10 to-transparent opacity-80 animate-fin-auth-skeleton-shimmer dark:via-violet-400/15" />
      </div>
      <div className="relative mb-4 animate-pulse">
        <div className="h-4 w-40 rounded-md bg-muted shadow-sm" />
      </div>
      <div className="relative grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, j) => (
          <SkeletonMetrica key={`sk-m-${props.indice}-${j}`} />
        ))}
      </div>
    </div>
  )
}

export function MenuAccountingSummarySkeleton({
  alcance,
}: MenuAccountingSummarySkeletonProps): ReactElement {
  const filasDesglose = alcance.tipo === "consolidado" ? 4 : 0

  return (
    <section
      className="mb-10 space-y-4 rounded-3xl border border-border/60 bg-card/30 p-5 shadow-lg shadow-black/[0.03] ring-1 ring-border/30 backdrop-blur-md dark:shadow-black/25 sm:p-7"
      aria-busy="true"
      aria-live="polite"
      aria-label="Cargando indicadores"
    >
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        style={{
          animation: "travel-panel-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <div className="relative max-w-2xl space-y-3 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-lg"
            aria-hidden
          >
            <div className="absolute inset-y-0 left-0 w-[60%] min-w-32 bg-linear-to-r from-transparent via-foreground/8 to-transparent opacity-80 animate-fin-auth-skeleton-shimmer dark:via-foreground/12" />
          </div>
          <div className="relative animate-pulse space-y-2">
            <div className="h-6 w-48 rounded-lg bg-muted shadow-inner sm:h-7 sm:w-56" />
            <div className="h-3.5 w-full max-w-xl rounded-md bg-muted/85" />
            <div className="h-3 w-40 rounded-md bg-muted/70" />
          </div>
        </div>
        <div
          className="relative h-8 w-36 shrink-0 overflow-hidden rounded-full border border-primary/15 bg-primary/5 shadow-sm"
          style={{
            animationDelay: "80ms",
            animation: "travel-panel-fade-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-full"
            aria-hidden
          >
            <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-transparent via-primary/15 to-transparent animate-fin-auth-skeleton-shimmer" />
          </div>
        </div>
      </div>

      {alcance.tipo === "consolidado" ? (
        <div className="space-y-2">
          <div className="h-2.5 w-24 animate-pulse rounded bg-muted/80" />
          <div
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
            style={{
              animationDelay: "100ms",
              animation: "travel-panel-fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMetrica key={`sk-total-${i}`} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {alcance.tipo === "consolidado" ? (
          <div
            className="h-2.5 w-40 animate-pulse rounded bg-muted/80"
            style={{
              animationDelay: "120ms",
              animation: "travel-panel-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          />
        ) : null}
        {alcance.tipo === "empresa" ? (
          <div
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
            style={{
              animationDelay: "120ms",
              animation: "travel-panel-fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMetrica key={`sk-emp-${i}`} />
            ))}
          </div>
        ) : null}
        {Array.from({ length: filasDesglose }).map((_, i) => (
          <SkeletonBloqueEmpresa key={`sk-bl-${i}`} indice={i} />
        ))}
      </div>

      <p className="flex items-center justify-center gap-2 pt-2 text-center text-xs font-medium text-muted-foreground">
        <Loader2
          className="size-3.5 shrink-0 animate-spin text-violet-600 dark:text-violet-400"
          aria-hidden
        />
        <span>Sincronizando indicadores del mes…</span>
      </p>
    </section>
  )
}
