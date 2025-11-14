import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';
import type {
  TravelRequestFormData,
  EstimatedExpensesCardProps,
} from '../interfaces';
import { expenseCategories } from '../interfaces';

const EstimatedExpensesCard = ({
  register,
  calculateTotal,
}: EstimatedExpensesCardProps) => {
  return (
    <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
      <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
        <div className='absolute -top-12 left-6'>
          <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
            <DollarSign className='h-9 w-9 text-white' />
          </div>
        </div>
        <CardTitle className='pl-28 text-2xl text-[#02082C] font-semibold'>
          Gastos Estimados
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-8 pb-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
          {expenseCategories.map(category => (
            <div key={category.value} className='space-y-2'>
              <Label
                htmlFor={category.value}
                className='text-sm font-semibold text-[#02082C]'
              >
                {category.label}
              </Label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium'>
                  $
                </span>
                <Input
                  id={category.value}
                  type='number'
                  step='0.01'
                  placeholder='0.00'
                  {...register(
                    `expenses.${category.value}` as `expenses.${keyof TravelRequestFormData['expenses']}`,
                  )}
                  className='pl-8 border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
                />
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-2 border-gray-200 bg-gradient-to-r from-[#FFF5F0] to-transparent -mx-8 px-8 py-6 rounded-b-2xl'>
          <span className='text-xl font-semibold text-[#02082C]'>
            Total Estimado:
          </span>
          <div className='text-4xl font-bold text-[#F34602] tracking-tight'>
            ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimatedExpensesCard;
