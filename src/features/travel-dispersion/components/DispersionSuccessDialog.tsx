import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface DispersionSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispersedCount: number;
}

const DispersionSuccessDialog = ({
  open,
  onOpenChange,
  dispersedCount,
}: DispersionSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm sm:max-w-md lg:max-w-lg mx-4 sm:mx-auto'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-4 sm:mb-6'>
            <div className='rounded-full bg-emerald-100 p-3 sm:p-4 lg:p-5'>
              <CheckCircle2 className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-600' />
            </div>
          </div>
          <DialogTitle className='text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold px-2'>
            ¡Viáticos dispersados correctamente!
          </DialogTitle>
          <DialogDescription className='text-center text-sm sm:text-base lg:text-lg xl:text-xl pt-2 sm:pt-4 px-2'>
            Los viáticos se han dispersado exitosamente a {dispersedCount}{' '}
            {dispersedCount === 1 ? 'usuario' : 'usuarios'}.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DispersionSuccessDialog;

