import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "radix-ui"
import { Loader2, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DispersionPillSelect } from "@/features/dispersion-travel/components/DispersionPillSelect"
import {
  estadoLineaCoincidenciaContrasena,
  type EstadoLineaCoincidenciaContrasenaIam,
} from "@/features/iam/hooks/iam-page-helpers"
import { resolverRolInicialDesdeCatalogo } from "@/features/iam/hooks/iam-page-helpers"
import type {
  IamRegistroCatalogItemApi,
  IamRegistroSucursalCatalogItemApi,
} from "@/features/iam/services/iam-travel-api"
import {
  iamRegistroUsuarioSchema,
  type IamRegistroUsuarioFormValues,
} from "@/features/iam/schemas/iam-registro-usuario.schema"
import { cn } from "@/lib/utils"

type IamRegistroUsuarioModalProps = {
  abierto: boolean
  enviando: boolean
  empresas: readonly IamRegistroCatalogItemApi[]
  areas: readonly IamRegistroCatalogItemApi[]
  sucursales: readonly IamRegistroSucursalCatalogItemApi[]
  rolesEtiqueta: readonly string[]
  onAbiertoChange: (abierto: boolean) => void
  onConfirmar: (valores: IamRegistroUsuarioFormValues) => Promise<void>
}

function mensajeCoincidenciaContrasena(
  estado: EstadoLineaCoincidenciaContrasenaIam,
): string | null {
  if (estado === "verde") {
    return "Las contraseñas coinciden."
  }
  if (estado === "rojo") {
    return "Las contraseñas no coinciden."
  }
  return null
}

function clasesBarraCoincidenciaContrasena(
  estado: EstadoLineaCoincidenciaContrasenaIam,
): string {
  switch (estado) {
    case "neutro":
      return "bg-muted/70"
    case "amarillo":
      return "bg-amber-400 dark:bg-amber-500"
    case "rojo":
      return "bg-red-500 dark:bg-red-500"
    case "verde":
      return "bg-emerald-500 dark:bg-emerald-400"
    default:
      return "bg-muted/70"
  }
}

function opcionesDesdeCatalogo(
  items: readonly IamRegistroCatalogItemApi[],
): ReadonlyArray<{ value: string; label: string }> {
  return items.map((item) => ({
    value: String(item.id),
    label: item.name,
  }))
}

export function IamRegistroUsuarioModal({
  abierto,
  enviando,
  empresas,
  areas,
  sucursales,
  rolesEtiqueta,
  onAbiertoChange,
  onConfirmar,
}: IamRegistroUsuarioModalProps) {
  const [dropdownModalAbierto, setDropdownModalAbierto] = useState<
    string | null
  >(null)

  const formulario = useForm<IamRegistroUsuarioFormValues>({
    resolver: zodResolver(iamRegistroUsuarioSchema),
    defaultValues: {
      nombre: "",
      correoElectronico: "",
      contrasena: "",
      contrasenaConfirmacion: "",
      empresaId: "",
      areaId: "",
      sucursalId: "",
      rol: "Colaborador",
    },
  })

  const { control, register, handleSubmit, reset, watch, formState, setValue, getValues } =
    formulario

  const empresaIdSeleccionada = watch("empresaId")
  const contrasena = watch("contrasena")
  const contrasenaConfirmacion = watch("contrasenaConfirmacion")

  const opcionesEmpresa = useMemo(
    () => opcionesDesdeCatalogo(empresas),
    [empresas],
  )
  const opcionesArea = useMemo(() => opcionesDesdeCatalogo(areas), [areas])
  const opcionesRol = useMemo(
    () =>
      rolesEtiqueta.map((rol) => ({
        value: rol,
        label: rol,
      })),
    [rolesEtiqueta],
  )

  const opcionesSucursal = useMemo(() => {
    const empresaNumerica = Number.parseInt(empresaIdSeleccionada, 10)
    const filtradas =
      empresaIdSeleccionada.length > 0 && Number.isFinite(empresaNumerica)
        ? sucursales.filter(
            (sucursal) =>
              sucursal.companyId === null ||
              sucursal.companyId === empresaNumerica,
          )
        : sucursales
    return opcionesDesdeCatalogo(filtradas)
  }, [empresaIdSeleccionada, sucursales])

  const estadoCoincidencia = estadoLineaCoincidenciaContrasena(
    contrasena,
    contrasenaConfirmacion,
  )
  const mensajeCoincidencia = mensajeCoincidenciaContrasena(estadoCoincidencia)

  useEffect(() => {
    if (abierto) {
      reset({
        nombre: "",
        correoElectronico: "",
        contrasena: "",
        contrasenaConfirmacion: "",
        empresaId: empresas[0] ? String(empresas[0].id) : "",
        areaId: areas[0] ? String(areas[0].id) : "",
        sucursalId: "",
        rol: resolverRolInicialDesdeCatalogo(rolesEtiqueta),
      })
      setDropdownModalAbierto(null)
    }
  }, [abierto, reset, empresas, areas, rolesEtiqueta])

  useEffect(() => {
    const sucursalActual = getValues("sucursalId")
    if (
      sucursalActual.length > 0 &&
      !opcionesSucursal.some((opcion) => opcion.value === sucursalActual)
    ) {
      setValue("sucursalId", "")
    }
  }, [getValues, setValue, opcionesSucursal])

  return (
    <Dialog.Root
      open={abierto}
      onOpenChange={(siguiente) => {
        if (!enviando) {
          onAbiertoChange(siguiente)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-md",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[min(92vh,720px)] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl duration-200",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
          onPointerDownOutside={(evento) => {
            if (enviando) {
              evento.preventDefault()
            }
          }}
          onEscapeKeyDown={(evento) => {
            if (enviando) {
              evento.preventDefault()
            }
          }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
                <UserPlus className="size-5 text-white" aria-hidden />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  Registrar usuario
                </Dialog.Title>
                <Dialog.Description className="text-pretty text-sm text-muted-foreground">
                  Crea una cuenta nueva. Después podrás ajustar permisos y jefe
                  directo en la tarjeta del usuario.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={enviando}
                className="shrink-0 cursor-pointer rounded-xl"
                aria-label="Cerrar"
              >
                <X className="size-4" aria-hidden />
              </Button>
            </Dialog.Close>
          </div>

          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={handleSubmit(async (valores) => {
              await onConfirmar(valores)
            })}
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div className="space-y-2">
                <Label htmlFor="iam-registro-nombre">Nombre completo</Label>
                <Input
                  id="iam-registro-nombre"
                  disabled={enviando}
                  className="rounded-xl"
                  {...register("nombre")}
                />
                {formState.errors.nombre ? (
                  <p className="text-xs text-destructive">
                    {formState.errors.nombre.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iam-registro-correo">Correo electrónico</Label>
                <Input
                  id="iam-registro-correo"
                  type="email"
                  autoComplete="off"
                  disabled={enviando}
                  className="rounded-xl"
                  {...register("correoElectronico")}
                />
                {formState.errors.correoElectronico ? (
                  <p className="text-xs text-destructive">
                    {formState.errors.correoElectronico.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="iam-registro-contrasena">Contraseña</Label>
                  <Input
                    id="iam-registro-contrasena"
                    type="password"
                    autoComplete="new-password"
                    disabled={enviando}
                    className="rounded-xl"
                    {...register("contrasena")}
                  />
                  {formState.errors.contrasena ? (
                    <p className="text-xs text-destructive">
                      {formState.errors.contrasena.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iam-registro-confirmar">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="iam-registro-confirmar"
                    type="password"
                    autoComplete="new-password"
                    disabled={enviando}
                    className="rounded-xl"
                    {...register("contrasenaConfirmacion")}
                  />
                  {formState.errors.contrasenaConfirmacion ? (
                    <p className="text-xs text-destructive">
                      {formState.errors.contrasenaConfirmacion.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-1">
                <div
                  className={cn(
                    "h-1.5 w-full overflow-hidden rounded-full transition-colors",
                    clasesBarraCoincidenciaContrasena(estadoCoincidencia),
                  )}
                />
                {mensajeCoincidencia ? (
                  <p
                    className={cn(
                      "text-xs",
                      estadoCoincidencia === "verde"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-destructive",
                    )}
                  >
                    {mensajeCoincidencia}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Empresa</Label>
                <Controller
                  control={control}
                  name="empresaId"
                  render={({ field }) => (
                    <DispersionPillSelect
                      instanceId="iam-registro-empresa"
                      value={field.value}
                      options={opcionesEmpresa}
                      onChange={field.onChange}
                      placeholder="Seleccionar empresa"
                      disabled={enviando || opcionesEmpresa.length === 0}
                      dropdownOpen={dropdownModalAbierto}
                      setDropdownOpen={setDropdownModalAbierto}
                      ariaLabel="Empresa del usuario"
                    />
                  )}
                />
                {formState.errors.empresaId ? (
                  <p className="text-xs text-destructive">
                    {formState.errors.empresaId.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Controller
                    control={control}
                    name="areaId"
                    render={({ field }) => (
                      <DispersionPillSelect
                        instanceId="iam-registro-area"
                        value={field.value}
                        options={opcionesArea}
                        onChange={field.onChange}
                        placeholder="Seleccionar área"
                        disabled={enviando || opcionesArea.length === 0}
                        dropdownOpen={dropdownModalAbierto}
                        setDropdownOpen={setDropdownModalAbierto}
                        ariaLabel="Área del usuario"
                      />
                    )}
                  />
                  {formState.errors.areaId ? (
                    <p className="text-xs text-destructive">
                      {formState.errors.areaId.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Controller
                    control={control}
                    name="sucursalId"
                    render={({ field }) => (
                      <DispersionPillSelect
                        instanceId="iam-registro-sucursal"
                        value={field.value}
                        options={opcionesSucursal}
                        onChange={field.onChange}
                        placeholder="Seleccionar sucursal"
                        disabled={enviando || opcionesSucursal.length === 0}
                        dropdownOpen={dropdownModalAbierto}
                        setDropdownOpen={setDropdownModalAbierto}
                        ariaLabel="Sucursal del usuario"
                      />
                    )}
                  />
                  {formState.errors.sucursalId ? (
                    <p className="text-xs text-destructive">
                      {formState.errors.sucursalId.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rol inicial</Label>
                <Controller
                  control={control}
                  name="rol"
                  render={({ field }) => (
                    <DispersionPillSelect
                      instanceId="iam-registro-rol"
                      value={field.value}
                      options={opcionesRol}
                      onChange={field.onChange}
                      placeholder="Seleccionar rol"
                      disabled={enviando || opcionesRol.length === 0}
                      dropdownOpen={dropdownModalAbierto}
                      setDropdownOpen={setDropdownModalAbierto}
                      ariaLabel="Rol del usuario"
                    />
                  )}
                />
                {formState.errors.rol ? (
                  <p className="text-xs text-destructive">
                    {formState.errors.rol.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border/60 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={enviando}
                className="cursor-pointer rounded-xl"
                onClick={() => {
                  onAbiertoChange(false)
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  enviando ||
                  opcionesEmpresa.length === 0 ||
                  opcionesRol.length === 0
                }
                className="cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Registrando…
                  </>
                ) : (
                  "Registrar usuario"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
