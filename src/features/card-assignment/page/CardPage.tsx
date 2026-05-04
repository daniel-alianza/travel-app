import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { ListPaginationBar } from "@/components/list-pagination-bar"
import { CardAssignmentPageHeader } from "@/features/card-assignment/components/CardAssignmentPageHeader"
import { CardAssignmentToolbar } from "@/features/card-assignment/components/CardAssignmentToolbar"
import { CardAssignmentModal } from "@/features/card-assignment/components/CardAssignmentModal"
import { CardAssignmentUserList } from "@/features/card-assignment/components/CardAssignmentUserList"
import { useCardAssignmentPage } from "@/features/card-assignment/hooks/useCardAssignmentPage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function CardPage() {
  const navigate = useNavigate()
  const page = useCardAssignmentPage()

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="w-full px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <CardAssignmentPageHeader />

          <CardAssignmentToolbar
            textoBusqueda={page.textoBusqueda}
            onTextoBusquedaChange={page.setTextoBusqueda}
            filtroCompania={page.filtroCompania}
            onFiltroCompaniaChange={page.setFiltroCompania}
            filtroArea={page.filtroArea}
            onFiltroAreaChange={page.setFiltroArea}
            opcionesCompania={page.opcionesCompania}
            opcionesArea={page.opcionesArea}
            dropdownPillAbierto={page.dropdownPillAbierto}
            setDropdownPillAbierto={page.setDropdownPillAbierto}
            deshabilitado={page.usuariosCarga}
            actualizandoLista={page.actualizandoLista}
            onRefrescar={page.onRefrescar}
          />

          <CardAssignmentUserList
            usuarios={page.usuariosFiltrados}
            usuariosCarga={page.usuariosCarga}
            usuariosError={page.usuariosError}
            listaVaciaPorFiltros={page.listaVaciaPorFiltros}
            usuarioEnAccion={page.usuarioEnAccion}
            onAbrirModalAsignacion={page.abrirModalAsignacion}
            desactivacionEnCurso={page.desactivacionEnCurso}
            onDesactivarTarjeta={page.onDesactivarTarjeta}
            onReintentar={page.onRefrescar}
          />

          {!page.usuariosCarga &&
            !page.usuariosError &&
            !page.listaVaciaPorFiltros &&
            page.totalResultados > 0 && (
              <ListPaginationBar
                className="mt-6"
                pagina={page.pagina}
                totalPaginas={page.totalPaginas}
                totalElementos={page.totalResultados}
                tamanoPagina={page.tamanoPagina}
                deshabilitado={page.actualizandoLista}
                etiquetaElemento="colaboradores"
                onPaginaAnterior={page.onPaginaAnterior}
                onPaginaSiguiente={page.onPaginaSiguiente}
                onCambiarTamanoPagina={page.onCambiarTamanoPagina}
                opcionesTamanoPagina={page.opcionesTamanoPagina}
              />
            )}
        </div>
      </main>

      <CardAssignmentModal
        usuario={page.usuarioModalAsignacion}
        accionCargando={page.asignacionModalCargando}
        onCerrar={page.cerrarModalAsignacion}
        onConfirmar={page.confirmarAsignacionDesdeModal}
      />

      <AppFooter mounted transitionDelayClass="delay-700" />
    </div>
  )
}
