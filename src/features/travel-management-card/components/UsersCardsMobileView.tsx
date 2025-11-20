import { Button } from '@/components/ui/button';
import { CreditCard, UserPlus, X, Eye } from 'lucide-react';
import type { User } from '../interfaces';

interface UsersCardsMobileViewProps {
  users: User[];
  onAssignCard: (userId: string) => void;
  onOpenCardsDialog: (userId: string, mode: 'view' | 'remove') => void;
  isLoading?: boolean;
}

const UsersCardsMobileView = ({
  users,
  onAssignCard,
  onOpenCardsDialog,
  isLoading = false,
}: UsersCardsMobileViewProps) => {
  if (users.length === 0) {
    return (
      <div className='rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center'>
        <CreditCard className='h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4' />
        <p className='text-base sm:text-lg font-semibold text-[#02082C] mb-2'>
          No hay usuarios con tarjetas asignadas
        </p>
        <p className='text-sm text-muted-foreground'>
          No se encontraron usuarios con tarjetas asignadas.
        </p>
      </div>
    );
  }

  return (
    <div className='block md:hidden space-y-4'>
      {users.map(user => {
        const activeCards = user.tarjetas.filter(t => t.estado === 'activa');
        const hasActiveCard = activeCards.length > 0;
        const canAssignCard = activeCards.length < 4;
        const hasAnyCard = user.tarjetas.length > 0;

        return (
          <div
            key={user.id}
            className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'
          >
            {/* Header con nombre y email */}
            <div className='mb-4 pb-4 border-b border-gray-100'>
              <h3 className='font-semibold text-base text-[#02082C] mb-1'>
                {user.nombre}
              </h3>
              <p className='text-sm text-muted-foreground break-words'>
                {user.email}
              </p>
            </div>

            {/* Información de compañía */}
            <div className='mb-4 pb-4 border-b border-gray-100'>
              <p className='text-xs text-muted-foreground mb-1'>Compañía</p>
              <p className='text-sm font-medium text-[#02082C]'>
                {user.compania}
              </p>
            </div>

            {/* Tarjetas asignadas */}
            <div className='mb-4 pb-4 border-b border-gray-100'>
              <p className='text-xs text-muted-foreground mb-2'>Tarjetas</p>
              <div className='flex items-center gap-2'>
                <CreditCard className='h-4 w-4 text-[#F34602]' />
                <span className='font-semibold text-[#02082C]'>
                  {activeCards.length} / 4
                </span>
                <span className='text-xs text-muted-foreground'>
                  tarjetas activas
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className='flex flex-col gap-2'>
              <div className='relative group inline-block w-full'>
                <Button
                  size='sm'
                  onClick={() => onAssignCard(user.id)}
                  disabled={isLoading || !canAssignCard}
                  className='w-full bg-[#F34602] hover:bg-[#d93d02] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                >
                  <UserPlus className='h-4 w-4 mr-2' />
                  Asignar Tarjeta
                </Button>
                {(!canAssignCard || isLoading) && (
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50'>
                    {!canAssignCard
                      ? 'Este usuario ya tiene todas las tarjetas asignadas (4/4)'
                      : 'Procesando...'}
                    <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
                  </div>
                )}
              </div>

              <div className='flex gap-2'>
                <div className='relative group inline-block flex-1'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onOpenCardsDialog(user.id, 'remove')}
                    disabled={isLoading || !hasActiveCard}
                    className='w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm'
                  >
                    <X className='h-4 w-4 mr-1' />
                    Remover
                  </Button>
                  {(!hasActiveCard || isLoading) && (
                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50'>
                      {!hasActiveCard
                        ? 'Este usuario no tiene tarjetas activas para remover'
                        : 'Procesando...'}
                      <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
                    </div>
                  )}
                </div>

                <div className='relative group inline-block flex-1'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onOpenCardsDialog(user.id, 'view')}
                    disabled={isLoading || !hasAnyCard}
                    className='w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm'
                  >
                    <Eye className='h-4 w-4 mr-1' />
                    Ver
                  </Button>
                  {(!hasAnyCard || isLoading) && (
                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50'>
                      {!hasAnyCard
                        ? 'Este usuario no tiene tarjetas asignadas'
                        : 'Procesando...'}
                      <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersCardsMobileView;

