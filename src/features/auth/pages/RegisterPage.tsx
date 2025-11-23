import { AuthBranding } from '../components/AuthBranding';
import { RegisterForm } from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';

export const RegisterPage = () => {
  const {
    register,
    onSubmit,
    errors,
    isLoading,
    password,
    error,
    isSuccess,
    handleSuccessClose,
    watch,
    setValue,
  } = useRegister();

  return (
    <div className='min-h-screen flex'>
      <AuthBranding />
      <RegisterForm
        register={register}
        errors={errors}
        isLoading={isLoading}
        password={password}
        error={error}
        isSuccess={isSuccess}
        handleSuccessClose={handleSuccessClose}
        watch={watch}
        setValue={setValue}
        onSubmit={onSubmit}
      />
    </div>
  );
};
