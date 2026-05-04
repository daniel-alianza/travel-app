import { useEffect, useMemo, useRef, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import {
  absolutoARelativo,
  calcularMontoNetoDispersion,
  esperar,
  filaCumpleRequisitosMontoParaDispersion,
  mapearItemDispersionApiAFila,
} from "@/features/dispersion-travel/hooks/dispersion-page-helpers"
import type { FilaDispersion } from "@/features/dispersion-travel/interfaces/dispersion-fila.interface"
import {
  confirmTravelRequestDispersion,
  fetchDispersionQueue,
} from "@/features/dispersion-travel/services/dispersion-travel-api"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import {
  calcularTotalPaginas,
  limitarPagina,
} from "@/lib/list-pagination-helpers"

const TAMANOS_PAGINA_DISPERSION = [5, 8, 12] as const
const TAMANO_PAGINA_DISPERSION_DEFECTO = 8

export function useDispersionPage() {
  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [filas, setFilas] = useState<FilaDispersion[]>([])
  const [cargaInicialDispersion, setCargaInicialDispersion] = useState(true)
  const [seleccion, setSeleccion] = useState<Set<number>>(new Set())
  const [pagina, setPagina] = useState(1)
  const [tamanoPagina, setTamanoPagina] = useState(
    TAMANO_PAGINA_DISPERSION_DEFECTO
  )
  const [dropdownPillAbierto, setDropdownPillAbierto] = useState<
    string | null
  >(null)
  const [rechazoIdsPendientes, setRechazoIdsPendientes] = useState<
    number[] | null
  >(null)
  const [comentarioRechazo, setComentarioRechazo] = useState("")
  const [fechaReporteDesde, setFechaReporteDesde] = useState("")
  const [fechaReporteHasta, setFechaReporteHasta] = useState("")
  const [accionCargando, setAccionCargando] = useState<string | null>(null)
  const selectAllRef = useRef<HTMLInputElement>(null)

  const ocupado = accionCargando !== null

  const totalPaginas = useMemo(
    () => calcularTotalPaginas(filas.length, tamanoPagina),
    [filas.length, tamanoPagina]
  )

  const paginaEfectiva = useMemo(
    () => limitarPagina(pagina, totalPaginas),
    [pagina, totalPaginas]
  )

  const indiceInicio = (paginaEfectiva - 1) * tamanoPagina
  const filasPagina = useMemo(
    () => filas.slice(indiceInicio, indiceInicio + tamanoPagina),
    [filas, indiceInicio, tamanoPagina]
  )

  const idsEnPagina = useMemo(
    () => filasPagina.map((f) => f.id),
    [filasPagina]
  )

  const seleccionEfectiva = useMemo(() => {
    const permitidos = new Set(filas.map((f) => f.id))
    const resultado = new Set<number>()
    for (const id of seleccion) {
      if (permitidos.has(id)) {
        resultado.add(id)
      }
    }
    return resultado
  }, [filas, seleccion])

  const cantidadSeleccionadas = seleccionEfectiva.size

  const seleccionadasEnPagina = useMemo(
    () => idsEnPagina.filter((id) => seleccionEfectiva.has(id)).length,
    [idsEnPagina, seleccionEfectiva]
  )

  const todasSeleccionadas =
    idsEnPagina.length > 0 &&
    seleccionadasEnPagina === idsEnPagina.length

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadDispersionQueue(): Promise<void> {
      try {
        const items = await fetchDispersionQueue()
        if (isMounted) {
          setFilas(items.map(mapearItemDispersionApiAFila))
        }
      } catch {
        showAppToast(
          "No se pudieron cargar las solicitudes aprobadas para dispersión.",
          "error"
        )
        if (isMounted) {
          setFilas([])
        }
      } finally {
        if (isMounted) {
          setCargaInicialDispersion(false)
        }
      }
    }

    void loadDispersionQueue()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const el = selectAllRef.current
    if (el) {
      el.indeterminate =
        seleccionadasEnPagina > 0 && !todasSeleccionadas
    }
  }, [seleccionadasEnPagina, todasSeleccionadas])

  useEffect(() => {
    if (rechazoIdsPendientes === null) {
      return
    }
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setRechazoIdsPendientes(null)
        setComentarioRechazo("")
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [rechazoIdsPendientes])

  function actualizarFila(
    id: number,
    patch: Partial<
      Pick<FilaDispersion, "signoAjuste" | "montoAAjustar" | "montoEsAbsoluto">
    >
  ): void {
    setFilas((prev) =>
      prev.map((f) => {
        if (f.id !== id) {
          return f
        }
        if (f.montoEsAbsoluto) {
          const rel = absolutoARelativo(f)
          let siguiente: FilaDispersion = {
            ...f,
            ...rel,
          }
          if ("signoAjuste" in patch) {
            siguiente = {
              ...siguiente,
              signoAjuste: patch.signoAjuste!,
            }
          }
          if ("montoAAjustar" in patch) {
            siguiente = {
              ...siguiente,
              montoAAjustar: patch.montoAAjustar!,
            }
          }
          if ("montoEsAbsoluto" in patch) {
            siguiente = { ...siguiente, montoEsAbsoluto: patch.montoEsAbsoluto! }
          }
          return siguiente
        }
        const siguiente = { ...f, ...patch }
        if ("signoAjuste" in patch || "montoAAjustar" in patch) {
          siguiente.montoEsAbsoluto = false
        }
        return siguiente
      })
    )
  }

  function convertirAbsolutoADeltaEnFila(id: number): void {
    setFilas((prev) =>
      prev.map((f) => {
        if (f.id !== id || !f.montoEsAbsoluto) {
          return f
        }
        return { ...f, ...absolutoARelativo(f) }
      })
    )
  }

  async function aplicarAjustesMontos(): Promise<void> {
    if (filas.length === 0 || ocupado) {
      return
    }
    setAccionCargando("aplicar")
    try {
      await esperar(520)
      setFilas((prev) =>
        prev.map((f) => {
          const montoNeto = calcularMontoNetoDispersion(f)
          return {
            ...f,
            montoAAjustar: String(Math.round(montoNeto)),
            signoAjuste: "+",
            montoEsAbsoluto: true,
          }
        })
      )
      showAppToast(
        "Monto neto colocado en «Monto a ajustar» y signo en «+ Aumenta».",
        "success"
      )
    } finally {
      setAccionCargando(null)
    }
  }

  function alternarSeleccion(id: number): void {
    setSeleccion((prev) => {
      const siguiente = new Set(prev)
      if (siguiente.has(id)) {
        siguiente.delete(id)
      } else {
        siguiente.add(id)
      }
      return siguiente
    })
  }

  function seleccionarPaginaActual(): void {
    setSeleccion((prev) => {
      const siguiente = new Set(prev)
      idsEnPagina.forEach((id) => siguiente.add(id))
      return siguiente
    })
  }

  function quitarSeleccion(): void {
    setSeleccion(new Set<number>())
  }

  function alternarSeleccionarTodas(): void {
    const todosMarcados =
      idsEnPagina.length > 0 &&
      idsEnPagina.every((id) => seleccionEfectiva.has(id))
    setSeleccion((prev) => {
      const siguiente = new Set(prev)
      if (todosMarcados) {
        idsEnPagina.forEach((id) => siguiente.delete(id))
      } else {
        idsEnPagina.forEach((id) => siguiente.add(id))
      }
      return siguiente
    })
  }

  function quitarFilasPorIds(ids: number[]): void {
    const conjunto = new Set(ids)
    setFilas((prev) => prev.filter((f) => !conjunto.has(f.id)))
    setSeleccion((prev) => {
      const siguiente = new Set(prev)
      ids.forEach((id) => siguiente.delete(id))
      return siguiente
    })
  }

  async function dispersarPorIds(ids: number[]): Promise<void> {
    if (ids.length === 0 || ocupado) {
      return
    }
    const porId = new Map(filas.map((f) => [f.id, f]))
    for (const id of ids) {
      const fila = porId.get(id)
      if (!fila || !filaCumpleRequisitosMontoParaDispersion(fila)) {
        showAppToast(
          `Completa el monto a dispersar para la solicitud ${id} (o usa «Aplicar ajustes de montos»).`,
          "error"
        )
        return
      }
      const neto = calcularMontoNetoDispersion(fila)
      if (neto <= 0) {
        showAppToast(
          `El monto neto a dispersar debe ser mayor a cero (solicitud ${id}).`,
          "error"
        )
        return
      }
    }

    const clave =
      ids.length === 1 ? `dispersar-${ids[0]}` : "dispersar-masivo"
    setAccionCargando(clave)
    try {
      await Promise.all(
        ids.map((id) => {
          const fila = porId.get(id)
          if (!fila) {
            return Promise.resolve()
          }
          const total = Math.round(calcularMontoNetoDispersion(fila))
          return confirmTravelRequestDispersion(id, total, null)
        })
      )
      quitarFilasPorIds(ids)
      showAppToast(
        ids.length === 1
          ? "Solicitud dispersada correctamente."
          : `${ids.length} solicitudes dispersadas correctamente.`,
        "success"
      )
    } catch {
      showAppToast(
        "No se pudo confirmar la dispersión en el servidor. Revisa los montos o el estado de la solicitud.",
        "error"
      )
      try {
        const items = await fetchDispersionQueue()
        setFilas(items.map(mapearItemDispersionApiAFila))
      } catch {
        setFilas([])
      }
    } finally {
      setAccionCargando(null)
    }
  }

  function rechazarDispersionPorIds(ids: number[]): void {
    if (ids.length === 0) {
      return
    }
    quitarFilasPorIds(ids)
    showAppToast(
      ids.length === 1
        ? "Dispersión rechazada para la solicitud."
        : `Dispersión rechazada para ${ids.length} solicitudes.`,
      "info"
    )
  }

  function abrirModalRechazo(ids: number[]): void {
    if (ids.length === 0 || ocupado) {
      return
    }
    setComentarioRechazo("")
    setRechazoIdsPendientes(ids)
  }

  function cerrarModalRechazo(): void {
    setRechazoIdsPendientes(null)
    setComentarioRechazo("")
  }

  async function confirmarRechazoConComentario(): Promise<void> {
    if (rechazoIdsPendientes === null || rechazoIdsPendientes.length === 0) {
      return
    }
    if (comentarioRechazo.trim().length === 0 || ocupado) {
      return
    }
    const ids = rechazoIdsPendientes
    setAccionCargando("rechazo-modal")
    try {
      await esperar(500)
      rechazarDispersionPorIds(ids)
      cerrarModalRechazo()
    } finally {
      setAccionCargando(null)
    }
  }

  const puedeConfirmarRechazo = comentarioRechazo.trim().length > 0

  async function generarReporteDispersionExcel(): Promise<void> {
    if (ocupado) {
      return
    }
    setAccionCargando("reporte")
    try {
      await esperar(720)
    } finally {
      setAccionCargando(null)
    }
  }

  function onPaginaAnterior(): void {
    setPagina((p) => Math.max(1, p - 1))
  }

  function onPaginaSiguiente(): void {
    setPagina((p) => Math.min(totalPaginas, p + 1))
  }

  function onCambiarTamanoPagina(nuevo: number): void {
    if (!TAMANOS_PAGINA_DISPERSION.some((n) => n === nuevo)) {
      return
    }
    setTamanoPagina(nuevo)
  }

  return {
    mousePosition,
    cargaInicialDispersion,
    filas: filasPagina,
    totalFilasRegistro: filas.length,
    pagina: paginaEfectiva,
    totalPaginas,
    tamanoPagina,
    opcionesTamanoPagina: TAMANOS_PAGINA_DISPERSION,
    onPaginaAnterior,
    onPaginaSiguiente,
    onCambiarTamanoPagina,
    ocupado,
    seleccionEfectiva,
    cantidadSeleccionadas,
    todasSeleccionadas,
    dropdownPillAbierto,
    setDropdownPillAbierto,
    rechazoIdsPendientes,
    comentarioRechazo,
    setComentarioRechazo,
    fechaReporteDesde,
    setFechaReporteDesde,
    fechaReporteHasta,
    setFechaReporteHasta,
    accionCargando,
    selectAllRef,
    actualizarFila,
    convertirAbsolutoADeltaEnFila,
    aplicarAjustesMontos,
    alternarSeleccion,
    alternarSeleccionarTodas,
    seleccionarPaginaActual,
    quitarSeleccion,
    dispersarPorIds,
    abrirModalRechazo,
    cerrarModalRechazo,
    confirmarRechazoConComentario,
    puedeConfirmarRechazo,
    generarReporteDispersionExcel,
  }
}
