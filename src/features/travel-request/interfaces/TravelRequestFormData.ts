import type { FieldArrayWithId, UseFormRegister } from 'react-hook-form';

export interface TravelRequestFormData {
  empresa: string;
  sucursal: string;
  area: string;
  tarjeta: string;
  motivo: string;
  fechaSalida: string;
  fechaRegreso: string;
  fechaDispersion: string;
  expenses: {
    transporte: string;
    peajes: string;
    hospedaje: string;
    alimentos: string;
    fletes: string;
    herramientas: string;
    envios: string;
    miscelaneos: string;
  };
  objectives: { value: string }[];
}

export interface TravelRequestResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface BaseCardProps {
  register: UseFormRegister<TravelRequestFormData>;
}

export interface EstimatedExpensesCardProps extends BaseCardProps {
  calculateTotal: () => number;
}

export interface ObjectivesCardProps extends BaseCardProps {
  fields: FieldArrayWithId<TravelRequestFormData, 'objectives'>[];
  addObjective: () => void;
  removeObjective: (index: number) => void;
}

export interface ExpenseCategory {
  label: string;
  value: string;
}

export const expenseCategories: ExpenseCategory[] = [
  { label: 'Transporte', value: 'transporte' },
  { label: 'Peajes', value: 'peajes' },
  { label: 'Hospedaje', value: 'hospedaje' },
  { label: 'Alimentos', value: 'alimentos' },
  { label: 'Fletes', value: 'fletes' },
  { label: 'Herramientas', value: 'herramientas' },
  { label: 'Envíos/Mensajería', value: 'envios' },
  { label: 'Misceláneos', value: 'miscelaneos' },
];
