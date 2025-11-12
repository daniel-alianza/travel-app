import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuCardProps {
  icon: LucideIcon
  label: string
  description: string
  onClick?: () => void
  className?: string
}

const MenuCard = ({ icon: Icon, label, description, onClick, className }: MenuCardProps) => {
  return (
    <div
      className={cn(
        "flip-card-container cursor-pointer h-full min-h-[280px]",
        className,
      )}
      onClick={onClick}
    >
      <div className="flip-card-inner">
        {/* Frente de la card */}
        <div className="flip-card-front">
          <div className="flex flex-col items-center justify-center p-8 md:p-10 gap-5 h-full">
            <div className="relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5">
                <Icon
                  className="h-10 w-10 md:h-12 md:w-12 text-primary"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-foreground leading-tight">
                {label}
              </h3>
            </div>
          </div>
        </div>

        {/* Dorso de la card (descripción) */}
        <div className="flip-card-back">
          <div className="flex flex-col items-center justify-center p-6 md:p-8 gap-4 h-full w-full">
            <div className="text-center space-y-3">
              <h3 className="text-sm md:text-base font-semibold text-primary leading-tight">
                {label}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-500 leading-relaxed px-3">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuCard
