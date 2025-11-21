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
  return (
    <div className='flex items-center justify-between p-4 bg-white border border-border rounded-lg hover:shadow-md transition-shadow duration-300'>
      <div className='flex items-center gap-3 flex-1'>
        <div className='text-2xl'>{categoryIcons[movement.category]}</div>
        <div className='flex-1'>
          <p className='font-medium text-foreground'>{movement.description}</p>
          <p className='text-sm text-muted-foreground'>
            {categoryLabels[movement.category]} •{' '}
            {new Date(movement.date).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
      <div className='text-right'>
        <p
          className='font-semibold text-lg'
          style={{ color: 'oklch(0.68 0.24 42)' }}
        >
          ${movement.amount.toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
}
