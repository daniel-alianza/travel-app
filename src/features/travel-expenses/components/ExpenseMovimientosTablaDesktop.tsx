import { CheckCircle2, Clock3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  formatearFechaCorta,
  formatearMonedaViatico,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimientosTablaDesktopProps } from "@/features/travel-expenses/interfaces/expense-movimientos-tabla-desktop-props.interface"
import { cn } from "@/lib/utils"

export function ExpenseMovimientosTablaDesktop({
  movimientos,
  onSolicitarComprobacion,
}: ExpenseMovimientosTablaDesktopProps) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-border/50 lg:block">
      <table className="w-full min-w-[720px] border-collapse text-center text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="px-4 py-3 text-center font-semibold">Movimiento</th>
            <th className="px-4 py-3 text-center font-semibold">Fecha</th>
            <th className="px-4 py-3 text-center font-semibold">Descripción</th>
            <th className="px-4 py-3 text-center font-semibold">Tarjeta</th>
            <th className="px-4 py-3 text-center font-semibold">Gasto</th>
            <th className="px-4 py-3 text-center font-semibold">Estado</th>
            <th className="px-4 py-3 text-center font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((mov) => (
            <tr
              key={mov.id}
              className={cn(
                "border-b border-border/40 transition-colors duration-300",
                mov.estado === "comprobado"
                  ? "bg-emerald-500/8 hover:bg-emerald-500/12"
                  : "bg-amber-500/6 hover:bg-amber-500/10"
              )}
            >
              <td className="relative px-4 py-3 font-mono text-xs tabular-nums">
                <span
                  className={cn(
                    "absolute top-2 bottom-2 left-0 w-1 rounded-full",
                    mov.estado === "comprobado" ? "bg-emerald-500" : "bg-amber-500"
                  )}
                  aria-hidden
                />
                {mov.numeroMovimiento}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatearFechaCorta(mov.fecha)}
              </td>
              <td className="max-w-[260px] px-4 py-3 align-middle">
                <span className="mx-auto block max-w-[240px] line-clamp-2 text-pretty">
                  {mov.descripcion}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                {mov.numeroTarjeta}
              </td>
              <td className="px-4 py-3 font-bold tabular-nums text-accent whitespace-nowrap">
                {formatearMonedaViatico(mov.gasto)}
              </td>
              <td className="px-4 py-3 align-middle">
                <div className="flex justify-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                      mov.estado === "comprobado"
                        ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                        : "bg-amber-500/15 text-amber-900 dark:text-amber-100"
                    )}
                  >
                    {mov.estado === "comprobado" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    ) : (
                      <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                    {mov.estado === "comprobado" ? "Comprobado" : "Pendiente"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 align-middle">
                <div className="flex justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant={mov.estado === "comprobado" ? "secondary" : "default"}
                    disabled={mov.estado === "comprobado"}
                    className="cursor-pointer rounded-xl whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed"
                    onClick={() => {
                      if (mov.estado !== "comprobado") {
                        onSolicitarComprobacion(mov)
                      }
                    }}
                  >
                    {mov.estado === "comprobado" ? "Comprobado" : "Comprobar"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
