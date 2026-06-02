import { Briefcase, Building2, Loader2, MapPin } from "lucide-react"
import { Controller } from "react-hook-form"

import { TravelRequestSelectDropdown } from "@/features/travel-request/components/TravelRequestSelectDropdown"
import type { GasolineRequestCompanySectionProps } from "@/features/gasoline/interfaces/gasoline-request-company-section-props.interface"

export function GasolineRequestCompanySection({
  page,
}: GasolineRequestCompanySectionProps) {
  const {
    mounted,
    catalogoCarga,
    catalogoError,
    muestraSucursal,
    opcionesEmpresa,
    opcionesSucursal,
    opcionesArea,
    empresa,
    control,
    formState,
    dropdownOpen,
    setDropdownOpen,
    focusedField,
    setFocusedField,
    onEmpresaChange,
    onSucursalChange,
    onAreaChange,
  } = page

  return (
    <section
      className={`relative z-40 rounded-3xl border border-border/50 bg-card p-6 shadow-lg transition-all delay-100 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        Información de la empresa
      </h2>

      {catalogoCarga ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Cargando catálogo de empresa, sucursal y área…
        </div>
      ) : catalogoError !== null ? (
        <div
          className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-4 text-sm text-destructive"
          role="alert"
        >
          {catalogoError}
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${muestraSucursal ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
        >
          <Controller
            name="empresa"
            control={control}
            render={({ field }) => (
              <TravelRequestSelectDropdown
                label="Empresa"
                value={field.value}
                options={opcionesEmpresa}
                onChange={(valor) => {
                  field.onChange(valor)
                  onEmpresaChange()
                }}
                placeholder={
                  opcionesEmpresa.length > 0
                    ? "Seleccionar empresa"
                    : "Sin empresas disponibles"
                }
                icon={Building2}
                id="gasolina-empresa"
                disabled={opcionesEmpresa.length === 0}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                error={formState.errors.empresa?.message}
              />
            )}
          />
          {muestraSucursal ? (
            <Controller
              name="sucursal"
              control={control}
              render={({ field }) => (
                <TravelRequestSelectDropdown
                  label="Sucursal *"
                  value={field.value ?? ""}
                  options={opcionesSucursal}
                  onChange={(valor) => {
                    field.onChange(valor)
                    onSucursalChange()
                  }}
                  placeholder={
                    !empresa
                      ? "Primero seleccione empresa"
                      : opcionesSucursal.length > 0
                        ? "Seleccionar sucursal"
                        : "Sin sucursales para esta empresa"
                  }
                  icon={MapPin}
                  id="gasolina-sucursal"
                  disabled={!empresa}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  error={formState.errors.sucursal?.message}
                />
              )}
            />
          ) : null}
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <TravelRequestSelectDropdown
                label="Área"
                value={field.value}
                options={opcionesArea}
                onChange={(valor) => {
                  field.onChange(valor)
                  onAreaChange()
                }}
                placeholder={
                  opcionesArea.length > 0
                    ? "Seleccionar área"
                    : "Sin áreas disponibles"
                }
                icon={Briefcase}
                id="gasolina-area"
                disabled={opcionesArea.length === 0}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                error={formState.errors.area?.message}
              />
            )}
          />
        </div>
      )}
    </section>
  )
}
