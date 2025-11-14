export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface TravelRequestExpenses {
  transporte: number;
  peajes: number;
  hospedaje: number;
  alimentos: number;
  fletes: number;
  herramientas: number;
  enviosMensajeria: number;
  miscelaneos: number;
}

export interface TravelRequest {
  id: number;
  employee: string;
  position: string;
  company: string;
  reason: string;
  startDate: string;
  endDate: string;
  objectives: string[];
  status: RequestStatus;
  dispersed: boolean;
  expenses: TravelRequestExpenses;
}

export interface RecentRequest {
  id: number;
  destination: string;
  date: string;
  amount: string;
  status: RequestStatus;
}

export interface ApprovalRequestsFilters {
  searchTerm: string;
  companyFilter: string;
  statusFilter: string;
  showDispersed: boolean;
}

export interface ApprovalRequestsResponse {
  success: boolean;
  message?: string;
  data?: TravelRequest[];
}

export interface ApproveRejectRequestResponse {
  success: boolean;
  message?: string;
  data?: TravelRequest;
}

