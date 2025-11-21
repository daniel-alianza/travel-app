import type { Movement } from '../interfaces/movements.interface';

interface MovementCardProps {
  movement: Movement;
}

const categoryIcons: Record<string, string> = {
  food: '🍔',
  transport: '🚗',
  accommodation: '🏨',
  other: '💰',
};

const categoryLabels: Record<string, string> = {
  food: 'Comida',
  transport: 'Transporte',
  accommodation: 'Alojamiento',
  other: 'Otro',
};

export function MovementCard({ movement }: MovementCardProps) {
  const category = movement.category || 'other';
  const icon = categoryIcons[category] || categoryIcons.other;
  const label = categoryLabels[category] || categoryLabels.other;

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 md:p-4 lg:p-4 bg-white border border-border rounded-lg hover:shadow-md transition-shadow duration-300 gap-3 sm:gap-4'>
      <div className='flex items-center gap-2 sm:gap-3 md:gap-3 flex-1 min-w-0 w-full sm:w-auto'>
        <div className='text-xl sm:text-2xl md:text-2xl lg:text-2xl flex-shrink-0'>
          {icon}
        </div>
        <div className='flex-1 min-w-0'>
          <p className='font-medium text-foreground text-sm sm:text-base md:text-base lg:text-base truncate'>
            {movement.description}
          </p>
          <p className='text-xs sm:text-sm md:text-sm text-muted-foreground mt-1'>
            {label} • {new Date(movement.date).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
      <div className='text-left sm:text-right w-full sm:w-auto flex justify-between sm:block items-center sm:items-end'>
        <p
          className='font-semibold text-base sm:text-lg md:text-lg lg:text-lg xl:text-lg'
          style={{ color: 'oklch(0.68 0.24 42)' }}
        >
          ${movement.amount.toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
}
