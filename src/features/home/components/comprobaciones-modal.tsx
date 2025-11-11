import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users, User, ArrowRight } from "lucide-react"

interface ComprobacionesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComprobacionesModal({ open, onOpenChange }: ComprobacionesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="space-y-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></div>
            <DialogTitle className="text-2xl md:text-3xl font-bold">Comprobaciones de Viáticos</DialogTitle>
          </div>
          <DialogDescription className="text-base text-muted-foreground">
            Selecciona el tipo de comprobación que deseas consultar
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-8">
          <Button
            variant="outline"
            className="group h-auto flex items-center gap-5 p-7 hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            onClick={() => {
              onOpenChange(false)
            }}
          >
            <div className="flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 p-4 group-hover:from-primary/30 group-hover:to-primary/15 transition-all">
              <Users className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-left space-y-1">
              <p className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                Comprobación por Colaborador
              </p>
              <p className="text-sm text-muted-foreground">Ver comprobaciones de todos los colaboradores del equipo</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
          </Button>

          <Button
            variant="outline"
            className="group h-auto flex items-center gap-5 p-7 hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            onClick={() => {
              onOpenChange(false)
            }}
          >
            <div className="flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 p-4 group-hover:from-primary/30 group-hover:to-primary/15 transition-all">
              <User className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-left space-y-1">
              <p className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Mis Comprobaciones</p>
              <p className="text-sm text-muted-foreground">Ver únicamente tus comprobaciones personales</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
