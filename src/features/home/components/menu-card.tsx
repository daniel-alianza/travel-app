import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface MenuCardProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}

export function MenuCard({ icon: Icon, label, onClick, className }: MenuCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card overflow-hidden relative",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-8 md:p-10 gap-5 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 group-hover:from-primary/15 group-hover:to-primary/8 transition-all duration-300 group-hover:scale-105">
            <Icon
              className="h-10 w-10 md:h-12 md:w-12 text-primary group-hover:text-primary transition-colors"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-base md:text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
            {label}
          </h3>

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span>Acceder</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
