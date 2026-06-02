import type { ReactElement } from "react"
import {
  ClipboardList,
  Percent,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"

import { formatearMonto } from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import type { AccountingExpensesAuditResumenFiltrado } from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"
import { cn } from "@/lib/utils"

interface AccountingExpensesAuditKpiStripProps {
  resumen: AccountingExpensesAuditResumenFiltrado
  animar: boolean
}

function KpiCard(props: {
  titulo: string
  valor: string
  subtitulo: string
  icon: ReactElement
  accent: string
  delayMs: number
  animar: boolean
}): ReactElement {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:p-5",
        props.animar && "animate-travel-panel-in",
      )}
      style={props.animar ? { animationDelay: `${props.delayMs}ms` } : undefined}
    >
      <div
        className={cn(
          "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.12] blur-2xl transition-opacity duration-500 group-hover:opacity-25",
          props.accent,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {props.titulo}
          </p>
          <p className="mt-1 truncate text-xl font-bold tabular-nums text-foreground sm:text-2xl">
            {props.valor}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{props.subtitulo}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
            props.accent,
          )}
        >
          {props.icon}
        </div>
      </div>
    </div>
  )
}

export function AccountingExpensesAuditKpiStrip({
  resumen,
  animar,
}: AccountingExpensesAuditKpiStripProps): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <KpiCard
        titulo="Solicitado"
        valor={formatearMonto(resumen.totalSolicitado)}
        subtitulo="Viáticos dispersados"
        icon={<Wallet className="h-5 w-5" aria-hidden />}
        accent="bg-gradient-to-br from-sky-500 to-cyan-600"
        delayMs={0}
        animar={animar}
      />
      <KpiCard
        titulo="Comprobado"
        valor={formatearMonto(resumen.totalComprobado)}
        subtitulo="Movimientos registrados"
        icon={<TrendingUp className="h-5 w-5" aria-hidden />}
        accent="bg-gradient-to-br from-emerald-500 to-teal-600"
        delayMs={60}
        animar={animar}
      />
      <KpiCard
        titulo="Pendiente"
        valor={formatearMonto(resumen.pendientePorComprobar)}
        subtitulo="Por comprobar"
        icon={<TrendingDown className="h-5 w-5" aria-hidden />}
        accent="bg-gradient-to-br from-amber-500 to-orange-500"
        delayMs={120}
        animar={animar}
      />
      <KpiCard
        titulo="Avance"
        valor={`${resumen.porcentajeComprobado.toFixed(1)}%`}
        subtitulo="Comprobado / solicitado"
        icon={<Percent className="h-5 w-5" aria-hidden />}
        accent="bg-gradient-to-br from-violet-500 to-purple-600"
        delayMs={180}
        animar={animar}
      />
      <KpiCard
        titulo="Solicitudes"
        valor={String(resumen.totalSolicitudes)}
        subtitulo="En el periodo"
        icon={<ClipboardList className="h-5 w-5" aria-hidden />}
        accent="bg-gradient-to-br from-slate-600 to-slate-800"
        delayMs={240}
        animar={animar}
      />
      <KpiCard
        titulo="Solicitantes"
        valor={String(resumen.usuariosUnicos)}
        subtitulo="Usuarios únicos"
        icon={<Users className="h-5 w-5" aria-hidden />}
        accent="bg-gradient-to-br from-rose-500 to-pink-600"
        delayMs={300}
        animar={animar}
      />
    </div>
  )
}
