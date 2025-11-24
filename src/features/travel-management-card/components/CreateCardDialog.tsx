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
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CreditCard, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createCardSchema = z.object({
  numero: z
    .string()
    .min(1, 'El número de tarjeta es requerido')
    .regex(/^\d+$/, 'El número de tarjeta solo debe contener números'),
  companyId: z.string().min(1, 'Debes seleccionar una empresa'),
});

type CreateCardFormData = z.infer<typeof createCardSchema>;

interface CreateCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { numero: string; companyId: string }) => void;
  isLoading?: boolean;
  companies: string[];
}

const CreateCardDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  companies,
}: CreateCardDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      numero: '',
      companyId: '',
    },
  });

  const submitForm = (data: CreateCardFormData) => {
    onSubmit({
      numero: data.numero,
      companyId: data.companyId,
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-md sm:max-w-lg p-4 sm:p-5'>
        <div className='relative'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-[100] flex items-center justify-center'>
              <div className='flex flex-col items-center gap-2'>
                <div className='h-6 w-6 sm:h-7 sm:w-7 border-2 border-[#F34602] border-t-transparent rounded-full animate-spin' />
                <p className='text-xs sm:text-sm font-medium text-[#02082C]'>
                  Creando tarjeta...
                </p>
              </div>
            </div>
          )}
          <DialogHeader className='pb-2'>
            <DialogTitle className='flex items-center gap-2 text-base text-[#02082C]'>
              <CreditCard className='h-4 w-4 text-[#F34602]' />
              Crear Tarjeta
            </DialogTitle>
            <DialogDescription className='text-sm'>
              Ingresa los datos de la nueva tarjeta corporativa
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(submitForm)} className='space-y-3'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='numero'
                className='text-sm font-semibold text-[#02082C] flex items-center gap-1.5'
              >
                <CreditCard className='h-4 w-4 text-[#F34602]' />
                Número de Tarjeta
              </Label>
              <Input
                id='numero'
                type='text'
                placeholder='Ingresa el número de tarjeta'
                {...register('numero', {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  },
                })}
                className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-9 text-sm'
                disabled={isLoading}
              />
              {errors.numero && (
                <p className='text-xs text-red-600'>{errors.numero.message}</p>
              )}
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='companyId'
                className='text-sm font-semibold text-[#02082C] flex items-center gap-1.5'
              >
                <Building2 className='h-4 w-4 text-[#F34602]' />
                Empresa
              </Label>
              <Select
                id='companyId'
                {...register('companyId')}
                className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-9 text-sm'
                disabled={isLoading}
              >
                <option value=''>Selecciona una empresa</option>
                {companies.map(company => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </Select>
              {errors.companyId && (
                <p className='text-xs text-red-600'>
                  {errors.companyId.message}
                </p>
              )}
            </div>

            <DialogFooter className='flex-row gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isLoading}
                className='cursor-pointer text-sm h-9'
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={isLoading}
                className='bg-[#F34602] hover:bg-[#d93d02] text-white cursor-pointer text-sm h-9'
              >
                {isLoading ? (
                  <span className='flex items-center justify-center gap-1.5'>
                    <div className='h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Creando...
                  </span>
                ) : (
                  'Crear Tarjeta'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCardDialog;

