import { Fragment, useState, type ReactElement } from "react"
import { ChevronDown, ChevronUp, FileSearch } from "lucide-react"

import { ETIQUETAS_ESTADO_SOLICITUD_AUDITORIA } from "@/features/financial-authorization/constants/accounting-expenses-reconciliation-rules"
import { formatearMonto } from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import type {
  AccountingExpensesAuditEstadoSolicitud,
  AccountingExpensesAuditSolicitudRow,
} from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"
import { cn } from "@/lib/utils"

interface AccountingExpensesAuditTableProps {
  filas: readonly AccountingExpensesAuditSolicitudRow[]
  animar: boolean
}

type SortKey =
  | "folio"
  | "dispersedAt"
  | "totalSolicitado"
  | "totalComprobado"
  | "porcentajeComprobado"

function claseEstado(estado: AccountingExpensesAuditEstadoSolicitud): string {
  switch (estado) {
    case "completa":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
    case "parcial":
      return "border-amber-500/35 bg-amber-500/10 text-amber-950 dark:text-amber-100"
    case "excedente":
      return "border-violet-500/35 bg-violet-500/10 text-violet-950 dark:text-violet-100"
    default:
      return "border-border/60 bg-muted/50 text-muted-foreground"
  }
}

function formatearFecha(iso: string | null): string {
  if (iso === null) {
    return "—"
  }
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

export function AccountingExpensesAuditTable({
  filas,
  animar,
}: AccountingExpensesAuditTableProps): ReactElement {
  const [sortKey, setSortKey] = useState<SortKey>("dispersedAt")
  const [sortAsc, setSortAsc] = useState(false)
  const [filaExpandida, setFilaExpandida] = useState<number | null>(null)

  function alternarOrden(key: SortKey): void {
    if (sortKey === key) {
      setSortAsc((prev) => !prev)
      return
    }
    setSortKey(key)
    setSortAsc(key === "folio")
  }

  const filasOrdenadas = [...filas].sort((a, b) => {
    let cmp = 0
    switch (sortKey) {
      case "folio":
        cmp = a.folio.localeCompare(b.folio)
        break
      case "dispersedAt":
        cmp = a.dispersedAt.localeCompare(b.dispersedAt)
        break
      case "totalSolicitado":
        cmp = a.totalSolicitado - b.totalSolicitado
        break
      case "totalComprobado":
        cmp = a.totalComprobado - b.totalComprobado
        break
      case "porcentajeComprobado":
        cmp = a.porcentajeComprobado - b.porcentajeComprobado
        break
    }
    return sortAsc ? cmp : -cmp
  })

  function iconoOrden(key: SortKey): ReactElement | null {
    if (sortKey !== key) {
      return null
    }
    return sortAsc ? (
      <ChevronUp className="h-3.5 w-3.5" aria-hidden />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" aria-hidden />
    )
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-border/60 bg-card/50 shadow-md transition-shadow duration-500 hover:shadow-xl",
        animar && "animate-travel-panel-in",
      )}
      style={animar ? { animationDelay: "200ms" } : undefined}
    >
      <header className="flex flex-col gap-2 border-b border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Detalle por solicitud
            </h3>
            <p className="text-xs text-muted-foreground">
              {filas.length} solicitud{filas.length === 1 ? "" : "es"} en el periodo
            </p>
          </div>
        </div>
      </header>

      {filas.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-muted-foreground">
          No hay solicitudes que coincidan con los filtros.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium sm:px-6">
                  <button
                    type="button"
                    onClick={() => alternarOrden("folio")}
                    className="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
                  >
                    Folio {iconoOrden("folio")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Solicitante</th>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => alternarOrden("dispersedAt")}
                    className="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
                  >
                    Dispersión {iconoOrden("dispersedAt")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  <button
                    type="button"
                    onClick={() => alternarOrden("totalSolicitado")}
                    className="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
                  >
                    Solicitado {iconoOrden("totalSolicitado")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  <button
                    type="button"
                    onClick={() => alternarOrden("totalComprobado")}
                    className="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
                  >
                    Comprobado {iconoOrden("totalComprobado")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-right">Pendiente</th>
                <th className="px-4 py-3 font-medium text-right">
                  <button
                    type="button"
                    onClick={() => alternarOrden("porcentajeComprobado")}
                    className="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
                  >
                    % {iconoOrden("porcentajeComprobado")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filasOrdenadas.map((fila) => {
                const expandida = filaExpandida === fila.solicitudId
                return (
                  <Fragment key={fila.solicitudId}>
                    <tr
                      onClick={() =>
                        setFilaExpandida((prev) =>
                          prev === fila.solicitudId ? null : fila.solicitudId,
                        )
                      }
                      className="cursor-pointer border-b border-border/40 transition-colors duration-300 hover:bg-primary/[0.04]"
                    >
                      <td className="px-4 py-3 font-medium text-foreground sm:px-6">
                        {fila.folio}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {fila.employeeName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fila.employeeEmail}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {fila.companyName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatearFecha(fila.dispersedAt)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatearMonto(fila.totalSolicitado)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-700 dark:text-emerald-300">
                        {formatearMonto(fila.totalComprobado)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-amber-800 dark:text-amber-200">
                        {formatearMonto(fila.pendientePorComprobar)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fila.porcentajeComprobado.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            claseEstado(fila.estado),
                          )}
                        >
                          {ETIQUETAS_ESTADO_SOLICITUD_AUDITORIA[fila.estado]}
                        </span>
                      </td>
                    </tr>
                    {expandida ? (
                      <tr className="border-b border-border/40 bg-muted/20">
                        <td colSpan={9} className="px-4 py-4 sm:px-6">
                          <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                            <div>
                              <dt className="text-muted-foreground">ID solicitud</dt>
                              <dd className="font-medium">{fila.solicitudId}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Última comprobación
                              </dt>
                              <dd className="font-medium">
                                {formatearFecha(fila.ultimaComprobacionAt)}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Mov. comprobados
                              </dt>
                              <dd className="font-medium">
                                {fila.movimientosComprobados}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Mov. pendientes
                              </dt>
                              <dd className="font-medium">
                                {fila.movimientosPendientes}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Pend. autorizar contable
                              </dt>
                              <dd className="font-medium tabular-nums">
                                {formatearMonto(fila.pendienteAutorizarContable)}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Usuario ID</dt>
                              <dd className="font-medium">{fila.userId}</dd>
                            </div>
                          </dl>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
