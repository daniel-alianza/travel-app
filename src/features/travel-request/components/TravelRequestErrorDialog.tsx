import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface TravelRequestErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string | null;
  onConfirm: () => void;
}

export const TravelRequestErrorDialog = ({
  open,
  onOpenChange,
  errorMessage,
  onConfirm,
}: TravelRequestErrorDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-4 sm:mb-6'>
            <div className='rounded-full bg-red-100 dark:bg-red-900/30 p-3 sm:p-4 lg:p-5'>
              <XCircle className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-red-600 dark:text-red-400' />
            </div>
          </div>
          <DialogTitle className='text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold px-2 text-destructive'>
            Error al enviar solicitud
          </DialogTitle>
          <DialogDescription className='text-center text-sm sm:text-base lg:text-lg xl:text-xl pt-2 sm:pt-4 px-2'>
            {errorMessage ||
              'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.'}
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 sm:mt-6 flex justify-center'>
          <Button
            onClick={handleConfirm}
            variant='destructive'
            className='w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98] px-6 sm:px-8 h-11 sm:h-12'
          >
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

