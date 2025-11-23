import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface RegisterSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const RegisterSuccessDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: RegisterSuccessDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm sm:max-w-md lg:max-w-lg mx-4 sm:mx-auto'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-4 sm:mb-6'>
            <div className='rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 sm:p-4 lg:p-5'>
              <CheckCircle2 className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-600 dark:text-emerald-400' />
            </div>
          </div>
          <DialogTitle className='text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold px-2'>
            ¡Usuario creado con éxito!
          </DialogTitle>
          <DialogDescription className='text-center text-sm sm:text-base lg:text-lg xl:text-xl pt-2 sm:pt-4 px-2'>
            Tu cuenta ha sido registrada exitosamente. Ahora puedes iniciar sesión con tus credenciales.
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 sm:mt-6 flex justify-center'>
          <Button
            onClick={handleConfirm}
            className='w-full sm:w-auto gradient-orange text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98] px-6 sm:px-8 h-11 sm:h-12'
          >
            Ir a Iniciar Sesión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

