import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LoginFormData } from './authApiInterfaces';

export interface LoginFormProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}
