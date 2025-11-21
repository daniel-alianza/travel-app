import { useState } from 'react';
import type { TravelExpense } from '../interfaces/movements.interface';
import { ChevronDown, Plus } from 'lucide-react';

interface ViaticCardProps {
  viatico: TravelExpense;
  isExpired?: boolean;
}

export function ViaticCard({ viatico, isExpired }: ViaticCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const totalComprobado = viatico.movements.reduce(
    (sum, movement) => sum + movement.amount,
    0,
  );
  const porcentajeComprobado =
    viatico.totalSpent > 0 ? (totalComprobado / viatico.totalSpent) * 100 : 0;

  return (
    <div className='w-full bg-white border border-border rounded-lg sm:rounded-xl overflow-hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full text-left p-3 sm:p-4 md:p-4 lg:p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-colors duration-300 flex items-center justify-between gap-2 sm:gap-3 md:gap-3'
      >
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between mb-2 sm:mb-3 md:mb-3 gap-2 sm:gap-3'>
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-white text-sm sm:text-base md:text-base lg:text-base xl:text-lg truncate'>
                {viatico.name}
              </h3>
              <p className='text-xs sm:text-sm md:text-sm lg:text-sm text-orange-100 mt-1'>
                {viatico.movements.length} movimiento
                {viatico.movements.length !== 1 ? 's' : ''}
              </p>
            </div>
            {isExpired && (
              <span className='text-xs sm:text-sm md:text-sm bg-red-500 text-white px-2 sm:px-2.5 md:px-2.5 py-1 sm:py-1.5 md:py-1.5 rounded flex-shrink-0'>
                Expirado
              </span>
            )}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-3 mb-2 sm:mb-3 md:mb-3'>
            <div>
              <p className='text-xs sm:text-sm md:text-sm lg:text-sm text-orange-100'>
                Viáticos dispersados
              </p>
              <p className='text-sm sm:text-base md:text-base lg:text-base xl:text-lg font-semibold text-white'>
                ${viatico.totalViatico.toLocaleString('es-AR')}
              </p>
            </div>
            <div>
              <p className='text-xs sm:text-sm md:text-sm lg:text-sm text-orange-100'>
                Viáticos gastados
              </p>
              <p className='text-sm sm:text-base md:text-base lg:text-base xl:text-lg font-semibold text-white'>
                ${viatico.totalSpent.toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          <div className='space-y-1 sm:space-y-1.5'>
            <div className='flex items-center justify-between'>
              <p className='text-xs sm:text-sm md:text-sm text-orange-100'>
                Comprobado
              </p>
              <span className='text-xs sm:text-sm md:text-sm font-semibold text-white'>
                {porcentajeComprobado.toFixed(1)}%
              </span>
            </div>
            <div className='w-full bg-white/30 rounded-full h-1.5 sm:h-2 md:h-2 lg:h-2.5 overflow-hidden'>
              <div
                className='h-full bg-white transition-all duration-500'
                style={{
                  width: `${Math.min(porcentajeComprobado, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        <ChevronDown
          className='ml-2 sm:ml-4 flex-shrink-0 text-white transition-transform duration-300'
          style={{
            width: 'clamp(16px, 4vw, 24px)',
            height: 'clamp(16px, 4vw, 24px)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {isOpen && (
        <div className='border-t border-border bg-white'>
          <div className='p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 space-y-3 sm:space-y-3 md:space-y-4 lg:space-y-4'>
            {/* Fecha de creación */}
            <p className='text-xs sm:text-sm md:text-sm lg:text-sm text-muted-foreground'>
              Creado: {viatico.createdAt.toLocaleDateString('es-AR')}
            </p>

            {/* Resumen en tarjeta naranja */}
            <div className='bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 sm:p-4 md:p-4 lg:p-4 text-white'>
              <h2 className='text-sm sm:text-base md:text-base lg:text-base font-semibold text-white'>
                Resumen de Viático
              </h2>
            </div>

            {/* Detalle de movimientos */}
            <div>
              <h3 className='text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl font-bold text-foreground mb-3 sm:mb-3 md:mb-4 lg:mb-4'>
                Detalle de Movimientos
              </h3>
              <div className='space-y-2 sm:space-y-3 md:space-y-3'>
                {viatico.movements.map(movement => (
                  <div
                    key={movement.id}
                    className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 md:p-4 lg:p-4 bg-white border border-border rounded-lg hover:shadow-md transition-shadow duration-300 gap-3 sm:gap-4'
                  >
                    <div className='flex-1 min-w-0 w-full sm:w-auto'>
                      <p className='font-medium text-foreground text-sm sm:text-base md:text-base lg:text-base'>
                        {movement.description}
                      </p>
                      <p className='text-xs sm:text-sm md:text-sm text-muted-foreground mt-1'>
                        {movement.date.toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 sm:gap-3 md:gap-3 w-full sm:w-auto justify-between sm:justify-end'>
                      <p
                        className='font-semibold text-sm sm:text-base md:text-base lg:text-base xl:text-lg'
                        style={{ color: 'oklch(0.68 0.24 42)' }}
                      >
                        ${movement.amount.toLocaleString('es-AR')}
                      </p>
                      <button className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-3 lg:px-3 py-1.5 sm:py-2 md:py-2 lg:py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors duration-200 font-medium text-xs sm:text-sm md:text-sm lg:text-sm whitespace-nowrap'>
                        <Plus className='w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5' />
                        <span className='hidden sm:inline'>
                          Agregar comprobación
                        </span>
                        <span className='sm:hidden'>Agregar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
