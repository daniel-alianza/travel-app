import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { showAppToast } from "@/components/app-toast"
import { useAuthStore } from "@/features/auth/store/authStore"
import {
  filtrarRutasPorPermiso,
  puedeAccederRuta,
} from "@/features/auth/utils/auth-route-access"
import {
  GASOLINA_MENU_OPTION_ID,
  HOME_FUEL_MODULE_OPTIONS,
} from "@/features/home/constants/home-fuel-module-options"
import { HOME_MENU_OPTIONS } from "@/features/home/constants/home-menu-options"
import type { HomeFuelModuleOption } from "@/features/home/interfaces/home-fuel-module-option.interface"
import type { HomeMenuOption } from "../interfaces/home-menu-option.interface"
import type { HomeMousePosition } from "../interfaces/home-mouse-position.interface"

interface UseHomePageReturn {
  mounted: boolean
  hoveredCard: number | null
  mousePosition: HomeMousePosition
  menuOptions: HomeMenuOption[]
  opcionesGasolina: HomeFuelModuleOption[]
  modalGasolinaAbierto: boolean
  setModalGasolinaAbierto: (abierto: boolean) => void
  handleMenuOptionSelect: (option: HomeMenuOption) => void
  handleFuelModuleOptionSelect: (opcion: HomeFuelModuleOption) => void
  handleCardEnter: (id: number) => void
  handleCardLeave: () => void
}

export function useHomePage(): UseHomePageReturn {
  const navigate = useNavigate()
  const permisosSesion = useAuthStore((state) => state.permisosSesion ?? [])
  const rolSesion = useAuthStore((state) => state.rolSesion ?? "")
  const mounted = true
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [modalGasolinaAbierto, setModalGasolinaAbierto] = useState(false)
  const [mousePosition, setMousePosition] = useState<HomeMousePosition>({
    x: 0,
    y: 0,
  })

  const opcionesGasolina = useMemo(() => {
    return HOME_FUEL_MODULE_OPTIONS.filter((opcion) => {
      if (opcion.href === null || opcion.href.length === 0) {
        return false
      }
      return puedeAccederRuta(opcion.href, permisosSesion, rolSesion)
    })
  }, [permisosSesion, rolSesion])

  const menuOptions = useMemo(() => {
    const conRuta = filtrarRutasPorPermiso(
      HOME_MENU_OPTIONS,
      permisosSesion,
      rolSesion,
    )
    if (opcionesGasolina.length === 0) {
      return conRuta
    }
    const gasolina = HOME_MENU_OPTIONS.find(
      (opcion) => opcion.id === GASOLINA_MENU_OPTION_ID,
    )
    if (gasolina === undefined) {
      return conRuta
    }
    return [...conRuta, gasolina]
  }, [permisosSesion, rolSesion, opcionesGasolina.length])

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  function handleMenuOptionSelect(option: HomeMenuOption): void {
    if (option.id === GASOLINA_MENU_OPTION_ID) {
      if (opcionesGasolina.length === 0) {
        showAppToast("No tienes permisos para el módulo de gasolina.", "error")
        return
      }
      setModalGasolinaAbierto(true)
      return
    }
    if (option.href !== "#") {
      navigate(option.href)
      return
    }
    showAppToast("Este módulo estará disponible próximamente.", "info")
  }

  function handleFuelModuleOptionSelect(opcion: HomeFuelModuleOption): void {
    setModalGasolinaAbierto(false)
    if (opcion.href) {
      navigate(opcion.href)
      return
    }
    showAppToast("Este módulo estará disponible próximamente.", "info")
  }

  function handleCardEnter(id: number): void {
    setHoveredCard(id)
  }

  function handleCardLeave(): void {
    setHoveredCard(null)
  }

  return {
    mounted,
    hoveredCard,
    mousePosition,
    menuOptions,
    opcionesGasolina,
    modalGasolinaAbierto,
    setModalGasolinaAbierto,
    handleMenuOptionSelect,
    handleFuelModuleOptionSelect,
    handleCardEnter,
    handleCardLeave,
  }
}
