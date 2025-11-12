import RegisterBranding from '../components/RegisterBranding';
import RegisterForm from '../components/RegisterForm';
import useRegister from '../hooks/useRegister';

const RegisterPage = () => {
  const { register, onSubmit, errors, isLoading, password } = useRegister();

  return (
    <div className='min-h-screen flex'>
      <RegisterBranding />
      <RegisterForm
        register={register}
        errors={errors}
        isLoading={isLoading}
        password={password}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default RegisterPage;
