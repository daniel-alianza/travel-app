import { Building2, Briefcase, CreditCard, MapPin, User } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestCompanyCompactBannerProps {
  model: TravelRequestPageModel
}

export function TravelRequestCompanyCompactBanner({
  model,
}: TravelRequestCompanyCompactBannerProps) {
  const {
    empresa,
    sucursal,
    area,
    nombreEmpleado,
    numeroTarjeta,
    mounted,
    viaticCards,
    isFormDataLocked,
  } = model

  const tarjetaCorta =
    numeroTarjeta.replace(/\s/g, "").length >= 4
      ? `···${numeroTarjeta.replace(/\s/g, "").slice(-4)}`
      : numeroTarjeta || "—"

  const nombreMostrar = nombreEmpleado.trim() || "Nombre no indicado"
  const areaMostrar = area.trim() || "Área no indicada"

  return (
    <div
      className={cn(
        "animate-travel-company-banner rounded-2xl border border-primary/15 bg-gradient-to-br from-card via-card to-primary/[0.04] p-4 shadow-md shadow-primary/5 transition-all duration-500 ease-out sm:p-5",
        mounted
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0"
      )}
    >
      <div className="mb-4 rounded-xl border border-border/50 bg-background/60 p-3 shadow-sm sm:p-4">
        <p className="text-[0.65rem] font-semibold tracking-wider text-muted-foreground uppercase">
          Empleado solicitante
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
            <User className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{nombreMostrar}</span>
          </span>
          <span className="hidden text-muted-foreground sm:inline">·</span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Briefcase className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{areaMostrar}</span>
          </span>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 border-b border-border/50 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shadow-inner shadow-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-[0.65rem] font-semibold tracking-wider text-muted-foreground uppercase">
            Empresa (solicitud actual)
          </p>
          <p className="text-sm font-semibold text-foreground">
            Datos aplicados a todos los viajes
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <span
          className="inline-flex cursor-default items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-sm shadow-sm transition-shadow duration-300 hover:shadow-md"
          title={empresa || undefined}
        >
          <Building2 className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="max-w-48 truncate font-medium">
            {empresa || "Empresa —"}
          </span>
        </span>
        <span className="inline-flex cursor-default items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-sm shadow-sm transition-shadow duration-300 hover:shadow-md">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="max-w-40 truncate font-medium">
            {sucursal || "Sucursal —"}
          </span>
        </span>
        <span className="inline-flex cursor-default items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-sm shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CreditCard className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="font-mono text-xs font-medium tracking-wide">
            {viaticCards.length === 0 ? "Sin tarjeta viático" : tarjetaCorta}
          </span>
        </span>
      </div>

      {isFormDataLocked && viaticCards.length === 0 ? (
        <p
          className="mt-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-950 dark:text-amber-100"
          role="alert"
        >
          No tienes tarjeta viático asignada: no puedes solicitar viáticos. Comunícate
          con <span className="font-semibold">administración</span> o{" "}
          <span className="font-semibold">contabilidad</span> para que te asignen una.
        </p>
      ) : null}
    </div>
  )
}
