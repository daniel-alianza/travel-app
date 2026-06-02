import type { ReactElement } from "react"

import type {
  AccountingMonthKpis,
  AccountingScope,
} from "@/features/financial-authorization/interfaces/accounting-menu-mock.interface"
import { formatearMonto } from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"

interface MenuAccountingSummaryPanelProps {
  alcance: AccountingScope
  etiquetaAlcance: string
  descripcionAlcance: string
  kpisTotales: AccountingMonthKpis | null
  kpisPorEmpresa: AccountingMonthKpis[]
  errorMensaje?: string | null
}

function MetricaResumen(props: {
  titulo: string
  valor: string
  subtitulo?: string
}): ReactElement {
  return (
    <div className="group/metric rounded-2xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/10 sm:px-5 sm:py-4 dark:hover:shadow-primary/5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors duration-300 group-hover/metric:text-foreground/80">
        {props.titulo}
      </p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground transition-colors duration-300 group-hover/metric:text-primary sm:text-xl">
        {props.valor}
      </p>
      {props.subtitulo !== undefined && props.subtitulo.length > 0 ? (
        <p className="mt-0.5 text-xs text-muted-foreground transition-colors duration-300 group-hover/metric:text-muted-foreground">
          {props.subtitulo}
        </p>
      ) : null}
    </div>
  )
}

function BloqueKpisEmpresa(props: {
  tituloEmpresa: string
  kpi: AccountingMonthKpis
  mostrarTituloEmpresa: boolean
  indiceAnimacion: number
}): ReactElement {
  return (
    <div
      className={`rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-primary/[0.03] p-4 shadow-md ring-1 ring-border/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/20 sm:p-5 dark:hover:shadow-primary/5 ${props.mostrarTituloEmpresa ? "ring-primary/10" : ""} animate-travel-panel-in`}
      style={{ animationDelay: `${props.indiceAnimacion * 70}ms` }}
    >
      {props.mostrarTituloEmpresa ? (
        <h3 className="mb-3 text-sm font-semibold text-foreground sm:text-base">
          {props.tituloEmpresa}
        </h3>
      ) : null}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricaResumen
          titulo="Dispersado (mes)"
          valor={formatearMonto(props.kpi.totalDispersadoMes)}
        />
        <MetricaResumen
          titulo="Comprobado (mes)"
          valor={formatearMonto(props.kpi.totalComprobadoMes)}
        />
        <MetricaResumen
          titulo="Pendiente contable"
          valor={formatearMonto(props.kpi.pendienteAutorizarContable)}
          subtitulo="Por autorizar"
        />
        <MetricaResumen
          titulo="Solicitudes abiertas"
          valor={String(props.kpi.solicitudesAbiertas)}
          subtitulo="En proceso"
        />
      </div>
    </div>
  )
}

export function MenuAccountingSummaryPanel({
  alcance,
  etiquetaAlcance,
  descripcionAlcance,
  kpisTotales,
  kpisPorEmpresa,
  errorMensaje = null,
}: MenuAccountingSummaryPanelProps): ReactElement {
  const desfaseBloques =
    kpisTotales !== null && alcance.tipo === "consolidado" ? 1 : 0
  const nombreEmpresaPrincipal = kpisPorEmpresa[0]?.companyName.trim() ?? ""

  return (
    <section
      className="mb-10 space-y-4 rounded-3xl border border-border/60 bg-card/40 p-5 shadow-md shadow-black/[0.04] ring-1 ring-border/35 backdrop-blur-md transition-shadow duration-500 hover:shadow-xl hover:shadow-primary/10 dark:shadow-black/20 dark:hover:shadow-primary/5 sm:p-7"
      aria-label="Resumen contable del mes"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          {alcance.tipo === "empresa" && nombreEmpresaPrincipal.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                De acuerdo a la empresa que tienes asignada
              </p>
              <p className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {nombreEmpresaPrincipal}
              </p>
            </div>
          ) : null}
          {alcance.tipo === "consolidado" ? (
            <p className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Todas las empresas
            </p>
          ) : null}
          <h2 className="text-base font-semibold text-muted-foreground sm:text-lg">
            Indicadores del mes
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {descripcionAlcance}
          </p>
          {errorMensaje !== null && errorMensaje.length > 0 ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMensaje}
            </p>
          ) : null}
          <p className="text-xs font-medium text-muted-foreground/90">
            Periodo:{" "}
            <span className="text-foreground">
              {kpisPorEmpresa[0]?.etiquetaMes ?? ""}
            </span>
          </p>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm shadow-primary/10 transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:bg-primary/15 hover:shadow-md">
          {alcance.tipo === "empresa" && nombreEmpresaPrincipal.length > 0
            ? `Empresa asignada · ${nombreEmpresaPrincipal}`
            : etiquetaAlcance}
        </span>
      </div>

      {kpisTotales !== null && alcance.tipo === "consolidado" ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total grupo
          </p>
          <BloqueKpisEmpresa
            tituloEmpresa=""
            kpi={kpisTotales}
            mostrarTituloEmpresa={false}
            indiceAnimacion={0}
          />
        </div>
      ) : null}

      <div className="space-y-4">
        {alcance.tipo === "consolidado" ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Desglose por empresa
          </p>
        ) : null}
        {kpisPorEmpresa.map((kpi, indice) => (
          <BloqueKpisEmpresa
            key={kpi.companyId}
            tituloEmpresa={kpi.companyName}
            kpi={kpi}
            mostrarTituloEmpresa={alcance.tipo === "consolidado"}
            indiceAnimacion={desfaseBloques + indice}
          />
        ))}
      </div>
    </section>
  )
}
