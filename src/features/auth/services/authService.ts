import { travelApi } from '@/infrastructure/http/axiosInstance';
import { setAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import axios from 'axios';
import type {
  AuthResponse,
  CreateUserPayload,
  LoginFormData,
  LogoutResponse,
  RegisterFormData,
  UserResponse,
  ValidateSessionResponse,
} from '../interfaces/authApiInterfaces';

const login = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await travelApi.post<{
      data: { accessToken: string };
      message: string;
      error: null;
    }>('/auth/login', {
      email: data.email,
      password: data.password,
    });

    if (response.data.data.accessToken) {
      setAccessToken(response.data.data.accessToken);
    }

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  try {
    const payload: CreateUserPayload = {
      name: data.name,
      paternalSurname: data.paternalSurname,
      maternalSurname: data.maternalSurname,
      email: data.email,
      password: data.password,
      companyId: Number(data.companyId),
      branchId: Number(data.branchId),
      areaId: Number(data.areaId),
      roleId: 1,
      supervisorId: data.supervisorId ? Number(data.supervisorId) : undefined,
    };

    const response = await travelApi.post<UserResponse>('/users', payload);

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await travelApi.post<LogoutResponse>('/auth/logout');
    setAccessToken(null);

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error en logout:', error);
    setAccessToken(null);
    throw error;
  }
};

const validateSession = async (): Promise<boolean> => {
  try {
    const response = await axios.post<ValidateSessionResponse>(
      `${import.meta.env.VITE_TRAVEL_API}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );

    if (response.data?.data?.accessToken) {
      setAccessToken(response.data.data.accessToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error validando sesión:', error);
    setAccessToken(null);
    return false;
  }
};

export const authService = {
  login,
  register,
  logout,
  validateSession,
};
