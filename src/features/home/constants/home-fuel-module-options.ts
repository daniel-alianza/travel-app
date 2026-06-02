import {
  Banknote,
  BarChart3,
  ClipboardCheck,
  FilePlus,
  Gauge,
} from "lucide-react"

import type { HomeFuelModuleOption } from "../interfaces/home-fuel-module-option.interface"

export const HOME_FUEL_MODULE_OPTIONS: HomeFuelModuleOption[] = [
  {
    id: "solicitud",
    title: "Solicitud",
    description: "Genera y consulta solicitudes de combustible",
    icon: FilePlus,
    href: "/gasoline/request",
  },
  {
    id: "autorizacion",
    title: "Autorización",
    description: "Aprueba solicitudes de gasolina pendientes",
    icon: ClipboardCheck,
    href: "/gasoline/authorizations",
  },
  {
    id: "dispersiones",
    title: "Dispersiones",
    description: "Gestiona la dispersión de fondos de combustible",
    icon: Banknote,
    href: "/gasoline/dispersion",
  },
  {
    id: "reporte",
    title: "Reporte",
    description: "Consulta reportes y movimientos de gasolina",
    icon: BarChart3,
    href: "/gasoline/report",
  },
  {
    id: "rendimiento",
    title: "Rendimiento",
    description: "Analiza el rendimiento de consumo por vehículo",
    icon: Gauge,
    href: "/gasoline/performance",
  },
]

export const GASOLINA_MENU_OPTION_ID = 7
