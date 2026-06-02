import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { showAppToast } from "@/components/app-toast"
import { useAuthStore } from "@/features/auth/store/authStore"
import type { GasolineCardSelection } from "@/features/gasoline/interfaces/gasoline-card-selection.interface"
import type { GasolineRequestFormValues } from "@/features/gasoline/interfaces/gasoline-request-form-values.interface"
import type { GasolineRequestPageModel } from "@/features/gasoline/interfaces/gasoline-request-page-model.interface"
import {
  nombresCatalogo,
  resolverIdCatalogoPorNombre,
  sucursalesPorEmpresa,
} from "@/features/gasoline/hooks/gasoline-request-page-helpers"
import { gasolineRequestFormSchema } from "@/features/gasoline/schemas/gasoline-request-form.schema"
import {
  createGasolineRequest,
  fetchGasolineRequestFormCatalog,
  fetchGasolineRequestFormData,
  type GasolineRequestFormCatalog,
} from "@/features/gasoline/services/gasoline-api"
import {
  esEmpresaSinSucursalObligatoria,
  requiereSucursalGasolina,
} from "@/features/gasoline/utils/gasoline-company-rules"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import { logTravelAxiosError, userMessageFromTravelAxiosError } from "@/lib/travel-api-axios-error"

export function useGasolineRequestPage(): GasolineRequestPageModel {
  const navigate = useNavigate()
  const userIdSesion = useAuthStore((state) => state.userId)
  const userId = userIdSesion ?? 1
  const mounted = true

  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [catalogo, setCatalogo] = useState<GasolineRequestFormCatalog | null>(
    null
  )
  const [catalogoCarga, setCatalogoCarga] = useState(true)
  const [catalogoError, setCatalogoError] = useState<string | null>(null)
  const [tarjetaSeleccionada, setTarjetaSeleccionada] =
    useState<GasolineCardSelection | null>(null)
  const [fotoOdometroArchivo, setFotoOdometroArchivo] = useState<File | null>(
    null
  )
  const [enviando, setEnviando] = useState(false)

  const formulario = useForm<GasolineRequestFormValues>({
    resolver: zodResolver(gasolineRequestFormSchema),
    defaultValues: {
      empresa: "",
      sucursal: "",
      area: "",
      tarjeta: "",
      matricula: "",
      kilometraje: "",
      ruta: "",
      montoSolicitado: "",
      distanciaKm: "",
      comentarios: "",
      fotoOdometro: "",
    },
  })

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState,
  } = formulario

  const empresa = watch("empresa")
  const sucursal = watch("sucursal") ?? ""
  const area = watch("area")
  const fotoOdometroPreview = watch("fotoOdometro")

  const opcionesEmpresa = useMemo(
    () => (catalogo ? nombresCatalogo(catalogo.companies) : []),
    [catalogo]
  )

  const opcionesSucursal = useMemo(
    () =>
      catalogo && empresa
        ? sucursalesPorEmpresa(catalogo, empresa, sucursal)
        : [],
    [catalogo, empresa, sucursal]
  )

  const opcionesArea = useMemo(
    () => (catalogo ? nombresCatalogo(catalogo.areas) : []),
    [catalogo]
  )

  const empresaId = useMemo(() => {
    if (!catalogo) {
      return null
    }
    return resolverIdCatalogoPorNombre(catalogo.companies, empresa)
  }, [catalogo, empresa])

  const sucursalId = useMemo(() => {
    if (!catalogo) {
      return null
    }
    return resolverIdCatalogoPorNombre(catalogo.branches, sucursal)
  }, [catalogo, sucursal])

  const areaId = useMemo(() => {
    if (!catalogo) {
      return null
    }
    return resolverIdCatalogoPorNombre(catalogo.areas, area)
  }, [catalogo, area])

  const muestraSucursal = useMemo(() => {
    if (empresa.trim().length === 0) {
      return false
    }
    return !esEmpresaSinSucursalObligatoria(empresa, empresaId)
  }, [empresa, empresaId])

  const sucursalObligatoria = useMemo(
    () => requiereSucursalGasolina(empresa, empresaId),
    [empresa, empresaId]
  )

  const alianzaSinSucursal =
    sucursalObligatoria && sucursal.trim().length === 0

  const envioDeshabilitado =
    enviando ||
    catalogoCarga ||
    catalogoError !== null ||
    alianzaSinSucursal

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let activo = true

    async function loadCatalogoYPrecarga(): Promise<void> {
      setCatalogoCarga(true)
      setCatalogoError(null)
      try {
        const catalogoRespuesta = await fetchGasolineRequestFormCatalog()
        if (!activo) {
          return
        }
        setCatalogo(catalogoRespuesta)
      } catch (error) {
        logTravelAxiosError("gasoline-request-catalog", error)
        if (activo) {
          setCatalogoError(
            "No se pudo cargar el catálogo de empresa, sucursal y área."
          )
          showAppToast(
            "No se pudo cargar el catálogo de empresa, sucursal y área.",
            "error"
          )
        }
        return
      } finally {
        if (activo) {
          setCatalogoCarga(false)
        }
      }

      try {
        const formData = await fetchGasolineRequestFormData(userId)
        if (!activo) {
          return
        }
        setValue("empresa", formData.company.name)
        setValue("sucursal", formData.branch.name)
        setValue("area", formData.area.name)
      } catch (error) {
        logTravelAxiosError("gasoline-request-prefill", error)
        if (activo) {
          showAppToast(
            "No se pudieron cargar los datos de empresa, sucursal y área.",
            "error"
          )
        }
      }
    }

    void loadCatalogoYPrecarga()

    return () => {
      activo = false
    }
  }, [setValue, userId])

  useEffect(() => {
    setTarjetaSeleccionada(null)
    setValue("tarjeta", "")
  }, [empresa, sucursal, area, setValue])

  useEffect(() => {
    if (!muestraSucursal) {
      setValue("sucursal", "")
      clearErrors("sucursal")
      return
    }
    if (alianzaSinSucursal) {
      setError("sucursal", {
        type: "manual",
        message: "Selecciona la sucursal (obligatoria en Alianza Eléctrica).",
      })
    } else {
      clearErrors("sucursal")
    }
  }, [muestraSucursal, alianzaSinSucursal, setValue, setError, clearErrors])

  function limpiarTarjeta(): void {
    setTarjetaSeleccionada(null)
    setValue("tarjeta", "")
  }

  function onTarjetaChange(selection: GasolineCardSelection | null): void {
    setTarjetaSeleccionada(selection)
    setValue(
      "tarjeta",
      selection !== null ? selection.cardNumberMasked : "",
      { shouldValidate: true }
    )
  }

  function onEmpresaChange(): void {
    setValue("sucursal", "")
    setValue("area", "")
    limpiarTarjeta()
  }

  function onSucursalChange(): void {
    limpiarTarjeta()
  }

  function onAreaChange(): void {
    limpiarTarjeta()
  }

  function onFotoOdometroChange(event: ChangeEvent<HTMLInputElement>): void {
    const archivo = event.target.files?.[0]
    if (!archivo) {
      return
    }
    setFotoOdometroArchivo(archivo)
    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const resultado = loadEvent.target?.result
      if (typeof resultado === "string") {
        setValue("fotoOdometro", resultado, { shouldValidate: true })
      }
    }
    reader.readAsDataURL(archivo)
  }

  async function onSubmit(valores: GasolineRequestFormValues): Promise<void> {
    if (empresaId === null || areaId === null || tarjetaSeleccionada === null) {
      showAppToast("Completa empresa, área y tarjeta antes de enviar.", "error")
      return
    }
    if (sucursalObligatoria && sucursalId === null) {
      showAppToast(
        "Selecciona la sucursal (obligatoria en Alianza Eléctrica).",
        "error"
      )
      return
    }
    if (fotoOdometroArchivo === null) {
      showAppToast("Sube la foto del odómetro.", "error")
      return
    }

    setEnviando(true)
    try {
      await createGasolineRequest({
        userId,
        companyId: empresaId,
        ...(sucursalId !== null ? { branchId: sucursalId } : {}),
        areaId,
        ...(tarjetaSeleccionada.cardId !== null
          ? { cardId: tarjetaSeleccionada.cardId }
          : { sapCode: tarjetaSeleccionada.sapCode }),
        plate: valores.matricula.trim(),
        currentMileageKm: Number(valores.kilometraje),
        requestedAmount: Number(valores.montoSolicitado),
        distanceKm: Number(valores.distanciaKm),
        routeToTake: valores.ruta.trim(),
        ...(valores.comentarios?.trim()
          ? { applicantComments: valores.comentarios.trim() }
          : {}),
        odometerPhotoFile: fotoOdometroArchivo,
      })
      showAppToast("Solicitud de gasolina enviada correctamente.", "success")
      navigate("/home")
    } catch (error) {
      logTravelAxiosError("gasoline-request-create", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudo registrar la solicitud de gasolina.",
        "error"
      )
    } finally {
      setEnviando(false)
    }
  }

  return {
    mounted,
    mousePosition,
    catalogoCarga,
    catalogoError,
    muestraSucursal,
    sucursalObligatoria,
    alianzaSinSucursal,
    opcionesEmpresa,
    opcionesSucursal,
    opcionesArea,
    empresa,
    empresaId,
    sucursalId,
    control,
    register,
    handleSubmit,
    formState,
    onSubmit,
    dropdownOpen,
    setDropdownOpen,
    focusedField,
    setFocusedField,
    tarjetaSeleccionada,
    onTarjetaChange,
    onEmpresaChange,
    onSucursalChange,
    onAreaChange,
    fotoOdometroPreview,
    onFotoOdometroChange,
    enviando,
    envioDeshabilitado,
  }
}
