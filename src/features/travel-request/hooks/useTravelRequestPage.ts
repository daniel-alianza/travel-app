import { useEffect, useState, type ChangeEvent } from "react"
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
  const [numeroTarjeta, setNumeroTarjeta] = useState("5161020004149101")
  const [viaticCards, setViaticCards] = useState<
    Array<{ id: number; cardNumber: string }>
  >([])
  const [fuelCards, setFuelCards] = useState<
    Array<{ id: number; cardNumber: string }>
  >([])
  const [fuelCardsLoaded, setFuelCardsLoaded] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null)
  const [isFormDataLocked, setIsFormDataLocked] = useState(false)

  const [trips, setTrips] = useState<TravelRequestTripData[]>(() => [
    createEmptyTravelRequestTrip(),
  ])

  const [viajeCorreccionId, setViajeCorreccionId] = useState<number | null>(null)

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const [ocupado, setOcupado] = useState(false)
  const [policyNotices, setPolicyNotices] = useState<TravelRequestPolicyNoticeApi[]>(
    []
  )
  const [focusedField, setFocusedField] = useState<string | null>(null)

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

        const viajeMeta = detalle.viajes.find((viaje) => viaje.tripId === viajeId)
        if (!viajeMeta || viajeMeta.estadoViaje !== "rejected") {
          showAppToast(
            "Ese viaje no está rechazado o no pertenece a la solicitud.",
            "error"
          )
          navigate("/travel-request/solicitudes", { replace: true })
          return
        }

        try {
          const fuelCardsResponse = await fetchUserFuelCards(AUTHENTICATED_USER_ID)
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

  function updateTrip(
    tripIndex: number,
    partial: Partial<TravelRequestTripData>
  ): void {
    setTrips((prev) =>
      prev.map((trip, i) => (i === tripIndex ? { ...trip, ...partial } : trip))
    )
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
      showAppToast(
        "No se pudieron cargar las tarjetas de gasolina.",
        "error"
      )
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
    setOcupado(true)
    try {
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
        if (!fuelCardsLoaded) {
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
        const tripPayload = buildTripPayloadForApi(trip, tarjetasCombustible)
        await correctRejectedTravelTrip(viajeCorreccionId, {
          userId: AUTHENTICATED_USER_ID,
          trip: tripPayload,
        })
        showAppToast("Viaje corregido y reenviado a revisión.", "success")
        navigate("/travel-request/solicitudes")
        return
      }

      const companyId = selectedCompanyId ?? getOptionId(empresas, empresa)
      const branchId = selectedBranchId ?? getOptionId(sucursales[empresa] ?? [], sucursal)
      const areaId = selectedAreaId ?? getOptionId(areas, area)

      if (!companyId || !branchId || !areaId) {
        showAppToast(
          "No se pudieron resolver empresa, sucursal o área para enviar.",
          "error"
        )
        return
      }

      const payload = {
        userId: AUTHENTICATED_USER_ID,
        companyId,
        branchId,
        areaId,
        employeeName: nombreEmpleado,
        corporateCardNumber: numeroTarjeta,
        trips: trips.map((trip) => ({
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
          objetivos: trip.objetivos.filter((objective) => objective.trim().length > 0),
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
        })),
      }

      await createTravelRequest(payload)
      showAppToast("Solicitud enviada correctamente.", "success")
      navigate("/home")
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

function mapViajeDetalleATrip(viaje: TravelRequestDetalleViajeApi): TravelRequestTripData {
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
    objetivos: trip.objetivos.filter((objective) => objective.trim().length > 0),
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

function getOptionId(options: readonly string[], selected: string): number | null {
  const optionIndex = options.findIndex((option) => option === selected)
  if (optionIndex < 0) {
    return null
  }
  return optionIndex + 1
}
