import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { HomeBackground } from "@/features/home/components/HomeBackground"
import { HomeFuelModuleModal } from "@/features/home/components/HomeFuelModuleModal"
import { HomeHeroSection } from "@/features/home/components/HomeHeroSection"
import { HomeMenuGrid } from "@/features/home/components/HomeMenuGrid"
import { HomeSalesViaticosNotice } from "@/features/home/components/HomeSalesViaticosNotice"
import { useHomePage } from "@/features/home/hooks/useHomePage"

export function HomePage() {
  const {
    mounted,
    avisoViaticosVentas,
    cargandoAvisoViaticosVentas,
    mostrarSeccionAvisoViaticos,
    hoveredCard,
    mousePosition,
    menuOptions,
    opcionesGasolina,
    modalGasolinaAbierto,
    setModalGasolinaAbierto,
    handleMenuOptionSelect,
    handleFuelModuleOptionSelect,
    handleCardEnter,
    handleCardLeave,
  } = useHomePage()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <HomeBackground mousePosition={mousePosition} />

      <AppHeader mounted={mounted} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <HomeHeroSection mounted={mounted}>
            {mostrarSeccionAvisoViaticos ? (
              <div className="pt-5">
                <HomeSalesViaticosNotice
                  mounted={mounted}
                  cargando={cargandoAvisoViaticosVentas}
                  aviso={avisoViaticosVentas}
                />
              </div>
            ) : null}
          </HomeHeroSection>

          <HomeMenuGrid
            mounted={mounted}
            hoveredCard={hoveredCard}
            menuOptions={menuOptions}
            onMenuOptionSelect={handleMenuOptionSelect}
            onCardEnter={handleCardEnter}
            onCardLeave={handleCardLeave}
          />
        </div>
      </main>

      <HomeFuelModuleModal
        abierto={modalGasolinaAbierto}
        opciones={opcionesGasolina}
        onAbiertoChange={setModalGasolinaAbierto}
        onSeleccionarOpcion={handleFuelModuleOptionSelect}
      />

      <AppFooter mounted={mounted} />
    </div>
  )
}
