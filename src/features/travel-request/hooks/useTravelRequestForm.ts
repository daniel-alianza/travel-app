import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { TravelRequestFormData } from '../interfaces';
import travelRequestService from '../services/travelRequestService';

const defaultValues: TravelRequestFormData = {
  empresa: '',
  sucursal: '',
  area: '',
  tarjeta: '',
  motivo: '',
  fechaSalida: '',
  fechaRegreso: '',
  fechaDispersion: '',
  expenses: {
    transporte: '',
    peajes: '',
    hospedaje: '',
    alimentos: '',
    fletes: '',
    herramientas: '',
    envios: '',
    miscelaneos: '',
  },
  objectives: [{ value: '' }, { value: '' }, { value: '' }],
};

const useTravelRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, control } = useForm<TravelRequestFormData>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'objectives' });
  const expenses = watch('expenses');

  const addObjective = () => fields.length < 5 && append({ value: '' });
  const removeObjective = (index: number) => fields.length > 3 && remove(index);
  const calculateTotal = () => Object.values(expenses).reduce((sum, val) => sum + (Number.parseFloat(val) || 0), 0);

  const submitForm = async (data: TravelRequestFormData) => {
    setIsLoading(true);
    try {
      await travelRequestService.createTravelRequest(data);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    onSubmit: handleSubmit(submitForm),
    fields,
    addObjective,
    removeObjective,
    calculateTotal,
    isLoading,
  };
};

export default useTravelRequestForm;
