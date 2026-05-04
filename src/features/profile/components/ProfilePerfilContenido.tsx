import { ProfileCambioJefeDirectoModal } from "./ProfileCambioJefeDirectoModal"
import { ProfilePerfilHeroSection } from "./ProfilePerfilHeroSection"
import { ProfilePerfilLaboralCards } from "./ProfilePerfilLaboralCards"
import { ProfilePerfilSeguridadSection } from "./ProfilePerfilSeguridadSection"
import { ProfilePerfilSkeleton } from "./ProfilePerfilSkeleton"
import { useProfilePerfilContenido } from "@/features/profile/hooks/useProfilePerfilContenido"

type ProfilePerfilContenidoProps = {
  nombreSesion: string
}

export function ProfilePerfilContenido({
  nombreSesion,
}: ProfilePerfilContenidoProps) {
  const perfilState = useProfilePerfilContenido(nombreSesion)

  if (perfilState.cargandoPerfil) {
    return <ProfilePerfilSkeleton />
  }

  if (perfilState.perfil === null) {
    return (
      <p className="text-sm text-muted-foreground">
        No se pudo cargar el perfil. Vuelve a iniciar sesión.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <ProfilePerfilHeroSection
        perfil={perfilState.perfil}
        iniciales={perfilState.iniciales}
      />

      <ProfilePerfilLaboralCards
        perfil={perfilState.perfil}
        jefeDirectoActual={perfilState.jefeDirectoActual}
        onSolicitarCambioJefe={perfilState.handleAbrirModalCambioJefe}
      />

      <ProfilePerfilSeguridadSection
        onCambiarContrasena={perfilState.handleCambiarContrasena}
      />

      <ProfileCambioJefeDirectoModal
        abierto={perfilState.modalCambioJefeAbierto}
        onAbiertoChange={perfilState.setModalCambioJefeAbierto}
        busquedaCandidatoJefe={perfilState.busquedaCandidatoJefe}
        onBusquedaCandidatoJefeChange={perfilState.setBusquedaCandidatoJefe}
        candidatosJefeFiltrados={perfilState.candidatosJefeFiltrados}
        candidatoJefeSeleccionado={perfilState.candidatoJefeSeleccionado}
        onSeleccionarCandidato={perfilState.setCandidatoJefeSeleccionado}
        onConfirmarSeleccion={perfilState.handleConfirmarCambioJefe}
      />
    </div>
  )
}
