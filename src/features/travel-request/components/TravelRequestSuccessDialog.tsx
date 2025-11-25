import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface TravelRequestSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const TravelRequestSuccessDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: TravelRequestSuccessDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-4 sm:mb-6'>
            <div className='rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 sm:p-4 lg:p-5'>
              <CheckCircle2 className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-600 dark:text-emerald-400' />
            </div>
          </div>
          <DialogTitle className='text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold px-2'>
            ¡Solicitud enviada exitosamente!
          </DialogTitle>
          <DialogDescription className='text-center text-sm sm:text-base lg:text-lg xl:text-xl pt-2 sm:pt-4 px-2'>
            Tu solicitud de viaje ha sido enviada exitosamente. Solo falta que tu
            jefe directo apruebe tu solicitud.
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 sm:mt-6 flex justify-center'>
          <Button
            onClick={handleConfirm}
            className='w-full sm:w-auto bg-gradient-to-r from-[#F34602] to-[#d93d02] hover:from-[#d93d02] hover:to-[#c23602] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98] px-6 sm:px-8 h-11 sm:h-12'
          >
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

