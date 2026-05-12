import { Navigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { ListPaginationBar } from "@/components/list-pagination-bar"
import { IamPageHeader } from "@/features/iam/components/IamPageHeader"
import { IamSearchFilters } from "@/features/iam/components/IamSearchFilters"
import { IamUsersEmptyState } from "@/features/iam/components/IamUsersEmptyState"
import { IamUsersErrorState } from "@/features/iam/components/IamUsersErrorState"
import { IamUsersLoadingSkeleton } from "@/features/iam/components/IamUsersLoadingSkeleton"
import { IamUsuarioCard } from "@/features/iam/components/IamUsuarioCard"
import { ROL_SUPER_ADMINISTRADOR } from "@/features/auth/constants/auth-roles"
import { PERMISO_IAM_USUARIOS } from "@/features/auth/constants/auth-permissions"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useIamPage } from "@/features/iam/hooks/useIamPage"
import { OPCIONES_TAMANO_PAGINA } from "@/features/iam/interfaces/iam-constants"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function IamPage() {
  const p = useIamPage()
  const rolSesion = useAuthStore((state) => state.rolSesion ?? "")
  const permisosSesion = useAuthStore((state) => state.permisosSesion ?? [])
  const puedeAccederIam =
    rolSesion === ROL_SUPER_ADMINISTRADOR ||
    permisosSesion.includes(PERMISO_IAM_USUARIOS)

  if (!puedeAccederIam) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={p.mousePosition} />

      <AppHeader mounted={p.mounted} onBackToHome={p.onBackToHome} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <IamPageHeader
            cargandoInicial={p.cargandoInicial}
            actualizandoLista={p.actualizandoLista}
            onActualizarLista={() => {
              void p.cargarUsuarios(true)
            }}
          />

          <IamSearchFilters
            textoBusqueda={p.textoBusqueda}
            setTextoBusqueda={p.setTextoBusqueda}
            cargandoInicial={p.cargandoInicial}
            actualizandoLista={p.actualizandoLista}
            filtroArea={p.filtroArea}
            setFiltroArea={p.setFiltroArea}
            opcionesArea={p.opcionesArea}
            filtroSucursal={p.filtroSucursal}
            setFiltroSucursal={p.setFiltroSucursal}
            opcionesSucursal={p.opcionesSucursal}
            filtroRol={p.filtroRol}
            setFiltroRol={p.setFiltroRol}
            opcionesRol={p.opcionesRol}
            dropdownPillAbierto={p.dropdownPillAbierto}
            setDropdownPillAbierto={p.setDropdownPillAbierto}
          />

          {p.cargandoInicial ? (
            <IamUsersLoadingSkeleton tamanoPagina={p.tamanoPagina} />
          ) : null}

          {p.errorCarga !== null && !p.cargandoInicial ? (
            <IamUsersErrorState
              mensaje={p.errorCarga}
              onReintentar={() => {
                void p.cargarUsuarios(false)
              }}
            />
          ) : null}

          {!p.cargandoInicial && p.errorCarga === null && p.listaVacia ? (
            <IamUsersEmptyState
              onLimpiarFiltros={() => {
                p.setTextoBusqueda("")
                p.setFiltroArea("")
                p.setFiltroSucursal("")
                p.setFiltroRol("")
              }}
            />
          ) : null}

          {!p.cargandoInicial && p.errorCarga === null && !p.listaVacia ? (
            <div className="relative z-0 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {p.usuariosPagina.map((usuario, index) => (
                <IamUsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  index={index}
                  candidatosJefeDirecto={p.candidatosJefeDirecto}
                  dropdownPillAbierto={p.dropdownPillAbierto}
                  setDropdownPillAbierto={p.setDropdownPillAbierto}
                  guardandoId={p.guardandoId}
                  actualizandoContrasenaId={p.actualizandoContrasenaId}
                  actualizandoLista={p.actualizandoLista}
                  obtenerCamposContrasena={p.obtenerCamposContrasena}
                  establecerCamposContrasena={p.establecerCamposContrasena}
                  actualizarUsuario={p.actualizarUsuario}
                  alternarPermiso={p.alternarPermiso}
                  aplicarActualizacionContrasena={p.aplicarActualizacionContrasena}
                  guardarUsuario={p.guardarUsuario}
                />
              ))}
            </div>
          ) : null}

          {!p.cargandoInicial &&
          p.errorCarga === null &&
          !p.listaVacia &&
          p.metaLista.total > 0 ? (
            <ListPaginationBar
              className="mt-8"
              pagina={p.metaLista.page}
              totalPaginas={p.metaLista.totalPages}
              totalElementos={p.metaLista.total}
              tamanoPagina={p.metaLista.pageSize}
              deshabilitado={p.actualizandoLista}
              etiquetaElemento="usuarios"
              onPaginaAnterior={() => {
                p.setPagina((prev) => Math.max(1, prev - 1))
              }}
              onPaginaSiguiente={() => {
                p.setPagina((prev) =>
                  Math.min(p.metaLista.totalPages, prev + 1),
                )
              }}
              onCambiarTamanoPagina={(n) => {
                p.setTamanoPagina(n)
              }}
              opcionesTamanoPagina={OPCIONES_TAMANO_PAGINA}
            />
          ) : null}
        </div>
      </main>

      <AppFooter mounted={p.mounted} transitionDelayClass="delay-700" />
    </div>
  )
}
