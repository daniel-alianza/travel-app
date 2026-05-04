import { Briefcase, Building2, CreditCard, MapPin, User } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TravelRequestSelectDropdown } from "@/features/travel-request/components/TravelRequestSelectDropdown"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestCompanySectionProps {
  model: TravelRequestPageModel
}

export function TravelRequestCompanySection({
  model,
}: TravelRequestCompanySectionProps) {
  const {
    mounted,
    empresas,
    sucursales,
    areas,
    empresa,
    setEmpresa,
    sucursal,
    setSucursal,
    area,
    setArea,
    nombreEmpleado,
    setNombreEmpleado,
    numeroTarjeta,
    setNumeroTarjeta,
    viaticCards,
    isFormDataLocked,
    dropdownOpen,
    setDropdownOpen,
    focusedField,
    setFocusedField,
  } = model

  return (
    <section
      className={`relative z-40 rounded-3xl border border-border/50 bg-card p-6 shadow-lg transition-all delay-100 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        Información de la Empresa
      </h2>

      <div className="mb-6 rounded-2xl border border-primary/10 bg-primary/[0.03] p-4 sm:p-5">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Empleado solicitante
        </p>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <User className="h-4 w-4 text-primary" />
            Nombre del empleado
          </Label>
          <Input
            value={nombreEmpleado}
            onChange={(e) => setNombreEmpleado(e.target.value)}
            disabled={isFormDataLocked}
            placeholder="Nombre completo"
            className="h-12 max-w-xl rounded-2xl border-2 transition-all duration-500 focus:scale-[1.01] focus:shadow-lg focus:shadow-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <TravelRequestSelectDropdown
          label="Empresa"
          value={empresa}
          options={empresas}
          onChange={(val) => {
            setEmpresa(val)
            setSucursal("")
          }}
          placeholder="Seleccionar empresa"
          icon={Building2}
          id="empresa"
          disabled={isFormDataLocked}
          showChevron={!isFormDataLocked}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
        />
        <TravelRequestSelectDropdown
          label="Sucursal"
          value={sucursal}
          options={empresa ? (sucursales[empresa] ?? []) : []}
          onChange={setSucursal}
          placeholder={
            empresa ? "Seleccionar sucursal" : "Primero seleccione empresa"
          }
          icon={MapPin}
          id="sucursal"
          disabled={isFormDataLocked || !empresa}
          showChevron={!isFormDataLocked}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
        />
        <TravelRequestSelectDropdown
          label="Área"
          value={area}
          options={areas}
          onChange={setArea}
          placeholder={
            sucursal ? "Seleccionar área" : "Primero seleccione sucursal"
          }
          icon={Briefcase}
          id="area"
          disabled={isFormDataLocked || !sucursal}
          showChevron={!isFormDataLocked}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
        />
        <TravelRequestSelectDropdown
          label="Número de Tarjeta"
          value={numeroTarjeta}
          options={viaticCards.map((card) => card.cardNumber)}
          onChange={setNumeroTarjeta}
          placeholder="Seleccionar tarjeta viatic"
          icon={CreditCard}
          id="numero-tarjeta"
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
        />
      </div>
    </section>
  )
}
