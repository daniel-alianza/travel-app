import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { LoginFormData } from '../interfaces/LoginFormData';
import authService from '../services/authService';

const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const submitForm = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await authService.login(data);
      // El token se guardará automáticamente en cookies mediante interceptores
      // Por ahora temporal hasta que el backend esté listo
      localStorage.setItem('token', 'mock-token-123');
      navigate('/home');
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(submitForm);

  return {
    register,
    onSubmit,
    errors,
    isLoading,
  };
};

export default useLogin;

