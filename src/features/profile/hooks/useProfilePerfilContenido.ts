import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useEffect, useMemo, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import { useAuthStore } from "@/features/auth/store/authStore"
import type { PerfilLaboralVista } from "@/features/profile/interfaces/perfil-laboral-vista.interface"
import type { UsuarioCandidatoJefe } from "@/features/profile/interfaces/usuario-candidato-jefe.interface"
import type { CambioContrasenaPerfilFormValues } from "@/features/profile/schemas/cambio-contrasena-perfil.schema"
import {
  fetchCurrentUserProfile,
  fetchManagerCandidates,
  postCambioContrasenaPerfil,
} from "@/features/profile/services/profile-travel-api"
import {
  inicialesDesdeNombre,
  textoNormalizadoParaBusqueda,
} from "@/features/profile/hooks/profile-perfil-helpers"

type ApiErrorBody = {
  message?: string
}

function mensajeDesdeErrorAxios(error: unknown): string {
  if (error instanceof AxiosError) {
    const cuerpo = error.response?.data as ApiErrorBody | undefined
    if (
      typeof cuerpo?.message === "string" &&
      cuerpo.message.trim().length > 0
    ) {
      return cuerpo.message
    }
  }
  return "No se pudo completar la acción. Intenta de nuevo."
}

interface UseProfilePerfilContenidoReturn {
  cargandoPerfil: boolean
  perfil: PerfilLaboralVista | null
  errorCargaPerfil: boolean
  jefeDirectoActual: string
  textoBotonJefeDirecto: string
  modalCambioJefeAbierto: boolean
  setModalCambioJefeAbierto: (abierto: boolean) => void
  modalContrasenaAbierto: boolean
  setModalContrasenaAbierto: (abierto: boolean) => void
  busquedaCandidatoJefe: string
  setBusquedaCandidatoJefe: (valor: string) => void
  candidatoJefeSeleccionado: UsuarioCandidatoJefe | null
  setCandidatoJefeSeleccionado: (candidato: UsuarioCandidatoJefe | null) => void
  candidatosJefeFiltrados: ReadonlyArray<UsuarioCandidatoJefe>
  cargandoCandidatosJefe: boolean
  errorCandidatosJefe: boolean
  handleCambiarContrasena: () => void
  handleConfirmarCambioContrasena: (
    valores: CambioContrasenaPerfilFormValues
  ) => Promise<void>
  enviandoCambioContrasena: boolean
  handleAbrirModalCambioJefe: () => void
  handleConfirmarCambioJefe: () => void
  iniciales: string
}

export function useProfilePerfilContenido(): UseProfilePerfilContenidoReturn {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const perfilQuery = useQuery({
    queryKey: ["auth", "profile", "me"],
    queryFn: fetchCurrentUserProfile,
    enabled: isAuthenticated,
  })

  const candidatosJefeQuery = useQuery({
    queryKey: ["auth", "manager-candidates"],
    queryFn: fetchManagerCandidates,
    enabled: isAuthenticated && perfilQuery.isSuccess,
  })

  const cambioContrasenaMutation = useMutation({
    mutationFn: postCambioContrasenaPerfil,
  })

  const perfil = perfilQuery.data ?? null
  const cargandoPerfil = isAuthenticated && perfilQuery.isLoading
  const errorCargaPerfil = perfilQuery.isError

  const candidatosJefeLista = candidatosJefeQuery.data ?? []
  const cargandoCandidatosJefe = candidatosJefeQuery.isLoading
  const errorCandidatosJefe = candidatosJefeQuery.isError

  const textoBotonJefeDirecto =
    perfil !== null && perfil.tieneJefeDirectoAsignado
      ? "Solicitar cambio de jefe directo"
      : "Escoger uno"

  const [jefeDirectoActual, setJefeDirectoActual] = useState<string>("")
  const [modalCambioJefeAbierto, setModalCambioJefeAbierto] =
    useState<boolean>(false)
  const [modalContrasenaAbierto, setModalContrasenaAbierto] =
    useState<boolean>(false)
  const [busquedaCandidatoJefe, setBusquedaCandidatoJefe] = useState<string>("")
  const [candidatoJefeSeleccionado, setCandidatoJefeSeleccionado] =
    useState<UsuarioCandidatoJefe | null>(null)

  useEffect(() => {
    if (perfil !== null) {
      setJefeDirectoActual(perfil.jefeDirecto)
    }
  }, [perfil])

  const candidatosJefeFiltrados = useMemo(() => {
    const q = textoNormalizadoParaBusqueda(busquedaCandidatoJefe.trim())
    if (q === "") {
      return [...candidatosJefeLista]
    }
    return candidatosJefeLista.filter((candidato) => {
      const blob = textoNormalizadoParaBusqueda(
        `${candidato.nombreCompleto} ${candidato.correo} ${candidato.area}`
      )
      return blob.includes(q)
    })
  }, [busquedaCandidatoJefe, candidatosJefeLista])

  function handleCambiarContrasena(): void {
    setModalContrasenaAbierto(true)
  }

  async function handleConfirmarCambioContrasena(
    valores: CambioContrasenaPerfilFormValues
  ): Promise<void> {
    try {
      await cambioContrasenaMutation.mutateAsync({
        currentPassword: valores.contrasenaActual,
        newPassword: valores.contrasenaNueva,
      })
      showAppToast("Contraseña actualizada correctamente.", "success")
      setModalContrasenaAbierto(false)
    } catch (error) {
      showAppToast(mensajeDesdeErrorAxios(error), "error")
    }
  }

  function handleAbrirModalCambioJefe(): void {
    const actual = jefeDirectoActual
    const coincide = candidatosJefeLista.find(
      (c) => c.nombreCompleto === actual
    )
    setCandidatoJefeSeleccionado(coincide ?? null)
    setBusquedaCandidatoJefe("")
    setModalCambioJefeAbierto(true)
  }

  function handleConfirmarCambioJefe(): void {
    if (candidatoJefeSeleccionado === null) {
      showAppToast("Selecciona un responsable de la lista.", "info")
      return
    }
    setJefeDirectoActual(candidatoJefeSeleccionado.nombreCompleto)
    setModalCambioJefeAbierto(false)
    setBusquedaCandidatoJefe("")
    showAppToast(
      "Solicitud registrada. Tu área de capital humano validará el cambio.",
      "success"
    )
  }

  const iniciales = perfil ? inicialesDesdeNombre(perfil.nombreCompleto) : "··"

  return {
    cargandoPerfil,
    perfil,
    errorCargaPerfil,
    jefeDirectoActual,
    textoBotonJefeDirecto,
    modalCambioJefeAbierto,
    setModalCambioJefeAbierto,
    modalContrasenaAbierto,
    setModalContrasenaAbierto,
    busquedaCandidatoJefe,
    setBusquedaCandidatoJefe,
    candidatoJefeSeleccionado,
    setCandidatoJefeSeleccionado,
    candidatosJefeFiltrados,
    cargandoCandidatosJefe,
    errorCandidatosJefe,
    handleCambiarContrasena,
    handleConfirmarCambioContrasena,
    enviandoCambioContrasena: cambioContrasenaMutation.isPending,
    handleAbrirModalCambioJefe,
    handleConfirmarCambioJefe,
    iniciales,
  }
}
