import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { RegisterFormData } from './authApiInterfaces';

export interface RegisterFormProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  isLoading: boolean;
  password?: string;
  error?: string | null;
  isSuccess?: boolean;
  handleSuccessClose?: () => void;
  watch: UseFormWatch<RegisterFormData>;
  setValue: UseFormSetValue<RegisterFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}
