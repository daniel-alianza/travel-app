import type { ReactElement } from "react"

import { AccountingExpensesAuditCharts } from "@/features/financial-authorization/components/AccountingExpensesAuditCharts"
import { AccountingExpensesAuditCompanyCards } from "@/features/financial-authorization/components/AccountingExpensesAuditCompanyCards"
import { AccountingExpensesAuditKpiStrip } from "@/features/financial-authorization/components/AccountingExpensesAuditKpiStrip"
import { AccountingExpensesAuditTable } from "@/features/financial-authorization/components/AccountingExpensesAuditTable"
import { AccountingExpensesAuditToolbar } from "@/features/financial-authorization/components/AccountingExpensesAuditToolbar"
import { AccountingExpensesRulesPanel } from "@/features/financial-authorization/components/AccountingExpensesRulesPanel"
import type { useAccountingExpensesAuditPage } from "@/features/financial-authorization/hooks/useAccountingExpensesAuditPage"

interface AccountingExpensesAuditDashboardProps {
  page: ReturnType<typeof useAccountingExpensesAuditPage>
}

export function AccountingExpensesAuditDashboard({
  page,
}: AccountingExpensesAuditDashboardProps): ReactElement {
  const animar = page.datosListos

  return (
    <div className="space-y-6">
      {page.datosError !== null ? (
        <div
          className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
          role="alert"
        >
          {page.datosError}
        </div>
      ) : null}

      <AccountingExpensesRulesPanel />

      <div className="relative z-30">
        <AccountingExpensesAuditToolbar
          filtros={page.filtros}
          empresas={page.empresas}
          usuarios={page.usuariosFiltradosPorEmpresa}
          rangoFechasInvalido={page.rangoFechasInvalido}
          onFechaDesdeChange={page.setFechaDesde}
          onFechaHastaChange={page.setFechaHasta}
          onCompanyChange={page.setCompanyId}
          onUserChange={page.setUserId}
          onEstadoChange={page.setEstadoSolicitud}
          onRestablecer={page.restablecerFiltros}
        />
      </div>

      <div className="relative z-0 space-y-6">
      <AccountingExpensesAuditKpiStrip resumen={page.resumen} animar={animar} />

      <AccountingExpensesAuditCharts serieDiaria={page.serieDiaria} animar={animar} />

      <AccountingExpensesAuditCompanyCards
        bloques={page.resumenPorEmpresa}
        animar={animar}
      />

      <AccountingExpensesAuditTable filas={page.solicitudes} animar={animar} />
      </div>
    </div>
  )
}
