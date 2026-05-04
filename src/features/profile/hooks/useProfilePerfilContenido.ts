import { useEffect, useMemo, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import { CANDIDATOS_JEFE_DIRECTO } from "@/features/profile/hooks/profile-jefe-directo-candidatos"
import type { PerfilLaboralVista } from "@/features/profile/interfaces/perfil-laboral-vista.interface"
import type { UsuarioCandidatoJefe } from "@/features/profile/interfaces/usuario-candidato-jefe.interface"
import {
  construirPerfilVista,
  inicialesDesdeNombre,
  textoNormalizadoParaBusqueda,
} from "@/features/profile/hooks/profile-perfil-helpers"

interface UseProfilePerfilContenidoReturn {
  cargandoPerfil: boolean
  perfil: PerfilLaboralVista | null
  jefeDirectoActual: string
  modalCambioJefeAbierto: boolean
  setModalCambioJefeAbierto: (abierto: boolean) => void
  busquedaCandidatoJefe: string
  setBusquedaCandidatoJefe: (valor: string) => void
  candidatoJefeSeleccionado: UsuarioCandidatoJefe | null
  setCandidatoJefeSeleccionado: (candidato: UsuarioCandidatoJefe | null) => void
  candidatosJefeFiltrados: ReadonlyArray<UsuarioCandidatoJefe>
  handleCambiarContrasena: () => void
  handleAbrirModalCambioJefe: () => void
  handleConfirmarCambioJefe: () => void
  iniciales: string
}

export function useProfilePerfilContenido(
  nombreSesion: string
): UseProfilePerfilContenidoReturn {
  const [cargandoPerfil, setCargandoPerfil] = useState<boolean>(true)
  const [perfil, setPerfil] = useState<PerfilLaboralVista | null>(null)
  const [jefeDirectoActual, setJefeDirectoActual] = useState<string>("")
  const [modalCambioJefeAbierto, setModalCambioJefeAbierto] =
    useState<boolean>(false)
  const [busquedaCandidatoJefe, setBusquedaCandidatoJefe] = useState<string>("")
  const [candidatoJefeSeleccionado, setCandidatoJefeSeleccionado] =
    useState<UsuarioCandidatoJefe | null>(null)

  useEffect(() => {
    let cancelado = false
    const temporizador = window.setTimeout(() => {
      if (cancelado) {
        return
      }
      const datos = construirPerfilVista(nombreSesion)
      setPerfil(datos)
      setJefeDirectoActual(datos.jefeDirecto)
      setCargandoPerfil(false)
    }, 780)

    return () => {
      cancelado = true
      window.clearTimeout(temporizador)
    }
  }, [nombreSesion])

  const candidatosJefeFiltrados = useMemo(() => {
    const q = textoNormalizadoParaBusqueda(busquedaCandidatoJefe.trim())
    if (q === "") {
      return [...CANDIDATOS_JEFE_DIRECTO]
    }
    return CANDIDATOS_JEFE_DIRECTO.filter((candidato) => {
      const blob = textoNormalizadoParaBusqueda(
        `${candidato.nombreCompleto} ${candidato.correo} ${candidato.area}`
      )
      return blob.includes(q)
    })
  }, [busquedaCandidatoJefe])

  function handleCambiarContrasena(): void {
    showAppToast(
      "El cambio de contraseña estará disponible próximamente.",
      "info"
    )
  }

  function handleAbrirModalCambioJefe(): void {
    const actual = jefeDirectoActual
    const coincide = CANDIDATOS_JEFE_DIRECTO.find(
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
    jefeDirectoActual,
    modalCambioJefeAbierto,
    setModalCambioJefeAbierto,
    busquedaCandidatoJefe,
    setBusquedaCandidatoJefe,
    candidatoJefeSeleccionado,
    setCandidatoJefeSeleccionado,
    candidatosJefeFiltrados,
    handleCambiarContrasena,
    handleAbrirModalCambioJefe,
    handleConfirmarCambioJefe,
    iniciales,
  }
}
