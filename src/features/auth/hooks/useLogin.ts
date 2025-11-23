import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import type { LoginFormData } from '../interfaces/authApiInterfaces';
import { authService } from '../services/authService';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>();

  const submitForm = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(data);
      navigate('/home');
    } catch (error) {
      console.error('Error en login:', error);

      let errorMessage =
        'Error al iniciar sesión. Por favor, intenta nuevamente.';

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      const errorMessageLower = errorMessage.toLowerCase();

      if (
        errorMessageLower.includes('email') ||
        errorMessageLower.includes('correo')
      ) {
        setFormError('email', { type: 'server', message: errorMessage });
      } else if (
        errorMessageLower.includes('contraseña') ||
        errorMessageLower.includes('password')
      ) {
        setFormError('password', { type: 'server', message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    onSubmit: handleSubmit(submitForm),
    errors,
    isLoading,
    error,
  };
};
