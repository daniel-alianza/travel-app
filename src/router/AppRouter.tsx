import { Navigate, Route, Routes } from "react-router-dom"

import { LoginPage } from "@/features/auth/pages/LoginPage"
import { HomePage } from "@/features/home/pages/HomePage"
import { CardPage } from "@/features/card-assignment/page/CardPage"
import { DispersionPage } from "@/features/dispersion-travel/pages/DispersionPage"
import { ExpensePage } from "@/features/travel-expenses/pages/ExpensePage"
import { FinanacialPage } from "@/features/financial-authorization/pages/FinanacialPage"
import { AccountingExpensesSummaryPage } from "@/features/financial-authorization/pages/AccountingExpensesSummaryPage"
import { MenuAccountingPage } from "@/features/financial-authorization/pages/MenuAccountingPage"
import { TravelReconciliationPage } from "@/features/financial-authorization/pages/TravelReconciliationPage"
import { ApprovalPage } from "@/features/travel-approval/pages/ApprovalPage"
import { MyTravelRequestsPage } from "@/features/travel-request/pages/MyTravelRequestsPage"
import { RequestPage } from "@/features/travel-request/pages/RequestPage"
import { ProfilePage } from "@/features/profile/pages/ProfilePage"
import { IamPage } from "@/features/iam/pages/IamPage"
import { GasolineAuthorizationsPage } from "@/features/gasoline/pages/GasolineAuthorizationsPage"
import { GasolineDispersionPage } from "@/features/gasoline/pages/GasolineDispersionPage"
import { GasolinePerformancePage } from "@/features/gasoline/pages/GasolinePerformancePage"
import { GasolineReportPage } from "@/features/gasoline/pages/GasolineReportPage"
import { GasolineRequestPage } from "@/features/gasoline/pages/GasolineRequestPage"
import { CarReservationPage } from "@/features/car-reservation/pages/CarReservationPage"
import { PermissionOutlet } from "@/router/PermissionOutlet"
import { ProtectedRouter } from "@/router/ProtectedRouter"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRouter />}>
        <Route element={<PermissionOutlet />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/settings/usuarios-permisos"
          element={<Navigate to="/settings/users-permissions" replace />}
        />
        <Route path="/settings/users-permissions" element={<IamPage />} />
        <Route path="/gasoline/request" element={<GasolineRequestPage />} />
        <Route
          path="/gasoline/authorizations"
          element={<GasolineAuthorizationsPage />}
        />
        <Route
          path="/gasoline/dispersion"
          element={<GasolineDispersionPage />}
        />
        <Route path="/gasoline/report" element={<GasolineReportPage />} />
        <Route
          path="/gasoline/performance"
          element={<GasolinePerformancePage />}
        />
        <Route path="/car-reservation" element={<CarReservationPage />} />
        <Route path="/travel-request" element={<RequestPage />} />
        <Route
          path="/travel-request/mis-solicitudes"
          element={<Navigate to="/travel-request/requests" replace />}
        />
        <Route
          path="/travel-request/solicitudes"
          element={<Navigate to="/travel-request/requests" replace />}
        />
        <Route path="/travel-request/requests" element={<MyTravelRequestsPage />} />
        <Route path="/travel-approval" element={<ApprovalPage />} />
        <Route path="/dispersion-travel" element={<DispersionPage />} />
        <Route path="/card-assignment" element={<CardPage />} />
        <Route path="/travel-expenses" element={<ExpensePage />} />
        <Route path="/menu-accounting" element={<MenuAccountingPage />} />
        <Route
          path="/menu-accounting/expenses-summary"
          element={<AccountingExpensesSummaryPage />}
        />
        <Route
          path="/menu-accounting/reconciliation-checks"
          element={<TravelReconciliationPage />}
        />
        <Route
          path="/menu-accounting/conciliaciones-comprobaciones"
          element={<Navigate to="/menu-accounting/reconciliation-checks" replace />}
        />
        <Route path="/financial-authorization" element={<FinanacialPage />} />
        <Route path="/financial-authorization/:requestId" element={<FinanacialPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
