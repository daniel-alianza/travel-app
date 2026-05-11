import { ProfileCambioContrasenaModal } from "./ProfileCambioContrasenaModal"
import { ProfileCambioJefeDirectoModal } from "./ProfileCambioJefeDirectoModal"
import { ProfilePerfilHeroSection } from "./ProfilePerfilHeroSection"
import { ProfilePerfilLaboralCards } from "./ProfilePerfilLaboralCards"
import { ProfilePerfilSeguridadSection } from "./ProfilePerfilSeguridadSection"
import { ProfilePerfilSkeleton } from "./ProfilePerfilSkeleton"
import { useProfilePerfilContenido } from "@/features/profile/hooks/useProfilePerfilContenido"

export function ProfilePerfilContenido() {
  const perfilState = useProfilePerfilContenido()

  if (perfilState.cargandoPerfil) {
    return <ProfilePerfilSkeleton />
  }

  if (perfilState.perfil === null) {
    return (
      <p className="text-sm text-muted-foreground">
        {perfilState.errorCargaPerfil
          ? "No se pudo cargar el perfil desde el servidor. Comprueba tu conexión o vuelve a iniciar sesión."
          : "No se pudo cargar el perfil. Vuelve a iniciar sesión."}
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
        etiquetaBotonJefeDirecto={perfilState.textoBotonJefeDirecto}
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
        candidatosCargando={perfilState.cargandoCandidatosJefe}
        candidatosError={perfilState.errorCandidatosJefe}
        candidatoJefeSeleccionado={perfilState.candidatoJefeSeleccionado}
        onSeleccionarCandidato={perfilState.setCandidatoJefeSeleccionado}
        onConfirmarSeleccion={perfilState.handleConfirmarCambioJefe}
      />

      <ProfileCambioContrasenaModal
        abierto={perfilState.modalContrasenaAbierto}
        onAbiertoChange={perfilState.setModalContrasenaAbierto}
        enviando={perfilState.enviandoCambioContrasena}
        onConfirmar={perfilState.handleConfirmarCambioContrasena}
      />
    </div>
  )
}
