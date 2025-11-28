import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'approve' | 'reject';
  onConfirm: (comment: string) => void;
  isLoading?: boolean;
}

const CommentDialog = ({
  open,
  onOpenChange,
  type,
  onConfirm,
  isLoading = false,
}: CommentDialogProps) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isApprove = type === 'approve';
  const Icon = isApprove ? CheckCircle2 : XCircle;
  const title = isApprove ? 'Aprobar Solicitud' : 'Rechazar Solicitud';
  const description = isApprove
    ? 'Por favor, ingresa un comentario para aprobar esta solicitud.'
    : 'Por favor, ingresa un comentario para rechazar esta solicitud.';

  const handleConfirm = () => {
    if (!comment.trim()) {
      setError('El comentario es obligatorio');
      return;
    }

    onConfirm(comment.trim());
    setComment('');
    setError(null);
  };

  const handleCancel = () => {
    setComment('');
    setError(null);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='w-[95vw] max-w-md sm:max-w-lg p-4 sm:p-5'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-3 sm:mb-4'>
            <div
              className={`rounded-full p-2.5 sm:p-3 ${
                isApprove
                  ? 'bg-emerald-100 dark:bg-emerald-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              <Icon
                className={`h-6 w-6 sm:h-7 sm:w-7 ${
                  isApprove
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              />
            </div>
          </div>
          <DialogTitle
            className={`text-center text-base sm:text-lg font-bold px-2 ${
              isApprove
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-red-700 dark:text-red-400'
            }`}
          >
            {title}
          </DialogTitle>
          <DialogDescription className='text-center text-sm sm:text-base pt-2 px-2'>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <label
              htmlFor='comment'
              className='text-sm font-semibold text-foreground'
            >
              Comentario <span className='text-destructive'>*</span>
            </label>
            <Textarea
              id='comment'
              placeholder='Escribe tu comentario aquí...'
              value={comment}
              onChange={e => {
                setComment(e.target.value);
                if (error) setError(null);
              }}
              className={`min-h-24 ${
                error ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              disabled={isLoading}
            />
            {error && (
              <p className='text-sm text-destructive font-medium'>{error}</p>
            )}
          </div>
        </div>

        <DialogFooter className='gap-2 flex-row sm:flex-row mt-4 sm:mt-5'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
            className='text-sm h-9 flex-1 sm:flex-none'
          >
            Cancelar
          </Button>
          <Button
            type='button'
            onClick={handleConfirm}
            disabled={isLoading || !comment.trim()}
            className={`text-sm h-9 flex-1 sm:flex-none shadow-lg hover:shadow-xl transition-all duration-300 ${
              isApprove
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Procesando...
              </>
            ) : isApprove ? (
              <>
                <CheckCircle2 className='h-4 w-4 mr-2' />
                Aprobar
              </>
            ) : (
              <>
                <XCircle className='h-4 w-4 mr-2' />
                Rechazar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CommentDialog };

