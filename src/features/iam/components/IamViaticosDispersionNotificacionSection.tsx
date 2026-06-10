import { AlertCircle, Banknote, CheckCircle2, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AREA_TESORERIA_NOMBRE,
  REQUISITOS_NOTIFICACION_VIATICOS_DISPERSION,
} from "@/features/iam/interfaces/iam-constants"
import type { UsuarioIam } from "@/features/iam/interfaces/iam-domain.interface"
import {
  evaluarRequisitosNotificacionDispersionViaticos,
  nombreCompletoDesdePartes,
  usuarioRecibeAvisosDispersionViaticos,
  usuarioTienePermisoDispersarViaticosPorRol,
} from "@/features/iam/hooks/iam-page-helpers"
import { PERMISO_VIATICOS_DISPERSAR } from "@/features/auth/constants/auth-permissions"
import { cn } from "@/lib/utils"

export type IamViaticosDispersionNotificacionSectionProps = {
  usuario: UsuarioIam
  actualizarUsuario: (
    id: string,
    parcial: Partial<
      Pick<UsuarioIam, "area" | "activo" | "correoElectronico">
    >,
  ) => void
  alternarPermiso: (
    idUsuario: string,
    idPermiso: string,
    marcado: boolean,
  ) => void
}

export function IamViaticosDispersionNotificacionSection({
  usuario,
  actualizarUsuario,
  alternarPermiso,
}: IamViaticosDispersionNotificacionSectionProps) {
  const evaluacion = evaluarRequisitosNotificacionDispersionViaticos(usuario)
  const recibeAvisos = usuarioRecibeAvisosDispersionViaticos(usuario)
  const permisoPorRol = usuarioTienePermisoDispersarViaticosPorRol(usuario)
  const evaluacionPorId = new Map(evaluacion.map((item) => [item.id, item.cumplido]))

  function onConfigurarTesoreriaViaticos(): void {
    actualizarUsuario(usuario.id, {
      area: AREA_TESORERIA_NOMBRE,
      activo: true,
    })

    if (
      !usuario.permisos.includes(PERMISO_VIATICOS_DISPERSAR) &&
      !permisoPorRol
    ) {
      alternarPermiso(usuario.id, PERMISO_VIATICOS_DISPERSAR, true)
    }
  }

  return (
    <div className="relative mt-4 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-3 shadow-inner">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Banknote className="size-4 text-rose-600 dark:text-rose-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Viáticos — notificaciones de dispersión
          </span>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            recibeAvisos
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/15 text-amber-800 dark:text-amber-200",
          )}
        >
          {recibeAvisos ? (
            <>
              <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
              Recibe avisos
            </>
          ) : (
            <>
              <AlertCircle className="size-3.5 shrink-0" aria-hidden />
              No recibe avisos
            </>
          )}
        </span>
      </div>

      <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
        Cuando una solicitud de viáticos queda aprobada, el sistema envía correo
        y Teams a usuarios de Tesorería que cumplan todos los requisitos. Guarda
        los cambios con el botón Guardar.
      </p>

      <div className="grid gap-2">
        {REQUISITOS_NOTIFICACION_VIATICOS_DISPERSION.map((requisito) => {
          const cumplido = evaluacionPorId.get(requisito.id) ?? false
          return (
            <div
              key={requisito.id}
              className="flex items-start gap-2 rounded-lg border border-border/40 bg-background/50 px-3 py-2"
            >
              {cumplido ? (
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <AlertCircle
                  className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden
                />
              )}
              <span className="min-w-0">
                <span className="block text-xs font-medium text-foreground">
                  {requisito.etiqueta}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {requisito.descripcion}
                </span>
              </span>
            </div>
          )
        })}
      </div>

      {!recibeAvisos ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full cursor-pointer border-rose-500/30 bg-background/80 text-xs hover:bg-rose-500/10"
          onClick={onConfigurarTesoreriaViaticos}
        >
          <Wrench className="size-3.5 shrink-0" aria-hidden />
          Configurar perfil de Tesorería viáticos
        </Button>
      ) : null}

      <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
        Perfil: {nombreCompletoDesdePartes(usuario)} · Área actual:{" "}
        {usuario.area.trim().length > 0 ? usuario.area : "Sin área"}
        {permisoPorRol
          ? " · Permiso dispersión heredado del rol"
          : ""}
      </p>
    </div>
  )
}
