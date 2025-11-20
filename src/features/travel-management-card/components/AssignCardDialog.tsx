import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { CardAssignmentFormData } from '../interfaces';

interface AssignCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CardAssignmentFormData) => void;
  isLoading?: boolean;
  availableCards: Array<{ id: string; numero: string }>;
  userName: string;
  userId: string;
}

const AssignCardDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  availableCards,
  userName,
  userId,
}: AssignCardDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<CardAssignmentFormData, 'fechaAsignacion'>>({
    defaultValues: {
      usuarioId: userId,
    },
  });

  const submitForm = (
    data: Omit<CardAssignmentFormData, 'fechaAsignacion'>,
  ) => {
    onSubmit({
      ...data,
      usuarioId: userId,
      fechaAsignacion: new Date().toISOString().split('T')[0],
    });
    reset();
  };

  const formatCardNumber = (numero: string) => {
    return numero.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='relative'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-[100] flex items-center justify-center'>
              <div className='flex flex-col items-center gap-3'>
                <div className='h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 border-2 border-[#F34602] border-t-transparent rounded-full animate-spin' />
                <p className='text-sm sm:text-base lg:text-lg xl:text-xl font-medium text-[#02082C]'>
                  Asignando tarjeta...
                </p>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#02082C]'>
              <CreditCard className='h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-[#F34602]' />
              Asignar Tarjeta
            </DialogTitle>
            <DialogDescription className='text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl'>
              Asignar una tarjeta a <strong>{userName}</strong>
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(submitForm)}
            className='space-y-4 sm:space-y-5 lg:space-y-6'
          >
            <div className='space-y-2 sm:space-y-3'>
              <Label
                htmlFor='tarjetaId'
                className='text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-[#02082C] flex items-center gap-2'
              >
                <CreditCard className='h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-[#F34602]' />
                Seleccionar Tarjeta
              </Label>
              <Select
                id='tarjetaId'
                {...register('tarjetaId', {
                  required: 'Debes seleccionar una tarjeta',
                })}
                className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-10 sm:h-11 lg:h-12 xl:h-14 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl'
              >
                <option value=''>Selecciona una tarjeta</option>
                {availableCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {formatCardNumber(card.numero)}
                  </option>
                ))}
              </Select>
              {errors.tarjetaId && (
                <p className='text-xs sm:text-sm lg:text-base xl:text-lg text-red-600'>
                  {errors.tarjetaId.message}
                </p>
              )}
            </div>

            <DialogFooter className='flex-col sm:flex-row gap-2 sm:gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  reset();
                  onOpenChange(false);
                }}
                disabled={isLoading}
                className='cursor-pointer w-full sm:w-auto text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl h-10 sm:h-11 lg:h-12 xl:h-14'
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={isLoading}
                className='bg-[#F34602] hover:bg-[#d93d02] text-white cursor-pointer w-full sm:w-auto text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl h-10 sm:h-11 lg:h-12 xl:h-14'
              >
                {isLoading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Asignando...
                  </span>
                ) : (
                  'Asignar Tarjeta'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCardDialog;
