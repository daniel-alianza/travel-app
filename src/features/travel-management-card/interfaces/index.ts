export interface Card {
  id: string;
  numero: string;
  banco: string;
  fechaVencimiento: string;
  limiteCredito: number;
  saldoDisponible: number;
  estado: 'activa' | 'desactivada';
  fechaAsignacion: string;
  fechaDesactivacion?: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  compania: string;
  activo: boolean;
  tarjetas: Card[];
}

export interface CardAssignmentFormData {
  tarjetaId: string;
  usuarioId: string;
  fechaAsignacion: string;
}

export interface CardAssignmentResponse {
  success: boolean;
  message?: string;
}

