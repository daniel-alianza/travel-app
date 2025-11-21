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
    <div className='space-y-6'>
      {/* Header Summary */}
      <div className='bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg'>
        <h1 className='text-3xl font-bold mb-4'>Resumen de Viático</h1>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <p className='text-sm opacity-90'>Viático Total</p>
            <p className='text-2xl font-bold'>
              ${totalViatico.toLocaleString('es-AR')}
            </p>
          </div>
          <div>
            <p className='text-sm opacity-90'>Gastado</p>
            <p className='text-2xl font-bold'>
              ${totalSpent.toLocaleString('es-AR')}
            </p>
          </div>
          <div>
            <p className='text-sm opacity-90'>Disponible</p>
            <p
              className='text-2xl font-bold'
              style={{ color: remaining >= 0 ? '#ffffff' : '#ff6b6b' }}
            >
              ${Math.abs(remaining).toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='bg-white rounded-lg p-4 border border-border shadow-sm'>
        <div className='flex justify-between items-center mb-2'>
          <p className='font-medium text-foreground'>Progreso de gasto</p>
          <span className='text-sm text-muted-foreground'>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
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
      <div className='bg-white rounded-lg p-4 border border-border shadow-sm'>
        <p className='text-sm text-muted-foreground'>Total de movimientos</p>
        <p
          className='text-3xl font-bold'
          style={{ color: 'oklch(0.68 0.24 42)' }}
        >
          {movementCount}
        </p>
      </div>
    </div>
  );
}
