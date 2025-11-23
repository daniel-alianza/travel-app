import { AuthBranding } from '../components/AuthBranding';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

export const LoginPage = () => {
  const { register, onSubmit, errors, isLoading, error } = useLogin();

  return (
    <div className='min-h-screen flex'>
      <AuthBranding />
      <LoginForm
        register={register}
        errors={errors}
        isLoading={isLoading}
        error={error}
        onSubmit={onSubmit}
      />
    </div>
  );
};
