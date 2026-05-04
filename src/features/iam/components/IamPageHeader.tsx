import { Loader2, RefreshCw, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"

type IamPageHeaderProps = {
  cargandoInicial: boolean
  actualizandoLista: boolean
  onActualizarLista: () => void
}

export function IamPageHeader({
  cargandoInicial,
  actualizandoLista,
  onActualizarLista,
}: IamPageHeaderProps) {
  return (
    <div className="mb-8 translate-y-0 opacity-100 transition-all duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="group flex h-14 w-14 shrink-0 cursor-default items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/35">
            <Shield className="h-7 w-7 text-white transition-transform duration-500 group-hover:rotate-[-8deg]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Gestión de usuarios y permisos
            </h1>
            <p className="text-pretty text-muted-foreground">
              Administra cuentas, permisos y cumplimiento de políticas corporativas
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={cargandoInicial || actualizandoLista}
          className="h-10 shrink-0 cursor-pointer gap-2 rounded-xl border-border/80 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          onClick={onActualizarLista}
        >
          {actualizandoLista ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="size-4 transition-transform duration-500 hover:rotate-180" aria-hidden />
          )}
          Actualizar lista
        </Button>
      </div>
    </div>
  )
}
