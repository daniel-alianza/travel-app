import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';

interface TermsAndConditionsModalProps {
  open: boolean;
  onAccept: () => void;
}

const POLICIES_PDF_URL =
  'https://grupo-fg.com/politicas/assets/grupofg/Politica%20de%20Viaticos%20y%20Gastos%20de%20Viaje.pdf';

export function TermsAndConditionsModal({
  open,
  onAccept,
}: TermsAndConditionsModalProps) {
  const handleAccept = () => {
    onAccept();
  };

  // Prevenir que el modal se cierre haciendo clic fuera o con ESC
  const handleInteractOutside = (event: Event) => {
    event.preventDefault();
  };

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className='w-[90vw] max-w-lg sm:max-w-xl max-h-[85vh] overflow-y-auto'
        showCloseButton={false}
        onInteractOutside={handleInteractOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        <DialogHeader className='pb-3'>
          <DialogTitle className='flex items-center gap-2.5 text-lg font-semibold text-gray-900 dark:text-gray-100'>
            <div className='flex-shrink-0 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg'>
              <FileText className='h-5 w-5 text-orange-600 dark:text-orange-400' />
            </div>
            Política de Viáticos y Gastos de Viaje
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className='space-y-4 pt-2'>
            <div className='bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-r-lg p-3.5'>
              <p className='text-sm leading-relaxed text-blue-900 dark:text-blue-100'>
                Por favor, ten la paciencia de leer las políticas antes de
                continuar. Es importante que estés al tanto de todos los
                lineamientos.
              </p>
            </div>

            <div className='space-y-3.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
              <p>
                Al ingresar a este portal, aceptas todas las políticas y
                lineamientos establecidos en la{' '}
                <strong className='text-gray-900 dark:text-gray-100'>
                  Política de Viáticos y Gastos de Viaje
                </strong>{' '}
                de Grupo FG.
              </p>

              <div className='bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 space-y-2.5'>
                <p className='text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide'>
                  Documento oficial
                </p>
                <a
                  href={POLICIES_PDF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm transition-colors group'
                >
                  <ExternalLink className='h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
                  Ver Política Completa (PDF)
                </a>
              </div>

              <p className='text-xs text-gray-500 dark:text-gray-400 pt-1 italic'>
                Al hacer clic en "Aceptar", confirmas que has leído y aceptas
                cumplir con todos los términos y condiciones establecidos.
              </p>
            </div>
          </div>
        </DialogDescription>

        <DialogFooter className='pt-4 border-t border-gray-200 dark:border-gray-800'>
          <Button
            onClick={handleAccept}
            className='w-full bg-[#F34602] hover:bg-[#d93d02] text-white font-medium text-sm h-10 px-6 shadow-sm hover:shadow transition-all'
          >
            Aceptar y Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

