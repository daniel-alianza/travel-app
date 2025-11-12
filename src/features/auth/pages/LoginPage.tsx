import LoginBranding from '../components/LoginBranding';
import LoginForm from '../components/LoginForm';
import useLogin from '../hooks/useLogin';

const LoginPage = () => {
  const { register, onSubmit, errors, isLoading } = useLogin();

  return (
    <div className='min-h-screen flex'>
      <LoginBranding />
      <LoginForm
        register={register}
        errors={errors}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default LoginPage;
