import type {
  TravelRequest,
  ApprovalRequestsResponse,
  ApproveRejectRequestResponse,
} from '../interfaces';

const getApprovalRequests = async (): Promise<ApprovalRequestsResponse> => {
  // TODO: Implementar lógica real con API cuando el backend esté listo
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Solicitudes obtenidas exitosamente',
  };
};

const approveRequest = async (
  id: number,
): Promise<ApproveRejectRequestResponse> => {
  // TODO: Implementar lógica real con API cuando el backend esté listo
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Solicitud aprobada exitosamente',
  };
};

const rejectRequest = async (
  id: number,
): Promise<ApproveRejectRequestResponse> => {
  // TODO: Implementar lógica real con API cuando el backend esté listo
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Solicitud rechazada exitosamente',
  };
};

const travelRequestReviewService = {
  getApprovalRequests,
  approveRequest,
  rejectRequest,
};

export default travelRequestReviewService;
