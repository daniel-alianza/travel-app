import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

interface DispersionErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DispersionErrorDialog = ({
  open,
  onOpenChange,
}: DispersionErrorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm sm:max-w-md lg:max-w-lg mx-4 sm:mx-auto'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-4 sm:mb-6'>
            <div className='rounded-full bg-red-100 p-3 sm:p-4 lg:p-5'>
              <AlertCircle className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-red-600' />
            </div>
          </div>
          <DialogTitle className='text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold px-2'>
            No se puede dispersar
          </DialogTitle>
          <DialogDescription className='text-center text-sm sm:text-base lg:text-lg xl:text-xl pt-2 sm:pt-4 px-2'>
            Debes ajustar al menos un monto antes de poder dispersar los
            viáticos. Por favor, usa el botón "Ajustar montos" o ajusta los
            montos manualmente.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DispersionErrorDialog;

