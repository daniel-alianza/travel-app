import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DISPERSION_BUTTON_INTERACTIVE_CLASS } from "@/features/dispersion-travel/hooks/dispersion-page-helpers"
import { DispersionPillSelect } from "@/features/dispersion-travel/components/DispersionPillSelect"
import { EMPRESAS_TARJETA } from "@/features/card-assignment/data/card-assignment-empresas"
import type { CardAssignmentUser } from "@/features/card-assignment/interfaces/card-assignment-user.interface"
import {
  asignacionTarjetaSchema,
  type AsignacionTarjetaFormValues,
} from "@/features/card-assignment/schemas/card-assignment-assign.schema"
import { cn } from "@/lib/utils"

interface CardAssignmentModalProps {
  usuario: CardAssignmentUser | null
  accionCargando: boolean
  onCerrar: () => void
  onConfirmar: (valores: AsignacionTarjetaFormValues) => void
}

function empresaPredeterminada(usuario: CardAssignmentUser): string {
  const coincide = EMPRESAS_TARJETA.find((e) => e === usuario.compania)
  return coincide ?? EMPRESAS_TARJETA[0]
}

export function CardAssignmentModal({
  usuario,
  accionCargando,
  onCerrar,
  onConfirmar,
}: CardAssignmentModalProps) {
  const [dropdownModalAbierto, setDropdownModalAbierto] = useState<
    string | null
  >(null)

  const formulario = useForm<AsignacionTarjetaFormValues>({
    resolver: zodResolver(asignacionTarjetaSchema),
    defaultValues: {
      digitosTarjeta: "",
      empresaTarjeta: EMPRESAS_TARJETA[0],
    },
  })

  const { control, register, handleSubmit, reset, formState } = formulario

  useEffect(() => {
    if (usuario) {
      reset({
        digitosTarjeta: "",
        empresaTarjeta: empresaPredeterminada(usuario),
      })
    }
  }, [usuario, reset])

  useEffect(() => {
    if (usuario === null) {
      return
    }
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape" && !accionCargando) {
        onCerrar()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [usuario, accionCargando, onCerrar])

  if (usuario === null) {
    return null
  }

  const opcionesEmpresa = EMPRESAS_TARJETA.map((e) => ({
    value: e,
    label: e,
  }))

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-asignar-tarjeta"
      onClick={() => {
        if (!accionCargando) {
          onCerrar()
        }
      }}
    >
      <div
        className="w-full max-w-lg scale-100 rounded-3xl border-2 border-border/70 bg-card p-6 shadow-2xl ring-1 ring-border/40 transition-all duration-300 ease-out hover:shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 cursor-default items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/25 transition-transform duration-500 hover:scale-105">
            <CreditCard className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3
              id="titulo-asignar-tarjeta"
              className="text-lg font-semibold text-foreground"
            >
              Asignar tarjeta
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {usuario.nombreCompleto}
              </span>
              <span className="block truncate text-xs">{usuario.correo}</span>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((valores) => onConfirmar(valores))}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label
              htmlFor="digitos-tarjeta-modal"
              className="text-foreground"
            >
              Número completo de la tarjeta
            </Label>
            <Input
              id="digitos-tarjeta-modal"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 4532 1234 5678 9010 (todos los dígitos)"
              disabled={accionCargando}
              aria-invalid={Boolean(formState.errors.digitosTarjeta)}
              className={cn(
                "h-12 cursor-text rounded-2xl border-2 bg-background/80 transition-all duration-300",
                "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
                formState.errors.digitosTarjeta && "border-destructive/60"
              )}
              {...register("digitosTarjeta")}
            />
            {formState.errors.digitosTarjeta ? (
              <p className="text-sm text-destructive" role="alert">
                {formState.errors.digitosTarjeta.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Obligatorio ingresar el PAN completo (13–19 dígitos). En listados
                solo se muestra enmascarado (últimos 4 dígitos).
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Empresa de la tarjeta</Label>
            <Controller
              name="empresaTarjeta"
              control={control}
              render={({ field }) => (
                <DispersionPillSelect
                  instanceId="modal-empresa-tarjeta"
                  value={field.value}
                  options={opcionesEmpresa}
                  onChange={field.onChange}
                  placeholder="Selecciona empresa"
                  disabled={accionCargando}
                  dropdownOpen={dropdownModalAbierto}
                  setDropdownOpen={setDropdownModalAbierto}
                  ariaLabel="Empresa emisora de la tarjeta"
                />
              )}
            />
            {formState.errors.empresaTarjeta ? (
              <p className="text-sm text-destructive" role="alert">
                {formState.errors.empresaTarjeta.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "cursor-pointer rounded-2xl",
                DISPERSION_BUTTON_INTERACTIVE_CLASS
              )}
              disabled={accionCargando}
              onClick={onCerrar}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={cn(
                "group cursor-pointer rounded-2xl shadow-md shadow-primary/15",
                DISPERSION_BUTTON_INTERACTIVE_CLASS
              )}
              disabled={accionCargando}
            >
              {accionCargando ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              ) : (
                <CreditCard className="mr-2 size-4 transition-transform duration-300 group-hover:-rotate-6" />
              )}
              {accionCargando ? "Asignando…" : "Confirmar asignación"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
