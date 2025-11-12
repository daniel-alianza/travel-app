import type { UseFormRegister } from 'react-hook-form';
import type { LoginFormData } from '../interfaces/LoginFormData';

export interface LoginFormProps {
  register: UseFormRegister<LoginFormData>;
  errors: {
    email?: {
      message?: string;
      type?: string;
    };
    password?: {
      message?: string;
      type?: string;
    };
  };
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}
