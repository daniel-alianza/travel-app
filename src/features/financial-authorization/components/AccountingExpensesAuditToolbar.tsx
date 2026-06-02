import type { ReactElement } from "react"
import { CalendarRange, Filter, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FinancialAuthorizationPillSelect } from "@/features/financial-authorization/components/FinancialAuthorizationPillSelect"
import { ETIQUETAS_ESTADO_SOLICITUD_AUDITORIA } from "@/features/financial-authorization/constants/accounting-expenses-reconciliation-rules"
import type {
  AccountingExpensesAuditCompanyOption,
  AccountingExpensesAuditFiltros,
  AccountingExpensesAuditUserOption,
} from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"

interface AccountingExpensesAuditToolbarProps {
  filtros: AccountingExpensesAuditFiltros
  empresas: readonly AccountingExpensesAuditCompanyOption[]
  usuarios: readonly AccountingExpensesAuditUserOption[]
  rangoFechasInvalido: boolean
  onFechaDesdeChange: (value: string) => void
  onFechaHastaChange: (value: string) => void
  onCompanyChange: (value: string) => void
  onUserChange: (value: string) => void
  onEstadoChange: (value: string) => void
  onRestablecer: () => void
}

const inputFechaClassName =
  "h-11 cursor-pointer rounded-xl border-2 bg-card/80 transition-all duration-300 focus:scale-[1.01] focus:border-primary/40 focus:shadow-lg focus:shadow-primary/10"

export function AccountingExpensesAuditToolbar({
  filtros,
  empresas,
  usuarios,
  rangoFechasInvalido,
  onFechaDesdeChange,
  onFechaHastaChange,
  onCompanyChange,
  onUserChange,
  onEstadoChange,
  onRestablecer,
}: AccountingExpensesAuditToolbarProps): ReactElement {
  const opcionesEmpresa = [
    { value: "all", label: "Todas las empresas" },
    ...empresas.map((e) => ({ value: String(e.id), label: e.nombre })),
  ]
  const opcionesUsuario = [
    { value: "all", label: "Todos los solicitantes" },
    ...usuarios.map((u) => ({
      value: String(u.id),
      label: u.nombre,
    })),
  ]
  const opcionesEstado = [
    { value: "all", label: "Todos los estados" },
    ...(
      Object.entries(ETIQUETAS_ESTADO_SOLICITUD_AUDITORIA) as Array<
        [keyof typeof ETIQUETAS_ESTADO_SOLICITUD_AUDITORIA, string]
      >
    ).map(([clave, etiqueta]) => ({ value: clave, label: etiqueta })),
  ]

  return (
    <section
      className="relative z-30 overflow-visible rounded-3xl border border-border/60 bg-card/50 p-4 shadow-md backdrop-blur-sm transition-shadow duration-500 hover:shadow-lg sm:p-6"
      aria-label="Filtros de auditoría"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Filter className="h-4 w-4 text-primary" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Filtros de auditoría
            </h2>
            <p className="text-xs text-muted-foreground">
              Periodo (mes completo por defecto), empresa, solicitante y estado
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onRestablecer}
          className="h-10 cursor-pointer gap-2 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:bg-primary/5"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Restablecer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <CalendarRange className="h-3.5 w-3.5" aria-hidden />
            Desde
          </Label>
          <Input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => onFechaDesdeChange(e.target.value)}
            className={inputFechaClassName}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <CalendarRange className="h-3.5 w-3.5" aria-hidden />
            Hasta
          </Label>
          <Input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => onFechaHastaChange(e.target.value)}
            className={inputFechaClassName}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Empresa
          </Label>
          <FinancialAuthorizationPillSelect
            value={filtros.companyId}
            placeholder="Empresa"
            options={opcionesEmpresa}
            onChange={onCompanyChange}
            ariaLabel="Filtrar por empresa"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Solicitante
          </Label>
          <FinancialAuthorizationPillSelect
            value={filtros.userId}
            placeholder="Solicitante"
            options={opcionesUsuario}
            onChange={onUserChange}
            ariaLabel="Filtrar por usuario solicitante"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Estado de comprobación
          </Label>
          <FinancialAuthorizationPillSelect
            value={filtros.estadoSolicitud}
            placeholder="Estado"
            options={opcionesEstado}
            onChange={onEstadoChange}
            ariaLabel="Filtrar por estado"
          />
        </div>
      </div>

      {rangoFechasInvalido ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          La fecha inicial no puede ser posterior a la fecha final.
        </p>
      ) : null}
    </section>
  )
}
