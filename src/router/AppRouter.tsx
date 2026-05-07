import { Navigate, Route, Routes } from "react-router-dom"

import { LoginPage } from "@/features/auth/pages/LoginPage"
import { HomePage } from "@/features/home/pages/HomePage"
import { CardPage } from "@/features/card-assignment/page/CardPage"
import { DispersionPage } from "@/features/dispersion-travel/pages/DispersionPage"
import { ExpensePage } from "@/features/travel-expenses/pages/ExpensePage"
import { FinanacialPage } from "@/features/financial-authorization/pages/FinanacialPage"
import { MenuAccountingPage } from "@/features/financial-authorization/pages/MenuAccountingPage"
import { ApprovalPage } from "@/features/travel-approval/pages/ApprovalPage"
import { MyTravelRequestsPage } from "@/features/travel-request/pages/MyTravelRequestsPage"
import { RequestPage } from "@/features/travel-request/pages/RequestPage"
import { ProfilePage } from "@/features/profile/pages/ProfilePage"
import { IamPage } from "@/features/iam/pages/IamPage"
import { ProtectedRouter } from "@/router/ProtectedRouter"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRouter />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings/usuarios-permisos" element={<IamPage />} />
        <Route path="/travel-request" element={<RequestPage />} />
        <Route
          path="/travel-request/mis-solicitudes"
          element={<Navigate to="/travel-request/solicitudes" replace />}
        />
        <Route
          path="/travel-request/solicitudes"
          element={<MyTravelRequestsPage />}
        />
        <Route path="/travel-approval" element={<ApprovalPage />} />
        <Route path="/dispersion-travel" element={<DispersionPage />} />
        <Route path="/card-assignment" element={<CardPage />} />
        <Route path="/travel-expenses" element={<ExpensePage />} />
        <Route path="/menu-accounting" element={<MenuAccountingPage />} />
        <Route path="/financial-authorization" element={<FinanacialPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
