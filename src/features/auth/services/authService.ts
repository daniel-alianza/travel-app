// import travelApi from '@/api/travel-api';
import type { LoginFormData } from '../interfaces/LoginFormData';
import type { RegisterFormData } from '../interfaces/RegisterFormData';

interface AuthResponse {
  success: boolean;
  message?: string;
}

const login = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    // TODO: Implementar lógica de autenticación real con API
    // Por ahora simulamos la autenticación
    console.log('Login data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Cuando esté listo el backend, descomentar y usar:
    // const response = await travelApi.post('/auth/login', data);
    // return response.data;
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  try {
    // TODO: Implementar lógica de registro real con API
    // Por ahora simulamos el registro
    console.log('Register data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Cuando esté listo el backend, descomentar y usar:
    // const response = await travelApi.post('/auth/register', data);
    // return response.data;
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

const authService = {
  login,
  register,
};

export default authService;

