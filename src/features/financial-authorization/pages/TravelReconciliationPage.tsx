import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/features/auth/store/authStore"
import {
  decideTravelReconciliation,
  fetchPendingTravelReconciliations,
} from "@/features/financial-authorization/services/travel-reconciliation-api"

const RECONCILIATION_QUERY_KEY = ["travel-reconciliation", "pending"]
type ReconciliationStatus =
  | "pending"
  | "rejected"
  | "approved"
  | "verified"
  | "expired"
type ReconciliationFilter = ReconciliationStatus | "all"

export function TravelReconciliationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.userId)
  const [activeFilter, setActiveFilter] = useState<ReconciliationFilter>("pending")
  const pending = useQuery({
    queryKey: RECONCILIATION_QUERY_KEY,
    queryFn: fetchPendingTravelReconciliations,
    staleTime: 15_000,
  })

  const decideMutation = useMutation({
    mutationFn: async (input: {
      reconciliationId: number
      rejectionReason: string | null
    }) => {
      if (typeof userId !== "number") {
        return
      }
      await decideTravelReconciliation({
        reconciliationId: input.reconciliationId,
        rejectionReason: input.rejectionReason,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: RECONCILIATION_QUERY_KEY })
    },
  })

  const reconciliationsFiltered = useMemo(() => {
    const source = (pending.data ?? []).map((item) => ({
      ...item,
      visualStatus:
        item.status === "pending" &&
        new Date(item.codeExpiresAt).getTime() < Date.now()
          ? ("expired" as const)
          : item.status,
    }))
    if (activeFilter === "all") {
      return source
    }
    return source.filter((item) => item.visualStatus === activeFilter)
  }, [activeFilter, pending.data])

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <AppHeader
        mounted
        onBackToHome={() => navigate("/menu-accounting")}
        etiquetaBotonVolver="Volver al menú"
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Conciliación de comprobaciones
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Atiende solicitudes pendientes y comparte el código con el solicitante.
        </p>

        <section className="mt-5 flex flex-wrap gap-2">
          {[
            { id: "pending", label: "Pendientes" },
            { id: "verified", label: "Verificadas" },
            { id: "rejected", label: "Rechazadas" },
            { id: "approved", label: "Aprobadas" },
            { id: "expired", label: "Expiradas" },
            { id: "all", label: "Todas" },
          ].map((filter) => (
            <Button
              key={filter.id}
              type="button"
              variant={activeFilter === filter.id ? "default" : "outline"}
              className="cursor-pointer rounded-2xl"
              onClick={() => setActiveFilter(filter.id as ReconciliationFilter)}
            >
              {filter.label}
            </Button>
          ))}
        </section>

        {pending.isPending ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Cargando conciliaciones...
          </div>
        ) : null}
        {pending.isError ? (
          <p className="mt-6 text-sm text-destructive">
            No se pudieron cargar las conciliaciones.
          </p>
        ) : null}

        <div className="mt-6 grid gap-4">
          {reconciliationsFiltered.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <p className="text-sm text-foreground">
                  Solicitud #{item.travelRequestId}
                </p>
                <p className="text-sm text-foreground">
                  Estado:{" "}
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${resolverClaseEstado(
                      item.visualStatus
                    )}`}
                  >
                    {resolverEtiquetaEstado(item.visualStatus)}
                  </span>
                </p>
                <p className="text-sm text-foreground">{item.employeeName}</p>
                <p className="text-sm text-foreground">{item.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {item.requestedByName} ({item.requestedByEmail})
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {item.visualStatus === "verified" ? (
                  <div
                    className="max-w-56 rounded-md border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-900 select-none dark:text-emerald-200"
                    onCopy={(event) => event.preventDefault()}
                    onCut={(event) => event.preventDefault()}
                    onContextMenu={(event) => event.preventDefault()}
                    onMouseDown={(event) => event.preventDefault()}
                    onDragStart={(event) => event.preventDefault()}
                  >
                    {item.verificationCode}
                  </div>
                ) : (
                  <Input
                    readOnly
                    value={item.verificationCode}
                    className="max-w-56 transition-colors focus-visible:ring-primary/40"
                  />
                )}
                {item.visualStatus === "pending" ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer rounded-2xl transition-all duration-200 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-700"
                    disabled={decideMutation.isPending || typeof userId !== "number"}
                    onClick={() => {
                      decideMutation.mutate({
                        reconciliationId: item.id,
                        rejectionReason: "Solicitud rechazada por contabilidad",
                      })
                    }}
                  >
                    {decideMutation.isPending ? "Procesando..." : "Rechazar"}
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
          {!pending.isPending && !pending.isError && reconciliationsFiltered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-card/50 p-6 text-sm text-muted-foreground">
              No hay conciliaciones para el filtro seleccionado.
            </div>
          ) : null}
        </div>
      </main>
      <AppFooter mounted transitionDelayClass="delay-700" />
    </div>
  )
}

function resolverEtiquetaEstado(
  status: "pending" | "rejected" | "approved" | "verified" | "expired"
): string {
  if (status === "pending") {
    return "Pendiente"
  }
  if (status === "rejected") {
    return "Rechazada"
  }
  if (status === "verified") {
    return "Verificada"
  }
  if (status === "expired") {
    return "Expirada"
  }
  return "Aprobada"
}

function resolverClaseEstado(
  status: "pending" | "rejected" | "approved" | "verified" | "expired"
): string {
  if (status === "pending") {
    return "border-amber-300/50 bg-amber-500/10 text-amber-900 dark:text-amber-200"
  }
  if (status === "rejected") {
    return "border-red-300/50 bg-red-500/10 text-red-900 dark:text-red-200"
  }
  if (status === "verified") {
    return "border-emerald-300/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
  }
  if (status === "expired") {
    return "border-orange-300/50 bg-orange-500/10 text-orange-900 dark:text-orange-200"
  }
  return "border-sky-300/50 bg-sky-500/10 text-sky-900 dark:text-sky-200"
}
