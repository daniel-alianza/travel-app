import type { Movement } from '../interfaces/movements.interface';
import { MovementCard } from './MovementCard';

interface MovementsListProps {
  movements: Movement[];
}

export function MovementsList({ movements }: MovementsListProps) {
  if (movements.length === 0) {
    return (
      <div className='text-center py-8 sm:py-10 md:py-10 lg:py-10 bg-white rounded-lg sm:rounded-xl border border-border'>
        <p className='text-sm sm:text-base md:text-base lg:text-base text-muted-foreground'>
          No hay movimientos registrados
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-4'>
      <h2 className='text-lg sm:text-xl md:text-xl lg:text-xl xl:text-xl font-bold text-foreground'>
        Detalle de Movimientos
      </h2>
      <div className='space-y-2 sm:space-y-3 md:space-y-3'>
        {movements.map(movement => (
          <MovementCard key={movement.id} movement={movement} />
        ))}
      </div>
    </div>
  );
}
