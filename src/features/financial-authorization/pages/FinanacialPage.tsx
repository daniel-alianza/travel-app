import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { FinancialAuthorizationDashboard } from "@/features/financial-authorization/components/FinancialAuthorizationDashboard"
import { FinancialAuthorizationReview } from "@/features/financial-authorization/components/FinancialAuthorizationReview"
import { useFinancialAuthorizationPage } from "@/features/financial-authorization/hooks/useFinancialAuthorizationPage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function FinanacialPage() {
  const navigate = useNavigate()
  const { solicitudId } = useParams<{ solicitudId?: string }>()
  const page = useFinancialAuthorizationPage()

  useEffect(() => {
    if (page.cargando) {
      return
    }

    if (solicitudId === undefined) {
      if (page.idSolicitudEnRevision !== null) {
        page.cerrarRevision()
      }
      return
    }

    if (page.idSolicitudEnRevision === solicitudId) {
      return
    }

    const existeSolicitud = page.solicitudes.some(
      (solicitud) => solicitud.id === solicitudId
    )
    if (!existeSolicitud) {
      navigate("/financial-authorization", { replace: true })
      return
    }

    void page.abrirRevisionConFeedback(solicitudId)
  }, [
    solicitudId,
    page.cargando,
    page.idSolicitudEnRevision,
    page.solicitudes,
    page.abrirRevisionConFeedback,
    page.cerrarRevision,
    navigate,
  ])

  const abrirRevisionConRuta = useCallback(
    async (id: string): Promise<void> => {
      navigate(`/financial-authorization/${id}`)
    },
    [navigate]
  )

  const cerrarRevisionConRuta = useCallback((): void => {
    page.cerrarRevision()
    navigate("/financial-authorization")
  }, [page, navigate])

  const pageConRutas = useMemo(
    () => ({
      ...page,
      abrirRevisionConFeedback: abrirRevisionConRuta,
      cerrarRevision: cerrarRevisionConRuta,
    }),
    [page, abrirRevisionConRuta, cerrarRevisionConRuta]
  )

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={pageConRutas.mousePosition} />

      <AppHeader
        mounted={pageConRutas.mounted}
        onBackToHome={() => navigate("/menu-accounting")}
        etiquetaBotonVolver="Volver al menú"
      />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          {pageConRutas.solicitudEnRevision === null ? (
            <FinancialAuthorizationDashboard page={pageConRutas} />
          ) : (
            <FinancialAuthorizationReview page={pageConRutas} />
          )}
        </div>
      </main>

      <AppFooter mounted={pageConRutas.mounted} transitionDelayClass="delay-700" />
    </div>
  )
}
