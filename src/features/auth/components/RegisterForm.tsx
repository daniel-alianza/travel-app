import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  UserPlus,
  Mail,
  Lock,
  Building2,
  User,
  Building,
  MapPin,
  Briefcase,
  Users,
  LogIn,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { RegisterFormProps } from '../interfaces/RegisterFormProps';
import type { RegisterFormData } from '../interfaces/RegisterFormData';
import type { UseFormRegister, RegisterOptions } from 'react-hook-form';

interface FieldConfig {
  name: keyof RegisterFormData;
  label: string;
  icon: LucideIcon;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  validation: RegisterOptions<RegisterFormData, keyof RegisterFormData>;
  customValidation?: (value: string, password?: string) => string | boolean;
}

interface SelectFieldConfig {
  name: keyof RegisterFormData;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  options: { value: string; label: string }[];
  validation: RegisterOptions<RegisterFormData, keyof RegisterFormData>;
}

interface FormFieldProps {
  config: FieldConfig;
  register: UseFormRegister<RegisterFormData>;
  error: string | undefined;
  password?: string;
}

interface FormSelectFieldProps {
  config: SelectFieldConfig;
  register: UseFormRegister<RegisterFormData>;
  error: string | undefined;
}

const FormField = ({ config, register, error, password }: FormFieldProps) => {
  const Icon = config.icon;

  const getValidation = (): RegisterOptions<
    RegisterFormData,
    keyof RegisterFormData
  > => {
    if (!config.customValidation) {
      return config.validation;
    }

    return {
      ...config.validation,
      validate: (value: string) => {
        const customResult = config.customValidation!(value, password);
        return typeof customResult === 'string' ? customResult : true;
      },
    };
  };

  return (
    <div className='space-y-2'>
      <label
        htmlFor={config.name}
        className='text-sm font-semibold text-foreground flex items-center gap-2'
      >
        <Icon className='h-4 w-4 text-primary' />
        {config.label}
      </label>
      <Input
        id={config.name}
        type={config.type}
        placeholder={config.placeholder}
        className={`h-12 pl-4 pr-4 text-base transition-all ${
          error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'focus-visible:ring-primary'
        }`}
        {...register(config.name, getValidation())}
      />
      {error && <p className='text-sm text-destructive font-medium'>{error}</p>}
    </div>
  );
};

const FormSelectField = ({ config, register, error }: FormSelectFieldProps) => {
  const Icon = config.icon;

  return (
    <div className='space-y-2'>
      <label
        htmlFor={config.name}
        className='text-sm font-semibold text-foreground flex items-center gap-2'
      >
        <Icon className='h-4 w-4 text-primary' />
        {config.label}
      </label>
      <Select
        id={config.name}
        className={`h-12 text-base transition-all ${
          error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'focus-visible:ring-primary'
        }`}
        {...register(config.name, config.validation)}
      >
        <option value=''>{config.placeholder}</option>
        {config.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <p className='text-sm text-destructive font-medium'>{error}</p>}
    </div>
  );
};

const RegisterForm = ({
  register,
  errors,
  isLoading,
  password,
  onSubmit,
}: RegisterFormProps) => {
  const navigate = useNavigate();

  const inputFields: FieldConfig[] = [
    {
      name: 'nombres',
      label: 'Nombre(s)',
      icon: User,
      type: 'text',
      placeholder: 'Ingresa tu(s) nombre(s)',
      validation: { required: 'El nombre es requerido' },
    },
    {
      name: 'apellidoPaterno',
      label: 'Apellido Paterno',
      icon: User,
      type: 'text',
      placeholder: 'Ingresa tu apellido paterno',
      validation: { required: 'El apellido paterno es requerido' },
    },
    {
      name: 'apellidoMaterno',
      label: 'Apellido Materno',
      icon: User,
      type: 'text',
      placeholder: 'Ingresa tu apellido materno',
      validation: { required: 'El apellido materno es requerido' },
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      icon: Mail,
      type: 'email',
      placeholder: 'correo@ejemplo.com',
      validation: {
        required: 'El correo electrónico es requerido',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Correo electrónico inválido',
        },
      },
    },
    {
      name: 'password',
      label: 'Contraseña',
      icon: Lock,
      type: 'password',
      placeholder: '••••••••',
      validation: {
        required: 'La contraseña es requerida',
        minLength: {
          value: 8,
          message: 'La contraseña debe tener al menos 8 caracteres',
        },
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Contraseña',
      icon: Lock,
      type: 'password',
      placeholder: '••••••••',
      validation: { required: 'Debes confirmar tu contraseña' },
      customValidation: value =>
        value === password || 'Las contraseñas no coinciden',
    },
  ];

  const selectFields: SelectFieldConfig[] = [
    {
      name: 'company',
      label: 'Company',
      icon: Building,
      placeholder: 'Selecciona una compañía',
      options: [
        { value: 'fg1', label: 'FG 1' },
        { value: 'fg2', label: 'FG 2' },
        { value: 'fg3', label: 'FG 3' },
      ],
      validation: { required: 'La compañía es requerida' },
    },
    {
      name: 'sucursal',
      label: 'Sucursal',
      icon: MapPin,
      placeholder: 'Selecciona una sucursal',
      options: [
        { value: 'sucursal1', label: 'Sucursal 1' },
        { value: 'sucursal2', label: 'Sucursal 2' },
        { value: 'sucursal3', label: 'Sucursal 3' },
      ],
      validation: { required: 'La sucursal es requerida' },
    },
    {
      name: 'area',
      label: 'Área',
      icon: Briefcase,
      placeholder: 'Selecciona un área',
      options: [
        { value: 'ventas', label: 'Ventas' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'rh', label: 'Recursos Humanos' },
        { value: 'finanzas', label: 'Finanzas' },
        { value: 'operaciones', label: 'Operaciones' },
      ],
      validation: { required: 'El área es requerida' },
    },
    {
      name: 'reportaA',
      label: 'A quién reportas',
      icon: Users,
      placeholder: 'Selecciona una opción',
      options: [
        { value: 'gerente1', label: 'Gerente General' },
        { value: 'gerente2', label: 'Gerente de Operaciones' },
        { value: 'gerente3', label: 'Gerente de Ventas' },
        { value: 'director1', label: 'Director de Marketing' },
      ],
      validation: { required: 'Debes seleccionar a quién reportas' },
    },
  ];

  const renderFieldGroup = (fields: (FieldConfig | SelectFieldConfig)[]) => {
    return fields.map(field => {
      if ('type' in field) {
        return (
          <FormField
            key={field.name}
            config={field}
            register={register}
            error={errors[field.name]?.message}
            password={password}
          />
        );
      }
      return (
        <FormSelectField
          key={field.name}
          config={field}
          register={register}
          error={errors[field.name]?.message}
        />
      );
    });
  };

  const fieldGroups = [
    [inputFields[0], inputFields[1]],
    [inputFields[2], inputFields[3]],
    [inputFields[4], inputFields[5]],
    [selectFields[0], selectFields[1]],
    [selectFields[2], selectFields[3]],
  ];

  return (
    <div className='flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-background via-background to-primary/5 overflow-y-auto'>
      <div className='w-full max-w-5xl py-4'>
        <div className='lg:hidden mb-4 text-center'>
          <div className='inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-orange mb-2 shadow-lg'>
            <Building2 className='h-6 w-6 text-white' />
          </div>
          <h1 className='text-xl font-bold text-foreground mb-1'>
            Portal Grupo FG
          </h1>
          <p className='text-xs text-muted-foreground'>Sistema de Viáticos</p>
        </div>

        <Card className='border-0 shadow-2xl bg-card/95 backdrop-blur-sm'>
          <CardContent className='p-6 sm:p-8'>
            <div className='mb-6'>
              <h2 className='text-3xl font-bold text-foreground mb-2'>
                Crear Cuenta
              </h2>
              <p className='text-muted-foreground'>
                Completa el formulario para registrarte
              </p>
            </div>

            <form onSubmit={onSubmit} className='space-y-5'>
              {fieldGroups.map((group, index) => (
                <div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-2 gap-5'
                >
                  {renderFieldGroup(group)}
                </div>
              ))}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 pt-2'>
                <Button
                  type='submit'
                  className='w-full h-12 gradient-orange text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98]'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Creando cuenta...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2'>
                      <UserPlus className='h-5 w-5' />
                      Crear Cuenta
                    </span>
                  )}
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  className='w-full h-12 border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98]'
                  onClick={() => navigate('/login')}
                >
                  <span className='flex items-center justify-center gap-2'>
                    <LogIn className='h-5 w-5' />
                    Ya tengo cuenta
                  </span>
                </Button>
              </div>
            </form>

            <div className='mt-6 pt-6 border-t border-border'>
              <p className='text-xs text-center text-muted-foreground'>
                Al registrarte, aceptas nuestros términos y condiciones de uso
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
