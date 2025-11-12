import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { RegisterFormData } from './RegisterFormData';

export interface RegisterFormProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  isLoading: boolean;
  password: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}
