import { Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { GasolineRequestSubmitBarProps } from "@/features/gasoline/interfaces/gasoline-request-submit-bar-props.interface"

export function GasolineRequestSubmitBar({
  mounted,
  enviando,
  deshabilitado,
}: GasolineRequestSubmitBarProps) {
  return (
    <div
      className={`flex justify-end transition-all delay-500 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <Button
        type="submit"
        disabled={deshabilitado}
        className="h-12 cursor-pointer rounded-2xl px-8 shadow-lg shadow-orange-500/20 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"
      >
        {enviando ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar solicitud
          </>
        )}
      </Button>
    </div>
  )
}
