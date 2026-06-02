import type { GasolineRequestPageModel } from "@/features/gasoline/interfaces/gasoline-request-page-model.interface"

export interface GasolineRequestDetailsSectionProps {
  page: Pick<
    GasolineRequestPageModel,
    | "mounted"
    | "catalogoCarga"
    | "catalogoError"
    | "muestraSucursal"
    | "sucursalObligatoria"
    | "alianzaSinSucursal"
    | "empresaId"
    | "sucursalId"
    | "tarjetaSeleccionada"
    | "onTarjetaChange"
    | "register"
    | "formState"
    | "fotoOdometroPreview"
    | "onFotoOdometroChange"
  >
}
