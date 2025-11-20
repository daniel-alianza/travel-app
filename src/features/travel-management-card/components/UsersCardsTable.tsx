import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreditCard, UserPlus, X, Eye } from 'lucide-react';
import type { User } from '../interfaces';
import UsersCardsMobileView from './UsersCardsMobileView';

interface UsersCardsTableProps {
  users: User[];
  onAssignCard: (userId: string) => void;
  onOpenCardsDialog: (userId: string, mode: 'view' | 'remove') => void;
  isLoading?: boolean;
}

const UsersCardsTable = ({
  users,
  onAssignCard,
  onOpenCardsDialog,
  isLoading = false,
}: UsersCardsTableProps) => {
  if (users.length === 0) {
    return (
      <div className='rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center'>
        <CreditCard className='h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4' />
        <p className='text-base sm:text-lg lg:text-xl font-semibold text-[#02082C] mb-2'>
          No hay usuarios con tarjetas asignadas
        </p>
        <p className='text-sm sm:text-base text-muted-foreground'>
          No se encontraron usuarios con tarjetas asignadas.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista móvil */}
      <UsersCardsMobileView
        users={users}
        onAssignCard={onAssignCard}
        onOpenCardsDialog={onOpenCardsDialog}
        isLoading={isLoading}
      />

      {/* Vista desktop/tablet/TV */}
      <div className='hidden md:block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gradient-to-r from-[#F34602] to-[#d93d02] hover:bg-gradient-to-r hover:from-[#F34602] hover:to-[#d93d02]'>
                <TableHead className='text-white font-bold text-sm lg:text-base xl:text-lg 2xl:text-xl py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6 text-left min-w-[180px] lg:min-w-[220px] xl:min-w-[250px] 2xl:min-w-[300px]'>
                  Usuario
                </TableHead>
                <TableHead className='text-white font-bold text-sm lg:text-base xl:text-lg 2xl:text-xl py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6 text-left min-w-[120px] lg:min-w-[150px] xl:min-w-[180px] 2xl:min-w-[220px]'>
                  Compañía
                </TableHead>
                <TableHead className='text-white font-bold text-sm lg:text-base xl:text-lg 2xl:text-xl py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6 text-center min-w-[80px] lg:min-w-[100px] xl:min-w-[120px] 2xl:min-w-[150px]'>
                  Tarjetas
                </TableHead>
                <TableHead className='text-white font-bold text-sm lg:text-base xl:text-lg 2xl:text-xl py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6 text-center min-w-[200px] lg:min-w-[250px] xl:min-w-[300px] 2xl:min-w-[350px]'>
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => {
                const activeCards = user.tarjetas.filter(
                  t => t.estado === 'activa',
                );
                const hasActiveCard = activeCards.length > 0;
                const canAssignCard = activeCards.length < 4;
                const hasAnyCard = user.tarjetas.length > 0;

                return (
                  <TableRow
                    key={user.id}
                    className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
                  >
                    <TableCell className='py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6'>
                      <div>
                        <p className='font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#02082C]'>
                          {user.nombre}
                        </p>
                        <p className='text-xs lg:text-sm xl:text-base 2xl:text-lg text-muted-foreground break-words'>
                          {user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6'>
                      <span className='text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#02082C]'>
                        {user.compania}
                      </span>
                    </TableCell>
                    <TableCell className='py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6 text-center'>
                      <div className='flex items-center justify-center gap-2'>
                        <CreditCard className='h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-[#F34602]' />
                        <span className='font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#02082C]'>
                          {
                            user.tarjetas.filter(t => t.estado === 'activa')
                              .length
                          }{' '}
                          / 4
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-3 lg:py-4 xl:py-5 px-3 lg:px-4 xl:px-6'>
                      <div className='flex items-center justify-center gap-2 flex-wrap'>
                        <div className='relative group inline-block'>
                          <Button
                            size='sm'
                            onClick={() => onAssignCard(user.id)}
                            disabled={isLoading || !canAssignCard}
                            className='bg-[#F34602] hover:bg-[#d93d02] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs lg:text-sm xl:text-base h-8 lg:h-9 xl:h-10 px-3 lg:px-4 xl:px-5'
                          >
                            <UserPlus className='h-3 w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 mr-1 lg:mr-2' />
                            <span className='hidden lg:inline'>Asignar</span>
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
                        <div className='relative group inline-block'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => onOpenCardsDialog(user.id, 'remove')}
                            disabled={isLoading || !hasActiveCard}
                            className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm xl:text-base h-8 lg:h-9 xl:h-10 px-3 lg:px-4 xl:px-5'
                          >
                            <X className='h-3 w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 mr-1 lg:mr-2' />
                            <span className='hidden lg:inline'>Remover</span>
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
                        <div className='relative group inline-block'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => onOpenCardsDialog(user.id, 'view')}
                            disabled={isLoading || !hasAnyCard}
                            className='border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm xl:text-base h-8 lg:h-9 xl:h-10 px-3 lg:px-4 xl:px-5'
                          >
                            <Eye className='h-3 w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5' />
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UsersCardsTable;
