import type { Movement } from '../interfaces/movements.interface';
import { MovementCard } from './MovementCard';

interface MovementsListProps {
  movements: Movement[];
}

export function MovementsList({ movements }: MovementsListProps) {
  if (movements.length === 0) {
    return (
      <div className='text-center py-12 bg-white rounded-lg border border-border'>
        <p className='text-muted-foreground'>No hay movimientos registrados</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <h2 className='text-xl font-bold text-foreground'>
        Detalle de Movimientos
      </h2>
      <div className='space-y-3'>
        {movements.map(movement => (
          <MovementCard key={movement.id} movement={movement} />
        ))}
      </div>
    </div>
  );
}
