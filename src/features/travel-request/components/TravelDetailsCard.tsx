import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Calendar } from 'lucide-react';
import type { BaseCardProps } from '../interfaces';

const TravelDetailsCard = ({ register }: BaseCardProps) => {
  const dateFields = [
    { id: 'fechaSalida', label: 'Fecha de Salida' },
    { id: 'fechaRegreso', label: 'Fecha de Regreso' },
    { id: 'fechaDispersion', label: 'Fecha de Dispersión' },
  ] as const;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
        <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
          <div className='absolute -top-12 left-6'>
            <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
              <Briefcase className='h-9 w-9 text-white' />
            </div>
          </div>
          <CardTitle className='pl-28 text-2xl text-[#02082C] font-semibold'>
            Motivo del Viaje
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-8 pb-8'>
          <Textarea
            placeholder='Describa detalladamente el propósito de su viaje...'
            {...register('motivo')}
            className='min-h-[160px] border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all resize-none rounded-lg'
          />
        </CardContent>
      </Card>

      <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
        <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
          <div className='absolute -top-12 left-6'>
            <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
              <Calendar className='h-9 w-9 text-white' />
            </div>
          </div>
          <CardTitle className='pl-28 text-2xl text-[#02082C] font-semibold'>
            Fechas del Viaje
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-8 pb-8'>
          <div className='space-y-5'>
            {dateFields.map(({ id, label }) => (
              <div key={id} className='space-y-2'>
                <Label
                  htmlFor={id}
                  className='text-sm font-semibold text-[#02082C]'
                >
                  {label}
                </Label>
                <Input
                  id={id}
                  type='date'
                  {...register(id)}
                  className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelDetailsCard;
