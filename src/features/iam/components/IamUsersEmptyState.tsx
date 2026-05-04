import { Users } from "lucide-react"

import { Button } from "@/components/ui/button"

type IamUsersEmptyStateProps = {
  onLimpiarFiltros: () => void
}

export function IamUsersEmptyState({ onLimpiarFiltros }: IamUsersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/20 py-20 text-center shadow-sm">
      <Users className="size-14 text-muted-foreground/50" aria-hidden />
      <p className="text-sm font-medium text-foreground">
        No hay usuarios que coincidan con la búsqueda
      </p>
      <Button
        type="button"
        variant="ghost"
        className="cursor-pointer rounded-xl"
        onClick={onLimpiarFiltros}
      >
        Limpiar filtros
      </Button>
    </div>
  )
}
