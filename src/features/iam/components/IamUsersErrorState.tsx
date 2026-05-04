import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

type IamUsersErrorStateProps = {
  mensaje: string
  onReintentar: () => void
}

export function IamUsersErrorState({
  mensaje,
  onReintentar,
}: IamUsersErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center shadow-inner"
    >
      <AlertCircle className="size-12 text-destructive" aria-hidden />
      <p className="max-w-md text-sm text-muted-foreground">{mensaje}</p>
      <Button
        type="button"
        className="cursor-pointer rounded-xl shadow-md transition-transform hover:scale-[1.03] active:scale-[0.97]"
        onClick={onReintentar}
      >
        Reintentar
      </Button>
    </div>
  )
}
