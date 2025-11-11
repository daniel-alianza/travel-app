import { Button } from "@/components/ui/button"
import { Settings, LogOut, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()
  const [daysUntilEndOfMonth, setDaysUntilEndOfMonth] = useState(0)

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date()
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const diff = Math.ceil((lastDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      setDaysUntilEndOfMonth(diff)
    }

    calculateDays()
    const interval = setInterval(calculateDays, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-11 w-11 rounded-xl gradient-orange flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">FG</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Portal Grupo FG</h1>
            <p className="text-xs text-muted-foreground">Sistema de Viáticos</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <Calendar className="h-4 w-4 text-primary" />
          <div className="text-sm">
            <span className="font-semibold text-primary">{daysUntilEndOfMonth}</span>
            <span className="text-muted-foreground ml-1">días para fin de mes</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            className="gradient-orange text-white shadow-md hover:shadow-lg transition-all"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
