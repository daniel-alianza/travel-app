import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DISPERSION_BUTTON_INTERACTIVE_CLASS } from "@/features/dispersion-travel/hooks/dispersion-page-helpers"
import { DispersionPillSelect } from "@/features/dispersion-travel/components/DispersionPillSelect"
import type { CardAssignmentUser } from "@/features/card-assignment/interfaces/card-assignment-user.interface"
import {
  asignacionTarjetaSchema,
  type AsignacionTarjetaFormValues,
} from "@/features/card-assignment/schemas/card-assignment-assign.schema"
import { cn } from "@/lib/utils"

interface CardAssignmentModalProps {
  usuario: CardAssignmentUser | null
  tipoTarjeta: "VIATIC" | "FUEL"
  opcionesEmpresa: ReadonlyArray<{ value: string; label: string }>
  accionCargando: boolean
  onCerrar: () => void
  onConfirmar: (valores: AsignacionTarjetaFormValues) => void
}

function empresaPredeterminada(
  usuario: CardAssignmentUser,
  opcionesEmpresa: ReadonlyArray<{ value: string; label: string }>
): string {
  const coincide = opcionesEmpresa.find((e) => e.value === usuario.compania)
  if (coincide) {
    return coincide.value
  }
  return opcionesEmpresa[0]?.value ?? ""
}

export function CardAssignmentModal({
  usuario,
  tipoTarjeta,
  opcionesEmpresa,
  accionCargando,
  onCerrar,
  onConfirmar,
}: CardAssignmentModalProps) {
  const isFuelModal = tipoTarjeta === "FUEL"
  const etiquetaTipoTarjeta =
    tipoTarjeta === "FUEL" ? "tarjeta de gasolina" : "tarjeta de viáticos"
  const opcionesTipoTarjetaGasolina = [
    { value: "Fisica", label: "Física" },
    { value: "Virtual", label: "Virtual" },
  ] as const
  const opcionesTipoAsignacion = [
    { value: "No Acumulativa", label: "No Acumulativa" },
    { value: "Acumulable", label: "Acumulable" },
  ] as const

  const [dropdownModalAbierto, setDropdownModalAbierto] = useState<
    string | null
  >(null)

  const formulario = useForm<AsignacionTarjetaFormValues>({
    resolver: zodResolver(asignacionTarjetaSchema),
    defaultValues: {
      nombreTarjeta: "",
      digitosTarjeta: "",
      tipoTarjetaGasolina: "Fisica",
      tipoAsignacionGasolina: "No Acumulativa",
      grupoTarjetaGasolina: "Tarjetas Base",
      estadoTarjetaGasolina: "Activa",
      empresaTarjeta: opcionesEmpresa[0]?.value ?? "",
    },
  })

  const { control, register, handleSubmit, reset, formState } = formulario

  useEffect(() => {
    if (usuario) {
      reset({
        nombreTarjeta: "",
        digitosTarjeta: "",
        tipoTarjetaGasolina: "Fisica",
        tipoAsignacionGasolina: "No Acumulativa",
        grupoTarjetaGasolina: "Tarjetas Base",
        estadoTarjetaGasolina: "Activa",
        empresaTarjeta: empresaPredeterminada(usuario, opcionesEmpresa),
      })
    }
  }, [usuario, reset, opcionesEmpresa])

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
              {isFuelModal
                ? "Crear Tarjeta de Gasolina"
                : `Asignar ${etiquetaTipoTarjeta}`}
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
          {isFuelModal ? (
            <div className="space-y-2">
              <Label htmlFor="nombre-tarjeta-modal" className="text-foreground">
                Nombre de la Tarjeta
              </Label>
              <Input
                id="nombre-tarjeta-modal"
                type="text"
                autoComplete="off"
                placeholder="Ej. Tarjeta Operaciones Norte"
                disabled={accionCargando}
                className={cn(
                  "h-12 cursor-text rounded-2xl border-2 bg-background/80 transition-all duration-300",
                  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                )}
                {...register("nombreTarjeta")}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label
              htmlFor="digitos-tarjeta-modal"
              className="text-foreground"
            >
              {isFuelModal ? "Número de Tarjeta" : "Número completo de la tarjeta"}
            </Label>
            <Input
              id="digitos-tarjeta-modal"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder={
                isFuelModal
                  ? "13 o 16 dígitos (calcomanía o normal)"
                  : "Ej. 4532 1234 5678 9010 (todos los dígitos)"
              }
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
                {isFuelModal
                  ? "Calcomanía: 13 dígitos. Normal: 16 dígitos."
                  : "Obligatorio ingresar el PAN completo (13–19 dígitos). En listados solo se muestra enmascarado (últimos 4 dígitos)."}
              </p>
            )}
          </div>

          {isFuelModal ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Tipo de Tarjeta</Label>
                <Controller
                  name="tipoTarjetaGasolina"
                  control={control}
                  render={({ field }) => (
                    <DispersionPillSelect
                      instanceId="modal-tipo-tarjeta-gasolina"
                      value={field.value ?? ""}
                      options={opcionesTipoTarjetaGasolina}
                      onChange={field.onChange}
                      placeholder="Selecciona tipo de tarjeta"
                      disabled={accionCargando}
                      dropdownOpen={dropdownModalAbierto}
                      setDropdownOpen={setDropdownModalAbierto}
                      ariaLabel="Tipo de tarjeta de gasolina"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Tipo de Asignación</Label>
                <Controller
                  name="tipoAsignacionGasolina"
                  control={control}
                  render={({ field }) => (
                    <DispersionPillSelect
                      instanceId="modal-tipo-asignacion-gasolina"
                      value={field.value ?? ""}
                      options={opcionesTipoAsignacion}
                      onChange={field.onChange}
                      placeholder="Selecciona tipo de asignación"
                      disabled={accionCargando}
                      dropdownOpen={dropdownModalAbierto}
                      setDropdownOpen={setDropdownModalAbierto}
                      ariaLabel="Tipo de asignación de gasolina"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Grupo de Tarjetas</Label>
                <Controller
                  name="grupoTarjetaGasolina"
                  control={control}
                  render={({ field }) => (
                    <Input
                      value={field.value ?? "Tarjetas Base"}
                      readOnly
                      disabled
                      className="h-12 rounded-2xl border-2 bg-muted/50 text-foreground"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Estado</Label>
                <Controller
                  name="estadoTarjetaGasolina"
                  control={control}
                  render={({ field }) => (
                    <Input
                      value={field.value ?? "Activa"}
                      readOnly
                      disabled
                      className="h-12 rounded-2xl border-2 bg-muted/50 text-foreground"
                    />
                  )}
                />
              </div>
            </div>
          ) : null}

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
