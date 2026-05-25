import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { DispersionPageHeader } from "@/features/dispersion-travel/components/DispersionPageHeader"
import { DispersionRegistrySection } from "@/features/dispersion-travel/components/DispersionRegistrySection"
import { DispersionRejectModal } from "@/features/dispersion-travel/components/DispersionRejectModal"
import { DispersionReportSection } from "@/features/dispersion-travel/components/DispersionReportSection"
import { useDispersionPage } from "@/features/dispersion-travel/hooks/useDispersionPage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function DispersionPage() {
  const navigate = useNavigate()
  const page = useDispersionPage()

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="w-full px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <DispersionPageHeader />

          <DispersionReportSection
            fechaReporteDesde={page.fechaReporteDesde}
            fechaReporteHasta={page.fechaReporteHasta}
            ocupado={page.ocupado}
            accionCargandoReporte={page.accionCargando === "reporte"}
            onFechaDesdeChange={page.setFechaReporteDesde}
            onFechaHastaChange={page.setFechaReporteHasta}
            onLimpiarFiltros={page.limpiarFiltrosFechasReporte}
            onGenerarReporte={() => void page.generarReporteDispersionExcel()}
          />

          <DispersionRegistrySection
            cargaInicial={page.cargaInicialDispersion}
            filas={page.filas}
            totalFilasRegistro={page.totalFilasRegistro}
            pagina={page.pagina}
            totalPaginas={page.totalPaginas}
            tamanoPagina={page.tamanoPagina}
            opcionesTamanoPagina={page.opcionesTamanoPagina}
            onPaginaAnterior={page.onPaginaAnterior}
            onPaginaSiguiente={page.onPaginaSiguiente}
            onCambiarTamanoPagina={page.onCambiarTamanoPagina}
            seleccionEfectiva={page.seleccionEfectiva}
            cantidadSeleccionadas={page.cantidadSeleccionadas}
            todasSeleccionadas={page.todasSeleccionadas}
            ocupado={page.ocupado}
            accionCargando={page.accionCargando}
            dropdownPillAbierto={page.dropdownPillAbierto}
            setDropdownPillAbierto={page.setDropdownPillAbierto}
            selectAllRef={page.selectAllRef}
            onSeleccionarPaginaActual={page.seleccionarPaginaActual}
            onQuitarSeleccion={page.quitarSeleccion}
            onAplicarAjustesMontos={() => void page.aplicarAjustesMontos()}
            onDispersarSeleccionadas={() =>
              void page.dispersarPorIds([...page.seleccionEfectiva])
            }
            onRechazarSeleccionadas={() =>
              page.abrirModalRechazo([...page.seleccionEfectiva])
            }
            alternarSeleccionarTodas={page.alternarSeleccionarTodas}
            alternarSeleccion={page.alternarSeleccion}
            actualizarFila={page.actualizarFila}
            convertirAbsolutoADeltaEnFila={page.convertirAbsolutoADeltaEnFila}
            dispersarPorIds={page.dispersarPorIds}
            abrirModalRechazo={page.abrirModalRechazo}
          />
        </div>
      </main>

      <AppFooter mounted transitionDelayClass="delay-700" />

      {page.rechazoIdsPendientes !== null && (
        <DispersionRejectModal
          comentarioRechazo={page.comentarioRechazo}
          puedeConfirmarRechazo={page.puedeConfirmarRechazo}
          accionCargandoRechazoModal={page.accionCargando === "rechazo-modal"}
          onComentarioChange={page.setComentarioRechazo}
          onCerrar={page.cerrarModalRechazo}
          onConfirmar={() => void page.confirmarRechazoConComentario()}
        />
      )}
    </div>
  )
}
