import type { ChangeEvent } from "react"
import type {
  Control,
  FormState,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form"

import type { GasolineCardSelection } from "@/features/gasoline/interfaces/gasoline-card-selection.interface"
import type { GasolineRequestFormValues } from "@/features/gasoline/interfaces/gasoline-request-form-values.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

export interface GasolineRequestPageModel {
  mounted: boolean
  mousePosition: TravelRequestMousePosition
  catalogoCarga: boolean
  catalogoError: string | null
  muestraSucursal: boolean
  sucursalObligatoria: boolean
  alianzaSinSucursal: boolean
  opcionesEmpresa: string[]
  opcionesSucursal: string[]
  opcionesArea: string[]
  empresa: string
  empresaId: number | null
  sucursalId: number | null
  control: Control<GasolineRequestFormValues>
  register: UseFormRegister<GasolineRequestFormValues>
  handleSubmit: UseFormHandleSubmit<GasolineRequestFormValues>
  formState: FormState<GasolineRequestFormValues>
  onSubmit: (valores: GasolineRequestFormValues) => Promise<void>
  dropdownOpen: string | null
  setDropdownOpen: (value: string | null) => void
  focusedField: string | null
  setFocusedField: (value: string | null) => void
  tarjetaSeleccionada: GasolineCardSelection | null
  onTarjetaChange: (selection: GasolineCardSelection | null) => void
  onEmpresaChange: () => void
  onSucursalChange: () => void
  onAreaChange: () => void
  fotoOdometroPreview: string
  onFotoOdometroChange: (event: ChangeEvent<HTMLInputElement>) => void
  enviando: boolean
  envioDeshabilitado: boolean
}
