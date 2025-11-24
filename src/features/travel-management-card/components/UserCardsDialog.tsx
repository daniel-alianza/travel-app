import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, X, Building2 } from 'lucide-react';
import type { User } from '../interfaces';

type UserCardsDialogMode = 'view' | 'remove';

interface UserCardsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  mode?: UserCardsDialogMode;
  onRemoveCard?: (userId: string, cardId: string) => void;
  isLoading?: boolean;
}

const UserCardsDialog = ({
  open,
  onOpenChange,
  user,
  mode = 'view',
  onRemoveCard,
  isLoading = false,
}: UserCardsDialogProps) => {
  const formatCardNumber = (numero: string) => {
    if (!numero || numero.length < 4) return numero;
    return numero.slice(-4);
  };

  if (!user) return null;
  const isRemoveMode = mode === 'remove';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-md sm:max-w-lg md:max-w-xl max-h-[85vh] overflow-y-auto'>
        <div className='relative'>
          {isLoading && isRemoveMode && (
            <div className='absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-[100] flex items-center justify-center'>
              <div className='flex flex-col items-center gap-2'>
                <div className='h-6 w-6 border-2 border-[#F34602] border-t-transparent rounded-full animate-spin' />
                <p className='text-sm font-medium text-[#02082C]'>
                  Desasignando tarjeta...
                </p>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-base sm:text-lg text-[#02082C]'>
              <CreditCard className='h-4 w-4 sm:h-5 sm:w-5 text-[#F34602]' />
              Tarjetas de {user.nombre}
            </DialogTitle>
            <DialogDescription className='text-xs sm:text-sm'>
              <p>
                {user.email} - {user.compania}
              </p>
              {isRemoveMode && (
                <span className='text-xs text-red-600'>
                  Selecciona la tarjeta que deseas desasignar de este usuario.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-2 sm:space-y-3 py-2 sm:py-3'>
            {user.tarjetas.length === 0 ? (
              <div className='text-center py-4 sm:py-6'>
                <CreditCard className='h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-2' />
                <p className='text-sm text-muted-foreground'>
                  Este usuario no tiene tarjetas asignadas
                </p>
              </div>
            ) : (
              user.tarjetas.map(card => (
                <div
                  key={card.id}
                  className='border border-gray-200 rounded-lg p-3 sm:p-4 bg-white'
                >
                  <div className='space-y-2'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <CreditCard className='h-4 w-4 text-[#F34602] flex-shrink-0' />
                        <span className='font-mono font-semibold text-[#02082C] text-sm sm:text-base'>
                          {formatCardNumber(card.numero)}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <Badge
                          variant='outline'
                          className={`text-xs ${
                            card.estado === 'activa'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          } border`}
                        >
                          {card.estado === 'activa' ? 'Activa' : 'Desactivada'}
                        </Badge>
                        {isRemoveMode && (
                          <div className='relative group inline-block'>
                            <Button
                              size='sm'
                              variant='outline'
                              className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs h-8'
                              disabled={
                                card.estado !== 'activa' ||
                                isLoading ||
                                !onRemoveCard
                              }
                              onClick={() => {
                                if (onRemoveCard) {
                                  onRemoveCard(user.id, card.id);
                                }
                              }}
                            >
                              {isLoading ? (
                                <span className='flex items-center justify-center gap-1'>
                                  <div className='h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                                  <span className='hidden sm:inline'>
                                    Desasignando...
                                  </span>
                                </span>
                              ) : (
                                <>
                                  <X className='h-3 w-3 mr-1' />
                                  <span>Desasignar</span>
                                </>
                              )}
                            </Button>
                            {(card.estado !== 'activa' || isLoading) && (
                              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50'>
                                {card.estado !== 'activa'
                                  ? 'Solo puedes desasignar tarjetas activas'
                                  : 'Procesando desasignación...'}
                                <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-2 text-xs text-[#02082C]'>
                      <Building2 className='h-3 w-3 text-muted-foreground' />
                      <span className='font-medium'>{card.banco}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className='bg-[#F34602] hover:bg-[#d93d02] text-white cursor-pointer w-full sm:w-auto text-sm h-9'
            >
              Cerrar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserCardsDialog;
