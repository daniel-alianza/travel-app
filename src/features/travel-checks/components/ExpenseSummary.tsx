interface ExpenseSummaryProps {
  totalViatico: number;
  totalSpent: number;
  movementCount: number;
}

export function ExpenseSummary({
  totalViatico,
  totalSpent,
  movementCount,
}: ExpenseSummaryProps) {
  const remaining = totalViatico - totalSpent;
  const percentage = (totalSpent / totalViatico) * 100;

  return (
    <div className='space-y-4 sm:space-y-4 md:space-y-4 lg:space-y-5'>
      {/* Header Summary */}
      <div className='bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-5 lg:p-5 xl:p-6 text-white shadow-lg'>
        <h1 className='text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-bold mb-3 sm:mb-3 md:mb-4 lg:mb-4'>
          Resumen de Viático
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-4 lg:gap-4'>
          <div>
            <p className='text-xs sm:text-sm md:text-sm lg:text-sm opacity-90 mb-1 sm:mb-1.5'>
              Viático Total
            </p>
            <p className='text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-bold'>
              ${totalViatico.toLocaleString('es-AR')}
            </p>
          </div>
          <div>
            <p className='text-xs sm:text-sm md:text-sm lg:text-sm opacity-90 mb-1 sm:mb-1.5'>
              Gastado
            </p>
            <p className='text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-bold'>
              ${totalSpent.toLocaleString('es-AR')}
            </p>
          </div>
          <div>
            <p className='text-xs sm:text-sm md:text-sm lg:text-sm opacity-90 mb-1 sm:mb-1.5'>
              Disponible
            </p>
            <p
              className='text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-bold'
              style={{ color: remaining >= 0 ? '#ffffff' : '#ff6b6b' }}
            >
              ${Math.abs(remaining).toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-4 lg:p-4 border border-border shadow-sm'>
        <div className='flex justify-between items-center mb-2 sm:mb-2.5'>
          <p className='font-medium text-foreground text-sm sm:text-base md:text-base lg:text-base'>
            Progreso de gasto
          </p>
          <span className='text-xs sm:text-sm md:text-sm lg:text-sm text-muted-foreground'>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2 sm:h-2.5 md:h-2.5 lg:h-2.5 overflow-hidden'>
          <div
            className='h-full transition-all duration-500'
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: 'oklch(0.68 0.24 42)',
            }}
          />
        </div>
      </div>

      {/* Movement Count */}
      <div className='bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-4 lg:p-4 border border-border shadow-sm'>
        <p className='text-xs sm:text-sm md:text-sm lg:text-sm text-muted-foreground mb-1 sm:mb-1.5'>
          Total de movimientos
        </p>
        <p
          className='text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl font-bold'
          style={{ color: 'oklch(0.68 0.24 42)' }}
        >
          {movementCount}
        </p>
      </div>
    </div>
  );
}
