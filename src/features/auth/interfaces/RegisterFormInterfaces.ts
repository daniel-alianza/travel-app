import type { LucideIcon } from 'lucide-react';
import type { UseFormRegister, RegisterOptions } from 'react-hook-form';
import type { RegisterFormData } from './authApiInterfaces';

export interface FieldConfig {
  name: keyof RegisterFormData;
  label: string;
  icon: LucideIcon;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  validation: RegisterOptions<RegisterFormData, keyof RegisterFormData>;
  customValidation?: (
    value: string | undefined,
    password?: string,
  ) => string | boolean;
}

export interface SelectFieldConfig {
  name: keyof RegisterFormData;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  options: { value: string; label: string }[];
  validation: RegisterOptions<RegisterFormData, keyof RegisterFormData>;
}

export interface FormFieldProps {
  config: FieldConfig;
  register: UseFormRegister<RegisterFormData>;
  error: string | undefined;
  password?: string;
}

export interface FormSelectFieldProps {
  config: SelectFieldConfig;
  register: UseFormRegister<RegisterFormData>;
  error: string | undefined;
  selectedCompany?: string;
  isLoadingBranches?: boolean;
}
