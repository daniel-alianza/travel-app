import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Banknote,
  ClipboardCheck,
  CreditCard,
  FilePlus,
  FileText,
  Fuel,
  Receipt,
} from "lucide-react"

import type { HomeMenuOption } from "../interfaces/home-menu-option.interface"
import type { HomeMousePosition } from "../interfaces/home-mouse-position.interface"

interface UseHomePageReturn {
  mounted: boolean
  hoveredCard: number | null
  mousePosition: HomeMousePosition
  menuOptions: HomeMenuOption[]
  handleMenuNavigate: (href: string) => void
  handleCardEnter: (id: number) => void
  handleCardLeave: () => void
}

const menuOptions: HomeMenuOption[] = [
  {
    id: 1,
    title: "Crear Solicitud",
    description: "Genera una nueva solicitud de viáticos",
    icon: FilePlus,
    color: "from-blue-500 to-blue-600",
    shadowColor: "shadow-blue-500/25",
    delay: 100,
    href: "/travel-request",
  },
  {
    id: 2,
    title: "Solicitudes de Viáticos",
    description: "Consulta el estado de tus solicitudes",
    icon: FileText,
    color: "from-emerald-500 to-emerald-600",
    shadowColor: "shadow-emerald-500/25",
    delay: 150,
    href: "/travel-approval",
  },
  {
    id: 3,
    title: "Dispersión de Viáticos",
    description: "Gestiona la distribución de fondos",
    icon: Banknote,
    color: "from-amber-500 to-amber-600",
    shadowColor: "shadow-amber-500/25",
    delay: 200,
    href: "/dispersion-travel",
  },
  {
    id: 4,
    title: "Autorización Contable",
    description: "Aprueba movimientos contables",
    icon: ClipboardCheck,
    color: "from-violet-500 to-violet-600",
    shadowColor: "shadow-violet-500/25",
    delay: 250,
    href: "/menu-accounting",
  },
  {
    id: 5,
    title: "Asignación de Tarjeta",
    description: "Administra tarjetas corporativas",
    icon: CreditCard,
    color: "from-rose-500 to-rose-600",
    shadowColor: "shadow-rose-500/25",
    delay: 300,
    href: "/card-assignment",
  },
  {
    id: 6,
    title: "Comprobación de Viáticos",
    description: "Verifica y comprueba gastos",
    icon: Receipt,
    color: "from-cyan-500 to-cyan-600",
    shadowColor: "shadow-cyan-500/25",
    delay: 350,
    href: "/travel-expenses",
  },
  {
    id: 7,
    title: "Módulo de Gasolina",
    description: "Control de consumo de combustible",
    icon: Fuel,
    color: "from-orange-500 to-orange-600",
    shadowColor: "shadow-orange-500/25",
    delay: 400,
    href: "#",
  },
]

export function useHomePage(): UseHomePageReturn {
  const navigate = useNavigate()
  const mounted = true
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState<HomeMousePosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  function handleMenuNavigate(href: string): void {
    if (href !== "#") {
      navigate(href)
    }
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
    handleMenuNavigate,
    handleCardEnter,
    handleCardLeave,
  }
}
