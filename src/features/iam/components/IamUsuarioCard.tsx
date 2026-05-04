import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
  ShieldOff,
  UserCog,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DEFINICIONES_PERMISOS,
  POLITICAS_CORPORATIVAS,
  ROLES_IAM,
} from "@/features/iam/interfaces/iam-constants"
import type { UsuarioIam } from "@/features/iam/interfaces/iam-domain.interface"
import {
  esRolIam,
  formatearFechaPoliticas,
  inicialesDesdeUsuario,
  nombreCompletoDesdePartes,
} from "@/features/iam/hooks/iam-page-helpers"
import { cn } from "@/lib/utils"

export type IamUsuarioCardProps = {
  usuario: UsuarioIam
  index: number
  guardandoId: string | null
  actualizandoContrasenaId: string | null
  actualizandoLista: boolean
  obtenerCamposContrasena: (
    idUsuario: string,
  ) => { nueva: string; confirmar: string }
  establecerCamposContrasena: (
    idUsuario: string,
    parcial: Partial<{ nueva: string; confirmar: string }>,
  ) => void
  actualizarUsuario: (
    id: string,
    parcial: Partial<
      Omit<UsuarioIam, "id" | "permisos" | "aceptacionesPoliticas">
    > & {
      permisos?: string[]
    },
  ) => void
  alternarPermiso: (
    idUsuario: string,
    idPermiso: string,
    marcado: boolean,
  ) => void
  aplicarActualizacionContrasena: (usuario: UsuarioIam) => Promise<void>
  guardarUsuario: (usuario: UsuarioIam) => Promise<void>
}

export function IamUsuarioCard({
  usuario,
  index,
  guardandoId,
  actualizandoContrasenaId,
  actualizandoLista,
  obtenerCamposContrasena,
  establecerCamposContrasena,
  actualizarUsuario,
  alternarPermiso,
  aplicarActualizacionContrasena,
  guardarUsuario,
}: IamUsuarioCardProps) {
  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 shadow-lg shadow-black/5 backdrop-blur-md",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-2xl hover:shadow-indigo-500/10",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2",
        !usuario.activo && "opacity-90",
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-24 rotate-12 rounded-full bg-linear-to-br from-indigo-500/10 to-violet-500/10 blur-2xl transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-sm font-semibold text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3",
              usuario.activo
                ? "from-indigo-500 to-violet-600 shadow-indigo-500/25"
                : "from-muted to-muted-foreground/40 shadow-none",
            )}
          >
            {inicialesDesdeUsuario(usuario)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">
              {nombreCompletoDesdePartes(usuario)}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {usuario.correoElectronico}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Activo
            </span>
            <Switch
              checked={usuario.activo}
              onCheckedChange={(v) => {
                actualizarUsuario(usuario.id, { activo: v })
              }}
              className="cursor-pointer"
              aria-label={`Usuario ${nombreCompletoDesdePartes(usuario)} activo`}
            />
          </div>
        </div>
      </div>

      <div className="relative mt-4 grid gap-3">
        <div className="grid gap-1.5 sm:grid-cols-3 sm:gap-3">
          <div className="grid gap-1.5 sm:col-span-3">
            <Label htmlFor={`iam-nombres-${usuario.id}`} className="text-xs">
              Nombre(s)
            </Label>
            <Input
              id={`iam-nombres-${usuario.id}`}
              value={usuario.nombres}
              onChange={(e) => {
                actualizarUsuario(usuario.id, {
                  nombres: e.target.value,
                })
              }}
              placeholder="Ej. María Fernanda"
              className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 shadow-sm transition-shadow focus-visible:ring-primary/25"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`iam-ap-${usuario.id}`} className="text-xs">
              Apellido paterno
            </Label>
            <Input
              id={`iam-ap-${usuario.id}`}
              value={usuario.apellidoPaterno}
              onChange={(e) => {
                actualizarUsuario(usuario.id, {
                  apellidoPaterno: e.target.value,
                })
              }}
              className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 shadow-sm"
            />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor={`iam-am-${usuario.id}`} className="text-xs">
              Apellido materno
            </Label>
            <Input
              id={`iam-am-${usuario.id}`}
              value={usuario.apellidoMaterno}
              onChange={(e) => {
                actualizarUsuario(usuario.id, {
                  apellidoMaterno: e.target.value,
                })
              }}
              placeholder="Opcional"
              className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 shadow-sm"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label
            htmlFor={`iam-jefe-${usuario.id}`}
            className="flex items-center gap-2 text-xs"
          >
            <UserCog className="size-3.5 text-muted-foreground" aria-hidden />
            Jefe directo
          </Label>
          <Input
            id={`iam-jefe-${usuario.id}`}
            value={usuario.jefeDirecto}
            onChange={(e) => {
              actualizarUsuario(usuario.id, {
                jefeDirecto: e.target.value,
              })
            }}
            placeholder="Nombre del responsable inmediato"
            className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 shadow-sm"
          />
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor={`iam-correo-${usuario.id}`} className="text-xs">
              Correo
            </Label>
            <Input
              id={`iam-correo-${usuario.id}`}
              type="email"
              value={usuario.correoElectronico}
              onChange={(e) => {
                actualizarUsuario(usuario.id, {
                  correoElectronico: e.target.value,
                })
              }}
              className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 text-sm shadow-sm"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`iam-tel-${usuario.id}`} className="text-xs">
              Teléfono
            </Label>
            <Input
              id={`iam-tel-${usuario.id}`}
              value={usuario.telefono}
              onChange={(e) => {
                actualizarUsuario(usuario.id, {
                  telefono: e.target.value,
                })
              }}
              className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 text-sm shadow-sm"
            />
          </div>
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor={`iam-area-${usuario.id}`} className="text-xs">
              Área
            </Label>
            <Input
              id={`iam-area-${usuario.id}`}
              value={usuario.area}
              onChange={(e) => {
                actualizarUsuario(usuario.id, { area: e.target.value })
              }}
              className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 text-sm shadow-sm"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`iam-depto-${usuario.id}`} className="text-xs">
              Departamento
            </Label>
            <Input
              id={`iam-depto-${usuario.id}`}
              value={usuario.departamento}
              onChange={(e) => {
                actualizarUsuario(usuario.id, {
                  departamento: e.target.value,
                })
              }}
              className="h-10 cursor-text rounded-xl border-border/70 bg-background/80 text-sm shadow-sm"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`iam-rol-${usuario.id}`} className="text-xs">
            Rol
          </Label>
          <select
            id={`iam-rol-${usuario.id}`}
            value={usuario.rol}
            onChange={(e) => {
              const valor = e.target.value
              if (esRolIam(valor)) {
                actualizarUsuario(usuario.id, { rol: valor })
              }
            }}
            className={cn(
              "h-10 w-full cursor-pointer rounded-xl border border-border/70 bg-background/80 px-3 text-sm text-foreground shadow-sm",
              "outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            {ROLES_IAM.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative mt-4 rounded-xl border border-border/50 bg-muted/20 p-3 shadow-inner transition-colors duration-300 group-hover:bg-muted/30">
        <div className="mb-3 flex items-center gap-2">
          <KeyRound className="size-4 text-primary" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Actualizar contraseña
          </span>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
          Define una nueva contraseña de acceso. Mínimo 8 caracteres. La
          confirmación debe coincidir.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-1">
            <Label
              htmlFor={`iam-pw-nueva-${usuario.id}`}
              className="text-[11px] text-muted-foreground"
            >
              Nueva contraseña
            </Label>
            <Input
              id={`iam-pw-nueva-${usuario.id}`}
              type="password"
              autoComplete="new-password"
              value={obtenerCamposContrasena(usuario.id).nueva}
              onChange={(e) => {
                establecerCamposContrasena(usuario.id, {
                  nueva: e.target.value,
                })
              }}
              className="h-9 cursor-text rounded-lg border-border/70 bg-background/80 text-sm"
            />
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor={`iam-pw-conf-${usuario.id}`}
              className="text-[11px] text-muted-foreground"
            >
              Confirmar contraseña
            </Label>
            <Input
              id={`iam-pw-conf-${usuario.id}`}
              type="password"
              autoComplete="new-password"
              value={obtenerCamposContrasena(usuario.id).confirmar}
              onChange={(e) => {
                establecerCamposContrasena(usuario.id, {
                  confirmar: e.target.value,
                })
              }}
              className="h-9 cursor-text rounded-lg border-border/70 bg-background/80 text-sm"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={
            actualizandoContrasenaId === usuario.id ||
            actualizandoLista ||
            obtenerCamposContrasena(usuario.id).nueva.length === 0
          }
          className="mt-3 w-full cursor-pointer rounded-xl shadow-sm transition-all hover:scale-[1.01] sm:w-auto"
          onClick={() => {
            void aplicarActualizacionContrasena(usuario)
          }}
        >
          {actualizandoContrasenaId === usuario.id ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <KeyRound className="size-4" aria-hidden />
          )}
          Actualizar contraseña
        </Button>
      </div>

      <div className="relative mt-4 rounded-xl border border-border/50 bg-muted/20 p-3 shadow-inner transition-colors duration-300 group-hover:bg-muted/30">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Políticas corporativas
            </span>
          </div>
          <span className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Solo consulta
          </span>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
          Información que quedó registrada cuando el colaborador aceptó cada
          documento en el sistema. No se edita desde este panel.
        </p>
        <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {POLITICAS_CORPORATIVAS.map((pol) => {
            const reg = usuario.aceptacionesPoliticas[pol.id] ?? {
              declaroLecturaYAceptacion: false,
              fechaAceptacion: null,
            }
            const aceptoConFecha =
              reg.declaroLecturaYAceptacion === true &&
              reg.fechaAceptacion !== null
            return (
              <div
                key={pol.id}
                className={cn(
                  "rounded-xl border border-border/40 bg-background/50 p-2.5 shadow-sm",
                  aceptoConFecha && "border-emerald-500/20 bg-emerald-500/[0.06]",
                )}
              >
                <p className="text-xs font-semibold text-foreground">
                  {pol.titulo}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pol.descripcion}
                </p>
                <div className="mt-2 border-t border-border/40 pt-2">
                  {aceptoConFecha ? (
                    <p className="text-[11px] leading-relaxed text-foreground">
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
                        Aceptó
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        el{" "}
                      </span>
                      <time
                        dateTime={reg.fechaAceptacion ?? undefined}
                        className="font-medium text-foreground"
                      >
                        {formatearFechaPoliticas(reg.fechaAceptacion)}
                      </time>
                    </p>
                  ) : null}
                  {!aceptoConFecha && reg.declaroLecturaYAceptacion ? (
                    <p className="text-[11px] text-amber-800 dark:text-amber-200">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                        Aceptación registrada sin fecha en el sistema.
                      </span>
                    </p>
                  ) : null}
                  {!aceptoConFecha && !reg.declaroLecturaYAceptacion ? (
                    <p className="text-[11px] text-muted-foreground">
                      No consta aceptación de este documento.
                    </p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Permisos
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {usuario.permisos.length}/{DEFINICIONES_PERMISOS.length}
          </span>
        </div>
        <div className="grid max-h-48 gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {DEFINICIONES_PERMISOS.map((def) => {
            const marcado = usuario.permisos.includes(def.id)
            return (
              <label
                key={def.id}
                htmlFor={`perm-${usuario.id}-${def.id}`}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-all duration-200",
                  "hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm",
                  marcado && "border-primary/15 bg-primary/5",
                )}
              >
                <Checkbox
                  id={`perm-${usuario.id}-${def.id}`}
                  checked={marcado}
                  onChange={(e) => {
                    alternarPermiso(usuario.id, def.id, e.target.checked)
                  }}
                  className="mt-0.5 cursor-pointer"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-foreground">
                    {def.etiqueta}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {def.descripcion}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {usuario.activo ? (
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
          ) : (
            <ShieldOff className="size-4 text-muted-foreground" aria-hidden />
          )}
          <span>
            Cuenta {usuario.activo ? "habilitada en el sistema" : "desactivada"}
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={guardandoId === usuario.id || actualizandoLista}
          className="cursor-pointer gap-2 rounded-xl shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          onClick={() => {
            void guardarUsuario(usuario)
          }}
        >
          {guardandoId === usuario.id ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4 transition-transform group-hover:rotate-12" aria-hidden />
          )}
          Guardar
        </Button>
      </div>
    </article>
  )
}
