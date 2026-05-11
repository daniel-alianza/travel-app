import { useEffect, useState, type ChangeEvent } from "react"
import { AxiosError } from "axios"
import { useNavigate, useSearchParams } from "react-router-dom"

import { showAppToast } from "@/components/app-toast"
import type { TravelRequestGastos } from "../interfaces/travel-request-gastos.interface"
import type { TravelRequestMousePosition } from "../interfaces/travel-request-mouse-position.interface"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"
import {
  createEmptyTravelRequestTrip,
  type EstadoViajeFormulario,
  type TravelRequestTripData,
} from "../interfaces/travel-request-trip-data.interface"
import type {
  TravelRequestTripSubmitFieldErrorKey,
  TravelRequestTripSubmitFieldErrors,
} from "../interfaces/travel-request-trip-submit-field-errors.interface"
import {
  correctRejectedTravelTrip,
  createTravelRequest,
  fetchTravelRequestDetalleParaUsuario,
  fetchTravelRequestFormData,
  fetchTravelRequestPolicies,
  fetchUserFuelCards,
  type TravelRequestDetalleViajeApi,
  type TravelRequestPolicyNoticeApi,
} from "../services/travel-request-api"

const empresas = ["Alianza Eléctrica", "Grupo FG Industrial", "FG Servicios"]
const sucursales: Record<string, string[]> = {
  "Alianza Eléctrica": ["Atizapán", "Toluca", "CDMX Centro"],
  "Grupo FG Industrial": ["Querétaro", "Monterrey", "Guadalajara"],
  "FG Servicios": ["CDMX Norte", "CDMX Sur", "Puebla"],
}
const areas = [
  "Tecnologías de la Información",
  "Recursos Humanos",
  "Operaciones",
  "Ventas",
  "Logística",
]

type TravelRequestPolicyErrorPayload = {
  code?: string
  tripIndex?: number
  field?: keyof TravelRequestGastos
  requestedAmount?: number
  maximumAllowedAmount?: number
}

type TravelRequestApiErrorResponse = {
  message?: string
  error?: string | TravelRequestPolicyErrorPayload
}

export function useTravelRequestPage(): TravelRequestPageModel {
  const AUTHENTICATED_USER_ID = 1
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mounted = true
  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })

  const [empresa, setEmpresa] = useState("")
  const [sucursal, setSucursal] = useState("")
  const [area, setArea] = useState("")
  const [nombreEmpleado, setNombreEmpleado] = useState("")
  const [numeroTarjeta, setNumeroTarjeta] = useState("")
  const [viaticCards, setViaticCards] = useState<
    Array<{ id: number; cardNumber: string }>
  >([])
  const [fuelCards, setFuelCards] = useState<
    Array<{ id: number; cardNumber: string }>
  >([])
  const [fuelCardsLoaded, setFuelCardsLoaded] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  )
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null)
  const [isFormDataLocked, setIsFormDataLocked] = useState(false)

  const [trips, setTrips] = useState<TravelRequestTripData[]>(() => [
    createEmptyTravelRequestTrip(),
  ])

  const [viajeCorreccionId, setViajeCorreccionId] = useState<number | null>(
    null
  )

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const [ocupado, setOcupado] = useState(false)
  const [policyNotices, setPolicyNotices] = useState<
    TravelRequestPolicyNoticeApi[]
  >([])
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [tripGastoErrors, setTripGastoErrors] = useState<
    Record<number, Partial<Record<keyof TravelRequestGastos, string>>>
  >({})
  const [tripSubmitFieldErrors, setTripSubmitFieldErrors] = useState<
    Record<number, TravelRequestTripSubmitFieldErrors>
  >({})

  const esModoCorreccionViaje = viajeCorreccionId !== null
  const etiquetaBotonEnviar = esModoCorreccionViaje
    ? "Reenviar viaje corregido"
    : "Enviar Solicitud"

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let isMounted = true
    async function loadPolicies(): Promise<void> {
      try {
        const notices = await fetchTravelRequestPolicies()
        if (isMounted) {
          setPolicyNotices(notices)
        }
      } catch {
        showAppToast(
          "No se pudieron cargar las políticas de viaje desde la API.",
          "error"
        )
      }
    }
    void loadPolicies()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadFormData(): Promise<void> {
      try {
        const formData = await fetchTravelRequestFormData(AUTHENTICATED_USER_ID)
        if (!isMounted) {
          return
        }

        setNombreEmpleado(formData.employeeName)
        setEmpresa(formData.company.name)
        setSucursal(formData.branch.name)
        setArea(formData.area.name)
        setSelectedCompanyId(formData.company.id)
        setSelectedBranchId(formData.branch.id)
        setSelectedAreaId(formData.area.id)
        setViaticCards(formData.viaticCards)
        setNumeroTarjeta(formData.viaticCards[0]?.cardNumber ?? "")
        setIsFormDataLocked(true)
      } catch {
        showAppToast(
          "No se pudieron precargar los datos del solicitante.",
          "error"
        )
      }
    }

    void loadFormData()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const solicitudParam = searchParams.get("solicitud")
    const viajeParam = searchParams.get("viaje")
    if (!solicitudParam || !viajeParam) {
      return
    }

    const solicitudId = Number.parseInt(solicitudParam, 10)
    const viajeId = Number.parseInt(viajeParam, 10)
    if (!Number.isFinite(solicitudId) || !Number.isFinite(viajeId)) {
      return
    }

    let cancelado = false

    async function cargarCorreccion(): Promise<void> {
      try {
        const detalle = await fetchTravelRequestDetalleParaUsuario(
          solicitudId,
          AUTHENTICATED_USER_ID
        )
        if (cancelado) {
          return
        }

        const viajeMeta = detalle.viajes.find(
          (viaje) => viaje.tripId === viajeId
        )
        if (!viajeMeta || viajeMeta.estadoViaje !== "rejected") {
          showAppToast(
            "Ese viaje no está rechazado o no pertenece a la solicitud.",
            "error"
          )
          navigate("/travel-request/solicitudes", { replace: true })
          return
        }

        try {
          const fuelCardsResponse = await fetchUserFuelCards(
            AUTHENTICATED_USER_ID
          )
          if (!cancelado) {
            setFuelCards(fuelCardsResponse.fuelCards)
            setFuelCardsLoaded(true)
          }
        } catch {
          showAppToast(
            "No se pudieron cargar las tarjetas de gasolina.",
            "error"
          )
        }

        if (cancelado) {
          return
        }

        setEmpresa(detalle.company.name)
        setSucursal(detalle.branch.name)
        setArea(detalle.area.name)
        setSelectedCompanyId(detalle.company.id)
        setSelectedBranchId(detalle.branch.id)
        setSelectedAreaId(detalle.area.id)
        setNombreEmpleado(detalle.employeeName)
        setNumeroTarjeta(detalle.corporateCardNumber ?? "")
        setTrips([mapViajeDetalleATrip(viajeMeta)])
        setViajeCorreccionId(viajeId)
        setIsFormDataLocked(true)
      } catch {
        if (!cancelado) {
          showAppToast(
            "No se pudo cargar la solicitud para corrección.",
            "error"
          )
          navigate("/travel-request/solicitudes", { replace: true })
        }
      }
    }

    void cargarCorreccion()

    return () => {
      cancelado = true
    }
  }, [searchParams, navigate])

  function tripSoloLectura(tripIndex: number): boolean {
    if (viajeCorreccionId === null) {
      return false
    }
    const trip = trips[tripIndex]
    if (trip?.tripId === undefined) {
      return true
    }
    const esRechazado = trip.estadoViaje === "rejected"
    const esElViajeAModificar = trip.tripId === viajeCorreccionId
    return !(esElViajeAModificar && esRechazado)
  }

  function clearTripSubmitFieldErrorKeys(
    tripIndex: number,
    keys: readonly TravelRequestTripSubmitFieldErrorKey[]
  ): void {
    if (keys.length === 0) {
      return
    }
    setTripSubmitFieldErrors((prev) => {
      const tripErrors = prev[tripIndex]
      if (!tripErrors) {
        return prev
      }
      const nextTrip = { ...tripErrors }
      for (const key of keys) {
        delete nextTrip[key]
      }
      if (Object.keys(nextTrip).length === 0) {
        const next = { ...prev }
        delete next[tripIndex]
        return next
      }
      return { ...prev, [tripIndex]: nextTrip }
    })
  }

  function updateTrip(
    tripIndex: number,
    partial: Partial<TravelRequestTripData>
  ): void {
    setTrips((prev) =>
      prev.map((trip, i) => (i === tripIndex ? { ...trip, ...partial } : trip))
    )
    const errorKeysToClear = submitErrorKeysAffectedByTripPartial(partial)
    clearTripSubmitFieldErrorKeys(tripIndex, errorKeysToClear)
  }

  function patchTripGasto(
    tripIndex: number,
    field: keyof TravelRequestGastos,
    value: string
  ): void {
    setTrips((prev) =>
      prev.map((trip, i) =>
        i === tripIndex
          ? { ...trip, gastos: { ...trip.gastos, [field]: value } }
          : trip
      )
    )
    setTripGastoErrors((prev) => {
      const tripErrors = prev[tripIndex]
      if (!tripErrors || !tripErrors[field]) {
        return prev
      }
      const nextTripErrors = { ...tripErrors }
      delete nextTripErrors[field]
      if (Object.keys(nextTripErrors).length === 0) {
        const next = { ...prev }
        delete next[tripIndex]
        return next
      }
      return { ...prev, [tripIndex]: nextTripErrors }
    })
    clearTripSubmitFieldErrorKeys(tripIndex, ["gastosEstimados"])
  }

  function getTripGastoError(
    tripIndex: number,
    field: keyof TravelRequestGastos
  ): string | null {
    return tripGastoErrors[tripIndex]?.[field] ?? null
  }

  function getTripSubmitFieldError(
    tripIndex: number,
    field: TravelRequestTripSubmitFieldErrorKey
  ): string | null {
    return tripSubmitFieldErrors[tripIndex]?.[field] ?? null
  }

  function addTrip(): void {
    if (viajeCorreccionId !== null) {
      return
    }
    setTrips((prev) => [...prev, createEmptyTravelRequestTrip()])
  }

  function removeTrip(tripIndex: number): void {
    if (viajeCorreccionId !== null) {
      return
    }
    setTrips((prev) => {
      if (prev.length <= 1) {
        return prev
      }
      return prev.filter((_, i) => i !== tripIndex)
    })
    setTripGastoErrors((prev) => reindexErrorsAfterRemoval(prev, tripIndex))
    setTripSubmitFieldErrors((prev) =>
      reindexErrorsAfterRemoval(prev, tripIndex)
    )
  }

  function calcularTotal(tripIndex: number): number {
    const trip = trips[tripIndex]
    if (!trip) {
      return 0
    }
    return Object.values(trip.gastos).reduce(
      (acc, val) => acc + (parseFloat(val) || 0),
      0
    )
  }

  function calcularTotalTodosLosViajes(): number {
    return trips.reduce((sum, _, index) => sum + calcularTotal(index), 0)
  }

  function handleAddObjetivo(tripIndex: number): void {
    setTrips((prev) =>
      prev.map((trip, i) => {
        if (i !== tripIndex) {
          return trip
        }
        if (trip.objetivos.length >= 5) {
          return trip
        }
        return { ...trip, objetivos: [...trip.objetivos, ""] }
      })
    )
    clearTripSubmitFieldErrorKeys(tripIndex, ["objetivos"])
  }

  function handleRemoveObjetivo(
    tripIndex: number,
    objectiveIndex: number
  ): void {
    setTrips((prev) =>
      prev.map((trip, i) => {
        if (i !== tripIndex) {
          return trip
        }
        if (trip.objetivos.length <= 3) {
          return trip
        }
        return {
          ...trip,
          objetivos: trip.objetivos.filter((_, j) => j !== objectiveIndex),
        }
      })
    )
    clearTripSubmitFieldErrorKeys(tripIndex, ["objetivos"])
  }

  function handleObjetivoChange(
    tripIndex: number,
    objectiveIndex: number,
    value: string
  ): void {
    setTrips((prev) =>
      prev.map((trip, i) => {
        if (i !== tripIndex) {
          return trip
        }
        const next = [...trip.objetivos]
        next[objectiveIndex] = value
        return { ...trip, objetivos: next }
      })
    )
    clearTripSubmitFieldErrorKeys(tripIndex, ["objetivos"])
  }

  async function loadFuelCards(): Promise<void> {
    if (fuelCardsLoaded) {
      return
    }

    try {
      const fuelCardsResponse = await fetchUserFuelCards(AUTHENTICATED_USER_ID)
      setFuelCards(fuelCardsResponse.fuelCards)
      setFuelCardsLoaded(true)
    } catch {
      showAppToast("No se pudieron cargar las tarjetas de gasolina.", "error")
    }
  }

  async function handleSubmit(): Promise<void> {
    if (ocupado) {
      return
    }
    if (
      !empresa.trim() ||
      !sucursal.trim() ||
      !area.trim() ||
      !nombreEmpleado.trim()
    ) {
      showAppToast(
        "Completa empresa, sucursal, área y nombre del solicitante antes de enviar.",
        "error"
      )
      return
    }
    setDropdownOpen(null)
    setTripGastoErrors({})
    setTripSubmitFieldErrors({})

    if (viajeCorreccionId !== null) {
      const tripIndex = trips.findIndex((t) => t.tripId === viajeCorreccionId)
      if (tripIndex < 0) {
        showAppToast("No se encontró el viaje a corregir.", "error")
        return
      }
      const trip = trips[tripIndex]
      if (!trip) {
        showAppToast("No se encontró el viaje a corregir.", "error")
        return
      }
      let tarjetasCombustible = fuelCards
      if (trip.necesitaGasolina && !fuelCardsLoaded) {
        try {
          const respuesta = await fetchUserFuelCards(AUTHENTICATED_USER_ID)
          tarjetasCombustible = respuesta.fuelCards
          setFuelCards(respuesta.fuelCards)
          setFuelCardsLoaded(true)
        } catch {
          showAppToast(
            "No se pudieron cargar las tarjetas de gasolina.",
            "error"
          )
          return
        }
      }
      const erroresViaje = collectTripSubmitFieldErrors(
        trip,
        tarjetasCombustible
      )
      if (Object.keys(erroresViaje).length > 0) {
        setTripSubmitFieldErrors({ [tripIndex]: erroresViaje })
        showAppToast(
          buildValidationToastMessage({ [tripIndex]: erroresViaje }, 1),
          "error"
        )
        return
      }

      setOcupado(true)
      try {
        const tripPayload = buildTripPayloadForApi(trip, tarjetasCombustible)
        await correctRejectedTravelTrip(viajeCorreccionId, {
          userId: AUTHENTICATED_USER_ID,
          trip: tripPayload,
        })
        showAppToast("Viaje corregido y reenviado a revisión.", "success")
        navigate("/travel-request/solicitudes")
      } catch {
        showAppToast("No se pudo reenviar el viaje corregido.", "error")
      } finally {
        setOcupado(false)
      }
      return
    }

    if (viaticCards.length === 0 || numeroTarjeta.trim().length === 0) {
      showAppToast(
        "No tienes tarjeta viático asignada: no puedes solicitar viáticos. Comunícate con administración o contabilidad para que te asignen una.",
        "error"
      )
      return
    }

    const companyId = selectedCompanyId ?? getOptionId(empresas, empresa)
    const branchId =
      selectedBranchId ?? getOptionId(sucursales[empresa] ?? [], sucursal)
    const areaId = selectedAreaId ?? getOptionId(areas, area)

    if (!companyId || !branchId || !areaId) {
      showAppToast(
        "No se pudieron resolver empresa, sucursal o área para enviar.",
        "error"
      )
      return
    }

    let tarjetasCombustible = fuelCards
    const haySolicitudGasolina = trips.some((t) => t.necesitaGasolina)
    if (haySolicitudGasolina && !fuelCardsLoaded) {
      try {
        const respuesta = await fetchUserFuelCards(AUTHENTICATED_USER_ID)
        tarjetasCombustible = respuesta.fuelCards
        setFuelCards(respuesta.fuelCards)
        setFuelCardsLoaded(true)
      } catch {
        showAppToast(
          "No se pudieron cargar las tarjetas de gasolina.",
          "error"
        )
        return
      }
    }

    const erroresPorViaje: Record<number, TravelRequestTripSubmitFieldErrors> =
      {}
    for (let i = 0; i < trips.length; i++) {
      const viaje = trips[i]
      if (!viaje) {
        continue
      }
      const errores = collectTripSubmitFieldErrors(viaje, tarjetasCombustible)
      if (Object.keys(errores).length > 0) {
        erroresPorViaje[i] = errores
      }
    }
    if (Object.keys(erroresPorViaje).length > 0) {
      setTripSubmitFieldErrors(erroresPorViaje)
      showAppToast(
        buildValidationToastMessage(erroresPorViaje, trips.length),
        "error"
      )
      return
    }

    setOcupado(true)
    try {
      const payload = {
        userId: AUTHENTICATED_USER_ID,
        companyId,
        branchId,
        areaId,
        employeeName: nombreEmpleado,
        corporateCardNumber: numeroTarjeta,
        trips: trips.map((viaje) => ({
          destinoViaje: viaje.destinoViaje,
          motivoViaje: viaje.motivoViaje,
          fechaSalida: viaje.fechaSalida,
          fechaRegreso: viaje.fechaRegreso,
          fechaDispersion: viaje.fechaDispersion,
          gastos: {
            transporte: parseInputNumber(viaje.gastos.transporte),
            peajes: parseInputNumber(viaje.gastos.peajes),
            hospedaje: parseInputNumber(viaje.gastos.hospedaje),
            alimentos: parseInputNumber(viaje.gastos.alimentos),
            fletes: parseInputNumber(viaje.gastos.fletes),
            herramientas: parseInputNumber(viaje.gastos.herramientas),
            envios: parseInputNumber(viaje.gastos.envios),
            miscelaneos: parseInputNumber(viaje.gastos.miscelaneos),
          },
          objetivos: viaje.objetivos.filter(
            (objective) => objective.trim().length > 0
          ),
          gasolina: {
            necesitaGasolina: viaje.necesitaGasolina,
            cardId: resolveFuelCardId(
              viaje.tarjetaGasolina,
              tarjetasCombustible
            ),
            placa: viaje.placa || null,
            kilometrajeActualKm: parseNullableNumber(viaje.kilometraje),
            montoSolicitado: parseNullableNumber(viaje.montoGasolina),
            distanciaKm: parseNullableNumber(viaje.distancia),
            comentarios: viaje.comentariosGasolina || null,
          },
          tag: {
            necesitaTag: viaje.necesitaTag,
            montoSolicitado: parseNullableNumber(viaje.montoTag),
            comentarios: viaje.comentariosTag || null,
          },
        })),
      }

      await createTravelRequest(payload)
      showAppToast("Solicitud enviada correctamente.", "success")
      navigate("/home")
    } catch (error) {
      const policyError = extractTravelPolicyError(error)
      if (policyError && policyError.field === "alimentos") {
        const zeroBasedTripIndex = Math.max((policyError.tripIndex ?? 1) - 1, 0)
        const maximumAllowed = policyError.maximumAllowedAmount ?? 0
        setTripGastoErrors((prev) => ({
          ...prev,
          [zeroBasedTripIndex]: {
            ...prev[zeroBasedTripIndex],
            alimentos: `Excede el tope permitido (${formatCurrency(maximumAllowed)}).`,
          },
        }))
        showAppToast(
          "El monto de alimentos excede la política para las fechas seleccionadas.",
          "error"
        )
        return
      }
      showAppToast("No se pudo enviar la solicitud.", "error")
    } finally {
      setOcupado(false)
    }
  }

  function handleFileUpload(
    tripIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string
        setTrips((prev) =>
          prev.map((trip, i) =>
            i === tripIndex ? { ...trip, fotoOdometro: result } : trip
          )
        )
      }
      reader.readAsDataURL(file)
    }
  }

  return {
    mounted,
    mousePosition,
    empresas,
    sucursales,
    areas,
    trips,
    empresa,
    setEmpresa,
    sucursal,
    setSucursal,
    area,
    setArea,
    nombreEmpleado,
    setNombreEmpleado,
    numeroTarjeta,
    setNumeroTarjeta,
    viaticCards,
    fuelCards,
    loadFuelCards,
    isFormDataLocked,
    esModoCorreccionViaje,
    tripSoloLectura,
    etiquetaBotonEnviar,
    updateTrip,
    patchTripGasto,
    getTripGastoError,
    getTripSubmitFieldError,
    addTrip,
    removeTrip,
    dropdownOpen,
    setDropdownOpen,
    ocupado,
    policyNotices,
    focusedField,
    setFocusedField,
    calcularTotal,
    calcularTotalTodosLosViajes,
    handleAddObjetivo,
    handleRemoveObjetivo,
    handleObjetivoChange,
    handleSubmit,
    handleFileUpload,
  }
}

function extractTravelPolicyError(
  error: unknown
): TravelRequestPolicyErrorPayload | null {
  if (!(error instanceof AxiosError)) {
    return null
  }
  const responseData = error.response?.data as TravelRequestApiErrorResponse
  if (!responseData || typeof responseData.error !== "object") {
    return null
  }
  const payload = responseData.error as TravelRequestPolicyErrorPayload
  if (payload.code !== "TRAVEL_REQUEST_POLICY_LIMIT_EXCEEDED") {
    return null
  }
  return payload
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value)
}

function mapEstadoViajeApi(valor: string): EstadoViajeFormulario | undefined {
  if (valor === "pending" || valor === "approved" || valor === "rejected") {
    return valor
  }
  return undefined
}

function padObjetivos(objetivos: string[]): string[] {
  const siguiente = [...objetivos]
  while (siguiente.length < 3) {
    siguiente.push("")
  }
  return siguiente.slice(0, 5)
}

function numeroAString(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return ""
  }
  return String(valor)
}

function mapViajeDetalleATrip(
  viaje: TravelRequestDetalleViajeApi
): TravelRequestTripData {
  return {
    tripId: viaje.tripId,
    estadoViaje: mapEstadoViajeApi(viaje.estadoViaje),
    ordenViajeEnSolicitud: viaje.tripOrder,
    destinoViaje: viaje.destinoViaje,
    motivoViaje: viaje.motivoViaje,
    fechaSalida: viaje.fechaSalida,
    fechaRegreso: viaje.fechaRegreso,
    fechaDispersion: viaje.fechaDispersion,
    gastos: {
      transporte: numeroAString(viaje.gastos.transporte),
      peajes: numeroAString(viaje.gastos.peajes),
      hospedaje: numeroAString(viaje.gastos.hospedaje),
      alimentos: numeroAString(viaje.gastos.alimentos),
      fletes: numeroAString(viaje.gastos.fletes),
      herramientas: numeroAString(viaje.gastos.herramientas),
      envios: numeroAString(viaje.gastos.envios),
      miscelaneos: numeroAString(viaje.gastos.miscelaneos),
    },
    objetivos: padObjetivos(viaje.objetivos),
    necesitaGasolina: viaje.gasolina.necesitaGasolina,
    tarjetaGasolina: viaje.gasolina.cardNumber ?? "",
    placa: viaje.gasolina.placa ?? "",
    kilometraje: numeroAString(viaje.gasolina.kilometrajeActualKm),
    montoGasolina: numeroAString(viaje.gasolina.montoSolicitado),
    distancia: numeroAString(viaje.gasolina.distanciaKm),
    comentariosGasolina: viaje.gasolina.comentarios ?? "",
    fotoOdometro: null,
    necesitaTag: viaje.tag.necesitaTag,
    montoTag: numeroAString(viaje.tag.montoSolicitado),
    comentariosTag: viaje.tag.comentarios ?? "",
  }
}

function submitErrorKeysAffectedByTripPartial(
  partial: Partial<TravelRequestTripData>
): TravelRequestTripSubmitFieldErrorKey[] {
  const keys: TravelRequestTripSubmitFieldErrorKey[] = []
  if (partial.destinoViaje !== undefined) {
    keys.push("destinoViaje")
  }
  if (partial.motivoViaje !== undefined) {
    keys.push("motivoViaje")
  }
  if (partial.fechaSalida !== undefined) {
    keys.push("fechaSalida")
  }
  if (partial.fechaRegreso !== undefined) {
    keys.push("fechaRegreso")
  }
  if (partial.fechaDispersion !== undefined) {
    keys.push("fechaDispersion")
  }
  if (partial.tarjetaGasolina !== undefined) {
    keys.push("gasolinaTarjeta")
  }
  if (partial.placa !== undefined) {
    keys.push("gasolinaPlaca")
  }
  if (partial.kilometraje !== undefined) {
    keys.push("gasolinaKilometraje")
  }
  if (partial.montoGasolina !== undefined) {
    keys.push("gasolinaMonto")
  }
  if (partial.distancia !== undefined) {
    keys.push("gasolinaDistancia")
  }
  if (partial.montoTag !== undefined) {
    keys.push("tagMonto")
  }
  if (partial.necesitaGasolina === false) {
    keys.push(
      "gasolinaTarjeta",
      "gasolinaPlaca",
      "gasolinaKilometraje",
      "gasolinaMonto",
      "gasolinaDistancia"
    )
  }
  if (partial.necesitaTag === false) {
    keys.push("tagMonto")
  }
  return keys
}

function collectTripSubmitFieldErrors(
  trip: TravelRequestTripData,
  fuelCards: Array<{ id: number; cardNumber: string }>
): TravelRequestTripSubmitFieldErrors {
  const e: TravelRequestTripSubmitFieldErrors = {}
  if (!trip.destinoViaje.trim()) {
    e.destinoViaje = "Indica el destino del viaje."
  }
  if (!trip.motivoViaje.trim()) {
    e.motivoViaje = "Indica el motivo o las actividades."
  }
  if (!trip.fechaSalida.trim()) {
    e.fechaSalida = "Selecciona la fecha de salida."
  }
  if (!trip.fechaRegreso.trim()) {
    e.fechaRegreso = "Selecciona la fecha de regreso."
  }
  if (!trip.fechaDispersion.trim()) {
    e.fechaDispersion = "Selecciona la fecha de dispersión."
  }
  const objetivosConTexto = trip.objetivos.filter(
    (objective) => objective.trim().length > 0
  )
  if (objetivosConTexto.length < 3) {
    e.objetivos = "Agrega al menos 3 objetivos con descripción."
  }
  if (sumGastosFormTrip(trip.gastos) <= 0) {
    e.gastosEstimados =
      "Registra al menos un monto mayor a cero en alguna categoría de gastos estimados."
  }
  if (trip.necesitaGasolina) {
    if (!trip.tarjetaGasolina.trim()) {
      e.gasolinaTarjeta = "Selecciona la tarjeta de gasolina."
    } else if (resolveFuelCardId(trip.tarjetaGasolina, fuelCards) === null) {
      e.gasolinaTarjeta = "La tarjeta seleccionada no es válida."
    }
    if (!trip.placa.trim()) {
      e.gasolinaPlaca = "Indica la placa del vehículo."
    }
    const kilometraje = parseNullableNumber(trip.kilometraje)
    if (kilometraje === null || kilometraje < 0) {
      e.gasolinaKilometraje = "Indica el kilometraje actual (odómetro)."
    }
    const montoGasolina = parseNullableNumber(trip.montoGasolina)
    if (montoGasolina === null || montoGasolina <= 0) {
      e.gasolinaMonto = "Indica el monto solicitado de gasolina."
    }
    const distanciaKm = parseNullableNumber(trip.distancia)
    if (distanciaKm === null || distanciaKm <= 0) {
      e.gasolinaDistancia = "Indica la distancia a recorrer en km."
    }
  }
  if (trip.necesitaTag) {
    const montoTag = parseNullableNumber(trip.montoTag)
    if (montoTag === null || montoTag <= 0) {
      e.tagMonto = "Indica el monto solicitado para TAG."
    }
  }
  return e
}

function buildValidationToastMessage(
  erroresPorViaje: Record<number, TravelRequestTripSubmitFieldErrors>,
  totalTripsInForm: number
): string {
  const intro = "Revisa el formulario antes de enviar."
  const indicesOrdenados = Object.keys(erroresPorViaje)
    .map(Number)
    .sort((a, b) => a - b)

  if (totalTripsInForm <= 1) {
    const indice = indicesOrdenados[0]
    const err =
      indice !== undefined ? erroresPorViaje[indice] : undefined
    const labels = listMissingSubmitFieldLabels(err)
    if (labels.length === 0) {
      return `${intro} Hay campos incompletos.`
    }
    return `${intro} Falta: ${joinSpanishList(labels)}.`
  }

  const bloques: string[] = []
  for (const indice of indicesOrdenados) {
    const labels = listMissingSubmitFieldLabels(erroresPorViaje[indice])
    if (labels.length === 0) {
      bloques.push(`Viaje ${indice + 1}: hay datos incompletos.`)
      continue
    }
    bloques.push(
      `Viaje ${indice + 1}: falta ${joinSpanishList(labels)}.`
    )
  }
  return `${intro} ${bloques.join(" ")}`
}

function listMissingSubmitFieldLabels(
  errors: TravelRequestTripSubmitFieldErrors | undefined
): string[] {
  if (!errors) {
    return []
  }
  const labels: string[] = []
  if (errors.destinoViaje) {
    labels.push("destino del viaje")
  }
  if (errors.motivoViaje) {
    labels.push("motivo o actividades")
  }
  if (errors.fechaSalida) {
    labels.push("fecha de salida")
  }
  if (errors.fechaRegreso) {
    labels.push("fecha de regreso")
  }
  if (errors.fechaDispersion) {
    labels.push("fecha de dispersión")
  }
  if (errors.gastosEstimados) {
    labels.push("al menos un gasto estimado mayor a cero")
  }
  if (errors.objetivos) {
    labels.push("al menos 3 objetivos con descripción")
  }
  if (errors.gasolinaTarjeta) {
    labels.push("tarjeta de gasolina")
  }
  if (errors.gasolinaPlaca) {
    labels.push("placa del vehículo")
  }
  if (errors.gasolinaKilometraje) {
    labels.push("kilometraje (odómetro)")
  }
  if (errors.gasolinaMonto) {
    labels.push("monto de gasolina")
  }
  if (errors.gasolinaDistancia) {
    labels.push("distancia a recorrer (km)")
  }
  if (errors.tagMonto) {
    labels.push("monto del TAG")
  }
  return labels
}

function joinSpanishList(partes: readonly string[]): string {
  if (partes.length === 0) {
    return ""
  }
  if (partes.length === 1) {
    return partes[0]!
  }
  if (partes.length === 2) {
    return `${partes[0]} y ${partes[1]}`
  }
  return `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`
}

function sumGastosFormTrip(gastos: TravelRequestTripData["gastos"]): number {
  return (
    parseInputNumber(gastos.transporte) +
    parseInputNumber(gastos.peajes) +
    parseInputNumber(gastos.hospedaje) +
    parseInputNumber(gastos.alimentos) +
    parseInputNumber(gastos.fletes) +
    parseInputNumber(gastos.herramientas) +
    parseInputNumber(gastos.envios) +
    parseInputNumber(gastos.miscelaneos)
  )
}

function reindexErrorsAfterRemoval<T>(
  prev: Record<number, T>,
  removedIndex: number
): Record<number, T> {
  const next: Record<number, T> = {}
  for (const [key, value] of Object.entries(prev)) {
    const index = Number(key)
    if (index === removedIndex) {
      continue
    }
    const newIndex = index > removedIndex ? index - 1 : index
    next[newIndex] = value
  }
  return next
}

function buildTripPayloadForApi(
  trip: TravelRequestTripData,
  fuelCards: Array<{ id: number; cardNumber: string }>
): Record<string, unknown> {
  return {
    destinoViaje: trip.destinoViaje,
    motivoViaje: trip.motivoViaje,
    fechaSalida: trip.fechaSalida,
    fechaRegreso: trip.fechaRegreso,
    fechaDispersion: trip.fechaDispersion,
    gastos: {
      transporte: parseInputNumber(trip.gastos.transporte),
      peajes: parseInputNumber(trip.gastos.peajes),
      hospedaje: parseInputNumber(trip.gastos.hospedaje),
      alimentos: parseInputNumber(trip.gastos.alimentos),
      fletes: parseInputNumber(trip.gastos.fletes),
      herramientas: parseInputNumber(trip.gastos.herramientas),
      envios: parseInputNumber(trip.gastos.envios),
      miscelaneos: parseInputNumber(trip.gastos.miscelaneos),
    },
    objetivos: trip.objetivos.filter(
      (objective) => objective.trim().length > 0
    ),
    gasolina: {
      necesitaGasolina: trip.necesitaGasolina,
      cardId: resolveFuelCardId(trip.tarjetaGasolina, fuelCards),
      placa: trip.placa || null,
      kilometrajeActualKm: parseNullableNumber(trip.kilometraje),
      montoSolicitado: parseNullableNumber(trip.montoGasolina),
      distanciaKm: parseNullableNumber(trip.distancia),
      comentarios: trip.comentariosGasolina || null,
    },
    tag: {
      necesitaTag: trip.necesitaTag,
      montoSolicitado: parseNullableNumber(trip.montoTag),
      comentarios: trip.comentariosTag || null,
    },
  }
}

function resolveFuelCardId(
  selectedCardNumber: string,
  fuelCards: Array<{ id: number; cardNumber: string }>
): number | null {
  const matchedCard = fuelCards.find(
    (fuelCard) => fuelCard.cardNumber === selectedCardNumber
  )
  return matchedCard?.id ?? null
}

function parseInputNumber(value: string): number {
  const parsedValue = Number.parseFloat(value)
  if (!Number.isFinite(parsedValue)) {
    return 0
  }
  return parsedValue
}

function parseNullableNumber(value: string): number | null {
  const parsedValue = Number.parseFloat(value)
  if (!Number.isFinite(parsedValue)) {
    return null
  }
  return parsedValue
}

function getOptionId(
  options: readonly string[],
  selected: string
): number | null {
  const optionIndex = options.findIndex((option) => option === selected)
  if (optionIndex < 0) {
    return null
  }
  return optionIndex + 1
}
