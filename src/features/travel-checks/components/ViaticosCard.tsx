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
    <div className='w-full bg-white border border-border rounded-lg overflow-hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full text-left p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-colors duration-300 flex items-center justify-between'
      >
        <div className='flex-1'>
          <div className='flex items-start justify-between mb-3'>
            <div>
              <h3 className='font-semibold text-white'>{viatico.name}</h3>
              <p className='text-sm text-orange-100'>
                {viatico.movements.length} movimiento
                {viatico.movements.length !== 1 ? 's' : ''}
              </p>
            </div>
            {isExpired && (
              <span className='text-xs bg-red-500 text-white px-2 py-1 rounded'>
                Expirado
              </span>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3 mb-3'>
            <div>
              <p className='text-xs text-orange-100'>Viáticos dispersados</p>
              <p className='text-sm font-semibold text-white'>
                ${viatico.totalViatico.toLocaleString('es-AR')}
              </p>
            </div>
            <div>
              <p className='text-xs text-orange-100'>Viáticos gastados</p>
              <p className='text-sm font-semibold text-white'>
                ${viatico.totalSpent.toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          <div className='space-y-1'>
            <div className='flex items-center justify-between'>
              <p className='text-xs text-orange-100'>Comprobado</p>
              <span className='text-xs font-semibold text-white'>
                {porcentajeComprobado.toFixed(1)}%
              </span>
            </div>
            <div className='w-full bg-white/30 rounded-full h-2 overflow-hidden'>
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
          className='ml-4 flex-shrink-0 text-white transition-transform duration-300'
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          size={20}
        />
      </button>

      {isOpen && (
        <div className='border-t border-border bg-white'>
          <div className='p-6 space-y-6'>
            {/* Fecha de creación */}
            <p className='text-sm text-muted-foreground'>
              Creado: {viatico.createdAt.toLocaleDateString('es-AR')}
            </p>

            {/* Resumen en tarjeta naranja */}
            <div className='bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white'>
              <h2 className='text-sm font-semibold text-white'>
                Resumen de Viático
              </h2>
            </div>

            {/* Detalle de movimientos */}
            <div>
              <h3 className='text-lg font-bold text-foreground mb-4'>
                Detalle de Movimientos
              </h3>
              <div className='space-y-2'>
                {viatico.movements.map(movement => (
                  <div
                    key={movement.id}
                    className='flex items-center justify-between p-4 bg-white border border-border rounded-lg hover:shadow-md transition-shadow duration-300'
                  >
                    <div className='flex-1'>
                      <p className='font-medium text-foreground'>
                        {movement.description}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {movement.date.toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div className='flex items-center gap-3 ml-4'>
                      <p
                        className='font-semibold'
                        style={{ color: 'oklch(0.68 0.24 42)' }}
                      >
                        ${movement.amount.toLocaleString('es-AR')}
                      </p>
                      <button className='flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors duration-200 font-medium text-sm whitespace-nowrap'>
                        <Plus size={16} />
                        Agregar comprobación
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
