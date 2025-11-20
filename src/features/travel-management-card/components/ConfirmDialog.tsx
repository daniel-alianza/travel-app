import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-orange-700'>
            <AlertCircle className='h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-orange-600' />
            {title}
          </DialogTitle>
          <DialogDescription className='pt-2 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl'>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-3 flex-col sm:flex-row'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
            className='w-full sm:w-auto text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl h-10 sm:h-11 lg:h-12 xl:h-14'
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className='bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl h-10 sm:h-11 lg:h-12 xl:h-14'
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;

