import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

const MessageDialog = ({
  open,
  onOpenChange,
  type,
  title,
  message,
  onConfirm,
  confirmText = 'Aceptar',
}: MessageDialogProps) => {
  const getIcon = () => {
    const iconClass = 'h-5 w-5';
    switch (type) {
      case 'success':
        return <CheckCircle2 className={`${iconClass} text-green-600`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-orange-600`} />;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-orange-700';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-md sm:max-w-lg p-4 sm:p-5'>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-base ${getTitleColor()}`}>
            {getIcon()}
            {title}
          </DialogTitle>
          <DialogDescription className='pt-2 text-sm'>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className={`text-sm h-9 ${
              type === 'success'
                ? 'bg-[#F34602] hover:bg-[#d93d02] text-white'
                : type === 'error'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;

