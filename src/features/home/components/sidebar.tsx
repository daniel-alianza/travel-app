import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, Wallet, Send, CheckCircle, CreditCard, Receipt, X } from "lucide-react"
import { ComprobacionesModal } from "./comprobaciones-modal"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { icon: FileText, label: "Crear Solicitud", href: "#crear" },
  { icon: Wallet, label: "Solicitudes de Viáticos", href: "#solicitudes" },
  { icon: Send, label: "Dispersión de Viáticos", href: "#dispersion" },
  { icon: CheckCircle, label: "Autorización Contable", href: "#autorizacion" },
  { icon: CreditCard, label: "Asignación de Tarjeta", href: "#tarjeta" },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("Crear Solicitud")
  const [showComprobaciones, setShowComprobaciones] = useState(false)

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card transition-transform duration-300 md:sticky md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Botón cerrar en móvil */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="font-semibold">Menú</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={activeItem === item.label ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeItem === item.label && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                )}
                onClick={() => {
                  setActiveItem(item.label)
                  onClose()
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Button>
            ))}

            <Button
              variant={activeItem === "Comprobaciones" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                activeItem === "Comprobaciones" && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
              )}
              onClick={() => {
                setActiveItem("Comprobaciones")
                setShowComprobaciones(true)
              }}
            >
              <Receipt className="h-5 w-5" />
              <span className="text-sm">Comprobaciones de Viáticos</span>
            </Button>
          </nav>

          {/* Footer del sidebar */}
          <div className="border-t border-border p-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">¿Necesitas ayuda?</p>
              <Button variant="link" className="h-auto p-0 text-xs text-primary">
                Contactar soporte
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <ComprobacionesModal open={showComprobaciones} onOpenChange={setShowComprobaciones} />
    </>
  )
}
