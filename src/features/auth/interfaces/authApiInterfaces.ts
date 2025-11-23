export interface Company {
  id: number;
  name: string;
}

export interface CompaniesResponse {
  success: boolean;
  message: string;
  data: Company[];
}

export interface Branch {
  id: number;
  name: string;
  companyId: number;
}

export interface BranchesResponse {
  success: boolean;
  message: string;
  data: Branch[];
}

export interface Area {
  id: number;
  name: string;
}

export interface AreasResponse {
  success: boolean;
  message: string;
  data: Area[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

export interface CreateUserPayload {
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  password: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
  supervisorId?: number;
}

export interface RegisterFormData {
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyId: string;
  branchId: string;
  areaId: string;
  supervisorId?: string;
}

export interface UserResponse {
  data: unknown;
  message: string;
  error: null;
}

export interface LogoutResponse {
  data: null;
  message: string;
  error: null;
}

export interface ValidateSessionResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}
