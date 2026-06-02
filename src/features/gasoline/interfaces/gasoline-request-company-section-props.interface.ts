import type { GasolineRequestPageModel } from "@/features/gasoline/interfaces/gasoline-request-page-model.interface"

export interface GasolineRequestCompanySectionProps {
  page: Pick<
    GasolineRequestPageModel,
    | "mounted"
    | "catalogoCarga"
    | "catalogoError"
    | "muestraSucursal"
    | "opcionesEmpresa"
    | "opcionesSucursal"
    | "opcionesArea"
    | "empresa"
    | "control"
    | "formState"
    | "dropdownOpen"
    | "setDropdownOpen"
    | "focusedField"
    | "setFocusedField"
    | "onEmpresaChange"
    | "onSucursalChange"
    | "onAreaChange"
  >
}
