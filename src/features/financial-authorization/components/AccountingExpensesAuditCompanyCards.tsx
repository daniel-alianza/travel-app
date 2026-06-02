import type { ReactElement } from "react"
import { Building2 } from "lucide-react"

import { formatearMonto } from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import type { AccountingExpensesAuditResumenFiltrado } from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"
import { cn } from "@/lib/utils"

interface AccountingExpensesAuditCompanyCardsProps {
  bloques: ReadonlyArray<{
    companyId: number
    companyName: string
    resumen: AccountingExpensesAuditResumenFiltrado
  }>
  animar: boolean
}

export function AccountingExpensesAuditCompanyCards({
  bloques,
  animar,
}: AccountingExpensesAuditCompanyCardsProps): ReactElement {
  if (bloques.length <= 1) {
    return <></>
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Desglose por empresa
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bloques.map((bloque, indice) => (
          <article
            key={bloque.companyId}
            className={cn(
              "group cursor-default rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/10 sm:p-5",
              animar && "animate-travel-panel-in",
            )}
            style={animar ? { animationDelay: `${120 + indice * 50}ms` } : undefined}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-500 group-hover:scale-110">
                <Building2 className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <h4 className="font-semibold text-foreground">{bloque.companyName}</h4>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Solicitado</dt>
                <dd className="font-semibold tabular-nums text-foreground">
                  {formatearMonto(bloque.resumen.totalSolicitado)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Comprobado</dt>
                <dd className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {formatearMonto(bloque.resumen.totalComprobado)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pendiente</dt>
                <dd className="font-semibold tabular-nums text-amber-800 dark:text-amber-200">
                  {formatearMonto(bloque.resumen.pendientePorComprobar)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avance</dt>
                <dd className="font-semibold tabular-nums text-violet-700 dark:text-violet-300">
                  {bloque.resumen.porcentajeComprobado.toFixed(1)}%
                </dd>
              </div>
            </dl>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${bloque.resumen.porcentajeComprobado}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {bloque.resumen.totalSolicitudes} solicitud
              {bloque.resumen.totalSolicitudes === 1 ? "" : "es"} ·{" "}
              {bloque.resumen.usuariosUnicos} solicitante
              {bloque.resumen.usuariosUnicos === 1 ? "" : "s"}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
