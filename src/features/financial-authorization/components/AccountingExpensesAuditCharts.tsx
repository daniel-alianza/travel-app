import { useId, useMemo, type ReactElement } from "react"
import { BarChart2, LineChart } from "lucide-react"

import { formatearMonto } from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import type { AccountingExpensesAuditSerieDia } from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"
import { cn } from "@/lib/utils"

interface AccountingExpensesAuditChartsProps {
  serieDiaria: readonly AccountingExpensesAuditSerieDia[]
  animar: boolean
}

function maxValorDiario(serie: readonly AccountingExpensesAuditSerieDia[]): number {
  if (serie.length === 0) {
    return 1
  }
  return Math.max(
    1,
    ...serie.map((p) => Math.max(p.solicitado, p.comprobado)),
  )
}

const ANCHO_GRUPO_BARRA_PX = 52

function pasoEtiquetasEje(totalDias: number): number {
  if (totalDias <= 10) {
    return 1
  }
  if (totalDias <= 20) {
    return 2
  }
  if (totalDias <= 31) {
    return 5
  }
  return 7
}

function mostrarEtiquetaDia(indice: number, totalDias: number): boolean {
  if (totalDias <= 1) {
    return true
  }
  if (indice === 0 || indice === totalDias - 1) {
    return true
  }
  const paso = pasoEtiquetasEje(totalDias)
  return (indice + 1) % paso === 0
}

function etiquetaEjeDia(fechaIso: string): string {
  const dia = Number.parseInt(fechaIso.slice(8, 10), 10)
  if (!Number.isFinite(dia)) {
    return fechaIso
  }
  const mes = Number.parseInt(fechaIso.slice(5, 7), 10)
  const nombresMes = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ]
  const mesCorto = nombresMes[mes - 1] ?? ""
  return `${dia} ${mesCorto}`
}

function BarrasPorDiaChart(props: {
  serie: readonly AccountingExpensesAuditSerieDia[]
  tope: number
}): ReactElement {
  const total = props.serie.length
  const anchoMinimo = Math.max(total * ANCHO_GRUPO_BARRA_PX, 280)

  return (
    <div className="space-y-2">
      {total > 14 ? (
        <p className="text-center text-[11px] text-muted-foreground">
          Desliza horizontalmente para ver cada día del periodo
        </p>
      ) : null}
      <div className="overflow-x-auto overflow-y-hidden rounded-xl pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
        <div
          className="flex h-56 items-end gap-1 px-1"
          style={{ minWidth: `${anchoMinimo}px` }}
          role="img"
          aria-label="Gráfica de barras por día"
        >
          {props.serie.map((punto, indice) => {
            const altoSolicitado = (punto.solicitado / props.tope) * 100
            const altoComprobado = (punto.comprobado / props.tope) * 100
            const etiquetaVisible = mostrarEtiquetaDia(indice, total)
            const tituloDia = `${etiquetaEjeDia(punto.fechaIso)} · Solicitado ${formatearMonto(punto.solicitado)} · Comprobado ${formatearMonto(punto.comprobado)}`

            return (
              <div
                key={punto.fechaIso}
                className="group flex shrink-0 flex-col items-center justify-end gap-1.5"
                style={{ width: `${ANCHO_GRUPO_BARRA_PX}px` }}
                title={tituloDia}
              >
                <div className="flex h-44 w-full items-end justify-center gap-1">
                  <div
                    className="w-[46%] min-h-[2px] cursor-default rounded-t-md bg-gradient-to-t from-sky-600 to-sky-400 shadow-sm transition-all duration-500 group-hover:from-sky-500 group-hover:to-cyan-300"
                    style={{ height: `${Math.max(altoSolicitado, punto.solicitado > 0 ? 4 : 0)}%` }}
                  />
                  <div
                    className="w-[46%] min-h-[2px] cursor-default rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm transition-all duration-500 group-hover:from-emerald-500 group-hover:to-teal-300"
                    style={{ height: `${Math.max(altoComprobado, punto.comprobado > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "h-4 w-full text-center text-[10px] leading-none font-medium tabular-nums",
                    etiquetaVisible
                      ? "text-muted-foreground group-hover:text-foreground"
                      : "text-transparent select-none",
                  )}
                  aria-hidden={!etiquetaVisible}
                >
                  {etiquetaEjeDia(punto.fechaIso)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex justify-between px-1 text-[10px] text-muted-foreground sm:text-xs">
        <span>{props.serie[0] ? etiquetaEjeDia(props.serie[0].fechaIso) : ""}</span>
        <span>
          {props.serie[props.serie.length - 1]
            ? etiquetaEjeDia(props.serie[props.serie.length - 1]!.fechaIso)
            : ""}
        </span>
      </div>
    </div>
  )
}

function LeyendaColoresGrafica(): ReactElement {
  return (
    <div
      className="mt-4 flex flex-wrap items-center justify-center gap-5 border-t border-border/50 pt-4 text-xs text-muted-foreground"
      role="list"
      aria-label="Leyenda de colores"
    >
      <span className="flex items-center gap-2" role="listitem">
        <span
          className="h-3 w-3 rounded-sm bg-sky-500 shadow-sm ring-1 ring-sky-600/30"
          aria-hidden
        />
        <span>
          <span className="font-medium text-foreground">Azul</span> — Viáticos
          solicitados (dispersados)
        </span>
      </span>
      <span className="flex items-center gap-2" role="listitem">
        <span
          className="h-3 w-3 rounded-sm bg-emerald-500 shadow-sm ring-1 ring-emerald-600/30"
          aria-hidden
        />
        <span>
          <span className="font-medium text-foreground">Verde</span> — Gastos
          comprobados
        </span>
      </span>
    </div>
  )
}

export function AccountingExpensesAuditCharts({
  serieDiaria,
  animar,
}: AccountingExpensesAuditChartsProps): ReactElement {
  const topeDiario = useMemo(() => maxValorDiario(serieDiaria), [serieDiaria])
  const chartUid = useId().replace(/:/g, "")

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <section
        className={cn(
          "overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-4 shadow-md transition-all duration-500 hover:shadow-xl sm:p-6",
          animar && "animate-travel-panel-in",
        )}
        style={animar ? { animationDelay: "80ms" } : undefined}
      >
        <header className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15">
            <BarChart2 className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Barras por día
            </h3>
            <p className="text-xs text-muted-foreground">
              Montos del día (no acumulados)
            </p>
          </div>
        </header>
        {serieDiaria.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Sin datos en el periodo seleccionado.
          </p>
        ) : (
          <BarrasPorDiaChart serie={serieDiaria} tope={topeDiario} />
        )}
        <LeyendaColoresGrafica />
      </section>

      <section
        className={cn(
          "overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-4 shadow-md transition-all duration-500 hover:shadow-xl sm:p-6",
          animar && "animate-travel-panel-in",
        )}
        style={animar ? { animationDelay: "140ms" } : undefined}
      >
        <header className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15">
            <LineChart className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Tendencia acumulada
            </h3>
            <p className="text-xs text-muted-foreground">
              Suma progresiva de solicitado y comprobado en el periodo
            </p>
          </div>
        </header>
        {serieDiaria.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Sin datos en el periodo seleccionado.
          </p>
        ) : (
          <TendenciaAcumuladaSvg serie={serieDiaria} chartUid={chartUid} />
        )}
        {serieDiaria.length > 0 ? <LeyendaColoresGrafica /> : null}
      </section>
    </div>
  )
}

const MARGEN_SUPERIOR = 10
const MARGEN_INFERIOR = 6

function valorAY(maxValor: number, valor: number): number {
  if (maxValor <= 0) {
    return 100 - MARGEN_INFERIOR
  }
  const ratio = Math.min(1, Math.max(0, valor / maxValor))
  const alturaUtil = 100 - MARGEN_SUPERIOR - MARGEN_INFERIOR
  return 100 - MARGEN_INFERIOR - ratio * alturaUtil
}

function TendenciaAcumuladaSvg(props: {
  serie: readonly AccountingExpensesAuditSerieDia[]
  chartUid: string
}): ReactElement {
  const puntos = props.serie
  let acumSolicitado = 0
  let acumComprobado = 0
  let maxAcumulado = 1

  const coords = puntos.map((p, i) => {
    acumSolicitado += p.solicitado
    acumComprobado += p.comprobado
    maxAcumulado = Math.max(maxAcumulado, acumSolicitado, acumComprobado)
    const x = puntos.length <= 1 ? 50 : (i / (puntos.length - 1)) * 100
    return {
      x,
      ySolicitado: valorAY(maxAcumulado, acumSolicitado),
      yComprobado: valorAY(maxAcumulado, acumComprobado),
      etiqueta: p.etiqueta,
    }
  })

  const pathSolicitado = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.ySolicitado}`)
    .join(" ")
  const pathComprobado = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.yComprobado}`)
    .join(" ")

  const gradSol = `grad-sol-${props.chartUid}`
  const gradComp = `grad-comp-${props.chartUid}`
  const clipId = `clip-chart-${props.chartUid}`

  return (
    <div className="overflow-hidden rounded-xl">
      <div className="relative h-56 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
          role="img"
          aria-label="Gráfica de tendencia acumulada: azul solicitado, verde comprobado"
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                x="0"
                y={MARGEN_SUPERIOR - 2}
                width="100"
                height={100 - MARGEN_SUPERIOR - MARGEN_INFERIOR + 4}
              />
            </clipPath>
            <linearGradient id={gradSol} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(14 165 233)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(14 165 233)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={gradComp} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.08"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <g clipPath={`url(#${clipId})`}>
            <path
              d={`${pathSolicitado} L 100 ${100 - MARGEN_INFERIOR} L 0 ${100 - MARGEN_INFERIOR} Z`}
              fill={`url(#${gradSol})`}
            />
            <path
              d={`${pathComprobado} L 100 ${100 - MARGEN_INFERIOR} L 0 ${100 - MARGEN_INFERIOR} Z`}
              fill={`url(#${gradComp})`}
            />
            <path
              d={pathSolicitado}
              fill="none"
              stroke="rgb(14 165 233)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={pathComprobado}
              fill="none"
              stroke="rgb(16 185 129)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </div>
      <div className="mt-2 flex justify-between px-0.5 text-[10px] text-muted-foreground sm:text-xs">
        <span>{coords[0]?.etiqueta ?? ""}</span>
        <span>{coords[coords.length - 1]?.etiqueta ?? ""}</span>
      </div>
    </div>
  )
}
