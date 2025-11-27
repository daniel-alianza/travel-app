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
  createdAt?: string | Date;
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
  minAmount: string;
  maxAmount: string;
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

export interface Company {
  id: number;
  name: string;
}

export interface CompaniesResponse {
  success: boolean;
  message: string;
  data: Company[];
}

export interface TravelRequestsResponse {
  success: boolean;
  message: string;
  data: TravelRequest[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
    currentPage: number;
  };
}

// Interfaz para los datos que retorna el backend
export interface BackendTravelRequest {
  id: number;
  userId: number;
  statusId: number;
  cardId: number;
  totalAmount: number;
  travelReason: string;
  travelObjectives: string;
  departureDate: string | Date;
  returnDate: string | Date;
  disbursementDate: string | Date | null;
  approvalDate: string | Date | null;
  approverId: number | null;
  comment: string | null;
  user: {
    id: number;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    email: string;
  };
  status: {
    id: number;
    name: string;
  };
  approver: {
    id: number;
    name: string;
    email: string;
  } | null;
  card: {
    id: number;
    cardNumber: string;
  };
  details: Array<{
    id: number;
    travelRequestId: number;
    concept: string;
    amount: number;
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
}
