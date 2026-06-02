import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react"
import { Check, ChevronDown, CreditCard, Loader2 } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { GasolineCardSelection } from "@/features/gasoline/interfaces/gasoline-card-selection.interface"
import {
  fetchGasolineCards,
  type GasolineCardSearchItem,
} from "@/features/gasoline/services/gasoline-api"

export type { GasolineCardSelection }

interface GasolineCardSearchSelectProps {
  label: string
  companyId: number | null
  value: GasolineCardSelection | null
  onChange: (selection: GasolineCardSelection | null) => void
  disabled?: boolean
  error?: string | null
  icon?: ComponentType<{ className?: string }>
  id?: string
}

function cardItemKey(card: GasolineCardSearchItem): string {
  return `${card.cardId ?? "noid"}-${card.sapCode}-${card.cardNumberMasked}`
}

function filtrarTarjetasGasolina(
  cards: GasolineCardSearchItem[],
  searchText: string
): GasolineCardSearchItem[] {
  const texto = searchText.trim()
  if (texto.length < 2) {
    return cards
  }

  const textoMinusculas = texto.toLowerCase()
  const soloDigitos = texto.replace(/\D/g, "")

  return cards.filter((card) => {
    if (card.name.toLowerCase().includes(textoMinusculas)) {
      return true
    }
    if (soloDigitos.length >= 2) {
      return card.cardNumberMasked.replace(/\D/g, "").includes(soloDigitos)
    }
    return false
  })
}

export function GasolineCardSearchSelect({
  label,
  companyId,
  value,
  onChange,
  disabled = false,
  error = null,
  icon: Icon = CreditCard,
  id: campoId = "gasolina-tarjeta",
}: GasolineCardSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [allCards, setAllCards] = useState<GasolineCardSearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const options = useMemo(
    () => filtrarTarjetasGasolina(allCards, searchText),
    [allCards, searchText]
  )

  useEffect(() => {
    if (companyId === null) {
      setAllCards([])
      setSearchError(null)
      return
    }

    let activo = true
    setLoading(true)
    setSearchError(null)

    void fetchGasolineCards({ companyId })
      .then((cards) => {
        if (activo) {
          setAllCards(cards)
        }
      })
      .catch(() => {
        if (activo) {
          setAllCards([])
          setSearchError("No se pudieron cargar las tarjetas.")
        }
      })
      .finally(() => {
        if (activo) {
          setLoading(false)
        }
      })

    return () => {
      activo = false
    }
  }, [companyId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        containerRef.current !== null &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleOpen(): void {
    if (disabled || companyId === null) {
      return
    }
    setOpen(true)
    setSearchText("")
  }

  const displayValue =
    value !== null ? (
      <span className="flex min-w-0 flex-col text-left">
        <span className="truncate font-medium text-foreground">
          {value.name}
        </span>
        <span className="truncate font-mono text-xs text-muted-foreground">
          {value.cardNumberMasked}
        </span>
      </span>
    ) : null

  const placeholder =
    companyId === null
      ? "Selecciona empresa primero"
      : loading
        ? "Cargando tarjetas…"
        : "Buscar tarjeta…"

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <div className="relative">
        <button
          id={campoId}
          type="button"
          disabled={disabled || companyId === null}
          onClick={() => {
            if (open) {
              setOpen(false)
              return
            }
            handleOpen()
          }}
          aria-invalid={Boolean(error)}
          className={`group flex min-h-12 w-full items-center justify-between rounded-2xl border-2 bg-card px-4 py-2 text-left transition-all duration-500 ${
            disabled || companyId === null
              ? "cursor-not-allowed border-border opacity-50"
              : error
                ? "border-destructive/70 shadow-md shadow-destructive/10"
                : open
                  ? "scale-[1.01] border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:shadow-md"
          }`}
        >
          <span className="min-w-0 flex-1">
            {displayValue ?? (
              <span className="text-sm text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            className={`ml-2 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-500 ${
              open ? "rotate-180 text-primary" : "group-hover:text-primary"
            }`}
          />
        </button>

        <div
          className={`absolute z-50 mt-2 w-full origin-top overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl transition-all duration-500 ${
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="border-b border-border p-3">
            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Escribe los últimos 4 dígitos o el nombre…"
              className="h-10 rounded-xl border-2 text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto py-2">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Cargando tarjetas…
              </div>
            ) : searchError !== null ? (
              <p className="px-4 py-3 text-sm text-destructive" role="alert">
                {searchError}
              </p>
            ) : options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                {searchText.trim().length >= 2
                  ? "No se encontraron tarjetas."
                  : allCards.length === 0
                    ? "No hay tarjetas activas para esta empresa. Ejecuta el seed de tarjetas o revisa el catálogo."
                    : "No se encontraron tarjetas."}
              </p>
            ) : (
              options.map((card) => {
                const selected =
                  value !== null &&
                  value.cardId !== null &&
                  value.cardId === card.cardId

                return (
                  <button
                    key={cardItemKey(card)}
                    type="button"
                    onClick={() => {
                      onChange({
                        sapCode: card.sapCode,
                        cardId: card.cardId,
                        cardNumberMasked: card.cardNumberMasked,
                        name: card.name,
                      })
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-300 hover:bg-primary/10 ${
                      selected
                        ? "bg-primary/5 text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {card.name}
                      </span>
                      <span className="block truncate font-mono text-xs text-muted-foreground">
                        {card.cardNumberMasked}
                      </span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
      {error ? (
        <span className="block text-xs text-destructive">{error}</span>
      ) : null}
    </div>
  )
}
