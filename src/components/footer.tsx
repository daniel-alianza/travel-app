export function Footer() {
    return (
      <footer className="border-t border-border/50 bg-gradient-to-b from-background to-secondary/20 mt-auto">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Columna 1: Información de la empresa */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg gradient-orange flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-base">FG</span>
                </div>
                <span className="font-bold text-lg">Portal Grupo FG</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sistema integral de gestión de viáticos empresariales
              </p>
            </div>
  
            {/* Columna 2: Enlaces rápidos */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Enlaces Rápidos</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Política de Viáticos</span>
                </a>
              </div>
            </div>
          </div>
  
          {/* Línea divisoria */}
          <div className="border-t border-border/50 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground text-center md:text-left">
                © 2025 Portal Grupo FG. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  