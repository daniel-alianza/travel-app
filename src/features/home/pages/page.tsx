import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuCard } from "../components/menu-card"
import { ComprobacionesModal } from "../components/comprobaciones-modal"
import { FileText, FileStack, Send, CheckCircle, CreditCard, Receipt } from "lucide-react"

export default function DashboardPage() {
  const [showComprobaciones, setShowComprobaciones] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-16 md:mb-24 space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/30 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-semibold text-primary">Dashboard Principal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
              Bienvenido de nuevo,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Administrador
              </span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto text-pretty">
              Gestiona todas tus operaciones de viáticos desde un solo lugar
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              <MenuCard icon={FileText} label="Crear Solicitud" />
              <MenuCard icon={FileStack} label="Solicitudes de Viáticos" />
              <MenuCard icon={Send} label="Dispersión de Viáticos" />
              <MenuCard icon={CheckCircle} label="Autorización Contable" />
              <MenuCard icon={CreditCard} label="Asignación de Tarjeta" />
              <MenuCard icon={Receipt} label="Comprobaciones de Viáticos" onClick={() => setShowComprobaciones(true)} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ComprobacionesModal open={showComprobaciones} onOpenChange={setShowComprobaciones} />
    </div>
  )
}
