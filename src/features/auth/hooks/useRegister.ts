import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import type { RegisterFormData } from '../interfaces/authApiInterfaces';
import { authService } from '../services/authService';

export const useRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const submitForm = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      await authService.register(data);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error en registro:', error);

      let errorMessage =
        'Error al registrar usuario. Por favor, intenta nuevamente.';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          errorMessage = 'El usuario ya está registrado. Por favor, inicia sesión.';
        } else {
          errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    navigate('/login');
  };

  return {
    register,
    onSubmit: handleSubmit(submitForm),
    errors,
    isLoading,
    password,
    error,
    isSuccess,
    handleSuccessClose,
    watch,
    setValue,
  };
};

