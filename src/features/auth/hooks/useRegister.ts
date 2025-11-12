import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { RegisterFormData } from '../interfaces/RegisterFormData';
import authService from '../services/authService';

const useRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const submitForm = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      // El token se guardará automáticamente en cookies mediante interceptores
      // Por ahora temporal hasta que el backend esté listo
      localStorage.setItem('token', 'mock-token-123');
      navigate('/home');
    } catch (error) {
      console.error('Error en registro:', error);
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
    password,
  };
};

export default useRegister;

