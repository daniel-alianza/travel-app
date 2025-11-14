import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Target, Plus, X } from 'lucide-react';
import type { ObjectivesCardProps } from '../interfaces';

const ObjectivesCard = ({
  fields,
  register,
  addObjective,
  removeObjective,
}: ObjectivesCardProps) => {
  return (
    <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
      <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
        <div className='absolute -top-12 left-6'>
          <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
            <Target className='h-9 w-9 text-white' />
          </div>
        </div>
        <CardTitle className='flex items-center justify-between pl-28 text-2xl flex-wrap gap-4'>
          <span className='text-[#02082C] font-semibold'>
            Objetivos del Viaje
          </span>
          {fields.length < 5 && (
            <Button
              type='button'
              onClick={addObjective}
              size='sm'
              variant='outline'
              className='border-2 border-[#F34602] text-[#F34602] hover:bg-[#F34602] hover:text-white bg-transparent transition-all duration-300 rounded-lg font-semibold'
            >
              <Plus className='h-4 w-4 mr-1' />
              Agregar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-8 pb-8'>
        <div className='space-y-5'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex gap-3 items-start'>
              <div className='flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#F34602] to-[#d93d02] text-white flex items-center justify-center font-bold mt-1 shadow-md'>
                {index + 1}
              </div>
              <Input
                placeholder={`Escriba el objetivo ${index + 1}...`}
                {...register(`objectives.${index}.value`)}
                className='flex-1 border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
              />
              {fields.length > 3 && (
                <Button
                  type='button'
                  onClick={() => removeObjective(index)}
                  size='icon'
                  variant='ghost'
                  className='flex-shrink-0 text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 rounded-lg'
                >
                  <X className='h-5 w-5' />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className='text-sm text-gray-600 mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200'>
          Mínimo 3 y máximo 5 objetivos. Use el botón + para agregar más
          objetivos.
        </p>
      </CardContent>
    </Card>
  );
};

export default ObjectivesCard;
