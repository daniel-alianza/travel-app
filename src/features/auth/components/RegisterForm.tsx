import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { UserPlus, Building2, LogIn, Loader2 } from 'lucide-react';
import type { RegisterFormProps } from '../interfaces/RegisterFormProps';
import type {
  FormFieldProps,
  FormSelectFieldProps,
} from '../interfaces/RegisterFormInterfaces';
import type { RegisterFormData } from '../interfaces/authApiInterfaces';
import type { RegisterOptions } from 'react-hook-form';
import { useRegisterFormFields } from '../hooks/useRegisterFormFields';
import { RegisterSuccessDialog } from './RegisterSuccessDialog';

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
      validate: (value: string | undefined) => {
        if (!value) return true;
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

const FormSelectField = ({
  config,
  register,
  error,
  selectedCompany,
  isLoadingBranches,
}: FormSelectFieldProps) => {
  const Icon = config.icon;
  // Campo siempre habilitado
  const isDisabled = false;

  const selectOptions =
    config.options.length > 0
      ? [{ value: '', label: config.placeholder }, ...config.options]
      : config.options;

  return (
    <div className='space-y-2'>
      <label
        htmlFor={config.name}
        className='text-sm font-semibold text-foreground flex items-center gap-2'
      >
        <Icon className='h-4 w-4 text-primary' />
        {config.label}
      </label>
      <div className='relative'>
        <Select
          id={config.name}
          disabled={isDisabled}
          className={`h-12 text-base transition-all ${
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'focus-visible:ring-primary'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={config.placeholder}
          options={selectOptions}
          {...register(config.name, config.validation)}
        />
        {config.name === 'branchId' &&
          config.options.length === 0 &&
          selectedCompany &&
          isLoadingBranches && (
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
              <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
            </div>
          )}
      </div>
      {error && <p className='text-sm text-destructive font-medium'>{error}</p>}
    </div>
  );
};

export const RegisterForm = ({
  register,
  errors,
  isLoading,
  password,
  error: submitError,
  isSuccess,
  handleSuccessClose,
  watch,
  setValue,
  onSubmit,
}: RegisterFormProps) => {
  const navigate = useNavigate();

  const { fieldGroups, selectedCompany, isLoadingBranches } =
    useRegisterFormFields({
      watch,
      setValue,
      password,
    });

  const renderFieldGroup = (
    fields: (FormFieldProps['config'] | FormSelectFieldProps['config'])[],
  ) => {
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
          selectedCompany={selectedCompany}
          isLoadingBranches={isLoadingBranches}
        />
      );
    });
  };

  return (
    <>
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

              {submitError && (
                <div className='mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
                  <p className='text-sm text-destructive font-medium'>
                    {submitError}
                  </p>
                </div>
              )}

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
                        <Loader2 className='h-5 w-5 animate-spin' />
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
                    disabled={isLoading}
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

      {isSuccess && handleSuccessClose && (
        <RegisterSuccessDialog
          open={isSuccess}
          onOpenChange={open => {
            if (!open) {
              handleSuccessClose();
            }
          }}
          onConfirm={handleSuccessClose}
        />
      )}
    </>
  );
};
