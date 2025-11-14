import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import useTravelRequestForm from '../hooks/useTravelRequestForm';
import CompanyInfoCard from './CompanyInfoCard';
import TravelDetailsCard from './TravelDetailsCard';
import EstimatedExpensesCard from './EstimatedExpensesCard';
import ObjectivesCard from './ObjectivesCard';

const TravelRequestForm = () => {
  const {
    register,
    onSubmit,
    fields,
    addObjective,
    removeObjective,
    calculateTotal,
    isLoading,
  } = useTravelRequestForm();

  return (
    <form onSubmit={onSubmit} className='space-y-8'>
      <CompanyInfoCard register={register} />

      <TravelDetailsCard register={register} />

      <EstimatedExpensesCard
        register={register}
        calculateTotal={calculateTotal}
      />

      <ObjectivesCard
        fields={fields}
        register={register}
        addObjective={addObjective}
        removeObjective={removeObjective}
      />

      <div className='flex justify-center pt-6'>
        <Button
          type='submit'
          size='lg'
          disabled={isLoading}
          className='bg-gradient-to-r from-[#F34602] to-[#d93d02] hover:from-[#d93d02] hover:to-[#c23602] text-white px-16 py-7 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl disabled:opacity-50'
        >
          <Send className='h-6 w-6 mr-3' />
          {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </div>
    </form>
  );
};

export default TravelRequestForm;
